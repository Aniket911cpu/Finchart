import { ISeriesPrimitive, ISeriesPrimitivePaneView, ISeriesPrimitivePaneRenderer, ISeriesApi, Time } from 'lightweight-charts';
export interface Point {
    time: Time;
    price: number;
}
export interface TrendlineOptions {
    color?: string;
    width?: number;
    isRay?: boolean;
}
declare class TrendlinePaneView implements ISeriesPrimitivePaneView {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    constructor(series: ISeriesApi<any>, chart: any, p1: Point | null, p2: Point | null, options: TrendlineOptions);
    zOrder(): 'top' | 'bottom' | 'normal';
    renderer(): ISeriesPrimitivePaneRenderer | null;
}
export declare class TrendlinePrimitive implements ISeriesPrimitive {
    private _series;
    private _chart;
    private _p1;
    private _p2;
    private _options;
    requestUpdate?: () => void;
    constructor(options?: TrendlineOptions);
    attached({ requestUpdate, chart, series }: any): void;
    detached(): void;
    updateAllViews(): void;
    paneViews(): TrendlinePaneView[];
    setPoints(p1: Point, p2: Point | null): void;
}
export {};
//# sourceMappingURL=trendline.primitive.d.ts.map