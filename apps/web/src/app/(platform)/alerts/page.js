'use client';
import { useState } from 'react';
import { Bell, Plus, Search, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { useAlerts } from '../../../hooks/useAlerts';
import Link from 'next/link';
export default function AlertsPage() {
    const { alerts, deleteAlert } = useAlerts();
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, TRIGGERED
    const filteredAlerts = alerts?.filter(a => {
        if (filter === 'ACTIVE')
            return !a.triggered;
        if (filter === 'TRIGGERED')
            return a.triggered;
        return true;
    }) || [];
    return (<div className="flex-1 overflow-y-auto bg-bg-primary p-6 md:p-10 text-text-primary min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
            <p className="text-text-secondary">Manage your active and historical market alerts.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/terminal" className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue-hover transition-colors shadow-lg shadow-accent-blue/20">
              <Plus size={18}/>
              <span>New Alert</span>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="flex items-center space-x-3 mb-2 text-text-secondary">
              <Bell size={18}/>
              <span className="font-medium">Total Alerts</span>
            </div>
            <div className="text-3xl font-bold">{alerts?.length || 0}</div>
          </div>
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="flex items-center space-x-3 mb-2 text-positive">
              <CheckCircle2 size={18}/>
              <span className="font-medium text-text-secondary">Active</span>
            </div>
            <div className="text-3xl font-bold">{alerts?.filter(a => !a.triggered).length || 0}</div>
          </div>
          <div className="bg-bg-secondary border border-border p-5 rounded-xl">
            <div className="flex items-center space-x-3 mb-2 text-warning">
              <XCircle size={18}/>
              <span className="font-medium text-text-secondary">Triggered</span>
            </div>
            <div className="text-3xl font-bold">{alerts?.filter(a => a.triggered).length || 0}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-bg-secondary p-2 border border-border rounded-lg">
          <div className="flex space-x-1 w-full sm:w-auto">
            {['ALL', 'ACTIVE', 'TRIGGERED'].map(f => (<button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 sm:flex-none ${filter === f ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                {f}
              </button>))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"/>
            <input type="text" placeholder="Search symbol..." className="w-full bg-bg-tertiary border border-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-accent-blue"/>
          </div>
        </div>

        {/* Table */}
        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-tertiary border-b border-border">
              <tr>
                <th className="p-4 font-medium text-text-secondary">Symbol</th>
                <th className="p-4 font-medium text-text-secondary">Condition</th>
                <th className="p-4 font-medium text-text-secondary">Price Target</th>
                <th className="p-4 font-medium text-text-secondary">Status</th>
                <th className="p-4 font-medium text-text-secondary">Created</th>
                <th className="p-4 font-medium text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAlerts.length === 0 ? (<tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No alerts found for this filter.
                  </td>
                </tr>) : (filteredAlerts.map(alert => (<tr key={alert.id} className="hover:bg-bg-tertiary/50 transition-colors">
                    <td className="p-4 font-bold">{alert.symbol}</td>
                    <td className="p-4">
                      <span className="bg-bg-tertiary px-2 py-1 rounded text-xs font-mono">{alert.condition}</span>
                    </td>
                    <td className="p-4 font-medium">{alert.price.toLocaleString()}</td>
                    <td className="p-4">
                      {alert.triggered ? (<span className="inline-flex items-center space-x-1 text-warning bg-warning/10 px-2 py-0.5 rounded text-xs font-medium">
                          <CheckCircle2 size={12}/>
                          <span>Triggered</span>
                        </span>) : (<span className="inline-flex items-center space-x-1 text-positive bg-positive/10 px-2 py-0.5 rounded text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse"></span>
                          <span>Active</span>
                        </span>)}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => deleteAlert.mutate(alert.id)} className="text-text-muted hover:text-negative p-1.5 rounded-md hover:bg-negative/10 transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>)))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map