'use client';

import PesantrenCard from '@/components/cards/PesantrenCard';
import { Pesantren } from '@/types';

interface PopularPesantrenSectionProps {
  className?: string;
}

const pesantrenData: Pesantren[] = [
  {
    id: 1,
    name: "Nama Pesantren Pesantren",
    location: "Bogor, Jawa Barat",
    address: "Jl. Raya Bogor, Bogor, Jawa Barat",
    rating: 4.8,
    students: 1200,
    programs: ["Tahfidz", "Kitab Kuning", "Bahasa Arab"],
    image: "/api/placeholder/300/200",
    featured: true
  },
  {
    id: 2,
    name: "Nama Pesantren Pesantren",
    location: "Yogyakarta, DIY",
    address: "Jl. Raya Yogyakarta, Yogyakarta, DIY",
    rating: 4.7,
    students: 800,
    programs: ["Tahfidz", "Sains", "Teknologi"],
    image: "/api/placeholder/300/200",
    featured: true
  },
  {
    id: 3,
    name: "Nama Pesantren Pesantren",
    location: "Malang, Jawa Timur",
    address: "Jl. Raya Malang, Malang, Jawa Timur",
    rating: 4.9,
    students: 1500,
    programs: ["Tahfidz", "Bahasa Inggris", "Leadership"],
    image: "/api/placeholder/300/200",
    featured: true
  },
  {
    id: 4,
    name: "Nama Pesantren Pesantren",
    location: "Bandung, Jawa Barat",
    address: "Jl. Raya Bandung, Bandung, Jawa Barat",
    rating: 4.6,
    students: 900,
    programs: ["Tahfidz", "Entrepreneurship", "IT"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 5,
    name: "Nama Pesantren Pesantren",
    location: "Solo, Jawa Tengah",
    address: "Jl. Raya Solo, Solo, Jawa Tengah",
    rating: 4.8,
    students: 1100,
    programs: ["Tahfidz", "Seni", "Olahraga"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 6,
    name: "Nama Pesantren Pesantren",
    location: "Surabaya, Jawa Timur",
    address: "Jl. Raya Surabaya, Surabaya, Jawa Timur",
    rating: 4.7,
    students: 1300,
    programs: ["Tahfidz", "Bisnis", "Komunikasi"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 7,
    name: "Nama Pesantren Pesantren",
    location: "Jakarta, DKI Jakarta",
    address: "Jl. Raya Jakarta, Jakarta, DKI Jakarta",
    rating: 4.5,
    students: 700,
    programs: ["Tahfidz", "Multimedia", "Desain"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 8,
    name: "Nama Pesantren Pesantren",
    location: "Bekasi, Jawa Barat",
    address: "Jl. Raya Bekasi, Bekasi, Jawa Barat",
    rating: 4.6,
    students: 950,
    programs: ["Tahfidz", "Robotika", "Programming"],
    image: "/api/placeholder/300/200"
  },
  {
    id: 9,
    name: "Nama Pesantren Pesantren",
    location: "Depok, Jawa Barat",
    address: "Jl. Raya Depok, Depok, Jawa Barat",
    rating: 4.8,
    students: 850,
    programs: ["Tahfidz", "Penelitian", "Inovasi"],
    image: "/api/placeholder/300/200"
  }
];



export default function PopularPesantrenSection({ className = '' }: PopularPesantrenSectionProps) {
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {pesantrenData.map((pesantren) => (
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
        <div className="flex justify-center items-center space-x-2">
          <button className="w-8 h-8 rounded-full bg-[#042558] text-white flex items-center justify-center">
            1
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300">
            2
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
            3
          </button>
          <span className="text-gray-400">...</span>
          <button className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600">
            →
          </button>
        </div>
      </div>
    </section>
  );
}