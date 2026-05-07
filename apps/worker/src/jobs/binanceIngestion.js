import WebSocket from 'ws';
import Redis from 'ioredis';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);
// Hardcoded symbols for now
const SYMBOLS = ['btc', 'eth', 'sol', 'bnb', 'xrp', 'doge'];
export function startBinanceIngestion() {
    const streams = SYMBOLS.map(s => `${s}usdt@kline_1m`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streams}`);
    ws.on('open', () => {
        console.log('Connected to Binance WS for symbols:', SYMBOLS.join(', '));
    });
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data.toString());
            if (message.e === 'kline') {
                const symbol = message.s; // e.g., BTCUSDT
                const kline = message.k;
                const formattedSymbol = `${symbol.replace('USDT', '')}/USDT`;
                const tick = {
                    symbol: formattedSymbol,
                    time: Math.floor(kline.t / 1000), // open time
                    open: parseFloat(kline.o),
                    high: parseFloat(kline.h),
                    low: parseFloat(kline.l),
                    close: parseFloat(kline.c),
                    volume: parseFloat(kline.v),
                };
                // Publish to Redis channel `market:symbol:timeframe`
                redis.publish(`market:${formattedSymbol}:1m`, JSON.stringify(tick));
            }
        }
        catch (e) {
            console.error('Error processing WS message:', e);
        }
    });
    ws.on('close', () => {
        console.log('Binance WS closed, reconnecting in 5s...');
        setTimeout(startBinanceIngestion, 5000);
    });
    ws.on('error', (err) => {
        console.error('Binance WS error:', err);
    });
}
//# sourceMappingURL=binanceIngestion.js.map