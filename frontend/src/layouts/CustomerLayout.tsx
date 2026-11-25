import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { AuthRequiredModal } from '@/components/common/AuthRequiredModal';
import { useLenis } from '@/hooks/useLenis';

export const CustomerLayout: React.FC = () => {
  useLenis();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
        }
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-coffee-cream text-coffee-dark flex flex-col justify-between selection:bg-coffee-orange selection:text-white">
      <Navbar />
      <CartDrawer />
      <AuthRequiredModal />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
