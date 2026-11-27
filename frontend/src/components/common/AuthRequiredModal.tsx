import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Lock, UserPlus, LogIn, X, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export const AuthRequiredModal: React.FC = () => {
  const { isAuthModalOpen, authModalRedirect, closeAuthModal } = useAuthStore();

  useEffect(() => {
    if (!isAuthModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const encodedRedirect = encodeURIComponent(authModalRedirect || '/menu');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-required-title"
    >
      <div
        className="fixed inset-0 bg-coffee-dark/65 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 border border-coffee-beige shadow-elevation space-y-5">
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Tutup dialog"
          className="absolute top-4 right-4 p-2 rounded-full bg-coffee-cream text-coffee-dark hover:bg-coffee-beige transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-coffee-dark text-coffee-cream flex items-center justify-center shrink-0 shadow-subtle">
            <Lock className="w-5 h-5 text-coffee-orange" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-coffee-orange">
              Akses Pemesanan Pelanggan
            </span>
            <h3 id="auth-required-title" className="text-xl font-black text-coffee-dark tracking-tight">
              Masuk untuk Mulai Memesan
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-coffee-brown leading-relaxed">
          Untuk menjaga keamanan transaksi dan pelacakan pesanan, pelanggan wajib masuk terlebih dahulu sebelum memesan kopi. Belum punya akun? Buat akun baru secara gratis dalam hitungan detik.
        </p>

        <div className="rounded-2xl bg-coffee-cream/70 border border-coffee-beige/80 p-3.5 space-y-2 text-xs text-coffee-dark">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-coffee-orange shrink-0" />
            <span>Simpan keranjang & lacak status seduhan secara langsung</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Coffee className="w-4 h-4 text-coffee-orange shrink-0" />
            <span>Akses Ambil Cepat di gerai & pengiriman kurir instan</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Link
            to={`/login?redirect=${encodedRedirect}&reason=order`}
            onClick={closeAuthModal}
            className="w-full py-3.5 px-5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Masuk ke Akun
          </Link>

          <Link
            to={`/register?redirect=${encodedRedirect}&reason=order`}
            onClick={closeAuthModal}
            className="w-full py-3.5 px-5 rounded-full bg-coffee-dark hover:bg-coffee-brown text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Buat Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
