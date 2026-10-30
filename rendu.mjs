// Construction de l'atlas, étape 2 : rendu des textes et assemblage de la page.
//
// Lit construction/donnees.json (produit par construire.py), convertit la syntaxe
// des fiches en HTML, compose les formules avec KaTeX (toute erreur de LaTeX arrête
// la construction), puis insère les données et la feuille de style KaTeX, avec ses
// polices embarquées, dans gabarit.html. Écrit le site (site/) et, si ATLAS_APERCU=1, construction/atlas.html.
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
  // Blocs de code : ```python … ``` (avant les formules : le code peut contenir des $).
  const codes = [];
  // Tableaux de texte : ```tableau, une rangée par ligne, cellules séparées par « ¦ » ; la 1re rangée est l'en-tête.
  texte = texte.replace(/```tableau\n([\s\S]*?)\n\s*```/g, (m, corps) => {
    const rangs = corps.split('\n').filter(l => l.trim()).map(l => l.split(' ¦ '));
    const cell = (c, b) => `<${b}>${c.trim() ? rendre(c, ou).replace(/^<p>|<\/p>$/g, '') : ''}</${b}>`;
    const h = `<div class="tab-wrap"><table class="tab-exo"><thead><tr>${rangs[0].map(c => cell(c, 'th')).join('')}</tr></thead><tbody>`
      + rangs.slice(1).map(r => `<tr>${r.map(c => cell(c, 'td')).join('')}</tr>`).join('') + '</tbody></table></div>';
    codes.push(h);
    return `\n\n\u0001${codes.length - 1}\u0001\n\n`;
  });
  // Schémas de l'édifice : ```schema nom ↵ légende ↵ ```. Le SVG de contenu/schemas/nom.svg est inséré
  // tel quel (ses classes prennent les couleurs du thème) ; la légende, rendue comme le texte, dit ce
  // qu'il faut lire sur la figure.
  texte = texte.replace(/```schema ([\w-]+)\n([\s\S]*?)\n\s*```/g, (m, nom, legende) => {
    let svg = '';
    try { svg = fs.readFileSync(`contenu/schemas/${nom}.svg`, 'utf8').replace(/<\?xml[^>]*>\s*/, '').trim(); }
    catch (e) { erreurs.push(`${ou} : schéma introuvable contenu/schemas/${nom}.svg`); }
    const leg = rendre(legende.trim(), `${ou}/schéma ${nom}`).replace(/^<p>|<\/p>$/g, '');
    codes.push(`<figure class="schema" data-schema="${nom}">${svg}<figcaption>${leg}</figcaption></figure>`);
    return `\n\n\u0001${codes.length - 1}\u0001\n\n`;
  });
  texte = texte.replace(/```(\w*)\n([\s\S]*?)\n\s*```/g, (m, lang, code) => {
    const lignes = code.split('\n'), retrait = Math.min(...lignes.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    codes.push(`<pre class="code"${lang ? ` data-lang="${lang}"` : ''}><code>${echappe(lignes.map(l => l.slice(retrait)).join('\n'))}</code></pre>`);
    return `\n\n\u0001${codes.length - 1}\u0001\n\n`;
  });
  // Figures : ![légende](documents/figures/x.svg) seule sur sa ligne.
  texte = texte.replace(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/gm, (m, alt, src) => {
    let dim = '';
    try {
      const m = /<svg[^>]*\bwidth="([\d.]+)(pt)?"[^>]*\bheight="([\d.]+)(pt)?"/.exec(fs.readFileSync(src, 'utf8').slice(0, 600));
      if (m) dim = ` width="${Math.round(m[1] * 1.5)}" height="${Math.round(m[3] * 1.5)}"`;
    } catch (e) { erreurs.push(`${ou} : figure introuvable ${src}`); }
    codes.push(`<figure class="fig"><img src="${echappe(src)}" alt="${echappe(alt)}"${dim} loading="lazy"></figure>`);
    return `\n\n\u0001${codes.length - 1}\u0001\n\n`;
  });
  // Code en ligne : `…` (hors formules).
  const enligne = [];
  texte = texte.replace(/`([^`\n]+)`/g, (m, c) => { enligne.push(`<code>${echappe(c)}</code>`); return `\u0002${enligne.length - 1}\u0002`; });
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
    const code = /^\u0001(\d+)\u0001$/.exec(h.trim());
    if (code) return codes[+code[1]];
    // sous-question : paragraphe qui commence par **(a)**, **a)** ou **(i)** → en retrait
    const sq = /^<strong>\(?[a-z]{1,3}\)<\/strong>/.test(h.trim());
    const seul = /^\u0000(\d+)\u0000$/.exec(h.trim());
    // Une formule en ligne reste collée à la ponctuation qui la suit : sans cela, le navigateur peut couper
    // la ligne entre la formule et la virgule, qui ouvre alors la ligne suivante. La ponctuation est placée
    // dans le dernier bloc insécable (.base) de la formule, en police du texte (.ponct, gabarit).
    const FIN = '</span></span></span>';
    h = h.replace(/\u0000(\d+)\u0000([,.;:)\]]+)/g, (m, k, ponct) => !maths[+k].affichee && maths[+k].html.endsWith(FIN)
      ? maths[+k].html.slice(0, -FIN.length) + `<span class="ponct">${ponct}</span>` + FIN : m);
    h = h.replace(/\u0000(\d+)\u0000/g, (m, k) => maths[+k].html);
    h = h.replace(/\u0002(\d+)\u0002/g, (m, k) => enligne[+k]);
    return seul && maths[+seul[1]].affichee ? `<div class="formule${sq ? ' sq' : ''}">${h}</div>` : `<p${sq ? ' class="sq"' : ''}>${h}</p>`;
  }).join('');
}

const NOMS = { 'définition': 'Définition', 'théorème': 'Théorème', 'proposition': 'Proposition',
  'lemme': 'Lemme', 'corollaire': 'Corollaire', 'chapitre': 'Chapitre', 'axiome': 'Axiome', 'théorie': 'Théorie' };

// Recherche dans l'édifice (gabarit : chercherEdifice) : pour chaque nœud, un extrait en texte brut de
// son texte et de son énoncé, sans formules, schémas ni balisage, en minuscules et sans accents. Il reste
// dans la page même quand les textes des branches sont chargés à la demande.
const brutEdifice = t => String(t || '').replace(/```[\s\S]*?```/g, ' ').replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, ' ')
  .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (m, id, txt) => txt || (D.lexique[id] || {}).terme || id)
  .replace(/\{\{[^}|]+\|([^}]*)\}\}/g, '$1').replace(/[*_`#]/g, '')
  .normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/\s+/g, ' ').trim();
