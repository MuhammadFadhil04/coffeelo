import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  Coffee,
  AlertCircle,
} from 'lucide-react';
import {
  adminService,
  DashboardSummary,
  SalesChartData,
  TopProduct,
} from '@/services/adminService';
import { formatCurrency } from '@/utils/currency';

export const DashboardOverviewPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [sales, setSales] = useState<SalesChartData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [salesRangeDays, setSalesRangeDays] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumData, salesData, topData] = await Promise.all([
        adminService.getSummary(),
        adminService.getSales(salesRangeDays),
        adminService.getTopProducts(5),
      ]);
      setSummary(sumData);
      setSales(salesData);
      setTopProducts(topData);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat data dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [salesRangeDays]);

  if (isLoading && !summary) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#B6370B] animate-spin" />
        <p className="text-sm font-semibold text-[#71351D]">Mengambil data analitik Coffeelo...</p>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-800">Koneksi Database / API Terkendala</h3>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#451B0E] text-white text-xs font-bold hover:bg-[#71351D] transition"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    );
  }

  const maxRevenue = Math.max(...sales.map((s) => s.revenue), 100);

  return (
    <div className="space-y-8">
      {error && summary && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex flex-wrap items-center justify-between gap-3 text-xs text-red-700 font-semibold">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            {error}
          </span>
          <button
            onClick={fetchDashboardData}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* 1. Header Bar with Refresh & Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black font-serif text-[#451B0E]">Ringkasan Performa Bisnis</h2>
          <p className="text-xs text-[#71351D]/80">Data transaksi real-time dari database Coffeelo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-white border border-[#E5D4C6] rounded-xl p-1 flex text-xs font-bold shadow-sm">
            <button
              onClick={() => setSalesRangeDays(7)}
              className={`px-3 py-1.5 rounded-lg transition ${
                salesRangeDays === 7 ? 'bg-[#451B0E] text-white shadow-sm' : 'text-[#71351D] hover:text-[#451B0E]'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setSalesRangeDays(14)}
              className={`px-3 py-1.5 rounded-lg transition ${
                salesRangeDays === 14 ? 'bg-[#451B0E] text-white shadow-sm' : 'text-[#71351D] hover:text-[#451B0E]'
              }`}
            >
              14 Hari
            </button>
            <button
              onClick={() => setSalesRangeDays(30)}
              className={`px-3 py-1.5 rounded-lg transition ${
                salesRangeDays === 30 ? 'bg-[#451B0E] text-white shadow-sm' : 'text-[#71351D] hover:text-[#451B0E]'
              }`}
            >
              30 Hari
            </button>
          </div>
          <button
            onClick={fetchDashboardData}
            title="Muat Ulang"
            className="p-2.5 rounded-xl bg-white border border-[#E5D4C6] hover:bg-[#E5D4C6]/30 text-[#451B0E] transition shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Total Pendapatan</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#451B0E] tracking-tight">
            {formatCurrency(summary?.totalRevenue || 0)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Terverifikasi lunas (PAID)</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Total Pesanan</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#B6370B] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#451B0E] tracking-tight">
            {(summary?.totalOrders || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-[#71351D]/80">
            Pickup & Delivery digabung
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Total Pelanggan</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#451B0E] tracking-tight">
            {(summary?.totalCustomers || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-[#71351D]/80">
            Akun terdaftar aktif
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5D4C6] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-[#71351D]/70 uppercase tracking-wider">Rata-Rata Pesanan</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#451B0E] tracking-tight">
            {formatCurrency(summary?.averageOrderValue || 0)}
          </div>
          <div className="mt-2 text-xs text-[#71351D]/80">
            Nilai transaksi rata-rata
          </div>
        </div>
      </div>

      {/* 3. Order Status Summary Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5D4C6] shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#451B0E] uppercase tracking-wider">Status Pemrosesan Pesanan</h3>
          <Link to="/admin/orders" className="text-xs font-bold text-[#B6370B] hover:underline flex items-center gap-1">
            Lihat Semua Pesanan <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Menunggu', key: 'PENDING', icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { label: 'Dikonfirmasi', key: 'CONFIRMED', icon: CheckCircle, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { label: 'Diproses', key: 'PROCESSING', icon: Coffee, color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { label: 'Siap Ambil', key: 'READY', icon: CheckCircle, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { label: 'Diantar', key: 'ON_DELIVERY', icon: Truck, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
            { label: 'Selesai', key: 'COMPLETED', icon: CheckCircle, color: 'text-green-700 bg-green-50 border-green-200' },
            { label: 'Batal', key: 'CANCELLED', icon: XCircle, color: 'text-rose-700 bg-rose-50 border-rose-200' },
          ].map((item) => {
            const count = summary?.orderStatusSummary?.[item.key] || 0;
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center ${item.color}`}
              >
                <Icon className="w-4 h-4 mb-1.5 opacity-80" />
                <span className="text-lg font-black">{count}</span>
                <span className="text-[11px] font-semibold tracking-tight">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Sales Chart & Best Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 Cols) */}
        <div className="lg:col-span-2 min-w-0 bg-white rounded-3xl p-5 sm:p-8 border border-[#E5D4C6] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-base font-black text-[#451B0E]">Tren Penjualan ({salesRangeDays} Hari Terakhir)</h3>
              <span className="text-xs font-semibold text-[#71351D]/70">Harian</span>
            </div>
            <p className="text-xs text-[#71351D]/70 mb-4">Visualisasi omzet harian berdasarkan pesanan terbayar.</p>

            {/* Visual Bar Chart */}
            {sales.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-xs text-[#71351D]/60 border-b border-[#E5D4C6]">
                Belum ada data grafik pada rentang ini.
              </div>
            ) : (
              <div className="overflow-x-auto pb-2 custom-scrollbar">
                <div
                  className={`h-60 flex items-end gap-1.5 sm:gap-3 pt-12 pb-6 px-2 border-b border-[#E5D4C6] ${
                    sales.length > 14 ? 'min-w-[560px]' : 'min-w-[320px]'
                  }`}
                >
                  {sales.map((entry, idx) => {
                    const heightPercent = Math.max(8, Math.round((entry.revenue / maxRevenue) * 100));
                    const showLabel = sales.length <= 14 || idx % 2 === 0 || idx === sales.length - 1;
                    return (
                      <div key={idx} className="flex-1 min-w-[14px] flex flex-col items-center h-full justify-end group relative">
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-11 bg-[#451B0E] text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          <p className="font-bold">{formatCurrency(entry.revenue)}</p>
                          <p className="text-white/70">{entry.ordersCount} pesanan</p>
                        </div>
                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                            entry.revenue > 0
                              ? 'bg-[#B6370B] group-hover:bg-[#451B0E]'
                              : 'bg-[#E5D4C6]/40'
                          }`}
                        />
                        {/* Date label */}
                        <span className="text-[10px] text-[#71351D]/60 mt-2 whitespace-nowrap text-center h-3">
                          {showLabel ? entry.date.slice(5) : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#71351D]">
            <span>Omzet Tertinggi Periode: <strong>{formatCurrency(maxRevenue)}</strong></span>
            <Link to="/admin/reports" className="font-bold text-[#B6370B] hover:underline flex items-center gap-1">
              Lihat Laporan Lengkap <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top-Selling Products (1 Col) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5D4C6] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[#451B0E]">Produk Terlaris</h3>
              <Coffee className="w-4 h-4 text-[#B6370B]" />
            </div>

            {topProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#71351D]/60 space-y-2">
                <Coffee className="w-8 h-8 mx-auto text-[#E5D4C6]" />
                <p>Belum ada produk yang terjual.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((prod, index) => (
                  <div key={prod.productId} className="flex items-center gap-3">
                    <span className="w-5 text-xs font-black text-[#71351D]/40">#{index + 1}</span>
                    <img
                      src={prod.productImageUrl}
                      alt={prod.productName}
                      className="w-11 h-11 rounded-xl object-cover border border-[#E5D4C6]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#451B0E] truncate">{prod.productName}</p>
                      <p className="text-[11px] text-[#71351D]/70">{prod.totalQuantitySold} cups terjual</p>
                    </div>
                    <div className="text-right text-xs font-black text-[#B6370B]">
                      {formatCurrency(prod.totalRevenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5D4C6]">
            <Link
              to="/admin/products"
              className="w-full py-2.5 rounded-xl bg-[#F4EDE5] hover:bg-[#E5D4C6] text-[#451B0E] text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              Kelola Katalog Produk
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E5D4C6] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-black text-[#451B0E]">Pesanan Terbaru</h3>
            <p className="text-xs text-[#71351D]/70">Transaksi terkini yang masuk ke sistem Coffeelo.</p>
          </div>
          <Link
            to="/admin/orders"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#451B0E] text-white hover:bg-[#71351D] text-xs font-bold transition whitespace-nowrap"
          >
            Lihat Semua Pesanan
          </Link>
        </div>

        {summary?.recentOrders && summary.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-xs">
              <thead className="border-b border-[#E5D4C6] text-[#71351D]/70 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status Pesanan</th>
                  <th className="py-3 px-4">Pembayaran</th>
                  <th className="py-3 px-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D4C6]/60">
                {summary.recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#F4EDE5]/50 transition">
                    <td className="py-3.5 px-4 font-bold text-[#451B0E] font-mono">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#451B0E]">{ord.user?.name || 'Pelanggan'}</p>
                      <p className="text-[11px] text-[#71351D]/60">{ord.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]">
                      {ord.items.map((it) => `${it.productName} (${it.quantity})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#451B0E]">
                      {formatCurrency(Number(ord.totalAmount))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          ord.payment?.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {ord.payment?.status || 'UNPAID'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#71351D]/70 whitespace-nowrap">
                      {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#71351D]/60 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-[#E5D4C6]" />
            <p>Belum ada transaksi pesanan yang tercatat di database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
