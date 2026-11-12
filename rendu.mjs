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
import { pagesLecture, outilsLecture, apercusPages } from './lecture.mjs';
import { DOSSIER_APERCUS, LISTE_APERCUS } from './identite/apercus-commun.mjs';
import { pagesCoursExercices } from './lecture-cours.mjs';
import { pagesActivites } from './lecture-activites.mjs';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const katex = require('katex');

const D = JSON.parse(fs.readFileSync('construction/donnees.json', 'utf8'));
const erreurs = [];

const echappe = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Espaces insécables avant « : ; ! ? » et « », après « », hors balises HTML (texte déjà échappé, formules en repères).
const insecTexte = t => t.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
const insecables = h => h.replace(/(<[^>]*>)|([^<]+)/g, (m, balise, texte) => balise || insecTexte(texte));

// Dans une formule, \lex{id}{corps} marque une notation définie au lexique (un ensemble usuel,
// par exemple) : le corps est composé normalement, puis enveloppé comme un terme cliquable.
function formule(tex, affichee, ou) {
  tex = tex.replace(/\\lex\{([^}]+)\}/g, (m, id) => {
    if (!D.lexique[id]) erreurs.push(`${ou} : notation inconnue \\lex{${id}}`);
    return `\\htmlData{g=${id}}`;
  });
  // Allègement (9 nov. 2026, MEMO_atlas_apropos.md §52) : la formule est vérifiée ici par KaTeX (une erreur bloque
  // la publication), mais publiée comme un repère <span class="kx">source</span> (kxd : formule centrée) ; le
  // navigateur la compose à l'affichage (gabarit : composerFormule), les pages de lecture en MathML (lecture.mjs).
  // Le HTML composé pesait 20 à 30 fois la source.
  try {
    katex.renderToString(tex, { displayMode: affichee, throwOnError: true, strict: 'ignore', output: 'html',
      trust: c => c.command === '\\htmlData' });
    return `<span class="kx${affichee ? ' kxd' : ''}">${echappe(tex)}</span>`;
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
    // Paragraphe cité, « > … » : raisonnement d'élève à analyser (environnement redaction des feuilles).
    const cite = /^>\s/.test(p.trim());
    if (cite) p = p.trim().replace(/^>\s*/, '');
    const r = rendrePara(p);
    return cite ? `<blockquote class="redaction">${r}</blockquote>` : r;
  }).join('');
  function rendrePara(p) {
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
    // Espace insécable de la typographie française (4 nov. 2026) : avant « : ; ! ? » et « », après « », pour que ces
    // signes n'ouvrent jamais une ligne. Seulement dans le texte : ni dans les balises (attributs), ni dans les formules,
    // le code en ligne ou les blocs, qui ne sont encore ici que des repères \u0000k\u0000, \u0002k\u0002, \u0001k\u0001.
    h = insecables(h);
    const FIN = '</span></span></span>';
    // (le signe qui suit une formule, précédé de son espace insécable, entre lui aussi dans le dernier bloc de la formule)
    // (de même, le guillemet ouvrant suivi de son espace insécable entre dans le premier bloc de la formule qui le suit)
    const DEBUT = '<span class="base">';
    h = h.replace(/(«\u00a0)?\u0000(\d+)\u0000(\u00a0[:;!?»]|[,.;:)\]]+)?/g, (m, ouvre, k, ponct) => {
      const f = maths[+k];
      if (f.affichee || (!ouvre && !ponct)) return m;
      let html = f.html, avant = '', apres = '';
      // repère kx : la ponctuation est portée en attribut, et le navigateur la place dans le bloc de la formule
      if (html.startsWith('<span class="kx')) return html.replace('>', `${ouvre ? ` data-av="${ouvre}"` : ''}${ponct ? ` data-ap="${ponct}"` : ''}>`);
      if (ouvre) { const i = html.indexOf(DEBUT); if (i >= 0) html = html.slice(0, i + DEBUT.length) + `<span class="ponct">${ouvre}</span>` + html.slice(i + DEBUT.length); else avant = ouvre; }
      if (ponct) { if (html.endsWith(FIN)) html = html.slice(0, -FIN.length) + `<span class="ponct">${ponct}</span>` + FIN; else apres = ponct; }
      return avant + html + apres;
    });
    h = h.replace(/\u0000(\d+)\u0000/g, (m, k) => maths[+k].html);
    h = h.replace(/\u0002(\d+)\u0002/g, (m, k) => enligne[+k]);
    return seul && maths[+seul[1]].affichee ? `<div class="formule${sq ? ' sq' : ''}">${h}</div>` : `<p${sq ? ' class="sq"' : ''}>${h}</p>`;
  }
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
// Inventaire des admis (page « État de l'édifice ») : l'objet de chaque entrée est rendu en ligne.
for (const e of D.admis?.entrees || []) e.objet = enLigne(e.objet, `${e.id}/admis`);

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
  // même règle d'espaces insécables que rendre() (texte brut, échappé par le gabarit à l'affichage)
  for (const k of ['nom', 'apercu']) if (typeof s[k] === 'string') s[k] = insecTexte(s[k]);
  for (const [i, b] of (s.blocs || []).entries()) {
    b.nom = comp(b.nom, `${ou}/partie ${i + 1}/nom`);
    b.mots = (b.mots || []).map(m => comp(m, `${ou}/partie ${i + 1}/mots`));
  }
  if (F.length > 0xE00) erreurs.push(`${ou} : trop de formules`);
  if (F.length) { s.F = F; s.Ft = Ft; s.Fh = Fh; }
}

