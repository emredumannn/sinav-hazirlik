const VERSION='w100-v3';
const CORE=['./','index.html','style.css','app.js','data/notes.js','data/bank.js','data/mocks.js','data/ltl.js','data/etrav.js','files/istanbul-map.png','manifest.json','icon-180.png','icon-192.png','files/photocopier.png','files/plant-tree.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  if(/\.(pptx|docx|pdf)$/.test(u.pathname)) return; // büyük dosyalar önbelleğe alınmaz
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone(); caches.open(VERSION).then(ca=>ca.put(e.request,c)); return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
