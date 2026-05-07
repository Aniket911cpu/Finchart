'use client';
import Link from 'next/link';
import { Activity, TrendingUp, Bell, Layers, ArrowRight, Zap, Brain, Shield, Globe, BarChart2, Users, ChevronRight, Check, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

const FEATURES = [
  { icon: BarChart2, title: '50+ Timeframes', desc: 'From 1-second scalping to monthly swing analysis. Every resolution, zero compromise.', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { icon: TrendingUp, title: '30+ Indicators', desc: 'SMA, EMA, MACD, RSI, Bollinger Bands, VWAP, Ichimoku & more — rendered client-side for zero lag.', color: 'text-positive', bg: 'bg-positive/10' },
  { icon: Bell, title: 'Smart Alerts', desc: 'Multi-condition price & indicator alerts. Fire-once, repeating, or time-bounded with email + push delivery.', color: 'text-warning', bg: 'bg-warning/10' },
  { icon: Layers, title: 'Multi-Pane Layouts', desc: 'Up to 8 simultaneous chart panels with synchronized crosshairs and independent timeframes.', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  { icon: Brain, title: 'AI Chart Analysis', desc: 'GPT-4o powered chart summaries, pattern detection, and an AI assistant that speaks trader.', color: 'text-[#a78bfa]', bg: 'bg-[#a78bfa]/10' },
  { icon: Globe, title: 'All Asset Classes', desc: 'Stocks, Crypto, Forex, Commodities, Indices — NSE, NYSE, Binance, and 50+ exchanges in one terminal.', color: 'text-positive', bg: 'bg-positive/10' },
  { icon: Zap, title: 'Real-Time WebSocket', desc: 'Sub-50ms tick updates streaming directly to your chart canvas. No polling, no delay.', color: 'text-warning', bg: 'bg-warning/10' },
  { icon: Shield, title: 'Enterprise Security', desc: 'TLS 1.3, bcrypt auth, JWT rotation, 2FA TOTP, rate limiting, and GDPR compliance built-in.', color: 'text-[#34d399]', bg: 'bg-[#34d399]/10' },
  { icon: Users, title: 'Social Community', desc: 'Publish chart ideas, follow expert traders, and copy-trade top performers (coming soon).', color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
];

const PLANS = [
  {
    name: 'Free', price: '$0', period: '/forever', highlight: false,
    features: ['3 Watchlists', '10 Alerts', '5 Indicators', '1 Year History', 'Crypto Real-Time', '3 AI Summaries/day'],
    cta: 'Start Free', href: '/api/auth/signin',
  },
  {
    name: 'Pro', price: '$12', period: '/month', highlight: true,
    badge: 'Most Popular',
    features: ['Unlimited Watchlists', 'Unlimited Alerts', 'All 30+ Indicators', '10 Years History', 'All Markets Real-Time', '50 AI Summaries/day', 'Paper Trading', 'Full Screener', 'CSV/JSON Export'],
    cta: 'Start Pro Trial', href: '/api/auth/signin',
    note: '₹999/month for India',
  },
  {
    name: 'Enterprise', price: '$49', period: '/seat/month', highlight: false,
    features: ['Everything in Pro', 'SSO / SAML', 'White-label Embed', 'SLA 99.9%', 'Custom Data Feeds', '< 2hr Priority Support', 'Advanced API', 'Audit Logs'],
    cta: 'Contact Sales', href: 'mailto:sales@finchart.pro',
  },
];

const STATS = [
  { value: '50+', label: 'Exchanges' },
  { value: '<50ms', label: 'WS Latency' },
  { value: '30+', label: 'Indicators' },
  { value: '5yr', label: 'History' },
];

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#E8E9EC] selection:bg-accent-blue/30 overflow-x-hidden">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 backdrop-blur-md sticky top-0 z-50 bg-[#0A0D14]/80">
        <div className="flex items-center space-x-2 text-accent-blue font-bold text-xl">
          <Activity size={24} />
          <span>FinChart Pro</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm text-text-secondary">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/terminal" className="hover:text-white transition-colors">Terminal</Link>
        </nav>
        <div className="flex items-center space-x-3">
          {session ? (
            <Link href="/terminal" className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white text-sm font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_15px_rgba(41,98,255,0.3)]">
              Launch App
            </Link>
          ) : (
            <>
              <Link href="/api/auth/signin" className="text-sm text-text-secondary hover:text-white transition-colors hidden sm:block">Sign In</Link>
              <Link href="/api/auth/signin" className="px-4 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white text-sm font-medium rounded-lg transition-all hover:scale-105 shadow-[0_0_15px_rgba(41,98,255,0.3)]">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 lg:pt-40 lg:pb-24 px-6 lg:px-12 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-accent-blue/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-32 left-1/4 w-[400px] h-[300px] bg-[#a78bfa]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
            <span>Now with AI Chart Analysis • v2.0 Live</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 max-w-5xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
              Professional Trading Analysis.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-[#a78bfa]">
              Powered by AI.
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed">
            Ultra-fast real-time charts across Stocks, Crypto, Forex & more. 30+ indicators, smart alerts, AI pattern detection — built for traders who demand performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/terminal" className="flex items-center space-x-2 px-8 py-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(41,98,255,0.4)] hover:shadow-[0_0_60px_rgba(41,98,255,0.6)]">
              <span>Start Trading Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="#features" className="flex items-center space-x-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium rounded-xl transition-all">
              <span>See All Features</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-2xl">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-2xl lg:text-3xl font-bold text-white">{value}</span>
                <span className="text-xs text-text-muted mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform mockup */}
        <div className="relative z-10 mt-20 w-full max-w-6xl">
          <div className="rounded-2xl border border-white/10 bg-[#111827] shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Faux titlebar */}
            <div className="h-9 bg-[#0d1117] border-b border-white/5 flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="ml-4 flex-1 h-5 bg-white/5 rounded-full max-w-xs" />
            </div>
            <div className="bg-gradient-to-b from-[#111827] to-[#0A0D14] aspect-[16/7] flex items-center justify-center">
              <div className="text-text-muted text-sm text-center px-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Activity size={32} className="text-accent-blue" />
                  <span className="text-white text-2xl font-bold">FinChart Pro Terminal</span>
                </div>
                <p className="text-text-secondary">Multi-pane charts • Real-time data • AI analysis</p>
                <Link href="/terminal" className="inline-flex items-center space-x-2 mt-6 px-6 py-3 bg-accent-blue hover:bg-accent-blue-hover text-white font-medium rounded-lg transition-colors text-sm">
                  <span>Open Terminal →</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-accent-blue/20 blur-3xl rounded-full" />
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything you need. Nothing you don't.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Built from scratch for professional traders — not adapted from a generic SaaS template.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 transition-all group">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center ${color} mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Competitor Comparison ─────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 max-w-5xl mx-auto border-t border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why not TradingView?</h2>
          <p className="text-text-secondary">We respect TradingView. We just built what they never did.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-text-muted font-normal">Feature</th>
                <th className="py-4 px-6 text-text-secondary font-normal">TradingView</th>
                <th className="py-4 px-6 text-accent-blue font-semibold">FinChart Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Native AI Analysis', '❌', '✅'],
                ['AI Chart Assistant', '❌', '✅'],
                ['Pattern Detection (ML)', '❌', '✅'],
                ['Paper Trading', '✅', '✅'],
                ['DEX / DeFi Charting', '❌ Limited', '✅'],
                ['Portfolio P&L Tracking', '❌', '✅'],
                ['India Pricing (INR)', '❌', '✅ ₹999/mo'],
                ['Open API (JSON)', '✅ Premium', '✅ Free'],
                ['Price (Pro tier)', '$59.95/mo', '$12/mo'],
              ].map(([feat, tv, fp]) => (
                <tr key={String(feat)} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-4 text-text-secondary">{feat}</td>
                  <td className="py-3 px-6 text-center text-text-muted">{tv}</td>
                  <td className="py-3 px-6 text-center text-white font-medium">{fp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Simple, transparent pricing.</h2>
          <p className="text-text-secondary">Start free. Upgrade when you need more. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? 'bg-accent-blue/10 border-accent-blue/40 shadow-[0_0_60px_rgba(41,98,255,0.15)]'
                  : 'bg-white/[0.02] border-white/[0.06]'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-blue text-white text-xs font-semibold rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-text-muted text-sm">{plan.period}</span>
                </div>
                {plan.note && <p className="text-xs text-text-muted mt-1">{plan.note}</p>}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start space-x-2.5 text-sm">
                    <Check size={14} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-accent-blue' : 'text-positive'}`} />
                    <span className="text-text-secondary">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-center transition-all ${
                  plan.highlight
                    ? 'bg-accent-blue hover:bg-accent-blue-hover text-white shadow-[0_0_20px_rgba(41,98,255,0.4)] hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-accent-blue/10 rounded-3xl blur-3xl" />
          <div className="relative z-10 bg-white/[0.02] border border-white/10 rounded-3xl py-16 px-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to trade smarter?
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Join traders who have switched from TradingView. No credit card required.
            </p>
            <Link href="/terminal" className="inline-flex items-center space-x-2 px-10 py-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(41,98,255,0.5)] text-lg">
              <span>Open the Terminal</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-accent-blue font-bold">
            <Activity size={20} />
            <span>FinChart Pro</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <a href="mailto:privacy@finchart.pro" className="hover:text-text-secondary transition-colors">Privacy</a>
            <a href="mailto:sales@finchart.pro" className="hover:text-text-secondary transition-colors">Contact</a>
            <Link href="/terminal" className="hover:text-text-secondary transition-colors">Terminal</Link>
          </div>
          <p className="text-text-muted text-sm">© 2026 FinChart Pro. Not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
