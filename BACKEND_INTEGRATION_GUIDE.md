# Panduan Integrasi Backend FastAPI Portal Pesantren

## Overview

Backend Portal Pesantren menggunakan **FastAPI** dan berjalan di `http://localhost:8000`. Backend ini menyediakan API lengkap untuk manajemen pesantren, user authentication, reviews, dan fitur lainnya.

## Status Backend

✅ **Backend sudah berjalan** di `http://localhost:8000`
✅ **Database MongoDB** sudah terkonfigurasi
✅ **API Endpoints** sudah tersedia dan berfungsi

## Struktur Backend

### Teknologi Stack
- **Framework**: FastAPI
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: Pydantic
- **Documentation**: Swagger UI (otomatis)

### Struktur Direktori
```
portal-backend/
├── core/                    # Konfigurasi inti
│   ├── __init__.py         # App factory
│   ├── db.py              # Database config
│   ├── auth_middleware.py  # Auth middleware
│   └── exceptions.py       # Custom exceptions
├── models/                 # Database models
│   ├── pesantren.py
│   ├── user.py
│   ├── review.py
│   └── ...
├── dto/                    # Data Transfer Objects
│   ├── pesantren_dto.py
│   ├── user_dto.py
│   └── ...
├── services/               # Business logic
│   ├── pesantren_service.py
│   ├── user_service.py
│   └── ...
├── routers/                # API routes
│   ├── pesantren_router.py
│   ├── user_fastapi_router.py
│   └── ...
└── manage.py              # Entry point
```

## API Endpoints yang Tersedia

### 1. Health & Info
- `GET /health` - Health check
- `GET /` - API info

### 2. Pesantren Endpoints
- `GET /api/v1/pesantren` - List pesantren dengan pagination
- `GET /api/v1/pesantren/featured` - Pesantren unggulan
- `GET /api/v1/pesantren/popular` - Pesantren populer
- `GET /api/v1/pesantren/{id}` - Detail pesantren
- `POST /api/v1/pesantren` - Buat pesantren baru
- `PUT /api/v1/pesantren/{id}` - Update pesantren
- `DELETE /api/v1/pesantren/{id}` - Hapus pesantren

### 3. User & Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile

### 4. Reviews
- `GET /api/v1/reviews` - List reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/pesantren/{id}` - Reviews by pesantren

### 5. Applications & Consultations
- `POST /api/v1/applications` - Submit application
- `GET /api/v1/applications` - List applications
- `POST /api/v1/consultations` - Request consultation

## Contoh Response API

### GET /api/v1/pesantren
```json
{
  "data": [
    {
      "id": "68907773bcbcfe90c333d800",
      "name": "Pesantren Al-Hikmah Modern",
      "slug": "pesantren-darul-ulum-modern",
      "location": {
        "city": "Bogor",
        "province": "Jawa Barat"
      },
      "monthly_fee": 1800000.0,
      "rating": 0.0,
      "total_reviews": 0,
      "is_featured": false,
      "images": [],
      "programs": ["Tahfidz", "Kitab Kuning", "Sains", "Bahasa"],
      "education_levels": ["SMP/MTs", "SMA/MA"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 3,
    "total": 10,
    "total_pages": 4,
    "has_next": true,
    "has_prev": false
  }
}
```

## Langkah Integrasi Frontend

### 1. Setup Environment Variables

Buat file `.env.local` di root frontend:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
```

### 2. Install Dependencies

```bash
npm install axios react-query @tanstack/react-query zustand
```

### 3. Setup API Client

Buat file `src/lib/api.ts`:
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4. Update Types

Update `src/types/index.ts` untuk match dengan API response:
```typescript
export interface Pesantren {
  id: string;
  name: string;
  slug: string;
  location: {
    city: string;
    province: string;
  };
  monthly_fee: number;
  rating: number;
  total_reviews: number;
  is_featured: boolean;
  images: string[];
  programs: string[];
  education_levels: string[];
  description?: string;
  facilities?: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
```

### 5. Create API Services

Buat file `src/services/pesantrenService.ts`:
```typescript
import { apiClient } from '@/lib/api';
import { Pesantren, PaginatedResponse } from '@/types';

export const pesantrenService = {
  // Get all pesantren with pagination
  getPesantren: async (params?: {
    page?: number;
    limit?: number;
    query?: string;
    province?: string;
    city?: string;
  }): Promise<PaginatedResponse<Pesantren>> => {
    const response = await apiClient.get('/pesantren', { params });
    return response.data;
  },

  // Get featured pesantren
  getFeaturedPesantren: async (limit = 5): Promise<Pesantren[]> => {
    const response = await apiClient.get(`/pesantren/featured?limit=${limit}`);
    return response.data.data;
  },

  // Get pesantren by ID
  getPesantrenById: async (id: string): Promise<Pesantren> => {
    const response = await apiClient.get(`/pesantren/${id}`);
    return response.data.data;
  },

  // Search pesantren
  searchPesantren: async (query: string, filters?: any): Promise<PaginatedResponse<Pesantren>> => {
    const response = await apiClient.get('/pesantren', {
      params: { query, ...filters }
    });
    return response.data;
  }
};
```

### 6. Update useSearch Hook

Update `src/hooks/useSearch.ts` untuk menggunakan API:
```typescript
import { useState, useEffect } from 'react';
import { pesantrenService } from '@/services/pesantrenService';
import { Pesantren, SearchFilters } from '@/types';
import { debounce } from '@/lib/utils';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<Pesantren[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    total_pages: 0
  });

  const searchPesantren = debounce(async (searchQuery: string, searchFilters: SearchFilters, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await pesantrenService.searchPesantren(searchQuery, {
        ...searchFilters,
        page,
        limit: pagination.limit
      });
      
      setResults(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Terjadi kesalahan saat mencari pesantren');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    searchPesantren(query, filters);
  }, [query, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    loading,
    error,
    pagination,
    searchPesantren
  };
};
```

### 7. Setup React Query (Opsional)

Buat file `src/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## Testing API Integration

### 1. Test Basic Connection
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test pesantren list
curl "http://localhost:8000/api/v1/pesantren?limit=3"
```

### 2. Test dengan Frontend
```typescript
// Di component React
import { useEffect, useState } from 'react';
import { pesantrenService } from '@/services/pesantrenService';

const TestComponent = () => {
  const [pesantren, setPesantren] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await pesantrenService.getPesantren({ limit: 5 });
        setPesantren(response.data);
      } catch (error) {
        console.error('Error fetching pesantren:', error);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <div>
      {pesantren.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
};
```

## Dokumentasi API

Backend FastAPI menyediakan dokumentasi otomatis:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Next Steps

1. ✅ **Backend sudah siap** - FastAPI berjalan di localhost:8000
2. 🔄 **Implementasi API client** di frontend
3. 🔄 **Update komponen** untuk menggunakan data real
4. 🔄 **Implementasi authentication** 
5. 🔄 **Error handling** dan loading states
6. 🔄 **Optimasi performance** dengan caching

## Troubleshooting

### Backend tidak berjalan
```bash
cd portal-backend
uvicorn manage:app --host 0.0.0.0 --port 8000 --reload
```

### CORS Issues
Backend sudah dikonfigurasi untuk allow all origins dalam development.

### Database Connection
Pastikan MongoDB berjalan di localhost:27017 atau sesuai konfigurasi di `.env`.

---

**Status**: Backend FastAPI sudah siap dan berjalan! 🚀
**Next**: Implementasi integrasi di frontend React/Next.js