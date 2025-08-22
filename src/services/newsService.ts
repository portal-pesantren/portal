import { api } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/types';

// News interfaces based on backend DTO
export interface NewsData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image?: string;
  images: string[];
  author_id: string;
  author_name: string;
  author_avatar?: string;
  pesantren_id?: string;
  pesantren_name?: string;
  is_published: boolean;
  is_featured: boolean;
  publish_date?: string;
  views: number;
  likes: number;
  dislikes: number;
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiNews {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured_image?: string;
  images: string[];
  author_id: string;
  author_name: string;
  author_avatar?: string;
  pesantren_id?: string;
  pesantren_name?: string;
  is_published: boolean;
  is_featured: boolean;
  publish_date?: string;
  views: number;
  likes: number;
  dislikes: number;
  reading_time: number;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  images: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  pesantrenId?: string;
  pesantrenName?: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishDate?: Date;
  views: number;
  likes: number;
  dislikes: number;
  readingTime: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  author_id?: string;
  pesantren_id?: string;
  is_featured?: boolean;
  is_published?: boolean;
  published_from?: string;
  published_to?: string;
  sort_by?: 'created_at' | 'published_at' | 'views' | 'likes' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface NewsCreateData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  images?: string[];
  pesantren_id?: string;
  is_featured?: boolean;
  publish_date?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface NewsUpdateData {
  title?: string;
  content?: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
  images?: string[];
  pesantren_id?: string;
  is_featured?: boolean;
  is_published?: boolean;
  publish_date?: string;
  meta_title?: string;
  meta_description?: string;
}

// Transform functions
function transformApiNewsToNews(apiNews: ApiNews): News {
  return {
    id: apiNews._id,
    title: apiNews.title,
    slug: apiNews.slug,
    content: apiNews.content,
    excerpt: apiNews.excerpt,
    category: apiNews.category,
    tags: apiNews.tags,
    featuredImage: apiNews.featured_image,
    images: apiNews.images,
    authorId: apiNews.author_id,
    authorName: apiNews.author_name,
    authorAvatar: apiNews.author_avatar,
    pesantrenId: apiNews.pesantren_id,
    pesantrenName: apiNews.pesantren_name,
    isPublished: apiNews.is_published,
    isFeatured: apiNews.is_featured,
    publishDate: apiNews.publish_date ? new Date(apiNews.publish_date) : undefined,
    views: apiNews.views,
    likes: apiNews.likes,
    dislikes: apiNews.dislikes,
    readingTime: apiNews.reading_time,
    metaTitle: apiNews.meta_title,
    metaDescription: apiNews.meta_description,
    createdAt: new Date(apiNews.created_at),
    updatedAt: new Date(apiNews.updated_at),
  };
}

function transformNewsCreateDataToApi(data: NewsCreateData): Record<string, any> {
  return {
    title: data.title,
    content: data.content,
    excerpt: data.excerpt,
    category: data.category,
    tags: data.tags || [],
    featured_image: data.featured_image,
    images: data.images || [],
    pesantren_id: data.pesantren_id,
    is_featured: data.is_featured || false,
    publish_date: data.publish_date,
    meta_title: data.meta_title,
    meta_description: data.meta_description,
  };
}

function transformNewsUpdateDataToApi(data: NewsUpdateData): Record<string, any> {
  const apiData: Record<string, any> = {};
  
  if (data.title !== undefined) apiData.title = data.title;
  if (data.content !== undefined) apiData.content = data.content;
  if (data.excerpt !== undefined) apiData.excerpt = data.excerpt;
  if (data.category !== undefined) apiData.category = data.category;
  if (data.tags !== undefined) apiData.tags = data.tags;
  if (data.featured_image !== undefined) apiData.featured_image = data.featured_image;
  if (data.images !== undefined) apiData.images = data.images;
  if (data.pesantren_id !== undefined) apiData.pesantren_id = data.pesantren_id;
  if (data.is_featured !== undefined) apiData.is_featured = data.is_featured;
  if (data.is_published !== undefined) apiData.is_published = data.is_published;
  if (data.publish_date !== undefined) apiData.publish_date = data.publish_date;
  if (data.meta_title !== undefined) apiData.meta_title = data.meta_title;
  if (data.meta_description !== undefined) apiData.meta_description = data.meta_description;
  
  return apiData;
}

// News Service
export const newsService = {
  // Get all news with search and pagination
  async getNews(params: NewsSearchParams = {}): Promise<PaginatedResponse<News>> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.category) searchParams.append('category', params.category);
    if (params.tags?.length) {
      params.tags.forEach(tag => searchParams.append('tags', tag));
    }
    if (params.author_id) searchParams.append('author_id', params.author_id);
    if (params.pesantren_id) searchParams.append('pesantren_id', params.pesantren_id);
    if (params.is_featured !== undefined) searchParams.append('is_featured', params.is_featured.toString());
    if (params.is_published !== undefined) searchParams.append('is_published', params.is_published.toString());
    if (params.published_from) searchParams.append('published_from', params.published_from);
    if (params.published_to) searchParams.append('published_to', params.published_to);
    if (params.sort_by) searchParams.append('sort_by', params.sort_by);
    if (params.sort_order) searchParams.append('sort_order', params.sort_order);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    const response = await api.get<PaginatedResponse<ApiNews>>(
      `/api/v1/news?${searchParams.toString()}`
    );
    
    return {
      data: response.data.map(transformApiNewsToNews),
      pagination: response.pagination,
    };
  },

  // Get news by ID
  async getNewsById(id: string): Promise<News> {
    const response = await api.get<ApiResponse<ApiNews>>(`/api/v1/news/${id}`);
    return transformApiNewsToNews(response.data);
  },

  // Get news by slug
  async getNewsBySlug(slug: string): Promise<News> {
    const response = await api.get<ApiResponse<ApiNews>>(`/api/v1/news/slug/${slug}`);
    return transformApiNewsToNews(response.data);
  },

  // Get featured news
  async getFeaturedNews(limit: number = 5): Promise<News[]> {
    const response = await api.get<PaginatedResponse<ApiNews>>(
      `/api/v1/news?is_featured=true&is_published=true&limit=${limit}&sort_by=published_at&sort_order=desc`
    );
    return response.data.map(transformApiNewsToNews);
  },

  // Get latest news
  async getLatestNews(limit: number = 10): Promise<News[]> {
    const response = await api.get<PaginatedResponse<ApiNews>>(
      `/api/v1/news?is_published=true&limit=${limit}&sort_by=published_at&sort_order=desc`
    );
    return response.data.map(transformApiNewsToNews);
  },

  // Get news by category
  async getNewsByCategory(category: string, limit: number = 10): Promise<News[]> {
    const response = await api.get<PaginatedResponse<ApiNews>>(
      `/api/v1/news?category=${category}&is_published=true&limit=${limit}&sort_by=published_at&sort_order=desc`
    );
    return response.data.map(transformApiNewsToNews);
  },

  // Get news by pesantren
  async getNewsByPesantren(pesantrenId: string, limit: number = 10): Promise<News[]> {
    const response = await api.get<PaginatedResponse<ApiNews>>(
      `/api/v1/news?pesantren_id=${pesantrenId}&is_published=true&limit=${limit}&sort_by=published_at&sort_order=desc`
    );
    return response.data.map(transformApiNewsToNews);
  },

  // Create news (admin only)
  async createNews(data: NewsCreateData): Promise<News> {
    const apiData = transformNewsCreateDataToApi(data);
    const response = await api.post<ApiResponse<ApiNews>>('/api/v1/news', apiData);
    return transformApiNewsToNews(response.data);
  },

  // Update news (admin only)
  async updateNews(id: string, data: NewsUpdateData): Promise<News> {
    const apiData = transformNewsUpdateDataToApi(data);
    const response = await api.put<ApiResponse<ApiNews>>(`/api/v1/news/${id}`, apiData);
    return transformApiNewsToNews(response.data);
  },

  // Delete news (admin only)
  async deleteNews(id: string): Promise<void> {
    await api.delete(`/api/v1/news/${id}`);
  },

  // Publish news (admin only)
  async publishNews(id: string): Promise<News> {
    const response = await api.patch<ApiResponse<ApiNews>>(`/api/v1/news/${id}/publish`);
    return transformApiNewsToNews(response.data);
  },

  // Unpublish news (admin only)
  async unpublishNews(id: string): Promise<News> {
    const response = await api.patch<ApiResponse<ApiNews>>(`/api/v1/news/${id}/unpublish`);
    return transformApiNewsToNews(response.data);
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    await api.patch(`/api/v1/news/${id}/view`);
  },

  // Like news
  async likeNews(id: string): Promise<void> {
    await api.patch(`/api/v1/news/${id}/like`);
  },

  // Unlike news
  async unlikeNews(id: string): Promise<void> {
    await api.patch(`/api/v1/news/${id}/unlike`);
  },

  // Get news categories
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/api/v1/news/categories');
    return response.data;
  },

  // Get popular tags
  async getPopularTags(limit: number = 20): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>(`/api/v1/news/tags?limit=${limit}`);
    return response.data;
  },

  // Search news
  async searchNews(query: string, params: Omit<NewsSearchParams, 'query'> = {}): Promise<PaginatedResponse<News>> {
    return this.getNews({ ...params, query });
  },
};

export default newsService;