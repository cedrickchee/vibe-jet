const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// Store connected clients and their latest known state
const clients = new Map(); // Map<ws, { id: string, lastUpdate: number, data: object | null }>
const playerStates = new Map(); // Map<playerId, data: object> - Persist state slightly even if client map entry removed briefly

const TICK_RATE = 10; // Updates per second for broadcasting game state (can be different from client send rate)
const UPDATE_INTERVAL = 1000 / TICK_RATE;
const MESSAGE_RATE_LIMIT = 15; // Max messages per second per client
const CLIENT_TIMEOUT_MS = 10000; // Disconnect client if no message received for 10 seconds

console.log(`WebSocket server started on port ${PORT}`);

wss.on('connection', (ws) => {
    const clientId = uuidv4();
    const clientInfo = {
        id: clientId,
        lastMessageTime: Date.now(),
        messageCount: 0,
        lastUpdate: Date.now(),
        data: null // Initialize data as null
    };
    clients.set(ws, clientInfo);
    console.log(`Client connected: ${clientId} (Total: ${clients.size})`);

    // Send the new client their unique ID
    ws.send(JSON.stringify({ type: 'assign_id', id: clientId }));

    // Send the current state of all other players to the new client
    const allPlayersData = [];
    playerStates.forEach((data, id) => {
        if (id !== clientId) { // Don't send the new player their own (non-existent) state
            allPlayersData.push({ id, data });
        }
    });
    if (allPlayersData.length > 0) {
        ws.send(JSON.stringify({ type: 'world_state', players: allPlayersData }));
        console.log(`Sent world state to ${clientId}`);
    }


    // Inform other clients about the new player (send initial null data or wait for first update)
     broadcast({ type: 'player_join', id: clientId, data: null }, ws); // Send null initially


    ws.on('message', (message) => {
        const now = Date.now();
        const clientData = clients.get(ws);

        if (!clientData) return; // Should not happen, but safety check

        // --- Basic Security: Rate Limiting ---
        if (now - clientData.lastMessageTime < 1000) {
            clientData.messageCount++;
            if (clientData.messageCount > MESSAGE_RATE_LIMIT) {
                console.warn(`Client ${clientData.id} exceeded rate limit. Disconnecting.`);
                ws.terminate(); // Disconnect abusive client
                return;
            }
        } else {
            clientData.lastMessageTime = now;
            clientData.messageCount = 1; // Reset count after a second
        }
         clientData.lastUpdate = now; // Update last seen time

        // --- Message Processing ---
        try {
            const parsedMessage = JSON.parse(message);

            // Basic validation
            if (typeof parsedMessage !== 'object' || !parsedMessage.type || parsedMessage.id !== clientData.id) {
                 console.warn(`Invalid message format or ID mismatch from ${clientData.id}`);
                 return; // Ignore invalid messages silently or log
            }

            switch(parsedMessage.type) {
                case 'player_update':
                    // Store the latest state for this player
                    if (parsedMessage.data && typeof parsedMessage.data.position === 'object' && typeof parsedMessage.data.quaternion === 'object') {
                        playerStates.set(clientData.id, parsedMessage.data);
                         // No need to broadcast immediately here, the broadcast loop will handle it
                    } else {
                        console.warn(`Invalid player_update data from ${clientData.id}`);
                    }
                    break;
                // Add other message types handlers if needed (chat, actions, etc.)
                default:
                    console.log(`Received unhandled message type ${parsedMessage.type} from ${clientData.id}`);
            }

        } catch (error) {
            console.error(`Failed to parse message from ${clientData.id}:`, error);
            // Don't disconnect for parse errors unless frequent
        }
    });

    ws.on('close', () => {
        handleDisconnect(ws);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clients.get(ws)?.id || 'unknown'}:`, error);
        handleDisconnect(ws); // Assume error means connection is lost
    });
});

function handleDisconnect(ws) {
    const clientInfo = clients.get(ws);
    if (clientInfo) {
        console.log(`Client disconnected: ${clientInfo.id} (Total: ${clients.size - 1})`);
        broadcast({ type: 'player_leave', id: clientInfo.id }, ws); // Inform others
        clients.delete(ws);
        playerStates.delete(clientInfo.id); // Remove player state on disconnect
    }
}

// Broadcast updated states at a fixed interval
setInterval(() => {
    const updates = [];
    playerStates.forEach((data, id) => {
         // Only send if data is not null (i.e., player has sent at least one update)
        if(data) {
            updates.push({ type: 'player_update', id: id, data: data });
        }
    });

    if (updates.length > 0) {
        // This sends *all* player states in separate messages.
        // Optimization: Could bundle updates into a single message array.
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                 const clientInfo = clients.get(client);
                 if (clientInfo) {
                    updates.forEach(update => {
                        // Don't send a player its own state back in the broadcast loop
                        // (They already have the authoritative client-side version)
                        // Although sending it back can sometimes help with server authoritative reconciliation
                        // For simplicity here, we skip sending self-updates.
                        if (update.id !== clientInfo.id) {
                           client.send(JSON.stringify(update));
                        }
                    });
                 }
            }
        });
    }
}, UPDATE_INTERVAL);


// Check for timed-out clients periodically
setInterval(() => {
    const now = Date.now();
    clients.forEach((clientInfo, ws) => {
        if (now - clientInfo.lastUpdate > CLIENT_TIMEOUT_MS) {
            console.log(`Client ${clientInfo.id} timed out. Disconnecting.`);
            ws.terminate(); // Force close the connection
            handleDisconnect(ws); // Clean up state
        }
    });
}, CLIENT_TIMEOUT_MS / 2); // Check more frequently than the timeout duration


// Helper function to broadcast a message to all clients except the sender
function broadcast(message, senderWs) {
    const messageString = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client !== senderWs && client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
}