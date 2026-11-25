import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle,
  Package, Truck, Coffee, Loader2, AlertTriangle, ArrowRight,
  type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getMyOrders } from '@/services/orderService';
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

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: LucideIcon }> = {
  PENDING: { label: 'Menunggu', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  CONFIRMED: { label: 'Dikonfirmasi', color: 'text-blue-700', bg: 'bg-blue-100', icon: CheckCircle2 },
  PROCESSING: { label: 'Diproses', color: 'text-purple-700', bg: 'bg-purple-100', icon: Coffee },
  READY: { label: 'Siap', color: 'text-teal-700', bg: 'bg-teal-100', icon: Package },
  ON_DELIVERY: { label: 'Dikirim', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: Truck },
  COMPLETED: { label: 'Selesai', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string }> = {
  PENDING: { label: 'Belum Dibayar', color: 'text-amber-600' },
  PAID: { label: 'Lunas', color: 'text-green-600' },
  FAILED: { label: 'Gagal', color: 'text-red-600' },
  EXPIRED: { label: 'Kedaluwarsa', color: 'text-gray-500' },
  REFUNDED: { label: 'Dikembalikan', color: 'text-blue-600' },
};

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'PENDING', label: 'Menunggu' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'COMPLETED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/my-orders');
    }
  }, [user, navigate]);

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
        setError('Gagal memuat pesanan. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user, statusFilter, page]);

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#451B0E] mb-1">Pesanan Saya</h1>
          <p className="text-[#71351D]/70">Pantau status dan riwayat pesananmu.</p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === f.value
                  ? 'bg-[#B6370B] text-white'
                  : 'bg-white text-[#71351D] border border-[#E5D4C6] hover:border-[#B6370B]/40'
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
          <div className="text-center py-12">
            <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-[#71351D]/70">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#B6370B] text-white rounded-full text-sm font-medium hover:bg-[#71351D] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-card">
              <ShoppingBag size={36} className="text-[#E5D4C6]" />
            </div>
            <h2 className="text-xl font-bold text-[#451B0E] mb-2">
              {statusFilter === 'ALL' ? 'Belum Ada Pesanan' : 'Tidak Ada Pesanan'}
            </h2>
            <p className="text-[#71351D]/60 mb-6 text-sm">
              {statusFilter === 'ALL'
                ? 'Yuk mulai petualangan kopi pertamamu!'
                : `Tidak ada pesanan dengan status "${STATUS_FILTERS.find(f => f.value === statusFilter)?.label}".`}
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#B6370B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#71351D] transition-colors"
            >
              Jelajahi Menu
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const orderStatus = order.status as OrderStatus;
              const paymentStatus = (order.payment?.paymentStatus || 'PENDING') as PaymentStatus;
              const statusCfg = ORDER_STATUS_CONFIG[orderStatus] || ORDER_STATUS_CONFIG.PENDING;
              const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.PENDING;
              const StatusIcon = statusCfg.icon;
              const needsPayment =
                ['PENDING', 'FAILED'].includes(paymentStatus) && orderStatus === 'PENDING';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-card transition-all group border border-transparent hover:border-[#B6370B]/20 hover:shadow-elevation"
                >
                  <Link to={`/my-orders/${order.id}`} className="block rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-xs text-[#71351D]/60 mb-1">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                        <div className="font-bold text-[#451B0E] break-all">#{order.orderNumber}</div>
                        <div className="text-xs text-[#71351D]/60 mt-0.5">
                          {order.itemCount} produk · {order.fulfillmentType === 'PICKUP' ? '🏪 Pickup' : '🛵 Delivery'}
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-[#E5D4C6] group-hover:text-[#B6370B] transition-colors mt-1 flex-shrink-0"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                          <StatusIcon size={12} />
                          {statusCfg.label}
                        </span>
                        <span className={`text-xs font-medium ${paymentCfg.color}`}>
                          · {paymentCfg.label}
                        </span>
                      </div>
                      <div className="text-right font-bold text-[#B6370B]">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                  </Link>

                  {needsPayment && (
                    <div className="mx-5 mb-4 pt-3 border-t border-[#E5D4C6]">
                      <Link
                        to={`/payment/${order.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B6370B] hover:underline"
                      >
                        <Clock size={12} />
                        Segera Bayar
                        <ArrowRight size={12} />
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
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full border border-[#E5D4C6] text-sm font-medium text-[#71351D] disabled:opacity-40 hover:border-[#B6370B]/40 transition-all"
            >
              ← Sebelumnya
            </button>
            <span className="text-sm text-[#71351D]/70">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-full border border-[#E5D4C6] text-sm font-medium text-[#71351D] disabled:opacity-40 hover:border-[#B6370B]/40 transition-all"
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
