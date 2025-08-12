'use client';

import { useParams } from 'next/navigation';
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

const TimelineStep = ({ 
  title, 
  description, 
  date, 
  isActive, 
  isCompleted 
}: { 
  title: string; 
  description: string; 
  date?: string; 
  isActive: boolean; 
  isCompleted: boolean; 
}) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 ${
          isCompleted 
            ? 'bg-green-500 border-green-500' 
            : isActive 
            ? 'bg-blue-500 border-blue-500' 
            : 'bg-white border-gray-300'
        }`}>
          {isCompleted && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
      </div>
      <div className="flex-1 pb-8">
        <h3 className={`font-medium ${
          isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-500'
        }`}>
          {title}
        </h3>
        <p className={`text-sm mt-1 ${
          isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
        }`}>
          {description}
        </p>
        {date && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(date).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default function ConsultationStatusPage() {
  const params = useParams();
  const { user } = useAuth();
  const consultationId = params.id as string;

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

  const getTimelineSteps = () => {
    const steps = [
      {
        title: 'Konsultasi Diajukan',
        description: 'Permintaan konsultasi telah diterima dan sedang diproses',
        date: consultation.createdAt,
        isCompleted: true,
        isActive: consultation.status === 'pending'
      },
      {
        title: 'Penjadwalan',
        description: consultation.scheduledDate 
          ? `Konsultasi dijadwalkan pada ${new Date(consultation.scheduledDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}`
          : 'Menunggu penjadwalan dari tim konsultan',
        date: consultation.scheduledDate,
        isCompleted: consultation.status === 'scheduled' || consultation.status === 'completed',
        isActive: consultation.status === 'scheduled'
      },
      {
        title: 'Konsultasi Berlangsung',
        description: consultation.status === 'completed' 
          ? 'Konsultasi telah selesai dilaksanakan'
          : 'Konsultasi akan berlangsung sesuai jadwal',
        date: consultation.status === 'completed' ? consultation.updatedAt : undefined,
        isCompleted: consultation.status === 'completed',
        isActive: consultation.status === 'completed'
      }
    ];

    if (consultation.status === 'cancelled') {
      return [
        steps[0],
        {
          title: 'Konsultasi Dibatalkan',
          description: 'Konsultasi telah dibatalkan',
          date: consultation.updatedAt,
          isCompleted: true,
          isActive: true
        }
      ];
    }

    return steps;
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
                Status Konsultasi
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Timeline Konsultasi</h2>
                  <div className="space-y-0">
                    {getTimelineSteps().map((step, index) => (
                      <TimelineStep
                        key={index}
                        title={step.title}
                        description={step.description}
                        date={step.date}
                        isActive={step.isActive}
                        isCompleted={step.isCompleted}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Meeting Information */}
              {consultation.status === 'scheduled' && consultation.scheduledDate && (
                <Card className="mt-6">
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
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Hasil Konsultasi</h2>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="font-medium text-green-900">Catatan Konsultasi</h3>
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
              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informasi Singkat</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Anak</label>
                      <p className="text-gray-900">{consultation.childName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Usia</label>
                      <p className="text-gray-900">{consultation.childAge} tahun</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tipe Konsultasi</label>
                      <p className="text-gray-900">{getConsultationTypeText(consultation.consultationType)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                      <p className="text-gray-900">
                        {new Date(consultation.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
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
                      onClick={() => window.location.href = `/consultation/${consultationId}`}
                    >
                      Lihat Detail Lengkap
                    </Button>
                    
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

              {/* Help */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Butuh Bantuan?</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Jika Anda memiliki pertanyaan tentang konsultasi ini, silakan hubungi tim support kami.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Hubungi Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}