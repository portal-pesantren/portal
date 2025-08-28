'use client';

import { useState } from 'react';
import PesantrenCard from '@/components/cards/PesantrenCard';
import { useFeaturedPesantren } from '@/hooks/usePesantren';
import { Pesantren } from '@/types';

// Loading skeleton component
const PesantrenCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
    <div className="h-10 bg-gray-200 rounded"></div>
  </div>
);

// Error component
const ErrorMessage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="text-red-500 mb-4">
      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-lg font-semibold mb-2">Gagal memuat data pesantren</h3>
      <p className="text-gray-600 mb-4">Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
      <button 
        onClick={onRetry}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  </div>
);

interface PopularPesantrenSectionProps {
  className?: string;
}

// Data dummy sebagai fallback
const fallbackData: Pesantren[] = [
  {
    id: "1",
    name: "Pondok Pesantren Al-Hikmah",
    location: "Pondok Putri",
    address: "Jl. Raya Bogor, Bogor, Jawa Barat",
    rating: 5.0,
    students: 1200,
    programs: ["Tahfidz", "Kitab Kuning", "Bahasa Arab"],
    image: "/pesantren-modern-1.svg",
    description: "Pesantren modern dengan fasilitas lengkap dan pendidikan berkualitas tinggi. Menggabungkan pendidikan agama dan umum dengan metode pembelajaran terkini.",
    featured: true
  },
  {
    id: "2",
    name: "Pesantren Al-Furqan",
    location: "Yogyakarta, DIY",
    address: "Jl. Raya Yogyakarta, Yogyakarta, DIY",
    rating: 4.7,
    students: 800,
    programs: ["Tahfidz", "Sains", "Teknologi"],
    image: "/pesantren-modern-2.svg",
    description: "Pesantren yang mengutamakan pendidikan tahfidz Al-Quran dengan dukungan teknologi modern dan laboratorium sains yang lengkap.",
    featured: true
  },
  {
    id: "3",
    name: "Pesantren Darul Ulum",
    location: "Malang, Jawa Timur",
    address: "Jl. Raya Malang, Malang, Jawa Timur",
    rating: 4.9,
    students: 1500,
    programs: ["Tahfidz", "Bahasa Inggris", "Leadership"],
    image: "/pesantren-traditional.svg",
    description: "Pesantren tradisional dengan nilai-nilai klasik yang kuat, mengembangkan kepemimpinan dan kemampuan bahasa internasional.",
    featured: true
  },
  {
    id: "4",
    name: "Pesantren Al-Ikhlas",
    location: "Bandung, Jawa Barat",
    address: "Jl. Raya Bandung, Bandung, Jawa Barat",
    rating: 4.6,
    students: 900,
    programs: ["Tahfidz", "Entrepreneurship", "IT"],
    image: "/pesantren-contemporary.svg",
    description: "Pesantren kontemporer yang memadukan pendidikan agama dengan kewirausahaan dan teknologi informasi untuk masa depan yang cerah."
  },
  {
    id: "5",
    name: "Pesantren Nurul Huda",
    location: "Solo, Jawa Tengah",
    address: "Jl. Raya Solo, Solo, Jawa Tengah",
    rating: 4.8,
    students: 1100,
    programs: ["Tahfidz", "Seni", "Olahraga"],
    image: "/pesantren-modern-1.svg",
    description: "Pesantren yang mengembangkan bakat seni dan olahraga santri sambil memperkuat hafalan Al-Quran dan pemahaman agama."
  },
  {
    id: "6",
    name: "Pesantren Baitul Hikmah",
    location: "Surabaya, Jawa Timur",
    address: "Jl. Raya Surabaya, Surabaya, Jawa Timur",
    rating: 4.7,
    students: 1300,
    programs: ["Tahfidz", "Bisnis", "Komunikasi"],
    image: "/pesantren-modern-2.svg",
    description: "Pesantren yang mempersiapkan santri menjadi entrepreneur muslim dengan kemampuan komunikasi dan bisnis yang handal."
  },
  {
    id: "7",
    name: "Pesantren Ar-Rahman",
    location: "Jakarta, DKI Jakarta",
    address: "Jl. Raya Jakarta, Jakarta, DKI Jakarta",
    rating: 4.5,
    students: 700,
    programs: ["Tahfidz", "Multimedia", "Desain"],
    image: "/pesantren-traditional.svg",
    description: "Pesantren urban yang mengintegrasikan pendidikan agama dengan keterampilan multimedia dan desain kreatif."
  },
  {
    id: "8",
    name: "Pesantren Al-Falah",
    location: "Bekasi, Jawa Barat",
    address: "Jl. Raya Bekasi, Bekasi, Jawa Barat",
    rating: 4.6,
    students: 950,
    programs: ["Tahfidz", "Robotika", "Programming"],
    image: "/pesantren-contemporary.svg",
    description: "Pesantren teknologi yang memadukan pendidikan agama dengan robotika dan pemrograman untuk era digital."
  },
  {
    id: "9",
    name: "Pesantren Darul Ilmi",
    location: "Depok, Jawa Barat",
    address: "Jl. Raya Depok, Depok, Jawa Barat",
    rating: 4.8,
    students: 850,
    programs: ["Tahfidz", "Penelitian", "Inovasi"],
    image: "/pesantren-modern-1.svg",
    description: "Pesantren riset yang mendorong santri untuk melakukan penelitian dan inovasi dalam berbagai bidang ilmu pengetahuan."
  }
];



export default function PopularPesantrenSection({ className = '' }: PopularPesantrenSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Fetch featured pesantren data
  const { data: pesantrenData, isLoading, error, refetch } = useFeaturedPesantren();
  
  // Use fallback data if API fails
  const displayData = pesantrenData || fallbackData;
  
  // Calculate pagination
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPesantren = displayData.slice(startIndex, endIndex);
  
  // Handle loading state
  if (isLoading) {
    return (
      <section id="pesantren" className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#042558] mb-4">
              Lihat Berita Pondok Pesantren terkini
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Temukan pesantren terbaik yang telah dipercaya ribuan keluarga untuk pendidikan anak-anak mereka.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, index) => (
              <PesantrenCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <section id="pesantren" className={`py-20 bg-white ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#042558] mb-4">
              Lihat Berita Pondok Pesantren terkini
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Temukan pesantren terbaik yang telah dipercaya ribuan keluarga untuk pendidikan anak-anak mereka.
            </p>
          </div>
          
          <ErrorMessage onRetry={() => refetch()} />
        </div>
      </section>
    );
  }

  return (
    <section id="pesantren" className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#042558] mb-4">
            Lihat Berita Pondok Pesantren terkini
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Temukan pesantren terbaik yang telah dipercaya ribuan keluarga untuk pendidikan anak-anak mereka.
          </p>
        </div>
        
        {/* Pesantren Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {currentPesantren.map((pesantren) => (
            <div key={pesantren.id} className="relative">
              <PesantrenCard 
                pesantren={pesantren}
                onViewDetail={(pesantren) => {
                  console.log('View detail for:', pesantren.name);
                  // TODO: Navigate to detail page
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentPage === page 
                    ? 'bg-[#042558] text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}