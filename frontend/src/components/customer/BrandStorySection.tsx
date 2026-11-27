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
          start: 'top 82%',
        },
        x: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      gsap.from(imageBlockRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
        },
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
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
    <section id="story" ref={sectionRef} className="py-12 lg:py-14 bg-coffee-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
            Filosofi & Sumber Biji Kopi
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-coffee-dark tracking-tight">
            Biji Pilihan, Proses Transparan
          </h2>
          <p className="text-sm text-coffee-brown font-medium leading-relaxed">
            Dari lereng gunung berkabut di Yirgacheffe hingga cangkir Anda, setiap tetes kopi Coffeelo adalah wujud dedikasi terhadap cita rasa murni.
          </p>
        </div>

        {/* Compact Horizontal Split Card */}
        <div className="rounded-3xl overflow-hidden shadow-elevation border border-coffee-beige grid grid-cols-1 lg:grid-cols-12">
          {/* Left Block: Compact Craft Photography */}
          <div
            ref={imageBlockRef}
            className="lg:col-span-5 relative h-52 sm:h-64 lg:h-full lg:max-h-[380px] bg-zinc-950 flex items-center justify-center p-4 sm:p-5 overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
              alt="Racikan Kopi Spesialti Ethiopia Coffeelo"
              className="w-full h-full object-cover rounded-2xl opacity-90 hover:scale-105 transition-transform duration-700"
            />

            {/* Floating Quality Tag */}
            <div className="absolute bottom-6 right-6 bg-coffee-dark/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-coffee-orange shrink-0" />
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold text-coffee-beige leading-none">Kelas Asal</p>
                <p className="text-xs font-bold mt-0.5 leading-tight">Yirgacheffe Grade 1</p>
              </div>
            </div>
          </div>

          {/* Right Block: Burnt Orange Story Section */}
          <div
            ref={orangeBlockRef}
            className="lg:col-span-7 bg-coffee-orange text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-coffee-cream/90">
                <Flame className="w-4 h-4" />
                <span>Keahlian Kopi Asal Tunggal</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase">
                Cita rasa kaya dari biji <span className="italic font-light">Ethiopia</span> setiap hari!
              </h3>

              <p className="text-xs sm:text-sm text-coffee-cream/90 leading-relaxed font-normal">
                Ditanam pada ketinggian 2.200 meter di atas permukaan laut dengan proses basah. Menghasilkan aroma melati segar, keasaman jeruk yang cerah, serta rasa manis madu alami.
              </p>

              {/* Story Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase text-white">Perdagangan Langsung</h4>
                    <p className="text-[11px] text-coffee-cream/85">Kemitraan langsung petani lokal</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase text-white">Sangrai Segar</h4>
                    <p className="text-[11px] text-coffee-cream/85">Disangrai berkala tiap minggu</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={scrollToCollection}
                className="px-7 py-3 rounded-full bg-coffee-cream hover:bg-white text-coffee-dark font-extrabold text-xs uppercase tracking-wider transition-colors shadow-card cursor-pointer"
              >
                Pilih Kopi Anda
              </button>
            </div>
          </div>
        </div>

        {/* Three Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">
          <div className="p-5 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-coffee-dark">Sumber Biji Etis</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Kami bermitra langsung dengan petani kopi di Aceh Gayo, Bali Kintamani, dan Ethiopia demi kesejahteraan petani dan kelestarian alam.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-coffee-dark">Sangrai Presisi</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Kurva sangrai dipantau secara digital per batch untuk menonjolkan karakter aroma bunga, buah, karamel, dan cokelat gelap.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-2.5">
            <div className="w-9 h-9 rounded-2xl bg-coffee-cream flex items-center justify-center text-coffee-orange">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-coffee-dark">Standar Spesialti</h4>
            <p className="text-xs text-coffee-brown leading-relaxed">
              Hanya biji kopi dengan skor uji cita rasa 85+ Asosiasi Kopi Spesialti (SCA) yang disajikan di bar Coffeelo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
