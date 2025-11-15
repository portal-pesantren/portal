'use client';

import { Button } from '@/components/ui';
import { useNewsByPesantren, type NewsItem } from '@/hooks/useNews';
import { Link } from 'react-router-dom';

interface BeritaTerkaitProps {
  pesantrenId: string;
}

export default function BeritaTerkait({ pesantrenId }: BeritaTerkaitProps) {
  const { data: newsData, isLoading, error } = useNewsByPesantren(pesantrenId, { limit: 4 });

  // Fallback data jika API tidak tersedia
  const fallbackNewsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Kegiatan Tahfidz Bulanan',
      slug: 'kegiatan-tahfidz-bulanan',
      excerpt: 'Program tahfidz rutin dilaksanakan setiap bulan dengan target hafalan yang telah ditentukan untuk meningkatkan kualitas hafalan santri.',
      content: 'Content lengkap artikel...',
      category: 'kegiatan',
      tags: ['tahfidz', 'kegiatan'],
      featuredImage: undefined,
      author: {
        id: '1',
        name: 'Admin Pesantren',
        avatar: '/api/placeholder/40/40'
      },
      publishedAt: '2024-01-15T10:00:00Z',
      views: 100,
      likes: 15,
      readingTime: 3,
      isPublished: true,
      isFeatured: false
    },
    {
      id: '2',
      title: 'Wisuda Santri Angkatan 2024',
      slug: 'wisuda-santri-angkatan-2024',
      excerpt: 'Upacara wisuda santri angkatan 2024 telah dilaksanakan dengan khidmat dan dihadiri oleh para wali santri serta tokoh masyarakat.',
      content: 'Content lengkap artikel...',
      category: 'acara',
      tags: ['wisuda', 'acara'],
      featuredImage: undefined,
      author: {
        id: '2',
        name: 'Tim Redaksi',
        avatar: '/api/placeholder/40/40'
      },
      publishedAt: '2024-01-08T10:00:00Z',
      views: 200,
      likes: 30,
      readingTime: 4,
      isPublished: true,
      isFeatured: false
    },
    {
      id: '3',
      title: 'Prestasi Lomba Kaligrafi',
      slug: 'prestasi-lomba-kaligrafi',
      excerpt: 'Santri meraih juara 1 dalam lomba kaligrafi tingkat provinsi yang diselenggarakan oleh Kementerian Agama.',
      content: 'Content lengkap artikel...',
      category: 'prestasi',
      tags: ['prestasi', 'kaligrafi'],
      featuredImage: undefined,
      author: {
        id: '3',
        name: 'Koordinator Prestasi',
        avatar: '/api/placeholder/40/40'
      },
      publishedAt: '2024-01-01T10:00:00Z',
      views: 150,
      likes: 25,
      readingTime: 3,
      isPublished: true,
      isFeatured: false
    },
    {
      id: '4',
      title: 'Program Pertanian Organik',
      slug: 'program-pertanian-organik',
      excerpt: 'Peluncuran program baru pertanian organik untuk santri sebagai bagian dari pembelajaran kewirausahaan dan kemandirian.',
      content: 'Content lengkap artikel...',
      category: 'program',
      tags: ['program', 'pertanian'],
      featuredImage: undefined,
      author: {
        id: '4',
        name: 'Koordinator Program',
        avatar: '/api/placeholder/40/40'
      },
      publishedAt: '2023-12-25T10:00:00Z',
      views: 120,
      likes: 20,
      readingTime: 5,
      isPublished: true,
      isFeatured: false
    }
  ];

  const newsItems = newsData?.data || fallbackNewsItems;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays <= 7) return `${diffDays} hari yang lalu`;
    if (diffDays <= 14) return '1 minggu yang lalu';
    if (diffDays <= 21) return '2 minggu yang lalu';
    if (diffDays <= 28) return '3 minggu yang lalu';
    return date.toLocaleDateString('id-ID');
  };

  const getNewsIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'kegiatan': '📚',
      'acara': '🎓',
      'prestasi': '🏆',
      'program': '🌱',
      'berita': '📰',
      'pengumuman': '📢'
    };
    return iconMap[category] || '📰';
  };

  const getNewsColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'kegiatan': 'blue',
      'acara': 'green',
      'prestasi': 'orange',
      'program': 'purple',
      'berita': 'gray',
      'pengumuman': 'red'
    };
    return colorMap[category] || 'gray';
  };

  if (isLoading) {
    return (
      <div id="news" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="news" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Berita & Kegiatan</h2>
        <Link 
          to={`/news?pesantren=${pesantrenId}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base lg:text-lg self-start sm:self-auto"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {newsItems.map((news: NewsItem) => {
          const icon = getNewsIcon(news.category);
          const color = getNewsColor(news.category);
          
          return (
            <Link key={news.id} to={`/news/${news.id}`}>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${color}-100 rounded-lg flex-shrink-0 flex items-center justify-center`}>
                    <span className="text-xl sm:text-2xl">{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-relaxed hover:text-blue-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 sm:mb-3 leading-relaxed line-clamp-3">
                      {news.excerpt}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <span className="text-xs sm:text-sm lg:text-base text-gray-500">
                        {formatDate(news.publishedAt)}
                      </span>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm lg:text-base w-full sm:w-auto">
                        Baca Selengkapnya
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 sm:mt-6 text-center">
        <Link to={`/news?pesantren=${pesantrenId}`}>
          <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base lg:text-lg">
            Lihat Semua Berita & Kegiatan
          </Button>
        </Link>
      </div>
    </div>
  );
}