const CACHE_NAME = 'rollup-hub-24a838a9';
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
  './apps/csc-site-discovery/index.html',
  './apps/csc-site-discovery/css/field_ui.css',
  './apps/csc-site-discovery/js/discovery_storage_adapter.js',
  './apps/csc-site-discovery/js/app.js',
  './apps/field-snap/index.html',
  './apps/bridge-lab/index.html',
  './apps/shd-div2-intel/index.html',
  './apps/shd-div2-intel/styles.css',
  './apps/shd-div2-intel/shd_solver_portable.js',
  './apps/shd-div2-intel/shd_storage_adapter.js',
  './apps/shd-div2-intel/app.js',
  './apps/sapphire-companion/index.html'
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
  if (!event.request.url.startsWith(self.location.origin)) return;
  const u = new URL(event.request.url);
  if (u.pathname.startsWith('/api/')) return;

  // Live OTA version/hash checks bypass Service Worker & HTTP caches completely
  if (u.searchParams.has('__ota')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200) {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return networkResp;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
