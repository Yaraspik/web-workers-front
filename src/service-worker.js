const FETCH_PRIORITY_URLS = ['/', '/index.html', '/style.css'];
const CacheKey = 'cache';

const initCache = () => caches.open(CacheKey)
  .then(
    (cache) =>
      cache.addAll([
        './',
        './index.html',
        './style.css',
      ]),
    (err) => {
      console.log(err);
    },
  );

self.addEventListener('install', (e) => {
  e.waitUntil(initCache());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CacheKey) {
          return caches.delete(key);
        }
      }))),
  );
});

async function fetchPriorityThenCache(e) {
  let response;

  try {
    response = await fetch(e.request);
  } catch (err) {
    const cacheResponse = await caches.match(e.request);
    if (cacheResponse) {
      return cacheResponse;
    }
    console.error(err);
    return new Response('Нет соединения');
  }

  const cache = await caches.open(CacheKey);
  cache.put(e.request, response.clone());
  return response;
}

async function fetchPriorityThenCacheThenImageFallback(e) {
  let response;

  try {
    response = await fetch(e.request);
  } catch (err) {
    const cacheResponse = await caches.match(e.request);

    if (cacheResponse) {
      return cacheResponse;
    }
    console.error(err);
    return;
  }

  const cache = await caches.open(CacheKey);
  cache.put(e.request, response.clone());
  return response;
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (FETCH_PRIORITY_URLS.includes(url.pathname)) {
    e.respondWith(fetchPriorityThenCache(e));
    return;
  }

  if (url.pathname.startsWith()) {
    e.respondWith(fetchPriorityThenCacheThenImageFallback(e));
    return;
  }

  e.respondWith(fetchPriorityThenCache(e));
});
