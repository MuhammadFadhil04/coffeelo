import React from 'react';
import { HeroSection } from '@/components/customer/HeroSection';
import { BrandStorySection } from '@/components/customer/BrandStorySection';
import { FeaturedProductsSection } from '@/components/customer/FeaturedProductsSection';
import { ProductShowcaseBanner } from '@/components/customer/ProductShowcaseBanner';
import { TestimonialsSection } from '@/components/customer/TestimonialsSection';
import { LocationSection } from '@/components/customer/LocationSection';
import { OrderCtaSection } from '@/components/customer/OrderCtaSection';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Filosofi & Sumber Biji Kopi */}
      <BrandStorySection />

      {/* 3. Katalog Menu Kopi Unggulan */}
      <FeaturedProductsSection />

      {/* 4. Koleksi Menu Andalan */}
      <ProductShowcaseBanner />

      {/* 5. Ulasan Tamu & Filter Bintang 1-5 */}
      <TestimonialsSection />

      {/* 6. Lokasi Gerai & Peta */}
      <LocationSection />

      {/* 7. Ajakan Pesan Terpisah dari Footer */}
      <OrderCtaSection />
    </div>
  );
};

export default HomePage;
