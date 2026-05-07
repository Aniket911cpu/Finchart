import { WebSocket } from 'ws';

// Map of channel -> Set of connected WebSocket clients
const subscriptions = new Map<string, Set<WebSocket>>();

export function subscribeClient(ws: WebSocket, channel: string) {
  if (!subscriptions.has(channel)) {
    subscriptions.set(channel, new Set());
  }
  
  subscriptions.get(channel)!.add(ws);
  
  // Attach channel info to ws so we can clean up on disconnect
  (ws as any)._channels = (ws as any)._channels || new Set();
  (ws as any)._channels.add(channel);
}

export function unsubscribeClient(ws: WebSocket, channel: string) {
  
  const clients = subscriptions.get(channel);
  if (clients) {
    clients.delete(ws);
    if (clients.size === 0) {
      subscriptions.delete(channel);
    }
  }
  
  if ((ws as any)._channels) {
    (ws as any)._channels.delete(channel);
  }
}

export function removeClientFromAll(ws: WebSocket) {
  const channels = (ws as any)._channels;
  if (channels) {
    channels.forEach((channel: string) => {
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

export function broadcastToChannel(channel: string, message: string) {
  const clients = subscriptions.get(channel);
  if (clients) {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
