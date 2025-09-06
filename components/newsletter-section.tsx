import React from 'react';
import { Mail } from 'lucide-react';
import NewsletterForm from './newsletter-form';

export default function NewsletterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Mantente al día con las últimas ofertas
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe descuentos exclusivos, lanzamientos de productos y noticias tecnológicas
          </p>
        </div>

        <NewsletterForm />
      </div>
    </section>
  );
}