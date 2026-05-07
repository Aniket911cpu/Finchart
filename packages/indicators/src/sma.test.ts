import { describe, it, expect } from 'vitest';
import { sma } from './sma';

describe('SMA (Simple Moving Average)', () => {
  it('should return nulls when not enough data points', () => {
    const data = [10, 20];
    const period = 3;
    const result = sma(data, period);
    expect(result).toEqual([null, null]);
  });

  it('should calculate correct SMA for simple case', () => {
    const data = [10, 20, 30, 40, 50];
    const period = 3;
    const result = sma(data, period);
    // [null, null, (10+20+30)/3=20, (20+30+40)/3=30, (30+40+50)/3=40]
    expect(result).toEqual([null, null, 20, 30, 40]);
  });

  it('should handle period of 1', () => {
    const data = [10, 20, 30];
    const period = 1;
    const result = sma(data, period);
    expect(result).toEqual([10, 20, 30]);
  });

  it('should handle empty array', () => {
    const data: number[] = [];
    const period = 3;
    const result = sma(data, period);
    expect(result).toEqual([]);
  });
});
