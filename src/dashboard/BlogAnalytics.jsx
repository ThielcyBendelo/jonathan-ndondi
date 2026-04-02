import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService.firebase';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function BlogAnalytics() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogService.getArticles().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  // Top articles par vues
  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  // Répartition par catégorie
  const categories = {};
  articles.forEach(a => {
    if (a.category) categories[a.category] = (categories[a.category] || 0) + 1;
  });

  return (
    <div className="bg-dark-200 rounded-xl p-6 mb-8 shadow-lg">
      <h3 className="text-2xl font-bold text-white mb-6">Statistiques Blog</h3>
      {loading ? (
        <div className="text-purple">Chargement des données...</div>
      ) : (
        <>
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-2 text-pink">Top 5 articles (vues)</h4>
            <Bar
              data={{
                labels: topArticles.map(a => a.title),
                datasets: [{
                  label: 'Vues',
                  data: topArticles.map(a => a.views || 0),
                  backgroundColor: 'rgba(236,72,153,0.7)',
                }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2 text-purple">Répartition par catégorie</h4>
            <Pie
              data={{
                labels: Object.keys(categories),
                datasets: [{
                  data: Object.values(categories),
                  backgroundColor: ['#a78bfa','#f472b6','#34d399','#fbbf24','#60a5fa'],
                }],
              }}
              options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
            />
          </div>
        </>
      )}
    </div>
  );
}
