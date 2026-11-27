import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Check, Plus, Minus, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/currency';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem, setIsCartOpen } = useCartStore();
  const { user, openAuthModal } = useAuthStore();
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const variantGroups = React.useMemo(() => {
    if (!product?.variants) return {};
    const groups: Record<string, typeof product.variants> = {};
    for (const v of product.variants) {
      if (!groups[v.name]) groups[v.name] = [];
      groups[v.name].push(v);
    }
    return groups;
  }, [product]);

  useEffect(() => {
    if (product && product.variants) {
      const defaults: Record<string, string> = {};
      for (const [groupName, options] of Object.entries(variantGroups)) {
        if (options.length > 0) {
          defaults[groupName] = options[0].optionValue;
        }
      }
      setSelectedVariants(defaults);
      setQuantity(1);
      setInstructions('');
      setIsAdded(false);
    }
  }, [product, variantGroups]);

  if (!isOpen || !product) return null;

  let currentUnitPrice = Number(product.basePrice);
  if (product.variants) {
    for (const [varName, varVal] of Object.entries(selectedVariants)) {
      const match = product.variants.find((v) => v.name === varName && v.optionValue === varVal);
      if (match) {
        currentUnitPrice += Number(match.priceAdjustment);
      }
    }
  }

  const handleVariantChange = (groupName: string, optionValue: string) => {
    setSelectedVariants((prev) => ({ ...prev, [groupName]: optionValue }));
  };

  const handleAddToCart = () => {
    if (!user) {
      onClose();
      openAuthModal(`/menu/${product.slug}`);
      return;
    }
    addItem(product, selectedVariants, quantity, instructions);
    setIsAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-coffee-dark/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-2xl rounded-4xl border border-coffee-beige shadow-2xl overflow-hidden p-5 sm:p-8 animate-scaleIn">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau produk"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 p-2 rounded-full bg-coffee-cream text-coffee-dark hover:bg-coffee-beige transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image & Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-coffee-cream/40 p-4 border border-coffee-beige/60 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-2xl shadow-sm"
                />
              </div>

              {product.tastingNotes && product.tastingNotes.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-coffee-brown">
                    Catatan Rasa:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tastingNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-coffee-cream text-[11px] font-semibold text-coffee-dark border border-coffee-beige/60"
                      >
                        ✦ {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Customization Form */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-coffee-beige text-coffee-dark">
                    Kopi Spesialti
                  </span>
                  {product.rating && (
                    <span className="flex items-center gap-1 text-xs font-bold text-coffee-dark">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {product.rating} ({product.reviewsCount})
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-coffee-dark tracking-tight">
                  {product.name}
                </h3>
                <p className="text-xl font-extrabold text-coffee-orange mt-1">
                  {formatCurrency(currentUnitPrice * quantity)}
                  {quantity > 1 && (
                    <span className="text-xs text-coffee-brown font-normal ml-2">
                      ({formatCurrency(currentUnitPrice)} per item)
                    </span>
                  )}
                </p>
              </div>

              <p className="text-xs text-coffee-brown leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Variant Selectors */}
              <div className="space-y-3.5 pt-1">
                {Object.entries(variantGroups).map(([groupName, options]) => (
                  <div key={groupName} className="space-y-1.5">
                    <label className="text-xs font-bold text-coffee-dark uppercase tracking-wider">
                      {groupName}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => {
                        const isSelected = selectedVariants[groupName] === opt.optionValue;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleVariantChange(groupName, opt.optionValue)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-coffee-dark text-white shadow-sm'
                                : 'bg-coffee-cream hover:bg-coffee-beige/70 text-coffee-dark border border-coffee-beige/60'
                            }`}
                          >
                            {opt.optionValue}
                            {Number(opt.priceAdjustment) > 0 && (
                              <span className="ml-1 text-[10px] text-coffee-orange font-bold">
                                (+{formatCurrency(Number(opt.priceAdjustment))})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Special Instructions */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-coffee-dark uppercase tracking-wider">
                  Catatan Khusus Barista:
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Contoh: Lebih panas, pisah es, sedikit gula"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-coffee-cream/40 border border-coffee-beige focus:outline-none focus:ring-1 focus:ring-coffee-orange text-coffee-dark"
                />
              </div>

              {/* Quantity & Add Action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <div className="flex items-center justify-between sm:justify-center gap-3 border border-coffee-beige rounded-full px-4 py-2 sm:px-3 sm:py-1.5 bg-coffee-cream/40">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                    className="p-1 hover:text-coffee-orange transition text-coffee-dark cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-xs text-coffee-dark min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Tambah jumlah"
                    className="p-1 hover:text-coffee-orange transition text-coffee-dark cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-card cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-coffee-orange hover:bg-coffee-orange/90 text-white active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ditambahkan!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Tambah ke Keranjang — {formatCurrency(currentUnitPrice * quantity)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
