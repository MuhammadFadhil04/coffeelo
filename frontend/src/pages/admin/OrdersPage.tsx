import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

const ORDER_STATUSES = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'READY',
  'ON_DELIVERY',
  'COMPLETED',
  'CANCELLED',
];

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  // Status Change Modal
  const [statusModalOrder, setStatusModalOrder] = useState<any | null>(null);
  const [targetStatus, setTargetStatus] = useState<string>('CONFIRMED');
  const [statusComment, setStatusComment] = useState('');
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getOrders({
        page,
        limit: 15,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: search.trim() || undefined,
      });
      setOrders(res.orders || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat daftar pesanan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1);
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusModalOrder) return;

    setIsUpdatingStatus(true);
    setModalError(null);
    try {
      const updated = await adminService.updateOrderStatus(
        statusModalOrder.id,
        targetStatus,
        statusComment.trim() || undefined,
        targetStatus === 'COMPLETED' ? true : markAsPaid
      );

      // Refresh list and detail
      await fetchOrders(pagination.page);
      if (selectedOrder && selectedOrder.id === statusModalOrder.id) {
        setSelectedOrder(updated);
      }

      setStatusModalOrder(null);
      setStatusComment('');
      setMarkAsPaid(false);
    } catch (err: any) {
      setModalError(err.response?.data?.message || err.message || 'Gagal mengubah status pesanan.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-orange-100 text-[#B6370B] border-orange-200';
      case 'READY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ON_DELIVERY':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#451B0E]">Manajemen Pesanan</h2>
          <p className="text-xs text-[#71351D]/80">Pantau seluruh alur pesanan customer, pembayaran, dan pengiriman.</p>
        </div>
        <button
          onClick={() => fetchOrders(pagination.page)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] hover:bg-[#F4EDE5] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5D4C6] shadow-sm space-y-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71351D]/50" />
            <input
              type="text"
              placeholder="Cari nomor pesanan, nama customer, atau email..."
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

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="font-bold text-[#71351D]/60 pr-1 flex items-center gap-1 shrink-0">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {ORDER_STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-[#B6370B] text-white shadow-sm'
                  : 'bg-[#F4EDE5]/70 text-[#71351D] hover:bg-[#E5D4C6]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Orders Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat data pesanan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={() => fetchOrders(pagination.page)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Tidak ada pesanan ditemukan</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Tidak ada pesanan yang cocok dengan kriteria filter saat ini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5D4C6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-xs">
              <thead className="bg-[#F4EDE5]/60 border-b border-[#E5D4C6] text-[#71351D]/80 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Pesanan</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Tipe</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Status Order</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4">Waktu</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D4C6]/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F4EDE5]/30 transition">
                    <td className="py-3.5 px-4 font-bold text-[#451B0E] font-mono">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#451B0E]">{ord.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-[#71351D]/60">{ord.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#71351D]">
                        {ord.type === 'DELIVERY' ? <Truck className="w-3 h-3 text-[#B6370B]" /> : <Store className="w-3 h-3 text-[#71351D]" />}
                        {ord.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#451B0E]">
                      {formatCurrency(Number(ord.totalAmount))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-start gap-0.5">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            ord.payment?.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.payment?.status || 'PENDING'}
                        </span>
                        <span className="text-[10px] font-semibold text-[#71351D]/70">
                          {ord.payment?.paymentMethod || 'CASH'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]/70 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          title="Lihat Rincian"
                          className="px-2.5 py-1 rounded-lg bg-[#F4EDE5] hover:bg-[#E5D4C6] text-[#451B0E] text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                        {ord.status !== 'COMPLETED' && ord.status !== 'CANCELLED' ? (
                          <button
                            onClick={() => {
                              setStatusModalOrder(ord);
                              setTargetStatus(ord.status === 'PENDING' ? 'CONFIRMED' : ord.status);
                              setStatusComment('');
                              setMarkAsPaid(false);
                              setModalError(null);
                            }}
                            title="Ubah Status"
                            className="px-2.5 py-1 rounded-lg bg-[#451B0E] hover:bg-[#71351D] text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            Update
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 text-[11px] font-bold">
                            Final
                          </span>
                        )}
                      </div>
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
                Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} pesanan)
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchOrders(pagination.page - 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchOrders(pagination.page + 1)}
                  className="p-1.5 rounded-lg border border-[#E5D4C6] hover:bg-[#F4EDE5] disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 border border-[#E5D4C6] shadow-2xl space-y-6 my-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 border-b border-[#E5D4C6] pb-4">
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#B6370B] font-mono break-all">
                  {selectedOrder.orderNumber}
                </span>
                <h3 className="text-lg font-black tracking-tight text-[#451B0E]">Rincian Transaksi Pesanan</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#71351D]/60 hover:text-[#451B0E] shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Fulfillment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F4EDE5]/50 p-4 rounded-2xl border border-[#E5D4C6]">
              <div className="min-w-0">
                <p className="font-bold text-[#71351D]/70 uppercase">Customer</p>
                <p className="font-black text-sm text-[#451B0E] truncate">{selectedOrder.user?.name}</p>
                <p className="text-[#71351D] break-all">{selectedOrder.user?.email}</p>
              </div>
              <div>
                <p className="font-bold text-[#71351D]/70 uppercase">Metode Pemenuhan</p>
                <p className="font-black text-sm text-[#451B0E] flex items-center gap-1.5">
                  {selectedOrder.type === 'DELIVERY' ? <Truck className="w-4 h-4 text-[#B6370B]" /> : <Store className="w-4 h-4 text-[#71351D]" />}
                  {selectedOrder.type}
                </p>
                <p className="text-[#71351D]">
                  {selectedOrder.type === 'PICKUP'
                    ? selectedOrder.storeLocation || 'Store Pickup'
                    : 'Pengiriman Kurir'}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#71351D]">
                Item yang Dipesan ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-[#E5D4C6] border border-[#E5D4C6] rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((it: any) => (
                  <div key={it.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div>
                      <p className="font-bold text-[#451B0E]">{it.productName}</p>
                      <p className="text-[#71351D]/70 text-[11px]">
                        Qty: {it.quantity} x {formatCurrency(Number(it.unitPrice))}
                      </p>
                      {it.specialInstructions && (
                        <p className="text-[10px] text-amber-800 italic mt-0.5">
                          Note: "{it.specialInstructions}"
                        </p>
                      )}
                    </div>
                    <div className="font-black text-[#451B0E]">
                      {formatCurrency(Number(it.subtotal))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-[#F4EDE5]/30 p-4 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-[#71351D]">
                <span>Subtotal Menu:</span>
                <span>{formatCurrency(Number(selectedOrder.subtotal))}</span>
              </div>
              <div className="flex justify-between text-[#71351D]">
                <span>Ongkos Kirim:</span>
                <span>{formatCurrency(Number(selectedOrder.deliveryFee))}</span>
              </div>
              <div className="flex justify-between text-[#71351D]">
                <span>Pajak (PB1):</span>
                <span>{formatCurrency(Number(selectedOrder.taxAmount))}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#451B0E] pt-2 border-t border-[#E5D4C6]">
                <span>Total Bayar:</span>
                <span className="text-[#B6370B]">{formatCurrency(Number(selectedOrder.totalAmount))}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E5D4C6] pt-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Update Status Modal */}
      {statusModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 border border-[#E5D4C6] shadow-2xl space-y-5 my-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5D4C6] pb-3">
              <h3 className="text-base font-black tracking-tight text-[#451B0E]">
                Update Status Pesanan
              </h3>
              <button onClick={() => setStatusModalOrder(null)} className="text-[#71351D]/60 hover:text-[#451B0E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs font-semibold text-[#451B0E]">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <p className="text-[11px] text-[#71351D] mb-1">
                  Pesanan: <strong className="font-mono">{statusModalOrder.orderNumber}</strong> ({statusModalOrder.user?.name})
                </p>
                <p className="text-[11px] text-[#71351D]/80 mb-2.5">
                  Pembayaran saat ini:{' '}
                  <strong className={statusModalOrder.payment?.status === 'PAID' ? 'text-green-700' : 'text-amber-700'}>
                    {statusModalOrder.payment?.status || 'PENDING'}
                  </strong>{' '}
                  ({statusModalOrder.payment?.paymentMethod || 'CASH'})
                </p>
                <label className="block mb-1.5">Pilih Status Baru *</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 font-bold focus:outline-none"
                >
                  <option value="PENDING">PENDING (Menunggu Pembayaran)</option>
                  <option value="CONFIRMED">CONFIRMED (Pesanan Dikonfirmasi)</option>
                  <option value="PROCESSING">PROCESSING (Sedang Dibuat Barista)</option>
                  <option value="READY">READY (Siap Diambil Customer)</option>
                  <option value="ON_DELIVERY">ON_DELIVERY (Dalam Pengantaran)</option>
                  <option value="COMPLETED">COMPLETED (Pesanan Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Pesanan Dibatalkan)</option>
                </select>
              </div>

              {statusModalOrder.payment?.status !== 'PAID' && targetStatus !== 'CANCELLED' && (
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4EDE5]/70 border border-[#E5D4C6] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={targetStatus === 'COMPLETED' ? true : markAsPaid}
                    disabled={targetStatus === 'COMPLETED'}
                    onChange={(e) => setMarkAsPaid(e.target.checked)}
                    className="mt-0.5 rounded accent-[#B6370B]"
                  />
                  <span className="text-[11px] leading-relaxed text-[#451B0E]">
                    <strong>Tandai pembayaran sudah diterima / LUNAS (PAID)</strong>
                    {targetStatus === 'COMPLETED' && (
                      <span className="block text-[#71351D]/80">
                        Otomatis dicatat LUNAS saat pesanan diselesaikan (COMPLETED).
                      </span>
                    )}
                  </span>
                </label>
              )}

              <div>
                <label className="block mb-1.5">Catatan / Keterangan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Barista mulai mengekstrak espresso..."
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5D4C6]">
                <button
                  type="button"
                  onClick={() => setStatusModalOrder(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold transition hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="px-5 py-2 rounded-xl bg-[#451B0E] hover:bg-[#71351D] text-white font-bold transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdatingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
