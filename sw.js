// SITAWARE Service Worker
// Handles offline caching and notification scheduling

// v6: force every device to discard stale cached builds from 2026-07-29
const CACHE_NAME = 'sitaware-v6'
const CACHE_URLS = [
  './index.html',
  './manifest.json',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
]

// Install - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CACHE_URLS)
      })
      .catch((err) => {
        console.log('Cache install partial:', err)
      })
  )
  self.skipWaiting()
})

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    })
  )
  self.clients.claim()
})

// Fetch - network first, cache fallback for app shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // API calls and map tiles - always network, never cached
  // (tiles would grow the cache unbounded)
  if (
    url.hostname === 'api.weather.gov' ||
    url.hostname === 'apps.fs.usda.gov' ||
    url.hostname === 'services9.arcgis.com' ||
    url.hostname === 'fsapps.nwcg.gov' ||
    url.hostname === 'gis.blm.gov' ||
    url.hostname === 'tigerweb.geo.census.gov' ||
    url.hostname === 'ipwho.is' ||
    url.hostname.endsWith('tile.openstreetmap.org')
  ) {
    event.respondWith(fetch(event.request))
    return
  }

  // App shell - network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone)
          })
        }
        return response
      })
      .catch(() => {
        return caches.match(event.request)
      })
  )
})

// Push notification handler (for future backend integration)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'SITAWARE Update'
  const options = {
    body: data.body || 'Check your daily fire weather conditions.',
    icon: './icon-512.png',
    badge: './icon-512.png',
    tag: 'sitaware-daily',
    data: { url: './index.html' },
    actions: [
      { action: 'open', title: 'View Conditions' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window or open new
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow('./index.html')
    })
  )
})
