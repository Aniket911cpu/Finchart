import { WebSocket } from 'ws';
// Map of channel -> Set of connected WebSocket clients
const subscriptions = new Map();
export function subscribeClient(ws, channel) {
    if (!subscriptions.has(channel)) {
        subscriptions.set(channel, new Set());
    }
    subscriptions.get(channel).add(ws);
    // Attach channel info to ws so we can clean up on disconnect
    ws._channels = ws._channels || new Set();
    ws._channels.add(channel);
}
export function unsubscribeClient(ws, channel) {
    const clients = subscriptions.get(channel);
    if (clients) {
        clients.delete(ws);
        if (clients.size === 0) {
            subscriptions.delete(channel);
        }
    }
    if (ws._channels) {
        ws._channels.delete(channel);
    }
}
export function removeClientFromAll(ws) {
    const channels = ws._channels;
    if (channels) {
        channels.forEach((channel) => {
            const clients = subscriptions.get(channel);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    subscriptions.delete(channel);
                }
            }
        });
    }
}
export function broadcastToChannel(channel, message) {
    const clients = subscriptions.get(channel);
    if (clients) {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
}
//# sourceMappingURL=subscriptions.js.map