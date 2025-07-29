'use client';

import { useState } from 'react';

interface VideoSectionProps {
  className?: string;
}

export default function VideoSection({ className = '' }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayVideo = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Fullscreen Video Container */}
      <div className="relative h-screen w-full">
        {/* Video Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
          {/* Video content would go here */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Search Bar - Positioned at top */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative bg-white rounded-full flex items-center">
              <div className="bg-[#042558] rounded-full p-4 ml-2 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Pondok Sekarang"
                className="flex-1 px-6 py-4 text-gray-900 bg-transparent border-0 focus:outline-none text-lg placeholder-gray-500"
              />
            </div>
          </form>
        </div>

        {/* Video Play Button - Centered */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {!isPlaying ? (
            <button
              onClick={handlePlayVideo}
              className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 group"
            >
              <svg className="w-8 h-8 text-[#042558] ml-1 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          ) : (
            <div className="text-white text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                </div>
                <p className="text-lg">Video sedang diputar...</p>
              </div>
            </div>
          )}
        </div>

        {/* Pondok Name Badge - Bottom Right */}
        <div className="absolute bottom-8 right-8 z-20">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-800 font-medium text-sm">Pondok Pesantren Pabelan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}