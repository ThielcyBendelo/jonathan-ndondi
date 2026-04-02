// Service de données centralisé pour le site public et le dashboard admin
// Utilise localStorage comme base de données temporaire (à remplacer par API)

const DATA_KEYS = {
  CLIENTS: 'monsite_clients',
  SUBSCRIBERS: 'monsite_subscribers',
  PROJECT_REQUESTS: 'monsite_project_requests',
  TESTIMONIALS: 'monsite_testimonials',
};

class DataService {
  // Témoignages clients
  addTestimonial(testimonialData) {
    try {
      const testimonials = this.getTestimonials();
      const newTestimonial = {
        id: Date.now(),
        name: testimonialData.name,
        email: testimonialData.email || '',
        text: testimonialData.text,
        rating: testimonialData.rating || 5,
        date: new Date().toISOString(),
      };
      testimonials.push(newTestimonial);
      localStorage.setItem(DATA_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      // Notification
      if (typeof window !== 'undefined' && window.notificationService) {
        window.notificationService.addNotification(
          'new_testimonial',
          'Nouveau témoignage',
          `${testimonialData.name} a laissé un avis`,
          { testimonialId: newTestimonial.id, priority: 'normal' }
        );
      }
      return newTestimonial;
    } catch (error) {
      console.error("Erreur lors de l'ajout du témoignage:", error);
      throw error;
    }
  }

  getTestimonials() {
    const data = localStorage.getItem(DATA_KEYS.TESTIMONIALS);
    return data ? JSON.parse(data) : [];
  }
  // Clients (inscriptions pour projets)
  addClient(clientData) {
    try {
      const clients = this.getClients();
      const newClient = {
        id: Date.now(),
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone || '',
        company: clientData.company || '',
        projectType: clientData.projectType || '',
        budget: clientData.budget || '',
        message: clientData.message || '',
        status: 'nouveau',
        createdAt: new Date().toISOString(),
      };
      clients.push(newClient);
      localStorage.setItem(DATA_KEYS.CLIENTS, JSON.stringify(clients));

      // Créer automatiquement un projet
      this.createProjectFromClient(newClient, 'contact');

      // Notifier le service de notifications
      if (typeof window !== 'undefined' && window.notificationService) {
        window.notificationService.addNotification(
          'new_client',
          'Nouvelle demande de projet',
          `${clientData.name} a soumis une demande de projet`,
          { clientId: newClient.id, priority: 'high' }
        );
      }

      return newClient;
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      throw error;
    }
  }

  getClients() {
    const data = localStorage.getItem(DATA_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  }

  updateClient(id, updates) {
    const clients = this.getClients();
    const index = clients.findIndex((c) => c.id === id);
    if (index !== -1) {
      const oldClient = { ...clients[index] };
      clients[index] = { ...clients[index], ...updates };
      localStorage.setItem(DATA_KEYS.CLIENTS, JSON.stringify(clients));

      // Notifier si changement de statut
      if (
        updates.status &&
        updates.status !== oldClient.status &&
        window.notificationService
      ) {
        window.notificationService.notifyStatusChange(
          id,
          oldClient.status,
          updates.status,
          oldClient.name
        );
      }

      return clients[index];
    }
    return null;
  }

  deleteClient(id) {
    const clients = this.getClients();
    const filtered = clients.filter((c) => c.id !== id);
    localStorage.setItem(DATA_KEYS.CLIENTS, JSON.stringify(filtered));
    return true;
  }

  // Abonnés newsletter
  addSubscriber(email) {
    try {
      const subscribers = this.getSubscribers();
      if (subscribers.find((s) => s.email === email)) {
        throw new Error('Email déjà abonné');
      }
      const newSub = {
        id: Date.now(),
        email,
        subscribedAt: new Date().toISOString(),
        status: 'actif',
      };
      subscribers.push(newSub);
      localStorage.setItem(DATA_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));

      // Notifier le service de notifications
      if (typeof window !== 'undefined' && window.notificationService) {
        window.notificationService.addNotification(
          'new_subscriber',
          'Nouvel abonné newsletter',
          `${email} s'est abonné à la newsletter`,
          { subscriberId: newSub.id, priority: 'normal' }
        );
      }

      return newSub;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'abonné:", error);
      throw error;
    }
  }

  getSubscribers() {
    const data = localStorage.getItem(DATA_KEYS.SUBSCRIBERS);
    return data ? JSON.parse(data) : [];
  }

  deleteSubscriber(id) {
    const subs = this.getSubscribers();
    const filtered = subs.filter((s) => s.id !== id);
    localStorage.setItem(DATA_KEYS.SUBSCRIBERS, JSON.stringify(filtered));
    return true;
  }

  // Statistiques pour le dashboard
  getStats() {
    const clients = this.getClients();
    const subscribers = this.getSubscribers();

    return {
      totalClients: clients.length,
      totalSubscribers: subscribers.length,
      newClientsThisMonth: clients.filter((c) => {
        const clientDate = new Date(c.createdAt);
        const thisMonth = new Date();
        return (
          clientDate.getMonth() === thisMonth.getMonth() &&
          clientDate.getFullYear() === thisMonth.getFullYear()
        );
      }).length,
      clientsByStatus: {
        nouveau: clients.filter((c) => c.status === 'nouveau').length,
        enCours: clients.filter((c) => c.status === 'en_cours').length,
        termine: clients.filter((c) => c.status === 'termine').length,
      },
    };
  }

  // Créer un projet automatiquement depuis une demande client
  createProjectFromClient(clientData, formType = 'contact') {
    try {
      // Import dynamique du service projet pour éviter les dépendances circulaires
      import('../dashboard/services/projectService.js').then(
        ({ default: projectService }) => {
          const projectData = {
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            company: clientData.company,
            message: clientData.message,
            projectType: clientData.projectType,
            budget: clientData.budget,
          };

          const project = projectService.createProjectFromSubmission(
            projectData,
            formType
          );

          if (project && window.notificationService) {
            window.notificationService.addNotification(
              'project_auto_created',
              'Projet créé automatiquement',
              `Un projet a été créé pour ${clientData.name}`,
              { projectId: project.id, priority: 'normal' }
            );
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la création automatique du projet:', error);
    }
  }

  // Créer un projet depuis le formulaire avancé
  addAdvancedProject(projectData) {
    try {
      // Ajouter aussi comme client pour la compatibilité
      const clientData = {
        name: projectData.name,
        email: projectData.email,
        phone: projectData.telephone,
        company: projectData.entreprise,
        projectType: projectData.projectType,
        budget: projectData.budget,
        message: projectData.description,
      };

      const client = this.addClient(clientData);

      // Créer le projet avancé
      import('../dashboard/services/projectService.js').then(
        ({ default: projectService }) => {
          const project = projectService.createProjectFromSubmission(
            projectData,
            'advanced'
          );

          if (project && window.notificationService) {
            window.notificationService.addNotification(
              'advanced_project_created',
              'Nouveau projet avancé',
              `Projet "${project.title}" créé avec formulaire complet`,
              { projectId: project.id, priority: 'high' }
            );
          }
        }
      );

      return client;
    } catch (error) {
      console.error("Erreur lors de l'ajout du projet avancé:", error);
      throw error;
    }
  }

  // Déclencher une mise à jour pour les notifications
  triggerUpdate(_type = 'general') {
    if (window.notificationService) {
      window.notificationService.checkForNewData();
    }
  }
}

export default new DataService();
