const CACHE = 'scadenze-v35';
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
  e.waitUntil(
    caches.keys().then(ks => Promise.all(
      ks.filter(k => k !== CACHE).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Lascia passare senza intercettare: Firebase, version.json, richieste non-GET
  if (e.request.method !== 'GET') return;
  if (url.includes('firestore') || url.includes('firebase') || url.includes('googleapis')) return;
  if (url.includes('version.json')) return;

  // Strategia network-first: prova la rete, fallback alla cache se offline
  e.respondWith(
    fetch(e.request).then(response => {
      // Aggiorna la cache con la risposta fresca
      const clone = response.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return response;
    }).catch(() => caches.match(e.request))
  );
});
