import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { Task } from '../../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export const CalendarView: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCalendarData();
  }, [currentMonth]);

  const loadCalendarData = async () => {
    setLoading(true);
    try {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const res = await api.peace.getCalendarTasks(start, end);
      if (res.data?.success && res.data.data) {
        setTasks(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            <span>Monthly Commitment Calendar</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visual overview of scheduled tasks and execution rhythm across days.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-3">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
            const isToday = isSameDay(day, new Date());
            const completedCount = dayTasks.filter((t) => t.status === 'COMPLETED').length;

            return (
              <div
                key={dateStr}
                onClick={() => navigate(`/peace/planner?date=${dateStr}`)}
                className={`min-h-[90px] p-2 rounded-xl border text-xs cursor-pointer transition-all hover:border-blue-500 hover:shadow-md flex flex-col justify-between ${
                  isToday
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 ring-1 ring-blue-500'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${isToday ? 'text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && completedCount === dayTasks.length && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </div>

                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className={`text-[10px] p-1 rounded truncate font-medium ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 line-through'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-semibold block text-center">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 mt-1">
                  {dayTasks.length > 0 && `${completedCount}/${dayTasks.length} done`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
