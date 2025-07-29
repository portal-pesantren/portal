'use client';

interface TrustedSectionProps {
  className?: string;
}

export default function TrustedSection({ className = '' }: TrustedSectionProps) {
  const trustedLogos = [
    {
      name: 'LOGO',
      logo: (
        <div className="text-2xl font-bold text-gray-700">
          LOGO
        </div>
      )
    },
    {
      name: 'Logoipsum',
      logo: (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-xl font-semibold text-gray-700">Logoipsum</span>
        </div>
      )
    },
    {
      name: 'IPSUM',
      logo: (
        <div className="text-2xl font-bold text-gray-700">
          IPSUM
        </div>
      )
    },
    {
      name: 'logo ipsum',
      logo: (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-lg text-gray-700">logo</span>
          <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-lg text-gray-700">ipsum</span>
        </div>
      )
    },
    {
      name: 'Logoipsum',
      logo: (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-gray-700">Logoipsum</span>
        </div>
      )
    }
  ];

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-lg text-gray-600 mb-8">Dipercaya oleh:</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
            {trustedLogos.map((company, index) => (
              <div 
                key={index} 
                className="flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                {company.logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}