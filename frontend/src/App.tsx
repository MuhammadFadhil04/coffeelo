import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { Coffee, ArrowLeft, Loader2 } from 'lucide-react';

// Lazy Loaded Customer Pages
const HomePage = React.lazy(() => import('@/pages/customer/HomePage'));
const MenuPage = React.lazy(() => import('@/pages/customer/MenuPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/customer/ProductDetailPage'));
const CartPage = React.lazy(() => import('@/pages/customer/CartPage'));
const LoginPage = React.lazy(() => import('@/pages/customer/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/customer/RegisterPage'));
const CheckoutPage = React.lazy(() => import('@/pages/customer/CheckoutPage'));
const PaymentPage = React.lazy(() => import('@/pages/customer/PaymentPage'));
const MyOrdersPage = React.lazy(() => import('@/pages/customer/MyOrdersPage'));
const OrderDetailPage = React.lazy(() => import('@/pages/customer/OrderDetailPage'));
const ProfilePage = React.lazy(() => import('@/pages/customer/ProfilePage'));

// Lazy Loaded Admin Pages (Phase 6)
const DashboardOverviewPage = React.lazy(() => import('@/pages/admin/DashboardOverviewPage'));
const OrdersPage = React.lazy(() => import('@/pages/admin/OrdersPage'));
const ProductsPage = React.lazy(() => import('@/pages/admin/ProductsPage'));
const CategoriesPage = React.lazy(() => import('@/pages/admin/CategoriesPage'));
const CustomersPage = React.lazy(() => import('@/pages/admin/CustomersPage'));
const ReviewsPage = React.lazy(() => import('@/pages/admin/ReviewsPage'));
const PaymentsPage = React.lazy(() => import('@/pages/admin/PaymentsPage'));
const ReportsPage = React.lazy(() => import('@/pages/admin/ReportsPage'));
const SettingsPage = React.lazy(() => import('@/pages/admin/SettingsPage'));

// Suspense Fallback Loader
const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#B6370B] flex items-center justify-center animate-pulse">
      <Coffee className="w-6 h-6 animate-bounce" />
    </div>
    <span className="text-xs font-bold text-[#71351D] tracking-wide flex items-center gap-1.5">
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
      Menyiapkan Racikan Coffeelo...
    </span>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-4">
    <div className="w-14 h-14 rounded-full bg-coffee-beige flex items-center justify-center text-coffee-orange">
      <Coffee className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h2 className="text-2xl font-extrabold text-coffee-dark">Halaman Tidak Ditemukan (404)</h2>
      <p className="text-sm text-coffee-brown max-w-sm pt-2">
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
    </div>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coffee-dark text-white text-xs font-bold hover:bg-coffee-orange transition shadow-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      Kembali ke Beranda
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Customer Portal Routes */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/:slug" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="payment/:orderId" element={<PaymentPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="my-orders/:id" element={<OrderDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Portal Routes (Phase 6) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverviewPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
