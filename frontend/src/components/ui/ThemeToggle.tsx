import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Sun, Moon, Laptop } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useAuthStore();

  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => setTheme('light')}
        title="Light Theme"
        aria-label="Light Theme"
        className={`p-1.5 rounded-md text-xs flex items-center transition-colors ${
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        title="Dark Theme"
        aria-label="Dark Theme"
        className={`p-1.5 rounded-md text-xs flex items-center transition-colors ${
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        title="System Default Theme"
        aria-label="System Default Theme"
        className={`p-1.5 rounded-md text-xs flex items-center transition-colors ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm font-semibold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
};
