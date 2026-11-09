import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { Budget, ExpenseCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  PiggyBank,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [budgetAmount, setBudgetAmount] = useState<number>(5000);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    api.expenses.getCategories().then((res) => {
      if (res.data?.success && res.data.data) {
        setCategories(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [currentMonth, currentYear]);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.expenses.getBudgets(currentMonth, currentYear);
      if (res.data?.success && res.data.data) {
        setBudgets(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.expenses.saveBudget({
        categoryId: selectedCategoryId,
        month: currentMonth,
        year: currentYear,
        budgetedAmount: budgetAmount,
      });

      if (res.data?.success) {
        toast.success('Budget saved successfully');
        setShowAddModal(false);
        loadBudgets();
      }
    } catch (err) {
      toast.error('Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      await api.expenses.deleteBudget(id);
      toast.success('Budget removed');
      loadBudgets();
    } catch (err) {
      toast.error('Failed to delete budget');
    }
  };

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.budgetedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.actualSpent, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <PiggyBank className="w-6 h-6 text-emerald-600" />
            <span>Monthly Category Budget Envelopes</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Establish spending caps for categories and track actual outflow in real-time with overspending warnings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((m, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Category Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Envelope Status
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹{totalSpent.toLocaleString('en-IN')}{' '}
            <span className="text-sm font-normal text-slate-400">
              spent of ₹{totalBudgeted.toLocaleString('en-IN')} budgeted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Remaining envelope buffer:{' '}
            <span className={totalBudgeted - totalSpent >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
              ₹{(totalBudgeted - totalSpent).toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        <div className="w-full md:w-64">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                totalSpent > totalBudgeted ? 'bg-rose-500' : 'bg-brand-600'
              }`}
              style={{
                width: `${totalBudgeted > 0 ? Math.min(100, (totalSpent / totalBudgeted) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Budget Envelopes Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
          <p className="text-xs text-slate-500 mt-2">Loading monthly budgets...</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
          <PiggyBank className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No category budgets created for this month yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-3 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
          >
            Create First Budget
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => (
            <div
              key={b.id}
              className={`p-6 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                b.isOverBudget
                  ? 'bg-rose-50/40 border-rose-300 dark:bg-rose-950/20 dark:border-rose-900 ring-2 ring-rose-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: b.categoryColor }}
                    />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {b.categoryName}
                    </h3>
                  </div>

                  {b.isOverBudget && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Over Budget!</span>
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Actual Outflow</span>
                    <p className={`font-black text-lg ${b.isOverBudget ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                      ₹{b.actualSpent.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Monthly Envelope</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      ₹{b.budgetedAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Progress Meter */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all ${
                      b.isOverBudget ? 'bg-rose-500' : 'bg-brand-600'
                    }`}
                    style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                  <span>{b.percentageUsed}% consumed</span>
                  <span>
                    {b.isOverBudget
                      ? `Exceeded by ₹${Math.abs(b.remainingAmount).toLocaleString('en-IN')}`
                      : `₹${b.remainingAmount.toLocaleString('en-IN')} remaining`}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDeleteBudget(b.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Set Budget Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Set Category Budget Envelope"
        description="Allocate monthly spending limit for a specific category."
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Budgeted Amount (₹)
            </label>
            <input
              type="number"
              min="100"
              step="500"
              required
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-brand-600"
            />
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
              disabled={saving}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold"
            >
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
