import axios from 'axios';
import type {
  ShortenUrlRequest,
  ShortenUrlResponse,
  UrlStatsResponse,
  UrlAnalyticsResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5223/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const urlApi = {
  /**
   * Shorten a URL
   */
  async shortenUrl(data: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    const response = await apiClient.post<ShortenUrlResponse>('/Url/shorten', data);
    return response.data;
  },

  /**
   * Get URL statistics
   */
  async getUrlStats(shortCode: string): Promise<UrlStatsResponse> {
    const response = await apiClient.get<UrlStatsResponse>(`/Url/stats/${shortCode}`);
    return response.data;
  },

  /**
   * Get URL analytics
   */
  async getUrlAnalytics(shortCode: string): Promise<UrlAnalyticsResponse> {
    const response = await apiClient.get<UrlAnalyticsResponse>(`/Url/analytics/${shortCode}`);
    return response.data;
  },

  /**
   * Get QR code URL
   */
  getQrCodeUrl(shortCode: string): string {
    return `${API_BASE_URL}/Url/qr/${shortCode}`;
  },

  /**
   * Download QR code
   */
  async downloadQrCode(shortCode: string): Promise<void> {
    const response = await apiClient.get(`/Url/qr/${shortCode}`, {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `qr-${shortCode}.png`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default apiClient;
