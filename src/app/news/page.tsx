'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNews, useLatestNews, type NewsItem } from '@/hooks/useNews';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

// Menggunakan tipe NewsItem dari hook untuk konsistensi

// Data dari hook useNews sudah ditransformasi, tidak perlu transform ulang

// Category mapping for display
const categoryMapping: Record<string, string> = {
  'berita': 'Berita',
  'pengumuman': 'Pengumuman',
  'kegiatan': 'Kegiatan',
  'prestasi': 'Prestasi',
  'artikel': 'Artikel'
};

const defaultCategories = [
  { value: '', label: 'Semua Kategori' },
  { value: 'berita', label: 'Berita' },
  { value: 'pengumuman', label: 'Pengumuman' },
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'prestasi', label: 'Prestasi' },
  { value: 'artikel', label: 'Artikel' }
];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState(defaultCategories);

  // Fetch news data
  const { 
    data: newsResponse, 
    isLoading, 
    isError, 
    error 
  } = useNews({
    search: searchTerm,
    category: selectedCategory,
    page: currentPage,
    limit: 12,
    featured: false
  });

  // Fallback: ambil latest news jika tidak cukup item untuk section tertentu
  const { data: latestNews } = useLatestNews(4);

  const allNews = (newsResponse?.data ?? []) as NewsItem[];
  const featuredItems: NewsItem[] = allNews.slice(0, 2);
  const popularItems: NewsItem[] = allNews.slice(featuredItems.length, featuredItems.length + 4);
  const pesantrenStart = featuredItems.length + popularItems.length;
  const pesantrenItems: NewsItem[] = (allNews.slice(pesantrenStart, pesantrenStart + 4).length > 0)
    ? (allNews.slice(pesantrenStart, pesantrenStart + 4) as NewsItem[])
    : ((latestNews ?? []) as NewsItem[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Baca Berita dan temukan informasi menarik
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Dapatkan informasi terkini seputar dunia pesantren, pendidikan Islam, dan perkembangan santri di seluruh Indonesia
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
      </section>



      {/* Featured News Section */}
      <section className="py-16 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <ErrorMessage 
              message="Gagal memuat berita. Silakan coba lagi nanti." 
              onRetry={() => window.location.reload()}
            />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {featuredItems.map((news: NewsItem, index: number) => (
                  <Link key={news.id} to={`/news/${news.id}`} className="group">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                      <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src={news.featuredImage || `https://picsum.photos/600/400?random=${index + 1}`}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNzUgMTUwSDMyNVYyNTBIMjc1VjE1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-6 left-6">
                          <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            {categoryMapping[news.category] || news.category}
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors">
                            {news.title}
                          </h3>
                          <div className="flex items-center gap-3 text-white/80 text-sm">
                            <span>{new Date(news.publishedAt).toLocaleDateString('id-ID')}</span>
                            <span>•</span>
                            <span>{news.readingTime || 3} menit baca</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={news.author?.avatar || '/api/placeholder/40/40'}
                              alt={news.author?.name || 'Penulis'}
                              className="w-10 h-10 rounded-full border-2 border-gray-200"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              {news.author?.name || 'Anonim'}
                            </span>
                          </div>
                          <span className="text-blue-600 text-sm font-semibold group-hover:text-blue-800 transition-colors flex items-center gap-1">
                            Baca Selengkapnya 
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Sections - Side by Side Layout */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Berita Popular Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Berita Popular</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {popularItems.map((news: NewsItem, index: number) => (
                  <Link key={news.id} to={`/news/${news.id}`} className="group">
                    <article className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={news.featuredImage || `https://picsum.photos/200/200?random=${index + 10}`}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3NUgxMTBWMTI1SDkwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{new Date(news.publishedAt).toLocaleDateString('id-ID')}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">{categoryMapping[news.category] || news.category}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                          {news.title}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {news.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* Berita Pondok Pesantren Section */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Berita Pondok Pesantren</h2>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {pesantrenItems.map((news: NewsItem, index: number) => (
                  <Link key={news.id} to={`/news/${news.id}`} className="group">
                    <article className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={news.featuredImage || `https://picsum.photos/200/200?random=${index + 20}`}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik05MCA3NUgxMTBWMTI1SDkwVjc1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4=';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                            {news.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {new Date(news.publishedAt).toLocaleDateString('id-ID')}
                            </span>
                            <span className="text-blue-600 text-xs font-medium group-hover:underline">
                              Baca Selengkapnya →
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors">2</button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors">3</button>
              <span className="px-2 text-gray-500">...</span>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-colors">8</button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}