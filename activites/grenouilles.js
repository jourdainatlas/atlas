// Casse-tête « Les grenouilles » (échange de deux rangées), rubrique Activités, MEMO_atlas_activites.md §129.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .gr { display: grid; grid-template-columns: repeat(var(--col), 1fr); gap: 5px; width: min(100%, calc(var(--col) * 62px)); }
.activites-act .gr button { aspect-ratio: 1 / 1; padding: 0; border-radius: 50%; border: 2px solid transparent; font: 700 clamp(13px, 4vw, 22px)/1 var(--f-ui); color: var(--surface); cursor: pointer; }
.activites-act .gr button.g { background: var(--activites-jeu); }
.activites-act .gr button.c { background: var(--sec); }
.activites-act .gr button.vide { background: transparent; border: 2px dashed var(--encre-3); border-radius: 10px; cursor: default; }
.activites-act .gr button.fixe { opacity: .55; cursor: default; }
.activites-act .gr button.conseil { box-shadow: 0 0 0 4px color-mix(in srgb, var(--tan) 60%, transparent); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible dès la Première</p>
  <h3>Les grenouilles</h3>
  <p class="lede">Deux rangées se font face sur une file de nénuphars, séparées par un seul nénuphar libre. Les <b style="color:var(--activites-jeu)">bleues</b> ne vont que vers la droite, les <b class="c-sec">orange</b> que vers la gauche. Il faut échanger les deux rangées.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Bleues <select id="gr-n"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label>
    <label>Orange <select id="gr-m"><option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label>
    <button type="button" class="primary" id="gr-debut">Recommencer</button>
    <button type="button" id="gr-annuler">Annuler un coup</button>
    <button type="button" id="gr-conseil">Un coup</button>
  </div>
  <div class="jeu-plateau"><div class="gr" id="gr-plateau" role="group" aria-label="File des nénuphars"></div></div>
  <div class="jeu-etat"><span>Coups : <b id="gr-coups">0</b></span><span>dont sauts : <b id="gr-sauts">0</b></span><span id="gr-attendu"></span></div>
  <div class="jeu-message" id="gr-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Une grenouille peut <b>avancer</b> d'un nénuphar s'il est libre, ou <b>sauter</b> par-dessus une seule grenouille de l'autre couleur pour atterrir sur le nénuphar libre juste derrière. Elle ne recule jamais, et ne saute pas par-dessus une grenouille de sa couleur. Cliquez sur une grenouille : si elle peut bouger, elle n'a qu'une façon de le faire.</p>
    <p>On se bloque vite, et il faut alors annuler des coups. La page ne prévient pas quand une position est devenue sans issue : elle ne le dit que lorsque plus aucune grenouille ne peut bouger. Le bouton « Un coup » joue un bon coup s'il en existe un.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Toutes les solutions ont la même longueur</h4>
    <p>Notons <i>n</i> le nombre de bleues et <i>m</i> le nombre d'orange. On peut compter les coups d'une solution sans la connaître, en comptant deux fois la même chose.</p>
    <p><b>Les sauts.</b> À la fin, chaque bleue est passée de la gauche à la droite de chaque orange. Deux grenouilles de couleurs différentes ne peuvent se croiser que par un saut de l'une par-dessus l'autre, et elles ne se croisent qu'une fois puisque personne ne recule. Il y a donc exactement <i>nm</i> sauts.</p>
    <p><b>Les distances.</b> Chaque bleue avance de <i>m</i> + 1 nénuphars et chaque orange de <i>n</i> + 1 : la distance totale parcourue est <i>n</i>(<i>m</i> + 1) + <i>m</i>(<i>n</i> + 1) = 2<i>nm</i> + <i>n</i> + <i>m</i>. Les <i>nm</i> sauts, de longueur 2, en couvrent 2<i>nm</i>. Il reste <i>n</i> + <i>m</i>, parcourus par des pas de longueur 1.</p>
    <div class="def"><p>Toute solution compte exactement <span class="kx">nm</span> sauts et <span class="kx">n + m</span> pas, soit <span class="kx">nm + n + m</span> coups : ni plus, ni moins. Pour trois grenouilles de chaque couleur, 15 coups.</p></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Très peu de façons de réussir</h4>
    <p id="gr-compte" aria-live="polite"></p>
    <p>Le fil conducteur d'une solution : éviter que deux grenouilles de la même couleur se retrouvent collées l'une derrière l'autre face à une grenouille adverse, car plus personne ne peut alors sauter à cet endroit. Dès qu'il y a au moins deux grenouilles de chaque couleur, il existe exactement deux solutions : l'une commence par une bleue, l'autre par une orange.</p>
  </div>
</section>
` + suite(
  "Croire qu'en jouant plus habilement on finira par trouver une solution plus courte. Ce n'est pas possible : le double comptage montre que toute solution, quelle qu'elle soit, a exactement <i>nm</i> + <i>n</i> + <i>m</i> coups. La difficulté du jeu n'est pas d'aller vite, c'est de ne pas se bloquer : pour trois grenouilles de chaque couleur, 13 des 72 positions que l'on peut atteindre sont des impasses.",
  "Le raisonnement est un double comptage, comme ceux du chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> ; il s'appuie sur une quantité qui ne peut que croître, la distance parcourue. Dans l'édifice : <a href=\"#n.n-recurrence\">Principe de récurrence</a>, qui sert à établir qu'un tel jeu s'arrête toujours.",
  "Pour chaque taille, la page parcourt toutes les positions que l'on peut atteindre depuis le départ (476 pour cinq grenouilles de chaque couleur, 1 089 pour six), compte les impasses et les solutions, et en tire le coup conseillé. Ces nombres sont des résultats de parcours exhaustif, non des estimations. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let n = 3, m = 3, pos = '', hist = [], sauts = 0, conseil = -1, msg = '', T = null, vivant = true;
  const but = () => 'C'.repeat(m) + '_' + 'G'.repeat(n);
  // coup de la pièce i dans la position s : nouvelle position, ou null
  const jouer = (s, i) => { const e = s.indexOf('_'), p = s[i]; let ok = false;
    if (p === 'G') ok = e === i + 1 || (e === i + 2 && s[i + 1] === 'C'); else if (p === 'C') ok = e === i - 1 || (e === i - 2 && s[i - 1] === 'G');
    if (!ok) return null; const a = s.split(''); a[e] = p; a[i] = '_'; return a.join(''); };
  const suivants = s => { const o = []; for (let i = 0; i < s.length; i++) { const t = jouer(s, i); if (t) o.push([i, t]); } return o; };
  function table() { const depart = 'G'.repeat(n) + '_' + 'C'.repeat(m), B = but(), vus = new Set([depart]), nb = new Map(); let file = [depart], impasses = 0;
    while (file.length) { const g = []; for (const s of file) { const S = suivants(s); if (!S.length && s !== B) impasses++; for (const [, t] of S) if (!vus.has(t)) { vus.add(t); g.push(t); } } file = g; }
    const compter = s => { if (s === B) return 1; if (nb.has(s)) return nb.get(s); let c = 0; for (const [, t] of suivants(s)) c += compter(t); nb.set(s, c); return c; };
    T = { etats: vus.size, impasses, solutions: compter(depart), compter }; }
  function debut() { pos = 'G'.repeat(n) + '_' + 'C'.repeat(m); hist = []; sauts = 0; conseil = -1; msg = ''; }
  function rendre() {
    if (!vivant) return;
    const P = q('#gr-plateau'), L = n + m + 1; P.style.setProperty('--col', L);
    if (P.children.length !== L) { P.innerHTML = ''; for (let i = 0; i < L; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; P.append(b); } }
    const gagne = pos === but(), S = suivants(pos), mobiles = new Set(S.map(x => x[0]));
    [...P.children].forEach((b, i) => { const c = pos[i]; b.className = (c === '_' ? 'vide' : c === 'G' ? 'g' : 'c') + (c !== '_' && !mobiles.has(i) ? ' fixe' : '') + (i === conseil ? ' conseil' : '');
      b.textContent = c === 'G' ? '▶' : c === 'C' ? '◀' : ''; b.disabled = c === '_';
      b.setAttribute('aria-label', `Nénuphar ${i + 1} : ${c === '_' ? 'libre' : c === 'G' ? 'grenouille bleue, qui va vers la droite' : 'grenouille orange, qui va vers la gauche'}${mobiles.has(i) ? ', peut bouger' : ''}`); });
    ecrire(q('#gr-coups'), entier(hist.length)); ecrire(q('#gr-sauts'), entier(sauts));
    ecrire(q('#gr-attendu'), `Une solution compte ${n * m + n + m} coups, dont ${n * m} sauts.`);
    q('#gr-annuler').disabled = !hist.length; q('#gr-conseil').disabled = gagne;
    const mg = q('#gr-message'); mg.className = 'jeu-message' + (gagne ? ' gagne' : !S.length ? ' bloque' : '');
    ecrire(mg, gagne ? `Réussi, en ${hist.length} coups, dont ${sauts} sauts : exactement le nombre annoncé, comme pour toute solution.` : !S.length ? 'Impasse : plus aucune grenouille ne peut bouger. Annulez des coups, ou recommencez.' : msg || (hist.length ? 'Continuez.' : 'Cliquez sur une grenouille pour la faire avancer ou sauter.'));
    ecrire(q('#gr-compte'), `Pour ${n} bleue${n > 1 ? 's' : ''} et ${m} orange, on peut atteindre ${entier(T.etats)} positions depuis le départ ; ${entier(T.impasses)} sont des impasses, et il existe exactement ${T.solutions} suite${T.solutions > 1 ? 's' : ''} de coups qui réussi${T.solutions > 1 ? 'ssent' : 't'}.` + (n > 1 && m > 1 ? ' Ce décompte a été fait pour toutes les tailles proposées : dès que chaque couleur compte au moins deux grenouilles, il y a deux solutions, et deux seulement.' : n + m > 2 ? ' Avec une seule grenouille d\'un côté, le jeu est plus souple : elle peut attendre son tour de plusieurs façons.' : ''));
  }
  function coup(i) { const t = jouer(pos, i); if (!t) { msg = 'Cette grenouille ne peut pas bouger : il lui faut un nénuphar libre devant elle, ou juste derrière une grenouille de l\'autre couleur.'; conseil = -1; rendre(); return; }
    hist.push([pos, sauts]); if (Math.abs(pos.indexOf('_') - i) === 2) sauts++; pos = t; msg = ''; conseil = -1; rendre(); }
  q('#gr-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b && !b.disabled) coup(+b.dataset.i); });
  q('#gr-debut').addEventListener('click', () => { debut(); rendre(); });
  q('#gr-annuler').addEventListener('click', () => { if (!hist.length) return; [pos, sauts] = hist.pop(); msg = ''; conseil = -1; rendre(); });
  q('#gr-conseil').addEventListener('click', () => { const bon = suivants(pos).find(([, t]) => T.compter(t) > 0);
    if (bon) { conseil = bon[0]; msg = 'La grenouille entourée de vert peut jouer sans fermer la porte.'; } else { conseil = -1; msg = 'Vous avez demandé de l\'aide : depuis cette position, aucune suite de coups ne réussit plus. Annulez un ou plusieurs coups.'; } rendre(); });
  function taille() { n = +q('#gr-n').value; m = +q('#gr-m').value; table(); debut(); rendre(); }
  q('#gr-n').addEventListener('change', taille); q('#gr-m').addEventListener('change', taille);
  taille();
  return () => { vivant = false; };
}
