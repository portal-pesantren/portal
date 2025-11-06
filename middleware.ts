import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Daftar halaman yang memerlukan autentikasi
const protectedRoutes = ['/dashboard', '/profile', '/applications', '/consultations'];

// Daftar halaman yang tidak boleh diakses jika sudah login
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ambil token dari cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;
  
  // Jika user sudah login dan mencoba akses halaman auth (login/register)
  if (isAuthenticated && authRoutes.includes(pathname)) {
    // Redirect ke dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Jika user belum login dan mencoba akses halaman protected
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    // Redirect ke login dengan parameter return URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan route mana yang akan diproses middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};