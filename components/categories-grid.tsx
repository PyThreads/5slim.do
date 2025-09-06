import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getPublicCategories() {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/public`);
    return response.data.data;
  } catch (error) {
    console.warn('API not available during build, using fallback data');
    return [];
  }
}

export default async function CategoriesGrid() {
  const categories = await getPublicCategories();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explora por categorías
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Encuentra exactamente lo que necesitas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category: any) => (
            <Link
              key={category._id}
              href={`/products?category=${category.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-center">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {category.icon ? (
                    <div className="w-16 h-16 relative">
                      <Image
                        src={category.icon}
                        alt={category.description}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl text-gray-400">🏷️</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {category.description}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}