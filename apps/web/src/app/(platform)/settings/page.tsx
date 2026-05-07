'use client';
import { useState, useEffect } from 'react';
import { User, Bell, Key, Palette, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    defaultSymbol: 'BTC/USDT',
    defaultTimeframe: '60',
    emailAlerts: false,
    browserAlerts: true
  });
  const [apiKeys, setApiKeys] = useState<any[]>([]);

  useEffect(() => {
    // Fetch settings and API keys
    fetch('http://localhost:3001/user/settings', {
      headers: { Authorization: `Bearer ${(session?.user as any)?.id}` } // Note: real app uses proper token
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setSettings(data))
      .catch(console.error);

    fetch('http://localhost:3001/user/api-keys', {
      headers: { Authorization: `Bearer ${(session?.user as any)?.id}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => setApiKeys(data || []))
      .catch(console.error);
  }, [session]);

  const saveSettings = async () => {
    try {
      await fetch('http://localhost:3001/user/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session?.user as any)?.id}`
        },
        body: JSON.stringify(settings)
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const generateKey = async () => {
    try {
      const res = await fetch('http://localhost:3001/user/api-keys', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(session?.user as any)?.id}`
        },
        body: JSON.stringify({ label: `Key ${apiKeys.length + 1}` })
      });
      if (res.ok) {
        const key = await res.json();
        setApiKeys([...apiKeys, key]);
        toast.success('API Key generated');
      }
    } catch (e) {
      toast.error('Failed to generate key');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'apikeys', label: 'API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-bg-primary text-text-primary min-h-screen">
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 bg-bg-secondary border border-border rounded-2xl p-6 md:p-8">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">Profile Settings</h2>
                
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-20 h-20 rounded-full bg-accent-blue/20 text-accent-blue flex items-center justify-center text-3xl font-bold border border-accent-blue/30">
                    {session?.user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{session?.user?.name || 'Guest User'}</div>
                    <div className="text-text-secondary">{session?.user?.email || 'No email provided'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Display Name</label>
                    <input type="text" defaultValue={session?.user?.name || ''} className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent-blue" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email Address</label>
                    <input type="email" defaultValue={session?.user?.email || ''} readOnly className="w-full bg-bg-tertiary/50 border border-border rounded-lg px-4 py-2 text-text-muted cursor-not-allowed" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-bg-tertiary/30">
                    <div>
                      <div className="font-medium">Browser Notifications</div>
                      <div className="text-sm text-text-secondary">Receive push notifications when alerts trigger.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.browserAlerts} onChange={e => setSettings({...settings, browserAlerts: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-bg-tertiary/30">
                    <div>
                      <div className="font-medium">Email Alerts</div>
                      <div className="text-sm text-text-secondary">Receive daily summaries and critical alert triggers via email.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.emailAlerts} onChange={e => setSettings({...settings, emailAlerts: e.target.checked})} className="sr-only peer" />
                      <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'apikeys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <h2 className="text-xl font-bold">API Keys</h2>
                  <button onClick={generateKey} className="px-3 py-1.5 bg-bg-tertiary hover:bg-border rounded-md text-sm font-medium transition-colors">
                    Generate Key
                  </button>
                </div>
                
                <p className="text-sm text-text-secondary mb-4">Use API keys to programmatically manage your watchlists, alerts, and access historical data.</p>
                
                {apiKeys.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border rounded-xl text-text-secondary">
                    No API keys generated yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-xl bg-bg-tertiary/30 gap-4">
                        <div>
                          <div className="font-medium mb-1">{key.label}</div>
                          <div className="text-xs font-mono bg-bg-primary px-2 py-1 rounded text-text-secondary">{key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}</div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto text-sm">
                          <span className="text-text-muted mr-4">Created {new Date(key.createdAt).toLocaleDateString()}</span>
                          <button className="text-negative hover:bg-negative/10 px-2 py-1 rounded transition-colors">Revoke</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold border-b border-border pb-4 mb-6">Appearance & Chart</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Default Symbol</label>
                    <input 
                      type="text" 
                      value={settings.defaultSymbol} 
                      onChange={e => setSettings({...settings, defaultSymbol: e.target.value})}
                      className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent-blue uppercase" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Default Timeframe</label>
                    <select 
                      value={settings.defaultTimeframe}
                      onChange={e => setSettings({...settings, defaultTimeframe: e.target.value})}
                      className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-accent-blue"
                    >
                      <option value="1">1m</option>
                      <option value="5">5m</option>
                      <option value="15">15m</option>
                      <option value="60">1h</option>
                      <option value="D">1D</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button 
                onClick={saveSettings}
                className="flex items-center space-x-2 px-6 py-2.5 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-medium transition-colors shadow-lg shadow-accent-blue/20"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
