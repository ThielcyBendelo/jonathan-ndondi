import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import messagingService from '../services/messagingService';

// Composant de notification de nouveau message pour la sidebar
export default function MessageNotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Définir checkUnreadMessages AVANT le useEffect
  const checkUnreadMessages = useCallback(() => {
    const stats = messagingService.getMessagingStats();
    const newUnreadCount = stats.totalUnread;

    // Si nouveau message
    if (newUnreadCount > unreadCount) {
      setHasNewMessage(true);
      toast.info('💬 Nouveau message client reçu !', {
        onClick: () => {
          // Rediriger vers la messagerie
          window.location.href = '/admin/messages';
        },
      });

      // Animation flash
      setTimeout(() => setHasNewMessage(false), 3000);
    }

    setUnreadCount(newUnreadCount);
  }, [unreadCount]);

  // Utiliser useEffect APRÈS la définition de checkUnreadMessages
  useEffect(() => {
    // Vérifier les messages non lus au chargement
    checkUnreadMessages();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkUnreadMessages, 30000);

    return () => clearInterval(interval);
  }, [checkUnreadMessages]);

  if (unreadCount === 0) return null;

  return (
    <div className="relative">
      <span
        className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse ${
          hasNewMessage ? 'animate-bounce' : ''
        }`}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
}
