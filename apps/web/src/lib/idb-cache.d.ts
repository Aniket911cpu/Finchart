export interface CachedData {
    data: any[];
    cachedAt: number;
}
export declare class IDBCache {
    private db;
    private readonly DB_NAME;
    private readonly STORE;
    private readonly TTL_MS;
    init(): Promise<void>;
    get(key: string): Promise<{
        data: any[];
        stale: boolean;
    } | null>;
    set(key: string, data: any[]): Promise<void>;
    invalidate(symbol: string): Promise<void>;
    clear(): Promise<void>;
}
export declare const idbCache: IDBCache;
//# sourceMappingURL=idb-cache.d.ts.map