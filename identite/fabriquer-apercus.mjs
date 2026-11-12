// Fabrique les images d'aperçu par rubrique (apercu-<rubrique>.png, 1200 × 630), affichées par les
// messageries et les réseaux quand on partage une adresse du site. À relancer à la main si un symbole,
// une couleur ou un sous-titre change.
// Usage : node identite/fabriquer-apercus.mjs <dossier où @fontsource/spectral, gfs-didot et
// ibm-plex-sans sont installés>   (depuis la racine du dépôt ; les images sont écrites dans identite/)
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const { chromium } = createRequire('/')('playwright');
const NM = path.join(process.argv[2] || '.', 'node_modules/@fontsource');
const f = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(NM, p)).toString('base64');
const polices = `@font-face{font-family:Spectral;font-weight:600;src:url(${f('spectral/files/spectral-latin-600-normal.woff2')})}
@font-face{font-family:Spectral;font-weight:400;src:url(${f('spectral/files/spectral-latin-400-normal.woff2')})}
@font-face{font-family:Plex;font-weight:500;src:url(${f('ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2')})}
@font-face{font-family:'GFS Didot';src:url(${f('gfs-didot/files/gfs-didot-greek-400-normal.woff2')})}`;

// Symboles et couleurs : repris tels quels du gabarit (planche de symboles, palette du thème sombre).
const G = fs.readFileSync('gabarit.html', 'utf8');
const planche = G.match(/<svg class="sym-sprite"[\s\S]*?<\/defs><\/svg>/)[0];
const sombre = G.match(/:root\[data-theme="dark"\] \{\s*(--sy-bd[\s\S]*?)\}/)[1];
const classes = [...G.matchAll(/\.(sy-[a-z0-9]+) \{ fill: var\(--\1\); \}/g)].map(m => m[0]).join(' ')
  + ' .activites-sy1{fill:#b6ca4c}.activites-sy2{fill:#b6ca4c;opacity:.55}.activites-sy3{fill:#b6ca4c;opacity:.25}';   // symbole des Activités (olive du thème sombre)

// Couleur de bande (thème sombre) et sous-titre de chaque rubrique.
const RUB = {
  edifice: ['L’édifice', '#55aaff', 'Le graphe des théories, de la logique du premier ordre et de ZFC aux grandes théories'],
  cours: ['Cours', '#35caa4', 'Cours de mathématiques, de la Seconde au Master, chapitre par chapitre'],
  exercices: ['Exercices', '#c793e6', 'Feuilles d’exercices corrigés, à chercher par thème, par difficulté ou par notion'],
  annales: ['Annales', '#ffa24a', 'Sujets d’écrit des concours d’ingénieurs et de l’enseignement, avec un moteur par thème'],
  activites: ['Activités', '#b6ca4c', 'Explorer, jouer, raisonner, construire : des mathématiques à manipuler'],
  nouveautes: ['Nouveautés', '#a3a8b1', 'Ce qui a été ajouté au site, semaine après semaine'],
  'a-propos': ['À propos', '#a3a8b1', 'L’auteur, le projet, et une adresse pour écrire ou signaler une erreur'],
};
const logo = `<svg viewBox="0 0 200 200" width="44" height="44"><rect x="4" y="4" width="192" height="192" rx="42" fill="#1d2027" stroke="#3a3f4a" stroke-width="8"/><g transform="translate(20 20) scale(0.8)"><path d="M150 150 L50 150 L100 50" fill="none" stroke="#a1a6af" stroke-width="13" stroke-linejoin="round"/><path d="M150 150 L100 50" fill="none" stroke="#e7e9ed" stroke-width="13" stroke-linecap="round"/><circle cx="50" cy="150" r="22" fill="#e7e9ed"/><circle cx="150" cy="150" r="16" fill="#e7e9ed"/><circle cx="100" cy="50" r="30" fill="#ff6d7d"/></g></svg>`;
const carte = (id, [titre, c, sous]) => `<!doctype html><meta charset="utf-8"><style>${polices}
:root{${sombre}} ${classes}
html,body{margin:0;width:1200px;height:630px;background:#121418;overflow:hidden}
.bande{position:absolute;left:0;right:0;top:0;height:12px;background:${c}}
.c{position:absolute;inset:12px 0 0 0;display:flex;align-items:center;gap:64px;padding:0 90px}
.tuile{flex:none;width:300px;height:300px;border-radius:64px;background:#1d2027;border:2px solid #2b2f38;display:grid;place-items:center}
.tuile svg{width:210px;height:210px}
.marque{display:flex;align-items:center;gap:16px;font-family:Spectral;font-weight:600;font-size:30px;letter-spacing:.2em;color:#a1a6af}
h1{margin:22px 0 18px;font-family:Spectral;font-weight:600;font-size:96px;line-height:1;color:#e7e9ed}
p{margin:0;font-family:Spectral;font-size:31px;line-height:1.35;color:#aeb4be;max-width:640px}
.adr{margin-top:30px;font-family:Plex;font-weight:500;font-size:22px;letter-spacing:.04em;color:${c}}
</style>${planche}<div class="bande"></div><div class="c"><div class="tuile"><svg viewBox="0 0 24 24"><use href="#sym-${id}"/></svg></div>
<div><div class="marque">${logo}ATLAS</div><h1>${titre}</h1><p>${sous}</p><div class="adr">atlasjourdain.fr</div></div></div>`;

const nav = await chromium.launch();
const p = await nav.newPage({ viewport: { width: 1200, height: 630 } });
const seules = process.argv.slice(3);   // facultatif : ne refaire que ces rubriques
for (const [id, v] of Object.entries(RUB).filter(([id]) => !seules.length || seules.includes(id))) {
  await p.setContent(carte(id, v));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(150);
  await p.screenshot({ path: `identite/apercu-${id}.png` });
}
await nav.close();
console.log(Object.keys(RUB).map(id => `identite/apercu-${id}.png`).join('\n'));
