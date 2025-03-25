// client.js

// --- Basic Three.js Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue background

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true; // Enable shadows if desired (more complex)
scene.add(directionalLight);

// --- Ground ---
const groundGeometry = new THREE.PlaneGeometry(2000, 2000); // Large ground plane
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22, side: THREE.DoubleSide }); // Forest green
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
ground.position.y = 0;
// ground.receiveShadow = true; // Enable shadows if desired
scene.add(ground);

// --- Player Setup ---
let playerId = null; // Will be assigned by the server
const player = createAirplaneMesh(); // Our own plane mesh
player.position.y = 5; // Start slightly above ground
scene.add(player);

// Player physics/movement state
const playerState = {
    speed: 0.0,
    maxSpeed: 1.5,
    minSpeed: 0.05,
    acceleration: 0.01,
    rollSpeed: 0.03,
    pitchSpeed: 0.02,
    yawSpeed: 0.015,
    velocity: new THREE.Vector3(),
    rotationVelocity: new THREE.Vector3(), // x: pitch, y: yaw, z: roll
    damping: 0.98 // Air resistance / friction
};

// --- Other Players ---
const otherPlayers = {}; // Store meshes and data for other players { id: { mesh: Mesh, state: {} } }

// --- Controls ---
const keys = {}; // Keep track of pressed keys
document.addEventListener('keydown', (event) => keys[event.key.toLowerCase()] = true);
document.addEventListener('keyup', (event) => keys[event.key.toLowerCase()] = false);

// --- Camera Offset ---
const cameraOffset = new THREE.Vector3(0, 2, -6); // Behind and slightly above

// --- WebSocket Connection ---
// IMPORTANT: Replace 'ws://localhost:8080' with your actual server address
// If deploying, use wss://yourdomain.com for secure connections
const socket = new WebSocket('ws://localhost:8080'); // <<< CHANGE THIS

socket.onopen = () => {
    console.log('WebSocket connection established');
    // We don't send initial state here, server assigns default
};

socket.onerror = (error) => {
    console.error('WebSocket error:', error);
    document.getElementById('info').textContent = 'Error connecting to server!';
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
    document.getElementById('info').textContent = 'Disconnected from server.';
    // Optional: Try to reconnect or show a message
};

socket.onmessage = (event) => {
    try {
        const message = JSON.parse(event.data);
        // console.log('Message from server:', message); // For debugging

        switch (message.type) {
            case 'your_id':
                playerId = message.id;
                console.log('My Player ID:', playerId);
                break;

            case 'current_players':
                // Add existing players when we join
                Object.keys(message.players).forEach(id => {
                    if (id !== playerId && !otherPlayers[id]) {
                         addOtherPlayer(id, message.players[id]);
                    }
                });
                break;

            case 'player_joined':
                if (message.id !== playerId && !otherPlayers[message.id]) {
                    console.log(`Player joined: ${message.id}`);
                    addOtherPlayer(message.id, message.state);
                }
                break;

            case 'player_update':
                if (message.id !== playerId && otherPlayers[message.id]) {
                    // Directly apply the received state for smoother interpolation (could be improved)
                    otherPlayers[message.id].state = message.state;
                    otherPlayers[message.id].mesh.position.set(message.state.position.x, message.state.position.y, message.state.position.z);
                    otherPlayers[message.id].mesh.quaternion.set(message.state.quaternion._x, message.state.quaternion._y, message.state.quaternion._z, message.state.quaternion._w);
                 }
                break;

            case 'player_left':
                if (message.id !== playerId && otherPlayers[message.id]) {
                    console.log(`Player left: ${message.id}`);
                    removeOtherPlayer(message.id);
                }
                break;
        }
    } catch (error) {
        console.error('Failed to parse message or process:', event.data, error);
    }
};

// --- Helper Functions ---

