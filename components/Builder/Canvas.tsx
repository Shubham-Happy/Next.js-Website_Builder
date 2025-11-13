'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from '../../store/builderStore';
import { SortableElement } from './SortableElement';

export function Canvas() {
  const { elements } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto">
      <div
        ref={setNodeRef}
        className={`
          min-h-[600px] bg-white rounded-lg shadow-lg p-6 transition-all
          ${isOver ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
        `}
      >
        {elements.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-lg">
            Drag components here to start building
          </div>
        ) : (
          <SortableContext items={elements.map(el => el.id)} strategy={verticalListSortingStrategy}>
            {elements.map((element) => (
              <SortableElement key={element.id} element={element} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
