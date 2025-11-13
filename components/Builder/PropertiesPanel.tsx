'use client';

import { useBuilderStore } from '../../store/builderStore';
import { findElement } from '../../store/builderStore';
import { useState, useEffect } from 'react';
import { 
  Settings2, 
  Trash2, 
  Palette as PaletteIcon,
  Type,
  Move,
  Layers
} from 'lucide-react';

const BUTTON_PRESETS = [
  { name: 'Primary', style: { backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600' } },
  { name: 'Secondary', style: { backgroundColor: '#ffffff', color: '#0f172a', padding: '14px 32px', borderRadius: '8px', border: '2px solid #0f172a', fontWeight: '600' } },
  { name: 'Gradient', style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff', padding: '14px 32px', borderRadius: '8px', fontWeight: '600', border: 'none' } },
  { name: 'Rounded', style: { backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 32px', borderRadius: '50px', fontWeight: '600' } },
];

const HEADING_PRESETS = [
  { name: 'Hero', style: { fontSize: '72px', fontWeight: '800', lineHeight: '1.1', color: '#0f172a' } },
  { name: 'Title', style: { fontSize: '48px', fontWeight: '700', lineHeight: '1.2', color: '#0f172a' } },
  { name: 'Subtitle', style: { fontSize: '32px', fontWeight: '600', lineHeight: '1.3', color: '#475569' } },
];

export function PropertiesPanel() {
  const { elements, selectedElement, updateElement, deleteElement, moveLayer } = useBuilderStore();
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
      <div className="w-80 bg-white border-l border-sand-200 overflow-y-auto">
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-sand-100 rounded-full flex items-center justify-center mb-3">
            <Settings2 className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-900">No Element Selected</p>
          <p className="text-xs text-gray-500 mt-1">Click any element to edit</p>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    if (selectedElement) {
      updateElement(selectedElement, { content: localContent, style: localStyle });
    }
  };

  const applyPreset = (presetStyle: any) => {
    setLocalStyle({ ...localStyle, ...presetStyle });
    updateElement(selectedElement!, { style: { ...localStyle, ...presetStyle } });
  };

  return (
    <div className="w-80 bg-white border-l border-sand-200 overflow-y-auto">
      <div className="p-5 border-b border-sand-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Properties</h2>
          <button
            onClick={() => {
              if (selectedElement) deleteElement(selectedElement);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition group"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
          </button>
        </div>
        <p className="text-xs text-gray-500 capitalize">{selected.type}</p>
      </div>

      <div className="p-5 space-y-6">
        {selected.type === 'button' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PaletteIcon className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quick Styles</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BUTTON_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.style)}
                  className="p-3 text-xs font-medium border border-sand-200 rounded-lg hover:border-slate-900 transition text-center"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selected.type === 'heading' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quick Styles</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {HEADING_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.style)}
                  className="p-3 text-xs font-medium border border-sand-200 rounded-lg hover:border-slate-900 transition text-center"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selected.type !== 'container' && selected.type !== 'section' && selected.type !== 'image' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Content
            </label>
            <textarea
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              onBlur={handleUpdate}
              rows={3}
              className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
              placeholder="Enter content..."
            />
            <p className="text-xs text-gray-400 mt-1">💡 Double-click to edit inline</p>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Move className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Position & Size</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">X Position</label>
              <input
                type="number"
                value={parseInt(localStyle.left || '0')}
                onChange={(e) => {
                  const newStyle = { ...localStyle, left: `${e.target.value}px` };
                  setLocalStyle(newStyle);
                  updateElement(selectedElement!, { style: newStyle });
                }}
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Y Position</label>
              <input
                type="number"
                value={parseInt(localStyle.top || '0')}
                onChange={(e) => {
                  const newStyle = { ...localStyle, top: `${e.target.value}px` };
                  setLocalStyle(newStyle);
                  updateElement(selectedElement!, { style: newStyle });
                }}
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Width</label>
              <input
                type="text"
                value={localStyle.width || ''}
                onChange={(e) => setLocalStyle({ ...localStyle, width: e.target.value })}
                onBlur={handleUpdate}
                placeholder="auto"
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Height</label>
              <input
                type="text"
                value={localStyle.height || ''}
                onChange={(e) => setLocalStyle({ ...localStyle, height: e.target.value })}
                onBlur={handleUpdate}
                placeholder="auto"
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Layering</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => moveLayer(selectedElement!, 'top')}
              className="px-3 py-2 text-xs font-medium border border-sand-200 rounded-lg hover:border-slate-900 transition"
            >
              Bring Front
            </button>
            <button
              onClick={() => moveLayer(selectedElement!, 'bottom')}
              className="px-3 py-2 text-xs font-medium border border-sand-200 rounded-lg hover:border-slate-900 transition"
            >
              Send Back
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <PaletteIcon className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Colors</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Background</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localStyle.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    const newStyle = { ...localStyle, backgroundColor: e.target.value };
                    setLocalStyle(newStyle);
                    updateElement(selectedElement!, { style: newStyle });
                  }}
                  className="w-14 h-10 rounded-lg cursor-pointer border border-sand-200"
                />
                <input
                  type="text"
                  value={localStyle.backgroundColor || ''}
                  onChange={(e) => setLocalStyle({ ...localStyle, backgroundColor: e.target.value })}
                  onBlur={handleUpdate}
                  placeholder="#ffffff"
                  className="flex-1 px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={localStyle.color || '#000000'}
                  onChange={(e) => {
                    const newStyle = { ...localStyle, color: e.target.value };
                    setLocalStyle(newStyle);
                    updateElement(selectedElement!, { style: newStyle });
                  }}
                  className="w-14 h-10 rounded-lg cursor-pointer border border-sand-200"
                />
                <input
                  type="text"
                  value={localStyle.color || ''}
                  onChange={(e) => setLocalStyle({ ...localStyle, color: e.target.value })}
                  onBlur={handleUpdate}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {selected.type !== 'image' && selected.type !== 'container' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Typography</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Font Size</label>
                <input
                  type="text"
                  value={localStyle.fontSize || ''}
                  onChange={(e) => setLocalStyle({ ...localStyle, fontSize: e.target.value })}
                  onBlur={handleUpdate}
                  placeholder="16px"
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Font Weight</label>
                <select
                  value={localStyle.fontWeight || '400'}
                  onChange={(e) => {
                    const newStyle = { ...localStyle, fontWeight: e.target.value };
                    setLocalStyle(newStyle);
                    updateElement(selectedElement!, { style: newStyle });
                  }}
                  className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Text Align</label>
                <div className="grid grid-cols-3 gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => {
                        const newStyle = { ...localStyle, textAlign: align as any };
                        setLocalStyle(newStyle);
                        updateElement(selectedElement!, { style: newStyle });
                      }}
                      className={`
                        px-3 py-2 text-xs font-medium border rounded-lg transition capitalize
                        ${localStyle.textAlign === align 
                          ? 'border-slate-900 bg-slate-900 text-white' 
                          : 'border-sand-200 hover:border-slate-900'
                        }
                      `}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Spacing</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Padding</label>
              <input
                type="text"
                value={localStyle.padding || ''}
                onChange={(e) => setLocalStyle({ ...localStyle, padding: e.target.value })}
                onBlur={handleUpdate}
                placeholder="20px or 10px 20px"
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Border Radius</label>
              <input
                type="text"
                value={localStyle.borderRadius || ''}
                onChange={(e) => setLocalStyle({ ...localStyle, borderRadius: e.target.value })}
                onBlur={handleUpdate}
                placeholder="8px"
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Effects</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Shadow</label>
              <select
                value={localStyle.boxShadow || 'none'}
                onChange={(e) => {
                  const newStyle = { ...localStyle, boxShadow: e.target.value === 'none' ? undefined : e.target.value };
                  setLocalStyle(newStyle);
                  updateElement(selectedElement!, { style: newStyle });
                }}
                className="w-full px-3 py-2 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.15)">Extra Large</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Opacity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={parseInt(localStyle.opacity || '100')}
                onChange={(e) => {
                  const newStyle = { ...localStyle, opacity: (e.target.valueAsNumber / 100).toString() };
                  setLocalStyle(newStyle);
                  updateElement(selectedElement!, { style: newStyle });
                }}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(parseFloat(localStyle.opacity || '1') * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
