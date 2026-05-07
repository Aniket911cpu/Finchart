import { SmartProviderRouter, MockAdapter } from '@finchart/data-adapters';
import { redis } from '../../shared/redis';
import { OHLCV, SymbolInfo } from '@finchart/data-adapters';

export class MarketService {
  private router = new SmartProviderRouter();
  private mockFallback = new MockAdapter();

  async getHistory(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]> {
    const cacheKey = `market:history:${symbol}:${timeframe}:${from}:${to}`;
    
    // Attempt cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }

    // Fetch from provider
    const provider = this.router.getProvider(symbol);
    let data = await provider.getOHLCV(symbol, timeframe, from, to);

    // MOCK FALLBACK: If provider fails or returns no data, use mock adapter
    if (!data || data.length === 0) {
      console.log(`Provider returned no data for ${symbol}. Falling back to MockAdapter.`);
      data = await this.mockFallback.getOHLCV(symbol, timeframe, from, to);
    }

    if (data && data.length > 0) {
      // Cache it for 60 seconds (or more if historical)
      // Since 'to' is usually 'now', 60s cache is safe for latest timeframe
      await redis.setex(cacheKey, 60, JSON.stringify(data));
    }

    return data;
  }

  async searchSymbols(query: string): Promise<SymbolInfo[]> {
    // We could fan out to all providers if we want, but our mock router currently has symbols hardcoded.
    // We will just ask the mock provider for now as it handles all search queries in our implementation.
    const provider = this.router.getProvider('AAPL'); // Mock provider has both
    return provider.searchSymbols(query);
  }

  async resolveSymbol(symbol: string): Promise<SymbolInfo | null> {
    const provider = this.router.getProvider(symbol);
    return provider.getSymbolInfo(symbol);
  }
}
