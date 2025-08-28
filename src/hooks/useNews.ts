import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService, type News, type NewsSearchParams, type NewsCreateData, type NewsUpdateData } from '@/services/newsService';

// Mock data for fallback when API is not available
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Aries Baswadan di Pabuaran',
    slug: 'aries-baswadan-di-pabuaran',
    excerpt: 'Menteri Agus Gumiwang Kartasasmita mengunjungi Pondok Pesantren Pabuaran untuk melihat langsung program pendidikan yang telah berjalan.',
    content: 'Content lengkap artikel...',
    category: 'berita',
    tags: ['kunjungan', 'pendidikan'],
    featuredImage: 'https://picsum.photos/400/250?random=1',
    author: {
      id: '1',
      name: 'Admin Portal',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    views: 150,
    likes: 25,
    readingTime: 3,
    isPublished: true,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Program Beasiswa Santri Berprestasi',
    slug: 'program-beasiswa-santri-berprestasi',
    excerpt: 'Kementerian Agama meluncurkan program beasiswa untuk santri berprestasi di seluruh Indonesia dengan total dana 50 miliar rupiah.',
    content: 'Content lengkap artikel...',
    category: 'pengumuman',
    tags: ['beasiswa', 'santri'],
    featuredImage: 'https://picsum.photos/400/250?random=2',
    author: {
      id: '2',
      name: 'Tim Redaksi',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: new Date('2024-01-14T09:00:00Z'),
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
    excerpt: 'Pesantren di era digital mulai mengintegrasikan teknologi dalam pembelajaran untuk mempersiapkan santri menghadapi tantangan masa depan.',
    content: 'Content lengkap artikel...',
    category: 'artikel',
    tags: ['pendidikan', 'teknologi'],
    featuredImage: 'https://picsum.photos/400/250?random=3',
    author: {
      id: '3',
      name: 'Dr. Ahmad Syafi\'i',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: new Date('2024-01-13T08:00:00Z'),
    views: 120,
    likes: 18,
    readingTime: 4,
    isPublished: true,
    isFeatured: false
  },
  {
    id: '4',
    title: 'Festival Seni Budaya Pesantren',
    slug: 'festival-seni-budaya-pesantren',
    excerpt: 'Ratusan santri dari berbagai pesantren se-Jawa Barat mengikuti festival seni budaya untuk melestarikan warisan budaya Islam.',
    content: 'Content lengkap artikel...',
    category: 'kegiatan',
    tags: ['budaya', 'festival'],
    featuredImage: 'https://picsum.photos/400/250?random=4',
    author: {
      id: '4',
      name: 'Humas Pesantren',
      avatar: '/api/placeholder/40/40'
    },
    publishedAt: new Date('2024-01-12T07:00:00Z'),
    views: 300,
    likes: 55,
    readingTime: 6,
    isPublished: true,
    isFeatured: true
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
    publishedAt: new Date('2024-01-11T06:00:00Z'),
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
    publishedAt: new Date('2024-01-10T05:00:00Z'),
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
  publishedAt: Date;
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
          ...response,
          data: response.data.map(transformNewsToNewsItem),
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

export function useNewsDetail(slug: string) {
  return useQuery({
    queryKey: NEWS_KEYS.slug(slug),
    queryFn: async () => {
      try {
        const response = await newsService.getNewsBySlug(slug);
        return transformNewsToNewsItem(response);
      } catch (error) {
        console.warn('API tidak tersedia, menggunakan data mock untuk news detail');
        const mockItem = mockNewsData.find(item => item.slug === slug);
        if (!mockItem) {
          throw new Error('News not found');
        }
        return mockItem;
      }
    },
    enabled: !!slug,
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
  return useQuery({
    queryKey: ['news', 'latest', limit],
    queryFn: async () => {
      try {
        return await newsService.getLatestNews(limit);
      } catch (error) {
        // Silently return mock data on API failure
        console.warn('API tidak tersedia, menggunakan data mock untuk latest news');
        return mockNewsData.slice(0, limit);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry, use fallback immediately
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