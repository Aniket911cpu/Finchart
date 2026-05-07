export function vwap(data) {
    const result = [];
    let cumulativeTPV = 0; // Typical Price * Volume
    let cumulativeVolume = 0;
    // Keep track of the current day. We reset VWAP at the start of each new day.
    let currentDayStart = 0;
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        // Convert timestamp to start of the day in UTC
        const date = new Date(point.time * 1000);
        const dayStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
        // Reset if it's a new day
        if (dayStart > currentDayStart) {
            cumulativeTPV = 0;
            cumulativeVolume = 0;
            currentDayStart = dayStart;
        }
        const typicalPrice = (point.high + point.low + point.close) / 3;
        cumulativeTPV += typicalPrice * point.volume;
        cumulativeVolume += point.volume;
        if (cumulativeVolume === 0) {
            result.push(null);
        }
        else {
            result.push(cumulativeTPV / cumulativeVolume);
        }
    }
    return result;
}
//# sourceMappingURL=vwap.js.map