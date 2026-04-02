// Service d'API pour les clients
// Remplacez les URLs par celles de votre backend réel

// Utilisation de localStorage pour mocker les clients
const STORAGE_KEY = 'mock_clients';

function getAllClients() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAllClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export async function fetchClients() {
  return getAllClients();
}

export async function addClient(client) {
  const clients = getAllClients();
  const newClient = {
    ...client,
    id: Date.now(),
  };
  clients.push(newClient);
  saveAllClients(clients);
  return newClient;
}

export async function updateClient(id, client) {
  let clients = getAllClients();
  clients = clients.map((c) => (c.id === id ? { ...c, ...client } : c));
  saveAllClients(clients);
  return clients.find((c) => c.id === id);
}

export async function deleteClient(id) {
  let clients = getAllClients();
  clients = clients.filter((c) => c.id !== id);
  saveAllClients(clients);
  return { success: true };
}
