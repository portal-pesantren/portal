'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, Button } from '@/components/ui';
import { Pesantren } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/modals/AuthModal';
import { School } from 'lucide-react';

// Helper function to format numbers with thousand separators
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Helper function to get pesantren image based on ID or name
const getPesantrenImage = (pesantren: Pesantren): string => {
  // Array of available pesantren images
  const pesantrenImages = [
    '/pesantren-1.svg',
    '/pesantren-2.svg',
    '/pesantren-3.svg',
    '/pesantren-contemporary.svg',
    '/pesantren-modern-1.svg',
    '/pesantren-modern-2.svg',
    '/pesantren-traditional.svg'
  ];

  // If pesantren already has an image and it's one of our available images, use it
  if (pesantren.image && pesantrenImages.includes(pesantren.image)) {
    return pesantren.image;
  }

  // Generate image based on pesantren ID or name hash
  const identifier = pesantren.id || pesantren.name || '';
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value and modulo to get index
  const imageIndex = Math.abs(hash) % pesantrenImages.length;
  return pesantrenImages[imageIndex];
};

interface PesantrenCardProps {
  pesantren: Pesantren;
  onViewDetail?: (pesantren: Pesantren) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export default function PesantrenCard({ 
  pesantren, 
  onViewDetail, 
  className = '',
  variant = 'default'
}: PesantrenCardProps) {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleViewDetail = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Navigate to detail page without pesantren ID
    if (typeof window !== 'undefined') {
      window.location.href = '/pesantren/detail';
    }
  };

  if (variant === 'compact') {
    return (
      <Card 
        variant="outlined"
        padding="md" 
        className={`relative border-0 shadow-none ${className}`}
        onClick={handleViewDetail}
      >
        {pesantren.featured && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ Unggulan
            </span>
          </div>
        )}
        
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-[#042558] line-clamp-2 flex-1">
              {pesantren.name}
            </h3>
            <div className="flex items-center ml-2">
              <span className="text-yellow-400 mr-1">⭐</span>
              <span className="text-sm font-medium text-gray-600">
                {pesantren.rating}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">
              📍 {pesantren.location}
            </p>
          
          <p className="text-gray-600 text-sm">
              👥 {formatNumber(pesantren.students)} santri
            </p>
        </CardContent>
        
        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </Card>
    );
  }

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${className}`}>
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        {/* Pesantren Image */}
        <img 
          src={getPesantrenImage(pesantren)} 
          alt={pesantren.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-pesantren.jpg';
          }}
        />
        
        {/* School Icon - Top Left */}
        <div className="absolute top-3 left-3 w-10 h-10 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
          <School className="w-5 h-5 text-white" />
        </div>
        
        {/* Featured Badge - Top Right */}
        {pesantren.featured && (
          <div className="absolute top-3 right-3">
            <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Unggulan
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Title and Action Icons */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 pr-2 line-clamp-2">
            {pesantren.name}
          </h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Heart Icon */}
            <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Bookmark Icon */}
            <button className="text-gray-400 hover:text-blue-500 transition-colors p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Category and Location */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
              Boarding School
            </span>
            <span>📍 {pesantren.location}</span>
          </div>
          {pesantren.programs.length > 0 && (
            <div className="text-gray-500 text-xs">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ✓ Terverifikasi
              </span>
            </div>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              className={`w-4 h-4 fill-current ${
                star <= Math.floor(pesantren.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`} 
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
          <span className="ml-2 text-gray-900 font-semibold text-sm">{pesantren.rating.toFixed(1)}</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {pesantren.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'}
        </p>
        
        {/* Visit Button */}
        <button 
          onClick={handleViewDetail}
          className="w-full bg-[#042558] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#031a3d] transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <span>Kunjungi Pesantren</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}