// Sonic Drift timer: works offline. Version 69ae5787
const CACHE = "sonic-drift-69ae5787";
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// Page: try the network for a few seconds (to pick up script updates), else use the saved copy.
// Everything else (icons, fonts): saved copy first.
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(Promise.race([
      fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put("index.html", c)); return r; }),
      new Promise((_, no) => setTimeout(no, 3000))
    ]).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(req, c)); return r; })));
});
