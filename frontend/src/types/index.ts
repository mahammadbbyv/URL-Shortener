export interface ShortenUrlRequest {
  originalUrl: string;
  customShortCode?: string;
}

export interface ShortenUrlResponse {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

export interface UrlStatsResponse {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  accessCount: number;
}

export interface ClickAnalytics {
  date: string;
  count: number;
}

export interface BrowserAnalytics {
  browser: string;
  count: number;
}

export interface DeviceAnalytics {
  device: string;
  count: number;
}

export interface UrlAnalyticsResponse {
  clicksByDate: ClickAnalytics[];
  clicksByBrowser: BrowserAnalytics[];
  clicksByDevice: DeviceAnalytics[];
  totalClicks: number;
}
