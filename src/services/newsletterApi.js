// newsletterApi.js : mock API pour enregistrer les abonnements dans localStorage

const STORAGE_KEY = 'newsletter_subscriptions';

export function fetchNewsletters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addNewsletter(newsletter) {
  return new Promise((resolve, reject) => {
    try {
      const newsletters = fetchNewsletters();
      newsletters.push({ ...newsletter, date: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newsletters));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
