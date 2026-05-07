import { create } from 'zustand';
export const useChartStore = create((set) => ({
    activeSymbol: 'BTC/USDT',
    timeframe: '60', // 1 hour
    chartType: 'candlestick',
    isLoading: false,
    isAlertsOpen: false,
    indicators: {
        sma20: false,
        ema9: false,
        ema21: false,
        bb20: false,
        vwap: false,
        rsi14: false,
        macd: false,
    },
    setSymbol: (s) => set({ activeSymbol: s }),
    setTimeframe: (tf) => set({ timeframe: tf }),
    setChartType: (type) => set({ chartType: type }),
    setLoading: (isLoading) => set({ isLoading }),
    setAlertsOpen: (isOpen) => set({ isAlertsOpen: isOpen }),
    toggleIndicator: (indicator) => set((state) => ({
        indicators: { ...state.indicators, [indicator]: !state.indicators[indicator] }
    })),
}));
//# sourceMappingURL=chartStore.js.map