// Titres des nœuds (texte brut, affiché tel quel : fiche, puces, recherche, pages de lecture) : mêmes espaces insécables.
// L'étiquette des bulles du graphe n'est pas touchée (sa largeur sert à la disposition, calculée par construire.py).
for (const n of Object.values(D.noeuds)) if (typeof n.titre === 'string') n.titre = insecTexte(n.titre);
for (const e of Object.values(D.lexique)) {
  e.definition = rendre(e.definition, `lexique/${e.id}`);
  if (e.notation) e.notation = formule(e.notation.trim().replace(/^\$|\$$/g, ''), false, `lexique/${e.id}/notation`);
  // Exemples (onglet Lexique, pastille repliable) : HTML composé ; nex, leur nombre, reste dans l'index de la page.
  if (e.exemples && e.exemples.length) {
    e.exemples = e.exemples.map((x, k) => rendre(x, `lexique/${e.id}/exemple ${k + 1}`));
    e.nex = e.exemples.length;
  } else delete e.exemples;
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
  const page = fs.readFileSync('gabarit.html', 'utf8').replace('/*KATEX*/', () => css).replace('"__DONNEES__"', () => json)
    .replace('</head>', () => `<script>${fs.readFileSync(path.join(dist, 'katex.min.js'), 'utf8')}</script>\n</head>`);
  fs.writeFileSync('construction/atlas.html', page);
  console.log(`Page écrite : construction/atlas.html (${(page.length / 1024).toFixed(0)} Ko)`);
}

// Version autonome pour l'hébergement (GitHub Pages) : document HTML complet.
// atlas.html sert à l'aperçu dans Claude, qui ajoute lui-même l'enveloppe du document.

