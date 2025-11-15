'use client';

import React, { useState, useMemo } from 'react';
import { Heart, Bookmark, Star } from 'lucide-react';
import { usePesantren } from '@/hooks/usePesantren';
import { Pesantren } from '@/types';
import { Button } from '@/components/ui';

const PortalSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('Terekomendasi');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch pesantren data with pagination
  const { data: pesantrenResponse, isLoading, error, refetch } = usePesantren({
    page: currentPage,
    limit: itemsPerPage,
    search: '',
    program: selectedCategory !== 'Terekomendasi' ? (
      selectedCategory === 'Pondok Putra' ? 'Putra' :
      selectedCategory === 'Pondok Putri' ? 'Putri' :
      selectedCategory === 'Pondok Campuran' ? 'Campuran' :
      selectedCategory === 'Pondok ABK' ? 'ABK' : ''
    ) : ''
  });

  const categories = [
    'Terekomendasi',
    'Pondok Putra',
    'Pondok Putri',
    'Pondok Campuran',
    'Pondok ABK'
  ];

  // Get pesantren data from API response
  const pesantrenData = pesantrenResponse?.data || [];
  const totalPages = pesantrenResponse?.pagination?.totalPages || 1;
  const totalItems = pesantrenResponse?.pagination?.total || 0;

  // Fallback data for when API is loading or fails
  const fallbackData: Pesantren[] = useMemo(() => [
    {
      id: '1',
      name: 'Pondok Pesantren Al-Hikmah',
      description: 'Pesantren modern dengan kurikulum terpadu yang menggabungkan pendidikan agama dan umum.',
      address: 'Jl. Raya Malang No. 123',
      location: 'Malang, Jawa Timur',
      programs: ['Putra', 'Putri'],
      fees: { monthly: 2500000, registration: 500000 },
      rating: 4.8,
      students: 850,
      facilities: ['Asrama', 'Masjid', 'Perpustakaan', 'Lab Komputer'],
      image: '/pesantren-1.svg',
      images: ['/pesantren-1.svg', '/pesantren-modern-1.svg'],
      contact: { phone: '0341-123456', email: 'info@alhikmah.ac.id' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Pondok Pesantren Darul Ulum',
      description: 'Pesantren salaf dengan tradisi keilmuan yang kuat dan sistem pendidikan 24 jam.',
      address: 'Jl. Pesantren Darul Ulum',
      location: 'Jombang, Jawa Timur',
      programs: ['Putra'],
      fees: { monthly: 1800000, registration: 300000 },
      rating: 4.9,
      students: 1200,
      facilities: ['Asrama', 'Masjid', 'Perpustakaan'],
      image: '/pesantren-2.svg',
      images: ['/pesantren-2.svg', '/pesantren-traditional.svg'],
      contact: { phone: '0321-654321', email: 'info@darululum.ac.id' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Pondok Pesantren An-Nur',
      description: 'Pesantren putri dengan fokus pada pengembangan karakter dan keterampilan hidup.',
      address: 'Jl. Yogya-Solo KM 15',
      location: 'Yogyakarta',
      programs: ['Putri'],
      fees: { monthly: 2200000, registration: 400000 },
      rating: 4.7,
      students: 650,
      facilities: ['Asrama', 'Masjid', 'Perpustakaan', 'Lab Bahasa'],
      image: '/pesantren-3.svg',
      images: ['/pesantren-3.svg', '/pesantren-contemporary.svg'],
      contact: { phone: '0274-987654', email: 'info@annur.ac.id' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ], []);

  // Use fallback data when loading or error
  const displayData = isLoading || error ? fallbackData : pesantrenData;

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(bookmark => bookmark !== id)
        : [...prev, id]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const PesantrenCardComponent = ({ pesantren }: { pesantren: Pesantren }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200">
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded"></div>
          </div>
        </div>
        
        {/* Bookmark icon */}
        <div className="absolute top-3 right-3">
          <div className="w-8 h-10 bg-yellow-400 relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-yellow-400"></div>
          </div>
        </div>
        
        {/* Heart and Bookmark buttons */}
        <div className="absolute top-3 left-3 flex gap-2">
          <button
            onClick={() => toggleFavorite(pesantren.id)}
            className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                favorites.includes(pesantren.id)
                  ? 'fill-red-500 text-red-500'
                  : 'text-white'
              }`}
            />
          </button>
          <button
            onClick={() => toggleBookmark(pesantren.id)}
            className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
          >
            <Bookmark
              className={`w-4 h-4 ${
                bookmarks.includes(pesantren.id)
                  ? 'fill-blue-500 text-blue-500'
                  : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{pesantren.name}</h3>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-gray-400" />
            <Bookmark className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {pesantren.programs.join(', ')}
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {pesantren.location}
          </span>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {renderStars(pesantren.rating)}
          <span className="text-sm text-gray-600 ml-1">{pesantren.rating}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {pesantren.description}
        </p>
        
        <button 
          onClick={() => {
            // Navigate to detail page without pesantren ID
            router.push('/pesantren/detail');
          }}
          className="w-full bg-[#042558] text-white py-2.5 px-4 rounded-full font-medium hover:bg-[#031a3d] transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Kunjungi Pesantren</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Gagal memuat data pesantren</p>
            <Button onClick={() => refetch()} variant="outline">
              Coba Lagi
            </Button>
          </div>
        )}

        {/* Pesantren Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayData.map((pesantren) => (
              <PesantrenCardComponent key={pesantren.id} pesantren={pesantren} />
            ))}
          </div>
        )}

        {/* No Data State */}
        {!isLoading && !error && displayData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Tidak ada pesantren ditemukan</p>
            <Button onClick={() => setSelectedCategory('Terekomendasi')} variant="outline">
              Reset Filter
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              ←
            </button>
            
            {/* Dynamic page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = index + 1;
              } else if (currentPage <= 3) {
                pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + index;
              } else {
                pageNumber = currentPage - 2 + index;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="text-gray-500">...</span>
            )}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              →
            </button>
            
            {/* Page info */}
            <div className="ml-4 text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages} ({totalItems} pesantren)
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortalSection;