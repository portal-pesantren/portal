# Deployment Guide - Portal Pesantren

## Netlify Deployment

Proyek ini sudah dikonfigurasi untuk deployment di Netlify dengan pengaturan berikut:

### File Konfigurasi

1. **netlify.toml** - Konfigurasi utama Netlify
2. **next.config.ts** - Konfigurasi Next.js untuk static export
3. **public/_redirects** - Pengaturan routing untuk SPA

### Langkah Deployment

#### Opsi 1: Deploy via Git (Recommended)

1. Push kode ke repository Git (GitHub, GitLab, atau Bitbucket)
2. Login ke [Netlify](https://netlify.com)
3. Klik "New site from Git"
4. Pilih repository Anda
5. Netlify akan otomatis mendeteksi pengaturan build dari `netlify.toml`
6. Klik "Deploy site"

#### Opsi 2: Deploy Manual

1. Build project secara lokal:
   ```bash
   npm run build
   ```

2. Upload folder `out` ke Netlify:
   - Drag & drop folder `out` ke Netlify dashboard
   - Atau gunakan Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=out
     ```

### Pengaturan Build

- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Node Version**: 18

### Environment Variables

Jika menggunakan environment variables, tambahkan di Netlify dashboard:
- Site settings → Environment variables
- Tambahkan variabel yang diperlukan

### Custom Domain

Untuk menggunakan domain custom:
1. Buka Site settings → Domain management
2. Klik "Add custom domain"
3. Ikuti instruksi untuk konfigurasi DNS

### Troubleshooting

- **404 Error**: Pastikan file `_redirects` ada di folder `public`
- **Build Error**: Periksa log build di Netlify dashboard
- **Image Issues**: Pastikan `images.unoptimized: true` di `next.config.ts`

### Performance Optimization

- Netlify otomatis mengoptimalkan asset
- CDN global untuk loading cepat
- Automatic HTTPS
- Form handling (jika diperlukan)

### Monitoring

- Analytics tersedia di Netlify dashboard
- Real-time logs untuk debugging
- Deploy previews untuk setiap commit