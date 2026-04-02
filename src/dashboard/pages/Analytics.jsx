import { useState, useEffect, useCallback } from 'react';
import projectService from '../services/projectService';
import calendarService from '../services/calendarService';
import dataService from '../../services/dataService';

export default function AdvancedAnalytics() {
  const [timeframe, setTimeframe] = useState('month');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Définir loadAnalytics AVANT le useEffect
  const loadAnalytics = useCallback(() => {
    setLoading(true);

    const projectStats = projectService.getProjectStats();
    const appointmentStats = calendarService.getAppointmentStats();
    const clientStats = dataService.getStats();

    // Calculs avancés
    const analytics = {
      projects: projectStats,
      appointments: appointmentStats,
      clients: clientStats,
      revenue: calculateRevenue(projectStats),
      productivity: calculateProductivity(projectStats, appointmentStats),
      trends: calculateTrends(timeframe),
    };

    setAnalytics(analytics);
    setLoading(false);
  }, [timeframe]);

  // Utiliser useEffect APRÈS la définition de loadAnalytics
  useEffect(() => {
    loadAnalytics();
  }, [timeframe, loadAnalytics]);

  const calculateRevenue = (_projectStats) => {
    const projects = projectService.getProjects();
    const completedProjects = projects.filter((p) => p.status === 'COMPLETED');

    const totalRevenue = completedProjects.reduce((sum, p) => {
      const budget =
        typeof p.budget === 'string'
          ? parseInt(p.budget.replace(/\D/g, ''))
          : p.budget || 0;
      return sum + budget;
    }, 0);

    const pendingRevenue = projects
      .filter((p) => ['PENDING', 'IN_PROGRESS', 'REVIEW'].includes(p.status))
      .reduce((sum, p) => {
        const budget =
          typeof p.budget === 'string'
            ? parseInt(p.budget.replace(/\D/g, ''))
            : p.budget || 0;
        return sum + budget;
      }, 0);

    return {
      total: totalRevenue,
      pending: pendingRevenue,
      average:
        completedProjects.length > 0
          ? totalRevenue / completedProjects.length
          : 0,
      growth: 12.5, // Simulation croissance
    };
  };

  const calculateProductivity = (projectStats, appointmentStats) => {
    // const projects = projectService.getProjects();
    const avgCompletionTime = projectStats.avgCompletionTime || 0;
    const totalAppointments = appointmentStats.total || 0;
    const completedAppointments = appointmentStats.byStatus.completed || 0;

    return {
      projectCompletionRate:
        projectStats.total > 0
          ? Math.round(
              (projectStats.byStatus.COMPLETED / projectStats.total) * 100
            )
          : 0,
      appointmentCompletionRate:
        totalAppointments > 0
          ? Math.round((completedAppointments / totalAppointments) * 100)
          : 0,
      avgProjectDuration: avgCompletionTime,
      efficiency: Math.min(100, Math.round(85 + Math.random() * 15)), // Simulation
    };
  };

  const calculateTrends = (_period) => {
    const projects = projectService.getProjects();
    const currentDate = new Date();

    // Données des derniers mois pour les tendances
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthProjects = projects.filter((p) => {
        const createdDate = new Date(p.createdAt);
        return (
          createdDate.getMonth() === date.getMonth() &&
          createdDate.getFullYear() === date.getFullYear()
        );
      });

      monthlyData.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        projects: monthProjects.length,
        completed: monthProjects.filter((p) => p.status === 'COMPLETED').length,
        revenue: monthProjects.reduce((sum, p) => {
          const budget =
            typeof p.budget === 'string'
              ? parseInt(p.budget.replace(/\D/g, ''))
              : p.budget || 0;
          return sum + (p.status === 'COMPLETED' ? budget : 0);
        }, 0),
      });
    }

    return monthlyData;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* En-tête */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Avancés</h1>
          <p className="text-gray-400 mt-2">
            Vue détaillée des performances et tendances
          </p>
        </div>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-white"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </header>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KPICard
          title="Chiffre d'affaires"
          value={`${(analytics.revenue.total / 1000).toFixed(0)}k€`}
          change={`+${analytics.revenue.growth}%`}
          trend="up"
          icon="💰"
        />

        <KPICard
          title="Projets terminés"
          value={analytics.projects.byStatus.COMPLETED || 0}
          change={`${analytics.productivity.projectCompletionRate}%`}
          trend="up"
          icon="✅"
        />

        <KPICard
          title="Efficacité"
          value={`${analytics.productivity.efficiency}%`}
          change="+5%"
          trend="up"
          icon="📈"
        />

        <KPICard
          title="Revenus en attente"
          value={`${(analytics.revenue.pending / 1000).toFixed(0)}k€`}
          change="En cours"
          trend="neutral"
          icon="⏳"
        />
      </div>

      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tendance des projets */}
        <ChartCard
          title="Évolution des projets"
          subtitle="Projets créés et terminés par mois"
        >
          <ProjectTrendChart data={analytics.trends} />
        </ChartCard>

        {/* Répartition par statut */}
        <ChartCard title="Répartition des projets" subtitle="Par statut actuel">
          <StatusDistributionChart data={analytics.projects.byStatus} />
        </ChartCard>
      </div>

      {/* Tableaux détaillés */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Performance par type */}
        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <h3 className="text-lg font-semibold text-white mb-4">
            Performance par type de projet
          </h3>
          <ProjectTypePerformance />
        </div>

        {/* Métriques temporelles */}
        <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
          <h3 className="text-lg font-semibold text-white mb-4">
            Métriques temporelles
          </h3>
          <TimeMetrics analytics={analytics} />
        </div>
      </div>

      {/* Insights et recommandations */}
      <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
        <h3 className="text-lg font-semibold text-white mb-4">
          💡 Insights et Recommandations
        </h3>
        <InsightsPanel analytics={analytics} />
      </div>
    </div>
  );
}

