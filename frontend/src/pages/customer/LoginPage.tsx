import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coffee, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      // Determine redirection based on role
      const user = useAuthStore.getState().user;
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const handleQuickFill = (role: 'admin' | 'customer') => {
    setLocalError(null);
    clearError();
    if (role === 'admin') {
      setEmail('admin@coffeelo.com');
      setPassword('Admin123!');
    } else {
      setEmail('customer@coffeelo.com');
      setPassword('Customer123!');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-coffee-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-4xl p-8 sm:p-10 border border-coffee-beige shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-coffee-dark mx-auto flex items-center justify-center text-white shadow-subtle">
            <Coffee className="w-6 h-6 text-coffee-cream" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-coffee-dark tracking-tight">
            Welcome to Coffeelo
          </h1>
          <p className="text-xs text-coffee-brown">
            Sign in to access your orders, saved addresses, and bean preferences.
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="p-3.5 rounded-2xl bg-coffee-cream/60 border border-coffee-beige space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-coffee-brown uppercase tracking-wider">
            <span>Demo Test Accounts:</span>
            <span className="text-coffee-orange">Click to fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-coffee-beige/60 text-coffee-dark text-[11px] font-bold border border-coffee-beige/80 transition flex items-center justify-center gap-1.5"
            >
              <User className="w-3 h-3 text-coffee-brown" />
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-coffee-beige/60 text-coffee-dark text-[11px] font-bold border border-coffee-beige/80 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3 h-3 text-coffee-orange" />
              Admin
            </button>
          </div>
        </div>

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
            <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
                Password:
              </label>
              <span className="text-[11px] text-coffee-brown hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-coffee-brown hover:text-coffee-dark"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-card flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-coffee-brown border-t border-coffee-beige/60">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-coffee-orange hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
