'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button, Card, CardContent } from '@/components/ui';
import {
  Users,
  BookOpen,
  MessageSquare,
  FileText,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  PlusCircle,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

// Mock data untuk statistik
const mockStats = {
  totalUsers: 1250,
  totalPesantren: 45,
  totalNews: 128,
  totalApplications: 89,
  totalConsultations: 67,
  monthlyGrowth: 12.5
};

// Mock data untuk aktivitas terbaru
const recentActivities = [
  {
    id: 1,
    type: 'user_registration',
    message: 'User baru mendaftar: Ahmad Fauzi',
    timestamp: '2 menit yang lalu',
    icon: Users
  },
  {
    id: 2,
    type: 'news_published',
    message: 'Berita baru dipublikasikan: "Kegiatan Tahfidz Quran"',
    timestamp: '15 menit yang lalu',
    icon: FileText
  },
  {
    id: 3,
    type: 'application_submitted',
    message: 'Aplikasi baru diterima untuk Pondok Al-Hikmah',
    timestamp: '1 jam yang lalu',
    icon: BookOpen
  },
  {
    id: 4,
    type: 'consultation_scheduled',
    message: 'Konsultasi dijadwalkan dengan Ustadz Rahman',
    timestamp: '2 jam yang lalu',
    icon: MessageSquare
  }
];

// Mock data untuk konten terbaru
const recentContent = {
  news: [
    {
      id: 1,
      title: 'Kegiatan Tahfidz Quran di Pondok Pesantren Al-Hikmah',
      status: 'published',
      date: '2024-01-15',
      author: 'Admin'
    },
    {
      id: 2,
      title: 'Program Beasiswa Santri Berprestasi 2024',
      status: 'draft',
      date: '2024-01-14',
      author: 'Admin'
    }
  ],
  pesantren: [
    {
      id: 1,
      name: 'Pondok Pesantren Al-Hikmah',
      location: 'Yogyakarta',
      status: 'active',
      students: 250
    },
    {
      id: 2,
      name: 'Pondok Pesantren Darul Ulum',
      location: 'Jombang',
      status: 'active',
      students: 180
    }
  ]
};

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color?: string;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <Card className="border-l-4 border-l-[#042558]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ activity }: { activity: any }) => {
  const Icon = activity.icon;
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-[#042558] bg-opacity-10 rounded-full">
        <Icon className="w-4 h-4 text-[#042558]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.timestamp}</p>
      </div>
    </div>
  );
};

const ContentTable = ({ title, data, type }: {
  title: string;
  data: any[];
  type: 'news' | 'pesantren';
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button className="bg-[#042558] hover:bg-[#031a3d] text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tambah {type === 'news' ? 'Berita' : 'Pesantren'}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {type === 'news' ? (
                  <>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Judul</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Tanggal</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Penulis</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Nama</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Lokasi</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Santri</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Aksi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  {type === 'news' ? (
                    <>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 truncate max-w-xs">{item.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.date}</td>
                      <td className="py-3 px-4 text-gray-600">{item.author}</td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{item.name}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.location}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{item.students} santri</td>
                    </>
                  )}
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-[#042558] transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-[#042558] transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Simulasi pengecekan role admin
  const isAdmin = user?.role === 'admin' || true; // Sementara true untuk demo

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Akses Ditolak</h1>
            <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman admin.</p>
            <Button onClick={() => window.location.href = '/'}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola konten dan data Portal Pesantren
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'content', label: 'Konten', icon: FileText },
                  { id: 'users', label: 'Pengguna', icon: Users },
                  { id: 'settings', label: 'Pengaturan', icon: Settings }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-[#042558] text-[#042558]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Total Pengguna"
                  value={mockStats.totalUsers.toLocaleString()}
                  icon={Users}
                  trend="+12.5% bulan ini"
                  color="blue"
                />
                <StatCard
                  title="Total Pesantren"
                  value={mockStats.totalPesantren}
                  icon={BookOpen}
                  color="green"
                />
                <StatCard
                  title="Total Berita"
                  value={mockStats.totalNews}
                  icon={FileText}
                  color="purple"
                />
                <StatCard
                  title="Aplikasi Masuk"
                  value={mockStats.totalApplications}
                  icon={Calendar}
                  color="orange"
                />
                <StatCard
                  title="Konsultasi"
                  value={mockStats.totalConsultations}
                  icon={MessageSquare}
                  color="red"
                />
                <StatCard
                  title="Pertumbuhan Bulanan"
                  value={`${mockStats.monthlyGrowth}%`}
                  icon={TrendingUp}
                  trend="Meningkat"
                  color="green"
                />
              </div>

              {/* Recent Activities */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Aktivitas Terbaru
                    </h3>
                    <div className="space-y-2">
                      {recentActivities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="bg-[#042558] hover:bg-[#031a3d] text-white justify-start">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Tambah Berita
                      </Button>
                      <Button className="bg-[#042558] hover:bg-[#031a3d] text-white justify-start">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Tambah Pesantren
                      </Button>
                      <Button className="bg-gray-600 hover:bg-gray-700 text-white justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Kelola Pengguna
                      </Button>
                      <Button className="bg-gray-600 hover:bg-gray-700 text-white justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Pengaturan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-8">
              <ContentTable
                title="Berita Terbaru"
                data={recentContent.news}
                type="news"
              />
              <ContentTable
                title="Pesantren Terdaftar"
                data={recentContent.pesantren}
                type="pesantren"
              />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manajemen Pengguna
                  </h3>
                  <p className="text-gray-600">
                    Fitur manajemen pengguna akan segera tersedia.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pengaturan Sistem
                  </h3>
                  <p className="text-gray-600">
                    Fitur pengaturan sistem akan segera tersedia.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}