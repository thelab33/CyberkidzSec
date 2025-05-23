// ────────────────────────────────────────────────────────────────
//  service-worker.js · Starforge Elite™ Tier
//  Offline-first PWA cache strategy with critical fallbacks
// ────────────────────────────────────────────────────────────────

const CACHE_NAME = 'cyberkidzsec-cache-v1.3';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/static/css/app.min.css',
  '/static/js/app.min.js',
  '/static/images/og/main_vault_banner.png',
  '/static/favicon-32.png',
  '/static/apple-touch-icon.png',
  '/static/sfx/vhs-open.mp3',
  '/static/sfx/vhs-glitch.mp3',
  '/static/sfx/vhs-close.mp3',
];

// Precache critical assets on install
self.addEventListener('install', event => {
  console.log('[SW] Installing and pre-caching...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate & clear old cache versions
self.addEventListener('activate', event => {
  console.log('[SW] Activating and cleaning old caches...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log(`[SW] Removing old cache: ${key}`);
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Navigation requests: network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Other requests: stale-while-revalidate
  event.respondWith(
    caches.match(request).then(cached => {
      const fetched = fetch(request)
        .then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          console.warn(`[SW] Network failed for: ${request.url}`);
          return cached;
        });

      return cached || fetched;
    })
  );
});

