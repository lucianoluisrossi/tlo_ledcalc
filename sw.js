// ─── Actualizar este número con cada deploy ───────────────────
const VERSION = '2025-02-24-001';
const CACHE_NAME = 'tlo-led-calc-' + VERSION;

const STATIC_ASSETS = [
  './manifest.json',
  './tlo-logo.png',
  './icon-192.png',
  './icon-512.png'
];

// Install: pre-cachear solo assets estáticos (NO index.html)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  // Activar inmediatamente sin esperar que cierren las pestañas anteriores
  self.skipWaiting();
});

// Activate: eliminar TODOS los caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Eliminando cache viejo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => {
      // Tomar control de todas las pestañas abiertas inmediatamente
      return self.clients.claim();
    })
  );
});

// Fetch: estrategia según tipo de recurso
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // index.html → NETWORK FIRST: siempre intenta red, cache solo como fallback offline
  if (event.request.mode === 'navigate' || url.pathname.endsWith('index.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Guardar copia fresca en cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Sin red → servir desde cache (modo offline)
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Fuentes de Google → cache-first (no cambian)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  // Assets estáticos (logo, iconos) → cache-first
  if (STATIC_ASSETS.some(a => url.pathname.endsWith(a.replace('./', '')))) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }).catch(() => {});
      })
    );
    return;
  }

  // Todo lo demás → network directo
  event.respondWith(fetch(event.request).catch(() => {}));
});
