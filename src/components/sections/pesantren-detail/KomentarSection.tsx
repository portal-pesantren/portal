'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface KomentarSectionProps {
  pesantrenId: string;
  reviews?: Review[];
}

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role?: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
  verified?: boolean;
}

interface NewReview {
  rating: number;
  comment: string;
  name: string;
  email: string;
}

export default function KomentarSection({ pesantrenId, reviews = [] }: KomentarSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState<NewReview>({
    rating: 0,
    comment: '',
    name: '',
    email: ''
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Sample reviews data
  const sampleReviews: Review[] = [
    {
      id: '1',
      user: {
        name: 'Ahmad Fauzi',
        role: 'Wali Santri'
      },
      rating: 5,
      comment: 'Pesantren yang sangat baik dengan sistem pendidikan yang komprehensif. Anak saya berkembang pesat dalam hal akademik maupun akhlak. Para ustadz sangat perhatian dan sabar dalam mendidik.',
      date: '2024-01-15',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      user: {
        name: 'Siti Aminah',
        role: 'Alumni'
      },
      rating: 4,
      comment: 'Alhamdulillah, pengalaman mondok di sini sangat berkesan. Fasilitas cukup lengkap dan lingkungan yang kondusif untuk belajar. Hanya saja makanan di kantin bisa lebih bervariasi.',
      date: '2024-01-10',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      user: {
        name: 'Muhammad Ridwan',
        role: 'Wali Santri'
      },
      rating: 5,
      comment: 'Sangat puas dengan perkembangan anak di pesantren ini. Program tahfidz sangat bagus dan anak menjadi lebih mandiri. Komunikasi dengan pihak pesantren juga lancar.',
      date: '2024-01-05',
      helpful: 15,
      verified: true
    },
    {
      id: '4',
      user: {
        name: 'Fatimah Zahra',
        role: 'Santri'
      },
      rating: 4,
      comment: 'Lingkungan pesantren sangat nyaman dan teman-teman di sini baik-baik. Ustadzah sangat sabar mengajar. Semoga bisa terus berkembang dan fasilitasnya ditambah lagi.',
      date: '2023-12-28',
      helpful: 6,
      verified: false
    }
  ];

  const allReviews = reviews.length > 0 ? reviews : sampleReviews;

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`text-lg ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            disabled={!interactive}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission logic here
    console.log('New review:', newReview);
    
    // Reset form
    setNewReview({
      rating: 0,
      comment: '',
      name: '',
      email: ''
    });
    setShowReviewForm(false);
  };

  const sortedReviews = [...allReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = allReviews.filter(review => review.rating === rating).length;
    const percentage = (count / allReviews.length) * 100;
    return { rating, count, percentage };
  });

  return (
    <div id="reviews" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ulasan & Testimoni</h2>
        <Button 
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="self-start sm:self-auto"
        >
          {showReviewForm ? 'Batal' : 'Tulis Ulasan'}
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center lg:justify-start mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-gray-600 text-sm">
                  Berdasarkan {allReviews.length} ulasan
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-8">{rating}⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tulis Ulasan Anda</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newReview.email}
                  onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan email"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating *
              </label>
              {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ulasan *
              </label>
              <textarea
                required
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bagikan pengalaman Anda tentang pesantren ini..."
              />
            </div>
            
            <div className="flex space-x-3">
              <Button type="submit" disabled={!newReview.rating || !newReview.comment.trim()}>
                Kirim Ulasan
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
        <p className="text-gray-600 text-sm">
          Menampilkan {sortedReviews.length} ulasan
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="highest">Rating Tertinggi</option>
          <option value="lowest">Rating Terendah</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {review.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ✓ Terverifikasi
                      </span>
                    )}
                  </div>
                  {review.user.role && (
                    <p className="text-sm text-gray-600">{review.user.role}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex justify-end mb-1">
                  {renderStars(review.rating)}
                </div>
                <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
            
            {review.helpful && (
              <div className="flex items-center justify-between">
                <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                  <span>👍</span>
                  <span>Membantu ({review.helpful})</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <Button variant="outline">
          Muat Lebih Banyak Ulasan
        </Button>
      </div>
    </div>
  );
}