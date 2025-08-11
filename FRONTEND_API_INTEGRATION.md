# Dokumentasi Integrasi Frontend dengan Backend API

## Overview

Dokumentasi ini menjelaskan bagaimana menggunakan hooks dan services yang telah dibuat untuk berinteraksi dengan backend FastAPI Portal Pesantren.

## Struktur Integrasi

### 1. API Client (`src/lib/api.ts`)
- Konfigurasi axios dengan base URL dari environment variable
- Interceptor untuk menambahkan token authorization
- Interceptor untuk error handling
- Fungsi generik untuk HTTP methods (GET, POST, PUT, PATCH, DELETE)

### 2. Services

#### Authentication Service (`src/services/authService.ts`)
```typescript
import { authService } from '@/services/authService';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const user = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirm_password: 'password123'
});
```

#### Pesantren Service (`src/services/pesantrenService.ts`)
```typescript
import { pesantrenService } from '@/services/pesantrenService';

// Get pesantren list with pagination
const pesantrenList = await pesantrenService.getPesantren({
  page: 1,
  limit: 10,
  query: 'Al-Hikmah'
});

// Get pesantren detail
const pesantren = await pesantrenService.getPesantrenById('123');
```

#### Review Service (`src/services/reviewService.ts`)
```typescript
import { reviewService } from '@/services/reviewService';

// Create review
const review = await reviewService.createReview({
  pesantren_id: '123',
  rating: 5,
  title: 'Excellent pesantren',
  content: 'Great facilities and teachers'
});
```

### 3. React Query Hooks

#### Pesantren Hooks (`src/hooks/usePesantren.ts`)
```typescript
import { usePesantren, usePesantrenDetail, useFeaturedPesantren } from '@/hooks/usePesantren';

function PesantrenList() {
  const { data, isLoading, error } = usePesantren({
    page: 1,
    limit: 10
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(pesantren => (
        <div key={pesantren.id}>{pesantren.name}</div>
      ))}
    </div>
  );
}
```

#### Review Hooks (`src/hooks/useReviews.ts`)
```typescript
import { useReviewsByPesantren, useCreateReview } from '@/hooks/useReviews';

function ReviewSection({ pesantrenId }: { pesantrenId: string }) {
  const { data: reviews, isLoading } = useReviewsByPesantren(pesantrenId);
  const createReviewMutation = useCreateReview();

  const handleCreateReview = (reviewData: any) => {
    createReviewMutation.mutate(reviewData, {
      onSuccess: () => {
        console.log('Review created successfully');
      },
      onError: (error) => {
        console.error('Failed to create review:', error);
      }
    });
  };

  return (
    <div>
      {/* Review list and form */}
    </div>
  );
}
```

#### Authentication Hooks (`src/hooks/useAuth.ts`)
```typescript
import { useAuth, useLogin, useLogout } from '@/hooks/useAuth';

function LoginForm() {
  const { user, isAuthenticated } = useAuth();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials, {
      onSuccess: () => {
        console.log('Login successful');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      }
    });
  };

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.name}!</p>
        <button onClick={() => logoutMutation.mutate()}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Login form fields */}
    </form>
  );
}
```

### 4. Context Providers

#### Auth Context (`src/contexts/AuthContext.tsx`)
```typescript
import { useAuth, useRole, withAuth } from '@/contexts/AuthContext';

// Basic usage
function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// Role-based access
function AdminPanel() {
  const { isAdmin, hasRole } = useRole();
  
  if (!isAdmin()) {
    return <div>Access denied</div>;
  }
  
  return <div>Admin Panel Content</div>;
}

// Protected component
const ProtectedComponent = withAuth(function MyComponent() {
  return <div>This is protected content</div>;
});
```

#### Query Provider (`src/providers/QueryProvider.tsx`)
```typescript
// Already integrated in layout.tsx
// Provides React Query functionality and devtools
```

## Environment Variables

Pastikan file `.env.local` sudah dikonfigurasi:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_NAME=Portal Pesantren
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_CONSULTATION=true
NEXT_PUBLIC_ENABLE_APPLICATION=true
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=info
```

## Error Handling

### API Errors
```typescript
// Automatic error handling in api.ts interceptors
// Manual error handling in components
const { data, error, isError } = usePesantren();

