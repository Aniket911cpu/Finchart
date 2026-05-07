import { describe, it, expect } from 'vitest';
import { ema } from './ema';

describe('EMA (Exponential Moving Average)', () => {
  it('should return nulls for the first period-1 values', () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const result = ema(data, period);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).not.toBeNull();
  });

  it('first non-null value should be SMA of the first period bars', () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const result = ema(data, period);
    // First EMA = (10+20+30)/3 = 20
    expect(result[2]).toBeCloseTo(20, 5);
  });

  it('should apply the EMA formula for subsequent values', () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const result = ema(data, period);
    const k = 2 / (period + 1); // multiplier = 0.5
    // EMA[3] = (40 - 20) * 0.5 + 20 = 30
    expect(result[3]).toBeCloseTo(30, 5);
    // EMA[4] = (50 - 30) * 0.5 + 30 = 40
    expect(result[4]).toBeCloseTo(40, 5);
  });

  it('should handle an empty array', () => {
    expect(ema([], 3)).toEqual([]);
  });

  it('should handle period of 1 (returns each close)', () => {
    const data = [10, 20, 30];
    const result = ema(data, 1);
    expect(result).toEqual([10, 20, 30]);
  });

  it('should return all nulls when data length < period', () => {
    const data = [10, 20];
    const result = ema(data, 5);
    expect(result).toEqual([null, null]);
  });
});
