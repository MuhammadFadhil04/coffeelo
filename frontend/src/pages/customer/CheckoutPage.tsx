import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, MapPin, Store, ChevronRight, AlertCircle, Loader2, Tag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { createOrder } from '@/services/orderService';
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
  { id: 'coffeelo-kemang', name: 'Coffeelo Kemang', address: 'Jl. Kemang Raya No. 8, Jakarta Selatan' },
  { id: 'coffeelo-pik', name: 'Coffeelo PIK Avenue', address: 'PIK Avenue Mall Lt. 1, Jakarta Utara' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
  }, [items, navigate]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
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
      const orderPayload = {
        fulfillmentType: fulfillmentType as 'PICKUP' | 'DELIVERY',
        storeLocation: fulfillmentType === 'PICKUP'
          ? (() => {
              const store = STORES.find((entry) => entry.id === selectedStore);
              return store ? `${store.name} — ${store.address}` : undefined;
            })()
          : undefined,
        shippingAddress: fulfillmentType === 'DELIVERY' ? {
          recipientName: shippingAddress.recipientName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          province: shippingAddress.province,
          postalCode: shippingAddress.postalCode,
          notes: shippingAddress.notes || undefined,
        } : undefined,
        items: items.map(item => ({
          productId: item.productId,
          selectedVariants: item.selectedVariants,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions || undefined,
        })),
        promoCode: promoCode || undefined,
      };

      const response = await createOrder(orderPayload);
      clearCart();
      navigate(`/payment/${response.id}`);
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

  return (
    <div className="min-h-screen bg-[#F4EDE5] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#71351D]/60 mb-2">
            <Link to="/cart" className="hover:text-[#B6370B] transition-colors">Keranjang</Link>
            <ChevronRight size={14} />
            <span className="text-[#451B0E] font-medium">Checkout</span>
          </div>
          <h1 className="text-3xl font-bold text-[#451B0E]">Konfirmasi Pesanan</h1>
          <p className="text-[#71351D]/70 mt-1">Periksa detail pesanan sebelum melanjutkan pembayaran.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column — Fulfillment & Address */}
          <div className="lg:col-span-2 space-y-6">

            {/* Fulfillment Type */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card">
              <h2 className="text-lg font-bold text-[#451B0E] mb-4">Metode Pengiriman</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setFulfillmentType('PICKUP')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    fulfillmentType === 'PICKUP'
                      ? 'border-[#B6370B] bg-[#B6370B]/5'
                      : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                  }`}
                >
                  <Store size={20} className={fulfillmentType === 'PICKUP' ? 'text-[#B6370B]' : 'text-[#71351D]/50'} />
                  <div className="text-left">
                    <div className={`font-semibold text-sm ${fulfillmentType === 'PICKUP' ? 'text-[#B6370B]' : 'text-[#451B0E]'}`}>
                      Pickup
                    </div>
                    <div className="text-xs text-[#71351D]/60">Ambil di toko</div>
                  </div>
                </button>
                <button
                  onClick={() => setFulfillmentType('DELIVERY')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    fulfillmentType === 'DELIVERY'
                      ? 'border-[#B6370B] bg-[#B6370B]/5'
                      : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                  }`}
                >
                  <MapPin size={20} className={fulfillmentType === 'DELIVERY' ? 'text-[#B6370B]' : 'text-[#71351D]/50'} />
                  <div className="text-left">
                    <div className={`font-semibold text-sm ${fulfillmentType === 'DELIVERY' ? 'text-[#B6370B]' : 'text-[#451B0E]'}`}>
                      Delivery
                    </div>
                    <div className="text-xs text-[#71351D]/60">Diantar ke alamat</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Pickup — Store Selector */}
            {fulfillmentType === 'PICKUP' && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-[#451B0E] mb-4">Pilih Lokasi Toko</h2>
                <div className="space-y-3">
                  {STORES.map(store => (
                    <button
                      key={store.id}
                      onClick={() => setSelectedStore(store.id)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedStore === store.id
                          ? 'border-[#B6370B] bg-[#B6370B]/5'
                          : 'border-[#E5D4C6] hover:border-[#B6370B]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                          selectedStore === store.id ? 'border-[#B6370B] bg-[#B6370B]' : 'border-[#E5D4C6]'
                        }`} />
                        <div>
                          <div className="font-semibold text-sm text-[#451B0E]">{store.name}</div>
                          <div className="text-xs text-[#71351D]/60 mt-0.5">{store.address}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery — Shipping Address */}
            {fulfillmentType === 'DELIVERY' && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-[#451B0E] mb-4">Alamat Pengiriman</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.recipientName}
                      onChange={e => handleAddressChange('recipientName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={e => handleAddressChange('phone', e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Jalan / Nomor Rumah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={e => handleAddressChange('street', e.target.value)}
                      placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Kota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={e => handleAddressChange('city', e.target.value)}
                      placeholder="Jakarta"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.province}
                      onChange={e => handleAddressChange('province', e.target.value)}
                      placeholder="DKI Jakarta"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={e => handleAddressChange('postalCode', e.target.value)}
                      placeholder="10110"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#451B0E] mb-1.5">Catatan (opsional)</label>
                    <textarea
                      value={shippingAddress.notes}
                      onChange={e => handleAddressChange('notes', e.target.value)}
                      placeholder="Patokan, instruksi tambahan untuk kurir..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/50 text-[#451B0E] placeholder-[#71351D]/40 focus:outline-none focus:border-[#B6370B] focus:ring-2 focus:ring-[#B6370B]/20 transition-all text-sm resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-lg font-bold text-[#451B0E] mb-4">
                Item Pesanan ({items.length} produk)
              </h2>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-[#E5D4C6] last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl bg-[#F4EDE5] flex items-center justify-center flex-shrink-0 text-2xl">
                      ☕
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[#451B0E] text-sm">{item.name}</div>
                      {item.variantName && (
                        <div className="text-xs text-[#71351D]/60 mt-0.5">{item.variantName}</div>
                      )}
                      {item.specialInstructions && (
                        <div className="text-xs text-[#B6370B]/70 mt-0.5 italic">"{item.specialInstructions}"</div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#71351D]/60">x{item.quantity}</span>
                        <span className="font-bold text-[#451B0E] text-sm">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card sticky top-24">
              <h2 className="text-lg font-bold text-[#451B0E] mb-5">Ringkasan Pesanan</h2>

              {/* Promo Badge */}
              {promoCode && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
                  <Tag size={14} className="text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-green-700">{promoCode} aktif</div>
                    <div className="text-xs text-green-600">Diskon {promoDiscount}% diterapkan</div>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#71351D]/70">Subtotal</span>
                  <span className="text-[#451B0E] font-medium">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Diskon ({promoDiscount}%)</span>
                    <span className="text-green-600 font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}
                {fulfillmentType === 'DELIVERY' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#71351D]/70">Ongkos Kirim</span>
                    <span className="text-[#451B0E] font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#71351D]/70">PPN 10%</span>
                  <span className="text-[#451B0E] font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-[#E5D4C6] pt-3 flex justify-between">
                  <span className="font-bold text-[#451B0E]">Total</span>
                  <span className="font-bold text-[#B6370B] text-lg">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-5 bg-[#B6370B] text-white font-bold py-4 rounded-xl hover:bg-[#71351D] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    Buat Pesanan
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#71351D]/50 mt-3">
                Dengan menekan tombol di atas, kamu menyetujui syarat & ketentuan Coffeelo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
