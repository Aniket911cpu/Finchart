export declare function fetchUDFHistory(symbol: string, resolution: string, from: number, to: number): Promise<{
    time: any;
    open: any;
    high: any;
    low: any;
    close: any;
    volume: any;
}[]>;
export declare function searchUDFSymbols(query: string): Promise<any>;
export declare const apiClient: {
    get: <T>(path: string) => Promise<{
        data: T;
    }>;
    post: <T>(path: string, body: any) => Promise<{
        data: T;
    }>;
    delete: <T>(path: string) => Promise<{
        data: T;
    }>;
};
//# sourceMappingURL=api-client.d.ts.map