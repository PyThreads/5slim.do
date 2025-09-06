import React from 'react';
import { products } from '@/data/products';
import ProductCard from './product-card';

export default function ProductCarousel() {
  const latestProducts = products.slice(8, 20); // Diferentes productos que los destacados

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Últimos agregados
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explora nuestra selección más reciente de productos tecnológicos y encuentra las mejores ofertas
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-none">
          {latestProducts.slice(0, 12).map((product) => (
            <div key={product.id} className="scale-90">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}