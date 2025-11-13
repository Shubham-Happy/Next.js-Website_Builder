'use client';

import { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

type Device = 'desktop' | 'tablet' | 'mobile';

interface Props {
  children: React.ReactNode;
}

export function ResponsivePreview({ children }: Props) {
  const [device, setDevice] = useState<Device>('desktop');

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  return (
    <div className="flex-1 bg-sand-100 overflow-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-sand-200 px-6 py-3 flex items-center justify-center gap-2">
        <button
          onClick={() => setDevice('desktop')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${
            device === 'desktop'
              ? 'bg-slate-900 text-white'
              : 'bg-sand-50 text-slate-700 hover:bg-sand-100'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Desktop
        </button>
        <button
          onClick={() => setDevice('tablet')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${
            device === 'tablet'
              ? 'bg-slate-900 text-white'
              : 'bg-sand-50 text-slate-700 hover:bg-sand-100'
          }`}
        >
          <Tablet className="w-4 h-4" />
          Tablet
        </button>
        <button
          onClick={() => setDevice('mobile')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition ${
            device === 'mobile'
              ? 'bg-slate-900 text-white'
              : 'bg-sand-50 text-slate-700 hover:bg-sand-100'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Mobile
        </button>
        <span className="ml-4 text-sm text-gray-500">
          {deviceSizes[device].width}
        </span>
      </div>

      <div className="p-8 min-h-screen flex justify-center items-start">
        <div
          className="bg-white rounded-lg shadow-2xl transition-all duration-300 overflow-auto"
          style={{
            width: deviceSizes[device].width,
            maxWidth: '100%',
            height: device !== 'desktop' ? deviceSizes[device].height : 'auto',
            minHeight: device === 'desktop' ? '900px' : 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
