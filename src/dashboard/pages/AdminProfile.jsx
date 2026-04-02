import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import authService from '../services/authService';
import notificationService from '../services/notificationService';

export default function AdminProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    currentEmail: 'bendelo.thielcy@admin.com',
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    firstName: 'Bendelo',
    lastName: 'Thielcy',
    title: 'Développeur Web Full Stack',
    bio: 'Passionné par le développement web moderne, spécialisé en React et JavaScript.',
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'fr',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
    emailNotifications: true,
    pushNotifications: true,
    soundNotifications: false,
    autoLogout: 30,
    showTutorials: true,
  });

  const [securityData] = useState({
    lastLogin: new Date().toISOString(),
    loginAttempts: [],
    activeSessions: 1,
    twoFactorEnabled: false,
  });

  const [stats, setStats] = useState({
    totalLogins: 0,
    averageSessionTime: 0,
    lastActivity: new Date().toISOString(),
    accountCreated: new Date().toISOString(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    // Charger les données utilisateur depuis localStorage
    const savedPrefs = localStorage.getItem('admin_preferences');
    if (savedPrefs) {
      setPreferences((prev) => ({ ...prev, ...JSON.parse(savedPrefs) }));
    }

    const loginHistory = localStorage.getItem('admin_login_history');
    if (loginHistory) {
      const history = JSON.parse(loginHistory);
      setStats((prev) => ({
        ...prev,
        totalLogins: history.length,
        lastActivity:
          history[history.length - 1]?.timestamp || new Date().toISOString(),
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setErrors({});

    const newErrors = {};

    // Validation email
    if (profileData.newEmail && !validateEmail(profileData.newEmail)) {
      newErrors.newEmail = 'Format email invalide';
    }

    // Validation mot de passe
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Mot de passe actuel requis';
      }
      if (!validatePassword(profileData.newPassword)) {
        newErrors.newPassword =
          'Le mot de passe doit contenir 8+ caractères, majuscule, minuscule, chiffre et caractère spécial';
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simuler la mise à jour
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mettre à jour authService avec les nouvelles données
      if (profileData.newEmail && profileData.newPassword) {
        // Ici vous pourriez mettre à jour le service d'auth
        toast.success('Profil mis à jour avec succès');
      } else if (profileData.newEmail) {
        toast.success('Email mis à jour avec succès');
      } else if (profileData.newPassword) {
        toast.success('Mot de passe mis à jour avec succès');
      } else {
        toast.success('Informations mises à jour avec succès');
      }

      // Reset des champs de mot de passe
      setProfileData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newEmail: '',
      }));
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = () => {
    localStorage.setItem('admin_preferences', JSON.stringify(preferences));

    // Appliquer les préférences de notifications
    notificationService.saveSettings({
      enabled: preferences.emailNotifications,
      showToasts: preferences.pushNotifications,
      sound: preferences.soundNotifications,
    });

    toast.success('Préférences sauvegardées');
  };

  const clearLoginHistory = () => {
    if (
      confirm("Êtes-vous sûr de vouloir effacer l'historique de connexion ?")
    ) {
      localStorage.removeItem('admin_login_history');
      setStats((prev) => ({ ...prev, totalLogins: 0 }));
      toast.success('Historique effacé');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'preferences', label: 'Préférences', icon: '⚙️' },
    { id: 'security', label: 'Sécurité', icon: '🔒' },
    { id: 'stats', label: 'Statistiques', icon: '📊' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profil Administrateur
        </h1>
        <p className="text-gray-400">Gérez votre compte et vos préférences</p>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-dark-300 rounded-2xl overflow-hidden">
        <div className="flex border-b border-dark-400">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple to-pink text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple to-pink rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  BT
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-gray-400">{profileData.title}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {profileData.currentEmail}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Informations personnelles */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">
                    Informations personnelles
                  </h3>

                  <div>
                    <label className="block text-gray-300 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Nom</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Titre/Poste
                    </label>
                    <input
                      type="text"
                      value={profileData.title}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Biographie
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows="4"
                      className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white resize-none"
                    />
                  </div>
                </div>

                {/* Sécurité du compte */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white">
                    Sécurité du compte
                  </h3>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nouvel email
                    </label>
                    <input
                      type="email"
                      value={profileData.newEmail}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          newEmail: e.target.value,
                        }))
                      }
                      placeholder="Laisser vide pour ne pas changer"
                      className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white ${
                        errors.newEmail ? 'border-red-500' : 'border-dark-400'
                      }`}
                    />
                    {errors.newEmail && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.newEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Requis pour changer le mot de passe"
                      className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white ${
                        errors.currentPassword
                          ? 'border-red-500'
                          : 'border-dark-400'
                      }`}
                    />
                    {errors.currentPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={profileData.newPassword}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      placeholder="Laisser vide pour ne pas changer"
                      className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white ${
                        errors.newPassword
                          ? 'border-red-500'
                          : 'border-dark-400'
                      }`}
                    />
                    {errors.newPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="Répétez le nouveau mot de passe"
                      className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white ${
                        errors.confirmPassword
                          ? 'border-red-500'
                          : 'border-dark-400'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                           hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                >
                  {isLoading
                    ? 'Mise à jour...'
                    : 'Sauvegarder les modifications'}
                </button>
              </div>
            </div>
          )}

          {/* Onglet Préférences */}
          {activeTab === 'preferences' && (
            <PreferencesTab
              preferences={preferences}
              setPreferences={setPreferences}
              onSave={handlePreferencesUpdate}
            />
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <SecurityTab
              securityData={securityData}
              onClearHistory={clearLoginHistory}
            />
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'stats' && <StatsTab stats={stats} />}
        </div>
      </div>
    </div>
  );
}

// Composant Préférences
function PreferencesTab({ preferences, setPreferences, onSave }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Préférences d'interface
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Thème</label>
            <select
              value={preferences.theme}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, theme: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value="dark">Sombre</option>
              <option value="light">Clair</option>
              <option value="auto">Automatique</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Langue</label>
            <select
              value={preferences.language}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  language: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Format de date</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  dateFormat: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Format d'heure</label>
            <select
              value={preferences.timeFormat}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  timeFormat: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value="24h">24 heures</option>
              <option value="12h">12 heures (AM/PM)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Notifications</h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  emailNotifications: e.target.checked,
                }))
              }
              className="w-5 h-5 text-purple bg-dark-200 border-dark-400 rounded focus:ring-purple"
            />
            <span className="text-gray-300">Notifications par email</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  pushNotifications: e.target.checked,
                }))
              }
              className="w-5 h-5 text-purple bg-dark-200 border-dark-400 rounded focus:ring-purple"
            />
            <span className="text-gray-300">Notifications push</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.soundNotifications}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  soundNotifications: e.target.checked,
                }))
              }
              className="w-5 h-5 text-purple bg-dark-200 border-dark-400 rounded focus:ring-purple"
            />
            <span className="text-gray-300">Sons de notification</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.showTutorials}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  showTutorials: e.target.checked,
                }))
              }
              className="w-5 h-5 text-purple bg-dark-200 border-dark-400 rounded focus:ring-purple"
            />
            <span className="text-gray-300">Afficher les tutoriels</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">Sécurité</h3>

        <div>
          <label className="block text-gray-300 mb-2">
            Déconnexion automatique (minutes)
          </label>
          <select
            value={preferences.autoLogout}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                autoLogout: parseInt(e.target.value),
              }))
            }
            className="w-full max-w-xs px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 heure</option>
            <option value={120}>2 heures</option>
            <option value={0}>Jamais</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all transform hover:scale-105"
        >
          Sauvegarder les préférences
        </button>
      </div>
    </div>
  );
}

// Composant Sécurité
function SecurityTab({ securityData, onClearHistory }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          État de la sécurité
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-green-400">🔐</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Dernière connexion</h4>
                <p className="text-gray-400 text-sm">
                  {formatDate(securityData.lastLogin)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span className="text-blue-400">🖥️</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">Sessions actives</h4>
                <p className="text-gray-400 text-sm">
                  {securityData.activeSessions} session(s)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  securityData.twoFactorEnabled
                    ? 'bg-green-500/20'
                    : 'bg-orange-500/20'
                }`}
              >
                <span
                  className={
                    securityData.twoFactorEnabled
                      ? 'text-green-400'
                      : 'text-orange-400'
                  }
                >
                  🛡️
                </span>
              </div>
              <div>
                <h4 className="text-white font-semibold">
                  Authentification 2FA
                </h4>
                <p className="text-gray-400 text-sm">
                  {securityData.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <span className="text-purple-400">📊</span>
              </div>
              <div>
                <h4 className="text-white font-semibold">
                  Tentatives de connexion
                </h4>
                <p className="text-gray-400 text-sm">
                  {securityData.loginAttempts.length} cette semaine
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Actions de sécurité
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                Effacer l'historique de connexion
              </h4>
              <p className="text-gray-400 text-sm">
                Supprime tous les logs de connexion
              </p>
            </div>
            <button
              onClick={onClearHistory}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Effacer
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                Activer l'authentification 2FA
              </h4>
              <p className="text-gray-400 text-sm">
                Sécurisez votre compte avec un second facteur
              </p>
            </div>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              onClick={() =>
                toast.info('Fonctionnalité disponible prochainement')
              }
            >
              Configurer
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                Déconnecter toutes les sessions
              </h4>
              <p className="text-gray-400 text-sm">
                Force la déconnexion de tous les appareils
              </p>
            </div>
            <button
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              onClick={() => toast.info('Session unique active')}
            >
              Déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Statistiques
function StatsTab({ stats }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Statistiques d'utilisation
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple mb-2">
              {stats.totalLogins}
            </div>
            <div className="text-gray-400 text-sm">Connexions totales</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {formatDuration(stats.averageSessionTime)}
            </div>
            <div className="text-gray-400 text-sm">Session moyenne</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {formatDate(stats.lastActivity)}
            </div>
            <div className="text-gray-400 text-sm">Dernière activité</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {formatDate(stats.accountCreated)}
            </div>
            <div className="text-gray-400 text-sm">Compte créé</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-6">
          Activité récente
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Connexion réussie</p>
              <p className="text-gray-400 text-sm">Aujourd'hui à 14:30</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Modification du profil</p>
              <p className="text-gray-400 text-sm">Hier à 16:45</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-200 rounded-lg">
            <div className="w-2 h-2 bg-purple rounded-full"></div>
            <div className="flex-1">
              <p className="text-white">Export de données</p>
              <p className="text-gray-400 text-sm">Il y a 3 jours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
