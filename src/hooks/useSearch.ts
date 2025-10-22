'use client';

import { useState, useCallback } from 'react';
import { SearchFilters, Pesantren } from '@/types';
import { debounce } from '@/lib/utils';
import { pesantrenService } from '@/services/pesantrenService';

interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  results: Pesantren[];
  isLoading: boolean;
  error: string | null;
  search: (query?: string) => Promise<void>;
  clearSearch: () => void;
}

// Mock data for demonstration
const mockPesantrenData: Pesantren[] = [
  {
    id: "1",
    name: "Pondok Pesantren Al-Hikmah",
    location: "Bogor, Jawa Barat",
    address: "Jl. Raya Bogor No. 123, Bogor, Jawa Barat",
    rating: 4.8,
    students: 1200,
    programs: ["Tahfidz Al-Quran", "Kitab Kuning", "Bahasa Arab"],
    image: "/pesantren-1.svg",
    featured: true,
    description: "Pesantren modern dengan fokus pada tahfidz dan pendidikan karakter.",
    facilities: ["Asrama Putra", "Asrama Putri", "Masjid", "Perpustakaan", "Laboratorium"],
    contact: {
      phone: "+62 251 123456",
      email: "info@alhikmah.ac.id",
      website: "https://alhikmah.ac.id"
    },
    fees: {
      monthly: 1500000,
      registration: 5000000,
      other: 2000000
    }
  },
  {
    id: "2",
    name: "Pondok Pesantren Darul Ulum",
    location: "Yogyakarta, DIY",
    address: "Jl. Malioboro No. 456, Yogyakarta, DIY",
    rating: 4.7,
    students: 800,
    programs: ["Tahfidz Al-Quran", "Sains & Teknologi", "Bahasa Inggris"],
    image: "/pesantren-2.svg",
    featured: true,
    description: "Pesantren yang menggabungkan tradisi dan modernitas.",
    facilities: ["Asrama Putra", "Asrama Putri", "Masjid", "Laboratorium", "Wifi"],
    contact: {
      phone: "+62 274 123456",
      email: "info@darululum.ac.id"
    },
    fees: {
      monthly: 1200000,
      registration: 4000000
    }
  },
  {
    id: "3",
    name: "Pondok Pesantren Nurul Huda",
    location: "Malang, Jawa Timur",
    address: "Jl. Veteran No. 789, Malang, Jawa Timur",
    rating: 4.9,
    students: 1500,
    programs: ["Tahfidz Al-Quran", "Leadership", "Entrepreneurship"],
    image: "/pesantren-3.svg",
    featured: true,
    description: "Pesantren unggulan dengan program kepemimpinan.",
    facilities: ["Asrama Putra", "Asrama Putri", "Masjid", "Perpustakaan", "Lapangan Olahraga"],
    contact: {
      phone: "+62 341 123456",
      email: "info@nurulhuda.ac.id"
    },
    fees: {
      monthly: 1800000,
      registration: 6000000
    }
  }
];

export function useSearch(): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<Pesantren[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API search function
  const performSearch = useCallback(async (query: string, searchFilters: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare search parameters
      const searchParams = {
        search: query.trim() || undefined,
        province: searchFilters.location || undefined,
        programs: searchFilters.programs?.join(',') || undefined,
        min_rating: searchFilters.minRating || undefined,
        max_monthly_fee: searchFilters.maxFees || undefined,
        facilities: searchFilters.facilities?.join(',') || undefined,
        page: 1,
        limit: 20
      };

      // Call API service
       const response = await pesantrenService.getPesantren(searchParams);
       setResults(response.data);
    } catch (err: any) {
      // Fallback to mock data if API fails
      console.warn('API search failed, using mock data:', err.message);
      
      let filteredResults = mockPesantrenData;

      // Filter by search query
      if (query.trim()) {
        filteredResults = filteredResults.filter(pesantren =>
          pesantren.name.toLowerCase().includes(query.toLowerCase()) ||
          pesantren.location.toLowerCase().includes(query.toLowerCase()) ||
          pesantren.programs.some(program => 
            program.toLowerCase().includes(query.toLowerCase())
          )
        );
      }

      // Filter by location
      if (searchFilters.location) {
        filteredResults = filteredResults.filter(pesantren =>
          pesantren.location.toLowerCase().includes(searchFilters.location!.toLowerCase())
        );
      }

      // Filter by programs
      if (searchFilters.programs && searchFilters.programs.length > 0) {
        filteredResults = filteredResults.filter(pesantren =>
          searchFilters.programs!.some(program =>
            pesantren.programs.some(p => 
              p.toLowerCase().includes(program.toLowerCase())
            )
          )
        );
      }

      // Filter by minimum rating
      if (searchFilters.minRating) {
        filteredResults = filteredResults.filter(pesantren =>
          pesantren.rating >= searchFilters.minRating!
        );
      }

      // Filter by maximum fees
      if (searchFilters.maxFees) {
        filteredResults = filteredResults.filter(pesantren =>
          pesantren.fees && pesantren.fees.monthly <= searchFilters.maxFees!
        );
      }

      // Filter by facilities
      if (searchFilters.facilities && searchFilters.facilities.length > 0) {
        filteredResults = filteredResults.filter(pesantren =>
          pesantren.facilities && searchFilters.facilities!.some(facility =>
            pesantren.facilities!.some(f => 
              f.toLowerCase().includes(facility.toLowerCase())
            )
          )
        );
      }

      setResults(filteredResults);
      setError('Menggunakan data offline. Periksa koneksi internet Anda.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string, searchFilters: SearchFilters) => {
      performSearch(query, searchFilters);
    }, 300),
    [performSearch]
  );

  const search = useCallback(async (query?: string) => {
    const searchTerm = query !== undefined ? query : searchQuery;
    await performSearch(searchTerm, filters);
  }, [searchQuery, filters, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setResults([]);
    setError(null);
  }, []);

  // Auto-search when query or filters change
  const handleQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() || Object.keys(filters).length > 0) {
      debouncedSearch(query, filters);
    } else {
      setResults([]);
    }
  }, [filters, debouncedSearch]);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    if (searchQuery.trim() || Object.keys(newFilters).length > 0) {
      debouncedSearch(searchQuery, newFilters);
    } else {
      setResults([]);
    }
  }, [searchQuery, debouncedSearch]);

  return {
    searchQuery,
    setSearchQuery: handleQueryChange,
    filters,
    setFilters: handleFiltersChange,
    results,
    isLoading,
    error,
    search,
    clearSearch
  };
}