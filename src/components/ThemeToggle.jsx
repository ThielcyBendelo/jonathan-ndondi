import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        boxShadow: isDark
          ? '0 4px 15px rgba(102, 126, 234, 0.3)'
          : '0 4px 15px rgba(245, 87, 108, 0.3)',
      }}
      title={`Basculer vers le mode ${isDark ? 'clair' : 'sombre'}`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Icône Soleil */}
        <FaSun
          className={`absolute text-yellow-300 transition-all duration-300 ${
            isDark
              ? 'opacity-0 rotate-90 scale-0'
              : 'opacity-100 rotate-0 scale-100'
          }`}
          size={16}
        />

        {/* Icône Lune */}
        <FaMoon
          className={`absolute text-blue-200 transition-all duration-300 ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-0'
          }`}
          size={16}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
