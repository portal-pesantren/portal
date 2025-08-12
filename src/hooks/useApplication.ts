import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/services/applicationService';
import { queryKeys } from '@/providers/QueryProvider';
import { Application, ApplicationData } from '@/services/applicationService';
import { useAuth } from '@/contexts/AuthContext';

// Hook untuk mendapatkan daftar aplikasi dengan paginasi
export function useApplications(params?: {
  page?: number;
  limit?: number;
  pesantren_id?: string;
  pesantren_code?: string; // UUID v7 support
  user_id?: string;
  user_code?: string; // UUID v7 support
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  student_name?: string;
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  // Prioritize UUID v7 codes over legacy IDs
  const queryParams = {
    ...params,
    pesantren_id: params?.pesantren_code || params?.pesantren_id,
    user_id: params?.user_code || params?.user_id,
  };

  return useQuery({
    queryKey: queryKeys.applications.list(queryParams),
    queryFn: () => applicationService.getApplications(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan detail aplikasi berdasarkan ID (legacy support)
export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan detail aplikasi dengan UUID v7 code
export function useApplicationDetailByCode(code: string) {
  return useQuery({
    queryKey: queryKeys.applications.detail(code),
    queryFn: () => applicationService.getApplicationById(code),
    enabled: !!code,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan aplikasi pengguna (legacy support)
export function useUserApplications(userId?: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: queryKeys.applications.byUser(targetUserId || ''),
    queryFn: () => applicationService.getUserApplications(targetUserId!, params),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan aplikasi pengguna dengan UUID v7 code
export function useUserApplicationsByCode(userCode?: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  const { user } = useAuth();
  const targetUserCode = userCode || user?.code;
  
  return useQuery({
    queryKey: ['applications', 'byUserCode', targetUserCode],
    queryFn: () => applicationService.getUserApplications(targetUserCode!, params),
    enabled: !!targetUserCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan aplikasi pesantren (legacy support)
export function usePesantrenApplications(pesantrenId: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  student_name?: string;
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: queryKeys.applications.byPesantren(pesantrenId, params),
    queryFn: () => applicationService.getPesantrenApplications(pesantrenId, params),
    enabled: !!pesantrenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan aplikasi pesantren dengan UUID v7 code
export function usePesantrenApplicationsByCode(pesantrenCode: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  student_name?: string;
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: ['applications', 'byPesantrenCode', pesantrenCode, params],
    queryFn: () => applicationService.getPesantrenApplications(pesantrenCode, params),
    enabled: !!pesantrenCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan statistik aplikasi
export function useApplicationStats() {
  return useQuery({
    queryKey: queryKeys.applications.stats(),
    queryFn: () => applicationService.getApplicationStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mengajukan aplikasi baru
export function useSubmitApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applicationService.submitApplication,
    onSuccess: (newApplication) => {
      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      
      // Update user applications cache
      if (newApplication.userId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.applications.byUser(newApplication.userId) 
        });
      }
      
      // Update pesantren applications cache
      if (newApplication.pesantrenId) {
        queryClient.invalidateQueries({ 
          queryKey: ['applications', 'byPesantren', newApplication.pesantrenId] 
        });
      }
    },
    onError: (error) => {
      console.error('Error submitting application:', error);
    },
  });
}

// Hook untuk memperbarui aplikasi
export function useUpdateApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApplicationData> }) => 
      applicationService.updateApplication(id, data),
    onSuccess: (updatedApplication, { id }) => {
      // Update specific application cache
      queryClient.setQueryData(
        queryKeys.applications.detail(id),
        updatedApplication
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
      
      // Update user applications cache
      if (updatedApplication.userId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.applications.byUser(updatedApplication.userId) 
        });
      }
    },
    onError: (error) => {
      console.error('Error updating application:', error);
    },
  });
}

// Hook untuk memperbarui status aplikasi (admin only)
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status, reviewerNotes }: { 
      id: string; 
      status: Application['status']; 
      reviewerNotes?: string; 
    }) => applicationService.updateApplicationStatus(id, status, reviewerNotes),
    onSuccess: (updatedApplication, { id }) => {
      // Update specific application cache
      queryClient.setQueryData(
        queryKeys.applications.detail(id),
        updatedApplication
      );
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.stats() });
    },
    onError: (error) => {
      console.error('Error updating application status:', error);
    },
  });
}

// Hook untuk menjadwalkan wawancara
export function useScheduleInterview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, interviewDate }: { id: string; interviewDate: string }) => 
      applicationService.scheduleInterview(id, interviewDate),
    onSuccess: (updatedApplication, { id }) => {
      // Update specific application cache
      queryClient.setQueryData(
        queryKeys.applications.detail(id),
        updatedApplication
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
    },
    onError: (error) => {
      console.error('Error scheduling interview:', error);
    },
  });
}

// Hook untuk upload dokumen aplikasi (jika tersedia di service)
export function useUploadApplicationDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, documentType, file }: { 
      id: string; 
      documentType: string; 
      file: File; 
    }) => {
      // Placeholder implementation - implement when service method is available
      throw new Error('Upload document service not implemented yet');
    },
    onSuccess: (updatedApplication, { id }) => {
      // Update specific application cache
      queryClient.setQueryData(
        queryKeys.applications.detail(id),
        updatedApplication
      );
    },
    onError: (error) => {
      console.error('Error uploading document:', error);
    },
  });
}

// Hook untuk memeriksa apakah user dapat mengajukan aplikasi ke pesantren
export function useCanUserApply(pesantrenId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['canUserApply', pesantrenId, user?.id],
    queryFn: async () => {
      // Check if user already has an application for this pesantren
      const userApplications = await applicationService.getUserApplications(user?.id || '');
      return !userApplications.applications.some(app => app.pesantrenId === pesantrenId);
    },
    enabled: !!user && !!pesantrenId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk memeriksa apakah user dapat mengajukan aplikasi ke pesantren dengan UUID v7 code
export function useCanUserApplyByCode(pesantrenCode: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['canUserApplyByCode', pesantrenCode, user?.code],
    queryFn: async () => {
      // Check if user already has an application for this pesantren
      const userApplications = await applicationService.getUserApplications(user?.code || '');
      return !userApplications.applications.some(app => app.pesantrenCode === pesantrenCode);
    },
    enabled: !!user && !!pesantrenCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}