'use client';

import { useParams } from 'react-router-dom';
import { useApplicationDetail, useApplicationDetailByCode } from '@/hooks/useApplication';
import { usePesantrenDetail } from '@/hooks/usePesantren';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { Application } from '@/services/applicationService';

const StatusBadge = ({ status }: { status: Application['status'] }) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'waitlisted': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu Review';
      case 'under_review': return 'Sedang Ditinjau';
      case 'accepted': return 'Diterima';
      case 'rejected': return 'Ditolak';
      case 'waitlisted': return 'Daftar Tunggu';
      default: return status;
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'under_review':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'accepted':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'waitlisted':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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

export default function ApplicationStatusPage() {
  const params = useParams();
  const { user } = useAuth();
  const applicationId = (params as any).id as string;

  // Try to get application by UUID v7 first, then fallback to legacy ID
  const { data: applicationByCode, isLoading: loadingByCode, error: errorByCode } = useApplicationDetailByCode(
    applicationId
  );
  const { data: applicationByLegacyId, isLoading: loadingByLegacyId, error: errorByLegacyId } = useApplicationDetail(
    applicationId
  );

  const application = applicationByCode || applicationByLegacyId;
  const isLoading = loadingByCode || loadingByLegacyId;
  const error = errorByCode || errorByLegacyId;

  // Get pesantren details
  const { data: pesantren } = usePesantrenDetail(
    application?.pesantrenCode || application?.pesantrenId || ''
  );

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

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Aplikasi Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-4">Aplikasi yang Anda cari tidak ditemukan atau Anda tidak memiliki akses.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user owns this application
  const isOwner = user && (user.id === application.userId || user.code === application.userCode);

  if (!isOwner) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="text-gray-600 mb-4">Anda tidak memiliki akses untuk melihat aplikasi ini.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Kembali ke Dashboard
            </Button>
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
                Status Aplikasi
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  Aplikasi untuk {application.studentName}
                </p>
                {pesantren && (
                  <p className="text-sm text-gray-500">
                    {pesantren.name}
                  </p>
                )}
              </div>
              <StatusBadge status={application.status} />
            </div>
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Informasi Aplikasi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Santri</label>
                      <p className="mt-1 text-gray-900">{application.studentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Usia</label>
                      <p className="mt-1 text-gray-900">{application.studentAge} tahun</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nama Orang Tua</label>
                      <p className="mt-1 text-gray-900">{application.parentName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Program Diminati</label>
                      <p className="mt-1 text-gray-900">{application.preferredProgram || 'Tidak disebutkan'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{application.parentEmail}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telepon</label>
                      <p className="mt-1 text-gray-900">{application.parentPhone}</p>
                    </div>
                  </div>
                  
                  {application.address && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Alamat</label>
                      <p className="mt-1 text-gray-900">{application.address}</p>
                    </div>
                  )}
                  
                  {application.additionalNotes && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
                      <p className="mt-1 text-gray-900">{application.additionalNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Interview Information */}
              {application.interviewScheduled && application.interviewDate && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Informasi Wawancara</h2>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0h8m-8 0V7a2 2 0 012-2h4a2 2 0 012 2v4" />
                        </svg>
                        <h3 className="font-medium text-blue-900">Wawancara Dijadwalkan</h3>
                      </div>
                      <p className="text-blue-800">
                        {new Date(application.interviewDate).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-blue-700 mt-2">
                        Pastikan Anda hadir tepat waktu. Informasi lebih lanjut akan dikirim melalui email.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviewer Notes */}
              {application.reviewerNotes && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Catatan Reviewer</h2>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800">{application.reviewerNotes}</p>
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
                        <p className="font-medium text-gray-900">Aplikasi Diajukan</p>
                        <p className="text-sm text-gray-600">
                          {new Date(application.submissionDate).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {application.reviewDate && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Review Dimulai</p>
                          <p className="text-sm text-gray-600">
                            {new Date(application.reviewDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {application.interviewDate && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Wawancara Dijadwalkan</p>
                          <p className="text-sm text-gray-600">
                            {new Date(application.interviewDate).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {application.status === 'accepted' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Diterima</p>
                          <p className="text-sm text-gray-600">Selamat! Aplikasi Anda diterima.</p>
                        </div>
                      </div>
                    )}
                    
                    {application.status === 'rejected' && (
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium text-gray-900">Ditolak</p>
                          <p className="text-sm text-gray-600">Aplikasi tidak dapat diterima saat ini.</p>
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
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Lihat Semua Aplikasi
                    </Button>
                    
                    {pesantren && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => window.location.href = `/pesantren/${pesantren.code || pesantren.id}`}
                      >
                        Lihat Pesantren
                      </Button>
                    )}
                    
                    {application.status === 'pending' && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin membatalkan aplikasi ini?')) {
                            // Handle cancel application
                            console.log('Cancel application');
                          }
                        }}
                      >
                        Batalkan Aplikasi
                      </Button>
                    )}
                  </div>
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