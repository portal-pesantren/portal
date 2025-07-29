'use client';

import { ArrowUpRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image?: string;
}

interface NewsSectionProps {
  className?: string;
}

export default function NewsSection({ className = '' }: NewsSectionProps) {
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Berita Pondok Pesantren',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'
    },
    {
      id: 2,
      title: 'Berita Pondok Pesantren',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'
    },
    {
      id: 3,
      title: 'Berita Pondok Pesantren',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'
    },
    {
      id: 4,
      title: 'Berita Pondok Pesantren',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'
    }
  ];

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
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((news) => (
            <div 
              key={news.id} 
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100"
            >
              {/* Image Placeholder */}
              <div className="relative bg-gray-200 h-64 flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                
                {/* Arrow Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-200 group-hover:scale-110">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {news.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}