import { create } from 'zustand';
import { User } from '@/types';
import api from '@/services/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('coffeelo_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data;

      localStorage.setItem('coffeelo_token', token);
      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data.data;

      localStorage.setItem('coffeelo_token', token);
      set({ user, token, isLoading: false, error: null });
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('coffeelo_token');
    if (!token) return;

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data });
    } catch {
      localStorage.removeItem('coffeelo_token');
      set({ user: null, token: null });
    }
  },

  logout: () => {
    localStorage.removeItem('coffeelo_token');
    set({ user: null, token: null, error: null });
  },

  clearError: () => set({ error: null }),

  isAdmin: () => {
    return get().user?.role === 'ADMIN';
  },
}));
