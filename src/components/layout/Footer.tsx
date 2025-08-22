interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer id="kontak" className={`bg-[#042558] text-white py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-1 mb-4">
              <img 
                src="/logo-putih.png" 
                alt="Portal Pesantren Logo" 
                className="w-32 h-32 object-contain"
              />
            </div>
            <p className="text-gray-200 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus
            </p>
            <div className="space-y-3">
              <a href="#beranda" className="block text-gray-200 hover:text-white transition-colors">
                Beranda
              </a>
              <a href="#berita" className="block text-gray-200 hover:text-white transition-colors">
                Berita
              </a>
              <a href="#tentang" className="block text-gray-200 hover:text-white transition-colors">
                Tentang Kami
              </a>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <div className="space-y-3 text-gray-200">
              <p className="text-lg font-semibold text-white">+6289524134267</p>
              <p>portal.pesantren@gmail.com</p>
              <p className="leading-relaxed">
                Jl. Kaliurang Km 5,<br/>
                Caturtunggal, Sleman, Yogyakarta, 55281<br/>
                Indonesia
              </p>
            </div>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-200 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-200 hover:text-white transition-colors" aria-label="Google">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Kirim Pesan pada Kami</h3>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Alamat Email Anda" 
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
              />
              <textarea 
                placeholder="Ketik Pesan" 
                rows={2}
                className="w-full px-0 py-2 bg-transparent border-0 border-b border-gray-400 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
              ></textarea>
              <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-[#042558] transition-colors flex items-center gap-2 mt-4">
                Kirim
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-600 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Portal Pesantren. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}