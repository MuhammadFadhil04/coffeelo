import React, { useState, useEffect } from 'react';
import { Star, Trash2, Filter, Loader2, RefreshCw, AlertCircle, Coffee } from 'lucide-react';
import { adminService, AdminReview } from '@/services/adminService';

export const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getReviews({ rating: ratingFilter });
      setReviews(res.reviews || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat ulasan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ulasan ini?')) return;
    try {
      await adminService.deleteReview(id);
      await fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menghapus ulasan.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#451B0E]">Moderasi Ulasan Pelanggan</h2>
          <p className="text-xs text-[#71351D]/80">Pantau kepuasan rasa, feedback seduhan, dan moderasi konten ulasan.</p>
        </div>
        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E5D4C6] text-xs font-bold text-[#451B0E] hover:bg-[#F4EDE5] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </button>
      </div>

      {/* Filter by Stars */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5D4C6] shadow-sm flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="font-bold text-[#71351D]/70 flex items-center gap-1 pr-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> Rating:
        </span>
        <button
          onClick={() => setRatingFilter(undefined)}
          className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition ${
            ratingFilter === undefined
              ? 'bg-[#B6370B] text-white shadow-sm'
              : 'bg-[#F4EDE5] text-[#71351D] hover:bg-[#E5D4C6]'
          }`}
        >
          Semua Bintang
        </button>
        {[5, 4, 3, 2, 1].map((r) => (
          <button
            key={r}
            onClick={() => setRatingFilter(r)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 shrink-0 transition ${
              ratingFilter === r
                ? 'bg-[#B6370B] text-white shadow-sm'
                : 'bg-[#F4EDE5] text-[#71351D] hover:bg-[#E5D4C6]'
            }`}
          >
            {r} <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat ulasan pelanggan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={fetchReviews}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <Star className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Belum ada ulasan</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Ulasan dari customer yang telah menyelesaikan pesanan akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: User & Stars */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={
                        rev.user?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
                      }
                      alt={rev.user?.name || 'Customer'}
                      className="w-9 h-9 shrink-0 rounded-full object-cover border border-[#E5D4C6]"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#451B0E] truncate">{rev.user?.name}</p>
                      <p className="text-[10px] text-[#71351D]/60 truncate">{rev.user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    title="Hapus / Moderasi Ulasan"
                    className="p-1.5 shrink-0 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-black text-[#451B0E] ml-1.5">{rev.rating}.0</span>
                </div>

                {/* Comment */}
                <p className="text-xs text-[#71351D]/90 leading-relaxed italic bg-[#F4EDE5]/40 p-3 rounded-2xl border border-[#E5D4C6]/60">
                  "{rev.comment}"
                </p>
              </div>

              {/* Product Info & Date Footer */}
              <div className="pt-3 border-t border-[#E5D4C6] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  {rev.product?.imageUrl ? (
                    <img
                      src={rev.product.imageUrl}
                      alt={rev.product.name}
                      className="w-7 h-7 rounded-lg object-cover border border-[#E5D4C6]"
                    />
                  ) : (
                    <Coffee className="w-4 h-4 text-[#B6370B]" />
                  )}
                  <span className="font-bold text-[#451B0E] truncate max-w-[130px]">
                    {rev.product?.name}
                  </span>
                </div>
                <span className="text-[10px] text-[#71351D]/60 whitespace-nowrap">
                  {new Date(rev.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
