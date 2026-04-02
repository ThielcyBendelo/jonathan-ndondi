// Service Worker pour PWA
const CACHE_NAME = 'louiscar-portfolio-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.js',
  '/static/css/main.css',
  '/manifest.json',
  // Polices
  'https://fonts.googleapis.com/css2?family=Antonio:wght@100..700&display=swap',
  'https://fonts.googleapis.com/css2?family=Saira:wght@100..700&display=swap',
  // Images critiques
  '/assets/profile1.jpg',
  '/assets/hero-bg.jpg',
];

// Ressources à mettre en cache dynamiquement
const DYNAMIC_ASSETS = [
  '/assets/',
  'https://fonts.gstatic.com',
  'https://api.placeholder.com',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Installation...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Cache statique ouvert');
        return cache.addAll(
          STATIC_ASSETS.map((url) => {
            return new Request(url, { cache: 'reload' });
          })
        );
      })
      .then(() => {
        console.log('SW: Ressources statiques mises en cache');
        // Forcer l'activation immédiate
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('SW: Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activation...');

  event.waitUntil(
    // Nettoyer les anciens caches
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Nettoyage terminé');
        // Prendre le contrôle immédiatement
        return self.clients.claim();
      })
  );
});

// Stratégie de récupération des ressources
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes vers des domaines externes (sauf polices)
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes('fonts.googleapis.com') &&
    !url.hostname.includes('fonts.gstatic.com') &&
    !url.hostname.includes('api.placeholder.com')
  ) {
    return;
  }

  event.respondWith(handleFetchRequest(request));
});

// Gestion intelligente des requêtes
async function handleFetchRequest(request) {
  try {
    // 1. Cache First pour les ressources statiques
    if (isStaticAsset(request)) {
      return await cacheFirst(request);
    }

    // 2. Network First pour les pages HTML
    if (isHTMLRequest(request)) {
      return await networkFirst(request);
    }

    // 3. Stale While Revalidate pour les images et polices
    if (isAssetRequest(request)) {
      return await staleWhileRevalidate(request);
    }

    // 4. Network Only pour tout le reste
    return await fetch(request);
  } catch (error) {
    console.error('SW: Erreur fetch:', error);

    // Fallback pour les pages HTML
    if (isHTMLRequest(request)) {
      const cachedResponse = await caches.match('/');
      if (cachedResponse) return cachedResponse;
    }

    // Fallback générique
    return new Response('Contenu non disponible hors ligne', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

// Stratégie Cache First
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log('SW: Cache hit:', request.url);
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

// Stratégie Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    return cached || Promise.reject(error);
  }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || (await fetchPromise);
}

// Utilitaires de détection de type de requête
function isStaticAsset(request) {
  return (
    request.url.includes('/static/') ||
    request.url.includes('.js') ||
    request.url.includes('.css') ||
    request.url.includes('manifest.json')
  );
}

function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

function isAssetRequest(request) {
  return (
    request.url.includes('/assets/') ||
    request.url.includes('fonts.g') ||
    request.url.includes('placeholder') ||
    /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(request.url)
  );
}

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
      });
      break;

    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;

    default:
      console.log('SW: Message non géré:', type);
  }
});

// Utilitaires
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    totalSize += keys.length;
  }

  return totalSize;
}

async function clearCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
}

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
    // Notifier tous les clients qu'une nouvelle version est disponible
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'NEW_VERSION_AVAILABLE',
          payload: 'Une nouvelle version est disponible!',
        });
      });
    });
  }
});

console.log('SW: Service Worker chargé ✅');
