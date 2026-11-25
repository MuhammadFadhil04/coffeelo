import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Clock, XCircle, Package,
  Truck, Coffee, MapPin, Store, Loader2, AlertTriangle,
  CreditCard, ArrowRight, type LucideIcon
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { getOrderById, formatPaymentMethod } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';

interface StatusHistoryEntry {
  status: string;
  note: string | null;
  createdAt: string;
  createdBy: string | null;
}

interface OrderItem {
  id: string;
  productName: string;
  variantName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions: string | null;
}

interface ShippingAddress {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string | null;
}

interface Payment {
  id: string;
  snapToken: string | null;
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
  shippingAddress: ShippingAddress | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  items: OrderItem[];
  payment: Payment | null;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY'
  | 'ON_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

const ORDER_STATUSES: Array<{ key: OrderStatus; label: string; icon: LucideIcon }> = [
  { key: 'PENDING', label: 'Pesanan Diterima', icon: Clock },
  { key: 'CONFIRMED', label: 'Dikonfirmasi', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Sedang Diproses', icon: Coffee },
  { key: 'READY', label: 'Siap', icon: Package },
  { key: 'ON_DELIVERY', label: 'Dalam Pengiriman', icon: Truck },
  { key: 'COMPLETED', label: 'Selesai', icon: CheckCircle2 },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  READY: 3,
  ON_DELIVERY: 4,
  COMPLETED: 5,
  CANCELLED: -1,
};

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Belum Dibayar', color: 'text-amber-700', bg: 'bg-amber-100' },
  PAID: { label: 'Lunas', color: 'text-green-700', bg: 'bg-green-100' },
  FAILED: { label: 'Gagal', color: 'text-red-700', bg: 'bg-red-100' },
  EXPIRED: { label: 'Kedaluwarsa', color: 'text-gray-600', bg: 'bg-gray-100' },
  REFUNDED: { label: 'Dikembalikan', color: 'text-blue-700', bg: 'bg-blue-100' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && !token) {
      navigate('/login?redirect=/my-orders&reason=order');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
        setError(null);
      } catch {
        setError('Gagal memuat detail pesanan.');
      } finally {
        setIsLoading(false);
      }
    };
    if (user || token) fetchOrder();
  }, [id, user, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#B6370B] mx-auto mb-4" />
          <p className="text-[#71351D]/70">Memuat detail pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#451B0E] mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-[#71351D]/70 mb-6">{error || 'Pesanan tidak dapat ditemukan.'}</p>
          <Link to="/my-orders" className="inline-flex items-center gap-2 bg-[#B6370B] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#71351D] transition-colors">
            Kembali ke Pesanan Saya
          </Link>
        </div>
      </div>
    );
  }

  const orderStatus = order.status as OrderStatus;
  const paymentStatus = (order.payment?.paymentStatus || 'PENDING') as PaymentStatus;
  const paymentCfg = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.PENDING;
  const currentStatusIndex = STATUS_ORDER[orderStatus];
  const isCancelled = orderStatus === 'CANCELLED';
  const needsPayment = ['PENDING', 'FAILED'].includes(paymentStatus) && !isCancelled;

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/my-orders"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-card hover:shadow-elevation transition-all"
          >
            <ArrowLeft size={18} className="text-[#451B0E]" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-[#451B0E]">Detail Pesanan</h1>
            <p className="text-sm text-[#71351D]/60 break-all">#{order.orderNumber}</p>
          </div>
        </div>

        {/* Cash / Payment Info Banner */}
        {needsPayment && (
          <Link
            to={`/payment/${order.id}`}
            className="flex items-center justify-between bg-amber-500 text-white rounded-2xl p-4 mb-6 hover:bg-amber-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard size={20} />
              <div>
                <div className="font-bold text-sm">
                  {order.payment?.paymentMethod === 'CASH'
                    ? 'Pembayaran Tunai di Tempat (Pending)'
                    : 'Tampilkan Barcode QRIS & Konfirmasi Pembayaran'}
                </div>
                <div className="text-xs text-amber-100">
                  {order.payment?.paymentMethod === 'CASH'
                    ? `Metode: ${formatPaymentMethod(order.payment?.paymentMethod)} — Dibayar saat pesanan diterima`
                    : 'Klik untuk menampilkan kode QRIS dan menyelesaikan konfirmasi pembayaran'}
                </div>
              </div>
            </div>
            <ArrowRight size={18} className="flex-shrink-0" />
          </Link>
        )}

        {/* Order Status Timeline */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
            <h2 className="text-lg font-bold text-[#451B0E] mb-5">Status Pesanan</h2>
            <div className="space-y-0">
              {ORDER_STATUSES.map((step, index) => {
                const isCompleted = currentStatusIndex >= STATUS_ORDER[step.key];
                const isCurrent = currentStatusIndex === STATUS_ORDER[step.key];
                const StepIcon = step.icon;
                const isLast = index === ORDER_STATUSES.length - 1;

                // Find actual timestamp from history
                const historyEntry = order.statusHistory.find(h => h.status === step.key);

                return (
                  <div key={step.key} className="flex gap-4">
                    {/* Icon Column */}
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-[#B6370B] text-white'
                          : 'bg-[#E5D4C6] text-[#71351D]/40'
                      } ${isCurrent ? 'ring-4 ring-[#B6370B]/20' : ''}`}>
                        <StepIcon size={16} />
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-8 my-1 ${isCompleted ? 'bg-[#B6370B]' : 'bg-[#E5D4C6]'}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-6 ${isLast ? 'pb-0' : ''} flex-1 pt-1.5`}>
                      <div className={`font-semibold text-sm ${isCompleted ? 'text-[#451B0E]' : 'text-[#71351D]/40'}`}>
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-[#B6370B] text-white px-2 py-0.5 rounded-full">Sekarang</span>
                        )}
                      </div>
                      {historyEntry && (
                        <div className="text-xs text-[#71351D]/60 mt-0.5">
                          {new Date(historyEntry.createdAt).toLocaleString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                          {historyEntry.note && ` · ${historyEntry.note}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cancelled State */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
            <XCircle size={24} className="text-red-500 flex-shrink-0" />
            <div>
              <div className="font-bold text-red-700">Pesanan Dibatalkan</div>
              <div className="text-sm text-red-600 mt-0.5">
                {order.statusHistory.find(h => h.status === 'CANCELLED')?.note || 'Pesanan ini telah dibatalkan.'}
              </div>
            </div>
          </div>
        )}

        {/* Payment Status */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-[#451B0E] mb-4">Pembayaran</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#71351D]/70">Status</div>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${paymentCfg.bg} ${paymentCfg.color}`}>
                {paymentCfg.label}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#71351D]/70">Total</div>
              <div className="font-bold text-[#B6370B] text-lg">
                {formatCurrency(order.totalAmount)}
              </div>
            </div>
          </div>
          {order.payment?.paidAt && (
            <div className="mt-3 text-xs text-[#71351D]/60">
              Dibayar: {new Date(order.payment.paidAt).toLocaleString('id-ID', {
                dateStyle: 'long', timeStyle: 'short'
              })}
            </div>
          )}
          {order.payment?.paymentMethod && (
            <div className="mt-1 text-xs text-[#71351D]/60">
              Metode: {order.payment.paymentMethod}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-[#451B0E] mb-4">Item Pesanan</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-[#E5D4C6] last:border-0 last:pb-0">
                <div className="w-14 h-14 bg-[#F4EDE5] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  ☕
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#451B0E] text-sm">{item.productName}</div>
                  {item.variantName && (
                    <div className="text-xs text-[#71351D]/60 mt-0.5">{item.variantName}</div>
                  )}
                  {item.specialInstructions && (
                    <div className="text-xs text-[#B6370B]/70 italic mt-0.5">"{item.specialInstructions}"</div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#71351D]/60">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </span>
                    <span className="font-bold text-[#451B0E] text-sm">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-5 pt-4 border-t border-[#E5D4C6] space-y-2">
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
                <span>Ongkos Kirim</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#71351D]/70">
              <span>PPN 10%</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#451B0E] pt-2 border-t border-[#E5D4C6]">
              <span>Total</span>
              <span className="text-[#B6370B] text-lg">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Fulfillment Info */}
        <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-bold text-[#451B0E] mb-4">Informasi Pengiriman</h2>
          {order.fulfillmentType === 'PICKUP' ? (
            <div className="flex items-start gap-3">
              <Store size={18} className="text-[#B6370B] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#451B0E] text-sm">Pickup di Toko</div>
                {order.storeLocation && (
                  <div className="text-sm text-[#71351D]/70 mt-1">{order.storeLocation}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#B6370B] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#451B0E] text-sm">Dikirim ke Alamat</div>
                {order.shippingAddress && (
                  <div className="text-sm text-[#71351D]/70 mt-1 space-y-0.5">
                    <div className="font-medium text-[#451B0E]">{order.shippingAddress.recipientName}</div>
                    <div>{order.shippingAddress.phone}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                    </div>
                    {order.shippingAddress.notes && (
                      <div className="text-[#B6370B]/70 italic">Catatan: {order.shippingAddress.notes}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-[#E5D4C6] flex flex-wrap justify-between gap-1 text-xs text-[#71351D]/60">
            <span>Tanggal Pesanan</span>
            <span>{new Date(order.createdAt).toLocaleString('id-ID', {
              dateStyle: 'long', timeStyle: 'short'
            })}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3">
          <Link
            to="/my-orders"
            className="flex-1 flex items-center justify-center gap-2 border border-[#E5D4C6] text-[#71351D] font-medium py-3.5 rounded-xl hover:bg-white transition-all text-sm"
          >
            ← Kembali
          </Link>
          <Link
            to="/menu"
            className="flex-1 flex items-center justify-center gap-2 bg-[#B6370B] text-white font-semibold py-3.5 rounded-xl hover:bg-[#71351D] transition-all text-sm"
          >
            Pesan Lagi
            <Coffee size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
