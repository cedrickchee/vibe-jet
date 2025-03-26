// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Choose a port
console.log('WebSocket server started on port 8080');

// Store connected clients (key: clientId, value: { ws: WebSocket object, state: {} })
let clients = {};
let clientIdCounter = 0; // Simple way to generate unique IDs

// Function to broadcast message to all clients except the sender
function broadcast(senderId, message) {
    const messageString = JSON.stringify(message);
    Object.keys(clients).forEach(clientId => {
        if (clientId !== senderId && clients[clientId].ws.readyState === WebSocket.OPEN) {
            clients[clientId].ws.send(messageString);
        }
    });
}

wss.on('connection', (ws) => {
    const clientId = `player_${clientIdCounter++}`;
    clients[clientId] = { ws: ws, state: { position: { x: 0, y: 5, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 } } }; // Initial state
    console.log(`Client connected: ${clientId}`);

    // --- Send the new client their ID and the current state of all other players ---
    const initialOtherPlayers = {};
    Object.keys(clients).forEach(id => {
        if (id !== clientId) {
            initialOtherPlayers[id] = clients[id].state;
        }
    });
    ws.send(JSON.stringify({ type: 'your_id', id: clientId }));
    ws.send(JSON.stringify({ type: 'current_players', players: initialOtherPlayers }));

    // --- Inform other players about the new player ---
    broadcast(clientId, { type: 'player_joined', id: clientId, state: clients[clientId].state });

    // --- Handle messages from this client ---
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'update_state') {
                // Update the server's state for this client
                if (clients[clientId]) {
                    clients[clientId].state = data.state;
                    // Broadcast the update to other clients
                    broadcast(clientId, { type: 'player_update', id: clientId, state: data.state });
                }
            }
        } catch (error) {
            console.error(`Failed to parse message or invalid message format from ${clientId}:`, message, error);
        }
    });

    // --- Handle client disconnection ---
    ws.on('close', () => {
        console.log(`Client disconnected: ${clientId}`);
        // Inform other players
        broadcast(clientId, { type: 'player_left', id: clientId });
        // Remove client from our list
        delete clients[clientId];
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for ${clientId}:`, error);
        // Ensure cleanup happens even on error
        if (clients[clientId]) {
             broadcast(clientId, { type: 'player_left', id: clientId });
             delete clients[clientId];
        }
    });
});

// Basic heartbeat to keep connections alive if needed (optional)
/*
setInterval(() => {
    Object.keys(clients).forEach(clientId => {
        if (clients[clientId].ws.readyState === WebSocket.OPEN) {
            clients[clientId].ws.ping(); // Send ping
        }
    });
}, 30000); // Every 30 seconds
*/