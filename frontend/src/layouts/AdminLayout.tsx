import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Layers,
  Users,
  Star,
  CreditCard,
  BarChart3,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

interface NavGroup {
  section: string;
  items: Array<{
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    section: 'Menu Utama',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Pesanan', path: '/admin/orders', icon: ShoppingBag },
      { name: 'Laporan', path: '/admin/reports', icon: BarChart3 },
    ],
  },
  {
    section: 'Katalog & Menu',
    items: [
      { name: 'Produk Kopi', path: '/admin/products', icon: Coffee },
      { name: 'Kategori', path: '/admin/categories', icon: Layers },
      { name: 'Ulasan Rasa', path: '/admin/reviews', icon: Star },
    ],
  },
  {
    section: 'Manajemen & Sistem',
    items: [
      { name: 'Pelanggan', path: '/admin/customers', icon: Users },
      { name: 'Pembayaran', path: '/admin/payments', icon: CreditCard },
      { name: 'Pengaturan', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, adminToken, logoutAdmin, fetchAdminMe, isAdminVerifying, isLoading } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchAdminMe();
    const handleSync = () => {
      fetchAdminMe();
    };
    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [fetchAdminMe]);

  useEffect(() => {
    if (!adminToken && !adminUser && !isAdminVerifying && !isLoading) {
      navigate('/login?redirect=' + encodeURIComponent(location.pathname));
    }
  }, [adminToken, adminUser, isAdminVerifying, isLoading, navigate, location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login?redirect=' + encodeURIComponent(location.pathname));
  };

  if ((adminToken || isAdminVerifying) && !adminUser) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] font-sans flex flex-col items-center justify-center gap-3 p-6">
        <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
        <p className="text-xs font-bold text-[#71351D]">Memverifikasi sesi Administrator...</p>
      </div>
    );
  }

  // If active token belongs to a Customer instead of an Admin, prompt clean Admin login
  if (adminUser && adminUser.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#F4EDE5] font-sans flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5D4C6] shadow-xl space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-[#B6370B] flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-[#451B0E]">Sesi Administrator Diperlukan</h2>
            <p className="text-sm text-[#71351D]/85 leading-relaxed">
              Browser saat ini aktif menggunakan akun Pelanggan (<strong>{adminUser.email}</strong>). Silakan masuk kembali menggunakan akun Administrator untuk mengakses panel ini.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
              className="w-full py-3.5 rounded-full bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-extrabold uppercase tracking-wider transition shadow"
            >
              Masuk Sebagai Admin
            </Link>
            <Link
              to="/"
              className="w-full py-3 rounded-full bg-[#F4EDE5] text-[#451B0E] text-xs font-bold hover:bg-[#E5D4C6] transition"
            >
              Kembali ke Toko Pelanggan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active page title resolution
  const allItems = NAV_GROUPS.flatMap((g) => g.items);
  const currentNav = allItems.find(
    (item) =>
      location.pathname === item.path ||
      (item.path === '/admin/dashboard' && (location.pathname === '/admin' || location.pathname === '/admin/'))
  );
  const pageTitle = currentNav?.name || 'Admin Panel';

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#F4EDE5] font-sans flex flex-col lg:flex-row text-[#451B0E]">
      {/* 1. Desktop & Mobile/Tablet Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#3A1409] text-[#E5D4C6] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[#451B0E] shadow-2xl shadow-black/20 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B6370B] to-[#71351D] text-white flex items-center justify-center font-black shadow-lg shadow-[#B6370B]/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="block font-extrabold text-xl text-white tracking-tight leading-none">
                Coffeelo
              </span>
              <span className="inline-block mt-1 text-[9px] tracking-widest text-[#B6370B] uppercase font-bold bg-[#B6370B]/15 px-2 py-0.5 rounded-full border border-[#B6370B]/30">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {/* Group Section Header */}
              <div className="px-3 pb-1 text-[10px] font-black uppercase tracking-wider text-[#E5D4C6]/40">
                {group.section}
              </div>

              {/* Items */}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path === '/admin/dashboard' &&
                      (location.pathname === '/admin' || location.pathname === '/admin/'));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-[#B6370B] text-white shadow-md shadow-[#B6370B]/30 font-bold'
                          : 'text-[#E5D4C6]/80 hover:bg-white/[0.07] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive ? 'text-white' : 'text-[#E5D4C6]/60'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/[0.08] space-y-3 bg-black/10">
          {/* Quick link to Storefront */}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-[#E5D4C6] transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#B6370B] group-hover:scale-110 transition-transform" />
              <span>Buka Toko Pelanggan</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* User Profile Card */}
          <div className="p-2.5 rounded-2xl bg-black/25 border border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={
                    adminUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                  }
                  alt={adminUser?.name || 'Admin'}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#B6370B]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#3A1409]"></span>
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-[#E5D4C6]/60 truncate leading-tight mt-0.5">
                  {adminUser?.email || 'admin@coffeelo.com'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Keluar dari Admin"
              className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 transition shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile & tablet */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-[#F4EDE5]/90 backdrop-blur-md border-b border-[#E5D4C6] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white border border-[#E5D4C6] text-[#451B0E] hover:bg-[#F4EDE5] transition shrink-0"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-black text-[#451B0E] tracking-tight truncate">
                {pageTitle}
              </h1>
              <p className="text-xs text-[#71351D]/70 hidden sm:block truncate">
                Kelola operasional dan pantau performa bisnis Coffeelo secara terintegrasi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl bg-[#451B0E] hover:bg-[#71351D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
