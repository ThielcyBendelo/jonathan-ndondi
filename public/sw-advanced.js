// 🔧 Service Worker amélioré avec Background Sync
const CACHE_VERSION = '1.2.0';
const CACHE_NAME = `Louiscar-ingeba-portfolio-v${CACHE_VERSION}`;
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;
const FORM_CACHE = `${CACHE_NAME}-forms`;

// URLs critiques
const CRITICAL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Page offline de fallback
];

// Installation avec mise en cache critique
self.addEventListener('install', (event) => {
  console.log('SW v2: Installation...');

  event.waitUntil(
    Promise.all([
      // Cache critique
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(CRITICAL_URLS);
      }),

      // Créer cache pour formulaires offline
      caches.open(FORM_CACHE),
    ]).then(() => {
      console.log('SW v2: Caches initialisés');
      return self.skipWaiting();
    })
  );
});

// Activation avec nettoyage intelligent
self.addEventListener('activate', (event) => {
  console.log('SW v2: Activation...');

  event.waitUntil(
    Promise.all([
      // Nettoyer anciens caches
      cleanOldCaches(),

      // Prendre contrôle immédiat
      self.clients.claim(),

      // Initialiser base données offline
      initOfflineStorage(),
    ])
  );
});

// Nettoyage des anciens caches
async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, FORM_CACHE];

  return Promise.all(
    cacheNames.map((cacheName) => {
      if (!validCaches.includes(cacheName)) {
        console.log('SW v2: Suppression cache obsolète:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

// Initialiser stockage offline
async function initOfflineStorage() {
  if ('indexedDB' in self) {
    // Initialiser IndexedDB pour formulaires offline
    console.log('SW v2: IndexedDB disponible pour stockage offline');
  }
}

// Gestion des requêtes avec stratégies avancées
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer requêtes non-GET sauf POST (formulaires)
  if (!['GET', 'POST'].includes(request.method)) return;

  // Stratégie spéciale pour les formulaires
  if (request.method === 'POST' && isFormSubmission(request)) {
    event.respondWith(handleFormSubmission(request));
    return;
  }

  // Stratégies GET habituelles
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request));
  }
});

// Détecter soumission de formulaire
function isFormSubmission(request) {
  const contentType = request.headers.get('content-type') || '';
  return (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/json')
  );
}

