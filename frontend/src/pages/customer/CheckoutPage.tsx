import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Store,
  ChevronRight,
  AlertCircle,
  Loader2,
  Tag,
  QrCode,
  Banknote,
  CheckCircle2,
  Coffee,
  type LucideIcon,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { createOrder, type CheckoutPaymentMethod } from '@/services/orderService';
import { formatCurrency } from '@/utils/currency';

interface ShippingAddress {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
}

const STORES = [
  { id: 'coffeelo-main', name: 'Coffeelo Main — Sudirman', address: 'Jl. Jend. Sudirman No. 52, Jakarta Pusat' },
  { id: 'coffeelo-senopati', name: 'Coffeelo Flagship — Senopati', address: 'Jl. Senopati No. 88, Jakarta Selatan' },
  { id: 'coffeelo-pik', name: 'Coffeelo PIK Avenue', address: 'PIK Avenue Mall Lt. 1, Jakarta Utara' },
];

const PAYMENT_OPTIONS: Array<{
  id: CheckoutPaymentMethod;
  title: string;
  subtitle: string;
  badge: string;
  isCash?: boolean;
  icon: LucideIcon;
}> = [
  {
    id: 'QRIS',
    title: 'QRIS (Scan Barcode)',
    subtitle: 'Tampilkan kode barcode QRIS setelah pesanan dibuat (BCA, Mandiri, GoPay, OVO, DANA, ShopeePay)',
    badge: 'Scan Barcode',
    icon: QrCode,
  },
  {
    id: 'CASH',
    title: 'Cash / Bayar di Tempat',
    subtitle: 'Bayar tunai di kasir saat ambil atau COD ke kurir',
    badge: 'Bayar di Tempat',
    isCash: true,
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const {
    items,
    fulfillmentType,
    selectedStore,
    promoCode,
    promoDiscount,
    setFulfillmentType,
    setSelectedStore,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTax,
    getFinalTotal,
    clearCart,
  } = useCartStore();

  const isOrderPlacedRef = useRef(false);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('QRIS');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name && !shippingAddress.recipientName) {
      setShippingAddress((prev) => ({
        ...prev,
        recipientName: user.name,
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user, shippingAddress.recipientName]);

  useEffect(() => {
    if (!user && !token) {
      navigate('/login?redirect=/checkout&reason=order');
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (items.length === 0 && !isOrderPlacedRef.current) {
      navigate('/menu');
    }
  }, [items.length, navigate]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (fulfillmentType === 'DELIVERY') {
      if (!shippingAddress.recipientName.trim()) return 'Nama penerima harus diisi.';
      if (!shippingAddress.phone.trim()) return 'Nomor telepon harus diisi.';
      if (!shippingAddress.street.trim()) return 'Alamat jalan harus diisi.';
      if (!shippingAddress.city.trim()) return 'Kota harus diisi.';
      if (!shippingAddress.province.trim()) return 'Provinsi harus diisi.';
      if (!shippingAddress.postalCode.trim()) return 'Kode pos harus diisi.';
    }
    if (fulfillmentType === 'PICKUP' && !selectedStore) {
      return 'Pilih lokasi toko untuk pickup.';
    }
    if (!paymentMethod) {
      return 'Pilih metode pembayaran terlebih dahulu.';
    }
    return null;
  };

  const handlePlaceOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const storeEntry = STORES.find((entry) => entry.id === selectedStore) || STORES[0];
      const orderPayload = {
        fulfillmentType: fulfillmentType as 'PICKUP' | 'DELIVERY',
        paymentMethod,
        storeLocation:
          fulfillmentType === 'PICKUP'
            ? `${storeEntry.name} — ${storeEntry.address}`
            : undefined,
        shippingAddress:
          fulfillmentType === 'DELIVERY'
            ? {
                recipientName: shippingAddress.recipientName.trim(),
                phone: shippingAddress.phone.trim(),
                street: shippingAddress.street.trim(),
                city: shippingAddress.city.trim(),
                province: shippingAddress.province.trim(),
                postalCode: shippingAddress.postalCode.trim(),
                notes: shippingAddress.notes.trim() || undefined,
              }
            : undefined,
        items: items.map((item) => ({
          productId: item.productId,
          slug: item.product?.slug,
          selectedVariants: item.selectedVariants,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
        })),
        promoCode: promoCode || undefined,
      };

      const response = await createOrder(orderPayload);
      isOrderPlacedRef.current = true;
      clearCart();
      navigate(`/payment/${response.id}?success=1`, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat pesanan. Silakan coba lagi.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const tax = getTax();
  const total = getFinalTotal();
  const selectedPaymentObj = PAYMENT_OPTIONS.find((p) => p.id === paymentMethod) || PAYMENT_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#71351D]/70 mb-2">
            <Link to="/cart" className="hover:text-[#B6370B] transition-colors">
              Keranjang
            </Link>
            <ChevronRight size={14} />
            <span className="text-[#451B0E] font-bold">Checkout & Pembayaran</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#451B0E]">
            Konfirmasi & Metode Pembayaran
          </h1>
          <p className="text-sm text-[#71351D]/80 mt-1">
            Pilih metode pengambilan, alamat tujuan, serta metode pembayaran sebelum menyelesaikan pesanan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Fulfillment Type */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle">
              <h2 className="text-base font-extrabold text-[#451B0E] mb-4">
                1. Metode Pengambilan Pesanan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors cursor-pointer ${
                    fulfillmentType === 'PICKUP'
                      ? 'border-[#B6370B] bg-[#B6370B]/5'
                      : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                  }`}
                >
                  <Store
                    size={20}
                    className={fulfillmentType === 'PICKUP' ? 'text-[#B6370B]' : 'text-[#71351D]/50'}
                  />
                  <div className="text-left">
                    <div
                      className={`font-bold text-sm ${
                        fulfillmentType === 'PICKUP' ? 'text-[#B6370B]' : 'text-[#451B0E]'
                      }`}
                    >
                      Express Pickup
                    </div>
                    <div className="text-xs text-[#71351D]/70">Ambil langsung di gerai (~15 menit)</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-colors cursor-pointer ${
                    fulfillmentType === 'DELIVERY'
                      ? 'border-[#B6370B] bg-[#B6370B]/5'
                      : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                  }`}
                >
                  <MapPin
                    size={20}
                    className={fulfillmentType === 'DELIVERY' ? 'text-[#B6370B]' : 'text-[#71351D]/50'}
                  />
                  <div className="text-left">
                    <div
                      className={`font-bold text-sm ${
                        fulfillmentType === 'DELIVERY' ? 'text-[#B6370B]' : 'text-[#451B0E]'
                      }`}
                    >
                      Courier Delivery
                    </div>
                    <div className="text-xs text-[#71351D]/70">Diantar kurir ke alamat Anda</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Store or Shipping Address */}
            {fulfillmentType === 'PICKUP' ? (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle">
                <h2 className="text-base font-extrabold text-[#451B0E] mb-4">
                  2. Pilih Lokasi Gerai Pickup
                </h2>
                <div className="space-y-3">
                  {STORES.map((store) => {
                    const active = (selectedStore || 'coffeelo-main') === store.id;
                    return (
                      <button
                        key={store.id}
                        type="button"
                        onClick={() => setSelectedStore(store.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-colors cursor-pointer ${
                          active
                            ? 'border-[#B6370B] bg-[#B6370B]/5'
                            : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                              active ? 'border-[#B6370B] bg-[#B6370B]' : 'border-[#E5D4C6]'
                            }`}
                          >
                            {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#451B0E]">{store.name}</div>
                            <div className="text-xs text-[#71351D]/70 mt-0.5">{store.address}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle">
                <h2 className="text-base font-extrabold text-[#451B0E] mb-4">
                  2. Detail Alamat Pengiriman
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.recipientName}
                      onChange={(e) => handleAddressChange('recipientName', e.target.value)}
                      placeholder="Nama lengkap penerima"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Alamat Lengkap / Jalan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="Jl. Contoh No. 123, Gedung / Lantai / Blok"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="Jakarta Selatan"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      placeholder="DKI Jakarta"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      placeholder="12190"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#451B0E] mb-1.5">
                      Catatan Kurir (Opsional)
                    </label>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={(e) => handleAddressChange('notes', e.target.value)}
                      placeholder="Patokan rumah, titip di resepsionis, dll."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 text-[#451B0E] text-sm focus:outline-none focus:border-[#B6370B] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Payment Method Selector */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle space-y-4">
              <div>
                <h2 className="text-base font-extrabold text-[#451B0E]">
                  3. Pilih Metode Pembayaran
                </h2>
                <p className="text-xs text-[#71351D]/75 mt-0.5">
                  Pilih <strong>QRIS</strong> untuk menampilkan barcode pembayaran setelah klik buat pesanan, atau <strong>Cash / Bayar di Tempat</strong> untuk membayar di kasir/kurir.
                </p>
              </div>

              <div className="space-y-2.5">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = paymentMethod === opt.id;
                  const cashSubtitle =
                    opt.id === 'CASH'
                      ? fulfillmentType === 'PICKUP'
                        ? 'Bayar tunai langsung di kasir gerai saat mengambil pesanan'
                        : 'Bayar tunai di tempat (COD) kepada kurir saat pesanan tiba'
                      : opt.subtitle;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-[#B6370B] bg-[#B6370B]/[0.06]'
                          : 'border-[#E5D4C6] hover:border-[#B6370B]/40 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-[#B6370B] text-white'
                              : 'bg-[#F4EDE5] text-[#451B0E]'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-[#451B0E]">
                              {opt.title}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                opt.isCash
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#71351D]/75 mt-0.5">{cashSubtitle}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          isSelected ? 'border-[#B6370B] bg-[#B6370B] text-white' : 'border-[#E5D4C6]'
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={14} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Order Items Review */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-subtle">
              <h2 className="text-base font-extrabold text-[#451B0E] mb-4">
                4. Rincian Item ({items.reduce((acc, i) => acc + i.quantity, 0)} cangkir)
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 pb-4 border-b border-[#E5D4C6]/70 last:border-0 last:pb-0"
                  >
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-[#E5D4C6] shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#F4EDE5] flex items-center justify-center shrink-0 text-[#451B0E]">
                        <Coffee size={22} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#451B0E] text-sm">{item.name}</div>
                      {item.variantName && (
                        <div className="text-xs text-[#71351D]/70 mt-0.5">{item.variantName}</div>
                      )}
                      {item.specialInstructions && (
                        <div className="text-xs text-[#B6370B] mt-0.5 italic">
                          Catatan: "{item.specialInstructions}"
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-[#71351D]/80">
                          {item.quantity} × {formatCurrency(item.price)}
                        </span>
                        <span className="font-extrabold text-[#451B0E] text-sm">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Sticky Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-card lg:sticky lg:top-24 space-y-5">
              <h2 className="text-lg font-black text-[#451B0E] tracking-tight">
                Ringkasan Pembayaran
              </h2>

              {promoCode && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <Tag size={14} className="text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800">{promoCode} aktif</div>
                    <div className="text-xs text-emerald-600">Diskon {promoDiscount}% diterapkan</div>
                  </div>
                </div>
              )}

              {/* Selected Method Summary */}
              <div className="p-3.5 rounded-2xl bg-[#F4EDE5]/70 border border-[#E5D4C6] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#71351D] font-semibold">Metode Bayar:</span>
                  <span className="font-extrabold text-[#451B0E]">{selectedPaymentObj.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71351D] font-semibold">Alur Pembayaran:</span>
                  <span
                    className={`font-bold ${
                      paymentMethod === 'CASH' ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {paymentMethod === 'CASH'
                      ? 'Status Pending (Bayar di Tempat)'
                      : 'Scan Barcode QRIS -> Dikonfirmasi'}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#71351D]/80">Subtotal</span>
                  <span className="text-[#451B0E] font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Diskon ({promoDiscount}%)</span>
                    <span className="text-emerald-700 font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
                {fulfillmentType === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <span className="text-[#71351D]/80">Ongkos Kirim</span>
                    <span className="text-[#451B0E] font-semibold">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">Gratis</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#71351D]/80">Pajak Restoran (10%)</span>
                  <span className="text-[#451B0E] font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-[#E5D4C6] pt-3 flex justify-between items-baseline">
                  <span className="font-extrabold text-[#451B0E]">Total Pembayaran</span>
                  <span className="font-black text-[#B6370B] text-2xl">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-2xl p-3.5">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-[#B6370B] text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-full hover:bg-[#451B0E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-card cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses Pesanan...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={17} />
                    {paymentMethod === 'CASH'
                      ? 'Buat Pesanan (Bayar di Tempat)'
                      : 'Buat Pesanan & Tampilkan QRIS'}
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[#71351D]/65">
                Pesanan yang berhasil dibuat dapat dipantau langsung melalui menu <strong>Riwayat Pesanan</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