// ---- Site publié : découpage par branche.
// La page ne contient que les graphes, l'index du lexique et les textes de l'édifice ; les textes des fiches
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
// Lexique : les définitions (HTML KaTeX déjà composé), notations, emplois et renvois « Voir aussi » sont
// dans site/lexique.json (2,8 Mo), que le gabarit demande dès le démarrage sans retarder l'affichage
// (chargerLexique). La page ne garde qu'un index id → [terme, nœud où il est défini] (≈ 36 Ko), qui suffit
// aux libellés, aux comptes de termes et à la recherche dans l'édifice.
{
  // Exemples du lexique (4 nov. 2026 ; par théorie le 5 nov., mémo de l'édifice § 111) : un fichier par théorie de
  // premier niveau, site/exemples/<theorie>.json, demandé seulement à la première ouverture d'une pastille
  // « + N exemples » d'un terme de cette théorie (gabarit : chargerExemples). Les schémas des exemples sont dans
  // leur HTML, donc dans ce fichier et non dans la page. L'index garde le nombre d'exemples et la théorie en
  // troisième et quatrième places, pour la pastille et le pied de la bulle, avant même l'arrivée de lexique.json ;
  // Dsite.exemplesACharger associe à chaque théorie l'adresse de son fichier, avec sa propre empreinte.
  const complet = {}, indexLex = {}, exemples = {};
  for (const [id, e] of Object.entries(Dsite.lexique)) {
    indexLex[id] = e.nex ? [e.terme, e.defini, e.nex, e.theorie] : [e.terme, e.defini];
    complet[id] = { definition: e.definition, notation: e.notation || null, emplois: e.emplois, voir: e.voir };
    if (e.nex) (exemples[e.theorie] ??= {})[id] = e.exemples;
  }
  const contenu = JSON.stringify(complet);
  fs.writeFileSync('site/lexique.json', contenu);
  Dsite.lexique = indexLex;
  Dsite.lexiqueACharger = `lexique.json?v=${empreinte(contenu)}`;
  fs.rmSync('site/exemples', { recursive: true, force: true });
  fs.rmSync('site/exemples.json', { force: true });
  fs.mkdirSync('site/exemples', { recursive: true });
  Dsite.exemplesACharger = {};
  for (const th of Object.keys(exemples).sort()) {
    const contenuEx = JSON.stringify(exemples[th]);
    fs.writeFileSync(`site/exemples/${th}.json`, contenuEx);
    Dsite.exemplesACharger[th] = `exemples/${th}.json?v=${empreinte(contenuEx)}`;
  }
}
// Extraits de recherche des fiches (champ « cherche », ≈ 350 Ko, 90 Ko compressés) : fichier séparé,
// demandé au premier usage d'une recherche (champ de l'édifice, recherche globale) ou quand le navigateur
// est inoccupé (gabarit : chargerCherche). Jusque-là, la recherche porte sur les titres et les termes.
{
  const extraits = {};
  for (const n of Object.values(Dsite.noeuds)) { if (n.cherche) extraits[n.id] = n.cherche; delete n.cherche; }
  const contenu = JSON.stringify(extraits);
  fs.writeFileSync('site/cherche.json', contenu);
  Dsite.chercheACharger = `cherche.json?v=${empreinte(contenu)}`;
}
// Termes définis dans les PDF de cours (outils/cours_termes.py, texte rouge des PDF) : site/cours-termes.json,
// { chapitre: [[terme, page, dans un bloc Définition (1/0)], …] }, chargé par la recherche globale avec les extraits.
// Exclusions à la main dans outils/cours-termes-exclus.txt. Seuls les chapitres déposés dont le PDF est connu comptent.
{
  const brut = fs.existsSync('outils/cours-termes.json') ? JSON.parse(fs.readFileSync('outils/cours-termes.json', 'utf8')) : {};
  const exclus = new Set(fs.existsSync('outils/cours-termes-exclus.txt') ? fs.readFileSync('outils/cours-termes-exclus.txt', 'utf8').split('\n').map(l => l.trim().toLowerCase()).filter(l => l && !l.startsWith('#')) : []);
  const parChapitre = {};
  for (const c of Dsite.rubriques?.cours?.cours || []) {
    const e = c.pdf && c.statut === 'depose' && brut[c.pdf];
    // Fragments à écarter (9 nov.) : passage rouge coupé par une formule (« de classe », « pour tout », « d'éléments »),
    // abréviations de figures (« def », « deg 180 ») et mots seuls de deux lettres.
    const fragment = t => /^(de|du|des|d’|d'|dans|pour|par|sur|en|au|aux|la|le|les|un|une|à|et|ou|si|tel|telle|tels|soit|avec|sans|entre|vers)\b/i.test(t)
      || /^(def|deg)\b/i.test(t) || t.length < 3;
    if (e) parChapitre[c.id] = e.termes.filter(x => !exclus.has(x.t.toLowerCase()) && !fragment(x.t)).map(x => [x.t, x.p, x.def ? 1 : 0]);
  }
  if (Object.keys(parChapitre).length) {
    const contenu = JSON.stringify(parChapitre);
    fs.writeFileSync('site/cours-termes.json', contenu);
    Dsite.coursTermesACharger = `cours-termes.json?v=${empreinte(contenu)}`;
  }
}
// KaTeX côté navigateur : compose toutes les formules du site (repères kx) ; fichier à empreinte, gardé par le
// service worker (cache durable), chargé par la page avant son script.
const KJS = fs.readFileSync(path.join(dist, 'katex.min.js'), 'utf8');
fs.writeFileSync('site/katex.min.js', KJS);
const KATEX_JS = `katex.min.js?v=${empreinte(KJS)}`;
// Textes des exercices (énoncé, corrigé) : un fichier par feuille, chargé à l'ouverture des exercices.
// Index du moteur des annales : fichier séparé, chargé à l'ouverture de la rubrique.
const AIsite = Dsite.rubriques?.['annales-index'];
if (AIsite) {
  for (const x of AIsite.sujets || []) delete x.Fh;
  const contenu = JSON.stringify(AIsite.sujets || []);
  fs.writeFileSync('site/annales-index.json', contenu);
  AIsite.aCharger = `annales-index.json?v=${empreinte(contenu)}`;
  // KaTeX côté navigateur (même version que la construction) : déjà chargé par la page (KATEX_JS, plus bas)
  AIsite.katex = KATEX_JS;
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
  // Index des exercices (numéro, partie, étoiles, types, thèmes, nœuds, notions, pages, texte de recherche) :
  // fichier séparé, chargé à l'ouverture de la rubrique Exercices (gabarit : chargerExercices). La page ne
  // garde que ce dont l'accueil, les cours et les fiches de l'édifice ont besoin : les feuilles (avec leur
  // nombre d'exercices et leurs étoiles), le nombre total et le compte des exercices par nœud.
  const exos = Esite.exercices || [];
  Esite.nombre = exos.length;
  Esite.parNoeud = {};
  for (const e of exos) for (const n of e.noeuds || []) Esite.parNoeud[n] = (Esite.parNoeud[n] || 0) + 1;
  const contenu = JSON.stringify(exos);
  fs.writeFileSync('site/exercices-index.json', contenu);
  Esite.indexACharger = `exercices-index.json?v=${empreinte(contenu)}`;
  Esite.exercices = [];
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
// Activités interactives (rubrique Activités) : modules copiés tels quels, importés à la demande par la page ;
// leur empreinte commune sert de version (?v=) aux imports.
if (fs.existsSync('activites')) {
  fs.cpSync('activites', 'site/activites', { recursive: true });
  Dsite.vActivites = empreinte(fs.readdirSync('activites').sort().map(f => fs.readFileSync(path.join('activites', f), 'utf8')).join('\n'));
}
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
<link rel="manifest" href="site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="ATLAS – Nouveautés" href="nouveautes.xml">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="ATLAS">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="theme-color" content="#121418">
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
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'ATLAS', alternateName: 'ATLAS – Architecture des mathématiques', url: ADRESSE, inLanguage: 'fr', description: 'Architecture logique des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème.', author: { '@type': 'Person', name: 'Armand Jourdain', jobTitle: 'Professeur agrégé de mathématiques' }, license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' }).replace(/</g, '\\u003c')}</script>
<meta name="twitter:card" content="summary_large_image">
<style>body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>
<link rel="stylesheet" href="katex.css?v=${vCss}">
<script src="${KATEX_JS}"></script>
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
const deEchappe = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
// Formule en texte lisible (descriptions des pages, fil RSS, recherche ; MEMO_atlas_apropos.md §68) : symboles
// Unicode à la place des commandes (\\mid → ∣, \\leq → ≤, lettres grecques, ℝ…), fractions simples a/b, exposants
// et indices numériques en caractères supérieurs et inférieurs ; le reste comme texteTex.
const TEX_SYM = { colon: ':', mid: '∣', le: '≤', leq: '≤', leqslant: '≤', ge: '≥', geq: '≥', geqslant: '≥', neq: '≠', ne: '≠', in: '∈', notin: '∉',
  subset: '⊂', subseteq: '⊆', supset: '⊃', cup: '∪', cap: '∩', bigcup: '⋃', bigcap: '⋂', times: '×', cdot: '·', cdots: '⋯', ldots: '…',
  dots: '…', to: '→', rightarrow: '→', longrightarrow: '⟶', mapsto: '↦', longmapsto: '⟼', Rightarrow: '⇒', implies: '⇒', Leftarrow: '⇐',
  iff: '⇔', Leftrightarrow: '⇔', Longleftrightarrow: '⟺', forall: '∀', exists: '∃', neg: '¬', lnot: '¬', land: '∧', wedge: '∧', lor: '∨',
  vee: '∨', infty: '∞', sum: '∑', prod: '∏', int: '∫', partial: '∂', nabla: '∇', approx: '≈', equiv: '≡', sim: '∼', simeq: '≃', cong: '≅',
  pm: '±', mp: '∓', circ: '∘', emptyset: '∅', varnothing: '∅', setminus: '∖', langle: '⟨', rangle: '⟩', lvert: '|', rvert: '|', vert: '|',
  lVert: '‖', rVert: '‖', Vert: '‖', mathcal: '', ell: 'ℓ', prime: '′', perp: '⊥', parallel: '∥', oplus: '⊕', otimes: '⊗', star: '⋆',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', vartheta: 'ϑ', iota: 'ι',
  kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ',
  chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω' };
const TEX_BB = { N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ', K: '𝕂', P: 'ℙ' };
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻', n: 'ⁿ', i: 'ⁱ' };
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', n: 'ₙ', k: 'ₖ', i: 'ᵢ', j: 'ⱼ', p: 'ₚ' };
const texteTexLisible = tex => {
  let t = tex.replace(/\\(?:left|right|big|Big|bigg|Bigg)(?![a-zA-Z])/g, '').replace(/\\(?:,|;|:|!|quad|qquad)/g, ' ').replace(/~/g, ' ')
    .replace(/\\mathbb\s*\{?([A-Z])\}?/g, (m, l) => TEX_BB[l] || l)
    .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (m, a, b) => `${/^\w$/.test(a) ? a : '(' + a + ')'}/${/^\w$/.test(b) ? b : '(' + b + ')'}`)
    .replace(/\\sqrt\{([^{}]*)\}/g, (m, a) => '√' + (/^\w$/.test(a) ? a : '(' + a + ')'))
    .replace(/\\binom\{([^{}]*)\}\{([^{}]*)\}/g, '($2 parmi $1)')
    .replace(/([\^_])(?:\{([^{}]*)\}|([A-Za-z0-9]))/g, (m, op, e1, e2) => { const e = e1 ?? e2, T = op === '^' ? SUP : SUB;
      return [...e].every(c => T[c]) ? [...e].map(c => T[c]).join('') : `${op === '^' ? '\uE003' : '\uE004'}${e.length > 1 ? '(' + e + ')' : e}`; })
    .replace(/\\([a-zA-Z]+)/g, (m, c) => c in TEX_SYM ? ` ${TEX_SYM[c]} ` : m)
    .replace(/\\\{/g, '\uE001').replace(/\\\}/g, '\uE002');
  return texteTex(t).replace(/\uE001/g, '{').replace(/\uE002/g, '}').replace(/\uE003/g, '^').replace(/\uE004/g, '_').replace(/ ([,.;)]|[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿⁱ₀₁₂₃₄₅₆₇₈₉ₙₖᵢⱼₚ′])/g, '$1').replace(/\( /g, '(');
};
const texteBrut = h => String(h || '').replace(/<figure class="schema"[\s\S]*?<\/figure>/g, '').replace(/<span class="kx[^"]*"([^>]*)>([^<]*)<\/span>/g, (m, at, t) => {
    // ponctuation collée à la formule (data-av avant, data-ap après : « », virgule, point…), rendue au texte
    const av = deEchappe((at.match(/data-av="([^"]*)"/) || [])[1] || ''), ap = deEchappe((at.match(/data-ap="([^"]*)"/) || [])[1] || '');
    return ` ${av}${texteTexLisible(deEchappe(t).replace(/\\htmlData\{[^}]*\}/g, ''))}${ap} `; }).replace(/<annotation[\s\S]*?<\/annotation>/g, '').replace(/<span class="katex-mathml">[\s\S]*?<\/span><\/span>/g, '')
  .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/ ([,.])(?=\s|$)/g, '$1').trim();
