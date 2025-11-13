'use client';

import { Rnd } from 'react-rnd';
import { Element } from '../../types/builder';
import { useBuilderStore } from '../../store/builderStore';
import { useState, useRef, useEffect } from 'react';
import { 
  Copy, 
  Trash2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Props {
  element: Element;
}

export function EditableElement({ element }: Props) {
  const { selectedElement, selectElement, updateElement, deleteElement, duplicateElement, moveLayer } = useBuilderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(element.content || '');
  const contentRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedElement === element.id;
  
  const defaultWidth = parseInt(element.style.width || '300');
  const defaultHeight = parseInt(element.style.height || '100');

  useEffect(() => {
    setLocalContent(element.content || '');
  }, [element.content]);

  const handleDoubleClick = () => {
    if (element.type === 'text' || element.type === 'heading' || element.type === 'button') {
      setIsEditing(true);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          const range = document.createRange();
          range.selectNodeContents(contentRef.current);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }, 0);
    }
  };

  const handleContentBlur = () => {
    setIsEditing(false);
    if (localContent !== element.content) {
      updateElement(element.id, { content: localContent });
    }
  };

  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    setLocalContent(e.currentTarget.textContent || '');
  };

  const renderContent = () => {
    const baseStyle: React.CSSProperties = {
      ...element.style,
      width: '100%',
      height: '100%',
      margin: 0,
      position: 'relative',
    };

    const canEdit = element.type === 'text' || element.type === 'heading' || element.type === 'button';

    switch (element.type) {
      case 'heading':
        return (
          <div
            ref={contentRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onInput={handleContentInput}
            onBlur={handleContentBlur}
            style={{
              ...baseStyle,
              fontSize: element.style.fontSize || '48px',
              fontWeight: element.style.fontWeight || '700',
              outline: 'none',
              cursor: isEditing ? 'text' : (canEdit ? 'pointer' : 'default'),
            }}
            className="whitespace-pre-wrap break-words"
          >
            {element.content || 'Heading'}
          </div>
        );

      case 'text':
        return (
          <div
            ref={contentRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onInput={handleContentInput}
            onBlur={handleContentBlur}
            style={{
              ...baseStyle,
              fontSize: element.style.fontSize || '16px',
              outline: 'none',
              cursor: isEditing ? 'text' : (canEdit ? 'pointer' : 'default'),
            }}
            className="whitespace-pre-wrap break-words"
          >
            {element.content || 'Text content'}
          </div>
        );

      case 'button':
        return (
          <div
            ref={contentRef}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onInput={handleContentInput}
            onBlur={handleContentBlur}
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              cursor: isEditing ? 'text' : (canEdit ? 'pointer' : 'default'),
            }}
            className="whitespace-nowrap"
          >
            {element.content || 'Button'}
          </div>
        );

      case 'image':
        return (
          <img
            src={element.content || 'https://via.placeholder.com/400x300'}
            alt="Element"
            style={{
              ...baseStyle,
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        );

      case 'container':
      case 'section':
        return (
          <div style={{
            ...baseStyle,
            minHeight: '100px',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {element.children?.map(child => (
              <EditableElement key={child.id} element={child} />
            ))}
          </div>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={element.content || 'Enter text...'}
            style={baseStyle}
            className="outline-none"
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.content || 'Enter text...'}
            style={baseStyle}
            className="outline-none resize-none"
          />
        );

      default:
        return <div style={baseStyle}>{element.content}</div>;
    }
  };

  return (
    <Rnd
      size={{ 
        width: defaultWidth, 
        height: element.type === 'image' ? 'auto' : defaultHeight 
      }}
      position={{ 
        x: parseInt(element.style.left || '50'), 
        y: parseInt(element.style.top || '50') 
      }}
      onDragStop={(e, d) => {
        updateElement(element.id, {
          style: {
            ...element.style,
            left: `${d.x}px`,
            top: `${d.y}px`,
          }
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        updateElement(element.id, {
          style: {
            ...element.style,
            width: ref.style.width,
            height: ref.style.height,
            left: `${position.x}px`,
            top: `${position.y}px`,
          }
        });
      }}
      onClick={(e) => {
        e.stopPropagation();
        selectElement(element.id);
      }}
      onDoubleClick={handleDoubleClick}
      bounds="parent"
      enableResizing={isSelected && !element.locked}
      disableDragging={element.locked || isEditing}
      className={`
        group
        ${isSelected ? 'z-50' : 'z-auto'}
      `}
      style={{
        border: isSelected ? '2px solid #0f172a' : '2px solid transparent',
        borderRadius: element.style.borderRadius || '0px',
      }}
      resizeHandleStyles={{
        top: { cursor: 'ns-resize' },
        right: { cursor: 'ew-resize' },
        bottom: { cursor: 'ns-resize' },
        left: { cursor: 'ew-resize' },
        topRight: { cursor: 'nesw-resize' },
        bottomRight: { cursor: 'nwse-resize' },
        bottomLeft: { cursor: 'nesw-resize' },
        topLeft: { cursor: 'nwse-resize' },
      }}
      resizeHandleClasses={{
        top: 'resize-handle',
        right: 'resize-handle',
        bottom: 'resize-handle',
        left: 'resize-handle',
        topRight: 'resize-handle',
        bottomRight: 'resize-handle',
        bottomLeft: 'resize-handle',
        topLeft: 'resize-handle',
      }}
    >
      {isSelected && !isEditing && (
        <div className="absolute -top-12 left-0 flex items-center gap-1 bg-slate-900 rounded-lg px-2 py-1.5 shadow-xl z-50">
          <button
            className="p-1.5 hover:bg-slate-800 rounded text-white transition"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              duplicateElement(element.id);
            }}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          
          <button
            className="p-1.5 hover:bg-slate-800 rounded text-white transition"
            title="Bring Forward"
            onClick={(e) => {
              e.stopPropagation();
              moveLayer(element.id, 'up');
            }}
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          
          <button
            className="p-1.5 hover:bg-slate-800 rounded text-white transition"
            title="Send Backward"
            onClick={(e) => {
              e.stopPropagation();
              moveLayer(element.id, 'down');
            }}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-700 mx-1" />
          
          <button
            className="p-1.5 hover:bg-red-500 rounded text-white transition"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(element.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {isSelected && !isEditing && (element.type === 'text' || element.type === 'heading' || element.type === 'button') && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Double-click to edit text
        </div>
      )}

      <div className="w-full h-full">
        {renderContent()}
      </div>

      <style jsx global>{`
        .resize-handle {
          width: 12px !important;
          height: 12px !important;
          background: white !important;
          border: 2px solid #0f172a !important;
          border-radius: 50% !important;
          opacity: ${isSelected ? '1' : '0'} !important;
          transition: opacity 0.2s !important;
        }
        .resize-handle:hover {
          background: #0f172a !important;
          transform: scale(1.2);
        }
      `}</style>
    </Rnd>
  );
}
