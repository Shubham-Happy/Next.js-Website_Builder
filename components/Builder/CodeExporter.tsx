'use client';

import { useBuilderStore } from '../../store/builderStore';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Element } from '../../types/builder';
import { Copy, Download, FileCode } from 'lucide-react';
import { useState } from 'react';

interface Props {
  exportFormat: 'react' | 'html';
  setExportFormat: (format: 'react' | 'html') => void;
}

export function CodeExporter({ exportFormat, setExportFormat }: Props) {
  const { elements } = useBuilderStore();
  const [copied, setCopied] = useState(false);

  const generateReactCode = () => {
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

  const generateHTMLCode = () => {
    let cssCounter = 0;
    const cssClasses: string[] = [];
    
    const generateHTML = (element: Element, indent = 0): string => {
      const spacing = '  '.repeat(indent);
      const className = `element-${cssCounter++}`;
      
      const cssRules = Object.entries(element.style)
        .map(([key, value]) => {
          const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `  ${cssKey}: ${value};`;
        })
        .join('\n');
      
      if (cssRules) {
        cssClasses.push(`.${className} {\n${cssRules}\n}`);
      }

      switch (element.type) {
        case 'container':
        case 'section':
          const children = element.children?.map(child => 
            generateHTML(child, indent + 1)
          ).join('\n') || '';
          return `${spacing}<div class="${className}">\n${children}\n${spacing}</div>`;

        case 'heading':
          return `${spacing}<h1 class="${className}">${element.content}</h1>`;

        case 'text':
          return `${spacing}<p class="${className}">${element.content}</p>`;

        case 'button':
          return `${spacing}<button class="${className}">${element.content}</button>`;

        case 'image':
          return `${spacing}<img src="${element.content}" alt="Generated" class="${className}" />`;

        case 'input':
          return `${spacing}<input type="text" placeholder="${element.content}" class="${className}" />`;

        case 'textarea':
          return `${spacing}<textarea placeholder="${element.content}" class="${className}"></textarea>`;

        default:
          return '';
      }
    };

    const htmlBody = elements.map(el => generateHTML(el, 2)).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

${cssClasses.join('\n\n')}
  </style>
</head>
<body>
  <div class="container">
${htmlBody}
  </div>
</body>
</html>`;
  };

  const generateElementCode = (element: Element, indent = 0): string => {
    const spacing = '  '.repeat(indent);
    const styleStr = Object.entries(element.style)
      .map(([key, value]) => `${key}: '${value}'`)
      .join(', ');

    const styleAttr = styleStr ? ` style={{ ${styleStr} }}` : '';

    switch (element.type) {
      case 'container':
      case 'section':
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

      case 'input':
        return `${spacing}<input type="text" placeholder="${element.content}"${styleAttr} />`;

      case 'textarea':
        return `${spacing}<textarea placeholder="${element.content}"${styleAttr}></textarea>`;

      default:
        return '';
    }
  };

  const code = exportFormat === 'react' ? generateReactCode() : generateHTMLCode();
  const language = exportFormat === 'react' ? 'tsx' : 'html';
  const fileExtension = exportFormat === 'react' ? '.tsx' : '.html';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeneratedPage${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-slate-900 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Export Your Code</h2>
              <p className="text-sm text-gray-400">Copy or download your generated code</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setExportFormat('react')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    exportFormat === 'react'
                      ? 'bg-white text-slate-900'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  React / JSX
                </button>
                <button
                  onClick={() => setExportFormat('html')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                    exportFormat === 'html'
                      ? 'bg-white text-slate-900'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  HTML / CSS
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-white text-slate-900 rounded-lg hover:bg-gray-100 transition flex items-center gap-2 font-medium text-sm"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition flex items-center gap-2 font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start gap-3">
            <FileCode className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white font-medium mb-1">
                {exportFormat === 'react' ? 'React Component' : 'Standalone HTML File'}
              </p>
              <p className="text-xs text-gray-400">
                {exportFormat === 'react' 
                  ? 'Use this code directly in your Next.js or React project.'
                  : 'Complete HTML file with CSS. Open in any browser.'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <SyntaxHighlighter 
            language={language} 
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '24px',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