for (const n of Object.values(D.noeuds)) n.cherche = brutEdifice(`${n.texte || ''} ${n.enonce || ''}`).slice(0, 400);

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
// Texte de recherche d'un exercice : énoncé sans les formules, minuscules, sans accents.
const sansAccent = t => t.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
for (const e of D.rubriques?.exercices?.exercices || []) {
  const brut = String(e.enonce || '').replace(/```[\s\S]*?```/g, ' ').replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, ' ').replace(/[*_#]/g, '');
  e.recherche = sansAccent([e.titre, e.partie, ...(e.mots_cles || []), ...(e.types || []), brut].filter(Boolean).join(' ')).replace(/\s+/g, ' ');
}
for (const [nom, r] of Object.entries(D.rubriques || {})) rendreRubrique(r, `rubriques/${nom}`);

// Annales : les formules $…$ du titre, de l'aperçu, des noms et des mots-clés des parties sont vérifiées par
// KaTeX à la construction (une erreur de formule bloque donc la publication). Dans le texte, chaque
// formule est remplacée par un repère \uE000 suivi d'un caractère privé (U+E100 + rang) ; le sujet
// porte F (source LaTeX), Ft (texte, pour la recherche) et, dans l'aperçu à fichier unique seulement,
// Fh (HTML déjà composé). Sur le site, le HTML des quelque 3 000 formules alourdirait l'index de
// plusieurs mégaoctets : le navigateur les compose à l'affichage avec katex.min.js, chargé avec l'index.
// Le gabarit remet les formules en place après échappement et surlignage du texte (annalesF, annalesFt).
const texteTex = tex => tex.replace(/\\(?:mathrm|operatorname|text|mathbb|mathcal|mathbf|mathfrak)\{([^}]*)\}/g, '$1')
  .replace(/\\([a-zA-Z]+)/g, '$1').replace(/[{}^_\\]/g, ' ').replace(/\s+/g, ' ').trim();
