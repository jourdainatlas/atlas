// Casse-tête « Le taquin » (rubrique Activités, MEMO_atlas_activites.md §121).
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .tq { display: grid; grid-template-columns: repeat(var(--col), 1fr); gap: 6px; width: min(100%, calc(var(--col) * 84px)); }
.activites-act .tq button { aspect-ratio: 1 / 1; padding: 0; border-radius: 8px; border: 1px solid var(--encre-3); background: var(--surface); font: 600 clamp(15px, 5vw, 26px) var(--f-mono); color: var(--encre); }
.activites-act .tq button.place { border-color: var(--activites-jeu); box-shadow: inset 0 -3px 0 var(--activites-jeu); }
.activites-act .tq button.vide { border: 1px dashed var(--encre-3); opacity: 1; cursor: default; background: repeating-linear-gradient(45deg, transparent 0 7px, var(--filet) 7px 8.5px), var(--papier); }
.activites-act .tq button.conseil { background: var(--hl); color: var(--hl-ink); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · la théorie relève de Maths Sup</p>
  <h3>Le taquin</h3>
  <p class="lede">Des pièces numérotées, une case vide, et un seul geste permis : faire glisser dans la case vide une pièce voisine. Remettez les pièces dans l'ordre, puis découvrez pourquoi une position sur deux est sans solution.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Lignes <select id="tq-l"><option>2</option><option>3</option><option selected>4</option><option>5</option></select></label>
    <label>Colonnes <select id="tq-c"><option>2</option><option>3</option><option selected>4</option><option>5</option></select></label>
    <button type="button" class="primary" id="tq-melanger">Mélanger</button>
    <button type="button" id="tq-ordre">Remettre en ordre</button>
    <button type="button" id="tq-echange">Échanger les pièces 1 et 2</button>
    <button type="button" id="tq-conseil">Un coup</button>
  </div>
  <div class="jeu-plateau"><div class="tq" id="tq-plateau" role="group" aria-label="Plateau du taquin. Les flèches du clavier déplacent une pièce vers la case vide."></div></div>
  <div class="jeu-etat"><span>Coups joués : <b id="tq-coups">0</b></span><span id="tq-min"></span><span id="tq-inv"></span></div>
  <div class="jeu-message" id="tq-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>Cliquez sur une pièce de la même ligne ou de la même colonne que la case vide : elle glisse, avec celles qui la séparent du vide. Au clavier, les flèches poussent une pièce vers la case vide, dès que le plateau est à l'écran : la flèche vers le haut fait monter la pièce située sous la case vide. Le but est la position rangée, case vide en bas à droite. Le bouton « Mélanger » ne joue que des coups permis : la position obtenue a donc toujours une solution.</p>
    <p>Jusqu'à neuf cases, la page connaît toutes les positions : elle indique le nombre minimal de coups qui restent, et « Un coup » joue l'un des meilleurs. Au-delà, elle donne seulement un nombre de coups au-dessous duquel on ne peut pas descendre.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La position impossible</h4>
    <p>Remettez le jeu en ordre, puis appuyez sur « Échanger les pièces 1 et 2 », comme si l'on avait démonté le jeu pour le remonter de travers. Vous pouvez essayer aussi longtemps que vous voudrez : cette position n'a pas de solution. C'est le défi qui fit la célébrité du jeu vers 1880, avec les pièces 14 et 15 échangées.</p>
    <p>Pour le démontrer, on cherche une quantité que <em>aucun coup ne change</em>. Regardons la position comme une permutation des cases, la case vide comptant pour une pièce. Un coup échange la case vide et une pièce : c'est une transposition, qui change la <b>signature</b> de la permutation en son opposée. Le même coup déplace la case vide d'un pas : la distance <i>d</i> qui la sépare du coin en bas à droite, comptée en pas horizontaux et verticaux, change de parité. Le produit</p>
    <p class="def">signature de la permutation × (−1)<sup><i>d</i></sup></p>
    <p>ne change donc jamais. Il vaut +1 dans la position rangée, donc +1 dans toute position que l'on peut ranger. Or échanger deux pièces sans toucher à la case vide change la signature sans changer <i>d</i> : le produit passe à −1, et la position est hors d'atteinte. La page affiche ce produit sous le plateau.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Exactement la moitié</h4>
    <p>La réciproque est vraie, et plus difficile : dès que le plateau a au moins deux lignes et deux colonnes, toute position dont le produit vaut +1 peut être rangée. Les positions solubles sont donc exactement la moitié de toutes les positions : 181 440 sur 362 880 pour le jeu de 3 sur 3. Pour ce jeu et les plus petits, la page le vérifie en parcourant toutes les positions accessibles ; pour les autres, le résultat est <b>admis ici</b>, la difficulté étant de construire, à partir de coups permis, assez de cycles de longueur 3 pour engendrer toutes les permutations paires.</p>
  </div>
</section>
` + suite(
  "Croire qu'une position est impossible parce qu'on n'y arrive pas, ou possible parce qu'elle « a l'air proche ». Seul l'invariant tranche : une position qui ne diffère de la position rangée que par deux pièces échangées est aussi loin que possible d'une solution, puisqu'elle n'en a aucune.",
  "La signature d'une permutation et son comportement par produit sont établis dans le chapitre de Maths Sup <a href=\"#cours/ma-17\">Groupe symétrique et déterminants</a> et, dans l'édifice, à la fiche <a href=\"#v-det.v-permutations\">Groupe symétrique et signature</a>. L'impossibilité et sa réciproque ont été publiées par W. W. Johnson et W. E. Story, « Notes on the “15” Puzzle », <i>American Journal of Mathematics</i>, vol. 2 (1879), p. 397-404.",
  "La signature est calculée en décomposant la permutation en cycles. Pour les plateaux de neuf cases au plus, le nombre minimal de coups vient d'un parcours en largeur de toutes les positions accessibles depuis la position rangée (20 160 pour 2 sur 4, 181 440 pour 3 sur 3). Pour les plus grands, la borne affichée est la somme des distances de chaque pièce à sa place : chaque coup ne rapproche qu'une pièce d'un seul pas, donc il faut au moins ce nombre de coups. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let L = 4, K = 4, N = 16, t = [], coups = 0, conseil = -1, vivant = true;
  const tables = new Map();   // « L×K » → Map(code → distance à la position rangée), pour N ≤ 9
  const range = () => Array.from({ length: N }, (_, i) => (i + 1) % N);
  const vide = a => a.indexOf(0);
  const voisins = v => { const r = Math.floor(v / K), c = v % K, o = []; if (r > 0) o.push(v - K); if (r < L - 1) o.push(v + K); if (c > 0) o.push(v - 1); if (c < K - 1) o.push(v + 1); return o; };
  const code = a => { let x = 0; for (let i = N - 1; i >= 0; i--) x = x * N + a[i]; return x; };
  const fini = () => t.every((x, i) => x === (i + 1) % N);
  // signature de la permutation des N cases (le vide vaut N), par les cycles ; d : distance du vide au dernier coin
  function invariant() {
    const p = t.map(x => (x || N) - 1), vu = new Array(N).fill(false); let s = 1;
    for (let i = 0; i < N; i++) { if (vu[i]) continue; let l = 0, j = i; while (!vu[j]) { vu[j] = true; j = p[j]; l++; } if (l % 2 === 0) s = -s; }
    const v = vide(t), d = (L - 1 - Math.floor(v / K)) + (K - 1 - v % K);
    return { s, d, produit: s * (d % 2 ? -1 : 1) };
  }
  function table() {
    const cle = L + '×' + K; if (tables.has(cle)) return tables.get(cle);
    const D = new Map(), dep = range(); D.set(code(dep), 0); let file = [dep];
    while (file.length) { const suiv = [];
      for (const a of file) { const da = D.get(code(a)), v = vide(a);
        for (const w of voisins(v)) { const b = a.slice(); b[v] = b[w]; b[w] = 0; const cb = code(b); if (!D.has(cb)) { D.set(cb, da + 1); suiv.push(b); } } }
      file = suiv; }
    tables.set(cle, D); return D;
  }
  const manhattan = () => t.reduce((s, x, i) => x ? s + Math.abs(Math.floor(i / K) - Math.floor((x - 1) / K)) + Math.abs(i % K - (x - 1) % K) : s, 0);
  // faire glisser vers le vide la pièce de la case i (et celles qui les séparent)
  function jouer(i) {
    const v = vide(t); if (i === v) return false;
    const ri = Math.floor(i / K), rv = Math.floor(v / K), pas = ri === rv ? (i < v ? -1 : 1) : i % K === v % K ? (i < v ? -K : K) : 0;
    if (!pas) return false;
    for (let j = v; j !== i; j += pas) { t[j] = t[j + pas]; coups++; }
    t[i] = 0; conseil = -1; return true;
  }
  function melanger() {
    t = range(); let v = N - 1, avant = -1;
    for (let k = 0; k < 60 * N || fini(); k++) { const o = voisins(v).filter(w => w !== avant), w = o[Math.floor(Math.random() * o.length)]; t[v] = t[w]; t[w] = 0; avant = v; v = w; }
    coups = 0; conseil = -1;
  }
  function rendre() {
    if (!vivant) return;
    const P = q('#tq-plateau'); P.style.setProperty('--col', K);
    if (P.children.length !== N) { P.innerHTML = ''; for (let i = 0; i < N; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; P.append(b); } }
    [...P.children].forEach((b, i) => { const x = t[i]; b.textContent = x || ''; b.className = (x ? '' : 'vide') + (x && x === i + 1 ? ' place' : '') + (i === conseil ? ' conseil' : '');
      b.disabled = false; b.setAttribute('aria-disabled', String(!x)); b.tabIndex = x ? 0 : -1; b.setAttribute('aria-label', x ? `Pièce ${x}, ligne ${Math.floor(i / K) + 1}, colonne ${i % K + 1}` : 'Case vide'); });
    const I = invariant(), petit = N <= 9, D = petit ? table() : null, reste = petit ? D.get(code(t)) : undefined, gagne = fini();
    ecrire(q('#tq-coups'), entier(coups));
    ecrire(q('#tq-min'), gagne ? '' : petit ? (reste === undefined ? 'Aucune suite de coups ne range cette position.' : `Au mieux, il reste ${entier(reste)} coup${reste > 1 ? 's' : ''}.`) : `Il reste au moins ${entier(manhattan())} coups.`);
    ecrire(q('#tq-inv'), `Signature ${I.s > 0 ? '+1' : '−1'}, d = ${I.d}, produit ${I.produit > 0 ? '+1' : '−1'}`);
    const m = q('#tq-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : I.produit < 0 ? ' bloque' : '');
    ecrire(m, gagne ? (coups ? `Rangé en ${entier(coups)} coup${coups > 1 ? 's' : ''}.` : 'Position rangée. Mélangez, ou échangez deux pièces pour voir la position impossible.')
      : I.produit < 0 ? "Le produit vaut −1 : cette position ne peut pas être rangée, quels que soient les coups joués." : "Le produit vaut +1 : cette position a une solution.");
    q('#tq-conseil').disabled = !petit || gagne || reste === undefined;
    q('#tq-conseil').title = petit ? '' : 'Disponible pour les plateaux de neuf cases au plus';
  }
  function taille() { L = +q('#tq-l').value; K = +q('#tq-c').value; N = L * K; melanger(); rendre(); }
  q('#tq-l').addEventListener('change', taille); q('#tq-c').addEventListener('change', taille);
  q('#tq-melanger').addEventListener('click', () => { melanger(); rendre(); });
  q('#tq-ordre').addEventListener('click', () => { t = range(); coups = 0; conseil = -1; rendre(); });
  q('#tq-echange').addEventListener('click', () => { const a = t.indexOf(1), b = t.indexOf(2); t[a] = 2; t[b] = 1; coups = 0; conseil = -1; rendre(); });
  q('#tq-conseil').addEventListener('click', () => {
    const D = table(), d = D.get(code(t)), v = vide(t); if (!d) return;
    for (const w of voisins(v)) { const b = t.slice(); b[v] = b[w]; b[w] = 0; if (D.get(code(b)) === d - 1) { jouer(w); conseil = v; break; } }
    rendre();
  });
  q('#tq-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b && jouer(+b.dataset.i)) rendre(); });
  // Flèches du clavier : elles poussent vers la case vide la pièce qui se trouve du côté opposé. Elles sont écoutées sur
  // toute la fenêtre (et non sur le seul plateau, où il fallait d'abord avoir cliqué sur une pièce), mais seulement quand
  // le plateau est à l'écran et que l'on n'est pas dans un champ, une liste ou un curseur, pour ne pas gêner le reste.
  const { window: fenetre, demonter } = bac();
  fenetre.addEventListener('keydown', e => {
    if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    const cible = e.target, P = q('#tq-plateau'), r0 = P.getBoundingClientRect();
    if (cible && cible.closest && cible.closest('input, select, textarea, [contenteditable], [role="slider"]')) return;
    if (r0.bottom < 60 || r0.top > innerHeight - 40 || !P.isConnected) return;
    const v = vide(t), r = Math.floor(v / K), c = v % K;
    const i = e.key === 'ArrowUp' && r < L - 1 ? v + K : e.key === 'ArrowDown' && r > 0 ? v - K : e.key === 'ArrowLeft' && c < K - 1 ? v + 1 : e.key === 'ArrowRight' && c > 0 ? v - 1 : -1;
    e.preventDefault();
    if (i >= 0 && jouer(i)) rendre();
  });
  melanger(); rendre();
  return () => { vivant = false; demonter(); };
}