function createAirplaneMesh() {
    // Simple composite shape for the airplane
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Grey
    const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd }); // Lighter Grey

    const group = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.4, 0.5);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    group.add(body);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.3, 0.1, 3); // Long thin wings
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(0, 0, -1.5); // Position relative to body center
    body.add(leftWing); // Add wings to the body

    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(0, 0, 1.5);
    body.add(rightWing);

    // Tail Fin (Vertical Stabilizer)
    const tailFinGeometry = new THREE.BoxGeometry(0.2, 0.5, 0.1);
    const tailFin = new THREE.Mesh(tailFinGeometry, wingMaterial);
    tailFin.position.set(-0.7, 0.3, 0); // Back and up
    body.add(tailFin);

     // Tail Wings (Horizontal Stabilizers)
    const tailWingGeometry = new THREE.BoxGeometry(0.2, 0.05, 0.8);
    const tailWing = new THREE.Mesh(tailWingGeometry, wingMaterial);
    tailWing.position.set(-0.7, 0.1, 0); // Back, slightly lower than fin
    body.add(tailWing);

    // Propeller (simple cylinder) - doesn't need to spin for now
    const propGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
    const propMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const propeller = new THREE.Mesh(propGeometry, propMaterial);
    propeller.rotation.z = Math.PI / 2; // Orient horizontally
    propeller.position.set(0.8, 0, 0); // Front of the body
    body.add(propeller);

    // Rotate the whole group so positive Z is forward (Three.js default)
    group.rotation.y = -Math.PI / 2;

    return group;
}


function addOtherPlayer(id, initialState) {
    if (otherPlayers[id]) return; // Already exists
    console.log(`Adding mesh for player ${id}`);
    const otherPlaneMesh = createAirplaneMesh();
    // Optional: Give other players a different color
    otherPlaneMesh.traverse((child) => {
        if (child.isMesh) {
             // Example: Make other planes red - adjust materials as needed
             child.material = child.material.clone(); // Clone to avoid affecting own plane
             if (child.material.color) child.material.color.setHex(0xff0000);
        }
    });

    // Set initial position and rotation from server data
    if (initialState && initialState.position && initialState.quaternion) {
        otherPlaneMesh.position.set(initialState.position.x, initialState.position.y, initialState.position.z);
        // Make sure quaternion properties are correctly named (_x or x, etc.) based on what server sends
        otherPlaneMesh.quaternion.set(initialState.quaternion._x || initialState.quaternion.x || 0,
                                      initialState.quaternion._y || initialState.quaternion.y || 0,
                                      initialState.quaternion._z || initialState.quaternion.z || 0,
                                      initialState.quaternion._w || initialState.quaternion.w || 1);
    } else {
        // Default position if no state provided (shouldn't happen with current server logic)
        otherPlaneMesh.position.y = 5;
    }

    otherPlayers[id] = { mesh: otherPlaneMesh, state: initialState || {} };
    scene.add(otherPlaneMesh);
}

function removeOtherPlayer(id) {
    if (otherPlayers[id]) {
        scene.remove(otherPlayers[id].mesh);
        // Dispose geometry/material if needed for memory management
        otherPlayers[id].mesh.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                // Dispose materials carefully if they are shared or cloned
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => mat.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        delete otherPlayers[id];
    }
}


