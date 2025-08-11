'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePesantrenDetail } from '@/hooks/usePesantren';
import { useReviews } from '@/hooks/useReviews';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import { useState } from 'react';

// Loading skeleton for detail page
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
    <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded mb-6 w-4/6"></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-20 bg-gray-200 rounded"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Error component
const ErrorPage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Pesantren Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-4">Pesantren yang Anda cari tidak ditemukan atau terjadi kesalahan.</p>
        <div className="space-x-4">
          <Button onClick={onRetry} variant="outline">
            Coba Lagi
          </Button>
          <Button onClick={() => window.history.back()}>
            Kembali
          </Button>
        </div>
      </div>
    </div>
  </div>
);

// Review Card Component
const ReviewCard = ({ review }: { review: any }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold">{review.user_name}</h4>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg 
                key={star} 
                className={`w-4 h-4 fill-current ${
                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`} 
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
            <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleDateString('id-ID')}
        </span>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </CardContent>
  </Card>
);

export default function PesantrenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  const pesantrenId = params.id as string;
  
  const { 
    data: pesantren, 
    isLoading: pesantrenLoading, 
    error: pesantrenError, 
    refetch: refetchPesantren 
  } = usePesantrenDetail(pesantrenId);
  
  const { 
    data: reviewsData, 
    isLoading: reviewsLoading 
  } = useReviews({ pesantren_id: pesantrenId });

  // Format number helper
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  if (pesantrenLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <DetailSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (pesantrenError || !pesantren) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ErrorPage onRetry={() => refetchPesantren()} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <button onClick={() => router.push('/')} className="hover:text-blue-600">
                Beranda
              </button>
            </li>
            <li>›</li>
            <li>
              <button onClick={() => router.push('/pesantren')} className="hover:text-blue-600">
                Pesantren
              </button>
            </li>
            <li>›</li>
            <li className="text-gray-900 font-medium">{pesantren.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={pesantren.image || '/images/pesantren-default.jpg'} 
              alt={pesantren.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{pesantren.name}</h1>
                <p className="text-lg opacity-90">📍 {pesantren.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Ringkasan' },
                { id: 'programs', label: 'Program' },
                { id: 'facilities', label: 'Fasilitas' },
                { id: 'reviews', label: 'Ulasan' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Tentang Pesantren</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {pesantren.description || 'Deskripsi pesantren tidak tersedia.'}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatNumber(pesantren.students)}</div>
                      <div className="text-sm text-gray-600">Santri</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {pesantren.rating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </CardContent>
                  </Card>
                  
                  {pesantren.fees && (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-lg font-bold text-orange-600">
                          Rp {formatNumber(pesantren.fees.monthly)}
                        </div>
                        <div className="text-sm text-gray-600">Per Bulan</div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {pesantren.programs.length}
                      </div>
                      <div className="text-sm text-gray-600">Program</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Program Pendidikan</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {pesantren.programs.map((program, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{program}</h4>
                        <p className="text-gray-600">Program pendidikan berkualitas dengan kurikulum terintegrasi.</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'facilities' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Fasilitas</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {pesantren.facilities?.map((facility, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">✓</span>
                      </div>
                      <span className="font-medium">{facility}</span>
                    </div>
                  )) || (
                    <div className="col-span-3 text-center text-gray-500 py-4">
                      Informasi fasilitas tidak tersedia
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Ulasan Santri & Wali</h3>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : reviewsData && reviewsData.reviews && reviewsData.reviews.length > 0 ? (
                  <div>
                    {reviewsData.reviews.map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Belum ada ulasan untuk pesantren ini.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push(`/apply/${pesantrenId}`)}
          >
            📝 Daftar Sekarang
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/consultation')}
          >
            💬 Konsultasi
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.open(`tel:${pesantren.contact?.phone || ''}`)}
          >
            📞 Hubungi
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}