import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  Sparkles,
  TrendingUp,
  ScanLine,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  MapPin,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 dark:bg-brand-950/60 dark:border-brand-800 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Career Momentum & Wealth Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Budget Buddy
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-emerald-500 to-teal-500 mt-2">
                Plan Smarter. Earn Better. Build Wealth.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Stop guessing your financial future. Budget Buddy combines smart AI receipt scanning with the deterministic <strong>PEACE Career & Wealth Engine</strong> to turn career growth and savings into measurable daily habits.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors"
              >
                Sign In to Your Account
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Unemployed & Employed Pathways</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Deterministic Math Simulation</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Tesseract OCR Scanner</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>8 Indian Languages</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Two Core Modules Section */}
        <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Two Connected Engines. One Unified Platform.
              </h2>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Budget Buddy bridges the gap between daily expense discipline and long-term career monetization.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Module 1: PEACE */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/20">
                    <Compass className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Module 1: Career Execution
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                    PEACE — Personal Economic Advancement & Career Engine
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    A personalized career growth roadmap for both unemployed individuals seeking high-demand opportunities and employed individuals scaling side services or salary bands.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Deterministic Wealth Simulation:</strong> Mathematical Conservative, Moderate & Ambitious scenarios.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CalendarCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>7 Structured Daily Tasks:</strong> Morning focus, skill learning, income task, outreach, savings, health, debrief.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Location Intelligence:</strong> Cost of living and net savings comparisons for major hubs.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-900/40">
                  <Link
                    to="/register"
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center"
                  >
                    Explore PEACE Roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Module 2: Smart Expense Manager */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-500/20">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                    Module 2: Expense Intelligence
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 mb-3">
                    AI Financial Advisor & Smart Expense Manager
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    Effortlessly scan receipts using OCR and AI, monitor category envelopes, identify discretionary spending leaks, and generate real AI financial insights.
                  </p>

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <li className="flex items-start space-x-2">
                      <ScanLine className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span><strong>OCR Receipt Scanning:</strong> Instant extraction of merchant, date, amounts, and line items.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Verified Ledger:</strong> Review and correct OCR values before committing to transactions.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                      <span><strong>AI Spending Insights:</strong> Actionable suggestions with strict educational disclaimers.</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-emerald-100 dark:border-emerald-900/40">
                  <Link
                    to="/register"
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center"
                  >
                    Start Receipt Scanning <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
