import React, { useEffect, useRef } from 'react';
import { Award, Globe, Flame, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const BrandStorySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orangeBlockRef = useRef<HTMLDivElement>(null);
  const imageBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(orangeBlockRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });

      gsap.from(imageBlockRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => mm.revert();
  }, []);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section id="story" ref={sectionRef} className="py-20 bg-coffee-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
            Our Philosophy & Sourcing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-coffee-dark tracking-tight">
            Artisan Beans, Transparent Journey
          </h2>
          <p className="text-sm sm:text-base text-coffee-brown font-medium leading-relaxed">
            Dari lereng gunung berkabut di Yirgacheffe hingga cangkir Anda, setiap tetes kopi Coffeelo adalah dedikasi terhadap cita rasa murni.
          </p>
        </div>

        {/* Hero Split Card inspired by Image 2 */}
        <div className="rounded-3xl overflow-hidden shadow-elevation border border-coffee-beige grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          
          {/* Left Block: Craft Photography & Packaging */}
          <div
            ref={imageBlockRef}
            className="lg:col-span-6 relative min-h-[260px] sm:min-h-[360px] bg-zinc-950 flex items-center justify-center p-6 sm:p-12 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
              alt="Artisan Ethiopian Coffee Bag and Latte"
              className="w-full h-full object-cover rounded-2xl opacity-90 hover:scale-105 transition-transform duration-700"
            />
            
            {/* Visual aesthetic dots on the side */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-white/80" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>

            {/* Floating Quality Tag */}
            <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 bg-coffee-dark/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-white flex items-center gap-2.5">
              <Award className="w-4 h-4 text-coffee-orange" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-coffee-beige">Origin Grade</p>
                <p className="text-xs font-bold">Yirgacheffe Grade 1</p>
              </div>
            </div>
          </div>

          {/* Right Block: Vibrant Burnt Orange Story Section */}
          <div
            ref={orangeBlockRef}
            className="lg:col-span-6 bg-coffee-orange text-white p-6 sm:p-10 lg:p-14 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coffee-cream/90">
                <Flame className="w-4 h-4" />
                <span>Single Origin Mastery</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight uppercase font-sans">
                A rich flavour from <span className="italic font-light">Ethiopian</span> grains everyday!
              </h3>

              <p className="text-sm sm:text-base text-coffee-cream/90 leading-relaxed font-normal">
                Ditanam pada ketinggian 2.200 meter di atas permukaan laut dengan metode washed process. Menghasilkan profil aroma melati segar, keasaman sitrun yang cerah, serta rasa manis madu alami yang tak tertandingi.
              </p>

              {/* Story Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase text-white">Direct Trade</h5>
                    <p className="text-[11px] text-coffee-cream/80">Kemitraan langsung petani lokal</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs uppercase text-white">Fresh Roasted</h5>
                    <p className="text-[11px] text-coffee-cream/80">Disangrai berkala tiap minggu</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-8">
              <button
                onClick={scrollToCollection}
                className="px-8 py-4 rounded-full bg-coffee-cream hover:bg-white text-coffee-dark font-extrabold text-xs uppercase tracking-wider transition-all shadow-card hover:shadow-elevation active:scale-95"
              >
                Choose your grains
              </button>
            </div>
          </div>

        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-coffee-dark">Ethically Sourced</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Kami menjalin kemitraan langsung dengan petani lokal di Aceh Gayo, Bali Kintamani, dan Ethiopia untuk menjamin upah yang adil dan keberlanjutan alam.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-coffee-dark">Precision Roasting</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Roasting curve dipantau secara digital per batch untuk mengeluarkan potensi rasa bunga, buah, karamel, dan cokelat gelap yang optimal.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-coffee-dark">Specialty Standards</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Hanya biji kopi dengan cupping score 85+ Specialty Coffee Association (SCA) yang berhak disajikan di bar Coffeelo.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
