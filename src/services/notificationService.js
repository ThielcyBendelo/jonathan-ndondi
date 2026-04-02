import { toast } from 'react-toastify';
import analyticsService from './analyticsService';
import audioService from './audioService';

class NotificationService {
  // Success notifications
  success(message, options = {}) {
    audioService.playSuccess();
    analyticsService.trackEvent('notification_shown', {
      type: 'success',
      message: message.substring(0, 50),
    });
    return toast.success(message, {
      icon: '🎉',
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Error notifications
  error(message, options = {}) {
    audioService.playError();
    return toast.error(message, {
      icon: '❌',
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      autoClose: 6000, // Longer for errors
      ...options,
    });
  }

  // Warning notifications
  warning(message, options = {}) {
    return toast.warning(message, {
      icon: '⚠️',
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Info notifications
  info(message, options = {}) {
    audioService.playNotification();
    return toast.info(message, {
      icon: '💡',
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Loading notifications
  loading(message, options = {}) {
    return toast.loading(message, {
      icon: '⏳',
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Custom notifications
  custom(content, type = 'default', options = {}) {
    return toast(content, {
      type,
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Welcome notification
  welcome(name = 'Visiteur') {
    return this.success(
      `👋 Bienvenue ${name} ! Découvrez mes services et projets`,
      {
        autoClose: 5000,
      }
    );
  }

  // Form submission success
  formSuccess(
    title = 'Formulaire envoyé',
    message = 'Merci pour votre message !'
  ) {
    return this.success(`✅ ${title} - ${message}`, {
      autoClose: 4000,
    });
  }

  // Project request notification
  projectRequest(projectType) {
    return this.info(
      `🚀 Demande de projet - Formulaire ${projectType} ouvert avec succès`,
      {
        autoClose: 3000,
      }
    );
  }

  // Navigation notification
  navigate(section) {
    return this.info(`Navigation vers la section ${section}`, {
      autoClose: 2000,
      hideProgressBar: true,
      icon: '🧭',
    });
  }

  // File upload notifications
  fileUploaded(fileName, count = 1) {
    const message =
      count > 1
        ? `${count} fichiers ajoutés avec succès`
        : `${fileName} ajouté avec succès`;

    return this.success(message, {
      icon: '📎',
      autoClose: 3000,
    });
  }

  // Download notification
  downloadStart(fileName) {
    return this.info(`Téléchargement de ${fileName} en cours...`, {
      icon: '⬇️',
      autoClose: 2000,
    });
  }

  // Update/dismiss existing toast
  update(toastId, content, options = {}) {
    return toast.update(toastId, {
      render: content,
      className: 'custom-toast',
      bodyClassName: 'custom-toast-body',
      progressClassName: 'custom-toast-progress',
      ...options,
    });
  }

  // Dismiss specific toast
  dismiss(toastId) {
    return toast.dismiss(toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    return toast.dismiss();
  }
}

export default new NotificationService();
