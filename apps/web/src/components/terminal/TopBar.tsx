'use client';
import { SymbolSearch } from '../shared/SymbolSearch';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { TimeframeSelector } from '../chart/TimeframeSelector';
import { Activity } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-14 border-b border-border bg-bg-secondary flex items-center justify-between px-4">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-accent-blue font-bold text-lg">
          <Activity size={24} />
          <span>FinChart Pro</span>
        </div>
        
        <div className="h-6 w-px bg-border"></div>
        
        <SymbolSearch />
        
        <div className="h-6 w-px bg-border"></div>
        
        <TimeframeSelector />
      </div>

      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
