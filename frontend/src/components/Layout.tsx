import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLink, FiBarChart2, FiGithub } from 'react-icons/fi';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                >
                  <FiLink className="w-6 h-6" />
                </motion.div>
                <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  URL Shortener
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiLink className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/analytics"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/analytics')
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiBarChart2 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </Link>
              <a
                href="https://github.com/mahammadbbyv/URL-Shortener"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all"
              >
                <FiGithub className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      
      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-xl border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 URL Shortener. Built with ❤️ by{' '}
              <a
                href="https://github.com/mahammadbbyv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold hover:text-purple-600 transition-colors"
              >
                Mahammad Babayev
              </a>
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-gray-500 text-xs">Powered by</span>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="font-semibold">.NET 10</span>
                <span>•</span>
                <span className="font-semibold">React</span>
                <span>•</span>
                <span className="font-semibold">Redis</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
