# URL Shortener

A modern, full-stack URL shortener application built with .NET 10 and React. Features comprehensive analytics, QR code generation, Redis caching, and a polished user interface.

## Overview

This production-ready application provides URL shortening capabilities with advanced features including click tracking, browser and device analytics, rate limiting, and real-time data visualization. Built with enterprise-grade technologies and following software engineering best practices.

## Key Features

### URL Management

- Create shortened URLs with auto-generated or custom short codes
- Fast redirects with sub-10ms response time via Redis caching
- Real-time URL validation and error handling
- Generate and download QR codes for shortened URLs

### Analytics Dashboard

- Track total clicks and unique visitors
- Analyze traffic by browser type with interactive doughnut charts
- Monitor device distribution (Desktop, Mobile, Tablet) with bar charts
- View click trends over time with line charts
- Parse user agent strings for detailed visitor insights

### Performance and Security

- Distributed caching with Redis (30-minute TTL)
- IP-based rate limiting (10 req/min for URL creation, 100 req/min general)
- Optimized database queries with indexed short codes
- Comprehensive input validation on frontend and backend
- CORS configuration for secure cross-origin requests

### User Interface

- Modern, responsive design optimized for all devices
- Interactive data visualizations using Chart.js
- Smooth animations and transitions with Framer Motion
- Real-time toast notifications for user feedback
- Clean, professional aesthetic with TailwindCSS

## Technology Stack

### Backend

- .NET 10.0 Web API
- Entity Framework Core 10.0
- SQL Server / Azure SQL Edge
- Redis (StackExchange.Redis 2.9.32)
- AspNetCoreRateLimit 5.0.0
- QRCoder 1.7.0
- UAParser 3.1.47

### Frontend

- React 19.2.0 with TypeScript 5.9.3
- Vite 7.2.2
- TailwindCSS 3.4.17
- TanStack Query 5.90.10
- Chart.js 4.5.1
- Framer Motion 12.23.24
- Axios 1.13.2

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/Url/shorten | Create shortened URL |
| GET | /api/Url/{shortCode} | Redirect to original URL |
| GET | /api/Url/stats/{shortCode} | Get URL statistics |
| GET | /api/Url/qr/{shortCode} | Generate QR code |
| GET | /api/Url/analytics/{shortCode} | Get detailed analytics |

## Installation

### Prerequisites

- .NET 10.0 SDK
- Node.js 18+ and npm
- SQL Server or Azure SQL Edge
- Redis

### Backend Setup

```bash
cd backend/UrlShortener.API
dotnet ef database update
dotnet run
```

Server runs at: <http://localhost:5223>

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Application runs at: <http://localhost:5173>

## License

MIT License

## Author

Mahammad Babayev

- GitHub: [@mahammadbbyv](https://github.com/mahammadbbyv)
- Website: [babayev.us](https://babayev.us)
