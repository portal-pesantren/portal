'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface KeteranganSectionProps {
  pesantren: {
    programs?: string[];
    facilities?: string[];
    fees?: {
      monthly: number;
      registration: number;
      dormitory: number;
    };
    contact?: {
      phone: string;
      email: string;
      address: string;
      website?: string;
    };
    advantages?: string[];
  };
}

export default function KeteranganSection({ pesantren }: KeteranganSectionProps) {
  const [activeTab, setActiveTab] = useState('programs');

  const tabs = [
    { id: 'programs', label: 'Program', icon: '📚' },
    { id: 'facilities', label: 'Fasilitas', icon: '🏢' },
    { id: 'fees', label: 'Biaya', icon: '💰' },
    { id: 'contact', label: 'Kontak', icon: '📞' },
    { id: 'advantages', label: 'Keunggulan', icon: '⭐' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'programs':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Pendidikan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pesantren.programs?.map((program, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-800 font-medium">{program}</span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-600 col-span-2">Informasi program belum tersedia.</p>
              )}
            </div>
          </div>
        );

      case 'facilities':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fasilitas Pesantren</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pesantren.facilities?.map((facility, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-gray-800 font-medium">{facility}</span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-600 col-span-3">Informasi fasilitas belum tersedia.</p>
              )}
            </div>
          </div>
        );

      case 'fees':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian Biaya</h3>
            {pesantren.fees ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">📅</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biaya Bulanan</h4>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(pesantren.fees.monthly)}
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">📝</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biaya Pendaftaran</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(pesantren.fees.registration)}
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">🏠</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biaya Asrama</h4>
                    <p className="text-2xl font-bold text-indigo-600">
                      {formatCurrency(pesantren.fees.dormitory)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Informasi biaya belum tersedia.</p>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
            {pesantren.contact ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-lg">📞</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Telepon</h4>
                      <p className="text-gray-600">{pesantren.contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-lg">✉️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">{pesantren.contact.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-lg">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Alamat</h4>
                      <p className="text-gray-600">{pesantren.contact.address}</p>
                    </div>
                  </div>
                  {pesantren.contact.website && (
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 text-lg">🌐</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Website</h4>
                        <a href={pesantren.contact.website} className="text-blue-600 hover:text-blue-800 underline">
                          {pesantren.contact.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Informasi kontak belum tersedia.</p>
            )}
          </div>
        );

      case 'advantages':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Keunggulan Pesantren</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pesantren.advantages?.map((advantage, index) => (
                <div key={index} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">⭐</span>
                    </div>
                    <span className="text-gray-800 font-medium">{advantage}</span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-600 col-span-2">Informasi keunggulan belum tersedia.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="description" className="bg-white rounded-lg shadow-md p-3 sm:p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Informasi Detail</h2>
      
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm sm:text-base">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[250px]">
        {renderTabContent()}
      </div>
    </div>
  );
}