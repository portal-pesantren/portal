'use client';

import { ArrowUpRight } from 'lucide-react';
import { useLatestNews, NewsItem } from '@/hooks/useNews';
import { Button } from '@/components/ui';
import React from 'react';
// Removed debug utilities import after backend integration

interface NewsSectionProps {
  className?: string;
}

const NewsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
          <div className="bg-gray-200 h-64"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function NewsSection({ className = '' }: NewsSectionProps) {
  const { data: newsData, isLoading, error } = useLatestNews(4);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📰 NewsSection state:', { count: newsData?.length || 0, isLoading, error });
    }
  }, [newsData, isLoading, error]);

  // Removed Test Backend button handler after backend integration

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lihat Berita Pondok Pesantren terkini
          </h2>
          <p className="text-gray-600 text-lg max-w-4xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas 
            orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
          </p>
          {/* Debug test button removed as requested */}
        </div>

        {/* Loading State */}
        {isLoading && <NewsSkeleton />}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <h3 className="text-lg font-semibold mb-2">Gagal memuat berita</h3>
              <p className="text-gray-600 mb-4">Terjadi kesalahan saat mengambil data berita.</p>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}
        
        {/* News Grid */}
        {newsData && newsData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsData.map((news, i) => (
            <a 
              key={news.slug || news.id || i} 
              href={`/news/${news.slug || news.id}`}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 block"
            >
              {/* Featured Image */}
              <div className="relative bg-gray-200 h-64 overflow-hidden">
                {news.featuredImage ? (
                  <img
                    src={news.featuredImage}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback placeholder */}
                <div className={`absolute inset-0 flex items-center justify-center ${news.featuredImage ? 'hidden' : 'flex'}`}>
                  <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded"></div>
                  </div>
                </div>
                
                {/* Arrow Button */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category and Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                    {news.category}
                  </span>
                  <span>•</span>
                  <span>{(() => {
                    const published = (news as NewsItem).publishedAt || (news as any).published_at || (news as any).createdAt || (news as any).publishDate;
                    return new Date(published).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                  })()}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {news.excerpt}
                </p>
                
                {/* Author and Reading Time */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {(() => {
                          const authorName = (news as NewsItem).author?.name || (news as any).authorName || (typeof (news as any).author === 'string' ? (news as any).author : 'Admin');
                          return typeof authorName === 'string' ? authorName.charAt(0).toUpperCase() : 'A';
                        })()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{(news as NewsItem).author?.name || (news as any).authorName || (typeof (news as any).author === 'string' ? (news as any).author : 'Admin')}</span>
                  </div>
                  <span className="text-xs text-gray-500">{news.readingTime || 5} min baca</span>
                </div>
              </div>
            </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}