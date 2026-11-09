import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { ProgressAnalytics } from '../../types';
import {
  BarChart3,
  Flame,
  Award,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

export const ProgressAnalyticsView: React.FC = () => {
  const [data, setData] = useState<ProgressAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.peace.getProgressAnalytics();
      if (res.data?.success && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-900';
      case 2:
        return 'bg-emerald-400 dark:bg-emerald-700';
      case 3:
        return 'bg-emerald-600 dark:bg-emerald-500';
      case 4:
        return 'bg-emerald-800 dark:bg-emerald-400';
      default:
        return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span>PEACE Progress & Accountability Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Measurable, non-fabricated execution data derived strictly from your stored daily task completions.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.currentStreakDays || 0} <span className="text-xs font-normal text-slate-400">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Longest: {data?.longestStreakDays || 0} days</p>
        </div>

        {/* Weekly Completion Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>7-Day Completion</span>
            <CalendarCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.weeklyProgressRate || 0}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Rolling 7-day average</p>
        </div>

        {/* Total Tasks Done */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.totalTasksCompleted || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Verified output items</p>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Active Backlog</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data?.totalPendingTasks || 0}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Carried forward tasks</p>
        </div>
      </div>

      {/* GitHub-style 90-Day Contribution Heatmap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          90-Day Execution Consistency Heatmap
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Each block indicates tasks executed on that date. Darker green corresponds to higher volume completed.
        </p>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-2">
              {data?.heatmap.map((cell) => (
                <div
                  key={cell.date}
                  title={`${cell.date}: ${cell.count} tasks completed`}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${getIntensityColor(
                    cell.level
                  )}`}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end space-x-2 text-[10px] text-slate-400">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
              <span className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
              <span className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
              <span className="w-3 h-3 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
              <span className="w-3 h-3 rounded-sm bg-emerald-800 dark:bg-emerald-400" />
              <span>More</span>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Adjustment History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Plan Adjustment & Rescheduling Audit Log
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Transparent record of all postponed days and carried forward tasks.
        </p>

        {data?.adjustmentHistory && data.adjustmentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Reason Category</th>
                  <th className="p-3">Tasks Rescheduled</th>
                  <th className="p-3">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.adjustmentHistory.map((h) => (
                  <tr key={h.id}>
                    <td className="p-3 text-slate-500">{new Date(h.timestamp).toLocaleDateString()}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{h.reasonCategory}</td>
                    <td className="p-3 text-blue-600 font-semibold">{h.taskCount} tasks</td>
                    <td className="p-3 text-slate-500">{h.explanation || 'No note entered'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">
            No rescheduling events recorded. Consistent execution track!
          </p>
        )}
      </div>
    </div>
  );
};
