import { create } from 'zustand';
import { AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  theme: 'light' | 'dark' | 'system';
  language: string;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: string) => void;
  applyTheme: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
  language: localStorage.getItem('i18nextLng') || 'en',

  login: (authData: AuthResponse) => {
    const user: User = {
      id: authData.userId,
      email: authData.email,
      firstName: authData.firstName,
      lastName: authData.lastName,
      role: authData.role,
      status: 'ACTIVE',
      preferredLanguage: authData.preferredLanguage,
      themePreference: authData.themePreference,
      createdAt: new Date().toISOString(),
      onboardingCompleted: authData.onboardingCompleted,
    };

    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    if (authData.themePreference) {
      localStorage.setItem('theme', authData.themePreference);
    }
    if (authData.preferredLanguage) {
      localStorage.setItem('i18nextLng', authData.preferredLanguage);
    }

    set({
      user,
      token: authData.accessToken,
      refreshToken: authData.refreshToken,
      theme: (authData.themePreference as any) || 'system',
      language: authData.preferredLanguage || 'en',
    });

    get().applyTheme();
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, token: null, refreshToken: null });
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setTheme: (theme: 'light' | 'dark' | 'system') => {
    localStorage.setItem('theme', theme);
    set({ theme });
    get().applyTheme();
  },

  setLanguage: (language: string) => {
    localStorage.setItem('i18nextLng', language);
    set({ language });
  },

  applyTheme: () => {
    const { theme } = get();
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  },
}));
