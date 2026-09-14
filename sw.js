self.addEventListener('install', (e) => {
  console.log('Ghar Se Tiffin Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
});
