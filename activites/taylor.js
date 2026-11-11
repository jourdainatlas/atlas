// Exploration « Les polynômes de Taylor » (rubrique Activités, MEMO_atlas_activites.md §128).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, pastille, glisser, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Maths Sup · Développements limités</p>
  <h3>Les polynômes de Taylor</h3>
  <p class="lede">Près de 0, une fonction régulière ressemble à un polynôme, et d'autant mieux que l'on monte en degré. Mais « près de 0 » est le mot important : à distance, monter en degré peut améliorer l'approximation partout, nulle part, ou seulement dans un intervalle.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Monter en degré</h4>
    <p>Choisissez une fonction : <span class="chips" id="ty-fn"></span></p>
    <p>La <b>courbe</b> de la fonction est en trait épais, celle de son <b class="c-sec">polynôme de Taylor</b> d'ordre <i>n</i> en 0 est en orange. Augmentez <i>n</i>, et déplacez le point <i>x</i> pour lire l'écart entre les deux.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ty-fig" class="moyen" aria-label="Courbe de la fonction et de son polynôme de Taylor d'ordre n en 0"></canvas>
      <div class="side">
        <h5>Le polynôme</h5>
        <p class="verdict" id="ty-poly" style="font-family:var(--f-mono);font-size:.82rem"></p>
        <dl class="lectures" aria-live="polite">
          <dt><i>f</i>(<i>x</i>)</dt><dd id="ty-f"></dd>
          <dt><i>P<sub>n</sub></i>(<i>x</i>)</dt><dd id="ty-p"></dd>
          <dt>écart</dt><dd id="ty-e"></dd>
        </dl>
        <p class="verdict" id="ty-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="ty-n">ordre <i>n</i></label><input type="range" id="ty-n" min="0" max="15" step="1" value="3"><output id="ty-nv"></output>
      <label for="ty-x"><i>x</i></label><input type="range" id="ty-x" step="0.01"><output id="ty-xv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que dit le théorème, et ce qu'il ne dit pas</h4>
    <div class="def"><p>Formule de Taylor-Young. Si <span class="kx">f</span> est <span class="kx">n</span> fois dérivable en 0, alors, quand <span class="kx">x</span> tend vers 0 :</p><span class="kx kxd">\\begin{aligned} f(x) = {} & f(0) + f'(0)\\,x + \\frac{f''(0)}{2!}\\,x^2 + \\cdots \\\\[2pt] & {} + \\frac{f^{(n)}(0)}{n!}\\,x^n + o(x^n). \\end{aligned}</span></div>
    <p>L'énoncé est <b>local</b> : il compare l'écart à <i>x<sup>n</sup></i> quand <i>x</i> tend vers 0, à <i>n</i> fixé. Il ne dit rien de ce qui se passe en un point <i>x</i> donné quand <i>n</i> grandit. Pour le sinus, le cosinus et l'exponentielle, tout se passe bien : en tout point, l'écart tend vers 0. Pour ln(1 + <i>x</i>) et 1/(1 − <i>x</i>), il ne tend vers 0 que si <i>x</i> reste dans un intervalle autour de 0 : placez <i>x</i> en 1,5 pour le logarithme et montez en degré, les polynômes s'écartent de plus en plus violemment.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Une fonction que ses polynômes ignorent</h4>
    <p>Choisissez la dernière fonction : elle vaut exp(−1/<i>x</i>²) pour <i>x</i> ≠ 0, et 0 en 0. Elle est indéfiniment dérivable et toutes ses dérivées en 0 sont nulles : elle est si plate en 0 que tous ses polynômes de Taylor sont le polynôme nul. Pourtant elle n'est nulle qu'en 0. Deux fonctions différentes peuvent donc avoir les mêmes polynômes de Taylor à tous les ordres.</p>
  </div>
