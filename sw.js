// Swivel-Head Pro Service Worker
// Handles offline caching and notification scheduling

const CACHE_NAME = 'swivel-head-v2';
const CACHE_URLS = [
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

// Install - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS);
    }).catch(err => {
      console.log('Cache install partial:', err);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, cache fallback for app shell
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls - always network
  if (url.hostname === 'api.weather.gov' ||
      url.hostname === 'apps.fs.usda.gov' ||
      url.hostname === 'fsapps.nwcg.gov' ||
      url.hostname === 'gis.blm.gov' ||
      url.hostname === 'tigerweb.geo.census.gov') {
    event.respondWith(fetch(event.request));
    return;
  }

  // App shell - network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push notification handler (for future backend integration)
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Swivel-Head Pro Update';
  const options = {
    body: data.body || 'Check your daily fire weather conditions.',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="%23D4702A"/><g transform="translate(256,270)"><ellipse cx="0" cy="-10" rx="130" ry="145" fill="%23F5C518"/><rect x="-55" y="-168" width="110" height="26" fill="%23E8B510"/><ellipse cx="0" cy="-168" rx="55" ry="12" fill="%23F5C518"/><g transform="translate(-55,-60)"><path d="M0,15C3-10 10-30 18-35C12-20 8-5 15,5C18-15 25-30 30-25C25-10 22,5 25,15C28-5 32-15 35-10C32,5 28,15 20,25C12,30 5,25 0,15Z" fill="%23D4702A"/><circle cx="18" cy="5" r="4" fill="%231C1C1C"/></g><g transform="translate(55,-60)scale(-1,1)"><path d="M0,15C3-10 10-30 18-35C12-20 8-5 15,5C18-15 25-30 30-25C25-10 22,5 25,15C28-5 32-15 35-10C32,5 28,15 20,25C12,30 5,25 0,15Z" fill="%23D4702A"/><circle cx="18" cy="5" r="4" fill="%231C1C1C"/></g><path d="M-30,50Q-15,35 0,40Q15,35 30,50" stroke="%231C1C1C" stroke-width="5" fill="none"/></g></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="%23D4702A"/><g transform="translate(256,270)"><ellipse cx="0" cy="-10" rx="130" ry="145" fill="%23F5C518"/><path d="M-30,50Q-15,35 0,40Q15,35 30,50" stroke="%231C1C1C" stroke-width="5" fill="none"/></g></svg>',
    tag: 'swivel-head-daily',
    data: { url: './index.html' },
    actions: [
      { action: 'open', title: 'View Conditions' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Focus existing window or open new
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('./index.html');
    })
  );
});
