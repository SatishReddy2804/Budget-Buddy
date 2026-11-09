import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { CareerRoadmap, WealthSimulationResult, UserProfile, FinancialProfile } from '../../types';
import {
  Compass,
  Milestone,
  TrendingUp,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';

export const PeaceOverview: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [simulation, setSimulation] = useState<WealthSimulationResult | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [finProfile, setFinProfile] = useState<FinancialProfile | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const [roadmapRes, peaceRes] = await Promise.all([
        api.peace.getActiveRoadmap(),
        api.peace.getOverview(),
      ]);

      if (roadmapRes.data?.success) setRoadmap(roadmapRes.data.data);
      if (peaceRes.data?.success) {
        setSimulation(peaceRes.data.data.simulation);
        setProfile(peaceRes.data.data.profile);
        setFinProfile(peaceRes.data.data.financialProfile);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getFeasibilityBadge = (status?: string) => {
    switch (status) {
      case 'REALISTIC':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
      case 'AMBITIOUS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300';
      case 'VERY_AMBITIOUS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                PEACE Wealth & Career Engine
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personal Economic Advancement & Career Engine — Adaptive execution roadmaps
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/peace/simulator"
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
          >
            Wealth Simulator
          </Link>
          <Link
            to="/peace/planner"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            Today's Planner
          </Link>
        </div>
      </div>

      {/* Active Roadmap Banner */}
      {roadmap ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                Active Career Roadmap
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {roadmap.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Timeline: {roadmap.startDate} to {roadmap.targetEndDate} • Current Phase: {roadmap.currentPhase} of {roadmap.totalPhases}
              </p>
            </div>

            <Link
              to="/peace/roadmap"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
            >
              <span>Manage Milestones</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Milestone timeline progress */}
          <div className="grid sm:grid-cols-5 gap-3">
            {roadmap.milestones?.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border text-xs ${
                  m.isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
                    : m.phaseNumber === roadmap.currentPhase
                    ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[10px] uppercase text-slate-500">
                    Phase {m.phaseNumber}
                  </span>
                  {m.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{m.title}</div>
                <div className="text-[10px] text-slate-400 mt-1">{m.targetCompletionDays} days</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
          <Milestone className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            No Active Career Roadmap Selected
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Discover vetted opportunities suited to your skills, capital, and daily hours, then activate your roadmap.
          </p>
          <Link
            to="/peace/opportunities"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Goal Feasibility & Metrics */}
      {simulation && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Goal Feasibility
            </span>
            <div className="mt-2 flex items-center space-x-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getFeasibilityBadge(
                  simulation.feasibilityStatus
                )}`}
              >
                {simulation.feasibilityStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
              {simulation.feasibilityExplanation}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Monthly Requirement (Moderate 8%)
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              ₹{simulation.moderateScenario.requiredMonthlyContribution.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Monthly Shortfall: <span className="font-bold text-amber-600">₹{simulation.moderateScenario.monthlyShortfall.toLocaleString('en-IN')}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Emergency Reserve & Runway
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {simulation.financialRunwayMonths} <span className="text-xs font-normal text-slate-400">Months Runway</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              6-Month Reserve Needed: <span className="font-bold text-slate-700 dark:text-slate-300">₹{simulation.emergencyReserveNeeded.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span>
          Educational roadmap and deterministic mathematical simulation only. Not financial, investment, tax, or legal advice.
        </span>
      </div>
    </div>
  );
};
