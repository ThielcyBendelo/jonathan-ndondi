import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import messagingService from '../services/messagingService';
import { toast } from 'react-toastify';

export default function MessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);

  const loadConversations = () => {
    setLoading(true);
    const allConversations = messagingService.getConversations();
    setConversations(allConversations);
    setLoading(false);
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      !searchQuery ||
      conv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || conv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);

    // Marquer comme lu
    if (conversation.unreadCount > 0) {
      messagingService.markAsRead(conversation.id);
      loadConversations(); // Recharger pour mettre à jour les compteurs
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const message = messagingService.sendMessage(selectedConversation.id, {
      content: newMessage,
      type: 'text',
      sender: 'admin',
    });

    if (message) {
      // Mettre à jour la conversation actuelle
      const updatedConversation = messagingService.getConversation(
        selectedConversation.id
      );
      setSelectedConversation(updatedConversation);

      // Recharger les conversations
      loadConversations();

      setNewMessage('');
      toast.success('Message envoyé');
    }
  };

  const handleStatusChange = (conversationId, newStatus) => {
    messagingService.updateConversationStatus(conversationId, newStatus);
    loadConversations();

    if (selectedConversation && selectedConversation.id === conversationId) {
      const updated = messagingService.getConversation(conversationId);
      setSelectedConversation(updated);
    }

    toast.success('Statut mis à jour');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    }

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    );
  }

  return (
    <div className="p-8 h-screen max-h-screen overflow-hidden">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Messagerie Client
        </h1>
        <p className="text-gray-400">Communication directe avec vos clients</p>
      </header>

      <div className="flex h-5/6 bg-dark-300 rounded-xl border border-dark-400 overflow-hidden">
        {/* Sidebar conversations */}
        <div className="w-1/3 border-r border-dark-400 flex flex-col">
          {/* Filtres et recherche */}
          <div className="p-4 border-b border-dark-400 space-y-3">
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple/50 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm"
            >
              <option value="all">Toutes les conversations</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="priority">Prioritaires</option>
              <option value="archived">Archivées</option>
            </select>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                {conversations.length === 0
                  ? '📝 Aucune conversation pour le moment'
                  : '🔍 Aucune conversation trouvée'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={selectedConversation?.id === conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    onStatusChange={handleStatusChange}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone de messages */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* En-tête conversation */}
              <ConversationHeader
                conversation={selectedConversation}
                onStatusChange={handleStatusChange}
              />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    formatTime={formatTime}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-dark-400"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple/50"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                             hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Envoyer 📤
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl mb-2">Sélectionnez une conversation</h3>
                <p>
                  Choisissez une conversation dans la liste pour commencer à
                  discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant item de conversation
function ConversationItem({
  conversation,
  isSelected,
  onClick,
  _onStatusChange,
  formatDate,
  formatTime,
}) {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      priority: 'bg-red-500',
      archived: 'bg-gray-500',
    };
    return colors[status] || 'bg-blue-500';
  };

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-purple/20 border border-purple/50'
          : 'hover:bg-dark-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(
              conversation.status
            )}`}
          ></div>
          <span className="font-medium text-white text-sm truncate">
            {conversation.clientName}
          </span>
        </div>

        {conversation.unreadCount > 0 && (
          <span className="bg-purple text-white text-xs px-2 py-1 rounded-full">
            {conversation.unreadCount}
          </span>
        )}
      </div>

      <div className="text-xs text-gray-400 mb-1">
        {conversation.clientEmail}
      </div>

      {conversation.lastMessage && (
        <div className="text-xs text-gray-500 truncate">
          {conversation.lastMessage.sender === 'admin' ? 'Vous: ' : ''}
          {conversation.lastMessage.content}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        {formatDate(conversation.lastActivity)}{' '}
        {formatTime(conversation.lastActivity)}
      </div>
    </div>
  );
}

// En-tête de conversation
function ConversationHeader({ conversation, onStatusChange }) {
  const statusOptions = messagingService.getConversationStatuses();

  return (
    <div className="p-4 border-b border-dark-400 bg-dark-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple to-pink rounded-full flex items-center justify-center text-white font-bold">
            {conversation.clientName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {conversation.clientName}
            </h3>
            <p className="text-sm text-gray-400">{conversation.clientEmail}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {conversation.projectId && (
            <Link
              to={`/admin/projects/${conversation.projectId}`}
              className="text-xs bg-purple/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple/30 transition-colors"
            >
              📋 Voir projet
            </Link>
          )}

          <select
            value={conversation.status}
            onChange={(e) => onStatusChange(conversation.id, e.target.value)}
            className="px-3 py-1 bg-dark-300 border border-dark-400 rounded text-white text-sm"
          >
            {statusOptions.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Bulle de message
function MessageBubble({ message, formatTime }) {
  const isAdmin = message.sender === 'admin';
  const isSystem =
    message.type === 'system' || message.type === 'status_update';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-dark-200 text-gray-400 text-sm px-4 py-2 rounded-lg max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-lg ${
          isAdmin
            ? 'bg-gradient-to-r from-purple to-pink text-white ml-auto'
            : 'bg-dark-200 text-gray-300'
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        <div
          className={`text-xs mt-2 flex items-center justify-between ${
            isAdmin ? 'text-white/70' : 'text-gray-500'
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isAdmin && <span className="ml-2">{message.read ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
}
