import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AiInsightResponse } from '../../types';
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  Loader2,
} from 'lucide-react';

export const AiAdvisorView: React.FC = () => {
  const [insights, setInsights] = useState<AiInsightResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await api.ai.getFinancialInsights();
      if (res.data?.success && res.data.data) {
        setInsights(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
            <BrainCircuit className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Financial Advisor & Spending Insights
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pattern recognition and optimization derived from your verified transaction history and PEACE roadmap.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Synthesizing personal spending telemetry...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Insight Card */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engine Mode: {insights?.providerMode}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {insights?.title}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-purple-100/90 leading-relaxed">
                {insights?.summary}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Real Data Observations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Identified Financial Patterns
                </h3>
              </div>

              <div className="space-y-3">
                {insights?.observations.map((obs, idx) => (
                  <div key={idx} className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <span className="font-bold text-purple-600 mt-0.5">•</span>
                    <span className="leading-relaxed">{obs}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Optimization Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recommended Practical Actions
                </h3>
              </div>

              <div className="space-y-3">
                {insights?.recommendedActions.map((action, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mandatory Educational Disclaimer */}
          <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Educational Insights Disclaimer
              </p>
              <p className="mt-0.5 leading-relaxed text-[11px]">
                {insights?.educationalDisclaimer || 'Educational insights only. Not financial, investment, tax, legal, or medical advice.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
