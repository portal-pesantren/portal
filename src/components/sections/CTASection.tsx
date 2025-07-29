interface CTASectionProps {
  className?: string;
}

export default function CTASection({ className = '' }: CTASectionProps) {
  return (
    <section className={`py-20 bg-[#042558] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap temukan Pondok Pesantren Ideal?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Bergabunglah dengan ribuan keluarga yang telah mempercayakan pendidikan anak mereka melalui platform kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#042558] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Mulai Pencarian
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#042558] transition-colors">
              Konsultasi Gratis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}