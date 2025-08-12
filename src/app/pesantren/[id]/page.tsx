'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePesantrenDetail } from '@/hooks/usePesantren';
import { usePesantren } from '@/hooks/usePesantren';
import { useReviews } from '@/hooks/useReviews';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// Loading skeleton for detail page
const DetailSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-6">
    {/* Sidebar Skeleton */}
    <div className="w-full lg:w-80 animate-pulse">
      <div className="bg-white rounded-lg p-4 mb-4">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Main Content Skeleton */}
    <div className="flex-1 animate-pulse">
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded mb-6 w-4/6"></div>
        
        {/* Gallery Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Error page component
const ErrorPage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Pesantren Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-4">Pesantren yang Anda cari tidak ditemukan atau terjadi kesalahan.</p>
        <div className="space-x-4">
          <Button onClick={onRetry} variant="outline">
            Coba Lagi
          </Button>
          <Button onClick={() => window.history.back()}>
            Kembali
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Table of Contents sidebar component
const TableOfContentsSidebar = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const tableOfContents = [
    { id: 'overview', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'programs', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'facilities', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'reviews', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'gallery', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'contact', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'location', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'fees', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'model1', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'model2', label: 'Model Pendidikan', icon: '🔖' },
    { id: 'model3', label: 'Model Pendidikan', icon: '🔖' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Daftar isi</h3>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {tableOfContents.map((item, index) => (
          <div
            key={index}
            onClick={() => scrollToSection(item.id)}
            className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                : 'hover:bg-gray-50 text-gray-700 border-l-4 border-transparent'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-sm">{item.icon}</span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Review card component
const ReviewCard = ({ review }: { review: any }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{review.user_name}</h4>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                className={`w-4 h-4 fill-current ${
                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleDateString('id-ID')}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </CardContent>
  </Card>
);

export default function PesantrenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id as string;
  
  // Sanitize ID to prevent scientific notation issues
  const pesantrenId = useMemo(() => {
    if (!rawId) return '';
    
    // Check if ID is in scientific notation format
    if (rawId.includes('e+') || rawId.includes('E+')) {
      console.warn('Scientific notation ID detected:', rawId);
      // Redirect to home page or show error
      router.replace('/');
      return '';
    }
    
    // Ensure ID is a valid string format
    const sanitizedId = String(rawId).trim();
    
    // Additional validation for extremely large numbers
    if (sanitizedId.length > 50) {
      console.warn('Extremely long ID detected:', sanitizedId);
      router.replace('/');
      return '';
    }
    
    return sanitizedId;
  }, [rawId, router]);
  
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch pesantren detail
  const { 
    data: pesantren, 
    isLoading: pesantrenLoading, 
    error: pesantrenError,
    refetch: refetchPesantren 
  } = usePesantrenDetail(pesantrenId);

  // Fetch reviews - prefer UUID v7 code if available
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading 
  } = useReviews({ 
    pesantren_id: pesantrenId, 
    pesantren_code: pesantren?.code, 
    page: 1, 
    limit: 10 
  });

  // Format number helper
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Loading state
  if (pesantrenLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <DetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (pesantrenError || !pesantren) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ErrorPage onRetry={refetchPesantren} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm breadcrumbs mb-6">
          <div className="flex items-center space-x-2 text-gray-600">
            <button 
              onClick={() => router.push('/')}
              className="hover:text-blue-600"
            >
              Beranda
            </button>
            <span>/</span>
            <button 
              onClick={() => router.push('/search')}
              className="hover:text-blue-600"
            >
              Pencarian
            </button>
            <span>/</span>
            <span className="text-gray-900">{pesantren.name}</span>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <TableOfContentsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Main Content with Right Sidebar */}
          <div className="flex-1 flex gap-6">
            {/* Content Area */}
            <div className="flex-1">
              {/* News Sidebar */}
            <div className="lg:hidden mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Berita Pondok</h3>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Kegiatan Tahfidz Bulanan</h4>
                      <p className="text-xs text-gray-600 mb-1">Program tahfidz rutin dilaksanakan setiap bulan...</p>
                      <span className="text-xs text-gray-500">2 hari yang lalu</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Wisuda Santri Angkatan 2024</h4>
                      <p className="text-xs text-gray-600 mb-1">Upacara wisuda santri angkatan 2024 telah...</p>
                      <span className="text-xs text-gray-500">1 minggu yang lalu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hero Section */}
            <div id="hero" className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{pesantren.name}</h1>
                  <p className="text-gray-600 mb-4">📍 {pesantren.location}</p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {pesantren.description || 'Deskripsi pesantren tidak tersedia.'}
                  </p>
                  
                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(pesantren.students)}</div>
                      <div className="text-sm text-gray-600">Santri</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{pesantren.rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                    {pesantren.fees && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          Rp {formatNumber(pesantren.fees.monthly)}
                        </div>
                        <div className="text-sm text-gray-600">Per Bulan</div>
                      </div>
                    )}

                {activeTab === 'model1' && (
                  <div id="model1">
                    <h3 className="text-xl font-semibold mb-4">Model Pendidikan 9</h3>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Pendidikan Tahfidz Al-Quran</h4>
                        <p className="text-gray-700 mb-4">
                          Program unggulan yang fokus pada hafalan Al-Quran dengan metode pembelajaran yang efektif dan menyenangkan.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h5 className="font-medium text-blue-800 mb-2">Target Hafalan</h5>
                            <p className="text-sm text-blue-700">30 Juz dalam 3 tahun</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h5 className="font-medium text-green-800 mb-2">Metode</h5>
                            <p className="text-sm text-green-700">Talaqqi dan Muraja'ah</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'model2' && (
                  <div id="model2">
                    <h3 className="text-xl font-semibold mb-4">Model Pendidikan 10</h3>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Pendidikan Kitab Kuning</h4>
                        <p className="text-gray-700 mb-4">
                          Pembelajaran kitab-kitab klasik Islam dengan metode sorogan dan bandongan yang telah terbukti efektif.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-sm">Nahwu dan Shorof</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-sm">Fiqh dan Ushul Fiqh</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="text-sm">Tafsir dan Hadits</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'model3' && (
                  <div id="model3">
                    <h3 className="text-xl font-semibold mb-4">Model Pendidikan 11</h3>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Pendidikan Keterampilan</h4>
                        <p className="text-gray-700 mb-4">
                          Program pengembangan keterampilan praktis untuk mempersiapkan santri menghadapi dunia kerja.
                        </p>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-2xl mb-2">💻</div>
                            <h5 className="font-medium text-purple-800">Teknologi</h5>
                            <p className="text-xs text-purple-600">Komputer & Internet</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-2xl mb-2">🎨</div>
                            <h5 className="font-medium text-orange-800">Seni</h5>
                            <p className="text-xs text-orange-600">Kaligrafi & Kerajinan</p>
                          </div>
                          <div className="text-center p-3 bg-teal-50 rounded-lg">
                            <div className="text-2xl mb-2">🌱</div>
                            <h5 className="font-medium text-teal-800">Pertanian</h5>
                            <p className="text-xs text-teal-600">Organik & Hidroponik</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Kalender Event */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Kalender Event</h3>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-gray-600 mb-4">
                        Berikut adalah kalender kegiatan dan acara penting yang akan dilaksanakan di pesantren kami.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold">Agustus 2025</h4>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-blue-100 rounded">
                              <span className="text-sm">‹</span>
                            </button>
                            <button className="p-1 hover:bg-blue-100 rounded">
                              <span className="text-sm">›</span>
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                          <div className="font-medium p-2">Min</div>
                          <div className="font-medium p-2">Sen</div>
                          <div className="font-medium p-2">Sel</div>
                          <div className="font-medium p-2">Rab</div>
                          <div className="font-medium p-2">Kam</div>
                          <div className="font-medium p-2">Jum</div>
                          <div className="font-medium p-2">Sab</div>
                          {Array.from({ length: 31 }, (_, i) => {
                            const day = i + 1;
                            const isEventDay = [5, 12, 19, 26].includes(day);
                            return (
                              <div
                                key={day}
                                className={`p-2 rounded ${
                                  isEventDay
                                    ? 'bg-blue-500 text-white font-semibold'
                                    : 'hover:bg-blue-100'
                                }`}
                              >
                                {day}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h5 className="font-semibold mb-2">Keterangan:</h5>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm">Event Penting</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <span className="text-sm">Kegiatan Rutin</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-sm">Libur/Cuti</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Galeri Pondok Pesantren */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Galeri Pondok Pesantren</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                    <div className="relative group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📷</span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">▶️</span>
                      </div>
                    </div>
                  </div>
                </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{pesantren.programs.length}</div>
                      <div className="text-sm text-gray-600">Program</div>
                    </div>
                  </div>
                </div>
                
                {/* Gallery Section */}
                <div className="md:w-1/2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="h-48 bg-gray-200 rounded-lg overflow-hidden">
                        {pesantren.image && (
                          <Image
                            src={pesantren.image}
                            alt={pesantren.name}
                            width={400}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    {/* Additional gallery images would go here */}
                     {Array.from({ length: 4 }).map((_, index) => (
                       <div key={index} className="h-24 bg-gray-200 rounded-lg overflow-hidden">
                         {pesantren.image && (
                           <Image
                             src={pesantren.image}
                             alt={`Gallery ${index + 1}`}
                             width={200}
                             height={100}
                             className="w-full h-full object-cover"
                           />
                         )}
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Model Pendidikan 1' },
                    { id: 'programs', label: 'Model Pendidikan 2' },
                    { id: 'facilities', label: 'Model Pendidikan 3' },
                    { id: 'reviews', label: 'Model Pendidikan 4' },
                    { id: 'gallery', label: 'Model Pendidikan 5' },
                    { id: 'contact', label: 'Model Pendidikan 6' },
                    { id: 'location', label: 'Model Pendidikan 7' },
                    { id: 'fees', label: 'Model Pendidikan 8' },
                    { id: 'model1', label: 'Model Pendidikan 9' },
                    { id: 'model2', label: 'Model Pendidikan 10' },
                    { id: 'model3', label: 'Model Pendidikan 11' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div id="overview" className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Tentang Pesantren</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {pesantren.description || 'Deskripsi pesantren tidak tersedia.'}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'programs' && (
                  <div id="programs">
                    <h3 className="text-xl font-semibold mb-4">Program Pendidikan</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pesantren.programs.map((program: string, index: number) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <h4 className="font-semibold text-lg mb-2">{program}</h4>
                            <p className="text-gray-600">Program pendidikan berkualitas dengan kurikulum terintegrasi.</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'facilities' && (
                  <div id="facilities">
                    <h3 className="text-xl font-semibold mb-4">Fasilitas</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {pesantren.facilities?.map((facility: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600">✓</span>
                          </div>
                          <span className="font-medium">{facility}</span>
                        </div>
                      )) || (
                        <div className="col-span-3 text-center text-gray-500 py-4">
                          Informasi fasilitas tidak tersedia
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div id="reviews">
                    <h3 className="text-xl font-semibold mb-4">Ulasan Santri & Wali</h3>
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                      <div>
                        {reviewsData.reviews.map((review: any) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Belum ada ulasan untuk pesantren ini.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div id="gallery">
                    <h3 className="text-xl font-semibold mb-4">Galeri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="h-32 bg-gray-200 rounded-lg overflow-hidden">
                          {pesantren.image && (
                            <Image
                              src={pesantren.image}
                              alt={`Gallery ${index + 1}`}
                              width={200}
                              height={128}
                              className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div id="contact">
                    <h3 className="text-xl font-semibold mb-4">Kontak</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Informasi Kontak</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-600">📞</span>
                              <span>{pesantren.contact?.phone || 'Tidak tersedia'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-600">✉️</span>
                              <span>{pesantren.contact?.email || 'Tidak tersedia'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-600">🌐</span>
                              <span>{pesantren.contact?.website || 'Tidak tersedia'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Jam Operasional</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Senin - Jumat</span>
                              <span>08:00 - 16:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sabtu</span>
                              <span>08:00 - 12:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Minggu</span>
                              <span>Tutup</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div id="location">
                    <h3 className="text-xl font-semibold mb-4">Lokasi</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Alamat Lengkap</h4>
                          <p className="text-gray-700">{pesantren.location}</p>
                        </div>
                        <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Peta akan ditampilkan di sini</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'fees' && (
                  <div id="fees">
                    <h3 className="text-xl font-semibold mb-4">Biaya Pendidikan</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Biaya Bulanan</h4>
                          <div className="text-2xl font-bold text-blue-600 mb-2">
                            Rp {pesantren.fees ? formatNumber(pesantren.fees.monthly) : 'Tidak tersedia'}
                          </div>
                          <p className="text-gray-600">Termasuk makan, asrama, dan kegiatan pembelajaran</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3">Biaya Pendaftaran</h4>
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            Rp {pesantren.fees ? formatNumber(pesantren.fees.registration || 500000) : 'Tidak tersedia'}
                          </div>
                          <p className="text-gray-600">Biaya sekali bayar saat pendaftaran</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/apply/${pesantren?.code || pesantrenId}`)}
              >
                📝 Daftar Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.push('/consultation')}
              >
                💬 Konsultasi
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open(`tel:${pesantren.contact?.phone || ''}`)}
              >
                📞 Hubungi
              </Button>
            </div>
            </div>
          </div>
          
          {/* Right Sidebar - News */}
          <div className="hidden lg:block w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Berita Pondok</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Kegiatan Tahfidz Bulanan</h4>
                      <p className="text-xs text-gray-600 mb-2">Program tahfidz rutin dilaksanakan setiap bulan dengan target hafalan yang telah ditentukan...</p>
                      <span className="text-xs text-gray-500">2 hari yang lalu</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Wisuda Santri Angkatan 2024</h4>
                      <p className="text-xs text-gray-600 mb-2">Upacara wisuda santri angkatan 2024 telah dilaksanakan dengan khidmat...</p>
                      <span className="text-xs text-gray-500">1 minggu yang lalu</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Prestasi Lomba Kaligrafi</h4>
                      <p className="text-xs text-gray-600 mb-2">Santri meraih juara 1 dalam lomba kaligrafi tingkat provinsi...</p>
                      <span className="text-xs text-gray-500">2 minggu yang lalu</span>
                    </div>
                  </div>
                </div>
                
                <div className="pb-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Program Pertanian Organik</h4>
                      <p className="text-xs text-gray-600 mb-2">Peluncuran program baru pertanian organik untuk santri...</p>
                      <span className="text-xs text-gray-500">3 minggu yang lalu</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="w-full">
                  Lihat Semua Berita
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}