// Gérer soumission formulaire
async function handleFormSubmission(request) {
  try {
    // Tentative d'envoi direct
    const response = await fetch(request);

    if (response.ok) {
      console.log('SW v2: Formulaire envoyé directement');
      return response;
    }
  } catch (error) {
    console.log('SW v2: Offline - Stockage formulaire pour sync ultérieur');
  }

  // Stocker pour synchronisation ultérieure
  await storeFormForSync(request);

  // Retourner réponse de succès simulée
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Formulaire sauvegardé. Sera envoyé à la reconnexion.',
      offline: true,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// Stocker formulaire pour sync
async function storeFormForSync(request) {
  try {
    const formData = await request.clone().text();
    const formEntry = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: formData,
      timestamp: Date.now(),
    };

    // Stocker dans IndexedDB ou cache
    const cache = await caches.open(FORM_CACHE);
    const formRequest = new Request(`form-${Date.now()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const formResponse = new Response(JSON.stringify(formEntry));

    await cache.put(formRequest, formResponse);

    // Programmer sync si disponible
    if ('sync' in self.ServiceWorkerRegistration.prototype) {
      await self.registration.sync.register('form-sync');
    }

    console.log('SW v2: Formulaire stocké pour sync');
  } catch (error) {
    console.error('SW v2: Erreur stockage formulaire:', error);
  }
}

// Background Sync pour formulaires
self.addEventListener('sync', (event) => {
  console.log('SW v2: Background sync déclenché:', event.tag);

  if (event.tag === 'form-sync') {
    event.waitUntil(syncStoredForms());
  }
});

// Synchroniser formulaires stockés
async function syncStoredForms() {
  try {
    const cache = await caches.open(FORM_CACHE);
    const keys = await cache.keys();
    const syncPromises = [];

    for (const key of keys) {
      if (key.url.includes('form-')) {
        const response = await cache.match(key);
        const formData = await response.json();

        syncPromises.push(syncSingleForm(formData, key, cache));
      }
    }

    const results = await Promise.allSettled(syncPromises);
    console.log('SW v2: Sync terminé:', results);
  } catch (error) {
    console.error('SW v2: Erreur sync formulaires:', error);
    throw error; // Relancer pour retry automatique
  }
}

// Synchroniser un formulaire
async function syncSingleForm(formData, cacheKey, cache) {
  try {
    const request = new Request(formData.url, {
      method: formData.method,
      headers: formData.headers,
      body: formData.body,
    });

    const response = await fetch(request);

    if (response.ok) {
      // Succès - supprimer du cache
      await cache.delete(cacheKey);
      console.log('SW v2: Formulaire synchronisé et supprimé du cache');

      // Notifier le client
      await notifyClients('FORM_SYNCED', {
        success: true,
        timestamp: formData.timestamp,
      });

      return true;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.log('SW v2: Échec sync formulaire, retry plus tard:', error);
    throw error;
  }
}

// Gestion requêtes GET améliorée
async function handleGetRequest(request) {
  const url = new URL(request.url);

  try {
    // Pages HTML - Network First avec fallback
    if (request.headers.get('accept')?.includes('text/html')) {
      return await networkFirstWithFallback(request);
    }

    // Assets - Cache First
    if (isAssetRequest(request)) {
      return await cacheFirstStrategy(request);
    }

    // APIs - Network First
    if (url.pathname.startsWith('/api/')) {
      return await networkFirstStrategy(request);
    }

    // Défaut - Stale While Revalidate
    return await staleWhileRevalidate(request);
  } catch (error) {
    console.error('SW v2: Erreur requête:', error);
    return await handleOfflineFallback(request);
  }
}

// Network First avec fallback offline
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Essayer cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback page offline
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }

    throw error;
  }
}

// Cache First pour assets
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}

// Network First pour APIs
async function networkFirstStrategy(request) {
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

// Stale While Revalidate
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

// Gérer fallback offline
async function handleOfflineFallback(request) {
  if (request.headers.get('accept')?.includes('text/html')) {
    return (
      (await caches.match('/offline.html')) ||
      new Response('Page non disponible hors ligne', { status: 503 })
    );
  }

  return new Response('Ressource non disponible hors ligne', { status: 503 });
}

// Utilitaires
function isAssetRequest(request) {
  return /\.(css|js|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$/i.test(
    request.url
  );
}

// Notifier les clients
async function notifyClients(type, payload) {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({ type, payload });
  });
}

// Messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'GET_OFFLINE_FORMS':
      getOfflineForms().then((forms) => {
        event.ports[0].postMessage({ type: 'OFFLINE_FORMS', payload: forms });
      });
      break;

    case 'FORCE_SYNC':
      syncStoredForms().then(() => {
        event.ports[0].postMessage({ type: 'SYNC_COMPLETE' });
      });
      break;
  }
});

// Obtenir formulaires offline
async function getOfflineForms() {
  try {
    const cache = await caches.open(FORM_CACHE);
    const keys = await cache.keys();
    const forms = [];

    for (const key of keys) {
      if (key.url.includes('form-')) {
        const response = await cache.match(key);
        const formData = await response.json();
        forms.push({
          id: key.url,
          timestamp: formData.timestamp,
          url: formData.url,
        });
      }
    }

    return forms;
  } catch (error) {
    console.error('SW v2: Erreur récupération formulaires offline:', error);
    return [];
  }
}

console.log('SW v2: Service Worker avancé chargé ✅');
