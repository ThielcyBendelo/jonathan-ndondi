// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function ModernMobileHeader({ onMenuToggle, isMenuOpen }) {
  return (
    <>
      {/* Header Mobile */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="lg:hidden sticky top-0 z-30 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 backdrop-blur-md border-b border-slate-700/50 shadow-xl"
      >
        <div className="flex items-center justify-between p-4">
          {/* Menu Button */}
          <motion.button
            onClick={onMenuToggle}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <motion.div
              animate={isMenuOpen ? 'open' : 'closed'}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 },
                }}
                className="w-5 h-0.5 bg-white rounded-full transform transition-all duration-300"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1, x: 0 },
                  open: { opacity: 0, x: -10 },
                }}
                className="w-5 h-0.5 bg-white rounded-full mt-1 transform transition-all duration-300"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 },
                }}
                className="w-5 h-0.5 bg-white rounded-full mt-1 transform transition-all duration-300"
              />
            </motion.div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 hover:opacity-30 transition-opacity duration-200 blur-sm"></div>
          </motion.button>

          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">IR</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-blue-200 text-xs">Ir Bendelo Dashboard</p>
            </div>
          </div>

          {/* Notifications et profil */}
          <div className="flex items-center space-x-2">
            {/* Notification Bell */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2 bg-slate-800/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-3.5-3.5L18 9c0-3.314-2.686-6-6-6S6 5.686 6 9l1.5 4.5L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {/* Badge notification */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Profile */}
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
            >
              <span className="text-sm font-semibold text-white">A</span>
            </motion.div>
          </div>
        </div>

        {/* Progress bar decorative */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
        />
      </motion.header>
    </>
  );
}
