import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const loadActivities = () => {
      const clients = dataService.getClients();
      const subscribers = dataService.getSubscribers();

      // Combiner et trier par date
      const allActivities = [
        ...clients.map((client) => ({
          id: `client-${client.id}`,
          type: 'client',
          title: `Nouvelle demande de ${client.name}`,
          subtitle: client.projectType || 'Projet non spécifié',
          time: new Date(client.createdAt),
          status: client.status,
          icon: '👤',
        })),
        ...subscribers.map((sub) => ({
          id: `subscriber-${sub.id}`,
          type: 'subscriber',
          title: 'Nouvel abonnement newsletter',
          subtitle: sub.email,
          time: new Date(sub.subscribedAt),
          status: sub.status,
          icon: '📧',
        })),
      ]
        .sort((a, b) => b.time - a.time)
        .slice(0, 8); // 8 activités les plus récentes

      setActivities(allActivities);
    };

    loadActivities();
    // Actualiser toutes les minutes
    const interval = setInterval(loadActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status, type) => {
    if (type === 'subscriber') return 'text-green-400';

    switch (status) {
      case 'nouveau':
        return 'text-blue-400';
      case 'en_cours':
        return 'text-orange-400';
      case 'termine':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusText = (status, type) => {
    if (type === 'subscriber') return 'Actif';

    switch (status) {
      case 'nouveau':
        return 'Nouveau';
      case 'en_cours':
        return 'En cours';
      case 'termine':
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-dark-300 rounded-xl p-6 shadow-lg border border-dark-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Activité Récente</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">En temps réel</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-3">📊</div>
            <p>Aucune activité récente</p>
            <p className="text-sm">Les nouvelles demandes apparaîtront ici</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 bg-dark-200 rounded-lg 
                                          hover:bg-dark-100/50 transition-colors duration-200"
            >
              <div className="text-2xl">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium truncate">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {getTimeAgo(activity.time)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm truncate mb-1">
                  {activity.subtitle}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      activity.status,
                      activity.type
                    )}`}
                  >
                    {getStatusText(activity.status, activity.type)}
                  </span>
                  {activity.type === 'client' && (
                    <span className="text-xs text-gray-500">•</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dark-400">
          <button
            className="w-full text-purple hover:text-pink text-sm font-medium 
                           transition-colors duration-200"
          >
            Voir toute l'activité →
          </button>
        </div>
      )}
    </div>
  );
}
