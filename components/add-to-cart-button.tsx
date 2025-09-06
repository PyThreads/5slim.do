'use client';

import React from 'react';
import { CartProvider, useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';
import { IArticlePublic } from '@/api/src/interfaces';


function AddToCartButtonContent({ product }: { product: IArticlePublic }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-blue-600 hover:text-white disabled:bg-gray-400 text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg disabled:cursor-not-allowed group/btn"
    >
      <ShoppingCart className="w-5 h-5 " />
    </button>
  );
}

export default function AddToCartButton({ product }: { product: IArticlePublic }) {
  return (
    <CartProvider>
      <AddToCartButtonContent product={product} />
    </CartProvider>
  );
}