import React from 'react';
import Image from 'next/image';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getPublicBrands() {
  try {
    const response = await axios.get(`${API_BASE_URL}/brands/public`);
    return response.data.data;
  } catch (error) {
    console.warn('API not available during build, using fallback data');
    return [];
  }
}

export default async function BrandsSection() {
  const brands = await getPublicBrands();

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Marcas de confianza
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Trabajamos con las mejores marcas del mercado
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {brands.map((brand: any) => (
            <div key={brand._id} className="group">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 text-center">
                <div className="mb-2 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                  {brand.icon ? (
                    <div className="w-12 h-12 relative">
                      <Image
                        src={brand.icon}
                        alt={brand.description}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-xl text-gray-400">🏷️</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                  {brand.description}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}