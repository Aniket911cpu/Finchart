import { MarketAdapter, OHLCV, SymbolInfo } from './base.adapter';
import { POPULAR_SYMBOLS } from './symbols';

export class MockAdapter implements MarketAdapter {
  async getOHLCV(symbol: string, timeframe: string, from: number, to: number): Promise<OHLCV[]> {
    const bars: OHLCV[] = [];
    
    // Parse timeframe to seconds
    let intervalSeconds = 3600; // default 1h
    if (timeframe === '1') intervalSeconds = 60;
    else if (timeframe === '5') intervalSeconds = 300;
    else if (timeframe === '15') intervalSeconds = 900;
    else if (timeframe === '60') intervalSeconds = 3600;
    else if (timeframe === 'D' || timeframe === '1D') intervalSeconds = 86400;

    // Seeded random based on symbol string to keep chart neighborhood stable
    let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    let currentPrice = 150 + random() * 100; // Base price between 150-250

    // Generate bars
    // Align start time to interval
    let currentTime = Math.ceil(from / intervalSeconds) * intervalSeconds;
    
    while (currentTime <= to) {
      const volatility = currentPrice * 0.002; // 0.2% volatility
      const change = (random() - 0.5) * volatility;
      
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) + random() * volatility;
      const low = Math.min(open, close) - random() * volatility;
      
      bars.push({
        time: currentTime,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: Number((random() * 100000).toFixed(2)),
      });

      currentPrice = close;
      currentTime += intervalSeconds;
    }

    return bars;
  }

  async searchSymbols(query: string): Promise<SymbolInfo[]> {
    const lowerQuery = query.toLowerCase();
    return POPULAR_SYMBOLS
      .filter(s => s.type === 'stock' && (s.symbol.toLowerCase().includes(lowerQuery) || s.name.toLowerCase().includes(lowerQuery)));
  }

  async getSymbolInfo(symbol: string): Promise<SymbolInfo | null> {
    return POPULAR_SYMBOLS.find(s => s.symbol === symbol && s.type === 'stock') || null;
  }
}
