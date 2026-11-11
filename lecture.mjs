// Pages de lecture indexables (domaine À propos – Contact, référencement ; MEMO_atlas_apropos.md, section 39).
//
// Le site interactif vit sous des ancres (#continuite.c-tvi) que les moteurs de recherche ignorent. Chaque
// fiche de l'édifice et chaque sujet d'annales reçoit donc, à une vraie adresse (/edifice/c-tvi/,
// /annales/sujet/<slug>/), une page complète et légère : le texte déjà composé (formules KaTeX, schémas),
// les liens vers les fiches voisines, et un bouton « Ouvrir dans l'atlas ». Pas de redirection automatique :
// Google n'indexe pas une page qui renvoie aussitôt ailleurs, et montrer aux moteurs autre chose qu'aux
// visiteurs serait sanctionné. Ces adresses sont aussi celles du bouton « Partager ».
//
// Appelé par rendu.mjs, qui fournit les données composées (D) et ses utilitaires ; renvoie les adresses à
// mettre dans le plan du site.

// Gabarit partagé : les autres rubriques (cours, exercices) appellent outilsLecture(ctx) pour écrire leurs
// propres pages de lecture avec la même enveloppe (en-tête, fil d'Ariane, pied, style, données structurées) :
//   const L = outilsLecture(ctx);
//   L.page({ chemin: 'exercices/t-01-07/', titre, description, ancre: 'exercices/ex/t-01-07', fil: [...], corps });
//   L.puce(idNoeud) → lien vers la page de lecture d'une fiche de l'édifice ; L.relier(html) réécrit les liens
//   {{nœud}} d'un texte composé ; L.urls : adresses écrites, à ajouter au plan du site.
// ctx = { fs, D, ADRESSE, attr, coupe, texteBrut, NOMS, empreinte, vCss, gabarit } (fourni par rendu.mjs).
let outilsCache = null;
export function outilsLecture(ctx) {
  if (outilsCache) return outilsCache;
  const { fs, D, ADRESSE, attr, coupe, empreinte, vCss, gabarit } = ctx;
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const urls = [];

  // Feuille de style : celle du site (tokens clair et sombre, fiches, formules, schémas), plus la mise en page
  // propre aux pages de lecture. Un seul fichier, mis en cache par le navigateur pour toutes les pages.
  const cssSite = (gabarit.match(/<style>([\s\S]*?)<\/style>/g) || []).map(b => b.replace(/^<style>|<\/style>$/g, '')).sort((a, b) => b.length - a.length)[0] || '';
  const cssLecture = `
/* ---- pages de lecture */
html, body.l-corps { height: auto; }
.nobr { white-space: nowrap; } math[display="block"] { overflow-x: auto; overflow-y: hidden; padding: 2px 0; }
body.l-corps { min-height: 100%; margin: 0; display: block; }
.l-tete { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 12px; padding: 10px max(16px, env(safe-area-inset-left, 0px)); background: var(--surface); border-bottom: 1px solid var(--filet); }
.l-marque { display: inline-flex; align-items: center; gap: 10px; color: var(--encre); text-decoration: none; font-family: var(--f-titre); font-size: 19px; letter-spacing: .14em; font-weight: 600; }
.l-marque img { width: 28px; height: 28px; border-radius: 7px; }
.l-rubriques { display: flex; gap: 4px 14px; flex-wrap: wrap; margin-left: 8px; font-size: 13.5px; }
.l-rubriques a { color: var(--encre-2); text-decoration: none; }
.l-rubriques a:hover { color: var(--encre); }
.l-ouvrir { margin-left: auto; flex: none; font-size: 13.5px; font-weight: 600; padding: 7px 14px; border-radius: 8px; background: var(--encre); color: var(--papier); text-decoration: none; }
.l-page { max-width: 820px; margin: 0 auto; padding: 22px 16px 64px; }
.l-fil { font-size: 13px; color: var(--encre-3); margin: 0 0 14px; display: flex; flex-wrap: wrap; gap: 4px 8px; }
.l-fil a { color: var(--encre-2); text-decoration: none; }
.l-fil a:hover { text-decoration: underline; }
.l-page .fiche h1 { font-family: var(--f-titre); font-size: 30px; line-height: 1.2; margin: 4px 0 14px; }
.l-page .fiche { font-family: var(--f-texte); font-size: 17px; line-height: 1.6; }
.l-page .fiche details.preuve[open] > summary { margin-bottom: 6px; }
.l-page .liens a.puce { text-decoration: none; color: var(--encre); }
.l-page h2.l-sec { font-family: var(--f-titre); font-size: 21px; margin: 30px 0 10px; }
.l-liste { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.l-liste li { font-family: var(--f-ui); font-size: 14.5px; }
.l-liste a { color: var(--encre); text-decoration: none; border-bottom: 1px solid var(--filet); }
.l-liste a:hover { border-bottom-color: var(--encre-2); }
.l-liste .l-sorte { color: var(--encre-3); font-size: 12.5px; margin-right: 6px; }
.l-ouvrir-bas { display: inline-block; margin-top: 26px; }
.l-page a.terme { text-decoration: none; cursor: pointer; }
.l-page span.terme { cursor: auto; }
.l-page span.terme:hover { background: none; }
.l-404 .l-liste { margin-top: 10px; }
.l-pied { max-width: 820px; margin: 0 auto; padding: 18px 16px 40px; border-top: 1px solid var(--filet); font-size: 12.5px; color: var(--encre-3); }
.l-pied a { color: var(--encre-2); }
.l-ann .l-boutons { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 14px; font-family: var(--f-ui); }
.l-ann .l-boutons a { font-size: 14px; padding: 6px 14px; border-radius: 8px; border: 1px solid var(--filet); color: var(--encre); text-decoration: none; background: var(--surface); }
.l-ann .l-boutons a.plein { background: var(--encre); color: var(--papier); border-color: var(--encre); }
.l-ann .l-partie { margin: 0 0 12px; padding: 10px 14px; border-left: 3px solid var(--filet); background: var(--surface); border-radius: 0 8px 8px 0; }
.l-ann .l-partie h3 { margin: 0 0 4px; font-family: var(--f-titre); font-size: 17px; }
.l-ann .l-partie p { margin: 0; font-family: var(--f-ui); font-size: 13.5px; color: var(--encre-2); }
.l-ann .l-meta { font-family: var(--f-ui); font-size: 13px; color: var(--encre-3); margin: 0 0 8px; }
/* rubriques Cours et Exercices (lecture-cours.mjs) */
.l-sommaire { margin: 0; padding-left: 22px; font-family: var(--f-texte); font-size: 16px; display: grid; gap: 4px; }
.l-sommaire a { color: var(--encre); }
.l-exo h1 .l-titre-exo { font-style: italic; font-weight: 400; }
.l-etiquettes { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.l-notions a { color: var(--encre); text-decoration: underline dotted; text-underline-offset: 3px; }
.l-exo .exo { padding: 0; margin-bottom: 16px; }
.l-exos li { display: grid; gap: 2px; padding: 4px 0; }
.l-exos .difficulte { display: inline-flex; vertical-align: middle; margin-left: 6px; }
.l-extrait { color: var(--encre-3); font-size: 13px; }
.l-suite { display: flex; justify-content: space-between; gap: 12px; margin-top: 26px; font-family: var(--f-ui); font-size: 14px; }
.l-suite a { color: var(--encre-2); text-decoration: none; }
.l-suite a:hover { color: var(--encre); text-decoration: underline; }
@media (max-width: 640px) {
  .l-rubriques { display: none; }
  .l-page .fiche h1 { font-size: 25px; }
  .l-page .fiche { font-size: 16.5px; }
}
`;
  const css = cssSite + cssLecture;
  fs.writeFileSync('site/lecture.css', css);
  const vLecture = empreinte(css);

  // Gabarit commun d'une page de lecture.
  const THEME = `<script>(function(){var t=null;try{t=(document.cookie.match(/(?:^|; )atlas-theme=(light|dark)/)||[])[1]||null}catch(e){}if(!t)try{t=sessionStorage.getItem('atlas-theme')}catch(e){}document.documentElement.dataset.theme=t==='dark'?'dark':'light'})();</script>`;
  // fichier : chemin imposé (404.html) ; indexable: false → noindex, ni adresse canonique ni plan du site.
  // Image d'aperçu de la rubrique (identite/apercu-<rubrique>.png, fabriquer-apercus.mjs), sinon celle du site.
  function imageApercu(chemin) {
    const r = { edifice: 'L’édifice', cours: 'Cours', exercices: 'Exercices', annales: 'Annales', nouveautes: 'Nouveautés', 'a-propos': 'À propos' };
    const t = String(chemin || '').split('/')[0];
    return `<meta property="og:image" content="${ADRESSE}${r[t] ? `apercu-${t}.png` : 'apercu.png'}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${r[t] ? `ATLAS – ${r[t]}` : 'Logo ATLAS : un graphe orienté de l\'alpha à l\'oméga'}">`;
  }
  // Formules : les données portent des repères <span class="kx">source</span> (rendu.mjs, §52 du mémo) ; ici, elles
  // deviennent du MathML, que les navigateurs affichent seuls et que les moteurs lisent, bien plus léger que le
  // HTML de KaTeX. La ponctuation collée (data-av, data-ap) est remise autour, dans un même bloc insécable.
  const deEch = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  // Chrome n'applique pas mathvariant (hors « normal ») : les lettres stylées sont remplacées par leurs caractères
  // Unicode mathématiques (ℤ, 𝒜, 𝔤, 𝐯…), que toutes les polices mathématiques savent afficher.
  const VAR = { 'double-struck': [0x1D538, { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' }], script: [0x1D49C, { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' }],
    fraktur: [0x1D504, { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' }], bold: [0x1D400, {}], 'bold-italic': [0x1D468, {}], 'sans-serif': [0x1D5A0, {}] };
  const lettre = (v, t) => [...t].map(c => {
    const [base, exc] = VAR[v]; if (exc[c]) return exc[c];
    const k = c >= 'A' && c <= 'Z' ? c.charCodeAt(0) - 65 : c >= 'a' && c <= 'z' ? 26 + c.charCodeAt(0) - 97 : -1;
    return k < 0 ? c : String.fromCodePoint(base + k);
  }).join('');
  const styler = m => m.replace(/<(mi|mn|mtext) mathvariant="(double-struck|script|fraktur|bold|bold-italic|sans-serif)">([^<]*)<\/\1>/g,
    (x, b, v, t) => `<${b}${b === 'mi' ? ' mathvariant="normal"' : ''}>${lettre(v, t)}</${b}>`);
  const enMathML = h => !ctx.katex ? h : String(h || '').replace(/<span class="kx( kxd)?"(?: data-av="([^"]*)")?(?: data-ap="([^"]*)")?>([^<]*)<\/span>/g, (m, d, av, ap, t) => {
    let f;
    try { f = styler(ctx.katex.renderToString(deEch(t).replace(/\\htmlData\{[^}]*\}/g, ''), { displayMode: !!d, output: 'mathml', throwOnError: false, strict: 'ignore' })); }
    catch (e) { return m; }
    return av || ap ? `<span class="nobr">${av || ''}${f}${ap || ''}</span>` : f;
  });
  // Référencement (MEMO_atlas_apropos.md §68) :
  // - titre : le sujet d'abord, le nom du site à la fin (« Cours – ATLAS ») ; les appelants écrivent encore
  //   « ATLAS – sujet », retourné ici ;
  // - données structurées : en plus du fil (BreadcrumbList), une LearningResource (schema.org) déduite de l'adresse,
  //   avec type de ressource, auteur, licence, langue ; un appelant peut la compléter par `ressource` ({ ... }) ;
  // - empreinte du contenu, pour la date de mise à jour du plan du site (empreintesPages, lue par rendu.mjs).
  const AUTEUR = { '@type': 'Person', name: 'Armand Jourdain', jobTitle: 'Professeur agrégé de mathématiques', url: ADRESSE + 'a-propos/' };
  const LICENCE = 'https://creativecommons.org/licenses/by-nc-sa/4.0/';
  const sorteRessource = chemin => {
    let m;
    if ((m = chemin.match(/^edifice\/([^/]+)\/$/)) && D.noeuds[m[1]]) {
      const n = D.noeuds[m[1]];
      return { learningResourceType: ({ 'définition': 'Définition', 'axiome': 'Axiome', 'théorème': 'Théorème et démonstration', 'proposition': 'Proposition et démonstration', 'lemme': 'Lemme et démonstration', 'corollaire': 'Corollaire et démonstration' }[n.nature]) || 'Fiche de cours', educationalLevel: 'Enseignement supérieur' };
    }
    if (/^exercices\/feuille\/[^/]+\/$/.test(chemin)) return { learningResourceType: "Feuille d'exercices corrigés" };
    if (/^exercices\/[^/]+\/$/.test(chemin)) return { learningResourceType: 'Exercice corrigé' };
    if (/^cours\/[^/]+\/$/.test(chemin)) return { learningResourceType: 'Cours', encoding: { '@type': 'MediaObject', encodingFormat: 'application/pdf' } };
    if (/^activites\/[^/]+\/$/.test(chemin)) return { learningResourceType: 'Activité interactive', interactivityType: 'active' };
    if (/^annales\/sujet\/[^/]+\/$/.test(chemin)) return { learningResourceType: 'Sujet de concours' };
    return null;
  };
  const empreintesPages = {};
  function page({ chemin, titre, description, ancre, corps, fil = [], type = 'article', fichier, indexable = true, ressource }) {
    titre = String(titre).replace(/^ATLAS – (.+)$/, '$1 – ATLAS');
    corps = enMathML(corps);
    const url = ADRESSE + chemin, cible = '/#' + ancre;
    const d = coupe(description || '');
    const sorte = sorteRessource(chemin);
    const ressLd = indexable && (sorte || ressource) ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'LearningResource',
      name: titre.replace(/ – ATLAS$/, ''), description: d, url, inLanguage: 'fr', isAccessibleForFree: true, license: LICENCE, author: AUTEUR,
      isPartOf: { '@type': 'WebSite', name: 'ATLAS', url: ADRESSE }, ...(sorte || {}), ...(ressource || {}) }).replace(/</g, '\\u003c')}</script>` : '';
    if (indexable && !fichier) empreintesPages[url] = empreinte(titre + '\n' + d + '\n' + corps);
    const filLd = fil.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'ATLAS', href: '' }, ...fil].map((f, i) => ({ '@type': 'ListItem', position: i + 1, name: f.name, item: ADRESSE + (f.href || '').replace(/^\//, '') })) }).replace(/</g, '\\u003c')}</script>` : '';
    const sortie = fichier ? `site/${fichier}` : `site/${chemin}index.html`;
    if (!fichier) fs.mkdirSync('site/' + chemin, { recursive: true });
    fs.writeFileSync(sortie, `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${attr(titre)}</title>
<meta name="description" content="${attr(d)}">
${indexable ? `<link rel="canonical" href="${url}">` : '<meta name="robots" content="noindex">'}
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="ATLAS">
<meta property="og:title" content="${attr(titre)}">
<meta property="og:description" content="${attr(d)}">
<meta property="og:url" content="${url}">
${imageApercu(chemin)}
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f4f5f7">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
${THEME}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap">
<link rel="stylesheet" href="/katex.css?v=${vCss}">
<link rel="stylesheet" href="/lecture.css?v=${vLecture}">
${filLd}${ressLd}
</head>
<body class="l-corps">
<header class="l-tete"><a class="l-marque" href="/"><img src="/icone-192.png" alt="" width="28" height="28">ATLAS</a>
<nav class="l-rubriques" aria-label="Rubriques"><a href="/edifice/">L'édifice</a><a href="/cours/">Cours</a><a href="/exercices/">Exercices</a><a href="/annales/">Annales</a></nav>
<a class="l-ouvrir" href="${attr(cible)}">Ouvrir dans l'atlas →</a></header>
<main class="l-page">
${fil.length ? `<nav class="l-fil" aria-label="Position">${fil.map(f => f.href ? `<a href="${attr(f.href)}">${esc(f.name)}</a>` : `<span>${esc(f.name)}</span>`).join('<span aria-hidden="true">›</span>')}</nav>` : ''}
${corps}
<a class="l-ouvrir l-ouvrir-bas" href="${attr(cible)}">Ouvrir dans l'atlas interactif →</a>
</main>
${String(ancre).startsWith('cours/') ? `<script>(function(){var m=location.search.match(/[?&]page=(\\d+)/);if(!m)return;document.querySelectorAll('a.l-ouvrir').forEach(function(a){a.href=a.getAttribute('href')+'/'+m[1];a.textContent='Ouvrir le cours à la page '+m[1]+' →'})})();</script>` : ''}
<footer class="l-pied">ATLAS, architecture logique des théories mathématiques — Armand Jourdain, professeur agrégé de mathématiques. Contenu sous licence <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr">CC BY-NC-SA 4.0</a>. <a href="/#a-propos">À propos – Contact</a></footer>
</body>
</html>
`);
    if (indexable && !fichier) urls.push(url);
  }

  const N = D.noeuds, racine = D.racine;
  const lien = id => `/edifice/${id}/`;
  const couleur = n => n.graphe === racine ? (n.famille === 'mix' ? 'var(--c-mix)' : `var(--c-${n.famille})`)
    : ({ 'définition': 'var(--rouge)', 'axiome': 'var(--c-axiome)' }[n.nature] || 'var(--encre)');
  const puce = id => { const n = N[id]; if (!n) return ''; const c = n.graphe === racine ? couleur(n) : 'var(--encre-3)';
    return `<a class="puce" href="${lien(id)}" style="--c: ${c}">${esc(n.titre)}</a>`; };
  // Termes du lexique (span.terme) : lien vers la page de la fiche qui les définit, avec la définition en
  // infobulle (texte brut, coupé). Les notations dans les formules (terme-math, à l'intérieur de KaTeX) et
  // un terme défini dans la fiche même restent des mentions simples.
  const L = D.lexique || {}, brut = ctx.texteBrut || (t => String(t || '').replace(/<[^>]+>/g, ''));
  const bulle = {};
  const infobulle = id => bulle[id] ?? (bulle[id] = coupe(brut(L[id]?.definition), 180));
  const relier = (h, ici) => String(h || '')
    .replace(/<a class="lien-noeud" href="#[^"]*" data-n="([^"]+)">/g, (m, id) => `<a class="lien-noeud" href="${lien(id)}">`)
    .replace(/<span class="terme" data-g="([^"]+)" tabindex="0" role="button">([\s\S]*?)<\/span>/g, (m, id, txt) => {
      const def = L[id]?.defini;
      if (!def || !N[def] || def === ici) return `<span class="terme">${txt}</span>`;
      return `<a class="terme" href="${lien(def)}" title="${attr(`${L[id].terme} : ${infobulle(id)}`)}">${txt}</a>`;
    })
    .replace(/(href|src)="documents\//g, '$1="/documents/');
  return (outilsCache = { page, puce, relier, couleur, lien, esc, urls, empreintesPages });
}

