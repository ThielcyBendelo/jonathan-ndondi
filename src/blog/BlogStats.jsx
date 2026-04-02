import React, { useEffect, useState } from 'react';
import { blogService } from '../services/blogService.firebase';
import { newsletterService } from '../services/newsletterService.firebase';

export default function BlogStats() {
  const [stats, setStats] = useState({
    articles: 0,
    views: 0,
    comments: 0,
    subscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const articles = await blogService.getArticles();
      const subscribers = await newsletterService.getSubscribers();
      let views = 0;
      let comments = 0;
      articles.forEach(a => {
        views += a.views || 0;
        comments += (a.commentsCount || 0);
      });
      // Si pas de commentsCount, compter via getComments
      if (!articles.some(a => a.commentsCount)) {
        for (const a of articles) {
          const cs = await blogService.getComments(a.id);
          comments += cs.length;
        }
      }
      setStats({
        articles: articles.length,
        views,
        comments,
        subscribers: subscribers.length,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-dark-200 rounded-xl p-6 mb-8 flex flex-wrap gap-8 justify-center items-center shadow-lg">
      {loading ? (
        <div className="text-purple">Chargement des statistiques...</div>
      ) : (
        <>
          <StatBox label="Articles" value={stats.articles} color="purple" />
          <StatBox label="Vues" value={stats.views} color="pink" />
          <StatBox label="Commentaires" value={stats.comments} color="blue" />
          <StatBox label="Abonnés" value={stats.subscribers} color="green" />
        </>
      )}
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className={`flex flex-col items-center px-6 py-4 rounded-xl bg-${color}/20 text-${color} shadow-md min-w-[120px]`}>
      <span className="text-3xl font-bold mb-1">{value}</span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  );
}
