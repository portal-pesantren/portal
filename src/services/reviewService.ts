import { api } from '@/lib/api';
import { Review } from '@/types';

// Review interfaces
export interface ApiReview {
  _id: string;
  pesantren_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  recommendation: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  user_avatar?: string;
}

export interface CreateReviewData {
  pesantren_id: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  recommendation?: boolean;
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
  recommendation?: boolean;
}

export interface ReviewSearchParams {
  pesantren_id?: string;
  user_id?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  is_verified?: boolean;
  sort_by?: 'created_at' | 'rating' | 'helpful_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verified_reviews: number;
  recommendation_percentage: number;
}

// Transform API review to frontend format
const transformReview = (apiReview: ApiReview): Review => {
  return {
    id: parseInt(apiReview._id, 16) || 0, // Convert hex string to number
    pesantrenId: parseInt(apiReview.pesantren_id, 16) || 0,
    userId: parseInt(apiReview.user_id, 16) || 0,
    userName: apiReview.user_name,
    userAvatar: apiReview.user_avatar,
    rating: apiReview.rating,
    title: apiReview.title,
    content: apiReview.content,
    pros: apiReview.pros || [],
    cons: apiReview.cons || [],
    recommendation: apiReview.recommendation,
    helpfulCount: apiReview.helpful_count || 0,
    createdAt: apiReview.created_at,
    updatedAt: apiReview.updated_at,
    isVerified: apiReview.is_verified || false
  };
};

// Review service
export const reviewService = {
  /**
   * Get reviews with pagination and filters
   */
  getReviews: async (params: ReviewSearchParams = {}): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (params.pesantren_id) queryParams.append('pesantren_id', params.pesantren_id);
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.rating) queryParams.append('rating', params.rating.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.is_verified !== undefined) queryParams.append('is_verified', params.is_verified.toString());
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get<{
        data: ApiReview[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(`/reviews?${queryParams.toString()}`);
      
      return {
        reviews: response.data.map(transformReview),
        total: response.total,
        page: response.page,
        limit: response.limit,
        total_pages: response.total_pages
      };
    } catch (error) {
      console.error('Get reviews error:', error);
      throw new Error('Gagal mengambil data review');
    }
  },

  /**
   * Get reviews for a specific pesantren
   */
  getPesantrenReviews: async (pesantrenId: string, params: Omit<ReviewSearchParams, 'pesantren_id'> = {}): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    return reviewService.getReviews({ ...params, pesantren_id: pesantrenId });
  },

  /**
   * Get review by ID
   */
  getReviewById: async (reviewId: string): Promise<Review> => {
    try {
      const response = await api.get<{ data: ApiReview }>(`/reviews/${reviewId}`);
      return transformReview(response.data);
    } catch (error) {
      console.error('Get review by ID error:', error);
      throw new Error('Gagal mengambil data review');
    }
  },

  /**
   * Create new review
   */
  createReview: async (reviewData: CreateReviewData): Promise<Review> => {
    try {
      const response = await api.post<{ data: ApiReview }>('/reviews', reviewData);
      return transformReview(response.data);
    } catch (error: any) {
      console.error('Create review error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Anda sudah memberikan review untuk pesantren ini');
      } else if (error.response?.status === 422) {
        throw new Error('Data review tidak valid');
      } else {
        throw new Error('Gagal membuat review');
      }
    }
  },

  /**
   * Update review
   */
  updateReview: async (reviewId: string, reviewData: UpdateReviewData): Promise<Review> => {
    try {
      const response = await api.put<{ data: ApiReview }>(`/reviews/${reviewId}`, reviewData);
      return transformReview(response.data);
    } catch (error: any) {
      console.error('Update review error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah review ini');
      } else if (error.response?.status === 404) {
        throw new Error('Review tidak ditemukan');
      } else {
        throw new Error('Gagal mengubah review');
      }
    }
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId: string): Promise<void> => {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (error: any) {
      console.error('Delete review error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk menghapus review ini');
      } else if (error.response?.status === 404) {
        throw new Error('Review tidak ditemukan');
      } else {
        throw new Error('Gagal menghapus review');
      }
    }
  },

  /**
   * Mark review as helpful
   */
  markReviewHelpful: async (reviewId: string): Promise<void> => {
    try {
      await api.post(`/reviews/${reviewId}/helpful`);
    } catch (error: any) {
      console.error('Mark review helpful error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Anda sudah menandai review ini sebagai helpful');
      } else {
        throw new Error('Gagal menandai review sebagai helpful');
      }
    }
  },

  /**
   * Remove helpful mark from review
   */
  removeReviewHelpful: async (reviewId: string): Promise<void> => {
    try {
      await api.delete(`/reviews/${reviewId}/helpful`);
    } catch (error) {
      console.error('Remove review helpful error:', error);
      throw new Error('Gagal menghapus tanda helpful dari review');
    }
  },

  /**
   * Get review statistics for a pesantren
   */
  getPesantrenReviewStats: async (pesantrenId: string): Promise<ReviewStats> => {
    try {
      const response = await api.get<{ data: ReviewStats }>(`/reviews/stats/${pesantrenId}`);
      return response.data;
    } catch (error) {
      console.error('Get review stats error:', error);
      throw new Error('Gagal mengambil statistik review');
    }
  },

  /**
   * Get user's reviews
   */
  getUserReviews: async (userId: string, params: Omit<ReviewSearchParams, 'user_id'> = {}): Promise<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    return reviewService.getReviews({ ...params, user_id: userId });
  },

  /**
   * Get featured reviews (highly rated and helpful)
   */
  getFeaturedReviews: async (limit: number = 10): Promise<Review[]> => {
    try {
      const response = await api.get<{ data: ApiReview[] }>(`/reviews/featured?limit=${limit}`);
      return response.data.map(transformReview);
    } catch (error) {
      console.error('Get featured reviews error:', error);
      throw new Error('Gagal mengambil review unggulan');
    }
  },

  /**
   * Get recent reviews
   */
  getRecentReviews: async (limit: number = 10): Promise<Review[]> => {
    try {
      const response = await api.get<{ data: ApiReview[] }>(`/reviews/recent?limit=${limit}`);
      return response.data.map(transformReview);
    } catch (error) {
      console.error('Get recent reviews error:', error);
      throw new Error('Gagal mengambil review terbaru');
    }
  },

  /**
   * Report review
   */
  reportReview: async (reviewId: string, reason: string): Promise<void> => {
    try {
      await api.post(`/reviews/${reviewId}/report`, { reason });
    } catch (error) {
      console.error('Report review error:', error);
      throw new Error('Gagal melaporkan review');
    }
  },

  /**
   * Check if user can review a pesantren
   */
  canUserReview: async (pesantrenId: string): Promise<boolean> => {
    try {
      const response = await api.get<{ can_review: boolean }>(`/reviews/can-review/${pesantrenId}`);
      return response.can_review;
    } catch (error) {
      console.error('Check can review error:', error);
      return false;
    }
  }
};

export default reviewService;