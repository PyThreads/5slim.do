'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <>
      {isSubscribed ? (
        <div className="flex items-center justify-center space-x-2 text-white">
          <CheckCircle className="w-6 h-6 text-green-300" />
          <span className="text-lg font-medium">¡Gracias por suscribirte!</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-white/30 bg-white/90 dark:bg-white/80 text-gray-900 placeholder-gray-600 font-medium"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              Suscribirse
            </button>
          </div>
          <p className="text-blue-100 dark:text-blue-200 text-sm mt-4">
            No spam. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </form>
      )}
    </>
  );
}