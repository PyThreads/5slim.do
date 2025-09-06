import React from 'react';
import ProductCard from './product-card';
import axios from 'axios';
import { IArticlePublic } from '@/api/src/interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeaturedProducts(): Promise<IArticlePublic[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles/featured`);
    const articles = response.data.data || [];
    return articles;
  } catch (_) {
    return [];
  }
}

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Productos destacados
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Descubre nuestros productos más populares y las últimas innovaciones tecnológicas
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-none">
          {featuredProducts.map((product: IArticlePublic) => (
            <div key={product._id} className="scale-90">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}