const coupe = (t, n = 200) => t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t;
const attr = t => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
let nbPartage = 0;
const APERCUS = new Set(['edifice', 'cours', 'exercices', 'annales', 'activites', 'nouveautes', 'a-propos']);   // identite/apercu-<rubrique>.png
const RUBRIQUES_PARTAGE = { accueil: 'Accueil', edifice: 'L\'édifice', cours: 'Cours', exercices: 'Exercices', annales: 'Annales', activites: 'Activités', nouveautes: 'Nouveautés', 'a-propos': 'À propos' };
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
<meta property="og:image" content="${ADRESSE}${APERCUS.has(tete) ? `apercu-${tete}.png` : 'apercu.png'}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${APERCUS.has(tete) ? `ATLAS – ${RUBRIQUES_PARTAGE[tete].replace("'", '’')}` : 'Logo ATLAS : un graphe orienté de l\'alpha à l\'oméga'}">
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
// Contexte des pages de lecture (lecture.mjs) : une rubrique peut écrire les siennes avec
// outilsLecture(ctxLecture).page({...}) ; leurs adresses entrent d'elles-mêmes dans le plan du site.
const ctxLecture = { fs, D, ADRESSE, attr, coupe, texteBrut, NOMS, empreinte, vCss, katex, gabarit: fs.readFileSync('gabarit.html', 'utf8') };
const niveaux = Object.fromEntries((Rb.cours?.niveaux || []).map(n => [n.id, texteBrut(n.titre)]));
pagePartage('accueil/', 'accueil', 'Accueil', 'Architecture logique des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème.');
if (!D.noeuds.etat) pagePartage('edifice/etat/', 'edifice/etat', 'État de l\'édifice', 'Inventaire des résultats admis dans l\'édifice, rangés par statut, et des fiches où intervient l\'axiome du choix.');
// Cours et exercices : pages de lecture complètes et indexables (lecture-cours.mjs, MEMO_atlas_cours.md §29),
// aux adresses de partage cours/, cours/<id>/, exercices/, exercices/feuille/<id>/ et exercices/<id>/.
console.log(`Pages de lecture des cours et exercices : ${pagesCoursExercices(ctxLecture)}`);
// Activités : une page de lecture par activité et la page d'entrée (lecture-activites.mjs, MEMO_atlas_activites.md §119).
if (Rb.activites) console.log(`Pages de lecture des activités : ${pagesActivites(ctxLecture)}`);
pagePartage('nouveautes/', 'nouveautes', 'Nouveautés', texteBrut(Rb.nouveautes?.intro));
pagePartage('a-propos/', 'a-propos', 'À propos', 'L\'auteur d\'ATLAS, professeur agrégé de mathématiques, le projet et ses principes de rédaction ; une adresse pour écrire ou signaler une erreur.');
// Édifice et annales : pages de lecture complètes et indexables (lecture.mjs), aux adresses de partage.
const urlsLecture = pagesLecture(ctxLecture);   // même tableau que outilsLecture(ctxLecture).urls
console.log(`Pages de lecture : ${urlsLecture.length}`);
console.log(`Pages de partage : ${nbPartage}`);
// Icônes et image d'aperçu (fabriquées par identite/fabriquer-icones.mjs).
for (const f of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icone-192.png', 'icone-512.png', 'icone-masquable-512.png', 'apercu.png', ...[...APERCUS].map(r => `apercu-${r}.png`), 'portrait.jpg', 'site.webmanifest'])
  fs.copyFileSync(`identite/${f}`, `site/${f}`);
// Images d'aperçu par page (domaine À propos, §77) : la liste des fiches demandées est écrite pour la fabrique
// (identite/fabriquer-apercus-pages.mjs), les images déjà fabriquées sont copiées, et la construction dit combien
// de pages attendent la leur (elles affichent en attendant l'image de leur rubrique).
{
  const fiches = [...apercusPages.values()];
  fs.writeFileSync(LISTE_APERCUS, JSON.stringify(fiches));
  let faites = {}; try { faites = JSON.parse(fs.readFileSync(`${DOSSIER_APERCUS}/empreintes.json`, 'utf8')); } catch (e) {}
  if (fs.existsSync(DOSSIER_APERCUS)) fs.cpSync(DOSSIER_APERCUS, 'site/apercus', { recursive: true, filter: f => !f.endsWith('.json') });
  const manque = fiches.filter(f => faites[f.cle] !== f.empreinte).length;
  console.log(`Images d'aperçu par page : ${fiches.length - manque} sur ${fiches.length}` + (manque ? ` — ${manque} à fabriquer : node identite/fabriquer-apercus-pages.mjs <dossier des polices> (MEMO_atlas_apropos.md §77)` : ''));
}
// Référencement (domaine À propos) : robots.txt et plan du site. Le plan ne liste que de vraies pages :
// l'accueil, les pages de lecture de l'édifice et des annales, et les PDF des cours et des feuilles. Les pages de partage
// (/cours/t-01/…) redirigent vers une ancre : les lister vaudrait des « pages avec redirection » dans la
// Search Console. Les PDF d'annales, copies de sujets officiels, n'y figurent pas.
{
  const urls = [ADRESSE, ...urlsLecture];
  for (const c of Rb.cours?.cours || []) if (c.pdf && c.statut === 'depose') urls.push(ADRESSE + encodeURI(c.pdf));
  for (const f of Rb.exercices?.feuilles || []) if (f.statut === 'depose') for (const k of ['pdf_enonce', 'pdf_corrige']) if (f[k]) urls.push(ADRESSE + encodeURI(f[k]));
  const xml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  // Date de mise à jour (lastmod) et IndexNow (MEMO_atlas_apropos.md §68). Chaque adresse a une empreinte de son
  // contenu (pages de lecture : titre, description, corps ; PDF : le fichier). La publication précédente a laissé
  // site/sitemap-dates.json ({ adresse: [empreinte, date] }) : une empreinte inchangée garde sa date, une nouvelle
  // prend celle du jour. Sans accès au site (construction locale, réseau coupé), toutes les dates sont celles du
  // jour et rien n'est signalé. Les adresses nouvelles ou modifiées vont dans site/indexnow-a-signaler.json, que le
  // job ovh de publier.yml transmet à IndexNow (outils/indexnow.py) une fois le site en ligne, puis ne publie pas.
  const E = outilsLecture(ctxLecture).empreintesPages;
  const empr = u => E[u] || (u.startsWith(ADRESSE + 'documents/') && fs.existsSync('site/' + decodeURI(u.slice(ADRESSE.length)))
    ? crypto.createHash('sha256').update(fs.readFileSync('site/' + decodeURI(u.slice(ADRESSE.length)))).digest('hex').slice(0, 10) : empreinte(u));
  const auj = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  let prec = null, premier = false;
  try {
    const r = await fetch(ADRESSE + 'sitemap-dates.json', { signal: AbortSignal.timeout(15000) });
    if (r.ok) prec = await r.json(); else if (r.status === 404) { prec = {}; premier = true; }
  } catch { /* hors ligne : dates du jour, rien à signaler */ }
  const dates = {}, aSignaler = [];
  for (const u of new Set(urls)) {
    const h = empr(u), p = prec?.[u];
    dates[u] = p && p[0] === h ? p : [h, auj];
    if (prec && !(p && p[0] === h)) aSignaler.push(u);
  }
  fs.writeFileSync('site/sitemap-dates.json', JSON.stringify(dates));
  if (aSignaler.length) fs.writeFileSync('site/indexnow-a-signaler.json', JSON.stringify(aSignaler));
  console.log(`Dates du plan du site : ${prec ? (premier ? 'première publication' : `${aSignaler.length} adresse(s) nouvelle(s) ou modifiée(s)`) : 'site injoignable, dates du jour'}`);
  fs.writeFileSync(`site/${fs.readFileSync('identite/indexnow-cle.txt', 'utf8').trim()}.txt`, fs.readFileSync('identite/indexnow-cle.txt', 'utf8').trim());
  fs.writeFileSync('site/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].map(u => `  <url><loc>${xml(u)}</loc><lastmod>${dates[u][1]}</lastmod></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync('site/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${ADRESSE}sitemap.xml\n`);
  // llms.txt (proposition de format pour les assistants IA, llmstxt.org ; MEMO_atlas_apropos.md §68) : ce qu'est le
  // site, ses rubriques et ses pages d'entrée, les chapitres de cours. Tiré des données, rien à tenir à la main.
  {
    const ok = new Set(urls), L = [];
    const lien = (t, chemin, d) => ok.has(ADRESSE + chemin) ? `- [${t}](${ADRESSE}${chemin})${d ? ' : ' + d : ''}` : null;
    L.push('# ATLAS', '', "> Architecture logique des théories mathématiques : un graphe qui part des axiomes de la logique du premier ordre et de la théorie des ensembles (ZFC), où chaque définition et chaque théorème est démontré dans l'ordre ; autour de lui, des cours du lycée au master, des exercices corrigés, des sujets de concours rattachés aux théories qui les fondent, et des activités interactives.", '',
      "Site rédigé en français par Armand Jourdain, professeur agrégé de mathématiques. Contenu sous licence CC BY-NC-SA 4.0 (reprise avec citation, sans usage commercial). Chaque page de lecture donne l'énoncé, la démonstration ou le corrigé en texte et en MathML ; les théorèmes admis sont signalés « Admis ici », et l'usage de l'axiome du choix par ⋆.", '',
      '## Rubriques', '', ...[
        lien("L'édifice", 'edifice/', 'les théories, leurs définitions, axiomes et théorèmes démontrés, dans l\'ordre logique'),
        lien('Cours', 'cours/', 'cours du lycée (Seconde à Terminale, options) et de classe préparatoire (Maths Sup – MPSI), chapitre par chapitre, en PDF'),
        lien('Exercices', 'exercices/', 'feuilles d\'exercices corrigés, par niveau et par chapitre'),
        lien('Annales', 'annales/', 'sujets de concours d\'ingénieurs et de l\'enseignement, décrits partie par partie et rattachés aux théories'),
        lien('Activités', 'activites/', 'activités interactives : manipuler, conjecturer, puis lire l\'énoncé et la démonstration'),
      ].filter(Boolean), '', `- [À propos – Contact](${ADRESSE}#a-propos) : l'auteur, le projet, les principes de rédaction`, `- [Plan du site](${ADRESSE}sitemap.xml)`);
    const C = (Rb.cours?.cours || []).map(c => lien(texteBrut(c.titre), `cours/${c.id}/`, niveaux[c.niveau] ? `${niveaux[c.niveau]}${c.chapitre ? ', chapitre ' + c.chapitre : ''}` : '')).filter(Boolean);
    if (C.length) L.push('', '## Chapitres de cours', '', ...C);
    const A = (Rb.activites?.activites || []).map(a => lien(texteBrut(a.titre), `activites/${a.id}/`, texteBrut(a.niveau || ''))).filter(Boolean);
    if (A.length) L.push('', '## Activités', '', ...A);
    fs.writeFileSync('site/llms.txt', L.join('\n') + '\n');
  }
  console.log(`Plan du site : ${new Set(urls).size} adresses`);
}
// Fil RSS des nouveautés (domaine À propos) : site/nouveautes.xml, une entrée par nouveauté. Le lien de
// chaque article vise la page de lecture de son premier lien quand elle existe, sinon l'ancre du site.
{
  const E = Rb.nouveautes?.entrees || [];
  const ecrites = new Set(urlsLecture);
  const versPage = a => {
    const m = String(a || '').split('/');
    const candidates = [m[0] === 'cours' && m[1] ? `cours/${m[1]}/` : '', m[0] === 'exercices' && m[1] === 'feuille' ? `exercices/feuille/${m[2]}/` : '',
      m[0] === 'annales' && m[1] === 'sujet' ? `annales/sujet/${m[2]}/` : '', ['cours', 'exercices', 'annales', 'edifice'].includes(a) ? `${a}/` : '',
      D.noeuds[a] ? `edifice/${a}/` : '', D.noeuds[String(a).split('.').pop()] ? `edifice/${String(a).split('.').pop()}/` : ''].filter(Boolean).map(c => ADRESSE + c);
    return candidates.find(u => ecrites.has(u)) || (a ? `${ADRESSE}#${a}` : `${ADRESSE}#nouveautes`);
  };
  const x = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const date = d => new Date(d + 'T12:00:00Z').toUTCString();
  const items = E.map((e, k) => `  <item>
    <title>${x(texteBrut(e.titre))}</title>
    <link>${x(versPage(e.liens?.[0]?.ancre))}</link>
    <description>${x(texteBrut(e.texte))}</description>
    <category>${x(e.rubrique)}</category>
    <pubDate>${date(e.date)}</pubDate>
    <guid isPermaLink="false">atlas-nouveaute-${e.date}-${E.length - k}</guid>
  </item>`).join('\n');
  fs.writeFileSync('site/nouveautes.xml', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>ATLAS – Nouveautés</title>
  <link>${ADRESSE}#nouveautes</link>
  <atom:link href="${ADRESSE}nouveautes.xml" rel="self" type="application/rss+xml"/>
  <description>Ce qui a été ajouté au site ATLAS : cours, exercices, théories de l'édifice, annales.</description>
  <language>fr</language>
${E[0] ? `  <lastBuildDate>${date(E[0].date)}</lastBuildDate>\n` : ''}${items}
</channel>
</rss>
`);
}
// Lecteur PDF des cours : PDF.js 3.11.174 servi par le site lui-même (vendor/, copie exacte de pdfjs-dist sur
// npm, licence Apache 2.0), et non plus depuis un CDN tiers : rien d'extérieur ne s'exécute dans la page.
fs.mkdirSync('site/pdfjs', { recursive: true });
for (const f of ['pdf.min.js', 'pdf.worker.min.js']) fs.copyFileSync(`vendor/pdfjs-3.11.174/${f}`, `site/pdfjs/${f}`);
// Application installable : service worker, dont la version change à chaque publication (voir identite/sw.js).
fs.writeFileSync('site/sw.js', fs.readFileSync('identite/sw.js', 'utf8').replace("'atlas-__VERSION__'", `'atlas-${empreinte(index)}'`));
console.log(`Site écrit : site/index.html (${(index.length / 1024).toFixed(0)} Ko)`);
