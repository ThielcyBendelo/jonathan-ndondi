
import React from 'react';
import BlogList from '../blog/BlogList';
import { useNavigate } from 'react-router-dom';

export default function Blog() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200 py-10">
      {/* Bouton retour site principal */}
      <div className="mb-6 flex justify-start">
        <button
          type="button"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          ← Retour au site principal
        </button>
      </div>
      <BlogList />
    </div>
  );
}
