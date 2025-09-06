'use client';

import React from 'react';
import Link from 'next/link';
import { CartProvider, useCart } from '@/context/cart-context';
import { ShoppingCart } from 'lucide-react';

function MobileCartIconContent() {
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  return (
    <Link
      href="/cart"
      className="relative p-2 text-gray-700 dark:text-gray-300"
    >
      <ShoppingCart className="w-5 h-5" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {cartItemsCount}
        </span>
      )}
    </Link>
  );
}

export default function MobileCartIcon() {
  return (
    <CartProvider>
      <MobileCartIconContent />
    </CartProvider>
  );
}