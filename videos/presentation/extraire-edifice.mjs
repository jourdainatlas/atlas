// Relève sur le site construit la miniature de l'édifice affichée à l'accueil (positions, couleurs, arêtes) : edifice-mini.json.
// À relancer quand l'édifice change, avant fabriquer.sh :
//   sh construire.sh && (cd site && python3 -m http.server 8765 &) && node videos/presentation/extraire-edifice.mjs
// Playwright : ATLAS_PLAYWRIGHT donne le chemin de son index.mjs s'il n'est pas installé dans le dépôt.
import fs from 'node:fs';
const { chromium } = await import(process.env.ATLAS_PLAYWRIGHT || 'playwright');
const b = await chromium.launch(process.env.ATLAS_CHROME ? { executablePath: process.env.ATLAS_CHROME } : {});
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.context().addCookies([{ name: 'atlas-theme', value: 'dark', url: 'http://localhost:8765/' }]);   // la vidéo est en thème sombre
await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const mini = await p.evaluate(() => {
  const s = document.querySelector('#rubrique svg:has(a.nd)'); if (!s) return null;
  const nds = [...s.querySelectorAll('a.nd')].map((a) => { const sh = a.querySelector('rect,circle,ellipse'), cs = getComputedStyle(sh), bb = a.getBBox();
    return { t: a.dataset.t, x: +(bb.x + bb.width / 2).toFixed(1), y: +(bb.y + bb.height / 2).toFixed(1), w: +bb.width.toFixed(1), h: +bb.height.toFixed(1), tag: sh.tagName, cls: a.getAttribute('class'), stroke: cs.stroke, fill: cs.fill, titre: (a.querySelector('title') || {}).textContent || a.getAttribute('aria-label') }; });
  const ar = [...s.querySelectorAll('path.ar')].map((q) => ({ de: q.dataset.de, vers: q.dataset.vers, d: q.getAttribute('d') }));
  return { vb: s.getAttribute('viewBox'), nds, ar };
});
await b.close();
if (!mini) { console.error('Miniature de l’édifice introuvable sur l’accueil.'); process.exit(1); }
fs.writeFileSync(new URL('./edifice-mini.json', import.meta.url), JSON.stringify(mini));
console.log(`edifice-mini.json : ${mini.nds.length} théories, ${mini.ar.length} arêtes`);
