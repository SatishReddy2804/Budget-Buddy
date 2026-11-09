import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  ApiResponse,
  AuthResponse,
  User,
  UserProfile,
  FinancialProfile,
  Opportunity,
  CareerRoadmap,
  DailyPlan,
  Task,
  PendingTask,
  WealthSimulationRequest,
  WealthSimulationResult,
  LocationComparison,
  ProgressAnalytics,
  ExpenseCategory,
  ParsedReceipt,
  Transaction,
  Budget,
  SpendingSummary,
  AiInsightResponse,
  NotificationItem,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic refresh token handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post<ApiResponse<AuthResponse>>(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });
          if (res.data?.success && res.data.data?.accessToken) {
            localStorage.setItem('accessToken', res.data.data.accessToken);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Typed API operations
export const api = {
  // Auth
  auth: {
    register: (data: any) => apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data),
    login: (data: any) => apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),
    logout: () => apiClient.post<ApiResponse<void>>('/auth/logout'),
  },

  // User & Onboarding
  user: {
    getMe: () => apiClient.get<ApiResponse<User>>('/users/me'),
    getProfile: () => apiClient.get<ApiResponse<UserProfile>>('/users/profile'),
    saveProfile: (data: UserProfile) => apiClient.post<ApiResponse<UserProfile>>('/users/profile', data),
    getFinancialProfile: () => apiClient.get<ApiResponse<FinancialProfile>>('/users/financial-profile'),
    saveFinancialProfile: (data: FinancialProfile) => apiClient.post<ApiResponse<FinancialProfile>>('/users/financial-profile', data),
    changePassword: (data: any) => apiClient.put<ApiResponse<void>>('/users/change-password', data),
    updatePreferences: (data: { preferredLanguage?: string; themePreference?: string }) =>
      apiClient.put<ApiResponse<void>>('/users/preferences', data),
    exportData: () => apiClient.get<ApiResponse<any>>('/users/export'),
    deleteAccount: () => apiClient.delete<ApiResponse<void>>('/users/account'),
  },

  // PEACE Engine
  peace: {
    getOverview: () => apiClient.get<ApiResponse<{ profile: UserProfile; financialProfile: FinancialProfile; simulation: WealthSimulationResult }>>('/peace/overview'),
    simulateWealth: (data: WealthSimulationRequest) => apiClient.post<ApiResponse<WealthSimulationResult>>('/peace/simulate', data),
    getLocations: (city?: string, willingToRelocate?: boolean, expectedIncome?: number) =>
      apiClient.get<ApiResponse<LocationComparison>>('/peace/locations', {
        params: { city, willingToRelocate, expectedIncome },
      }),
    getOpportunities: (params?: { category?: string; maxCapital?: number; maxDailyHours?: number; riskLevel?: string }) =>
      apiClient.get<ApiResponse<Opportunity[]>>('/opportunities', { params }),
    getOpportunity: (id: number) => apiClient.get<ApiResponse<Opportunity>>(`/opportunities/${id}`),
    getActiveRoadmap: () => apiClient.get<ApiResponse<CareerRoadmap>>('/roadmaps/active'),
    selectOpportunity: (oppId: number, title?: string) =>
      apiClient.post<ApiResponse<CareerRoadmap>>(`/roadmaps/select-opportunity/${oppId}`, { title }),
    getDailyPlan: (date?: string) => apiClient.get<ApiResponse<DailyPlan>>('/plans/daily', { params: { date } }),
    toggleTask: (taskId: number, completed: boolean, actualMinutes?: number) =>
      apiClient.post<ApiResponse<DailyPlan>>(`/plans/tasks/${taskId}/toggle`, { completed, actualMinutes }),
    createTask: (data: Partial<Task>) => apiClient.post<ApiResponse<Task>>('/plans/tasks', data),
    handleMissedDay: (data: { date?: string; reasonCategory: string; explanation?: string; postponeFullDay?: boolean }) =>
      apiClient.post<ApiResponse<DailyPlan>>('/plans/missed-day', data),
    getCalendarTasks: (start: string, end: string) =>
      apiClient.get<ApiResponse<Task[]>>('/plans/calendar', { params: { start, end } }),
    getPendingTasks: () => apiClient.get<ApiResponse<PendingTask[]>>('/pending-tasks'),
    resolvePendingTask: (id: number, completed: boolean) =>
      apiClient.post<ApiResponse<void>>(`/pending-tasks/${id}/resolve`, { completed }),
    carryForwardPendingTask: (id: number) =>
      apiClient.post<ApiResponse<void>>(`/pending-tasks/${id}/carry-forward`),
    getProgressAnalytics: () => apiClient.get<ApiResponse<ProgressAnalytics>>('/analytics/progress'),
  },

  // Expense & Receipt Module
  expenses: {
    getCategories: () => apiClient.get<ApiResponse<ExpenseCategory[]>>('/categories'),
    uploadReceipt: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post<ApiResponse<ParsedReceipt>>('/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    getTransactions: (params?: { type?: string; categoryId?: number; search?: string; startDate?: string; endDate?: string; page?: number; size?: number }) =>
      apiClient.get<ApiResponse<{ content: Transaction[]; totalPages: number; totalElements: number }>>('/transactions', { params }),
    createTransaction: (data: any) => apiClient.post<ApiResponse<Transaction>>('/transactions', data),
    updateTransaction: (id: number, data: any) => apiClient.put<ApiResponse<Transaction>>(`/transactions/${id}`, data),
    deleteTransaction: (id: number) => apiClient.delete<ApiResponse<void>>(`/transactions/${id}`),
    exportTransactionsCsvUrl: (startDate?: string, endDate?: string) => {
      const token = localStorage.getItem('accessToken');
      let url = `${API_BASE_URL}/transactions/export/csv`;
      const query = [];
      if (startDate) query.push(`startDate=${startDate}`);
      if (endDate) query.push(`endDate=${endDate}`);
      if (query.length > 0) url += `?${query.join('&')}`;
      return url;
    },
    getBudgets: (month?: number, year?: number) =>
      apiClient.get<ApiResponse<Budget[]>>('/budgets', { params: { month, year } }),
    saveBudget: (data: { categoryId: number; month: number; year: number; budgetedAmount: number }) =>
      apiClient.post<ApiResponse<Budget>>('/budgets', data),
    deleteBudget: (id: number) => apiClient.delete<ApiResponse<void>>(`/budgets/${id}`),
    getSpendingSummary: (months?: number) =>
      apiClient.get<ApiResponse<SpendingSummary>>('/reports/summary', { params: { months } }),
  },

  // AI Advisor
  ai: {
    getFinancialInsights: () => apiClient.get<ApiResponse<AiInsightResponse>>('/ai/financial-insights'),
    getTaskAdvice: (taskTitle: string, category?: string) =>
      apiClient.get<ApiResponse<AiInsightResponse>>('/ai/task-advice', { params: { taskTitle, category } }),
  },

  // Notifications
  notifications: {
    getAll: () => apiClient.get<ApiResponse<NotificationItem[]>>('/notifications'),
    markRead: (id: number) => apiClient.put<ApiResponse<void>>(`/notifications/${id}/read`),
    markAllRead: () => apiClient.put<ApiResponse<void>>('/notifications/read-all'),
  },
};
