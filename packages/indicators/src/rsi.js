export function rsi(closes, period = 14) {
    const result = [];
    if (closes.length <= period) {
        return closes.map(() => null);
    }
    let avgGain = 0;
    let avgLoss = 0;
    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
        const change = closes[i] - closes[i - 1];
        if (change > 0) {
            avgGain += change;
        }
        else {
            avgLoss -= change; // keep loss positive
        }
    }
    avgGain /= period;
    avgLoss /= period;
    // Fill nulls for initial periods
    for (let i = 0; i < period; i++) {
        result.push(null);
    }
    // Calculate first RSI
    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    result.push(avgLoss === 0 ? 100 : 100 - (100 / (1 + rs)));
    // Calculate the rest using smoothed averages
    for (let i = period + 1; i < closes.length; i++) {
        const change = closes[i] - closes[i - 1];
        let gain = 0;
        let loss = 0;
        if (change > 0) {
            gain = change;
        }
        else {
            loss = -change;
        }
        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;
        if (avgLoss === 0) {
            result.push(100);
        }
        else {
            rs = avgGain / avgLoss;
            result.push(100 - (100 / (1 + rs)));
        }
    }
    return result;
}
//# sourceMappingURL=rsi.js.map