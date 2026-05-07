export function ema(closes: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let previousEma: number | null = null;

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j <= i; j++) {
        sum += closes[j];
      }
      previousEma = sum / period;
      result.push(previousEma);
    } else {
      previousEma = (closes[i] - previousEma!) * k + previousEma!;
      result.push(previousEma);
    }
  }

  return result;
}
