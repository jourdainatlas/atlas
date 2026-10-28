// Aperçu autonome des schémas de l'édifice, sans construire le site.
//   node outils/edifice_apercu.mjs DOSSIER_SORTIE nom1 [nom2 …]
// Pour chaque schéma contenu/schemas/<nom>.svg, écrit <nom>-bureau-clair.png, <nom>-bureau-sombre.png,
// <nom>-tel-clair.png et <nom>-tel-sombre.png : la figure dans une colonne de fiche (560 px, puis 358 px
// comme sur téléphone), avec la feuille de style du gabarit et les polices KaTeX. La légende n'est pas
// composée ici (elle l'est par rendu.mjs) ; on vérifie le dessin, ses étiquettes et ses couleurs.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'))); }

const [sortie, ...noms] = process.argv.slice(2);
if (!sortie || !noms.length) { console.error('usage : node outils/edifice_apercu.mjs SORTIE nom…'); process.exit(1); }
fs.mkdirSync(sortie, { recursive: true });
const gabarit = fs.readFileSync('gabarit.html', 'utf8');
const style = [...gabarit.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const katex = path.resolve('node_modules/katex/dist/katex.min.css');

const b = await chromium.launch();
for (const nom of noms) {
  const svg = fs.readFileSync(`contenu/schemas/${nom}.svg`, 'utf8');
  for (const [largeur, tag] of [[560, 'bureau'], [358, 'tel']]) {
    for (const [theme, nt] of [['light', 'clair'], ['dark', 'sombre']]) {
      const html = `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${katex}"><style>${style}
body { background: var(--surface); margin: 0; padding: 16px; }
.col { width: ${largeur}px; }</style></head>
<body><div class="col"><span class="katex">x</span><figure class="schema">${svg}<figcaption>(légende)</figcaption></figure></div></body></html>`;
      const fichier = path.join(sortie, `_${nom}.html`);
      fs.writeFileSync(fichier, html);
      const p = await b.newPage({ viewport: { width: largeur + 32, height: 900 }, deviceScaleFactor: 2 });
      await p.goto('file://' + path.resolve(fichier));
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(250);
      const f = await p.$('figure.schema svg');
      await f.screenshot({ path: path.join(sortie, `${nom}-${tag}-${nt}.png`) });
      await p.close();
      fs.unlinkSync(fichier);
    }
  }
  console.log('aperçu :', nom);
}
await b.close();
