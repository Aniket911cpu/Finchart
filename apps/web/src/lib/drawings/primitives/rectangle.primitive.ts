import { 
  ISeriesPrimitive, 
  ISeriesPrimitivePaneView, 
  ISeriesPrimitivePaneRenderer, 
  ISeriesApi, 
  Time
} from 'lightweight-charts';
import { Point } from './trendline.primitive';

export interface RectOptions {
  color?: string;
  fillColor?: string;
  width?: number;
}

class RectRenderer implements ISeriesPrimitivePaneRenderer {
  private _series: ISeriesApi<any>;
  private _chart: any;
  private _p1: Point | null;
  private _p2: Point | null;
  private _options: RectOptions;

  constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, p2: Point | null, options: RectOptions) {
    this._series = series;
    this._chart = chart;
    this._p1 = p1;
    this._p2 = p2;
    this._options = options;
  }

  draw(target: any) {
    target.useBitmapCoordinateSpace((scope: any) => {
      if (!this._p1 || !this._p2 || !this._chart) return;

      const ctx = scope.context;
      
      const x1 = this._chart.timeScale().timeToCoordinate(this._p1.time);
      const y1 = this._series.priceToCoordinate(this._p1.price);
      
      const x2 = this._chart.timeScale().timeToCoordinate(this._p2.time);
      const y2 = this._series.priceToCoordinate(this._p2.price);

      if (x1 === null || y1 === null || x2 === null || y2 === null) return;

      const scaledX1 = Math.round(Math.min(x1, x2) * scope.horizontalPixelRatio);
      const scaledY1 = Math.round(Math.min(y1, y2) * scope.verticalPixelRatio);
      const scaledX2 = Math.round(Math.max(x1, x2) * scope.horizontalPixelRatio);
      const scaledY2 = Math.round(Math.max(y1, y2) * scope.verticalPixelRatio);

      const width = scaledX2 - scaledX1;
      const height = scaledY2 - scaledY1;

      ctx.fillStyle = this._options.fillColor || 'rgba(41, 98, 255, 0.2)';
      ctx.fillRect(scaledX1, scaledY1, width, height);

      ctx.strokeStyle = this._options.color || '#2962FF';
      ctx.lineWidth = (this._options.width || 2) * scope.horizontalPixelRatio;
      ctx.strokeRect(scaledX1, scaledY1, width, height);
    });
  }
}

class RectPaneView implements ISeriesPrimitivePaneView {
  private _series: ISeriesApi<any>;
  private _chart: any;
  private _p1: Point | null;
  private _p2: Point | null;
  private _options: RectOptions;

  constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, p2: Point | null, options: RectOptions) {
    this._series = series;
    this._chart = chart;
    this._p1 = p1;
    this._p2 = p2;
    this._options = options;
  }

  zOrder(): 'top' | 'bottom' | 'normal' {
    return 'normal';
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    return new RectRenderer(this._series, this._chart, this._p1, this._p2, this._options);
  }
}

export class RectanglePrimitive implements ISeriesPrimitive {
  private _series: ISeriesApi<any> | null = null;
  private _chart: any = null;
  private _p1: Point | null = null;
  private _p2: Point | null = null;
  private _options: RectOptions;
  
  requestUpdate?: () => void;

  constructor(options: RectOptions = {}) {
    this._options = options;
  }

  attached({ requestUpdate, chart, series }: any) {
    this.requestUpdate = requestUpdate;
    this._series = series;
    this._chart = chart;
  }

  detached() {
    this.requestUpdate = undefined;
    this._series = null;
    this._chart = null;
  }

  updateAllViews() {
    this.requestUpdate?.();
  }

  paneViews() {
    if (!this._series || !this._chart) return [];
    return [new RectPaneView(this._series, this._chart, this._p1, this._p2, this._options)];
  }

  setPoints(p1: Point, p2: Point | null) {
    this._p1 = p1;
    this._p2 = p2;
    this.updateAllViews();
  }
}
