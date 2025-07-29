'use client';

interface CTASectionProps {
  className?: string;
}

export default function CTASection({ className = '' }: CTASectionProps) {
  const handleSearchClick = () => {
    // Scroll to FilterPortalSection or navigate to search page
    const filterSection = document.getElementById('filter-portal');
    if (filterSection) {
      filterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-20 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#042558] mb-8">
            Siap temukan Pondok Pesantren Ideal?
          </h2>
          
          <button
            onClick={handleSearchClick}
            className="inline-flex items-center px-8 py-4 bg-[#042558] text-white font-semibold rounded-full hover:bg-[#031a3d] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Cari Pondok Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}