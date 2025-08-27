'use client';

import { useState, useEffect } from 'react';

interface EventItem {
  id: string;
  date: number;
  title: string;
  description?: string;
  type: 'academic' | 'religious' | 'extracurricular' | 'general';
}

interface KeteranganEventProps {
  pesantrenId: string;
  className?: string;
}

// Mock data untuk event dalam satu bulan
const mockEvents: EventItem[] = [
  {
    id: '1',
    date: 26,
    title: 'Temu IKPP di Pondok Pesantren Pabelan',
    type: 'academic'
  },
  {
    id: '2', 
    date: 27,
    title: 'Lomba Drumband Pabelan Cup 2025',
    type: 'extracurricular'
  },
  {
    id: '3',
    date: 28,
    title: 'Puncak Milad Pondok Pesantren Pabelan ke-60',
    type: 'religious'
  }
];

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'academic':
      return 'bg-blue-500';
    case 'religious':
      return 'bg-green-500';
    case 'extracurricular':
      return 'bg-purple-500';
    case 'general':
      return 'bg-gray-500';
    default:
      return 'bg-blue-500';
  }
};

export default function KeteranganEvent({ pesantrenId, className = '' }: KeteranganEventProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('Agustus');
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    // Simulasi fetch data
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulasi delay API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [pesantrenId]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 rounded-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Keterangan:
        </h3>
      </div>
      
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm"
          >
            {/* Date Circle */}
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {event.date}
              </span>
            </div>
            
            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-base leading-tight">
                {event.title}
              </h4>
              {event.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📅</div>
          <p className="text-gray-600">Tidak ada event untuk bulan ini</p>
        </div>
      )}
    </div>
  );
}