'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useChartStore } from '../../store/chartStore';
import { Plus, X, ChevronRight } from 'lucide-react';

export function WatchlistSidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const setSymbol = useChartStore((s) => s.setSymbol);
  
  // Mock data for demo purposes, since full backend sync requires API client with Bearer token
  useEffect(() => {
    if (user) {
      setWatchlists([
        {
          id: '1',
          name: 'Crypto Favorites',
          symbols: [
            { id: '1', symbol: 'BTC/USDT', exchange: 'BINANCE' },
            { id: '2', symbol: 'ETH/USDT', exchange: 'BINANCE' },
          ]
        },
        {
          id: '2',
          name: 'Tech Stocks',
          symbols: [
            { id: '3', symbol: 'AAPL', exchange: 'NASDAQ' },
            { id: '4', symbol: 'TSLA', exchange: 'NASDAQ' },
          ]
        }
      ]);
    } else {
      setWatchlists([]);
    }
  }, [user]);

  if (!isOpen) {
    return (
      <div 
        className="w-8 border-l border-border bg-bg-secondary flex flex-col items-center py-4 cursor-pointer hover:bg-bg-tertiary transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <div className="rotate-90 whitespace-nowrap text-text-secondary font-medium tracking-widest text-xs mt-10">
          WATCHLIST
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-l border-border bg-bg-secondary flex flex-col h-full transition-all duration-300 relative">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-text-primary">Watchlists</h3>
        <div className="flex space-x-2">
          <button className="text-text-secondary hover:text-text-primary"><Plus size={16} /></button>
          <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-text-primary"><ChevronRight size={16} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {!user ? (
          <div className="p-4 text-center text-text-secondary text-sm mt-10">
            Sign in to create custom watchlists and sync them across devices.
          </div>
        ) : (
          <div className="p-2 space-y-4">
            {watchlists.map((wl) => (
              <div key={wl.id} className="space-y-1">
                <div className="px-2 py-1 text-xs font-bold text-text-secondary uppercase tracking-wider flex justify-between group">
                  <span>{wl.name}</span>
                  <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer" />
                </div>
                {wl.symbols.map((sym: any) => (
                  <div 
                    key={sym.id}
                    onClick={() => setSymbol(sym.symbol)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-tertiary cursor-pointer group transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-text-primary font-medium text-sm">{sym.symbol}</span>
                      <span className="text-text-secondary text-xs">{sym.exchange}</span>
                    </div>
                    <X size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
