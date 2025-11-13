'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { Element } from '../../types/builder';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([]);
  const { addElement } = useBuilderStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = generateComponentFromPrompt(prompt);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse.message }]);
      
      if (aiResponse.element) {
        addElement(aiResponse.element);
      }
      
      setPrompt('');
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateComponentFromPrompt = (prompt: string): { message: string, element?: Element } => {
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes('hero') || lowerPrompt.includes('landing')) {
      return {
        message: "I've created a stunning hero section! Customize colors in the properties panel.",
        element: {
          id: `ai-${Date.now()}`,
          type: 'section',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '100px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          },
          children: [
            {
              id: `ai-${Date.now()}-1`,
              type: 'heading',
              content: 'Transform Your Ideas Into Reality',
              style: {
                fontSize: '64px',
                fontWeight: '800',
                color: '#ffffff',
                textAlign: 'center',
                lineHeight: '1.1',
              }
            },
            {
              id: `ai-${Date.now()}-2`,
              type: 'text',
              content: 'Build stunning websites with AI. No coding required.',
              style: {
                fontSize: '20px',
                color: '#e2e8f0',
                textAlign: 'center',
                maxWidth: '700px',
              }
            },
            {
              id: `ai-${Date.now()}-3`,
              type: 'button',
              content: 'Get Started Free',
              style: {
                backgroundColor: '#ffffff',
                color: '#667eea',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '50px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              }
            }
          ]
        }
      };
    }

    if (lowerPrompt.includes('form') || lowerPrompt.includes('contact')) {
      return {
        message: "Created a contact form for you!",
        element: {
          id: `ai-${Date.now()}`,
          type: 'container',
          style: {
            backgroundColor: '#ffffff',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          },
          children: [
            {
              id: `ai-${Date.now()}-1`,
              type: 'heading',
              content: 'Get In Touch',
              style: { fontSize: '32px', fontWeight: '700', color: '#0f172a' }
            },
            {
              id: `ai-${Date.now()}-2`,
              type: 'input',
              content: 'Your Name',
              style: {
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                width: '100%',
              }
            },
            {
              id: `ai-${Date.now()}-3`,
              type: 'input',
              content: 'Your Email',
              style: {
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                width: '100%',
              }
            },
            {
              id: `ai-${Date.now()}-4`,
              type: 'textarea',
              content: 'Your Message',
              style: {
                padding: '14px 16px',
                fontSize: '16px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                width: '100%',
                minHeight: '120px',
              }
            },
            {
              id: `ai-${Date.now()}-5`,
              type: 'button',
              content: 'Send Message',
              style: {
                backgroundColor: '#0f172a',
                color: '#ffffff',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '10px',
                width: '100%',
              }
            }
          ]
        }
      };
    }

    return {
      message: "I can create hero sections, contact forms, pricing tables, and more! Try 'create a hero section' or 'add a contact form'.",
    };
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-sand-200 flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-sand-200 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">AI Design Assistant</h4>
                <p className="text-sm text-gray-500">
                  Tell me what you want to create!
                </p>
                <div className="mt-4 space-y-2 text-left w-full">
                  <button
                    onClick={() => setPrompt('Create a hero section')}
                    className="w-full p-3 text-left text-sm bg-sand-50 hover:bg-sand-100 rounded-lg transition"
                  >
                    💫 Create a hero section
                  </button>
                  <button
                    onClick={() => setPrompt('Add a contact form')}
                    className="w-full p-3 text-left text-sm bg-sand-50 hover:bg-sand-100 rounded-lg transition"
                  >
                    📝 Add a contact form
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                        : 'bg-sand-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-sand-100 p-3 rounded-lg">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-sand-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe what you want..."
                className="flex-1 px-4 py-3 border border-sand-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
