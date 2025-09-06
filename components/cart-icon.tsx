'use client';

import React from 'react';
import Link from 'next/link';
import { CartProvider, useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';

function CartIconContent() {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartItemsCount}
        </span>
      )}
    </Link>
  );
}

export default function CartIcon() {
  return (
    <CartProvider>
      <CartIconContent />
    </CartProvider>
  );
}