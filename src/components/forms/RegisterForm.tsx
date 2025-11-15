'use client';

import React, { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';
import { RegisterData } from '@/types';

interface FormErrors {
  email?: string;
  password?: string;
  confirm_password?: string;
  general?: string;
}

const RegisterForm: React.FC = () => {
  const registerMutation = useRegister();
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirm_password: '',
    terms_accepted: true, // Auto-accept terms for simplified UI
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    
    // Validasi konfirmasi password
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password tidak cocok';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error saat user mulai mengetik
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Prepare data for submission
      const submitData: RegisterData = {
        ...formData,
        terms_accepted: true
      };
      
      await registerMutation.mutateAsync(submitData);
      
      // Registrasi berhasil - redirect ke halaman verifikasi email
      if (typeof window !== 'undefined') {
        window.location.href = '/verify-email';
      }
      
    } catch (error: any) {
      console.error('Registrasi gagal:', error);
      
      // Set error berdasarkan response dari server
      if (error.message.includes('Email sudah terdaftar')) {
        setErrors({ email: 'Email ini sudah digunakan' });
      } else {
        setErrors({ general: error.message || 'Terjadi kesalahan saat registrasi' });
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
            alt="Islamic Scholar Reading" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-end p-8 text-white">
          {/* Logo/Branding at bottom */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#042558] font-bold text-sm">P</span>
              </div>
              <span className="text-white font-medium">pabelan.or.id</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#042558] font-bold text-sm">P</span>
              </div>
              <span className="text-white font-medium">pondok pabelan</span>
            </div>
          </div>
          
          {/* Social media handles */}
          <div className="mt-4 flex items-center space-x-4 text-sm text-white text-opacity-80">
            <span>@pondokpabelan</span>
            <span>Pondok Pesantren Pabelan</span>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#042558] mb-2">Registrasi Akun</h1>
            <p className="text-gray-600">
              Daftar sekarang untuk mengakses informasi lengkap pesantren dan layanan konsultasi pendidikan Islam.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error umum */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}
            
            {/* ID Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#042558] mb-2">
                ID Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042558] focus:bg-white transition-colors ${
                  errors.email ? 'ring-2 ring-red-500' : ''
                }`}
                placeholder="Masukkan ID Email"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            {/* Password Fields - Side by Side */}
             <div className="grid grid-cols-2 gap-4">
               {/* Kata Sandi Baru */}
               <div>
                 <label htmlFor="password" className="block text-sm font-medium text-[#042558] mb-2">
                   Kata Sandi Baru
                 </label>
                 <div className="relative">
                   <input
                     type={showPassword ? 'text' : 'password'}
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042558] focus:bg-white transition-colors pr-12 ${
                       errors.password ? 'ring-2 ring-red-500' : ''
                     }`}
                     placeholder="Masukkan Kata Sandi"
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                   >
                     {showPassword ? (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                       </svg>
                     ) : (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     )}
                   </button>
                 </div>
                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
               </div>
               
               {/* Konfirmasi Kata Sandi */}
               <div>
                 <label htmlFor="confirm_password" className="block text-sm font-medium text-[#042558] mb-2">
                   Konfirmasi Kata Sandi
                 </label>
                 <div className="relative">
                   <input
                     type={showConfirmPassword ? 'text' : 'password'}
                     id="confirm_password"
                     name="confirm_password"
                     value={formData.confirm_password}
                     onChange={handleInputChange}
                     className={`w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042558] focus:bg-white transition-colors pr-12 ${
                       errors.confirm_password ? 'ring-2 ring-red-500' : ''
                     }`}
                     placeholder="Konfirmasi Kata Sandi"
                   />
                   <button
                     type="button"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                   >
                     {showConfirmPassword ? (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                       </svg>
                     ) : (
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                       </svg>
                     )}
                   </button>
                 </div>
                 {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
               </div>
             </div>
             
             {/* Password hint */}
             <p className="text-gray-500 text-xs -mt-2">Kata sandi Anda harus minimal 8 karakter</p>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                registerMutation.isPending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#042558] hover:bg-[#0a3d7a] focus:ring-2 focus:ring-[#042558]'
              } text-white`}
            >
              {registerMutation.isPending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </span>
              ) : (
                'Daftar sekarang'
              )}
            </button>
            
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>
            
            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan google
            </button>
            
            {/* Link ke Login */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                sudah punya akun?{' '}
                <a href="/login" className="text-[#042558] hover:underline font-medium">
                  Log in sekarang
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;