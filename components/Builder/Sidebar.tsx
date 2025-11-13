'use client';

import { useDraggable } from '@dnd-kit/core';
import { ElementType } from '../../types/builder';
import { 
  Type, 
  Image, 
  MousePointerClick, 
  Layout, 
  Columns3,
  FormInput,
  TextCursorInput,
  PanelTop,
  Heading1
} from 'lucide-react';

const componentTypes: { 
  type: ElementType; 
  label: string; 
  icon: any; 
  description: string;
  category: 'basic' | 'layout' | 'form';
}[] = [
  { type: 'section', label: 'Section', icon: PanelTop, description: 'Full-width section', category: 'layout' },
  { type: 'container', label: 'Container', icon: Layout, description: 'Flex container', category: 'layout' },
  { type: 'column', label: 'Column', icon: Columns3, description: 'Column block', category: 'layout' },
  { type: 'heading', label: 'Heading', icon: Heading1, description: 'Large title text', category: 'basic' },
  { type: 'text', label: 'Paragraph', icon: Type, description: 'Body text', category: 'basic' },
  { type: 'button', label: 'Button', icon: MousePointerClick, description: 'Call-to-action', category: 'basic' },
  { type: 'image', label: 'Image', icon: Image, description: 'Visual content', category: 'basic' },
  { type: 'input', label: 'Input', icon: FormInput, description: 'Text input field', category: 'form' },
  { type: 'textarea', label: 'Textarea', icon: TextCursorInput, description: 'Multi-line input', category: 'form' },
];

function DraggableComponent({ type, label, icon: Icon, description }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        group relative p-3 rounded-xl border bg-white
        cursor-grab active:cursor-grabbing transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 shadow-lg' 
          : 'border-sand-200 hover:border-slate-900 hover:shadow-md'
        }
      `}
    >
      <div className="flex items-start gap-2.5">
        <div className={`
          w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
          ${isDragging ? 'bg-slate-900' : 'bg-sand-100 group-hover:bg-slate-900'}
        `}>
          <Icon className={`w-4 h-4 transition-colors ${isDragging ? 'text-white' : 'text-slate-700 group-hover:text-white'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const categories = ['layout', 'basic', 'form'] as const;

  return (
    <div className="w-72 bg-white border-r border-sand-200 overflow-y-auto">
      <div className="p-5 border-b border-sand-200">
        <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Add Elements</h2>
        <p className="text-xs text-gray-500 mt-1">Drag components to canvas</p>
      </div>

      <div className="p-4 space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 capitalize">
              {category}
            </h3>
            <div className="space-y-2">
              {componentTypes
                .filter(comp => comp.category === category)
                .map((comp) => (
                  <DraggableComponent key={comp.type} {...comp} />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-sand-200 mt-auto sticky bottom-0 bg-white">
        <div className="bg-sand-100 rounded-lg p-4">
          <p className="text-xs text-slate-700 font-medium">⌨️ Shortcuts</p>
          <div className="text-xs text-gray-600 mt-2 space-y-1">
            <div>Ctrl+Z - Undo</div>
            <div>Ctrl+C/V - Copy/Paste</div>
            <div>Ctrl+D - Duplicate</div>
            <div>Del - Remove</div>
          </div>
        </div>
      </div>
    </div>
  );
}
