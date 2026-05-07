'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useChartStore } from '../../store/chartStore';
import { searchUDFSymbols } from '../../lib/api-client';

export function SymbolSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  
  const activeSymbol = useChartStore((s) => s.activeSymbol);
  const setSymbol = useChartStore((s) => s.setSymbol);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchUDFSymbols(query);
      setResults(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <div 
        className="flex items-center space-x-2 px-3 py-1.5 bg-bg-tertiary rounded-md cursor-pointer hover:bg-bg-tertiary/80 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <span className="font-bold text-text-primary">{activeSymbol}</span>
        <Search size={16} className="text-text-secondary" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 w-64 bg-bg-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-2 border-b border-border">
              <input
                autoFocus
                type="text"
                placeholder="Search symbol..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-text-primary text-sm placeholder:text-text-secondary"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {results.map((r) => (
                <div
                  key={r.symbol}
                  className="px-4 py-2 hover:bg-bg-tertiary cursor-pointer flex justify-between items-center"
                  onClick={() => {
                    setSymbol(r.symbol);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <span className="font-medium text-text-primary">{r.symbol}</span>
                  <span className="text-xs text-text-secondary">{r.exchange}</span>
                </div>
              ))}
              {query && results.length === 0 && (
                <div className="px-4 py-2 text-text-secondary text-sm">No results found</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
