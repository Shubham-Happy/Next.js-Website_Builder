'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Element } from '../../types/builder';
import { useBuilderStore } from '../../store/builderStore';
import { ElementRenderer } from '../Renderer/ElementRenderer';
import { Trash2 } from 'lucide-react'; 

interface Props {
  element: Element;
}

export function SortableElement({ element }: Props) {
  const { selectedElement, selectElement, deleteElement } = useBuilderStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedElement === element.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group mb-2 rounded
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
      `}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
    >
      {/* Drag Handle & Delete Button */}
      <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          {...listeners}
          {...attributes}
          className="px-2 py-1 bg-gray-700 text-white text-xs rounded cursor-grab active:cursor-grabbing"
        >
          ⋮⋮ Drag
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(element.id);
          }}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Render the actual element */}
      <ElementRenderer element={element} />
    </div>
  );
}
