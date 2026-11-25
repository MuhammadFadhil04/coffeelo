import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Coffee, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserPlus, Info } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const resolveSafeRedirect = (raw: string | null, fallback = '/menu'): string => {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return fallback;
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const stateFrom = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || null;
  const redirectTarget = resolveSafeRedirect(searchParams.get('redirect') || stateFrom, '/menu');
  const isOrderRedirect = searchParams.get('reason') === 'order' || Boolean(searchParams.get('redirect'));

  const registerLink = `/register?redirect=${encodeURIComponent(redirectTarget)}${
    isOrderRedirect ? '&reason=order' : ''
  }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Silakan masukkan email dan password Anda.');
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      const { adminUser, user } = useAuthStore.getState();
      if (adminUser?.role === 'ADMIN' && email.trim().toLowerCase() === adminUser.email.toLowerCase()) {
        navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin/dashboard', { replace: true });
      } else if (user?.role === 'ADMIN') {
        navigate(redirectTarget.startsWith('/admin') ? redirectTarget : '/admin/dashboard', { replace: true });
      } else {
        navigate(redirectTarget, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 bg-coffee-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-6 sm:p-10 border border-coffee-beige shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-coffee-dark mx-auto flex items-center justify-center text-white shadow-subtle">
            <Coffee className="w-6 h-6 text-coffee-cream" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-coffee-dark tracking-tight">
            Masuk ke Coffeelo
          </h1>
          <p className="text-xs text-coffee-brown leading-relaxed">
            Masuk menggunakan akun Anda untuk memesan menu kopi, menyimpan alamat, dan melacak pesanan.
          </p>
        </div>

        {/* Contextual Order Auth Prompt */}
        {isOrderRedirect && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-coffee-orange shrink-0 mt-0.5" />
            <span>
              Pelanggan wajib masuk untuk melakukan pemesanan. Belum memiliki akun? Silakan buat akun baru di bawah.
            </span>
          </div>
        )}

        {/* Error Alert Banner */}
        {(localError || error) && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coffee-brown hover:text-coffee-dark cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card flex items-center justify-center gap-2 disabled:opacity-70 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Masuk ke Akun
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Clear Account Creation Callout */}
        <div className="pt-4 border-t border-coffee-beige/70 space-y-3 text-center">
          <p className="text-xs font-semibold text-coffee-brown">
            Belum punya akun pelanggan Coffeelo?
          </p>
          <Link
            to={registerLink}
            className="w-full py-3 px-4 rounded-full bg-coffee-cream hover:bg-coffee-beige/80 border border-coffee-beige text-coffee-dark font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-coffee-orange" />
            Buat Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
