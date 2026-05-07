import { useState, useEffect } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { useChartStore } from '../../store/chartStore';
import { useSession } from 'next-auth/react';
import { Bell, BellOff, Plus, Trash2, X } from 'lucide-react';
import { wsClient } from '../../lib/ws-client';
import toast from 'react-hot-toast';

export function AlertPanel({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession();
  const { alerts, isLoading, createAlert, deleteAlert } = useAlerts();
  const activeSymbol = useChartStore(s => s.activeSymbol);
  
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW' | 'CROSS'>('ABOVE');

  // Subscribe to user alerts WS channel
  useEffect(() => {
    if (session?.user?.id) {
      // The ws-client doesn't have an alert subscription method out of the box,
      // so we use the raw socket if available. In a full implementation,
      // we'd add `subscribeAlerts` to wsClient.
      const handleMessage = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          // Redis Pub/Sub pmessage passes the channel as 'channel' if we included it,
          // but we just pass the payload directly right now in `server.ts` `broadcastToChannel`
          if (data.condition && data.price && data.message) {
            toast.success(`ALERT TRIGGERED: ${data.message}`, {
              duration: 10000,
              icon: '🔔',
              style: {
                background: '#1A1D20',
                color: '#E8E9EC',
                border: '1px solid #2962FF'
              }
            });
          }
        } catch (e) {}
      };

      wsClient.socket?.addEventListener('message', handleMessage);
      
      if (wsClient.socket?.readyState === WebSocket.OPEN) {
        wsClient.socket.send(JSON.stringify({
          event: 'subscribe_alerts',
          payload: { userId: session.user.id }
        }));
      }

      return () => {
        wsClient.socket?.removeEventListener('message', handleMessage);
      };
    }
  }, [session]);

  const handleCreate = async () => {
    if (!price || isNaN(Number(price))) return;
    
    await createAlert.mutateAsync({
      symbol: activeSymbol,
      condition,
      price: Number(price),
      message: `${activeSymbol} crossed ${condition} ${price}`,
    });
    
    setPrice('');
    toast.success('Alert created');
  };

  if (!session) {
    return (
      <div className="w-80 h-full bg-bg-secondary border-l border-border flex flex-col items-center justify-center p-4">
        <BellOff size={48} className="text-text-muted mb-4" />
        <p className="text-text-secondary text-center text-sm">Please log in to use Price Alerts.</p>
        <button onClick={onClose} className="mt-4 text-accent-blue text-sm hover:underline">Close</button>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-bg-secondary border-l border-border flex flex-col shrink-0">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Bell size={18} className="text-text-primary" />
          <h2 className="text-text-primary font-medium">Price Alerts</h2>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-primary">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 border-b border-border bg-bg-tertiary/30">
        <h3 className="text-xs font-medium text-text-secondary mb-3 uppercase tracking-wider">Create Alert for {activeSymbol}</h3>
        
        <div className="space-y-3">
          <div className="flex bg-bg-primary rounded-md p-1">
            {['ABOVE', 'BELOW', 'CROSS'].map(c => (
              <button 
                key={c}
                onClick={() => setCondition(c as any)}
                className={`flex-1 text-xs py-1 rounded transition-colors ${condition === c ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input 
              type="number" 
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
              className="flex-1 bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent-blue"
            />
            <button 
              onClick={handleCreate}
              disabled={createAlert.isPending || !price}
              className="bg-accent-blue hover:bg-accent-blue-hover text-white px-3 py-1.5 rounded flex items-center justify-center disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center p-4 text-text-muted text-sm">Loading alerts...</div>
        ) : alerts?.length === 0 ? (
          <div className="text-center p-8 text-text-muted text-sm flex flex-col items-center">
            <Bell size={32} className="mb-2 opacity-50" />
            No active alerts
          </div>
        ) : (
          <div className="space-y-2">
            {alerts?.map(alert => (
              <div key={alert.id} className="bg-bg-primary border border-border rounded p-3 flex items-center justify-between group">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm text-text-primary">{alert.symbol}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      alert.condition === 'ABOVE' ? 'bg-positive/20 text-positive' : 
                      alert.condition === 'BELOW' ? 'bg-negative/20 text-negative' : 
                      'bg-accent-blue/20 text-accent-blue'
                    }`}>
                      {alert.condition}
                    </span>
                  </div>
                  <div className="text-text-secondary text-xs">
                    Trigger at {alert.price.toLocaleString()}
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteAlert.mutate(alert.id)}
                  className="text-text-muted hover:text-negative opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-bg-secondary"
                  title="Delete Alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
