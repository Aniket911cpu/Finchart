export interface VWAPDataPoint {
    high: number;
    low: number;
    close: number;
    volume: number;
    time: number;
}
export declare function vwap(data: VWAPDataPoint[]): (number | null)[];
//# sourceMappingURL=vwap.d.ts.map