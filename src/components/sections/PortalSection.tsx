'use client';

import React, { useState } from 'react';
import { Heart, Bookmark, Star } from 'lucide-react';

interface PesantrenCard {
  id: number;
  name: string;
  type: string;
  category: string;
  rating: number;
  description: string;
  image: string;
  isFavorited: boolean;
  isBookmarked: boolean;
}

const PortalSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('Terekomendasi');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    'Terekomendasi',
    'Pondok Putra',
    'Pondok Putri',
    'Pondok Campuran',
    'Pondok ABK'
  ];

  const pesantrenData: PesantrenCard[] = [
    {
      id: 1,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 2,
      name: 'Nama Pondok Pesantren',
      type: 'Modern Salaf',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 3,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 4,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 5,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 6,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 7,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 8,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    },
    {
      id: 9,
      name: 'Nama Pondok Pesantren',
      type: 'Boarding School',
      category: 'Pondok Putri',
      rating: 5.0,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt pharetra elit etiam cursus orci in. Id sed montes.',
      image: '/placeholder-pesantren.jpg',
      isFavorited: false,
      isBookmarked: false
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  const toggleBookmark = (id: number) => {
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

  const PesantrenCard = ({ pesantren }: { pesantren: PesantrenCard }) => (
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
            {pesantren.type}
          </span>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {pesantren.category}
          </span>
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {renderStars(pesantren.rating)}
          <span className="text-sm text-gray-600 ml-1">{pesantren.rating}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {pesantren.description}
        </p>
        
        <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-full hover:bg-blue-800 transition-colors duration-200">
          Kunjungi Pesantren
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

        {/* Pesantren Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pesantrenData.map((pesantren) => (
            <PesantrenCard key={pesantren.id} pesantren={pesantren} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            disabled={currentPage === 1}
          >
            ←
          </button>
          
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-blue-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <span className="text-gray-500">...</span>
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PortalSection;