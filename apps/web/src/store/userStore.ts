import { create } from 'zustand';

export interface Watchlist {
  id: string;
  name: string;
  symbols: { id: string; symbol: string; exchange: string; orderIndex: number }[];
}

export interface Layout {
  id: string;
  name: string;
  config: any;
}

export interface UserState {
  watchlists: Watchlist[];
  activeWatchlistId: string | null;
  layouts: Layout[];
  activeLayoutId: string | null;
  
  setWatchlists: (wl: Watchlist[]) => void;
  setActiveWatchlist: (id: string) => void;
  setLayouts: (layouts: Layout[]) => void;
  setActiveLayout: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  watchlists: [],
  activeWatchlistId: null,
  layouts: [],
  activeLayoutId: null,

  setWatchlists: (wl) => set({ watchlists: wl }),
  setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
  setLayouts: (layouts) => set({ layouts: layouts }),
  setActiveLayout: (id) => set({ activeLayoutId: id }),
}));
