'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStatus, useLogout } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Bell, Edit3, Bookmark, Heart, MessageCircle } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('explore');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // Mock notification count
  const { user, isAuthenticated, isLoading } = useAuthStatus();
  const logoutMutation = useLogout();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsNotificationMenuOpen(false); // Close notification menu when opening profile
  };

  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    setIsProfileMenuOpen(false); // Close profile menu when opening notification
  };

  // Set active menu based on current pathname
  useEffect(() => {
    if (pathname === '/') {
      setActiveMenu('explore');
    } else if (pathname === '/news') {
      setActiveMenu('berita');
    } else if (pathname === '/about') {
      setActiveMenu('tentang-kami');
    }
  }, [pathname]);

  // Close profile and notification menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setIsNotificationMenuOpen(false);
      }
    };

    if (isProfileMenuOpen || isNotificationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen, isNotificationMenuOpen]);

  return (
    <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo-biru.png" 
              alt="Portal Pesantren Logo" 
              className="w-32 h-32 object-contain"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              onClick={() => handleMenuClick('explore')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'explore' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/news" 
              onClick={() => handleMenuClick('berita')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'berita' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Berita
            </Link>
            <Link 
              to="/about" 
              onClick={() => handleMenuClick('tentang-kami')}
              className={`hover:text-[#031a3d] transition-colors font-medium pb-1 ${
                activeMenu === 'tentang-kami' 
                  ? 'text-[#042558] border-b-2 border-[#042558]' 
                  : 'text-gray-600 hover:text-[#042558]'
              }`}
            >
              Tentang kami
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="animate-pulse flex space-x-3">
                <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* Notification Button */}
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    onClick={toggleNotificationMenu}
                    className="relative flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {isNotificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="flex flex-col items-center justify-center py-12 px-6">
                        {/* Illustration */}
                        <div className="mb-6">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Person sitting illustration */}
                            <circle cx="60" cy="45" r="8" fill="#6B7280" />
                            <path d="M45 55 Q60 50 75 55 L75 75 Q60 80 45 75 Z" fill="#374151" />
                            <rect x="50" y="75" width="20" height="25" rx="2" fill="#6B7280" />
                            <rect x="45" y="95" width="10" height="8" rx="2" fill="#374151" />
                            <rect x="65" y="95" width="10" height="8" rx="2" fill="#374151" />
                            {/* Decorative elements */}
                            <path d="M25 85 Q30 80 35 85 Q40 90 35 95 Q30 100 25 95 Q20 90 25 85" fill="#60A5FA" opacity="0.6" />
                            <path d="M85 70 Q90 65 95 70 Q100 75 95 80 Q90 85 85 80 Q80 75 85 70" fill="#60A5FA" opacity="0.6" />
                            <circle cx="30" cy="65" r="3" fill="#60A5FA" opacity="0.4" />
                            <circle cx="90" cy="90" r="4" fill="#60A5FA" opacity="0.4" />
                          </svg>
                        </div>
                        
                        {/* Text */}
                        <h3 className="text-lg font-medium text-gray-500 mb-2">Tidak ada notifikasi</h3>
                        <p className="text-sm text-gray-400 text-center">Semua notifikasi akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Button */}
                <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 bg-[#042558] hover:bg-[#031a3d] text-white px-4 py-2 rounded-full transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.name || user?.email || 'Profile'}</span>
                  <svg className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-4 z-50">
                    {/* Profile Header */}
                    <div className="px-4 pb-4">
                      {/* Profile Photo */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-sm">Create Name</span>
                            <Edit3 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                          </div>
                        </div>
                      </div>
                      {/* Email */}
                      <div className="text-sm font-medium text-gray-800">
                        {user?.email || 'Munawaroh470@gmail.com'}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="border-t border-gray-200 pt-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Tentang Akun</span>
                      </Link>
                      <Link
                        to="/switch-account"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Ganti Akun</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                    
                    {/* Separator */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <Link
                        to="/bookmarks"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Bookmark className="w-5 h-5" />
                        <span>Disimpan</span>
                      </Link>
                      <Link
                        to="/liked"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Disukai</span>
                      </Link>
                      <Link
                        to="/comments"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Komentar Anda</span>
                      </Link>
                    </div>
                    
                    {/* Separator */}
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Setting</span>
                      </Link>
                    </div>
                  </div>
                )}
                </div>
              </>
            ) : (
              <>
                <Link to="/register" className="bg-[#042558] hover:bg-[#031a3d] text-white px-6 py-2 rounded-full transition-colors font-medium inline-block">
                  Daftar
                </Link>
                <Link to="/login" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-full transition-colors font-medium inline-block">
                  Masuk
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-[#042558] p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => handleMenuClick('explore')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'explore' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Explore
              </Link>
              <Link 
                to="/news" 
                onClick={() => handleMenuClick('berita')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'berita' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Berita
              </Link>
              <Link 
                to="/about" 
                onClick={() => handleMenuClick('tentang-kami')}
                className={`transition-colors px-2 py-1 font-medium ${
                  activeMenu === 'tentang-kami' 
                    ? 'text-[#042558] border-l-2 border-[#042558]' 
                    : 'text-gray-600 hover:text-[#042558]'
                }`}
              >
                Tentang kami
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                {isLoading ? (
                  <div className="animate-pulse flex flex-col space-y-2">
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </div>
                ) : isAuthenticated ? (
                  <>
                    <button
                      onClick={toggleNotificationMenu}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium text-center flex items-center justify-center space-x-2 relative"
                    >
                      <Bell className="w-4 h-4" />
                      <span>Notifikasi</span>
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </button>
                    <Link to="/dashboard" className="bg-[#042558] hover:bg-[#031a3d] text-white px-4 py-2 rounded-full transition-colors font-medium text-center flex items-center justify-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/profile" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium text-center flex items-center justify-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Pengaturan</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors font-medium text-center flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="bg-[#042558] hover:bg-[#031a3d] text-white px-4 py-2 rounded-full transition-colors font-medium text-center">
                      Daftar
                    </Link>
                    <Link to="/login" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-full transition-colors font-medium text-center">
                      Masuk
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}