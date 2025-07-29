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
  authorName: string;
  rating: number;
  comment: string;
  date: string;
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
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'parent' | 'admin' | 'pesantren_admin';
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