// Composant KPI Card
function KPICard({ title, value, change, trend, icon }) {
  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm ${getTrendColor(trend)}`}>
          {getTrendIcon(trend)} {change}
        </span>
      </div>

      <div>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{title}</div>
      </div>
    </div>
  );
}

// Composant Chart Card
function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-dark-300 rounded-xl p-6 border border-dark-400">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// Graphique tendance des projets (simple)
function ProjectTrendChart({ data }) {
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.projects, d.completed))
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple rounded"></div>
          <span className="text-gray-400">Créés</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-400">Terminés</span>
        </div>
      </div>

      <div className="relative h-40">
        {data.map((month, index) => (
          <div
            key={index}
            className="absolute bottom-0 flex flex-col items-center"
            style={{ left: `${(index / (data.length - 1)) * 100}%` }}
          >
            <div className="flex items-end gap-1 mb-2">
              <div
                className="w-4 bg-purple rounded-t"
                style={{ height: `${(month.projects / maxValue) * 120}px` }}
              ></div>
              <div
                className="w-4 bg-green-500 rounded-t"
                style={{ height: `${(month.completed / maxValue) * 120}px` }}
              ></div>
            </div>

            <span className="text-xs text-gray-400 transform -rotate-45">
              {month.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Graphique répartition par statut
function StatusDistributionChart({ data }) {
  const statusLabels = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    REVIEW: 'Révision',
    COMPLETED: 'Terminé',
    CANCELLED: 'Annulé',
    ON_HOLD: 'En pause',
  };

  const statusColors = {
    PENDING: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    REVIEW: 'bg-purple-500',
    COMPLETED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    ON_HOLD: 'bg-orange-500',
  };

  const total = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-3">
      {Object.entries(data).map(([status, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={status} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded ${statusColors[status]}`}></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{statusLabels[status]}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
              <div className="w-full bg-dark-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${statusColors[status]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Performance par type de projet
function ProjectTypePerformance() {
  const projects = projectService.getProjects();
  const typeStats = {};

  projects.forEach((project) => {
    const type = project.type || 'contact';
    if (!typeStats[type]) {
      typeStats[type] = { total: 0, completed: 0, revenue: 0 };
    }

    typeStats[type].total++;
    if (project.status === 'COMPLETED') {
      typeStats[type].completed++;
      const budget =
        typeof project.budget === 'string'
          ? parseInt(project.budget.replace(/\D/g, ''))
          : project.budget || 0;
      typeStats[type].revenue += budget;
    }
  });

  const typeLabels = {
    contact: 'Formulaire contact',
    advanced: 'Formulaire avancé',
    subscription: 'Newsletter',
  };

  return (
    <div className="space-y-3">
      {Object.entries(typeStats).map(([type, stats]) => (
        <div
          key={type}
          className="flex items-center justify-between p-3 bg-dark-200 rounded-lg"
        >
          <div>
            <div className="font-medium text-white">
              {typeLabels[type] || type}
            </div>
            <div className="text-sm text-gray-400">
              {stats.completed}/{stats.total} terminés
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-400">
              {stats.revenue > 0 ? `${stats.revenue}€` : '-'}
            </div>
            <div className="text-sm text-gray-400">
              {stats.total > 0
                ? `${Math.round((stats.completed / stats.total) * 100)}%`
                : '0%'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Métriques temporelles
function TimeMetrics({ analytics }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">Durée moyenne projet</span>
        <span className="text-white font-bold">
          {analytics.productivity.avgProjectDuration}j
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-300">Taux de complétion</span>
        <span className="text-green-400 font-bold">
          {analytics.productivity.projectCompletionRate}%
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-300">Projet moyen</span>
        <span className="text-purple-400 font-bold">
          {Math.round(analytics.revenue.average)}€
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-300">RDV ce mois</span>
        <span className="text-blue-400 font-bold">
          {analytics.appointments.thisMonth}
        </span>
      </div>
    </div>
  );
}

// Panel d'insights
function InsightsPanel({ analytics }) {
  const insights = [];

  // Générer des insights dynamiques
  if (analytics.productivity.projectCompletionRate > 80) {
    insights.push({
      type: 'positive',
      message: `Excellent taux de complétion (${analytics.productivity.projectCompletionRate}%) ! Votre processus est très efficace.`,
    });
  }

  if (analytics.revenue.pending > analytics.revenue.total * 0.5) {
    insights.push({
      type: 'opportunity',
      message: `${Math.round(
        analytics.revenue.pending / 1000
      )}k€ de revenus en attente. Focus sur la finalisation des projets en cours.`,
    });
  }

  if (analytics.appointments.upcoming < 3) {
    insights.push({
      type: 'warning',
      message:
        'Peu de rendez-vous programmés. Pensez à prospecter ou relancer les clients.',
    });
  }

  insights.push({
    type: 'tip',
    message:
      'Astuce : Analysez les projets les plus rentables pour reproduire ce succès.',
  });

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return '🎉';
      case 'opportunity':
        return '💡';
      case 'warning':
        return '⚠️';
      case 'tip':
        return '💭';
      default:
        return 'ℹ️';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-green-500 bg-green-500/10';
      case 'opportunity':
        return 'border-blue-500 bg-blue-500/10';
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'tip':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="space-y-3">
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{getInsightIcon(insight.type)}</span>
            <p className="text-gray-300 text-sm leading-relaxed">
              {insight.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
