import { ISeriesPrimitive, ISeriesPrimitivePaneView, ISeriesPrimitivePaneRenderer, ISeriesApi } from 'lightweight-charts';
import { Point } from './trendline.primitive';
export interface FibOptions {
    color?: string;
    width?: number;
}
declare class FibPaneView implements ISeriesPrimitivePaneView {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, p2: Point | null, options: FibOptions);
    zOrder(): 'top' | 'bottom' | 'normal';
    renderer(): ISeriesPrimitivePaneRenderer | null;
}
export declare class FibonacciPrimitive implements ISeriesPrimitive {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    requestUpdate?: () => void;
    constructor(options?: FibOptions);
    attached({ requestUpdate, chart, series }: any): void;
    detached(): void;
    updateAllViews(): void;
    paneViews(): FibPaneView[];
    setPoints(p1: Point, p2: Point | null): void;
}
export {};
//# sourceMappingURL=fibonacci.primitive.d.ts.map