import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService.firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCred = await authService.signIn(email, password);
      const role = await authService.getUserRole(userCred.user.uid);
      toast.success('Connexion réussie !');
      localStorage.setItem('dashboardUser', email);
      localStorage.setItem('dashboardRole', role);
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur de connexion : ' + err.message);
      toast.error('Erreur de connexion : ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-200">
      <form onSubmit={handleSubmit} className="bg-dark-300 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Connexion Admin</h2>
        <label className="block mb-2 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded border bg-dark-100 text-white"
          required
        />
        <label className="block mb-2 text-gray-300">Mot de passe</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 rounded border bg-dark-100 text-white"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="mb-4 px-3 py-1 bg-gray-700 text-white rounded"
        >
          {showPassword ? 'Masquer' : 'Afficher'} le mot de passe
        </button>
        {error && <div className="text-red-400 mb-4 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 bg-purple text-white font-bold rounded"
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
