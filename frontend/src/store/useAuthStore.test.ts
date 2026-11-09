import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './useAuthStore';
import { AuthResponse } from '../types';

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      theme: 'system',
      language: 'en',
    });
  });

  it('should initialize with default unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.theme).toBe('system');
  });

  it('should store user credentials on login', () => {
    const dummyAuth: AuthResponse = {
      accessToken: 'jwt.token.mock',
      refreshToken: 'jwt.refresh.mock',
      tokenType: 'Bearer',
      userId: 101,
      email: 'test@budgetbuddy.app',
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'USER',
      preferredLanguage: 'hi',
      themePreference: 'dark',
      onboardingCompleted: true,
    };

    useAuthStore.getState().login(dummyAuth);

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.email).toBe('test@budgetbuddy.app');
    expect(state.user?.firstName).toBe('Rahul');
    expect(state.token).toBe('jwt.token.mock');
    expect(state.refreshToken).toBe('jwt.refresh.mock');
    expect(localStorage.getItem('accessToken')).toBe('jwt.token.mock');
    expect(localStorage.getItem('user')).toContain('test@budgetbuddy.app');
  });

  it('should clear credentials on logout', () => {
    const dummyAuth: AuthResponse = {
      accessToken: 'jwt.token.mock',
      refreshToken: 'jwt.refresh.mock',
      tokenType: 'Bearer',
      userId: 101,
      email: 'test@budgetbuddy.app',
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'USER',
      preferredLanguage: 'en',
      themePreference: 'light',
      onboardingCompleted: true,
    };

    useAuthStore.getState().login(dummyAuth);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('should update theme correctly', () => {
    useAuthStore.getState().setTheme('dark');
    expect(useAuthStore.getState().theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    useAuthStore.getState().setTheme('light');
    expect(useAuthStore.getState().theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
