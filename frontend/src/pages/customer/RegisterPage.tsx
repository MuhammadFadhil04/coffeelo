import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Coffee, Mail, Lock, User, Phone, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    const res = await register({ name, email, password, phone });
    if (res.success) {
      navigate('/menu', { replace: true });
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
            Create an Account
          </h1>
          <p className="text-xs text-coffee-brown">
            Join the Coffeelo community for fast express re-orders, order tracking, and exclusive roasts.
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
            <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Full Name:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Phone Number (Optional):
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider block">
              Confirm Password:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-brown absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-card flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 mt-3"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 text-xs text-coffee-brown border-t border-coffee-beige/60">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-coffee-orange hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
