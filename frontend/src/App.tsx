import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CustomerLayout from '@/layouts/CustomerLayout';
import HomePage from '@/pages/customer/HomePage';
import { Coffee, ArrowLeft } from 'lucide-react';

// Placeholder view for secondary routes ready for Phase 3/4/6
const ComingSoonPage: React.FC<{ title: string; phase: string }> = ({ title, phase }) => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 space-y-4">
    <div className="w-14 h-14 rounded-full bg-coffee-beige flex items-center justify-center text-coffee-orange">
      <Coffee className="w-7 h-7" />
    </div>
    <div className="space-y-1">
      <h2 className="text-2xl font-extrabold text-coffee-dark">{title}</h2>
      <p className="text-xs font-semibold text-coffee-orange uppercase tracking-wider">
        Scheduled for {phase}
      </p>
      <p className="text-sm text-coffee-brown max-w-sm pt-2">
        Halaman ini disiapkan secara modular dan akan aktif sepenuhnya pada fase berikutnya.
      </p>
    </div>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coffee-dark text-white text-xs font-bold hover:bg-coffee-orange transition shadow-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Home
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Portal Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="menu" element={<ComingSoonPage title="Full Product Catalog" phase="Phase 3" />} />
          <Route path="menu/:slug" element={<ComingSoonPage title="Product Detail & Customizer" phase="Phase 3" />} />
          <Route path="cart" element={<ComingSoonPage title="Shopping Cart" phase="Phase 3" />} />
          <Route path="checkout" element={<ComingSoonPage title="Secure Checkout" phase="Phase 5" />} />
          <Route path="my-orders" element={<ComingSoonPage title="My Orders" phase="Phase 5" />} />
          <Route path="login" element={<ComingSoonPage title="Customer & Admin Login" phase="Phase 4" />} />
          <Route path="register" element={<ComingSoonPage title="Register Account" phase="Phase 4" />} />
        </Route>

        {/* Admin Portal placeholder */}
        <Route
          path="/admin/*"
          element={<ComingSoonPage title="Coffeelo Admin Portal" phase="Phase 6" />}
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={<ComingSoonPage title="Page Not Found" phase="Navigation" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
