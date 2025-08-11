import React from 'react';
import { Card, CardContent, CardFooter, Button } from '@/components/ui';
import { Pesantren } from '@/types';

// Helper function to format numbers with thousand separators
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
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
  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(pesantren);
    } else {
      // Default action - could navigate to detail page
      console.log('View detail for:', pesantren.name);
    }
  };

  if (variant === 'compact') {
    return (
      <Card 
        hover 
        padding="md" 
        className={`relative ${className}`}
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
      </Card>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Image Section with Icons */}
      <div className="relative h-64 bg-gray-300">
        {/* Building Icon - Top Left */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-black rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z"/>
            <rect x="8" y="10" width="2" height="2" fill="white"/>
            <rect x="10" y="10" width="2" height="2" fill="white"/>
            <rect x="12" y="10" width="2" height="2" fill="white"/>
            <rect x="14" y="10" width="2" height="2" fill="white"/>
            <rect x="8" y="12" width="2" height="2" fill="white"/>
            <rect x="10" y="12" width="2" height="2" fill="white"/>
            <rect x="12" y="12" width="2" height="2" fill="white"/>
            <rect x="14" y="12" width="2" height="2" fill="white"/>
          </svg>
        </div>
        
        {/* Bookmark Icon - Top Right */}
        <div className="absolute top-4 right-4">
          <div className="w-8 h-12 bg-yellow-400 relative" style={{clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 70%, 0 85%)'}}>
            <svg className="w-4 h-4 text-yellow-600 absolute top-2 left-1/2 transform -translate-x-1/2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title and Action Icons */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex-1 pr-4">
            {pesantren.name}
          </h3>
          <div className="flex items-center space-x-3">
            {/* Heart Icon */}
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Bookmark Icon */}
            <button className="text-gray-400 hover:text-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <span>📍 {pesantren.location}</span>
          {pesantren.programs.length > 0 && (
            <>
              <span className="mx-2">|</span>
              <span>{pesantren.programs.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              className={`w-5 h-5 fill-current ${
                star <= Math.floor(pesantren.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`} 
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
          <span className="ml-2 text-gray-900 font-semibold">{pesantren.rating.toFixed(1)}</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {pesantren.description || 'Deskripsi pesantren tidak tersedia.'}
        </p>
        
        {/* Students Count */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <span>👥 {formatNumber(pesantren.students)} santri</span>
          {pesantren.fees && (
            <>
              <span className="mx-2">|</span>
              <span>💰 Rp {formatNumber(pesantren.fees.monthly)}/bulan</span>
            </>
          )}
        </div>
        
        {/* Visit Button */}
        <button 
          onClick={handleViewDetail}
          className="w-full bg-[#042558] text-white py-3 px-6 rounded-full font-medium hover:bg-[#031a3d] transition-colors flex items-center justify-center space-x-2"
        >
          <span>Kunjungi Pesantren</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}