import { create } from 'zustand';
export const useDrawingStore = create((set) => ({
    activeTool: 'cursor',
    drawings: [],
    setActiveTool: (tool) => set({ activeTool: tool }),
    addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
    removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
    setDrawings: (drawings) => set({ drawings }),
}));
//# sourceMappingURL=drawingStore.js.map