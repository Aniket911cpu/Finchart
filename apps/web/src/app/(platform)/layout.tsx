'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LineChart, Bell, Compass, Settings, BarChart2, Star, ChevronRight, LogOut, User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const navItems = [
  { href: '/terminal',  label: 'Terminal',  icon: LineChart,  desc: 'Charts & Analysis' },
  { href: '/explore',   label: 'Explore',   icon: Compass,    desc: 'Market Overview' },
  { href: '/alerts',    label: 'Alerts',    icon: Bell,       desc: 'Price Alerts' },
  { href: '/settings',  label: 'Settings',  icon: Settings,   desc: 'Preferences' },
];

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col border-r border-border bg-bg-secondary transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-56'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-14 border-b border-border px-4 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
          <Activity size={22} className="text-accent-blue flex-shrink-0" />
          {!collapsed && (
            <span className="font-bold text-sm text-white">FinChart Pro</span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon, desc }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-lg px-3 py-2.5 transition-colors group relative ${
                  active
                    ? 'bg-accent-blue/15 text-accent-blue'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <div className="ml-3 min-w-0">
                    <div className="text-sm font-medium truncate">{label}</div>
                    <div className="text-xs text-text-muted truncate">{desc}</div>
                  </div>
                )}
                {active && !collapsed && (
                  <ChevronRight size={14} className="ml-auto flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-border p-2">
          {session?.user ? (
            <div className={`flex items-center rounded-lg p-2 ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center text-sm font-bold flex-shrink-0 border border-accent-blue/20">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{session.user.name}</div>
                  <div className="text-xs text-text-muted truncate">{session.user.email}</div>
                </div>
              )}
              {!collapsed && (
                <button
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-1 text-text-muted hover:text-negative rounded transition-colors"
                >
                  <LogOut size={14} />
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className={`flex items-center justify-center rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors`}
            >
              <User size={18} />
              {!collapsed && <span className="ml-2 text-sm">Sign In</span>}
            </Link>
          )}

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center mt-1 p-2 text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight size={14} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
