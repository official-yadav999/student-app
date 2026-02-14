self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("spms-cache").then(cache => {
      return cache.addAll([
        "index.html",
        "style.css",
        "script.js",
        "picture.jpg",
        "icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
