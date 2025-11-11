import { NavigationItem, Feature, ContactInfo } from '@/types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  TIMEOUT: 10000, // 10 seconds
  ENDPOINTS: {
    // Health & Info
    HEALTH: '/health',
    
    // Authentication
    AUTH: {
      LOGIN: '/users/login',
      REGISTER: '/users/register',
      LOGOUT: '/users/logout',
      PROFILE: '/users/profile',
      REFRESH: '/users/refresh',
      VERIFY_EMAIL: '/users/verify-email',
      FORGOT_PASSWORD: '/users/forgot-password',
      RESET_PASSWORD: '/users/reset-password',
      CHANGE_PASSWORD: '/users/change-password',
    },
    
    // Pesantren
    PESANTREN: {
      LIST: '/pesantren',
      CREATE: '/pesantren',
      DETAIL: '/pesantren',
      UPDATE: '/pesantren',
      DELETE: '/pesantren',
      BY_CODE: '/pesantren/code',
      FEATURED: '/pesantren/featured',
      POPULAR: '/pesantren/popular',
      STATS: '/pesantren/stats',
      SEARCH: '/pesantren/search',
      REVIEWS: '/pesantren',
    },
    
    // News
    NEWS: {
      LIST: '/news',
      CREATE: '/news',
      DETAIL: '/news',
      UPDATE: '/news',
      DELETE: '/news',
      BY_SLUG: '/news/slug',
      FEATURED: '/news/featured',
      POPULAR: '/news/popular',
      PUBLISH: '/news',
      UNPUBLISH: '/news',
      VIEWS: '/news',
      LIKE: '/news',
      UNLIKE: '/news',
      CATEGORIES: '/news/categories',
      TAGS: '/news/tags/popular',
      SEARCH: '/news/search',
      STATS: '/news/stats',
    },
    
    // Applications
    APPLICATIONS: {
      LIST: '/applications',
      CREATE: '/applications',
      DETAIL: '/applications',
      UPDATE: '/applications',
      DELETE: '/applications',
      STATUS: '/applications',
      INTERVIEW: '/applications',
      DOCUMENTS: '/applications',
      STATS: '/applications/stats',
    },
    
    // Consultations
    CONSULTATIONS: {
      LIST: '/consultations',
      CREATE: '/consultations',
      DETAIL: '/consultations',
      UPDATE: '/consultations',
      CANCEL: '/consultations',
      SLOTS: '/consultations/available-slots',
      SCHEDULE: '/consultations',
      COMPLETE: '/consultations',
      STATS: '/consultations/stats',
      TYPES: '/consultations/types',
      FEEDBACK: '/consultations',
    },
    
    // Admin endpoints
    ADMIN: {
      USERS: '/users',
      PESANTREN: '/pesantren',
      NEWS: '/news',
      APPLICATIONS: '/applications',
      CONSULTATIONS: '/consultations',
    }
  }
};

// Navigation items
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Beranda', href: '#beranda' },
  { name: 'Tentang', href: '#tentang' },
  { name: 'Pesantren', href: '#pesantren' },
  { name: 'Kontak', href: '#kontak' },
];

// Features data
export const FEATURES: Feature[] = [
  {
    icon: "🔍",
    title: "Pencarian Mudah",
    description: "Temukan pesantren dengan filter lokasi, program, dan fasilitas yang sesuai kebutuhan."
  },
  {
    icon: "⭐",
    title: "Review Terpercaya",
    description: "Baca review dan rating dari orang tua dan alumni untuk membantu keputusan Anda."
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Akses platform kami kapan saja dan dimana saja melalui smartphone atau tablet."
  },
  {
    icon: "🎓",
    title: "Program Lengkap",
    description: "Informasi detail tentang kurikulum, program tahfidz, dan kegiatan ekstrakurikuler."
  },
  {
    icon: "🏠",
    title: "Fasilitas Terbaik",
    description: "Lihat foto dan informasi lengkap tentang asrama, masjid, dan fasilitas pendukung."
  },
  {
    icon: "💬",
    title: "Konsultasi Gratis",
    description: "Dapatkan konsultasi gratis dari tim ahli kami untuk memilih pesantren yang tepat."
  }
];

// Contact information
export const CONTACT_INFO: ContactInfo = {
  phone: '+62 21 1234 5678',
  email: 'info@portalpesantren.com',
  address: 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
  socialMedia: {
    facebook: 'https://facebook.com/portalpesantren',
    instagram: 'https://instagram.com/portalpesantren',
    twitter: 'https://twitter.com/portalpesantren',
    youtube: 'https://youtube.com/portalpesantren',
  },
};

// Popular programs
export const POPULAR_PROGRAMS = [
  'Tahfidz Al-Quran',
  'Kitab Kuning',
  'Bahasa Arab',
  'Bahasa Inggris',
  'Sains & Teknologi',
  'Entrepreneurship',
  'Leadership',
  'Seni & Budaya',
  'Olahraga',
  'Multimedia',
];

// Indonesian provinces for location filter
export const PROVINCES = [
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
  'DI Yogyakarta',
  'Banten',
  'Sumatera Utara',
  'Sumatera Barat',
  'Sumatera Selatan',
  'Lampung',
  'Kalimantan Barat',
  'Kalimantan Timur',
  'Kalimantan Selatan',
  'Sulawesi Selatan',
  'Sulawesi Utara',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
];

// Common facilities
export const FACILITIES = [
  'Asrama Putra',
  'Asrama Putri',
  'Masjid',
  'Perpustakaan',
  'Laboratorium',
  'Lapangan Olahraga',
  'Kantin',
  'Klinik Kesehatan',
  'Ruang Komputer',
  'Wifi',
  'AC',
  'Laundry',
];

// App metadata
export const APP_METADATA = {
  title: 'Portal Pesantren - Temukan Pesantren Terbaik untuk Anak Anda',
  description: 'Platform terpercaya untuk menemukan dan membandingkan pesantren terbaik di Indonesia. Dapatkan informasi lengkap, review, dan konsultasi gratis.',
  keywords: [
    'pesantren',
    'pondok pesantren',
    'pendidikan islam',
    'tahfidz',
    'santri',
    'boarding school',
    'islamic education',
    'indonesia',
  ],
  author: 'Portal Pesantren Team',
  url: 'https://portalpesantren.com',
  image: '/og-image.jpg',
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  pesantren: '/api/pesantren',
  search: '/api/search',
  reviews: '/api/reviews',
  contact: '/api/contact',
  consultation: '/api/consultation',
};

// Pagination settings
export const PAGINATION = {
  defaultLimit: 9,
  maxLimit: 50,
};

// Rating system
export const RATING = {
  min: 1,
  max: 5,
  step: 0.1,
};