import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { LeftSidebar } from './LeftSidebar';

export function TerminalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full bg-bg-primary overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
