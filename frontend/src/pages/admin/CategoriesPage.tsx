import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Loader2, RefreshCw, AlertCircle, X } from 'lucide-react';
import { adminService } from '@/services/adminService';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  products?: any[];
  _count?: { products: number };
}

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getCategories();
      setCategories(data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat kategori.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      imageUrl: cat.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
      };

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.id, payload);
      } else {
        await adminService.createCategory(payload);
      }

      setIsModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan kategori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori "${name}"? Produk yang terkait mungkin terpengaruh.`)) return;
    try {
      await adminService.deleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menghapus kategori.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Kategori Menu</h2>
          <p className="text-xs text-[#71351D]/80">Pengelompokan menu specialty coffee, manual brew, dan non-coffee.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori Baru
        </button>
      </div>

      {/* 2. Content */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat kategori...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <Layers className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Belum ada kategori menu</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Tambahkan kategori menu pertama untuk mulai mengelompokkan produk kopi Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#71351D] flex items-center justify-center font-black">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      title="Edit Kategori"
                      className="p-1.5 rounded-lg text-[#71351D] hover:bg-[#F4EDE5] transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      title="Hapus Kategori"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-base font-black text-[#451B0E] break-words">{cat.name}</h4>
                  <p className="text-[11px] font-mono text-[#B6370B] font-bold break-all">/{cat.slug}</p>
                </div>

                <p className="text-xs text-[#71351D]/80 leading-relaxed line-clamp-3">
                  {cat.description || 'Tidak ada deskripsi kategori.'}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5D4C6] flex items-center justify-between text-xs text-[#71351D]/70 font-semibold">
                <span>Total Item Menu:</span>
                <span className="font-bold text-[#451B0E]">
                  {cat.products?.length || cat._count?.products || 0} Produk
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 border border-[#E5D4C6] shadow-2xl space-y-5 my-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5D4C6] pb-3">
              <h3 className="text-base font-black font-serif text-[#451B0E]">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#71351D]/60 hover:text-[#451B0E]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#451B0E]">
              <div>
                <label className="block mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cold Brew Series"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              <div>
                <label className="block mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="cold-brew-series (otomatis jika kosong)"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              <div>
                <label className="block mb-1">Deskripsi Kategori</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat jenis racikan kopi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              <div>
                <label className="block mb-1">URL Gambar Header (Opsional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5D4C6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold transition hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#B6370B] text-white font-bold transition hover:bg-[#451B0E] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
