import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_CONFIG } from './constants';

// Local types for filter data
export interface FilterOption { value: string; label: string }
export interface FilterData {
  locations: { provinces: FilterOption[] };
  curriculum: FilterOption[];
  education_status: FilterOption[];
}

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian locale
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Generate slug from string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indonesian phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Indonesian phone number patterns
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Calculate reading time for text
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

/**
 * Test backend connectivity and basic endpoints
 */
export async function testBackendConnection(baseUrl?: string): Promise<{
  ok: boolean;
  usedUrl: string;
  health?: any;
  newsCount?: number;
  error?: string;
}> {
  const url = baseUrl || API_CONFIG.BASE_URL;
  const apiBase = `${url}/api/${API_CONFIG.VERSION}`;
  try {
    const healthRes = await fetch(`${url}${API_CONFIG.ENDPOINTS.HEALTH}`);
    const health = await healthRes.json().catch(() => ({}));

    const newsRes = await fetch(`${apiBase}${API_CONFIG.ENDPOINTS.NEWS.LIST}?is_published=true&limit=3&sort_by=published_at&sort_order=desc`);
    const newsJson = await newsRes.json().catch(() => ({}));
    const newsCount = Array.isArray(newsJson?.data) ? newsJson.data.length : Array.isArray(newsJson) ? newsJson.length : 0;

    return {
      ok: healthRes.ok && newsRes.ok,
      usedUrl: url,
      health,
      newsCount,
    };
  } catch (err: any) {
    return {
      ok: false,
      usedUrl: url,
      error: err?.message || 'Unknown error while testing backend',
    };
  }
}

/**
 * Debug current API configuration in development
 */
export function debugApiConfig(): void {
  if (process.env.NODE_ENV !== 'development') return;
  const apiBase = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;
  console.log('🔧 API Debug Config:', {
    BASE_URL: API_CONFIG.BASE_URL,
    VERSION: API_CONFIG.VERSION,
    TIMEOUT: API_CONFIG.TIMEOUT,
    NEWS_LIST: `${apiBase}${API_CONFIG.ENDPOINTS.NEWS.LIST}`,
    HEALTH: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`,
  });
}

/**
 * Load filter data from public JSON with simple in-memory cache
 */
let __filterDataCache: FilterData | null = null;
export async function loadFilterData(): Promise<FilterData> {
  if (__filterDataCache) return __filterDataCache;

  try {
    const res = await fetch('/data/filters.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Basic structure validation
    const data: FilterData = {
      locations: { provinces: Array.isArray(json?.locations?.provinces) ? json.locations.provinces : [] },
      curriculum: Array.isArray(json?.curriculum) ? json.curriculum : [],
      education_status: Array.isArray(json?.education_status) ? json.education_status : [],
    };
    __filterDataCache = data;
    return data;
  } catch (err) {
    // Fallback to sensible defaults mirroring current UI
    const fallback: FilterData = {
      locations: {
        provinces: [
          { value: 'Jakarta', label: 'DKI Jakarta' },
          { value: 'Jawa Barat', label: 'Jawa Barat' },
          { value: 'Jawa Tengah', label: 'Jawa Tengah' },
          { value: 'Jawa Timur', label: 'Jawa Timur' },
          { value: 'Yogyakarta', label: 'Yogyakarta' },
          { value: 'Sumatera Utara', label: 'Sumatera Utara' },
          { value: 'Sumatera Selatan', label: 'Sumatera Selatan' },
          { value: 'Lampung', label: 'Lampung' },
          { value: 'Kalimantan Timur', label: 'Kalimantan Timur' },
          { value: 'Sulawesi Selatan', label: 'Sulawesi Selatan' }
        ],
      },
      curriculum: [
        { value: 'Salaf', label: 'Kurikulum Salaf' },
        { value: 'Modern', label: 'Kurikulum Modern' },
        { value: 'Terpadu', label: 'Kurikulum Terpadu' },
        { value: 'Nasional', label: 'Kurikulum Nasional' },
        { value: 'Internasional', label: 'Kurikulum Internasional' },
      ],
      education_status: [
        { value: 'SD', label: 'Pondok Pesantren SD' },
        { value: 'SMP', label: 'Pondok Pesantren SMP' },
        { value: 'SMP_SMA', label: 'Pondok Pesantren Campuran SMP-SMA' },
        { value: 'Terpisah', label: 'Pondok Pesantren Terpisah' },
        { value: 'Mahasiswa', label: 'Pondok Pesantren Mahasiswa' },
      ],
    };
    __filterDataCache = fallback;
    return fallback;
  }
}