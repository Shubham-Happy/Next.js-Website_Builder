'use client';

import { useBuilderStore } from '../../store/builderStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Element } from '../../types/builder';

export function CodeExporter() {
  const { elements } = useBuilderStore();

  const generateCode = () => {
    const componentCode = elements.map(generateElementCode).join('\n\n');
    
    return `import React from 'react';

export default function GeneratedPage() {
  return (
    <div className="container mx-auto p-4">
${componentCode.split('\n').map(line => `      ${line}`).join('\n')}
    </div>
  );
}`;
  };

  const generateElementCode = (element: Element, indent = 0): string => {
    const spacing = '  '.repeat(indent);
    const styleStr = Object.entries(element.style)
      .map(([key, value]) => `${key}: '${value}'`)
      .join(', ');

    const styleAttr = styleStr ? ` style={{ ${styleStr} }}` : '';

    switch (element.type) {
      case 'container':
        const children = element.children?.map(child => 
          generateElementCode(child, indent + 1)
        ).join('\n') || '';
        return `${spacing}<div${styleAttr}>\n${children}\n${spacing}</div>`;

      case 'heading':
        return `${spacing}<h1${styleAttr}>${element.content}</h1>`;

      case 'text':
        return `${spacing}<p${styleAttr}>${element.content}</p>`;

      case 'button':
        return `${spacing}<button${styleAttr}>${element.content}</button>`;

      case 'image':
        return `${spacing}<img src="${element.content}" alt="Generated"${styleAttr} />`;

      default:
        return '';
    }
  };

  const code = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'GeneratedPage.tsx';
    a.click();
  };

  return (
    <div className="flex-1 p-6 bg-gray-900 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Generated React Code</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              📋 Copy Code
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              💾 Download File
            </button>
          </div>
        </div>

        <SyntaxHighlighter language="tsx" style={vscDarkPlus} customStyle={{ borderRadius: '8px' }}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
