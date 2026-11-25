import React, { useState } from 'react';
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

export const CartPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    orderType,
    setOrderType,
    storeLocation,
    setStoreLocation,
    deliveryAddress,
    setDeliveryAddress,
    deliveryNotes,
    setDeliveryNotes,
    promoCode,
    discountPercent,
    applyPromo,
    removePromo,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTaxAmount,
    getFinalTotal,
  } = useCartStore();

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
            <h1 className="text-3xl font-black text-coffee-dark tracking-tight">Your Cart is Empty</h1>
            <p className="text-sm text-coffee-brown max-w-md mx-auto">
              Cangkir Anda masih kosong. Jelajahi menu specialty coffee pilihan kami dan tambahkan minuman favorit Anda.
            </p>
          </div>
          <div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-bold text-xs uppercase tracking-wider transition shadow-card active:scale-95"
            >
              <Coffee className="w-4 h-4" />
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 bg-coffee-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <div className="mb-8 space-y-2">
          <nav className="flex items-center gap-2 text-xs text-coffee-brown">
            <Link to="/" className="hover:text-coffee-orange transition">Home</Link>
            <span>/</span>
            <span className="font-bold text-coffee-dark">Your Cart</span>
          </nav>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
              Order Review
            </h1>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-coffee-brown hover:text-rose-600 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items & Fulfillment Options (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Fulfillment Mode Toggle (Pickup vs Delivery) */}
            <div className="bg-white rounded-3xl p-5 border border-coffee-beige shadow-subtle space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-coffee-dark block">
                Fulfillment Preference:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('PICKUP')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    orderType === 'PICKUP'
                      ? 'bg-coffee-dark text-white shadow-sm'
                      : 'bg-coffee-cream/60 hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Express Pickup
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`flex items-center justify-center gap-2.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    orderType === 'DELIVERY'
                      ? 'bg-coffee-dark text-white shadow-sm'
                      : 'bg-coffee-cream/60 hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Courier Delivery
                </button>
              </div>

              {/* Pickup location options */}
              {orderType === 'PICKUP' ? (
                <div className="p-4 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/80 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-coffee-dark font-bold">
                    <Clock className="w-4 h-4 text-coffee-orange" />
                    <span>Estimated Ready: ~15 mins from order confirmation</span>
                  </div>
                  <label className="block text-[11px] font-bold text-coffee-brown uppercase mt-2">
                    Pickup Store Location:
                  </label>
                  <select
                    value={storeLocation}
                    onChange={(e) => setStoreLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark font-semibold focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  >
                    <option value="Senopati Flagship House (Jl. Senopati No. 88)">
                      Senopati Flagship House (Jl. Senopati No. 88, Jaksel)
                    </option>
                    <option value="Lisbon Heritage Store (Rua dos Sapateiros, 111)">
                      Lisbon Heritage Store (Rua dos Sapateiros, 111)
                    </option>
                  </select>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/80 text-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-coffee-dark font-semibold">
                    <span>Delivery Address</span>
                    <span className="text-[11px] text-coffee-orange font-bold">
                      {subtotal >= 25 ? 'FREE Delivery Eligible' : 'Standard Fee: $2.50'}
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter full delivery address (Street, Unit / Floor, City, Postal Code)"
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  />
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Delivery notes (e.g. Leave with security / lobby)"
                    className="w-full p-2.5 rounded-xl bg-white border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-1 focus:ring-coffee-orange"
                  />
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-coffee-beige shadow-subtle divide-y divide-coffee-beige/60">
              {items.map((item) => (
                <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex gap-3 sm:gap-6 items-start">
                  {/* Thumbnail */}
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl bg-coffee-cream/40 p-1 border border-coffee-beige/60 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between">
                      <Link
                        to={`/menu/${item.product.slug}`}
                        className="font-extrabold text-base text-coffee-dark hover:text-coffee-orange transition truncate"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-coffee-brown/50 hover:text-rose-600 transition p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Selected Variants */}
                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <p className="text-xs text-coffee-brown">
                        {Object.entries(item.selectedVariants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[11px] text-coffee-orange italic">
                        Note: "{item.specialInstructions}"
                      </p>
                    )}

                    {/* Price and Quantity row */}
                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center gap-3 border border-coffee-beige rounded-full px-3 py-1 bg-coffee-cream/40">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="hover:text-coffee-orange transition text-coffee-dark"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-extrabold text-xs text-coffee-dark min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="hover:text-coffee-orange transition text-coffee-dark"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-coffee-orange">
                          ${item.subtotal.toFixed(2)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="block text-[10px] text-coffee-brown">
                            ${item.unitPrice.toFixed(2)} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <div>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-xs font-bold text-coffee-brown hover:text-coffee-dark transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Add more items from menu
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Card (Col 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-coffee-beige shadow-card space-y-6">
              <h3 className="font-black text-xl text-coffee-dark tracking-tight">
                Order Summary
              </h3>

              {/* Promo Coupon Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                  Promo / Voucher Code:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Tag className="w-3.5 h-3.5 text-coffee-brown absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. COFFEELO10"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase rounded-xl bg-coffee-cream/40 border border-coffee-beige focus:outline-none focus:ring-1 focus:ring-coffee-orange text-coffee-dark font-mono font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-coffee-dark text-white text-xs font-bold hover:bg-coffee-dark/90 transition shadow-sm"
                  >
                    Apply
                  </button>
                </div>

                {/* Promo status notice */}
                {promoMessage && (
                  <p
                    className={`text-xs font-medium ${
                      promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}

                {promoCode && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{promoCode} ({discountPercent}% OFF)</span>
                    </div>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-3 border-t border-coffee-beige/60 text-xs">
                <div className="flex justify-between text-coffee-brown">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-bold text-coffee-dark">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-coffee-brown">
                  <span>
                    Fulfillment ({orderType === 'PICKUP' ? 'Pickup' : 'Courier'})
                  </span>
                  <span className="font-bold text-coffee-dark">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `$${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-coffee-brown">
                  <span>Government Tax (10% PB1)</span>
                  <span className="font-bold text-coffee-dark">${tax.toFixed(2)}</span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-baseline pt-4 border-t border-coffee-beige text-coffee-dark">
                  <div>
                    <span className="font-black text-base">Total Amount</span>
                    <span className="block text-[10px] text-coffee-brown">
                      Includes tax and fulfillment fees
                    </span>
                  </div>
                  <span className="text-2xl font-black text-coffee-orange">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              {user ? (
                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-coffee-orange hover:bg-coffee-orange/95 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-card hover:shadow-elevation active:scale-95"
                >
                  Proceed to Checkout
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

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-around border-t border-coffee-beige/60 text-[10px] text-coffee-brown font-semibold">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-coffee-orange" />
                  <span>Freshly Roasted</span>
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
