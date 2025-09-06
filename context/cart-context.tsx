'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { CartContextType } from '@/types/product';
import { EVENTBUS, IArticlePublic, ICart } from '@/api/src/interfaces';
import { cartService } from '@/data/cartService';
import { eventBus } from '@/app/utils/broadcaster';

const CartContext = createContext<CartContextType | undefined>(undefined);


export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICart[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {

    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      const cartItems = await cartService.getCart();
      setCart(cartItems)
    }

    loadCart();

    const hola = (data:any) => {
      setCart(data)
    }

    eventBus.on(EVENTBUS.UPDATE_CART, hola)

    return () => {
      eventBus.off(EVENTBUS.UPDATE_CART, hola);
    };

  }, [setCart]);

  const addToCart = (product: IArticlePublic) => {
    cartService.addToCart({ product })
      .then((updatedCart) => {
        setCart(updatedCart);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const removeFromCart = (productId: string) => {
    cartService.removeFromCart({ productId }).then((updatedCart) => {
      setCart(updatedCart);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    cartService.updateQuantity({ productId, quantity }).then((updatedCart) => {
      setCart(updatedCart);
    });
  };

  const clearCart = () => {
    cartService.clearCart().then(() => {
      setCart([]);
    });
  };

  const getTotalPrice = () => {
    return cartService.getTotalPrice(cart);
  };

  const getTotalItems = () => {
    return cartService.getTotalItems(cart);
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}