for (const s of D.rubriques?.['annales-index']?.sujets || []) {
  const F = [], Ft = [], Fh = [];
  const comp = (t, ou) => typeof t !== 'string' || !t.includes('$') ? t : t.replace(/\$([^$]+?)\$/g, (m, tex) => {
    F.push(tex); Fh.push(tex.length <= 40 ? `<span class="f-ann">${formule(tex, false, ou)}</span>` : formule(tex, false, ou)); Ft.push(texteTex(tex));
    return '\uE000' + String.fromCharCode(0xE100 + F.length - 1);
  });
  const ou = `annales-index/${s.sujet}`;
  s.nom = comp(s.nom, `${ou}/nom`);
  s.apercu = comp(s.apercu, `${ou}/apercu`);
  for (const [i, b] of (s.blocs || []).entries()) {
    b.nom = comp(b.nom, `${ou}/partie ${i + 1}/nom`);
    b.mots = (b.mots || []).map(m => comp(m, `${ou}/partie ${i + 1}/mots`));
  }
  if (F.length > 0xE00) erreurs.push(`${ou} : trop de formules`);
  if (F.length) { s.F = F; s.Ft = Ft; s.Fh = Fh; }
}

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

// Page d'aperçu en un seul fichier (construction/atlas.html, plus de 180 Mo) : le site publié ne s'en sert pas,
// et elle double presque la mémoire du rendu. Elle n'est donc écrite qu'à la demande : ATLAS_APERCU=1 sh construire.sh.
// Les grandes chaînes restent dans un bloc, libérées avant la suite.
if (process.env.ATLAS_APERCU === '1') {
  const json = JSON.stringify(D).replace(/</g, '\\u003c');
  const page = fs.readFileSync('gabarit.html', 'utf8').replace('/*KATEX*/', () => css).replace('"__DONNEES__"', () => json);
  fs.writeFileSync('construction/atlas.html', page);
  console.log(`Page écrite : construction/atlas.html (${(page.length / 1024).toFixed(0)} Ko)`);
}

// Version autonome pour l'hébergement (GitHub Pages) : document HTML complet.
// atlas.html sert à l'aperçu dans Claude, qui ajoute lui-même l'enveloppe du document.

