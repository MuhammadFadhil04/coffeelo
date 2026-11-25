import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { User, Mail, Phone, ShoppingBag, Shield, LogOut, ArrowRight, Coffee } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5D4C6] shadow-md space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-[#71351D] flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-[#451B0E]">Masuk ke Akun Anda</h2>
          <p className="text-xs text-[#71351D]/80">
            Silakan masuk untuk melihat profil, melacak pesanan, dan menyimpan alamat pengiriman.
          </p>
          <Link
            to="/login?redirect=/profile"
            className="block w-full py-3 rounded-full bg-[#451B0E] hover:bg-[#71351D] text-white text-xs font-bold transition shadow"
          >
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 pt-28 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D4C6] shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={
              user.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
            }
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#E5D4C6]"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black tracking-tight text-[#451B0E]">{user.name}</h2>
              {isAdmin() && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#B6370B] text-white shadow-sm">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#71351D]/80 flex items-center justify-center sm:justify-start gap-1.5 mt-1 break-all">
              <Mail className="w-3.5 h-3.5 text-[#B6370B] shrink-0" /> {user.email}
            </p>
            {user.phone && (
              <p className="text-xs text-[#71351D]/80 flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-[#B6370B]" /> {user.phone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {isAdmin() && (
            <Link
              to="/admin/dashboard"
              className="px-4 py-2 rounded-xl bg-[#451B0E] hover:bg-[#71351D] text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Shield className="w-4 h-4 text-[#B6370B]" />
              Admin Portal
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/my-orders"
          className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#71351D] flex items-center justify-center group-hover:bg-[#B6370B] group-hover:text-white transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#451B0E]">Riwayat Pesanan Saya</h4>
              <p className="text-xs text-[#71351D]/70">Pantau proses peracikan & pengiriman kopi Anda.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#71351D]/40 group-hover:text-[#B6370B] group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/menu"
          className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#B6370B] flex items-center justify-center group-hover:bg-[#451B0E] group-hover:text-white transition">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#451B0E]">Jelajahi Menu Spesial</h4>
              <p className="text-xs text-[#71351D]/70">Lihat koleksi espresso, latte, & signature bean kami.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#71351D]/40 group-hover:text-[#B6370B] group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
