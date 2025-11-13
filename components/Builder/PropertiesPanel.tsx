'use client';

import { useBuilderStore } from '../../store/builderStore';
import { useState, useEffect } from 'react';

export function PropertiesPanel() {
  const { elements, selectedElement, updateElement } = useBuilderStore();
  const selected = findElement(elements, selectedElement);

  const [localContent, setLocalContent] = useState('');
  const [localStyle, setLocalStyle] = useState(selected?.style || {});

  useEffect(() => {
    if (selected) {
      setLocalContent(selected.content || '');
      setLocalStyle(selected.style);
    }
  }, [selected]);

  if (!selected) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-gray-400 text-center mt-8">Select an element to edit</p>
      </div>
    );
  }

  const handleUpdate = () => {
    if (selectedElement) {
      updateElement(selectedElement, { content: localContent, style: localStyle });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Properties</h2>

      <div className="space-y-4">
        {/* Content */}
        {selected.type !== 'container' && (
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <input
              type="text"
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              onBlur={handleUpdate}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        )}

        {/* Styles */}
        <div>
          <label className="block text-sm font-medium mb-1">Background Color</label>
          <input
            type="color"
            value={localStyle.backgroundColor || '#ffffff'}
            onChange={(e) => setLocalStyle({ ...localStyle, backgroundColor: e.target.value })}
            onBlur={handleUpdate}
            className="w-full h-10 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Text Color</label>
          <input
            type="color"
            value={localStyle.color || '#000000'}
            onChange={(e) => setLocalStyle({ ...localStyle, color: e.target.value })}
            onBlur={handleUpdate}
            className="w-full h-10 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Padding</label>
          <input
            type="text"
            value={localStyle.padding || ''}
            onChange={(e) => setLocalStyle({ ...localStyle, padding: e.target.value })}
            onBlur={handleUpdate}
            placeholder="e.g., 20px"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Border Radius</label>
          <input
            type="text"
            value={localStyle.borderRadius || ''}
            onChange={(e) => setLocalStyle({ ...localStyle, borderRadius: e.target.value })}
            onBlur={handleUpdate}
            placeholder="e.g., 8px"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

function findElement(elements: any[], id: string | null): any {
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
