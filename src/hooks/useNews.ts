import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService, type News, type NewsSearchParams, type NewsCreateData, type NewsUpdateData } from '@/services/newsService';

// Mock data for fallback when API is not available
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Menteri Agama Gumawan Kartoasasmita mengunjungi Pondok Pesantren Pabuaran',
    slug: 'menteri-agama-gunawan-di-paburuan',
    excerpt: 'Menteri Agama Gumawan Kartoasasmita mengunjungi Pondok Pesantren Pabuaran untuk melihat langsung program pendidikan yang telah berjalan.',
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Kembali ke Pesantren Lama</h2>
        <p class="text-gray-700 leading-relaxed">
          Menteri Agama Gumawan Kartoasasmita melakukan kunjungan kerja ke Pondok Pesantren Pabuaran dalam rangka meninjau langsung implementasi program pendidikan pesantren yang telah berjalan. Dalam kunjungannya, beliau menyampaikan apresiasi terhadap sistem pendidikan yang memadukan kurikulum nasional dengan nilai-nilai keislaman.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Pesan untuk Generasi Santri</h3>
        <p class="text-gray-700 leading-relaxed">
          "Pesantren memiliki peran yang sangat penting dalam membentuk karakter bangsa. Melalui pendidikan yang holistik, pesantren tidak hanya mengajarkan ilmu agama, tetapi juga mempersiapkan santri untuk menghadapi tantangan zaman modern," ujar Menteri Agama dalam sambutannya.
        </p>
        
        <div class="my-6">
          <img src="https://picsum.photos/600/400?random=10" alt="Suasana kunjungan Menteri" class="w-full rounded-lg shadow-md" />
          <p class="text-sm text-gray-500 mt-2 text-center">Menteri Agama berdialog dengan para santri dan pengasuh pesantren</p>
        </div>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Sambutan Hangat dari Pihak Pesantren</h3>
        <p class="text-gray-700 leading-relaxed">
          Pengasuh Pondok Pesantren Pabuaran, KH. Ahmad Syafi'i, menyambut baik kunjungan Menteri Agama. "Kami sangat berterima kasih atas perhatian pemerintah terhadap dunia pesantren. Dukungan ini akan semakin memperkuat peran pesantren dalam mencerdaskan bangsa," ungkapnya.
        </p>
        
        <h3 class="text-xl font-semibold text-gray-900 mt-6 mb-3">Makna Kunjungan</h3>
        <p class="text-gray-700 leading-relaxed">
          Kunjungan ini merupakan bagian dari program pemerintah untuk memperkuat sinergi antara pendidikan formal dan pesantren. Diharapkan melalui kolaborasi ini, kualitas pendidikan di Indonesia dapat terus meningkat dan menghasilkan generasi yang berakhlak mulia serta kompeten di bidangnya.
        </p>
      </div>
    `,
    category: 'berita',
    tags: ['kunjungan', 'menteri', 'pabuaran', 'pendidikan'],
    featuredImage: 'https://picsum.photos/400/250?random=1',
    author: {
      id: '1',
      name: 'Admin Portal',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-15T10:00:00Z',
    views: 150,
    likes: 25,
    readingTime: 3,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Program Beasiswa Berprestasi',
    slug: 'program-beasiswa-berprestasi',
    excerpt: 'Kementerian Agama meluncurkan beasiswa untuk santri berprestasi di seluruh Indonesia dengan total dana 50 miliar rupiah.',
    content: 'Kementerian Agama Republik Indonesia resmi meluncurkan program beasiswa untuk santri berprestasi di seluruh Indonesia. Program ini mengalokasikan total dana sebesar 50 miliar rupiah untuk mendukung pendidikan santri yang memiliki prestasi akademik dan non-akademik yang membanggakan.',
    category: 'pengumuman',
    tags: ['beasiswa', 'santri', 'prestasi', 'kemenag'],
    featuredImage: 'https://picsum.photos/400/250?random=2',
    author: {
      id: '2',
      name: 'Tim Redaksi',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-14T09:00:00Z',
    views: 200,
    likes: 40,
    readingTime: 5,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '3',
    title: 'Modernisasi Kurikulum Pesantren',
    slug: 'modernisasi-kurikulum-pesantren',
    excerpt: 'Transformasi era digital mulai mengintegrasikan teknologi dalam pembelajaran untuk mempersiapkan santri menghadapi tantangan masa depan.',
    content: 'Transformasi era digital telah membawa perubahan signifikan dalam dunia pendidikan pesantren. Banyak pesantren kini mulai mengintegrasikan teknologi dalam sistem pembelajaran mereka untuk mempersiapkan santri menghadapi tantangan masa depan yang semakin kompleks.',
    category: 'artikel',
    tags: ['kurikulum', 'modernisasi', 'teknologi', 'digital'],
    featuredImage: 'https://picsum.photos/400/250?random=3',
    author: {
      id: '3',
      name: 'Dr. Ahmad Syafi\'i',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-13T08:00:00Z',
    views: 1950,
    likes: 142,
    readingTime: 7,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '4',
    title: 'Festival Seni Budaya Pesantren',
    slug: 'festival-seni-budaya-pesantren',
    excerpt: 'Ratusan santri dari berbagai pesantren se-Jawa Barat mengikuti festival seni budaya untuk melestarikan warisan budaya Islam.',
    content: 'Festival seni budaya pesantren digelar dengan meriah di Bandung, Jawa Barat. Ratusan santri dari berbagai pesantren se-Jawa Barat berpartisipasi dalam acara ini untuk melestarikan dan mengembangkan warisan budaya Islam yang kaya dan beragam.',
    category: 'kegiatan',
    tags: ['festival', 'seni', 'budaya', 'santri'],
    featuredImage: 'https://picsum.photos/400/250?random=4',
    author: {
      id: '4',
      name: 'Panitia Festival',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-12T07:00:00Z',
    views: 1650,
    likes: 98,
    readingTime: 5,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '5',
    title: 'Kerjasama Internasional Pesantren',
    slug: 'kerjasama-internasional-pesantren',
    excerpt: 'Pesantren Al-Azhar menjalin kerjasama dengan universitas di Timur Tengah untuk program pertukaran santri dan pengajar.',
    content: 'Content lengkap artikel...',
    category: 'berita',
    tags: ['internasional', 'kerjasama'],
    featuredImage: 'https://picsum.photos/400/250?random=5',
    author: {
      id: '5',
      name: 'Redaksi',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-11T06:00:00Z',
    views: 180,
    likes: 32,
    readingTime: 7,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '6',
    title: 'Inovasi Pembelajaran Digital',
    slug: 'inovasi-pembelajaran-digital',
    excerpt: 'Pesantren modern mulai menggunakan platform e-learning untuk mendukung pembelajaran jarak jauh dan hybrid learning.',
    content: 'Content lengkap artikel...',
    category: 'tips',
    tags: ['teknologi', 'pembelajaran'],
    featuredImage: 'https://picsum.photos/400/250?random=6',
    author: {
      id: '6',
      name: 'Tim IT Pesantren',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: '2024-01-10T05:00:00Z',
    views: 250,
    likes: 45,
    readingTime: 5,
    isPublished: true,
    isFeatured: false
  }
];

// Query keys
const NEWS_KEYS = {
  all: ['news'] as const,
  lists: () => [...NEWS_KEYS.all, 'list'] as const,
  list: (params: NewsSearchParams) => [...NEWS_KEYS.lists(), params] as const,
  details: () => [...NEWS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NEWS_KEYS.details(), id] as const,
  slug: (slug: string) => [...NEWS_KEYS.all, 'slug', slug] as const,
  categories: () => [...NEWS_KEYS.all, 'categories'] as const,
  tags: () => [...NEWS_KEYS.all, 'tags'] as const,
};

// Legacy interface for backward compatibility
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  views: number;
  likes: number;
  readingTime: number;
  isPublished: boolean;
  isFeatured: boolean;
}

export interface NewsFilters {
  category?: string;
  tags?: string[];
  search?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export interface NewsResponse {
  data: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Transform News to NewsItem for backward compatibility
function transformNewsToNewsItem(news: News): NewsItem {
  return {
    id: news.id,
    title: news.title,
    slug: news.slug,
    excerpt: news.excerpt,
    content: news.content,
    category: news.category,
    tags: news.tags,
    featuredImage: news.featuredImage,
    author: {
      id: news.authorId,
      name: news.authorName,
      avatar: news.authorAvatar,
    },
    publishedAt: news.publishDate || news.createdAt,
    views: news.views,
    likes: news.likes,
    readingTime: news.readingTime,
    isPublished: news.isPublished,
    isFeatured: news.isFeatured,
  };
}

// Transform NewsFilters to NewsSearchParams
function transformFiltersToParams(filters: NewsFilters): NewsSearchParams {
  return {
    query: filters.search,
    category: filters.category,
    tags: filters.tags,
    is_featured: filters.featured,
    is_published: true, // Only show published news by default
    limit: filters.limit,
    page: filters.page,
    sort_by: 'published_at',
    sort_order: 'desc',
  };
}

export function useNews(filters: NewsFilters = {}) {
  const params = transformFiltersToParams(filters);
  
  return useQuery({
    queryKey: NEWS_KEYS.list(params),
    queryFn: async () => {
      try {
        const response = await newsService.getNews(params);
        return {
          data: response.data.map(transformNewsToNewsItem),
          pagination: response.pagination,
        };
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk news');
        // Filter mock data based on filters
        let filteredData = [...mockNewsData];
        
        if (filters.search) {
          const query = filters.search.toLowerCase();
          filteredData = filteredData.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.excerpt.toLowerCase().includes(query)
          );
        }
        
        if (filters.category) {
          filteredData = filteredData.filter(item => item.category === filters.category);
        }
        
        if (filters.featured !== undefined) {
          filteredData = filteredData.filter(item => item.isFeatured === filters.featured);
        }
        
        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        return {
          data: paginatedData,
          pagination: {
            page,
            limit,
            total: filteredData.length,
            totalPages: Math.ceil(filteredData.length / limit)
          }
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useNewsDetail(slugOrId: string) {
  return useQuery({
    queryKey: NEWS_KEYS.slug(slugOrId),
    queryFn: async () => {
      try {
        const response = await newsService.getNewsBySlug(slugOrId);
        return transformNewsToNewsItem(response);
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk news detail');
        // Try to find by slug first, then by ID
        let mockItem = mockNewsData.find(item => item.slug === slugOrId);
        if (!mockItem) {
          mockItem = mockNewsData.find(item => item.id === slugOrId);
        }
        if (!mockItem) {
          throw new Error('News not found');
        }
        return mockItem;
      }
    },
    enabled: !!slugOrId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useFeaturedNews(limit: number = 3) {
  return useQuery({
    queryKey: NEWS_KEYS.list({ is_featured: true, limit, is_published: true }),
    queryFn: async () => {
      try {
        const response = await newsService.getFeaturedNews(limit);
        return response.map(transformNewsToNewsItem);
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk featured news');
        return mockNewsData.filter(item => item.isFeatured).slice(0, limit);
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useLatestNews(limit: number = 6) {
  return useQuery<NewsItem[]>({
    queryKey: ['news', 'latest', limit],
    queryFn: async () => {
      try {
        const items = await newsService.getLatestNews(limit);
        // Jika backend mengembalikan kosong, tampilkan kosong tanpa fallback
        if (!items || items.length === 0) {
          console.warn('Latest news kosong dari backend');
          return [];
        }
        return items.map(transformNewsToNewsItem);
      } catch (error) {
        // Propagasikan error agar UI menampilkan state error, tanpa mock
        console.error('Gagal memuat latest news dari backend:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useNewsCategories() {
  return useQuery({
    queryKey: NEWS_KEYS.categories(),
    queryFn: () => newsService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function usePopularTags() {
  return useQuery({
    queryKey: NEWS_KEYS.tags(),
    queryFn: () => newsService.getPopularTags(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Admin hooks for managing news
export function useCreateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: NewsCreateData) => newsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewsUpdateData }) => 
      newsService.updateNews(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}

export function usePublishNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.publishNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
    },
  });
}

export function useUnpublishNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.unpublishNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
    },
  });
}

export function useLikeNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.likeNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
    },
  });
}

export function useUnlikeNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.unlikeNews(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
    },
  });
}

export function useIncrementNewsViews() {
  return useMutation({
    mutationFn: (id: string) => newsService.incrementViews(id),
    // Don't invalidate queries for view count to avoid unnecessary refetches
  });
}

// Hook untuk mengambil berita berdasarkan pesantren
export function useNewsByPesantren(pesantrenId: string, filters: NewsFilters = {}) {
  const params = {
    ...transformFiltersToParams(filters),
    pesantren_id: pesantrenId,
  };
  
  return useQuery({
    queryKey: [...NEWS_KEYS.list(params), 'pesantren', pesantrenId],
    queryFn: async () => {
      try {
        const response = await newsService.getNews(params);
        return {
          ...response,
          data: response.data.map(transformNewsToNewsItem),
        };
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk news pesantren');
        // Filter mock data untuk pesantren tertentu
        const filteredData = mockNewsData.slice(0, filters.limit || 4);
        
        return {
          data: filteredData,
          pagination: {
            page: 1,
            limit: filters.limit || 4,
            total: filteredData.length,
            totalPages: 1,
          },
        };
      }
    },
    enabled: !!pesantrenId,
  });
}

// Hook untuk mendapatkan statistik news
export function useNewsStats() {
  return useQuery({
    queryKey: [...NEWS_KEYS.all, 'stats'],
    queryFn: async () => {
      try {
        return await newsService.getNewsStats();
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk news stats');
        // Return mock stats data
        return {
          total: 450,
          total_news: 450,
          total_views: 125000,
          totalViews: 125000,
          totalLikes: 2500,
          featured_count: 25,
          featured: 25,
          published: 420,
          published_today: 5,
          published_this_week: 18,
          published_this_month: 75,
          categoriesCount: 8,
          popular_categories: [
            { name: 'Prestasi', count: 120 },
            { name: 'Tips', count: 95 },
            { name: 'Kegiatan', count: 85 }
          ]
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}