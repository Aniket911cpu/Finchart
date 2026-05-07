'use client';
import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';

import { useMarketData } from '../../hooks/useMarketData';
import { useChartStore } from '../../store/chartStore';
import { wsClient, TickEvent } from '../../lib/ws-client';
import { DrawingManager } from '../../lib/drawings';
import { sma, ema, rsi, macd, bollingerBands, vwap } from '@finchart/indicators';
import { PriceDisplay } from './PriceDisplay';

export default function ChartEngine() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const drawingManagerRef = useRef<DrawingManager | null>(null);

  // Indicator series refs
  const indicatorsRef = useRef<{
    sma?: ISeriesApi<"Line">;
    ema9?: ISeriesApi<"Line">;
    ema21?: ISeriesApi<"Line">;
    bbUpper?: ISeriesApi<"Line">;
    bbLower?: ISeriesApi<"Line">;
    vwap?: ISeriesApi<"Line">;
    rsi?: ISeriesApi<"Line">;
    macdLine?: ISeriesApi<"Line">;
    macdSignal?: ISeriesApi<"Line">;
    macdHist?: ISeriesApi<"Histogram">;
  }>({});

  // App is always dark mode
  const theme = 'dark';
  const activeSymbol = useChartStore((s) => s.activeSymbol);
  const timeframe = useChartStore((s) => s.timeframe);
  const chartType = useChartStore((s) => s.chartType);
  const indicatorsState = useChartStore((s) => s.indicators);

  const { data: historicalData, isLoading } = useMarketData(activeSymbol, timeframe);

  // 1. Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: isDark ? '#E8E9EC' : '#1A1D20',
      },
      grid: {
        vertLines: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E9ECEF' },
        horzLines: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E9ECEF' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });
    chartRef.current = chart;

    // We will initialize main series based on chartType
    const upColor = isDark ? '#26A69A' : '#0CA678';
    const downColor = isDark ? '#EF5350' : '#FA5252';

    if (chartType === 'candlestick') {
      mainSeriesRef.current = chart.addCandlestickSeries({
        upColor, downColor, borderVisible: false, wickUpColor: upColor, wickDownColor: downColor,
      });
    } else if (chartType === 'line') {
      mainSeriesRef.current = chart.addLineSeries({ color: '#2962FF' });
    } else if (chartType === 'area') {
      mainSeriesRef.current = chart.addAreaSeries({
        lineColor: '#2962FF', topColor: 'rgba(41, 98, 255, 0.4)', bottomColor: 'rgba(41, 98, 255, 0.0)'
      });
    }

    const volumeSeries = chart.addHistogramSeries({
      color: isDark ? 'rgba(38, 166, 154, 0.5)' : 'rgba(12, 166, 120, 0.5)',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Overlay
    });
    
    chart.priceScale('').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    volumeSeriesRef.current = volumeSeries;

    // Initialize Drawing Manager
    if (mainSeriesRef.current) {
      drawingManagerRef.current = new DrawingManager(chart, mainSeriesRef.current);
    }

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      drawingManagerRef.current?.destroy();
      chart.remove();
    };
  }, [theme, chartType]);

  // 2. Set Historical Data and Indicators
  useEffect(() => {
    if (!historicalData || !mainSeriesRef.current || !volumeSeriesRef.current || !chartRef.current) return;

    const chart = chartRef.current;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const upColor = isDark ? 'rgba(38, 166, 154, 0.5)' : 'rgba(12, 166, 120, 0.5)';
    const downColor = isDark ? 'rgba(239, 83, 80, 0.5)' : 'rgba(250, 82, 82, 0.5)';

    // Format Data
    const formattedData = historicalData.map(d => ({
      time: d.time as Time, open: d.open, high: d.high, low: d.low, close: d.close, value: d.close
    }));
    mainSeriesRef.current.setData(formattedData);

    const volData = historicalData.map(d => ({
      time: d.time as Time, value: d.volume, color: d.close >= d.open ? upColor : downColor
    }));
    volumeSeriesRef.current.setData(volData);

    const closes = historicalData.map(d => d.close);
    const times = historicalData.map(d => d.time as Time);

    // Helper to format indicator data
    const toSeriesData = (values: (number | null)[]) => {
      return values.map((val, i) => ({ time: times[i], value: val })).filter(d => d.value !== null) as any;
    };

    // --- OVERLAYS ---
    if (indicatorsState.sma20) {
      if (!indicatorsRef.current.sma) indicatorsRef.current.sma = chart.addLineSeries({ color: '#FFB300', lineWidth: 2 });
      indicatorsRef.current.sma.setData(toSeriesData(sma(closes, 20)));
    } else {
      if (indicatorsRef.current.sma) { chart.removeSeries(indicatorsRef.current.sma); delete indicatorsRef.current.sma; }
    }

    if (indicatorsState.ema9) {
      if (!indicatorsRef.current.ema9) indicatorsRef.current.ema9 = chart.addLineSeries({ color: '#2196F3', lineWidth: 2 });
      indicatorsRef.current.ema9.setData(toSeriesData(ema(closes, 9)));
    } else {
      if (indicatorsRef.current.ema9) { chart.removeSeries(indicatorsRef.current.ema9); delete indicatorsRef.current.ema9; }
    }

    if (indicatorsState.ema21) {
      if (!indicatorsRef.current.ema21) indicatorsRef.current.ema21 = chart.addLineSeries({ color: '#E91E63', lineWidth: 2 });
      indicatorsRef.current.ema21.setData(toSeriesData(ema(closes, 21)));
    } else {
      if (indicatorsRef.current.ema21) { chart.removeSeries(indicatorsRef.current.ema21); delete indicatorsRef.current.ema21; }
    }

    if (indicatorsState.bb20) {
      if (!indicatorsRef.current.bbUpper) {
        indicatorsRef.current.bbUpper = chart.addLineSeries({ color: 'rgba(33, 150, 243, 0.5)', lineWidth: 1 });
        indicatorsRef.current.bbLower = chart.addLineSeries({ color: 'rgba(33, 150, 243, 0.5)', lineWidth: 1 });
      }
      const bb = bollingerBands(closes, 20, 2);
      indicatorsRef.current.bbUpper.setData(toSeriesData(bb.upper));
      indicatorsRef.current.bbLower!.setData(toSeriesData(bb.lower));
    } else {
      if (indicatorsRef.current.bbUpper) { 
        chart.removeSeries(indicatorsRef.current.bbUpper); 
        chart.removeSeries(indicatorsRef.current.bbLower!); 
        delete indicatorsRef.current.bbUpper; delete indicatorsRef.current.bbLower; 
      }
    }

    if (indicatorsState.vwap) {
      if (!indicatorsRef.current.vwap) indicatorsRef.current.vwap = chart.addLineSeries({ color: '#9C27B0', lineWidth: 2 });
      const vwapData = vwap(historicalData.map(d => ({ high: d.high, low: d.low, close: d.close, volume: d.volume, time: d.time as number })));
      indicatorsRef.current.vwap.setData(toSeriesData(vwapData));
    } else {
      if (indicatorsRef.current.vwap) { chart.removeSeries(indicatorsRef.current.vwap); delete indicatorsRef.current.vwap; }
    }

    // --- OSCILLATORS (Sub-panes) ---
    // Note: LWC v5 manages panes automatically when adding series to a new price scale
    if (indicatorsState.rsi14) {
      if (!indicatorsRef.current.rsi) {
        indicatorsRef.current.rsi = chart.addLineSeries({ 
          color: '#00BCD4', 
          lineWidth: 2,
          priceScaleId: 'rsi',
        });
        const rsiScale = chart.priceScale('rsi');
        rsiScale.applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        });
      }
      indicatorsRef.current.rsi.setData(toSeriesData(rsi(closes, 14)));
    } else {
      if (indicatorsRef.current.rsi) { chart.removeSeries(indicatorsRef.current.rsi); delete indicatorsRef.current.rsi; }
    }

    if (indicatorsState.macd) {
      if (!indicatorsRef.current.macdLine) {
        indicatorsRef.current.macdLine = chart.addLineSeries({ color: '#2962FF', lineWidth: 2, priceScaleId: 'macd' });
        indicatorsRef.current.macdSignal = chart.addLineSeries({ color: '#FF6D00', lineWidth: 2, priceScaleId: 'macd' });
        indicatorsRef.current.macdHist = chart.addHistogramSeries({ priceScaleId: 'macd' });
        chart.priceScale('macd').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      }
      const m = macd(closes);
      indicatorsRef.current.macdLine.setData(toSeriesData(m.macd));
      indicatorsRef.current.macdSignal!.setData(toSeriesData(m.signal));
      
      const histData = m.histogram.map((val, i) => {
        if (val === null) return null;
        return { time: times[i], value: val, color: val >= 0 ? '#26A69A' : '#EF5350' };
      }).filter(d => d !== null) as any;
      
      indicatorsRef.current.macdHist!.setData(histData);
    } else {
      if (indicatorsRef.current.macdLine) { 
        chart.removeSeries(indicatorsRef.current.macdLine);
        chart.removeSeries(indicatorsRef.current.macdSignal!);
        chart.removeSeries(indicatorsRef.current.macdHist!);
        delete indicatorsRef.current.macdLine; delete indicatorsRef.current.macdSignal; delete indicatorsRef.current.macdHist;
      }
    }

    // Subscribe to real-time updates (Simplistic update, just updating the main chart for now to save performance)
    wsClient.subscribe(activeSymbol, timeframe, (tick: TickEvent) => {
      if (mainSeriesRef.current && volumeSeriesRef.current) {
        mainSeriesRef.current.update({
          time: tick.time as Time, open: tick.open, high: tick.high, low: tick.low, close: tick.close, value: tick.close
        });
        volumeSeriesRef.current.update({
          time: tick.time as Time, value: tick.volume, color: tick.close >= tick.open ? upColor : downColor
        });
      }
    });

    return () => {
      wsClient.unsubscribe();
    };
  }, [historicalData, activeSymbol, timeframe, theme, chartType, indicatorsState]);

  return (
    <div className="w-full h-full relative flex-1">
      <PriceDisplay />
      <div className="w-full h-full absolute inset-0" ref={chartContainerRef}></div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm z-10">
          <div className="text-text-secondary animate-pulse">Loading chart data...</div>
        </div>
      )}
    </div>
  );
}
