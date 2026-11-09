import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import {
  Compass,
  Briefcase,
  Search,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const OnboardingWizard: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [employmentStatus, setEmploymentStatus] = useState<'UNEMPLOYED' | 'EMPLOYED' | 'STUDENT' | 'FREELANCER'>('UNEMPLOYED');
  const [currentCity, setCurrentCity] = useState('Visakhapatnam');
  const [state, setState] = useState('Andhra Pradesh');
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [educationLevel, setEducationLevel] = useState('Bachelors');
  const [primarySkills, setPrimarySkills] = useState('JavaScript, Basic Python, Communication');
  const [skillsToLearn, setSkillsToLearn] = useState('Full Stack Web, AI APIs, Cloud');
  const [preferredWorkType, setPreferredWorkType] = useState('REMOTE');
  const [dailyAvailableHours, setDailyAvailableHours] = useState(4.0);
  const [weeklyAvailableHours, setWeeklyAvailableHours] = useState(20.0);
  const [riskTolerance, setRiskTolerance] = useState('MODERATE');

  // Financial inputs
  const [currentMonthlyIncome, setCurrentMonthlyIncome] = useState(employmentStatus === 'UNEMPLOYED' ? 0 : 35000);
  const [currentSavings, setCurrentSavings] = useState(15000);
  const [monthlyEssentialExpenses, setMonthlyEssentialExpenses] = useState(12000);
  const [existingDebts, setExistingDebts] = useState(0);
  const [targetWealthAmount, setTargetWealthAmount] = useState(1000000); // 10 Lakhs
  const [targetDurationYears, setTargetDurationYears] = useState(3);

  const handleNext = () => setStep((s) => Math.min(4, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      // 1. Save User Profile
      await api.user.saveProfile({
        employmentStatus,
        currentCity,
        state,
        country: 'India',
        willingToRelocate,
        educationLevel,
        primarySkills,
        skillsToLearn,
        preferredWorkType,
        dailyAvailableHours,
        weeklyAvailableHours,
        riskTolerance,
      });

      // 2. Save Financial Profile
      await api.user.saveFinancialProfile({
        currentMonthlyIncome,
        currentSavings,
        monthlyEssentialExpenses,
        existingDebts,
        targetWealthAmount,
        targetDurationYears,
        emergencyFundTarget: monthlyEssentialExpenses * 6,
        riskComfortLevel: riskTolerance,
      });

      // 3. Automatically select default high-demand opportunity roadmap (e.g. AI Workflow & Automation Specialist)
      try {
        await api.peace.selectOpportunity(1, 'AI Workflow Specialist Mastery Roadmap');
      } catch (err) {}

      // Update user state
      if (user) {
        setUser({ ...user, onboardingCompleted: true });
      }

      toast.success('Onboarding complete! Your personalized PEACE roadmap is ready.');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Failed to save profile. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Career & Employment Status'}
              {step === 2 && 'Location & Availability'}
              {step === 3 && 'Financial Baseline & Wealth Target'}
              {step === 4 && 'PEACE Plan Preview & Confirmation'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
          {/* STEP 1: Employment Status */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Where are you in your career journey today?
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Budget Buddy adapts its recommendations whether you are seeking immediate income or scaling up.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEmploymentStatus('UNEMPLOYED');
                    setCurrentMonthlyIncome(0);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    employmentStatus === 'UNEMPLOYED'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Search className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Unemployed / Seeking Income
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Looking for realistic remote, freelance, or entry income opportunities with quick time to revenue.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEmploymentStatus('EMPLOYED');
                    if (currentMonthlyIncome === 0) setCurrentMonthlyIncome(40000);
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    employmentStatus === 'EMPLOYED'
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-2 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Briefcase className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Currently Employed
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Have monthly salary. Want to build a side income stream, optimize savings, and compound wealth.
                  </p>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Existing Skills (separate with commas)
                  </label>
                  <input
                    type="text"
                    value={primarySkills}
                    onChange={(e) => setPrimarySkills(e.target.value)}
                    placeholder="e.g. Basic Java, Excel, Content, Customer Service"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Skills You Want to Learn & Monetize
                  </label>
                  <input
                    type="text"
                    value={skillsToLearn}
                    onChange={(e) => setSkillsToLearn(e.target.value)}
                    placeholder="e.g. AI Prompt Engineering, Full Stack Web, Cloud Operations"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location & Availability */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Location & Availability
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Budget Buddy compares cost-of-living and net savings for your location vs top tech and business hubs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current City
                  </label>
                  <input
                    type="text"
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Visakhapatnam, Eluru, Vijayawada, Hyderabad"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Andhra Pradesh, Telangana, Karnataka"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="relocate"
                  checked={willingToRelocate}
                  onChange={(e) => setWillingToRelocate(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <label htmlFor="relocate" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Willing to relocate if a verified high-paying opportunity arises
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Available Hours: <span className="font-bold text-brand-600">{dailyAvailableHours} hrs/day</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={dailyAvailableHours}
                    onChange={(e) => {
                      const h = parseFloat(e.target.value);
                      setDailyAvailableHours(h);
                      setWeeklyAvailableHours(h * 5);
                    }}
                    className="w-full accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 hr</span>
                    <span>4 hrs (Ideal)</span>
                    <span>10 hrs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Work Style
                  </label>
                  <select
                    value={preferredWorkType}
                    onChange={(e) => setPreferredWorkType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="REMOTE">Remote (Work from Home)</option>
                    <option value="HYBRID">Hybrid (Mix of Remote & Onsite)</option>
                    <option value="ONSITE">Onsite / Local Services</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Financial Baseline & Wealth Target */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Financial Baseline & Wealth Objective
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Budget Buddy calculates deterministic feasibility without unrealistic claims.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentMonthlyIncome}
                    onChange={(e) => setCurrentMonthlyIncome(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Total Savings / Capital (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Essential Expenses (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={monthlyEssentialExpenses}
                    onChange={(e) => setMonthlyEssentialExpenses(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Existing Debts / EMIs (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={existingDebts}
                    onChange={(e) => setExistingDebts(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Wealth Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="10000"
                    value={targetWealthAmount}
                    onChange={(e) => setTargetWealthAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold text-brand-600"
                  />
                  <span className="text-[10px] text-slate-400">e.g. ₹10,00,000 (10 Lakhs)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Timeframe: <span className="font-bold text-brand-600">{targetDurationYears} Years</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={targetDurationYears}
                    onChange={(e) => setTargetDurationYears(parseInt(e.target.value))}
                    className="w-full accent-brand-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 yr</span>
                    <span>3 yrs</span>
                    <span>15 yrs</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Plan Preview & Confirmation */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Confirm Your Personalized PEACE Strategy
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Here is your baseline execution profile. You can recalibrate assumptions anytime from the simulator.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Employment Status</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{employmentStatus}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Primary Location</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentCity}, {state}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Daily Execution Bandwidth</span>
                  <span className="font-bold text-brand-600">{dailyAvailableHours} hours / day</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Monthly Savings Capacity</span>
                  <span className="font-bold text-emerald-600">
                    ₹{Math.max(0, currentMonthlyIncome - monthlyEssentialExpenses).toLocaleString('en-IN')} / mo
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Target Objective</span>
                  <span className="font-bold text-brand-600">
                    ₹{targetWealthAmount.toLocaleString('en-IN')} in {targetDurationYears} Years
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Recommended Starter Roadmap: AI Workflow Specialist</p>
                  <p className="mt-0.5 text-blue-800 dark:text-blue-300">
                    High demand for prompt automation with SMB clients. Zero upfront inventory, fast monetization curve (6-8 weeks).
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Educational roadmap only. Not financial, legal, or investment advice.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleComplete}
                className="px-6 py-2.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Building Your Plan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Launch My Budget Buddy Plan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
