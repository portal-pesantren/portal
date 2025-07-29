'use client';

import React from 'react';
import { Button, Input } from '@/components/ui';
import { useSearch } from '@/hooks/useSearch';
import { SearchFormData } from '@/types';

interface SearchFormProps {
  onSearch?: (data: SearchFormData) => void;
  className?: string;
  variant?: 'default' | 'compact';
  placeholder?: string;
}

export default function SearchForm({ 
  onSearch, 
  className = '', 
  variant = 'default',
  placeholder = 'Cari pesantren...' 
}: SearchFormProps) {
  const { searchQuery, setSearchQuery, search, isLoading } = useSearch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: SearchFormData = {
      query: searchQuery
    };
    
    if (onSearch) {
      onSearch(formData);
    } else {
      await search();
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          className="flex-1"
        />
        <Button 
          type="submit" 
          isLoading={isLoading}
          size="md"
          className="bg-[#042558] hover:bg-[#031a3d]"
        >
          Cari
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
          className="flex-1"
        />
        <Button 
          type="submit" 
          isLoading={isLoading}
          size="lg"
          className="sm:w-auto w-full bg-[#042558] hover:bg-[#031a3d]"
        >
          {isLoading ? 'Mencari...' : 'Cari Pesantren'}
        </Button>
      </div>
    </form>
  );
}