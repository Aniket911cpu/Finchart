import { sma } from './sma';
export function bollingerBands(closes, period = 20, stdDev = 2) {
    const middle = sma(closes, period);
    const upper = [];
    const lower = [];
    for (let i = 0; i < closes.length; i++) {
        if (i < period - 1) {
            upper.push(null);
            lower.push(null);
            continue;
        }
        // Calculate standard deviation
        let variance = 0;
        const mean = middle[i];
        for (let j = i - period + 1; j <= i; j++) {
            variance += Math.pow(closes[j] - mean, 2);
        }
        variance /= period;
        const sd = Math.sqrt(variance);
        upper.push(mean + sd * stdDev);
        lower.push(mean - sd * stdDev);
    }
    return { upper, middle, lower };
}
//# sourceMappingURL=bollinger.js.map