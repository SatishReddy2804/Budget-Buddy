import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { supportedLanguages } from '../../i18n';
import { Languages } from 'lucide-react';
import { api } from '../../api/client';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLanguage, user } = useAuthStore();

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    await i18n.changeLanguage(lang);
    setLanguage(lang);
    if (user) {
      try {
        await api.user.updatePreferences({ preferredLanguage: lang });
      } catch (err) {
        // Silently preserve in localStorage
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <Languages className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none" />
      <select
        value={i18n.language || 'en'}
        onChange={handleLanguageChange}
        aria-label="Select Language"
        className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
      >
        {supportedLanguages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName} ({l.name})
          </option>
        ))}
      </select>
    </div>
  );
};
