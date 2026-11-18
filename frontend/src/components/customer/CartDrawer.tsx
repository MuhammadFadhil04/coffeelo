import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, getTotalPrice, getTotalCount } = useCartStore();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-coffee-dark/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-coffee-cream border-l border-coffee-beige flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-coffee-beige bg-white/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-coffee-orange" />
              <h2 className="text-lg font-bold text-coffee-dark">Your Basket</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-coffee-beige text-coffee-dark">
                {getTotalCount()}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-coffee-beige/60 text-coffee-brown transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-coffee-beige/60 flex items-center justify-center text-coffee-brown">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-coffee-dark">Your basket is empty</p>
                  <p className="text-xs text-coffee-brown max-w-xs">
                    Explore our curated specialty coffees and add your favorites to get started.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-coffee-orange text-white text-xs font-bold hover:bg-coffee-orange/90 transition shadow-sm"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-white border border-coffee-beige shadow-sm"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-18 h-18 object-contain rounded-xl bg-coffee-cream/40 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-coffee-dark truncate">{item.product.name}</h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-coffee-brown/50 hover:text-rose-600 transition ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <p className="text-[11px] text-coffee-brown mt-0.5">
                        {Object.entries(item.selectedVariants)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-sm text-coffee-orange">
                        ${item.unitPrice.toFixed(2)}
                      </span>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 border border-coffee-beige rounded-full px-2 py-0.5 bg-coffee-cream/30">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-coffee-dark hover:text-coffee-orange transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-coffee-dark min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-coffee-dark hover:text-coffee-orange transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="border-t border-coffee-beige p-6 bg-white space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-coffee-brown text-xs">
                  <span>Subtotal</span>
                  <span className="font-semibold text-coffee-dark">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-coffee-brown text-xs">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-coffee-dark">$0.00</span>
                </div>
                <div className="flex justify-between text-coffee-dark font-extrabold text-base pt-2 border-t border-coffee-beige">
                  <span>Total</span>
                  <span className="text-coffee-orange">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/95 text-white font-bold text-sm transition shadow-card"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
