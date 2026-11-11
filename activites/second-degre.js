// Exploration « Le trinôme du second degré » (rubrique Activités, MEMO_atlas_activites.md §120).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, pastille, ecrire, fr, frc, fraction, pgcd } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Première · Polynôme du second degré</p>
  <h3>Le trinôme du second degré</h3>
  <p class="lede">Trois coefficients <span class=kx>a</span>, <span class=kx>b</span>, <span class=kx>c</span>, et une seule courbe : la parabole d'équation <span class=kx>y = ax^{2} + bx + c</span>. Réglez-les un par un et regardez ce que chacun commande : le sommet, les racines, le signe.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Ce que commande chaque coefficient</h4>
    <p>Commencez par <span class=kx>c</span> : la parabole monte ou descend d'un bloc, car <span class=kx>c = f(0)</span> est l'ordonnée du point où elle coupe l'axe vertical. Passez à <span class=kx>a</span> : son signe décide si la parabole est tournée vers le haut ou vers le bas, et sa valeur absolue de son ouverture.</p>
    <p>Le rôle de <span class=kx>b</span> est le moins évident. Cochez « lieu du sommet », puis faites varier <span class=kx>b</span> seul : le sommet glisse le long d'une autre parabole, d'équation <span class=kx>y = -ax^{2} + c</span>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="sd-fig" class="moyen" aria-label="Parabole d'équation y = ax² + bx + c, son sommet, son axe et ses racines"></canvas>
      <div class="side">
        <h5>Le trinôme</h5>
        <ul class="formes" aria-live="polite">
          <li><b>Forme développée</b><span id="sd-dev"></span></li>
          <li><b>Forme canonique</b><span id="sd-can"></span></li>
          <li><b>Forme factorisée</b><span id="sd-fac"></span></li>
        </ul>
        <h5 style="margin-top:6px">Les nombres</h5>
        <dl class="lectures">
          <dt>Δ = <i>b</i>² − 4<i>ac</i></dt><dd id="sd-delta"></dd>
          <dt>sommet S</dt><dd id="sd-sommet"></dd>
          <dt>racines</dt><dd id="sd-rac"></dd>
        </dl>
      </div>
    </div>
    <div class="reglages">
      <label for="sd-a"><i>a</i></label><input type="range" id="sd-a" min="-80" max="80" step="1" value="20"><output id="sd-av"></output>
      <label for="sd-b"><i>b</i></label><input type="range" id="sd-b" min="-160" max="160" step="1" value="-40"><output id="sd-bv"></output>
      <label for="sd-c"><i>c</i></label><input type="range" id="sd-c" min="-160" max="160" step="1" value="-60"><output id="sd-cv"></output>
    </div>
    <div class="bar">
      <label><input type="checkbox" id="sd-lieu"> lieu du sommet quand <i>b</i> varie</label>
      <button type="button" id="sd-ex1">Exemple : deux racines</button>
      <button type="button" id="sd-ex2">Racine double</button>
      <button type="button" id="sd-ex3">Aucune racine réelle</button>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Le sommet et la forme canonique</h4>
    <p>La parabole a un axe de symétrie vertical, d'équation <span class=kx>x = \\alpha</span> avec <span class=kx>\\alpha = -b/(2a)</span>. Son sommet est le point S(α ; β), où <span class=kx>\\beta = f(\\alpha )</span>. Tout le trinôme se réécrit alors autour de ce point : <span class=kx>f(x) = a(x - \\alpha )^{2} + \\beta</span>. C'est la <b>forme canonique</b>, affichée à côté de la figure.</p>
    <p>Elle se lit d'un coup d'œil : le carré <span class=kx>(x - \\alpha )^{2}</span> est positif ou nul et ne s'annule qu'en α, donc β est le minimum de <span class=kx>f</span> si <span class=kx>a > 0</span>, son maximum si <span class=kx>a < 0</span>.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le discriminant décide</h4>
    <p>Le calcul donne <span class=kx>\\beta = -\\Delta /(4a)</span>, où <span class=kx>\\Delta = b^{2} - 4ac</span> est le <b>discriminant</b>. Le signe de Δ dit donc de quel côté de l'axe horizontal se trouve le sommet, comparé au sens d'ouverture de la parabole, c'est-à-dire si la courbe coupe l'axe.</p>
    <p id="sd-verdict" aria-live="polite"></p>
    <div class="def"><p>Si <span class="kx">\\Delta > 0</span>, le trinôme a deux racines réelles :</p><span class="kx kxd">x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a}, \\qquad x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}.</span><p>Si <span class="kx">\\Delta = 0</span>, il a une seule racine, <span class="kx">-\\dfrac{b}{2a}</span>, dite double. Si <span class="kx">\\Delta < 0</span>, il n'a aucune racine réelle.</p></div>
    <p>Essayez les trois exemples proposés sous la figure, puis fabriquez les vôtres : en partant de deux racines, augmentez <span class=kx>c</span> (si <span class=kx>a > 0</span>) jusqu'à ce que les deux racines se rejoignent, puis disparaissent.</p>
  </div>
