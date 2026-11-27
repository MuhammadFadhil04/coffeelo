import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Store,
  Truck,
  ShieldCheck,
  Coffee,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/currency';

export const CartPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    selectedStore,
    setSelectedStore,
    deliveryAddress,
    setDeliveryAddress,
    deliveryNotes,
    setDeliveryNotes,
    promoCode,
    discountPercent,
    applyPromo,
    removePromo,
    deliveryFeeFlat,
    taxPercentage,
    loadStoreSettings,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTaxAmount,
    getFinalTotal,
  } = useCartStore();

  useEffect(() => {
    loadStoreSettings();
  }, [loadStoreSettings]);

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const tax = getTaxAmount();
  const finalTotal = getFinalTotal();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 bg-coffee-cream min-h-screen">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center text-coffee-brown border border-coffee-beige shadow-card">
            <ShoppingBag className="w-10 h-10 opacity-60 text-coffee-orange" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-coffee-dark tracking-tight">Keranjang Anda Kosong</h1>
            <p className="text-sm text-coffee-brown max-w-md mx-auto">
              Cangkir Anda masih kosong. Jelajahi menu kopi spesialti pilihan kami dan tambahkan minuman favorit Anda.
            </p>
          </div>
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-bold text-xs uppercase tracking-wider transition shadow-card active:scale-95"
            >
              <Coffee className="w-4 h-4" />
              Jelajahi Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-coffee-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2">
          <nav className="flex items-center gap-2 text-xs text-coffee-brown">
            <Link to="/" className="hover:text-coffee-orange transition">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-bold text-coffee-dark">Keranjang Anda</span>
          </nav>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
              Tinjau Pesanan
            </h1>
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold text-coffee-brown hover:text-rose-600 transition cursor-pointer"
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-coffee-beige shadow-subtle space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-coffee-dark block">
                Pilihan Pengambilan:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'PICKUP'
                      ? 'bg-coffee-dark text-white shadow-sm'
                      : 'bg-coffee-cream/60 hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Ambil di Gerai
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'DELIVERY'
                      ? 'bg-coffee-dark text-white shadow-sm'
                      : 'bg-coffee-cream/60 hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Kirim Kurir
                </button>
              </div>

              {orderType === 'PICKUP' ? (
                <div className="p-4 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/80 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-coffee-dark font-bold">
                    <Clock className="w-4 h-4 text-coffee-orange" />
                    <span>Estimasi siap: ~15 menit setelah pesanan dikonfirmasi</span>
                  </div>
                  <label className="block text-[11px] font-bold text-coffee-brown uppercase mt-2">
                    Lokasi Gerai Pengambilan:
                  </label>
                  <select
                    value={selectedStore || 'coffeelo-main'}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark font-semibold focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  >
                    <option value="coffeelo-main">
                      Coffeelo Utama — Sudirman (Jl. Jend. Sudirman No. 52)
                    </option>
                    <option value="coffeelo-senopati">
                      Coffeelo Utama — Senopati (Jl. Senopati No. 88)
                    </option>
                    <option value="coffeelo-pik">
                      Coffeelo PIK Avenue (PIK Avenue Mall Lt. 1)
                    </option>
                  </select>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/80 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-coffee-dark font-semibold">
                    <span>Alamat Pengiriman</span>
                    <span className="text-[11px] text-coffee-orange font-bold">
                      {subtotal >= 150000 ? 'Gratis Ongkos Kirim' : `Ongkos Kirim Standar: ${formatCurrency(deliveryFeeFlat)}`}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Masukkan alamat lengkap (Jalan, Nomor/Lantai, Kota, Kode Pos)"
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  />
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Catatan pengiriman (contoh: Titip di resepsionis / satpam)"
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-coffee-beige shadow-subtle divide-y divide-coffee-beige/60">
              {items.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex gap-3 sm:gap-6 items-start">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-coffee-cream/40 p-1 border border-coffee-beige/60 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/menu/${item.product.slug}`}
                        className="font-extrabold text-base text-coffee-dark hover:text-coffee-orange transition truncate"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-coffee-brown/50 hover:text-rose-600 transition p-1 cursor-pointer"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <p className="text-xs text-coffee-brown">
                        {Object.entries(item.selectedVariants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] text-coffee-orange italic">
                        Catatan: "{item.specialInstructions}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 border border-coffee-beige rounded-full px-3 py-1 bg-coffee-cream/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Kurangi jumlah"
                          className="hover:text-coffee-orange transition text-coffee-dark cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs text-coffee-dark min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Tambah jumlah"
                          className="hover:text-coffee-orange transition text-coffee-dark cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-coffee-orange">
                          {formatCurrency(item.subtotal)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-coffee-brown">
                            {formatCurrency(item.unitPrice)} per item
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-xs font-bold text-coffee-brown hover:text-coffee-dark transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Tambah menu lainnya
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-coffee-beige shadow-card space-y-6">
              <h3 className="font-black text-xl text-coffee-dark tracking-tight">Ringkasan Pesanan</h3>

              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                  Kode Promo / Voucher:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Tag className="w-3.5 h-3.5 text-coffee-brown absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Contoh: COFFEELO10"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase rounded-xl bg-coffee-cream/40 border border-coffee-beige focus:outline-none focus:ring-1 focus:ring-coffee-orange text-coffee-dark font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-coffee-dark text-white text-xs font-bold hover:bg-coffee-dark/90 transition shadow-sm cursor-pointer"
                  >
                    Pakai
                  </button>
                </div>

                {promoMessage && (
                  <p className={`text-xs font-medium ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {promoMessage.text}
                  </p>
                )}

                {promoCode && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {promoCode} (Diskon {discountPercent}%)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </form>

              <div className="space-y-3 pt-3 border-t border-coffee-beige/60 text-xs">
                <div className="flex justify-between text-coffee-brown">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                  <span className="font-bold text-coffee-dark">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-coffee-brown">
                  <span>Layanan ({orderType === 'PICKUP' ? 'Ambil di Gerai' : 'Kirim Kurir'})</span>
                  <span className="font-bold text-coffee-dark">
                    {deliveryFee === 0 ? <span className="text-emerald-600">GRATIS</span> : formatCurrency(deliveryFee)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Diskon ({discountPercent}%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-coffee-brown">
                  <span>Pajak Restoran ({taxPercentage}% PB1)</span>
                  <span className="font-bold text-coffee-dark">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-coffee-beige text-coffee-dark">
                  <div>
                    <span className="font-black text-base">Total Pembayaran</span>
                    <span className="block text-[10px] text-coffee-brown">Termasuk pajak & biaya layanan</span>
                  </div>
                  <span className="text-2xl font-black text-coffee-orange">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              {user ? (
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-coffee-orange hover:bg-coffee-orange/95 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-card hover:shadow-elevation active:scale-95"
                >
                  Lanjut ke Pembayaran
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="space-y-2.5 p-4 rounded-2xl bg-coffee-cream/70 border border-coffee-beige text-center">
                  <p className="text-xs font-semibold text-coffee-dark">
                    Masuk ke akun Anda terlebih dahulu untuk melanjutkan pemesanan.
                  </p>
                  <Link
                    to="/login?redirect=%2Fcheckout&reason=order"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/95 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-card"
                  >
                    Masuk ke Akun
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/register?redirect=%2Fcheckout&reason=order"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-coffee-dark hover:bg-coffee-brown text-white font-extrabold text-xs uppercase tracking-wider transition"
                  >
                    Buat Akun Baru
                  </Link>
                </div>
              )}

              <div className="pt-2 flex items-center justify-around border-t border-coffee-beige/60 text-[10px] text-coffee-brown font-semibold">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transaksi Aman</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-coffee-orange" />
                  <span>Disangrai Segar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
