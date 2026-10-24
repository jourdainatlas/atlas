// Construction de l'atlas, étape 2 : rendu des textes et assemblage de la page.
//
// Lit construction/donnees.json (produit par construire.py), convertit la syntaxe
// des fiches en HTML, compose les formules avec KaTeX (toute erreur de LaTeX arrête
// la construction), puis insère les données et la feuille de style KaTeX, avec ses
// polices embarquées, dans gabarit.html. Écrit construction/atlas.html.
//
// Syntaxe des fiches :
//   $...$  et  $$...$$     formules LaTeX
//   [[id]]  ou [[id|texte]] terme du lexique, avec définition au survol
//   {{id|texte}}           lien vers un nœud de l'atlas
//   **gras**  *italique*   ; une ligne vide sépare deux paragraphes
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const katex = require('katex');

const D = JSON.parse(fs.readFileSync('construction/donnees.json', 'utf8'));
const erreurs = [];

const echappe = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function formule(tex, affichee, ou) {
  try {
    return katex.renderToString(tex, { displayMode: affichee, throwOnError: true, strict: 'ignore', output: 'html' });
  } catch (e) {
    erreurs.push(`${ou} : ${e.message}`);
    return echappe(tex);
  }
}

function rendre(texte, ou) {
  if (!texte) return '';
  const maths = [];
  let s = texte.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, aff, inl) => {
    const affichee = aff !== undefined;
    maths.push({ html: formule(affichee ? aff : inl, affichee, ou), affichee });
    return `\u0000${maths.length - 1}\u0000`;
  });
  const paragraphes = s.trim().split(/\n\s*\n/);
  return paragraphes.map(p => {
    let h = echappe(p.replace(/\s*\n\s*/g, ' ').trim());
    h = h.replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (m, id, txt) => {
      const e = D.lexique[id];
      if (!e) { erreurs.push(`${ou} : terme inconnu ${id}`); return txt || id; }
      return `<span class="terme" data-g="${id}" tabindex="0" role="button">${txt || echappe(e.terme)}</span>`;
    });
    h = h.replace(/\{\{([^}|]+)\|([^}]*)\}\}/g, (m, id, txt) => {
      const n = D.noeuds[id];
      if (!n) { erreurs.push(`${ou} : nœud inconnu ${id}`); return txt; }
      return `<a class="lien-noeud" href="#${n.graphe}.${id}" data-n="${id}">${txt}</a>`;
    });
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    const seul = /^\u0000(\d+)\u0000$/.exec(h.trim());
    h = h.replace(/\u0000(\d+)\u0000/g, (m, k) => maths[+k].html);
    return seul && maths[+seul[1]].affichee ? `<div class="formule">${h}</div>` : `<p>${h}</p>`;
  }).join('');
}

const NOMS = { 'définition': 'Définition', 'théorème': 'Théorème', 'proposition': 'Proposition',
  'lemme': 'Lemme', 'corollaire': 'Corollaire', 'chapitre': 'Chapitre', 'axiome': 'Axiome', 'théorie': 'Théorie' };

for (const n of Object.values(D.noeuds)) {
  for (const c of ['texte', 'enonce', 'preuve', 'choix']) n[c] = rendre(n[c], `${n.id}/${c}`);
  n.remarques = (n.remarques || []).map((r, i) => rendre(r, `${n.id}/remarque ${i + 1}`));
  n.sorte = NOMS[n.nature] + (n.numero ? ' ' + n.numero : '');
}
for (const e of Object.values(D.lexique)) e.definition = rendre(e.definition, `lexique/${e.id}`);

if (erreurs.length) {
  console.error('ERREURS :\n  - ' + erreurs.join('\n  - '));
  process.exit(1);
}

// Feuille de style KaTeX, polices woff2 embarquées (le site ne peut charger aucune police tierce)
const dist = path.dirname(require.resolve('katex/dist/katex.min.css'));
let css = fs.readFileSync(path.join(dist, 'katex.min.css'), 'utf8');
css = css.replace(/src:url\(fonts\/([^)]+?)\.woff2\) format\("woff2"\)(,url\([^)]+\) format\("[^"]+"\))*/g, (m, f) => {
  const b64 = fs.readFileSync(path.join(dist, 'fonts', f + '.woff2')).toString('base64');
  return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
});
const licenceKatex = fs.readFileSync(path.join(path.dirname(dist), 'LICENSE'), 'utf8').trim();
css = `/*! KaTeX ${require('katex/package.json').version} (feuille de style et polices)\n${licenceKatex}\n*/\n` + css;
if (/url\(fonts\//.test(css)) { console.error('ERREUR : une police KaTeX n\'a pas été embarquée'); process.exit(1); }

const json = JSON.stringify(D).replace(/</g, '\\u003c');
let page = fs.readFileSync('gabarit.html', 'utf8');
page = page.replace('/*KATEX*/', () => css).replace('"__DONNEES__"', () => json);
fs.writeFileSync('construction/atlas.html', page);
console.log(`Page écrite : construction/atlas.html (${(page.length / 1024).toFixed(0)} Ko)`);

// Version autonome pour l'hébergement (GitHub Pages) : document HTML complet.
// atlas.html sert à l'aperçu dans Claude, qui ajoute lui-même l'enveloppe du document.
const coupure = page.indexOf('<div class="app">');
const tete = page.slice(0, coupure), corps = page.slice(coupure);
// Adresse publique du site : les messageries exigent une adresse complète pour l'image d'aperçu.
const ADRESSE = 'https://jourdainatlas.github.io/atlas/';
const index = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="ATLAS, atlas interactif des dépendances entre les théories mathématiques, de la logique aux grandes théories.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#121418">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ATLAS">
<meta property="og:title" content="ATLAS">
<meta property="og:description" content="Atlas interactif des dépendances entre les théories mathématiques, de la logique aux grandes théories.">
<meta property="og:url" content="${ADRESSE}">
<meta property="og:image" content="${ADRESSE}apercu.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo ATLAS : un graphe orienté de l'alpha à l'oméga">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>
${tete}</head>
<body>
${corps}
</body>
</html>
`;
fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/index.html', index);
// Icônes et image d'aperçu (fabriquées par identite/fabriquer-icones.mjs).
for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icone-512.png', 'apercu.png'])
  fs.copyFileSync(`identite/${f}`, `site/${f}`);
console.log(`Site écrit : site/index.html (${(index.length / 1024).toFixed(0)} Ko)`);
