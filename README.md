# Portal Pesantren Frontend

Aplikasi frontend untuk Portal Pesantren yang dibangun dengan Next.js 15, React 19, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

- **Pencarian Pesantren**: Cari pesantren berdasarkan lokasi, program, fasilitas, dan kriteria lainnya
- **Detail Pesantren**: Informasi lengkap tentang pesantren termasuk program, fasilitas, dan biaya
- **Sistem Review**: Baca dan tulis review dari alumni dan santri
- **Autentikasi**: Sistem login/register untuk pengguna
- **Konsultasi**: Fitur konsultasi dengan admin pesantren
- **Aplikasi**: Sistem pendaftaran online ke pesantren
- **Responsive Design**: Optimized untuk desktop dan mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 15 dengan App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Development**: ESLint, Turbopack

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Backend API Portal Pesantren (FastAPI)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` sesuai dengan konfigurasi backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_APP_NAME=Portal Pesantren
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Pastikan Backend Berjalan

Pastikan backend FastAPI berjalan di `http://localhost:8000`.

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── providers/            # Context providers
├── services/             # API services
├── types/                # TypeScript definitions
└── data/                 # Static data dan mocks
```

## 🔌 API Integration

Proyek ini sudah terintegrasi dengan backend FastAPI. Lihat dokumentasi lengkap di:

- [Frontend API Integration Guide](./FRONTEND_API_INTEGRATION.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)

### Contoh Penggunaan Hooks

```typescript
import { usePesantren } from '@/hooks/usePesantren';
import { useAuth } from '@/hooks/useAuth';

function PesantrenPage() {
  const { data, isLoading, error } = usePesantren({ page: 1, limit: 10 });
  const { user, isAuthenticated } = useAuth();
  
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

## 🛠️ Available Scripts

```bash
# Development dengan Turbopack
npm run dev

# Build untuk production
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Export static files
npm run export
```

## 🧪 Testing

### Test Backend Connection

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/pesantren?limit=3
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables
4. Deploy

### Environment Variables untuk Production

```env
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
NEXT_PUBLIC_DEBUG=false
```

## 🐛 Troubleshooting

### Common Issues

**API Connection Error**
- Pastikan backend berjalan di port 8000
- Check CORS configuration di backend
- Verify API URL di environment variables

**Authentication Issues**
- Check token di localStorage
- Pastikan token belum expired

**Build Errors**
- Run `npm install` untuk install dependencies
- Clear Next.js cache: `rm -rf .next`

### Debug Mode

```env
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

## 📚 Dokumentasi

- [Frontend API Integration](./FRONTEND_API_INTEGRATION.md)
- [Backend Integration](./BACKEND_INTEGRATION_GUIDE.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

**Happy Coding! 🚀**
