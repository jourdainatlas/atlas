// Casse-tête « Le problème des dames » (rubrique Activités, MEMO_atlas_activites.md §125).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .dm { display: grid; grid-template-columns: repeat(var(--col), 1fr); width: min(100%, calc(var(--col) * 58px)); border: 2px solid var(--encre-3); border-radius: 6px; overflow: hidden; }
.activites-act .dm button { aspect-ratio: 1 / 1; padding: 0; border: 0; border-radius: 0; background: var(--surface); font-size: clamp(16px, 5.5vw, 30px); line-height: 1; color: var(--activites-jeu); }
.activites-act .dm button.sombre { background: var(--trame); }
.activites-act .dm button.menace { box-shadow: inset 0 0 0 100px color-mix(in srgb, var(--sec) 13%, transparent); }
.activites-act .dm button.conflit { color: var(--sec); box-shadow: inset 0 0 0 3px var(--sec); }
.activites-act .dm button.conseil { box-shadow: inset 0 0 0 3px var(--tan); color: var(--tan); }
.activites-act .dm button:hover { filter: brightness(.96); background: var(--surface); } .activites-act .dm button.sombre:hover { background: var(--trame); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · Terminale, Maths Sup</p>
  <h3>Le problème des dames</h3>
  <p class="lede">Aux échecs, une dame menace toutes les cases de sa ligne, de sa colonne et de ses deux diagonales. Peut-on poser huit dames sur l'échiquier sans que deux d'entre elles se menacent ? Et sur un échiquier plus petit, ou plus grand ?</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Taille <select id="dm-n"><option>4</option><option>5</option><option>6</option><option>7</option><option selected>8</option><option>9</option><option>10</option></select></label>
    <button type="button" class="primary" id="dm-vider">Vider l'échiquier</button>
    <button type="button" id="dm-conseil">Une dame de plus</button>
    <label><input type="checkbox" id="dm-menaces" checked> teinter les cases menacées</label>
  </div>
  <div class="jeu-plateau"><div class="dm" id="dm-plateau" role="group" aria-label="Échiquier"></div></div>
  <div class="jeu-etat"><span>Dames posées : <b id="dm-nb">0</b></span><span id="dm-sol"></span></div>
  <div class="jeu-message" id="dm-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>Cliquez sur une case pour y poser une dame, et de nouveau pour la retirer. Deux dames qui se menacent sont encadrées. Il faut poser autant de dames que l'échiquier a de lignes. Tant qu'aucune dame n'en menace une autre, la page vous dit si la position peut encore être complétée ; « Une dame de plus » en ajoute une qui ne ferme pas la porte.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Un problème de permutations</h4>
    <p>Deux dames ne peuvent pas partager une ligne : avec <i>n</i> dames sur <i>n</i> lignes, il y en a exactement une par ligne. De même, une par colonne. Une solution est donc une <b>permutation</b> : à chaque ligne <i>i</i>, elle associe la colonne σ(<i>i</i>) de sa dame. Il y a <i>n</i>! permutations, 40 320 pour <i>n</i> = 8.</p>
    <p>Restent les diagonales. Deux cases sont sur une même diagonale montante quand elles ont la même différence <i>i</i> − σ(<i>i</i>), sur une même diagonale descendante quand elles ont la même somme <i>i</i> + σ(<i>i</i>).</p>
    <p class="def">Les solutions sont les permutations σ de {1, …, <i>n</i>} pour lesquelles les <i>n</i> nombres <i>i</i> − σ(<i>i</i>) sont deux à deux distincts, ainsi que les <i>n</i> nombres <i>i</i> + σ(<i>i</i>).</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Combien de solutions ?</h4>
    <p id="dm-compte" aria-live="polite"></p>
    <p>On ne connaît aucune formule qui donne ce nombre en fonction de <i>n</i>. La page le calcule comme on le ferait à la main, mais sans se lasser : elle pose une dame sur la première ligne, puis une sur la deuxième dans une case non menacée, et ainsi de suite, en revenant en arrière dès qu'une ligne n'offre plus aucune case libre. C'est la recherche par <b>retour arrière</b>. Les nombres obtenus pour <i>n</i> de 4 à 10 sont 2, 10, 4, 40, 92, 352 et 724.</p>
    <p>Retourner ou faire tourner l'échiquier transforme une solution en solution : les huit symétries du carré regroupent les solutions en familles. Pour <i>n</i> = 8, les 92 solutions forment 12 familles.</p>
  </div>
</section>
` + suite(
  "Poser les dames « au mieux » l'une après l'autre, en croyant qu'une position sans menace mène toujours à une solution. C'est faux : sur l'échiquier de 8 sur 8, une dame dans le coin (ligne 1, colonne 1) et une autre en ligne 2, colonne 3 ne se menacent pas, et pourtant aucune des 92 solutions ne les contient toutes les deux. Il faut alors revenir en arrière. La page le signale dès que la position ne peut plus être complétée.",
  "Les permutations et leur dénombrement sont traités en Terminale dans le chapitre <a href=\"#cours/t-07\">Dénombrement</a> et en Maths Sup dans <a href=\"#cours/ma-17\">Groupe symétrique et déterminants</a> ; dans l'édifice, à la fiche <a href=\"#v-det.v-permutations\">Groupe symétrique et signature</a>.",
  "Toutes les solutions sont énumérées par retour arrière pour la taille choisie (724 au plus), puis regroupées en familles en appliquant à chacune les huit symétries du carré. « Peut être complétée » signifie qu'au moins une de ces solutions contient toutes les dames posées. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let n = 8, D = new Set(), conseil = -1, vivant = true;
  const tables = new Map();
  // Toutes les solutions (tableau col[ligne]) par retour arrière, et le nombre de familles sous les 8 symétries du carré.
  function table() {
    if (tables.has(n)) return tables.get(n);
    const sols = [], col = [], cs = new Set(), d1 = new Set(), d2 = new Set();
    (function poser(i) { if (i === n) { sols.push(col.slice()); return; }
      for (let c = 0; c < n; c++) { if (cs.has(c) || d1.has(i - c) || d2.has(i + c)) continue; cs.add(c); d1.add(i - c); d2.add(i + c); col.push(c); poser(i + 1); col.pop(); cs.delete(c); d1.delete(i - c); d2.delete(i + c); } })(0);
    const sym = s => { const pts = s.map((c, i) => [i, c]), T = [([i, c]) => [i, c], ([i, c]) => [c, n - 1 - i], ([i, c]) => [n - 1 - i, n - 1 - c], ([i, c]) => [n - 1 - c, i], ([i, c]) => [i, n - 1 - c], ([i, c]) => [n - 1 - i, c], ([i, c]) => [c, i], ([i, c]) => [n - 1 - c, n - 1 - i]];
      return T.map(f => { const r = new Array(n); pts.forEach(p => { const [a, b] = f(p); r[a] = b; }); return r.join(','); }).sort()[0]; };
    const R = { sols, familles: new Set(sols.map(sym)).size }; tables.set(n, R); return R;
  }
  const compatibles = () => { const L = [...D].map(k => [Math.floor(k / n), k % n]); return table().sols.filter(s => L.every(([i, c]) => s[i] === c)); };
  const menace = (a, b) => { const i = Math.floor(a / n), c = a % n, j = Math.floor(b / n), d = b % n; return i === j || c === d || i - c === j - d || i + c === j + d; };
  function rendre() {
    if (!vivant) return;
    const P = q('#dm-plateau'); P.style.setProperty('--col', n);
    if (P.children.length !== n * n) { P.innerHTML = ''; for (let k = 0; k < n * n; k++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.k = k; P.append(b); } }
    const L = [...D], enConflit = new Set(); for (const a of L) for (const b of L) if (a < b && menace(a, b)) { enConflit.add(a); enConflit.add(b); }
    const teinte = q('#dm-menaces').checked;
    [...P.children].forEach((b, k) => { const i = Math.floor(k / n), c = k % n, dame = D.has(k), men = !dame && L.some(a => menace(a, k));
      b.className = ((i + c) % 2 ? 'sombre' : '') + (teinte && men ? ' menace' : '') + (enConflit.has(k) ? ' conflit' : '') + (k === conseil ? ' conseil' : '');
      b.textContent = dame ? '♛' : ''; b.setAttribute('aria-pressed', String(dame));
      b.setAttribute('aria-label', `Ligne ${i + 1}, colonne ${c + 1} : ${dame ? 'dame' + (enConflit.has(k) ? ' menacée' : '') : men ? 'case menacée' : 'case libre'}`); });
    const T = table(), ok = enConflit.size === 0, comp = ok ? compatibles() : [], gagne = ok && D.size === n;
    ecrire(q('#dm-nb'), `${D.size} sur ${n}`);
    ecrire(q('#dm-sol'), `Solutions pour cette taille : ${entier(T.sols.length)}`);
    const m = q('#dm-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : !ok || !comp.length ? ' bloque' : '');
    ecrire(m, gagne ? `Réussi : ${n} dames, aucune menace.` : !ok ? 'Deux dames se menacent : retirez-en une.'
      : !comp.length ? 'Aucune dame ne se menace, mais cette position ne peut plus être complétée : il faut revenir en arrière.'
      : D.size === 0 ? 'Posez une première dame.' : `Cette position peut encore être complétée, de ${entier(comp.length)} façon${comp.length > 1 ? 's' : ''}.`);
    q('#dm-conseil').disabled = gagne || !ok || !comp.length;
    ecrire(q('#dm-compte'), `Pour l'échiquier de ${n} sur ${n}, il y a ${entier(T.sols.length)} solutions parmi les ${entier([...Array(n)].reduce((f, _, i) => f * (i + 1), 1))} permutations, qui forment ${entier(T.familles)} famille${T.familles > 1 ? 's' : ''} quand on identifie les solutions qui se déduisent l'une de l'autre par une symétrie du carré.`);
  }
  q('#dm-n').addEventListener('change', e => { n = +e.target.value; D = new Set(); conseil = -1; rendre(); });
  q('#dm-vider').addEventListener('click', () => { D = new Set(); conseil = -1; rendre(); });
  q('#dm-menaces').addEventListener('change', rendre);
  q('#dm-conseil').addEventListener('click', () => { const comp = compatibles(); if (!comp.length) return; const s = comp[Math.floor(Math.random() * comp.length)];
    for (let i = 0; i < n; i++) if (!D.has(i * n + s[i])) { D.add(i * n + s[i]); conseil = i * n + s[i]; break; } rendre(); });
  q('#dm-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b) return; const k = +b.dataset.k; if (D.has(k)) D.delete(k); else D.add(k); conseil = -1; rendre(); });
  rendre();
  return () => { vivant = false; };
}
