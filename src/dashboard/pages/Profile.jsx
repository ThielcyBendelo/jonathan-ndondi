import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import notificationService from '../services/notificationService';
import '../styles/profile.css';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'Bendelo Thielcy',
    email: 'bendelo.thielcy@admin.com',
    role: 'Administrateur Principal',
    lastLogin: new Date().toISOString(),
    loginCount: 1,
    createdAt: new Date().toISOString(),
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    notifications: notificationService.getSettings(),
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'dd/mm/yyyy',
    autoSave: true,
    theme: 'dark',
  });

  const [stats] = useState({
    totalLogins: 1,
    lastActivity: new Date().toISOString(),
    avgSessionDuration: '2h 30min',
    securityScore: 85,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Charger les données du profil depuis localStorage ou authService
    const user = authService.getUser();
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        email: user.email,
        lastLogin: user.loginTime || prev.lastLogin,
      }));
    }
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simuler la mise à jour du profil
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Profil mis à jour avec succès');
    } catch {
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      // Simuler le changement de mot de passe
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Réinitialiser les champs
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Mot de passe modifié avec succès');
    } catch {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async (newPreferences) => {
    setIsLoading(true);

    try {
      setPreferences(newPreferences);

      // Sauvegarder les préférences de notifications
      notificationService.saveSettings(newPreferences.notifications);

      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Préférences sauvegardées');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    { id: 'security', label: 'Sécurité', icon: '🔐' },
    { id: 'preferences', label: 'Préférences', icon: '⚙️' },
    { id: 'activity', label: 'Activité', icon: '📊' },
  ];

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Profil Administrateur
        </h1>
        <p className="text-gray-400">Gérez votre compte et vos préférences</p>
      </header>

      {/* Tabs Navigation */}
      <div className="flex space-x-1 mb-8 bg-dark-300 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple to-pink text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-dark-400'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-dark-300 rounded-2xl p-6 border border-dark-400">
        {activeTab === 'profile' && (
          <ProfileTab
            profileData={profileData}
            setProfileData={setProfileData}
            onSubmit={handleProfileUpdate}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'security' && (
          <SecurityTab
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onPasswordChange={handlePasswordChange}
            stats={stats}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'preferences' && (
          <PreferencesTab
            preferences={preferences}
            onUpdate={handlePreferencesUpdate}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'activity' && <ActivityTab stats={stats} />}
      </div>
    </div>
  );
}

// Onglet Profil
function ProfileTab({ profileData, setProfileData, onSubmit, isLoading }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">
        Informations du profil
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">Nom complet</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                       focus:outline-none focus:ring-2 focus:ring-purple/50"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                       focus:outline-none focus:ring-2 focus:ring-purple/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Rôle</label>
          <input
            type="text"
            value={profileData.role}
            disabled
            className="w-full px-4 py-3 bg-dark-400 border border-dark-400 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">
              Dernière connexion
            </label>
            <input
              type="text"
              value={new Date(profileData.lastLogin).toLocaleDateString(
                'fr-FR',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              )}
              disabled
              className="w-full px-4 py-3 bg-dark-400 border border-dark-400 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Compte créé le</label>
            <input
              type="text"
              value={new Date(profileData.createdAt).toLocaleDateString(
                'fr-FR',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }
              )}
              disabled
              className="w-full px-4 py-3 bg-dark-400 border border-dark-400 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? 'Mise à jour...' : 'Mettre à jour le profil'}
        </button>
      </form>
    </div>
  );
}

// Onglet Sécurité
function SecurityTab({
  passwordData,
  setPasswordData,
  onPasswordChange,
  stats,
  isLoading,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-6">
          Sécurité du compte
        </h2>

        {/* Score de sécurité */}
        <div className="bg-dark-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Score de sécurité</span>
            <span
              className={`font-bold ${
                stats.securityScore >= 80 ? 'text-green-400' : 'text-yellow-400'
              }`}
            >
              {stats.securityScore}/100
            </span>
          </div>
          <div className="w-full bg-dark-400 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                stats.securityScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${stats.securityScore}%` }}
            />
          </div>
        </div>

        {/* Changement de mot de passe */}
        <form onSubmit={onPasswordChange} className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Changer le mot de passe
          </h3>

          <div>
            <label className="block text-gray-300 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                       focus:outline-none focus:ring-2 focus:ring-purple/50"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple/50"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple/50"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                     hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Changement...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      {/* Conseils de sécurité */}
      <div className="bg-dark-200 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">
          🔐 Conseils de sécurité :
        </h4>
        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
          <li>Utilisez un mot de passe de 12 caractères minimum</li>
          <li>Combinez lettres, chiffres et symboles</li>
          <li>Évitez les informations personnelles</li>
          <li>Changez votre mot de passe régulièrement</li>
        </ul>
      </div>
    </div>
  );
}

// Onglet Préférences
function PreferencesTab({ preferences, onUpdate }) {
  const handleChange = (section, key, value) => {
    const newPreferences = {
      ...preferences,
      [section]:
        section === 'notifications'
          ? { ...preferences.notifications, [key]: value }
          : section === key
          ? value
          : preferences[section],
    };

    if (section !== 'notifications') {
      newPreferences[key] = value;
    }

    onUpdate(newPreferences);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-white mb-6">Préférences</h2>

      {/* Notifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">🔔 Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-gray-300">Notifications activées</span>
            <input
              type="checkbox"
              checked={preferences.notifications.enabled}
              onChange={(e) =>
                handleChange('notifications', 'enabled', e.target.checked)
              }
              className="toggle-checkbox"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-300">Notifications toast</span>
            <input
              type="checkbox"
              checked={preferences.notifications.showToasts}
              onChange={(e) =>
                handleChange('notifications', 'showToasts', e.target.checked)
              }
              className="toggle-checkbox"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-gray-300">Vérification automatique</span>
            <input
              type="checkbox"
              checked={preferences.notifications.autoCheck}
              onChange={(e) =>
                handleChange('notifications', 'autoCheck', e.target.checked)
              }
              className="toggle-checkbox"
            />
          </label>
        </div>
      </div>

      {/* Interface */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">🎨 Interface</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Langue</label>
            <select
              value={preferences.language}
              onChange={(e) => handleChange('', 'language', e.target.value)}
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
              onChange={(e) => handleChange('', 'dateFormat', e.target.value)}
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value="dd/mm/yyyy">DD/MM/YYYY</option>
              <option value="mm/dd/yyyy">MM/DD/YYYY</option>
              <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Système */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">⚙️ Système</h3>
        <label className="flex items-center justify-between">
          <span className="text-gray-300">Sauvegarde automatique</span>
          <input
            type="checkbox"
            checked={preferences.autoSave}
            onChange={(e) => handleChange('', 'autoSave', e.target.checked)}
            className="toggle-checkbox"
          />
        </label>
      </div>
    </div>
  );
}

// Onglet Activité
function ActivityTab({ stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Activité du compte</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xl">🔑</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total connexions</p>
              <p className="text-white text-2xl font-bold">
                {stats.totalLogins}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-xl">⏱️</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Session moyenne</p>
              <p className="text-white text-lg font-bold">
                {stats.avgSessionDuration}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-xl">🕐</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Dernière activité</p>
              <p className="text-white text-sm font-bold">
                {new Date(stats.lastActivity).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-orange-400 text-xl">🛡️</span>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score sécurité</p>
              <p className="text-white text-2xl font-bold">
                {stats.securityScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-dark-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Activité récente
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Connexion réussie</span>
            <span className="text-gray-500 text-sm ml-auto">
              Aujourd'hui 14:30
            </span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Profil mis à jour</span>
            <span className="text-gray-500 text-sm ml-auto">Hier 16:45</span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300">Export de données</span>
            <span className="text-gray-500 text-sm ml-auto">
              Il y a 2 jours
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
