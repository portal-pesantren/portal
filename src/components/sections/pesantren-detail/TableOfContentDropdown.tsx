'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Star, 
  BookOpen, 
  Activity, 
  Users, 
  Building, 
  Trophy, 
  GraduationCap, 
  DollarSign, 
  Award, 
  School,
} from 'lucide-react';
// Removed heroicons import - using custom SVG icons instead

// Function to get icon component based on icon name
const getIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'building': <Home className="w-5 h-5 text-white" />,
    'star': <Star className="w-5 h-5 text-white" />,
    'book': <BookOpen className="w-5 h-5 text-white" />,
    'activity': <Activity className="w-5 h-5 text-white" />,
    'users': <Users className="w-5 h-5 text-white" />,
    'building2': <Building className="w-5 h-5 text-white" />,
    'award': <Trophy className="w-5 h-5 text-white" />,
    'graduation': <GraduationCap className="w-5 h-5 text-white" />,
    'dollar': <DollarSign className="w-5 h-5 text-white" />,
    'trophy': <Award className="w-5 h-5 text-white" />,
    'school': <School className="w-5 h-5 text-white" />

  };
  
  return iconMap[iconName] || <Home className="w-5 h-5 text-gray-600" />;
};

// Interface definitions
interface TableOfContentItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  content?: string;
  isExpandable?: boolean;
}

interface TableOfContentDropdownProps {
  pesantrenId: string;
  className?: string;
}

// Mock API function - replace with actual API call
const fetchTableOfContentData = async (pesantrenId: string): Promise<TableOfContentItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - replace with actual API response
  return [
    {
      id: 'tentang-pondok',
      title: 'Tentang Pondok',
      description: 'Informasi umum tentang sejarah, visi, misi, dan profil pondok pesantren',
      icon: 'building',
      content: 'Pondok ini memiliki sejarah panjang dalam pendidikan Islam yang telah berdiri sejak tahun 1985. Dengan visi mencetak generasi Qur\'ani yang berakhlak mulia dan berpengetahuan luas.',
      isExpandable: true
    },
    {
      id: 'kenapa-belajar',
      title: 'Kenapa Belajar di sini',
      description: 'Keunggulan dan alasan memilih pondok pesantren ini',
      icon: 'star',
      content: 'Pondok pesantren ini memiliki keunggulan dalam metode pembelajaran yang menggabungkan tradisi dan modernitas, tenaga pengajar yang berkualitas, serta lingkungan yang kondusif untuk pengembangan karakter.',
      isExpandable: true
    },
    {
      id: 'program-pendidikan',
      title: 'Program Pendidikan',
      description: 'Detail program pendidikan yang tersedia di pondok pesantren',
      icon: 'book',
      content: 'Program pendidikan meliputi: Tahfidz Al-Quran, Kitab Kuning, Bahasa Arab, Bahasa Inggris, Pendidikan Formal (SD, SMP, SMA), dan Program Keterampilan.',
      isExpandable: true
    },
    {
      id: 'program-ekstrakurikuler',
      title: 'Program Ekstrakurikuler',
      description: 'Berbagai kegiatan ekstrakurikuler yang tersedia',
      icon: 'activity',
      content: 'Program ekstrakurikuler meliputi: Pramuka, Olahraga (Futsal, Badminton, Voli), Seni (Kaligrafi, Hadroh), dan Kewirausahaan.',
      isExpandable: true
    },
    {
      id: 'kehidupan-santri',
      title: 'Kehidupan Santri',
      description: 'Gambaran kehidupan sehari-hari santri di pondok pesantren',
      icon: 'users',
      content: 'Kehidupan santri diatur dengan jadwal yang terstruktur mulai dari shalat subuh, mengaji, sekolah formal, istirahat, shalat maghrib, mengaji malam, hingga tidur.',
      isExpandable: true
    },
    {
      id: 'fasilitas',
      title: 'Fasilitas',
      description: 'Fasilitas lengkap yang tersedia untuk mendukung kegiatan santri',
      icon: 'facility',
      content: 'Fasilitas yang tersedia: Asrama Putra & Putri, Masjid, Perpustakaan, Lab Komputer, Lab Bahasa, Klinik Kesehatan, Kantin, Lapangan Olahraga, dan Area Parkir.',
      isExpandable: true
    },
    {
      id: 'prestasi-pondok',
      title: 'Prestasi Pondok & Santri',
      description: 'Berbagai prestasi yang telah diraih oleh pondok dan santri',
      icon: 'award',
      content: 'Prestasi yang telah diraih: Juara 1 Lomba Tahfidz Tingkat Provinsi, Juara 2 Lomba Kaligrafi Nasional, Akreditasi A untuk semua jenjang pendidikan.',
      isExpandable: true
    },
    {
      id: 'alumni-karir',
      title: 'Alumni & Jejak Karier',
      description: 'Informasi tentang alumni dan jejak karier mereka',
      icon: 'graduation',
      content: 'Alumni pondok pesantren tersebar di berbagai profesi: Ustadz, Guru, Dokter, Pengusaha, PNS, dan berbagai bidang lainnya dengan prestasi yang membanggakan.',
      isExpandable: true
    },
    {
      id: 'biaya-pendidikan',
      title: 'Biaya Pendidikan',
      description: 'Informasi lengkap tentang biaya pendidikan dan beasiswa',
      icon: 'dollar',
      content: 'Biaya pendidikan terjangkau dengan berbagai program beasiswa untuk santri berprestasi dan kurang mampu. Tersedia juga program cicilan yang fleksibel.',
      isExpandable: true
    },
    {
      id: 'info-beasiswa',
      title: 'Info Beasiswa',
      description: 'Program beasiswa yang tersedia untuk calon santri',
      icon: 'school',
      content: 'Program beasiswa meliputi: Beasiswa Prestasi Akademik, Beasiswa Tahfidz, Beasiswa Kurang Mampu, dan Beasiswa Yatim Piatu dengan coverage hingga 100%.',
      isExpandable: true
    }
  ];
};

export default function TableOfContentDropdown({ pesantrenId, className = '' }: TableOfContentDropdownProps) {
  const [tocData, setTocData] = useState<TableOfContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTableOfContentData(pesantrenId);
        setTocData(data);
      } catch (err) {
        setError('Gagal memuat informasi detail');
        console.error('Error fetching table of content data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pesantrenId]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="space-y-3">
        {tocData.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <div key={item.id} className="border border-gray-100 rounded-lg overflow-hidden hover:border-gray-200 transition-colors">
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black flex items-center justify-center rounded-full">
                      {getIcon(item.icon)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm textwh-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </div>
              </button>
              
              {isExpanded && item.content && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <div className="pt-4">
                    <p className="text-gray-700 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Informasi diperbarui secara berkala • Data dari API Pondok Pesantren
        </p>
      </div>
    </div>
  );
}