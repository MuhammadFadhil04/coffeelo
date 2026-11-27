import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
  ShoppingBag,
  ChevronRight,
  RefreshCw,
  ArrowRight,
  Banknote,
  Store,
  Truck,
  Sparkles,
  QrCode,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { getOrderById, confirmQrisPayment, formatPaymentMethod } from '@/services/orderService';
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
  shippingAddress?: {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  } | null;
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

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; icon: LucideIcon; color: string; bg: string; border: string }
> = {
  PENDING: {
    label: 'Menunggu Pembayaran',
    icon: Clock,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  PAID: {
    label: 'Pembayaran Lunas & Pesanan Dikonfirmasi',
    icon: CheckCircle2,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
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

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Menunggu Pembayaran',
  CONFIRMED: 'Dikonfirmasi — Disiapkan Barista',
  PROCESSING: 'Sedang Diseduh Barista',
  READY: 'Siap Diambil',
  ON_DELIVERY: 'Sedang Dikirim Kurir',
  COMPLETED: 'Pesanan Selesai',
  CANCELLED: 'Dibatalkan',
};

/**
 * Generates a deterministic 25x25 QR-style SVG matrix with standard 7x7 finder patterns
 * from the order string so every order displays a crisp, unique scannable-style QRIS barcode.
 */
function buildQrMatrix(seedText: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  const placeFinder = (rowOffset: number, colOffset: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[rowOffset + r][colOffset + c] = isBorder || isCenter;
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Alignment box near bottom-right
  for (let r = 16; r <= 20; r++) {
    for (let c = 16; c <= 20; c++) {
      const isEdge = r === 16 || r === 20 || c === 16 || c === 20;
      const isDot = r === 18 && c === 18;
      grid[r][c] = isEdge || isDot;
    }
  }

  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const isReserved = (r: number, c: number) => {
    if (r < 8 && c < 8) return true;
    if (r < 8 && c >= size - 8) return true;
    if (r >= size - 8 && c < 8) return true;
    if (r >= 16 && r <= 20 && c >= 16 && c <= 20) return true;
    if (r >= 10 && r <= 14 && c >= 10 && c <= 14) return true; // Center logo space
    return false;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r === 6 && c >= 8 && c < size - 8) {
        grid[r][c] = c % 2 === 0;
        continue;
      }
      if (c === 6 && r >= 8 && r < size - 8) {
        grid[r][c] = r % 2 === 0;
        continue;
      }
      if (isReserved(r, c)) continue;
      hash ^= (r * 31 + c * 17) & 0xff;
      hash = Math.imul(hash, 16777619);
      grid[r][c] = (hash >>> 3) % 2 === 0;
    }
  }

  return grid;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmingQris, setIsConfirmingQris] = useState(false);
  const [qrisJustConfirmed, setQrisJustConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isJustCreated = searchParams.get('success') === '1';

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

  const qrMatrix = useMemo(
    () => buildQrMatrix(`${order?.orderNumber || 'COFFEELO'}-${order?.totalAmount || 0}`),
    [order?.orderNumber, order?.totalAmount]
  );

  const handleConfirmQris = async () => {
    if (!order) return;
    setIsConfirmingQris(true);
    setError(null);
    try {
      const updated = await confirmQrisPayment(order.id);
      setOrder(updated);
      setQrisJustConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengonfirmasi pembayaran QRIS.';
      setError(msg);
    } finally {
      setIsConfirmingQris(false);
    }
  };

  if (isLoading && !order) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={38} className="animate-spin text-[#B6370B] mx-auto mb-3" />
          <p className="text-xs font-bold text-[#71351D]">Memuat halaman pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#F4EDE5] flex items-center justify-center px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-3xl border border-[#E5D4C6] shadow-card">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-black text-[#451B0E] mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#71351D]/80 mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate('/my-orders')}
            className="px-6 py-3 rounded-full bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Buka Riwayat Pesanan
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const paymentStatus = (order.payment?.paymentStatus || 'PENDING') as PaymentStatus;
  const isCash = order.payment?.paymentMethod === 'CASH';
  const isQris = order.payment?.paymentMethod === 'QRIS';
  const isPaid = paymentStatus === 'PAID';
  const showQrisBarcode = isQris && paymentStatus === 'PENDING' && order.status !== 'CANCELLED';
  const statusCfg = STATUS_CONFIG[paymentStatus] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#71351D]/70">
          <Link to="/my-orders" className="hover:text-[#B6370B] transition-colors">
            Riwayat Pesanan
          </Link>
          <ChevronRight size={14} />
          <span className="text-[#451B0E] font-bold">
            {showQrisBarcode ? 'Scan Pembayaran QRIS' : 'Konfirmasi Pesanan'}
          </span>
        </div>

        {/* Success Notification Banner (after Cash order created OR after QRIS confirmed) */}
        {(qrisJustConfirmed || (isJustCreated && isCash) || (isJustCreated && isPaid)) && (
          <div className="rounded-3xl bg-gradient-to-r from-[#2E120A] via-[#451B0E] to-[#5C2412] text-white p-6 sm:p-7 shadow-elevation border border-white/10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={13} />
              Notifikasi Pesanan Berhasil
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isPaid
                ? 'Pembayaran Berhasil & Pesanan Dikonfirmasi!'
                : 'Pesanan Berhasil Dibuat!'}
            </h1>
            <p className="text-xs sm:text-sm text-[#E5D4C6]/90 leading-relaxed">
              {isPaid
                ? 'Terima kasih! Pembayaran QRIS Anda telah terverifikasi lunas dan pesanan langsung disiapkan oleh barista kami.'
                : order.fulfillmentType === 'PICKUP'
                  ? 'Pesanan Anda telah masuk ke antrean dengan status Pending. Silakan lakukan pembayaran tunai di kasir saat mengambil pesanan.'
                  : 'Pesanan Anda telah masuk ke antrean dengan status Pending. Silakan siapkan pembayaran tunai (COD) saat kurir tiba.'}
            </p>
          </div>
        )}

        {/* QRIS BARCODE PAYMENT CARD (Shown right after placing a QRIS order while unpaid) */}
        {showQrisBarcode && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#B6370B]/30 shadow-elevation space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5D4C6]">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#B6370B]">
                  <QrCode size={14} />
                  QRIS Pembayaran Instan
                </span>
                <h1 className="text-2xl font-black text-[#451B0E] tracking-tight mt-0.5">
                  Scan Barcode QRIS
                </h1>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] font-bold uppercase text-[#71351D]/70">Total Bayar</p>
                <p className="text-2xl font-black text-[#B6370B]">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>

            {/* Official-style QRIS Barcode Frame */}
            <div className="max-w-xs mx-auto rounded-3xl bg-[#FAF6F0] border-2 border-[#E5D4C6] p-5 text-center space-y-3 shadow-subtle">
              <div className="flex items-center justify-between text-xs font-black tracking-wider text-[#451B0E] pb-2 border-b border-[#E5D4C6]">
                <span>QRIS</span>
                <span className="text-[10px] font-bold text-[#B6370B] uppercase">GPN • Standar Nasional</span>
              </div>

              <div className="space-y-0.5">
                <p className="text-sm font-black text-[#451B0E] uppercase tracking-tight">
                  COFFEELO CAFE & ROASTERY
                </p>
                <p className="text-[10px] font-mono font-semibold text-[#71351D]/80">
                  NMID: ID2026008812901 • #{order.orderNumber.slice(-8)}
                </p>
              </div>

              {/* Crisp Vector QR Matrix */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E5D4C6] inline-block mx-auto shadow-sm">
                <svg
                  viewBox="0 0 25 25"
                  className="w-48 h-48 sm:w-52 sm:h-52 text-[#2E120A]"
                  shapeRendering="crispEdges"
                  role="img"
                  aria-label={`Kode QRIS untuk pesanan ${order.orderNumber}`}
                >
                  <rect width="25" height="25" fill="#FFFFFF" />
                  {qrMatrix.map((row, rIdx) =>
                    row.map((filled, cIdx) =>
                      filled ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx}
                          y={rIdx}
                          width={1}
                          height={1}
                          fill="currentColor"
                        />
                      ) : null
                    )
                  )}
                  {/* Center Coffeelo QRIS Emblem */}
                  <rect x="10.2" y="10.2" width="4.6" height="4.6" rx="0.8" fill="#B6370B" />
                  <text
                    x="12.5"
                    y="13.2"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="2.1"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    QR
                  </text>
                </svg>
              </div>

              <p className="text-[11px] font-semibold text-[#71351D] leading-relaxed">
                Scan menggunakan <strong>BCA Mobile, Livin' Mandiri, BRImo, GoPay, OVO, DANA,</strong> atau <strong>ShopeePay</strong>
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 text-center">
                {error}
              </div>
            )}

            {/* Confirm Payment Action */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleConfirmQris}
                disabled={isConfirmingQris}
                className="w-full py-4 px-6 rounded-full bg-[#B6370B] hover:bg-[#451B0E] text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isConfirmingQris ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Memverifikasi Pembayaran QRIS...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Saya Sudah Scan & Bayar
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#71351D]/75 font-medium">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Setelah dikonfirmasi, status pesanan otomatis menjadi Dikonfirmasi (Lunas).</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment & Order Status Summary Card (shown for Cash orders or Paid QRIS orders) */}
        {!showQrisBarcode && (
          <div className={`${statusCfg.bg} ${statusCfg.border} border-2 rounded-3xl p-6 text-center space-y-2`}>
            <StatusIcon size={44} className={`${statusCfg.color} mx-auto`} />
            <h2 className={`text-xl font-black tracking-tight ${statusCfg.color}`}>
              {isCash && paymentStatus === 'PENDING'
                ? 'Menunggu Pembayaran Tunai di Tempat (Pending)'
                : statusCfg.label}
            </h2>
            <p className="text-xs font-bold text-[#451B0E] break-all">
              Nomor Pesanan: #{order.orderNumber}
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5D4C6] font-bold text-[#451B0E]">
                Metode: {formatPaymentMethod(order.payment?.paymentMethod)}
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#E5D4C6] font-bold text-[#B6370B]">
                Status Order: {ORDER_STATUS_LABEL[order.status] || order.status}
              </span>
            </div>
            {isPaid && order.payment?.paidAt && (
              <p className="text-xs text-emerald-700 font-semibold pt-1">
                Lunas pada{' '}
                {new Date(order.payment.paidAt).toLocaleString('id-ID', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            )}
          </div>
        )}

        {/* Cash / Pay-on-Site Instructions */}
        {isCash && paymentStatus === 'PENDING' && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Banknote size={20} />
            </div>
            <div className="space-y-1 text-xs leading-relaxed">
              <h3 className="text-sm font-extrabold text-[#451B0E]">
                Instruksi Bayar di Tempat ({order.fulfillmentType === 'PICKUP' ? 'Kasir Gerai' : 'COD Kurir'})
              </h3>
              <p className="text-[#71351D]">
                {order.fulfillmentType === 'PICKUP'
                  ? `Tunjukkan kode pesanan #${order.orderNumber} kepada kasir di ${order.storeLocation || 'gerai Coffeelo'} dan bayar sebesar ${formatCurrency(order.totalAmount)}.`
                  : `Siapkan uang tunai sebesar ${formatCurrency(order.totalAmount)} untuk dibayarkan langsung kepada kurir saat tiba di lokasi pengiriman.`}
              </p>
            </div>
          </div>
        )}

        {/* Order Receipt Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-[#E5D4C6] pb-3">
            <h2 className="text-base font-extrabold text-[#451B0E]">Rincian Pesanan</h2>
            <button
              type="button"
              onClick={fetchOrder}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#71351D] hover:text-[#B6370B] transition-colors cursor-pointer"
            >
              <RefreshCw size={13} />
              Perbarui Status
            </button>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-3 text-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-[#451B0E] font-bold">{item.productName}</span>
                  {item.variantName && (
                    <span className="text-[#71351D]/70 text-xs"> — {item.variantName}</span>
                  )}
                  <span className="text-[#71351D]/80 text-xs font-semibold"> ×{item.quantity}</span>
                  {item.specialInstructions && (
                    <p className="text-xs text-[#B6370B] italic mt-0.5">
                      Catatan: "{item.specialInstructions}"
                    </p>
                  )}
                </div>
                <span className="font-bold text-[#451B0E] shrink-0">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E5D4C6] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#71351D]/80">
              <span>Subtotal</span>
              <span className="font-semibold text-[#451B0E]">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Diskon Promo</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-[#71351D]/80">
                <span>Ongkos Kirim</span>
                <span className="font-semibold text-[#451B0E]">{formatCurrency(order.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#71351D]/80">
              <span>Pajak (10%)</span>
              <span className="font-semibold text-[#451B0E]">{formatCurrency(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between items-baseline font-black text-[#451B0E] pt-2 border-t border-[#E5D4C6]">
              <span>Total Tagihan</span>
              <span className="text-[#B6370B] text-xl">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <div className="p-4 bg-[#F4EDE5]/70 rounded-2xl border border-[#E5D4C6] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#71351D] font-semibold">Metode Pemenuhan</span>
              <span className="font-extrabold text-[#451B0E] inline-flex items-center gap-1.5">
                {order.fulfillmentType === 'PICKUP' ? (
                  <>
                    <Store size={14} className="text-[#B6370B]" />
                    Ambil di Gerai
                  </>
                ) : (
                  <>
                    <Truck size={14} className="text-[#B6370B]" />
                    Antar Kurir
                  </>
                )}
              </span>
            </div>
            {order.storeLocation && (
              <div className="flex justify-between gap-4">
                <span className="text-[#71351D] font-semibold shrink-0">Lokasi Gerai</span>
                <span className="font-bold text-[#451B0E] text-right">{order.storeLocation}</span>
              </div>
            )}
            {order.shippingAddress && (
              <div className="pt-1 border-t border-[#E5D4C6]/70 text-[#451B0E]">
                <p className="font-bold">
                  {order.shippingAddress.recipientName} ({order.shippingAddress.phone})
                </p>
                <p className="text-[#71351D]">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.province} {order.shippingAddress.postalCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={`/my-orders/${order.id}`}
            className="flex items-center justify-center gap-2 w-full bg-[#451B0E] text-white font-extrabold text-xs uppercase tracking-wider py-4 px-5 rounded-full hover:bg-[#B6370B] transition-colors shadow-card"
          >
            <ShoppingBag size={16} />
            Pantau Timeline Pesanan
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/my-orders"
            className="flex items-center justify-center gap-2 w-full bg-white border border-[#E5D4C6] text-[#451B0E] font-extrabold text-xs uppercase tracking-wider py-4 px-5 rounded-full hover:bg-[#E5D4C6]/50 transition-colors"
          >
            Lihat Riwayat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
