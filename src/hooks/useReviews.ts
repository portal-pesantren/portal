import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/reviewService';
import { queryKeys } from '@/providers/QueryProvider';
import { Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Hook untuk mendapatkan daftar review dengan paginasi
export function useReviews(params?: {
  page?: number;
  limit?: number;
  pesantren_id?: string;
  pesantren_code?: string; // UUID v7 support
  user_id?: string;
  user_code?: string; // UUID v7 support
  rating?: number;
  sort_by?: 'created_at' | 'rating' | 'helpful_count';
  sort_order?: 'asc' | 'desc';
  status?: 'pending' | 'approved' | 'rejected';
  is_verified?: boolean;
}) {
  return useQuery({
    queryKey: queryKeys.reviews.list(params),
    queryFn: () => reviewService.getReviews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan review berdasarkan pesantren (legacy support)
export function useReviewsByPesantren(
  pesantrenId: string,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    sort_by?: 'created_at' | 'rating' | 'helpful_count';
    sort_order?: 'asc' | 'desc';
    status?: 'pending' | 'approved' | 'rejected';
    is_verified?: boolean;
  }
) {
  return useQuery({
    queryKey: queryKeys.reviews.byPesantren(pesantrenId, params),
    queryFn: () => reviewService.getPesantrenReviews(pesantrenId, params),
    enabled: !!pesantrenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan review berdasarkan pesantren dengan UUID v7 code
export function useReviewsByPesantrenCode(
  pesantrenCode: string,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    sort_by?: 'created_at' | 'rating' | 'helpful_count';
    sort_order?: 'asc' | 'desc';
    status?: 'pending' | 'approved' | 'rejected';
    is_verified?: boolean;
  }
) {
  return useQuery({
    queryKey: queryKeys.reviews.byPesantrenCode(pesantrenCode, params),
    queryFn: () => reviewService.getPesantrenReviewsByCode(pesantrenCode, params),
    enabled: !!pesantrenCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan detail review (legacy support)
export function useReviewDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.reviews.detail(id),
    queryFn: () => reviewService.getReviewById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan detail review dengan UUID v7 code
export function useReviewDetailByCode(code: string) {
  return useQuery({
    queryKey: queryKeys.reviews.detail(code),
    queryFn: () => reviewService.getReviewByCode(code),
    enabled: !!code,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan review pengguna (legacy support)
export function useUserReviews(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: queryKeys.reviews.byUser(targetUserId || ''),
    queryFn: () => reviewService.getUserReviews(targetUserId!),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan review pengguna dengan UUID v7 code
export function useUserReviewsByCode(userCode?: string) {
  const { user } = useAuth();
  const targetUserCode = userCode || user?.code;
  
  return useQuery({
    queryKey: queryKeys.reviews.byUserCode(targetUserCode || ''),
    queryFn: () => reviewService.getUserReviewsByCode(targetUserCode!),
    enabled: !!targetUserCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan review unggulan
export function useFeaturedReviews(limit?: number) {
  return useQuery({
    queryKey: queryKeys.reviews.featured(),
    queryFn: () => reviewService.getFeaturedReviews(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook untuk mendapatkan review terbaru
export function useRecentReviews(limit?: number) {
  return useQuery({
    queryKey: queryKeys.reviews.recent(),
    queryFn: () => reviewService.getRecentReviews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan statistik review (legacy support)
export function useReviewStats(pesantrenId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.stats(pesantrenId),
    queryFn: () => reviewService.getPesantrenReviewStats(pesantrenId),
    enabled: !!pesantrenId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan statistik review dengan UUID v7 code
export function useReviewStatsByCode(pesantrenCode: string) {
  return useQuery({
    queryKey: queryKeys.reviews.statsByCode(pesantrenCode),
    queryFn: () => reviewService.getPesantrenReviewStatsByCode(pesantrenCode),
    enabled: !!pesantrenCode,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk membuat review baru
export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (newReview) => {
      // Invalidate and refetch reviews
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      
      // Update pesantren cache if needed
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.pesantren.detail(newReview.pesantrenId) 
      });
      
      // Update user reviews cache
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.reviews.byUser(newReview.userId) 
      });
    },
    onError: (error) => {
      console.error('Error creating review:', error);
    },
  });
}

// Hook untuk memperbarui review
export function useUpdateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      reviewService.updateReview(id, data),
    onSuccess: (updatedReview, { id }) => {
      // Update specific review cache
      queryClient.setQueryData(
        queryKeys.reviews.detail(id),
        updatedReview
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
      
      // Update user reviews cache
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.reviews.byUser(updatedReview.userId) 
      });
    },
    onError: (error) => {
      console.error('Error updating review:', error);
    },
  });
}

// Hook untuk menghapus review
export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.reviews.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
    },
  });
}

// Hook untuk menandai review sebagai bermanfaat
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.markReviewHelpful,
    onSuccess: (_, reviewId) => {
      // Update specific review cache
      queryClient.setQueryData(
        queryKeys.reviews.detail(reviewId),
        (oldData: Review | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            helpfulCount: (oldData.helpfulCount || 0) + 1,
          };
        }
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.lists() });
    },
    onError: (error) => {
      console.error('Error marking review as helpful:', error);
    },
  });
}

// Hook untuk melaporkan review
export function useReportReview() {
  return useMutation({
    mutationFn: ({ reviewId, reason }: { reviewId: string; reason: string }) =>
      reviewService.reportReview(reviewId, reason),
    onSuccess: () => {
      // Optionally show success message
      console.log('Review reported successfully');
    },
    onError: (error) => {
      console.error('Error reporting review:', error);
    },
  });
}

// Hook untuk memeriksa apakah user dapat memberikan review (legacy support)
export function useCanUserReview(pesantrenId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['canUserReview', pesantrenId, user?.id],
    queryFn: () => reviewService.canUserReview(pesantrenId),
    enabled: !!user && !!pesantrenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk memeriksa apakah user dapat memberikan review dengan UUID v7 code
export function useCanUserReviewByCode(pesantrenCode: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['canUserReviewByCode', pesantrenCode, user?.code],
    queryFn: () => reviewService.canUserReviewByCode(pesantrenCode),
    enabled: !!user && !!pesantrenCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk invalidate review cache
export function useInvalidateReviews() {
  const queryClient = useQueryClient();
  
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
  };
  
  const invalidateByPesantren = (pesantrenId: string) => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.reviews.byPesantren(pesantrenId) 
    });
  };
  
  const invalidateByUser = (userId: string) => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.reviews.byUser(userId) 
    });
  };
  
  const invalidateDetail = (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.detail(id) });
  };
  
  return {
    invalidateAll,
    invalidateByPesantren,
    invalidateByUser,
    invalidateDetail,
  };
}

// Types untuk export
export type UseReviewsParams = Parameters<typeof useReviews>[0];
export type UseReviewsByPesantrenParams = Parameters<typeof useReviewsByPesantren>[1];