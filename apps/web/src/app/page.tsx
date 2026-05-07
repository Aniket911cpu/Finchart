'use client';
import Link from 'next/link';
import { Activity, TrendingUp, Bell, Layers, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { TopBar } from '../components/terminal/TopBar'; // Or a separate Header if preferred, but for now we can just use a simple header

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E8E9EC] selection:bg-accent-blue/30 overflow-x-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2 text-accent-blue font-bold text-xl">
          <Activity size={28} />
          <span>FinChart Pro</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/terminal" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
            Terminal
          </Link>
          {session ? (
            <Link href="/terminal" className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(41,98,255,0.3)] hover:shadow-[0_0_25px_rgba(41,98,255,0.5)]">
              Launch App
            </Link>
          ) : (
            <Link href="/api/auth/signin" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 flex flex-col items-center text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
          <span>v2.0 is now live</span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 mb-6 max-w-4xl">
          Professional Grade Trading Analysis.
        </h1>
        
        <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
          Ultra-fast realtime market data, advanced technical indicators, drawing tools, and instant price alerts. Built for traders who demand performance.
        </p>
        
        <div className="flex items-center space-x-4">
          <Link href="/terminal" className="flex items-center space-x-2 px-8 py-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-medium rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(41,98,255,0.4)]">
            <span>Start Trading</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Mockup Preview */}
        <div className="mt-20 w-full max-w-6xl relative rounded-2xl border border-white/10 bg-[#151924] shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" 
            alt="Platform Interface" 
            className="w-full h-auto opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">6+ Technical Indicators</h3>
            <p className="text-text-secondary leading-relaxed">
              Client-side rendered SMA, EMA, MACD, RSI, Bollinger Bands, and VWAP. Zero lag, maximum precision.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-positive/10 flex items-center justify-center text-positive mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Multi-Pane Charting</h3>
            <p className="text-text-secondary leading-relaxed">
              Organize your workspace with unlimited sub-panes. Resize, rearrange, and sync cursors effortlessly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center text-warning mb-6">
              <Bell size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Price Alerts</h3>
            <p className="text-text-secondary leading-relaxed">
              Set complex crossover and boundary alerts. Get instantly notified via WebSockets when conditions are met.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-text-muted text-sm">
        <p>&copy; 2026 FinChart Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
