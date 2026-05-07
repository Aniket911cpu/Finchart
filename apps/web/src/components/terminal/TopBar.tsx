'use client';
import { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useAuth } from '../auth/AuthProvider';
import { SymbolSearch } from '../shared/SymbolSearch';
import { ThemeSwitcher } from '../shared/ThemeSwitcher';
import { TimeframeSelector } from '../chart/TimeframeSelector';
import { ChartTypeSelector } from '../chart/ChartTypeSelector';
import { LayoutManager } from './LayoutManager';
import { Activity, User, Bell } from 'lucide-react';
import { LoginModal } from '../auth/LoginModal';
import { useChartStore } from '../../store/chartStore';

export function TopBar() {
  const { user } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <>
      <div className="h-14 border-b border-border bg-bg-secondary flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-accent-blue font-bold text-lg">
            <Activity size={24} />
            <span>FinChart Pro</span>
          </div>
          
          <div className="h-6 w-px bg-border"></div>
          <SymbolSearch />
          
          <div className="h-6 w-px bg-border"></div>
          <TimeframeSelector />

          <div className="h-6 w-px bg-border"></div>
          <ChartTypeSelector />
        </div>

        <div className="flex items-center space-x-4">
          <LayoutManager />
          
          <div className="h-6 w-px bg-border"></div>

          <button 
            onClick={() => useChartStore.getState().setAlertsOpen(!useChartStore.getState().isAlertsOpen)}
            className={`p-1.5 rounded transition-colors ${useChartStore.getState().isAlertsOpen ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}`}
            title="Price Alerts"
          >
            <Bell size={18} />
          </button>

          <div className="h-6 w-px bg-border"></div>

          <ThemeSwitcher />
          
          <div className="h-6 w-px bg-border"></div>
          
          {user ? (
            <div className="flex items-center space-x-3 cursor-pointer group relative">
              <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-white font-bold overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user.displayName?.[0] || user.email?.[0]?.toUpperCase()}</span>
                )}
              </div>
              
              {/* Dropdown for logout */}
              <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-bg-secondary border border-border rounded-lg shadow-xl py-1 w-48 z-50">
                <div className="px-4 py-2 border-b border-border text-sm">
                  <div className="font-medium text-text-primary truncate">{user.displayName || 'User'}</div>
                  <div className="text-text-secondary truncate">{user.email}</div>
                </div>
                <button 
                  onClick={() => firebaseSignOut(auth)}
                  className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-1.5 bg-accent-blue/10 hover:bg-accent-blue/20 text-accent-blue font-medium rounded-md transition-colors"
            >
              <User size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
