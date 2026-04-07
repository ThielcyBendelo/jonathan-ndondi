import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService.firebase';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await authService.signIn(email, password);
      const role = await authService.getUserRole(userCred.user.uid);
      toast.success('Authentification réussie');
      localStorage.setItem('dashboardUser', email);
      localStorage.setItem('dashboardRole', role);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo / Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-serif font-bold tracking-[0.3em] uppercase text-slate-900 dark:text-white mb-2">
            LEGACY<span className="text-slate-500 font-light not-italic">.Arch</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
            Espace Client Sécurisé
          </p>
        </div>

        {/* Formulaire Style Studio */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-sm">
          <h2 className="text-lg font-serif italic text-slate-900 dark:text-white mb-8 text-center border-b border-slate-100 dark:border-slate-800 pb-6">
            Accéder à vos projets
          </h2>

          <div className="space-y-6">
            {/* EMAIL */}
            <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-slate-900 dark:focus-within:border-white transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Identifiant</label>
              <div className="flex items-center">
                <FaEnvelope className="text-slate-300 mr-3 text-xs" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 focus-within:border-slate-900 dark:focus-within:border-white transition-all">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Mot de passe</label>
              <div className="flex items-center">
                <FaLock className="text-slate-300 mr-3 text-xs" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-12 bg-slate-950 dark:bg-white text-white dark:text-black py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
          >
            {loading ? 'Authentification...' : 'Ouvrir la session'}
          </button>

          <div className="mt-8 text-center">
            <a href="/contact" className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-b border-slate-200 dark:border-slate-800 pb-1">
              Demander un accès
            </a>
          </div>
        </form>

        {/* Footer discret */}
        <p className="mt-12 text-[9px] uppercase tracking-[0.4em] text-slate-400 text-center">
          © LEGACY Architects & co. | Systèmes Cryptés
        </p>
      </motion.div>
    </div>
  );
}
