import { LineChart, LayoutList, Bell, Settings } from 'lucide-react';
export function LeftSidebar() {
    const icons = [
        { Icon: LineChart, label: 'Chart', active: true },
        { Icon: LayoutList, label: 'Watchlist', active: false },
        { Icon: Bell, label: 'Alerts', active: false },
        { Icon: Settings, label: 'Settings', active: false },
    ];
    return (<div className="w-14 border-r border-border bg-bg-secondary flex flex-col items-center py-4 space-y-6">
      {icons.map((item, i) => {
            const { Icon } = item;
            return (<button key={i} className={`p-2 rounded-xl transition-colors ${item.active
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'}`} title={item.label}>
            <Icon size={20}/>
          </button>);
        })}
    </div>);
}
//# sourceMappingURL=LeftSidebar.js.map