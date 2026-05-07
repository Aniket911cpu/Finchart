import { IChartApi, ISeriesApi, MouseEventParams, Time } from 'lightweight-charts';
import { TrendlinePrimitive, Point } from './primitives/trendline.primitive';
import { HorizontalRayPrimitive } from './primitives/horizontal-ray.primitive';
import { RectanglePrimitive } from './primitives/rectangle.primitive';
import { FibonacciPrimitive } from './primitives/fibonacci.primitive';
import { useDrawingStore, SerializedDrawing, DrawingToolType } from '../../store/drawingStore';
import { v4 as uuidv4 } from 'uuid';

export class DrawingManager {
  private _chart: IChartApi;
  private _series: ISeriesApi<any>;
  private _activePrimitive: any = null;
  private _p1: Point | null = null;
  private _isDrawing = false;
  private _primitives: Map<string, any> = new Map();

  private _clickHandler = this._onClick.bind(this);
  private _crosshairHandler = this._onCrosshairMove.bind(this);
  private _keydownHandler = this._onKeyDown.bind(this);

  constructor(chart: IChartApi, series: ISeriesApi<any>) {
    this._chart = chart;
    this._series = series;

    this._chart.subscribeClick(this._clickHandler);
    this._chart.subscribeCrosshairMove(this._crosshairHandler);
    window.addEventListener('keydown', this._keydownHandler);

    // Subscribe to Zustand store to sync drawings
    useDrawingStore.subscribe((state, prevState) => {
      if (state.drawings !== prevState.drawings) {
        this._syncDrawings(state.drawings);
      }
    });
  }

  destroy() {
    this._chart.unsubscribeClick(this._clickHandler);
    this._chart.unsubscribeCrosshairMove(this._crosshairHandler);
    window.removeEventListener('keydown', this._keydownHandler);
    
    // Cleanup primitives
    this._primitives.forEach(primitive => {
      this._series.detachPrimitive(primitive);
    });
    this._primitives.clear();
    
    if (this._activePrimitive) {
      this._series.detachPrimitive(this._activePrimitive);
    }
  }

  private _onClick(param: MouseEventParams) {
    const activeTool = useDrawingStore.getState().activeTool;
    if (activeTool === 'cursor' || !param.time || !param.point) return;

    const price = this._series.coordinateToPrice(param.point.y);
    if (price === null) return;

    const point: Point = { time: param.time, price };

    if (!this._isDrawing) {
      // First click
      this._isDrawing = true;
      this._p1 = point;
      this._activePrimitive = this._createPrimitive(activeTool);
      this._activePrimitive.setPoints(this._p1, this._p1);
      this._series.attachPrimitive(this._activePrimitive);
      
      // Horizontal ray is a single-click tool conceptually but we still define p1
      if (activeTool === 'hray') {
        this._finalizeDrawing(activeTool, point);
      }
    } else {
      // Second click
      this._finalizeDrawing(activeTool, point);
    }
  }

  private _onCrosshairMove(param: MouseEventParams) {
    if (!this._isDrawing || !this._activePrimitive || !this._p1) return;

    if (!param.time || !param.point) return;

    const price = this._series.coordinateToPrice(param.point.y);
    if (price === null) return;

    const currentPoint: Point = { time: param.time, price };
    this._activePrimitive.setPoints(this._p1, currentPoint);
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this._isDrawing) {
      this._cancelDrawing();
    }
  }

  private _createPrimitive(tool: DrawingToolType) {
    switch (tool) {
      case 'trendline': return new TrendlinePrimitive();
      case 'hray': return new HorizontalRayPrimitive();
      case 'rectangle': return new RectanglePrimitive();
      case 'fibonacci': return new FibonacciPrimitive();
      default: throw new Error('Unknown tool');
    }
  }

  private _finalizeDrawing(tool: DrawingToolType, p2: Point) {
    if (!this._p1) return;

    const id = uuidv4();
    const points = [
      { time: this._p1.time as number | string, price: this._p1.price }
    ];
    
    if (tool !== 'hray') {
      points.push({ time: p2.time as number | string, price: p2.price });
    }

    const drawing: SerializedDrawing = {
      id,
      type: tool,
      points,
    };

    useDrawingStore.getState().addDrawing(drawing);
    useDrawingStore.getState().setActiveTool('cursor');

    this._cancelDrawing(); // Resets local state without removing from store
  }

  private _cancelDrawing() {
    this._isDrawing = false;
    this._p1 = null;
    if (this._activePrimitive) {
      this._series.detachPrimitive(this._activePrimitive);
      this._activePrimitive = null;
    }
  }

  private _syncDrawings(drawings: SerializedDrawing[]) {
    // 1. Remove primitives that are no longer in state
    const currentIds = new Set(drawings.map(d => d.id));
    this._primitives.forEach((primitive, id) => {
      if (!currentIds.has(id)) {
        this._series.detachPrimitive(primitive);
        this._primitives.delete(id);
      }
    });

    // 2. Add or update primitives
    drawings.forEach(d => {
      if (!this._primitives.has(d.id)) {
        const primitive = this._createPrimitive(d.type);
        const p1: Point = { time: d.points[0].time as Time, price: d.points[0].price };
        const p2: Point | null = d.points[1] ? { time: d.points[1].time as Time, price: d.points[1].price } : null;
        
        primitive.setPoints(p1, p2);
        this._series.attachPrimitive(primitive);
        this._primitives.set(d.id, primitive);
      }
    });
  }
}
