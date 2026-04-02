// ...existing code...
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { blogService } from '../services/blogService.firebase';
import BlogForm from './BlogForm';
import BlogStats from './BlogStats';
import { exportBlogPostsToCSV } from './BlogExportCSV';
import BlogPost from './BlogPost';

// ...existing code...

export default function BlogList() {
  // Sorting state
  const [sortBy, setSortBy] = useState('date-desc');
  // Pagination state
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [search, setSearch] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterTag, setFilterTag] = useState('');

  // Charger les articles au montage
  useEffect(() => {
    blogService.getArticles()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Ajouter un article via l'API
  const addPost = async (post) => {
    setLoading(true);
    try {
      const newArticle = await blogService.createArticle(post);
      setPosts([newArticle, ...posts]);
      toast.success('Article ajouté avec succès !');
    } catch {
      toast.error("Erreur lors de l'ajout de l'article.");
    }
    setShowForm(false);
    setLoading(false);
  };

  // Modifier un article via l'API
  const editPost = async (id, data) => {
    setLoading(true);
    try {
      const updated = await blogService.updateArticle(id, data);
      setPosts(posts.map(p => p.id === id ? updated : p));
      toast.success('Article modifié avec succès !');
      setEditModal({ open: false, post: null });
    } catch {
      toast.error("Erreur lors de la modification de l'article.");
    }
    setLoading(false);
  };

  // Supprimer un article via l'API
  const deletePost = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet article ?')) return;
    setLoading(true);
    try {
      await blogService.deleteArticle(id);
      setPosts(posts.filter(p => p.id !== id));
      toast.info('Article supprimé.');
    } catch {
      toast.error("Erreur lors de la suppression de l'article.");
    }
    setLoading(false);
  };

  // ...supprimer la logique localStorage...

  // Filter posts by search et filtres avancés
  let filteredPosts = posts.filter(post => {
    const q = search.toLowerCase();
    let ok = (
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      (post.category && post.category.toLowerCase().includes(q)) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(q)))
    );
    if (filterAuthor) ok = ok && post.author && post.author.toLowerCase() === filterAuthor.toLowerCase();
    if (filterCategory) ok = ok && post.category && post.category.toLowerCase() === filterCategory.toLowerCase();
    if (filterDate) ok = ok && post.date && post.date.startsWith(filterDate);
    if (filterPopular) ok = ok && post.views && post.views >= 10;
    if (filterTag) ok = ok && post.tags && post.tags.map(t => t.toLowerCase()).includes(filterTag.toLowerCase());
    return ok;
  });

  // Articles populaires (>= 10 vues)
  const popularPosts = filteredPosts.filter(p => p.views && p.views >= 10).slice(0, 3);

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'category-asc':
        return (a.category || '').localeCompare(b.category || '');
      case 'category-desc':
        return (b.category || '').localeCompare(a.category || '');
      default:
        return 0;
    }
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Récupère le rôle depuis le localStorage (défini à la connexion)
  const userRole = localStorage.getItem('dashboardRole') || 'reader';

  // Section À la une : dernier article ou le plus populaire
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  return (
    <section className="max-w-6xl mx-auto py-12 px-4 font-sans">
      {/* Bouton retour site principal */}
      <div className="mb-6">
        <a href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">← Retour au site principal</a>
      </div>
      {/* Bannière moderne */}
      <div className="relative mb-12 rounded-3xl overflow-hidden shadow-xl">
        <img src="/public/images/blog-banner.jpg" alt="Blog Banner" className="w-full h-64 object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple/80 via-pink/60 to-blue-500/60 opacity-80"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl mb-4 font-serif">Blog Professionnel</h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-2">Retrouvez les derniers articles, conseils et actualités du secteur.</p>
        </div>
      </div>
      {/* Section À la une */}
      {featuredPost && (
        <div className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-purple/10 via-pink/10 to-blue-100/10 rounded-3xl shadow-lg p-8 border border-purple/30">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-purple mb-2 font-serif">À la une</h2>
            <h3 className="text-2xl font-semibold text-dark-100 mb-2">{featuredPost.title}</h3>
            <p className="text-lg text-gray-700 mb-4 line-clamp-3">{featuredPost.content?.slice(0, 180)}...</p>
            <div className="flex gap-4 items-center mb-4">
              <span className="px-3 py-1 rounded-full bg-pink/20 text-pink font-semibold text-xs">{featuredPost.category}</span>
              <span className="px-3 py-1 rounded-full bg-blue-200/30 text-blue-700 font-semibold text-xs">{featuredPost.author}</span>
              <span className="px-3 py-1 rounded-full bg-green-200/30 text-green-700 font-semibold text-xs">{featuredPost.date}</span>
            </div>
            <a href={"/blog/" + featuredPost.id} className="inline-block px-6 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold text-lg">Lire l'article</a>
          </div>
          {/* Image placeholder ou image de l'article si disponible */}
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-purple/20 to-pink/20 flex items-center justify-center">
            {/* Remplacer par featuredPost.image si disponible */}
            <img src="/public/images/blog-featured.jpg" alt="À la une" className="object-cover w-full h-full" />
          </div>
        </div>
      )}
      {/* Section Populaires */}
      {popularPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-pink mb-6 font-serif">Populaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPosts.map((post, idx) => (
              <div
                key={post.id}
                className="bg-gradient-to-r from-pink/10 to-purple/10 rounded-2xl shadow-lg border border-pink/20 p-6 animate-fade-in"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <h3 className="text-xl font-bold text-purple mb-2 font-serif">{post.title}</h3>
                <p className="text-gray-700 mb-2 line-clamp-2">{post.content?.slice(0, 100)}...</p>
                <div className="flex gap-2 items-center mb-2">
                  <span className="px-2 py-1 rounded bg-pink/20 text-pink text-xs font-semibold">{post.category}</span>
                  <span className="px-2 py-1 rounded bg-blue-200/30 text-blue-700 text-xs font-semibold">{post.author}</span>
                  <span className="px-2 py-1 rounded bg-green-200/30 text-green-700 text-xs font-semibold">{post.date}</span>
                </div>
                <a href={"/blog/" + post.id} className="inline-block mt-2 px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg shadow hover:scale-105 transition-transform font-semibold text-sm">Lire</a>
              </div>
            ))}
          </div>
        </div>
      )}
      <BlogStats />
      {loading && <div className="text-center text-purple py-10">Chargement des articles...</div>}
      <header className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple to-pink text-transparent bg-clip-text drop-shadow-lg font-serif">Tous les articles</h2>
        <p className="text-lg text-gray-500">Explorez tous les contenus du blog, classés par date, catégorie ou popularité.</p>
      </header>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex-1 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 rounded-xl border border-purple/30 bg-dark-100 text-white focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="Rechercher un article, mot-clé, catégorie..."
            aria-label="Recherche blog"
          />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="w-full md:w-56 px-4 py-2 rounded-xl border border-purple/30 bg-dark-100 text-white focus:outline-none focus:ring-2 focus:ring-purple"
            aria-label="Trier les articles"
          >
            <option value="date-desc">Date (plus récent)</option>
            <option value="date-asc">Date (plus ancien)</option>
            <option value="title-asc">Titre (A-Z)</option>
            <option value="title-desc">Titre (Z-A)</option>
            <option value="category-asc">Catégorie (A-Z)</option>
            <option value="category-desc">Catégorie (Z-A)</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
          <input
            type="text"
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="w-full md:w-40 px-4 py-2 rounded-xl border border-yellow-300 bg-dark-100 text-white"
            placeholder="Filtrer tag"
            aria-label="Filtrer tag"
          />
          <input
            type="text"
            value={filterAuthor}
            onChange={e => setFilterAuthor(e.target.value)}
            className="w-full md:w-40 px-4 py-2 rounded-xl border border-blue-300 bg-dark-100 text-white"
            placeholder="Filtrer auteur"
            aria-label="Filtrer auteur"
          />
          <input
            type="text"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full md:w-40 px-4 py-2 rounded-xl border border-green-300 bg-dark-100 text-white"
            placeholder="Filtrer catégorie"
            aria-label="Filtrer catégorie"
          />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="w-full md:w-40 px-4 py-2 rounded-xl border border-purple-300 bg-dark-100 text-white"
            placeholder="Filtrer date"
            aria-label="Filtrer date"
          />
          <label className="flex items-center gap-2 text-pink">
            <input
              type="checkbox"
              checked={filterPopular}
              onChange={e => setFilterPopular(e.target.checked)}
              className="accent-pink"
            />
            Populaire (&ge; 10 vues)
          </label>
        </div>
        <button
          className="px-6 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold"
          onClick={() => setShowForm(true)}
        >
          ✍️ Nouvel article
        </button>
        <button
          className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-xl shadow hover:scale-105 transition-transform font-semibold"
          onClick={() => exportBlogPostsToCSV(filteredPosts)}
        >
          Export CSV
        </button>
      </div>
      {showForm && (
        <div className="mb-8">
          <BlogForm onSubmit={addPost} onCancel={() => setShowForm(false)} />
        </div>
      )}
      {/* Modal édition article */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
          <div className="bg-dark-300 rounded-2xl p-8 w-full max-w-lg mx-auto relative">
            <button
              onClick={() => setEditModal({ open: false, post: null })}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              aria-label="Fermer"
            >
              ×
            </button>
            <BlogForm
              initialValues={editModal.post}
              onSubmit={data => editPost(editModal.post.id, data)}
              onCancel={() => setEditModal({ open: false, post: null })}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-3xl shadow-2xl hover:shadow-pink-400/30 transition-shadow duration-300 border border-purple/10 overflow-hidden flex flex-col p-6">
              <BlogPost
                {...post}
                onEdit={['admin','editor'].includes(userRole) ? (id, _postData) => setEditModal({ open: true, post: { ...post, id } }) : undefined}
                onDelete={['admin','editor'].includes(userRole) ? deletePost : undefined}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10 text-lg">Aucun article trouvé.</div>
        )}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            className="px-3 py-1 rounded bg-dark-100 border border-purple/30 text-purple disabled:opacity-50"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            aria-label="Page précédente"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-purple text-white' : 'bg-dark-100 text-purple border-purple/30'} font-semibold`}
              onClick={() => handlePageChange(i + 1)}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-dark-100 border border-purple/30 text-purple disabled:opacity-50"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Page suivante"
          >
            &gt;
          </button>
        </div>
      )}
    </section>
  );
}
