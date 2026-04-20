const CACHE_NAME = 'aluat-cache-v1';
const urlsToCache = [
  '/calculator-aluat/',
  '/calculator-aluat/index.html',
  '/calculator-aluat/manifest.json',
  '/calculator-aluat/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
