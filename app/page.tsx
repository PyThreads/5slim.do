import React from 'react';
import ImageCarousel from '@/components/image-carousel';
import FeaturedProducts from '@/components/featured-products';
import CategoriesGrid from '@/components/categories-grid';
import FeaturesSection from '@/components/features-section';
import TestimonialsSection from '@/components/testimonials-section';
import BrandsSection from '@/components/brands-section';
import NewsletterSection from '@/components/newsletter-section';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ImageCarousel />
      <FeaturedProducts />
      <CategoriesGrid />
      <FeaturedProducts />
      <BrandsSection />
      {/* <TestimonialsSection /> */}
      <NewsletterSection />
    </main>
  );
}