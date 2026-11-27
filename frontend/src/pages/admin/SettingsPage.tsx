import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, CheckCircle2, AlertCircle, Store, RefreshCw } from 'lucide-react';
import { adminService } from '@/services/adminService';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    storeEmail: '',
    operatingHours: '',
    deliveryFeeFlat: '15000',
    taxPercentage: '10',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getSettings();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat pengaturan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);
    try {
      const updated = await adminService.updateSettings(settings);
      setSettings((prev) => ({ ...prev, ...updated }));
      setSuccessMessage('Pengaturan toko berhasil diperbarui.');
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal menyimpan pengaturan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight text-[#451B0E]">Pengaturan Toko & Operasional</h2>
        <p className="text-xs text-[#71351D]/80">Konfigurasi profil gerai Coffeelo, tarif ongkir, pajak, dan jam buka.</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            {error}
          </span>
          <button
            type="button"
            onClick={fetchSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Memuat pengaturan...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E5D4C6] shadow-sm space-y-6">
          <div className="border-b border-[#E5D4C6] pb-4 flex items-center gap-2 font-black text-sm text-[#451B0E]">
            <Store className="w-4 h-4 text-[#B6370B]" /> Profil Bisnis
          </div>

          <div className="space-y-4 text-xs font-semibold text-[#451B0E]">
            <div>
              <label className="block mb-1.5">Nama Usaha / Coffee Shop</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  required
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>
              <div>
                <label className="block mb-1.5">Email Resmi</label>
                <input
                  type="email"
                  required
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5">Alamat Lengkap Gerai Utama</label>
              <textarea
                rows={2}
                required
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
              />
            </div>

            <div>
              <label className="block mb-1.5">Jam Operasional Barista</label>
              <input
                type="text"
                required
                placeholder="Senin - Minggu: 07:00 - 22:00 WIB"
                value={settings.operatingHours}
                onChange={(e) => setSettings({ ...settings, operatingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
              />
            </div>
          </div>

          <div className="border-t border-[#E5D4C6] pt-6 space-y-4 text-xs font-semibold text-[#451B0E]">
            <h4 className="font-black text-sm text-[#451B0E]">Tarif Pengiriman & Pajak</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5">Ongkos Kirim Datar Delivery (Rp IDR)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="500"
                  value={settings.deliveryFeeFlat}
                  onChange={(e) => setSettings({ ...settings, deliveryFeeFlat: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>
              <div>
                <label className="block mb-1.5">Pajak Restoran PB1 (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={settings.taxPercentage}
                  onChange={(e) => setSettings({ ...settings, taxPercentage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D4C6] bg-[#F4EDE5]/40 focus:outline-none focus:ring-1 focus:ring-[#B6370B]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5D4C6] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Pengaturan
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsPage;
