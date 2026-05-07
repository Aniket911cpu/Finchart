import { ema } from './ema';

export function macd(
  closes: number[], 
  fastPeriod: number = 12, 
  slowPeriod: number = 26, 
  signalPeriod: number = 9
): { macd: (number | null)[], signal: (number | null)[], histogram: (number | null)[] } {
  const fastEma = ema(closes, fastPeriod);
  const slowEma = ema(closes, slowPeriod);
  
  const macdLine: (number | null)[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (fastEma[i] === null || slowEma[i] === null) {
      macdLine.push(null);
    } else {
      macdLine.push(fastEma[i]! - slowEma[i]!);
    }
  }

  // We need to calculate EMA of the MACD line, but EMA function expects number[] without nulls.
  // We'll strip nulls, calculate EMA, and pad back.
  let firstValidIndex = 0;
  while (firstValidIndex < macdLine.length && macdLine[firstValidIndex] === null) {
    firstValidIndex++;
  }

  const validMacdLine = macdLine.slice(firstValidIndex) as number[];
  const validSignalLine = ema(validMacdLine, signalPeriod);
  
  const signalLine: (number | null)[] = new Array(firstValidIndex).fill(null).concat(validSignalLine);
  
  const histogram: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (macdLine[i] === null || signalLine[i] === null) {
      histogram.push(null);
    } else {
      histogram.push(macdLine[i]! - signalLine[i]!);
    }
  }

  return { macd: macdLine, signal: signalLine, histogram };
}
