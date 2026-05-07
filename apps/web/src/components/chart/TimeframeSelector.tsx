'use client';
import { useChartStore } from '../../store/chartStore';

const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1D', value: '1D' },
];

export function TimeframeSelector() {
  const timeframe = useChartStore((s) => s.timeframe);
  const setTimeframe = useChartStore((s) => s.setTimeframe);

  return (
    <div className="flex space-x-1 items-center">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setTimeframe(tf.value)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeframe === tf.value
              ? 'bg-accent-blue/10 text-accent-blue font-medium'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
}
