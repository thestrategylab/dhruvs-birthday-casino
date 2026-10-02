/* Dhruv's Birthday Casino — offline-first service worker */
const CACHE = 'dbc-v2';
const CORE = ['./', 'index.html', 'app.js', 'decks.js', 'manifest.webmanifest',
  'fonts/limelight.woff2', 'fonts/oswald-var.woff2',
  'fonts/sourcesans3-var.woff2', 'fonts/sourcesans3-italic-var.woff2',
  'fonts/librebodoni-var.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // App shell: cache-first, refresh in background.
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit => {
      const net = fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
