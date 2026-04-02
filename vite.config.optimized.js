import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration Vite optimisée
export default defineConfig({
  plugins: [react()],

  // Optimisation du build
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons', '@heroicons/react'],
          animations: ['framer-motion'],
          pdf: ['jspdf', 'html2canvas'],
          notifications: ['react-toastify'],
        },
      },
    },
    // Optimiser les assets
    assetsInlineLimit: 4096, // Images < 4KB en inline
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer console.log en production
        drop_debugger: true,
      },
    },
  },

  // Optimisation des assets
  assetsInclude: ['**/*.webp', '**/*.avif'],

  // Performance du serveur de dev
  server: {
    hmr: {
      overlay: false,
    },
    // Pré-bundling des dépendances
    force: false,
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'react-icons',
      '@heroicons/react',
    ],
  },
});
