import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pesantrenService } from '@/services/pesantrenService';
import { queryKeys } from '@/providers/QueryProvider';
import { Pesantren, SearchFilters } from '@/types';

// Hook untuk mendapatkan daftar pesantren dengan paginasi
export function usePesantren(params?: {
  page?: number;
  limit?: number;
  search?: string;
  province?: string;
  program?: string;
  min_rating?: number;
  max_fee?: number;
  facilities?: string[];
}) {
  return useQuery({
    queryKey: queryKeys.pesantren.list(params),
    queryFn: () => pesantrenService.getPesantren(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan detail pesantren berdasarkan ID
export function usePesantrenDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.pesantren.detail(id),
    queryFn: () => pesantrenService.getPesantrenById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan pesantren unggulan
export function useFeaturedPesantren(limit?: number) {
  return useQuery({
    queryKey: queryKeys.pesantren.featured(),
    queryFn: () => pesantrenService.getFeaturedPesantren(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook untuk mendapatkan pesantren populer
export function usePopularPesantren(limit?: number) {
  return useQuery({
    queryKey: queryKeys.pesantren.popular(),
    queryFn: () => pesantrenService.getPopularPesantren(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Hook untuk pencarian pesantren
export function useSearchPesantren(query: string, filters?: SearchFilters) {
  return useQuery({
    queryKey: queryKeys.pesantren.search(query, filters),
    queryFn: () => pesantrenService.searchPesantren(
      query,
      {
        location: filters?.location,
        programs: filters?.programs,
        minRating: filters?.minRating,
        maxFees: filters?.maxFees,
        facilities: filters?.facilities,
      }
    ),
    enabled: !!query && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook untuk mendapatkan pesantren berdasarkan provinsi
export function usePesantrenByProvince(province: string) {
  return useQuery({
    queryKey: queryKeys.pesantren.byProvince(province),
    queryFn: () => pesantrenService.getPesantrenByProvince(province),
    enabled: !!province,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan pesantren berdasarkan program
export function usePesantrenByProgram(program: string) {
  return useQuery({
    queryKey: queryKeys.pesantren.byProgram(program),
    queryFn: () => pesantrenService.getPesantrenByProgram(program),
    enabled: !!program,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan statistik pesantren
export function usePesantrenStats() {
  return useQuery({
    queryKey: queryKeys.pesantren.stats(),
    queryFn: () => pesantrenService.getPesantrenStats(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook untuk prefetch detail pesantren (untuk optimasi)
export function usePrefetchPesantren() {
  const queryClient = useQueryClient();
  
  const prefetchPesantren = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.pesantren.detail(id),
      queryFn: () => pesantrenService.getPesantrenById(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
  
  return { prefetchPesantren };
}

// Hook untuk invalidate cache pesantren
export function useInvalidatePesantren() {
  const queryClient = useQueryClient();
  
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.pesantren.all });
  };
  
  const invalidateDetail = (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.pesantren.detail(id) });
  };
  
  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.pesantren.lists() });
  };
  
  return {
    invalidateAll,
    invalidateDetail,
    invalidateLists,
  };
}

// Hook untuk update cache pesantren secara manual
export function useUpdatePesantrenCache() {
  const queryClient = useQueryClient();
  
  const updatePesantrenInCache = (id: string, updatedData: Partial<Pesantren>) => {
    // Update detail cache
    queryClient.setQueryData(
      queryKeys.pesantren.detail(id),
      (oldData: Pesantren | undefined) => {
        if (!oldData) return oldData;
        return { ...oldData, ...updatedData };
      }
    );
    
    // Update list caches
    queryClient.setQueriesData(
      { queryKey: queryKeys.pesantren.lists() },
      (oldData: any) => {
        if (!oldData?.data) return oldData;
        
        return {
          ...oldData,
          data: oldData.data.map((pesantren: Pesantren) =>
            pesantren.id === id ? { ...pesantren, ...updatedData } : pesantren
          ),
        };
      }
    );
  };
  
  return { updatePesantrenInCache };
}

// Types untuk export
export type UsePesantrenParams = Parameters<typeof usePesantren>[0];
export type UseSearchPesantrenParams = {
  query: string;
  filters?: SearchFilters;
};