'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsCard from '@/components/cards/NewsCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
}

const dummyNews: NewsItem[] = [
  {
    id: '1',
    title: 'Aries Baswadan di Pabuaran',
    excerpt: 'Menteri Agus Gumiwang Kartasasmita mengunjungi Pondok Pesantren Pabuaran untuk melihat langsung program pendidikan yang telah berjalan.',
    image: '/api/placeholder/400/250',
    date: '2024-01-15',
    category: 'Kunjungan',
    author: 'Admin Portal',
    readTime: '3 min'
  },
  {
    id: '2',
    title: 'Program Beasiswa Santri Berprestasi',
    excerpt: 'Kementerian Agama meluncurkan program beasiswa untuk santri berprestasi di seluruh Indonesia dengan total dana 50 miliar rupiah.',
    image: '/api/placeholder/400/250',
    date: '2024-01-14',
    category: 'Beasiswa',
    author: 'Tim Redaksi',
    readTime: '5 min'
  },
  {
    id: '3',
    title: 'Modernisasi Kurikulum Pesantren',
    excerpt: 'Pesantren di era digital mulai mengintegrasikan teknologi dalam pembelajaran untuk mempersiapkan santri menghadapi tantangan masa depan.',
    image: '/api/placeholder/400/250',
    date: '2024-01-13',
    category: 'Pendidikan',
    author: 'Dr. Ahmad Syafi\'i',
    readTime: '4 min'
  },
  {
    id: '4',
    title: 'Festival Seni Budaya Pesantren',
    excerpt: 'Ratusan santri dari berbagai pesantren se-Jawa Barat mengikuti festival seni budaya untuk melestarikan warisan budaya Islam.',
    image: '/api/placeholder/400/250',
    date: '2024-01-12',
    category: 'Budaya',
    author: 'Humas Pesantren',
    readTime: '6 min'
  },
  {
    id: '5',
    title: 'Kerjasama Internasional Pesantren',
    excerpt: 'Pesantren Al-Azhar menjalin kerjasama dengan universitas di Timur Tengah untuk program pertukaran santri dan pengajar.',
    image: '/api/placeholder/400/250',
    date: '2024-01-11',
    category: 'Internasional',
    author: 'Redaksi',
    readTime: '7 min'
  },
  {
    id: '6',
    title: 'Inovasi Pembelajaran Digital',
    excerpt: 'Pesantren modern mulai menggunakan platform e-learning untuk mendukung pembelajaran jarak jauh dan hybrid learning.',
    image: '/api/placeholder/400/250',
    date: '2024-01-10',
    category: 'Teknologi',
    author: 'Tim IT Pesantren',
    readTime: '5 min'
  },
  {
    id: '7',
    title: 'Pemberdayaan Ekonomi Santri',
    excerpt: 'Program kewirausahaan santri berhasil menciptakan UMKM yang berkontribusi pada perekonomian lokal dengan omzet miliaran rupiah.',
    image: '/api/placeholder/400/250',
    date: '2024-01-09',
    category: 'Ekonomi',
    author: 'Divisi Ekonomi',
    readTime: '4 min'
  },
  {
    id: '8',
    title: 'Pelatihan Kepemimpinan Santri',
    excerpt: 'Workshop kepemimpinan untuk santri senior bertujuan mempersiapkan mereka menjadi pemimpin yang berintegritas di masa depan.',
    image: '/api/placeholder/400/250',
    date: '2024-01-08',
    category: 'Kepemimpinan',
    author: 'Ustadz Mahmud',
    readTime: '3 min'
  },
  {
    id: '9',
    title: 'Renovasi Fasilitas Pesantren',
    excerpt: 'Pembangunan asrama baru dan renovasi masjid pesantren untuk meningkatkan kenyamanan dan kapasitas santri.',
    image: '/api/placeholder/400/250',
    date: '2024-01-07',
    category: 'Infrastruktur',
    author: 'Tim Pembangunan',
    readTime: '2 min'
  }
];

const categories = ['Semua', 'Kunjungan', 'Beasiswa', 'Pendidikan', 'Budaya', 'Internasional', 'Teknologi', 'Ekonomi', 'Kepemimpinan', 'Infrastruktur'];

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter news based on search and category
  const filteredNews = dummyNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Berita Pesantren
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Informasi terkini seputar dunia pesantren dan pendidikan Islam
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium whitespace-nowrap">Kategori:</span>
                <Select
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  className="min-w-[150px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Results Info */}
            <div className="mb-8">
              <p className="text-gray-600">
                Menampilkan {paginatedNews.length} dari {filteredNews.length} berita
                {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
                {searchTerm && ` untuk pencarian "${searchTerm}"`}
              </p>
            </div>

            {/* News Grid */}
            {paginatedNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Tidak ada berita ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah kata kunci pencarian atau kategori
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    onClick={() => handlePageChange(page)}
                    className="px-4 py-2 min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}