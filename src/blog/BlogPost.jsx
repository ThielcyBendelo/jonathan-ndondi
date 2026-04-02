import React, { useState, useEffect } from 'react';
import { exportCommentsToCSV } from './CommentsExportCSV';
import { toast } from 'react-toastify';
import { blogService } from '../services/blogService.firebase';

export default function BlogPost({ id, title, content, author, date, category, tags, excerpt, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [views, setViews] = useState(0);
  // loading retiré car non utilisé
  // Generate excerpt if not provided
  const preview = excerpt || (content.length > 180 ? content.slice(0, 180) + '...' : content);

  // Charger les commentaires et vues au montage
  useEffect(() => {
  //
    blogService.getComments(id)
      .then(data => setComments(data))
      .catch(() => setComments([]));
    blogService.incrementViews(id)
      .then(data => setViews(data.views))
      .catch(() => setViews(0));
  //
  }, [id]);

  // Ajouter un commentaire via l'API
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
  //
    try {
      const newComment = await blogService.addComment(id, { text: commentText });
      setComments([newComment, ...comments]);
      setCommentText('');
        toast.success('Commentaire ajouté !');
    } catch {
      // ignore API errors
        toast.error("Erreur lors de l'ajout du commentaire.");
    }
  //
  };

  // Supprimer un commentaire via l'API
  const handleDeleteComment = async (idx) => {
  //
    try {
      const commentId = comments[idx].id || comments[idx]._id;
      await blogService.deleteComment(id, commentId);
      setComments(comments.filter((_, i) => i !== idx));
      toast.info('Commentaire supprimé.');
    } catch {
      // ignore API errors
      toast.error("Erreur lors de la suppression du commentaire.");
    }
  //
  };

  // Récupère le rôle depuis le localStorage (défini à la connexion)
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('dashboardRole') || 'reader' : 'reader';

  return (
    <article className="bg-dark-100 border border-purple/30 rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:border-pink/40 transition-all duration-300">
      <div className="flex flex-wrap gap-2 mb-2">
        {category && (
          <span className="px-3 py-1 rounded-full bg-purple/20 text-purple text-xs font-semibold">{category}</span>
        )}
        {tags && tags.length > 0 && tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-1 rounded bg-pink/20 text-pink text-xs font-medium">#{tag}</span>
        ))}
      </div>
      <h4 className="text-2xl font-bold mb-2 text-transparent bg-gradient-to-r from-purple to-pink bg-clip-text drop-shadow">{title}</h4>
      <div className="text-gray-200 mb-4 whitespace-pre-line leading-relaxed">
        {expanded ? content : preview}
        {content.length > 180 && (
          <button
            className="ml-2 text-purple underline text-xs hover:text-pink"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Réduire' : 'Lire la suite'}
          >
            {expanded ? 'Réduire' : 'Lire la suite'}
          </button>
        )}
      </div>
      <div className="flex justify-between items-center text-sm text-gray-400 mt-2 mb-4">
        <div className="flex gap-2">
          {onEdit && (
            <button
              className="px-3 py-1 bg-purple/80 text-white rounded text-xs hover:bg-purple"
              onClick={() => onEdit(id, { title, content, author, date, category, tags })}
              aria-label="Modifier l'article"
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              className="px-3 py-1 bg-pink/80 text-white rounded text-xs hover:bg-pink"
              onClick={() => onDelete(id)}
              aria-label="Supprimer l'article"
            >
              Supprimer
            </button>
          )}
        </div>
  <span className="font-medium text-purple/80">Par {author}</span>
  <span className="bg-purple/10 px-3 py-1 rounded-full text-xs text-pink/80">{date}</span>
      </div>
      <div className="flex gap-4 items-center text-xs text-gray-400 mb-2">
        <span>👁️ {views} vues</span>
        <span>💬 {comments.length} commentaires</span>
      </div>
      {/* Comments section */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h5 className="text-lg font-bold text-purple">Commentaires</h5>
          {['admin','editor'].includes(userRole) && comments.length > 0 && (
            <button
              className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded text-xs shadow hover:scale-105 transition-transform font-semibold"
              onClick={() => exportCommentsToCSV(comments, title)}
            >
              Export CSV
            </button>
          )}
        </div>
        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 rounded border bg-dark-100 text-white border-purple/30"
            placeholder="Ajouter un commentaire..."
            aria-label="Ajouter un commentaire"
          />
          <button type="submit" className="px-4 py-2 bg-purple text-white rounded">Envoyer</button>
        </form>
        <ul className="space-y-2">
          {comments.length === 0 && (
            <li className="text-gray-500 text-sm">Aucun commentaire pour cet article.</li>
          )}
          {comments.map((c, idx) => (
            <li key={idx} className="bg-dark-200 border border-purple/20 rounded p-2 flex justify-between items-center">
              <span className="text-white text-sm">{c.text}</span>
              <span className="text-xs text-gray-400 ml-2">{c.date}</span>
              <button
                className="ml-3 text-pink text-xs hover:underline"
                onClick={() => handleDeleteComment(idx)}
                aria-label="Supprimer le commentaire"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
