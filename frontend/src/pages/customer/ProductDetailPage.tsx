import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Award,
  ShieldCheck,
  Coffee,
} from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem, setIsCartOpen } = useCartStore();
  const { user, openAuthModal } = useAuthStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productService.getProductBySlug(slug).then((prod) => {
      if (prod) {
        setProduct(prod);
        // Default variants
        if (prod.variants) {
          const defaults: Record<string, string> = {};
          const seenGroups = new Set<string>();
          for (const v of prod.variants) {
            if (!seenGroups.has(v.name)) {
              defaults[v.name] = v.optionValue;
              seenGroups.add(v.name);
            }
          }
          setSelectedVariants(defaults);
        }
        productService.getRelatedProducts(prod.id, prod.categoryId).then(setRelatedProducts);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-coffee-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-coffee-orange border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-coffee-dark">Brewing product detail...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-coffee-cream flex flex-col items-center justify-center text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-coffee-beige flex items-center justify-center text-coffee-brown">
          <Coffee className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-coffee-dark">Product Not Found</h2>
        <p className="text-xs text-coffee-brown max-w-sm">
          The specialty coffee you are looking for is currently unavailable or has been archived.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coffee-orange text-white text-xs font-bold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Full Menu
        </Link>
      </div>
    );
  }

  // Group variants by name (e.g. "Size", "Milk Option")
  const variantGroups: Record<string, typeof product.variants> = {};
  if (product.variants) {
    for (const v of product.variants) {
      if (!variantGroups[v.name]) variantGroups[v.name] = [];
      variantGroups[v.name]!.push(v);
    }
  }

  // Calculate live dynamic price
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
      openAuthModal(`/menu/${product.slug}`);
      return;
    }
    addItem(product, selectedVariants, quantity, instructions);
    setIsAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <div className="pt-24 pb-24 bg-coffee-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-coffee-brown hover:text-coffee-dark transition mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to previous
          </button>
          <nav className="flex flex-wrap items-center gap-2 text-xs text-coffee-brown">
            <Link to="/" className="hover:text-coffee-orange transition">Home</Link>
            <span>/</span>
            <Link to="/menu" className="hover:text-coffee-orange transition">Menu</Link>
            <span>/</span>
            <span className="font-bold text-coffee-dark truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </nav>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Imagery & Technical Cupping Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-[4/3] rounded-4xl overflow-hidden bg-white p-6 border border-coffee-beige shadow-card flex items-center justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-3xl shadow-sm hover:scale-105 transition-transform duration-700"
              />
              {product.scaScore && (
                <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-coffee-dark/90 backdrop-blur-md text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                  <Award className="w-4 h-4 text-coffee-orange" />
                  SCA Score: {product.scaScore}
                </div>
              )}
            </div>

            {/* Specialty Origin & Terroir Card */}
            <div className="bg-white rounded-3xl p-6 border border-coffee-beige shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-coffee-beige/60">
                <h4 className="font-extrabold text-sm text-coffee-dark">Origin & Processing</h4>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {product.origin && (
                  <div>
                    <span className="text-coffee-brown block text-[11px] font-semibold">Origin / Region:</span>
                    <span className="font-bold text-coffee-dark">{product.origin}</span>
                  </div>
                )}
                {product.altitude && (
                  <div>
                    <span className="text-coffee-brown block text-[11px] font-semibold">Elevation:</span>
                    <span className="font-bold text-coffee-dark">{product.altitude}</span>
                  </div>
                )}
                {product.process && (
                  <div>
                    <span className="text-coffee-brown block text-[11px] font-semibold">Process:</span>
                    <span className="font-bold text-coffee-dark">{product.process}</span>
                  </div>
                )}
                {product.roastLevel && (
                  <div>
                    <span className="text-coffee-brown block text-[11px] font-semibold">Roast Profile:</span>
                    <span className="font-bold text-coffee-dark">{product.roastLevel}</span>
                  </div>
                )}
                {product.nutrition && (
                  <div>
                    <span className="text-coffee-brown block text-[11px] font-semibold">Caffeine Content:</span>
                    <span className="font-bold text-coffee-dark">{product.nutrition.caffeine}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customization & Add to Cart */}
          <div className="lg:col-span-6 bg-white rounded-4xl p-6 sm:p-10 border border-coffee-beige shadow-card space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-coffee-beige text-coffee-dark">
                  Specialty Lineup
                </span>
                {product.rating && (
                  <span className="flex items-center gap-1 text-xs font-bold text-coffee-dark">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {product.rating} ({product.reviewsCount} customer reviews)
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
                {product.name}
              </h1>

              {/* Live Price Display */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-black text-coffee-orange">
                  ${(currentUnitPrice * quantity).toFixed(2)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs font-semibold text-coffee-brown">
                    (${currentUnitPrice.toFixed(2)} each)
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-coffee-brown leading-relaxed">
              {product.description}
            </p>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                  Sensory Notes:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.tastingNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-coffee-cream border border-coffee-beige text-xs font-semibold text-coffee-dark"
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selectors */}
            <div className="space-y-5 pt-3 border-t border-coffee-beige/60">
              {Object.entries(variantGroups).map(([groupName, options]) => (
                <div key={groupName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                      Select {groupName}:
                    </span>
                    <span className="text-xs text-coffee-orange font-semibold">
                      {selectedVariants[groupName]}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {options?.map((opt) => {
                      const isSelected = selectedVariants[groupName] === opt.optionValue;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleVariantChange(groupName, opt.optionValue)}
                          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-coffee-dark text-white shadow-card scale-105'
                              : 'bg-coffee-cream/80 hover:bg-coffee-beige text-coffee-dark border border-coffee-beige'
                          }`}
                        >
                          {opt.optionValue}
                          {Number(opt.priceAdjustment) > 0 && (
                            <span className="ml-1 text-coffee-orange font-extrabold text-[11px]">
                              (+${Number(opt.priceAdjustment).toFixed(2)})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions Notes */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                Special Barista Instructions:
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Extra hot, separate ice, oat milk foam..."
                className="w-full p-3 text-xs rounded-2xl bg-coffee-cream/40 border border-coffee-beige text-coffee-dark placeholder-coffee-brown/60 focus:outline-none focus:ring-2 focus:ring-coffee-orange/40"
              />
            </div>

            {/* Quantity Adjuster & Add to Basket Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-coffee-beige/60">
              {/* Quantity */}
              <div className="flex items-center justify-between sm:justify-center gap-3 border border-coffee-beige rounded-full px-4 py-3 bg-coffee-cream/40">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 hover:text-coffee-orange transition text-coffee-dark"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-sm text-coffee-dark min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 hover:text-coffee-orange transition text-coffee-dark"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Basket CTA */}
              <button
                onClick={handleAddToCart}
                className={`w-full sm:flex-1 py-4 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-card hover:shadow-elevation active:scale-95 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-coffee-orange hover:bg-coffee-orange/95 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Basket — ${(currentUnitPrice * quantity).toFixed(2)}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-coffee-beige/60 space-y-8">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
                Perfect Pairings
              </span>
              <h3 className="text-3xl font-black text-coffee-dark tracking-tight">
                You May Also Like
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/menu/${rel.slug}`}
                  className="group bg-white rounded-3xl p-5 border border-coffee-beige shadow-subtle hover:shadow-elevation transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-coffee-cream/40 mb-3 flex items-center justify-center">
                    <img
                      src={rel.imageUrl}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-extrabold text-base text-coffee-dark group-hover:text-coffee-orange transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-sm font-black text-coffee-orange mt-1">
                    ${rel.basePrice.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailPage;
