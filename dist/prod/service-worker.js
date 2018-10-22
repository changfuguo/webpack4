/**
*
*  以下代码为自动生成，不要私自替换
*  var sw_config = {}
***/
var SW_CONFIG_NAME = '/sw_config.1.0.0.js';
self.importScripts(SW_CONFIG_NAME);

/*
 common:[],
        static: [],
        remote: [],
        runtime: []
*/
var STATIC_PREFIX = 'static';
var REMOTE_PREFIX = 'remote';
var RUNTIME_PREFIX = 'runtime';
var NOCACHE_PREFIX = 'nonochace';
var expectedCaches = [STATIC_PREFIX, REMOTE_PREFIX, RUNTIME_PREFIX];
self.addEventListener('install', function (event) {
    console.log('sub install')
    self.skipWaiting()
    event.waitUntil(
        caches.open(STATIC_PREFIX)
            .then(function (cache) {
                return cache.addAll(sw_config[STATIC_PREFIX])
            })
    )
})

self.addEventListener('activate', function (event) {
    console.log('sub activate')

    self.clients.claim();
    event.waitUntil(
        caches.keys().then(function (cacheName) {
            return Promise.all(
                cacheName.filter(n => expectedCaches.indexOf(n) === -1)
                .map(n => caches.delete(n))
            )
        })
    )
})

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url)
    var requestPath = requestUrl.pathname
    var cacheName = getCacheName(event.request);
    console.log('fetch:',getCacheName(event.request), event.request.url);

    //本地静态文件
    if (cacheName == STATIC_PREFIX) {
        // console.log("cache first:", requestUrl.href);
        event.respondWith(cacheFirstStrategy(event.request, cacheName))
    } else if (cacheName == REMOTE_PREFIX
        || cacheName == RUNTIME_PREFIX) {
        event.respondWith(networkFirstStrategy(event.request, cacheName))
    } else { //stringContains(event.request.url, 'http://localhost:8092/')
        event.respondWith(fetch(event.request))
    }
})
self.addEventListener('sync', function(event) {
    if (event.tag === 'myFirstSync') {
        console.log('myFirstSync')
    }
});
function cacheFirstStrategy (request, cacheName) {
    cacheName = cacheName || getCacheName(request);
    return caches.match(request).then(function (cacheResponse) {
        return cacheResponse || fetchRequestAndCache(request)
    })
}

function networkFirstStrategy (request, cacheName) {
    cacheName = cacheName || getCacheName(request);
    return fetchRequestAndCache(request, cacheName).catch(function (response) {
        return caches.match(request).then(function (cacheResponse) {
            if (!cacheResponse) {
                var requestUrl = new URL(request.url)
                var requestPath = requestUrl.pathname
            }
        return cacheResponse
        })
    })
}

function fetchRequestAndCache (request, cacheName) {
    cacheName = cacheName || getCacheName(request);
    return fetch(request).then(function (networkResponse) {
        caches.open(cacheName).then(function (cache) {
            cache.put(request, networkResponse)
        })
        return networkResponse.clone()
    })
}


function getCacheName (request) {

    if (arrayContains(request, sw_config.static)) {
        return STATIC_PREFIX;
    } else  if(arrayContains(request, sw_config.runtime)){
        return RUNTIME_PREFIX;
    } else if (arrayContains(request, sw_config.remote)){
        return REMOTE_PREFIX;
    } else {
        return NOCACHE_PREFIX;
    }
}

function arrayContains (request, array) {
    let index = array.findIndex(function(item) {
        return stringContains(request.url, item);
    });

    return index > -1;
}
function stringContains (str, search) {
  return str.indexOf(search) !== -1
}
