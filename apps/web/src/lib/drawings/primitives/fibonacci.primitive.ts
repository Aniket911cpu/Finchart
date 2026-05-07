import { 
  ISeriesPrimitive, 
  ISeriesPrimitivePaneView, 
  ISeriesPrimitivePaneRenderer, 
  ISeriesApi, 
} from 'lightweight-charts';
import { Point } from './trendline.primitive';

export interface FibOptions {
  color?: string;
  width?: number;
}

const FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
const FIB_COLORS = ['#787B86', '#F44336', '#81C784', '#4CAF50', '#009688', '#64B5F6', '#787B86'];

class FibRenderer implements ISeriesPrimitivePaneRenderer {
  private _series: ISeriesApi<any>;
  private _p1: Point | null;
  private _p2: Point | null;
  private _options: FibOptions;

  constructor(series: ISeriesApi<any>, p1: Point | null, p2: Point | null, options: FibOptions) {
    this._series = series;
    this._p1 = p1;
    this._p2 = p2;
    this._options = options;
  }

  draw(target: any) {
    target.useBitmapCoordinateSpace((scope: any) => {
      if (!this._p1 || !this._p2) return;

      const ctx = scope.context;
      
      const x1 = this._series.priceScale().timeScale().timeToCoordinate(this._p1.time);
      const y1 = this._series.priceToCoordinate(this._p1.price);
      
      const x2 = this._series.priceScale().timeScale().timeToCoordinate(this._p2.time);
      const y2 = this._series.priceToCoordinate(this._p2.price);

      if (x1 === null || y1 === null || x2 === null || y2 === null) return;

      const scaledX1 = Math.round(x1 * scope.horizontalPixelRatio);
      const scaledY1 = Math.round(y1 * scope.verticalPixelRatio);
      const scaledX2 = Math.round(x2 * scope.horizontalPixelRatio);
      const scaledY2 = Math.round(y2 * scope.verticalPixelRatio);

      const priceDiff = this._p2.price - this._p1.price;
      const canvasWidth = scope.mediaSize.width * scope.horizontalPixelRatio;

      // Draw trendline
      ctx.beginPath();
      ctx.moveTo(scaledX1, scaledY1);
      ctx.lineTo(scaledX2, scaledY2);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = this._options.color || '#787B86';
      ctx.lineWidth = (this._options.width || 1) * scope.horizontalPixelRatio;
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw fib levels
      for (let i = 0; i < FIB_LEVELS.length; i++) {
        const level = FIB_LEVELS[i];
        const price = this._p1.price + priceDiff * level;
        const y = this._series.priceToCoordinate(price);
        
        if (y === null) continue;
        
        const scaledY = Math.round(y * scope.verticalPixelRatio);

        ctx.beginPath();
        // Start from x1 and extend to the right edge
        ctx.moveTo(scaledX1, scaledY);
        ctx.lineTo(canvasWidth, scaledY);
        ctx.strokeStyle = FIB_COLORS[i];
        ctx.lineWidth = 1 * scope.horizontalPixelRatio;
        ctx.stroke();

        // Draw level text
        ctx.fillStyle = FIB_COLORS[i];
        ctx.font = `${12 * scope.horizontalPixelRatio}px Arial`;
        ctx.fillText(`${(level * 100).toFixed(1)}% (${price.toFixed(2)})`, scaledX1 + 5 * scope.horizontalPixelRatio, scaledY - 5 * scope.verticalPixelRatio);
      }
    });
  }
}

class FibPaneView implements ISeriesPrimitivePaneView {
  private _series: ISeriesApi<any>;
  private _p1: Point | null;
  private _p2: Point | null;
  private _options: FibOptions;

  constructor(series: ISeriesApi<any>, p1: Point | null, p2: Point | null, options: FibOptions) {
    this._series = series;
    this._p1 = p1;
    this._p2 = p2;
    this._options = options;
  }

  zOrder(): 'top' | 'bottom' | 'normal' {
    return 'normal';
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    return new FibRenderer(this._series, this._p1, this._p2, this._options);
  }
}

export class FibonacciPrimitive implements ISeriesPrimitive {
  private _series: ISeriesApi<any> | null = null;
  private _p1: Point | null = null;
  private _p2: Point | null = null;
  private _options: FibOptions;
  
  requestUpdate?: () => void;

  constructor(options: FibOptions = {}) {
    this._options = options;
  }

  attached({ requestUpdate, chart, series }: any) {
    this.requestUpdate = requestUpdate;
    this._series = series;
  }

  detached() {
    this.requestUpdate = undefined;
    this._series = null;
  }

  updateAllViews() {
    this.requestUpdate?.();
  }

  paneViews() {
    if (!this._series) return [];
    return [new FibPaneView(this._series, this._p1, this._p2, this._options)];
  }

  setPoints(p1: Point, p2: Point | null) {
    this._p1 = p1;
    this._p2 = p2;
    this.updateAllViews();
  }
}
