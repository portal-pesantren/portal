'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface KalenderEventProps {
  pesantrenId: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'academic' | 'religious' | 'extracurricular' | 'general';
  location?: string;
}

export default function KalenderEvent({ pesantrenId }: KalenderEventProps) {
  const [selectedMonth, setSelectedMonth] = useState(7); // August (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);

  const events: EventItem[] = [
    {
      id: '1',
      title: 'Ujian Tengah Semester',
      date: '2025-08-26',
      time: '08:00 - 12:00',
      description: 'Ujian tengah semester untuk semua tingkatan kelas',
      type: 'academic',
      location: 'Ruang Kelas'
    },
    {
      id: '2',
      title: 'Kajian Kitab Kuning',
      date: '2025-08-27',
      time: '19:30 - 21:00',
      description: 'Kajian rutin kitab kuning bersama Kyai',
      type: 'religious',
      location: 'Masjid Utama'
    },
    {
      id: '3',
      title: 'Lomba Tahfidz Antar Kelas',
      date: '2025-08-28',
      time: '14:00 - 17:00',
      description: 'Kompetisi hafalan Al-Quran antar kelas untuk memotivasi santri',
      type: 'religious',
      location: 'Aula Pesantren'
    },
    {
      id: '4',
      title: 'Kegiatan Olahraga Mingguan',
      date: '2025-08-29',
      time: '16:00 - 18:00',
      description: 'Olahraga rutin untuk menjaga kesehatan santri',
      type: 'extracurricular',
      location: 'Lapangan Olahraga'
    },
    {
      id: '5',
      title: 'Rapat Wali Santri',
      date: '2025-08-30',
      time: '09:00 - 12:00',
      description: 'Pertemuan rutin dengan wali santri membahas perkembangan anak',
      type: 'general',
      location: 'Aula Pesantren'
    }
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday = 0
  };

  // Check if date has event
  const hasEvent = (date: number) => {
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return events.some(event => event.date === dateString);
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const daysInPrevMonth = getDaysInMonth(selectedMonth - 1, selectedYear);
    
    const calendarDays = [];
    
    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      calendarDays.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true
      });
    }
    
    // Current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isPrevMonth: false
      });
    }
    
    // Next month's leading days
    const remainingDays = 42 - calendarDays.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingDays; date++) {
      calendarDays.push({
        date,
        isCurrentMonth: false,
        isPrevMonth: false
      });
    }
    
    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div id="calendar" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Kalender Event
        </h3>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
        </p>
      </div>
      
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900">
          {months[selectedMonth]} {selectedYear}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const isEventDay = day.isCurrentMonth && hasEvent(day.date);
          const isToday = day.isCurrentMonth && 
            day.date === new Date().getDate() && 
            selectedMonth === new Date().getMonth() && 
            selectedYear === new Date().getFullYear();
          
          return (
            <button
              key={`${day.isCurrentMonth ? 'curr' : 'pad'}-${day.date}-${selectedMonth}-${selectedYear}-${index}`}
              className={`
                w-10 h-10 rounded-full text-sm font-medium transition-colors
                ${
                  day.isCurrentMonth
                    ? isEventDay
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : isToday
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'text-gray-900 hover:bg-gray-100'
                    : 'text-gray-400 hover:bg-gray-50'
                }
              `}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );
}