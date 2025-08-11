'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone?: string;
    role?: 'parent' | 'admin' | 'pesantren_admin';
    terms_accepted?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<{
    name: string;
    email: string;
    phone: string;
    profile_picture: string;
  }>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user && authService.isAuthenticated();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is stored in localStorage
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        if (storedUser && token) {
          // Try to get fresh user data from API
          try {
            const freshUser = await authService.getCurrentUser();
            setUser(freshUser);
          } catch (error) {
            // If API call fails, use stored user data
            console.warn('Failed to fetch fresh user data, using stored data:', error);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth data
        await authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ email, password, rememberMe });
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    phone?: string;
    role?: 'parent' | 'admin' | 'pesantren_admin';
    terms_accepted?: boolean;
  }) => {
    try {
      setIsLoading(true);
      
      // Ensure required fields are properly set
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
        phone: userData.phone || '',
        terms_accepted: userData.terms_accepted || false
      };
      
      const response = await authService.register(registerData);
      setUser(response.user);
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API call fails, clear local state
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<{
    name: string;
    email: string;
    phone: string;
    profile_picture: string;
  }>) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  // Change password function
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
    } catch (error) {
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const freshUser = await authService.getCurrentUser();
        setUser(freshUser);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const setupInterceptors = () => {
      // This would be handled by the api client interceptors
      // but we can add additional logic here if needed
    };

    if (isAuthenticated) {
      setupInterceptors();
    }
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    return <Component {...props} />;
  };
}

// Hook for role-based access
export function useRole() {
  const { user } = useAuth();
  
  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };
  
  const isAdmin = () => hasRole(['admin', 'pesantren_admin']);
  const isParent = () => hasRole('parent');
  const isPesantrenAdmin = () => hasRole('pesantren_admin');
  const isSuperAdmin = () => hasRole('admin');
  
  return {
    user,
    hasRole,
    isAdmin,
    isParent,
    isPesantrenAdmin,
    isSuperAdmin
  };
}

export default AuthContext;