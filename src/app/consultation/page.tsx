'use client';

import { useState } from 'react';
import { useSubmitConsultation, useConsultationTypes, useAvailableConsultationSlots } from '@/hooks/useConsultation';
import { usePesantren } from '@/hooks/usePesantren';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { ConsultationData } from '@/services/consultationService';

const ConsultationForm = ({ onSubmit, isLoading }: {
  onSubmit: (data: ConsultationData) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<ConsultationData>({
    parent_name: '',
    child_name: '',
    child_age: 0,
    email: '',
    phone: '',
    preferred_location: '',
    preferred_programs: [],
    budget_range: '',
    consultation_type: 'general',
    preferred_schedule: '',
    questions: '',
    additional_notes: ''
  });

  const [selectedPesantren, setSelectedPesantren] = useState<string>('');
  
  // Get available data
  const { data: consultationTypes } = useConsultationTypes();
  const { data: pesantrenList } = usePesantren({ limit: 100 });
  const { data: availableSlots } = useAvailableConsultationSlots(
    undefined, 
    formData.consultation_type
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      pesantren_id: selectedPesantren || undefined,
      pesantren_code: pesantrenList?.data.find((p: any) => p.id === selectedPesantren)?.code
    };
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'child_age' ? parseInt(value) || 0 : value
    }));
  };

  const handleProgramsChange = (program: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_programs: prev.preferred_programs?.includes(program)
        ? prev.preferred_programs.filter(p => p !== program)
        : [...(prev.preferred_programs || []), program]
    }));
  };

  const programs = ['Tahfidz', 'Kitab Kuning', 'Modern', 'Terpadu', 'Bahasa Arab', 'Bahasa Inggris'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Nama Anak *
          </label>
          <input
            type="text"
            name="child_name"
            value={formData.child_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usia Anak *
          </label>
          <input
            type="number"
            name="child_age"
            value={formData.child_age}
            onChange={handleChange}
            required
            min="5"
            max="25"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Konsultasi *
          </label>
          <select
            name="consultation_type"
            value={formData.consultation_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">Konsultasi Umum</option>
            <option value="specific_pesantren">Pesantren Tertentu</option>
            <option value="program_selection">Pemilihan Program</option>
            <option value="admission_process">Proses Pendaftaran</option>
          </select>
        </div>
      </div>

      {formData.consultation_type === 'specific_pesantren' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Pesantren
          </label>
          <select
            value={selectedPesantren}
            onChange={(e) => setSelectedPesantren(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Pilih Pesantren</option>
            {pesantrenList?.data.map((pesantren: any) => (
              <option key={pesantren.id} value={pesantren.id}>
                {pesantren.name} - {pesantren.location}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lokasi Preferensi
        </label>
        <input
          type="text"
          name="preferred_location"
          value={formData.preferred_location}
          onChange={handleChange}
          placeholder="Contoh: Jakarta, Bogor, Depok"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Program yang Diminati
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {programs.map((program) => (
            <label key={program} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.preferred_programs?.includes(program) || false}
                onChange={() => handleProgramsChange(program)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{program}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rentang Biaya
        </label>
        <select
          name="budget_range"
          value={formData.budget_range}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Pilih Rentang Biaya</option>
          <option value="< 1 juta">Kurang dari 1 juta</option>
          <option value="1-3 juta">1 - 3 juta</option>
          <option value="3-5 juta">3 - 5 juta</option>
          <option value="5-10 juta">5 - 10 juta</option>
          <option value="> 10 juta">Lebih dari 10 juta</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jadwal Preferensi
        </label>
        <input
          type="text"
          name="preferred_schedule"
          value={formData.preferred_schedule}
          onChange={handleChange}
          placeholder="Contoh: Senin-Jumat pagi, Weekend sore"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pertanyaan Khusus
        </label>
        <textarea
          name="questions"
          value={formData.questions}
          onChange={handleChange}
          rows={4}
          placeholder="Tuliskan pertanyaan atau hal yang ingin Anda konsultasikan"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catatan Tambahan
        </label>
        <textarea
          name="additional_notes"
          value={formData.additional_notes}
          onChange={handleChange}
          rows={3}
          placeholder="Informasi tambahan yang perlu diketahui"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mengirim...' : 'Kirim Permintaan Konsultasi'}
        </Button>
      </div>
    </form>
  );
};

export default function ConsultationPage() {
  const { user } = useAuth();
  
  const submitConsultationMutation = useSubmitConsultation();

  const handleSubmit = async (formData: ConsultationData) => {
    try {
      await submitConsultationMutation.mutateAsync(formData);
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard?tab=consultations';
      }
    } catch (error) {
      console.error('Error submitting consultation:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Login Diperlukan</h1>
            <p className="text-gray-600 mb-4">Anda harus login untuk mengajukan konsultasi.</p>
            <Button onClick={() => { if (typeof window !== 'undefined') { window.location.href = '/login'; } }}>Login</Button>
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
              Konsultasi Pesantren
            </h1>
            <p className="text-gray-600">
              Dapatkan konsultasi gratis untuk memilih pesantren yang tepat untuk anak Anda
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Informasi Konsultasi</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-800">Layanan Konsultasi Gratis</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Konsultasi dengan ahli pendidikan pesantren</li>
                          <li>Rekomendasi pesantren sesuai kebutuhan anak</li>
                          <li>Panduan proses pendaftaran</li>
                          <li>Informasi biaya dan fasilitas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ConsultationForm
                onSubmit={handleSubmit}
                isLoading={submitConsultationMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}