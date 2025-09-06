'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, User } from 'lucide-react';
import NavbarSearch from './navbar-search';

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: '', href: '/', icon: Home },
  ];

  return (
    <>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-gray-700 dark:text-gray-300"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 absolute top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-40">
          {/* Search Bar - Mobile */}
          <div className="mb-4 px-4">
            <NavbarSearch />
          </div>

          <div className="flex flex-col space-y-4 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {item.name && <span>{item.name}</span>}
                </Link>
              );
            })}
            
            <Link
              href="/account"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="w-4 h-4" />
              <span>Mi cuenta</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}