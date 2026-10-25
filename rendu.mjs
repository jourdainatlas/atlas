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
//   \lex{id}{...}         dans une formule : notation du lexique (ensembles usuels)
//   {{id|texte}}           lien vers un nœud de l'atlas
//   **gras**  *italique*   ; une ligne vide sépare deux paragraphes
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const katex = require('katex');

const D = JSON.parse(fs.readFileSync('construction/donnees.json', 'utf8'));
const erreurs = [];

const echappe = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Dans une formule, \lex{id}{corps} marque une notation définie au lexique (un ensemble usuel,
// par exemple) : le corps est composé normalement, puis enveloppé comme un terme cliquable.
function formule(tex, affichee, ou) {
  tex = tex.replace(/\\lex\{([^}]+)\}/g, (m, id) => {
    if (!D.lexique[id]) erreurs.push(`${ou} : notation inconnue \\lex{${id}}`);
    return `\\htmlData{g=${id}}`;
  });
  try {
    return katex.renderToString(tex, { displayMode: affichee, throwOnError: true, strict: 'ignore', output: 'html',
      trust: c => c.command === '\\htmlData' })
      .replace(/<span class="enclosing" data-g="/g, '<span class="enclosing terme terme-math" tabindex="0" role="button" data-g="');
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
// Rubriques : les champs de texte riche sont rendus comme les fiches ; les titres courts
// (sommaire, parties) peuvent contenir des formules, rendues sans paragraphe.
const RICHES = new Set(['intro', 'resume', 'enonce', 'corrige', 'indication', 'texte']);
const COURTS = new Set(['sommaire', 'parties', 'partie', 'titre']);
const enLigne = (t, ou) => rendre(String(t), ou).replace(/^<p>|<\/p>$/g, '');
function rendreRubrique(o, ou) {
  if (Array.isArray(o)) return o.map((x, i) => rendreRubrique(x, `${ou}[${i}]`));
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === 'string' && RICHES.has(k)) o[k] = rendre(v, `${ou}/${k}`);
      else if (typeof v === 'string' && COURTS.has(k)) o[k] = enLigne(v, `${ou}/${k}`);
      else if (Array.isArray(v) && COURTS.has(k)) o[k] = v.map((t, i) => enLigne(t, `${ou}/${k}[${i}]`));
      else o[k] = rendreRubrique(v, `${ou}/${k}`);
    }
  }
  return o;
}
for (const [nom, r] of Object.entries(D.rubriques || {})) rendreRubrique(r, `rubriques/${nom}`);

for (const e of Object.values(D.lexique)) {
  e.definition = rendre(e.definition, `lexique/${e.id}`);
  if (e.notation) e.notation = formule(e.notation.trim().replace(/^\$|\$$/g, ''), false, `lexique/${e.id}/notation`);
}

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

// ---- Site publié : découpage par branche.
// La page ne contient que les graphes, le lexique et les textes de l'édifice ; les textes des fiches
// de chaque branche sont écrits dans site/branches/<graphe>.json et chargés à la demande. La feuille
// de style KaTeX et ses polices deviennent des fichiers séparés, mis en cache par le navigateur.
const empreinte = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const CHAMPS = ['texte', 'enonce', 'preuve', 'remarques'];
fs.rmSync('site/branches', { recursive: true, force: true });
fs.mkdirSync('site/branches', { recursive: true });
fs.mkdirSync('site/fonts', { recursive: true });
const Dsite = JSON.parse(JSON.stringify(D));
Dsite.aCharger = {};
for (const gid of Object.keys(D.graphes)) {
  if (gid === D.racine) continue;
  const textes = {};
  for (const n of Object.values(Dsite.noeuds)) {
    if (n.graphe !== gid) continue;
    textes[n.id] = { choix: n.choix };
    for (const c of CHAMPS) { textes[n.id][c] = n[c]; delete n[c]; }
    n.choix = n.choix ? true : '';      // l'étoile ⋆ du graphe n'a besoin que de savoir s'il y a un choix
  }
  const contenu = JSON.stringify(textes);
  fs.writeFileSync(`site/branches/${gid}.json`, contenu);
  Dsite.aCharger[gid] = `branches/${gid}.json?v=${empreinte(contenu)}`;
}
let cssSite = fs.readFileSync(path.join(dist, 'katex.min.css'), 'utf8')
  .replace(/src:url\(fonts\/([^)]+?)\.woff2\) format\("woff2"\)(,url\([^)]+\) format\("[^"]+"\))*/g, (m, f) => {
    fs.copyFileSync(path.join(dist, 'fonts', f + '.woff2'), `site/fonts/${f}.woff2`);
    return `src:url(fonts/${f}.woff2) format("woff2")`;
  });
