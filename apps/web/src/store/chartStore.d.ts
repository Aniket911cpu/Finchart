export interface IndicatorsState {
    sma20: boolean;
    ema9: boolean;
    ema21: boolean;
    bb20: boolean;
    vwap: boolean;
    rsi14: boolean;
    macd: boolean;
}
export interface ChartState {
    activeSymbol: string;
    timeframe: string;
    chartType: 'candlestick' | 'line' | 'area';
    isLoading: boolean;
    isAlertsOpen: boolean;
    indicators: IndicatorsState;
    setSymbol: (s: string) => void;
    setTimeframe: (tf: string) => void;
    setChartType: (type: 'candlestick' | 'line' | 'area') => void;
    setLoading: (isLoading: boolean) => void;
    setAlertsOpen: (isOpen: boolean) => void;
    toggleIndicator: (indicator: keyof IndicatorsState) => void;
}
export declare const useChartStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ChartState>>;
//# sourceMappingURL=chartStore.d.ts.map