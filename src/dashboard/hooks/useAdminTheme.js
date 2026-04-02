import { useState, useEffect } from 'react';

export function useAdminTheme() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved ? JSON.parse(saved) : false; // Par défaut : thème clair
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', JSON.stringify(isDark));

    // Appliquer le thème au body pour les pages admin uniquement
    if (window.location.pathname.includes('/admin')) {
      document.documentElement.setAttribute(
        'data-admin-theme',
        isDark ? 'dark' : 'light'
      );
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return { isDark, toggleTheme };
}
