import { create } from 'zustand';

export type DrawingToolType = 'cursor' | 'trendline' | 'hray' | 'rectangle' | 'fibonacci';

export interface SerializedDrawing {
  id: string;
  type: DrawingToolType;
  points: { time: number | string; price: number }[];
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

export const useDrawingStore = create<DrawingState>((set) => ({
  activeTool: 'cursor',
  drawings: [],
  setActiveTool: (tool) => set({ activeTool: tool }),
  addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
  removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
  setDrawings: (drawings) => set({ drawings }),
}));
