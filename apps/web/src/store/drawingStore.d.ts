export type DrawingToolType = 'cursor' | 'trendline' | 'hray' | 'rectangle' | 'fibonacci';
export interface SerializedDrawing {
    id: string;
    type: DrawingToolType;
    points: {
        time: number | string;
        price: number;
    }[];
    options?: any;
}
interface DrawingState {
    activeTool: DrawingToolType;
    drawings: SerializedDrawing[];
    setActiveTool: (tool: DrawingToolType) => void;
    addDrawing: (drawing: SerializedDrawing) => void;
    removeDrawing: (id: string) => void;
    setDrawings: (drawings: SerializedDrawing[]) => void;
}
export declare const useDrawingStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DrawingState>>;
export {};
//# sourceMappingURL=drawingStore.d.ts.map