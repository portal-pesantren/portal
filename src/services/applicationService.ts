import { api } from '@/lib/api';

// Application interfaces
export interface ApplicationData {
  pesantren_id: string;
  student_name: string;
  student_age: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  previous_education?: string;
  medical_conditions?: string;
  special_needs?: string;
  preferred_program?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  documents?: {
    birth_certificate?: string;
    family_card?: string;
    previous_school_certificate?: string;
    health_certificate?: string;
    photo?: string;
  };
  additional_notes?: string;
}

export interface ApiApplication {
  _id: string;
  pesantren_id: string;
  user_id: string;
  student_name: string;
  student_age: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  address: string;
  previous_education?: string;
  medical_conditions?: string;
  special_needs?: string;
  preferred_program?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  documents?: {
    birth_certificate?: string;
    family_card?: string;
    previous_school_certificate?: string;
    health_certificate?: string;
    photo?: string;
  };
  additional_notes?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submission_date: string;
  review_date?: string;
  reviewer_notes?: string;
  interview_scheduled?: boolean;
  interview_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  pesantrenId: string;
  userId: string;
  studentName: string;
  studentAge: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  previousEducation?: string;
  medicalConditions?: string;
  specialNeeds?: string;
  preferredProgram?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  documents?: {
    birthCertificate?: string;
    familyCard?: string;
    previousSchoolCertificate?: string;
    healthCertificate?: string;
    photo?: string;
  };
  additionalNotes?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  submissionDate: string;
  reviewDate?: string;
  reviewerNotes?: string;
  interviewScheduled?: boolean;
  interviewDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationSearchParams {
  pesantren_id?: string;
  user_id?: string;
  status?: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted';
  student_name?: string;
  submission_date_from?: string;
  submission_date_to?: string;
  sort_by?: 'submission_date' | 'student_name' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Transform API application to frontend format
const transformApplication = (apiApplication: ApiApplication): Application => {
  return {
    id: apiApplication._id,
    pesantrenId: apiApplication.pesantren_id,
    userId: apiApplication.user_id,
    studentName: apiApplication.student_name,
    studentAge: apiApplication.student_age,
    parentName: apiApplication.parent_name,
    parentEmail: apiApplication.parent_email,
    parentPhone: apiApplication.parent_phone,
    address: apiApplication.address,
    previousEducation: apiApplication.previous_education,
    medicalConditions: apiApplication.medical_conditions,
    specialNeeds: apiApplication.special_needs,
    preferredProgram: apiApplication.preferred_program,
    emergencyContactName: apiApplication.emergency_contact_name,
    emergencyContactPhone: apiApplication.emergency_contact_phone,
    documents: apiApplication.documents ? {
      birthCertificate: apiApplication.documents.birth_certificate,
      familyCard: apiApplication.documents.family_card,
      previousSchoolCertificate: apiApplication.documents.previous_school_certificate,
      healthCertificate: apiApplication.documents.health_certificate,
      photo: apiApplication.documents.photo
    } : undefined,
    additionalNotes: apiApplication.additional_notes,
    status: apiApplication.status,
    submissionDate: apiApplication.submission_date,
    reviewDate: apiApplication.review_date,
    reviewerNotes: apiApplication.reviewer_notes,
    interviewScheduled: apiApplication.interview_scheduled,
    interviewDate: apiApplication.interview_date,
    createdAt: apiApplication.created_at,
    updatedAt: apiApplication.updated_at
  };
};

// Application service
export const applicationService = {
  /**
   * Submit new application
   */
  submitApplication: async (applicationData: ApplicationData): Promise<Application> => {
    try {
      const response = await api.post<{ data: ApiApplication }>('/applications', applicationData);
      return transformApplication(response.data);
    } catch (error: any) {
      console.error('Submit application error:', error);
      
      if (error.response?.status === 409) {
        throw new Error('Anda sudah mengajukan aplikasi untuk pesantren ini');
      } else if (error.response?.status === 422) {
        throw new Error('Data aplikasi tidak valid');
      } else {
        throw new Error('Gagal mengajukan aplikasi');
      }
    }
  },

  /**
   * Get applications with pagination and filters
   */
  getApplications: async (params: ApplicationSearchParams = {}): Promise<{
    applications: Application[];
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
      if (params.status) queryParams.append('status', params.status);
      if (params.student_name) queryParams.append('student_name', params.student_name);
      if (params.submission_date_from) queryParams.append('submission_date_from', params.submission_date_from);
      if (params.submission_date_to) queryParams.append('submission_date_to', params.submission_date_to);
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get<{
        data: ApiApplication[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
      }>(`/applications?${queryParams.toString()}`);
      
      return {
        applications: response.data.map(transformApplication),
        total: response.total,
        page: response.page,
        limit: response.limit,
        total_pages: response.total_pages
      };
    } catch (error) {
      console.error('Get applications error:', error);
      throw new Error('Gagal mengambil data aplikasi');
    }
  },

  /**
   * Get application by ID
   */
  getApplicationById: async (applicationId: string): Promise<Application> => {
    try {
      const response = await api.get<{ data: ApiApplication }>(`/applications/${applicationId}`);
      return transformApplication(response.data);
    } catch (error) {
      console.error('Get application by ID error:', error);
      throw new Error('Gagal mengambil data aplikasi');
    }
  },

  /**
   * Update application
   */
  updateApplication: async (applicationId: string, applicationData: Partial<ApplicationData>): Promise<Application> => {
    try {
      const response = await api.put<{ data: ApiApplication }>(`/applications/${applicationId}`, applicationData);
      return transformApplication(response.data);
    } catch (error: any) {
      console.error('Update application error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah aplikasi ini');
      } else if (error.response?.status === 404) {
        throw new Error('Aplikasi tidak ditemukan');
      } else {
        throw new Error('Gagal mengubah aplikasi');
      }
    }
  },

  /**
   * Cancel application
   */
  cancelApplication: async (applicationId: string): Promise<void> => {
    try {
      await api.delete(`/applications/${applicationId}`);
    } catch (error: any) {
      console.error('Cancel application error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk membatalkan aplikasi ini');
      } else if (error.response?.status === 404) {
        throw new Error('Aplikasi tidak ditemukan');
      } else {
        throw new Error('Gagal membatalkan aplikasi');
      }
    }
  },

