import axios from 'axios';
import { POPULAR_SYMBOLS } from './symbols';
const BINANCE_TF_MAP = {
    '1': '1m',
    '3': '3m',
    '5': '5m',
    '15': '15m',
    '30': '30m',
    '60': '1h',
    '120': '2h',
    '240': '4h',
    'D': '1d',
    '1D': '1d',
    'W': '1w',
    '1W': '1w',
    'M': '1M',
    '1M': '1M',
};
export class BinanceAdapter {
    baseURL = 'https://api.binance.com/api/v3';
    async getOHLCV(symbol, timeframe, from, to) {
        // Binance format: BTCUSDT
        const binanceSymbol = symbol.replace('/', '');
        const interval = BINANCE_TF_MAP[timeframe] || '1h';
        try {
            const response = await axios.get(`${this.baseURL}/klines`, {
                params: {
                    symbol: binanceSymbol,
                    interval,
                    startTime: from * 1000,
                    endTime: to * 1000,
                    limit: 1000,
                },
            });
            // Binance Response Format:
            // [
            //   [
            //     1499040000000,      // Open time
            //     "0.01634790",       // Open
            //     "0.80000000",       // High
            //     "0.01575800",       // Low
            //     "0.01577100",       // Close
            //     "148976.11427815",  // Volume
            //     ...
            //   ]
            // ]
            return response.data.map((candle) => ({
                time: Math.floor(candle[0] / 1000), // convert to seconds
                open: parseFloat(candle[1]),
                high: parseFloat(candle[2]),
                low: parseFloat(candle[3]),
                close: parseFloat(candle[4]),
                volume: parseFloat(candle[5]),
            }));
        }
        catch (error) {
            console.error(`Binance API Error for ${symbol}:`, error);
            return [];
        }
    }
    async searchSymbols(query) {
        const lowerQuery = query.toLowerCase();
        return POPULAR_SYMBOLS
            .filter(s => s.type === 'crypto' && (s.symbol.toLowerCase().includes(lowerQuery) || s.name.toLowerCase().includes(lowerQuery)));
    }
    async getSymbolInfo(symbol) {
        return POPULAR_SYMBOLS.find(s => s.symbol === symbol && s.type === 'crypto') || null;
    }
}
//# sourceMappingURL=binance.adapter.js.map