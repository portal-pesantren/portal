import { api } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';
import { User, LoginCredentials, RegisterData, RegisterResponse, LoginResponse, AuthTokens } from '@/types';

// Legacy auth response for backward compatibility
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
    is_verified: boolean;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Transform API user to frontend format
const transformUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    created_at: apiUser.created_at,
    updated_at: apiUser.updated_at,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    role: apiUser.role as 'parent' | 'admin' | 'pesantren_admin',
    profile_picture: apiUser.profile_picture,
    address: apiUser.address,
    date_of_birth: apiUser.date_of_birth,
    gender: apiUser.gender,
    occupation: apiUser.occupation,
    is_active: apiUser.is_active,
    is_verified: apiUser.is_verified,
    email_verified: apiUser.email_verified,
    phone_verified: apiUser.phone_verified,
    last_login: apiUser.last_login,
    login_count: apiUser.login_count,
    // Legacy field for backward compatibility
    avatar: apiUser.profile_picture || apiUser.avatar,
  };
};

// Auth service
export const authService = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const data = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Check if response has the expected structure
      if (!data || !data.access_token) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response from server');
      }
      
      // Store tokens in localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Also store in cookies for middleware access
        document.cookie = `access_token=${data.access_token}; path=/; max-age=${data.expires_in || 86400}; SameSite=Lax`;
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days
      }
      
      return {
        user: transformUser(data.user),
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      if (error.response?.status === 401) {
        throw new Error('Email atau password salah');
      } else if (error.response?.status === 422) {
        throw new Error('Data login tidak valid');
      } else {
        throw new Error('Gagal login. Silakan coba lagi.');
      }
    }
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      const data = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
      
      // Check if response has the expected structure
      if (!data || !data.access_token) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response from server');
      }
      
      // Store tokens in localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Also store in cookies for middleware access
        document.cookie = `access_token=${data.access_token}; path=/; max-age=${data.expires_in || 86400}; SameSite=Lax`;
        document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days
      }
      
      return {
        user: transformUser(data.user),
        verification_token: data.verification_token,
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      };
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Handle specific error messages
      if (error.response?.status === 409) {
        throw new Error('Email sudah terdaftar');
      } else if (error.response?.status === 422) {
        const details = error.response.data?.detail;
        if (Array.isArray(details)) {
          const messages = details.map((d: any) => d.msg).join(', ');
          throw new Error(`Data tidak valid: ${messages}`);
        }
        throw new Error('Data registrasi tidak valid');
      } else {
        throw new Error('Gagal mendaftar. Silakan coba lagi.');
      }
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if available
      await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and cookies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Clear cookies
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const data = await api.post<RefreshTokenResponse>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        refresh_token: refreshToken
      });
      
      // Check if response has the expected structure
      if (!data || !data.access_token) {
        console.error('Invalid refresh token response:', data);
        throw new Error('Invalid response from server');
      }
      
      // Update access token in localStorage and cookies
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', data.access_token);
        
        // Update cookie
        document.cookie = `access_token=${data.access_token}; path=/; max-age=${data.expires_in || 86400}; SameSite=Lax`;
      }
      
      return data.access_token;
    } catch (error) {
      console.error('Refresh token error:', error);
      
      // If refresh fails, logout user
      await authService.logout();
      throw new Error('Session expired. Please login again.');
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const data = await api.get<{ data: any }>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
      // Handle both direct user data and wrapped data structure
      const userData = data.data || data;
      return transformUser(userData);
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error('Gagal mengambil data pengguna');
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: Partial<{
    name: string;
    email: string;
    phone: string;
    profile_picture: string;
  }>): Promise<User> => {
    try {
      const response = await api.put<{ data: any }>(API_CONFIG.ENDPOINTS.AUTH.PROFILE, userData);
      
      // Update user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return transformUser(response.data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Gagal memperbarui profil');
    }
  },

  /**
   * Change password
   */
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Password lama tidak benar');
      } else {
        throw new Error('Gagal mengubah password');
      }
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    } catch (error) {
      console.error('Request password reset error:', error);
      throw new Error('Gagal mengirim email reset password');
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        new_password: newPassword
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error('Gagal reset password');
    }
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
    } catch (error) {
      console.error('Verify email error:', error);
      throw new Error('Gagal verifikasi email');
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Get stored user data
   */
  getStoredUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const userData = JSON.parse(userStr);
      return transformUser(userData);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  },

  /**
   * Get stored access token
   */
  getStoredToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }
};

export default authService;