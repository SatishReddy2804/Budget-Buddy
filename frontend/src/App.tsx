import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth pages
import { LandingPage } from './features/auth/LandingPage';
import { Login } from './features/auth/Login';
import { Register } from './features/auth/Register';

// Onboarding
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';

// Dashboard
import { MainDashboard } from './features/dashboard/MainDashboard';

// PEACE module pages
import { PeaceOverview } from './features/peace/PeaceOverview';
import { OpportunityDiscovery } from './features/peace/OpportunityDiscovery';
import { WealthSimulator } from './features/peace/WealthSimulator';
import { CareerRoadmapView } from './features/peace/CareerRoadmapView';
import { DailyPlanner } from './features/peace/DailyPlanner';
import { PendingTasksView } from './features/peace/PendingTasksView';
import { CalendarView } from './features/peace/CalendarView';
import { ProgressAnalyticsView } from './features/peace/ProgressAnalyticsView';
import { LocationComparison } from './features/peace/LocationComparison';

// Expense module pages
import { ExpenseDashboard } from './features/expenses/ExpenseDashboard';
import { ReceiptScanner } from './features/expenses/ReceiptScanner';
import { TransactionsView } from './features/expenses/TransactionsView';
import { BudgetManager } from './features/expenses/BudgetManager';
import { AiAdvisorView } from './features/expenses/AiAdvisorView';

// Settings
import { SettingsPage } from './features/settings/SettingsPage';

/**
 * AppLayout wraps all protected routes with Navbar + Sidebar chrome.
 * The sidebar is collapsible on mobile.
 */
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* ─────────── Public routes ─────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ─────────── Onboarding (protected, no onboarding-check loop) ─────────── */}
      <Route element={<ProtectedRoute requireOnboarding={false} />}>
        <Route
          path="/onboarding"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                <OnboardingWizard />
              </main>
            </div>
          }
        />
      </Route>

      {/* ─────────── Protected routes (require auth + onboarding) ─────────── */}
      <Route element={<ProtectedRoute requireOnboarding={true} />}>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <MainDashboard />
            </AppLayout>
          }
        />

        {/* PEACE Wealth Engine */}
        <Route
          path="/peace/overview"
          element={
            <AppLayout>
              <PeaceOverview />
            </AppLayout>
          }
        />
        <Route
          path="/peace/opportunities"
          element={
            <AppLayout>
              <OpportunityDiscovery />
            </AppLayout>
          }
        />
        <Route
          path="/peace/simulator"
          element={
            <AppLayout>
              <WealthSimulator />
            </AppLayout>
          }
        />
        <Route
          path="/peace/roadmap"
          element={
            <AppLayout>
              <CareerRoadmapView />
            </AppLayout>
          }
        />
        <Route
          path="/peace/planner"
          element={
            <AppLayout>
              <DailyPlanner />
            </AppLayout>
          }
        />
        <Route
          path="/peace/pending-tasks"
          element={
            <AppLayout>
              <PendingTasksView />
            </AppLayout>
          }
        />
        <Route
          path="/peace/calendar"
          element={
            <AppLayout>
              <CalendarView />
            </AppLayout>
          }
        />
        <Route
          path="/peace/analytics"
          element={
            <AppLayout>
              <ProgressAnalyticsView />
            </AppLayout>
          }
        />
        <Route
          path="/peace/locations"
          element={
            <AppLayout>
              <LocationComparison />
            </AppLayout>
          }
        />

        {/* Smart Expense Manager */}
        <Route
          path="/expenses/dashboard"
          element={
            <AppLayout>
              <ExpenseDashboard />
            </AppLayout>
          }
        />
        <Route
          path="/expenses/scanner"
          element={
            <AppLayout>
              <ReceiptScanner />
            </AppLayout>
          }
        />
        <Route
          path="/expenses/transactions"
          element={
            <AppLayout>
              <TransactionsView />
            </AppLayout>
          }
        />
        <Route
          path="/expenses/budgets"
          element={
            <AppLayout>
              <BudgetManager />
            </AppLayout>
          }
        />
        <Route
          path="/expenses/ai-advisor"
          element={
            <AppLayout>
              <AiAdvisorView />
            </AppLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />
      </Route>

      {/* ─────────── Fallback / 404 ─────────── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-extrabold text-brand-600">404</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Page not found. Let&apos;s get you back on track.
              </p>
              <a
                href="/dashboard"
                className="inline-block px-6 py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors shadow-md"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};
