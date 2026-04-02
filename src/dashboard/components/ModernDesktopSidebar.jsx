import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';

export default function ModernDesktopSidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [stats, setStats] = useState({
    clients: 12,
    projects: 8,
    revenue: '€15,240',
    growth: '+12%',
  });

  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  // Menu items avec icônes et métadonnées
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
      badge: 'new',
      description: "Vue d'ensemble",
    },
    {
      id: 'business',
      label: 'Business',
      icon: '💼',
      color: 'from-purple-500 to-purple-600',
      submenu: [
        {
          label: 'Clients',
          path: '/dashboard/clients',
          icon: '👥',
          count: stats.clients,
          trend: 'up',
        },
        {
          label: 'Projets',
          path: '/dashboard/projects',
          icon: '📋',
          count: stats.projects,
          trend: 'up',
        },
        {
          label: 'Abonnés',
          path: '/dashboard/subscribers',
          icon: '📧',
          count: 45,
          trend: 'stable',
        },
      ],
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      submenu: [
        {
          label: 'Paiements',
          path: '/dashboard/payments',
          icon: '💳',
          amount: stats.revenue,
        },
        {
          label: 'Factures',
          path: '/dashboard/invoices',
          icon: '📄',
          count: 6,
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/dashboard/analytics',
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
      badge: stats.growth,
      description: 'Statistiques temps réel',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: '💬',
      color: 'from-pink-500 to-pink-600',
      submenu: [
        {
          label: 'Messages',
          path: '/dashboard/messaging',
          icon: '💌',
          count: 3,
          urgent: true,
        },
        {
          label: 'Notifications',
          path: '/dashboard/notifications',
          icon: '🔔',
          count: 7,
        },
      ],
    },
  ];

  const handleSubmenuToggle = (itemId) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => setActiveSubmenu(itemId), 100);
    } else {
      setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
    }
  };

  // Simuler des données en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        revenue: `€${(Math.random() * 5000 + 15000).toFixed(0)}`,
        growth: `+${(Math.random() * 5 + 10).toFixed(1)}%`,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header avec Logo */}
      <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <span className="text-2xl font-bold text-white">IR</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Ir Bendelo</h2>
                  <p className="text-blue-100 text-sm">Admin Dashboard Pro</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg mx-auto"
              >
                <span className="text-xl font-bold text-white">IR</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <motion.svg
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </motion.svg>
          </motion.button>
        </div>

        {/* Stats Quick View */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white/80 text-xs">Revenus</div>
                <div className="text-white font-bold text-lg">
                  {stats.revenue}
                </div>
                <div className="text-green-300 text-xs">{stats.growth}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white/80 text-xs">Projets</div>
                <div className="text-white font-bold text-lg">
                  {stats.projects}
                </div>
                <div className="text-blue-300 text-xs">En cours</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
        {/* Retour site principal */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center p-3 mb-4 text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <span className="text-xl">🏠</span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3"
              >
                <div className="font-semibold">Site Principal</div>
                <div className="text-emerald-100 text-xs">Retour au site</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Menu Items */}
        {menuItems.map((item, _index) => (
          <div key={item.id}>
            {/* Menu item principal */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                isCollapsed ? 'mx-auto w-12' : ''
              }`}
              onClick={() =>
                item.submenu
                  ? handleSubmenuToggle(item.id)
                  : navigate(item.path)
              }
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              ></div>

              <div
                className={`relative p-3 bg-slate-800/50 group-hover:bg-transparent border border-slate-700/50 group-hover:border-transparent transition-all duration-300 ${
                  isCollapsed
                    ? 'flex justify-center'
                    : 'flex items-center justify-between'
                }`}
              >
                <div
                  className={`flex items-center ${
                    isCollapsed ? '' : 'space-x-3'
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>

                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        <div className="text-white font-medium group-hover:text-white">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-slate-400 text-xs group-hover:text-white/80">
                            {item.description}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center space-x-2"
                    >
                      {item.badge && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            item.badge === 'new'
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.submenu && (
                        <motion.div
                          animate={{
                            rotate: activeSubmenu === item.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="text-slate-400 group-hover:text-white"
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Submenu */}
            <AnimatePresence>
              {item.submenu && activeSubmenu === item.id && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden ml-4 mt-2 space-y-1"
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center justify-between p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{subItem.icon}</span>
                        <div>
                          <div className="font-medium">{subItem.label}</div>
                          {subItem.desc && (
                            <div className="text-xs opacity-75">
                              {subItem.desc}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {subItem.count && (
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              subItem.urgent
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}
                          >
                            {subItem.count}
                          </span>
                        )}

                        {subItem.amount && (
                          <span className="text-green-400 font-semibold text-sm">
                            {subItem.amount}
                          </span>
                        )}

                        {subItem.trend && (
                          <span
                            className={`text-xs ${
                              subItem.trend === 'up'
                                ? 'text-green-400'
                                : subItem.trend === 'down'
                                ? 'text-red-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {subItem.trend === 'up'
                              ? '↗'
                              : subItem.trend === 'down'
                              ? '↘'
                              : '→'}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        {/* Profil */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="font-semibold text-white">A</span>
                </div>
                <div>
                  <div className="text-white font-medium">Admin</div>
                  <div className="text-slate-400 text-xs">En ligne</div>
                </div>
                <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center justify-center p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
            isCollapsed ? 'px-3' : ''
          }`}
        >
          <span className="text-xl">🚪</span>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-2 font-semibold"
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}
