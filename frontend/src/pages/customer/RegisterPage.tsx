import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Coffee, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const resolveSafeRedirect = (raw: string | null, fallback = '/menu'): string => {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return fallback;
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const redirectTarget = resolveSafeRedirect(searchParams.get('redirect'), '/menu');
  const loginLink = `/login?redirect=${encodeURIComponent(redirectTarget)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Konfirmasi password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
    });
    if (res.success) {
      navigate(redirectTarget, { replace: true });
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
            Buat Akun Pelanggan
          </h1>
          <p className="text-xs text-coffee-brown leading-relaxed">
            Daftar akun Coffeelo untuk memesan menu spesialti, Express Pickup, dan memantau status seduhan Anda.
          </p>
        </div>

        {/* Error Alert Banner */}
        {(localError || error) && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label htmlFor="reg-name" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-email" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-phone" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Nomor Telepon (Opsional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Konfirmasi Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password Anda"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card flex items-center justify-center gap-2 disabled:opacity-70 mt-3 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Daftar & Mulai Pesan
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-coffee-brown border-t border-coffee-beige/60">
          <span>Sudah memiliki akun? </span>
          <Link to={loginLink} className="font-bold text-coffee-orange hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
