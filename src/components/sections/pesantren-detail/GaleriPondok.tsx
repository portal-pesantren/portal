'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface GaleriPondokProps {
  pesantrenId: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  category: 'building' | 'activity' | 'facility' | 'event';
}

export default function GaleriPondok({ pesantrenId }: GaleriPondokProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = [
    {
      id: '1',
      src: '/images/pesantren/building1.jpg',
      alt: 'Masjid Utama Pesantren',
      title: 'Masjid Utama',
      description: 'Masjid utama pesantren yang dapat menampung hingga 1000 jamaah',
      category: 'building'
    },
    {
      id: '2',
      src: '/images/pesantren/activity1.jpg',
      alt: 'Kegiatan Tahfidz',
      title: 'Kegiatan Tahfidz',
      description: 'Santri sedang melakukan kegiatan tahfidz Al-Quran',
      category: 'activity'
    },
    {
      id: '3',
      src: '/images/pesantren/facility1.jpg',
      alt: 'Perpustakaan Pesantren',
      title: 'Perpustakaan',
      description: 'Perpustakaan dengan koleksi ribuan buku Islam dan umum',
      category: 'facility'
    },
    {
      id: '4',
      src: '/images/pesantren/event1.jpg',
      alt: 'Wisuda Santri',
      title: 'Wisuda Santri',
      description: 'Upacara wisuda santri angkatan terbaru',
      category: 'event'
    },
    {
      id: '5',
      src: '/images/pesantren/building2.jpg',
      alt: 'Asrama Santri',
      title: 'Asrama Santri',
      description: 'Asrama yang nyaman dan bersih untuk para santri',
      category: 'building'
    },
    {
      id: '6',
      src: '/images/pesantren/activity2.jpg',
      alt: 'Kegiatan Olahraga',
      title: 'Kegiatan Olahraga',
      description: 'Santri melakukan kegiatan olahraga rutin',
      category: 'activity'
    },
    {
      id: '7',
      src: '/images/pesantren/facility2.jpg',
      alt: 'Laboratorium Komputer',
      title: 'Lab Komputer',
      description: 'Laboratorium komputer untuk pembelajaran teknologi',
      category: 'facility'
    },
    {
      id: '8',
      src: '/images/pesantren/event2.jpg',
      alt: 'Lomba Kaligrafi',
      title: 'Lomba Kaligrafi',
      description: 'Kompetisi kaligrafi antar santri',
      category: 'event'
    }
  ];

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Function to navigate main image
  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? galleryImages.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === galleryImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1;
    } else {
      newIndex = currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div id="gallery" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Galeri Pesantren</h2>
        <div className="flex gap-2 self-start sm:self-auto">
          <button
            onClick={() => navigateImage('prev')}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => navigateImage('next')}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Gallery Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Image */}
        <div className="flex-1 lg:w-2/3">
          <div className="relative group">
            <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={galleryImages[currentImageIndex].src}
                alt={galleryImages[currentImageIndex].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              
              
              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {galleryImages[currentImageIndex].title}
                </h3>
                <p className="text-white text-sm opacity-90">
                  {galleryImages[currentImageIndex].description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Thumbnail Grid */}
        <div className="lg:w-1/3">
          <div className="grid grid-cols-4 lg:grid-cols-2 gap-2">
            {galleryImages.slice(0, 4).map((image, index) => (
              <div
                key={image.id}
                className={`relative cursor-pointer overflow-hidden rounded-lg bg-gray-200 aspect-square ${
                  index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => selectImage(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                  sizes="(max-width: 1024px) 25vw, 16vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300" />
              </div>
            ))}
          </div>
          

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-white text-xl">✕</span>
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateLightbox('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-white text-xl">‹</span>
            </button>
            <button
              onClick={() => navigateLightbox('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <span className="text-white text-xl">›</span>
            </button>

            {/* Image */}
            <div className="relative w-full h-96 sm:h-[500px] lg:h-[600px]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
              />
            </div>

            {/* Image Info */}
            <div className="bg-white bg-opacity-90 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-gray-700 text-sm">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}