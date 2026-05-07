import { describe, it, expect } from 'vitest';
import { vwap } from './vwap';
import type { VWAPDataPoint } from './vwap';

// Helpers: all timestamps on the same day (2024-01-15 UTC)
const DAY1_START = 1705276800; // 2024-01-15 00:00:00 UTC
const DAY2_START = 1705363200; // 2024-01-16 00:00:00 UTC

function makeBar(t: number, high: number, low: number, close: number, volume: number): VWAPDataPoint {
  return { time: t, high, low, close, volume };
}

describe('VWAP (Volume Weighted Average Price)', () => {
  it('should return a value for each data point', () => {
    const data = [
      makeBar(DAY1_START + 0, 102, 98, 100, 1000),
      makeBar(DAY1_START + 3600, 104, 100, 102, 2000),
      makeBar(DAY1_START + 7200, 106, 102, 104, 1500),
    ];
    const result = vwap(data);
    expect(result).toHaveLength(3);
  });

  it('first bar VWAP = typical price when only 1 bar', () => {
    const data = [makeBar(DAY1_START, 102, 98, 100, 1000)];
    const result = vwap(data);
    // Typical = (102 + 98 + 100) / 3 = 100
    expect(result[0]).toBeCloseTo(100, 5);
  });

  it('should be cumulative within the same day', () => {
    const data = [
      makeBar(DAY1_START + 0, 102, 98, 100, 1000),   // tp=100
      makeBar(DAY1_START + 3600, 104, 100, 102, 1000), // tp=102
    ];
    const result = vwap(data);
    // vwap[0] = (100*1000) / 1000 = 100
    expect(result[0]).toBeCloseTo(100, 5);
    // vwap[1] = (100*1000 + 102*1000) / 2000 = 101
    expect(result[1]).toBeCloseTo(101, 5);
  });

  it('should reset accumulation at start of a new day', () => {
    const data = [
      makeBar(DAY1_START + 0, 102, 98, 100, 1000),  // Day 1 tp=100
      makeBar(DAY2_START + 0, 200, 196, 198, 500),  // Day 2 tp=198
    ];
    const result = vwap(data);
    expect(result[0]).toBeCloseTo(100, 5);
    // Day 2 should reset — VWAP = (200+196+198)/3 = 198
    expect(result[1]).toBeCloseTo(198, 5);
  });

  it('should return null when cumulative volume is zero', () => {
    const data = [makeBar(DAY1_START, 100, 90, 95, 0)];
    const result = vwap(data);
    expect(result[0]).toBeNull();
  });

  it('should handle empty array', () => {
    expect(vwap([])).toEqual([]);
  });
});
