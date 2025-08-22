'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserApplications, useUserApplicationsByCode } from '@/hooks/useApplication';
import { useUserConsultations, useUserConsultationsByCode } from '@/hooks/useConsultation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { Application } from '@/services/applicationService';
import { Consultation } from '@/services/consultationService';

const ApplicationCard = ({ application }: { application: Application }) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'under_review': return 'Sedang Ditinjau';
      case 'accepted': return 'Diterima';
      case 'rejected': return 'Ditolak';
      case 'waitlisted': return 'Daftar Tunggu';
      default: return status;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{application.studentName}</h3>
            <p className="text-gray-600">Program: {application.preferredProgram}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
            {getStatusText(application.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Tanggal Pengajuan:</span> {new Date(application.submissionDate).toLocaleDateString('id-ID')}</p>
            <p><span className="font-medium">Usia:</span> {application.studentAge} tahun</p>
          </div>
          <div>
            <p><span className="font-medium">Email:</span> {application.parentEmail}</p>
            <p><span className="font-medium">Telepon:</span> {application.parentPhone}</p>
          </div>
        </div>
        
        {application.interviewDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Wawancara dijadwalkan: {new Date(application.interviewDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
        
        {application.reviewerNotes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Catatan Reviewer:</p>
            <p className="text-sm text-gray-600">{application.reviewerNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ConsultationCard = ({ consultation }: { consultation: Consultation }) => {
  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Consultation['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'scheduled': return 'Dijadwalkan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getConsultationTypeText = (type: Consultation['consultationType']) => {
    switch (type) {
      case 'general': return 'Konsultasi Umum';
      case 'specific_pesantren': return 'Pesantren Tertentu';
      case 'program_selection': return 'Pemilihan Program';
      case 'admission_process': return 'Proses Pendaftaran';
      default: return type;
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{consultation.childName}</h3>
            <p className="text-gray-600">Tipe: {getConsultationTypeText(consultation.consultationType)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
            {getStatusText(consultation.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Tanggal Pengajuan:</span> {new Date(consultation.createdAt).toLocaleDateString('id-ID')}</p>
            <p><span className="font-medium">Usia Anak:</span> {consultation.childAge} tahun</p>
            <p><span className="font-medium">Orang Tua:</span> {consultation.parentName}</p>
          </div>
          <div>
            <p><span className="font-medium">Email:</span> {consultation.email}</p>
            <p><span className="font-medium">Telepon:</span> {consultation.phone}</p>
            {consultation.preferredLocation && (
              <p><span className="font-medium">Lokasi Preferensi:</span> {consultation.preferredLocation}</p>
            )}
          </div>
        </div>
        
        {consultation.preferredPrograms && consultation.preferredPrograms.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Program yang Diminati:</p>
            <div className="flex flex-wrap gap-2">
              {consultation.preferredPrograms.map((program, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {program}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {consultation.scheduledDate && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Konsultasi dijadwalkan: {new Date(consultation.scheduledDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            {consultation.consultantName && (
              <p className="text-sm text-blue-700 mt-1">
                Konsultan: {consultation.consultantName}
              </p>
            )}
            {consultation.meetingLink && (
              <div className="mt-2">
                <Button 
                  size="sm" 
                  onClick={() => window.open(consultation.meetingLink, '_blank')}
                >
                  Join Meeting
                </Button>
              </div>
            )}
          </div>
        )}
        
        {consultation.questions && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Pertanyaan:</p>
            <p className="text-sm text-gray-600">{consultation.questions}</p>
          </div>
        )}
        
        {consultation.meetingNotes && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-700 mb-1">Catatan Konsultasi:</p>
            <p className="text-sm text-green-600">{consultation.meetingNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function DashboardPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('applications');

  // Get applications using both ID types for compatibility
  const { data: applicationsByLegacyId, isLoading: applicationsLegacyLoading } = useUserApplications(
    user?.id
  );
  const { data: applicationsByCode, isLoading: applicationsCodeLoading } = useUserApplicationsByCode(
    user?.code
  );

  // Get consultations using both ID types for compatibility
  const { data: consultationsByLegacyId, isLoading: consultationsLegacyLoading } = useUserConsultations(
    user?.id
  );
  const { data: consultationsByCode, isLoading: consultationsCodeLoading } = useUserConsultationsByCode(
    user?.code
  );

  // Combine results, preferring UUID v7 data
  const applications = applicationsByCode?.applications || applicationsByLegacyId?.applications || [];
  const consultations = consultationsByCode?.consultations || consultationsByLegacyId?.consultations || [];
  
  const isLoading = applicationsLegacyLoading || applicationsCodeLoading || 
                   consultationsLegacyLoading || consultationsCodeLoading;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['applications', 'consultations'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Login Diperlukan</h1>
            <p className="text-gray-600 mb-4">Anda harus login untuk mengakses dashboard.</p>
            <Button onClick={() => window.location.href = '/login'}>Login</Button>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Kelola aplikasi dan konsultasi Anda
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'applications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Aplikasi ({applications.length})
                </button>
                <button
                  onClick={() => setActiveTab('consultations')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'consultations'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Konsultasi ({consultations.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div>
              {activeTab === 'applications' && (
                <div>
                  {applications.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Aplikasi</h3>
                        <p className="text-gray-600 mb-4">Anda belum mengajukan aplikasi ke pesantren manapun.</p>
                        <Button onClick={() => window.location.href = '/search'}>
                          Cari Pesantren
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div>
                      {applications.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'consultations' && (
                <div>
                  {consultations.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Konsultasi</h3>
                        <p className="text-gray-600 mb-4">Anda belum mengajukan permintaan konsultasi.</p>
                        <Button onClick={() => window.location.href = '/consultation'}>
                          Ajukan Konsultasi
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div>
                      {consultations.map((consultation) => (
                        <ConsultationCard key={consultation.id} consultation={consultation} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}