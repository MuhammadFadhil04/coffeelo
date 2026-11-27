import React from 'react';
import { Coffee, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export const OrderCtaSection: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <section className="py-12 lg:py-14 bg-coffee-cream border-t border-coffee-beige/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#451B0E] via-[#562111] to-[#3A1409] border border-coffee-dark/20 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-elevation text-white">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-coffee-orange">
              <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
              Kedai & Sangrai Kopi Spesialti
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Siap Menikmati Seduhan Segar Hari Ini?
            </h2>
            <p className="text-xs sm:text-sm text-coffee-beige/85 leading-relaxed">
              Pesan online untuk Ambil Cepat tanpa antre atau pengiriman kurir langsung dari bar kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-coffee-orange hover:bg-white hover:text-coffee-dark text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card"
            >
              Jelajahi Menu
              <ArrowRight className="w-4 h-4" />
            </Link>
            {user ? (
              <Link
                to="/my-orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Riwayat Pesanan
              </Link>
            ) : (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 font-extrabold text-xs uppercase tracking-wider transition-colors"
              >
                Buat Akun Pelanggan
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderCtaSection;
