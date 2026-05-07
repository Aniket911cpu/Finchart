import { ISeriesPrimitive, ISeriesPrimitivePaneView, ISeriesPrimitivePaneRenderer, ISeriesApi } from 'lightweight-charts';
import { Point } from './trendline.primitive';
export interface HRayOptions {
    color?: string;
    width?: number;
}
declare class HRayPaneView implements ISeriesPrimitivePaneView {
    private _series;
    private _chart;
    private _p1;
    private _options;
    constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, options: HRayOptions);
    zOrder(): 'top' | 'bottom' | 'normal';
    renderer(): ISeriesPrimitivePaneRenderer | null;
}
export declare class HorizontalRayPrimitive implements ISeriesPrimitive {
    private _series;
    private _chart;
    private _p1;
    private _options;
    requestUpdate?: () => void;
    constructor(options?: HRayOptions);
    attached({ requestUpdate, chart, series }: any): void;
    detached(): void;
    updateAllViews(): void;
    paneViews(): HRayPaneView[];
    setPoints(p1: Point, p2: Point | null): void;
}
export {};
//# sourceMappingURL=horizontal-ray.primitive.d.ts.map