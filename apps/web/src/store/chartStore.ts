import { create } from 'zustand';

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

export const useChartStore = create<ChartState>((set) => ({
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
