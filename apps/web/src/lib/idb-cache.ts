export interface CachedData {
  data: any[];
  cachedAt: number;
}

export class IDBCache {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'finchart-cache';
  private readonly STORE = 'ohlcv';
  private readonly TTL_MS = 5 * 60 * 1000; // 5 minutes

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE);
        }
      };
    });
  }

  async get(key: string): Promise<{ data: any[]; stale: boolean } | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE], 'readonly');
      const store = transaction.objectStore(this.STORE);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result as CachedData | undefined;
        if (!result) return resolve(null);

        const stale = Date.now() - result.cachedAt > this.TTL_MS;
        resolve({ data: result.data, stale });
      };
    });
  }

  async set(key: string, data: any[]): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE], 'readwrite');
      const store = transaction.objectStore(this.STORE);
      const request = store.put({ data, cachedAt: Date.now() }, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async invalidate(symbol: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE], 'readwrite');
      const store = transaction.objectStore(this.STORE);
      const request = store.openCursor();

      request.onerror = () => reject(request.error);
      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          if (String(cursor.key).startsWith(`${symbol}:`)) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async clear(): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE], 'readwrite');
      const store = transaction.objectStore(this.STORE);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const idbCache = new IDBCache();
