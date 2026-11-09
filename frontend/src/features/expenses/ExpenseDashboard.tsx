import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { SpendingSummary } from '../../types';
import {
  Wallet,
  TrendingUp,
  ScanLine,
  ReceiptText,
  PiggyBank,
  ArrowRight,
  PieChart as PieIcon,
  Store,
  Plus,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ExpenseDashboard: React.FC = () => {
  const [data, setData] = useState<SpendingSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthsSpan, setMonthsSpan] = useState<number>(6);

  useEffect(() => {
    loadSummary();
  }, [monthsSpan]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await api.expenses.getSpendingSummary(monthsSpan);
      if (res.data?.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ReceiptText className="w-6 h-6 text-emerald-600" />
            <span>Smart Expense Manager & Financial Insights</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time cash flow, category budget envelopes, and OCR receipt intelligence.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/expenses/scanner"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-colors"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan Receipt</span>
          </Link>
          <Link
            to="/expenses/transactions"
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          >
            All Transactions
          </Link>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Income (Past {monthsSpan}M)</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(data?.totalIncome || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Expenses</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/50">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(data?.totalExpenses || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Net Accumulated Savings</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50">
              <PiggyBank className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ₹{(data?.netSavings || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Savings Rate</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/50">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-brand-600">
            {data?.savingsRate || 0}%
          </div>
        </div>
      </div>

      {/* Monthly Cash Flow Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Monthly Income vs Expense vs Net Savings
          </h2>
          <select
            value={monthsSpan}
            onChange={(e) => setMonthsSpan(parseInt(e.target.value))}
            className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
          </select>
        </div>

        <div className="h-72">
          {data?.monthlyTrends && data.monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Net Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No trend data recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Categories & Top Merchants */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Spending by Category
          </h2>

          {data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
            <div className="space-y-3">
              {data.categoryBreakdown.map((c) => (
                <div key={c.categoryName} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.categoryName}</span>
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      ₹{c.totalAmount.toLocaleString('en-IN')} ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No categorized expenses recorded yet.</p>
          )}
        </div>

        {/* Top Merchants */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Top Merchants by Expenditure
          </h2>

          {data?.topMerchants && data.topMerchants.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.topMerchants.map((m) => (
                <div key={m.merchant} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Store className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{m.merchant}</span>
                    <span className="text-[10px] text-slate-400">({m.transactionCount} transactions)</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ₹{m.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No merchant data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
