'use client';

import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../../store/builderStore';
import { EditableElement } from './EditableElement';
import { MousePointer2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState } from 'react';

export function Canvas() {
  const { elements } = useBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex-1 bg-sand-100 overflow-auto relative">
      <div className="sticky top-0 z-10 bg-white border-b border-sand-200 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg">
            Desktop
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-sand-100 rounded-lg transition">
            Tablet
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-sand-100 rounded-lg transition">
            Mobile
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            className="p-1.5 hover:bg-sand-100 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-slate-700" />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[60px] text-center">
            {zoom}%
          </span>
          <button 
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-1.5 hover:bg-sand-100 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-slate-700" />
          </button>
          <button 
            onClick={() => setZoom(100)}
            className="p-1.5 hover:bg-sand-100 rounded transition ml-1"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="p-8 min-h-screen flex justify-center">
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
          className="transition-transform duration-200"
        >
          <div
            ref={setNodeRef}
            className={`
              relative bg-white rounded-lg shadow-2xl
              transition-all duration-200
              ${isOver ? 'ring-4 ring-slate-900 ring-opacity-20' : 'ring-1 ring-sand-200'}
            `}
            style={{
              width: '1440px',
              minHeight: '900px',
              position: 'relative'
            }}
          >
            {elements.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <div className="w-20 h-20 bg-sand-100 rounded-full flex items-center justify-center mb-4">
                  <MousePointer2 className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Building Your Page</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Drag components from the left sidebar. Click any element to edit. Drag handles to resize.
                </p>
              </div>
            ) : (
              <>
                {elements.map((element) => (
                  <EditableElement key={element.id} element={element} />
                ))}
              </>
            )}

            <div 
              className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-5 transition-opacity"
              style={{
                backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
