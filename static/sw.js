// static/sw.js
self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  // You can add caching logic here if needed
});
// sw placeholder
