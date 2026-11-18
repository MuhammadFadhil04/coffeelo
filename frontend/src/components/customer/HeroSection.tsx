import React, { useEffect, useRef } from 'react';
import { Sparkles, Plus, ArrowRight, Leaf } from 'lucide-react';
import { gsap } from 'gsap';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cupRef = useRef<HTMLImageElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const beansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.hero-badge', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-title-bg', {
        opacity: 0,
        scale: 0.9,
        duration: 1.2,
        delay: 0.2,
        ease: 'power3.out',
      });

      if (cupRef.current) {
        gsap.from(cupRef.current, {
          opacity: 0,
          y: 60,
          scale: 0.85,
          duration: 1.4,
          delay: 0.3,
          ease: 'power4.out',
        });
      }

      gsap.from('.ingredient-tag', {
        opacity: 0,
        x: 30,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)',
      });

      // Subtle continuous floating for coffee beans and cup
      gsap.to('.floating-bean', {
        y: 'random(-12, 12)',
        x: 'random(-8, 8)',
        rotation: 'random(-15, 15)',
        duration: 'random(2.5, 4)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.5,
          from: 'random',
        },
      });

      // Subtle breathing motion on the backdrop circle
      if (circleRef.current) {
        gsap.to(circleRef.current, {
          scale: 1.03,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 bg-coffee-cream"
    >
      {/* Background Circular Shape inspired by Image 1 */}
      <div
        ref={circleRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] md:w-[680px] lg:w-[780px] h-[340px] sm:h-[540px] md:h-[680px] lg:h-[780px] rounded-full bg-[#D8C4B4] -z-10 shadow-elevation transition-transform pointer-events-none"
      />

      {/* Floating Coffee Beans (decorative vector elements) */}
      <div ref={beansRef} className="absolute inset-0 pointer-events-none -z-5">
        <svg
          className="floating-bean absolute top-[22%] left-[18%] sm:left-[28%] w-8 h-8 text-coffee-dark opacity-90 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
        </svg>

        <svg
          className="floating-bean absolute top-[18%] right-[24%] sm:right-[32%] w-10 h-10 text-coffee-brown opacity-85 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
        </svg>

        <svg
          className="floating-bean absolute bottom-[26%] left-[14%] sm:left-[22%] w-9 h-9 text-coffee-dark opacity-80 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
        </svg>

        <svg
          className="floating-bean absolute bottom-[30%] right-[16%] sm:right-[26%] w-7 h-7 text-coffee-orange opacity-90 drop-shadow-md"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
          
          {/* Left Hero Details: Tagline & Philosophy */}
          <div className="lg:col-span-3 text-left space-y-6 z-10">
            <div className="hero-badge flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-coffee-orange animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-coffee-dark">
                chilled bold energy.
              </span>
            </div>

            <p className="text-sm text-coffee-brown/90 leading-relaxed font-medium max-w-[240px]">
              smooth, strong, and made to refresh. Handcrafted cold brew with velvety milk foam.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-coffee-dark/80">
              <Sparkles className="w-4 h-4 text-coffee-orange" />
              <span>crafted fresh daily</span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => scrollToSection('collection')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-orange/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-card hover:shadow-elevation active:scale-95"
              >
                Order Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Column: Big "ice coffee" typography behind the product cup */}
          <div className="lg:col-span-6 relative flex items-center justify-center text-center">
            {/* Giant Graphic Title */}
            <h1 className="hero-title-bg absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
              <span className="text-7xl sm:text-9xl md:text-[140px] font-black text-coffee-dark tracking-tighter opacity-90 leading-none">
                ice
              </span>
              <span className="text-7xl sm:text-9xl md:text-[140px] font-black text-coffee-dark tracking-tighter opacity-90 leading-none">
                coffee
              </span>
            </h1>

            {/* Central Product Image: Iced Coffee with ice cubes & splash */}
            <div className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-square flex items-center justify-center">
              <img
                ref={cupRef}
                src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=900&auto=format&fit=crop"
                alt="Coffeelo Signature Iced Latte"
                className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-coffee-cream/80 hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column: Ingredient Floating Pills (as in Image 1) */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end space-y-3 z-10">
            {[
              { label: 'bold espresso', highlight: 'Double Shot' },
              { label: 'cold water', highlight: 'Triple Filtered' },
              { label: 'ice cubes', highlight: 'Pure Crystal' },
              { label: 'milk swirl', highlight: 'Oat or Dairy' },
              { label: 'natural energy', highlight: 'Clean Focus' },
            ].map((tag, idx) => (
              <div
                key={idx}
                className="ingredient-tag group flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-coffee-beige/80 shadow-sm transition-all hover:scale-105 cursor-default"
              >
                <span className="text-xs font-semibold text-coffee-dark capitalize tracking-tight">
                  {tag.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-coffee-cream flex items-center justify-center text-coffee-orange group-hover:bg-coffee-orange group-hover:text-white transition-colors">
                  <Plus className="w-3 h-3" />
                </span>
              </div>
            ))}

            <div className="pt-4 flex items-center gap-2 text-coffee-dark/60 text-xs">
              <Leaf className="w-4 h-4 text-coffee-brown" />
              <span>100% Ethiopian Arabica</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
