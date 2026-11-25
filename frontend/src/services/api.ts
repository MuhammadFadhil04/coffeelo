import axios from 'axios';

export const ADMIN_TOKEN_KEY = 'coffeelo_admin_token';
export const CUSTOMER_TOKEN_KEY = 'coffeelo_token';

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

export const getActiveToken = (requestUrl?: string): string | null => {
  const inAdminPortal =
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) ||
    Boolean(requestUrl && requestUrl.startsWith('/admin'));

  if (inAdminPortal) {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(CUSTOMER_TOKEN_KEY);
  }

  return localStorage.getItem(CUSTOMER_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach context-appropriate JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    // Respect explicit Authorization header when caller provides one
    if (config.headers && !config.headers.Authorization) {
      const token = getActiveToken(config.url);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Clear only the relevant session token on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      } else if (path !== '/login' && path !== '/register') {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
