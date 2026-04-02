import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient as apiDeleteClient,
} from '../services/clientApi';

export default function ClientRegistrationPage() {
  // Filtrage avancé par date
  const [filterDate, setFilterDate] = useState('');
  // Recherche dynamique
  const [search, setSearch] = useState('');
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [clients, setClients] = useState([]);
  // Charger les clients depuis l'API au montage
  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(() => setError('Impossible de charger les clients'));
  }, []);
  // Filtrage combiné
  const filteredClients = clients.filter(
    (c) =>
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())) &&
      (filterDate ? c.date === filterDate : true)
  );
  const totalPages = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = filteredClients.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Nom', 'Email', 'Date'];
    const rows = filteredClients.map((c) => [c.name, c.email, c.date]);
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    csvContent += rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'clients.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const navigate = useNavigate();
  // Restriction de sécurité : rediriger si non connecté ou mauvais rôle
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (
      !user ||
      user.role !== 'admin' ||
      user.isSuspended ||
      user.isActive === false
    ) {
      navigate('/login');
    }
  }, [navigate]);
  // Recherche dynamique
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email) {
      setError('Nom et email requis');
      return;
    }
    addClient({
      name: form.name,
      email: form.email,
      date: new Date().toISOString().slice(0, 10),
    })
      .then((newClient) => {
        setClients([...clients, newClient]);
        setForm({ name: '', email: '' });
        setSuccess('Client ajouté avec succès !');
      })
      .catch(() => setError("Erreur lors de l'ajout du client"));
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEdit = (client) => {
    setEditId(client.id);
    setEditForm({ name: client.name, email: client.email });
  };

  const handleEditSave = (id) => {
    updateClient(id, { name: editForm.name, email: editForm.email })
      .then((updated) => {
        setClients(clients.map((c) => (c.id === id ? updated : c)));
        setEditId(null);
        setEditForm({ name: '', email: '' });
        setSuccess('Client modifié avec succès !');
      })
      .catch(() => setError('Erreur lors de la modification du client'));
  };

  const handleDelete = (id) => {
    setError('');
    setSuccess('');
    if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
      apiDeleteClient(id)
        .then(() => {
          setClients(clients.filter((c) => c.id !== id));
          setSuccess('Client supprimé avec succès !');
        })
        .catch(() => setError('Erreur lors de la suppression du client'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 to-dark-300 px-4 py-8">
      {/* Bouton retour site principal */}
      <div className="mb-6 flex justify-start">
        <button
          type="button"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          ← Retour au site principal
        </button>
      </div>
      {/* Header + Logo */}
      <header className="flex items-center gap-4 mb-8">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-12 w-12 rounded-full shadow-lg"
        />
        <h1 className="text-3xl font-bold text-white">
          Enregistrement des Clients
        </h1>
      </header>

      {/* Barre de recherche dynamique + Filtrage avancé + Export CSV */}
      <div className="mb-8 max-w-md mx-auto flex flex-col gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-dark-100/50 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple mb-2"
          placeholder="Rechercher un client par nom ou email..."
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-dark-100/50 border text-white focus:outline-none focus:ring-2 focus:ring-purple mb-2"
        />
        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:scale-105 transition"
        >
          Exporter la liste (CSV)
        </button>
      </div>
      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-dark-300/80 p-6 rounded-xl shadow-lg max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Ajouter un client
        </h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {success && <div className="mb-4 text-green-400">{success}</div>}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm text-gray-300 mb-2">
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-dark-100/50 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="Nom du client"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-dark-100/50 border text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple"
            placeholder="bendelothielcy@gmail.com"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-purple to-pink text-white font-semibold rounded-lg hover:scale-105 transition"
        >
          Ajouter
        </button>
      </form>

      {/* Clients Table */}
      <section className="max-w-2xl mx-auto bg-dark-300/80 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Liste des inscrits
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-400 text-gray-200">
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.map((client) => (
              <tr key={client.id} className="border-b border-gray-700">
                {editId === client.id ? (
                  <>
                    <td className="py-2 px-4 text-white">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="px-2 py-1 rounded bg-dark-100/50 text-white border"
                      />
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="px-2 py-1 rounded bg-dark-100/50 text-white border"
                      />
                    </td>
                    <td className="py-2 px-4 text-gray-400">{client.date}</td>
                    <td className="py-2 px-4">
                      <button
                        className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={() => handleEditSave(client.id)}
                      >
                        Sauver
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={() => setEditId(null)}
                      >
                        Annuler
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 text-white">{client.name}</td>
                    <td className="py-2 px-4 text-gray-300">{client.email}</td>
                    <td className="py-2 px-4 text-gray-400">{client.date}</td>
                    <td className="py-2 px-4">
                      <button
                        className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleEdit(client)}
                      >
                        Éditer
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => handleDelete(client.id)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded bg-dark-100 text-white disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="text-white">
            Page {page} / {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded bg-dark-100 text-white disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </section>
      {/* Bouton Laisser un avis */}
      <div className="max-w-xl mx-auto mb-10 flex justify-center">
        <button
          type="button"
          className="bg-gradient-to-r from-purple to-pink text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition"
          onClick={() => (window.location.href = '/#testimonials')}
        >
          Laisser un avis
        </button>
      </div>
    </div>
  );
}
