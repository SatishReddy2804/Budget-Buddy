import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Compass,
  Calculator,
  Milestone,
  CalendarCheck,
  ClockAlert,
  Calendar,
  BarChart3,
  MapPin,
  ScanLine,
  ReceiptText,
  PiggyBank,
  BrainCircuit,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { t } = useTranslation();

  const peaceLinks = [
    { to: '/peace/overview', label: t('nav.peaceModule'), icon: Compass },
    { to: '/peace/opportunities', label: t('nav.opportunities'), icon: Compass },
    { to: '/peace/simulator', label: t('nav.wealthSimulator'), icon: Calculator },
    { to: '/peace/roadmap', label: t('nav.roadmap'), icon: Milestone },
    { to: '/peace/planner', label: t('nav.planner'), icon: CalendarCheck },
    { to: '/peace/pending-tasks', label: t('nav.pendingTasks'), icon: ClockAlert },
    { to: '/peace/calendar', label: t('nav.calendar'), icon: Calendar },
    { to: '/peace/analytics', label: t('nav.analytics'), icon: BarChart3 },
    { to: '/peace/locations', label: t('nav.locationComparison'), icon: MapPin },
  ];

  const expenseLinks = [
    { to: '/expenses/dashboard', label: t('nav.expenseModule'), icon: ReceiptText },
    { to: '/expenses/scanner', label: t('nav.receiptScanner'), icon: ScanLine },
    { to: '/expenses/transactions', label: t('nav.transactions'), icon: ReceiptText },
    { to: '/expenses/budgets', label: t('nav.budgets'), icon: PiggyBank },
    { to: '/expenses/ai-advisor', label: t('nav.aiAdvisor'), icon: BrainCircuit },
  ];

  return (
    <aside
      className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Navigation */}
        <div>
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-2.5" />
            {t('nav.dashboard')}
          </NavLink>
        </div>

        {/* PEACE Module Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              PEACE Wealth Engine
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              PEACE
            </span>
          </div>
          <div className="space-y-1">
            {peaceLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Smart Expense Manager Section */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Smart Expense Manager
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
              OCR & AI
            </span>
          </div>
          <div className="space-y-1">
            {expenseLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2.5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* System Settings */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account & System
          </div>
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <Settings className="w-4 h-4 mr-2.5 flex-shrink-0" />
            {t('nav.settings')}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};
