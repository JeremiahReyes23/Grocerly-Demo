const CACHE_NAME = 'grocerly-shell-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/pwa/manifest.json',
  '/pwa/favicon.ico',
  '/pwa/icons/favicon-32x32.png',
  '/pwa/icons/apple-touch-icon.png',
  '/pwa/icons/icon-192x192.png',
  '/pwa/icons/icon-512x512.png',
  // CDN dependencies
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install Event - cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.error('[Service Worker] Failed to cache:', url, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets when offline, or use Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass caching for all API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Handle static assets and external resources (fonts, icons)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          // If the response is valid, update cache
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
          }
          return networkResponse;
        }).catch((err) => {
          console.log('[Service Worker] Fetch failed, serving from cache if available:', err);
        });

        return cachedResponse || fetchedResponse;
      });
    })
  );
});
