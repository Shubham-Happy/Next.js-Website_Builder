import { create } from 'zustand';
import { Element } from '../types/builder';

interface BuilderState {
  elements: Element[];
  selectedElement: string | null;
  
  // Actions
  addElement: (element: Element, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  reorderElements: (elements: Element[]) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  elements: [],
  selectedElement: null,

  addElement: (element, parentId) => set((state) => {
    if (parentId) {
      // Add to container's children
      const addToParent = (els: Element[]): Element[] =>
        els.map((el) =>
          el.id === parentId
            ? { ...el, children: [...(el.children || []), element] }
            : el.children
            ? { ...el, children: addToParent(el.children) }
            : el
        );
      return { elements: addToParent(state.elements) };
    }
    return { elements: [...state.elements, element] };
  }),

  updateElement: (id, updates) => set((state) => {
    const updateRecursive = (els: Element[]): Element[] =>
      els.map((el) =>
        el.id === id
          ? { ...el, ...updates }
          : el.children
          ? { ...el, children: updateRecursive(el.children) }
          : el
      );
    return { elements: updateRecursive(state.elements) };
  }),

  deleteElement: (id) => set((state) => {
    const deleteRecursive = (els: Element[]): Element[] =>
      els.filter((el) => el.id !== id).map((el) =>
        el.children ? { ...el, children: deleteRecursive(el.children) } : el
      );
    return { elements: deleteRecursive(state.elements), selectedElement: null };
  }),

  selectElement: (id) => set({ selectedElement: id }),

  reorderElements: (elements) => set({ elements }),
}));
