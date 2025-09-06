'use client';

import React from 'react';
import { products } from '@/data/products';
import ProductCard from './product-card';

export default function FeaturesSection() {
  // Get the latest 6 products (assuming higher IDs are newer)
  const latestProducts = products
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 6);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Últimos productos agregados
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre las últimas novedades en tecnología y los productos más recientes de nuestro catálogo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}