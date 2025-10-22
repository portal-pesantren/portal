'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { 
  Star, 
  MapPin, 
  Users, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  MessageCircle,
  Send,
  Heart,
  Bookmark
} from 'lucide-react';

// Dummy data sesuai desain
const dummyPesantren = {
  name: 'Pondok Pesantren Al-Hikmah',
  location: 'Malang, Jawa Timur',
  rating: 4.8,
  students: 850,
  description: 'Pesantren modern dengan kurikulum terpadu yang menggabungkan pendidikan agama dan umum. Kami berkomitmen untuk membentuk generasi yang berakhlak mulia, cerdas, dan siap menghadapi tantangan zaman.',
  image: '/pesantren-1.svg',
  programs: [
    { name: 'Tahfidz Quran', description: 'Program menghafal Al-Quran 30 juz dengan metode terbaru' },
    { name: 'Kitab Kuning', description: 'Pembelajaran kitab-kitab klasik dengan metode sorogan dan bandongan' },
    { name: 'Bahasa Arab & Inggris', description: 'Program intensif bahasa Arab dan Inggris untuk komunikasi global' },
    { name: 'Keterampilan Hidup', description: 'Pelatihan keterampilan praktis untuk kehidupan sehari-hari' },
    { name: 'Kepemimpinan', description: 'Pembentukan karakter kepemimpinan dan organisasi' },
    { name: 'Teknologi', description: 'Pengenalan teknologi modern dan aplikasinya dalam kehidupan' },
    { name: 'Olahraga', description: 'Kegiatan olahraga untuk menjaga kesehatan jasmani' },
    { name: 'Seni & Budaya', description: 'Pengembangan bakat seni dan pelestarian budaya Islam' },
    { name: 'Wirausaha', description: 'Pelatihan kewirausahaan dan bisnis syariah' }
  ],
  events: [
    { date: '15 Agustus 2024', title: 'Peringatan Kemerdekaan RI', type: 'Nasional' },
    { date: '20 Agustus 2024', title: 'Wisuda Santri Tahfidz', type: 'Akademik' },
    { date: '25 Agustus 2024', title: 'Lomba Pidato Bahasa Arab', type: 'Kompetisi' }
  ],
  gallery: [
    { id: 1, image: '/pesantren-1.svg', title: 'Masjid Utama' },
    { id: 2, image: '/pesantren-2.svg', title: 'Asrama Santri' },
    { id: 3, image: '/pesantren-3.svg', title: 'Ruang Kelas' },
    { id: 4, image: '/pesantren-modern-1.svg', title: 'Perpustakaan' }
  ],
  news: [
    {
      id: 1,
      title: 'Prestasi Santri dalam Lomba Tahfidz Nasional',
      excerpt: 'Santri Al-Hikmah meraih juara 1 dalam lomba tahfidz tingkat nasional...',
      date: '10 Agustus 2024',
      image: '/pesantren-1.svg'
    },
    {
      id: 2,
      title: 'Program Beasiswa untuk Santri Berprestasi',
      excerpt: 'Pesantren membuka program beasiswa penuh untuk santri yang berprestasi...',
      date: '8 Agustus 2024',
      image: '/pesantren-2.svg'
    }
  ]
};

const dummyComments = [
  {
    id: 1,
    name: 'Ahmad Fauzi',
    comment: 'Alhamdulillah, anak saya sangat berkembang di pesantren ini. Akhlaknya semakin baik dan hafalannya bertambah.',
    date: '2 hari yang lalu',
    rating: 5
  },
  {
    id: 2,
    name: 'Siti Aminah',
    comment: 'Fasilitas lengkap dan ustadz-ustadzahnya sangat sabar dalam mengajar. Recommended!',
    date: '1 minggu yang lalu',
    rating: 5
  },
  {
    id: 3,
    name: 'Muhammad Rizki',
    comment: 'Program tahfidznya sangat bagus. Anak saya sudah hafal 10 juz dalam 2 tahun.',
    date: '2 minggu yang lalu',
    rating: 4
  }
];

export default function PesantrenDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('Agustus 2024');

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === dummyPesantren.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? dummyPesantren.gallery.length - 1 : prev - 1
    );
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Handle comment submission
      console.log('New comment:', newComment);
      setNewComment('');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                {dummyPesantren.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{dummyPesantren.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(Math.floor(dummyPesantren.rating))}
                  <span className="ml-1">{dummyPesantren.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{dummyPesantren.students} Santri</span>
                </div>
              </div>
              <p className="text-lg max-w-2xl">
                {dummyPesantren.description}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Program Pendidikan */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Pendidikan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dummyPesantren.programs.map((program, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{program.name}</h3>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{program.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Kalender Event */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Kalender Event</h2>
                  <select 
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="Agustus 2024">Agustus 2024</option>
                    <option value="September 2024">September 2024</option>
                    <option value="Oktober 2024">Oktober 2024</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  {dummyPesantren.events.map((event, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'Nasional' ? 'bg-red-100 text-red-800' :
                        event.type === 'Akademik' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Galeri Pondok */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Pondok Pesantren</h2>
                
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <div className="w-8 h-8 bg-white rounded"></div>
                        </div>
                        <p className="text-gray-600">{dummyPesantren.gallery[currentImageIndex].title}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {dummyPesantren.gallery.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square bg-gray-200 rounded-lg overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Kolom Komentar */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kolom Komentar</h2>
                
                {/* Form Komentar */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis komentar Anda..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      className="self-end bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                {/* Daftar Komentar */}
                <div className="space-y-4">
                  {dummyComments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            {comment.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                            <div className="flex items-center">
                              {renderStars(comment.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{comment.comment}</p>
                          <span className="text-sm text-gray-500">{comment.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Berita Pondok */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Berita Pondok</h3>
                <div className="space-y-4">
                  {dummyPesantren.news.map((news) => (
                    <div key={news.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded"></div>
                          </div>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <span className="text-xs text-gray-500">{news.date}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Aksi Cepat</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Tambah ke Favorit</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                    <span>Simpan untuk Nanti</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span>Hubungi Pesantren</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}