const CACHE_NAME = `BIG_TRIP_V1.0`;

const putToSWCache = () => {
  caches.open(CACHE_NAME);
  // .then((cache) => cache.put(evt.request, response));
};

self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `./`,
        `./index.html`,
        `./js/bundle.js`,
        `./css/main.css`,
        `./css/normalize.css`,
        `./img/star.svg`,
        `./img/star--check.svg`,
      ]);
    });

  evt.waitUntil(openCache);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(fetch(evt.request)
    .then((response) => {
      putToSWCache(evt, response.clone());

      return response.clone();
    })
    .catch(() => {
      return caches.match(evt.request)
        .then((response) => {
          return response;
        })
        .catch((err) => {
          throw err;
        });
    }));
});

