import { OHLCV, SymbolInfo } from '@finchart/data-adapters';
export declare class MarketService {
    private router;
    getHistory(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]>;
    searchSymbols(query: string): Promise<SymbolInfo[]>;
    resolveSymbol(symbol: string): Promise<SymbolInfo | null>;
}
//# sourceMappingURL=market.service.d.ts.map