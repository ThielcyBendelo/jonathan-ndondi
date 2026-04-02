import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function ModernDashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realtimeData] = useState({
    visitors: 1247,
    revenue: 15240,
    projects: 8,
    clients: 12,
    messages: 3,
    growth: 12.5,
  });

  // Données pour les graphiques
  const [chartData] = useState({
    revenue: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Revenus (€)',
          data: [8000, 12000, 9500, 15000, 13500, 18000],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    projects: {
      labels: ['Terminés', 'En cours', 'En attente', 'Annulés'],
      datasets: [
        {
          data: [65, 25, 8, 2],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 2,
        },
      ],
    },
    traffic: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [
        {
          label: 'Visiteurs',
          data: [120, 190, 300, 500, 200, 300, 450],
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
          borderColor: 'rgba(147, 51, 234, 1)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
  });

  // Stats cards avec animations
  const statsCards = [
    {
      title: 'Revenus Totaux',
      value: `€${realtimeData.revenue.toLocaleString()}`,
      change: `+${realtimeData.growth}%`,
      icon: '💰',
      color: 'from-green-500 to-emerald-600',
      trend: 'up',
      description: 'vs mois dernier',
    },
    {
      title: 'Projets Actifs',
      value: realtimeData.projects,
      change: '+2',
      icon: '📋',
      color: 'from-blue-500 to-cyan-600',
      trend: 'up',
      description: 'cette semaine',
    },
    {
      title: 'Clients',
      value: realtimeData.clients,
      change: '+3',
      icon: '👥',
      color: 'from-purple-500 to-pink-600',
      trend: 'up',
      description: 'nouveaux ce mois',
    },
    {
      title: 'Messages',
      value: realtimeData.messages,
      change: 'urgent',
      icon: '💬',
      color: 'from-orange-500 to-red-600',
      trend: 'urgent',
      description: 'non lus',
    },
  ];

  // Activités récentes
  const recentActivities = [
    {
      type: 'client',
      message: 'Nouveau client: Marie Dubois',
      time: '5 min',
      icon: '👤',
      color: 'text-green-500',
    },
    {
      type: 'project',
      message: 'Projet "Site E-commerce" terminé',
      time: '2h',
      icon: '✅',
      color: 'text-blue-500',
    },
    {
      type: 'payment',
      message: 'Paiement reçu: €2,500',
      time: '4h',
      icon: '💳',
      color: 'text-emerald-500',
    },
    {
      type: 'message',
      message: '3 nouveaux messages',
      time: '6h',
      icon: '📨',
      color: 'text-orange-500',
    },
  ];

  // Mise à jour temps réel de l'heure
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Configuration des graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Inter',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          padding: 20,
          font: {
            family: 'Inter',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#e2e8f0',
      },
    },
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header avec logo et heure */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-2xl font-bold text-white">IR</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard Administrateur
            </h1>
            <p className="text-slate-400 text-sm">
              Ir Bendelo - Vue d'ensemble temps réel
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold text-xl">
            {currentTime.toLocaleTimeString('fr-FR')}
          </div>
          <div className="text-slate-300 text-sm">
            {currentTime.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </motion.div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-10`}
            ></div>
            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    card.trend === 'up'
                      ? 'bg-green-500/20 text-green-400'
                      : card.trend === 'urgent'
                      ? 'bg-red-500/20 text-red-400 animate-pulse'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {card.change}
                </div>
              </div>
              <div className="text-white text-3xl font-bold mb-2">
                {card.value}
              </div>
              <div className="text-slate-400 text-sm">{card.title}</div>
              <div className="text-slate-500 text-xs mt-1">
                {card.description}
              </div>
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full hover:translate-x-[-100%] transition-transform duration-1000"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Graphique Revenus */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Évolution des Revenus
              </h3>
              <p className="text-slate-400 text-sm">Derniers 6 mois</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Temps réel</span>
            </div>
          </div>
          <div className="h-80">
            <Line data={chartData.revenue} options={chartOptions} />
          </div>
        </motion.div>

        {/* Graphique Projets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Statut des Projets
              </h3>
              <p className="text-slate-400 text-sm">Répartition actuelle</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {realtimeData.projects}
              </div>
              <div className="text-slate-400 text-xs">Projets actifs</div>
            </div>
          </div>
          <div className="h-80">
            <Doughnut data={chartData.projects} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Section Analytics et Activités */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique Trafic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Trafic Hebdomadaire
              </h3>
              <p className="text-slate-400 text-sm">Visiteurs par jour</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-slate-300 text-sm">Visiteurs</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-400">
                  {realtimeData.visitors.toLocaleString()}
                </div>
                <div className="text-slate-400 text-xs">
                  Total cette semaine
                </div>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Bar data={chartData.traffic} options={chartOptions} />
          </div>
        </motion.div>

        {/* Activités Récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Activités Récentes</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-slate-900/30 rounded-xl hover:bg-slate-700/30 transition-colors duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-700/50 ${activity.color}`}
                >
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">
                    {activity.message}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    Il y a {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg"
          >
            Voir toutes les activités
          </motion.button>
        </motion.div>
      </div>

      {/* Watermark discret */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-60 transition-opacity">
        <div className="text-slate-500 text-xs">
          Powered by Ir Bendelo © 2024
        </div>
      </div>
    </div>
  );
}
