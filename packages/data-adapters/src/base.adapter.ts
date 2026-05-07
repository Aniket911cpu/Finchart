export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolInfo {
  symbol: string;
  name: string;
  exchange: string;
  type: 'crypto' | 'stock' | 'forex';
}

export interface MarketAdapter {
  getOHLCV(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]>;
  searchSymbols(query: string): Promise<SymbolInfo[]>;
  getSymbolInfo(symbol: string): Promise<SymbolInfo | null>;
}
