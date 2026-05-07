export function sma(closes, period) {
    const result = [];
    let sum = 0;
    for (let i = 0; i < closes.length; i++) {
        sum += closes[i];
        if (i >= period) {
            sum -= closes[i - period];
        }
        if (i >= period - 1) {
            result.push(sum / period);
        }
        else {
            result.push(null);
        }
    }
    return result;
}
//# sourceMappingURL=sma.js.map