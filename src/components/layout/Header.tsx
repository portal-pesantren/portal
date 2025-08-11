'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('eksplor');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-[#042558]">Portal Pesantren</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#eksplor" 
              onClick={() => handleMenuClick('eksplor')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'eksplor' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Eksplor
            </a>
            <a 
              href="#berita" 
              onClick={() => handleMenuClick('berita')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'berita' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Berita
            </a>
            <a 
              href="#tentang-kami" 
              onClick={() => handleMenuClick('tentang-kami')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'tentang-kami' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Tentang kami
            </a>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/register" className="bg-[#042558] hover:bg-[#031a3d] text-white px-6 py-2 rounded-full transition-colors font-medium inline-block">
              Daftar
            </Link>
            <Link href="/login" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-full transition-colors font-medium inline-block">
              Masuk
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-[#042558] p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a 
                href="#eksplor" 
                onClick={() => handleMenuClick('eksplor')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'eksplor' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Eksplor
              </a>
              <a 
                href="#berita" 
                onClick={() => handleMenuClick('berita')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'berita' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Berita
              </a>
              <a 
                href="#tentang-kami" 
                onClick={() => handleMenuClick('tentang-kami')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'tentang-kami' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Tentang kami
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/register" className="bg-[#042558] hover:bg-[#031a3d] text-white px-4 py-2 rounded-full transition-colors font-medium text-center">
                  Daftar
                </Link>
                <Link href="/login" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium text-center">
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}