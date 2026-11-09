import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { toast } from '../../store/useToastStore';
import { Transaction, ExpenseCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import {
  ReceiptText,
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  Edit2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Form State
  const [formType, setFormType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [formMerchant, setFormMerchant] = useState<string>('');
  const [formAmount, setFormAmount] = useState<number>(0);
  const [formCategoryId, setFormCategoryId] = useState<number>(1);
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formRecurring, setFormRecurring] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.expenses.getCategories().then((res) => {
      if (res.data?.success && res.data.data) {
        setCategories(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [currentPage, search, type, categoryId, startDate, endDate]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.expenses.getTransactions({
        page: currentPage,
        size: 10,
        search: search || undefined,
        type: type || undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (res.data?.success && res.data.data) {
        setTransactions(res.data.data.content);
        setTotalPages(res.data.data.totalPages || 1);
      }
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        type: formType,
        merchant: formMerchant,
        amount: formAmount,
        categoryId: formCategoryId,
        transactionDate: formDate,
        notes: formNotes,
        isRecurring: formRecurring,
      };

      if (editingTransaction) {
        await api.expenses.updateTransaction(editingTransaction.id, payload);
        toast.success('Transaction updated successfully');
      } else {
        await api.expenses.createTransaction(payload);
        toast.success('Transaction created successfully');
      }

      setShowAddModal(false);
      setEditingTransaction(null);
      resetForm();
      loadTransactions();
    } catch (err) {
      toast.error('Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.expenses.deleteTransaction(deletingId);
      toast.success('Transaction deleted');
      setDeletingId(null);
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setFormType(t.type);
    setFormMerchant(t.merchant);
    setFormAmount(t.amount);
    setFormCategoryId(t.categoryId);
    setFormDate(t.transactionDate);
    setFormNotes(t.notes || '');
    setFormRecurring(t.isRecurring);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormType('EXPENSE');
    setFormMerchant('');
    setFormAmount(0);
    setFormCategoryId(categories[0]?.id || 1);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes('');
    setFormRecurring(false);
  };

  const handleExportCsv = () => {
    const url = api.expenses.exportTransactionsCsvUrl(startDate, endDate);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <ReceiptText className="w-6 h-6 text-emerald-600" />
            <span>Financial Transactions</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, track manual entries, and review scanned receipt records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setEditingTransaction(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchant or notes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="">All Types (Income & Expense)</option>
            <option value="EXPENSE">Expenses Only</option>
            <option value="INCOME">Income Only</option>
          </select>
        </div>

        <div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>

        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto" />
            <p className="text-xs text-slate-500 mt-2">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No transactions match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Merchant / Payee</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{t.transactionDate}</td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {t.merchant}
                      {t.receiptId && (
                        <span className="ml-2 text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                          Receipt Scanned
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.categoryColor }} />
                        <span>{t.categoryName}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      {t.type === 'INCOME' ? (
                        <span className="text-emerald-600 font-bold flex items-center">
                          <TrendingUp className="w-3.5 h-3.5 mr-1" /> Income
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold flex items-center">
                          <TrendingDown className="w-3.5 h-3.5 mr-1" /> Expense
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-black text-slate-900 dark:text-white whitespace-nowrap">
                      {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {currentPage + 1} of {Math.max(1, totalPages)}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTransaction(null);
        }}
        title={editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
        description="Add manual income or expense records to keep your financial ledger comprehensive."
      >
        <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setFormType('EXPENSE')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                formType === 'EXPENSE'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormType('INCOME')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                formType === 'INCOME'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Merchant / Payee / Source
            </label>
            <input
              type="text"
              required
              value={formMerchant}
              onChange={(e) => setFormMerchant(e.target.value)}
              placeholder="e.g. Swiggy, Upwork Client, D-Mart"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formAmount}
                onChange={(e) => setFormAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-brand-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(parseInt(e.target.value))}
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
              Notes (Optional)
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="e.g. Monthly cloud subscription"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
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
              disabled={submitting}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold"
            >
              {submitting ? 'Saving...' : editingTransaction ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Transaction"
        description="Are you sure you want to permanently delete this transaction? This action cannot be undone."
      >
        <div className="flex justify-end space-x-2 pt-2 text-xs">
          <button
            onClick={() => setDeletingId(null)}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold"
          >
            Delete Permanently
          </button>
        </div>
      </Modal>
    </div>
  );
};
