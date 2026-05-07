import { MarketAdapter, OHLCV, SymbolInfo } from './base.adapter';
export declare class MockAdapter implements MarketAdapter {
    getOHLCV(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]>;
    searchSymbols(query: string): Promise<SymbolInfo[]>;
    getSymbolInfo(symbol: string): Promise<SymbolInfo | null>;
}
//# sourceMappingURL=mock.adapter.d.ts.map