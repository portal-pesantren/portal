'use client';

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePesantrenDetail } from '@/hooks/usePesantren';
import { useSubmitApplication, useCanUserApply, useCanUserApplyByCode } from '@/hooks/useApplication';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { ApplicationData } from '@/services/applicationService';

const ApplicationForm = ({ pesantrenId, pesantrenCode, onSubmit, isLoading }: {
  pesantrenId: string;
  pesantrenCode?: string;
  onSubmit: (data: ApplicationData) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<ApplicationData>({
    pesantren_id: pesantrenId,
    pesantren_code: pesantrenCode,
    student_name: '',
    student_age: 0,
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    address: '',
    previous_education: '',
    preferred_program: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'student_age' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Santri *
          </label>
          <input
            type="text"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usia Santri *
          </label>
          <input
            type="number"
            name="student_age"
            value={formData.student_age}
            onChange={handleChange}
            required
            min="5"
            max="25"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Orang Tua/Wali *
          </label>
          <input
            type="text"
            name="parent_name"
            value={formData.parent_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Orang Tua/Wali *
          </label>
          <input
            type="email"
            name="parent_email"
            value={formData.parent_email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon Orang Tua/Wali *
          </label>
          <input
            type="tel"
            name="parent_phone"
            value={formData.parent_phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Program yang Diminati *
          </label>
          <select
            name="preferred_program"
            value={formData.preferred_program}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Program</option>
            <option value="Tahfidz">Tahfidz</option>
            <option value="Kitab Kuning">Kitab Kuning</option>
            <option value="Modern">Modern</option>
            <option value="Terpadu">Terpadu</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Lengkap *
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pendidikan Sebelumnya
        </label>
        <input
          type="text"
          name="previous_education"
          value={formData.previous_education}
          onChange={handleChange}
          placeholder="Contoh: SD Negeri 1 Jakarta"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Kontak Darurat *
          </label>
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Kontak Darurat *
          </label>
          <input
            type="tel"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim Aplikasi'}
        </Button>
      </div>
    </form>
  );
};

export default function ApplicationPage() {
  const params = useParams();
  const { user } = useAuth();
  const applicationId = (params as any).id as string;
  
  // Try to get pesantren detail using the ID (could be UUID v7 or legacy ID)
  const { data: pesantren, isLoading: pesantrenLoading, error: pesantrenError } = usePesantrenDetail(applicationId);
  
  // Check if user can apply using both ID types
  const { data: canApplyById } = useCanUserApply(applicationId);
  const { data: canApplyByCode } = useCanUserApplyByCode(pesantren?.code || '');
  
  const canApply = canApplyById || canApplyByCode;
  
  const submitApplicationMutation = useSubmitApplication();

  const handleSubmit = async (formData: ApplicationData) => {
    try {
      await submitApplicationMutation.mutateAsync(formData);
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard?tab=applications';
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Login Diperlukan</h1>
            <p className="text-gray-600 mb-4">Anda harus login untuk mengajukan aplikasi.</p>
            <Button onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/login'; } }}>Login</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (pesantrenLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Memuat data pesantren...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (pesantrenError || !pesantren) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Pesantren Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-4">Pesantren yang Anda cari tidak ditemukan.</p>
            <Button onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/search'; } }}>Cari Pesantren Lain</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!canApply) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tidak Dapat Mengajukan Aplikasi</h1>
            <p className="text-gray-600 mb-4">Anda sudah memiliki aplikasi aktif untuk pesantren ini atau tidak memenuhi syarat.</p>
            <Button onClick={() => { if (typeof window !== 'undefined') { window.location.href = `/pesantren/${applicationId}`; } }}>Kembali ke Detail Pesantren</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Aplikasi Pendaftaran
            </h1>
            <p className="text-gray-600">
              Mengajukan aplikasi untuk <span className="font-semibold">{pesantren.name}</span>
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <ApplicationForm
                pesantrenId={applicationId}
                pesantrenCode={pesantren.code}
                onSubmit={handleSubmit}
                isLoading={submitApplicationMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}