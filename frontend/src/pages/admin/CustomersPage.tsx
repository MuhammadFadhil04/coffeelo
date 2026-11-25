import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Eye,
  Phone,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminService, AdminCustomer } from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerDetail, setCustomerDetail] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchCustomers = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getCustomers({
        page,
        limit: 15,
        search: search.trim() || undefined,
      });
      setCustomers(res.customers || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat daftar pelanggan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(1);
  };

  const openCustomerDetail = async (id: string) => {
    setSelectedCustomerId(id);
    setIsLoadingDetail(true);
    try {
      const detail = await adminService.getCustomerDetail(id);
      setCustomerDetail(detail);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal memuat detail pelanggan.');
      setSelectedCustomerId(null);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Basis Data Pelanggan</h2>
          <p className="text-xs text-[#71351D]/80">Lihat profil customer, kontak, riwayat transaksi, dan loyalitas.</p>
        </div>
        <button
          onClick={() => fetchCustomers(pagination.page)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] hover:bg-[#F4EDE5] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* 2. Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5D4C6] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71351D]/50" />
            <input
              type="text"
              placeholder="Cari nama pelanggan, email, atau nomor HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F4EDE5]/60 border border-[#E5D4C6] focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#451B0E] text-white text-xs font-bold hover:bg-[#71351D] transition"
          >
            Cari
          </button>
        </form>
      </div>

      {/* 3. Customers Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat pelanggan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={() => fetchCustomers(pagination.page)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <Users className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Tidak ada pelanggan ditemukan</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Belum ada akun customer yang terdaftar atau cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5D4C6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-[#F4EDE5]/60 border-b border-[#E5D4C6] text-[#71351D]/80 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Profil Pelanggan</th>
                  <th className="py-3.5 px-4">Kontak</th>
                  <th className="py-3.5 px-4">Bergabung</th>
                  <th className="py-3.5 px-4">Total Pesanan</th>
                  <th className="py-3.5 px-4">Total Belanja (Paid)</th>
                  <th className="py-3.5 px-4 text-right">Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D4C6]/60">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#F4EDE5]/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            cust.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                          }
                          alt={cust.name}
                          className="w-10 h-10 shrink-0 rounded-full object-cover border border-[#E5D4C6]"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#451B0E]">{cust.name}</p>
                          <p className="text-[11px] text-[#71351D]/60">{cust.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]">
                      {cust.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#B6370B]" /> {cust.phone}
                        </span>
                      ) : (
                        <span className="text-[#71351D]/40 italic">Tidak ada no. HP</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]/70 whitespace-nowrap">
                      {new Date(cust.joinedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#451B0E]">
                      {cust.totalOrders} pesanan
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#B6370B]">
                      {formatCurrency(cust.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openCustomerDetail(cust.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#F4EDE5] hover:bg-[#E5D4C6] text-[#451B0E] font-bold text-[11px] transition inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Profil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-[#E5D4C6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#71351D] font-semibold">
              <span>
                Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} customer)
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchCustomers(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchCustomers(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Customer Detail Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 border border-[#E5D4C6] shadow-2xl space-y-6 my-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5D4C6] pb-4">
              <h3 className="text-lg font-black font-serif text-[#451B0E]">Profil Detail Customer</h3>
              <button
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerDetail(null);
                }}
                className="text-[#71351D]/60 hover:text-[#451B0E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingDetail ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 text-[#B6370B] animate-spin" />
                <p className="text-xs font-semibold text-[#71351D]">Memuat data profil...</p>
              </div>
            ) : customerDetail ? (
              <div className="space-y-6 text-xs text-[#451B0E]">
                {/* Header Profile */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 bg-[#F4EDE5]/50 p-4 rounded-2xl border border-[#E5D4C6]">
                  <img
                    src={
                      customerDetail.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                    }
                    alt={customerDetail.name}
                    className="w-14 h-14 shrink-0 rounded-full object-cover ring-2 ring-[#B6370B]"
                  />
                  <div className="min-w-0">
                    <h4 className="text-base font-black break-words">{customerDetail.name}</h4>
                    <p className="text-[#71351D] break-all">{customerDetail.email}</p>
                    <p className="text-[#71351D]/70 text-[11px] mt-0.5">
                      {customerDetail.phone || 'Belum ada nomor telepon'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-amber-800 uppercase">Total Pesanan</p>
                    <p className="text-lg font-black text-[#451B0E]">
                      {customerDetail.orders?.length || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-3.5 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-green-800 uppercase">Total Belanja (Paid)</p>
                    <p className="text-lg font-black text-green-800">
                      {formatCurrency(customerDetail.totalSpent || 0)}
                    </p>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[#71351D] uppercase tracking-wider text-[11px]">
                    Alamat Tersimpan ({customerDetail.addresses?.length || 0})
                  </h4>
                  {customerDetail.addresses?.length === 0 ? (
                    <p className="text-[#71351D]/60 italic">Belum ada alamat tersimpan.</p>
                  ) : (
                    <div className="space-y-2">
                      {customerDetail.addresses.map((addr: any) => (
                        <div key={addr.id} className="p-3 rounded-xl border border-[#E5D4C6] bg-white flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#B6370B] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">{addr.recipientName} ({addr.phone})</p>
                            <p className="text-[#71351D] text-[11px]">{addr.addressLine}, {addr.city} {addr.postalCode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order History */}
                <div className="space-y-2">
                  <h4 className="font-bold text-[#71351D] uppercase tracking-wider text-[11px]">
                    Riwayat Transaksi Pesanan ({customerDetail.orders?.length || 0})
                  </h4>
                  {customerDetail.orders?.length === 0 ? (
                    <p className="text-[#71351D]/60 italic">Customer ini belum pernah memesan.</p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto divide-y divide-[#E5D4C6] border border-[#E5D4C6] rounded-2xl bg-white">
                      {customerDetail.orders.map((ord: any) => (
                        <div key={ord.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-mono font-bold text-[#451B0E]">{ord.orderNumber}</p>
                            <p className="text-[10px] text-[#71351D]/60">
                              {new Date(ord.createdAt).toLocaleDateString('id-ID')} • {ord.status}
                            </p>
                          </div>
                          <span className="font-black text-[#B6370B]">
                            {formatCurrency(Number(ord.totalAmount))}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex justify-end border-t border-[#E5D4C6] pt-4">
              <button
                onClick={() => {
                  setSelectedCustomerId(null);
                  setCustomerDetail(null);
                }}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
