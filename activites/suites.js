// Exploration « Suites arithmétiques et géométriques » (rubrique Activités, MEMO_atlas_activites.md §127).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, etiquette, pastille, ecrire, fr, frc } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Première, Terminale · Suites</p>
  <h3>Suites arithmétiques et géométriques</h3>
  <p class="lede">Ajouter toujours le même nombre, ou multiplier toujours par le même nombre : ces deux règles donnent les deux familles de suites les plus simples, et deux façons de grandir qui n'ont rien de comparable. Ici, on les fait courir côte à côte.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Deux règles, deux allures</h4>
    <p>La suite <b class="c-mark">arithmétique</b> (<i>u<sub>n</sub></i>) part de <i>u</i><sub>0</sub> et l'on ajoute la <b>raison</b> <i>r</i> à chaque pas : ses points sont alignés. La suite <b class="c-sec">géométrique</b> (<i>v<sub>n</sub></i>) part de <i>v</i><sub>0</sub> et l'on multiplie par la <b>raison</b> <i>q</i> à chaque pas : ses points se placent sur une courbe exponentielle, ou sautent d'un côté à l'autre de l'axe quand <i>q</i> est négatif. Réglez les quatre nombres et le nombre de termes affichés.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="sg-fig" class="moyen" aria-label="Termes des deux suites, arithmétique et géométrique, en fonction du rang"></canvas>
      <div class="side">
        <h5>Au rang choisi (<span id="sg-nn"></span>)</h5>
        <dl class="lectures" aria-live="polite">
          <dt><i>u<sub>n</sub></i> = <i>u</i><sub>0</sub> + <i>nr</i></dt><dd id="sg-un"></dd>
          <dt><i>u</i><sub>0</sub> + … + <i>u<sub>n</sub></i></dt><dd id="sg-su"></dd>
          <dt><i>v<sub>n</sub></i> = <i>v</i><sub>0</sub> × <i>q<sup>n</sup></i></dt><dd id="sg-vn"></dd>
          <dt><i>v</i><sub>0</sub> + … + <i>v<sub>n</sub></i></dt><dd id="sg-sv"></dd>
        </dl>
        <p class="verdict" id="sg-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="sg-u0"><i>u</i><sub>0</sub></label><input type="range" id="sg-u0" min="-10" max="10" step="0.05"><output id="sg-u0v"></output>
      <label for="sg-r"><i>r</i></label><input type="range" id="sg-r" min="-3" max="3" step="0.05"><output id="sg-rv"></output>
      <label for="sg-v0"><i>v</i><sub>0</sub></label><input type="range" id="sg-v0" min="-10" max="10" step="0.05"><output id="sg-v0v"></output>
      <label for="sg-q"><i>q</i></label><input type="range" id="sg-q" min="-2" max="2" step="0.01"><output id="sg-qv"></output>
      <label for="sg-n">rang <i>n</i></label><input type="range" id="sg-n" min="2" max="40" step="1"><output id="sg-nv"></output>
    </div>
    <div class="bar"><span class="chips" id="sg-ex"></span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Le terme général et la somme</h4>
    <p class="def">Suite arithmétique de raison <i>r</i> : <i>u<sub>n</sub></i> = <i>u</i><sub>0</sub> + <i>nr</i>, et <i>u</i><sub>0</sub> + <i>u</i><sub>1</sub> + … + <i>u<sub>n</sub></i> = (<i>n</i> + 1)(<i>u</i><sub>0</sub> + <i>u<sub>n</sub></i>)/2. Suite géométrique de raison <i>q</i> ≠ 1 : <i>v<sub>n</sub></i> = <i>v</i><sub>0</sub><i>q<sup>n</sup></i>, et <i>v</i><sub>0</sub> + <i>v</i><sub>1</sub> + … + <i>v<sub>n</sub></i> = <i>v</i><sub>0</sub>(1 − <i>q</i><sup><i>n</i>+1</sup>)/(1 − <i>q</i>).</p>
    <p>La première somme s'obtient en écrivant la somme deux fois, à l'endroit et à l'envers : chaque colonne vaut <i>u</i><sub>0</sub> + <i>u<sub>n</sub></i>, et il y a <i>n</i> + 1 colonnes. La seconde, en multipliant la somme <i>S</i> par <i>q</i> : dans <i>S</i> − <i>qS</i>, tous les termes se simplifient sauf le premier et le dernier, et il reste <i>v</i><sub>0</sub> − <i>v</i><sub>0</sub><i>q</i><sup><i>n</i>+1</sup>. La page calcule chaque somme deux fois, par la formule et en additionnant les termes un à un, et vérifie que les deux résultats coïncident.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>La géométrique finit toujours par gagner</h4>
    <p>Choisissez l'exemple « lièvre et tortue » : <i>u<sub>n</sub></i> = 5 + 3<i>n</i> part devant et avance vite, <i>v<sub>n</sub></i> = 0,5 × 1,2<sup><i>n</i></sup> part presque de rien. Pendant vingt rangs, la suite arithmétique domine largement. Poussez le rang jusqu'à 40 : la suite géométrique la rattrape, puis s'envole. Dès que <i>q</i> &gt; 1 et <i>v</i><sub>0</sub> &gt; 0, il en va toujours ainsi, quelle que soit la raison <i>r</i> : les écarts successifs de (<i>v<sub>n</sub></i>) sont eux-mêmes multipliés par <i>q</i> à chaque pas et finissent par dépasser <i>r</i>.</p>
    <p>Avec −1 &lt; <i>q</i> &lt; 1, au contraire, <i>v<sub>n</sub></i> tend vers 0, et la somme des termes se stabilise : elle tend vers <i>v</i><sub>0</sub>/(1 − <i>q</i>). Essayez « moitiés » : 1 + 1/2 + 1/4 + … s'approche de 2 sans jamais l'atteindre.</p>
  </div>
