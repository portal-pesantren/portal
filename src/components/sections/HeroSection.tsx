'use client';

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
  return (
    <section id="beranda" className={`relative bg-white py-20 lg:py-32 overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content - Main Title */}
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#042558] leading-tight">
              Bantu Anak Anda Menemukan Pesantren Terbaik
            </h1>
          </div>
          
          {/* Right Content - Description and Navigation */}
          <div className="text-left">
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Kami bantu Anda menjelajahi ribuan pondok pesantren di seluruh Indonesia dan temukan pondok terbaik untuk Anda.
            </p>
            
            {/* Navigation Arrows */}
            <div className="flex items-center space-x-4">
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#042558] transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-12 h-12 rounded-full bg-[#042558] flex items-center justify-center hover:bg-[#031a3d] transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}