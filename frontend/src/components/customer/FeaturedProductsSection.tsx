import React, { useState } from 'react';
import { Search, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Product } from '@/types';

// Curated specialty coffee catalog matching visual reference in Image 3
const FEATURED_COFFEES: Product[] = [
  {
    id: 'prod-cappuccino',
    categoryId: 'cat-espresso',
    name: 'Cappuccino',
    slug: 'cappuccino',
    description: 'Double espresso shot balanced with equal parts steamed milk and thick micro-foam, dusted with artisan cocoa.',
    basePrice: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
    stock: 50,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
    variants: [
      { id: 'v1', productId: 'prod-cappuccino', name: 'Size', optionValue: 'Regular (8oz)', priceAdjustment: 0, stock: 50 },
      { id: 'v2', productId: 'prod-cappuccino', name: 'Size', optionValue: 'Large (12oz)', priceAdjustment: 0.80, stock: 50 },
    ],
  },
  {
    id: 'prod-latte-macchiato',
    categoryId: 'cat-milk',
    name: 'Latte Macchiato',
    slug: 'latte-macchiato',
    description: 'Steamed whole milk stained with a slow pour of bold espresso creating three distinct, gorgeous layers.',
    basePrice: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=600&auto=format&fit=crop',
    stock: 45,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'prod-americano',
    categoryId: 'cat-espresso',
    name: 'Americano',
    slug: 'americano',
    description: 'Double shot of rich espresso topped with piping hot filtered water for a clean, bold coffee experience.',
    basePrice: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    stock: 60,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'prod-caramel-mocha',
    categoryId: 'cat-signature',
    name: 'Caramel Mocha Bliss',
    slug: 'caramel-mocha-bliss',
    description: 'Rich dark Belgian chocolate combined with espresso, house-made salted caramel drizzle, and whipped cream.',
    basePrice: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=600&auto=format&fit=crop',
    stock: 40,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'prod-raf-coffee',
    categoryId: 'cat-signature',
    name: 'Vanilla Raf Coffee',
    slug: 'vanilla-raf-coffee',
    description: 'Classic European specialty: single shot espresso steamed together with vanilla bean syrup and velvety cream.',
    basePrice: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    stock: 35,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
  },
  {
    id: 'prod-frappuccino',
    categoryId: 'cat-cold',
    name: 'Frappuccino Crunch',
    slug: 'frappuccino-crunch',
    description: 'Blended espresso with crushed ice, dark chocolate mocha chips, hazelnut swirl, and mountain of whipped cream.',
    basePrice: 5.00,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop',
    stock: 30,
    isAvailable: true,
    isFeatured: true,
    createdAt: '2026-01-01',
  },
];

export const FeaturedProductsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const { addItem, setIsCartOpen } = useCartStore();

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'cat-espresso', label: 'Espresso' },
    { id: 'cat-milk', label: 'Milk Coffee' },
    { id: 'cat-signature', label: 'Signature' },
    { id: 'cat-cold', label: 'Cold Brew & Frappé' },
  ];

  const filteredCoffees = FEATURED_COFFEES.filter((coffee) => {
    const matchesCategory = selectedCategory === 'all' || coffee.categoryId === selectedCategory;
    const matchesSearch = coffee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          coffee.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOrder = (coffee: Product) => {
    addItem(coffee, { Size: 'Regular' }, 1);
    
    // Quick success flash state
    setAddedItemIds((prev) => ({ ...prev, [coffee.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [coffee.id]: false }));
    }, 1500);

    // Open cart drawer so user sees instant feedback
    setIsCartOpen(true);
  };

  return (
    <section id="collection" className="py-24 bg-coffee-cream border-t border-coffee-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coffee-orange">
              <Sparkles className="w-3.5 h-3.5" />
              Specialty Lineup
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-coffee-dark tracking-tight">
              Our Coffee
            </h2>
            <p className="text-sm text-coffee-brown max-w-md">
              Dipilih dari biji kopi pilihan, diracik dengan presisi barista profesional setiap hari.
            </p>
          </div>

          {/* Search Bar matching Image 3 */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-coffee-brown absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your fav coffee..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/90 border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-2 focus:ring-coffee-orange/40 focus:border-coffee-orange transition shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-coffee-dark text-white shadow-card scale-105'
                  : 'bg-white/80 hover:bg-white text-coffee-dark border border-coffee-beige'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 6-Item Grid matching reference in Image 3 */}
        {filteredCoffees.length === 0 ? (
          <div className="text-center py-16 bg-white/40 rounded-3xl border border-coffee-beige">
            <p className="text-sm font-bold text-coffee-dark">No coffee matches your search.</p>
            <p className="text-xs text-coffee-brown mt-1">Try another keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCoffees.map((coffee) => {
              const isAdded = addedItemIds[coffee.id];
              return (
                <div
                  key={coffee.id}
                  className="group relative rounded-4xl bg-[#DFD0C3] p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-elevation hover:-translate-y-1 border border-coffee-beige/60"
                >
                  {/* Product Cup Image Container */}
                  <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/40 flex items-center justify-center p-4 mb-5 relative">
                    <img
                      src={coffee.imageUrl}
                      alt={coffee.name}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-wider text-coffee-dark">
                      Fresh Brew
                    </span>
                  </div>

                  {/* Title and Price Row */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-extrabold text-lg sm:text-xl text-coffee-dark group-hover:text-coffee-orange transition-colors">
                        {coffee.name}
                      </h3>
                      <span className="font-extrabold text-lg text-coffee-dark">
                        ${coffee.basePrice.toFixed(0)}$
                      </span>
                    </div>
                    <p className="text-xs text-coffee-dark/70 line-clamp-2 leading-relaxed">
                      {coffee.description}
                    </p>
                  </div>

                  {/* Centered Order Pill Button matching Image 3 */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleOrder(coffee)}
                      className={`w-full sm:w-auto px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/80 hover:bg-white text-coffee-dark hover:text-coffee-orange hover:shadow-card active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added to Basket
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5 text-coffee-orange" />
                          Order
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
