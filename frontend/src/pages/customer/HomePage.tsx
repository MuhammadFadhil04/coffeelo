import React from 'react';
import { HeroSection } from '@/components/customer/HeroSection';
import { BrandStorySection } from '@/components/customer/BrandStorySection';
import { FeaturedProductsSection } from '@/components/customer/FeaturedProductsSection';
import { ProductShowcaseBanner } from '@/components/customer/ProductShowcaseBanner';
import { TestimonialsSection } from '@/components/customer/TestimonialsSection';
import { LocationSection } from '@/components/customer/LocationSection';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* 1. Hero Section with Iced Coffee & Splash */}
      <HeroSection />

      {/* 2. Brand Story & Ethiopian Grains Sourcing */}
      <BrandStorySection />

      {/* 3. Featured 6-Product Coffee Grid with Order Actions */}
      <FeaturedProductsSection />

      {/* 4. Signature Recipe Showcase (Macchiato, Mocha, Raf, Pour-over) */}
      <ProductShowcaseBanner />

      {/* 5. Customer Testimonials & Cup Visual */}
      <TestimonialsSection />

      {/* 6. Where are We / Flagship Store & Stylized Map */}
      <LocationSection />
    </div>
  );
};

export default HomePage;
