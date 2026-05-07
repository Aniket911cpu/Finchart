export type TickEvent = {
    symbol: string;
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};
type TickCallback = (tick: TickEvent) => void;
declare class WSClient {
    private ws;
    private url;
    private currentSymbol;
    private currentTimeframe;
    private callback;
    private reconnectTimer;
    constructor(url: string);
    get socket(): WebSocket | null;
    connect(): void;
    subscribe(symbol: string, timeframe: string, callback: TickCallback): void;
    unsubscribe(): void;
    private resubscribe;
    disconnect(): void;
}
export declare const wsClient: WSClient;
export {};
//# sourceMappingURL=ws-client.d.ts.map