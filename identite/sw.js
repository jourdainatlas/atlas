// Service worker d'ATLAS (application installable). Copié dans site/sw.js par rendu.mjs, qui remplace
// __VERSION__ par l'empreinte de la page : chaque publication installe donc un nouveau service worker,
// qui efface le cache de la version précédente.
//
// Stratégie « réseau d'abord » : en ligne, on sert toujours la version publiée (et on en garde une copie) ;
// hors ligne seulement, on sert la dernière copie gardée. Les PDF (documents/) ne sont jamais mis en cache,
// pour ne pas remplir le téléphone ; les polices de Google Fonts, immuables, sont servies depuis le cache.
const CACHE = 'atlas-__VERSION__';
const DEPART = ['./', 'katex.css', 'favicon.svg', 'icone-192.png', 'apple-touch-icon.png', 'portrait.jpg'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(DEPART)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(noms => Promise.all(noms.filter(n => n.startsWith('atlas-') && n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

async function reseauDabord(req, cle) {
  const cache = await caches.open(CACHE);
  try {
    const rep = await fetch(req);
    if (rep.ok) cache.put(cle || req, rep.clone());
    return rep;
  } catch (e) {
    const garde = await cache.match(cle || req, { ignoreSearch: !!cle });
    if (garde) return garde;
    throw e;
  }
}

async function cacheDabord(req) {
  const cache = await caches.open(CACHE);
  const garde = await cache.match(req);
  if (garde) return garde;
  const rep = await fetch(req);
  if (rep.ok || rep.type === 'opaque') cache.put(req, rep.clone());
  return rep;
}

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/documents/') || url.pathname.endsWith('.pdf')) return;   // PDF : réseau seul
    // Navigation vers la racine : une seule entrée de cache, quelle que soit la requête (?source=…).
    if (req.mode === 'navigate' && url.pathname === '/') return ev.respondWith(reseauDabord(req, './'));
    // Autre page (pages de partage /annales/, /cours/t-01/…) : hors ligne et jamais visitée, on renvoie à
    // l'accueil gardé en cache plutôt qu'à la page d'erreur du navigateur.
    if (req.mode === 'navigate') return ev.respondWith(reseauDabord(req).catch(async () => {
      if (await caches.match('./', { ignoreSearch: true })) return Response.redirect('/', 302);
      throw new Error('hors ligne');
    }));
    return ev.respondWith(reseauDabord(req));
  }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') return ev.respondWith(cacheDabord(req));
});
