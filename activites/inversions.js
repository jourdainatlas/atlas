// Casse-tête « Tout éteindre » (jeu des inversions), rubrique Activités, MEMO_atlas_activites.md §124.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .lo { display: grid; grid-template-columns: repeat(var(--col), 1fr); gap: 6px; width: min(100%, calc(var(--col) * 66px)); }
.activites-act .lo button { position: relative; aspect-ratio: 1 / 1; padding: 0; border-radius: 8px; border: 1px solid var(--encre-3); background: var(--surface); }
.activites-act .lo button.on { background: var(--activites-jeu); border-color: var(--activites-jeu); box-shadow: 0 0 0 3px color-mix(in srgb, var(--activites-jeu) 25%, transparent); }
.activites-act .lo button.appui::after { content: ""; position: absolute; inset: 34%; border-radius: 50%; background: var(--sec); border: 2px solid var(--surface); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · la théorie relève de Maths Sup</p>
  <h3>Tout éteindre</h3>
  <p class="lede">Chaque case est une lampe. Appuyer sur une case inverse son état et celui de ses voisines, à gauche, à droite, au-dessus et au-dessous. Il faut tout éteindre. Derrière le jeu se cache un système d'équations linéaires, sur un corps qui n'a que deux éléments.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Lignes <select id="lo-l"><option>2</option><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option></select></label>
    <label>Colonnes <select id="lo-c"><option>2</option><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option></select></label>
    <button type="button" class="primary" id="lo-melanger">Mélanger</button>
    <button type="button" id="lo-debut">Revenir au départ</button>
    <button type="button" id="lo-tout">Tout allumer</button>
    <button type="button" id="lo-hasard">Lampes au hasard</button>
    <label><input type="checkbox" id="lo-sol"> montrer où appuyer</label>
  </div>
  <div class="jeu-plateau"><div class="lo" id="lo-plateau" role="group" aria-label="Plateau des lampes"></div></div>
  <div class="jeu-etat"><span>Appuis : <b id="lo-coups">0</b></span><span id="lo-min"></span><span id="lo-noyau"></span></div>
  <div class="jeu-message" id="lo-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>« Revenir au départ » rétablit la position telle qu'elle était avant votre premier appui et remet le compteur à zéro, pour réessayer autant de fois que vous le souhaitez. Une fois tout éteint, la page rappelle le plus petit nombre d'appuis qui suffisait depuis cette position, pour comparer avec le vôtre. « Mélanger » part du plateau éteint et appuie au hasard : la position obtenue a donc une solution. « Tout allumer » est le défi classique. « Lampes au hasard » allume chaque lampe à pile ou face, sans rien garantir : sur certains plateaux, la plupart de ces positions sont impossibles. Cochez « montrer où appuyer » si vous séchez : les cases marquées d'un point sont celles d'une solution qui demande le moins d'appuis possible.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Deux remarques qui changent tout</h4>
    <p><b>L'ordre des appuis ne compte pas.</b> L'état final d'une lampe ne dépend que du nombre de fois où elle a été inversée, pas de l'ordre. <b>Appuyer deux fois sur la même case ne fait rien.</b> Une stratégie se réduit donc à un choix : pour chaque case, appuyer ou ne pas appuyer.</p>
    <p>Codons « allumé » par 1 et « éteint » par 0, et calculons modulo 2, où 1 + 1 = 0 : inverser une lampe, c'est lui ajouter 1. Les nombres 0 et 1, avec cette addition et la multiplication ordinaire, forment un corps, noté 𝔽₂. Une position est un vecteur <i>b</i> de 𝔽₂<sup><i>N</i></sup>, où <i>N</i> est le nombre de cases ; un choix d'appuis est un autre vecteur <i>x</i>.</p>
    <div class="def"><p>Éteindre la position <span class="kx">b</span>, c'est résoudre le système linéaire <span class="kx">Ax = b</span> sur <span class="kx">\\mathbb F_2</span>, où la matrice <span class="kx">A</span>, carrée de taille <span class="kx">N</span>, a un 1 à la ligne <span class="kx">i</span> et à la colonne <span class="kx">j</span> quand un appui sur la case <span class="kx">j</span> inverse la lampe <span class="kx">i</span>.</p></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Ce que dit le rang</h4>
    <p>La page résout ce système par la méthode du pivot de Gauss. Tout dépend du noyau de <i>A</i>, c'est-à-dire des choix d'appuis qui ne changent rien. Si sa dimension est <i>k</i>, le théorème du rang dit que les positions solubles forment un sous-espace de dimension <i>N</i> − <i>k</i> : elles sont 2<sup><i>N</i> − <i>k</i></sup> parmi 2<sup><i>N</i></sup>, soit une proportion de 1/2<sup><i>k</i></sup>, et chacune a exactement 2<sup><i>k</i></sup> solutions.</p>
    <p id="lo-rang" aria-live="polite"></p>
    <p>Changez la taille : le plateau de 3 sur 3 a un noyau réduit à zéro, toute position y est soluble, d'une seule façon ; celui de 5 sur 5 a un noyau de dimension 2, celui de 4 sur 4 un noyau de dimension 4. Pour toutes les tailles proposées ici, la position « tout allumé » est soluble : la page le vérifie par le calcul.</p>
  </div>
</section>
` + suite(
  "Chercher une stratégie « dans l'ordre », en croyant que le premier appui doit préparer le suivant. L'ordre n'a aucune importance, et réappuyer sur une case annule l'appui : toute solution est un ensemble de cases, que l'on peut jouer dans n'importe quel ordre. L'autre erreur est de croire toute position soluble : sur le plateau de 5 sur 5, trois positions sur quatre ne le sont pas.",
  "Le pivot de Gauss, le rang d'une matrice et le théorème du rang sont établis dans les chapitres de Maths Sup <a href=\"#cours/ma-15\">Dimension finie et rang</a> et <a href=\"#cours/ma-16\">Matrices</a>, sur un corps quelconque, donc aussi sur 𝔽₂. Dans l'édifice : <a href=\"#alglin.v-rang\">Théorème du rang</a>, et <a href=\"#galois.gs-corps-finis\">Corps finis</a> pour 𝔽₂.",
  "La matrice <i>A</i> est construite pour la taille choisie, puis réduite par le pivot de Gauss sur 𝔽₂ ; on en tire la dimension du noyau, une solution particulière quand il y en a une, et une base du noyau. La solution affichée est la plus courte des 2<sup><i>k</i></sup> solutions, toutes passées en revue (au plus 16 ici). Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let L = 5, K = 5, N = 25, b = [], b0 = [], min0 = null, coups = 0, S = null, vivant = true;
  const voisines = i => { const y = Math.floor(i / K), x = i % K, o = [i]; if (x > 0) o.push(i - 1); if (x < K - 1) o.push(i + 1); if (y > 0) o.push(i - K); if (y < L - 1) o.push(i + K); return o; };
  // Pivot de Gauss sur F2 de la matrice augmentée [A | I] : donne les opérations à appliquer à tout second membre.
  function preparer() {
    const M = []; for (let i = 0; i < N; i++) { const r = new Uint8Array(2 * N); for (const j of voisines(i)) r[j] = 1; r[N + i] = 1; M.push(r); }
    const pivots = []; let rg = 0;
    for (let col = 0; col < N && rg < N; col++) { let p = -1; for (let i = rg; i < N; i++) if (M[i][col]) { p = i; break; } if (p < 0) continue;
      [M[rg], M[p]] = [M[p], M[rg]]; for (let i = 0; i < N; i++) if (i !== rg && M[i][col]) for (let j = 0; j < 2 * N; j++) M[i][j] ^= M[rg][j];
      pivots.push(col); rg++; }
    // base du noyau : une colonne libre à 1, les colonnes pivots lues dans la matrice réduite
    const libres = []; for (let c = 0; c < N; c++) if (!pivots.includes(c)) libres.push(c);
    const noyau = libres.map(f => { const v = new Uint8Array(N); v[f] = 1; pivots.forEach((pc, r) => { if (M[r][f]) v[pc] = 1; }); return v; });
    S = { M, pivots, rg, noyau };
  }
  // Solution la plus courte de Ax = b, ou null.
  function resoudre() {
    const { M, pivots, rg, noyau } = S, t = new Uint8Array(N);
    for (let r = 0; r < N; r++) { let s = 0; for (let j = 0; j < N; j++) s ^= M[r][N + j] & b[j]; t[r] = s; }
    for (let r = rg; r < N; r++) if (t[r]) return null;
    const x0 = new Uint8Array(N); pivots.forEach((pc, r) => { x0[pc] = t[r]; });
    let best = x0, poids = x0.reduce((a, v) => a + v, 0);
    for (let m = 1; m < (1 << noyau.length); m++) { const x = x0.slice(); for (let k = 0; k < noyau.length; k++) if (m >> k & 1) for (let j = 0; j < N; j++) x[j] ^= noyau[k][j];
      const w = x.reduce((a, v) => a + v, 0); if (w < poids) { poids = w; best = x; } }
    return best;
  }
  const appuyer = i => { for (const j of voisines(i)) b[j] ^= 1; };
  function rendre() {
    if (!vivant) return;
    const P = q('#lo-plateau'); P.style.setProperty('--col', K);
    if (P.children.length !== N) { P.innerHTML = ''; for (let i = 0; i < N; i++) { const bt = document.createElement('button'); bt.type = 'button'; bt.dataset.i = i; P.append(bt); } }
    const sol = resoudre(), montre = q('#lo-sol').checked, eteint = b.every(v => !v), k = S.noyau.length;
    [...P.children].forEach((bt, i) => { bt.className = (b[i] ? 'on' : '') + (montre && sol && sol[i] ? ' appui' : '');
      bt.setAttribute('aria-label', `Ligne ${Math.floor(i / K) + 1}, colonne ${i % K + 1} : lampe ${b[i] ? 'allumée' : 'éteinte'}${montre && sol && sol[i] ? ', à appuyer' : ''}`); bt.setAttribute('aria-pressed', String(!!b[i])); });
    ecrire(q('#lo-coups'), entier(coups)); q('#lo-debut').disabled = coups === 0;
    const min = sol ? sol.reduce((a, v) => a + v, 0) : null;
    ecrire(q('#lo-min'), eteint ? (min0 ? `Minimum depuis le départ : ${entier(min0)}.` : '') : sol ? `Au mieux, il reste ${entier(min)} appui${min > 1 ? 's' : ''}` + (min0 !== null && coups ? ` (minimum depuis le départ : ${entier(min0)}).` : '.') : 'Aucun choix d\'appuis n\'éteint cette position.');
    ecrire(q('#lo-noyau'), `Noyau de dimension ${k}`);
    const m = q('#lo-message'); m.className = 'jeu-message' + (eteint ? ' gagne' : sol ? '' : ' bloque');
    ecrire(m, eteint ? (coups ? `Tout est éteint, en ${entier(coups)} appui${coups > 1 ? 's' : ''}. ` + (min0 === null || !min0 ? '' : coups === min0 ? `C'est le minimum possible depuis la position de départ.` : `Le minimum possible depuis la position de départ était de ${entier(min0)} appui${min0 > 1 ? 's' : ''} : « Revenir au départ » permet de réessayer.`) : 'Tout est éteint. Mélangez, ou allumez tout.')
      : sol ? 'Cette position a une solution. Appuyez sur une case pour inverser sa lampe et ses voisines.' : 'Le système Ax = b n\'a pas de solution : cette position ne peut pas être éteinte.');
    ecrire(q('#lo-rang'), `Pour le plateau de ${L} sur ${K}, N = ${N}, le rang de A est ${S.rg} et son noyau est de dimension ${k} : ` + (k === 0 ? 'toute position est soluble, d\'une seule façon.' : `une position sur ${entier(Math.pow(2, k))} est soluble, et chacune de celles-là a ${entier(Math.pow(2, k))} solutions.`));
  }
  const nouveau = f => { b = new Array(N).fill(0); f(); b0 = b.slice(); const s0 = resoudre(); min0 = s0 ? s0.reduce((a, v) => a + v, 0) : null; coups = 0; rendre(); };
  const melanger = () => nouveau(() => { do { for (let i = 0; i < N; i++) if (Math.random() < 0.5) appuyer(i); } while (b.every(v => !v)); });
  function taille() { L = +q('#lo-l').value; K = +q('#lo-c').value; N = L * K; preparer(); melanger(); }
  q('#lo-l').addEventListener('change', taille); q('#lo-c').addEventListener('change', taille);
  q('#lo-melanger').addEventListener('click', melanger);
  q('#lo-debut').addEventListener('click', () => { b = b0.slice(); coups = 0; rendre(); });
  q('#lo-tout').addEventListener('click', () => nouveau(() => b.fill(1)));
  q('#lo-hasard').addEventListener('click', () => nouveau(() => { for (let i = 0; i < N; i++) b[i] = Math.random() < 0.5 ? 1 : 0; }));
  q('#lo-sol').addEventListener('change', rendre);
  q('#lo-plateau').addEventListener('click', e => { const bt = e.target.closest('button[data-i]'); if (!bt) return; appuyer(+bt.dataset.i); coups++; rendre(); });
  preparer(); melanger();
  return () => { vivant = false; };
}
