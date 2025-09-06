import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Información de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/flash-lines copy.ico" alt="5slim.do" className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">5slim.do</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu tienda de tecnología de confianza en República Dominicana. 
              Ofrecemos los mejores productos tecnológicos con garantía y servicio excepcional.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/5slim.do" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>República Dominicana</p>
                  <p>Santo Domingo</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="tel:+18095551234" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +1 (809) 555-1234
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <a href="mailto:info@5slim.do" className="text-sm text-gray-400 hover:text-white transition-colors">
                  info@5slim.do
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>Lun - Vie: 9:00 AM - 6:00 PM</p>
                  <p>Sáb: 9:00 AM - 2:00 PM</p>
                  <p>Dom: Cerrado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enlaces rápidos</h3>
            <div className="space-y-2">
              <Link href="/productos" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Productos
              </Link>
              <Link href="/categorias" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Categorías
              </Link>
              <Link href="/marcas" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Marcas
              </Link>
              <Link href="/ofertas" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Ofertas
              </Link>
              <Link href="/nosotros" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Nosotros
              </Link>
              <Link href="/contacto" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicios</h3>
            <div className="space-y-2">
              <Link href="/envios" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Envíos a domicilio
              </Link>
              <Link href="/garantia" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Garantía extendida
              </Link>
              <Link href="/soporte" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Soporte técnico
              </Link>
              <Link href="/financiamiento" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Financiamiento
              </Link>
              <Link href="/instalacion" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Instalación
              </Link>
              <Link href="/reparacion" className="block text-sm text-gray-400 hover:text-white transition-colors">
                Reparación
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-400">
            <div>
              <h4 className="font-semibold text-white mb-2">Métodos de pago</h4>
              <p>Efectivo, Tarjetas de crédito/débito, Transferencias bancarias</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Envíos</h4>
              <p>Entrega gratuita en Santo Domingo. Envíos a todo el país disponibles.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Garantía</h4>
              <p>Todos nuestros productos incluyen garantía del fabricante.</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2024 5slim.do. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-sm text-gray-400 hover:text-white transition-colors">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-gray-400 hover:text-white transition-colors">
              Términos y condiciones
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}