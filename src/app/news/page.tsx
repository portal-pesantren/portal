'use client';

import { useState, useEffect } from 'react';
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
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Berita Pesantren
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Informasi terkini seputar dunia pesantren dan pendidikan Islam
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium whitespace-nowrap">Kategori:</span>
                <Select
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  className="min-w-[150px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <main className="py-12">
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

            {/* Results Info */}
            {!isLoading && !error && (
              <div className="mb-8">
                <p className="text-gray-600">
                  Menampilkan {newsData.length} dari {totalItems} berita
                  {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
                  {searchTerm && ` untuk pencarian "${searchTerm}"`}
                </p>
              </div>
            )}

            {/* News Grid */}
            {!isLoading && !error && (
              newsData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                   {newsData.map((news) => {
                     const transformedNews = transformNewsItem(news);
                     return (
                       <NewsCard 
                         key={transformedNews.id} 
                         news={{
                           ...transformedNews,
                           category: categoryMapping[news.category] || news.category
                         }} 
                       />
                     );
                   })}
                 </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Tidak ada berita ditemukan
                  </h3>
                  <p className="text-gray-500">
                    Coba ubah kata kunci pencarian atau kategori
                  </p>
                </div>
              )
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    className="px-4 py-2 min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
                
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