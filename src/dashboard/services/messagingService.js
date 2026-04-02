class MessagingService {
  constructor() {
    this.storageKey = 'monsite_messages';
    this.conversationsKey = 'monsite_conversations';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.conversationsKey)) {
      localStorage.setItem(
        this.conversationsKey,
        JSON.stringify(this.getSampleConversations())
      );
    }
  }

  // Types de messages
  getMessageTypes() {
    return [
      { id: 'text', label: 'Texte', icon: '💬' },
      { id: 'file', label: 'Fichier', icon: '📎' },
      { id: 'image', label: 'Image', icon: '🖼️' },
      { id: 'system', label: 'Système', icon: '🤖' },
      { id: 'status_update', label: 'Mise à jour', icon: '📋' },
    ];
  }

  // Statuts de conversation
  getConversationStatuses() {
    return [
      {
        id: 'active',
        label: 'Active',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
      },
      {
        id: 'pending',
        label: 'En attente',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
      },
      {
        id: 'archived',
        label: 'Archivée',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
      },
      {
        id: 'priority',
        label: 'Prioritaire',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
      },
    ];
  }

  // Récupérer toutes les conversations
  getConversations() {
    try {
      return JSON.parse(localStorage.getItem(this.conversationsKey)) || [];
    } catch {
      return [];
    }
  }

  // Sauvegarder les conversations
  saveConversations(conversations) {
    localStorage.setItem(this.conversationsKey, JSON.stringify(conversations));

    // Déclencher notification
    if (window.notificationService) {
      window.notificationService.checkForNewData();
    }
  }

  // Créer ou récupérer une conversation pour un projet/client
  getOrCreateConversation(
    clientEmail,
    projectId = null,
    clientName = 'Client'
  ) {
    let conversations = this.getConversations();

    // Chercher conversation existante
    let conversation = conversations.find(
      (c) =>
        c.clientEmail === clientEmail &&
        (projectId ? c.projectId === projectId : !c.projectId)
    );

    if (!conversation) {
      // Créer nouvelle conversation
      conversation = {
        id: this.generateId(),
        clientEmail: clientEmail,
        clientName: clientName,
        projectId: projectId,
        status: 'active',
        lastMessage: null,
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
        messages: [],
        createdAt: new Date().toISOString(),
        tags: [],
      };

      conversations.unshift(conversation);
      this.saveConversations(conversations);
    }

    return conversation;
  }

  // Envoyer un message
  sendMessage(conversationId, messageData) {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex === -1) return null;

    const newMessage = {
      id: this.generateId(),
      content: messageData.content,
      type: messageData.type || 'text',
      sender: messageData.sender || 'admin', // 'admin' or 'client'
      timestamp: new Date().toISOString(),
      read: false,
      attachments: messageData.attachments || [],
      metadata: messageData.metadata || {},
    };

    conversations[conversationIndex].messages.push(newMessage);
    conversations[conversationIndex].lastMessage = newMessage;
    conversations[conversationIndex].lastActivity = newMessage.timestamp;

    // Incrémenter compteur non lus si message du client
    if (messageData.sender === 'client') {
      conversations[conversationIndex].unreadCount++;
    }

    this.saveConversations(conversations);

    // Notification
    if (messageData.sender === 'client' && window.notificationService) {
      window.notificationService.addNotification({
        type: 'new_message',
        title: 'Nouveau message client',
        message: `${
          conversations[conversationIndex].clientName
        }: ${messageData.content.substring(0, 50)}...`,
      });
    }

    return newMessage;
  }

  // Marquer messages comme lus
  markAsRead(conversationId, messageIds = null) {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex === -1) return false;

    const conversation = conversations[conversationIndex];

    if (messageIds) {
      // Marquer messages spécifiques
      conversation.messages.forEach((message) => {
        if (messageIds.includes(message.id)) {
          message.read = true;
        }
      });
    } else {
      // Marquer tous les messages non lus
      conversation.messages.forEach((message) => {
        if (!message.read && message.sender === 'client') {
          message.read = true;
        }
      });
      conversation.unreadCount = 0;
    }

    this.saveConversations(conversations);
    return true;
  }

  // Récupérer une conversation avec ses messages
  getConversation(conversationId) {
    const conversations = this.getConversations();
    return conversations.find((c) => c.id === conversationId) || null;
  }

  // Archiver une conversation
  archiveConversation(conversationId) {
    return this.updateConversationStatus(conversationId, 'archived');
  }

  // Mettre à jour le statut d'une conversation
  updateConversationStatus(conversationId, status) {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex === -1) return false;

    conversations[conversationIndex].status = status;
    conversations[conversationIndex].lastActivity = new Date().toISOString();

    this.saveConversations(conversations);
    return true;
  }

  // Ajouter des tags à une conversation
  addTags(conversationId, tags) {
    const conversations = this.getConversations();
    const conversationIndex = conversations.findIndex(
      (c) => c.id === conversationId
    );

    if (conversationIndex === -1) return false;

    const conversation = conversations[conversationIndex];
    conversation.tags = [...new Set([...conversation.tags, ...tags])];

    this.saveConversations(conversations);
    return true;
  }

  // Rechercher dans les conversations
  searchConversations(query, filters = {}) {
    let conversations = this.getConversations();

    // Recherche textuelle
    if (query) {
      const searchLower = query.toLowerCase();
      conversations = conversations.filter((conversation) => {
        const matchesClient =
          conversation.clientName.toLowerCase().includes(searchLower) ||
          conversation.clientEmail.toLowerCase().includes(searchLower);

        const matchesMessages = conversation.messages.some((message) =>
          message.content.toLowerCase().includes(searchLower)
        );

        return matchesClient || matchesMessages;
      });
    }

    // Filtres
    if (filters.status) {
      conversations = conversations.filter((c) => c.status === filters.status);
    }

    if (filters.hasUnread) {
      conversations = conversations.filter((c) => c.unreadCount > 0);
    }

    if (filters.projectId) {
      conversations = conversations.filter(
        (c) => c.projectId === filters.projectId
      );
    }

    return conversations;
  }

  // Statistiques de messagerie
  getMessagingStats() {
    const conversations = this.getConversations();
    const messages = conversations.flatMap((c) => c.messages);

    const totalUnread = conversations.reduce(
      (sum, c) => sum + c.unreadCount,
      0
    );
    const activeConversations = conversations.filter(
      (c) => c.status === 'active'
    ).length;
    const todayMessages = messages.filter((m) => {
      const messageDate = new Date(m.timestamp);
      const today = new Date();
      return messageDate.toDateString() === today.toDateString();
    }).length;

    const responseTime = this.calculateAvgResponseTime(conversations);

    return {
      totalConversations: conversations.length,
      activeConversations,
      totalUnread,
      todayMessages,
      avgResponseTime: responseTime,
      byStatus: this.getConversationStatuses().reduce((acc, status) => {
        acc[status.id] = conversations.filter(
          (c) => c.status === status.id
        ).length;
        return acc;
      }, {}),
    };
  }

  // Calculer temps de réponse moyen
  calculateAvgResponseTime(conversations) {
    let totalResponseTime = 0;
    let responseCount = 0;

    conversations.forEach((conversation) => {
      const messages = conversation.messages.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      for (let i = 1; i < messages.length; i++) {
        const currentMsg = messages[i];
        const previousMsg = messages[i - 1];

        // Si réponse admin à message client
        if (currentMsg.sender === 'admin' && previousMsg.sender === 'client') {
          const responseTime =
            new Date(currentMsg.timestamp) - new Date(previousMsg.timestamp);
          totalResponseTime += responseTime;
          responseCount++;
        }
      }
    });

    if (responseCount === 0) return '0h';

    const avgMilliseconds = totalResponseTime / responseCount;
    const avgHours = Math.round(avgMilliseconds / (1000 * 60 * 60));

    return `${avgHours}h`;
  }

  // Envoyer message automatique de statut
  sendStatusUpdateMessage(conversationId, oldStatus, newStatus, projectTitle) {
    const statusLabels = {
      PENDING: 'En attente',
      IN_PROGRESS: 'En cours',
      REVIEW: 'En révision',
      COMPLETED: 'Terminé',
      CANCELLED: 'Annulé',
      ON_HOLD: 'En pause',
    };

    const message = {
      content: `📋 Le statut de votre projet "${projectTitle}" a été mis à jour de "${statusLabels[oldStatus]}" vers "${statusLabels[newStatus]}".`,
      type: 'status_update',
      sender: 'admin',
      metadata: {
        projectId: conversationId,
        oldStatus,
        newStatus,
        automated: true,
      },
    };

    return this.sendMessage(conversationId, message);
  }

  // Exporter les conversations
  exportConversations(format = 'json') {
    const conversations = this.getConversations();

    if (format === 'csv') {
      const headers = [
        'ID',
        'Client',
        'Email',
        'Projet',
        'Statut',
        'Messages',
        'Dernière activité',
      ];
      const csvData = [
        headers.join(','),
        ...conversations.map((c) =>
          [
            c.id,
            `"${c.clientName}"`,
            c.clientEmail,
            c.projectId || 'Aucun',
            c.status,
            c.messages.length,
            new Date(c.lastActivity).toLocaleDateString('fr-FR'),
          ].join(',')
        ),
      ].join('\n');

      return csvData;
    }

    return JSON.stringify(conversations, null, 2);
  }

  // Utilitaires
  generateId() {
    return (
      'conv_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Données d'exemple
  getSampleConversations() {
    return [
      {
        id: 'conv_001',
        clientEmail: 'marie.dubois@fashion.com',
        clientName: 'Marie Dubois',
        projectId: 'proj_001',
        status: 'active',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
        unreadCount: 1,
        tags: ['e-commerce', 'urgent'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 5 jours
        messages: [
          {
            id: 'msg_001',
            content:
              "Bonjour, j'aimerais avoir une estimation pour mon projet e-commerce.",
            type: 'text',
            sender: 'client',
            timestamp: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
            read: true,
          },
          {
            id: 'msg_002',
            content:
              "Bonjour Marie ! Je vous remercie pour votre demande. Je vous prépare un devis détaillé que je vous enverrai d'ici demain.",
            type: 'text',
            sender: 'admin',
            timestamp: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000
            ).toISOString(),
            read: true,
          },
          {
            id: 'msg_003',
            content:
              "Parfait ! Une dernière question : est-il possible d'intégrer un système de paiement Stripe ?",
            type: 'text',
            sender: 'client',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: false,
          },
        ],
        lastMessage: {
          id: 'msg_003',
          content:
            "Parfait ! Une dernière question : est-il possible d'intégrer un système de paiement Stripe ?",
          type: 'text',
          sender: 'client',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
      },
    ];
  }
}

// Instance unique
const messagingService = new MessagingService();
export default messagingService;
