
const CACHE_NAME = 'what2do-cache-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  // Add main assets
  '/lovable-uploads/41c75125-35bf-443d-bee9-e9b59958a166.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Don't cache responses that aren't successful or aren't GET requests
            if (!response || response.status !== 200 || response.type !== 'basic' || 
                event.request.method !== 'GET') {
              return response;
            }
            
            // Clone the response as it's a stream and can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If network request fails, try to serve an offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Add offline fallback for failed resource loads
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // For navigation requests, serve the index page from cache
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        
        // For image requests, you could return a default offline image
        if (event.request.destination === 'image') {
          return caches.match('/placeholder.svg');
        }
        
        // For other resources, just try to match from cache
        return caches.match(event.request);
      })
  );
});
