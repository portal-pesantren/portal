import { api } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';
import { ConsultationStats } from '@/types';

// Consultation interfaces
export interface ConsultationData {
  parent_name: string;
  child_name: string;
  child_age: number;
  email: string;
  phone: string;
  preferred_location?: string;
  preferred_programs?: string[];
  budget_range?: string;
  consultation_type: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  pesantren_id?: string;
  preferred_schedule?: string;
  questions?: string;
  additional_notes?: string;
}

export interface ApiConsultation {
  _id: string;
  user_id?: string;
  parent_name: string;
  child_name: string;
  child_age: number;
  email: string;
  phone: string;
  preferred_location?: string;
  preferred_programs?: string[];
  budget_range?: string;
  consultation_type: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  pesantren_id?: string;
  preferred_schedule?: string;
  questions?: string;
  additional_notes?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultant_id?: string;
  consultant_name?: string;
  scheduled_date?: string;
  meeting_link?: string;
  meeting_notes?: string;
  follow_up_required?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  userId?: string;
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string;
  preferredLocation?: string;
  preferredPrograms?: string[];
  budgetRange?: string;
  consultationType: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  pesantrenId?: string;
  preferredSchedule?: string;
  questions?: string;
  additionalNotes?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultantId?: string;
  consultantName?: string;
  scheduledDate?: string;
  meetingLink?: string;
  meetingNotes?: string;
  followUpRequired?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationSearchParams {
  user_id?: string;
  consultant_id?: string;
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  consultation_type?: 'general' | 'specific_pesantren' | 'program_selection' | 'admission_process';
  pesantren_id?: string;
  scheduled_date_from?: string;
  scheduled_date_to?: string;
  sort_by?: 'created_at' | 'scheduled_date' | 'parent_name';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ConsultationSlot {
  date: string;
  time: string;
  available: boolean;
  consultant_id?: string;
  consultant_name?: string;
}

// Transform API consultation to frontend format
const transformConsultation = (apiConsultation: ApiConsultation): Consultation => {
  return {
    id: apiConsultation._id,
    userId: apiConsultation.user_id,
    parentName: apiConsultation.parent_name,
    childName: apiConsultation.child_name,
    childAge: apiConsultation.child_age,
    email: apiConsultation.email,
    phone: apiConsultation.phone,
    preferredLocation: apiConsultation.preferred_location,
    preferredPrograms: apiConsultation.preferred_programs,
    budgetRange: apiConsultation.budget_range,
    consultationType: apiConsultation.consultation_type,
    pesantrenId: apiConsultation.pesantren_id,
    preferredSchedule: apiConsultation.preferred_schedule,
    questions: apiConsultation.questions,
    additionalNotes: apiConsultation.additional_notes,
    status: apiConsultation.status,
    consultantId: apiConsultation.consultant_id,
    consultantName: apiConsultation.consultant_name,
    scheduledDate: apiConsultation.scheduled_date,
    meetingLink: apiConsultation.meeting_link,
    meetingNotes: apiConsultation.meeting_notes,
    followUpRequired: apiConsultation.follow_up_required,
    createdAt: apiConsultation.created_at,
    updatedAt: apiConsultation.updated_at
  };
};

// Consultation service
export const consultationService = {
  /**
   * Submit new consultation request
   */
  submitConsultation: async (consultationData: ConsultationData): Promise<Consultation> => {
    try {
      const response = await api.post<{ data: ApiConsultation }>(API_CONFIG.ENDPOINTS.CONSULTATIONS.CREATE, consultationData);
      return transformConsultation(response.data);
    } catch (error: any) {
      console.error('Submit consultation error:', error);
      
      if (error.response?.status === 422) {
        throw new Error('Data konsultasi tidak valid');
      } else {
        throw new Error('Gagal mengajukan konsultasi');
      }
    }
  },

  /**
   * Get consultations with pagination and filters
   */
  getConsultations: async (params: ConsultationSearchParams = {}): Promise<{
    consultations: Consultation[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.consultant_id) queryParams.append('consultant_id', params.consultant_id);
      if (params.status) queryParams.append('status', params.status);
      if (params.consultation_type) queryParams.append('consultation_type', params.consultation_type);
      if (params.pesantren_id) queryParams.append('pesantren_id', params.pesantren_id);
      if (params.scheduled_date_from) queryParams.append('scheduled_date_from', params.scheduled_date_from);
      if (params.scheduled_date_to) queryParams.append('scheduled_date_to', params.scheduled_date_to);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get<{
        data: ApiConsultation[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.LIST}?${queryParams.toString()}`);
      
      return {
        consultations: response.data.map(transformConsultation),
        total: response.total,
        page: response.page,
        limit: response.limit,
        total_pages: response.total_pages
      };
    } catch (error) {
      console.error('Get consultations error:', error);
      throw new Error('Gagal mengambil data konsultasi');
    }
  },

  /**
   * Get consultation by ID
   */
  getConsultationById: async (consultationId: string): Promise<Consultation> => {
    try {
      const response = await api.get<{ data: ApiConsultation }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.DETAIL}/${consultationId}`);
      return transformConsultation(response.data);
    } catch (error) {
      console.error('Get consultation by ID error:', error);
      throw new Error('Gagal mengambil data konsultasi');
    }
  },

  /**
   * Update consultation
   */
  updateConsultation: async (consultationId: string, consultationData: Partial<ConsultationData>): Promise<Consultation> => {
    try {
      const response = await api.put<{ data: ApiConsultation }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.UPDATE}/${consultationId}`, consultationData);
      return transformConsultation(response.data);
    } catch (error: any) {
      console.error('Update consultation error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah konsultasi ini');
      } else if (error.response?.status === 404) {
        throw new Error('Konsultasi tidak ditemukan');
      } else {
        throw new Error('Gagal mengubah konsultasi');
      }
    }
  },

  /**
   * Cancel consultation
   */
  cancelConsultation: async (consultationId: string, reason?: string): Promise<void> => {
    try {
      await api.patch(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.CANCEL}/${consultationId}`, { reason });
    } catch (error: any) {
      console.error('Cancel consultation error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk membatalkan konsultasi ini');
      } else if (error.response?.status === 404) {
        throw new Error('Konsultasi tidak ditemukan');
      } else {
        throw new Error('Gagal membatalkan konsultasi');
      }
    }
  },

  /**
   * Get user's consultations
   */
  getUserConsultations: async (userId: string, params: Omit<ConsultationSearchParams, 'user_id'> = {}): Promise<{
    consultations: Consultation[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    return consultationService.getConsultations({ ...params, user_id: userId });
  },

  /**
   * Get available consultation slots
   */
  getAvailableSlots: async (date?: string, consultationType?: string): Promise<ConsultationSlot[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (date) queryParams.append('date', date);
      if (consultationType) queryParams.append('consultation_type', consultationType);
      
      const response = await api.get<{ data: ConsultationSlot[] }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.SLOTS}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get available slots error:', error);
      throw new Error('Gagal mengambil jadwal konsultasi yang tersedia');
    }
  },

  /**
   * Schedule consultation
   */
  scheduleConsultation: async (consultationId: string, scheduledDate: string, consultantId?: string): Promise<Consultation> => {
    try {
      const response = await api.patch<{ data: ApiConsultation }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.SCHEDULE}/${consultationId}`, {
        scheduled_date: scheduledDate,
        consultant_id: consultantId
      });
      return transformConsultation(response.data);
    } catch (error) {
      console.error('Schedule consultation error:', error);
      throw new Error('Gagal menjadwalkan konsultasi');
    }
  },

  /**
   * Complete consultation with notes
   */
  completeConsultation: async (consultationId: string, meetingNotes: string, followUpRequired: boolean = false): Promise<Consultation> => {
    try {
      const response = await api.patch<{ data: ApiConsultation }>(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.COMPLETE}/${consultationId}`, {
        meeting_notes: meetingNotes,
        follow_up_required: followUpRequired
      });
      return transformConsultation(response.data);
    } catch (error) {
      console.error('Complete consultation error:', error);
      throw new Error('Gagal menyelesaikan konsultasi');
    }
  },

  /**
   * Get consultation statistics
   */
  getConsultationStats: async (consultantId?: string): Promise<ConsultationStats> => {
    try {
      const url = consultantId 
        ? `${API_CONFIG.ENDPOINTS.CONSULTATIONS.STATS}?consultant_id=${consultantId}` 
        : API_CONFIG.ENDPOINTS.CONSULTATIONS.STATS;
      const response = await api.get<{ data: any }>(url);
      
      // Transform API response to match ConsultationStats interface
      return {
        total: response.data.total || 0,
        pending: response.data.pending || 0,
        scheduled: response.data.scheduled || 0,
        completed: response.data.completed || 0,
        cancelled: response.data.cancelled || 0,
        this_month: response.data.this_month || 0,
        satisfaction_rating: response.data.satisfaction_rating
      };
    } catch (error) {
      console.error('Get consultation stats error:', error);
      throw new Error('Gagal mengambil statistik konsultasi');
    }
  },

  /**
   * Get consultation types
   */
  getConsultationTypes: async (): Promise<Array<{
    value: string;
    label: string;
    description: string;
    duration: number;
  }>> => {
    try {
      const response = await api.get<{ data: any[] }>(API_CONFIG.ENDPOINTS.CONSULTATIONS.TYPES);
      return response.data;
    } catch (error) {
      console.error('Get consultation types error:', error);
      // Return default types if API fails
      return [
        {
          value: 'general',
          label: 'Konsultasi Umum',
          description: 'Konsultasi umum tentang pendidikan pesantren',
          duration: 30
        },
        {
          value: 'specific_pesantren',
          label: 'Konsultasi Pesantren Tertentu',
          description: 'Konsultasi tentang pesantren tertentu',
          duration: 45
        },
        {
          value: 'program_selection',
          label: 'Pemilihan Program',
          description: 'Bantuan memilih program yang sesuai',
          duration: 60
        },
        {
          value: 'admission_process',
          label: 'Proses Pendaftaran',
          description: 'Panduan proses pendaftaran pesantren',
          duration: 45
        }
      ];
    }
  },

  /**
   * Send consultation feedback
   */
  sendConsultationFeedback: async (consultationId: string, feedback: {
    rating: number;
    comment?: string;
    helpful_topics?: string[];
    improvement_suggestions?: string;
  }): Promise<void> => {
    try {
      await api.post(`${API_CONFIG.ENDPOINTS.CONSULTATIONS.FEEDBACK}/${consultationId}`, feedback);
    } catch (error) {
      console.error('Send consultation feedback error:', error);
      throw new Error('Gagal mengirim feedback konsultasi');
    }
  }
};

export default consultationService;