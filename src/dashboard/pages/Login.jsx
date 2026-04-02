import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AdminLayout from '../components/AdminLayout';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login({ email, password });
      navigate('/admin');
    } catch (err) {
      setError(err.message || "Échec de l'authentification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-admin-surface p-6 rounded-2xl shadow-lg border border-admin-border">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 text-admin-text">
              Dashboard Admin
            </h2>
            <p className="text-admin-text-muted text-sm">
              Accès sécurisé - Bendelo Thielcy
            </p>
          </div>

          {error && (
            <div className="bg-admin-error/20 border border-admin-error text-admin-error px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">
                Email Administrateur
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text 
                         focus:border-admin-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-admin-text-muted mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
                className="w-full px-3 py-2 rounded-lg bg-admin-bg border border-admin-border text-admin-text 
                         focus:border-admin-accent focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-admin-accent hover:bg-admin-accent-hover text-white rounded-lg font-semibold
                       hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-admin-border">
            <a
              href="/"
              className="text-admin-text-muted hover:text-admin-accent text-sm flex items-center justify-center gap-2 transition-colors"
            >
              ← Retour au site principal
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
