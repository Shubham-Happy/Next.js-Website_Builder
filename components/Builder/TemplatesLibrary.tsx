'use client';

import { useBuilderStore } from '../../store/builderStore';
import { Element } from '../../types/builder';
import { X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  elements: Element[];
}

const TEMPLATES: Template[] = [
  {
    id: 'hero-1',
    name: 'Hero Section - Modern',
    category: 'Hero Sections',
    thumbnail: '🎯',
    elements: [
      {
        id: `template-${Date.now()}-1`,
        type: 'section',
        style: {
          backgroundColor: '#0f172a',
          padding: '80px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        },
        children: [
          {
            id: `template-${Date.now()}-2`,
            type: 'heading',
            content: 'Build Amazing Websites',
            style: {
              fontSize: '64px',
              fontWeight: '800',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '1.1',
            }
          },
          {
            id: `template-${Date.now()}-3`,
            type: 'text',
            content: 'Create stunning websites with our drag-and-drop builder. No coding required.',
            style: {
              fontSize: '20px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '600px',
            }
          },
          {
            id: `template-${Date.now()}-4`,
            type: 'button',
            content: 'Get Started Free',
            style: {
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
            }
          }
        ]
      }
    ]
  },
  {
    id: 'features-1',
    name: 'Feature Cards',
    category: 'Features',
    thumbnail: '⭐',
    elements: [
      {
        id: `template-${Date.now()}-5`,
        type: 'section',
        style: {
          backgroundColor: '#f9fafb',
          padding: '80px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
        },
        children: [
          {
            id: `template-${Date.now()}-6`,
            type: 'heading',
            content: 'Amazing Features',
            style: {
              fontSize: '48px',
              fontWeight: '700',
              color: '#0f172a',
              textAlign: 'center',
            }
          },
          {
            id: `template-${Date.now()}-7`,
            type: 'container',
            style: {
              display: 'flex',
              gap: '24px',
              padding: '0',
            },
            children: [
              {
                id: `template-${Date.now()}-8`,
                type: 'container',
                style: {
                  backgroundColor: '#ffffff',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  flex: '1',
                },
                children: [
                  {
                    id: `template-${Date.now()}-9`,
                    type: 'heading',
                    content: 'Fast',
                    style: {
                      fontSize: '24px',
                      fontWeight: '600',
                      color: '#0f172a',
                    }
                  },
                  {
                    id: `template-${Date.now()}-10`,
                    type: 'text',
                    content: 'Lightning-fast performance.',
                    style: {
                      fontSize: '16px',
                      color: '#64748b',
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'cta-1',
    name: 'Call to Action',
    category: 'CTA',
    thumbnail: '🚀',
    elements: [
      {
        id: `template-${Date.now()}-11`,
        type: 'section',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          borderRadius: '16px',
        },
        children: [
          {
            id: `template-${Date.now()}-12`,
            type: 'heading',
            content: 'Ready to get started?',
            style: {
              fontSize: '48px',
              fontWeight: '700',
              color: '#ffffff',
              textAlign: 'center',
            }
          },
          {
            id: `template-${Date.now()}-13`,
            type: 'text',
            content: 'Join thousands of happy customers.',
            style: {
              fontSize: '18px',
              color: '#e2e8f0',
              textAlign: 'center',
            }
          },
          {
            id: `template-${Date.now()}-14`,
            type: 'button',
            content: 'Sign Up Now',
            style: {
              backgroundColor: '#ffffff',
              color: '#667eea',
              padding: '16px 40px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            }
          }
        ]
      }
    ]
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatesLibrary({ isOpen, onClose }: Props) {
  const { addElement } = useBuilderStore();

  if (!isOpen) return null;

  const handleSelectTemplate = (template: Template) => {
    template.elements.forEach(element => {
      const newElement = JSON.parse(JSON.stringify(element));
      regenerateIds(newElement);
      addElement(newElement);
    });
    onClose();
  };

  const regenerateIds = (element: any) => {
    element.id = `element-${Date.now()}-${Math.random()}`;
    if (element.children) {
      element.children.forEach((child: any) => regenerateIds(child));
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-sand-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Template Library</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a pre-designed section</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sand-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="group relative bg-sand-50 rounded-xl p-6 border-2 border-sand-200 hover:border-slate-900 transition-all hover:shadow-lg text-left"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">
                    {template.thumbnail}
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-slate-900 bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
