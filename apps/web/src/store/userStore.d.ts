export interface Watchlist {
    id: string;
    name: string;
    symbols: {
        id: string;
        symbol: string;
        exchange: string;
        orderIndex: number;
    }[];
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
export declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserState>>;
//# sourceMappingURL=userStore.d.ts.map