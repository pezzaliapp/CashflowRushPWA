// sw.js v3.0.1-hybrid
const VER='3.0.1-hybrid';
const SHELL='du-shell-'+VER;
const ASSETS=[
  './',
  './index.html',
  './dual.js?v=3.0.1-hybrid',
  './app.js?v=3.0.1-hybrid',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('du-shell-')&&k!==SHELL).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
      .then(async ()=>{
        const wins=await self.clients.matchAll({type:'window',includeUncontrolled:true});
        for(const w of wins) w.postMessage({type:'SW_UPDATED',ver:VER});
      })
  );
});
self.addEventListener('message',e=>{ if(e.data&&e.data.type==='SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.origin!==location.origin) return;
  const isShell=url.search.includes('v=3.0.1-hybrid')||url.pathname.endsWith('/')||url.pathname.endsWith('/index.html');
  if(isShell){
    e.respondWith((async()=>{
      try{
        const fresh=await fetch(e.request,{cache:'no-store'});
        const cache=await caches.open(SHELL);
        cache.put(e.request,fresh.clone());
        return fresh;
      }catch{
        return (await caches.match(e.request))||new Response('Offline', {status:503});
      }
    })());
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
