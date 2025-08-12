import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationService } from '@/services/consultationService';
import { queryKeys } from '@/providers/QueryProvider';
import { Consultation, ConsultationData } from '@/services/consultationService';
import { useAuth } from '@/contexts/AuthContext';

// Hook untuk mendapatkan daftar konsultasi dengan paginasi
export function useConsultations(params?: {
  page?: number;
  limit?: number;
  user_id?: string;
  user_code?: string; // UUID v7 support
  consultant_id?: string;
  consultant_code?: string; // UUID v7 support
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultation_type?: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  pesantren_id?: string;
  pesantren_code?: string; // UUID v7 support
  scheduled_date_from?: string;
  scheduled_date_to?: string;
  sort_by?: 'created_at' | 'scheduled_date' | 'parent_name';
  sort_order?: 'asc' | 'desc';
}) {
  // Prioritize UUID v7 codes over legacy IDs
  const queryParams = {
    ...params,
    user_id: params?.user_code || params?.user_id,
    consultant_id: params?.consultant_code || params?.consultant_id,
    pesantren_id: params?.pesantren_code || params?.pesantren_id,
  };

  return useQuery({
    queryKey: queryKeys.consultations?.list?.(queryParams) || ['consultations', 'list', queryParams],
    queryFn: () => consultationService.getConsultations(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan detail konsultasi berdasarkan ID (legacy support)
export function useConsultationDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.consultations?.detail?.(id) || ['consultations', 'detail', id],
    queryFn: () => consultationService.getConsultationById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan detail konsultasi dengan UUID v7 code
export function useConsultationDetailByCode(code: string) {
  return useQuery({
    queryKey: queryKeys.consultations?.detail?.(code) || ['consultations', 'detail', code],
    queryFn: () => consultationService.getConsultationById(code),
    enabled: !!code,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mendapatkan konsultasi pengguna (legacy support)
export function useUserConsultations(userId?: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultation_type?: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  sort_by?: 'created_at' | 'scheduled_date' | 'parent_name';
  sort_order?: 'asc' | 'desc';
}) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  return useQuery({
    queryKey: queryKeys.consultations?.byUser?.(targetUserId || '', params) || ['consultations', 'byUser', targetUserId, params],
    queryFn: () => consultationService.getUserConsultations(targetUserId!, params),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan konsultasi pengguna dengan UUID v7 code
export function useUserConsultationsByCode(userCode?: string, params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultation_type?: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  sort_by?: 'created_at' | 'scheduled_date' | 'parent_name';
  sort_order?: 'asc' | 'desc';
}) {
  const { user } = useAuth();
  const targetUserCode = userCode || user?.code;
  
  return useQuery({
    queryKey: ['consultations', 'byUserCode', targetUserCode, params],
    queryFn: () => consultationService.getUserConsultations(targetUserCode!, params),
    enabled: !!targetUserCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk mendapatkan slot konsultasi yang tersedia
export function useAvailableConsultationSlots(date?: string, consultationType?: string) {
  return useQuery({
    queryKey: queryKeys.consultations.slots(date),
    queryFn: () => consultationService.getAvailableSlots(date, consultationType),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook untuk mendapatkan tipe konsultasi
export function useConsultationTypes() {
  return useQuery({
    queryKey: queryKeys.consultations.types(),
    queryFn: () => consultationService.getConsultationTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Hook untuk mendapatkan statistik konsultasi
export function useConsultationStats(consultantId?: string) {
  return useQuery({
    queryKey: ['consultations', 'stats', consultantId],
    queryFn: () => consultationService.getConsultationStats(consultantId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook untuk mengajukan konsultasi baru
export function useSubmitConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: consultationService.submitConsultation,
    onSuccess: (newConsultation) => {
      // Invalidate and refetch consultations
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      
      // Update user consultations cache
      if (newConsultation.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['consultations', 'byUser', newConsultation.userId] 
        });
      }
    },
    onError: (error) => {
      console.error('Error submitting consultation:', error);
    },
  });
}

// Hook untuk memperbarui konsultasi
export function useUpdateConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ConsultationData> }) => 
      consultationService.updateConsultation(id, data),
    onSuccess: (updatedConsultation, { id }) => {
      // Update specific consultation cache
      queryClient.setQueryData(
        ['consultations', 'detail', id],
        updatedConsultation
      );
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['consultations', 'list'] });
      
      // Update user consultations cache
      if (updatedConsultation.userId) {
        queryClient.invalidateQueries({ 
          queryKey: ['consultations', 'byUser', updatedConsultation.userId] 
        });
      }
    },
    onError: (error) => {
      console.error('Error updating consultation:', error);
    },
  });
}

// Hook untuk membatalkan konsultasi
export function useCancelConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      consultationService.cancelConsultation(id, reason),
    onSuccess: (_, { id }) => {
      // Invalidate consultation caches
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
    },
    onError: (error) => {
      console.error('Error cancelling consultation:', error);
    },
  });
}

// Hook untuk menjadwalkan konsultasi
export function useScheduleConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, scheduledDate, consultantId }: { 
      id: string; 
      scheduledDate: string; 
      consultantId?: string; 
    }) => consultationService.scheduleConsultation(id, scheduledDate, consultantId),
    onSuccess: (updatedConsultation, { id }) => {
      // Update specific consultation cache
      queryClient.setQueryData(
        ['consultations', 'detail', id],
        updatedConsultation
      );
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: ['consultations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['consultations', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['consultations', 'availableSlots'] });
    },
    onError: (error) => {
      console.error('Error scheduling consultation:', error);
    },
  });
}

// Hook untuk menyelesaikan konsultasi
export function useCompleteConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, meetingNotes, followUpRequired }: { 
      id: string; 
      meetingNotes: string; 
      followUpRequired?: boolean; 
    }) => consultationService.completeConsultation(id, meetingNotes, followUpRequired),
    onSuccess: (updatedConsultation, { id }) => {
      // Update specific consultation cache
      queryClient.setQueryData(
        ['consultations', 'detail', id],
        updatedConsultation
      );
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: ['consultations', 'list'] });
      queryClient.invalidateQueries({ queryKey: ['consultations', 'stats'] });
    },
    onError: (error) => {
      console.error('Error completing consultation:', error);
    },
  });
}

// Hook untuk mengirim feedback konsultasi
export function useSendConsultationFeedback() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, feedback }: { 
      id: string; 
      feedback: {
        rating: number;
        comment?: string;
        helpful_topics?: string[];
        improvement_suggestions?: string;
      };
    }) => consultationService.sendConsultationFeedback(id, feedback),
    onSuccess: (_, { id }) => {
      // Invalidate consultation detail to reflect feedback
      queryClient.invalidateQueries({ 
        queryKey: ['consultations', 'detail', id] 
      });
    },
    onError: (error) => {
      console.error('Error sending consultation feedback:', error);
    },
  });
}