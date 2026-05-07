import { TrendlinePrimitive } from './primitives/trendline.primitive';
import { HorizontalRayPrimitive } from './primitives/horizontal-ray.primitive';
import { RectanglePrimitive } from './primitives/rectangle.primitive';
import { FibonacciPrimitive } from './primitives/fibonacci.primitive';
import { useDrawingStore } from '../../store/drawingStore';
import { v4 as uuidv4 } from 'uuid';
export class DrawingManager {
    _chart;
    _series;
    _activePrimitive = null;
    _p1 = null;
    _isDrawing = false;
    _primitives = new Map();
    _clickHandler = this._onClick.bind(this);
    _crosshairHandler = this._onCrosshairMove.bind(this);
    _keydownHandler = this._onKeyDown.bind(this);
    constructor(chart, series) {
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
    _onClick(param) {
        const activeTool = useDrawingStore.getState().activeTool;
        if (activeTool === 'cursor' || !param.time || !param.point)
            return;
        const price = this._series.coordinateToPrice(param.point.y);
        if (price === null)
            return;
        const point = { time: param.time, price };
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
        }
        else {
            // Second click
            this._finalizeDrawing(activeTool, point);
        }
    }
    _onCrosshairMove(param) {
        if (!this._isDrawing || !this._activePrimitive || !this._p1)
            return;
        if (!param.time || !param.point)
            return;
        const price = this._series.coordinateToPrice(param.point.y);
        if (price === null)
            return;
        const currentPoint = { time: param.time, price };
        this._activePrimitive.setPoints(this._p1, currentPoint);
    }
    _onKeyDown(e) {
        if (e.key === 'Escape' && this._isDrawing) {
            this._cancelDrawing();
        }
    }
    _createPrimitive(tool) {
        switch (tool) {
            case 'trendline': return new TrendlinePrimitive();
            case 'hray': return new HorizontalRayPrimitive();
            case 'rectangle': return new RectanglePrimitive();
            case 'fibonacci': return new FibonacciPrimitive();
            default: throw new Error('Unknown tool');
        }
    }
    _finalizeDrawing(tool, p2) {
        if (!this._p1)
            return;
        const id = uuidv4();
        const points = [
            { time: this._p1.time, price: this._p1.price }
        ];
        if (tool !== 'hray') {
            points.push({ time: p2.time, price: p2.price });
        }
        const drawing = {
            id,
            type: tool,
            points,
        };
        useDrawingStore.getState().addDrawing(drawing);
        useDrawingStore.getState().setActiveTool('cursor');
        this._cancelDrawing(); // Resets local state without removing from store
    }
    _cancelDrawing() {
        this._isDrawing = false;
        this._p1 = null;
        if (this._activePrimitive) {
            this._series.detachPrimitive(this._activePrimitive);
            this._activePrimitive = null;
        }
    }
    _syncDrawings(drawings) {
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
                const p1 = { time: d.points[0].time, price: d.points[0].price };
                const p2 = d.points[1] ? { time: d.points[1].time, price: d.points[1].price } : null;
                primitive.setPoints(p1, p2);
                this._series.attachPrimitive(primitive);
                this._primitives.set(d.id, primitive);
            }
        });
    }
}
//# sourceMappingURL=drawing-manager.js.map