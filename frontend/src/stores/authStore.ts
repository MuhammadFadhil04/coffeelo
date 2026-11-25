import { create } from 'zustand';
import { User } from '@/types';
import api, { ADMIN_TOKEN_KEY, CUSTOMER_TOKEN_KEY } from '@/services/api';

interface AuthStore {
  // Customer storefront session
  user: User | null;
  token: string | null;

  // Isolated Admin portal session (prevents multi-tab Customer login from overwriting Admin token)
  adminUser: User | null;
  adminToken: string | null;
  isAdminVerifying: boolean;

  isLoading: boolean;
  error: string | null;

  // Auth-required order prompt modal state
  isAuthModalOpen: boolean;
  authModalRedirect: string;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
  fetchMe: () => Promise<void>;
  fetchAdminMe: () => Promise<void>;
  logout: () => void;
  logoutAdmin: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
  openAuthModal: (redirectPath?: string) => void;
  closeAuthModal: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: localStorage.getItem(CUSTOMER_TOKEN_KEY),
  adminUser: null,
  adminToken: localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(CUSTOMER_TOKEN_KEY),
  isAdminVerifying: false,
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  authModalRedirect: '/menu',

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data.data as { user: User; token: string };

      if (user.role === 'ADMIN') {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        // Also populate storefront session if no separate customer is logged in
        if (!localStorage.getItem(CUSTOMER_TOKEN_KEY)) {
          localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
          set({
            adminUser: user,
            adminToken: token,
            user,
            token,
            isLoading: false,
            error: null,
            isAuthModalOpen: false,
          });
        } else {
          set({
            adminUser: user,
            adminToken: token,
            isLoading: false,
            error: null,
            isAuthModalOpen: false,
          });
        }
      } else {
        // Customer login ONLY writes CUSTOMER_TOKEN_KEY so an open Admin tab stays authenticated
        localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
        set({ user, token, isLoading: false, error: null, isAuthModalOpen: false });
      }

      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Email atau password tidak sesuai.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data.data as { user: User; token: string };

      localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
      set({ user, token, isLoading: false, error: null, isAuthModalOpen: false });
      return { success: true };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Pendaftaran akun gagal.';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  fetchMe: async () => {
    const customerTok = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (!customerTok) {
      set({ user: null, token: null });
      return;
    }

    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${customerTok}` },
      });
      set({ user: response.data.data, token: customerTok });
    } catch {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      set({ user: null, token: null });
    }
  },

  fetchAdminMe: async () => {
    const candidateToken =
      localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(CUSTOMER_TOKEN_KEY);

    if (!candidateToken) {
      set({ adminUser: null, adminToken: null, isAdminVerifying: false });
      return;
    }

    set({ isAdminVerifying: true });
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${candidateToken}` },
      });
      const profile = response.data.data as User;

      if (profile.role === 'ADMIN') {
        localStorage.setItem(ADMIN_TOKEN_KEY, candidateToken);
        set({ adminUser: profile, adminToken: candidateToken, isAdminVerifying: false });
      } else {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        set({ adminUser: profile, adminToken: null, isAdminVerifying: false });
      }
    } catch {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      set({ adminUser: null, adminToken: null, isAdminVerifying: false });
    }
  },

  logout: () => {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    set({ user: null, token: null, error: null });
  },

  logoutAdmin: () => {
    const currentAdminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    if (currentAdminToken && localStorage.getItem(CUSTOMER_TOKEN_KEY) === currentAdminToken) {
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      set({ adminUser: null, adminToken: null, user: null, token: null, error: null });
      return;
    }
    set({ adminUser: null, adminToken: null, error: null });
  },

  clearError: () => set({ error: null }),

  isAdmin: () => {
    const state = get();
    return state.adminUser?.role === 'ADMIN' || state.user?.role === 'ADMIN';
  },

  openAuthModal: (redirectPath) => {
    const target = redirectPath || window.location.pathname || '/menu';
    set({ isAuthModalOpen: true, authModalRedirect: target });
  },

  closeAuthModal: () => set({ isAuthModalOpen: false }),
}));
