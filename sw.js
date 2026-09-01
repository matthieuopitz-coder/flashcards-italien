const CACHE = "flashcards-v28";
const FILES = [
  "/flashcards-italien/",
  "/flashcards-italien/index.html",
  "/flashcards-italien/manifest.json",
  "/flashcards-italien/icon-192.png",
  "/flashcards-italien/icon-512.png"
];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Ne jamais mettre en cache les appels Firebase (authentification, base de données)
  if (url.hostname.indexOf("firebase") !== -1 ||
      url.hostname.indexOf("googleapis") !== -1 ||
      url.hostname.indexOf("gstatic") !== -1 ||
      url.hostname.indexOf("firebaseio") !== -1) {
    return; // laisse le réseau gérer directement
  }
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
