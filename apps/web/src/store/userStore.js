import { create } from 'zustand';
export const useUserStore = create((set) => ({
    watchlists: [],
    activeWatchlistId: null,
    layouts: [],
    activeLayoutId: null,
    setWatchlists: (wl) => set({ watchlists: wl }),
    setActiveWatchlist: (id) => set({ activeWatchlistId: id }),
    setLayouts: (layouts) => set({ layouts: layouts }),
    setActiveLayout: (id) => set({ activeLayoutId: id }),
}));
//# sourceMappingURL=userStore.js.map