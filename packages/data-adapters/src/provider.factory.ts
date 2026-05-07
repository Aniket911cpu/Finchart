import { MarketAdapter } from './base.adapter';
import { BinanceAdapter } from './binance.adapter';
import { MockAdapter } from './mock.adapter';
import { POPULAR_SYMBOLS } from './symbols';

export class SmartProviderRouter {
  private binance = new BinanceAdapter();
  private mock = new MockAdapter();

  getProvider(symbol: string): MarketAdapter {
    const symbolInfo = POPULAR_SYMBOLS.find(s => s.symbol === symbol);
    
    if (symbolInfo) {
      return symbolInfo.type === 'crypto' ? this.binance : this.mock;
    }

    // Heuristic if not found
    const isCrypto = symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('/USD');
    return isCrypto ? this.binance : this.mock;
  }
}
