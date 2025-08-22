import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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

interface NewsCardProps {
  news: NewsItem;
  className?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, className }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className={cn(
      'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300',
      className
    )}>
      <Link href={`/news/${news.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={news.featuredImage || '/api/placeholder/400/250'}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
            }}
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {news.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {news.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          
          {/* Meta Info */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{formatDate(news.publishedAt)}</span>
              <span>•</span>
              <span>{news.author.name}</span>
            </div>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {news.readingTime} menit baca
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;