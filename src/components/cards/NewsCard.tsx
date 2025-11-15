import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <article className={cn(
      'bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 group',
      className
    )}>
      <Link to={`/news/${news.id}`} className="block">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden mb-4">
          <img
            src={news.featuredImage || 'https://picsum.photos/400/250?random=1'}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTAwSDIyNVYxNTBIMTc1VjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
            }}
          />
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Date and Category */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{formatDate(news.publishedAt)}</span>
            <span>•</span>
            <span className="text-blue-600 font-medium">{news.category}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
            {news.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {news.excerpt}
          </p>
          
          {/* Read More */}
          <div className="pt-2">
            <span className="text-blue-600 text-sm font-medium group-hover:underline">
              Baca Selengkapnya →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;