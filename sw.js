const CACHE_NAME = 'rollup-hub-v4';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './registry.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './bridge/rollup-bridge.js',
  './apps/gravity-agent-monitor/index.html',
  './apps/fantasy-manager/index.html',
  './apps/fantasy-manager/data/league_945552.json',
  './apps/shd-div2-intel/index.html',
  './apps/shd-div2-intel/styles.css',
  './apps/shd-div2-intel/app.js',
  './apps/shd-div2-intel/shd_solver_portable.js',
  './apps/shd-div2-intel/shd_storage_adapter.js',
  './apps/csc-site-discovery/index.html',
  './apps/csc-site-discovery/css/field_ui.css',
  './apps/csc-site-discovery/js/discovery_storage_adapter.js',
  './apps/csc-site-discovery/js/app.js',
  './apps/field-snap/index.html',
  './apps/bridge-lab/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return networkResp;
      })
      .catch(() => caches.match(event.request))
  );
});
