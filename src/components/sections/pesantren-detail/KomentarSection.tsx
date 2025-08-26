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



export default function KomentarSection({ pesantrenId, reviews = [] }: KomentarSectionProps) {
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

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

  const sortedReviews = [...allReviews].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div id="reviews" className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Komentar {allReviews.length}</h2>
      </div>

      {/* Comment Form */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <textarea 
          placeholder="Tulis komentar"
          className="w-full border-none outline-none resize-none text-gray-700 placeholder-gray-500"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-3">Sembunyikan sebagai anonim</span>
            <label className="cursor-pointer" onClick={() => setIsAnonymous(!isAnonymous)}>
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <div className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-200 ease-in-out ${
                 isAnonymous ? 'bg-gray-400' : 'bg-blue-500'
               }`}>
                 <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                   isAnonymous ? 'translate-x-1' : 'translate-x-5'
                 }`}></div>
              </div>
            </label>
          </div>
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm flex items-center space-x-2 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Kirim</span>
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 text-base">{review.user.name}</h4>
                <span className="text-gray-400 text-sm">•</span>
                <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}