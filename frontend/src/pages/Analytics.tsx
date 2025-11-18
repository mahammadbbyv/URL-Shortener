import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { FiSearch, FiTrendingUp, FiUsers, FiMonitor, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { urlApi } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [searchParams] = useSearchParams();
  const [shortCode, setShortCode] = useState(searchParams.get('code') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('code') || '');

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['stats', shortCode],
    queryFn: () => urlApi.getUrlStats(shortCode),
    enabled: !!shortCode,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', shortCode],
    queryFn: () => urlApi.getUrlAnalytics(shortCode),
    enabled: !!shortCode,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      toast.error('Please enter a short code');
      return;
    }
    setShortCode(searchInput);
  };

  // Chart configurations
  const lineChartData = analytics ? {
    labels: analytics.clicksByDate.map(item => item.date),
    datasets: [
      {
        label: 'Clicks',
        data: analytics.clicksByDate.map(item => item.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  } : null;

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const browserChartData = analytics ? {
    labels: analytics.clicksByBrowser.map(item => item.browser),
    datasets: [
      {
        data: analytics.clicksByBrowser.map(item => item.count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const deviceChartData = analytics ? {
    labels: analytics.clicksByDevice.map(item => item.device),
    datasets: [
      {
        label: 'Clicks',
        data: analytics.clicksByDevice.map(item => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  } : null;

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          URL Analytics Dashboard
        </h1>
        <p className="text-xl text-gray-600">View comprehensive statistics for your shortened URLs</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20"
      >
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter short code (e.g., abc123)"
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white/50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
          >
            Search
          </motion.button>
        </form>
      </motion.div>

      {/* Loading State */}
      {(statsLoading || analyticsLoading) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
          <p className="mt-6 text-xl text-gray-600 font-semibold">Loading analytics...</p>
        </motion.div>
      )}

      {/* Error State */}
      {statsError && shortCode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl font-semibold text-red-800">No analytics found for this short code.</p>
          <p className="text-gray-600 mt-2">Please check the code and try again.</p>
        </motion.div>
      )}

      {/* Analytics Content */}
      {stats && analytics && !statsLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <FiTrendingUp className="w-8 h-8" />,
                label: 'Total Clicks',
                value: stats.accessCount,
                color: 'from-blue-500 to-indigo-500',
              },
              {
                icon: <FiUsers className="w-8 h-8" />,
                label: 'Unique Visitors',
                value: analytics.totalClicks,
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: <FiMonitor className="w-8 h-8" />,
                label: 'Devices',
                value: analytics.clicksByDevice.length,
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: <FiGlobe className="w-8 h-8" />,
                label: 'Browsers',
                value: analytics.clicksByBrowser.length,
                color: 'from-orange-500 to-red-500',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* URL Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-indigo-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FiGlobe className="mr-3 text-indigo-600" />
              URL Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">Short Code</p>
                <p className="text-xl font-bold text-indigo-600">{stats.shortCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-2">Created At</p>
                <p className="text-lg text-gray-900">{new Date(stats.createdAt).toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 font-semibold mb-2">Original URL</p>
                <p className="text-sm text-gray-900 break-all bg-white rounded-lg p-3 font-mono">
                  {stats.originalUrl}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Charts */}
          {analytics.clicksByDate.length > 0 && lineChartData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Clicks Over Time</h2>
              <div style={{ height: '320px' }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browser Chart */}
            {analytics.clicksByBrowser.length > 0 && browserChartData && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Browsers</h2>
                <div style={{ height: '320px' }}>
                  <Doughnut data={browserChartData} options={doughnutOptions} />
                </div>
              </motion.div>
            )}

            {/* Device Chart */}
            {analytics.clicksByDevice.length > 0 && deviceChartData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Devices</h2>
                <div style={{ height: '320px' }}>
                  <Bar data={deviceChartData} options={lineChartOptions} />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
