import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import authService from '../services/authService';
import notificationService from '../services/notificationService';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Données du profil
  const [profileData, setProfileData] = useState({
    name: 'Bendelo Thielcy',
    email: 'bendelo.thielcy@admin.com',
    role: 'Administrateur Principal',
    joinedAt: '2024-01-01',
    lastLogin: new Date().toISOString(),
  });

  // Paramètres de sécurité
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30, // minutes
  });

  // Paramètres de notifications
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    showToasts: true,
    sound: false,
    autoCheck: true,
    checkInterval: 30000,
    emailNotifications: false,
    smsNotifications: false,
  });

  // Paramètres d'interface
  const [interfaceSettings, setInterfaceSettings] = useState({
    theme: 'dark',
    language: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/Paris',
    autoSave: true,
    compactMode: false,
  });

  // Statistiques d'activité
  const [activityStats, setActivityStats] = useState({
    totalLogins: 0,
    lastLoginIP: '192.168.1.1',
    sessionsToday: 1,
    averageSessionDuration: '2h 15min',
  });

  useEffect(() => {
    loadSettings();
    loadActivityStats();
  }, []);

  const loadSettings = () => {
    try {
      // Charger les paramètres de notifications existants
      const notifSettings = notificationService.getSettings();
      setNotificationSettings((prev) => ({ ...prev, ...notifSettings }));

      // Charger les autres paramètres depuis localStorage
      const savedInterface = localStorage.getItem('admin_interface_settings');
      if (savedInterface) {
        setInterfaceSettings(JSON.parse(savedInterface));
      }

      const savedSecurity = localStorage.getItem('admin_security_settings');
      if (savedSecurity) {
        const parsed = JSON.parse(savedSecurity);
        setSecuritySettings((prev) => ({
          ...prev,
          ...parsed,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  const loadActivityStats = () => {
    try {
      // Simuler des statistiques d'activité (à remplacer par de vraies données)
      const loginHistory = JSON.parse(
        localStorage.getItem('admin_login_history') || '[]'
      );
      setActivityStats({
        totalLogins: loginHistory.length,
        lastLoginIP: '192.168.1.1',
        sessionsToday: loginHistory.filter(
          (l) =>
            new Date(l.timestamp).toDateString() === new Date().toDateString()
        ).length,
        averageSessionDuration: '2h 15min',
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      // Valider l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        toast.error("Format d'email invalide");
        return;
      }

      // Sauvegarder les données du profil
      localStorage.setItem('admin_profile_data', JSON.stringify(profileData));

      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!securitySettings.currentPassword || !securitySettings.newPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (securitySettings.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);
    try {
      // Vérifier le mot de passe actuel (simulation)
      const currentCreds = {
        email: 'bendelo.thielcy@admin.com',
        password: 'BendeloAdmin2024!',
      };

      if (securitySettings.currentPassword !== currentCreds.password) {
        toast.error('Mot de passe actuel incorrect');
        return;
      }

      // Mettre à jour le mot de passe dans authService
      // Note: Dans un vrai système, cela se ferait côté serveur
      const newSettings = {
        ...securitySettings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };

      localStorage.setItem(
        'admin_security_settings',
        JSON.stringify(newSettings)
      );
      setSecuritySettings(newSettings);

      toast.success('Mot de passe mis à jour avec succès');

      // Déconnecter l'utilisateur pour qu'il se reconnecte avec le nouveau mot de passe
      setTimeout(() => {
        authService.logout();
        window.location.href = '/admin/login';
      }, 2000);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du mot de passe');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSettingsSave = () => {
    try {
      notificationService.saveSettings(notificationSettings);
      toast.success('Paramètres de notification sauvegardés');

      // Redémarrer la vérification auto si les paramètres ont changé
      if (notificationSettings.autoCheck) {
        notificationService.startAutoCheck(notificationSettings.checkInterval);
      } else {
        notificationService.stopAutoCheck();
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const handleInterfaceSettingsSave = () => {
    try {
      localStorage.setItem(
        'admin_interface_settings',
        JSON.stringify(interfaceSettings)
      );
      toast.success("Paramètres d'interface sauvegardés");

      // Appliquer le thème immédiatement si changé
      if (interfaceSettings.theme) {
        document.documentElement.setAttribute(
          'data-theme',
          interfaceSettings.theme
        );
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
      console.error(error);
    }
  };

  const clearAllData = () => {
    if (
      window.confirm(
        'Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.'
      )
    ) {
      if (
        window.confirm(
          'Dernière confirmation : toutes les données (clients, abonnés, notifications) seront supprimées définitivement.'
        )
      ) {
        try {
          // Effacer toutes les données
          localStorage.removeItem('monsite_clients');
          localStorage.removeItem('monsite_subscribers');
          localStorage.removeItem('monsite_notifications');
          localStorage.removeItem('monsite_last_notification_check');

          toast.success('Toutes les données ont été effacées');

          // Recharger la page après 2 secondes
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          toast.error("Erreur lors de l'effacement des données");
          console.error(error);
        }
      }
    }
  };

  const exportAllData = () => {
    try {
      const data = {
        clients: JSON.parse(localStorage.getItem('monsite_clients') || '[]'),
        subscribers: JSON.parse(
          localStorage.getItem('monsite_subscribers') || '[]'
        ),
        notifications: JSON.parse(
          localStorage.getItem('monsite_notifications') || '[]'
        ),
        exportedAt: new Date().toISOString(),
        version: '1.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin_backup_${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Sauvegarde exportée avec succès');
    } catch (error) {
      toast.error("Erreur lors de l'export");
      console.error(error);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profil', icon: '👤' },
    { id: 'security', name: 'Sécurité', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'interface', name: 'Interface', icon: '🎨' },
    { id: 'activity', name: 'Activité', icon: '📊' },
    { id: 'data', name: 'Données', icon: '💾' },
  ];

  return (
    <div className="min-h-screen bg-dark-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Paramètres du Profil
          </h1>
          <p className="text-gray-400">
            Gérez votre compte et les paramètres du dashboard
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-dark-300 rounded-2xl border border-dark-400 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-dark-400">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 min-w-fit transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple/20 text-purple border-b-2 border-purple'
                    : 'text-gray-400 hover:text-white hover:bg-dark-200'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileTab
                profileData={profileData}
                setProfileData={setProfileData}
                onSave={handleProfileSave}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'security' && (
              <SecurityTab
                securitySettings={securitySettings}
                setSecuritySettings={setSecuritySettings}
                onPasswordChange={handlePasswordChange}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                settings={notificationSettings}
                setSettings={setNotificationSettings}
                onSave={handleNotificationSettingsSave}
              />
            )}

            {activeTab === 'interface' && (
              <InterfaceTab
                settings={interfaceSettings}
                setSettings={setInterfaceSettings}
                onSave={handleInterfaceSettingsSave}
              />
            )}

            {activeTab === 'activity' && <ActivityTab stats={activityStats} />}

            {activeTab === 'data' && (
              <DataTab onClearAll={clearAllData} onExport={exportAllData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Onglet Profil
function ProfileTab({ profileData, setProfileData, onSave, isLoading }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-purple to-pink rounded-full flex items-center justify-center text-2xl font-bold text-white">
          {profileData.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
          <p className="text-gray-400">{profileData.role}</p>
          <p className="text-sm text-gray-500">
            Membre depuis{' '}
            {new Date(profileData.joinedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Nom complet</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Adresse email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          />
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

        <div>
          <label className="block text-gray-300 mb-2">Dernière connexion</label>
          <input
            type="text"
            value={new Date(profileData.lastLogin).toLocaleString('fr-FR')}
            disabled
            className="w-full px-4 py-3 bg-dark-400 border border-dark-400 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  );
}

// Onglet Sécurité
function SecurityTab({
  securitySettings,
  setSecuritySettings,
  onPasswordChange,
  isLoading,
}) {
  return (
    <div className="space-y-8">
      {/* Changement de mot de passe */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Changer le mot de passe
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={securitySettings.currentPassword}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={securitySettings.newPassword}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                value={securitySettings.confirmPassword}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">
              Exigences du mot de passe :
            </h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Au moins 8 caractères</li>
              <li>• Mélange de lettres majuscules et minuscules recommandé</li>
              <li>• Chiffres et caractères spéciaux recommandés</li>
            </ul>
          </div>

          <button
            onClick={onPasswordChange}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                     hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </div>
      </div>

      {/* Paramètres de session */}
      <div className="border-t border-dark-400 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Sécurité de session
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">
              Délai d'expiration de session (minutes)
            </label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) =>
                setSecuritySettings((prev) => ({
                  ...prev,
                  sessionTimeout: parseInt(e.target.value),
                }))
              }
              className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={120}>2 heures</option>
              <option value={480}>8 heures</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
            <div>
              <h4 className="text-white font-medium">
                Authentification à deux facteurs
              </h4>
              <p className="text-gray-400 text-sm">
                Sécurité renforcée avec code SMS (bientôt disponible)
              </p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorEnabled}
                onChange={(e) =>
                  setSecuritySettings((prev) => ({
                    ...prev,
                    twoFactorEnabled: e.target.checked,
                  }))
                }
                disabled
                className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Onglet Notifications
function NotificationsTab({ settings, setSettings, onSave }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Notifications activées</h4>
            <p className="text-gray-400 text-sm">
              Activer/désactiver toutes les notifications
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, enabled: e.target.checked }))
            }
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Notifications toast</h4>
            <p className="text-gray-400 text-sm">
              Afficher les notifications dans le coin de l'écran
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.showToasts}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, showToasts: e.target.checked }))
            }
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Vérification automatique</h4>
            <p className="text-gray-400 text-sm">
              Vérifier automatiquement les nouvelles données
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoCheck}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, autoCheck: e.target.checked }))
            }
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Intervalle de vérification
          </label>
          <select
            value={settings.checkInterval}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                checkInterval: parseInt(e.target.value),
              }))
            }
            disabled={!settings.autoCheck}
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white disabled:opacity-50"
          >
            <option value={15000}>15 secondes</option>
            <option value={30000}>30 secondes</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Son des notifications</h4>
            <p className="text-gray-400 text-sm">
              Jouer un son lors de nouvelles notifications (bientôt)
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, sound: e.target.checked }))
            }
            disabled
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded opacity-50"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all transform hover:scale-105"
        >
          Sauvegarder les notifications
        </button>
      </div>
    </div>
  );
}

