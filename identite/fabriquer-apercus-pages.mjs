// Fabrique les images d'aperçu par page (identite/apercus/<cle>.png, 1200 × 630), affichées par les messageries
// quand on partage l'adresse d'un cours, d'une fiche de l'édifice, d'une feuille d'exercices, d'un sujet d'annales
// ou d'une activité (MEMO_atlas_apropos.md §77). Même dessin que les images de rubrique (fabriquer-apercus.mjs) :
// la tuile porte le symbole de la rubrique, ou la vignette de l'activité ; le texte porte le titre de la page.
//
// La liste des fiches vient de la construction (construction/apercus.json, écrite par rendu.mjs). Seules les
// images absentes ou dont la fiche a changé sont refaites ; celles qui n'ont plus de page sont supprimées.
// Marche à suivre : sh construire.sh ; node identite/fabriquer-apercus-pages.mjs <polices> ; sh construire.sh
// (la seconde construction fait désigner les nouvelles images par les pages), puis valider identite/apercus/.
// <polices> : dossier où @fontsource/spectral et @fontsource/ibm-plex-sans sont installés (npm i).
// Option --tout : tout refaire. Python 3 avec Pillow, s'il est là, réduit chaque image à 128 couleurs (≈ 15 Ko).
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { DOSSIER_APERCUS, LISTE_APERCUS, couleurSombre } from './apercus-commun.mjs';
const { chromium } = createRequire('/')('playwright');
const args = process.argv.slice(2), tout = args.includes('--tout'), NM = path.join(args.find(a => !a.startsWith('--')) || '.', 'node_modules/@fontsource');
const f = p => 'data:font/woff2;base64,' + fs.readFileSync(path.join(NM, p)).toString('base64');
const polices = `@font-face{font-family:Spectral;font-weight:600;src:url(${f('spectral/files/spectral-latin-600-normal.woff2')})}
@font-face{font-family:Spectral;font-weight:400;src:url(${f('spectral/files/spectral-latin-400-normal.woff2')})}
@font-face{font-family:Plex;font-weight:500;src:url(${f('ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2')})}
@font-face{font-family:Plex;font-weight:600;src:url(${f('ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2')})}`;

// Symboles et couleurs : repris du gabarit (planche de symboles, palette du thème sombre).
const G = fs.readFileSync('gabarit.html', 'utf8');
const planche = G.match(/<svg class="sym-sprite"[\s\S]*?<\/defs><\/svg>/)[0];
const sy = G.match(/:root\[data-theme="dark"\] \{\s*(--sy-bd[\s\S]*?)\}/)[1];
const classes = [...G.matchAll(/\.(sy-[a-z0-9]+) \{ fill: var\(--\1\); \}/g)].map(m => m[0]).join(' ')
  + ' .activites-sy1{fill:#b6ca4c}.activites-sy2{fill:#b6ca4c;opacity:.55}.activites-sy3{fill:#b6ca4c;opacity:.25}';
const COUL = { edifice: '#55aaff', cours: '#35caa4', exercices: '#c793e6', annales: '#ffa24a', activites: '#b6ca4c' };
const logo = `<svg viewBox="0 0 200 200" width="44" height="44"><rect x="4" y="4" width="192" height="192" rx="42" fill="#1d2027" stroke="#3a3f4a" stroke-width="8"/><g transform="translate(20 20) scale(0.8)"><path d="M150 150 L50 150 L100 50" fill="none" stroke="#a1a6af" stroke-width="13" stroke-linejoin="round"/><path d="M150 150 L100 50" fill="none" stroke="#e7e9ed" stroke-width="13" stroke-linecap="round"/><circle cx="50" cy="150" r="22" fill="#e7e9ed"/><circle cx="150" cy="150" r="16" fill="#e7e9ed"/><circle cx="100" cy="50" r="30" fill="#ff6d7d"/></g></svg>`;
const cadre = `<!doctype html><meta charset="utf-8"><style>${polices}
:root{${sy}} ${classes}
html,body{margin:0;width:1200px;height:630px;background:#121418;overflow:hidden}
body{--c:#55aaff}
.bande{position:absolute;left:0;right:0;top:0;height:12px;background:var(--c)}
.c{position:absolute;inset:12px 0 0 0;display:flex;align-items:center;gap:60px;padding:0 80px}
.tuile{flex:none;width:300px;height:300px;border-radius:64px;background:#1d2027;border:2px solid #2b2f38;display:grid;place-items:center;overflow:hidden}
.tuile svg.sym{width:210px;height:210px}
.tuile.vig{width:400px;border-radius:40px}
/* vignette d'une activité : mêmes règles que .activites-vig du gabarit, aux couleurs du thème sombre */
.tuile svg.vg{width:340px;height:204px;fill:none;stroke:#8f95a0;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;background:#121418;border:1px solid #2b2f38;border-radius:16px}
.vg .a{stroke:var(--c);stroke-width:2.2}.vg .f{fill:var(--c);fill-opacity:.22;stroke:none}.vg .p{fill:var(--c);stroke:none}.vg .t{stroke-dasharray:3 3}.vg .e{stroke:#e7e9ed;stroke-width:2}
.d{min-width:0;flex:1}
.marque{display:flex;align-items:center;gap:16px;font-family:Spectral;font-weight:600;font-size:30px;letter-spacing:.2em;color:#a1a6af}
.sur{margin-top:26px;font-family:Plex,sans-serif;font-weight:600;font-size:22px;line-height:1.3;letter-spacing:.09em;color:var(--c)}
h1{margin:12px 0 16px;font-family:Spectral,'STIX Two Text','STIX Two Math','DejaVu Serif',serif;font-weight:600;line-height:1.1;color:#e7e9ed;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-wrap:balance}
p{margin:0;font-family:Spectral,serif;font-size:28px;line-height:1.35;color:#aeb4be;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.adr{margin-top:26px;font-family:Plex,sans-serif;font-weight:500;font-size:22px;letter-spacing:.04em;color:#8a909b}
</style>${planche}<div class="bande"></div><div class="c"><div class="tuile"></div>
<div class="d"><div class="marque">${logo}ATLAS</div><div class="sur"></div><h1></h1><p></p><div class="adr">atlasjourdain.fr</div></div></div>`;

