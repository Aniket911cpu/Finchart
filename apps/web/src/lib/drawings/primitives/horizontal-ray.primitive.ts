import { 
  ISeriesPrimitive, 
  ISeriesPrimitivePaneView, 
  ISeriesPrimitivePaneRenderer, 
  ISeriesApi, 
  Time
} from 'lightweight-charts';
import { Point } from './trendline.primitive';

export interface HRayOptions {
  color?: string;
  width?: number;
}

class HRayRenderer implements ISeriesPrimitivePaneRenderer {
  private _series: ISeriesApi<any>;
  private _chart: any;
  private _p1: Point | null;
  private _options: HRayOptions;

  constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, options: HRayOptions) {
    this._series = series;
    this._chart = chart;
    this._p1 = p1;
    this._options = options;
  }

  draw(target: any) {
    target.useBitmapCoordinateSpace((scope: any) => {
      if (!this._p1 || !this._chart) return;

      const ctx = scope.context;
      
      const x1 = this._chart.timeScale().timeToCoordinate(this._p1.time);
      const y1 = this._series.priceToCoordinate(this._p1.price);

      if (x1 === null || y1 === null) return;

      const scaledX1 = Math.round(x1 * scope.horizontalPixelRatio);
      const scaledY1 = Math.round(y1 * scope.verticalPixelRatio);
      
      // Get the width of the canvas to draw the ray to the end
      const canvasWidth = scope.mediaSize.width * scope.horizontalPixelRatio;

      ctx.beginPath();
      ctx.moveTo(scaledX1, scaledY1);
      ctx.lineTo(canvasWidth, scaledY1);

      ctx.strokeStyle = this._options.color || '#2962FF';
      ctx.lineWidth = (this._options.width || 2) * scope.horizontalPixelRatio;
      ctx.stroke();
    });
  }
}

class HRayPaneView implements ISeriesPrimitivePaneView {
  private _series: ISeriesApi<any>;
  private _chart: any;
  private _p1: Point | null;
  private _options: HRayOptions;

  constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, options: HRayOptions) {
    this._series = series;
    this._chart = chart;
    this._p1 = p1;
    this._options = options;
  }

  zOrder(): 'top' | 'bottom' | 'normal' {
    return 'top';
  }

  renderer(): ISeriesPrimitivePaneRenderer | null {
    return new HRayRenderer(this._series, this._chart, this._p1, this._options);
  }
}

export class HorizontalRayPrimitive implements ISeriesPrimitive {
  private _series: ISeriesApi<any> | null = null;
  private _chart: any = null;
  private _p1: Point | null = null;
  private _options: HRayOptions;
  
  requestUpdate?: () => void;

  constructor(options: HRayOptions = {}) {
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
    return [new HRayPaneView(this._series, this._chart, this._p1, this._options)];
  }

  setPoints(p1: Point, p2: Point | null) {
    this._p1 = p1;
    // p2 is ignored for horizontal ray as it only needs one anchor
    this.updateAllViews();
  }
}
