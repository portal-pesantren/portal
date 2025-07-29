# 🚀 Netlify Deployment - Portal Pesantren

## Quick Deploy

### Method 1: Git Integration (Recommended)
1. Push ke GitHub/GitLab/Bitbucket
2. Connect repository di [Netlify](https://netlify.com)
3. Auto-deploy setiap push!

### Method 2: Manual Deploy
```bash
npm run build
# Upload folder 'out' ke Netlify
```

## ✅ Sudah Dikonfigurasi

- ✅ `netlify.toml` - Build settings
- ✅ `next.config.ts` - Static export
- ✅ `public/_redirects` - SPA routing
- ✅ Build command: `npm run build`
- ✅ Publish directory: `out`

## 🔧 Build Settings

```toml
[build]
  publish = "out"
  command = "npm run build"
  
[build.environment]
  NODE_VERSION = "18"
```

## 🌐 Custom Domain

1. Site Settings → Domain Management
2. Add Custom Domain
3. Update DNS records

## 🐛 Troubleshooting

- **404 errors**: File `_redirects` sudah ada ✅
- **Build fails**: Check Netlify build logs
- **Images broken**: `unoptimized: true` sudah diset ✅

## 📊 Features

- 🌍 Global CDN
- 🔒 Auto HTTPS
- 📱 Mobile optimized
- ⚡ Fast loading
- 🔄 Deploy previews

---

**Ready to deploy!** 🎉