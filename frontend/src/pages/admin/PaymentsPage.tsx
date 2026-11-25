import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminService, AdminPayment } from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getPayments({
        page,
        limit: 15,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setPayments(res.payments || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat log pembayaran.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Log Transaksi Pembayaran</h2>
          <p className="text-xs text-[#71351D]/80">Monitoring payment gateway Midtrans dan rekonsiliasi transfer.</p>
        </div>
        <button
          onClick={() => fetchPayments(pagination.page)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] hover:bg-[#F4EDE5] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5D4C6] shadow-sm flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="font-bold text-[#71351D]/70 pr-1 shrink-0">Status:</span>
        {['ALL', 'PAID', 'PENDING', 'FAILED', 'EXPIRED', 'REFUNDED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-[#B6370B] text-white shadow-sm'
                : 'bg-[#F4EDE5] text-[#71351D] hover:bg-[#E5D4C6]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 3. Payments Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat data pembayaran...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={() => fetchPayments(pagination.page)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <CreditCard className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Tidak ada log pembayaran</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Log pembayaran akan tercatat otomatis saat order dibuat dan diverifikasi webhook.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5D4C6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="bg-[#F4EDE5]/60 border-b border-[#E5D4C6] text-[#71351D]/80 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Pesanan</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Nominal Tagihan</th>
                  <th className="py-3.5 px-4">Metode Bayar</th>
                  <th className="py-3.5 px-4">Status Pembayaran</th>
                  <th className="py-3.5 px-4">Waktu Pelunasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D4C6]/60">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F4EDE5]/30 transition">
                    <td className="py-3.5 px-4 font-bold text-[#451B0E] font-mono">
                      {p.order?.orderNumber || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#451B0E]">{p.order?.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-[#71351D]/60">{p.order?.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#451B0E]">
                      {formatCurrency(Number(p.grossAmount))}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#71351D]">
                      {p.paymentMethod || 'Midtrans Snap'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]/70 whitespace-nowrap">
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
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
                Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} transaksi)
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchPayments(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchPayments(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
