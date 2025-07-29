interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  className?: string;
}

const features: Feature[] = [
  {
    icon: "🔍",
    title: "Pencarian Mudah",
    description: "Temukan pesantren dengan filter lokasi, program, dan fasilitas yang sesuai kebutuhan."
  },
  {
    icon: "⭐",
    title: "Review Terpercaya",
    description: "Baca review dan rating dari orang tua dan alumni untuk membantu keputusan Anda."
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Akses platform kami kapan saja dan dimana saja melalui smartphone atau tablet."
  },
  {
    icon: "🎓",
    title: "Program Lengkap",
    description: "Informasi detail tentang kurikulum, program tahfidz, dan kegiatan ekstrakurikuler."
  },
  {
    icon: "🏠",
    title: "Fasilitas Terbaik",
    description: "Lihat foto dan informasi lengkap tentang asrama, masjid, dan fasilitas pendukung."
  },
  {
    icon: "💬",
    title: "Konsultasi Gratis",
    description: "Dapatkan konsultasi gratis dari tim ahli kami untuk memilih pesantren yang tepat."
  }
];

export default function FeaturesSection({ className = '' }: FeaturesSectionProps) {
  return (
    <section id="tentang" className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#042558] mb-4">
            Mengapa Memilih Portal Pesantren?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kami menyediakan platform terpercaya untuk membantu Anda menemukan pesantren yang tepat dengan berbagai keunggulan.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200"
            >
              <div className="w-12 h-12 bg-[#042558] rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl text-white">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-[#042558] mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}