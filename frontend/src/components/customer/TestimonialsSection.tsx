import React, { useState } from 'react';
import { Star, MessageSquareDashed, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface GuestReview {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
}

const GUEST_REVIEWS: GuestReview[] = [];

const STAR_FILTERS: Array<{ value: number | 'all'; label: string }> = [
  { value: 'all', label: 'Semua Bintang' },
  { value: 5, label: 'Bintang 5' },
  { value: 4, label: 'Bintang 4' },
  { value: 3, label: 'Bintang 3' },
  { value: 2, label: 'Bintang 2' },
  { value: 1, label: 'Bintang 1' },
];

export const TestimonialsSection: React.FC = () => {
  const [selectedStar, setSelectedStar] = useState<number | 'all'>('all');

  const filteredReviews =
    selectedStar === 'all'
      ? GUEST_REVIEWS
      : GUEST_REVIEWS.filter((review) => review.rating === selectedStar);

  return (
    <section id="testimonials" className="py-14 lg:py-16 bg-coffee-cream border-t border-coffee-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-coffee-orange">
              Ulasan Tamu
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-coffee-dark tracking-tight">
              Apa Kata Pelanggan
            </h2>
          </div>

          <p className="text-sm text-coffee-brown font-medium max-w-sm md:text-right">
            Saring ulasan berdasarkan penilaian bintang 1 sampai 5 dari pengalaman nyata pelanggan kami.
          </p>
        </div>

        {/* Interactive Star Rating Filter Chips (1 - 5 Bintang) */}
        <div
          className="flex flex-wrap items-center gap-2.5 mb-8"
          role="group"
          aria-label="Filter ulasan berdasarkan rating bintang"
        >
          {STAR_FILTERS.map((filter) => {
            const isActive = selectedStar === filter.value;
            const count =
              filter.value === 'all'
                ? GUEST_REVIEWS.length
                : GUEST_REVIEWS.filter((r) => r.rating === filter.value).length;

            return (
              <button
                key={String(filter.value)}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedStar(filter.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-coffee-dark text-white shadow-card'
                    : 'bg-white hover:bg-coffee-beige/50 text-coffee-dark border border-coffee-beige'
                }`}
              >
                {filter.value !== 'all' && (
                  <Star
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-500'
                    }`}
                  />
                )}
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-coffee-cream text-coffee-brown'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Review Grid or Empty State */}
        {filteredReviews.length === 0 ? (
          <div className="rounded-3xl bg-white/80 border border-coffee-beige p-8 sm:p-12 text-center shadow-subtle space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-coffee-cream border border-coffee-beige mx-auto flex items-center justify-center text-coffee-orange">
              <MessageSquareDashed className="w-7 h-7" aria-hidden="true" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-black text-coffee-dark">
                {selectedStar === 'all'
                  ? 'Belum Ada Ulasan Tamu'
                  : `Belum Ada Ulasan Bintang ${selectedStar}`}
              </h3>
              <p className="text-xs sm:text-sm text-coffee-brown leading-relaxed">
                {selectedStar === 'all'
                  ? 'Bagian ulasan tamu saat ini masih kosong. Jadilah pelanggan pertama yang mencicipi seduhan spesialti kami.'
                  : `Saat ini belum terdapat ulasan pelanggan dengan penilaian ${selectedStar} bintang.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {selectedStar !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedStar('all')}
                  className="px-5 py-2.5 rounded-full bg-coffee-cream hover:bg-coffee-beige text-coffee-dark border border-coffee-beige text-xs font-bold transition-colors cursor-pointer"
                >
                  Tampilkan Semua Bintang
                </button>
              )}
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coffee-orange hover:bg-coffee-dark text-white text-xs font-extrabold uppercase tracking-wider transition-colors shadow-sm"
              >
                <Coffee className="w-3.5 h-3.5" aria-hidden="true" />
                Pesan Menu Sekarang
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="p-6 rounded-3xl bg-white border border-coffee-beige shadow-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-coffee-dark">{review.name}</h4>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-coffee-brown leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
