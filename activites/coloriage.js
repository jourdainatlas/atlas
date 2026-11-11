// Casse-tête « Le coloriage de cartes », rubrique Activités, MEMO_atlas_activites.md §139 : colorier une carte avec le moins de couleurs possible.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, TEINTES, NOMS_TEINTES } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .co-but { padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); }
.activites-act .co-but b { color: var(--activites-jeu); }
.activites-act .co-carte { width: min(100%, 620px); }
.activites-act .co-carte svg { display: block; width: 100%; height: auto; touch-action: manipulation; }
.activites-act .co-carte g.reg { cursor: pointer; outline: none; }
.activites-act .co-carte g.reg rect { stroke-width: .6; shape-rendering: crispEdges; }
.activites-act .co-carte g.reg.vide rect { fill: var(--surface); stroke: var(--surface); }
.activites-act .co-carte g.reg:hover rect, .activites-act .co-carte g.reg:focus-visible rect { opacity: .72; }
.activites-act .co-carte g.reg.vide:hover rect, .activites-act .co-carte g.reg.vide:focus-visible rect { fill: var(--trame); stroke: var(--trame); opacity: 1; }
.activites-act .co-carte .bord { stroke: var(--encre); stroke-width: 2; stroke-linecap: square; fill: none; pointer-events: none; }
.activites-act .co-carte .heurt { stroke: var(--encre); stroke-width: 7; stroke-linecap: butt; fill: none; pointer-events: none; }
.activites-act .co-carte .heurt2 { stroke: var(--surface); stroke-width: 3; stroke-dasharray: 4 4; fill: none; pointer-events: none; }
.activites-act .co-carte text { font: 700 13px var(--f-ui); fill: #fff; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
.activites-act .co-carte .conseil { fill: none; stroke: var(--encre); stroke-width: 3; stroke-dasharray: 2 5; stroke-linecap: round; pointer-events: none; }
.activites-act .co-palette { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 10px 16px; border-top: 1px solid var(--filet); font: 14px var(--f-ui); color: var(--encre-2); }
.activites-act .co-palette button { width: 40px; height: 34px; padding: 0; border-radius: 6px; border: 2px solid transparent; color: #fff; font: 700 14px var(--f-ui); }
.activites-act .co-palette button[aria-pressed="true"] { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--encre); }
.activites-act .co-palette button.gomme { width: auto; padding: 0 12px; background: var(--surface); color: var(--encre); border: 1px dashed var(--encre-3); font-weight: 500; }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie relève de Maths expertes et de Maths Sup</p>
  <h3>Le coloriage de cartes</h3>
  <p class="lede">Colorier une carte de façon que deux régions voisines n'aient jamais la même couleur, c'est facile avec beaucoup de crayons. Avec peu, c'est un casse-tête, et l'un des problèmes les plus célèbres des mathématiques : il a fallu attendre 1976, et un ordinateur, pour démontrer que quatre couleurs suffisent toujours.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Carte <select id="co-type"><option value="hasard" selected>au hasard</option><option value="rect">rectangles superposés</option><option value="roue">la roue à cinq quartiers</option></select></label>
    <label id="co-nb-l">Taille <select id="co-nb"><option value="8">petite</option><option value="12" selected>moyenne</option><option value="18">grande</option><option value="26">très grande</option></select></label>
    <button type="button" class="primary" id="co-neuf">Nouvelle carte</button>
    <button type="button" id="co-depart">Tout effacer</button>
    <button type="button" id="co-annuler">Annuler</button>
    <button type="button" id="co-conseil">Un indice</button>
  </div>
  <p class="co-but">But : colorier toutes les régions, sans que deux régions voisines aient la même couleur, <b>avec le moins de couleurs possible</b>.</p>
  <div class="co-palette" id="co-palette" role="group" aria-label="Couleur du pinceau"></div>
  <div class="jeu-plateau"><div class="co-carte" id="co-carte"></div></div>
  <div class="jeu-etat"><span>Régions coloriées : <b id="co-fait"></b></span><span>Couleurs utilisées : <b id="co-nbc"></b></span><span id="co-min-l" hidden>Minimum pour cette carte : <b id="co-min"></b></span></div>
  <div class="jeu-message" id="co-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Choisissez une couleur dans la palette, puis cliquez sur une région pour la colorier ; un second clic avec la même couleur l'efface. Au clavier, les touches 1 à 6 choisissent la couleur, la touche de tabulation parcourt les régions et la touche Entrée colorie. Deux régions sont <b>voisines</b> quand elles ont en commun un morceau de frontière, et non un simple point : deux régions qui ne se touchent que par un coin peuvent recevoir la même couleur.</p>
    <p>La page ne signale que les fautes directes : une frontière épaisse et rayée sépare deux régions voisines de même couleur. Elle ne dit pas si votre début de coloriage peut encore être terminé avec peu de couleurs ; pour cela, demandez un indice. Une fois la carte coloriée, elle annonce le plus petit nombre de couleurs possible, pour que vous puissiez comparer.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Deux couleurs suffisent parfois</h4>
    <p>Choisissez la carte « rectangles superposés » : elle est obtenue en traçant plusieurs rectangles qui se chevauchent, et ses régions sont les morceaux ainsi découpés. Ces cartes ont une propriété remarquable.</p>
    <div class="def"><p><b>Proposition.</b> Si une carte est découpée par des rectangles dont les côtés ne se superposent jamais le long d'un segment, deux couleurs suffisent à la colorier.</p></div>
    <p><b>Démonstration.</b> Pour chaque région, comptons le nombre de rectangles qui la contiennent, et colorions-la en bleu si ce nombre est pair, en orange s'il est impair. Deux régions voisines sont séparées par un morceau de côté, qui appartient à un rectangle et à un seul, puisque les côtés ne se superposent pas. Franchir cette frontière fait entrer dans ce rectangle ou en sortir, sans rien changer pour les autres : le nombre de rectangles change d'exactement une unité, donc de parité. Les deux régions n'ont pas la même couleur.</p>
    <p>La démonstration vaut pour des cercles, pour des droites, pour toute famille de courbes fermées qui se croisent sans se longer. C'est le coloriage d'un échiquier, généralisé.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Quatre couleurs sont parfois nécessaires</h4>
    <p>Choisissez « la roue à cinq quartiers » : une région centrale entourée de cinq autres, qui forment un anneau. Parcourons l'anneau : si deux couleurs suffisaient pour lui, elles alterneraient, et la cinquième région aurait la couleur de la première, sa voisine. Il faut donc trois couleurs pour l'anneau, parce que cinq est impair. La région centrale touche les cinq autres : il lui faut une quatrième couleur.</p>
    <p>Pour raisonner, on remplace la carte par un <b>graphe</b> : un sommet par région, une arête entre deux régions voisines. Colorier la carte, c'est colorier les sommets de façon que les deux extrémités de chaque arête diffèrent. Le plus petit nombre de couleurs possible s'appelle le <b>nombre chromatique</b> du graphe. Celui de la roue vaut 4.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Quatre couleurs suffisent toujours</h4>
    <div class="def"><p><b>Théorème des quatre couleurs (Appel et Haken, 1976).</b> Toute carte plane dont les régions sont d'un seul tenant peut être coloriée avec quatre couleurs au plus. <i>Admis ici.</i></p></div>
    <p>La conjecture date de 1852. Alfred Kempe en publia en 1879 une démonstration, tenue pour juste pendant onze ans ; Percy Heawood y trouva une faille en 1890, et en sauva la preuve que cinq couleurs suffisent. La démonstration de Kenneth Appel et Wolfgang Haken ramène le problème à l'examen de près de deux mille configurations, confié à un ordinateur : c'est la difficulté que l'on contourne ici, aucune démonstration vérifiable entièrement à la main n'étant connue.</p>
    <p>On peut en revanche démontrer en quelques lignes que <b>six couleurs suffisent</b>, en admettant un seul fait : dans toute carte plane, il existe une région qui a au plus cinq voisines (<i>admis ici</i> : c'est une conséquence de la formule d'Euler reliant les nombres de sommets, d'arêtes et de faces). Raisonnons par récurrence sur le nombre de régions, en termes de graphe. Un graphe d'au plus six sommets se colorie avec six couleurs. Sinon, retirons un sommet qui a au plus cinq voisins : le graphe restant provient encore d'une carte plane, et se colorie avec six couleurs par hypothèse de récurrence. Remettons le sommet : ses voisins portent au plus cinq couleurs, et il en reste une pour lui.</p>
  </div>
</section>
` + suite(
  "Croire qu'une carte n'exige quatre couleurs que si elle contient quatre régions qui se touchent toutes deux à deux. La roue à cinq quartiers exige quatre couleurs, et pourtant on n'y trouve pas quatre régions mutuellement voisines : deux quartiers opposés ne se touchent pas. Pour la même raison, l'impossibilité de dessiner cinq régions mutuellement voisines, qui est exacte, ne suffit pas à démontrer le théorème des quatre couleurs. L'autre erreur fréquente est de compter comme voisines deux régions qui ne se touchent que par un coin.",
  "Le chapitre de Maths expertes <a href=\"#cours/me-06\">Applications des matrices</a> introduit les graphes, leurs sommets et leurs arêtes. La récurrence de la section 4 repose sur le <a href=\"#n.n-recurrence\">principe de récurrence</a> de l'édifice. Le casse-tête <a href=\"#activites/ponts\">Les ponts de Königsberg</a> traite un autre problème de graphes, résolu par Euler. Le théorème est dû à K. Appel et W. Haken, « Every planar map is four colorable », <i>Illinois Journal of Mathematics</i>, vol. 21 (1977).",
  "Les cartes sont dessinées sur un quadrillage : une région est un ensemble de cases d'un seul tenant, et deux régions sont voisines quand deux de leurs cases ont un côté commun. Le minimum est calculé exactement, par une recherche qui essaie tous les coloriages à 1, 2, 3 puis 4 couleurs et s'arrête au premier succès : sur ces cartes d'au plus quelques dizaines de régions, elle aboutit toujours. L'indice vient de la même recherche, partant de vos couleurs. Rien n'est enregistré ni envoyé.");

const alea = n => Math.floor(Math.random() * n);
// Régions voisines : cases de numéros différents ayant un côté commun. cases : tableau L×C de numéros de région.
export function voisinages(cases, L, C, k) {
  const V = Array.from({ length: k }, () => new Set());
  for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) { const a = cases[i * C + j];
    if (j + 1 < C) { const b = cases[i * C + j + 1]; if (a !== b) { V[a].add(b); V[b].add(a); } }
    if (i + 1 < L) { const b = cases[(i + 1) * C + j]; if (a !== b) { V[a].add(b); V[b].add(a); } } }
  return V.map(s => [...s]);
}
// Composantes d'un seul tenant des cases de même étiquette : renvoie { cases (numéros de région), k }.
function composantes(et, L, C) {
  const r = new Array(L * C).fill(-1); let k = 0;
  for (let d = 0; d < L * C; d++) { if (r[d] >= 0) continue; const pile = [d]; r[d] = k;
    while (pile.length) { const c = pile.pop(), i = Math.floor(c / C), j = c % C;
      for (const [u, v] of [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]) if (u >= 0 && u < L && v >= 0 && v < C && r[u * C + v] < 0 && et[u * C + v] === et[c]) { r[u * C + v] = k; pile.push(u * C + v); } }
    k++; }
  return { cases: r, k };
}
export function carteHasard(L, C, k) {
  const et = new Array(L * C).fill(-1), front = [];
  while (front.length < k) { const c = alea(L * C); if (et[c] < 0) { et[c] = front.length; front.push([c]); } }
  let reste = L * C - k;
  while (reste) { const r = alea(k), F = front[r]; if (!F.length) continue; const t = alea(F.length), c = F[t], i = Math.floor(c / C), j = c % C;
    const libres = [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]].filter(([u, v]) => u >= 0 && u < L && v >= 0 && v < C && et[u * C + v] < 0);
    if (!libres.length) { F.splice(t, 1); continue; } const [u, v] = libres[alea(libres.length)]; et[u * C + v] = r; F.push(u * C + v); reste--; }
  return { cases: et, k, L, C };
}
// Rectangles superposés dont les côtés ont des abscisses et des ordonnées toutes distinctes : aucun côté n'en longe un autre.
export function carteRectangles(L, C, m) {
  const tirer = (n, max) => { const s = new Set(); while (s.size < n) s.add(1 + alea(max - 1)); return [...s]; };
  for (;;) { const xs = tirer(2 * m, C), ys = tirer(2 * m, L), R = [];
    for (let r = 0; r < m; r++) R.push([Math.min(xs[2 * r], xs[2 * r + 1]), Math.max(xs[2 * r], xs[2 * r + 1]), Math.min(ys[2 * r], ys[2 * r + 1]), Math.max(ys[2 * r], ys[2 * r + 1])]);
    const et = []; for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) { let b = 0; R.forEach(([x0, x1, y0, y1], r) => { if (j >= x0 && j < x1 && i >= y0 && i < y1) b |= 1 << r; }); et.push(b); }
    const c = composantes(et, L, C); if (c.k >= 2 * m + 2) return { ...c, L, C, parite: et.map(b => { let n = 0; while (b) { n += b & 1; b >>= 1; } return n % 2; }) }; }
}
const ROUE = ['AAABBB', 'AAXXBB', 'EEXXCC', 'EEDDCC', 'EDDDDC'];
export function carteRoue() { const L = 10, C = 12, cases = []; for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) cases.push('AXBCDE'.indexOf(ROUE[i >> 1][j >> 1])); return { cases, k: 6, L, C }; }
// Coloriage avec les couleurs permises, prolongeant « fixe » (tableau, -1 = libre). Renvoie un coloriage ou null.
export function colorier(V, fixe, permises) {
  const k = V.length, col = fixe.slice();
  const suivant = () => { let m = -1, sm = -1; for (let r = 0; r < k; r++) if (col[r] < 0) { const s = new Set(V[r].map(v => col[v]).filter(c => c >= 0)).size * 100 + V[r].length; if (s > sm) { sm = s; m = r; } } return m; };
  const rec = () => { const r = suivant(); if (r < 0) return true; for (const c of permises) if (!V[r].some(v => col[v] === c)) { col[r] = c; if (rec()) return true; col[r] = -1; } return false; };
  return rec() ? col : null;
}
export function chromatique(V) { for (let m = 1; m <= 7; m++) if (colorier(V, V.map(() => -1), Array.from({ length: m }, (_, i) => i))) return m; return 8; }

export function monter(racine) {
  const q = s => racine.querySelector(s), u = 30;
  let M = null, V = [], col = [], hist = [], pinceau = 0, chi = 0, conseil = null, msg = '', vivant = true;
  const pal = q('#co-palette'); pal.innerHTML = '<span>Pinceau :</span>' + TEINTES.slice(0, 6).map((t, i) => `<button type="button" data-c="${i}" style="background:${t}" aria-label="Couleur ${i + 1} : ${NOMS_TEINTES[i]}">${i + 1}</button>`).join('') + '<button type="button" class="gomme" data-c="-1">effacer</button>';
  const heurts = () => { const h = []; V.forEach((vs, a) => vs.forEach(b => { if (a < b && col[a] >= 0 && col[a] === col[b]) h.push([a, b]); })); return h; };
  function nouvelle() { const type = q('#co-type').value, nb = +q('#co-nb').value; q('#co-nb-l').hidden = type === 'roue';
    if (type === 'roue') M = carteRoue(); else if (type === 'rect') M = carteRectangles(12, 16, nb <= 8 ? 2 : nb <= 12 ? 3 : nb <= 18 ? 4 : 5); else M = carteHasard(10, 14, nb);
    V = voisinages(M.cases, M.L, M.C, M.k); chi = chromatique(V); col = V.map(() => -1); hist = []; conseil = null; msg = ''; rendre(); }
  function peindre(r) { const c = pinceau >= 0 && col[r] === pinceau ? -1 : pinceau; if (col[r] === c) return; hist.push(col.slice()); col[r] = c; conseil = null; msg = ''; rendre(); }
  function rendre() {
    if (!vivant) return; const { cases, L, C, k } = M, H = heurts(), mal = new Set(H.map(([a, b]) => a + '-' + b));
    const parReg = Array.from({ length: k }, () => []); cases.forEach((r, c) => parReg[r].push(c));
    let s = '';
    parReg.forEach((cs, r) => { const c = col[r], f = c >= 0 ? `fill="${TEINTES[c]}" stroke="${TEINTES[c]}"` : '';
      let mx = 0, my = 0; cs.forEach(x => { mx += x % C; my += Math.floor(x / C); }); mx /= cs.length; my /= cs.length; let best = cs[0], bd = 1e9; cs.forEach(x => { const d = (x % C - mx) ** 2 + (Math.floor(x / C) - my) ** 2; if (d < bd) { bd = d; best = x; } });
      s += `<g class="reg${c < 0 ? ' vide' : ''}" data-r="${r}" tabindex="0" role="button" aria-label="Région ${r + 1}, ${c < 0 ? 'non coloriée' : NOMS_TEINTES[c]}, ${V[r].length} voisine${V[r].length > 1 ? 's' : ''}">${cs.map(x => `<rect x="${(x % C) * u}" y="${Math.floor(x / C) * u}" width="${u}" height="${u}" ${f}/>`).join('')}${c >= 0 ? `<text x="${(best % C + .5) * u}" y="${(Math.floor(best / C) + .5) * u}">${c + 1}</text>` : ''}${conseil && conseil[0] === r ? `<circle class="conseil" cx="${(best % C + .5) * u}" cy="${(Math.floor(best / C) + .5) * u}" r="11"/>` : ''}</g>`; });
    let b = '', h1 = '';
    for (let i = 0; i < L; i++) for (let j = 0; j < C; j++) { const a = cases[i * C + j];
      for (const [di, dj] of [[0, 1], [1, 0]]) { const i2 = i + di, j2 = j + dj; if (i2 >= L || j2 >= C) continue; const bb = cases[i2 * C + j2]; if (a === bb) continue;
        const d = dj ? `M${(j + 1) * u} ${i * u}v${u}` : `M${j * u} ${(i + 1) * u}h${u}`; b += d; if (mal.has(Math.min(a, bb) + '-' + Math.max(a, bb))) h1 += d; } }
    ecrire(q('#co-carte'), `<svg viewBox="-2 -2 ${C * u + 4} ${L * u + 4}" role="group" aria-label="Carte de ${k} régions">${s}<path class="bord" d="${b}M0 0H${C * u}V${L * u}H0Z"/>${h1 ? `<path class="heurt" d="${h1}"/><path class="heurt2" d="${h1}"/>` : ''}</svg>`, true);
    pal.querySelectorAll('button').forEach(bt => bt.setAttribute('aria-pressed', String(+bt.dataset.c === pinceau)));
    const fait = col.filter(c => c >= 0).length, nbc = new Set(col.filter(c => c >= 0)).size, fini = fait === k && !H.length;
    ecrire(q('#co-fait'), `${fait} sur ${k}`); ecrire(q('#co-nbc'), String(nbc)); q('#co-min-l').hidden = !fini; ecrire(q('#co-min'), String(chi));
    q('#co-annuler').disabled = !hist.length; q('#co-depart').disabled = !fait;
    const m = q('#co-message'); m.className = 'jeu-message' + (fini ? (nbc > chi ? ' mieux' : ' gagne') : H.length ? ' bloque' : '');
    ecrire(m, fini ? `Carte coloriée avec ${nbc} couleur${nbc > 1 ? 's' : ''}. ${nbc === chi ? 'C\'est le minimum : on ne peut pas faire mieux sur cette carte.' : `Le minimum est de ${chi} : « Tout effacer » vous laisse chercher un coloriage plus économe.`}` : msg || (H.length ? `Deux régions voisines ont la même couleur : la frontière fautive est épaisse et rayée${H.length > 1 ? ` (${H.length} fautes)` : ''}.` : 'Choisissez une couleur, puis cliquez sur une région.'));
  }
  q('#co-carte').addEventListener('click', e => { const g = e.target.closest('g.reg'); if (g) peindre(+g.dataset.r); });
  q('#co-carte').addEventListener('keydown', e => { const g = e.target.closest('g.reg'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); const r = g.dataset.r; peindre(+r); const n = q(`#co-carte g.reg[data-r="${r}"]`); if (n) n.focus(); } });
  const touche = e => { if (!racine.isConnected || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return; if (e.key >= '1' && e.key <= '6') { pinceau = +e.key - 1; rendre(); } };
  window.addEventListener('keydown', touche);
  pal.addEventListener('click', e => { const bt = e.target.closest('button'); if (bt) { pinceau = +bt.dataset.c; rendre(); } });
  q('#co-neuf').addEventListener('click', nouvelle); q('#co-type').addEventListener('change', nouvelle); q('#co-nb').addEventListener('change', nouvelle);
  q('#co-depart').addEventListener('click', () => { hist.push(col.slice()); col = V.map(() => -1); conseil = null; msg = ''; rendre(); });
  q('#co-annuler').addEventListener('click', () => { if (hist.length) { col = hist.pop(); conseil = null; msg = ''; rendre(); } });
  q('#co-conseil').addEventListener('click', () => { conseil = null;
    const util = [...new Set(col.filter(c => c >= 0))];
    if (heurts().length) msg = 'Vous avez demandé de l\'aide : corrigez d\'abord la frontière épaisse et rayée, qui sépare deux régions voisines de même couleur.';
    else if (col.every(c => c >= 0)) msg = `Vous avez demandé de l'aide : la carte est coloriée.`;
    else if (util.length > chi) msg = `Vous avez demandé de l'aide : vous employez déjà ${util.length} couleurs, alors que ${chi} suffisent pour cette carte. Il faudra revenir sur certaines régions.`;
    else { const perm = util.slice(); for (let c = 0; perm.length < chi; c++) if (!perm.includes(c)) perm.push(c); const sol = colorier(V, col, perm);
      if (!sol) msg = `Vous avez demandé de l'aide : avec les régions déjà coloriées, on ne peut plus terminer avec ${chi} couleurs, qui est le minimum. Il faudra revenir sur certaines régions.`;
      else { let r = -1, sm = -1; col.forEach((c, i) => { if (c < 0) { const sc = V[i].filter(v => col[v] >= 0).length; if (sc > sm) { sm = sc; r = i; } } }); conseil = [r, sol[r]]; msg = `Vous avez demandé de l'aide : la région entourée de pointillés peut recevoir la couleur ${sol[r] + 1} (${NOMS_TEINTES[sol[r]]}), dans un coloriage à ${chi} couleurs compatible avec vos choix.`; } }
    rendre(); });
  nouvelle();
  return () => { vivant = false; window.removeEventListener('keydown', touche); };
}
