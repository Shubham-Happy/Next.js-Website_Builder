'use client';

import { useDraggable } from '@dnd-kit/core';
import { ElementType } from '../../types/builder';

const componentTypes: { type: ElementType; label: string; icon: string }[] = [
  { type: 'container', label: 'Container', icon: '📦' },
  { type: 'heading', label: 'Heading', icon: '📝' },
  { type: 'text', label: 'Text', icon: '📄' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'image', label: 'Image', icon: '🖼️' },
];

function DraggableComponent({ type, label, icon }: { type: ElementType; label: string; icon: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type }, // Pass component type as data
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed
        cursor-grab active:cursor-grabbing transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'hover:border-blue-500 hover:bg-blue-50'}
      `}
    >
      <span className="text-3xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Components</h2>
      <div className="grid grid-cols-2 gap-3">
        {componentTypes.map((comp) => (
          <DraggableComponent key={comp.type} {...comp} />
        ))}
      </div>
    </div>
  );
}
