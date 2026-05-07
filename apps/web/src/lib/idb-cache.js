export class IDBCache {
    db = null;
    DB_NAME = 'finchart-cache';
    STORE = 'ohlcv';
    TTL_MS = 5 * 60 * 1000; // 5 minutes
    async init() {
        if (this.db)
            return;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.STORE)) {
                    db.createObjectStore(this.STORE);
                }
            };
        });
    }
    async get(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.STORE], 'readonly');
            const store = transaction.objectStore(this.STORE);
            const request = store.get(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = request.result;
                if (!result)
                    return resolve(null);
                const stale = Date.now() - result.cachedAt > this.TTL_MS;
                resolve({ data: result.data, stale });
            };
        });
    }
    async set(key, data) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.STORE], 'readwrite');
            const store = transaction.objectStore(this.STORE);
            const request = store.put({ data, cachedAt: Date.now() }, key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
    async invalidate(symbol) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.STORE], 'readwrite');
            const store = transaction.objectStore(this.STORE);
            const request = store.openCursor();
            request.onerror = () => reject(request.error);
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (String(cursor.key).startsWith(`${symbol}:`)) {
                        cursor.delete();
                    }
                    cursor.continue();
                }
                else {
                    resolve();
                }
            };
        });
    }
    async clear() {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.STORE], 'readwrite');
            const store = transaction.objectStore(this.STORE);
            const request = store.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}
export const idbCache = new IDBCache();
//# sourceMappingURL=idb-cache.js.map