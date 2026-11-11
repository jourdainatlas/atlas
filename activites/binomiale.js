// Exploration « De la loi binomiale à la courbe en cloche » (rubrique Activités, MEMO_atlas_activites.md §123).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Loi binomiale</p>
  <h3>De la loi binomiale à la courbe en cloche</h3>
  <p class="lede">On répète <i>n</i> fois, de façon indépendante, une épreuve qui réussit avec la probabilité <i>p</i>, et l'on compte les succès. Quand <i>n</i> grandit, le diagramme de cette loi prend toujours la même forme. Cette page la fait apparaître, sans simulation : toutes les probabilités affichées sont exactes.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Le diagramme de la loi</h4>
    <p>La variable <i>X</i> suit la loi binomiale de paramètres <i>n</i> et <i>p</i>. Chaque barre a pour hauteur la probabilité P(<i>X</i> = <i>k</i>). Faites varier <i>n</i> et <i>p</i> : le diagramme se déplace, car son centre est l'espérance <i>np</i>, et il s'étale, car sa largeur se mesure par l'écart-type σ = √(<i>np</i>(1 − <i>p</i>)).</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="bn-fig" class="moyen" aria-label="Diagramme en barres de la loi binomiale, éventuellement centrée et réduite, et densité de la loi normale"></canvas>
      <div class="side">
        <h5>La loi</h5>
        <dl class="lectures" aria-live="polite">
          <dt>espérance <i>np</i></dt><dd id="bn-mu"></dd>
          <dt>écart-type σ</dt><dd id="bn-sigma"></dd>
        </dl>
        <h5 style="margin-top:6px">Autour de l'espérance</h5>
        <table id="bn-tab" aria-label="Probabilité que X soit à moins de un, deux ou trois écarts-types de son espérance"><thead><tr><th>à moins de</th><th>binomiale</th><th>normale</th></tr></thead><tbody></tbody></table>
        <p class="verdict" id="bn-note"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="bn-n"><i>n</i></label><input type="range" id="bn-n" min="1" max="200" step="1" value="20"><output id="bn-nv"></output>
      <label for="bn-p"><i>p</i></label><input type="range" id="bn-p" min="0.02" max="0.98" step="0.01" value="0.3"><output id="bn-pv"></output>
    </div>
    <div class="bar"><label><input type="checkbox" id="bn-red"> centrer et réduire</label><label><input type="checkbox" id="bn-norm"> montrer la courbe en cloche</label></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Centrer et réduire</h4>
    <p>Pour comparer des diagrammes qui n'ont ni le même centre ni la même largeur, on remplace <i>X</i> par <i>Z</i> = (<i>X</i> − <i>np</i>)/σ, d'espérance 0 et d'écart-type 1. Cochez « centrer et réduire » : chaque barre est alors placée en (<i>k</i> − <i>np</i>)/σ, avec la largeur 1/σ et la hauteur σ × P(<i>X</i> = <i>k</i>), de sorte que son <em>aire</em> reste égale à P(<i>X</i> = <i>k</i>).</p>
    <p>Faites maintenant grandir <i>n</i>. Le diagramme ne bouge presque plus : il se cale sur une courbe fixe, que vous pouvez afficher. C'est la courbe de la fonction φ(<i>x</i>) = e<sup>−<i>x</i>²/2</sup>/√(2π), densité de la <b>loi normale centrée réduite</b>.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le théorème de De Moivre-Laplace</h4>
    <div class="def"><p>Soit <span class="kx">p</span> un réel de <span class="kx">]0\\,;1[</span> et, pour tout <span class="kx">n</span>, une variable <span class="kx">X_n</span> de loi binomiale de paramètres <span class="kx">n</span> et <span class="kx">p</span>. Alors, pour tous réels <span class="kx">a \\leqslant b</span>,</p><span class="kx kxd">\\begin{aligned} & P\\left(a \\leqslant \\frac{X_n - np}{\\sqrt{np(1-p)}} \\leqslant b\\right) \\\\[2pt] & \\qquad \\xrightarrow[n \\to +\\infty]{}\\; \\int_a^b \\varphi(t)\\,\\mathrm dt, \\end{aligned}</span><p>l'aire sous la courbe de <span class="kx">\\varphi</span> entre <span class="kx">a</span> et <span class="kx">b</span>.</p></div>
    <p>Le tableau compare, pour les valeurs choisies, la probabilité exacte que <i>X</i> soit à moins de un, deux ou trois écarts-types de son espérance, et les limites 0,6827, 0,9545 et 0,9973 données par la loi normale. C'est la raison d'être des intervalles de fluctuation « à deux écarts-types ».</p>
    <p>Prenez enfin <i>p</i> = 0,05 et <i>n</i> = 30 : le diagramme est dissymétrique et la cloche ne lui va pas. Le théorème parle d'une limite à <i>p</i> fixé ; quand <i>np</i> est petit, on est encore loin de cette limite.</p>
  </div>
</section>
` + suite(
  "Appliquer la loi normale sans regarder si <i>n</i> est assez grand, ni ce que l'on fait des bornes. Pour <i>n</i> = 100 et <i>p</i> = 0,5, on a σ = 5 et P(45 ≤ <i>X</i> ≤ 55) = 0,7287 à 10⁻⁴ près, alors que la loi normale annonce 0,6827 : les deux valeurs extrêmes 45 et 55, comptées en entier, pèsent lourd. Une loi qui ne prend que des valeurs entières ne se compare à une aire qu'en élargissant l'intervalle d'une demi-unité de chaque côté.",
  "Le chapitre de Terminale <a href=\"#cours/t-10\">Loi des grands nombres</a> étudie la concentration de <i>X</i>/<i>n</i> autour de <i>p</i>, dont ce théorème précise la forme. Dans l'édifice, il est un cas particulier du <a href=\"#proba.p-tcl\">Théorème central limite</a>, démontré par la méthode de Lindeberg.",
  "Chaque probabilité P(<i>X</i> = <i>k</i>) est calculée par son logarithme, ln C(<i>n</i>, <i>k</i>) + <i>k</i> ln <i>p</i> + (<i>n</i> − <i>k</i>) ln(1 − <i>p</i>), pour éviter les dépassements de capacité quand <i>n</i> est grand ; les probabilités du tableau sont des sommes de ces valeurs, arrondies à 10⁻⁴. Les trois valeurs de référence de la loi normale sont des constantes connues. Rien n'est enregistré ni envoyé.");

const REF = [0.6827, 0.9545, 0.9973];
export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { n: 20, p: 0.3, red: false, norm: false };
  q('#bn-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#bn-p').addEventListener('input', e => { E.p = Math.round(+e.target.value * 100) / 100; S.planifier(); });
  q('#bn-red').addEventListener('change', e => { E.red = e.target.checked; S.planifier(); });
  q('#bn-norm').addEventListener('change', e => { E.norm = e.target.checked; S.planifier(); });
  function loi(n, p) {   // P(X = k), k = 0..n, par les logarithmes
    const lf = [0]; for (let i = 1; i <= n; i++) lf.push(lf[i - 1] + Math.log(i));
    return Array.from({ length: n + 1 }, (_, k) => Math.exp(lf[n] - lf[k] - lf[n - k] + k * Math.log(p) + (n - k) * Math.log(1 - p)));
  }
  function rendre(C) {
    const { n, p } = E, P = loi(n, p), mu = n * p, sg = Math.sqrt(n * p * (1 - p)), max = Math.max(...P);
    const { ctx, w, h } = toile(q('#bn-fig'));
    const phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    let v;
    if (E.red) { v = vue(w, h, -4.2, 4.2, -0.04, Math.max(0.46, max * sg * 1.12)); }
    else { const lo = Math.max(-0.7, mu - 4.2 * sg - 0.7), hi = Math.min(n + 0.7, mu + 4.2 * sg + 0.7); v = vue(w, h, n <= 12 ? -0.7 : lo, n <= 12 ? n + 0.7 : hi, -max * 0.08, max * 1.15); }
    grille(ctx, v, C, false);
    const X = k => E.red ? (k - mu) / sg : k, L = E.red ? 1 / sg : 1, Hh = k => E.red ? P[k] * sg : P[k];
    for (let k = 0; k <= n; k++) { const x0 = v.X(X(k) - L / 2), x1 = v.X(X(k) + L / 2); if (x1 < 0 || x0 > w) continue;
      const dedans = Math.abs(k - mu) <= 2 * sg + 1e-12, y = v.Y(Hh(k)), y0 = v.Y(0);
      ctx.globalAlpha = .55; ctx.fillStyle = dedans ? C.bleu : C.doux; ctx.fillRect(x0 + .5, y, Math.max(1, x1 - x0 - 1), y0 - y); ctx.globalAlpha = 1; }
    if (E.norm) { if (E.red) courbe(ctx, v, phi, C.vert, 2.6); else courbe(ctx, v, x => phi((x - mu) / sg) / sg, C.vert, 2.6); }
    ctx.strokeStyle = C.orange; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); const xm = v.X(E.red ? 0 : mu); trait(ctx, xm, 0, xm, h); ctx.setLineDash([]);
    etiquette(ctx, C, E.red ? '0' : 'np', xm, 11, C.orange, 'center', 12);
    // textes
    if (+q('#bn-n').value !== n) q('#bn-n').value = n; ecrire(q('#bn-nv'), String(n));
    if (Math.abs(+q('#bn-p').value - p) > 1e-9) q('#bn-p').value = p; ecrire(q('#bn-pv'), fr(p, 2));
    ecrire(q('#bn-mu'), fr(mu, 2)); ecrire(q('#bn-sigma'), fr(sg, 4));
    let lignes = '';
    for (const c of [1, 2, 3]) { let s = 0; for (let k = 0; k <= n; k++) if (Math.abs(k - mu) <= c * sg + 1e-12) s += P[k];
      lignes += `<tr${c === 2 ? ' class="now"' : ''}><td>${c} σ</td><td>${fr(Math.min(1, s), 4)}</td><td>${fr(REF[c - 1], 4)}</td></tr>`; }
    ecrire(q('#bn-tab').tBodies[0], lignes, true);
    const petit = Math.min(mu, n - mu);
    ecrire(q('#bn-note'), petit < 5 ? `Ici ${mu < n - mu ? 'np' : 'n(1 − p)'} = ${fr(petit, 2)} est petit : le diagramme bute sur un bord et reste dissymétrique, la courbe en cloche le décrit mal.` : "Les barres bleues sont celles des valeurs situées à moins de deux écarts-types de l'espérance.");
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
