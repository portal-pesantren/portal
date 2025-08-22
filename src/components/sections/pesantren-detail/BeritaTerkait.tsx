'use client';

import { Button } from '@/components/ui';

interface BeritaTerkaitProps {
  pesantrenId: string;
}

interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
  icon: string;
  color: string;
}

export default function BeritaTerkait({ pesantrenId }: BeritaTerkaitProps) {
  const newsItems: NewsItem[] = [
    {
      title: 'Kegiatan Tahfidz Bulanan',
      excerpt: 'Program tahfidz rutin dilaksanakan setiap bulan dengan target hafalan yang telah ditentukan untuk meningkatkan kualitas hafalan santri.',
      date: '2 hari yang lalu',
      icon: '📚',
      color: 'blue'
    },
    {
      title: 'Wisuda Santri Angkatan 2024',
      excerpt: 'Upacara wisuda santri angkatan 2024 telah dilaksanakan dengan khidmat dan dihadiri oleh para wali santri serta tokoh masyarakat.',
      date: '1 minggu yang lalu',
      icon: '🎓',
      color: 'green'
    },
    {
      title: 'Prestasi Lomba Kaligrafi',
      excerpt: 'Santri meraih juara 1 dalam lomba kaligrafi tingkat provinsi yang diselenggarakan oleh Kementerian Agama.',
      date: '2 minggu yang lalu',
      icon: '🏆',
      color: 'orange'
    },
    {
      title: 'Program Pertanian Organik',
      excerpt: 'Peluncuran program baru pertanian organik untuk santri sebagai bagian dari pembelajaran kewirausahaan dan kemandirian.',
      date: '3 minggu yang lalu',
      icon: '🌱',
      color: 'purple'
    }
  ];

  return (
    <div id="news" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Berita & Kegiatan</h2>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base lg:text-lg self-start sm:self-auto">
          Lihat Semua
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {newsItems.map((news, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${news.color}-100 rounded-lg flex-shrink-0 flex items-center justify-center`}>
                <span className="text-xl sm:text-2xl">{news.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-relaxed">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 leading-relaxed line-clamp-3">
                  {news.excerpt}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-xs sm:text-sm lg:text-base text-gray-500">{news.date}</span>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto">
                    Baca Selengkapnya
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 sm:mt-6 text-center">
        <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base lg:text-lg">
          Lihat Semua Berita & Kegiatan
        </Button>
      </div>
    </div>
  );
}