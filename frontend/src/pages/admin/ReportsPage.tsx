import React, { useState, useEffect } from 'react';
import {
  Download,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { adminService, SalesReport } from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

export const ReportsPage: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const [startDate, setStartDate] = useState(thirtyDaysAgo);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getSalesReport(startDate, endDate);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat laporan penjualan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  const handleExportCsv = () => {
    if (!report) return;
    const rows = [
      ['Metric', 'Value'],
      ['Total Orders', report.summary.totalOrders],
      ['Total Revenue', report.summary.totalRevenue],
      ['Total Items Sold', report.summary.totalItemsSold],
      ['Total Tax (PB1)', report.summary.totalTax],
      ['Total Delivery Fee', report.summary.totalDeliveryFee],
      ['Total Discounts', report.summary.totalDiscount],
      [],
      ['Category', 'Units Sold', 'Total Amount'],
      ...report.categories.map((c) => [c.categoryName, c.unitsSold, c.totalAmount]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coffeelo-sales-report-${startDate}-to-${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar with Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Laporan Penjualan & Pajak</h2>
          <p className="text-xs text-[#71351D]/80">Analisis komprehensif omzet, volume produk, dan setoran pajak.</p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={!report || report.summary.totalOrders === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#451B0E] hover:bg-[#71351D] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#B6370B]" />
          Ekspor CSV / Spreadsheet
        </button>
      </div>

      {/* 2. Date Filter Form */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D4C6] shadow-sm">
        <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#71351D] mb-1">Mulai Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F4EDE5]/60 border border-[#E5D4C6] font-bold text-[#451B0E] focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-[#71351D] mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F4EDE5]/60 border border-[#E5D4C6] font-bold text-[#451B0E] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#B6370B] hover:bg-[#451B0E] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Terapkan Filter
          </button>
        </form>
      </div>

      {/* 3. Summary Stats */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-2">
          <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
          <p className="text-xs font-semibold text-[#71351D]">Menghitung ringkasan laporan...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center text-xs text-red-700 space-y-3">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500" />
          <p>{error}</p>
          <button
            onClick={fetchReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#451B0E] text-white font-bold hover:bg-[#71351D] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
          </button>
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm">
              <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Total Omzet Bersih</span>
              <div className="text-2xl font-black text-[#451B0E] mt-2">
                {formatCurrency(report.summary.totalRevenue)}
              </div>
              <p className="text-[11px] text-[#71351D]/60 mt-1">Dari {report.summary.totalOrders} pesanan aktif</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm">
              <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Total Cangkir Terjual</span>
              <div className="text-2xl font-black text-[#451B0E] mt-2">
                {report.summary.totalItemsSold.toLocaleString()} cups
              </div>
              <p className="text-[11px] text-[#71351D]/60 mt-1">Seluruh varian specialty coffee</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm">
              <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Pajak Restoran (PB1 11%)</span>
              <div className="text-2xl font-black text-amber-800 mt-2">
                {formatCurrency(report.summary.totalTax)}
              </div>
              <p className="text-[11px] text-[#71351D]/60 mt-1">Kewajiban pelaporan pajak daerah</p>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E5D4C6] shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#451B0E]">Penjualan Berdasarkan Kategori Menu</h3>
            {report.categories.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#71351D]/70 space-y-1">
                <p className="font-bold text-[#451B0E]">Belum ada penjualan kategori</p>
                <p>Tidak ada transaksi pada rentang tanggal ini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead className="bg-[#F4EDE5]/60 border-b border-[#E5D4C6] text-[#71351D]/80 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Kategori Menu</th>
                      <th className="py-3 px-4">Volume Terjual</th>
                      <th className="py-3 px-4 text-right">Total Kontribusi Omzet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5D4C6]/60">
                    {report.categories.map((cat, idx) => (
                      <tr key={idx} className="hover:bg-[#F4EDE5]/30">
                        <td className="py-3 px-4 font-bold text-[#451B0E]">{cat.categoryName}</td>
                        <td className="py-3 px-4 font-semibold text-[#71351D]">
                          {cat.unitsSold} cups
                        </td>
                        <td className="py-3 px-4 font-black text-[#B6370B] text-right">
                          {formatCurrency(cat.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ReportsPage;
