import React from 'react';
import { Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  bgClass: string;
  textClass: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Lylia',
    rating: 5,
    comment:
      'Coffeelo has quickly become my go-to place for both work and relaxation. The cozy atmosphere, paired with the soothing music and perfectly brewed coffee makes every morning exceptional.',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    bgClass: 'bg-coffee-dark text-white',
    textClass: 'text-white/80',
  },
  {
    id: 't-2',
    name: 'Aurora',
    rating: 5,
    comment:
      "Every time I walk into Coffeelo, I'm greeted with the comforting aroma of freshly ground beans and a warm smile from the staff. The attention to detail in their flat white is unmatched.",
    avatarUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    bgClass: 'bg-white text-coffee-dark border border-coffee-beige',
    textClass: 'text-coffee-brown',
  },
  {
    id: 't-3',
    name: 'Mijel',
    rating: 5,
    comment:
      'The Caramel Macchiato and Ethiopian Cold Brew are easily the finest in town. Ordering online for express pickup on my commute to the office has been a total game changer!',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    bgClass: 'bg-[#EDE2D8] text-coffee-dark border border-coffee-beige/80',
    textClass: 'text-coffee-dark/80',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-coffee-cream border-t border-coffee-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row matching Image 4 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-coffee-brown">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-coffee-dark tracking-tight">
              What They Say
            </h2>
          </div>

          <p className="text-sm text-coffee-brown font-medium max-w-sm md:text-right">
            Hear what our lovely guests have to say about their daily coffee ritual at Coffeelo.
          </p>
        </div>

        {/* Content Grid matching Image 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Stacked Testimonial Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className={`p-6 sm:p-7 rounded-3xl shadow-sm transition-transform hover:-translate-y-1 duration-300 ${t.bgClass}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-extrabold text-base tracking-tight">{t.name}</h4>
                    <div className="flex items-center gap-1 mt-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-sm"
                  />
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mt-2 ${t.textClass}`}>
                  {t.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: High-Res Coffee Cup in Hands Photography */}
          <div className="lg:col-span-6 relative rounded-4xl overflow-hidden min-h-[380px] lg:min-h-full border border-coffee-beige shadow-card">
            <img
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=900&auto=format&fit=crop"
              alt="Coffeelo Cup held in warm hands"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            
            {/* Subtle floating quote banner */}
            <div className="absolute bottom-8 left-8 right-8 bg-coffee-dark/85 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-coffee-beige">
                Your perfect escape
              </p>
              <p className="text-sm font-medium text-white/90">
                "Welcome home to genuine hospitality, specialty roasts, and quiet moments."
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