export function pagesLecture(ctx) {
  const { D, attr, texteBrut, NOMS } = ctx;
  const { page, puce, relier, couleur, lien, esc, urls } = outilsLecture(ctx);
  const R = D.rubriques || {};
  // ---------------------------------------------------------------- édifice
  const N = D.noeuds, G = D.graphes, racine = D.racine;
  // Chemin d'un nœud : les graphes qui le contiennent, du plus large au plus étroit.
  const chemin = n => {
    const ch = [];
    for (let g = G[n.graphe], k = 0; g && g.conteneur && k < 20; k++) { ch.unshift({ name: g.titre, href: lien(g.conteneur) }); g = G[(N[g.conteneur] || {}).graphe]; }
    return [{ name: "L'édifice", href: '/edifice/' }, ...ch];
  };
  const ordre = (a, b) => (N[a].rang ?? 0) - (N[b].rang ?? 0) || (N[a].numero ?? 0) - (N[b].numero ?? 0);
  const contenuGraphe = gid => (G[gid]?.noeuds || []).filter(x => !x.entree && N[x.id]).map(x => x.id).sort(ordre);

  for (const n of Object.values(N)) {
    const fil = chemin(n);
    const ancre = n.sous ? n.sous : `${n.graphe}.${n.id}`;
    let h = `<article class="fiche" style="--c: ${couleur(n)}">`;
    h += `<p class="sur-titre"><span class="sorte">${esc(n.sorte || '')}</span>${n.graphe !== racine ? `<span>${esc(G[n.graphe].titre)}</span>` : ''}</p>`;
    h += `<h1>${esc(n.titre)}${n.choix ? ' <span class="etoile" title="Fait appel à une forme de l\'axiome du choix">⋆</span>' : ''}</h1>`;
    if (n.choix) h += `<div class="choix"><strong class="tete">⋆ Axiome du choix</strong>${relier(n.choix, n.id)}</div>`;
    if (n.texte) h += relier(n.texte, n.id);
    if (n.enonce) h += `<div class="enonce"><span class="tete">${n.nature === 'chapitre' ? 'Résultat principal' : 'Énoncé'}</span>${relier(n.enonce, n.id)}</div>`;
    if (n.preuve) h += `<details class="preuve" open><summary>Démonstration</summary><div class="contenu">${relier(n.preuve, n.id)}<span class="cqfd">□</span></div></details>`;
    for (const r of n.remarques || []) h += `<div class="remarque"><span class="tete">Remarque</span>${relier(r, n.id)}</div>`;
    for (const doc of n.documents || []) h += `<div class="document-fiche"><span class="tete">Document à télécharger</span><p class="doc-titre">${esc(doc.titre)}</p>${doc.description ? `<p class="doc-desc">${esc(doc.description)}</p>` : ''}<div class="doc-actions"><a class="bouton" href="/${String(doc.fichier).replace(/^\//, '')}">Ouvrir le PDF</a></div></div>`;
    const amont = (n.parents || []).concat(n.amont || []);
    h += `<div class="liens"><div><h3>Repose sur</h3><div class="puces">${amont.length ? amont.map(puce).join('') : '<span class="vide">C\'est un point de départ.</span>'}</div></div>`;
    h += `<div><h3>Sert à</h3><div class="puces">${(n.enfants || []).length ? n.enfants.map(puce).join('') : '<span class="vide">Aucune fiche de ce graphe ne l\'utilise encore.</span>'}</div></div></div>`;
    h += '</article>';
    if (n.sous && G[n.sous]) {
      const ids = contenuGraphe(n.sous);
      if (ids.length) h += `<h2 class="l-sec">Contenu : ${esc(G[n.sous].titre)}</h2><ul class="l-liste">${ids.map(id => `<li><span class="l-sorte">${esc(N[id].sorte || '')}</span><a href="${lien(id)}">${esc(N[id].titre)}</a></li>`).join('')}</ul>`;
    }
    const contexte = n.graphe === racine ? 'Théorie de l\'édifice' : `${NOMS[n.nature] || ''} · ${texteBrut(G[n.graphe].titre)}`;
    page({ chemin: `edifice/${n.id}/`, titre: `ATLAS – ${texteBrut(n.titre)}${n.nature ? ` (${n.nature})` : ''}`, description: `${contexte}. ${texteBrut(n.texte || n.enonce)}`,
      ancre, fil: [...fil, { name: texteBrut(n.titre) }], corps: h });
  }
  // Page d'entrée de l'édifice : les théories, du socle aux grandes théories.
  {
    const ids = contenuGraphe(racine);
    let h = `<article class="fiche"><p class="sur-titre"><span class="sorte">Rubrique</span></p><h1>L'édifice</h1>`
      + `<p>ATLAS représente les mathématiques comme un édifice : un graphe qui part des axiomes de la théorie des ensembles et dont chaque théorie s'ouvre sur ses définitions et ses théorèmes, démontrés dans l'ordre. Chaque fiche ci-dessous mène à sa présentation et à son contenu ; le bouton « Ouvrir dans l'atlas » affiche le graphe interactif.</p></article>`;
    h += `<h2 class="l-sec">Les ${ids.length} théories</h2><ul class="l-liste">${ids.map(id => `<li><a href="${lien(id)}">${esc(N[id].titre)}</a></li>`).join('')}</ul>`;
    page({ chemin: 'edifice/', titre: "ATLAS – L'édifice", description: 'Le graphe des théories mathématiques, de la logique du premier ordre et de ZFC aux grandes théories : définitions, énoncés et démonstrations.',
      ancre: 'edifice', fil: [{ name: "L'édifice" }], corps: h });
  }

  // ---------------------------------------------------------------- annales
  const A = R.annales || {}, I = R['annales-index'] || {}, T = R['annales-themes'] || {};
  const sansAccents = t => String(t).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const normRech = t => sansAccents(t).replace(/[^a-z0-9]+/g, ' ').trim();
  const slug = x => normRech([x.concours, x.filiere, x.annee, x.epreuve].filter(Boolean).join(' ')).replace(/ /g, '-');   // = slugSujet du gabarit
  const parUrl = Object.fromEntries((I.sujets || []).map(s => [s.sujet, s]));
  const themes = Object.fromEntries((T.themes || []).map(t => [t.id, t]));
  const concours = {}; for (const f of A.familles || []) for (const c of f.concours || []) concours[c.id] = { ...c, famille: f };
  // Formules de l'index : le texte porte des marques \uE000 + caractère, remplacées par le HTML KaTeX composé (Fh).
  const F = (t, s) => s && s.Fh ? esc(t).replace(/\uE000([\uE100-\uEFFF])/g, (m, c) => s.Fh[c.charCodeAt(0) - 0xE100] || '') : esc(t);
  const Ft = (t, s) => s && s.Ft ? String(t).replace(/\uE000([\uE100-\uEFFF])/g, (m, c) => s.Ft[c.charCodeAt(0) - 0xE100] || '') : String(t);
  const liste = (A.sujets || []).filter(x => x.sujet || x.attente);
  const vus = new Set();
  for (const x of liste) {
    const sl = slug(x); if (vus.has(sl)) continue; vus.add(sl);
    const c = concours[x.concours] || { titre: x.concours, famille: {} };
    // familles à préfixe (baccalauréat : « Bac Métropole Terminale 2024 — Jour 1, 19 juin 2024 »)
    const titreC = `${c.famille.prefixe ? c.famille.prefixe + ' ' : ''}${texteBrut(c.titre)}${x.filiere ? ` ${x.filiere}` : ''} ${x.annee} — ${x.epreuve}${x.date ? `, ${x.date}${x.lieu ? ` (${x.lieu})` : ''}` : ''}`;
    const srcF = (c.famille.sources || {})[x.filiere];
    const d = x.sujet && parUrl[x.sujet];
    let h = `<article class="fiche l-ann"><p class="sur-titre"><span class="sorte">Annales</span><span>${esc(texteBrut(c.famille.titre || ''))}</span></p>`;
    h += `<h1>${esc(titreC)}</h1>`;
    if (d?.nom) h += `<p class="l-meta">${F(d.nom, d)}${d.pages ? ` · ${d.pages} pages` : ''}</p>`;
    const abs = u => /^https?:/.test(u) ? u : '/' + String(u).replace(/^\//, '');
    h += `<div class="l-boutons">${x.sujet ? `<a class="plein" href="${attr(abs(x.sujet))}" rel="noopener">Sujet (PDF)</a>` : ''}${x.rapport ? `<a href="${attr(abs(x.rapport))}" rel="noopener">Rapport du jury</a>` : ''}${x.corrige_pdf ? `<a href="${attr(abs(x.corrige_pdf))}" rel="noopener">Corrigé${srcF ? ' ' + esc(srcF.nom) : ''}</a>` : ''}</div>`;
    if (x.source) h += `<p class="l-meta">PDF hébergé hors du site officiel — source : <a href="${attr(x.source.url)}" rel="noopener">${esc(x.source.nom)}</a></p>`;
    else if (srcF) h += `<p class="l-meta">Sujet${x.corrige_pdf ? ' et corrigé' : ''} publiés par l'<a href="${attr(srcF.url)}" rel="noopener">${esc(srcF.nom)}</a>.</p>`;
    if (x.attente) h += `<p class="l-meta">${esc(x.attente)}</p>`;
    let noeudsVus = new Set();
    if (d) {
      if (d.apercu) h += `<p>${F(d.apercu, d)}</p>`;
      h += `<h2 class="l-sec">Le sujet, partie par partie</h2>`;
      for (const p of d.blocs || []) {
        const [a, b] = p.pages || [];
        const tt = (p.themes || []).map(t => `<b>${esc(themes[t]?.titre || t)}</b>`).concat((p.secondaires || []).map(t => esc(themes[t]?.titre || t)));
        for (const t of [...(p.themes || []), ...(p.secondaires || [])]) for (const id of themes[t]?.noeuds || []) if (N[id]) noeudsVus.add(id);
        h += `<div class="l-partie"><h3>${F(p.nom || '', d)}${a ? ` <span class="l-sorte">p. ${a === b || !b ? a : `${a}–${b}`}</span>` : ''}</h3><p>${tt.join(' · ')}${(p.mots || []).length ? ` — ${F(p.mots.join(', '), d)}` : ''}</p></div>`;
      }
      if (noeudsVus.size) h += `<div class="liens"><div><h3>Dans l'édifice</h3><div class="puces">${[...noeudsVus].slice(0, 30).map(puce).join('')}</div></div></div>`;
    } else h += `<p class="l-meta">La description par thème de ce sujet est à venir.</p>`;
    h += '</article>';
    const desc = d ? `${titreC}. ${Ft(d.nom || '', d)}. ${Ft(d.apercu || '', d)}` : `${titreC} : sujet d'écrit de mathématiques${x.rapport ? ' et rapport du jury' : x.corrige_pdf ? ' et corrigé' : ''}.`;
    page({ chemin: `annales/sujet/${sl}/`, titre: `ATLAS – Annales : ${titreC}`, description: desc, ancre: `annales/sujet/${sl}`,
      fil: [{ name: 'Annales', href: '/annales/' }, { name: titreC }], corps: h });
  }
  // Page d'entrée des annales : tous les sujets, par famille, concours et session.
  {
    let h = `<article class="fiche"><p class="sur-titre"><span class="sorte">Rubrique</span></p><h1>Annales</h1><div>${R.annales?.intro || ''}</div></article>`;
    for (const f of A.familles || []) {
      h += `<h2 class="l-sec">${esc(texteBrut(f.titre))}</h2>`;
      for (const c of f.concours || []) {
        const xs = liste.filter(x => x.concours === c.id).sort((a, b) => b.annee - a.annee || String(a.filiere).localeCompare(String(b.filiere)) || String(a.epreuve).localeCompare(String(b.epreuve)));
        if (!xs.length) continue;
        const seen = new Set();
        h += `<h3>${esc(texteBrut(c.titre))}</h3><ul class="l-liste">${xs.filter(x => { const s = slug(x); if (seen.has(s)) return false; seen.add(s); return true; })
          .map(x => `<li><a href="/annales/sujet/${slug(x)}/">${x.annee}${x.filiere ? ` · ${esc(x.filiere)}` : ''} · ${esc(x.epreuve)}</a>${parUrl[x.sujet]?.nom ? ` <span class="l-sorte">— ${esc(Ft(parUrl[x.sujet].nom, parUrl[x.sujet]))}</span>` : ''}</li>`).join('')}</ul>`;
      }
    }
    page({ chemin: 'annales/', titre: 'ATLAS – Annales', description: texteBrut(R.annales?.intro) || 'Sujets d\'écrit de mathématiques des concours d\'ingénieurs et de l\'enseignement, avec leur description par thème.',
      ancre: 'annales', fil: [{ name: 'Annales' }], corps: h });
  }
  // ---------------------------------------------------------------- page introuvable
  // GitHub Pages sert site/404.html pour toute adresse inconnue (avec le code 404). Chemins absolus partout.
  page({ chemin: '', fichier: '404.html', indexable: false, titre: 'ATLAS – Page introuvable', ancre: 'accueil',
    description: 'Cette adresse ne correspond à aucune page d\'ATLAS.', fil: [],
    corps: `<article class="fiche l-404"><p class="sur-titre"><span class="sorte">Erreur 404</span></p><h1>Cette page n'existe pas</h1>
<p>L'adresse demandée ne correspond à aucune page d'ATLAS : elle est peut-être mal recopiée, ou la page a changé de place. Le plus simple est de repartir d'une rubrique ; dans l'atlas interactif, la barre de recherche de l'édifice retrouve une notion par son nom.</p>
<ul class="l-liste"><li><a href="/">Accueil</a></li><li><a href="/edifice/">L'édifice : les théories et leurs fiches</a></li><li><a href="/#edifice">Chercher une notion dans l'atlas interactif</a></li><li><a href="/cours/">Cours</a></li><li><a href="/exercices/">Exercices</a></li><li><a href="/annales/">Annales</a></li><li><a href="/#nouveautes">Nouveautés</a></li><li><a href="/#a-propos">À propos – Contact</a></li></ul></article>` });
  return urls;
}
