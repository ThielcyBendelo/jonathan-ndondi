import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';

export default function ClientsChart() {
  const [clients, setClients] = useState([]);
  const [chartType, setChartType] = useState('monthly'); // monthly, status, projects

  useEffect(() => {
    const loadClients = () => {
      const clientsData = dataService.getClients();
      setClients(clientsData);
    };
    loadClients();
  }, []);

  // Données pour graphique mensuel
  const getMonthlyData = () => {
    const monthsData = {};

    // Initialiser les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      monthsData[monthKey] = 0;
    }

    // Compter les clients par mois
    clients.forEach((client) => {
      const date = new Date(client.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthsData, monthKey)) {
        monthsData[monthKey]++;
      }
    });

    return Object.entries(monthsData).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('fr-FR', {
        month: 'short',
      }),
      count,
    }));
  };

  // Données pour graphique par statut
  const getStatusData = () => {
    const statusCount = {
      nouveau: 0,
      en_cours: 0,
      termine: 0,
    };

    clients.forEach((client) => {
      statusCount[client.status] = (statusCount[client.status] || 0) + 1;
    });

    return [
      {
        name: 'Nouveau',
        value: statusCount.nouveau,
        color: 'from-blue-500 to-blue-600',
      },
      {
        name: 'En cours',
        value: statusCount.en_cours,
        color: 'from-orange-500 to-orange-600',
      },
      {
        name: 'Terminé',
        value: statusCount.termine,
        color: 'from-green-500 to-green-600',
      },
    ];
  };

  // Données pour graphique par type de projet
  const getProjectTypeData = () => {
    const typeCount = {};

    clients.forEach((client) => {
      const type = client.projectType || 'Non spécifié';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count,
      color: `from-purple-${Math.floor(
        Math.random() * 3 + 4
      )}00 to-pink-${Math.floor(Math.random() * 3 + 4)}00`,
    }));
  };

  const monthlyData = getMonthlyData();
  const statusData = getStatusData();
  const projectTypeData = getProjectTypeData();
  const maxValue = Math.max(...monthlyData.map((d) => d.count));

  return (
    <div className="bg-dark-300 rounded-xl p-6 shadow-lg border border-dark-400">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Analyses des Clients</h3>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="px-3 py-1 bg-dark-200 text-white rounded-lg border border-dark-400 text-sm"
        >
          <option value="monthly">Par mois</option>
          <option value="status">Par statut</option>
          <option value="projects">Par type</option>
        </select>
      </div>

      {chartType === 'monthly' && (
        <div className="space-y-4">
          <div className="flex items-end justify-between h-40 space-x-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-dark-200 rounded-t-lg relative overflow-hidden">
                  <div
                    className="bg-gradient-to-t from-purple to-pink rounded-t-lg transition-all duration-300 relative"
                    style={{
                      height: `${
                        maxValue > 0 ? (data.count / maxValue) * 100 : 0
                      }%`,
                      minHeight: data.count > 0 ? '4px' : '0',
                    }}
                  >
                    {data.count > 0 && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium">
                        {data.count}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {chartType === 'status' && (
        <div className="grid grid-cols-3 gap-4">
          {statusData.map((status, index) => (
            <div key={index} className="text-center">
              <div
                className={`h-20 w-20 mx-auto rounded-full bg-gradient-to-br ${status.color} 
                            flex items-center justify-center mb-3 shadow-lg`}
              >
                <span className="text-white font-bold text-lg">
                  {status.value}
                </span>
              </div>
              <span className="text-gray-300 text-sm">{status.name}</span>
            </div>
          ))}
        </div>
      )}

      {chartType === 'projects' && (
        <div className="space-y-3">
          {projectTypeData.map((project, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-dark-200 rounded-lg"
            >
              <span className="text-gray-300">{project.name}</span>
              <div className="flex items-center gap-3">
                <div className="w-16 h-2 bg-dark-400 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${project.color} transition-all duration-300`}
                    style={{
                      width: `${
                        (project.value /
                          Math.max(...projectTypeData.map((p) => p.value))) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <span className="text-white font-medium w-6 text-right">
                  {project.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
