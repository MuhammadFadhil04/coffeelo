import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/customer/Navbar';
import { Footer } from '@/components/customer/Footer';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useLenis } from '@/hooks/useLenis';

export const CustomerLayout: React.FC = () => {
  // Initialize Lenis smooth scroll
  useLenis();

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-coffee-cream text-coffee-dark flex flex-col justify-between selection:bg-coffee-orange selection:text-white">
      <Navbar />
      <CartDrawer />
      <main className="flex-1 w-full min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
