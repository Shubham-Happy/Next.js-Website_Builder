'use client';

import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Builder/Sidebar';
import { Canvas } from '../components/Builder/Canvas';
import { PropertiesPanel } from '../components/Builder/PropertiesPanel';
import { CodeExporter } from '../components/Builder/CodeExporter';
import { LayersPanel } from '../components/Builder/LayersPanel';
import { TemplatesLibrary } from '../components/Builder/TemplatesLibrary';
import { AIAssistant } from '../components/Builder/AIAssistant';
import { ResponsivePreview } from '../components/Builder/ResponsivePreview';
import { useBuilderStore } from '../store/builderStore';
import { Element, ElementType } from '../types/builder';
import { 
  Code2, 
  Palette, 
  Save, 
  Undo2, 
  Redo2, 
  Layers, 
  Sparkles,
  Settings,
  Eye,
  Share2
} from 'lucide-react';

export default function BuilderPage() {
  const { 
    elements, 
    addElement, 
    reorderElements, 
    selectedElement,
    copyElement,
    pasteElement,
    duplicateElement,
    deleteElement,
    undo,
    redo,
    historyIndex,
    history
  } = useBuilderStore();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [exportFormat, setExportFormat] = useState<'react' | 'html'>('react');
  const [showLayers, setShowLayers] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        e.preventDefault();
        copyElement(selectedElement);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElement();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        duplicateElement(selectedElement);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        const target = e.target as HTMLElement;
        if (target.contentEditable === 'true') return;
        e.preventDefault();
        deleteElement(selectedElement);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setShowPreview(!showPreview);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, showPreview]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id.toString().startsWith('palette-') && over.id === 'canvas') {
      const type = active.data.current?.type as ElementType;
      const newElement: Element = {
        id: `element-${Date.now()}`,
        type,
        style: getDefaultStyle(type),
        content: getDefaultContent(type),
        children: type === 'container' || type === 'section' || type === 'column' ? [] : undefined,
      };
      addElement(newElement);
    }

    if (!active.id.toString().startsWith('palette-') && active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderElements(arrayMove(elements, oldIndex, newIndex));
      }
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-cream-50">
        <header className="bg-white border-b border-sand-200 shadow-sm z-50">
          <div className="flex justify-between items-center px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    SiteForge AI
                  </h1>
                  <p className="text-xs text-gray-500">Ultimate Builder</p>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-sand-200">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="p-2 hover:bg-sand-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-4 h-4 text-slate-700" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="p-2 hover:bg-sand-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 className="w-4 h-4 text-slate-700" />
                </button>
              </div>

              <div className="flex items-center gap-1 ml-2 pl-4 border-l border-sand-200">
                <button
                  onClick={() => setShowLayers(!showLayers)}
                  className={`p-2 rounded-lg transition ${showLayers ? 'bg-slate-900 text-white' : 'hover:bg-sand-100 text-slate-700'}`}
                  title="Layers Panel"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="p-2 hover:bg-sand-100 rounded-lg transition text-slate-700"
                  title="Templates"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`p-2 rounded-lg transition ${showPreview ? 'bg-slate-900 text-white' : 'hover:bg-sand-100 text-slate-700'}`}
                  title="Preview (Ctrl+P)"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sand-100 rounded-lg transition flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </button>

              <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-sand-100 rounded-lg transition flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              
              <button
                onClick={() => setShowCode(!showCode)}
                className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
              >
                {showCode ? <Settings className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                {showCode ? 'Builder' : 'Export'}
              </button>

              <button className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg">
                Publish
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {showCode ? (
            <CodeExporter exportFormat={exportFormat} setExportFormat={setExportFormat} />
          ) : (
            <>
              {!showPreview && <Sidebar />}
              {showPreview ? (
                <ResponsivePreview>
                  <Canvas />
                </ResponsivePreview>
              ) : (
                <Canvas />
              )}
              {!showPreview && (showLayers ? <LayersPanel /> : <PropertiesPanel />)}
            </>
          )}
        </div>
      </div>

      <AIAssistant />
      <TemplatesLibrary isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
    </DndContext>
  );
}

function getDefaultStyle(type: ElementType) {
  const defaults: Record<ElementType, any> = {
    container: { 
      backgroundColor: '#ffffff', 
      padding: '24px', 
      borderRadius: '12px', 
      border: '1px solid #e5e7eb',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    section: {
      backgroundColor: '#f9fafb',
      padding: '60px 24px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px'
    },
    column: {
      backgroundColor: 'transparent',
      padding: '16px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    heading: { 
      fontSize: '48px', 
      fontWeight: '700', 
      color: '#0f172a', 
      lineHeight: '1.2',
      fontFamily: 'Inter'
    },
    text: { 
      fontSize: '16px', 
      color: '#475569', 
      lineHeight: '1.6',
      maxWidth: '650px',
      fontFamily: 'Inter'
    },
    button: { 
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      padding: '14px 32px', 
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'center'
    },
    image: { 
      width: '400px', 
      height: '300px',
      borderRadius: '12px',
      objectFit: 'cover'
    },
    input: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
      fontFamily: 'Inter'
    },
    textarea: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'Inter'
    }
  };
  return defaults[type] || {};
}

function getDefaultContent(type: ElementType) {
  const contents: Record<string, string> = {
    heading: 'Your Awesome Heading',
    text: 'Add your text content here. Double-click to edit.',
    button: 'Get Started',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    input: '',
    textarea: ''
  };
  return contents[type] || '';
}
