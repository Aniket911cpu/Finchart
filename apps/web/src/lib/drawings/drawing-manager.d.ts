import { IChartApi, ISeriesApi } from 'lightweight-charts';
export declare class DrawingManager {
    private _chart;
    private _series;
    private _activePrimitive;
    private _p1;
    private _isDrawing;
    private _primitives;
    private _clickHandler;
    private _crosshairHandler;
    private _keydownHandler;
    constructor(chart: IChartApi, series: ISeriesApi<any>);
    destroy(): void;
    private _onClick;
    private _onCrosshairMove;
    private _onKeyDown;
    private _createPrimitive;
    private _finalizeDrawing;
    private _cancelDrawing;
    private _syncDrawings;
}
//# sourceMappingURL=drawing-manager.d.ts.map