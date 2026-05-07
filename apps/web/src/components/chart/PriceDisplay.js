import { useMarketData } from '../../hooks/useMarketData';
import { useChartStore } from '../../store/chartStore';
import { useEffect, useState } from 'react';
import { wsClient } from '../../lib/ws-client';
import { TrendingUp, TrendingDown } from 'lucide-react';
export function PriceDisplay() {
    const activeSymbol = useChartStore(s => s.activeSymbol);
    const timeframe = useChartStore(s => s.timeframe);
    const { data: historicalData } = useMarketData(activeSymbol, timeframe);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [priceChange, setPriceChange] = useState(0);
    const [priceChangePercent, setPriceChangePercent] = useState(0);
    useEffect(() => {
        if (historicalData && historicalData.length > 0) {
            const last = historicalData[historicalData.length - 1];
            const prev = historicalData[historicalData.length - 2] || last;
            setCurrentPrice(last.close);
            setPriceChange(last.close - prev.close);
            setPriceChangePercent(((last.close - prev.close) / prev.close) * 100);
        }
    }, [historicalData]);
    useEffect(() => {
        const handleTick = (tick) => {
            setCurrentPrice(prev => {
                if (prev !== null) {
                    setPriceChange(tick.close - prev);
                    setPriceChangePercent(((tick.close - prev) / prev) * 100);
                }
                return tick.close;
            });
        };
        wsClient.subscribe(activeSymbol, timeframe, handleTick);
        return () => {
            // Handled by chartEngine's unmount or we can leave it
        };
    }, [activeSymbol, timeframe]);
    if (currentPrice === null)
        return null;
    const isPositive = priceChange >= 0;
    return (<div className="flex items-center space-x-3 absolute top-4 left-4 z-10 pointer-events-none select-none">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight bg-bg-secondary/50 backdrop-blur-md px-2 py-0.5 rounded border border-border/50">
        {activeSymbol}
      </h1>
      
      <div className={`flex items-baseline space-x-2 bg-bg-secondary/50 backdrop-blur-md px-3 py-1 rounded border border-border/50 ${isPositive ? 'text-positive' : 'text-negative'}`}>
        <span className="text-xl font-bold">{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
        
        <div className="flex items-center space-x-1 text-sm font-medium">
          {isPositive ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
          <span>{Math.abs(priceChange).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <span>({Math.abs(priceChangePercent).toFixed(2)}%)</span>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=PriceDisplay.js.map