// sw.js — Auto-update + smart caching (v2.7+)
const APP_VERSION = 'v2.7.1'; // bump ad ogni release
const CACHE_SHELL = `cashflow-shell-${APP_VERSION}`;
const ASSETS_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: pre-cache app shell e attiva subito il nuovo SW
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_SHELL).then((c) => c.addAll(ASSETS_SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: pulizia vecchie cache + prendi controllo delle pagine
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k.startsWith('cashflow-shell-') && k !== CACHE_SHELL)
        .map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
     .then(async () => {
       // avvisa tutte le pagine di ricaricare (auto-update UX)
       const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
       for (const client of clients) client.postMessage({ type: 'SW_UPDATED', version: APP_VERSION });
     })
  );
});

// Fetch: network-first per index/app, cache-first per il resto
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // ignora cross-origin

  const pathname = url.pathname;
  const isShellCritical = pathname.endsWith('/') || pathname.endsWith('/index.html') || pathname.endsWith('/app.js');

  if (isShellCritical) {
    // NETWORK FIRST con fallback a cache (così gli update arrivano subito)
    e.respondWith((async () => {
      try {
        const fresh = await fetch(e.request, { cache: 'no-store' });
        const cache = await caches.open(CACHE_SHELL);
        cache.put(e.request, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(e.request);
        return cached || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  } else {
    // CACHE FIRST per asset stabili (icone, manifest, ecc.)
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
