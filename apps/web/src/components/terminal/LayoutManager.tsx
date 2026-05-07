'use client';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Save, LayoutGrid, ChevronDown } from 'lucide-react';

export function LayoutManager() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-bg-tertiary rounded-md hover:bg-bg-tertiary/80 transition-colors text-text-primary"
      >
        <LayoutGrid size={16} className="text-accent-blue" />
        <span className="text-sm font-medium">Default Layout</span>
        <ChevronDown size={14} className="text-text-secondary" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 w-56 bg-bg-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden py-1">
            {!user ? (
              <div className="p-4 text-xs text-text-secondary text-center">
                Sign in to save layouts to the cloud.
              </div>
            ) : (
              <>
                <div className="px-4 py-2 border-b border-border text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Saved Layouts
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary flex justify-between items-center group">
                    <span>Default Layout</span>
                    <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100">Load</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary flex justify-between items-center group">
                    <span>Crypto Analysis</span>
                    <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100">Load</span>
                  </button>
                </div>
                <div className="border-t border-border mt-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-accent-blue hover:bg-bg-tertiary flex items-center space-x-2">
                    <Save size={14} />
                    <span>Save Current Layout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
