'use client';

import { RegisterForm } from '@/components/forms';
import { Header, Footer } from '@/components';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
      <Footer />
    </main>
  );
}