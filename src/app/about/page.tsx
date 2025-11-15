'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAboutUs } from '@/hooks/useAbout';
import { AboutUsData } from '@/services/aboutService';

export default function AboutPage() {
  const { data: aboutData, isLoading, error, isError } = useAboutUs();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#042558] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600 mb-4">
              Terjadi kesalahan saat memuat data About Us. Silakan coba lagi nanti.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#042558] text-white rounded-lg hover:bg-[#031a3d] transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Layout sesuai desain gambar */}
        <section className="py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Image Section - Kiri */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={aboutData?.image_url || "/placeholder-pesantren.jpg"}
                      alt="Balai Pendidikan Pondok Pesantren"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Content Section - Kanan */}
              <div className="order-1 lg:order-2 space-y-6">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Tentang Kami Portal Pesantren
                  </h1>
                  <div className="text-gray-700 leading-relaxed mb-6">
                    {aboutData?.description}
                  </div>
                </div>

                {/* Mengapa Portal Pesantren Ada Section */}
                <div className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Mengapa Portal Pesantren Ada?</h2>
                  <div className="text-gray-700 leading-relaxed">
                    {aboutData?.why_us}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}