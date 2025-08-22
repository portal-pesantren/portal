import Image from 'next/image';
import { FC } from 'react';

interface FeaturedNewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  onReadMore?: () => void;
  className?: string;
}

const FeaturedNewsCard: FC<FeaturedNewsCardProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  onReadMore,
  className = ''
}) => {
  return (
    <div className={`px-4 pb-4 ${className}`}>
      <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/pesantren-1.svg';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-lg font-bold text-gray-900 leading-tight">
          {title}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
        <button 
          onClick={onReadMore}
          className="inline-flex items-center gap-2 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 bg-white group"
        >
          Baca Berita
          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeaturedNewsCard;