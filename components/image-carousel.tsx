import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { ICarouselSlide } from '@/api/src/interfaces';
import { baseService } from '@/app/utils/baseService';
import CarouselControls from './carousel-controls';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function getSlides() {
  try {
    const response = await axios.get(`${API_BASE_URL}/carouselStore/public`);
    const slidesData = response.data.data.list || [];
    return slidesData.map((slide: any) => ({
      ...slide,
      id: slide._id.toString()
    }));
  } catch (error) {
    console.error('Error fetching slides:', error);
    return [];
  }
}

export default async function ImageCarousel() {
  const slides = await getSlides();

  if (slides.length === 0) {
    return (
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center">
          <div className="text-white text-xl">No hay slides disponibles</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 overflow-hidden">
      <div className="relative h-[70vh] min-h-[500px]">
        <CarouselControls slidesCount={slides.length}>
          {slides.map((slide: ICarouselSlide) => (
            <div key={slide._id} className="flex-[0_0_100%] relative">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl ml-0 lg:ml-8">
                      <div className="space-y-6">
                        <div>
                          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
                            {slide.title}
                          </h1>
                          <p className="text-xl text-gray-200 leading-relaxed mb-6">
                            {slide.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 mb-8">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-white">
                              {baseService.dominicanNumberFormat(slide.price)}
                            </span>
                            {slide.originalPrice && slide.originalPrice > 0 && (
                              <>
                                <span className="text-xl text-gray-400 line-through">
                                  {baseService.dominicanNumberFormat(slide.originalPrice)}
                                </span>
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                  OFERTA
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 group text-sm"
                          >
                            <ShoppingBag className="mr-2 w-4 h-4 group-hover:animate-bounce" />
                            {slide.buttonText}
                          </Link>
                          <Link
                            href="/articulos"
                            className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-all duration-300 text-sm"
                          >
                            Ver Todos los Artículos
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CarouselControls>
      </div>
    </div>
  );
}