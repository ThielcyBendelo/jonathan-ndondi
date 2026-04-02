import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormSecurity from '../hooks/useFormSecurity';
import authService from '../services/authService';
import { register as apiRegister } from '../services/authApi';

const SecureRegister = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  const formSchema = {
    name: { type: 'text', minLength: 2, maxLength: 50, required: true },
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
    confirmPassword: { type: 'password', required: true },
  };

  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange: baseHandleChange,
    handleBlur,
    handleSubmit: handleFormSubmit,
  } = useFormSecurity(formSchema, async (data) => {
    try {
      setApiError('');

      // Vérifier que les mots de passe correspondent
      if (data.password !== data.confirmPassword) {
        setApiError('Les mots de passe ne correspondent pas');
        return;
      }

      // Appeler le service d'API pour l'inscription
      const resp = await apiRegister({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // NE PAS rediriger automatiquement vers le dashboard admin.
      // Les utilisateurs enregistrés obtiennent le rôle 'user' et ne doivent
      // pas accéder à l'admin. Rediriger vers le profil utilisateur.
      const user = resp?.user || authService.getCurrentUser();
      if (user?.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setApiError(error.userMessage || error.message || 'Erreur lors de l\'inscription');
    }
  });

  // Handler personnalisé pour afficher la force du mot de passe
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Afficher la force du mot de passe en temps réel
    if (name === 'password' && value.length > 0) {
      const strength = authService.validatePasswordStrength(value);
      setPasswordStrength(strength);
    } else if (name === 'password') {
      setPasswordStrength(null);
    }

    baseHandleChange(e);
  };

  const handleSubmit = (e) => {
  setApiError('');
  handleFormSubmit(e);
  };

  // Fonction pour afficher la couleur de force du mot de passe
  const getPasswordStrengthColor = (score) => {
    if (score <= 2) return 'text-red-400';
    if (score <= 3) return 'text-orange-400';
    if (score <= 4) return 'text-yellow-400';
    if (score <= 5) return 'text-lime-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-200 to-dark-300 px-4">
      <div className="w-full max-w-md bg-dark-300/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple to-pink rounded-lg mb-4">
            <span className="text-white text-xl font-bold">✍️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-gray-400">Rejoignez notre plateforme sécurisée</p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">🚨 {apiError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Nom complet
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Thielcy Bendelo"
                value={formData.name || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  touched.name && errors.name
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600/50 focus:ring-purple/50 focus:border-purple/50'
                } disabled:opacity-50`}
              />
              <span className="absolute right-3 top-3 text-gray-500">👤</span>
            </div>
            {touched.name && errors.name && (
              <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>
            )}
          </div>

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
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
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
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  touched.password && errors.password
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600/50 focus:ring-purple/50 focus:border-purple/50'
                } disabled:opacity-50`}
              />
              <span className="absolute right-3 top-3 text-gray-500">🔒</span>
            </div>

            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Force du mot de passe:</span>
                  <span className={`text-xs font-semibold ${getPasswordStrengthColor(passwordStrength.score)}`}>
                    {passwordStrength.strength} ({passwordStrength.score}/{passwordStrength.maxScore})
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      passwordStrength.score <= 2
                        ? 'bg-red-500 w-1/6'
                        : passwordStrength.score <= 3
                        ? 'bg-orange-500 w-1/3'
                        : passwordStrength.score <= 4
                        ? 'bg-yellow-500 w-1/2'
                        : passwordStrength.score <= 5
                        ? 'bg-lime-500 w-2/3'
                        : 'bg-green-500 w-full'
                    }`}
                  />
                </div>

                {/* Checklist de sécurité */}
                <div className="mt-2 space-y-1 text-xs">
                  <div className={passwordStrength.checks.length ? 'text-green-400' : 'text-gray-400'}>
                    {passwordStrength.checks.length ? '✓' : '○'} Au moins 8 caractères
                  </div>
                  <div className={passwordStrength.checks.uppercase ? 'text-green-400' : 'text-gray-400'}>
                    {passwordStrength.checks.uppercase ? '✓' : '○'} Majuscule (A-Z)
                  </div>
                  <div className={passwordStrength.checks.lowercase ? 'text-green-400' : 'text-gray-400'}>
                    {passwordStrength.checks.lowercase ? '✓' : '○'} Minuscule (a-z)
                  </div>
                  <div className={passwordStrength.checks.numbers ? 'text-green-400' : 'text-gray-400'}>
                    {passwordStrength.checks.numbers ? '✓' : '○'} Chiffre (0-9)
                  </div>
                  <div className={passwordStrength.checks.special ? 'text-green-400' : 'text-gray-400'}>
                    {passwordStrength.checks.special ? '✓' : '○'} Caractère spécial (!@#$%^&*)
                  </div>
                </div>
              </div>
            )}

            {touched.password && errors.password && (
              <p className="text-red-400 text-xs mt-1">⚠️ {errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmer le mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs text-purple hover:text-pink transition"
              >
                {showConfirmPassword ? '👁️ Masquer' : '👁️ Afficher'}
              </button>
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={`w-full px-4 py-3 bg-dark-100/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-600/50 focus:ring-purple/50 focus:border-purple/50'
                } disabled:opacity-50`}
              />
              <span className="absolute right-3 top-3 text-gray-500">🔒</span>
            </div>

            {/* Vérifier la correspondance */}
            {formData.confirmPassword && formData.password && (
              <div className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                {formData.password === formData.confirmPassword ? '✓ Les mots de passe correspondent' : '✗ Les mots de passe ne correspondent pas'}
              </div>
            )}

            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">⚠️ {errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-1 rounded border-gray-600 text-purple focus:ring-purple"
              required
            />
            <label htmlFor="terms" className="text-xs text-gray-300">
              Je reconnais avoir lu et accepté les{' '}
              <button type="button" className="text-purple hover:text-pink transition">
                conditions d'utilisation
              </button>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple to-pink text-white font-semibold rounded-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Création du compte...
              </span>
            ) : (
              '✓ Créer un compte'
            )}
          </button>
        </form>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-300 text-xs leading-relaxed">
            🔐 <strong>Votre compte est protégé par:</strong>
            <br />
            • Validation des données côté client
            <br />
            • Hashe bcrypt côté serveur
            <br />
            • Tokens JWT sécurisés
            <br />
            • Rate limiting anti-brute force
            <br />
            • Chiffrage SSL/TLS en transmission
          </p>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Vous avez déjà un compte?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-purple hover:text-pink transition font-semibold"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecureRegister;
