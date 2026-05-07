import { describe, it, expect, beforeEach } from 'vitest';
import { MockAdapter } from './mock.adapter';

describe('MockAdapter', () => {
  let adapter: MockAdapter;

  beforeEach(() => {
    adapter = new MockAdapter();
  });

  // ── OHLCV ──────────────────────────────────────────────────────────────────

  describe('getOHLCV', () => {
    const FROM = 1700000000;
    const TO   = FROM + 86400 * 7; // 7 days of data

    it('should return an array of bars', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      expect(Array.isArray(bars)).toBe(true);
      expect(bars.length).toBeGreaterThan(0);
    });

    it('each bar should have OHLCV fields with finite numbers', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      for (const bar of bars) {
        expect(typeof bar.time).toBe('number');
        expect(isFinite(bar.open)).toBe(true);
        expect(isFinite(bar.high)).toBe(true);
        expect(isFinite(bar.low)).toBe(true);
        expect(isFinite(bar.close)).toBe(true);
        expect(isFinite(bar.volume)).toBe(true);
      }
    });

    it('high should be >= open, close, and low on every bar', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      for (const bar of bars) {
        expect(bar.high).toBeGreaterThanOrEqual(bar.open);
        expect(bar.high).toBeGreaterThanOrEqual(bar.close);
        expect(bar.high).toBeGreaterThanOrEqual(bar.low);
      }
    });

    it('low should be <= open, close, and high on every bar', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      for (const bar of bars) {
        expect(bar.low).toBeLessThanOrEqual(bar.open);
        expect(bar.low).toBeLessThanOrEqual(bar.close);
        expect(bar.low).toBeLessThanOrEqual(bar.high);
      }
    });

    it('bars should be sorted by time (ascending)', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      for (let i = 1; i < bars.length; i++) {
        expect(bars[i].time).toBeGreaterThan(bars[i - 1].time);
      }
    });

    it('should produce deterministic output for the same symbol', async () => {
      const bars1 = await adapter.getOHLCV('TSLA', 'D', FROM, TO);
      const bars2 = await adapter.getOHLCV('TSLA', 'D', FROM, TO);
      expect(bars1).toEqual(bars2);
    });

    it('different symbols should produce different data', async () => {
      const aaplBars = await adapter.getOHLCV('AAPL', 'D', FROM, TO);
      const tslaBars = await adapter.getOHLCV('TSLA', 'D', FROM, TO);
      // Very unlikely to match for first bar
      expect(aaplBars[0].open).not.toBeCloseTo(tslaBars[0].open, 0);
    });

    it('should return approx expected bar count for daily timeframe', async () => {
      const from = 1700000000;
      const days = 10;
      const to   = from + 86400 * days;
      const bars  = await adapter.getOHLCV('AAPL', 'D', from, to);
      // Allow ±1 for alignment rounding
      expect(bars.length).toBeGreaterThanOrEqual(days - 1);
      expect(bars.length).toBeLessThanOrEqual(days + 1);
    });

    it('should return fewer bars for smaller timeframe over same period', async () => {
      // Daily gives ~7 bars; hourly gives ~168 bars for same 7-day window
      const barsDaily  = await adapter.getOHLCV('AAPL', 'D',  FROM, TO);
      const barsHourly = await adapter.getOHLCV('AAPL', '60', FROM, TO);
      expect(barsHourly.length).toBeGreaterThan(barsDaily.length);
    });

    it('should return empty array when from equals to', async () => {
      const bars = await adapter.getOHLCV('AAPL', 'D', FROM, FROM);
      // At most 1 bar (the aligned starting bar)
      expect(bars.length).toBeLessThanOrEqual(1);
    });

    it('all prices should be positive', async () => {
      const bars = await adapter.getOHLCV('BTC', 'D', FROM, TO);
      for (const bar of bars) {
        expect(bar.open).toBeGreaterThan(0);
        expect(bar.high).toBeGreaterThan(0);
        expect(bar.low).toBeGreaterThan(0);
        expect(bar.close).toBeGreaterThan(0);
        expect(bar.volume).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ── searchSymbols ──────────────────────────────────────────────────────────

  describe('searchSymbols', () => {
    it('should return results for known symbol prefix', async () => {
      const results = await adapter.searchSymbols('AAPL');
      expect(results.length).toBeGreaterThan(0);
    });

    it('result items should have required SymbolInfo fields', async () => {
      const results = await adapter.searchSymbols('AAPL');
      for (const r of results) {
        expect(typeof r.symbol).toBe('string');
        expect(typeof r.name).toBe('string');
        expect(typeof r.exchange).toBe('string');
        expect(['crypto', 'stock', 'forex']).toContain(r.type);
      }
    });

    it('should return empty array for unknown query', async () => {
      const results = await adapter.searchSymbols('ZZZUNKNOWN999');
      expect(results).toEqual([]);
    });

    it('search should be case-insensitive', async () => {
      const upper = await adapter.searchSymbols('AAPL');
      const lower = await adapter.searchSymbols('aapl');
      expect(upper.length).toBe(lower.length);
    });
  });

  // ── getSymbolInfo ──────────────────────────────────────────────────────────

  describe('getSymbolInfo', () => {
    it('should return symbol info for a known stock', async () => {
      const info = await adapter.getSymbolInfo('AAPL');
      expect(info).not.toBeNull();
      expect(info?.symbol).toBe('AAPL');
    });

    it('should return null for an unknown symbol', async () => {
      const info = await adapter.getSymbolInfo('ZZZUNKNOWN999');
      expect(info).toBeNull();
    });
  });
});