// Onglet Interface
function InterfaceTab({ settings, setSettings, onSave }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Thème</label>
          <select
            value={settings.theme}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, theme: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          >
            <option value="dark">Sombre</option>
            <option value="light">Clair (bientôt)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Langue</label>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, language: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          >
            <option value="fr">Français</option>
            <option value="en">English (bientôt)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Format de date</label>
          <select
            value={settings.dateFormat}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, dateFormat: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Fuseau horaire</label>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, timezone: e.target.value }))
            }
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white"
          >
            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            <option value="UTC">UTC (GMT+0)</option>
            <option value="America/New_York">America/New_York (GMT-5)</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Sauvegarde automatique</h4>
            <p className="text-gray-400 text-sm">
              Sauvegarder automatiquement les modifications
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, autoSave: e.target.checked }))
            }
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-dark-200 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Mode compact</h4>
            <p className="text-gray-400 text-sm">
              Interface plus dense avec moins d'espacement
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.compactMode}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                compactMode: e.target.checked,
              }))
            }
            className="w-5 h-5 text-purple bg-dark-300 border-dark-400 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          className="px-6 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all transform hover:scale-105"
        >
          Sauvegarder l'interface
        </button>
      </div>
    </div>
  );
}

// Onglet Activité
function ActivityTab({ stats }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-dark-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Statistiques de connexion
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Total des connexions :</span>
              <span className="text-white font-semibold">
                {stats.totalLogins}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sessions aujourd'hui :</span>
              <span className="text-white font-semibold">
                {stats.sessionsToday}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Durée moyenne :</span>
              <span className="text-white font-semibold">
                {stats.averageSessionDuration}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dernière IP :</span>
              <span className="text-white font-mono text-sm">
                {stats.lastLoginIP}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-dark-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Sécurité du compte
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Mot de passe fort</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">2FA désactivé</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Session sécurisée</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Connexion récente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Historique récent
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-dark-400">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Connexion réussie</span>
            </div>
            <span className="text-gray-500 text-sm">Aujourd'hui, 14:30</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-400">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">Modification du profil</span>
            </div>
            <span className="text-gray-500 text-sm">Hier, 16:45</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dark-400">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple rounded-full"></div>
              <span className="text-gray-300">Export de données</span>
            </div>
            <span className="text-gray-500 text-sm">Il y a 2 jours, 10:20</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Onglet Données
function DataTab({ onClearAll, onExport }) {
  return (
    <div className="space-y-8">
      {/* Sauvegarde et restauration */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Sauvegarde et restauration
        </h3>
        <div className="space-y-4">
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium mb-2">
                  Exporter toutes les données
                </h4>
                <p className="text-gray-400 text-sm">
                  Téléchargez une sauvegarde complète de vos données (clients,
                  abonnés, notifications)
                </p>
              </div>
              <button
                onClick={onExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                📥 Exporter
              </button>
            </div>
          </div>

          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium mb-2">
                  Importer des données
                </h4>
                <p className="text-gray-400 text-sm">
                  Restaurez vos données depuis un fichier de sauvegarde (bientôt
                  disponible)
                </p>
              </div>
              <button
                disabled
                className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
              >
                📤 Importer (bientôt)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des données */}
      <div className="border-t border-dark-400 pt-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Statistiques des données
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple mb-1">
              {
                JSON.parse(localStorage.getItem('monsite_clients') || '[]')
                  .length
              }
            </div>
            <div className="text-gray-400 text-sm">Clients enregistrés</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {
                JSON.parse(localStorage.getItem('monsite_subscribers') || '[]')
                  .length
              }
            </div>
            <div className="text-gray-400 text-sm">Abonnés newsletter</div>
          </div>

          <div className="bg-dark-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {
                JSON.parse(
                  localStorage.getItem('monsite_notifications') || '[]'
                ).length
              }
            </div>
            <div className="text-gray-400 text-sm">Notifications</div>
          </div>
        </div>
      </div>

      {/* Zone dangereuse */}
      <div className="border-t border-red-500/20 pt-6">
        <h3 className="text-lg font-semibold text-red-400 mb-4">
          ⚠️ Zone dangereuse
        </h3>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium mb-2">
                Effacer toutes les données
              </h4>
              <p className="text-gray-400 text-sm">
                Supprime définitivement tous les clients, abonnés et
                notifications.
                <br />
                <strong className="text-red-400">
                  Cette action est irréversible !
                </strong>
              </p>
            </div>
            <button
              onClick={onClearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              🗑️ Tout effacer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
