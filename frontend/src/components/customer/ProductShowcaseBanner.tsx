import React, { useState, useEffect } from 'react';
import { Award, Coffee, Layers, PackageCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/currency';

const ROAST_LABELS: Record<string, string> = {
  Light: 'Ringan',
  Medium: 'Sedang',
  'Medium-Dark': 'Sedang-Gelap',
  Dark: 'Sangrai Gelap',
};

export const ProductShowcaseBanner: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const { addItem, setIsCartOpen } = useCartStore();
  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    let active = true;
    productService
      .getProducts({ isFeatured: true, isAvailable: true })
      .then(async (featured) => {
        if (!active) return;
        if (featured.length > 0) {
          setItems(featured);
          return;
        }
        // Fallback to active catalog if admin has not marked any item as featured yet
        const activeProducts = await productService.getProducts({ isAvailable: true });
        if (active) {
          setItems(activeProducts.slice(0, 4));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section id="showcase" className="py-14 lg:py-16 bg-[#EFE6DD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-coffee-orange animate-spin" />
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const safeIdx = activeIdx < items.length ? activeIdx : 0;
  const current = items[safeIdx];
  const notes =
    current.tastingNotes && current.tastingNotes.length > 0
      ? current.tastingNotes
      : [current.category?.name || 'Biji Spesialti', 'Sangrai Segar', 'Racikan Barista'];
  const roastLabel = (current.roastLevel && ROAST_LABELS[current.roastLevel]) || 'Sedang-Gelap';

  const handleQuickAdd = () => {
    if (!user) {
      openAuthModal(`/menu/${current.slug}`);
      return;
    }

    const defaultVariants: Record<string, string> = {};
    if (current.variants && current.variants.length > 0) {
      const seen = new Set<string>();
      for (const v of current.variants) {
        if (!seen.has(v.name)) {
          defaultVariants[v.name] = v.optionValue;
          seen.add(v.name);
        }
      }
    }

    addItem(current, defaultVariants, 1);
    setIsCartOpen(true);
  };

  return (
    <section id="showcase" className="py-14 lg:py-16 bg-[#EFE6DD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
              Pilihan Kurator Kami
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-coffee-dark tracking-tight mt-1">
              Menu Andalan Coffeelo
            </h2>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap gap-2 py-1">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  safeIdx === idx
                    ? 'bg-coffee-orange text-white shadow-card'
                    : 'bg-white/80 hover:bg-white text-coffee-dark'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-coffee-beige shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Image */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-coffee-cream/40 p-4 flex items-center justify-center">
            <img
              src={current.imageUrl}
              alt={current.name}
              className="w-full h-full object-cover rounded-2xl shadow-subtle hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-6 left-6 bg-coffee-dark/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-coffee-orange" />
              {current.isFeatured ? 'Menu Andalan' : 'Favorit Barista'}
            </div>
          </div>

          {/* Right Column: Flavor Specs & Details */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-coffee-brown">
                {current.category?.name || 'Resep Spesialti'}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
                {current.name}
              </h3>
              <p className="text-sm text-coffee-brown leading-relaxed pt-1">
                {current.description}
              </p>
            </div>

            {/* Tasting Notes Tags */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                Karakter & Racikan:
              </p>
              <div className="flex flex-wrap gap-2">
                {notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-coffee-cream border border-coffee-beige text-xs font-semibold text-coffee-dark"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-coffee-beige/60">
              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <Coffee className="w-3.5 h-3.5 text-coffee-orange" />
                  Tingkat Sangrai
                </div>
                <p className="text-xs font-bold text-coffee-dark">{roastLabel}</p>
              </div>

              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <Layers className="w-3.5 h-3.5 text-coffee-orange" />
                  Kategori
                </div>
                <p className="text-xs font-bold text-coffee-dark">
                  {current.category?.name || 'Racikan Andalan'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <PackageCheck className="w-3.5 h-3.5 text-coffee-orange" />
                  Stok Bar
                </div>
                <p className="text-xs font-bold text-coffee-dark">
                  {current.stock > 0 ? `${current.stock} Cup Tersedia` : 'Stok Habis'}
                </p>
              </div>
            </div>

            {/* Price & Add to Order CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
              <div>
                <p className="text-[11px] uppercase font-bold text-coffee-brown">Harga Mulai</p>
                <p className="text-2xl font-black text-coffee-dark">
                  {formatCurrency(current.basePrice)}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <Link
                  to={`/menu/${current.slug}`}
                  className="inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-coffee-cream hover:bg-coffee-beige/70 text-coffee-dark font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Detail
                </Link>
                <button
                  type="button"
                  disabled={current.stock <= 0 || !current.isAvailable}
                  onClick={handleQuickAdd}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-dark disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-card cursor-pointer"
                >
                  Pesan Resep Ini
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
