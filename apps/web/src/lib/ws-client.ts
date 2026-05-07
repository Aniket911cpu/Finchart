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

class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private currentSymbol: string | null = null;
  private currentTimeframe: string | null = null;
  private callback: TickCallback | null = null;
  private reconnectTimer: any = null;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('[WS] Connected');
      this.resubscribe();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'pong') return;
        
        // It's a tick from Redis (Redis sends plain JSON objects via the gateway broadcast)
        if (this.callback && data.symbol && data.close !== undefined) {
          this.callback(data);
        }
      } catch (e) {}
    };

    this.ws.onclose = () => {
      console.log('[WS] Disconnected, reconnecting...');
      this.ws = null;
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (err) => {
      console.error('[WS] Error:', err);
    };
  }

  subscribe(symbol: string, timeframe: string, callback: TickCallback) {
    // Unsubscribe from previous if different
    if (this.currentSymbol && (this.currentSymbol !== symbol || this.currentTimeframe !== timeframe)) {
      this.unsubscribe();
    }

    this.currentSymbol = symbol;
    this.currentTimeframe = timeframe;
    this.callback = callback;
    
    this.resubscribe();
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      this.connect();
    }
  }

  unsubscribe() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentSymbol) {
      this.ws.send(JSON.stringify({
        event: 'unsubscribe',
        payload: { symbol: this.currentSymbol, timeframe: '1m' } // using 1m interval for ticks
      }));
    }
    this.currentSymbol = null;
    this.currentTimeframe = null;
    this.callback = null;
  }

  private resubscribe() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.currentSymbol) {
      this.ws.send(JSON.stringify({
        event: 'subscribe',
        payload: { symbol: this.currentSymbol, timeframe: '1m' } // Binance ingestion is mapped to 1m
      }));
    }
  }

  disconnect() {
    this.unsubscribe();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002';
export const wsClient = new WSClient(WS_URL);
