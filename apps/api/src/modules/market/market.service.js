import { SmartProviderRouter } from '@finchart/data-adapters';
import { redis } from '../../shared/redis';
export class MarketService {
    router = new SmartProviderRouter();
    async getHistory(symbol, timeframe, from, to) {
        const cacheKey = `market:history:${symbol}:${timeframe}:${from}:${to}`;
        // Attempt cache
        const cached = await redis.get(cacheKey);
        if (cached) {
            try {
                return JSON.parse(cached);
            }
            catch (e) { }
        }
        // Fetch from provider
        const provider = this.router.getProvider(symbol);
        const data = await provider.getOHLCV(symbol, timeframe, from, to);
        if (data && data.length > 0) {
            // Cache it for 60 seconds (or more if historical)
            // Since 'to' is usually 'now', 60s cache is safe for latest timeframe
            await redis.setex(cacheKey, 60, JSON.stringify(data));
        }
        return data;
    }
    async searchSymbols(query) {
        // We could fan out to all providers if we want, but our mock router currently has symbols hardcoded.
        // We will just ask the mock provider for now as it handles all search queries in our implementation.
        const provider = this.router.getProvider('AAPL'); // Mock provider has both
        return provider.searchSymbols(query);
    }
    async resolveSymbol(symbol) {
        const provider = this.router.getProvider(symbol);
        return provider.getSymbolInfo(symbol);
    }
}
//# sourceMappingURL=market.service.js.map