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
  Bookmark,
  Home,
  BookOpen,
  Target,
  GraduationCap,
  Trophy,
  Camera
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
  const [activeSection, setActiveSection] = useState('tentang');

  const navigationItems = [
    { id: 'tentang', label: 'Tentang Pondok', icon: Home },
    { id: 'program', label: 'Program Pendidikan', icon: BookOpen },
    { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
    { id: 'keunggulan', label: 'Keunggulan Santri', icon: Trophy },
    { id: 'pendaftaran', label: 'Info Pendaftaran', icon: GraduationCap },
    { id: 'galeri', label: 'Galeri', icon: Camera },
    { id: 'komentar', label: 'Komentar', icon: MessageCircle }
  ];

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
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < Math.floor(dummyPesantren.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
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
          <div className="grid grid-cols-12 gap-8">
            
            {/* Sidebar Kiri - Daftar Isi */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Isi</h3>
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === item.id
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Konten Utama */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
              
              {/* Tentang Pondok */}
              <section id="tentang" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tentang Pondok</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {dummyPesantren.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{dummyPesantren.students}</div>
                    <div className="text-sm text-gray-600">Total Santri</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1995</div>
                    <div className="text-sm text-gray-600">Tahun Berdiri</div>
                  </div>
                </div>
              </section>

              {/* Program Pendidikan */}
              <section id="program" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Program Pendidikan</h2>
                <div className="space-y-4">
                  {dummyPesantren.programs.map((program, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-600">{program.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Visi & Misi */}
              <section id="visi-misi" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Visi & Misi</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">Visi</h3>
                    <p className="text-gray-600">
                      Menjadi lembaga pendidikan Islam terdepan yang menghasilkan generasi Qurani, berakhlak mulia, dan berprestasi.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">Misi</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        Menyelenggarakan pendidikan Islam yang berkualitas dan berkarakter
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        Membina santri menjadi hafidz Al-Quran yang berakhlak mulia
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                        Mengembangkan potensi santri dalam bidang akademik dan non-akademik
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Keunggulan Santri */}
              <section id="keunggulan" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Keunggulan Santri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'Hafal Al-Quran 30 Juz',
                    'Menguasai Bahasa Arab & Inggris',
                    'Berprestasi Akademik',
                    'Berkarakter Islami',
                    'Mandiri & Disiplin',
                    'Kreatif & Inovatif'
                  ].map((keunggulan, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Trophy className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{keunggulan}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Info Pendaftaran */}
              <section id="pendaftaran" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Info Pendaftaran</h2>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Pendaftaran Tahun Ajaran 2024/2025</h3>
                  <p className="text-blue-700">Pendaftaran dibuka mulai 1 Januari - 30 Juni 2024</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Persyaratan:</h4>
                    <ul className="space-y-1 text-gray-600 ml-4">
                      <li>• Lulusan SD/MI atau sederajat</li>
                      <li>• Usia maksimal 15 tahun</li>
                      <li>• Sehat jasmani dan rohani</li>
                      <li>• Melengkapi berkas pendaftaran</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biaya Pendaftaran:</h4>
                    <p className="text-gray-600">Rp 500.000 (sudah termasuk seragam dan perlengkapan)</p>
                  </div>
                </div>
              </section>

              {/* Galeri */}
              <section id="galeri" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeri Pondok Pesantren</h2>
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={dummyPesantren.gallery[currentImageIndex].image}
                      alt={dummyPesantren.gallery[currentImageIndex].title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                  {dummyPesantren.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </section>

              {/* Komentar */}
              <section id="komentar" className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Komentar & Ulasan</h2>
                
                {/* Form Komentar */}
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Tulis komentar Anda..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {newComment.length}/500 karakter
                        </span>
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Kirim
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Daftar Komentar */}
                <div className="space-y-6">
                  {dummyComments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {comment.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{comment.name}</h4>
                            <span className="text-sm text-gray-500">{comment.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {renderStars(comment.rating)}
                          </div>
                          <p className="text-gray-700">{comment.comment}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">0</span>
                          </button>
                          <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors">
                            Balas
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Kanan - Berita */}
            <div className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Berita Pondok</h3>
                <div className="space-y-4">
                  {dummyPesantren.news.map((article) => (
                    <article key={article.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="w-full h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{article.date}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                    </article>
                  ))}
                </div>
                
                {/* Kalender Event */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Kalender Event</h3>
                  <div className="space-y-3">
                    {dummyPesantren.events.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-sm font-bold text-blue-600">{event.date}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                          <p className="text-xs text-gray-600">{event.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Aksi Cepat */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      Simpan Pesantren
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      Hubungi Pesantren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}