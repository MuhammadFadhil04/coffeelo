import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { Category, Product } from '@/types';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/utils/currency';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'Semua Menu', slug: 'all' },
];

export const FeaturedProductsSection: React.FC = () => {
  const [coffees, setCoffees] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const timersRef = useRef<number[]>([]);
  const { addItem, setIsCartOpen } = useCartStore();
  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    let active = true;
    Promise.all([
      productService.getProducts({ isAvailable: true }),
      productService.getCategories(),
    ])
      .then(([productsData, categoriesData]) => {
        if (!active) return;
        setCoffees(productsData);
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const filteredCoffees = coffees.filter((coffee) => {
    const activeCatObj = categories.find((c) => c.id === selectedCategory);
    const matchesCategory =
      selectedCategory === 'all' ||
      coffee.categoryId === selectedCategory ||
      coffee.category?.id === selectedCategory ||
      (activeCatObj ? coffee.category?.slug === activeCatObj.slug : false);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      coffee.name.toLowerCase().includes(q) ||
      coffee.description.toLowerCase().includes(q);
    return coffee.isAvailable !== false && matchesCategory && matchesSearch;
  });

  const handleOrder = (coffee: Product) => {
    if (!user) {
      openAuthModal(`/menu/${coffee.slug}`);
      return;
    }

    const defaultVariants: Record<string, string> = {};
    if (coffee.variants && coffee.variants.length > 0) {
      const seen = new Set<string>();
      for (const v of coffee.variants) {
        if (!seen.has(v.name)) {
          defaultVariants[v.name] = v.optionValue;
          seen.add(v.name);
        }
      }
    }

    addItem(coffee, defaultVariants, 1);

    setAddedItemIds((prev) => ({ ...prev, [coffee.id]: true }));
    const timer = window.setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [coffee.id]: false }));
    }, 1500);
    timersRef.current.push(timer);

    setIsCartOpen(true);
  };

  return (
    <section id="collection" className="py-12 lg:py-16 bg-coffee-cream border-t border-coffee-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row: Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coffee-orange">
              <Sparkles className="w-3.5 h-3.5" />
              Jajaran Menu Spesialti
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-coffee-dark tracking-tight">
              Menu Kopi Kami
            </h2>
            <p className="text-sm text-coffee-brown max-w-md">
              Dipilih dari biji kopi terbaik dan diracik dengan presisi barista profesional setiap hari.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-coffee-brown absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kopi favorit Anda..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/90 border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-2 focus:ring-coffee-orange/40 focus:border-coffee-orange transition shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center justify-between gap-4 mb-7">
          <div className="flex flex-wrap items-center gap-2.5 py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-coffee-dark text-white shadow-card'
                    : 'bg-white/85 hover:bg-white text-coffee-dark border border-coffee-beige'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Link
            to="/menu"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-coffee-orange hover:text-coffee-dark transition-colors shrink-0"
          >
            Lihat Semua Menu
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-coffee-orange animate-spin" />
          </div>
        ) : filteredCoffees.length === 0 ? (
          <div className="text-center py-14 bg-white/50 rounded-3xl border border-coffee-beige">
            <p className="text-sm font-bold text-coffee-dark">Tidak ada kopi yang cocok dengan pencarian Anda.</p>
            <p className="text-xs text-coffee-brown mt-1">Coba kata kunci atau kategori lainnya.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoffees.slice(0, 12).map((coffee) => {
              const isAdded = addedItemIds[coffee.id];
              return (
                <div
                  key={coffee.id}
                  className="group relative rounded-3xl bg-[#DFD0C3] p-5 flex flex-col justify-between transition-shadow duration-300 hover:shadow-elevation border border-coffee-beige/70"
                >
                  <div>
                    <Link
                      to={`/menu/${coffee.slug}`}
                      className="block w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/40 p-3 mb-4 relative"
                    >
                      <img
                        src={coffee.imageUrl}
                        alt={coffee.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                      />
                      <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider text-coffee-dark">
                        Segar Diseduh
                      </span>
                    </Link>

                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link
                          to={`/menu/${coffee.slug}`}
                          className="font-extrabold text-lg text-coffee-dark group-hover:text-coffee-orange transition-colors"
                        >
                          {coffee.name}
                        </Link>
                        <span className="font-black text-lg text-coffee-dark shrink-0">
                          {formatCurrency(coffee.basePrice)}
                        </span>
                      </div>
                      <p className="text-xs text-coffee-dark/75 line-clamp-2 leading-relaxed">
                        {coffee.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/menu/${coffee.slug}`}
                      className="px-4 py-2.5 rounded-full bg-white/60 hover:bg-white text-coffee-dark text-xs font-bold transition-colors border border-white/60"
                    >
                      Detail
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOrder(coffee)}
                      className={`flex-1 px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-coffee-dark hover:bg-coffee-orange text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Ditambahkan
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-coffee-orange group-hover:text-white transition-colors" />
                          Pesan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
