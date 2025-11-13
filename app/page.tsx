'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import { Sidebar } from '../components/Builder/Sidebar';
import { Canvas } from '../components/Builder/Canvas';
import { PropertiesPanel } from '../components/Builder/PropertiesPanel';
import { CodeExporter } from '../components/Builder/CodeExporter';
import { useBuilderStore } from '../store/builderStore';
import { Element, ElementType } from '../types/builder';

export default function BuilderPage() {
  const { elements, addElement, reorderElements } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Dropping from palette to canvas
    if (active.id.toString().startsWith('palette-') && over.id === 'canvas') {
      const type = active.data.current?.type as ElementType;
      const newElement: Element = {
        id: `element-${Date.now()}`,
        type,
        style: getDefaultStyle(type),
        content: getDefaultContent(type),
        children: type === 'container' ? [] : undefined,
      };
      addElement(newElement);
    }

    // Reordering elements in canvas
    if (!active.id.toString().startsWith('palette-') && active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderElements(arrayMove(elements, oldIndex, newIndex));
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">⚡ Visual Website Builder</h1>
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              {showCode ? '🎨 Builder' : '💻 View Code'}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {showCode ? (
            <CodeExporter />
          ) : (
            <>
              <Sidebar />
              <Canvas />
              <PropertiesPanel />
            </>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId ? <div className="p-4 bg-blue-100 rounded shadow">Dragging...</div> : null}
      </DragOverlay>
    </DndContext>
  );
}

// Helper functions
function getDefaultStyle(type: ElementType) {
  const defaults = {
    container: { backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' },
    heading: { fontSize: '32px', fontWeight: 'bold', color: '#1f2937' },
    text: { fontSize: '16px', color: '#4b5563' },
    button: { backgroundColor: '#3b82f6', color: '#ffffff', padding: '12px 24px', borderRadius: '6px' },
    image: { width: '100%', height: 'auto', borderRadius: '8px' },
  };
  return defaults[type] || {};
}

function getDefaultContent(type: ElementType) {
  const contents = {
    heading: 'Your Awesome Heading',
    text: 'Add your text content here. Double click to edit.',
    button: 'Click Me',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  };
  return contents[type as keyof typeof contents] || '';
}
