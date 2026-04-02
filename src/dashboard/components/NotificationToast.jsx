import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import notificationService from '../services/notificationService';

export default function NotificationToast() {
  const [lastNotificationId, setLastNotificationId] = useState(null);

  useEffect(() => {
    const unsubscribe = notificationService.addListener(({ notifications }) => {
      // Obtenir la notification la plus récente
      const latestNotification = notifications[0];

      if (latestNotification && latestNotification.id !== lastNotificationId) {
        setLastNotificationId(latestNotification.id);
        showToastNotification(latestNotification);
      }
    });

    return unsubscribe;
  }, [lastNotificationId]);

  const showToastNotification = (notification) => {
    const settings = notificationService.getSettings();
    if (!settings.showToasts) return;

    const { title, message, data, type } = notification;

    const toastOptions = {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClick: () => {
        // Marquer comme lue quand on clique sur le toast
        notificationService.markAsRead(notification.id);
      },
    };

    // Personnaliser selon le type et la priorité
    switch (data.priority) {
      case 'high':
        toast.error(
          <NotificationContent
            title={title}
            message={message}
            type={type}
            icon="🚨"
          />,
          toastOptions
        );
        break;
      case 'normal':
        toast.info(
          <NotificationContent
            title={title}
            message={message}
            type={type}
            icon="ℹ️"
          />,
          toastOptions
        );
        break;
      case 'low':
        toast(
          <NotificationContent
            title={title}
            message={message}
            type={type}
            icon="📝"
          />,
          toastOptions
        );
        break;
      default:
        toast.info(
          <NotificationContent
            title={title}
            message={message}
            type={type}
            icon="📢"
          />,
          toastOptions
        );
    }
  };

  return null; // Ce composant ne rend rien visuellement
}

// Composant pour le contenu du toast
function NotificationContent({ title, message, type, icon }) {
  const getTypeLabel = (type) => {
    const labels = {
      new_client: 'Nouveau Client',
      new_subscriber: 'Nouvel Abonné',
      status_change: 'Changement Statut',
      system: 'Système',
    };
    return labels[type] || 'Notification';
  };

  return (
    <div className="flex items-start gap-3">
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <div className="font-semibold text-white mb-1">{title}</div>
        <div className="text-sm text-gray-300 mb-2">{message}</div>
        <div className="text-xs text-gray-400">
          {getTypeLabel(type)} • À l'instant
        </div>
      </div>
    </div>
  );
}
