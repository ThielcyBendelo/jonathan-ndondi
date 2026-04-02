import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import projectService from '../services/projectService';
import messagingService from '../services/messagingService';
import calendarService from '../services/calendarService';

export default function AdvancedDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Définir loadDashboardData AVANT le useEffect
  const loadDashboardData = useCallback(() => {
    setLoading(true);

    // Récupérer toutes les statistiques
    const projectStats = projectService.getProjectStats();
    const messagingStats = messagingService.getMessagingStats();
    const calendarStats = calendarService.getAppointmentStats();

    // Combiner les statistiques
    const combinedStats = {
      projects: projectStats,
      messaging: messagingStats,
      calendar: calendarStats,
      overview: {
        totalActiveWork:
          projectStats.byStatus.IN_PROGRESS + projectStats.byStatus.REVIEW,
        urgentItems: projectStats.urgentProjects + messagingStats.totalUnread,
        weeklyProgress: calculateWeeklyProgress(),
      },
    };

    setStats(combinedStats);

    // Activité récente combinée
    const activity = getCombinedActivity();
    setRecentActivity(activity);

    setLoading(false);
  }, []);

  // Utiliser useEffect APRÈS la définition de loadDashboardData
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const calculateWeeklyProgress = () => {
    // Simuler un progrès hebdomadaire basé sur les projets terminés
    const projects = projectService.getProjects();
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const weeklyCompleted = projects.filter((p) => {
      if (p.status !== 'COMPLETED') return false;
      const completedDate = new Date(p.updatedAt);
      return completedDate >= thisWeek;
    }).length;

    return Math.min(100, weeklyCompleted * 20); // 20% par projet terminé
  };

  const getCombinedActivity = () => {
    const projects = projectService.getProjects();
    const conversations = messagingService.getConversations();
    const appointments = calendarService.getUpcomingAppointments(3);

    const activities = [];

    // Projets récents
    projects.slice(0, 3).forEach((project) => {
      activities.push({
        type: 'project',
        title: `Projet: ${project.title}`,
        description: `Client: ${project.client?.name}`,
        time: project.updatedAt,
        icon: '📋',
        color: 'text-blue-400',
        link: `/admin/projects/${project.id}`,
      });
    });

    // Messages récents
    conversations
      .filter((c) => c.unreadCount > 0)
      .slice(0, 2)
      .forEach((conv) => {
        activities.push({
          type: 'message',
          title: `Message de ${conv.clientName}`,
          description: conv.lastMessage?.content.substring(0, 50) + '...',
          time: conv.lastActivity,
          icon: '💬',
          color: 'text-purple-400',
          link: '/admin/messages',
        });
      });

    // Rendez-vous à venir
    appointments.forEach((apt) => {
      activities.push({
        type: 'appointment',
        title: apt.title,
        description: `Avec ${apt.client.name}`,
        time: apt.startTime,
        icon: '📅',
        color: 'text-green-400',
        link: '/admin/calendar',
      });
    });

    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-40 bg-dark-300 rounded-xl"></div>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-dark-300 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Vue d'ensemble principale */}
      <div className="bg-gradient-to-r from-purple/20 to-pink/20 rounded-2xl p-6 border border-purple/30">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {stats.projects.total}
            </div>
            <div className="text-purple-300 text-sm">Projets Total</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats.overview.totalActiveWork}
            </div>
            <div className="text-green-300 text-sm">En Cours</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {stats.overview.urgentItems}
            </div>
            <div className="text-red-300 text-sm">Urgent</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {stats.overview.weeklyProgress}%
            </div>
            <div className="text-blue-300 text-sm">Progrès Semaine</div>
          </div>
        </div>
      </div>

      {/* Widgets rapides */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Projets prioritaires */}
        <QuickProjectsWidget projects={stats.projects} />

        {/* Messages non lus */}
        <QuickMessagesWidget messaging={stats.messaging} />

        {/* Rendez-vous aujourd'hui */}
        <QuickCalendarWidget calendar={stats.calendar} />
      </div>

      {/* Activité récente détaillée */}
      <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            🚀 Activité Récente
          </h3>
          <span className="text-sm text-gray-400">Dernières 24h</span>
        </div>

        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Aucune activité récente
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <ActivityItem key={index} activity={activity} />
            ))
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <QuickActionsPanel />
    </div>
  );
}

