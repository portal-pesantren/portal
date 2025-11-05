import { api } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';
import { Pesantren, PaginatedResponse, SearchFilters, PesantrenStats } from '@/types';

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
      }>(API_CONFIG.ENDPOINTS.PESANTREN.LIST, params);

      // Add safety check for response structure
      // Backend returns: { data: Array, pagination: {...} }
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response structure:', response);
        throw new Error('Format response tidak valid');
      }

      return {
        data: response.data.map(transformPesantren),
        pagination: {
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 9,
          total: response.pagination?.total || 0,
          totalPages: response.pagination?.total_pages || 0
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
        success: boolean;
        data: ApiPesantren[];
        message: string;
      }>(`${API_CONFIG.ENDPOINTS.PESANTREN.FEATURED}?limit=${limit}`);

      // Add safety check for response structure
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response structure for featured pesantren:', response);
        return [];
      }

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
        success: boolean;
        data: ApiPesantren[];
        message: string;
      }>(`${API_CONFIG.ENDPOINTS.PESANTREN.POPULAR}?limit=${limit}`);

      // Add safety check for response structure
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response structure for popular pesantren:', response);
        return [];
      }

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
      // Sanitize ID to prevent issues
      const sanitizedId = String(id).trim();
      
      // Validate ID format
      if (!sanitizedId || sanitizedId.length === 0) {
        throw new Error('ID pesantren tidak valid');
      }
      
      // Check for scientific notation format
      if (sanitizedId.includes('e+') || sanitizedId.includes('E+')) {
        console.warn('Scientific notation ID detected:', sanitizedId);
        throw new Error('Format ID tidak valid');
      }
      
      // Check for extremely long IDs
      if (sanitizedId.length > 50) {
        console.warn('Extremely long ID detected:', sanitizedId);
        throw new Error('Format ID tidak valid');
      }

      const response = await api.get<{
        success: boolean;
        data: ApiPesantren;
        message: string;
      }>(`${API_CONFIG.ENDPOINTS.PESANTREN.DETAIL}/${sanitizedId}`);

      if (!response.data) {
        throw new Error('Data pesantren tidak ditemukan');
      }

      return transformPesantren(response.data);
    } catch (error: any) {
      console.error('Error fetching pesantren by ID:', error);
      
      // Provide more specific error messages
      if (error?.response?.status === 404) {
        throw new Error('Pesantren tidak ditemukan');
      } else if (error?.response?.status === 400) {
        throw new Error('Format ID pesantren tidak valid');
      } else if (error?.response?.status === 500) {
        throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
      } else if (error.message.includes('Format ID tidak valid') || error.message.includes('ID pesantren tidak valid')) {
        throw error; // Re-throw validation errors as-is
      } else {
        throw new Error('Gagal mengambil detail pesantren');
      }
    }
  },

  /**
   * Get pesantren by UUID v7 code
   */
  getPesantrenByCode: async (code: string): Promise<Pesantren> => {
    try {
      // Sanitize code to prevent issues
      const sanitizedCode = String(code).trim();
      
      // Validate code format
      if (!sanitizedCode || sanitizedCode.length === 0) {
        throw new Error('Code pesantren tidak valid');
      }
      
      // Check if it's a valid UUID v7 format
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sanitizedCode);
      if (!isUUID) {
        throw new Error('Format code pesantren tidak valid (harus UUID v7)');
      }

      const response = await api.get<{
        success: boolean;
        data: ApiPesantren;
        message: string;
      }>(`${API_CONFIG.ENDPOINTS.PESANTREN.BY_CODE}/${sanitizedCode}`);

      if (!response.data) {
        throw new Error('Data pesantren tidak ditemukan');
      }

      return transformPesantren(response.data);
    } catch (error: any) {
      console.error('Error fetching pesantren by code:', error);
      
      // Provide more specific error messages
      if (error?.response?.status === 404) {
        throw new Error('Pesantren tidak ditemukan');
      } else if (error?.response?.status === 400) {
        throw new Error('Format code pesantren tidak valid');
      } else if (error?.response?.status === 500) {
        throw new Error('Terjadi kesalahan pada server. Silakan coba lagi nanti.');
      } else if (error.message.includes('Format code') || error.message.includes('Code pesantren tidak valid')) {
        throw error; // Re-throw validation errors as-is
      } else {
        throw new Error('Gagal mengambil detail pesantren');
      }
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
      
      // Check if identifier is MongoDB ObjectId format (24 hex characters)
      const isMongoId = /^[0-9a-f]{24}$/i.test(sanitizedIdentifier);
      
      console.log('🔍 Identifier analysis:', {
        identifier: sanitizedIdentifier,
        isUUID,
        isMongoId,
        length: sanitizedIdentifier.length
      });
      
      if (isUUID) {
        console.log('📋 Using UUID v7 endpoint for:', sanitizedIdentifier);
        return await pesantrenService.getPesantrenByCode(sanitizedIdentifier);
      } else if (isMongoId) {
        console.log('🗃️ MongoDB ObjectId detected, trying alternative approach for:', sanitizedIdentifier);
        // For MongoDB ObjectId, we need to handle this differently
        // Since backend doesn't support this format directly, we'll throw a specific error
        throw new Error('Format ID tidak didukung. Silakan gunakan UUID v7 atau hubungi administrator.');
      } else {
        console.log('🔢 Using regular ID endpoint for:', sanitizedIdentifier);
        return await pesantrenService.getPesantrenById(sanitizedIdentifier);
      }
    } catch (error: any) {
      console.error('Error fetching pesantren by identifier:', error);
      
      // If it's our custom error about unsupported format, re-throw it
      if (error.message.includes('Format ID tidak didukung')) {
        throw error;
      }
      
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
        success: boolean;
        data: {
          total_pesantren: number;
          featured_pesantren: number;
          total_provinces: number;
          average_rating: number;
        };
        message: string;
      }>(API_CONFIG.ENDPOINTS.PESANTREN.STATS);

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
  },

  /**
   * Create new pesantren (Admin only)
   */
  createPesantren: async (pesantrenData: Partial<ApiPesantren>): Promise<Pesantren> => {
    try {
      const response = await api.post<{
        data: ApiPesantren;
      }>(API_CONFIG.ENDPOINTS.PESANTREN.CREATE, pesantrenData);

      return transformPesantren(response.data);
    } catch (error) {
      console.error('Error creating pesantren:', error);
      throw new Error('Gagal membuat pesantren baru');
    }
  },

  /**
   * Update pesantren (Admin only)
   */
  updatePesantren: async (id: string, pesantrenData: Partial<ApiPesantren>): Promise<Pesantren> => {
    try {
      const response = await api.put<{
        data: ApiPesantren;
      }>(`${API_CONFIG.ENDPOINTS.PESANTREN.UPDATE}/${id}`, pesantrenData);

      return transformPesantren(response.data);
    } catch (error) {
      console.error('Error updating pesantren:', error);
      throw new Error('Gagal memperbarui pesantren');
    }
  },

  /**
   * Delete pesantren (Admin only)
   */
  deletePesantren: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_CONFIG.ENDPOINTS.PESANTREN.DELETE}/${id}`);
    } catch (error) {
      console.error('Error deleting pesantren:', error);
      throw new Error('Gagal menghapus pesantren');
    }
  }
};

export default pesantrenService;