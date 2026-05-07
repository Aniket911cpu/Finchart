'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    return (<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-md hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors">
      {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
    </button>);
}
//# sourceMappingURL=ThemeSwitcher.js.map