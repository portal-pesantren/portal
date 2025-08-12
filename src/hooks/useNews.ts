'use client';

import { useQuery } from '@tanstack/react-query';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  publishedAt: string;
  slug: string;
  category?: string;
  author?: string;
}

interface NewsResponse {
  data: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Mock data untuk sementara sampai backend siap
const mockNewsData: NewsItem[] = [
  {
    id: '1',
    title: 'Pesantren Modern Terdepan dalam Pendidikan Digital',
    description: 'Pesantren Al-Hikmah mengintegrasikan teknologi digital dalam pembelajaran untuk mempersiapkan santri menghadapi era digital.',
    publishedAt: '2024-01-15',
    slug: 'pesantren-modern-pendidikan-digital',
    category: 'Pendidikan',
    author: 'Tim Redaksi'
  },
  {
    id: '2',
    title: 'Program Beasiswa Santri Berprestasi 2024',
    description: 'Kementerian Agama membuka program beasiswa untuk santri berprestasi di seluruh Indonesia dengan total dana 50 miliar rupiah.',
    publishedAt: '2024-01-12',
    slug: 'program-beasiswa-santri-2024',
    category: 'Beasiswa',
    author: 'Admin Portal'
  },
  {
    id: '3',
    title: 'Pesantren Salaf Tetap Eksis di Era Modern',
    description: 'Meskipun zaman terus berkembang, pesantren salaf tetap mempertahankan tradisi pembelajaran klasik yang terbukti efektif.',
    publishedAt: '2024-01-10',
    slug: 'pesantren-salaf-era-modern',
    category: 'Tradisi',
    author: 'Dr. Ahmad Fauzi'
  },
  {
    id: '4',
    title: 'Inovasi Kurikulum Pesantren untuk Generasi Z',
    description: 'Pesantren-pesantren terkemuka mulai mengadaptasi kurikulum yang sesuai dengan karakteristik dan kebutuhan generasi Z.',
    publishedAt: '2024-01-08',
    slug: 'inovasi-kurikulum-generasi-z',
    category: 'Inovasi',
    author: 'Prof. Siti Nurhaliza'
  }
];

const fetchNews = async (params: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<NewsResponse> => {
  // Simulasi API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { page = 1, limit = 4, category } = params;
  
  let filteredNews = mockNewsData;
  if (category && category !== 'all') {
    filteredNews = mockNewsData.filter(news => 
      news.category?.toLowerCase() === category.toLowerCase()
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNews = filteredNews.slice(startIndex, endIndex);
  
  return {
    data: paginatedNews,
    pagination: {
      page,
      limit,
      total: filteredNews.length,
      totalPages: Math.ceil(filteredNews.length / limit)
    }
  };
};

export const useNews = (params: {
  page?: number;
  limit?: number;
  category?: string;
} = {}) => {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLatestNews = (limit: number = 4) => {
  return useNews({ page: 1, limit });
};

export type { NewsItem, NewsResponse };