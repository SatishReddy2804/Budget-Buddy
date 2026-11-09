import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { PendingTask } from '../../types';
import {
  ClockAlert,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const PendingTasksView: React.FC = () => {
  const [tasks, setTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadPendingTasks();
  }, []);

  const loadPendingTasks = async () => {
    setLoading(true);
    try {
      const res = await api.peace.getPendingTasks();
      if (res.data?.success && res.data.data) {
        setTasks(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load pending tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await api.peace.resolvePendingTask(id, true);
      if (res.data?.success) {
        toast.success('Task marked completed and removed from pending queue!');
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      toast.error('Failed to resolve task');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCarryForward = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await api.peace.carryForwardPendingTask(id);
      if (res.data?.success) {
        toast.success('Task scheduled into today’s daily planner!');
        loadPendingTasks();
      }
    } catch (err) {
      toast.error('Failed to carry forward task');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <ClockAlert className="w-6 h-6 text-amber-500" />
          <span>Pending & Carried-Forward Tasks</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Zero lost work. Review incomplete tasks from past days, complete them directly, or reschedule into today’s execution block.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading pending backlog...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Inbox Zero! No Pending Tasks Backlog
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            You are fully caught up with your scheduled commitments. Great job maintaining daily momentum!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Original Date: {t.originalDate}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {t.estimatedMinutes} mins
                  </span>
                  {t.priority === 'HIGH' && (
                    <span className="text-[10px] font-bold text-rose-500">High Priority</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.title}
                </h3>
                {t.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.description}
                  </p>
                )}
                {t.reason && (
                  <p className="text-[11px] text-amber-600 mt-1 italic">
                    Reason: {t.reason}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleCarryForward(t.id)}
                  disabled={processingId === t.id}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Schedule Today
                </button>
                <button
                  onClick={() => handleResolve(t.id)}
                  disabled={processingId === t.id}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
