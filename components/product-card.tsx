import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { baseService } from '@/app/utils/baseService';
import AddToCartButton from './add-to-cart-button';
import { IArticlePublic } from '@/api/src/interfaces';


export default function ProductCard({product}: {product: IArticlePublic}) {
  return (
    <div className="group bg-white dark:bg-gray-800 overflow-hidden flex flex-col" style={{ minHeight: '390px', height: '390px', maxHeight: '390px' }}>
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <Image
              src={product.images.find(item=>item.primary === true)?.url!}
              alt={product.description}
              width={300}
              height={300}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              OFERTA
            </div>
          )} */}
          {/* {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-medium">Agotado</span>
            </div>
          )} */}
          <AddToCartButton product={product} />
        </div>

        <div className="p-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex-1 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {5}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 text-base" title={product.shortDescription}>
            {product.shortDescription}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2" title={product.description}>
            {product.description}
          </p>

          <div className="flex items-center space-x-2">
            <span className="text-md font-bold text-gray-900 dark:text-white">
              {baseService.dominicanNumberFormat(product.price)}
            </span>
          </div>
        </div>
      </div>
  );
}