const CACHE_NAME = 'bus-pwa-v8'; // Versão atualizada para forçar a nova instalação
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;700&display=swap' 
];

// Instalação: Coloca todos os arquivos essenciais no cache.
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando e armazenando em cache (V8)...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Falha parcial ou total ao adicionar ao cache (Verifique a URL da fonte):', error);
        });
      })
  );
  self.skipWaiting(); 
});

// Ativação: Limpa caches antigos, garantindo que apenas a versão atualizada permaneça.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando e limpando caches antigos (V8)...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log(`[Service Worker] Deletando cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Busca/Fetch: Estratégia Cache-First
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
