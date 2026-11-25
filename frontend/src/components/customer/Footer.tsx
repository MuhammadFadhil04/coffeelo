import React from 'react';
import {
  ArrowUp,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Coffee,
  ShieldCheck,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const goToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <footer className="bg-[#2B1008] text-coffee-cream pt-12 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Roastery CTA Card */}
        <div className="rounded-3xl bg-gradient-to-r from-[#451B0E] via-[#562111] to-[#3A1409] border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-elevation">
          <div className="space-y-1.5 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-coffee-orange">
              <Coffee className="w-3.5 h-3.5" />
              Artisan Coffee Roastery & Espresso Bar
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Siap Menikmati Seduhan Segar Hari Ini?
            </h3>
            <p className="text-xs sm:text-sm text-coffee-beige/80 leading-relaxed">
              Pesan online untuk Express Pickup tanpa antre atau pengiriman kurir langsung dari bar kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-coffee-orange hover:bg-white hover:text-coffee-dark text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card"
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
                Buat Akun Member
              </Link>
            )}
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-white/10">
          {/* Column 1: Brand Identity */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-coffee-orange text-white flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-extrabold text-2xl tracking-tight text-white leading-none">
                  Coffeelo
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-bold text-coffee-beige/75 mt-1">
                  Café & Specialty Roastery
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-coffee-cream/75 leading-relaxed max-w-sm">
              Ruang bagi penikmat kopi spesialti. Kami menyangrai biji kopi pilihan secara berkala dengan transparansi asal-usul dari petani lokal hingga ke cangkir Anda.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Coffeelo"
                className="w-10 h-10 rounded-full bg-white/[0.07] hover:bg-coffee-orange border border-white/10 flex items-center justify-center text-coffee-cream hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:sayhi@coffeelo.com"
                aria-label="Email Coffeelo"
                className="w-10 h-10 rounded-full bg-white/[0.07] hover:bg-coffee-orange border border-white/10 flex items-center justify-center text-coffee-cream hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="tel:+6281234567890"
                aria-label="Telepon Coffeelo"
                className="w-10 h-10 rounded-full bg-white/[0.07] hover:bg-coffee-orange border border-white/10 flex items-center justify-center text-coffee-cream hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Lokasi Coffeelo di Google Maps"
                className="w-10 h-10 rounded-full bg-white/[0.07] hover:bg-coffee-orange border border-white/10 flex items-center justify-center text-coffee-cream hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Eksplorasi
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-coffee-cream/75">
              <li>
                <Link to="/menu" className="hover:text-coffee-orange transition-colors">
                  Full Menu
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSection('story')}
                  className="hover:text-coffee-orange transition-colors cursor-pointer"
                >
                  Philosophy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSection('showcase')}
                  className="hover:text-coffee-orange transition-colors cursor-pointer"
                >
                  Signature Recipes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSection('testimonials')}
                  className="hover:text-coffee-orange transition-colors cursor-pointer"
                >
                  Guest Stories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => goToSection('location')}
                  className="hover:text-coffee-orange transition-colors cursor-pointer"
                >
                  Store Location
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Account */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold text-coffee-cream/75">
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className="hover:text-coffee-orange transition-colors">
                      Profil Akun ({user.name})
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-orders" className="hover:text-coffee-orange transition-colors">
                      Lacak & Riwayat Pesanan
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-coffee-orange transition-colors">
                      Masuk Akun Pelanggan
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-coffee-orange transition-colors">
                      Daftar Akun Baru
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/cart" className="hover:text-coffee-orange transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li className="pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-[11px] text-coffee-beige">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Pembayaran Aman via Midtrans</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Flagship House & Hours */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Flagship Roastery
            </h4>
            <div className="space-y-2.5 text-xs text-coffee-cream/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-coffee-orange shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-coffee-orange shrink-0" />
                <p className="font-semibold text-white">Setiap Hari: 08:00 – 21:00 WIB</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-coffee-orange shrink-0" />
                <p>+62 812-3456-7890</p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap gap-1.5">
              {['QRIS', 'Virtual Account', 'GoPay / ShopeePay', 'Card'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-[10px] font-bold text-coffee-beige/90"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-cream/60">
          <p>© {new Date().getFullYear()} Coffeelo Specialty Coffee House. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-coffee-cream hover:text-white transition-colors font-semibold cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
