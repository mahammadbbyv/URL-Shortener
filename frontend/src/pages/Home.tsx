import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiLink, FiCopy, FiDownload, FiBarChart2, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';
import { urlApi } from '../services/api';
import type { ShortenUrlRequest } from '../types';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortCode, setCustomShortCode] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shortenMutation = useMutation({
    mutationFn: (data: ShortenUrlRequest) => urlApi.shortenUrl(data),
    onSuccess: (data) => {
      setShortenedUrl(data.shortUrl);
      setShortCode(data.shortCode);
      setOriginalUrl('');
      setCustomShortCode('');
      toast.success('URL shortened successfully!', {
        icon: '🎉',
        style: {
          borderRadius: '10px',
          background: '#10b981',
          color: '#fff',
        },
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to shorten URL', {
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    shortenMutation.mutate({
      originalUrl,
      customShortCode: customShortCode || undefined,
    });
  };

  const copyToClipboard = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQrCode = async () => {
    if (shortCode) {
      await urlApi.downloadQrCode(shortCode);
      toast.success('QR Code downloaded!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        >
          Shorten Your URLs
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-600 mb-8"
        >
          Create short, memorable links in seconds with advanced analytics and QR codes
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {[
            { icon: <FiZap className="w-5 h-5" />, text: 'Lightning Fast' },
            { icon: <FiShield className="w-5 h-5" />, text: 'Secure & Reliable' },
            { icon: <FiTrendingUp className="w-5 h-5" />, text: 'Track Analytics' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-200"
            >
              <span className="text-indigo-600">{feature.icon}</span>
              <span className="text-sm font-medium text-gray-700">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Main Form Card with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 border border-white/20"
      >
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div>
            <label htmlFor="originalUrl" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FiLink className="mr-2 text-indigo-600" />
              Original URL
            </label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/your-very-long-url-here"
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/50"
              required
            />
          </div>

          <div>
            <label htmlFor="customShortCode" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FiZap className="mr-2 text-purple-600" />
              Custom Short Code (optional)
            </label>
            <div className="relative">
              <input
                type="text"
                id="customShortCode"
                value={customShortCode}
                onChange={(e) => setCustomShortCode(e.target.value)}
                placeholder="my-short-link-code"
                pattern="[a-zA-Z0-9-_]+"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all duration-300 bg-white/50"
              />
              <p className="mt-2 text-xs text-gray-500 flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Leave empty for auto-generated code
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={shortenMutation.isPending}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {shortenMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Shortening...
              </>
            ) : (
              <>
                <FiZap className="w-5 h-5" />
                Shorten URL
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Result Card */}
      <AnimatePresence>
        {shortenedUrl && shortCode && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl p-8 border border-green-200"
          >
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center"
              >
                <span className="text-2xl">✨</span>
              </motion.div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3 text-4xl">🎉</span>
              Success! Your URL is Ready
            </h2>
            
            <div className="bg-white rounded-xl p-4 mb-6 shadow-md">
              <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wide">Your Shortened URL</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={shortenedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 font-mono text-sm md:text-base font-semibold"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FiCopy className="w-5 h-5" />
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={downloadQrCode}
                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiDownload className="w-5 h-5" />
                Download QR Code
              </motion.button>
              
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href={`/analytics?code=${shortCode}`}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiBarChart2 className="w-5 h-5" />
                View Analytics
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
      >
        {[
          {
            icon: <FiZap className="w-8 h-8" />,
            title: 'Lightning Fast',
            description: 'Create short links in milliseconds with our optimized infrastructure',
            color: 'from-yellow-400 to-orange-400',
          },
          {
            icon: <FiBarChart2 className="w-8 h-8" />,
            title: 'Detailed Analytics',
            description: 'Track clicks, locations, devices, and browsers with comprehensive analytics',
            color: 'from-blue-400 to-indigo-400',
          },
          {
            icon: <FiShield className="w-8 h-8" />,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with Redis caching and rate limiting',
            color: 'from-green-400 to-emerald-400',
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
