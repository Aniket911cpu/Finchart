import { ISeriesPrimitive, ISeriesPrimitivePaneView, ISeriesPrimitivePaneRenderer, ISeriesApi } from 'lightweight-charts';
import { Point } from './trendline.primitive';
export interface RectOptions {
    color?: string;
    fillColor?: string;
    width?: number;
}
declare class RectPaneView implements ISeriesPrimitivePaneView {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, p2: Point | null, options: RectOptions);
    zOrder(): 'top' | 'bottom' | 'normal';
    renderer(): ISeriesPrimitivePaneRenderer | null;
}
export declare class RectanglePrimitive implements ISeriesPrimitive {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    requestUpdate?: () => void;
    constructor(options?: RectOptions);
    attached({ requestUpdate, chart, series }: any): void;
    detached(): void;
    updateAllViews(): void;
    paneViews(): RectPaneView[];
    setPoints(p1: Point, p2: Point | null): void;
}
export {};
//# sourceMappingURL=rectangle.primitive.d.ts.map