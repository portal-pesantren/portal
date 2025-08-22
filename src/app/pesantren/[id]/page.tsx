'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePesantrenDetail } from '@/hooks/usePesantren';
import { useReviewsByPesantren } from '@/hooks/useReviews';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import Image from 'next/image';
import {
  DropdownSection,
  BeritaTerkait,
  KalenderEvent,
  KeteranganSection,
  KeteranganEvent,
  GaleriPondok,
  KomentarSection,
  TableOfContentDropdown
} from '@/components/sections/pesantren-detail';
import SidebarContent from '@/components/layout/SidebarContent';
import { formatNumber } from '@/lib/utils';

// Loading skeleton component
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function PesantrenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pesantrenId = params?.id as string;
  
  const [activeSection, setActiveSection] = useState('keterangan');
  const [isMobile, setIsMobile] = useState(false);

  // Fetch pesantren detail data
  const { data: pesantren, isLoading: pesantrenLoading, error: pesantrenError } = usePesantrenDetail(pesantrenId);
  
  // Fetch reviews data
  const { data: reviews, isLoading: reviewsLoading } = useReviewsByPesantren(pesantrenId);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data for fallback
  const mockPesantren = {
    id: pesantrenId,
    name: 'Pondok Pesantren Al-Hikmah',
    location: 'Bogor, Jawa Barat',
    description: 'Pesantren modern dengan kurikulum terpadu yang menggabungkan pendidikan agama dan umum. Memiliki fasilitas lengkap dan tenaga pengajar yang berpengalaman.',
    students: 1250,
    rating: 4.8,
    fees: {
      monthly: 850000,
      registration: 2500000,
      dormitory: 1200000
    },
    image: '/api/placeholder/800/400',
    type: 'Pondok Campuran',
    isVerified: true,
    contact: {
      website: 'https://alhikmah.ac.id',
      phone: '+62 251 123456',
      email: 'info@alhikmah.ac.id',
      address: 'Jl. Raya Bogor No. 123, Bogor, Jawa Barat 16610'
    },
    programs: ['Tahfidz Al-Quran', 'Pendidikan Formal', 'Bahasa Arab & Inggris', 'Keterampilan'],
    facilities: ['Asrama Putra & Putri', 'Masjid', 'Perpustakaan', 'Lab Komputer', 'Lab Bahasa', 'Klinik Kesehatan'],
    advantages: [
      'Kurikulum terpadu agama dan umum',
      'Tenaga pengajar berpengalaman',
      'Fasilitas modern dan lengkap',
      'Program tahfidz intensif',
      'Lingkungan kondusif untuk belajar'
    ]
  };

  const displayPesantren = pesantren || mockPesantren;

  // Navigation sections
  const sections = [
    { id: 'keterangan', title: 'Keterangan', icon: '📋' },
    { id: 'galeri', title: 'Galeri', icon: '🖼️' },
    { id: 'ulasan', title: 'Ulasan', icon: '⭐' },
    { id: 'berita', title: 'Berita', icon: '📰' },
    { id: 'kalender', title: 'Kalender', icon: '📅' },
    { id: 'keterangan-event', title: 'Event Bulanan', icon: '📆' }
  ];

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Scroll to section on mobile
    if (isMobile) {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleRegistration = () => {
    router.push('/apply');
  };

  const handleWebsiteVisit = () => {
    if (displayPesantren.contact?.website) {
      window.open(displayPesantren.contact.website, '_blank');
    }
  };

  if (pesantrenLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DetailSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (pesantrenError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pesantren Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Maaf, pesantren yang Anda cari tidak dapat ditemukan.</p>
          <Button onClick={() => router.push('/')} className="bg-blue-600 hover:bg-blue-700">
            Kembali ke Beranda
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Layout with Fixed Sidebar */}
      <div className="flex flex-1">
        {/* Fixed Sidebar - Left Side */}
        <div className="hidden lg:block w-80 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6 sticky top-0 max-h-screen overflow-y-auto">
            <SidebarContent
              sections={sections}
              activeSection={activeSection}
              onSectionClick={handleSectionChange}
            />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Hero Section */}
          <section id="hero" className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Main Content - Center */}
        <div className="lg:col-span-2 order-1 lg:order-2 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Image */}
          <div className="relative w-full h-48 sm:h-64 lg:h-80 bg-gray-100">
            <Image
              src={displayPesantren.image || `/pesantren-${((parseInt(pesantrenId as string) - 1) % 3) + 1}.svg`}
              alt={`Foto ${displayPesantren.name}`}
              fill
              className="object-cover"
              priority
            />
            {/* Interaction Icons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </button>
              <button className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {displayPesantren.name}
                </h1>
                
                {/* Tags and Verification */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Pondok Pesantren
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Pondok Campuran
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                     <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     Terverifikasi
                   </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(displayPesantren.rating) ? 'text-yellow-400' : 'text-gray-300'
                        } fill-current`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-900">{displayPesantren.rating.toFixed(1)}</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                  {displayPesantren.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.'}
                </p>

                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  <div className="text-center bg-blue-50 rounded-lg p-2 sm:p-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
                      {formatNumber(displayPesantren.students)}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Santri</div>
                  </div>
                  <div className="text-center bg-green-50 rounded-lg p-2 sm:p-3">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      {displayPesantren.rating.toFixed(1)}
                    </div>
                    <div className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Rating</div>
                  </div>
                  {displayPesantren.fees && (
                    <div className="text-center bg-orange-50 rounded-lg p-2 sm:p-3 col-span-2 lg:col-span-1">
                      <div className="text-base sm:text-lg lg:text-xl font-bold text-orange-600">
                        Rp {formatNumber(displayPesantren.fees.monthly)}
                      </div>
                      <div className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">Per Bulan</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Content - Action Buttons */}
              <div className="flex flex-col gap-3 lg:min-w-[280px]">
                <Button 
                  onClick={handleRegistration}
                  className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-6 py-4 rounded-full font-semibold w-full text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Lakukan pendaftaran
                </Button>
                <Button 
                  onClick={handleWebsiteVisit}
                  variant="outline"
                  className="border border-[#1e3a8a] text-[#1e3a8a] hover:border-[#1e40af] hover:bg-[#1e3a8a] hover:text-white px-6 py-4 rounded-full font-semibold w-full text-sm transition-all duration-200 bg-white shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  Kunjungi Website Pondok
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* News Section - Right Side */}
        <div className="lg:col-span-1 order-3 lg:order-3">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Berita Pondok</h3>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Featured News Item */}
            <div className="px-4 pb-4">
              <div className="relative w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 overflow-hidden">
                <Image
                  src="/news-1.jpg"
                  alt="Anies Baswedan di Pabejan"
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
                  Anies Baswedan di Pabejan
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Keterangan Anies Baswedan sebagai Alumni dalam acara Alumni Pulang di Pondok Pesantren Pabejan, bagikan kisah inspiratif pada santri
                </p>
                <button className="inline-flex items-center gap-2 border-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 bg-white group">
                  Baca Berita 
                  <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> 
      
      
      {/* Main Layout Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-1 xl:col-span-3 order-2 xl:order-1">
            {/* Mobile Navigation Dropdown */}
            {isMobile && (
              <div className="mb-6">
                <DropdownSection
                  sections={sections}
                  activeSection={activeSection}
                  onSectionClick={handleSectionChange}
                />
              </div>
            )}
            
            {/* Content Sections */}
            <div className="space-y-6">
              {/* Keterangan Section */}
              <div id="section-keterangan" className={activeSection === 'keterangan' || !isMobile ? 'block' : 'hidden'}>
                <TableOfContentDropdown pesantrenId={pesantrenId} />
              </div>
               {/* Kalender Section */}
              <div id="section-kalender" className={activeSection === 'kalender' || !isMobile ? 'block' : 'hidden'}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <KalenderEvent pesantrenId={pesantrenId} />
                  </div>
                  <div className="flex-1">
                    <KeteranganEvent pesantrenId={pesantrenId} />
                  </div>
                </div>
              </div>
              
              {/* Keterangan Event Section - Mobile only */}
              <div id="section-keterangan-event" className={`${activeSection === 'keterangan-event' && isMobile ? 'block' : 'hidden'} lg:hidden`}>
                <KeteranganEvent pesantrenId={pesantrenId} />
              </div>
              
              {/* Galeri Section */}
              <div id="section-galeri" className={activeSection === 'galeri' || !isMobile ? 'block' : 'hidden'}>
                <GaleriPondok pesantrenId={pesantrenId} />
              </div>
              
              {/* Ulasan Section */}
              <div id="section-ulasan" className={activeSection === 'ulasan' || !isMobile ? 'block' : 'hidden'}>
                <KomentarSection 
                  pesantrenId={pesantrenId} 
                  reviews={reviews?.reviews as any || []} 
                />
              </div>
              
              {/* Berita Section */}
              <div id="section-berita" className={activeSection === 'berita' || !isMobile ? 'block' : 'hidden'}>
                <BeritaTerkait pesantrenId={pesantrenId} />
              </div>
            </div>
          </div>
          
          {/* Sidebar Area - Hidden on mobile, shows below content on tablet, side on desktop */}
          <div className="lg:col-span-1 xl:col-span-1 order-3 lg:order-3 xl:order-2 hidden lg:block">
            <div className="xl:sticky xl:top-6 space-y-6">
              {/* Table of Contents Sidebar */}
              
              {/* News Sidebar */}
              
            </div>
            {/* end news sidebar */}
          </div>
        </div>
        </div>
        </div>
      </div>
      
      {/* Footer - Outside of flex layout */}
      <Footer />
    </div>
  );
}