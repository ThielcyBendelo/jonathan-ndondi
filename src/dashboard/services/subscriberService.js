let subs = [
  { email: 'user1@example.com', date: '2025-10-01' },
  { email: 'user2@example.com', date: '2025-10-15' },
];
const subscriberService = {
  getAll: () => subs,
  add: (s) => {
    subs.push(s);
    return s;
  },
  remove: (i) => subs.splice(i, 1),
};
export default subscriberService;
