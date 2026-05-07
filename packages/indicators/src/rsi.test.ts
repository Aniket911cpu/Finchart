import { describe, it, expect } from 'vitest';
import { rsi } from './rsi';

// Helper to build a monotonically increasing series (all gains → RSI → 100)
function buildSeries(length: number, step = 1, start = 100) {
  return Array.from({ length }, (_, i) => start + i * step);
}

describe('RSI (Relative Strength Index)', () => {
  it('should return all nulls when data.length <= period', () => {
    const data = [10, 20, 30];
    expect(rsi(data, 14)).toEqual([null, null, null]);
  });

  it('should return correct length', () => {
    const data = buildSeries(20);
    const result = rsi(data, 14);
    expect(result).toHaveLength(20);
  });

  it('first 14 values should be null with period=14', () => {
    const data = buildSeries(20);
    const result = rsi(data, 14);
    for (let i = 0; i < 14; i++) {
      expect(result[i]).toBeNull();
    }
  });

  it('should return RSI near 100 for all-gains series', () => {
    // 15 values all increasing — pure gain, no losses
    const data = buildSeries(20, 1);
    const result = rsi(data, 14);
    // After initial period, all changes are gains, so RSI should be very high
    const validValues = result.filter((v): v is number => v !== null);
    for (const v of validValues) {
      expect(v).toBeGreaterThan(90);
    }
  });

  it('should return RSI near 0 for all-losses series', () => {
    // 20 values all decreasing
    const data = buildSeries(20, -1, 200);
    const result = rsi(data, 14);
    const validValues = result.filter((v): v is number => v !== null);
    for (const v of validValues) {
      expect(v).toBeLessThan(10);
    }
  });

  it('all RSI values should be within [0, 100]', () => {
    const data = [100, 102, 101, 103, 100, 98, 97, 99, 101, 100, 102, 105, 104, 103, 102, 100];
    const result = rsi(data, 14);
    const validValues = result.filter((v): v is number => v !== null);
    for (const v of validValues) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(100);
    }
  });

  it('should handle empty array', () => {
    expect(rsi([], 14)).toEqual([]);
  });
});
