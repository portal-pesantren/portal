'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePesantren } from '@/hooks/usePesantren';
import { useSearch } from '@/hooks/useSearch';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PesantrenCard from '@/components/cards/PesantrenCard';
import SearchForm from '@/components/forms/SearchForm';
import { Button, Card, CardContent } from '@/components/ui';
import { SearchFilters } from '@/types';
import { loadFilterData, type FilterOption } from '@/lib/utils';

// Loading skeleton
const SearchSkeleton = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Filter sidebar component
const FilterSidebar = ({ 
  filters, 
  onFiltersChange 
}: { 
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}) => {
  const [provinces, setProvinces] = useState<FilterOption[]>([]);
  const [programs, setPrograms] = useState<FilterOption[]>([]);

  useEffect(() => {
    let mounted = true;
    loadFilterData().then(data => {
      if (!mounted) return;
      setProvinces(data.locations.provinces);
      setPrograms(data.curriculum);
    }).catch(() => {
      // Fallback handled in util
    });
    return () => { mounted = false; };
  }, []);

  const facilities = [
    'Asrama', 'Masjid', 'Perpustakaan', 'Lab Komputer',
    'Lapangan Olahraga', 'Klinik Kesehatan', 'Kantin', 'WiFi'
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Filter Pencarian</h3>
      
      {/* Province Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Provinsi
        </label>
        <select 
          value={filters.location || ''}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value || undefined })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Provinsi</option>
          {provinces.map(province => (
            <option key={province.value} value={province.label}>{province.label}</option>
          ))}
        </select>
      </div>

      {/* Program Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Program
        </label>
        <select 
          value={filters.programs?.[0] || ''}
          onChange={(e) => onFiltersChange({ ...filters, programs: e.target.value ? [e.target.value] : undefined })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Program</option>
          {programs.map(program => (
            <option key={program.value} value={program.label}>{program.label}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating Minimum
        </label>
        <select 
          value={filters.minRating || ''}
          onChange={(e) => onFiltersChange({ ...filters, minRating: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Rating</option>
          <option value="4">4+ Bintang</option>
          <option value="3">3+ Bintang</option>
          <option value="2">2+ Bintang</option>
        </select>
      </div>

      {/* Fee Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Biaya Maksimal (per bulan)
        </label>
        <select 
          value={filters.maxFees || ''}
          onChange={(e) => onFiltersChange({ ...filters, maxFees: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Biaya</option>
          <option value="500000">≤ Rp 500.000</option>
          <option value="1000000">≤ Rp 1.000.000</option>
          <option value="2000000">≤ Rp 2.000.000</option>
          <option value="5000000">≤ Rp 5.000.000</option>
        </select>
      </div>

      {/* Facilities Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fasilitas
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {facilities.map(facility => (
            <label key={facility} className="flex items-center">
              <input 
                type="checkbox"
                checked={filters.facilities?.includes(facility) || false}
                onChange={(e) => {
                  const currentFacilities = filters.facilities || [];
                  const newFacilities = e.target.checked 
                    ? [...currentFacilities, facility]
                    : currentFacilities.filter(f => f !== facility);
                  onFiltersChange({ ...filters, facilities: newFacilities.length > 0 ? newFacilities : undefined });
                }}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{facility}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button 
        variant="outline" 
        onClick={() => onFiltersChange({})}
        className="w-full"
      >
        Hapus Semua Filter
      </Button>
    </Card>
  );
};

// Pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button 
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Sebelumnya
      </Button>
      
      {getVisiblePages().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? 'primary' : 'outline'}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
          className="min-w-[40px]"
        >
          {page}
        </Button>
      ))}
      
      <Button 
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Selanjutnya →
      </Button>
    </div>
  );
};

function SearchPageContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useSearch();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  // Get search params from URL
  useEffect(() => {
    const query = searchParams.get('q');
    const province = searchParams.get('province');
    const program = searchParams.get('program');
    const page = searchParams.get('page');
    
    if (query) setSearchQuery(query);
    if (page) setCurrentPage(Number(page));
    
    setFilters({
      location: province || undefined,
      programs: program ? [program] : undefined,
    });
  }, [searchParams, setSearchQuery]);

  // Fetch pesantren data
  const { 
    data: pesantrenData, 
    isLoading, 
    error 
  } = usePesantren({
    page: currentPage,
    limit: 12,
    search: searchQuery,
    ...filters
  });

  // Update URL when filters change
  const updateURL = (newFilters: SearchFilters, newPage: number = 1) => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.location) params.set('province', newFilters.location);
    if (newFilters.programs?.[0]) params.set('program', newFilters.programs[0]);
    if (newPage > 1) params.set('page', newPage.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
  };

  const handleSearch = (data: any) => {
    const query = typeof data === 'string' ? data : data.query;
    setSearchQuery(query);
    setCurrentPage(1);
    updateURL(filters, 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Cari Pesantren
          </h1>
          <div className="max-w-2xl">
            <SearchForm 
              variant="default"
              onSearch={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                {showFilters ? 'Sembunyikan' : 'Tampilkan'} Filter
              </Button>
            </div>
            
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <FilterSidebar 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                {searchQuery && (
                  <p className="text-gray-600">
                    Hasil pencarian untuk: <span className="font-semibold">"{searchQuery}"</span>
                  </p>
                )}
                {pesantrenData && (
                  <p className="text-sm text-gray-500">
                    Menampilkan {pesantrenData.data.length} dari {pesantrenData.pagination.total} pesantren
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <SearchSkeleton />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Gagal memuat data</h3>
                  <p className="text-gray-600 mb-4">Terjadi kesalahan saat mencari pesantren. Silakan coba lagi.</p>
                  <Button onClick={() => window.location.reload()}>
                    Coba Lagi
                  </Button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {pesantrenData && pesantrenData.data.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pesantrenData.data.map((pesantren) => (
                    <PesantrenCard 
                      key={pesantren.id}
                      pesantren={pesantren}
                      onViewDetail={(pesantren) => {
                        const pesantrenId = pesantren.code || pesantren.id;
                        const pesantrenIdStr = typeof pesantrenId === 'string' ? pesantrenId : String(pesantrenId);
                        navigate(`/pesantren/${pesantrenIdStr}`);
                      }}
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={currentPage}
                  totalPages={pesantrenData.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            {/* No Results */}
            {pesantrenData && pesantrenData.data.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Tidak ada hasil ditemukan</h3>
                  <p className="text-gray-600 mb-4">
                    Coba ubah kata kunci pencarian atau filter yang digunakan.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                      setCurrentPage(1);
                      navigate('/search');
                    }}
                  >
                    Reset Pencarian
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
