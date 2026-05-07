import { WebSocket } from 'ws';
export declare function subscribeClient(ws: WebSocket, channel: string): void;
export declare function unsubscribeClient(ws: WebSocket, channel: string): void;
export declare function removeClientFromAll(ws: WebSocket): void;
export declare function broadcastToChannel(channel: string, message: string): void;
//# sourceMappingURL=subscriptions.d.ts.map