import React, { useState } from 'react';
import { Droplet, Award, Zap, Coffee, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface ShowcaseItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tastingNotes: string[];
  roastLevel: string;
  acidity: string;
  body: string;
  price: number;
  imageUrl: string;
}

const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'sc-caramel-macchiato',
    name: 'Caramel Macchiato',
    tagline: 'Velvety sweetness kissed by fire-roasted caramel.',
    description: 'Espresso Arabica bertingkat dipadukan susu oat steam lembut dan saus salted caramel artisan yang dibuat segar setiap fajar.',
    tastingNotes: ['Salted Caramel', 'Roasted Almond', 'Toffee Butter'],
    roastLevel: 'Medium-Dark',
    acidity: 'Low',
    body: 'Heavy & Creamy',
    price: 4.80,
    imageUrl: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sc-mocha-bliss',
    name: 'Mocha Bliss',
    tagline: 'Single origin espresso folded into Belgian single-source dark cacao.',
    description: 'Cokelat Belgia 72% dipadukan dengan espresso shot pekat, menyajikan kehangatan rasa cokelat pahit-manis yang elegan.',
    tastingNotes: ['72% Dark Chocolate', 'Black Cherry', 'Malted Vanilla'],
    roastLevel: 'Dark Roast',
    acidity: 'Gentle',
    body: 'Velvety Smooth',
    price: 5.00,
    imageUrl: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sc-vanilla-cream',
    name: 'Vanilla Cream Raf',
    tagline: 'Subtle Madagascar vanilla infused under micro-pressure steam.',
    description: 'Teknik rafinasi Eropa klasik di mana krim susu segar dan ekstrak vanilla Bourbon disteam bersama espresso dalam satu putaran.',
    tastingNotes: ['Bourbon Vanilla', 'Sweet Buttercream', 'Hazelnut'],
    roastLevel: 'Medium',
    acidity: 'Balanced',
    body: 'Fluffy Silky',
    price: 4.60,
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'sc-ethiopian-signature',
    name: 'Signature Yirgacheffe Pour-Over',
    tagline: 'The pure, unadulterated expression of volcanic high-altitude soil.',
    description: 'Diseduh manual menggunakan rasio presisi 1:15 pada suhu 92°C, mengeluarkan spektrum rasa buah bunga yang menawan.',
    tastingNotes: ['Bergamot Blossom', 'White Peach', 'Wild Forest Honey'],
    roastLevel: 'Light-Medium',
    acidity: 'Bright & Vibrant',
    body: 'Tea-like Delicate',
    price: 5.20,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
  },
];

export const ProductShowcaseBanner: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const { addItem, setIsCartOpen } = useCartStore();
  const current = SHOWCASE_ITEMS[activeIdx];

  const handleQuickAdd = () => {
    addItem({
      id: current.id,
      categoryId: 'cat-signature',
      name: current.name,
      slug: current.name.toLowerCase().replace(/\s+/g, '-'),
      description: current.description,
      basePrice: current.price,
      imageUrl: current.imageUrl,
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      createdAt: '2026-01-01',
    });
    setIsCartOpen(true);
  };

  return (
    <section id="showcase" className="py-24 bg-[#EFE6DD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
              Curator's Highlights
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-coffee-dark tracking-tight mt-1">
              Signature Coffee Showcase
            </h2>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeIdx === idx
                    ? 'bg-coffee-orange text-white shadow-card scale-105'
                    : 'bg-white/70 hover:bg-white text-coffee-dark'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Showcase Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-12 border border-coffee-beige shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Product Image */}
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-coffee-cream/40 p-4 flex items-center justify-center">
            <img
              src={current.imageUrl}
              alt={current.name}
              className="w-full h-full object-cover rounded-2xl shadow-subtle hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 bg-coffee-dark/85 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-coffee-orange" />
              Barista Favorite
            </div>
          </div>

          {/* Right Column: Flavor Specs & Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-coffee-brown">
                Specialty Recipe
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
                {current.name}
              </h3>
              <p className="text-sm font-semibold text-coffee-orange italic">
                "{current.tagline}"
              </p>
              <p className="text-sm text-coffee-brown leading-relaxed pt-1">
                {current.description}
              </p>
            </div>

            {/* Tasting Notes Tags */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-coffee-dark">
                Tasting Notes:
              </p>
              <div className="flex flex-wrap gap-2">
                {current.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-coffee-cream border border-coffee-beige text-xs font-semibold text-coffee-dark"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sensory Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-coffee-beige/60">
              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <Coffee className="w-3.5 h-3.5 text-coffee-orange" />
                  Roast
                </div>
                <p className="text-xs font-bold text-coffee-dark">{current.roastLevel}</p>
              </div>

              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5 text-coffee-orange" />
                  Acidity
                </div>
                <p className="text-xs font-bold text-coffee-dark">{current.acidity}</p>
              </div>

              <div className="p-3 rounded-2xl bg-coffee-cream/40 border border-coffee-beige/60">
                <div className="flex items-center gap-1.5 text-coffee-brown text-[11px] font-semibold mb-1">
                  <Droplet className="w-3.5 h-3.5 text-coffee-orange" />
                  Body
                </div>
                <p className="text-xs font-bold text-coffee-dark">{current.body}</p>
              </div>
            </div>

            {/* Price & Add to Order CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
              <div>
                <p className="text-[11px] uppercase font-bold text-coffee-brown">Price</p>
                <p className="text-2xl font-black text-coffee-dark">
                  ${current.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleQuickAdd}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-card hover:shadow-elevation active:scale-95"
              >
                Order This Recipe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