cssSite = `/*! KaTeX ${require('katex/package.json').version} (feuille de style et polices)\n${licenceKatex}\n*/\n` + cssSite;
fs.writeFileSync('site/katex.css', cssSite);
// Documents déposés (PDF des cours…) : copiés tels quels dans le site.
if (fs.existsSync('documents')) fs.cpSync('documents', 'site/documents', { recursive: true });
const vCss = empreinte(cssSite);
const jsonSite = JSON.stringify(Dsite).replace(/</g, '\\u003c');
const pageSite = fs.readFileSync('gabarit.html', 'utf8').replace('/*KATEX*/', '').replace('"__DONNEES__"', () => jsonSite);
const coupureSite = pageSite.indexOf('<div class="app">');
const teteSite = pageSite.slice(0, coupureSite), corpsSite = pageSite.slice(coupureSite);
// Adresse publique du site : les messageries exigent une adresse complète pour l'image d'aperçu.
const ADRESSE = 'https://jourdainatlas.github.io/atlas/';
const index = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="ATLAS, architecture logique des théories mathématiques : un graphe interactif des dépendances, de la logique du premier ordre et de ZFC aux grandes théories.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#121418">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ATLAS">
<meta property="og:title" content="ATLAS">
<meta property="og:description" content="Architecture logique des théories mathématiques, de la logique du premier ordre et de ZFC aux grandes théories.">
<meta property="og:url" content="${ADRESSE}">
<meta property="og:image" content="${ADRESSE}apercu.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo ATLAS : un graphe orienté de l'alpha à l'oméga">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>
<link rel="stylesheet" href="katex.css?v=${vCss}">
${teteSite}</head>
<body>
${corpsSite}
</body>
</html>
`;
fs.mkdirSync('site', { recursive: true });
fs.writeFileSync('site/index.html', index);

// ---- Adresses partageables. Tout ce qui suit « # » n'est jamais envoyé au serveur : les messageries
// voient donc la même page, et le même aperçu, pour toutes les ancres. Chaque cours, rubrique et nœud
// reçoit une petite page à une vraie adresse (cours/t-01/, edifice/<nœud>/), avec son titre, sa
// description et l'image d'aperçu, qui renvoie aussitôt vers l'ancre correspondante du site.
const texteBrut = h => String(h || '').replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<span class="katex-mathml">[\s\S]*?<\/span><\/span>/g, '')
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const coupe = (t, n = 200) => t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t;
const attr = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let nbPartage = 0;
function pagePartage(chemin, ancre, titre, description) {
  const url = ADRESSE + chemin, cible = ADRESSE + '#' + ancre;
  const t = titre ? `${titre} · ATLAS` : 'ATLAS';
  const d = coupe(description || 'Architecture logique des théories mathématiques, de la logique du premier ordre et de ZFC aux grandes théories.');
  fs.mkdirSync('site/' + chemin, { recursive: true });
  fs.writeFileSync(`site/${chemin}index.html`, `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${attr(t)}</title>
<meta name="description" content="${attr(d)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ATLAS">
<meta property="og:title" content="${attr(t)}">
<meta property="og:description" content="${attr(d)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ADRESSE}apercu.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Logo ATLAS : un graphe orienté de l'alpha à l'oméga">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=${attr(cible)}">
<script>location.replace(${JSON.stringify(cible)});</script>
</head>
<body><p><a href="${attr(cible)}">${attr(t)}</a></p></body>
</html>
`);
  nbPartage++;
}
const Rb = D.rubriques || {};
const niveaux = Object.fromEntries((Rb.cours?.niveaux || []).map(n => [n.id, texteBrut(n.titre)]));
pagePartage('cours/', 'cours', 'Cours', texteBrut(Rb.cours?.intro));
for (const c of Rb.cours?.cours || []) {
  const lieu = `${niveaux[c.niveau] || ''}${c.chapitre ? `, chapitre ${c.chapitre}` : ''}`;
  pagePartage(`cours/${c.id}/`, `cours/${c.id}`, `${texteBrut(c.titre)} — ${lieu}`, texteBrut(c.resume) || `Cours de ${lieu}.`);
}
pagePartage('exercices/', 'exercices', 'Exercices', texteBrut(Rb.exercices?.intro));
pagePartage('annales/', 'annales', 'Annales', texteBrut(Rb.annales?.intro));
pagePartage('a-propos/', 'a-propos', 'À propos', 'L\'auteur et le projet ATLAS.');
for (const n of Object.values(D.noeuds)) {
  const ancre = n.sous ? n.sous : `${n.graphe}.${n.id}`;
  const g = D.graphes[n.graphe];
  const contexte = n.graphe === D.racine ? 'Théorie de l\'édifice' : `${NOMS[n.nature] || ''} · ${texteBrut(g.titre)}`;
  pagePartage(`edifice/${n.id}/`, ancre, texteBrut(n.titre), `${contexte}. ${texteBrut(n.texte || n.enonce)}`);
}
console.log(`Pages de partage : ${nbPartage}`);
// Icônes et image d'aperçu (fabriquées par identite/fabriquer-icones.mjs).
for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icone-512.png', 'apercu.png'])
  fs.copyFileSync(`identite/${f}`, `site/${f}`);
console.log(`Site écrit : site/index.html (${(index.length / 1024).toFixed(0)} Ko)`);
