import { BinanceAdapter } from './binance.adapter';
import { MockAdapter } from './mock.adapter';
import { POPULAR_SYMBOLS } from './symbols';
export class SmartProviderRouter {
    binance = new BinanceAdapter();
    mock = new MockAdapter();
    getProvider(symbol) {
        const symbolInfo = POPULAR_SYMBOLS.find(s => s.symbol === symbol);
        if (symbolInfo) {
            return symbolInfo.type === 'crypto' ? this.binance : this.mock;
        }
        // Heuristic if not found
        const isCrypto = symbol.includes('USDT') || symbol.includes('BTC') || symbol.includes('/USD');
        return isCrypto ? this.binance : this.mock;
    }
}
//# sourceMappingURL=provider.factory.js.map