import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { Opportunity } from '../../types';
import {
  Compass,
  Filter,
  Clock,
  Coins,
  GraduationCap,
  TrendingUp,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from 'lucide-react';

export const OpportunityDiscovery: React.FC = () => {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  // Filters
  const [category, setCategory] = useState<string>('');
  const [maxCapital, setMaxCapital] = useState<number>(50000);
  const [maxDailyHours, setMaxDailyHours] = useState<number>(6);
  const [riskLevel, setRiskLevel] = useState<string>('');

  useEffect(() => {
    loadOpportunities();
  }, [category, maxCapital, maxDailyHours, riskLevel]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await api.peace.getOpportunities({
        category: category || undefined,
        maxCapital: maxCapital || undefined,
        maxDailyHours: maxDailyHours || undefined,
        riskLevel: riskLevel || undefined,
      });
      if (res.data?.success && res.data.data) {
        setOpportunities(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOpportunity = async (opp: Opportunity) => {
    setActivatingId(opp.id);
    try {
      const res = await api.peace.selectOpportunity(opp.id, `${opp.title} Roadmap`);
      if (res.data?.success) {
        toast.success(`Active roadmap set to: ${opp.title}`);
        navigate('/peace/roadmap');
      }
    } catch (err) {
      toast.error('Failed to activate roadmap');
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          PEACE Opportunity Discovery Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Realistic, verified income streams spanning AI workflows, tech services, remote support, tutoring, and freelance operations.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter Opportunities</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="">All Categories (12 Streams)</option>
              <option value="AI_SERVICES">AI Services & Workflows</option>
              <option value="SOFTWARE_SERVICES">Software & Web Services</option>
              <option value="DIGITAL_MARKETING">Performance Marketing & SEO</option>
              <option value="REMOTE_EMPLOYMENT">Remote Cloud & Tech Support</option>
              <option value="FREELANCING">Freelance Tech Writing</option>
              <option value="LOCAL_SERVICES">Local GST & Accounting</option>
              <option value="CONSULTING_TUTORING">Online STEM & Coding Tutoring</option>
              <option value="SKILL_MONETIZATION">Mobile UI/UX Design</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Max Initial Capital: <span className="font-bold text-blue-600">₹{maxCapital.toLocaleString('en-IN')}</span>
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="2500"
              value={maxCapital}
              onChange={(e) => setMaxCapital(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Max Daily Time: <span className="font-bold text-blue-600">{maxDailyHours} hrs/day</span>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={maxDailyHours}
              onChange={(e) => setMaxDailyHours(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            >
              <option value="">Any Risk Level</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading verified opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No opportunities match current filter constraints.</p>
          <button
            onClick={() => {
              setCategory('');
              setMaxCapital(50000);
              setMaxDailyHours(6);
              setRiskLevel('');
            }}
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">
                    {opp.category.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {opp.locationType}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {opp.title}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {opp.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Potential Revenue</span>
                    <p className="font-bold text-emerald-600">
                      ₹{opp.minMonthlyRevenue.toLocaleString('en-IN')} - ₹{opp.maxMonthlyRevenue.toLocaleString('en-IN')}/mo
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Required Capital</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      ₹{opp.requiredCapital.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Time to First Revenue</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {opp.timeToFirstRevenueWeeks} Weeks
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Daily Commitment</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {opp.dailyHoursRequired} hrs/day
                    </p>
                  </div>
                </div>

                {opp.requiredSkills && (
                  <div className="mt-3 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Skills Needed: </span>
                    {opp.requiredSkills}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Confidence: {(opp.confidenceScore * 100).toFixed(0)}%</span>
                <button
                  onClick={() => handleSelectOpportunity(opp)}
                  disabled={activatingId === opp.id}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  {activatingId === opp.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Activating...</span>
                    </>
                  ) : (
                    <>
                      <span>Select & Build Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
