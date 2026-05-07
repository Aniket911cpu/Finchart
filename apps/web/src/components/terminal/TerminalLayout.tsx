import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { DrawingToolbar } from '../chart/DrawingToolbar';
import { WatchlistSidebar } from './WatchlistSidebar';
import { AlertPanel } from './AlertPanel';
import { useChartStore } from '../../store/chartStore';

export function TerminalLayout({ children }: { children: ReactNode }) {
  const isAlertsOpen = useChartStore(s => s.isAlertsOpen);
  const setAlertsOpen = useChartStore(s => s.setAlertsOpen);

  return (
    <div className="flex flex-col h-screen w-full bg-bg-primary overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <DrawingToolbar />
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
        {isAlertsOpen && <AlertPanel onClose={() => setAlertsOpen(false)} />}
        <WatchlistSidebar />
      </div>
    </div>
  );
}
