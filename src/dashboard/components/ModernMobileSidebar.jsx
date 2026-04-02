import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';

export default function ModernMobileSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const logout = () => {
    authService.logout();
    navigate('/login');
    onClose();
  };

  // Menu items avec icônes et sous-menus
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      path: '/dashboard',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
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
          desc: 'Gestion clients',
        },
        {
          label: 'Projets',
          path: '/dashboard/projects',
          icon: '📋',
          desc: 'Suivi projets',
        },
        {
          label: 'Abonnés',
          path: '/dashboard/subscribers',
          icon: '📧',
          desc: 'Newsletter',
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
          desc: 'Transactions',
        },
        {
          label: 'Factures',
          path: '/dashboard/invoices',
          icon: '📄',
          desc: 'Facturation',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      path: '/dashboard/analytics',
      icon: '📈',
      color: 'from-orange-500 to-orange-600',
      description: 'Statistiques',
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
          desc: 'Contacts',
        },
        {
          label: 'Notifications',
          path: '/dashboard/notifications',
          icon: '🔔',
          desc: 'Alertes',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      submenu: [
        {
          label: 'Mon Profil',
          path: '/dashboard/profile',
          icon: '👤',
          desc: 'Profil admin',
        },
        {
          label: 'Sécurité',
          path: '/dashboard/security',
          icon: '🔒',
          desc: 'Sécurité',
        },
      ],
    },
  ];

  const handleSubmenuToggle = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  const handleNavClick = (path) => {
    if (path) {
      navigate(path);
    }
    onClose();
  };

  // Animations
  const sidebarVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const itemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-[110] lg:hidden overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold text-white">IR</span>
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Ir Bendelo</h2>
                    <p className="text-blue-100 text-sm">Admin Dashboard</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              {/* Retour site principal */}
              <motion.a
                href="/"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center p-3 mb-4 text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="text-xl mr-3">🏠</span>
                <div>
                  <div className="font-semibold">Site Principal</div>
                  <div className="text-emerald-100 text-xs">Retour au site</div>
                </div>
              </motion.a>

              {/* Menu Items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    custom={index}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    {/* Menu item principal */}
                    <div
                      className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                        item.submenu ? 'cursor-pointer' : ''
                      }`}
                      onClick={() =>
                        item.submenu
                          ? handleSubmenuToggle(item.id)
                          : handleNavClick(item.path)
                      }
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      ></div>

                      <div className="relative p-3 bg-slate-800/50 group-hover:bg-transparent border border-slate-700/50 group-hover:border-transparent transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                              {item.icon}
                            </span>
                            <div>
                              <div className="text-white font-medium group-hover:text-white">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-slate-400 text-xs group-hover:text-white/80">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </div>

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
                        </div>
                      </div>
                    </div>

                    {/* Submenu */}
                    <AnimatePresence>
                      {item.submenu && activeSubmenu === item.id && (
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
                              onClick={() => handleNavClick(subItem.path)}
                              className={({ isActive }) =>
                                `flex items-center p-3 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                                  isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                                }`
                              }
                            >
                              <span className="text-lg mr-3">
                                {subItem.icon}
                              </span>
                              <div>
                                <div className="font-medium">
                                  {subItem.label}
                                </div>
                                <div className="text-xs opacity-75">
                                  {subItem.desc}
                                </div>
                              </div>
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="text-xl mr-2">🚪</span>
                <span className="font-semibold">Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
