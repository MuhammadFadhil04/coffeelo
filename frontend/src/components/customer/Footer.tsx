import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <footer className="bg-coffee-dark text-coffee-cream pt-16 pb-12 border-t border-coffee-dark/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row matching Image 5 bottom */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-white/10">
          
          {/* Brand Logo & Art Mark */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {/* Abstract Coffee Bean Trio Logo Mark matching Image 5 */}
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-coffee-cream" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <ellipse cx="14" cy="14" rx="8" ry="11" transform="rotate(-15 14 14)" />
                  <path d="M12 5C14 10 16 14 13 23" />
                  <ellipse cx="27" cy="18" rx="8" ry="12" transform="rotate(20 27 18)" />
                  <path d="M25 8C29 13 28 20 26 29" />
                  <ellipse cx="18" cy="28" rx="9" ry="7" transform="rotate(-5 18 28)" />
                  <path d="M11 27C17 26 22 28 25 30" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-2xl tracking-tight text-white">Coffeelo</h3>
                <p className="text-[10px] tracking-widest uppercase text-coffee-beige/80">Artisan Coffee House</p>
              </div>
            </div>

            <p className="text-xs text-coffee-cream/70 max-w-sm leading-relaxed">
              Sebuah ruang bagi penikmat kopi spesialti. Kami memanggang biji kopi dengan penuh cinta, dedikasi, dan transparansi proses dari hulu ke hilir.
            </p>
          </div>

          {/* Navigation Links Column matching Image 5 */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-coffee-cream/90">
            <div className="space-y-3">
              <div>
                <button onClick={() => scrollToSection('story')} className="hover:text-coffee-orange transition">
                  About Us
                </button>
              </div>
              <div>
                <button onClick={() => scrollToSection('collection')} className="hover:text-coffee-orange transition">
                  Menu
                </button>
              </div>
              <div>
                <button onClick={() => scrollToSection('showcase')} className="hover:text-coffee-orange transition">
                  Signature
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <button onClick={() => scrollToSection('testimonials')} className="hover:text-coffee-orange transition">
                  Guests
                </button>
              </div>
              <div>
                <button onClick={() => scrollToSection('location')} className="hover:text-coffee-orange transition">
                  Locations
                </button>
              </div>
              <div>
                <Link to="/admin/dashboard" className="text-coffee-orange hover:text-white transition">
                  Admin Portal →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Legal & Copyright matching Image 5 */}
          <div className="md:col-span-3 space-y-3 text-xs text-coffee-cream/70 md:text-right">
            <p className="font-semibold text-white">Coffeelo House 2026 ©</p>
            <p>
              <a href="#privacy" className="hover:text-white transition">Privacy policy</a>
            </p>
            <p>
              <a href="#terms" className="hover:text-white transition">Terms and conditions</a>
            </p>
            <p className="text-[11px] text-coffee-beige/60 pt-2">
              All images and recipes curated for specialty coffee lovers.
            </p>
          </div>

        </div>

        {/* Back to top row */}
        <div className="pt-6 flex items-center justify-between text-xs text-coffee-cream/60">
          <p>© 2026 Coffeelo. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
