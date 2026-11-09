import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import {
  DailyPlan,
  SpendingSummary,
  WealthSimulationResult,
  FinancialProfile,
} from '../../types';
import {
  Wallet,
  TrendingUp,
  ShieldCheck,
  Flame,
  CalendarCheck,
  ScanLine,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const MainDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [spendingSummary, setSpendingSummary] = useState<SpendingSummary | null>(null);
  const [simulation, setSimulation] = useState<WealthSimulationResult | null>(null);
  const [finProfile, setFinProfile] = useState<FinancialProfile | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [planRes, spendRes, peaceRes] = await Promise.all([
        api.peace.getDailyPlan(),
        api.expenses.getSpendingSummary(3),
        api.peace.getOverview(),
      ]);

      if (planRes.data?.success) setDailyPlan(planRes.data.data);
      if (spendRes.data?.success) setSpendingSummary(spendRes.data.data);
      if (peaceRes.data?.success) {
        setSimulation(peaceRes.data.data.simulation);
        setFinProfile(peaceRes.data.data.financialProfile);
      }
    } catch (err) {
      // Graceful error state
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: number, currentStatus: string) => {
    const isCompleted = currentStatus !== 'COMPLETED';
    try {
      const res = await api.peace.toggleTask(taskId, isCompleted);
      if (res.data?.success && res.data.data) {
        setDailyPlan(res.data.data);
        toast.success(isCompleted ? 'Task marked complete!' : 'Task reopened');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const savingsCapacity = finProfile
    ? Math.max(0, finProfile.currentMonthlyIncome - finProfile.monthlyEssentialExpenses)
    : 0;

  const runwayMonths = simulation ? simulation.financialRunwayMonths : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-700 via-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Budget Buddy Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-emerald-50 leading-relaxed">
            Your combined cockpit for smart receipt tracking and the <strong>PEACE Career & Wealth Engine</strong>. Plan today’s high-leverage actions and track your financial runway.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/expenses/scanner"
              className="px-4 py-2 bg-white text-brand-800 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <ScanLine className="w-4 h-4 text-brand-600" />
              <span>Scan New Receipt</span>
            </Link>

            <Link
              to="/peace/planner"
              className="px-4 py-2 bg-emerald-800/60 hover:bg-emerald-800/80 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>View Today’s 7 Tasks</span>
            </Link>

            <Link
              to="/peace/simulator"
              className="px-4 py-2 bg-emerald-800/60 hover:bg-emerald-800/80 text-white rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Simulate Wealth</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Savings Capacity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Savings Capacity</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{savingsCapacity.toLocaleString('en-IN')}
            <span className="text-xs font-medium text-slate-400">/mo</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Income minus essentials</p>
        </div>

        {/* Financial Runway */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Financial Runway</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {runwayMonths}
            <span className="text-xs font-medium text-slate-400"> Months</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {runwayMonths >= 6 ? '✓ Safe reserve buffer' : 'Target: 6 months reserve'}
          </p>
        </div>

        {/* Daily Execution Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Today’s Execution</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {dailyPlan?.completionPercentage || 0}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-brand-600 h-full rounded-full transition-all"
              style={{ width: `${dailyPlan?.completionPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* 90-Day Spend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Tracked Spend</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(spendingSummary?.totalExpenses || 0).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Savings rate: {spendingSummary?.savingsRate || 0}%
          </p>
        </div>
      </div>

      {/* Main Grid: Today's 7 Tasks & Spending Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Structured PEACE Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Today’s PEACE Execution Plan</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300">
                  {dailyPlan?.tasks.filter((t) => t.status === 'COMPLETED').length || 0} / {dailyPlan?.tasks.length || 7} Done
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Structured daily cadence: Morning focus, skill learning, income generation, outreach, savings, health, and review.
              </p>
            </div>
            <Link to="/peace/planner" className="text-xs font-bold text-brand-600 hover:underline flex items-center">
              Planner <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dailyPlan?.tasks.slice(0, 5).map((task) => {
              const isDone = task.status === 'COMPLETED';
              return (
                <div key={task.id} className="py-3 flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleTask(task.id, task.status)}
                    className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors flex-shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {task.estimatedMinutes}m
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>Life happens? Postpone safely without penalty</span>
            <Link to="/peace/planner" className="font-semibold text-brand-600 hover:underline">
              Reschedule Day
            </Link>
          </div>
        </div>

        {/* Right Col: Category Spending Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Spending Breakdown
              </h2>
              <Link to="/expenses/transactions" className="text-xs font-bold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            {spendingSummary?.categoryBreakdown && spendingSummary.categoryBreakdown.length > 0 ? (
              <div className="space-y-3">
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingSummary.categoryBreakdown}
                        dataKey="totalAmount"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {spendingSummary.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-2">
                  {spendingSummary.categoryBreakdown.slice(0, 4).map((cat) => (
                    <div key={cat.categoryName} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-slate-700 dark:text-slate-300">{cat.categoryName}</span>
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ₹{cat.totalAmount.toLocaleString('en-IN')} ({cat.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <ScanLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No expenses recorded yet.</p>
                <Link
                  to="/expenses/scanner"
                  className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Scan First Receipt
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 italic">
            Educational insights only. Not financial or investment advice.
          </div>
        </div>
      </div>
    </div>
  );
};
