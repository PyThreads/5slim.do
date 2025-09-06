'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CartProvider, useCart } from '@/context/cart-context';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart, Gift, Truck, Shield, CreditCard, Star, Tag } from 'lucide-react';
import { baseService } from '../utils/baseService';
import { cartService } from '@/data/cartService';

function CartPageContent() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [message, setMessage] = useState('');
  const total = getTotalPrice();
  const discount = appliedPromo ? total * 0.1 : 0;
  const subtotal = total - discount;

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number, maxStock: number) => {
    if (newQuantity > maxStock) {
      showMessage(`Stock insuficiente. Solo hay ${maxStock} unidades disponibles.`);
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'descuento10') {
      setAppliedPromo(true);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              ¡Descubre productos increíbles y comienza tu experiencia de compra!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articulos"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                Explorar productos
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all duration-300"
              >
                Volver al inicio
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Envío gratis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">En pedidos superiores a $50</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Compra segura</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Protección garantizada</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ofertas especiales</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Descuentos exclusivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        {/* Message Alert */}
        {message && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">
              {message}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Carrito de compras
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={clearCart}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium text-xs sm:text-sm">Vaciar carrito</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-3 sm:space-x-6">
                  <div className="flex-shrink-0 relative group">
                    <Image
                      src={item.article.images.find(item=>item.primary)?.url!}
                      alt={item.article.description}
                      width={120}
                      height={120}
                      className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.article.description}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-1 sm:space-y-0">
                          <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full w-fit">
                            {item.article.brand || "N/A"}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">4.8</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 hidden sm:block">
                          {item.article.shortDescription || 'Producto de alta calidad con excelentes características'}
                        </p>
                      </div>
                      <button
                        onClick={() => cartService.addToCart({product: item.article})}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.article._id, item.article.stock - 1, item.article.originalStock || 10)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <span className="font-bold text-gray-900 dark:text-white min-w-[1.5rem] sm:min-w-[2rem] text-center text-sm sm:text-base">
                            {item.article.stock}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.article._id, item.article.stock + 1, item.article.originalStock || 10)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                          En stock
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          {baseService.dominicanNumberFormat((item.article.price * item.article.stock))}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {baseService.dominicanNumberFormat(item.article.price)} c/u
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Recommended Products */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">
                ¿Te interesa algo más?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                Productos recomendados basados en tu selección
              </p>
              <Link
                href="/articulos"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-xs sm:text-sm"
              >
                Ver recomendaciones
                <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Promo Code */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm">Código promocional</span>
              </h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Ingresa tu código"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                >
                  Aplicar
                </button>
              </div>
              {appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    ¡Código aplicado! 10% de descuento
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
                Resumen del pedido
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cart.length} productos)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {baseService.dominicanNumberFormat(total)}
                  </span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400">Descuento (10%)</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      -{baseService.dominicanNumberFormat(discount)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                  </div>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Gratis
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Impuestos (ITBIS 18%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {baseService.dominicanNumberFormat(subtotal * 0.18)}
                  </span>
                </div>
                
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {baseService.dominicanNumberFormat(subtotal + subtotal * 0.18)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Incluye impuestos y envío
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-4 sm:mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceder al pago</span>
                </Link>
                
                <Link
                  href="/articulos"
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm"
                >
                  <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Continuar comprando</span>
                </Link>
              </div>

              {/* Security Features */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="flex flex-col items-center">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Pago seguro</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Envío rápido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageContent />
    </CartProvider>
  );
}