'use client';
import { useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { useTheme } from 'next-themes';
import { useMarketData } from '../../hooks/useMarketData';
import { useChartStore } from '../../store/chartStore';
import { wsClient, TickEvent } from '../../lib/ws-client';

export default function ChartEngine() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const { theme } = useTheme();
  const activeSymbol = useChartStore((s) => s.activeSymbol);
  const timeframe = useChartStore((s) => s.timeframe);

  const { data: historicalData, isLoading } = useMarketData(activeSymbol, timeframe);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Create chart
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

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: isDark ? '#26A69A' : '#0CA678',
      downColor: isDark ? '#EF5350' : '#FA5252',
      borderVisible: false,
      wickUpColor: isDark ? '#26A69A' : '#0CA678',
      wickDownColor: isDark ? '#EF5350' : '#FA5252',
    });
    seriesRef.current = candlestickSeries;

    const volumeSeries = chart.addHistogramSeries({
      color: isDark ? 'rgba(38, 166, 154, 0.5)' : 'rgba(12, 166, 120, 0.5)',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // set as an overlay by setting a blank priceScaleId
    });
    
    // Scale volume to bottom 20%
    chart.priceScale('').applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });
    volumeSeriesRef.current = volumeSeries;

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
      chart.remove();
    };
  }, [theme]);

  // Update Data
  useEffect(() => {
    if (historicalData && seriesRef.current && volumeSeriesRef.current) {
      // Set historical
      const candleData = historicalData.map(d => ({
        time: d.time as Time, open: d.open, high: d.high, low: d.low, close: d.close
      }));
      seriesRef.current.setData(candleData);

      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const upColor = isDark ? 'rgba(38, 166, 154, 0.5)' : 'rgba(12, 166, 120, 0.5)';
      const downColor = isDark ? 'rgba(239, 83, 80, 0.5)' : 'rgba(250, 82, 82, 0.5)';

      const volData = historicalData.map(d => ({
        time: d.time as Time,
        value: d.volume,
        color: d.close >= d.open ? upColor : downColor
      }));
      volumeSeriesRef.current.setData(volData);
      
      // Subscribe to real-time updates
      wsClient.subscribe(activeSymbol, timeframe, (tick: TickEvent) => {
        if (seriesRef.current && volumeSeriesRef.current) {
          seriesRef.current.update({
            time: tick.time as Time,
            open: tick.open,
            high: tick.high,
            low: tick.low,
            close: tick.close
          });
          volumeSeriesRef.current.update({
            time: tick.time as Time,
            value: tick.volume,
            color: tick.close >= tick.open ? upColor : downColor
          });
        }
      });
    }

    return () => {
      wsClient.unsubscribe();
    };
  }, [historicalData, activeSymbol, timeframe, theme]);

  return (
    <div className="w-full h-full relative" ref={chartContainerRef}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50 backdrop-blur-sm z-10">
          <div className="text-text-secondary animate-pulse">Loading chart data...</div>
        </div>
      )}
    </div>
  );
}