// Widget projets rapide
function QuickProjectsWidget({ projects }) {
  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">📋 Projets</h4>
        <Link
          to="/admin/projects"
          className="text-purple-400 text-sm hover:text-purple-300"
        >
          Voir tout →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 text-sm">⏳ En attente</span>
          <span className="font-bold text-white">
            {projects.byStatus.PENDING || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-blue-400 text-sm">🔄 En cours</span>
          <span className="font-bold text-white">
            {projects.byStatus.IN_PROGRESS || 0}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-400 text-sm">✅ Terminés</span>
          <span className="font-bold text-white">
            {projects.byStatus.COMPLETED || 0}
          </span>
        </div>

        {projects.urgentProjects > 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-red-400 text-sm font-medium">
              🚨 {projects.urgentProjects} projet(s) urgent(s)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget messages rapide
function QuickMessagesWidget({ messaging }) {
  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">💬 Messages</h4>
        <Link
          to="/admin/messages"
          className="text-purple-400 text-sm hover:text-purple-300"
        >
          Voir tout →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-blue-400 text-sm">💬 Total conversations</span>
          <span className="font-bold text-white">
            {messaging.totalConversations}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-400 text-sm">✅ Actives</span>
          <span className="font-bold text-white">
            {messaging.activeConversations}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-orange-400 text-sm">
            📊 Messages aujourd'hui
          </span>
          <span className="font-bold text-white">
            {messaging.todayMessages}
          </span>
        </div>

        {messaging.totalUnread > 0 && (
          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="text-purple-400 text-sm font-medium">
              📩 {messaging.totalUnread} message(s) non lu(s)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget calendrier rapide
function QuickCalendarWidget({ calendar }) {
  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-white">📅 Rendez-vous</h4>
        <Link
          to="/admin/calendar"
          className="text-purple-400 text-sm hover:text-purple-300"
        >
          Planning →
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-blue-400 text-sm">📅 Aujourd'hui</span>
          <span className="font-bold text-white">{calendar.today}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-green-400 text-sm">⏰ À venir</span>
          <span className="font-bold text-white">{calendar.upcoming}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-purple-400 text-sm">📊 Ce mois</span>
          <span className="font-bold text-white">{calendar.thisMonth}</span>
        </div>

        <div className="text-xs text-gray-400 mt-3">
          Taux de complétion: {calendar.completionRate}%
        </div>
      </div>
    </div>
  );
}

// Item d'activité
function ActivityItem({ activity }) {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now - time) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${Math.floor(diffInHours)}h`;
    return `Il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <Link
      to={activity.link}
      className="flex items-center gap-4 p-3 rounded-lg hover:bg-dark-200 transition-colors group"
    >
      <div className="text-xl">{activity.icon}</div>

      <div className="flex-1 min-w-0">
        <div
          className={`font-medium text-sm ${activity.color} group-hover:text-white transition-colors`}
        >
          {activity.title}
        </div>
        <div className="text-gray-400 text-xs truncate">
          {activity.description}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        {formatTimeAgo(activity.time)}
      </div>
    </Link>
  );
}

// Panel d'actions rapides
function QuickActionsPanel() {
  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <h3 className="text-lg font-semibold text-white mb-4">
        ⚡ Actions Rapides
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link
          to="/admin/projects"
          className="flex items-center gap-3 p-4 bg-dark-200 rounded-lg hover:bg-purple/20 transition-colors border border-transparent hover:border-purple/50"
        >
          <span className="text-xl">📋</span>
          <div>
            <div className="text-white font-medium text-sm">Nouveau Projet</div>
            <div className="text-gray-400 text-xs">Créer un projet</div>
          </div>
        </Link>

        <Link
          to="/admin/messages"
          className="flex items-center gap-3 p-4 bg-dark-200 rounded-lg hover:bg-purple/20 transition-colors border border-transparent hover:border-purple/50"
        >
          <span className="text-xl">💬</span>
          <div>
            <div className="text-white font-medium text-sm">Messages</div>
            <div className="text-gray-400 text-xs">Répondre aux clients</div>
          </div>
        </Link>

        <Link
          to="/admin/analytics"
          className="flex items-center gap-3 p-4 bg-dark-200 rounded-lg hover:bg-purple/20 transition-colors border border-transparent hover:border-purple/50"
        >
          <span className="text-xl">📊</span>
          <div>
            <div className="text-white font-medium text-sm">Analytics</div>
            <div className="text-gray-400 text-xs">Voir les stats</div>
          </div>
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-3 p-4 bg-dark-200 rounded-lg hover:bg-green-500/20 transition-colors border border-transparent hover:border-green-500/50"
        >
          <span className="text-xl">🔄</span>
          <div>
            <div className="text-white font-medium text-sm">Actualiser</div>
            <div className="text-gray-400 text-xs">Recharger les données</div>
          </div>
        </button>
      </div>
    </div>
  );
}
