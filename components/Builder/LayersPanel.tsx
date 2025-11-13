'use client';

import { useBuilderStore } from '../../store/builderStore';
import { Element } from '../../types/builder';
import { Lock, Unlock, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function LayersPanel() {
  const { elements, selectedElement, selectElement, deleteElement, updateElement, reorderElements } = useBuilderStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const getElementIcon = (type: string) => {
    const icons: Record<string, string> = {
      section: '📦',
      container: '🗂️',
      heading: '📝',
      text: '📄',
      button: '🔘',
      image: '🖼️',
      input: '✏️',
      textarea: '📋',
      column: '📊',
    };
    return icons[type] || '📌';
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = elements.findIndex(el => el.id === draggedId);
    const targetIndex = elements.findIndex(el => el.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newElements = [...elements];
    const [removed] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, removed);

    reorderElements(newElements);
    setDraggedId(null);
  };

  return (
    <div className="w-72 bg-white border-l border-sand-200 overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-sand-200">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Layers</h2>
        <p className="text-xs text-gray-500 mt-1">{elements.length} elements</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-sm text-gray-400">No layers yet</p>
            <p className="text-xs text-gray-400 mt-1">Add elements to see them here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {[...elements].reverse().map((element, index) => (
              <LayerItem
                key={element.id}
                element={element}
                isSelected={selectedElement === element.id}
                onSelect={() => selectElement(element.id)}
                onDelete={() => deleteElement(element.id)}
                onToggleLock={() => updateElement(element.id, { locked: !element.locked })}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                icon={getElementIcon(element.type)}
                layerNumber={elements.length - index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface LayerItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  icon: string;
  layerNumber: number;
}

function LayerItem({ 
  element, 
  isSelected, 
  onSelect, 
  onDelete, 
  onToggleLock,
  onDragStart,
  onDragOver,
  onDrop,
  icon,
  layerNumber
}: LayerItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, element.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, element.id)}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative px-3 py-2 rounded-lg cursor-pointer transition-all
        ${isSelected 
          ? 'bg-slate-900 text-white' 
          : 'hover:bg-sand-100 text-slate-700'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
          </p>
          <p className={`text-xs truncate ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
            {element.content?.slice(0, 30) || 'Empty'}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className={`p-1 rounded hover:bg-slate-700 transition ${isSelected ? 'text-white' : 'text-slate-600'}`}
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`p-1 rounded hover:bg-red-500 hover:text-white transition ${isSelected ? 'text-white' : 'text-slate-600'}`}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
        isSelected ? 'bg-slate-700 text-white' : 'bg-sand-200 text-slate-600'
      }`}>
        {layerNumber}
      </div>
    </div>
  );
}
