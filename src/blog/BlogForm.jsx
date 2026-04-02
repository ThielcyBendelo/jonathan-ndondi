import React, { useState } from 'react';
import { marked } from 'marked';

export default function BlogForm({ onSubmit, onCancel, initialValues }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');
  const [author, setAuthor] = useState(initialValues?.author || '');
  const [category, setCategory] = useState(initialValues?.category || '');
  const [tags, setTags] = useState(initialValues?.tags ? initialValues.tags.join(', ') : '');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content || !author) return;
    onSubmit({
      title,
      content,
      author,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark-200 p-6 rounded mb-6">
  <h3 className="text-xl font-bold mb-4">{initialValues ? 'Modifier l\'article' : 'Nouvel article'}</h3>
      <label className="block mb-2 text-gray-300">Titre</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border bg-dark-100 text-white"
        required
      />
      <label className="block mb-2 text-gray-300">Contenu (Markdown supporté)</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full mb-2 px-3 py-2 rounded border bg-dark-100 text-white font-mono"
        rows={8}
        required
      />
      <button
        type="button"
        className="mb-4 px-3 py-1 bg-purple/80 text-white rounded"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? 'Masquer l\'aperçu' : 'Aperçu Markdown'}
      </button>
      {showPreview && (
        <div className="bg-dark-100 border border-purple/30 rounded p-4 mb-4 text-white prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
      )}
      <label className="block mb-2 text-gray-300">Auteur</label>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border bg-dark-100 text-white"
        required
      />
      <label className="block mb-2 text-gray-300">Catégorie</label>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border bg-dark-100 text-white"
        placeholder="Ex: Technologie, Business, Design"
      />
      <label className="block mb-2 text-gray-300">Tags (séparés par des virgules)</label>
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border bg-dark-100 text-white"
        placeholder="Ex: React, SEO, Innovation"
      />
      <div className="flex gap-3">
  <button type="submit" className="px-4 py-2 bg-purple text-white rounded">{initialValues ? 'Enregistrer' : 'Publier'}</button>
        <button type="button" className="px-4 py-2 bg-gray-600 text-white rounded" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
