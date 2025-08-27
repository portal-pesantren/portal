'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNews } from '@/hooks/useNews';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt: Date;
  category: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  readingTime: number;
}

// Transform function to convert API data to component format
const transformNewsItem = (apiNews: any): NewsItem => {
  return {
    id: apiNews._id || apiNews.id,
    title: apiNews.title,
    excerpt: apiNews.excerpt || apiNews.content?.substring(0, 150) + '...',
    featuredImage: apiNews.featured_image || apiNews.featuredImage,
    publishedAt: new Date(apiNews.published_at || apiNews.publish_date || apiNews.publishedAt || apiNews.created_at),
    category: apiNews.category,
    author: {
      id: apiNews.author_id || apiNews.author?.id || '1',
      name: apiNews.author_name || apiNews.author?.name || 'Admin',
      avatar: apiNews.author_avatar || apiNews.author?.avatar
    },
    readingTime: typeof apiNews.reading_time === 'number' ? apiNews.reading_time : (apiNews.readingTime || 5)
  };
};

// Mapping kategori backend ke frontend
const categoryMapping: Record<string, string> = {
  'berita': 'Berita',
  'artikel': 'Artikel', 
  'tips': 'Tips',
  'panduan': 'Panduan',
  'event': 'Event',
  'pengumuman': 'Pengumuman',
  'prestasi': 'Prestasi',
  'kegiatan': 'Kegiatan'
};

const defaultCategories = ['Semua', 'Berita', 'Artikel', 'Tips', 'Panduan', 'Event', 'Pengumuman', 'Prestasi', 'Kegiatan'];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const itemsPerPage = 6;

  // Prepare search parameters
  const searchParams = {
    page: currentPage,
    limit: itemsPerPage,
    query: searchTerm || undefined,
    category: selectedCategory !== 'Semua' ? selectedCategory.toLowerCase() : undefined,
    is_published: true
  };

  // Fetch news data
  const { 
    data: newsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useNews(searchParams);

  const newsData = newsResponse?.data || [];
  const pagination = newsResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Baca Berita dan temukan informasi menarik
            </h1>
          </div>
        </div>
      </section>



      {/* Featured News Section */}
      <main className="bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <ErrorMessage 
                message="Gagal memuat berita. Silakan coba lagi."
                onRetry={() => refetch()}
              />
            )}

            {/* Featured News Grid */}
            {!isLoading && !error && newsData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {/* Main Featured News */}
                {newsData.slice(0, 2).map((news, index) => {
                  const transformedNews = transformNewsItem(news);
                  return (
                    <div key={transformedNews.id} className="relative group cursor-pointer">
                      <Link href={`/news/${transformedNews.id}`}>
                        <div className="relative h-64 rounded-lg overflow-hidden">
                          <img
                            src={transformedNews.featuredImage || '/api/placeholder/600/300'}
                            alt={transformedNews.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDYwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNzUgMTI1SDMyNVYxNzVIMjc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-600 px-2 py-1 rounded text-xs font-medium">
                                {categoryMapping[news.category] || news.category}
                              </span>
                              <span className="text-xs opacity-90">
                                {transformedNews.publishedAt.toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold line-clamp-2 group-hover:text-blue-200 transition-colors">
                              {transformedNews.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Category Sections - Side by Side Layout */}
            {!isLoading && !error && newsData.length > 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Berita Popular Section - Left Side */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Berita popular pekan ini</h2>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {newsData.slice(2, 5).map((news) => {
                      const transformedNews = transformNewsItem(news);
                      return (
                        <NewsCard 
                          key={transformedNews.id} 
                          news={{
                            ...transformedNews,
                            category: categoryMapping[news.category] || news.category
                          }}
                          className="border-0 shadow-sm"
                        />
                      );
                    })}
                  </div>
                </section>

                {/* Berita Populer Pesantren Section - Right Side */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Berita Populer Pesantren</h2>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
                        <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {newsData.slice(5, 8).map((news) => {
                      const transformedNews = transformNewsItem(news);
                      return (
                        <NewsCard 
                          key={transformedNews.id} 
                          news={{
                            ...transformedNews,
                            category: categoryMapping[news.category] || news.category
                          }}
                          className="border-0 shadow-sm"
                        />
                      );
                    })}
                  </div>
                </section>
              </div>
            )}

            {/* Remaining News Section */}
            {!isLoading && !error && newsData.length > 8 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Berita Lainnya</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsData.slice(8).map((news) => {
                    const transformedNews = transformNewsItem(news);
                    return (
                      <NewsCard 
                        key={transformedNews.id} 
                        news={{
                          ...transformedNews,
                          category: categoryMapping[news.category] || news.category
                        }}
                        className="border-0 shadow-sm"
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Empty State */}
            {!isLoading && !error && newsData.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Tidak ada berita ditemukan
                </h3>
                <p className="text-gray-500">
                  Silakan coba lagi nanti
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 py-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="px-4 py-2 min-w-[40px]"
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}