import { useChartStore } from '../../store/chartStore';
import { BarChart3, LineChart, CandlestickChart } from 'lucide-react';

export function ChartTypeSelector() {
  const { chartType, setChartType } = useChartStore();

  const getClass = (type: string) => 
    `p-1.5 rounded transition-colors ${
      chartType === type 
        ? 'bg-accent-blue/20 text-accent-blue' 
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
    }`;

  return (
    <div className="flex items-center space-x-1">
      <button 
        onClick={() => setChartType('candlestick')} 
        className={getClass('candlestick')}
        title="Candles"
      >
        <CandlestickChart size={18} />
      </button>
      <button 
        onClick={() => setChartType('line')} 
        className={getClass('line')}
        title="Line"
      >
        <LineChart size={18} />
      </button>
      <button 
        onClick={() => setChartType('area')} 
        className={getClass('area')}
        title="Area"
      >
        <BarChart3 size={18} />
      </button>
    </div>
  );
}
