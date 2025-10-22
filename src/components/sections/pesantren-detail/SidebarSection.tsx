'use client';

import Image from 'next/image';
import { Button } from '@/components/ui';

interface SidebarSectionProps {
  pesantrenId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const TableOfContentsSidebar = ({ 
  activeTab, 
  setActiveTab, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const sections = [
    { id: 'hero', label: 'Informasi Utama', icon: '🏠' },
    { id: 'programs', label: 'Program Pendidikan', icon: '📚' },
    { id: 'facilities', label: 'Fasilitas', icon: '🏢' },
    { id: 'fees', label: 'Biaya Pendidikan', icon: '💰' },
    { id: 'contact', label: 'Kontak & Lokasi', icon: '📞' },
    { id: 'keunggulan', label: 'Keunggulan', icon: '⭐' },
    { id: 'reviews', label: 'Ulasan & Testimoni', icon: '💬' },
    { id: 'gallery', label: 'Galeri', icon: '📸' },
    { id: 'news', label: 'Berita & Kegiatan', icon: '📰' }
  ];

  return (
    <div className={`w-full lg:w-80 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sticky top-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Isi</h3>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveTab(section.id);
                document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-3 ${
                activeTab === section.id 
                  ? 'bg-blue-50 text-[#042558] border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsSidebar = ({ pesantrenId }: { pesantrenId: string }) => {
  const newsItems = [
    {
      title: 'Kegiatan Tahfidz Bulanan',
      excerpt: 'Program tahfidz rutin dilaksanakan setiap bulan dengan target hafalan yang telah ditentukan...',
      date: '2 hari yang lalu',
      icon: '📚',
      color: 'blue'
    },
    {
      title: 'Wisuda Santri Angkatan 2024',
      excerpt: 'Upacara wisuda santri angkatan 2024 telah dilaksanakan dengan khidmat...',
      date: '1 minggu yang lalu',
      icon: '🎓',
      color: 'green'
    },
    {
      title: 'Prestasi Lomba Kaligrafi',
      excerpt: 'Santri meraih juara 1 dalam lomba kaligrafi tingkat provinsi...',
      date: '2 minggu yang lalu',
      icon: '🏆',
      color: 'orange'
    },
    {
      title: 'Program Pertanian Organik',
      excerpt: 'Peluncuran program baru pertanian organik untuk santri...',
      date: '3 minggu yang lalu',
      icon: '🌱',
      color: 'purple'
    }
  ];

  return (
    <div className="hidden lg:block w-80">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sticky top-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Berita Pondok</h3>
        <div className="space-y-3">
          {newsItems.map((news, index) => (
            <div key={`${news.title}-${news.date}`} className={`${index < newsItems.length - 1 ? 'border-b border-gray-100 pb-3' : 'pb-3'}`}>
              <div className="flex space-x-2">
                <div className={`w-12 h-12 bg-${news.color}-100 rounded-lg flex-shrink-0 flex items-center justify-center`}>
                  <span className="text-2xl">{news.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-medium text-gray-900 mb-0.5">{news.title}</h4>
                  <p className="text-xs text-gray-600 mb-1">{news.excerpt}</p>
                  <span className="text-xs text-gray-500">{news.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" className="w-full">
            Lihat Semua Berita
          </Button>
        </div>
      </div>
    </div>
  );
};

const MobileNewsSidebar = ({ pesantrenId }: { pesantrenId: string }) => {
  return (
    <div className="lg:hidden mb-4 sm:mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900">Berita Pondok</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex space-x-2 sm:space-x-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-lg flex-shrink-0 relative overflow-hidden">
              <Image
                src={`/pesantren-${((parseInt(pesantrenId as string) - 1) % 3) + 1}.svg`}
                alt="Kegiatan Tahfidz"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 line-clamp-2">Kegiatan Tahfidz Bulanan</h4>
              <p className="text-xs text-gray-600 mb-1 line-clamp-2">Program tahfidz rutin dilaksanakan setiap bulan...</p>
              <span className="text-xs text-gray-500">2 hari yang lalu</span>
            </div>
          </div>
          <div className="flex space-x-2 sm:space-x-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex-shrink-0 relative overflow-hidden">
              <Image
                src={`/pesantren-${((parseInt(pesantrenId as string) - 1) % 3) + 1}.svg`}
                alt="Wisuda Santri"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">Wisuda Santri Angkatan 2024</h4>
              <p className="text-xs text-gray-600 mb-1">Upacara wisuda santri angkatan 2024 telah...</p>
              <span className="text-xs text-gray-500">1 minggu yang lalu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SidebarSection(props: SidebarSectionProps) {
  return (
    <>
      <TableOfContentsSidebar 
        activeTab={props.activeTab}
        setActiveTab={props.setActiveTab}
        isSidebarOpen={props.isSidebarOpen}
        setIsSidebarOpen={props.setIsSidebarOpen}
      />
      <NewsSidebar pesantrenId={props.pesantrenId} />
      <MobileNewsSidebar pesantrenId={props.pesantrenId} />
    </>
  );
}

export { TableOfContentsSidebar, NewsSidebar, MobileNewsSidebar };