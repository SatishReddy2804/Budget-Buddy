import React from 'react';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">Budget Buddy</span>
          <span>— Plan Smarter. Earn Better. Build Wealth.</span>
        </div>

        <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Educational insights only. Not financial, investment, tax, legal, or medical advice.</span>
        </div>

        <div className="text-[11px] text-slate-400">
          &copy; {new Date().getFullYear()} Budget Buddy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
