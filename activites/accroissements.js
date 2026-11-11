// Exploration « Les accroissements finis » (rubrique Activités, MEMO_atlas_activites.md §129).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, droite, etiquette, poignee, pastille, glisser, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Maths Sup · Dérivation</p>
  <h3>Les accroissements finis</h3>
  <p class="lede">Si vous avez roulé à 80 km/h de moyenne, votre compteur a indiqué exactement 80 à un moment au moins. C'est le théorème des accroissements finis : entre deux points d'une courbe sans angle, il y a toujours un endroit où la tangente est parallèle à la corde.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Une tangente parallèle à la corde</h4>
    <p>Choisissez une fonction : <span class="chips" id="af-fn"></span></p>
    <p>Déplacez les points <b class="c-sec">A</b> et <b class="c-sec">B</b> sur la courbe. La <b class="c-sec">corde</b> (AB) a pour pente le taux d'accroissement (<i>f</i>(<i>b</i>) − <i>f</i>(<i>a</i>))/(<i>b</i> − <i>a</i>). La page cherche tous les points <i>c</i> strictement entre <i>a</i> et <i>b</i> où la dérivée prend cette valeur, et y trace la <b class="c-tan">tangente</b>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="af-fig" class="moyen" aria-label="Courbe, corde entre A et B, et tangentes parallèles à la corde"></canvas>
      <div class="side">
        <h5>Entre A et B</h5>
        <dl class="lectures" aria-live="polite">
          <dt>pente de la corde</dt><dd id="af-pente"></dd>
          <dt>points <i>c</i> tels que <i>f</i>′(<i>c</i>) = pente</dt><dd id="af-c"></dd>
          <dt>milieu de [<i>a</i> ; <i>b</i>]</dt><dd id="af-mil"></dd>
        </dl>
        <p class="verdict" id="af-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="af-a"><i>a</i></label><input type="range" id="af-a" step="0.05"><output id="af-av"></output>
      <label for="af-b"><i>b</i></label><input type="range" id="af-b" step="0.05"><output id="af-bv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>L'énoncé et son origine</h4>
    <div class="def"><p>Égalité des accroissements finis. Si <span class="kx">f</span> est continue sur <span class="kx">[a\\,;b]</span> et dérivable sur <span class="kx">]a\\,;b[</span>, alors il existe au moins un réel <span class="kx">c</span> de <span class="kx">]a\\,;b[</span> tel que</p><span class="kx kxd">f(b) - f(a) = f'(c)\\,(b - a).</span></div>
    <p>La démonstration se voit sur la figure : on mesure l'écart vertical entre la courbe et la corde. Cet écart est nul en <i>a</i> et en <i>b</i> ; il atteint donc un maximum ou un minimum en un point intérieur <i>c</i> (ou bien il est constamment nul), et en ce point sa dérivée s'annule, par le théorème de Rolle. Or sa dérivée est <i>f</i>′ moins la pente de la corde.</p>
    <p>Le théorème affirme l'existence de <i>c</i>, sans dire où il se trouve ni combien il y en a. Avec <i>x</i>³ − 3<i>x</i> entre −2 et 2, il y en a deux. Avec <i>x</i>², il n'y en a qu'un, et c'est toujours le milieu : c'est une particularité des trinômes du second degré, non une règle.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Un seul angle suffit à tout faire échouer</h4>
    <p>Choisissez la valeur absolue et placez A et B de part et d'autre de 0. La corde a une pente strictement comprise entre −1 et 1, alors que la dérivée ne prend que les valeurs −1 et 1 : aucune tangente n'est parallèle à la corde. La fonction est continue partout, mais elle n'est pas dérivable en 0, et ce seul point suffit.</p>
    <p>L'usage principal du théorème est une inégalité : si |<i>f</i>′| ≤ <i>M</i> sur l'intervalle, alors |<i>f</i>(<i>b</i>) − <i>f</i>(<i>a</i>)| ≤ <i>M</i>|<i>b</i> − <i>a</i>|. Par exemple |sin <i>b</i> − sin <i>a</i>| ≤ |<i>b</i> − <i>a</i>|, puisque |cos| ≤ 1.</p>
  </div>
</section>
` + suite(
  "Prendre <i>c</i> pour le milieu de [<i>a</i> ; <i>b</i>], ou croire qu'il est unique. Pour <i>x</i>³ − 3<i>x</i> sur [−2 ; 2], la corde a pour pente 1 et l'équation 3<i>c</i>² − 3 = 1 a deux solutions, <i>c</i> = ±2/√3 ≈ ±1,155 ; aucune n'est le milieu 0, où la dérivée vaut −3. L'autre erreur est d'oublier l'hypothèse de dérivabilité en tout point intérieur.",
  "Le chapitre de Maths Sup <a href=\"#cours/ma-09\">Dérivabilité et convexité</a> démontre le théorème de Rolle, l'égalité et l'inégalité des accroissements finis. Dans l'édifice : <a href=\"#ar-deriv.de-rolle\">Théorème de Rolle</a>, <a href=\"#ar-deriv.de-taf\">Égalité des accroissements finis</a> et <a href=\"#ar-deriv.de-iaf\">Inégalité des accroissements finis</a>.",
  "Les bornes <i>a</i> et <i>b</i> avancent par pas de 0,05. La dérivée est donnée par sa formule ; les points <i>c</i> sont obtenus en repérant les changements de signe de <i>f</i>′(<i>x</i>) − pente sur 2 000 points entre <i>a</i> et <i>b</i>, puis par dichotomie, et sont arrondis à 10⁻³. Rien n'est enregistré ni envoyé.");

const FN = [
  { nom: 'x³ − 3x', f: x => x * x * x - 3 * x, d: x => 3 * x * x - 3, vx: [-2.6, 2.6], vy: [-4.5, 4.5], a: -2, b: 2 },
  { nom: 'x²', f: x => x * x, d: x => 2 * x, vx: [-2.6, 2.6], vy: [-1, 6.2], a: -1, b: 2 },
  { nom: 'sin x', f: Math.sin, d: Math.cos, vx: [-7, 7], vy: [-2.4, 2.4], a: -5, b: 4 },
  { nom: '|x|', f: Math.abs, d: x => x > 0 ? 1 : x < 0 ? -1 : NaN, vx: [-2.6, 2.6], vy: [-0.8, 3], a: -1, b: 2, angle: 0 },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, a: -2, b: 2 };
  let V = null, pris = null;
  FN.forEach((F, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = F.nom;
    bt.addEventListener('click', () => { E.fn = i; E.a = F.a; E.b = F.b; S.planifier(); }); q('#af-fn').append(bt); });
  const regler = (k, val) => { const F = FN[E.fn], lo = F.vx[0] + 0.2, hi = F.vx[1] - 0.2; val = borne(Math.round(val * 20) / 20, lo, hi);
    if (k === 'a') E.a = Math.min(val, E.b - 0.1); else E.b = Math.max(val, E.a + 0.1); E.a = Math.round(E.a * 20) / 20; E.b = Math.round(E.b * 20) / 20; };
  q('#af-a').addEventListener('input', e => { regler('a', +e.target.value); S.planifier(); });
  q('#af-b').addEventListener('input', e => { regler('b', +e.target.value); S.planifier(); });
  function racines(F, a, b, m) { const g = x => F.d(x) - m, R = [], N = 2000; let x0 = a + (b - a) / N * 0.5, g0 = g(x0);
    for (let i = 1; i < N; i++) { const x1 = a + (b - a) * (i + 0.5) / N, g1 = g(x1);
      if (isFinite(g0) && isFinite(g1) && (g0 === 0 || g0 * g1 < 0)) { let u = x0, w = x1; if (g0 !== 0) { for (let k = 0; k < 60; k++) { const mi = (u + w) / 2; if (g(u) * g(mi) <= 0) w = mi; else u = mi; } } else w = u;
        const c = (u + w) / 2; if (F.angle === undefined || Math.abs(c - F.angle) > 1e-6) if (!R.length || Math.abs(R[R.length - 1] - c) > 1e-6) R.push(c); }
      x0 = x1; g0 = g1; } return R; }
  function rendre(C) {
    const F = FN[E.fn], { a, b } = E, m = (F.f(b) - F.f(a)) / (b - a);
    for (const k of ['a', 'b']) { const sl = q('#af-' + k); sl.min = F.vx[0] + 0.2; sl.max = F.vx[1] - 0.2; if (Math.abs(+sl.value - E[k]) > 1e-9) sl.value = E[k]; ecrire(q('#af-' + k + 'v'), fr(E[k], 2)); }
    const { ctx, w, h } = toile(q('#af-fig')), v = vue(w, h, F.vx[0], F.vx[1], F.vy[0], F.vy[1]); V = v;
    grille(ctx, v, C, false);
    // si f' − m est identiquement nul (corde confondue avec la courbe), tout point convient
    const tous = [0.2, 0.4, 0.6, 0.8].every(t => Math.abs(F.d(a + t * (b - a)) - m) < 1e-12), R = tous ? [] : racines(F, a, b, m);
    R.forEach(c => droite(ctx, v, c, F.f(c), m, C.vert, 2, [7, 5]));
    courbe(ctx, v, F.f, C.encre, 2.6);
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2.4; trait(ctx, v.X(a), v.Y(F.f(a)), v.X(b), v.Y(F.f(b)));
    R.forEach((c, i) => { pastille(ctx, v.X(c), v.Y(F.f(c)), C.vert, 5); etiquette(ctx, C, R.length > 1 ? 'c' + '₁₂₃₄₅₆'[i] : 'c', v.X(c) + 8, v.Y(F.f(c)) - 12, C.vert, 'left', 13); });
    poignee(ctx, C, v.X(a), v.Y(F.f(a)), C.orange, 'A', false); poignee(ctx, C, v.X(b), v.Y(F.f(b)), C.orange, 'B', false);
    racine.querySelectorAll('#af-fn .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.fn)));
    ecrire(q('#af-pente'), fr(m, 4)); ecrire(q('#af-mil'), fr((a + b) / 2, 3));
    ecrire(q('#af-c'), tous ? 'tous' : R.length ? R.map(c => fr(c, 3)).join(' ; ') : 'aucun');
    ecrire(q('#af-verdict'), tous ? 'Entre A et B, la courbe est un segment : la tangente est parallèle à la corde en tout point.'
      : !R.length ? 'Aucune tangente n\'est parallèle à la corde. Le théorème ne s\'applique pas : la fonction n\'est pas dérivable en 0, qui est entre a et b.'
      : R.length === 1 ? (Math.abs(R[0] - (a + b) / 2) < 5e-4 ? (E.fn === 1 ? 'Un seul point c, et c\'est le milieu : c\'est toujours le cas pour un trinôme du second degré.' : 'Un seul point c, qui se trouve ici être le milieu.') : 'Un seul point c convient ici, et ce n\'est pas le milieu de [a ; b].')
      : `${R.length} points conviennent : le théorème garantit qu'il en existe au moins un, pas qu'il est unique.`);
  }
  const S = scene(racine, rendre);
  glisser(q('#af-fig'), (p, phase) => { if (!V) return; const x = V.ix(p.x); if (phase === 'debut') pris = Math.abs(x - E.a) <= Math.abs(x - E.b) ? 'a' : 'b';
    const e = Math.round(x * 2) / 2; regler(pris, Math.abs(x - e) < 0.07 ? e : x); S.planifier(); });
  return S.arreter;
}
