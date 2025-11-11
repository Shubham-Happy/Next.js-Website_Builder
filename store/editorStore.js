import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";

export const useEditorStore = create((set) => ({
  nodes: [],
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, { id: nanoid(), ...node }],
    })),
  setNodes: (nodes) => set({ nodes }),
  reset: () => set({ nodes: [] }),
}));
