import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  Store,
  Coffee,
  Loader2,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getMyOrders, formatPaymentMethod } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentType: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  payment: {
    paymentStatus: string;
    paymentMethod?: string | null;
  } | null;
}

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'ON_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: LucideIcon }
> = {
  PENDING: { label: 'Pending (Bayar di Tempat)', color: 'text-amber-800', bg: 'bg-amber-100', icon: Clock },
  CONFIRMED: { label: 'Dikonfirmasi', color: 'text-blue-800', bg: 'bg-blue-100', icon: CheckCircle2 },
  PROCESSING: { label: 'Sedang Diseduh', color: 'text-purple-800', bg: 'bg-purple-100', icon: Coffee },
  READY: { label: 'Siap Diambil', color: 'text-teal-800', bg: 'bg-teal-100', icon: Package },
  ON_DELIVERY: { label: 'Dalam Pengiriman', color: 'text-indigo-800', bg: 'bg-indigo-100', icon: Truck },
  COMPLETED: { label: 'Selesai', color: 'text-emerald-800', bg: 'bg-emerald-100', icon: CheckCircle2 },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-800', bg: 'bg-red-100', icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Bayar di Tempat', color: 'text-amber-700' },
  PAID: { label: 'Lunas', color: 'text-emerald-700' },
  FAILED: { label: 'Gagal', color: 'text-red-600' },
  EXPIRED: { label: 'Kedaluwarsa', color: 'text-gray-500' },
  REFUNDED: { label: 'Dikembalikan', color: 'text-blue-600' },
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'PENDING', label: 'Pending (Cash)' },
  { value: 'CONFIRMED', label: 'Dikonfirmasi' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'READY', label: 'Siap Ambil' },
  { value: 'ON_DELIVERY', label: 'Dikirim' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user && !token) {
      navigate('/login?redirect=/my-orders&reason=order');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = { page, limit: 10 };
        if (statusFilter !== 'ALL') params.status = statusFilter;
        const data = await getMyOrders(params);
        setOrders(data.orders);
        setTotalPages(data.meta?.totalPages || 1);
        setError(null);
      } catch {
        setError('Gagal memuat riwayat pesanan. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user || token) fetchOrders();
  }, [user, token, statusFilter, page]);

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#451B0E]">
              Riwayat & Status Pesanan
            </h1>
            <p className="text-sm text-[#71351D]/80 mt-1">
              Pantau progres seduhan kopi, metode pembayaran, dan riwayat transaksi Anda.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#451B0E] hover:bg-[#B6370B] text-white text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0"
          >
            Pesan Menu Baru
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => handleFilterChange(f.value)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === f.value
                  ? 'bg-[#B6370B] text-white shadow-sm'
                  : 'bg-white text-[#451B0E] border border-[#E5D4C6] hover:border-[#B6370B]/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#B6370B]" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#E5D4C6] p-6">
            <AlertTriangle size={36} className="text-red-500 mx-auto mb-3" />
            <p className="text-sm text-[#71351D]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2.5 bg-[#B6370B] text-white rounded-full text-xs font-bold hover:bg-[#451B0E] transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5D4C6] px-4">
            <div className="w-16 h-16 bg-[#F4EDE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-[#B6370B]" />
            </div>
            <h2 className="text-xl font-black text-[#451B0E] mb-1.5">
              {statusFilter === 'ALL' ? 'Belum Ada Riwayat Pesanan' : 'Tidak Ada Pesanan di Filter Ini'}
            </h2>
            <p className="text-[#71351D]/75 mb-6 text-xs sm:text-sm max-w-sm mx-auto">
              {statusFilter === 'ALL'
                ? 'Mulai pesan kopi favorit Anda dan pantau statusnya secara real-time di halaman ini.'
                : `Tidak ditemukan pesanan dengan status "${
                    STATUS_FILTERS.find((f) => f.value === statusFilter)?.label
                  }".`}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#B6370B] text-white px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-wider hover:bg-[#451B0E] transition-colors shadow-card"
            >
              Jelajahi Menu Kopi
              <ArrowRight size={15} />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderStatus = order.status as OrderStatus;
              const paymentStatus = (order.payment?.paymentStatus || 'PENDING') as PaymentStatus;
              const isQrisPending =
                order.payment?.paymentMethod === 'QRIS' &&
                paymentStatus === 'PENDING' &&
                orderStatus === 'PENDING';
              const statusCfg = ORDER_STATUS_CONFIG[orderStatus] || ORDER_STATUS_CONFIG.PENDING;
              const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.PENDING;
              const StatusIcon = statusCfg.icon;
              const methodText = formatPaymentMethod(order.payment?.paymentMethod);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-subtle transition-all group border border-[#E5D4C6] hover:border-[#B6370B]/40 hover:shadow-card"
                >
                  <Link to={`/my-orders/${order.id}`} className="block rounded-3xl p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="space-y-1 min-w-0">
                        <div className="text-xs text-[#71351D]/70 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="font-black text-base text-[#451B0E] break-all">
                          #{order.orderNumber}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#71351D]/80 pt-0.5">
                          <span className="font-semibold">{order.itemCount} item</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-semibold">
                            {order.fulfillmentType === 'PICKUP' ? (
                              <>
                                <Store size={12} className="text-[#B6370B]" />
                                Ambil di Gerai
                              </>
                            ) : (
                              <>
                                <Truck size={12} className="text-[#B6370B]" />
                                Antar Kurir
                              </>
                            )}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-[#451B0E]">
                            <CreditCard size={12} className="text-[#B6370B]" />
                            {methodText}
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-[#71351D]/40 group-hover:text-[#B6370B] transition-colors mt-1 shrink-0"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E5D4C6]/70">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}
                        >
                          <StatusIcon size={12} />
                          {isQrisPending ? 'Menunggu Scan QRIS' : statusCfg.label}
                        </span>
                        <span className={`text-xs font-extrabold ${paymentCfg.color}`}>
                          • {isQrisPending ? 'Belum Scan QRIS' : paymentCfg.label}
                        </span>
                      </div>
                      <div className="text-right font-black text-lg text-[#B6370B]">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                  </Link>

                  {isQrisPending && (
                    <div className="px-5 sm:px-6 pb-5 pt-1">
                      <Link
                        to={`/payment/${order.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-extrabold uppercase tracking-wider transition-colors"
                      >
                        Tampilkan Barcode QRIS
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] disabled:opacity-40 hover:border-[#B6370B]/40 transition-colors cursor-pointer"
            >
              Sebelumnya
            </button>
            <span className="text-xs font-bold text-[#71351D]">
              Halaman {page} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] disabled:opacity-40 hover:border-[#B6370B]/40 transition-colors cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
