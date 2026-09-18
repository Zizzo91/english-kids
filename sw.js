/* English Kids — Service Worker
   Cache-first per l'app e le risorse locali; le immagini CDN restano di rete
   (offline → fallback emoji gestito dal gioco). */
const CACHE = 'ek-v1';
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'assets/img/icons/icon-192.png',
  'assets/img/icons/icon-512.png',
  'assets/img/icons/icon-180.png',
  'assets/img/icons/icon-mask-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return resp;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./') || caches.match('index.html');
        throw new Error('offline');
      });
    })
  );
});