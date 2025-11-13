import { create } from 'zustand';
import { Element } from '../types/builder';

interface BuilderState {
  elements: Element[];
  selectedElement: string | null;
  clipboard: Element | null;
  history: Element[][];
  historyIndex: number;
  
  addElement: (element: Element, parentId?: string) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  reorderElements: (elements: Element[]) => void;
  duplicateElement: (id: string) => void;
  moveLayer: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  copyElement: (id: string) => void;
  pasteElement: () => void;
  undo: () => void;
  redo: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  elements: [],
  selectedElement: null,
  clipboard: null,
  history: [[]],
  historyIndex: 0,

  addElement: (element, parentId) => set((state) => {
    const newElements = parentId
      ? addToParent(state.elements, parentId, element)
      : [...state.elements, element];
    
    return {
      elements: newElements,
      history: [...state.history.slice(0, state.historyIndex + 1), newElements],
      historyIndex: state.historyIndex + 1,
    };
  }),

  updateElement: (id, updates) => set((state) => {
    const newElements = updateRecursive(state.elements, id, updates);
    return {
      elements: newElements,
      history: [...state.history.slice(0, state.historyIndex + 1), newElements],
      historyIndex: state.historyIndex + 1,
    };
  }),

  deleteElement: (id) => set((state) => {
    const newElements = deleteRecursive(state.elements, id);
    return {
      elements: newElements,
      selectedElement: null,
      history: [...state.history.slice(0, state.historyIndex + 1), newElements],
      historyIndex: state.historyIndex + 1,
    };
  }),

  selectElement: (id) => set({ selectedElement: id }),

  reorderElements: (elements) => set((state) => ({
    elements,
    history: [...state.history.slice(0, state.historyIndex + 1), elements],
    historyIndex: state.historyIndex + 1,
  })),

  duplicateElement: (id) => set((state) => {
    const element = findElement(state.elements, id);
    if (!element) return state;
    
    const duplicated = {
      ...JSON.parse(JSON.stringify(element)),
      id: `element-${Date.now()}`,
      style: {
        ...element.style,
        left: element.style.left ? `${parseInt(element.style.left) + 20}px` : undefined,
        top: element.style.top ? `${parseInt(element.style.top) + 20}px` : undefined,
      }
    };
    
    return {
      elements: [...state.elements, duplicated],
      history: [...state.history.slice(0, state.historyIndex + 1), [...state.elements, duplicated]],
      historyIndex: state.historyIndex + 1,
    };
  }),

  moveLayer: (id, direction) => set((state) => {
    const index = state.elements.findIndex(el => el.id === id);
    if (index === -1) return state;
    
    const newElements = [...state.elements];
    const [element] = newElements.splice(index, 1);
    
    let newIndex = index;
    if (direction === 'up') newIndex = Math.min(index + 1, newElements.length);
    if (direction === 'down') newIndex = Math.max(index - 1, 0);
    if (direction === 'top') newIndex = newElements.length;
    if (direction === 'bottom') newIndex = 0;
    
    newElements.splice(newIndex, 0, element);
    
    return {
      elements: newElements,
      history: [...state.history.slice(0, state.historyIndex + 1), newElements],
      historyIndex: state.historyIndex + 1,
    };
  }),

  copyElement: (id) => set((state) => {
    const element = findElement(state.elements, id);
    return { clipboard: element || null };
  }),

  pasteElement: () => set((state) => {
    if (!state.clipboard) return state;
    
    const pasted = {
      ...JSON.parse(JSON.stringify(state.clipboard)),
      id: `element-${Date.now()}`,
      style: {
        ...state.clipboard.style,
        left: state.clipboard.style.left ? `${parseInt(state.clipboard.style.left) + 20}px` : undefined,
        top: state.clipboard.style.top ? `${parseInt(state.clipboard.style.top) + 20}px` : undefined,
      }
    };
    
    return {
      elements: [...state.elements, pasted],
      history: [...state.history.slice(0, state.historyIndex + 1), [...state.elements, pasted]],
      historyIndex: state.historyIndex + 1,
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    return {
      elements: state.history[state.historyIndex - 1],
      historyIndex: state.historyIndex - 1,
    };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    return {
      elements: state.history[state.historyIndex + 1],
      historyIndex: state.historyIndex + 1,
    };
  }),
}));

// Helper functions
function addToParent(els: Element[], parentId: string, element: Element): Element[] {
  return els.map((el) =>
    el.id === parentId
      ? { ...el, children: [...(el.children || []), element] }
      : el.children
      ? { ...el, children: addToParent(el.children, parentId, element) }
      : el
  );
}

function updateRecursive(els: Element[], id: string, updates: Partial<Element>): Element[] {
  return els.map((el) =>
    el.id === id
      ? { ...el, ...updates }
      : el.children
      ? { ...el, children: updateRecursive(el.children, id, updates) }
      : el
  );
}

function deleteRecursive(els: Element[], id: string): Element[] {
  return els.filter((el) => el.id !== id).map((el) =>
    el.children ? { ...el, children: deleteRecursive(el.children, id) } : el
  );
}

export function findElement(elements: Element[], id: string | null): Element | null {
  if (!id) return null;
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElement(el.children, id);
      if (found) return found;
    }
  }
  return null;
}
