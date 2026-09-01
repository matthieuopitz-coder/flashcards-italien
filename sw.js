const CACHE = "flashcards-v27";
const FILES = [
  "/flashcards-italien/",
  "/flashcards-italien/index.html",
  "/flashcards-italien/manifest.json",
  "/flashcards-italien/icon-192.png",
  "/flashcards-italien/icon-512.png"
];

// Installation : met en cache les fichiers de base et s'active immédiatement
self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

// Activation : supprime les anciens caches et prend le contrôle des pages ouvertes
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stratégie network-first : on cherche d'abord la version en ligne,
// et on ne se rabat sur le cache que si le réseau échoue (mode hors-ligne).
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        // Met à jour le cache avec la version fraîche
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
