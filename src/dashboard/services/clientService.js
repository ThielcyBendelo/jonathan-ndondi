// Simple in-memory client service. Replace with real API later.
let clients = [
  { name: 'Client A', email: 'clienta@example.com' },
  { name: 'Client B', email: 'clientb@example.com' },
];

const clientService = {
  getAll: () => clients,
  add: (c) => {
    clients.push(c);
    return c;
  },
  update: (idx, c) => {
    clients[idx] = c;
    return c;
  },
  remove: (idx) => {
    clients.splice(idx, 1);
  },
};

export default clientService;
