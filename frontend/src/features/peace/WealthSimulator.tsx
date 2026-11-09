import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { WealthSimulationRequest, WealthSimulationResult } from '../../types';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const WealthSimulator: React.FC = () => {
  const [startingCapital, setStartingCapital] = useState<number>(50000);
  const [currentIncome, setCurrentIncome] = useState<number>(45000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(25000);
  const [targetWealth, setTargetWealth] = useState<number>(1500000); // 15 Lakhs
  const [targetYears, setTargetYears] = useState<number>(3);

  const [result, setResult] = useState<WealthSimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    runSimulation();
  }, [startingCapital, currentIncome, monthlyExpenses, targetWealth, targetYears]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const req: WealthSimulationRequest = {
        startingCapital,
        currentMonthlyIncome: currentIncome,
        monthlyEssentialExpenses: monthlyExpenses,
        targetWealthAmount: targetWealth,
        targetDurationYears: targetYears,
      };
      const res = await api.peace.simulateWealth(req);
      if (res.data?.success && res.data.data) {
        setResult(res.data.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const getFeasibilityBadge = (status?: string) => {
    switch (status) {
      case 'REALISTIC':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'AMBITIOUS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'VERY_AMBITIOUS':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
    }
  };

  // Prepare chart data combining 3 scenarios
  const chartData =
    result?.moderateScenario.yearlyMilestones.map((m, index) => {
      const cons = result.conservativeScenario.yearlyMilestones[index]?.endingBalance || 0;
      const mod = m.endingBalance;
      const amb = result.ambitiousScenario.yearlyMilestones[index]?.endingBalance || 0;
      return {
        year: `Year ${m.year}`,
        Conservative: cons,
        Moderate: mod,
        Ambitious: amb,
        Target: targetWealth,
      };
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          <span>Deterministic Wealth Goal Simulation</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Rigorous mathematical modeling across Conservative (5%), Moderate (8%), and Ambitious (11%) compound return scenarios.
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Simulation Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Starting Capital: <span className="font-bold text-blue-600">₹{startingCapital.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={startingCapital}
              onChange={(e) => setStartingCapital(parseFloat(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Current Monthly Income: <span className="font-bold text-blue-600">₹{currentIncome.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="0"
              max="300000"
              step="5000"
              value={currentIncome}
              onChange={(e) => setCurrentIncome(parseFloat(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Monthly Essential Expenses: <span className="font-bold text-blue-600">₹{monthlyExpenses.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="5000"
              max="200000"
              step="2500"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Wealth Objective: <span className="font-bold text-brand-600">₹{targetWealth.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="100000"
              max="10000000"
              step="100000"
              value={targetWealth}
              onChange={(e) => setTargetWealth(parseFloat(e.target.value) || 0)}
              className="w-full accent-brand-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Target Duration: <span className="font-bold text-brand-600">{targetYears} Years</span>
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={targetYears}
              onChange={(e) => setTargetYears(parseInt(e.target.value) || 1)}
              className="w-full accent-brand-600"
            />
          </div>

          <div className="flex flex-col justify-end">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500">
              Monthly Savings Capacity:{' '}
              <span className="font-bold text-emerald-600">
                ₹{Math.max(0, currentIncome - monthlyExpenses).toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feasibility Alert */}
      {result && (
        <div
          className={`p-6 rounded-2xl border shadow-sm ${getFeasibilityBadge(
            result.feasibilityStatus
          )}`}
        >
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider">
                Feasibility Assessment: {result.feasibilityStatus.replace(/_/g, ' ')}
              </div>
              <p className="text-xs mt-1.5 leading-relaxed font-medium">
                {result.feasibilityExplanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3 Scenarios Comparison Cards */}
      {result && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Conservative */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {result.conservativeScenario.scenarioName} (5% Annual Return)
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              ₹{result.conservativeScenario.requiredMonthlyContribution.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Monthly Shortfall:{' '}
              <span className="font-bold text-rose-600">
                ₹{result.conservativeScenario.monthlyShortfall.toLocaleString('en-IN')}
              </span>
            </p>
          </div>

          {/* Moderate */}
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/50 rounded-2xl p-6 shadow-md relative">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {result.moderateScenario.scenarioName} (8% Baseline Return)
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              ₹{result.moderateScenario.requiredMonthlyContribution.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Monthly Shortfall:{' '}
              <span className="font-bold text-amber-600">
                ₹{result.moderateScenario.monthlyShortfall.toLocaleString('en-IN')}
              </span>
            </p>
          </div>

          {/* Ambitious */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {result.ambitiousScenario.scenarioName} (11% Growth Return)
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              ₹{result.ambitiousScenario.requiredMonthlyContribution.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Monthly Shortfall:{' '}
              <span className="font-bold text-emerald-600">
                ₹{result.ambitiousScenario.monthlyShortfall.toLocaleString('en-IN')}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Projection Area Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Accumulated Wealth Projections Over Time
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" textAnchor="middle" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Conservative" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />
              <Area type="monotone" dataKey="Moderate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Area type="monotone" dataKey="Ambitious" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensitivity Analysis Table */}
      {result?.sensitivityAnalysis && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            Sensitivity Analysis & Levers
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Optimization Lever</th>
                  <th className="p-3">Adjustment Description</th>
                  <th className="p-3">Revised Wealth</th>
                  <th className="p-3">Timeline & Effort Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.sensitivityAnalysis.map((s, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{s.factor}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{s.changeDescription}</td>
                    <td className="p-3 font-bold text-brand-600">
                      ₹{s.revisedProjectedWealth.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-slate-500">{s.outcomeImpact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 text-xs flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0" />
        <span>
          Educational simulations only. Not financial, investment, tax, legal, or medical advice. No guaranteed returns are promised or implied.
        </span>
      </div>
    </div>
  );
};