</section>
` + suite(
  "Deux erreurs reviennent sans cesse. La première est d'oublier le signe dans <span class=kx>\\alpha = -b/(2a)</span> : pour <span class=kx>f(x) = x^{2} - 2x - 3</span>, l'axe est <span class=kx>x = 1</span>, et non <span class=kx>x = -1</span>. La seconde est de lire Δ &lt; 0 comme « le trinôme est négatif » : Δ &lt; 0 signifie seulement qu'il ne s'annule pas, et il garde alors partout le signe de <span class=kx>a</span>.",
  "Le chapitre de Première <a href=\"#cours/p-01\">Polynôme du second degré</a> établit la forme canonique, les formules des racines et le tableau de signes. Quand Δ &lt; 0, les racines existent encore, mais dans ℂ : l'édifice traite ce cas dans la fiche <a href=\"#c.c-racines-carrees\">Racines carrées et équations du second degré</a>.",
  "Les coefficients avancent par pas de 0,05 ; Δ, α et β sont calculés en nombres entiers (en vingtièmes), donc sans erreur d'arrondi. Ils sont écrits en fractions quand le dénominateur ne dépasse pas 20, et sinon en valeurs approchées à 10⁻³, précédées du signe ≈ ; les racines sont exactes dès que Δ est le carré d'un rationnel. Rien n'est enregistré ni envoyé.");

// Monôme « k·x^n » d'une somme : signe séparé, coefficient 1 omis.
const terme = (k, x, premier) => !k ? '' : (k < 0 ? (premier ? '−' : ' − ') : (premier ? '' : ' + ')) + (Math.abs(k) === 1 && x ? '' : frc(Math.abs(k))) + x;
// Rationnel p/q : fraction si son dénominateur réduit ne dépasse pas 20, valeur approchée sinon. abs : sans le signe.
function rat(p, q, abs) {
  if (q < 0) { p = -p; q = -q; } if (abs) p = Math.abs(p);
  const g = pgcd(p, q) || 1, exact = q / g <= 20;
  return { exact, txt: exact ? fraction(p, q) : fr(p / q, 3), signe: Math.sign(p) };
}
const estCarre = n => { const r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; };

export function monter(racine) {
  const q = s => racine.querySelector(s);
  // A, B, K : coefficients en vingtièmes (entiers), pour des calculs exacts : a = A/20, b = B/20, c = K/20.
  const U = 20, E = { A: 20, B: -40, K: -60, lieu: false };
  const lier = (id, cle) => q(id).addEventListener('input', e => {
    let v = +e.target.value;
    if (cle === 'A' && v === 0) v = E.A > 0 ? -1 : 1;   // a = 0 n'est pas un trinôme : on saute par-dessus
    E[cle] = v; S.planifier();
  });
  lier('#sd-a', 'A'); lier('#sd-b', 'B'); lier('#sd-c', 'K');
  q('#sd-lieu').addEventListener('change', e => { E.lieu = e.target.checked; S.planifier(); });
  const exemple = (id, A, B, K) => q(id).addEventListener('click', () => { E.A = A; E.B = B; E.K = K; S.planifier(); });
  exemple('#sd-ex1', 20, -40, -60); exemple('#sd-ex2', 20, -80, 80); exemple('#sd-ex3', 10, 20, 50);

  function rendre(C) {
    const { A, B, K } = E, a = A / U, b = B / U, c = K / U, f = x => a * x * x + b * x + c;
    const DD = B * B - 4 * A * K, delta = DD / (U * U);     // Δ = DD/400
    const alpha = -B / (2 * A), beta = -DD / (4 * U * A);    // α = −B/(2A), β = −Δ/(4a) = −DD/(80A)
    const r = DD >= 0 ? estCarre(DD) : null;                 // √DD entier : racines rationnelles
    const { ctx, w, h } = toile(q('#sd-fig')), v = vue(w, h, -6.4, 6.4, -9, 9);
    grille(ctx, v, C, false);
    if (E.lieu) { courbe(ctx, v, x => -a * x * x + c, C.violet, 1.6, [6, 5]); }
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1.2; ctx.setLineDash([5, 5]); trait(ctx, v.X(alpha), 0, v.X(alpha), h); ctx.setLineDash([]);
    courbe(ctx, v, f, C.encre, 2.8);
    pastille(ctx, v.X(0), v.Y(c), C.bleu, 5);
    if (Math.abs(c) <= 8.6) etiquette(ctx, C, 'c', v.X(0) + (alpha > 0 ? -12 : 12), v.Y(c) + (a > 0 ? 12 : -12), C.bleu, 'center', 13);
    if (DD >= 0) for (const s of DD === 0 ? [0] : [-1, 1]) { const x = (-B + s * Math.sqrt(DD)) / (2 * A); if (x > v.x0 && x < v.x1) { pastille(ctx, v.X(x), v.Y(0), C.vert, 6); } }
    if (Math.abs(beta) < 8.8 && Math.abs(alpha) < 6.2) { pastille(ctx, v.X(alpha), v.Y(beta), C.orange, 6); etiquette(ctx, C, 'S', v.X(alpha) + 13, v.Y(beta) + (a > 0 ? 13 : -13), C.orange, 'center', 14); }
    // textes
    for (const [id, val] of [['#sd-a', A], ['#sd-b', B], ['#sd-c', K]]) { if (+q(id).value !== val) q(id).value = val; ecrire(q(id + 'v'), fr(val / U, 2)); }
    if (q('#sd-lieu').checked !== E.lieu) q('#sd-lieu').checked = E.lieu;
    ecrire(q('#sd-dev'), 'f(x) = ' + terme(a, 'x²', true) + terme(b, 'x', false) + terme(c, '', false));
    const ka = a === 1 ? '' : a === -1 ? '−' : frc(a);
    const xm = (p, d) => { const R = rat(p, d, true), sg = Math.sign(p) * Math.sign(d); return { exact: R.exact, txt: sg === 0 ? 'x' : sg > 0 ? 'x − ' + R.txt : 'x + ' + R.txt }; };   // « x − p/d »
    const Xa = xm(-B, 2 * A), Rb = rat(DD, 4 * U * A, true), eg = ok => ok ? ' = ' : ' ≈ ';
    ecrire(q('#sd-can'), 'f(x)' + eg(Xa.exact && Rb.exact) + ka + '(' + Xa.txt + ')²' + (DD === 0 ? '' : (beta > 0 ? ' + ' : ' − ') + Rb.txt));
    let fac, rac;
    if (DD < 0) { fac = 'aucune dans ℝ'; rac = 'aucune racine réelle'; }
    else if (DD === 0) { fac = 'f(x)' + eg(Xa.exact) + ka + '(' + Xa.txt + ')²'; const R0 = rat(-B, 2 * A); rac = 'x₀' + eg(R0.exact) + R0.txt + ' (double)'; }
    else if (r !== null) {
      const p1 = -B - r, p2 = -B + r, d = 2 * A, [u, w2] = A > 0 ? [p1, p2] : [p2, p1], X1 = xm(u, d), X2 = xm(w2, d), R1 = rat(u, d), R2 = rat(w2, d);   // u/d < w2/d
      fac = 'f(x)' + eg(X1.exact && X2.exact) + ka + '(' + X1.txt + ')(' + X2.txt + ')';
      rac = 'x₁' + eg(R1.exact) + R1.txt + ' ; x₂' + eg(R2.exact) + R2.txt;
    } else {
      const x1 = (-B - Math.sqrt(DD)) / (2 * A), x2 = (-B + Math.sqrt(DD)) / (2 * A), lo = Math.min(x1, x2), hi = Math.max(x1, x2);
      fac = 'f(x) = ' + ka + '(x − x₁)(x − x₂)';
      rac = '(−b ± √Δ)/(2a), soit x₁ ≈ ' + fr(lo, 3) + ' et x₂ ≈ ' + fr(hi, 3);
    }
    ecrire(q('#sd-fac'), fac); ecrire(q('#sd-rac'), rac);
    ecrire(q('#sd-delta'), frc(delta, 4));
    const Ra = rat(-B, 2 * A), Rbs = rat(-DD, 4 * U * A);
    ecrire(q('#sd-sommet'), 'α' + eg(Ra.exact) + Ra.txt + ' ; β' + eg(Rbs.exact) + Rbs.txt);
    const D4 = DD;
    const sens = a > 0 ? 'tournée vers le haut' : 'tournée vers le bas', cote = beta > 0 ? 'au-dessus' : 'au-dessous';
    ecrire(q('#sd-verdict'), D4 > 0
      ? `Ici Δ = ${frc(delta, 4)} est strictement positif : le sommet est ${cote} de l'axe et la parabole, ${sens}, le traverse deux fois. Le trinôme est du signe de a à l'extérieur des racines, du signe contraire entre elles.`
      : D4 === 0 ? `Ici Δ = 0 : le sommet est sur l'axe, que la parabole touche sans le traverser. Le trinôme s'annule en un seul point et il est partout ailleurs du signe de a.`
      : `Ici Δ = ${frc(delta, 4)} est strictement négatif : le sommet est ${cote} de l'axe et la parabole, ${sens}, s'en éloigne. Le trinôme ne s'annule pas et il est partout du signe de a, c'est-à-dire strictement ${a > 0 ? 'positif' : 'négatif'}.`);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