if (isError) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### Authentication Errors
```typescript
// Automatic token refresh and logout on 401/403
// Manual handling in components
const loginMutation = useLogin();

loginMutation.mutate(credentials, {
  onError: (error: any) => {
    if (error.response?.status === 401) {
      setError('Invalid credentials');
    } else if (error.response?.status === 422) {
      setError('Validation error');
    } else {
      setError('Login failed. Please try again.');
    }
  }
});
```

## Caching Strategy

### Query Keys
```typescript
import { queryKeys } from '@/providers/QueryProvider';

// Consistent query keys for better cache management
const pesantrenQuery = useQuery({
  queryKey: queryKeys.pesantren.detail(id),
  queryFn: () => pesantrenService.getPesantrenById(id)
});
```

### Cache Invalidation
```typescript
import { useInvalidatePesantren } from '@/hooks/usePesantren';

function UpdatePesantrenForm({ pesantrenId }: { pesantrenId: string }) {
  const { invalidateDetail } = useInvalidatePesantren();
  
  const handleUpdate = async (data: any) => {
    await updatePesantren(data);
    // Invalidate cache to refetch fresh data
    invalidateDetail(pesantrenId);
  };
}
```

## Best Practices

### 1. Loading States
```typescript
function PesantrenList() {
  const { data, isLoading, isFetching, error } = usePesantren();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {isFetching && <div>Updating...</div>}
      {/* Content */}
    </div>
  );
}
```

### 2. Optimistic Updates
```typescript
const updateReviewMutation = useUpdateReview();

const handleUpdate = (reviewData: any) => {
  updateReviewMutation.mutate(
    { id: reviewId, data: reviewData },
    {
      onMutate: async (newData) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: queryKeys.reviews.detail(reviewId) });
        
        // Snapshot previous value
        const previousReview = queryClient.getQueryData(queryKeys.reviews.detail(reviewId));
        
        // Optimistically update
        queryClient.setQueryData(queryKeys.reviews.detail(reviewId), newData.data);
        
        return { previousReview };
      },
      onError: (err, newData, context) => {
        // Rollback on error
        queryClient.setQueryData(
          queryKeys.reviews.detail(reviewId),
          context?.previousReview
        );
      },
      onSettled: () => {
        // Refetch after mutation
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.detail(reviewId) });
      },
    }
  );
};
```

### 3. Prefetching
```typescript
import { usePrefetchPesantren } from '@/hooks/usePesantren';

function PesantrenCard({ pesantren }: { pesantren: Pesantren }) {
  const { prefetchPesantren } = usePrefetchPesantren();
  
  return (
    <div
      onMouseEnter={() => prefetchPesantren(pesantren.id.toString())}
    >
      {/* Card content */}
    </div>
  );
}
```

## Testing

### API Testing
```bash
# Test backend connection
curl http://localhost:8000/health

# Test API endpoints
curl http://localhost:8000/api/v1/pesantren?limit=3
```

### Frontend Testing
```typescript
// Test hooks with React Query Testing Library
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePesantren } from '@/hooks/usePesantren';

test('should fetch pesantren data', async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  
  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  const { result } = renderHook(() => usePesantren(), { wrapper });
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Pastikan backend mengizinkan origin frontend
   - Check CORS configuration di FastAPI

2. **Authentication Issues**
   - Periksa token di localStorage
   - Pastikan token belum expired
   - Check API endpoint authentication

3. **Network Errors**
   - Pastikan backend berjalan di port 8000
   - Check environment variables
   - Verify API URL configuration

4. **Cache Issues**
   - Clear React Query cache: `queryClient.clear()`
   - Invalidate specific queries
   - Check staleTime and gcTime settings

### Debug Tools

1. **React Query Devtools**
   - Tersedia di development mode
   - Monitor query states dan cache

2. **Network Tab**
   - Monitor API requests di browser devtools
   - Check request/response headers dan body

3. **Console Logs**
   - Error logs dari interceptors
   - Debug logs dari hooks

## Next Steps

1. **Implementasi UI Components**
   - Update komponen existing untuk menggunakan hooks baru
   - Tambahkan loading states dan error handling

2. **Form Integration**
   - Integrate forms dengan mutation hooks
   - Add form validation

3. **Real-time Features**
   - Implement WebSocket untuk real-time updates
   - Add notification system

4. **Performance Optimization**
   - Implement virtual scrolling untuk large lists
   - Add image lazy loading
   - Optimize bundle size

5. **Testing**
   - Add unit tests untuk hooks
   - Add integration tests
   - Add E2E tests dengan Playwright