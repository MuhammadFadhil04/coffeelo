import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2, Clock, XCircle, AlertTriangle, Loader2,
  ShoppingBag, ChevronRight, RefreshCw, ArrowRight,
  CreditCard, type LucideIcon
} from 'lucide-react';
import { getOrderById } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions: string | null;
}

interface Payment {
  id: string;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  paymentStatus: string;
  amount: number;
  paidAt: string | null;
  paymentMethod: string | null;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  fulfillmentType: string;
  storeLocation: string | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
}

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

const STATUS_CONFIG: Record<PaymentStatus, { label: string; icon: LucideIcon; color: string; bg: string; border: string }> = {
  PENDING: {
    label: 'Menunggu Pembayaran',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  PAID: {
    label: 'Pembayaran Berhasil',
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  FAILED: {
    label: 'Pembayaran Gagal',
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  EXPIRED: {
    label: 'Pembayaran Kedaluwarsa',
    icon: AlertTriangle,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  },
  REFUNDED: {
    label: 'Dana Dikembalikan',
    icon: RefreshCw,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
};

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
      setError(null);
    } catch {
      setError('Gagal memuat detail pesanan.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto-poll while PENDING (up to 20 times = ~2 min)
  useEffect(() => {
    if (order?.payment?.paymentStatus !== 'PENDING') return;
    if (pollingCount >= 20) return;
    const timer = setTimeout(() => {
      setPollingCount(c => c + 1);
      fetchOrder();
    }, 6000);
    return () => clearTimeout(timer);
  }, [order, pollingCount, fetchOrder]);

  const handleSnapPay = () => {
    const redirectUrl = order?.payment?.snapRedirectUrl;
    if (redirectUrl) window.location.assign(redirectUrl);
  };

  const handleCheckPaymentStatus = () => fetchOrder();

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#B6370B] mx-auto mb-4" />
          <p className="text-[#71351D]/70">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#451B0E] mb-2">Terjadi Kesalahan</h2>
          <p className="text-[#71351D]/70 mb-6">{error}</p>
          <button
            onClick={() => navigate('/my-orders')}
            className="px-6 py-3 rounded-full bg-[#B6370B] hover:bg-[#71351D] text-white text-sm font-semibold transition-colors"
          >
            Lihat Pesanan Saya
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const paymentStatus = (order.payment?.paymentStatus || 'PENDING') as PaymentStatus;
  const statusCfg = STATUS_CONFIG[paymentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;
  const isPaid = paymentStatus === 'PAID';
  const isPaymentClosed = paymentStatus === 'EXPIRED' || order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#71351D]/60 mb-6">
          <Link to="/my-orders" className="hover:text-[#B6370B] transition-colors">Pesanan Saya</Link>
          <ChevronRight size={14} />
          <span className="text-[#451B0E] font-medium">Pembayaran</span>
        </div>

        {/* Payment Status Card */}
        <div className={`${statusCfg.bg} ${statusCfg.border} border-2 rounded-2xl p-6 mb-6 text-center`}>
          <StatusIcon size={48} className={`${statusCfg.color} mx-auto mb-3`} />
          <h1 className={`text-2xl font-bold ${statusCfg.color} mb-1`}>{statusCfg.label}</h1>
          <p className="text-sm text-[#71351D]/70 break-all">
            Pesanan #{order.orderNumber}
          </p>
          {isPaid && order.payment?.paidAt && (
            <p className="text-xs text-green-600 mt-2">
              Dibayar pada {new Date(order.payment.paidAt).toLocaleString('id-ID', {
                dateStyle: 'long', timeStyle: 'short'
              })}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-[#451B0E] mb-4">Detail Pesanan</h2>

          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-[#451B0E] font-medium">{item.productName}</span>
                  {item.variantName && (
                    <span className="text-[#71351D]/60"> — {item.variantName}</span>
                  )}
                  <span className="text-[#71351D]/60"> ×{item.quantity}</span>
                  {item.specialInstructions && (
                    <p className="text-xs text-[#B6370B]/70 italic mt-0.5">"{item.specialInstructions}"</p>
                  )}
                </div>
                <span className="font-medium text-[#451B0E] flex-shrink-0">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-[#E5D4C6] pt-4 space-y-2">
            <div className="flex justify-between text-sm text-[#71351D]/70">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-sm text-[#71351D]/70">
                <span>Ongkir</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#71351D]/70">
              <span>PPN</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#451B0E] pt-2 border-t border-[#E5D4C6]">
              <span>Total</span>
              <span className="text-[#B6370B] text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Fulfillment Info */}
          <div className="mt-4 p-3 bg-[#F4EDE5] rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-[#71351D]/70">Metode</span>
              <span className="font-medium text-[#451B0E]">
                {order.fulfillmentType === 'PICKUP' ? '🏪 Pickup di Toko' : '🛵 Delivery'}
              </span>
            </div>
            {order.storeLocation && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-[#71351D]/70">Toko</span>
                <span className="font-medium text-[#451B0E] text-right max-w-[60%]">{order.storeLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Actions */}
        {!isPaid && !isPaymentClosed && (
          <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-lg font-bold text-[#451B0E] mb-2">Lakukan Pembayaran</h2>
            <p className="text-sm text-[#71351D]/70 mb-5">
              Selesaikan pembayaran untuk memproses pesananmu.
            </p>

            {order.payment?.snapRedirectUrl ? (
              <button
                onClick={handleSnapPay}
                className="w-full bg-[#B6370B] hover:bg-[#71351D] active:scale-[0.99] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Bayar dengan Midtrans
              </button>
            ) : (
              <p className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                Link pembayaran belum tersedia. Silakan hubungi kedai untuk bantuan.
              </p>
            )}

            {/* Refresh Status */}
            <button
              onClick={handleCheckPaymentStatus}
              disabled={isLoading}
              className="w-full mt-3 border border-[#E5D4C6] text-[#71351D] font-medium py-3 rounded-xl hover:bg-[#F4EDE5] transition-all flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Periksa Status Pembayaran
            </button>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          {isPaid && (
            <Link
              to={`/my-orders/${order.id}`}
              className="flex items-center justify-center gap-2 w-full bg-[#B6370B] text-white font-bold py-4 rounded-xl hover:bg-[#71351D] transition-all"
            >
              <ShoppingBag size={18} />
              Lihat Detail Pesanan
              <ArrowRight size={18} />
            </Link>
          )}
          {isPaymentClosed && (
            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 w-full bg-[#B6370B] text-white font-bold py-4 rounded-xl hover:bg-[#71351D] transition-all"
            >
              Pesan Lagi
            </Link>
          )}
          <Link
            to="/my-orders"
            className="flex items-center justify-center gap-2 w-full border border-[#E5D4C6] text-[#71351D] font-medium py-4 rounded-xl hover:bg-white transition-all"
          >
            Lihat Semua Pesanan
          </Link>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
