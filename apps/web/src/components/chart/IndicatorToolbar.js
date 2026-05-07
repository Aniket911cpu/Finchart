import { useChartStore } from '../../store/chartStore';
import { Activity, TrendingUp } from 'lucide-react';
export function IndicatorToolbar() {
    const { indicators, toggleIndicator } = useChartStore();
    const toggleClass = (isActive) => `px-3 py-1 text-xs font-medium rounded-md transition-colors ${isActive
        ? 'bg-accent-blue/20 text-accent-blue'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}`;
    return (<div className="flex items-center space-x-2 px-4 py-2 border-b border-border bg-bg-secondary overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-1 border-r border-border pr-2 mr-1">
        <TrendingUp size={14} className="text-text-muted"/>
        <span className="text-xs text-text-muted font-medium ml-1 mr-2 uppercase tracking-wider">Overlays</span>
        <button onClick={() => toggleIndicator('sma20')} className={toggleClass(indicators.sma20)}>SMA 20</button>
        <button onClick={() => toggleIndicator('ema9')} className={toggleClass(indicators.ema9)}>EMA 9</button>
        <button onClick={() => toggleIndicator('ema21')} className={toggleClass(indicators.ema21)}>EMA 21</button>
        <button onClick={() => toggleIndicator('bb20')} className={toggleClass(indicators.bb20)}>BB 20</button>
        <button onClick={() => toggleIndicator('vwap')} className={toggleClass(indicators.vwap)}>VWAP</button>
      </div>
      
      <div className="flex items-center space-x-1">
        <Activity size={14} className="text-text-muted ml-2"/>
        <span className="text-xs text-text-muted font-medium ml-1 mr-2 uppercase tracking-wider">Oscillators</span>
        <button onClick={() => toggleIndicator('rsi14')} className={toggleClass(indicators.rsi14)}>RSI 14</button>
        <button onClick={() => toggleIndicator('macd')} className={toggleClass(indicators.macd)}>MACD</button>
      </div>
    </div>);
}
//# sourceMappingURL=IndicatorToolbar.js.map