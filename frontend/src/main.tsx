import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ToastContainer } from './components/ui/ToastContainer';
import './i18n';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

// Apply saved theme on initial load (before React renders)
const savedTheme = localStorage.getItem('theme') || 'system';
const root = document.documentElement;
if (
  savedTheme === 'dark' ||
  (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  root.classList.add('dark');
} else {
  root.classList.remove('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
