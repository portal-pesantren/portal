import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { queryKeys } from '@/providers/QueryProvider';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export useAuth from context for convenience
export { useAuth, useRole, withAuth } from '@/contexts/AuthContext';

// Hook untuk login dengan React Query
export function useLogin() {
  const { login } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password, rememberMe }: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => login(email, password, rememberMe),
    onSuccess: (data) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

// Hook untuk register dengan React Query
export function useRegister() {
  const { register } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: {
      name: string;
      email: string;
      password: string;
      confirm_password: string;
      phone?: string;
      role?: 'parent' | 'admin' | 'pesantren_admin';
      terms_accepted?: boolean;
    }) => register(userData),
    onSuccess: (data) => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });
}

// Hook untuk logout dengan React Query
export function useLogout() {
  const { logout } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout error:', error);
    },
  });
}

// Hook untuk update profile dengan React Query
export function useUpdateProfile() {
  const { updateProfile } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<{
      name: string;
      email: string;
      phone: string;
      profile_picture: string;
    }>) => updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Update user profile cache
      queryClient.setQueryData(queryKeys.user.profile(), updatedUser);
      
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error('Update profile error:', error);
    },
  });
}

// Hook untuk change password dengan React Query
export function useChangePassword() {
  const { changePassword } = useAuthContext();
  
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: {
      currentPassword: string;
      newPassword: string;
    }) => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      console.log('Password changed successfully');
    },
    onError: (error) => {
      console.error('Change password error:', error);
    },
  });
}

// Hook untuk forgot password
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => {
      // TODO: Implement when backend supports forgot password
      console.log('Forgot password for:', email);
      return Promise.resolve({ message: 'Password reset email sent' });
    },
    onSuccess: () => {
      console.log('Password reset email sent');
    },
    onError: (error) => {
      console.error('Forgot password error:', error);
    },
  });
}

// Hook untuk reset password
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: {
      token: string;
      newPassword: string;
    }) => authService.resetPassword(token, newPassword),
    onSuccess: () => {
      console.log('Password reset successfully');
    },
    onError: (error) => {
      console.error('Reset password error:', error);
    },
  });
}

// Hook untuk verify email
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      console.log('Email verified successfully');
    },
    onError: (error) => {
      console.error('Email verification error:', error);
    },
  });
}

// Hook untuk resend verification email
export function useResendVerification() {
  return useMutation({
    mutationFn: () => {
      // Placeholder implementation - implement when backend supports it
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log('Verification email sent');
    },
    onError: (error) => {
      console.error('Resend verification error:', error);
    },
  });
}

// Hook untuk refresh user data
export function useRefreshUser() {
  const { refreshUser } = useAuthContext();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => refreshUser(),
    onSuccess: () => {
      // Invalidate user-related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    },
    onError: (error) => {
      console.error('Refresh user error:', error);
    },
  });
}

// Hook untuk mendapatkan current user profile
export function useUserProfile() {
  const { user, isAuthenticated } = useAuthContext();
  
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    initialData: user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook untuk check authentication status
export function useAuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isGuest: !isAuthenticated && !isLoading,
  };
}

// Hook untuk role-based access control
export function usePermissions() {
  const { user } = useAuthContext();
  
  const hasPermission = (permission: string | string[]) => {
    if (!user) return false;
    
    // Define role permissions
    const rolePermissions = {
      admin: ['*'], // Admin has all permissions
      pesantren_admin: [
        'pesantren.read',
        'pesantren.update',
        'applications.read',
        'applications.update',
        'consultations.read',
        'consultations.update',
        'reviews.read',
        'reviews.moderate',
      ],
      parent: [
        'pesantren.read',
        'applications.create',
        'applications.read',
        'consultations.create',
        'consultations.read',
        'reviews.create',
        'reviews.read',
        'reviews.update', // own reviews only
      ],
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    
    // Admin has all permissions
    if (userPermissions.includes('*')) return true;
    
    if (Array.isArray(permission)) {
      return permission.some(p => userPermissions.includes(p));
    }
    
    return userPermissions.includes(permission);
  };
  
  const canRead = (resource: string) => hasPermission(`${resource}.read`);
  const canCreate = (resource: string) => hasPermission(`${resource}.create`);
  const canUpdate = (resource: string) => hasPermission(`${resource}.update`);
  const canDelete = (resource: string) => hasPermission(`${resource}.delete`);
  const canModerate = (resource: string) => hasPermission(`${resource}.moderate`);
  
  return {
    hasPermission,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canModerate,
  };
}

// Types untuk export
export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone?: string;
  role?: 'parent' | 'admin' | 'pesantren_admin';
  terms_accepted?: boolean;
};

export type UpdateProfileData = Partial<{
  name: string;
  email: string;
  phone: string;
  profile_picture: string;
}>;

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};