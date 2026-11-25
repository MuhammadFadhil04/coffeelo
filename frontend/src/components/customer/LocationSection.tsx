import React from 'react';
import { MapPin, Phone, Mail, Instagram, Clock, Navigation } from 'lucide-react';

export const LocationSection: React.FC = () => {
  return (
    <section id="location" className="py-14 lg:py-16 bg-[#CBA492] text-coffee-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Store Details matching Image 5 */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-coffee-dark/70">
                Flagship Store
              </span>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-coffee-dark">
                Where are we
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base font-medium text-coffee-dark/90">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coffee-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-coffee-dark">Coffeelo Artisan House</p>
                  <p>Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan, 12190</p>
                  <p className="text-xs text-coffee-dark/70 mt-0.5">(Also at: Rua dos Sapateiros, 111, Lisbon)</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-coffee-dark shrink-0" />
                <span className="break-words min-w-0">+62 812-3456-7890 / +351 210 000 000</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-coffee-dark shrink-0" />
                <a href="mailto:sayhi@coffeelo.com" className="hover:underline">
                  sayhi@coffeelo.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 text-coffee-dark shrink-0" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline font-semibold"
                >
                  @coffeelocoffee
                </a>
              </div>
            </div>

            {/* Operating Hours Banner matching Image 5 */}
            <div className="pt-2 flex items-center gap-3">
              <Clock className="w-5 h-5 text-coffee-dark shrink-0" />
              <p className="font-extrabold text-base sm:text-lg text-coffee-dark">
                We are open everyday <span className="underline decoration-2">08:00 – 21:00</span>
              </p>
            </div>

            <div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-coffee-dark text-white font-bold text-xs uppercase tracking-wider hover:bg-coffee-dark/90 transition shadow-card"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Right Column: Stylized Vector Map Card matching Image 5 */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md aspect-square bg-[#7D4D3D] rounded-4xl p-6 shadow-elevation border-4 border-white/30 relative flex items-center justify-center overflow-hidden">
              
              {/* Stylized Vector Roads Network */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full text-[#E5D4C6] opacity-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Diagonal & intersecting avenues */}
                <line x1="40" y1="20" x2="160" y2="380" />
                <line x1="160" y1="20" x2="360" y2="380" />
                <line x1="30" y1="120" x2="380" y2="80" />
                <line x1="20" y1="240" x2="380" y2="210" />
                <line x1="100" y1="360" x2="340" y2="330" />
                <line x1="260" y1="40" x2="210" y2="280" />
                <line x1="120" y1="180" x2="260" y2="240" />

                {/* Central Traffic Circle */}
                <circle cx="210" cy="200" r="32" strokeWidth="8" />
                <circle cx="90" cy="100" r="18" strokeWidth="5" />
                <circle cx="310" cy="290" r="24" strokeWidth="5" />
              </svg>

              {/* Pinpoint Location Marker */}
              <div className="absolute top-[48%] left-[51%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-coffee-dark text-white flex items-center justify-center shadow-2xl border-2 border-white animate-bounce motion-reduce:animate-none">
                    <MapPin className="w-5 h-5 fill-white text-coffee-dark" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/40 rounded-full blur-[2px]" />
                </div>
                <div className="mt-2 bg-coffee-dark/95 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-black uppercase tracking-wider border border-white/20 whitespace-nowrap shadow-lg">
                  Coffeelo Bar
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
