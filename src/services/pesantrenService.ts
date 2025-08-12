import { api } from '@/lib/api';
import { Pesantren, PaginatedResponse, SearchFilters } from '@/types';

// Updated Pesantren interface to match API response
export interface ApiPesantren {
  id: string;
  code?: string; // UUID v7 identifier
  name: string;
  slug: string;
  location: {
    city: string;
    province: string;
  };
  monthly_fee: number;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  images: string[];
  programs: string[];
  education_levels: string[];
  description?: string;
  facilities?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address?: string;
  capacity?: number;
  established_year?: number;
  accreditation?: string;
  website?: string;
}

// Transform API response to frontend format
const transformPesantren = (apiPesantren: ApiPesantren): Pesantren => {
  return {
    id: apiPesantren.id, // Keep as string to avoid scientific notation
    code: apiPesantren.code, // UUID v7 identifier
    name: apiPesantren.name,
    location: `${apiPesantren.location.city}, ${apiPesantren.location.province}`,
    address: apiPesantren.address || `${apiPesantren.location.city}, ${apiPesantren.location.province}`,
    rating: apiPesantren.rating,
    students: apiPesantren.capacity || 0,
    programs: apiPesantren.programs,
    image: apiPesantren.images[0] || '/placeholder-pesantren.jpg',
    featured: apiPesantren.is_featured,
    description: apiPesantren.description,
    facilities: apiPesantren.facilities || [],
    contact: apiPesantren.contact,
    fees: {
      monthly: apiPesantren.monthly_fee,
      registration: 0,
      other: 0
    }
  };
};

// Pesantren search parameters
export interface PesantrenSearchParams {
  page?: number;
  limit?: number;
  query?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  province?: string;
  city?: string;
  type?: string;
  is_featured?: boolean;
  status?: string;
  min_capacity?: number;
  max_capacity?: number;
  has_scholarship?: boolean;
}

// Pesantren service
export const pesantrenService = {
  /**
   * Get all pesantren with pagination and filters
   */
  getPesantren: async (params: PesantrenSearchParams = {}): Promise<PaginatedResponse<Pesantren>> => {
    try {
      const response = await api.get<{
        data: ApiPesantren[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          total_pages: number;
          has_next: boolean;
          has_prev: boolean;
        };
      }>('/pesantren', params);

      return {
        data: response.data.map(transformPesantren),
        pagination: {
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.total_pages
        }
      };
    } catch (error) {
      console.error('Error fetching pesantren:', error);
      throw new Error('Gagal mengambil data pesantren');
    }
  },

  /**
   * Get featured pesantren
   */
  getFeaturedPesantren: async (limit = 5): Promise<Pesantren[]> => {
    try {
      const response = await api.get<{
        data: ApiPesantren[];
      }>(`/pesantren/featured?limit=${limit}`);

      return response.data.map(transformPesantren);
    } catch (error) {
      console.error('Error fetching featured pesantren:', error);
      throw new Error('Gagal mengambil pesantren unggulan');
    }
  },

  /**
   * Get popular pesantren
   */
  getPopularPesantren: async (limit = 5): Promise<Pesantren[]> => {
    try {
      const response = await api.get<{
        data: ApiPesantren[];
      }>(`/pesantren/popular?limit=${limit}`);

      return response.data.map(transformPesantren);
    } catch (error) {
      console.error('Error fetching popular pesantren:', error);
      throw new Error('Gagal mengambil pesantren populer');
    }
  },

  /**
   * Get pesantren by ID (legacy support)
   */
  getPesantrenById: async (id: string): Promise<Pesantren> => {
    try {
      const response = await api.get<{
        data: ApiPesantren;
      }>(`/pesantren/${id}`);

      return transformPesantren(response.data);
    } catch (error) {
      console.error('Error fetching pesantren by ID:', error);
      throw new Error('Gagal mengambil detail pesantren');
    }
  },

  /**
   * Get pesantren by UUID v7 code
   */
  getPesantrenByCode: async (code: string): Promise<Pesantren> => {
    try {
      const response = await api.get<{
        data: ApiPesantren;
      }>(`/pesantren/by-code/${code}`);

      return transformPesantren(response.data);
    } catch (error) {
      console.error('Error fetching pesantren by code:', error);
      throw new Error('Gagal mengambil detail pesantren');
    }
  },

  /**
   * Get pesantren by identifier (code or id)
   * Prefers code over id for better performance
   */
  getPesantrenByIdentifier: async (identifier: string): Promise<Pesantren> => {
    try {
      // Sanitize identifier to prevent scientific notation issues
      const sanitizedIdentifier = String(identifier).trim();
      
      // Check for scientific notation format
      if (sanitizedIdentifier.includes('e+') || sanitizedIdentifier.includes('E+')) {
        console.warn('Scientific notation identifier detected:', sanitizedIdentifier);
        throw new Error('Invalid identifier format');
      }
      
      // Check for extremely long identifiers
      if (sanitizedIdentifier.length > 50) {
        console.warn('Extremely long identifier detected:', sanitizedIdentifier);
        throw new Error('Invalid identifier format');
      }
      
      // Check if identifier is UUID v7 format
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sanitizedIdentifier);
      
      if (isUUID) {
        return await pesantrenService.getPesantrenByCode(sanitizedIdentifier);
      } else {
        return await pesantrenService.getPesantrenById(sanitizedIdentifier);
      }
    } catch (error) {
      console.error('Error fetching pesantren by identifier:', error);
      throw new Error('Gagal mengambil detail pesantren');
    }
  },

  /**
   * Search pesantren with query and filters
   */
  searchPesantren: async (
    query: string,
    filters: Partial<SearchFilters> = {},
    pagination: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<Pesantren>> => {
    try {
      const params: PesantrenSearchParams = {
        query: query || undefined,
        page: pagination.page || 1,
        limit: pagination.limit || 9,
        province: filters.location,
        ...filters
      };

      return await pesantrenService.getPesantren(params);
    } catch (error) {
      console.error('Error searching pesantren:', error);
      throw new Error('Gagal mencari pesantren');
    }
  },

  /**
   * Get pesantren statistics
   */
  getPesantrenStats: async (): Promise<{
    total: number;
    featured: number;
    provinces: number;
    averageRating: number;
  }> => {
    try {
      const response = await api.get<{
        data: {
          total_pesantren: number;
          featured_pesantren: number;
          total_provinces: number;
          average_rating: number;
        };
      }>('/pesantren/stats');

      return {
        total: response.data.total_pesantren,
        featured: response.data.featured_pesantren,
        provinces: response.data.total_provinces,
        averageRating: response.data.average_rating
      };
    } catch (error) {
      console.error('Error fetching pesantren stats:', error);
      throw new Error('Gagal mengambil statistik pesantren');
    }
  },

  /**
   * Get pesantren by province
   */
  getPesantrenByProvince: async (province: string, limit = 10): Promise<Pesantren[]> => {
    try {
      const response = await pesantrenService.getPesantren({
        province,
        limit
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching pesantren by province:', error);
      throw new Error('Gagal mengambil pesantren berdasarkan provinsi');
    }
  },

  /**
   * Get pesantren by program
   */
  getPesantrenByProgram: async (program: string, limit = 10): Promise<Pesantren[]> => {
    try {
      const response = await pesantrenService.getPesantren({
        query: program,
        limit
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching pesantren by program:', error);
      throw new Error('Gagal mengambil pesantren berdasarkan program');
    }
  }
};

export default pesantrenService;