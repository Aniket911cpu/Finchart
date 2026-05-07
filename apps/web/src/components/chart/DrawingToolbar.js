import { useDrawingStore } from '../../store/drawingStore';
import { MousePointer2, TrendingUp, Minus, Square, Menu, Trash2 } from 'lucide-react';
export function DrawingToolbar() {
    const { activeTool, setActiveTool, setDrawings } = useDrawingStore();
    const getToolClass = (tool) => `p-2.5 rounded-lg transition-colors flex items-center justify-center ${activeTool === tool
        ? 'bg-accent-blue/20 text-accent-blue'
        : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}`;
    const handleClearAll = () => {
        if (confirm('Clear all drawings from chart?')) {
            setDrawings([]);
        }
    };
    return (<div className="w-14 border-r border-border bg-bg-secondary flex flex-col items-center py-4 space-y-2">
      <button onClick={() => setActiveTool('cursor')} className={getToolClass('cursor')} title="Cursor / Select">
        <MousePointer2 size={20}/>
      </button>
      
      <div className="w-8 h-px bg-border my-1"></div>

      <button onClick={() => setActiveTool('trendline')} className={getToolClass('trendline')} title="Trendline">
        <TrendingUp size={20}/>
      </button>

      <button onClick={() => setActiveTool('hray')} className={getToolClass('hray')} title="Horizontal Ray">
        <Minus size={20} strokeWidth={3}/>
      </button>

      <button onClick={() => setActiveTool('rectangle')} className={getToolClass('rectangle')} title="Rectangle">
        <Square size={20}/>
      </button>

      <button onClick={() => setActiveTool('fibonacci')} className={getToolClass('fibonacci')} title="Fibonacci Retracement">
        <Menu size={20}/>
      </button>

      <div className="flex-grow"></div>

      <button onClick={handleClearAll} className="p-2.5 rounded-lg transition-colors flex items-center justify-center text-text-secondary hover:text-negative hover:bg-negative/10" title="Clear All Drawings">
        <Trash2 size={20}/>
      </button>
    </div>);
}
//# sourceMappingURL=DrawingToolbar.js.map