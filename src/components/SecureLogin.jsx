import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormSecurity from '../hooks/useFormSecurity';
import authService from '../services/authService';

const SecureLogin = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = {
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
  };

  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit: handleFormSubmit,
  } = useFormSecurity(formSchema, async (data) => {
    try {
      setApiError('');
      // Utiliser le service mock pour le login
      const resp = await authService.login(data.email, data.password);
      if (resp?.user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setApiError(error.userMessage || error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');
    handleFormSubmit(e);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-200 to-dark-300 px-4">
      <div className="w-full max-w-md bg-dark-300/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple to-pink rounded-lg mb-4">
            <span className="text-white text-xl font-bold">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Connexion Sécurisée</h1>
          <p className="text-gray-400">Accédez à votre tableau de bord</p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">🚨 {apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="bendelothielcy@gmail.com"
                value={formData.email || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600/50 focus:ring-purple/50 focus:border-purple/50'
                } disabled:opacity-50`}
              />
              <span className="absolute right-3 top-3 text-gray-500">✉️</span>
            </div>
            {touched.email && errors.email && (
              <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-purple hover:text-pink transition"
              >
                {showPassword ? '👁️ Masquer' : '👁️ Afficher'}
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="bendelo1996$$$$$"
                value={formData.password || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  touched.password && errors.password
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600/50 focus:ring-purple/50 focus:border-purple/50'
                } disabled:opacity-50`}
              />
              <span className="absolute right-3 top-3 text-gray-500">🔒</span>
            </div>
            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 hover:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 text-purple focus:ring-purple"
              />
              <span>Se souvenir de moi</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-purple hover:text-pink transition"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple to-pink text-white font-semibold rounded-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Connexion...
              </span>
            ) : (
              '✓ Se connecter'
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-xs leading-relaxed">
            🔐 <strong>Sécurité:</strong> Cette connexion est protégée par:
            <br />
            • Validation des données côté client
            <br />
            • Tokens CSRF automatiques
            <br />
            • Rate limiting anti-brute force
            <br />
            • Chiffrage SSL/TLS en transmission
          </p>
        </div>

        {/* Test Credentials */}
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-amber-300 text-xs leading-relaxed">
            🧪 <strong>Credentials de test (développement):</strong>
            <br />
            <strong>Email:</strong> admin@example.com
            <br />
            <strong>Mot de passe:</strong> Admin@12345
            <br />
            <em className="text-amber-400">Note: À remplacer par votre backend en production</em>
          </p>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Pas encore de compte?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-purple hover:text-pink transition font-semibold"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureLogin;
  