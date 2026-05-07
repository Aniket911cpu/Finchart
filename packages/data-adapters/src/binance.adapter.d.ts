import { MarketAdapter, OHLCV, SymbolInfo } from './base.adapter';
export declare class BinanceAdapter implements MarketAdapter {
    private baseURL;
    getOHLCV(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]>;
    searchSymbols(query: string): Promise<SymbolInfo[]>;
    getSymbolInfo(symbol: string): Promise<SymbolInfo | null>;
}
//# sourceMappingURL=binance.adapter.d.ts.map