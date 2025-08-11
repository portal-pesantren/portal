'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { SearchFormData } from '@/types';

interface FilterPortalSectionProps {
  className?: string;
}

export default function FilterPortalSection({ className = '' }: FilterPortalSectionProps) {
  const [selectedLocation, setSelectedLocation] = useState('Pilih Lokasi');
  const [selectedCurriculum, setSelectedCurriculum] = useState('Pilih kurikulum pondok');
  const [selectedEducationStatus, setSelectedEducationStatus] = useState('Pilih status pendidikan');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const locations = [
    'Pilih Lokasi',
    'Jakarta',
    'Bandung',
    'Surabaya',
    'Yogyakarta',
    'Semarang',
    'Medan',
    'Makassar'
  ];

  const curriculums = [
    'Pilih kurikulum pondok',
    'Kurikulum Salaf',
    'Kurikulum Modern',
    'Kurikulum Terpadu',
    'Kurikulum Nasional',
    'Kurikulum Internasional'
  ];

  const educationStatuses = [
    'Pilih status pendidikan',
    'Pondok Pesantren SD',
    'Pondok Pesantren SMP',
    'Pondok Pesantren Campuran SMP-SMA',
    'Pondok Pesantren Terpisah',
    'Pondok Pesantren Mahasiswa'
  ];

  const router = useRouter();
  const { setSearchQuery } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
       setSearchQuery(localSearchQuery);
      
      const params = new URLSearchParams();
      params.set('q', localSearchQuery);
      
      if (selectedLocation !== 'Pilih Lokasi') {
        params.set('province', selectedLocation);
      }
      
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleFilterClick = () => {
    const params = new URLSearchParams();
    
    if (localSearchQuery.trim()) {
       params.set('q', localSearchQuery);
    }
    
    if (selectedLocation !== 'Pilih Lokasi') {
      params.set('province', selectedLocation);
    }
    
    if (selectedCurriculum !== 'Pilih kurikulum pondok') {
      params.set('program', selectedCurriculum);
    }
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section id="filter-portal" className={`py-8 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main Filter Row */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-3 max-w-5xl mx-auto mb-6">
          {/* Location Dropdown */}
          <div className="relative w-full lg:w-auto">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full lg:w-40 px-4 py-3 bg-white border border-gray-300 rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full lg:max-w-lg">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative bg-white rounded-full flex items-center border border-gray-300 focus-within:border-blue-500">
                <div className="bg-[#042558] rounded-full p-2.5 ml-2 flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Cari Pondok Pesantren"
                  className="flex-1 px-4 py-3 text-gray-900 bg-transparent border-0 focus:outline-none text-sm placeholder-gray-500"
                />
              </div>
            </form>
          </div>

          {/* Filter Button */}
          <button
            onClick={handleFilterClick}
            className="w-full lg:w-auto px-6 py-3 bg-[#042558] text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Mulai memfilter</span>
          </button>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-3 max-w-4xl mx-auto">
          {/* Curriculum Dropdown */}
          <div className="relative w-full lg:w-auto">
            <select
              value={selectedCurriculum}
              onChange={(e) => setSelectedCurriculum(e.target.value)}
              className="w-full lg:w-56 px-4 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              {curriculums.map((curriculum, index) => (
                <option key={index} value={curriculum}>
                  {curriculum}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Education Status Dropdown */}
          <div className="relative w-full lg:w-auto">
            <select
              value={selectedEducationStatus}
              onChange={(e) => setSelectedEducationStatus(e.target.value)}
              className="w-full lg:w-64 px-4 py-2.5 bg-white border border-gray-300 rounded-full text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
            >
              {educationStatuses.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}