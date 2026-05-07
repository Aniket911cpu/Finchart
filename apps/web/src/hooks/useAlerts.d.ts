export interface Alert {
    id: string;
    symbol: string;
    condition: 'ABOVE' | 'BELOW' | 'CROSS';
    price: number;
    message: string;
    createdAt: string;
    triggered: boolean;
}
export declare function useAlerts(): {
    alerts: Alert[] | undefined;
    isLoading: boolean;
    createAlert: import("@tanstack/react-query").UseMutationResult<unknown, Error, Omit<Alert, "id" | "createdAt" | "triggered">, unknown>;
    deleteAlert: import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
};
//# sourceMappingURL=useAlerts.d.ts.map