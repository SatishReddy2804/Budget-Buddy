import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { api } from '../../api/client';
import { supportedLanguages } from '../../i18n';
import {
  User,
  Lock,
  Globe,
  Sun,
  Moon,
  Monitor,
  Download,
  Trash2,
  Shield,
  AlertTriangle,
  Check,
  Loader2,
  Info,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, theme, setTheme, setLanguage, logout } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);
  // addToast signature: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void

  // Change password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // Preferences
  const [prefLoading, setPrefLoading] = useState(false);

  // Export / Delete
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }

    setPwLoading(true);
    try {
      await api.user.changePassword({ currentPassword, newPassword, confirmPassword });
      addToast('success', 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to change password. Please check your current password.';
      setPwError(msg);
    } finally {
      setPwLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    setPrefLoading(true);
    try {
      await api.user.updatePreferences({ themePreference: newTheme });
    } catch {
      // Theme applied locally, API sync is best-effort
    } finally {
      setPrefLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setPrefLoading(true);
    try {
      await api.user.updatePreferences({ preferredLanguage: lang });
    } catch {
      // Language applied locally, API sync is best-effort
    } finally {
      setPrefLoading(false);
    }
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      const res = await api.user.exportData();
      const jsonStr = JSON.stringify(res.data?.data || res.data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `budget-buddy-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('success', 'Data exported successfully.');
    } catch {
      addToast('error', 'Failed to export data.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.user.deleteAccount();
      addToast('info', 'Your account has been deleted.');
      logout();
      window.location.href = '/';
    } catch {
      addToast('error', 'Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const themeOptions: { value: 'light' | 'dark' | 'system'; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('nav.settings')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account, preferences, and data.
        </p>
      </div>

      {/* Profile Info (read-only) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <User className="w-3.5 h-3.5" />
          <span>Role: {user?.role}</span>
          <span className="mx-1">•</span>
          <span>Status: {user?.status}</span>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Change Password</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
          </div>
          {pwError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              {pwError}
            </p>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {pwLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1.5" />}
            Update Password
          </button>
        </form>
      </section>

      {/* Theme Selection */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Appearance</h2>
          {prefLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
        </div>
        <div className="flex flex-wrap gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleThemeChange(opt.value)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                theme === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Language */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Language</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                i18n.language === lang.code
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-sm">{lang.nativeName}</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{lang.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Data & Privacy</h2>
        </div>

        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Export Your Data</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Download all your data as a JSON file.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={exportLoading}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {exportLoading ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              Export
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">Delete Account</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  This action is irreversible. All your data, transactions, plans, and progress will be permanently deleted.
                </p>

                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="mt-3 inline-flex items-center px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete My Account
                  </button>
                ) : (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                      Are you absolutely sure? This cannot be undone.
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteLoading}
                        className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-rose-700 text-white rounded-lg hover:bg-rose-800 disabled:opacity-50 transition-colors"
                      >
                        {deleteLoading ? (
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Yes, Permanently Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="flex items-start space-x-2 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{t('common.disclaimer')}</span>
      </div>
    </div>
  );
};