function updatePlayer(deltaTime) {
    // --- Handle Controls ---
    let targetRoll = 0;
    let targetPitch = 0;
    let targetYaw = 0;
    let throttleChange = 0;

    // Throttle (Speed)
    if (keys['shift']) throttleChange += playerState.acceleration;
    if (keys['control']) throttleChange -= playerState.acceleration;

    // Roll (A/D keys)
    if (keys['a']) targetRoll += playerState.rollSpeed;
    if (keys['d']) targetRoll -= playerState.rollSpeed;

    // Pitch (W/S keys)
    if (keys['w']) targetPitch += playerState.pitchSpeed;
    if (keys['s']) targetPitch -= playerState.pitchSpeed;

    // Yaw (Q/E keys)
    if (keys['q']) targetYaw += playerState.yawSpeed;
    if (keys['e']) targetYaw -= playerState.yawSpeed;

    // Apply throttle change
    playerState.speed += throttleChange;
    playerState.speed = Math.max(playerState.minSpeed, Math.min(playerState.maxSpeed, playerState.speed));

    // Apply rotation changes using quaternions for stability
    const deltaRotation = new THREE.Quaternion();
    // IMPORTANT: Order matters. Apply Yaw, Pitch, Roll relative to the *plane's* current orientation
    const rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromQuaternion(player.quaternion);

    const yawAxis = new THREE.Vector3(0, 1, 0); // World Up
    const pitchAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotationMatrix).normalize(); // Plane's Right
    const rollAxis = new THREE.Vector3(0, 0, 1).applyMatrix4(rotationMatrix).normalize(); // Plane's Forward

    const yawQuat = new THREE.Quaternion().setFromAxisAngle(yawAxis, targetYaw * deltaTime * 60); // Scale by frame rate roughly
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(pitchAxis, targetPitch * deltaTime * 60);
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(rollAxis, targetRoll * deltaTime * 60);

    // Combine rotations (order might need tweaking depending on desired feel)
    player.quaternion.multiplyQuaternions(yawQuat, player.quaternion);
    player.quaternion.multiplyQuaternions(pitchQuat, player.quaternion);
    player.quaternion.multiplyQuaternions(rollQuat, player.quaternion);
    player.quaternion.normalize();


    // --- Update Velocity & Position ---
    // Get forward direction from the plane's quaternion
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(player.quaternion);
    playerState.velocity = forward.multiplyScalar(playerState.speed);

    // Apply damping (air resistance) to speed if no throttle input
    if(throttleChange === 0) {
         playerState.speed *= playerState.damping;
         if (playerState.speed < playerState.minSpeed) playerState.speed = playerState.minSpeed;
    }

    // Update position based on velocity and deltaTime
    player.position.addScaledVector(playerState.velocity, deltaTime * 60); // Scale velocity by framerate roughly

    // --- Collision / Ground check (Basic) ---
    if (player.position.y < 0.2) { // Adjust '0.2' based on plane model size
        player.position.y = 0.2;
        // Optional: Add bounce or crash effect
        playerState.speed *= 0.8; // Lose speed on hitting ground
    }
}

function updateCamera() {
    // Calculate desired camera position relative to the plane
    const desiredCameraPosition = player.position.clone().add(
        cameraOffset.clone().applyQuaternion(player.quaternion) // Apply plane's rotation to the offset
    );

    // Smoothly interpolate camera position (Lerp)
    camera.position.lerp(desiredCameraPosition, 0.1); // Adjust lerp factor (0.1 is quite smooth)

    // Make camera look at the plane (or slightly in front of it)
    const lookAtPosition = player.position.clone().add(new THREE.Vector3(0, 0.5, 0)); // Look slightly above center
    camera.lookAt(lookAtPosition);
}

// --- Send State to Server Periodically ---
let lastUpdateTime = 0;
const updateInterval = 100; // Send updates every 100ms (10 times per second)

function sendStateToServer(currentTime) {
    if (!playerId || socket.readyState !== WebSocket.OPEN) return; // Don't send if no ID or socket closed

    if (currentTime - lastUpdateTime > updateInterval) {
        const stateToSend = {
            type: 'update_state',
            state: {
                position: { x: player.position.x, y: player.position.y, z: player.position.z },
                // Send quaternion components directly
                quaternion: { _x: player.quaternion.x, _y: player.quaternion.y, _z: player.quaternion.z, _w: player.quaternion.w }
                // Could also send velocity, speed etc. if needed by server/other clients
            }
        };
        socket.send(JSON.stringify(stateToSend));
        lastUpdateTime = currentTime;
    }
}


// --- Animation Loop ---
const clock = new THREE.Clock();

function animate(currentTime) {
    requestAnimationFrame(animate); // Loop

    const deltaTime = clock.getDelta(); // Time since last frame

    // Update player based on input and physics
    if (playerId) { // Only update/send if we have an ID
        updatePlayer(deltaTime);
        sendStateToServer(performance.now()); // Use performance.now() for intervals
    }

    // Update camera to follow player
    updateCamera();

    // Update other players (interpolation could be added here for smoother movement)
    // Currently, position/rotation is set directly in the onmessage handler

    // Render the scene
    renderer.render(scene, camera);
}

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// --- Start the game ---
animate();