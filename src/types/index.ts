// Common types for the Portal Pesantren application

export interface Pesantren {
  id: number;
  name: string;
  location: string;
  address: string;
  rating: number;
  students: number;
  programs: string[];
  image: string;
  featured?: boolean;
  description?: string;
  facilities?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  fees?: {
    monthly: number;
    registration: number;
    other?: number;
  };
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  pesantrenId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  recommendation?: boolean;
  helpfulCount?: number;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  // Legacy fields for backward compatibility
  authorName?: string;
  comment?: string;
  date?: string;
  verified?: boolean;
}

export interface SearchFilters {
  location?: string;
  programs?: string[];
  minRating?: number;
  maxFees?: number;
  facilities?: string[];
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  role: 'parent' | 'admin' | 'pesantren_admin';
  profile_picture?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  occupation?: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: string;
  login_count: number;
  // Legacy field for backward compatibility
  avatar?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface SearchFormData {
  query: string;
  location?: string;
  programs?: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  pesantrenId?: number;
}

export interface ConsultationFormData {
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  phone: string;
  preferredLocation?: string;
  preferredPrograms?: string[];
  budget?: number;
  additionalNotes?: string;
}

// Authentication types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone: string;
  terms_accepted: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface RegisterResponse {
  user: User;
  verification_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}