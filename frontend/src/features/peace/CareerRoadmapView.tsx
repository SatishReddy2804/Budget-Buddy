import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { CareerRoadmap, RoadmapMilestone } from '../../types';
import { Milestone, CheckCircle2, Circle, Clock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

export const CareerRoadmapView: React.FC = () => {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const res = await api.peace.getActiveRoadmap();
      if (res.data?.success && res.data.data) {
        setRoadmap(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Milestone className="w-6 h-6 text-blue-600" />
          <span>PEACE Structured Career Roadmap</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Measurable 5-phase career milestone plan designed to systematically take you from foundation to verified income.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading roadmap milestones...</p>
        </div>
      ) : !roadmap ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-xs text-slate-500">No active roadmap found. Please select an opportunity first.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Active Track
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {roadmap.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Timeline: {roadmap.startDate} to {roadmap.targetEndDate} • {roadmap.milestones?.length || 5} Major Milestones
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-slate-400">Current Phase</span>
                <p className="font-bold text-blue-600">Phase {roadmap.currentPhase}</p>
              </div>
              <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                <span className="text-[10px] text-slate-400">Status</span>
                <p className="font-bold text-emerald-600">{roadmap.status}</p>
              </div>
            </div>
          </div>

          {/* 5 Milestone Cards */}
          <div className="space-y-4">
            {roadmap.milestones?.map((m, index) => {
              const isCurrent = m.phaseNumber === roadmap.currentPhase;
              return (
                <div
                  key={m.id}
                  className={`p-6 rounded-2xl border shadow-sm transition-all ${
                    m.isCompleted
                      ? 'bg-emerald-50/30 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
                      : isCurrent
                      ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3.5">
                      <div className="mt-0.5">
                        {m.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Circle className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-slate-300'}`} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Phase {m.phaseNumber}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              Active Focus
                            </span>
                          )}
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {m.title}
                        </h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs flex-shrink-0">
                      <div className="font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-end space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{m.targetCompletionDays} days</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {m.isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
