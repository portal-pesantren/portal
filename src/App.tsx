import { Routes, Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LoginForm from '@/components/forms/LoginForm'
import RegisterForm from '@/components/forms/RegisterForm'
import { useAuth } from '@/contexts/AuthContext'
import SearchPage from '@/app/search/page'
import NewsPage from '@/app/news/page'
import NewsDetailPage from '@/app/news/[id]/page'
import PesantrenDetailPage from '@/app/pesantren/[id]/page'
import ApplicationPage from '@/app/apply/[id]/page'
import ApplicationStatusPage from '@/app/apply/[id]/status/page'
import ConsultationPage from '@/app/consultation/page'
import ConsultationDetailPage from '@/app/consultation/[id]/page'
import ConsultationStatusPage from '@/app/consultation/[id]/status/page'
import DashboardPage from '@/app/dashboard/page'
import AboutPage from '@/app/about/page'
import PesantrenStaticDetailPage from '@/app/pesantren/detail/page'

function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Footer />
    </main>
  )
}

function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/pesantren/:id" element={<PesantrenDetailPage />} />
      <Route path="/pesantren/detail" element={<PesantrenStaticDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/apply/:id" element={<ApplicationPage />} />
      <Route path="/apply/:id/status" element={<ApplicationStatusPage />} />
      <Route path="/consultation" element={<ConsultationPage />} />
      <Route path="/consultation/:id" element={<ConsultationDetailPage />} />
      <Route path="/consultation/:id/status" element={<ConsultationStatusPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}