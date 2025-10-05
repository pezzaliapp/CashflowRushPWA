// sw.js v3.1.0-career — instant update
const CACHE = 'cfr-career-v3.1.1-' + (self.registration ? self.registration.scope : Math.random());
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    './',
    './index.html',
    './app.js?v=3.1.0-career',
    './dual.js?v=3.1.0-career',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png'
  ]).catch(()=>{})));
});
self.addEventListener('activate', e => {
  e.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>!k.includes('cfr-career-v3.1.1-')).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({type:'window', includeUncontrolled:true});
    clients.forEach(c=>c.postMessage({type:'SW_UPDATED'}));
  })());
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('app.js') || url.pathname.endsWith('dual.js') || url.pathname.endsWith('index.html')) {
    // network-first to pick up updates
    e.respondWith(fetch(e.request).then(r=>{
      const cp = r.clone();
      caches.open(CACHE).then(c=>c.put(e.request, cp));
      return r;
    }).catch(()=>caches.match(e.request)));
  } else {
    // cache-first for assets
    e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
  }
});