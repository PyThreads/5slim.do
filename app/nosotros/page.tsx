import React from 'react';
import { Shield, Truck, Headphones, Award } from 'lucide-react';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Sobre 5slim.do
          </h1>
          <p className="text-xl lg:text-2xl max-w-3xl mx-auto">
            Tu tienda de tecnología de confianza en República Dominicana
          </p>
        </div>
      </div>

      {/* Nuestra Historia */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Nuestra Historia
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                5slim.do nació con la visión de democratizar el acceso a la tecnología en República Dominicana. 
                Desde nuestros inicios, nos hemos comprometido a ofrecer productos de calidad a precios justos.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Especializados en dispositivos móviles, accesorios tecnológicos y productos innovadores, 
                hemos construido una reputación sólida basada en la confianza y satisfacción de nuestros clientes.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Nuestro equipo está formado por expertos apasionados por la tecnología, siempre listos 
                para asesorarte y encontrar la solución perfecta para tus necesidades.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img src="/flash-lines copy.ico" alt="5slim.do" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  5slim.do
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tecnología al alcance de todos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestros Valores */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Los principios que nos guían cada día
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confianza
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Productos originales con garantía completa del fabricante
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Entrega Rápida
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Envíos seguros y rápidos a todo el territorio nacional
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Soporte 24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Atención personalizada antes, durante y después de tu compra
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Calidad
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Solo trabajamos con las mejores marcas del mercado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Misión y Visión */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nuestra Misión
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Facilitar el acceso a la tecnología más avanzada en República Dominicana, 
                ofreciendo productos de calidad, precios competitivos y un servicio excepcional 
                que supere las expectativas de nuestros clientes.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Nuestra Visión
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ser la tienda de tecnología líder en República Dominicana, reconocida por 
                nuestra innovación, confiabilidad y compromiso con la satisfacción del cliente, 
                conectando a las personas con la tecnología que mejora sus vidas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}