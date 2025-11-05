import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { aboutService, AboutUsData } from '@/services/aboutService';

// Query keys untuk About Us
export const aboutQueryKeys = {
  all: ['about'] as const,
  aboutUs: () => [...aboutQueryKeys.all, 'aboutUs'] as const,
};

/**
 * Hook untuk mengambil data About Us
 * @returns Query result dengan data About Us
 */
export function useAboutUs() {
  return useQuery<AboutUsData, Error>({
    queryKey: aboutQueryKeys.aboutUs(),
    queryFn: () => aboutService.getAboutUs(),
    staleTime: 30 * 60 * 1000, // 30 minutes - data About Us jarang berubah
    gcTime: 60 * 60 * 1000, // 1 hour (sebelumnya cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook untuk memperbarui data About Us (untuk admin)
 * @returns Mutation untuk update About Us
 */
export function useUpdateAboutUs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AboutUsData>) => 
      aboutService.updateAboutUs(data),
    onSuccess: (updatedData) => {
      // Update cache dengan data terbaru
      queryClient.setQueryData(aboutQueryKeys.aboutUs(), updatedData);
      
      // Invalidate query untuk memastikan data fresh
      queryClient.invalidateQueries({ queryKey: aboutQueryKeys.aboutUs() });
    },
    onError: (error) => {
      console.error('Error updating About Us:', error);
    },
  });
}

/**
 * Hook untuk prefetch data About Us
 * Berguna untuk preloading data sebelum user mengakses halaman
 */
export function usePrefetchAboutUs() {
  const queryClient = useQueryClient();

  const prefetchAboutUs = () => {
    queryClient.prefetchQuery({
      queryKey: aboutQueryKeys.aboutUs(),
      queryFn: () => aboutService.getAboutUs(),
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  };

  return { prefetchAboutUs };
}

/**
 * Hook untuk invalidate cache About Us
 * Berguna ketika data perlu di-refresh secara manual
 */
export function useInvalidateAboutUs() {
  const queryClient = useQueryClient();

  const invalidateAboutUs = () => {
    queryClient.invalidateQueries({ queryKey: aboutQueryKeys.aboutUs() });
  };

  const refetchAboutUs = () => {
    queryClient.refetchQueries({ queryKey: aboutQueryKeys.aboutUs() });
  };

  return { invalidateAboutUs, refetchAboutUs };
}

// Export types untuk TypeScript
export type UseAboutUsResult = ReturnType<typeof useAboutUs>;
export type UseUpdateAboutUsResult = ReturnType<typeof useUpdateAboutUs>;