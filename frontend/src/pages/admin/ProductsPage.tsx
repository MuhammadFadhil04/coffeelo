import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import { adminService } from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

interface Category {
  id: string;
  name: string;
}

interface ProductVariant {
  id?: string;
  name: string;
  optionValue: string;
  priceAdjustment: number;
  stock: number;
}

interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: Category;
  variants?: ProductVariant[];
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    basePrice: '',
    stock: '',
    imageUrl: '',
    description: '',
    isAvailable: true,
    isFeatured: false,
    variants: [] as ProductVariant[],
  });

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ]);
      setProducts(prodsRes.products || prodsRes || []);
      setCategories(catsRes || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat katalog produk.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      basePrice: '',
      stock: '50',
      imageUrl: '',
      description: '',
      isAvailable: true,
      isFeatured: false,
      variants: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      categoryId: prod.categoryId,
      basePrice: String(prod.basePrice),
      stock: String(prod.stock),
      imageUrl: prod.imageUrl,
      description: prod.description,
      isAvailable: prod.isAvailable,
      isFeatured: prod.isFeatured,
      variants: prod.variants || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.basePrice || !formData.imageUrl) {
      alert('Mohon lengkapi semua field wajib.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        basePrice: parseFloat(formData.basePrice),
        stock: parseInt(formData.stock) || 0,
        imageUrl: formData.imageUrl,
        description: formData.description || formData.name,
        isAvailable: formData.isAvailable,
        isFeatured: formData.isFeatured,
        variants: formData.variants.length > 0 ? formData.variants : undefined,
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        await adminService.createProduct(payload);
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menyimpan produk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Nonaktifkan produk "${name}"?`)) return;
    try {
      await adminService.deleteProduct(id);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Gagal menonaktifkan produk.');
    }
  };

  const handleToggleAvailability = async (prod: Product) => {
    try {
      await adminService.updateProduct(prod.id, { isAvailable: !prod.isAvailable });
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, isAvailable: !p.isAvailable } : p))
      );
    } catch (err: any) {
      alert('Gagal memperbarui status ketersediaan.');
    }
  };

  // Add/remove variant in form
  const addVariantOption = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: 'Ukuran', optionValue: 'Large (+$1.50)', priceAdjustment: 1.5, stock: 50 },
      ],
    }));
  };

  const removeVariantOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Katalog Produk Kopi</h2>
          <p className="text-xs text-[#71351D]/80">Kelola harga, foto, stok, dan varian menu Coffeelo.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk Baru
        </button>
      </div>

      {/* 2. Search & Category Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5D4C6] shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71351D]/50" />
          <input
            type="text"
            placeholder="Cari nama atau deskripsi produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F4EDE5]/60 border border-[#E5D4C6] focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
          />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-none min-w-0 px-3 py-2 text-xs rounded-xl bg-[#F4EDE5]/60 border border-[#E5D4C6] font-bold text-[#451B0E] focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchData}
            title="Muat Ulang"
            className="p-2 shrink-0 rounded-xl border border-[#E5D4C6] hover:bg-[#F4EDE5] transition"
          >
            <RefreshCw className={`w-4 h-4 text-[#71351D] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Products Table */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat produk...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5D4C6] space-y-3">
          <Coffee className="w-10 h-10 mx-auto text-[#E5D4C6]" />
          <h4 className="text-sm font-bold text-[#451B0E]">Tidak ada produk ditemukan</h4>
          <p className="text-xs text-[#71351D]/70 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau tambahkan produk baru ke dalam katalog.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#E5D4C6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-[#F4EDE5]/60 border-b border-[#E5D4C6] text-[#71351D]/80 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Produk</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga Dasar</th>
                  <th className="py-3.5 px-4">Stok</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D4C6]/60">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F4EDE5]/30 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-12 h-12 shrink-0 rounded-xl object-cover border border-[#E5D4C6]"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#451B0E]">{prod.name}</p>
                          <p className="text-[11px] text-[#71351D]/60 truncate max-w-xs">{prod.description}</p>
                          {prod.isFeatured && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                              Featured Signature
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#71351D]">
                      {prod.category?.name || 'Kopi'}
                    </td>
                    <td className="py-3 px-4 font-black text-[#451B0E]">
                      {formatCurrency(Number(prod.basePrice))}
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={prod.stock < 10 ? 'text-red-600' : 'text-[#451B0E]'}>
                        {prod.stock} cups
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(prod)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          prod.isAvailable
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {prod.isAvailable ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {prod.isAvailable ? 'Tersedia' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="Edit Produk"
                          className="p-1.5 rounded-lg text-[#71351D] hover:bg-[#F4EDE5] hover:text-[#451B0E] transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.name)}
                          title="Hapus Produk"
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start sm:items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-8 border border-[#E5D4C6] shadow-2xl space-y-6 my-auto max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5D4C6] pb-4">
              <h3 className="text-lg font-black font-serif text-[#451B0E]">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#71351D]/60 hover:text-[#451B0E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-[#451B0E]">
              {/* Product Name */}
              <div>
                <label className="block mb-1.5">Nama Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Caramel Macchiato"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Kategori *</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1.5">Harga Dasar ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="4.50"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                  />
                </div>
              </div>

              {/* Stock & Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5">Stok Awal (Cups) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                  />
                </div>
                <div>
                  <label className="block mb-1.5">URL Foto Produk *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1.5">Deskripsi Produk *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ceritakan cita rasa, perpaduan espresso, dan karakter minuman..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded text-[#B6370B] focus:ring-[#B6370B]"
                  />
                  <span>Tersedia untuk Dipesan</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-[#B6370B] focus:ring-[#B6370B]"
                  />
                  <span>Tampilkan di Featured Showcase</span>
                </label>
              </div>

              {/* Variants Section */}
              <div className="border-t border-[#E5D4C6] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#B6370B]" /> Varian & Kustomisasi
                  </span>
                  <button
                    type="button"
                    onClick={addVariantOption}
                    className="text-xs font-bold text-[#B6370B] hover:underline"
                  >
                    + Tambah Opsi
                  </button>
                </div>

                {formData.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-[#F4EDE5]/50 p-3 rounded-xl border border-[#E5D4C6]">
                    <input
                      type="text"
                      placeholder="Nama Varian (Ukuran/Susu)"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...formData.variants];
                        copy[i].name = e.target.value;
                        setFormData({ ...formData, variants: copy });
                      }}
                      className="sm:col-span-4 w-full px-2.5 py-1.5 rounded-lg border border-[#E5D4C6] bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Nilai (Large/Oat Milk)"
                      value={v.optionValue}
                      onChange={(e) => {
                        const copy = [...formData.variants];
                        copy[i].optionValue = e.target.value;
                        setFormData({ ...formData, variants: copy });
                      }}
                      className="sm:col-span-4 w-full px-2.5 py-1.5 rounded-lg border border-[#E5D4C6] bg-white text-xs"
                    />
                    <div className="sm:col-span-4 flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="+Harga ($)"
                        value={v.priceAdjustment}
                        onChange={(e) => {
                          const copy = [...formData.variants];
                          copy[i].priceAdjustment = parseFloat(e.target.value) || 0;
                          setFormData({ ...formData, variants: copy });
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-[#E5D4C6] bg-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantOption(i)}
                        className="text-red-500 hover:text-red-700 p-1.5 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 sm:gap-3 border-t border-[#E5D4C6]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition text-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B6370B] hover:bg-[#451B0E] text-white font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProduct ? 'Simpan Perubahan' : 'Terbitkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