const fiches = JSON.parse(fs.readFileSync(LISTE_APERCUS, 'utf8'));
const liste = `${DOSSIER_APERCUS}/empreintes.json`;
let faites = {}; try { faites = JSON.parse(fs.readFileSync(liste, 'utf8')); } catch (e) {}
const fichier = c => `${DOSSIER_APERCUS}/${c}.png`;
const aFaire = fiches.filter(x => tout || faites[x.cle] !== x.empreinte || !fs.existsSync(fichier(x.cle)));
const cles = new Set(fiches.map(x => x.cle)), enTrop = Object.keys(faites).filter(c => !cles.has(c));
console.log(`${fiches.length} fiches, ${aFaire.length} image(s) à fabriquer, ${enTrop.length} à supprimer`);

if (aFaire.length) {
  const nav = await chromium.launch(), p = await nav.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(cadre); await p.evaluate(() => document.fonts.ready);
  let n = 0; const t0 = Date.now(), nouvelles = [];
  for (const x of aFaire) {
    await p.evaluate(({ x, c }) => {
      const q = s => document.querySelector(s), nb = x.titre.length;
      document.body.style.setProperty('--c', c);
      const t = q('.tuile'); t.classList.toggle('vig', !!x.vignette);
      t.innerHTML = x.vignette ? `<svg class="vg" viewBox="0 0 120 72">${x.vignette}</svg>` : `<svg class="sym" viewBox="0 0 24 24"><use href="#sym-${x.rub}"/></svg>`;
      q('.sur').textContent = x.sur.replace(/[a-zà-öø-ÿœ]+/g, m => m.toUpperCase());   // capitales pour les lettres latines seulement : β ne doit pas devenir Β
       q('p').textContent = x.sous || ''; q('p').style.display = x.sous ? '' : 'none';
      const h = q('h1'); h.textContent = x.titre;                       // la taille du titre suit sa longueur
      h.style.fontSize = (nb < 16 ? 92 : nb < 28 ? 76 : nb < 44 ? 62 : nb < 70 ? 52 : nb < 110 ? 44 : 37) + 'px';
      h.style.webkitLineClamp = nb < 110 ? 3 : 4;
    }, { x, c: (x.couleur && couleurSombre(x.couleur)) || COUL[x.rub] || '#a3a8b1' });
    fs.mkdirSync(path.dirname(fichier(x.cle)), { recursive: true });
    await p.screenshot({ path: fichier(x.cle) });
    faites[x.cle] = x.empreinte; nouvelles.push(fichier(x.cle));
    if (++n % 200 === 0) { fs.writeFileSync(liste, JSON.stringify(faites, Object.keys(faites).sort(), 0)); console.log(`  ${n} / ${aFaire.length} (${Math.round((Date.now() - t0) / 1000)} s)`); }
  }
  await nav.close();
  // réduction à 128 couleurs (images à aplats : le poids est divisé par trois ou quatre, sans différence visible)
  try {
    for (let i = 0; i < nouvelles.length; i += 300) execFileSync('python3', ['-c', 'import sys\nfrom PIL import Image\nfor f in sys.argv[1:]:\n    Image.open(f).convert("RGB").quantize(128, method=2, dither=Image.Dither.NONE).save(f, optimize=True)', ...nouvelles.slice(i, i + 300)]);
  } catch (e) { console.log('Réduction des couleurs non faite (Python 3 et Pillow absents) : les images restent en couleurs pleines.'); }
}
for (const c of enTrop) { fs.rmSync(fichier(c), { force: true }); delete faites[c]; }
fs.mkdirSync(DOSSIER_APERCUS, { recursive: true });
fs.writeFileSync(liste, JSON.stringify(faites, Object.keys(faites).sort(), 0));
console.log(`Terminé : ${Object.keys(faites).length} images dans ${DOSSIER_APERCUS}/`);
