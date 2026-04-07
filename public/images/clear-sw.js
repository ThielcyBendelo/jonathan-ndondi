// Script pour nettoyer le Service Worker et le cache
(function() {
  'use strict';
  
  // Désenregistrer tous les Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister().then(function(boolean) {
          console.log('Service Worker désenregistré:', boolean);
        });
      }
    });
  }

  // Vider tous les caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('Tous les caches supprimés');
      // Recharger la page après nettoyage
      window.location.reload(true);
    });
  } else {
    // Si pas de caches API, juste recharger
    window.location.reload(true);
  }
})();