  /**
   * Get user's applications
   */
  getUserApplications: async (userId: string, params: Omit<ApplicationSearchParams, 'user_id'> = {}): Promise<{
    applications: Application[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    return applicationService.getApplications({ ...params, user_id: userId });
  },

  /**
   * Get pesantren applications
   */
  getPesantrenApplications: async (pesantrenId: string, params: Omit<ApplicationSearchParams, 'pesantren_id'> = {}): Promise<{
    applications: Application[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    return applicationService.getApplications({ ...params, pesantren_id: pesantrenId });
  },

  /**
   * Update application status (admin only)
   */
  updateApplicationStatus: async (applicationId: string, status: Application['status'], reviewerNotes?: string): Promise<Application> => {
    try {
      const response = await api.patch<{ data: ApiApplication }>(`/applications/${applicationId}/status`, {
        status,
        reviewer_notes: reviewerNotes
      });
      return transformApplication(response.data);
    } catch (error: any) {
      console.error('Update application status error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk mengubah status aplikasi');
      } else {
        throw new Error('Gagal mengubah status aplikasi');
      }
    }
  },

  /**
   * Schedule interview
   */
  scheduleInterview: async (applicationId: string, interviewDate: string): Promise<Application> => {
    try {
      const response = await api.patch<{ data: ApiApplication }>(`/applications/${applicationId}/interview`, {
        interview_date: interviewDate,
        interview_scheduled: true
      });
      return transformApplication(response.data);
    } catch (error) {
      console.error('Schedule interview error:', error);
      throw new Error('Gagal menjadwalkan wawancara');
    }
  },

  /**
   * Upload document
   */
  uploadDocument: async (applicationId: string, documentType: string, file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      
      // Use fetch directly for file upload since our api client might not support FormData properly
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/${applicationId}/documents`, {
        method: 'POST',
        headers,
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json() as { file_url: string };
       return result.file_url;
    } catch (error) {
      console.error('Upload document error:', error);
      throw new Error('Gagal mengunggah dokumen');
    }
  },

  /**
   * Get application statistics
   */
  getApplicationStats: async (pesantrenId?: string): Promise<{
    total: number;
    pending: number;
    under_review: number;
    accepted: number;
    rejected: number;
    waitlisted: number;
  }> => {
    try {
      const url = pesantrenId ? `/applications/stats?pesantren_id=${pesantrenId}` : '/applications/stats';
      const response = await api.get<{ data: any }>(url);
      return response.data;
    } catch (error) {
      console.error('Get application stats error:', error);
      throw new Error('Gagal mengambil statistik aplikasi');
    }
  }
};

export default applicationService;