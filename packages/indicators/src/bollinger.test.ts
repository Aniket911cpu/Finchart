import { describe, it, expect } from 'vitest';
import { bollingerBands } from './bollinger';

describe('Bollinger Bands', () => {
  const data = [10, 11, 12, 13, 14, 15, 14, 13, 12, 11, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

  it('should return three arrays of equal length', () => {
    const result = bollingerBands(data, 5, 2);
    expect(result.upper).toHaveLength(data.length);
    expect(result.middle).toHaveLength(data.length);
    expect(result.lower).toHaveLength(data.length);
  });

  it('should have leading nulls for the first period-1 values', () => {
    const period = 5;
    const result = bollingerBands(data, period, 2);
    for (let i = 0; i < period - 1; i++) {
      expect(result.upper[i]).toBeNull();
      expect(result.middle[i]).toBeNull();
      expect(result.lower[i]).toBeNull();
    }
  });

  it('upper band should always be >= middle >= lower for valid values', () => {
    const result = bollingerBands(data, 5, 2);
    for (let i = 4; i < data.length; i++) {
      const u = result.upper[i]!;
      const m = result.middle[i]!;
      const l = result.lower[i]!;
      expect(u).toBeGreaterThanOrEqual(m);
      expect(m).toBeGreaterThanOrEqual(l);
    }
  });

  it('upper and lower should be symmetric around middle', () => {
    const result = bollingerBands(data, 5, 2);
    for (let i = 4; i < data.length; i++) {
      const u = result.upper[i]!;
      const m = result.middle[i]!;
      const l = result.lower[i]!;
      expect(u - m).toBeCloseTo(m - l, 8);
    }
  });

  it('bands should collapse to the middle when all prices are equal', () => {
    const flatData = new Array(10).fill(100);
    const result = bollingerBands(flatData, 5, 2);
    for (let i = 4; i < flatData.length; i++) {
      expect(result.upper[i]).toBeCloseTo(100, 5);
      expect(result.middle[i]).toBeCloseTo(100, 5);
      expect(result.lower[i]).toBeCloseTo(100, 5);
    }
  });

  it('should handle empty array', () => {
    const result = bollingerBands([], 5, 2);
    expect(result.upper).toEqual([]);
    expect(result.middle).toEqual([]);
    expect(result.lower).toEqual([]);
  });
});