</section>
` + suite(
  "Se tromper d'une unité sur le nombre de termes. De <i>u</i><sub>0</sub> à <i>u<sub>n</sub></i>, il y a <i>n</i> + 1 termes, et non <i>n</i> : 1 + 2 + 4 + … + 2<sup>10</sup> compte onze termes et vaut 2<sup>11</sup> − 1 = 2 047, non 2<sup>10</sup> − 1. Même vigilance quand la suite commence au rang 1 : le terme général devient <i>u<sub>n</sub></i> = <i>u</i><sub>1</sub> + (<i>n</i> − 1)<i>r</i>, ou <i>v<sub>n</sub></i> = <i>v</i><sub>1</sub><i>q</i><sup><i>n</i>−1</sup>.",
  "Le chapitre de Première <a href=\"#cours/p-02\">Notion de suite</a> définit ces deux familles ; celui de Terminale <a href=\"#cours/t-01\">Suites numériques</a> étudie la limite de <i>q<sup>n</sup></i>, et celui de Maths Sup <a href=\"#cours/ma-07\">Nombres réels et suites numériques</a> reprend le tout avec les définitions exactes. Dans l'édifice : <a href=\"#ar-suites.su-convergence\">Suite convergente, limite</a>.",
  "Les quatre réglages sont des décimaux exacts (pas de 0,05, de 0,01 pour <i>q</i>). Les termes de la suite arithmétique et sa somme sont calculés en entiers, donc exactement ; ceux de la suite géométrique le sont en valeur approchée, affichée avec quatre chiffres significatifs au moins. Le rang à partir duquel la suite géométrique dépasse l'autre pour toujours est le premier rang où <i>v<sub>n</sub></i> &gt; <i>u<sub>n</sub></i> et où l'écart <i>v</i><sub><i>n</i>+1</sub> − <i>v<sub>n</sub></i> est au moins égal à <i>r</i> : à partir de là, cet écart ne fait que croître. Rien n'est enregistré ni envoyé.");

const EX = [['lièvre et tortue', 5, 3, 0.5, 1.2, 20], ['moitiés', 0, 0.5, 1, 0.5, 12], ['alternée', 2, -0.25, 3, -0.8, 16], ['doublement', 1, 2, 1, 2, 10], ['intérêts', 10, 0.5, 10, 1.05, 30]];
const gd = x => { const a = Math.abs(x); return a >= 1e6 ? (x < 0 ? '−' : '') + (a / Math.pow(10, Math.floor(Math.log10(a)))).toFixed(3).replace('.', ',') + ' × 10^' + Math.floor(Math.log10(a)) : frc(x, a >= 100 ? 2 : 4); };

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { u0: 5, r: 3, v0: 0.5, q: 1.2, n: 20 };
  for (const k of ['u0', 'r', 'v0', 'q', 'n']) q('#sg-' + k).addEventListener('input', e => { E[k] = k === 'n' ? +e.target.value : Math.round(+e.target.value * 100) / 100; S.planifier(); });
  EX.forEach(([nom, u0, r, v0, qq, n]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = nom;
    b.addEventListener('click', () => { Object.assign(E, { u0, r, v0, q: qq, n }); S.planifier(); }); q('#sg-ex').append(b); });
  function rendre(C) {
    const { u0, r, v0, n } = E, qq = E.q, U = [], V = []; let su = 0, sv = 0;
    for (let k = 0; k <= n; k++) { const u = (Math.round(u0 * 100) + k * Math.round(r * 100)) / 100, v = v0 * Math.pow(qq, k); U.push(u); V.push(v); su += u; sv += v; }
    const suF = (n + 1) * (Math.round(u0 * 100) + Math.round(U[n] * 100)) / 200, svF = qq === 1 ? (n + 1) * v0 : v0 * (1 - Math.pow(qq, n + 1)) / (1 - qq);
    const { ctx, w, h } = toile(q('#sg-fig'));
    let lo = Math.min(0, ...U, ...V), hi = Math.max(0, ...U, ...V); if (hi - lo < 1) { hi += 0.5; lo -= 0.5; } const mg = (hi - lo) * 0.08;
    const v = vue(w, h, -0.06 * n - 0.4, n * 1.04 + 0.4, lo - mg, hi + mg);
    grille(ctx, v, C, false);
    const ligne = (T, coul) => { ctx.strokeStyle = coul; ctx.globalAlpha = .35; ctx.lineWidth = 1.4; ctx.beginPath(); T.forEach((y, k) => k ? ctx.lineTo(v.X(k), v.Y(y)) : ctx.moveTo(v.X(k), v.Y(y))); ctx.stroke(); ctx.globalAlpha = 1; T.forEach((y, k) => pastille(ctx, v.X(k), v.Y(y), coul, n > 25 ? 3 : 4)); };
    ligne(U, C.bleu); ligne(V, C.orange);
    etiquette(ctx, C, 'uₙ', v.X(n) - 4, v.Y(U[n]) - 12, C.bleu, 'right', 13); etiquette(ctx, C, 'vₙ', v.X(n) - 4, v.Y(V[n]) + 14, C.orange, 'right', 13);
    for (const k of ['u0', 'r', 'v0', 'q', 'n']) { const el = q('#sg-' + k); if (Math.abs(+el.value - E[k]) > 1e-9) el.value = E[k]; ecrire(q('#sg-' + k + 'v'), k === 'n' ? String(n) : fr(E[k], 2)); }
    ecrire(q('#sg-nn'), String(n)); ecrire(q('#sg-un'), frc(U[n], 2)); ecrire(q('#sg-vn'), gd(V[n]));
    const accord = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    ecrire(q('#sg-su'), frc(suF, 3) + (accord(su, suF) ? '' : ' ?')); ecrire(q('#sg-sv'), gd(svF) + (accord(sv, svF) ? '' : ' ?'));
    let txt;
    if (v0 === 0 || qq === 0) txt = 'La suite géométrique est nulle' + (v0 === 0 ? '.' : ' à partir du rang 1.');
    else if (qq === 1) txt = 'Avec q = 1, la suite géométrique est constante : c\'est aussi une suite arithmétique de raison 0.';
    else if (qq === -1) txt = 'Avec q = −1, la suite géométrique prend alternativement deux valeurs opposées : elle n\'a pas de limite.';
    else if (Math.abs(qq) < 1) txt = `Comme −1 < q < 1, vₙ tend vers 0 et la somme des termes tend vers v₀/(1 − q) = ${frc(v0 / (1 - qq), 4)}.`;
    else if (qq < -1) txt = 'Comme q < −1, les termes vₙ changent de signe à chaque rang et leur valeur absolue tend vers l\'infini : la suite n\'a pas de limite.';
    else if (v0 < 0) txt = 'Comme q > 1 et v₀ < 0, vₙ tend vers −∞, de plus en plus vite.';
    else { let k = 0, vk = v0; while (k < 100000 && !(vk > (Math.round(u0 * 100) + k * Math.round(r * 100)) / 100 && vk * (qq - 1) >= r)) { k++; vk *= qq; }
      txt = k === 0 ? 'La suite géométrique est au-dessus de la suite arithmétique dès le rang 0, et le reste pour toujours.' : k < 100000 ? `La suite géométrique dépasse la suite arithmétique pour toujours à partir du rang ${k}${k > n ? ', au-delà des rangs affichés' : ''}.` : 'La suite géométrique finira par dépasser la suite arithmétique, à un rang très lointain.'; }
    ecrire(q('#sg-verdict'), txt);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
