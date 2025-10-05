// sw.js — Auto-update (v2.8.9)
const APP_VERSION = 'v2.8.9';
const CACHE_SHELL = `cashflow-shell-${APP_VERSION}`;
const ASSETS_SHELL = [
  './',
  './index.html',
  './app.js?v=2.8.9',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_SHELL).then((c) => c.addAll(ASSETS_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('cashflow-shell-') && k !== CACHE_SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      .then(async () => {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of clients) client.postMessage({ type: 'SW_UPDATED', version: APP_VERSION });
      })
  );
});

self.addEventListener('message', (event) => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const isShell = url.search.includes('v=2.8.9') || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/');
  if (isShell) {
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
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});