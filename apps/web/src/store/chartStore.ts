import { create } from 'zustand';

export interface ChartState {
  activeSymbol: string;
  timeframe: string;
  chartType: 'candlestick' | 'line' | 'area';
  isLoading: boolean;
  
  setSymbol: (s: string) => void;
  setTimeframe: (tf: string) => void;
  setChartType: (type: 'candlestick' | 'line' | 'area') => void;
  setLoading: (isLoading: boolean) => void;
}

export const useChartStore = create<ChartState>((set) => ({
  activeSymbol: 'BTC/USDT',
  timeframe: '60', // 1 hour
  chartType: 'candlestick',
  isLoading: false,

  setSymbol: (s) => set({ activeSymbol: s }),
  setTimeframe: (tf) => set({ timeframe: tf }),
  setChartType: (type) => set({ chartType: type }),
  setLoading: (isLoading) => set({ isLoading }),
}));
