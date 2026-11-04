// Macro Plate offline cache. Bump VERSION whenever you upload a new index.html.
const VERSION='macro-plate-v3';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){ // newest page when online, cached page when offline
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put('index.html',c));return r;}).catch(()=>caches.match('index.html')));return;}
  if(url.origin===location.origin||url.hostname.endsWith('fonts.googleapis.com')||url.hostname.endsWith('fonts.gstatic.com')){
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put(req,c));return r;})));}
});
