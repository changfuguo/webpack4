/**
*
*  以下代码为自动生成，不要私自替换
*  var sw_config = {}
***/
var SW_CONFIG_NAME = '/sw_config.1.0.0.js';
self.importScripts(SW_CONFIG_NAME);

/*
 common:[],
        vendor:[],
        manifest:[],
        static: [],
        remote: [],
        modules: []
*/
var STATIC_PREFIX = 'static';
var REMOTE_PREFIX = 'remote';

var VENDOR_PREFIX = 'vendor';
var MODULES_PREFIX = 'modules';
var MANIFEST_PREFIX = 'manifest';
var COMMON_PREFIX = 'common';

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches.open(STATIC_PREFIX)
      .then(function (cache) {
        return cache.addAll(sw_config.assets)
      })
  )
})

self.addEventListener('activate', function (event) {
  self.clients.claim();
  // event.waitUntil(
  //   caches.keys().then(function (cacheName) {
  //     return Promise.all(
  //       cacheName.filter(n => expectedCaches.indexOf(n) === -1)
  //         .map(n => caches.delete(n))
  //     )
  //   })
  // )
})

self.addEventListener('fetch', function (event) {
  var requestUrl = new URL(event.request.url)
  var requestPath = requestUrl.pathname

  //静态资源部经过编译的
  if (sw_config.static.indexOf(requestPath) > -1) {
    // console.log("cache first:", requestUrl.href);
    event.respondWith(cacheFirstStrategy(event.request))
  } else if (stringContains(event.request.url, 'http://localhost:8092/')) {
    event.respondWith(networkFirstStrategy(event.request))
  } else {
    event.respondWith(fetch(event.request))
  }
})

function cacheFirstStrategy (request) {
  return caches.match(request).then(function (cacheResponse) {
    return cacheResponse || fetchRequestAndCache(request)
  })
}

function networkFirstStrategy (request) {
  return fetchRequestAndCache(request).catch(function (response) {
    return caches.match(request).then(function (cacheResponse) {
      if (!cacheResponse) {
        var requestUrl = new URL(request.url)
        var requestPath = requestUrl.pathname
      }
      return cacheResponse
    })
  })
}

function fetchRequestAndCache (request) {
  return fetch(request).then(function (networkResponse) {
    caches.open(getCacheName(request)).then(function (cache) {
      cache.put(request, networkResponse)
    })
    return networkResponse.clone()
  })
}

function getCacheName (request) {
  [COMMON_PREFIX, VENDOR_PREFIX, MODULES_PREFIX, manifest]
}

function stringContains (str, search) {
  return str.indexOf(search) !== -1
}
