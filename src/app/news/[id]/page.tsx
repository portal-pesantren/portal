'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { ArrowLeftIcon, CalendarIcon, UserIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useNewsDetail, useLatestNews, useIncrementNewsViews } from '@/hooks/useNews';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  category: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  readingTime: number;
  tags: string[];
}

export default function NewsDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  // Fetch news detail using the hook (berdasarkan ID)
  const { data: news, isLoading, error, refetch } = useNewsDetail(id);
  const { data: relatedNews } = useLatestNews(3);
  const incrementViews = useIncrementNewsViews();

  // Increment views when news is loaded
  useEffect(() => {
    if (news && news.id) {
      incrementViews.mutate(news.id);
    }
  }, [news, incrementViews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news?.title,
        text: news?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <ErrorMessage 
              message="Gagal memuat detail berita"
              onRetry={() => refetch()}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded mb-4"></div>
              <div className="h-64 bg-gray-300 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h1>
            <Link href="/news">
              <Button variant="primary">Kembali ke Berita</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={news.featuredImage || 'https://picsum.photos/1200/600?random=1'}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://picsum.photos/1200/600?random=1';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-8">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-4">
              <Link href="/news" className="inline-flex items-center text-white/80 hover:text-white text-sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Kembali ke Berita
              </Link>
            </nav>
            
            {/* Category */}
            <div className="mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {news.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {news.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{formatDate(news.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2" />
                <span>{news.author.name}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>{news.readingTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Article - Left Side */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                    
                    {/* Share Button */}
                    <div className="mt-8 pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        leftIcon={<ShareIcon className="h-4 w-4" />}
                      >
                        Bagikan Artikel
                      </Button>
                    </div>
                    
                    {/* Tags */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {news.tags.map((tag) => (
                          <span
                            key={`tag-${tag}`}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              {/* Sidebar - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Berita Terkait</h3>
                  
                  <div className="space-y-4">
                    {relatedNews?.slice(0, 5).map((article) => (
                      <Link 
                        key={article.id} 
                        href={`/news/${article.id}`}
                        className="block group"
                      >
                        <article className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={article.featuredImage || 'https://picsum.photos/100/100?random=' + article.id}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://picsum.photos/100/100?random=' + article.id;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              {formatDate(article.publishedAt)}
                            </p>
                            <span className="text-xs text-blue-600 font-medium">
                              Baca Berita
                            </span>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Berita Terkait Section - Horizontal Layout */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Berita terkait
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedNews && relatedNews.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={item.featuredImage || `https://picsum.photos/400/250?random=${item.id}`}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://picsum.photos/400/250?random=${item.id}`;
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>{formatDate((item as any).published_at || (item as any).publishDate || (item as any).createdAt || (item as any).publishedAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            Baca Berita
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}