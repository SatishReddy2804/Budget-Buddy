import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { DailyPlan, Task } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  Info,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showMissedModal, setShowMissedModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Missed Day Form
  const [missedReason, setMissedReason] = useState<string>('HEALTH');
  const [missedExplanation, setMissedExplanation] = useState<string>('');
  const [rescheduling, setRescheduling] = useState<boolean>(false);

  // Custom Task Form
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('INCOME_TASK');
  const [customMinutes, setCustomMinutes] = useState<number>(30);
  const [customPriority, setCustomPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  useEffect(() => {
    loadPlan(selectedDate);
  }, [selectedDate]);

  const loadPlan = async (date: string) => {
    setLoading(true);
    try {
      const res = await api.peace.getDailyPlan(date);
      if (res.data?.success && res.data.data) {
        setDailyPlan(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load daily plan');
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
        toast.success(isCompleted ? 'Task completed! Momentum +1' : 'Task reopened');
      }
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleMissedDaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduling(true);
    try {
      const res = await api.peace.handleMissedDay({
        date: selectedDate,
        reasonCategory: missedReason,
        explanation: missedExplanation,
        postponeFullDay: missedReason === 'HEALTH' || missedReason === 'FAMILY_EMERGENCY',
      });
      if (res.data?.success && res.data.data) {
        setDailyPlan(res.data.data);
        toast.success(
          missedReason === 'HEALTH' || missedReason === 'FAMILY_EMERGENCY'
            ? 'Day postponed safely without streak penalty. Rest well!'
            : 'Incomplete tasks moved to Pending Tasks module.'
        );
        setShowMissedModal(false);
      }
    } catch (err) {
      toast.error('Failed to reschedule');
    } finally {
      setRescheduling(false);
    }
  };

  const handleAddCustomTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.peace.createTask({
        title: customTitle,
        category: customCategory,
        estimatedMinutes: customMinutes,
        priority: customPriority,
        dueDate: selectedDate,
      });
      if (res.data?.success) {
        toast.success('Custom task added to today’s plan');
        setShowAddModal(false);
        setCustomTitle('');
        loadPlan(selectedDate);
      }
    } catch (err) {
      toast.error('Failed to add custom task');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'MORNING_FOCUS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'SKILL_LEARNING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'INCOME_TASK':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'CLIENT_OUTREACH':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300';
      case 'SAVINGS_ACTION':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300';
      case 'HEALTH_ACTION':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            <span>PEACE Adaptive Daily Planner</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            7 structured compound momentum tasks engineered for continuous career growth and financial discipline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
          />

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>

          <button
            onClick={() => setShowMissedModal(true)}
            className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Reschedule</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Gauge Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Execution Status ({selectedDate})
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {dailyPlan?.completionPercentage || 0}% Completed
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dailyPlan?.completedMinutes || 0} mins done of {dailyPlan?.scheduledMinutes || 240} mins planned
            </p>
          </div>

          {dailyPlan?.isUnavailableDay && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-900 dark:text-amber-200 text-xs flex items-center space-x-2">
              <HeartPulse className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Day Postponed:</strong> {dailyPlan.unavailableReason} (Streak safely preserved)
              </span>
            </div>
          )}
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-brand-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${dailyPlan?.completionPercentage || 0}%` }}
          />
        </div>
      </div>

      {/* 7 Structured Tasks List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading today’s tasks...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dailyPlan?.tasks.map((task, idx) => {
            const isDone = task.status === 'COMPLETED';
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-3.5 min-w-0">
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

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(task.category)}`}>
                        {task.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {task.estimatedMinutes} mins
                      </span>
                      {task.priority === 'HIGH' && (
                        <span className="text-[10px] font-bold text-rose-500">High Priority</span>
                      )}
                      {task.carryForwardCount > 0 && (
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/50 px-1.5 rounded">
                          Carried Forward ({task.carryForwardCount}x)
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => setSelectedTask(task)}
                      className={`text-xs sm:text-sm font-bold cursor-pointer hover:text-blue-600 transition-colors ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTask(task)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 dark:bg-slate-800 rounded-lg flex-shrink-0"
                >
                  Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Details Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || 'Task Details'}
        description={`Category: ${selectedTask?.category} • Estimated: ${selectedTask?.estimatedMinutes} mins`}
      >
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300">Description</h4>
            <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{selectedTask?.description}</p>
          </div>

          {selectedTask?.instructions && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900">
              <h4 className="font-bold text-blue-900 dark:text-blue-200">Execution Instructions</h4>
              <p className="text-blue-800 dark:text-blue-300 mt-1 leading-relaxed">{selectedTask.instructions}</p>
            </div>
          )}

          {selectedTask?.expectedResult && (
            <div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Expected Result / Proof of Work</h4>
              <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{selectedTask.expectedResult}</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
            <button
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-slate-600 dark:text-slate-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (selectedTask) handleToggleTask(selectedTask.id, selectedTask.status);
                setSelectedTask(null);
              }}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold"
            >
              {selectedTask?.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Completed'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Missed Day / Rescheduling Modal */}
      <Modal
        isOpen={showMissedModal}
        onClose={() => setShowMissedModal(false)}
        title="Adaptive Rescheduling & Missed Day Handler"
        description="Life happens. If you are unwell or facing a family emergency, we postpone the full day safely without penalty."
      >
        <form onSubmit={handleMissedDaySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reason for Rescheduling
            </label>
            <select
              value={missedReason}
              onChange={(e) => setMissedReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="HEALTH">Health / Medical Issue (Safe Postponement)</option>
              <option value="FAMILY_EMERGENCY">Family Emergency (Safe Postponement)</option>
              <option value="HOLIDAY">Holiday / Festival</option>
              <option value="BIRTHDAY">Birthday / Celebration</option>
              <option value="TRAVEL">Travel</option>
              <option value="WORKLOAD">Heavy Workload</option>
              <option value="MOTIVATION">Low Energy / Mental Recharge</option>
              <option value="OTHER">Other Reason</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Note
            </label>
            <textarea
              rows={2}
              value={missedExplanation}
              onChange={(e) => setMissedExplanation(e.target.value)}
              placeholder="e.g. Fever and doctor visit; resting today."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            {missedReason === 'HEALTH' || missedReason === 'FAMILY_EMERGENCY' ? (
              <p>
                ✓ <strong>Safe Policy:</strong> Tasks for today will be safely deferred. Your daily completion streak will NOT be broken for health emergencies.
              </p>
            ) : (
              <p>
                ✓ Incomplete tasks will be safely carried into your <strong>Pending Tasks</strong> module so nothing is ever lost.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowMissedModal(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rescheduling}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
            >
              {rescheduling ? 'Updating...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Custom Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Custom Daily Task"
        description="Incorporate specialized commitments or client deliverables into today’s schedule."
      >
        <form onSubmit={handleAddCustomTask} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
            <input
              type="text"
              required
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Complete client invoice audit"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="INCOME_TASK">Income Generation</option>
                <option value="SKILL_LEARNING">Skill Learning</option>
                <option value="CLIENT_OUTREACH">Client Outreach</option>
                <option value="SAVINGS_ACTION">Savings Action</option>
                <option value="HEALTH_ACTION">Health & Fitness</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration (Mins)</label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
