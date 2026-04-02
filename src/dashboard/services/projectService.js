// Service de gestion avancée des projets
class ProjectService {
  constructor() {
    this.storageKey = 'monsite_projects';
    this.statusTypes = {
      PENDING: { label: 'En attente', color: 'yellow', icon: '⏳' },
      IN_PROGRESS: { label: 'En cours', color: 'blue', icon: '🔄' },
      REVIEW: { label: 'En révision', color: 'purple', icon: '👀' },
      COMPLETED: { label: 'Terminé', color: 'green', icon: '✅' },
      CANCELLED: { label: 'Annulé', color: 'red', icon: '❌' },
      ON_HOLD: { label: 'En pause', color: 'orange', icon: '⏸️' },
    };

    this.priorityTypes = {
      LOW: { label: 'Faible', color: 'gray', value: 1 },
      MEDIUM: { label: 'Moyenne', color: 'yellow', value: 2 },
      HIGH: { label: 'Haute', color: 'orange', value: 3 },
      URGENT: { label: 'Urgent', color: 'red', value: 4 },
    };
  }

  // Obtenir tous les projets
  getProjects() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey)) || [];
      if (stored.length === 0) {
        // Données d'exemple enrichies pour le lightbox
        const sampleProjects = this.getSampleProjects();
        this.saveProjects(sampleProjects);
        return sampleProjects;
      }
      return stored;
    } catch {
      return this.getSampleProjects();
    }
  }

  // Projets d'exemple avec données enrichies
  getSampleProjects() {
    return [
      {
        id: 'proj_001',
        title: 'Site E-commerce TechStart',
        description:
          'Site e-commerce moderne avec dashboard administrateur complet',
        fullDescription:
          "Développement d'un site e-commerce complet avec système de paiement intégré, gestion des stocks, dashboard administrateur et interface client moderne. Architecture responsive et optimisée pour le SEO.",
        client: {
          name: 'Marie Dubois',
          email: 'marie@techstart.com',
          phone: '+33 1 23 45 67 89',
          company: 'TechStart Solutions',
        },
        status: 'COMPLETED',
        priority: 'HIGH',
        progress: 100,
        budget: '€15,000',
        year: '2024',
        category: 'E-commerce',
        createdAt: '2024-01-15T10:00:00Z',
        deadline: '2024-03-15T23:59:59Z',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
        features: [
          'Système de paiement sécurisé',
          'Gestion des stocks en temps réel',
          'Dashboard administrateur',
          'Interface client responsive',
          'Optimisation SEO',
          'Système de notifications',
        ],
        images: [
          '/api/placeholder/1200/800',
          '/api/placeholder/1200/600',
          '/api/placeholder/800/600',
          '/api/placeholder/1000/700',
        ],
        image: '/api/placeholder/1200/800',
        liveUrl: 'https://techstart-demo.com',
        githubUrl: 'https://github.com/irbendelo/techstart',
        testimonial: {
          author: 'Marie Dubois',
          role: 'Directrice Marketing',
          content:
            "Ir Bendelo a transformé notre présence digitale. Le site web qu'ils ont créé a augmenté nos conversions de 150%. Une équipe professionnelle et créative !",
        },
        timeline: [
          {
            id: 'timeline_001',
            event: 'Projet créé',
            description:
              'Initialisation du projet et définition des spécifications',
            date: '2024-01-15T10:00:00Z',
            author: 'Admin',
          },
          {
            id: 'timeline_002',
            event: 'Design approuvé',
            description: 'Validation des maquettes par le client',
            date: '2024-01-25T14:30:00Z',
            author: 'Designer',
          },
          {
            id: 'timeline_003',
            event: 'Développement terminé',
            description: 'Finalisation du code et tests',
            date: '2024-03-10T16:00:00Z',
            author: 'Développeur',
          },
          {
            id: 'timeline_004',
            event: 'Projet livré',
            description: 'Mise en ligne et formation client',
            date: '2024-03-15T12:00:00Z',
            author: 'Chef de projet',
          },
        ],
        comments: [
          {
            id: 'comment_001',
            author: 'Marie Dubois',
            content:
              'Excellente collaboration, très satisfaite du résultat final !',
            date: '2024-03-15T15:30:00Z',
          },
        ],
      },
      {
        id: 'proj_002',
        title: 'App Mobile Innovation Labs',
        description: 'Application mobile native avec fonctionnalités avancées',
        fullDescription:
          "Développement d'une application mobile native iOS/Android avec système d'authentification, notifications push, géolocalisation et synchronisation cloud.",
        client: {
          name: 'Jean-Pierre Martin',
          email: 'jp@innovation-labs.fr',
          phone: '+33 6 78 90 12 34',
          company: 'Innovation Labs',
        },
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        progress: 75,
        budget: '€25,000',
        year: '2024',
        category: 'Mobile',
        createdAt: '2024-02-01T09:00:00Z',
        deadline: '2024-05-01T23:59:59Z',
        technologies: [
          'React Native',
          'Firebase',
          'Redux',
          'Maps API',
          'Push Notifications',
        ],
        features: [
          'Interface utilisateur intuitive',
          'Authentification sécurisée',
          'Notifications push',
          'Géolocalisation',
          'Mode hors-ligne',
          'Synchronisation cloud',
        ],
        images: [
          '/api/placeholder/600/1200',
          '/api/placeholder/600/1000',
          '/api/placeholder/800/600',
        ],
        image: '/api/placeholder/600/1200',
        testimonial: {
          author: 'Jean-Pierre Martin',
          role: 'CEO',
          content:
            "Un travail exceptionnel sur notre application mobile. L'interface utilisateur est intuitive et le design moderne. Nous recommandons vivement leurs services.",
        },
        timeline: [
          {
            id: 'timeline_005',
            event: 'Analyse des besoins',
            description: 'Étude approfondie des exigences client',
            date: '2024-02-01T09:00:00Z',
            author: 'Analyste',
          },
          {
            id: 'timeline_006',
            event: 'Prototype validé',
            description: 'Approbation du prototype interactif',
            date: '2024-02-15T11:00:00Z',
            author: 'UX Designer',
          },
        ],
        comments: [],
      },
      {
        id: 'proj_003',
        title: 'Site Vitrine Creative Studio',
        description: 'Site vitrine moderne avec portfolio interactif',
        fullDescription:
          "Création d'un site vitrine moderne pour studio créatif avec portfolio interactif, animations fluides et optimisation pour tous les appareils.",
        client: {
          name: 'Sophie Laurent',
          email: 'sophie@creativestudio.fr',
          company: 'Creative Studio',
        },
        status: 'COMPLETED',
        priority: 'MEDIUM',
        progress: 100,
        budget: '€8,000',
        year: '2024',
        category: 'Vitrine',
        createdAt: '2024-01-20T14:00:00Z',
        deadline: '2024-02-20T23:59:59Z',
        technologies: ['Next.js', 'Framer Motion', 'Sanity CMS', 'Vercel'],
        features: [
          'Portfolio interactif',
          'Animations fluides',
          'CMS intégré',
          'Optimisation mobile',
          'Contact automatisé',
        ],
        images: [
          '/api/placeholder/1200/900',
          '/api/placeholder/1000/700',
          '/api/placeholder/800/600',
        ],
        image: '/api/placeholder/1200/900',
        liveUrl: 'https://creativestudio-demo.com',
        testimonial: {
          author: 'Sophie Laurent',
          role: 'Fondatrice',
          content:
            'Délais respectés, qualité irréprochable et un accompagnement personnalisé. Ir Bendelo comprend vraiment les besoins de ses clients.',
        },
        timeline: [
          {
            id: 'timeline_007',
            event: 'Brief créatif',
            description: "Définition de l'identité visuelle",
            date: '2024-01-20T14:00:00Z',
            author: 'Directeur artistique',
          },
        ],
        comments: [],
      },
    ];
  }

  // Sauvegarder les projets
  saveProjects(projects) {
    localStorage.setItem(this.storageKey, JSON.stringify(projects));

    // Déclencher l'événement pour les notifications
    if (window.dataService) {
      window.dataService.triggerUpdate('projects');
    }
  }

  // Créer un nouveau projet depuis les données de contact/formulaire
  createProjectFromSubmission(submissionData, type = 'contact') {
    const projects = this.getProjects();
    const projectId = `proj_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newProject = {
      id: projectId,
      title: this.generateProjectTitle(submissionData, type),
      description: submissionData.message || submissionData.description || '',
      client: {
        name:
          submissionData.name || submissionData.clientName || 'Client Anonyme',
        email: submissionData.email || '',
        phone: submissionData.phone || submissionData.telephone || '',
        company: submissionData.company || submissionData.entreprise || '',
      },
      status: 'PENDING',
      priority: this.determinePriority(submissionData, type),
      budget: submissionData.budget || null,
      deadline: submissionData.deadline || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: type, // 'contact', 'advanced', 'subscription'
      progress: 0,
      estimatedHours: submissionData.estimatedHours || null,
      technologies: submissionData.technologies || [],
      files: submissionData.files || [],
      timeline: [
        {
          id: `timeline_${Date.now()}`,
          event: 'Projet créé',
          description: `Projet créé automatiquement depuis ${
            type === 'contact'
              ? 'le formulaire de contact'
              : 'le formulaire avancé'
          }`,
          date: new Date().toISOString(),
          author: 'Système',
          type: 'created',
        },
      ],
      comments: [],
      tags: this.generateTags(submissionData, type),
    };

    projects.unshift(newProject);
    this.saveProjects(projects);

    return newProject;
  }

  // Générer un titre de projet automatiquement
  generateProjectTitle(data, type) {
    const clientName = data.name || data.clientName || 'Client';
    const projectType = data.projectType || data.serviceType || 'Projet Web';

    if (type === 'advanced' && data.projectType) {
      return `${projectType} - ${clientName}`;
    }

    return `Demande de ${clientName}`;
  }

  // Déterminer la priorité automatiquement
  determinePriority(data, _type) {
    if (data.priority) return data.priority;

    // Logique automatique de priorité
    if (data.budget && parseInt(data.budget.replace(/\D/g, '')) > 5000)
      return 'HIGH';
    if (data.deadline) {
      const deadline = new Date(data.deadline);
      const now = new Date();
      const daysDiff = (deadline - now) / (1000 * 60 * 60 * 24);
      if (daysDiff < 7) return 'URGENT';
      if (daysDiff < 30) return 'HIGH';
    }

    return 'MEDIUM';
  }

  // Générer des tags automatiquement
  generateTags(data, type) {
    const tags = [type];

    if (data.projectType) tags.push(data.projectType.toLowerCase());
    if (data.technologies)
      tags.push(...data.technologies.map((tech) => tech.toLowerCase()));
    if (data.budget) tags.push('budget-défini');
    if (data.deadline) tags.push('deadline');

    return [...new Set(tags)]; // Éliminer les doublons
  }

  // Mettre à jour un projet
  updateProject(projectId, updates) {
    const projects = this.getProjects();
    const projectIndex = projects.findIndex((p) => p.id === projectId);

    if (projectIndex === -1) return null;

    const updatedProject = {
      ...projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    projects[projectIndex] = updatedProject;
    this.saveProjects(projects);

    return updatedProject;
  }

  // Changer le statut d'un projet
  changeStatus(projectId, newStatus, comment = '') {
    const project = this.updateProject(projectId, { status: newStatus });

    if (project) {
      this.addTimelineEvent(projectId, {
        event: `Statut changé vers ${this.statusTypes[newStatus].label}`,
        description:
          comment ||
          `Le projet est maintenant ${this.statusTypes[
            newStatus
          ].label.toLowerCase()}`,
        type: 'status_change',
        author: 'Admin',
      });
    }

    return project;
  }

  // Ajouter un événement à la timeline
  addTimelineEvent(projectId, eventData) {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) return null;

    const timelineEvent = {
      id: `timeline_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      date: new Date().toISOString(),
      author: eventData.author || 'Admin',
      ...eventData,
    };

    project.timeline.unshift(timelineEvent);
    this.saveProjects(projects);

    return timelineEvent;
  }

  // Ajouter un commentaire
  addComment(projectId, comment, author = 'Admin') {
    const projects = this.getProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) return null;

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      content: comment,
      author: author,
      date: new Date().toISOString(),
      edited: false,
    };

    project.comments.unshift(newComment);

    // Ajouter aussi à la timeline
    this.addTimelineEvent(projectId, {
      event: 'Nouveau commentaire',
      description:
        comment.substring(0, 100) + (comment.length > 100 ? '...' : ''),
      type: 'comment',
      author: author,
    });

    this.saveProjects(projects);
    return newComment;
  }

  // Mettre à jour le progrès
  updateProgress(projectId, progress) {
    const project = this.updateProject(projectId, {
      progress: Math.min(100, Math.max(0, progress)),
    });

    if (project) {
      this.addTimelineEvent(projectId, {
        event: 'Progression mise à jour',
        description: `Progression du projet : ${progress}%`,
        type: 'progress',
        author: 'Admin',
      });
    }

    return project;
  }

  // Obtenir les statistiques des projets
  getProjectStats() {
    const projects = this.getProjects();

    const statusCounts = Object.keys(this.statusTypes).reduce((acc, status) => {
      acc[status] = projects.filter((p) => p.status === status).length;
      return acc;
    }, {});

    const priorityCounts = Object.keys(this.priorityTypes).reduce(
      (acc, priority) => {
        acc[priority] = projects.filter((p) => p.priority === priority).length;
        return acc;
      },
      {}
    );

    const totalBudget = projects.reduce((sum, p) => {
      if (p.budget) {
        const budget = parseInt(p.budget.toString().replace(/\D/g, ''));
        return sum + (isNaN(budget) ? 0 : budget);
      }
      return sum;
    }, 0);

    const completedProjects = projects.filter((p) => p.status === 'COMPLETED');
    const avgCompletionTime =
      completedProjects.length > 0
        ? completedProjects.reduce((sum, p) => {
            const created = new Date(p.createdAt);
            const updated = new Date(p.updatedAt);
            return sum + (updated - created) / (1000 * 60 * 60 * 24);
          }, 0) / completedProjects.length
        : 0;

    return {
      total: projects.length,
      byStatus: statusCounts,
      byPriority: priorityCounts,
      totalBudget,
      avgCompletionTime: Math.round(avgCompletionTime),
      recentProjects: projects.slice(0, 5),
      urgentProjects: projects.filter(
        (p) => p.priority === 'URGENT' && p.status !== 'COMPLETED'
      ).length,
    };
  }

  // Recherche et filtrage
  searchProjects(query, filters = {}) {
    let projects = this.getProjects();

    // Recherche textuelle
    if (query) {
      query = query.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.client.name.toLowerCase().includes(query) ||
          p.client.email.toLowerCase().includes(query)
      );
    }

    // Filtres
    if (filters.status) {
      projects = projects.filter((p) => p.status === filters.status);
    }

    if (filters.priority) {
      projects = projects.filter((p) => p.priority === filters.priority);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      projects = projects.filter((p) => {
        const projectDate = new Date(p.createdAt);
        return projectDate >= new Date(start) && projectDate <= new Date(end);
      });
    }

    return projects;
  }

  // Supprimer un projet
  deleteProject(projectId) {
    const projects = this.getProjects();
    const filteredProjects = projects.filter((p) => p.id !== projectId);
    this.saveProjects(filteredProjects);
    return filteredProjects.length !== projects.length;
  }

  // Obtenir un projet par ID
  getProject(projectId) {
    const projects = this.getProjects();
    return projects.find((p) => p.id === projectId) || null;
  }

  // Exporter les projets
  exportProjects(format = 'json', filters = {}) {
    const projects = this.searchProjects('', filters);

    if (format === 'csv') {
      const headers = [
        'ID',
        'Titre',
        'Client',
        'Email',
        'Statut',
        'Priorité',
        'Progression',
        'Budget',
        'Créé le',
      ];
      const csvData = [
        headers.join(','),
        ...projects.map((p) =>
          [
            p.id,
            `"${p.title}"`,
            `"${p.client.name}"`,
            p.client.email,
            this.statusTypes[p.status].label,
            this.priorityTypes[p.priority].label,
            `${p.progress}%`,
            p.budget || 'N/A',
            new Date(p.createdAt).toLocaleDateString('fr-FR'),
          ].join(',')
        ),
      ].join('\n');

      return csvData;
    }

    return JSON.stringify(projects, null, 2);
  }
}

const projectService = new ProjectService();
export default projectService;
