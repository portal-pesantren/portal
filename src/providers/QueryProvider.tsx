'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Time in milliseconds that the cache survives unused/inactive
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      // Retry failed requests
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          if (error?.response?.status === 408 || error?.response?.status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        // Retry on network errors and 5xx errors
        return failureCount < 3;
      },
      // Retry delay
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry on network errors and 5xx errors
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query Devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

// Export the query client for use in other parts of the app
export { queryClient };

// Query keys factory for consistent key management
export const queryKeys = {
  // Pesantren queries
  pesantren: {
    all: ['pesantren'] as const,
    lists: () => [...queryKeys.pesantren.all, 'list'] as const,
    list: (params: any) => [...queryKeys.pesantren.lists(), params] as const,
    details: () => [...queryKeys.pesantren.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pesantren.details(), id] as const,
    featured: () => [...queryKeys.pesantren.all, 'featured'] as const,
    popular: () => [...queryKeys.pesantren.all, 'popular'] as const,
    stats: () => [...queryKeys.pesantren.all, 'stats'] as const,
    search: (query: string, filters: any) => [...queryKeys.pesantren.all, 'search', query, filters] as const,
    byProvince: (province: string) => [...queryKeys.pesantren.all, 'province', province] as const,
    byProgram: (program: string) => [...queryKeys.pesantren.all, 'program', program] as const,
  },
  
  // User/Auth queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    applications: () => [...queryKeys.user.all, 'applications'] as const,
    consultations: () => [...queryKeys.user.all, 'consultations'] as const,
    reviews: () => [...queryKeys.user.all, 'reviews'] as const,
  },
  
  // Reviews queries
  reviews: {
    all: ['reviews'] as const,
    lists: () => [...queryKeys.reviews.all, 'list'] as const,
    list: (params: any) => [...queryKeys.reviews.lists(), params] as const,
    details: () => [...queryKeys.reviews.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.reviews.details(), id] as const,
    byPesantren: (pesantrenId: string, params?: any) => [...queryKeys.reviews.all, 'pesantren', pesantrenId, params] as const,
    byPesantrenCode: (pesantrenCode: string, params?: any) => [...queryKeys.reviews.all, 'pesantren-code', pesantrenCode, params] as const,
    byUser: (userId: string) => [...queryKeys.reviews.all, 'user', userId] as const,
    byUserCode: (userCode: string) => [...queryKeys.reviews.all, 'user-code', userCode] as const,
    featured: () => [...queryKeys.reviews.all, 'featured'] as const,
    recent: () => [...queryKeys.reviews.all, 'recent'] as const,
    stats: (pesantrenId?: string) => [...queryKeys.reviews.all, 'stats', pesantrenId] as const,
    statsByCode: (pesantrenCode?: string) => [...queryKeys.reviews.all, 'stats-code', pesantrenCode] as const,
  },
  
  // Applications queries
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (params: any) => [...queryKeys.applications.lists(), params] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
    byUser: (userId: string) => [...queryKeys.applications.all, 'user', userId] as const,
    byPesantren: (pesantrenId: string, params?: any) => [...queryKeys.applications.all, 'pesantren', pesantrenId, params] as const,
    stats: () => [...queryKeys.applications.all, 'stats'] as const,
  },
  
  // Consultations queries
  consultations: {
    all: ['consultations'] as const,
    lists: () => [...queryKeys.consultations.all, 'list'] as const,
    list: (params: any) => [...queryKeys.consultations.lists(), params] as const,
    details: () => [...queryKeys.consultations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.consultations.details(), id] as const,
    byUser: (userId: string, params: { page?: number; limit?: number; status?: "pending" | "scheduled" | "completed" | "cancelled"; consultation_type?: "general" | "specific_pesantren" | "program_selection" | "admission_process"; sort_by?: "created_at" | "scheduled_date" | "parent_name"; sort_order?: "asc" | "desc"; } | undefined) => [...queryKeys.consultations.all, 'user', userId] as const,
    slots: (date?: string) => [...queryKeys.consultations.all, 'slots', date] as const,
    types: () => [...queryKeys.consultations.all, 'types'] as const,
    stats: () => [...queryKeys.consultations.all, 'stats'] as const,
  },
} as const;

// Utility functions for cache management
export const cacheUtils = {
  // Invalidate all queries
  invalidateAll: () => {
    queryClient.invalidateQueries();
  },
  
  // Invalidate specific query patterns
  invalidatePesantren: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.pesantren.all });
  },
  
  invalidateReviews: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
  },
  
  invalidateApplications: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
  },
  
  invalidateConsultations: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.consultations.all });
  },
  
  invalidateUser: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
  },
  
  // Remove specific queries from cache
  removePesantren: (id?: string) => {
    if (id) {
      queryClient.removeQueries({ queryKey: queryKeys.pesantren.detail(id) });
    } else {
      queryClient.removeQueries({ queryKey: queryKeys.pesantren.all });
    }
  },
  
  // Prefetch data
  prefetchPesantren: (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: queryKeys.pesantren.detail(id),
      queryFn: () => import('@/services/pesantrenService').then(service => service.pesantrenService.getPesantrenById(id)),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
  
  // Set query data manually
  setPesantrenData: (id: string, data: any) => {
    queryClient.setQueryData(queryKeys.pesantren.detail(id), data);
  },
  
  // Get cached data
  getPesantrenData: (id: string) => {
    return queryClient.getQueryData(queryKeys.pesantren.detail(id));
  },
};

export default QueryProvider;