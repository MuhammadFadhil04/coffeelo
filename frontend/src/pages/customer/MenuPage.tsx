import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingBag, X, Coffee, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Category } from '@/types';
import { productService } from '@/services/productService';
import { QuickViewModal } from '@/components/customer/QuickViewModal';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/currency';

export const MenuPage: React.FC = () => {
  const { user, openAuthModal } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoast, setSelectedRoast] = useState<string>('all');
  const [selectedTemp, setSelectedTemp] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    productService
      .getProducts({
        categoryId: selectedCategory,
        searchQuery,
        roastLevel: selectedRoast,
        temperature: selectedTemp,
        sortBy,
      })
      .then(setProducts);
  }, [selectedCategory, searchQuery, selectedRoast, selectedTemp, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedRoast('all');
    setSelectedTemp('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    selectedRoast !== 'all' ||
    selectedTemp !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="pt-24 pb-20 bg-coffee-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header Banner */}
        <div className="mb-8 space-y-3">
          <nav className="flex items-center gap-2 text-xs text-coffee-brown">
            <Link to="/" className="hover:text-coffee-orange transition">
              Beranda
            </Link>
            <span>/</span>
            <span className="font-bold text-coffee-dark">Menu Kopi Spesialti</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coffee-orange mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Diracik Segar Setiap Hari
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-coffee-dark tracking-tight">
                Katalog Menu Kopi
              </h1>
            </div>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-coffee-beige shadow-subtle mb-8 space-y-4">
          {/* Search and Sort Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-coffee-brown absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kopi berdasarkan nama, daerah asal, atau catatan rasa..."
                className="w-full pl-11 pr-10 py-3 rounded-full bg-coffee-cream/40 border border-coffee-beige text-xs text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-coffee-brown hover:text-coffee-dark cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="sm:col-span-4 flex items-center justify-end gap-2">
              <span className="text-xs font-bold text-coffee-dark shrink-0">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-coffee-cream/40 border border-coffee-beige text-xs font-semibold text-coffee-dark focus:outline-none focus:ring-2 focus:ring-coffee-orange/40 cursor-pointer"
              >
                <option value="featured">Unggulan / Terlaris</option>
                <option value="price-asc">Harga: Terendah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Terendah</option>
                <option value="name-asc">Alfabet (A - Z)</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 pb-1 pt-2 border-t border-coffee-beige/60">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-coffee-dark text-white shadow-sm'
                    : 'bg-coffee-cream/60 hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Roast & Temperature */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-medium border-t border-coffee-beige/40">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-coffee-dark">Sangrai:</span>
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'Light', label: 'Ringan' },
                  { value: 'Medium', label: 'Sedang' },
                  { value: 'Medium-Dark', label: 'Sedang-Gelap' },
                  { value: 'Dark', label: 'Gelap' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRoast(r.value)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                      selectedRoast === r.value
                        ? 'bg-coffee-orange text-white'
                        : 'text-coffee-dark hover:bg-coffee-cream'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-coffee-dark">Suhu:</span>
                {[
                  { value: 'all', label: 'Semua' },
                  { value: 'Hot', label: 'Panas' },
                  { value: 'Iced', label: 'Dingin' },
                ].map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSelectedTemp(t.value)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                      selectedTemp === t.value
                        ? 'bg-coffee-orange text-white'
                        : 'text-coffee-dark hover:bg-coffee-cream'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold underline transition cursor-pointer"
              >
                Atur Ulang Filter
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-coffee-beige space-y-4">
            <div className="w-14 h-14 rounded-full bg-coffee-cream mx-auto flex items-center justify-center text-coffee-brown">
              <Coffee className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-coffee-dark">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-coffee-brown max-w-sm mx-auto mt-1">
                Kami tidak menemukan kopi yang cocok dengan filter tersebut. Silakan atur ulang filter pencarian Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-coffee-orange text-white text-xs font-bold hover:bg-coffee-orange/90 transition shadow-sm cursor-pointer"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group rounded-4xl bg-white border border-coffee-beige p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-elevation hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-coffee-cream/40 p-4 mb-4 flex items-center justify-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
                  />
                  {product.scaScore && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-coffee-dark/85 backdrop-blur-sm text-white text-[10px] font-extrabold uppercase">
                      SCA {product.scaScore}
                    </span>
                  )}
                  {product.rating && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-coffee-dark text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/menu/${product.slug}`}
                      className="font-extrabold text-lg text-coffee-dark group-hover:text-coffee-orange transition-colors"
                    >
                      {product.name}
                    </Link>
                    <span className="font-black text-lg text-coffee-orange shrink-0">
                      {formatCurrency(product.basePrice)}
                    </span>
                  </div>

                  <p className="text-xs text-coffee-brown line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {product.tastingNotes && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.tastingNotes.slice(0, 2).map((n, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-coffee-cream text-[10px] font-semibold text-coffee-dark border border-coffee-beige/60"
                        >
                          ✦ {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-coffee-beige/50 flex items-center gap-2">
                  <Link
                    to={`/menu/${product.slug}`}
                    className="flex-1 py-2.5 px-3 rounded-full border border-coffee-beige hover:border-coffee-dark text-coffee-dark text-xs font-bold text-center transition"
                  >
                    Lihat Detail
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        openAuthModal(`/menu/${product.slug}`);
                        return;
                      }
                      setQuickViewProduct(product);
                    }}
                    className="px-4 py-2.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Pesan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default MenuPage;
