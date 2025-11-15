'use client';

import { useParams } from 'react-router-dom';
import { useConsultationDetail, useConsultationDetailByCode } from '@/hooks/useConsultation';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { Consultation } from '@/services/consultationService';

const StatusBadge = ({ status }: { status: Consultation['status'] }) => {
  const getStatusColor = (status: Consultation['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Consultation['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu Penjadwalan';
      case 'scheduled': return 'Dijadwalkan';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusIcon = (status: Consultation['status']) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'scheduled':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4" />
          </svg>
        );
      case 'completed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {getStatusText(status)}
    </div>
  );
};

export default function ConsultationDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const consultationId = (params as any).id as string;

  // Try to get consultation by UUID v7 first, then fallback to legacy ID
  const { data: consultationByCode, isLoading: loadingByCode, error: errorByCode } = useConsultationDetailByCode(
    consultationId
  );
  const { data: consultationByLegacyId, isLoading: loadingByLegacyId, error: errorByLegacyId } = useConsultationDetail(
    consultationId
  );

  const consultation = consultationByCode || consultationByLegacyId;
  const isLoading = loadingByCode || loadingByLegacyId;
  const error = errorByCode || errorByLegacyId;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !consultation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Konsultasi Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-4">Konsultasi yang Anda cari tidak ditemukan atau Anda tidak memiliki akses.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user owns this consultation
  const isOwner = user && (user.id === consultation.userId || user.code === consultation.userId);

  if (!isOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="text-gray-600 mb-4">Anda tidak memiliki akses untuk melihat konsultasi ini.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                ← Kembali
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Detail Konsultasi
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Konsultasi untuk {consultation.childName}
                </p>
                <p className="text-sm text-gray-500">
                  {getConsultationTypeText(consultation.consultationType)}
                </p>
              </div>
              <StatusBadge status={consultation.status} />
            </div>
          </div>

          {/* Consultation Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informasi Konsultasi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Anak</label>
                      <p className="mt-1 text-gray-900">{consultation.childName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Usia Anak</label>
                      <p className="mt-1 text-gray-900">{consultation.childAge} tahun</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Orang Tua/Wali</label>
                      <p className="mt-1 text-gray-900">{consultation.parentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tipe Konsultasi</label>
                      <p className="mt-1 text-gray-900">{getConsultationTypeText(consultation.consultationType)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{consultation.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telepon</label>
                      <p className="mt-1 text-gray-900">{consultation.phone}</p>
                    </div>
                  </div>
                  
                  {consultation.preferredLocation && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Lokasi Preferensi</label>
                      <p className="mt-1 text-gray-900">{consultation.preferredLocation}</p>
                    </div>
                  )}
                  
                  {consultation.budgetRange && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Rentang Biaya</label>
                      <p className="mt-1 text-gray-900">{consultation.budgetRange}</p>
                    </div>
                  )}
                  
                  {consultation.preferredPrograms && consultation.preferredPrograms.length > 0 && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Program yang Diminati</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {consultation.preferredPrograms.map((program) => (
                          <span key={`program-${program}`} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {consultation.questions && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Pertanyaan</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{consultation.questions}</p>
                    </div>
                  )}
                  
                  {consultation.additionalNotes && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">{consultation.additionalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Meeting Information */}
              {consultation.status === 'scheduled' && consultation.scheduledDate && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Informasi Pertemuan</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4" />
                        </svg>
                        <h3 className="font-medium text-blue-900">Konsultasi Dijadwalkan</h3>
                      </div>
                      <p className="text-blue-800 font-medium mb-2">
                        {new Date(consultation.scheduledDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      {consultation.consultantName && (
                        <p className="text-blue-700 mb-3">
                          <span className="font-medium">Konsultan:</span> {consultation.consultantName}
                        </p>
                      )}
                      
                      {consultation.meetingLink && (
                        <div className="mt-3">
                          <Button 
                            onClick={() => window.open(consultation.meetingLink, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Join Meeting
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm text-blue-700 mt-3">
                        Pastikan Anda bergabung tepat waktu. Link meeting akan aktif 15 menit sebelum jadwal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Meeting Notes */}
              {consultation.meetingNotes && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Catatan Konsultasi</h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="font-medium text-green-900">Hasil Konsultasi</h3>
                      </div>
                      <p className="text-green-800 whitespace-pre-wrap">{consultation.meetingNotes}</p>
                      
                      {consultation.followUpRequired && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm font-medium text-yellow-800">
                            ⚠️ Diperlukan tindak lanjut untuk konsultasi ini
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Konsultasi Diajukan</p>
                        <p className="text-sm text-gray-600">
                          {new Date(consultation.createdAt).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {consultation.scheduledDate && (
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          consultation.status === 'scheduled' || consultation.status === 'completed' 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900">Konsultasi Dijadwalkan</p>
                          <p className="text-sm text-gray-600">
                            {new Date(consultation.scheduledDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {consultation.status === 'completed' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Konsultasi Selesai</p>
                          <p className="text-sm text-gray-600">Konsultasi telah selesai dilaksanakan.</p>
                        </div>
                      </div>
                    )}
                    
                    {consultation.status === 'cancelled' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Konsultasi Dibatalkan</p>
                          <p className="text-sm text-gray-600">Konsultasi telah dibatalkan.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Aksi</h2>
                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.location.href = '/dashboard?tab=consultations'}
                    >
                      Lihat Semua Konsultasi
                    </Button>
                    
                    {consultation.status === 'scheduled' && consultation.meetingLink && (
                      <Button 
                        className="w-full"
                        onClick={() => window.open(consultation.meetingLink, '_blank')}
                      >
                        Join Meeting
                      </Button>
                    )}
                    
                    {consultation.status === 'pending' && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin membatalkan konsultasi ini?')) {
                            // Handle cancel consultation
                            console.log('Cancel consultation');
                          }
                        }}
                      >
                        Batalkan Konsultasi
                      </Button>
                    )}
                    
                    {consultation.status === 'completed' && !consultation.followUpRequired && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.location.href = '/consultation'}
                      >
                        Ajukan Konsultasi Baru
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              {consultation.consultantName && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Konsultan</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{consultation.consultantName}</p>
                        <p className="text-sm text-gray-600">Konsultan Pendidikan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}