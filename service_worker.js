const CACHE_NAME = 'v1_cache_crud_pwa';
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos.css',
  '/app.js',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Instalando el Service Worker y almacenando recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error al almacenar en caché', err))
  );
});

// Interceptando peticiones y respondiendo desde la caché
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si encontramos el recurso en la caché, lo retornamos
        if (response) {
          return response;
        }
        // Si no está en la caché, lo solicitamos a la red
        return fetch(event.request);
      })
  );
});

// Actualizando el Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
