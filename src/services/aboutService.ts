import { api } from '@/lib/api';
import { API_CONFIG } from '@/lib/constants';
import { ApiResponse } from '@/types';

// Interface untuk data About Us sesuai dengan response JSON
export interface AboutUsData {
  description: string;
  why_us: string;
  image_url: string;
}

// Interface untuk response API About Us
export interface AboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsData;
}

// Mock data untuk About Us (sementara sampai backend tersedia)
const mockAboutUsData: AboutUsData = {
  description: "Deskripsi baru dengan satu gambar utama.",
  why_us: "Alasan baru mengapa Anda harus memilih kami.",
  image_url: "https://example.com/path/to/single_image.jpg"
};

// Service untuk mengelola API About Us
export const aboutService = {
  /**
   * Mengambil data About Us dari API
   * @returns Promise<AboutUsData>
   */
  getAboutUs: async (): Promise<AboutUsData> => {
    try {
      // Coba ambil dari API terlebih dahulu
      const data = await api.get<AboutUsData>(`${API_CONFIG.BASE_URL}/about-us`);
      return data;
    } catch (error) {
      console.warn('API endpoint /about-us tidak tersedia, menggunakan mock data:', error);
      
      // Fallback ke mock data jika API tidak tersedia
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockAboutUsData);
        }, 500); // Simulasi delay API
      });
    }
  },

  /**
   * Memperbarui data About Us (untuk admin)
   * @param data - Data About Us yang akan diperbarui
   * @returns Promise<AboutUsData>
   */
  updateAboutUs: async (data: Partial<AboutUsData>): Promise<AboutUsData> => {
    try {
      const updated = await api.put<AboutUsData>(`${API_CONFIG.BASE_URL}/about-us`, data);
      return updated;
    } catch (error) {
      console.warn('API endpoint /about-us tidak tersedia untuk update, menggunakan mock data:', error);
      
      // Fallback ke mock data jika API tidak tersedia
      const updatedMockData = {
        ...mockAboutUsData,
        ...data
      };
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(updatedMockData);
        }, 500); // Simulasi delay API
      });
    }
  }
};

export default aboutService;