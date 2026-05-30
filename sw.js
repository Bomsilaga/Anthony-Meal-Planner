const CACHE = "anthony-planner-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  // Network-first for Supabase API calls
  if (e.request.url.includes("supabase.co") || e.request.url.includes("supabase.in")) {
    e.respondWith(
      fetch(e.request).catch(() => new Response(JSON.stringify({data:null,error:"offline"}), {
        headers: {"Content-Type": "application/json"}
      }))
    );
    return;
  }
  // Cache-first for everything else (app shell)
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res.ok) {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      }
      return res;
    }))
  );
});