// ---- Site publié : découpage par branche.
// La page ne contient que les graphes, le lexique et les textes de l'édifice ; les textes des fiches
// de chaque branche sont écrits dans site/branches/<graphe>.json et chargés à la demande. La feuille
// de style KaTeX et ses polices deviennent des fichiers séparés, mis en cache par le navigateur.
const empreinte = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 10);
const CHAMPS = ['texte', 'enonce', 'preuve', 'remarques'];
fs.rmSync('site/branches', { recursive: true, force: true });
fs.mkdirSync('site/branches', { recursive: true });
fs.mkdirSync('site/fonts', { recursive: true });
const Dsite = structuredClone(D);
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
// Textes des exercices (énoncé, corrigé) : un fichier par feuille, chargé à l'ouverture des exercices.
// Index du moteur des annales : fichier séparé, chargé à l'ouverture de la rubrique.
const AIsite = Dsite.rubriques?.['annales-index'];
if (AIsite) {
  for (const x of AIsite.sujets || []) delete x.Fh;
  const contenu = JSON.stringify(AIsite.sujets || []);
  fs.writeFileSync('site/annales-index.json', contenu);
  AIsite.aCharger = `annales-index.json?v=${empreinte(contenu)}`;
  // KaTeX côté navigateur, pour les formules de l'index (même version que la construction)
  const kjs = fs.readFileSync(path.join(dist, 'katex.min.js'), 'utf8');
  fs.writeFileSync('site/katex.min.js', kjs);
  AIsite.katex = `katex.min.js?v=${empreinte(kjs)}`;
  AIsite.nombre = (AIsite.sujets || []).length;
  AIsite.sujets = [];
}
const Esite = Dsite.rubriques?.exercices;
if (Esite) {
  fs.rmSync('site/exercices-textes', { recursive: true, force: true });
  fs.mkdirSync('site/exercices-textes', { recursive: true });
  Esite.aCharger = {};
  for (const fe of Esite.feuilles || []) {
    const textes = {};
    for (const e of Esite.exercices || []) if (e.feuille === fe.id) { textes[e.id] = { enonce: e.enonce, corrige: e.corrige }; delete e.enonce; delete e.corrige; }
    if (!Object.keys(textes).length) continue;
    const contenu = JSON.stringify(textes);
    fs.writeFileSync(`site/exercices-textes/${fe.id}.json`, contenu);
    Esite.aCharger[fe.id] = `exercices-textes/${fe.id}.json?v=${empreinte(contenu)}`;
  }
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
const ADRESSE = 'https://www.atlasjourdain.fr/';
const index = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Architecture logique des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème.">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta name="theme-color" content="#f4f5f7">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ATLAS">
<meta property="og:title" content="ATLAS – Architecture des mathématiques">
<meta property="og:description" content="Architecture logique des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème.">
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
const texteBrut = h => String(h || '').replace(/<figure class="schema"[\s\S]*?<\/figure>/g, '').replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<span class="katex-mathml">[\s\S]*?<\/span><\/span>/g, '')
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const coupe = (t, n = 200) => t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t;
const attr = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let nbPartage = 0;
const RUBRIQUES_PARTAGE = { accueil: 'Accueil', edifice: 'L\'édifice', cours: 'Cours', exercices: 'Exercices', annales: 'Annales', 'a-propos': 'À propos' };
function pagePartage(chemin, ancre, titre, description) {
  const url = ADRESSE + chemin, cible = ADRESSE + '#' + ancre;
  // Titre : « ATLAS – <rubrique> » pour une rubrique, « ATLAS – <rubrique> : <titre> » plus profond.
  const tete = chemin.split('/')[0], rubrique = RUBRIQUES_PARTAGE[tete];
  const t = !titre ? 'ATLAS' : !rubrique || titre === rubrique ? `ATLAS – ${titre}` : `ATLAS – ${rubrique} : ${titre}`;
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
pagePartage('accueil/', 'accueil', 'Accueil', 'Architecture logique des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème.');
pagePartage('edifice/', 'edifice', 'L\'édifice', 'Le graphe des théories mathématiques, de la logique du premier ordre et de ZFC aux grandes théories.');
pagePartage('cours/', 'cours', 'Cours', texteBrut(Rb.cours?.intro));
for (const c of Rb.cours?.cours || []) {
  const lieu = `${niveaux[c.niveau] || ''}${c.chapitre ? `, chapitre ${c.chapitre}` : ''}`;
  pagePartage(`cours/${c.id}/`, `cours/${c.id}`, `${texteBrut(c.titre)} — ${lieu}`, texteBrut(c.resume) || `Cours de ${lieu}.`);
}
pagePartage('exercices/', 'exercices', 'Exercices', texteBrut(Rb.exercices?.intro));
for (const e of Rb.exercices?.exercices || []) {
  const fe = (Rb.exercices.feuilles || []).find(f => f.id === e.feuille) || {};
  const lieu = `${texteBrut(fe.titre)}, ${niveaux[fe.niveau] || ''}${fe.chapitre ? ` chapitre ${fe.chapitre}` : ''}`;
  pagePartage(`exercices/${e.id}/`, `exercices/ex/${e.id}`, `Exercice ${e.numero}${e.titre ? ` (${texteBrut(e.titre)})` : ''} — ${lieu}`, texteBrut(e.enonce));
}
pagePartage('annales/', 'annales', 'Annales', texteBrut(Rb.annales?.intro));
pagePartage('a-propos/', 'a-propos', 'À propos', 'L\'auteur d\'ATLAS, professeur agrégé de mathématiques, le projet et ses principes de rédaction ; une adresse pour écrire ou signaler une erreur.');
for (const n of Object.values(D.noeuds)) {
  const ancre = n.sous ? n.sous : `${n.graphe}.${n.id}`;
  const g = D.graphes[n.graphe];
  const contexte = n.graphe === D.racine ? 'Théorie de l\'édifice' : `${NOMS[n.nature] || ''} · ${texteBrut(g.titre)}`;
  pagePartage(`edifice/${n.id}/`, ancre, texteBrut(n.titre), `${contexte}. ${texteBrut(n.texte || n.enonce)}`);
}
console.log(`Pages de partage : ${nbPartage}`);
// Icônes et image d'aperçu (fabriquées par identite/fabriquer-icones.mjs).
for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icone-512.png', 'apercu.png', 'portrait.jpg'])
  fs.copyFileSync(`identite/${f}`, `site/${f}`);
console.log(`Site écrit : site/index.html (${(index.length / 1024).toFixed(0)} Ko)`);
