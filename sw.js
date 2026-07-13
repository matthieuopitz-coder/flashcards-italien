const CACHE = "flashcards-v17";
const FILES = [
  "/flashcards-italien/",
  "/flashcards-italien/index.html",
  "/flashcards-italien/manifest.json",
  "/flashcards-italien/icon-192.png",
  "/flashcards-italien/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
