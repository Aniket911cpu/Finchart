import { describe, it, expect } from 'vitest';
import { macd } from './macd';

function buildSeries(length: number, step = 0.5, start = 100) {
  return Array.from({ length }, (_, i) => start + i * step);
}

describe('MACD (Moving Average Convergence Divergence)', () => {
  const data = buildSeries(50);

  it('should return three arrays of same length', () => {
    const result = macd(data);
    expect(result.macd).toHaveLength(data.length);
    expect(result.signal).toHaveLength(data.length);
    expect(result.histogram).toHaveLength(data.length);
  });

  it('should have leading nulls for macd line (slowPeriod - 1)', () => {
    const result = macd(data, 12, 26, 9);
    // First 25 values of macdLine should be null (before slowPeriod kicks in)
    for (let i = 0; i < 25; i++) {
      expect(result.macd[i]).toBeNull();
    }
    // 26th value (index 25) should be valid
    expect(result.macd[25]).not.toBeNull();
  });

  it('histogram should be macd - signal when both are valid', () => {
    const result = macd(data, 12, 26, 9);
    for (let i = 0; i < data.length; i++) {
      if (result.macd[i] !== null && result.signal[i] !== null) {
        expect(result.histogram[i]).toBeCloseTo(result.macd[i]! - result.signal[i]!, 10);
      } else {
        expect(result.histogram[i]).toBeNull();
      }
    }
  });

  it('should handle empty array', () => {
    const result = macd([]);
    expect(result.macd).toEqual([]);
    expect(result.signal).toEqual([]);
    expect(result.histogram).toEqual([]);
  });

  it('should handle fewer bars than slowPeriod', () => {
    const shortData = buildSeries(10);
    const result = macd(shortData, 12, 26, 9);
    // All values should be null
    expect(result.macd.every((v) => v === null)).toBe(true);
    expect(result.signal.every((v) => v === null)).toBe(true);
    expect(result.histogram.every((v) => v === null)).toBe(true);
  });
});