</section>
` + suite(
  "Utiliser un développement limité loin du point où il est écrit, ou croire qu'un ordre plus élevé donne toujours une meilleure valeur. Pour ln(1 + <i>x</i>) en <i>x</i> = 1,5, l'ordre 2 donne 0,375 pour une valeur exacte d'environ 0,916, et l'ordre 10 donne environ −2,40 : c'est pire. Un développement limité est un énoncé sur une limite en 0, pas une formule de calcul valable partout.",
  "Le chapitre de Maths Sup <a href=\"#cours/ma-10\">Analyse asymptotique et développements limités</a> établit ces formules et leurs règles de calcul. Dans l'édifice : <a href=\"#ar-asymptotique.as-taylor-young\">Formule de Taylor-Young à une variable</a>, <a href=\"#ar-deriv.de-taylor\">Dérivées successives et formule de Taylor-Lagrange</a>, qui majore l'écart, et <a href=\"#ar-exp.ex-plateau\">Une fonction indéfiniment dérivable, plate en 0</a>.",
  "Les coefficients des polynômes sont connus en forme close pour chaque fonction (inverses de factorielles, signes alternés, coefficients binomiaux de 1/2) et le polynôme est évalué par le schéma de Horner. Les valeurs sont arrondies à 10⁻⁶. Rien n'est enregistré ni envoyé.");

const fact = k => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
const FN = [
  { nom: 'sin x', f: Math.sin, c: k => k % 2 ? (k % 4 === 1 ? 1 : -1) / fact(k) : 0, vx: [-7, 7], vy: [-2.6, 2.6], x: 3, R: Infinity },
  { nom: 'cos x', f: Math.cos, c: k => k % 2 ? 0 : (k % 4 === 0 ? 1 : -1) / fact(k), vx: [-7, 7], vy: [-2.6, 2.6], x: 3, R: Infinity },
  { nom: 'exp x', f: Math.exp, c: k => 1 / fact(k), vx: [-4, 3], vy: [-2, 10], x: 2, R: Infinity },
  { nom: 'ln(1 + x)', f: x => x > -1 ? Math.log(1 + x) : NaN, c: k => k ? (k % 2 ? 1 : -1) / k : 0, vx: [-1.4, 2.6], vy: [-3.2, 2.4], x: 1.5, R: 1, coup: [-1] },
  { nom: '1/(1 − x)', f: x => 1 / (1 - x), c: () => 1, vx: [-2.2, 2.2], vy: [-4, 6], x: 0.5, R: 1, coup: [1] },
  { nom: '√(1 + x)', f: x => x >= -1 ? Math.sqrt(1 + x) : NaN, c: k => { let b = 1; for (let i = 0; i < k; i++) b *= (0.5 - i) / (i + 1); return b; }, vx: [-1.4, 3], vy: [-0.6, 2.6], x: 1.5, R: 1, coup: [] },
  { nom: 'exp(−1/x²)', f: x => x === 0 ? 0 : Math.exp(-1 / (x * x)), c: () => 0, vx: [-3, 3], vy: [-0.3, 1.2], x: 1, R: 0, plat: true },
];
// Écrit le monôme c·x^k, c étant un rationnel retrouvé par fractions continues (dénominateur borné).
const rationnel = a => { let h0 = 0, h1 = 1, k0 = 1, k1 = 0, x = a; for (let i = 0; i < 40; i++) { const t = Math.floor(x); [h0, h1] = [h1, t * h1 + h0]; [k0, k1] = [k1, t * k1 + k0]; if (Math.abs(a - h1 / k1) < 1e-15 * Math.max(1, a) || k1 > 1e14) break; x = 1 / (x - t); if (!isFinite(x)) break; } return [h1, k1]; };
const mono = (c, k) => { const [nu, de] = rationnel(Math.abs(c)); const x = k ? 'x' + sup(k) : '';
  return (c < 0 ? ' − ' : ' + ') + (k === 0 ? String(nu) : (nu === 1 ? '' : nu) + x) + (de === 1 ? '' : '/' + de); };
const sup = k => k === 1 ? '' : [...String(k)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, n: 3, x: 3 };
  let V = null;
  FN.forEach((F, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = F.nom;
    b.addEventListener('click', () => { E.fn = i; E.x = F.x; S.planifier(); }); q('#ty-fn').append(b); });
  q('#ty-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#ty-x').addEventListener('input', e => { E.x = Math.round(+e.target.value * 100) / 100; S.planifier(); });
  function rendre(C) {
    const F = FN[E.fn], n = E.n, co = []; for (let k = 0; k <= n; k++) co.push(F.c(k));
    const P = x => { let s = 0; for (let k = n; k >= 0; k--) s = s * x + co[k]; return s; };
    const sl = q('#ty-x'); sl.min = F.vx[0] + 0.1; sl.max = F.vx[1] - 0.1; E.x = borne(E.x, +sl.min, +sl.max);
    const { ctx, w, h } = toile(q('#ty-fig')), v = vue(w, h, F.vx[0], F.vx[1], F.vy[0], F.vy[1]); V = v;
    grille(ctx, v, C, false);
    if (isFinite(F.R) && F.R > 0) { ctx.globalAlpha = .1; ctx.fillStyle = C.vert; ctx.fillRect(v.X(-F.R), 0, v.X(F.R) - v.X(-F.R), h); ctx.globalAlpha = 1; }
    courbe(ctx, v, F.f, C.encre, 2.8, null, F.coup || []);
    courbe(ctx, v, P, C.orange, 2.2);
    const fx = F.f(E.x), px = P(E.x), cy = y => Math.max(-30, Math.min(h + 30, v.Y(y)));
    ctx.strokeStyle = C.bleu; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); trait(ctx, v.X(E.x), 0, v.X(E.x), h); ctx.setLineDash([]);
    if (isFinite(fx)) { ctx.strokeStyle = C.bleu; ctx.lineWidth = 3; trait(ctx, v.X(E.x), cy(fx), v.X(E.x), cy(px)); pastille(ctx, v.X(E.x), cy(fx), C.encre, 4.5); }
    pastille(ctx, v.X(E.x), cy(px), C.orange, 4.5); etiquette(ctx, C, 'x', v.X(E.x) + 8, 12, C.bleu, 'left', 12);
    racine.querySelectorAll('#ty-fn .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.fn)));
    if (+q('#ty-n').value !== n) q('#ty-n').value = n; ecrire(q('#ty-nv'), String(n));
    if (Math.abs(+sl.value - E.x) > 1e-9) sl.value = E.x; ecrire(q('#ty-xv'), fr(E.x, 2));
    let txt = ''; co.forEach((c, k) => { if (Math.abs(c) > 0) txt += mono(c, k); }); txt = txt === '' ? '0' : txt.replace(/^ \+ /, '').replace(/^ − /, '−');
    ecrire(q('#ty-poly'), `P${[...String(n)].map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join('')}(x) = ${txt.length > 150 ? txt.slice(0, txt.lastIndexOf(' ', 140)).replace(/ [+−]$/, '') + ' + …' : txt}`);
    ecrire(q('#ty-f'), isFinite(fx) ? fr(fx, 6) : 'non défini'); ecrire(q('#ty-p'), Math.abs(px) > 1e7 ? px.toExponential(2).replace('.', ',').replace('e+', ' × 10^') : fr(px, 6));
    const ec = px - fx; ecrire(q('#ty-e'), !isFinite(fx) ? '' : Math.abs(ec) > 1e7 ? ec.toExponential(2).replace('.', ',').replace('e+', ' × 10^') : Math.abs(ec) < 5e-7 ? 'moins de 10⁻⁶' : fr(ec, 6));
    ecrire(q('#ty-verdict'), F.plat ? 'Toutes les dérivées en 0 sont nulles : le polynôme de Taylor est nul à tout ordre, alors que la fonction ne s\'annule qu\'en 0.'
      : !isFinite(fx) ? 'La fonction n\'est pas définie en ce point ; le polynôme, lui, l\'est partout.'
      : F.R === Infinity ? 'Pour cette fonction, l\'écart en un point fixé tend vers 0 quand l\'ordre augmente, quel que soit ce point.'
      : Math.abs(E.x) < 1 ? 'Le point est dans la bande verte, −1 < x < 1 : l\'écart tend vers 0 quand l\'ordre augmente.'
      : (E.x === 1 && E.fn === 3) || (Math.abs(E.x) === 1 && E.fn === 5) ? 'Au bord de la bande, l\'écart tend encore vers 0 pour cette fonction, mais lentement.'
      : 'Le point est hors de la bande verte : quand l\'ordre augmente, l\'écart ne tend pas vers 0 ; il grandit sans limite.');
  }
  const S = scene(racine, rendre);
  glisser(q('#ty-fig'), p => { if (!V) return; E.x = Math.round(V.ix(p.x) * 100) / 100; S.planifier(); });
  return S.arreter;
}
