'use client';

import { useEffect } from 'react';
import { useAuthStatus } from '@/hooks/useAuth';
import {
  Header,
  Footer,
  HeroSection,
  VideoSection,
  TrustedSection,
  FilterPortalSection,
  PortalSection,
  NewsSection,
  CTASection
} from '@/components';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </main>
    );
  }

  // If not authenticated, show the regular landing page
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen">
        <Header />
        <HeroSection />
        <VideoSection />
        <TrustedSection />
        <FilterPortalSection />
        <PortalSection />
        <NewsSection />
        <CTASection />
        <Footer />
      </main>
    );
  }

  // Return null while redirecting
  return null;
}
