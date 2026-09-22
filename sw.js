const CACHE = 'scadenze-v34';
const BASE = '/Gestione-scadenze-cms';
const FILES = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon.svg',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('version.json') || e.request.url.includes('firestore') || e.request.url.includes('firebase')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
