import React, { useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Leaf, Award, Clock, Flame, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const CRAFT_SPECS = [
  { label: 'Espresso Pekat', detail: 'Ekstraksi Ristretto Ganda' },
  { label: 'Saring Dingin', detail: 'Es Kristal Tiga Kali Saring' },
  { label: 'Susu Lembut', detail: 'Oat Artisan & Susu Segar' },
  { label: 'Asal Tunggal', detail: '100% Arabika Ethiopia' },
];

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cupWrapRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.hero-animate-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        }
      );

      if (cupWrapRef.current) {
        gsap.fromTo(
          cupWrapRef.current,
          { opacity: 0, scale: 0.92, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            delay: 0.15,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }

      gsap.fromTo(
        '.hero-spec-pill',
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          delay: 0.25,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );

      gsap.to('.floating-bean', {
        y: 'random(-10, 10)',
        x: 'random(-6, 6)',
        rotation: 'random(-12, 12)',
        duration: 'random(2.8, 4.2)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 1.2,
          from: 'random',
        },
      });

      if (haloRef.current) {
        gsap.to(haloRef.current, {
          scale: 1.03,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, heroRef);

    return () => mm.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 bg-coffee-cream border-b border-coffee-beige/70"
    >
      {/* Subtle Ambient Architectural Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full bg-[#E5D4C6]/65 blur-3xl z-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 -left-24 w-[320px] h-[320px] rounded-full bg-coffee-orange/[0.06] blur-3xl z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Editorial Column: Clear Typography & Conversion CTAs */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <h1 className="hero-animate-item text-4xl sm:text-5xl xl:text-6xl font-black text-coffee-dark tracking-tight leading-[1.06]">
              Diseduh Dingin,{' '}
              <span className="text-coffee-orange">Disangrai Segar</span> untuk Setiap Momen.
            </h1>

            <p className="hero-animate-item text-sm sm:text-base text-coffee-brown leading-relaxed max-w-xl font-medium">
              Halus, pekat, dan menyegarkan. Nikmati seduhan kopi dingin dan espresso khas dari biji asal tunggal Ethiopia Yirgacheffe dengan busa susu lembut setiap hari.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="hero-animate-item flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('collection')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-coffee-orange hover:bg-coffee-dark text-white font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card cursor-pointer"
              >
                Pesan Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-coffee-beige/60 text-coffee-dark border border-coffee-beige font-extrabold text-xs uppercase tracking-wider transition-colors shadow-subtle"
              >
                <Coffee className="w-4 h-4 text-coffee-orange" />
                Lihat Menu Lengkap
              </Link>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div
              ref={cupWrapRef}
              className="relative w-full max-w-[440px] sm:max-w-[480px] flex items-center justify-center py-2"
            >
              {/* Warm Concentric Halo Circle */}
              <div
                ref={haloRef}
                aria-hidden="true"
                className="absolute w-[270px] h-[270px] sm:w-[370px] sm:h-[370px] md:w-[410px] md:h-[410px] rounded-full bg-[#DFCEC0] border border-white/60 shadow-elevation z-0"
              />

              {/* Floating Coffee Beans (Strictly Decorative SVGs) */}
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-20">
                <svg
                  className="floating-bean absolute top-3 left-6 sm:left-8 w-8 h-8 text-coffee-dark drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
                </svg>

                <svg
                  className="floating-bean absolute top-6 right-6 sm:right-10 w-9 h-9 text-coffee-brown drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
                </svg>

                <svg
                  className="floating-bean absolute bottom-6 left-4 sm:left-8 w-7 h-7 text-coffee-orange drop-shadow-sm"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C7.5 2 4 6 4 11c0 5 3.5 10 8 10s8-5 8-10c0-5-3.5-9-8-9zm.5 2.5c2.5 3 1.5 6.5-.5 8.5-2 2-2.5 5.5.5 7.5-2.5-.5-5.5-3.5-5.5-8 0-4.5 3-8 5.5-8z" />
                </svg>
              </div>

              {/* Central Circular Product Photography */}
              <div className="relative z-10 w-[240px] h-[240px] sm:w-[330px] sm:h-[330px] md:w-[360px] md:h-[360px] rounded-full p-2.5 bg-white/80 backdrop-blur-sm border border-coffee-beige shadow-elevation">
                <img
                  src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=900&auto=format&fit=crop"
                  alt="Kopi Susu Dingin Spesialti Coffeelo"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Top-Left Craft Badge */}
                <div className="hidden sm:flex items-center gap-2 absolute -left-8 top-8 px-3.5 py-2 rounded-2xl bg-coffee-dark text-white shadow-card border border-white/15">
                  <Sparkles className="w-3.5 h-3.5 text-coffee-orange shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-coffee-beige font-bold leading-none">
                      Racikan Utama
                    </p>
                    <p className="text-xs font-extrabold leading-tight mt-0.5">Kopi Susu Dingin</p>
                  </div>
                </div>

                {/* Bottom-Right Origin Badge */}
                <div className="hidden sm:flex items-center gap-2 absolute -right-6 bottom-8 px-3.5 py-2 rounded-2xl bg-white text-coffee-dark shadow-card border border-coffee-beige">
                  <Leaf className="w-4 h-4 text-coffee-orange shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider text-coffee-brown font-bold leading-none">
                      Batch Sangrai
                    </p>
                    <p className="text-xs font-extrabold leading-tight mt-0.5">Diracik Segar Harian</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Horizontally-Aligned Metrics & Sensory Specs Row */}
        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-10 items-stretch">
          {/* Left 3 Quality Metric Cards */}
          <div className="hero-animate-item lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
            <div className="h-full rounded-2xl bg-white/85 border border-coffee-beige/80 px-4 py-3 shadow-subtle flex flex-col justify-center">
              <p className="text-lg sm:text-xl font-black text-coffee-dark leading-none">88+ SCA</p>
              <p className="text-[11px] font-semibold text-coffee-brown mt-1.5 leading-tight">
                Kualitas Spesialti
              </p>
            </div>
            <div className="h-full rounded-2xl bg-white/85 border border-coffee-beige/80 px-4 py-3 shadow-subtle flex flex-col justify-center">
              <p className="text-lg sm:text-xl font-black text-coffee-dark leading-none">100%</p>
              <p className="text-[11px] font-semibold text-coffee-brown mt-1.5 leading-tight">
                Arabika Ethiopia
              </p>
            </div>
            <div className="col-span-2 sm:col-span-1 h-full rounded-2xl bg-white/85 border border-coffee-beige/80 px-4 py-3 shadow-subtle flex flex-col justify-center">
              <p className="text-lg sm:text-xl font-black text-coffee-orange leading-none">~15 Menit</p>
              <p className="text-[11px] font-semibold text-coffee-brown mt-1.5 leading-tight">
                Ambil Cepat
              </p>
            </div>
          </div>

          {/* Right 4 Craft & Ingredient Spec Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-stretch">
            {CRAFT_SPECS.map((spec) => (
              <div
                key={spec.label}
                className="hero-spec-pill h-full rounded-2xl bg-white/85 hover:bg-white border border-coffee-beige/80 px-3.5 py-3 shadow-subtle transition-colors flex flex-col justify-center"
              >
                <p className="text-xs font-extrabold text-coffee-dark leading-tight">{spec.label}</p>
                <p className="text-[11px] font-semibold text-coffee-brown mt-1 leading-tight">
                  {spec.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Roastery Value Strip */}
        <div className="mt-8 pt-6 border-t border-coffee-beige/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-coffee-dark text-coffee-cream flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 text-coffee-orange" />
            </div>
            <div>
              <p className="font-extrabold text-coffee-dark">Kemitraan Petani Langsung</p>
              <p className="text-coffee-brown text-[11px]">Biji kopi terpilih dari Ethiopia, Gayo, dan Kintamani</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-coffee-dark text-coffee-cream flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-coffee-orange" />
            </div>
            <div>
              <p className="font-extrabold text-coffee-dark">Sangrai Presisi Skala Kecil</p>
              <p className="text-coffee-brown text-[11px]">Disangrai segar setiap minggu untuk aroma terbaik</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-coffee-dark text-coffee-cream flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-coffee-orange" />
            </div>
            <div>
              <p className="font-extrabold text-coffee-dark">Pesan Tanpa Antre</p>
              <p className="text-coffee-brown text-[11px]">Pesan online untuk ambil di gerai atau antar kurir</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
