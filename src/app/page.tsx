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
