// Exploration « Racines et coefficients » (rubrique Activités, MEMO_atlas_activites.md §130).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, courbe, poignee, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Première, Maths Sup · Polynômes</p>
  <h3>Racines et coefficients</h3>
  <p class="lede">Connaître les racines d'un polynôme, c'est connaître ses coefficients, et la réciproque est presque vraie : la somme et le produit des racines se lisent sur les coefficients sans résoudre aucune équation.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Des racines aux coefficients</h4>
    <p>Déplacez les <b class="c-sec">racines</b> sur l'axe, ou réglez-les avec les curseurs. La page développe le produit des facteurs ${K('(x - r_i)')} et écrit les coefficients. Choisissez le degré : <span class="chips" id="rc2-deg"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="rc2-fig" class="moyen" aria-label="Courbe du polynôme et ses racines sur l'axe des abscisses"></canvas>
      <div class="side">
        <h5>Le polynôme</h5>
        <p class="verdict" id="rc2-fact" style="font-family:var(--f-mono);font-size:.84rem"></p>
        <p class="verdict" id="rc2-dev" style="font-family:var(--f-mono);font-size:.84rem"></p>
        <dl class="lectures" aria-live="polite">
          <dt>somme des racines</dt><dd id="rc2-s1"></dd>
          <dt id="rc2-l2">somme des produits deux à deux</dt><dd id="rc2-s2"></dd>
          <dt>produit des racines</dt><dd id="rc2-s3"></dd>
        </dl>
      </div>
    </div>
    <div class="reglages">
      <label for="rc2-r1"><i>r</i><sub>1</sub></label><input type="range" id="rc2-r1" min="-4" max="4" step="0.05"><output id="rc2-r1v"></output>
      <label for="rc2-r2"><i>r</i><sub>2</sub></label><input type="range" id="rc2-r2" min="-4" max="4" step="0.05"><output id="rc2-r2v"></output>
      <label for="rc2-r3" id="rc2-r3l"><i>r</i><sub>3</sub></label><input type="range" id="rc2-r3" min="-4" max="4" step="0.05"><output id="rc2-r3v"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Les relations</h4>
    <div class="def"><p>Si ${K('x^2 + bx + c = (x - r_1)(x - r_2)')}, alors</p>${KD('r_1 + r_2 = -b, \\qquad r_1 r_2 = c.')}<p>Si ${K('x^3 + bx^2 + cx + d = (x - r_1)(x - r_2)(x - r_3)')}, alors</p>${KD('r_1 + r_2 + r_3 = -b, \\qquad r_1 r_2 + r_1 r_3 + r_2 r_3 = c, \\qquad r_1 r_2 r_3 = -d.')}</div>
    <p>La démonstration est un développement : on multiplie les facteurs et l'on identifie les coefficients, deux polynômes égaux ayant les mêmes coefficients. Les signes alternent : le coefficient qui suit le terme dominant est l'<em>opposé</em> de la somme des racines. Quand le coefficient dominant n'est pas 1 mais ${K('a')}, on divise d'abord par ${K('a')} : pour ${K('ax^2 + bx + c')}, la somme vaut ${K('-b/a')} et le produit ${K('c/a')}.</p>
    <p>Faites glisser une racine sur une autre : la courbe devient tangente à l'axe, la racine est double, et les relations restent vraies à condition de la compter deux fois.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Deux nombres dont on connaît la somme et le produit</h4>
    <p>Dans l'autre sens : deux nombres de somme ${K('S')} et de produit ${K('P')} sont les racines de ${K('x^2 - Sx + P')}. Ils existent, parmi les réels, si et seulement si ${K('S^2 - 4P \\geqslant 0')}.</p>
  </div>
  <div class="fig">
    <div class="reglages">
      <label for="rc2-S">somme <i>S</i></label><input type="range" id="rc2-S" min="-10" max="10" step="0.05" value="5"><output id="rc2-Sv"></output>
      <label for="rc2-P">produit <i>P</i></label><input type="range" id="rc2-P" min="-12" max="12" step="0.05" value="6"><output id="rc2-Pv"></output>
    </div>
    <p class="verdict" id="rc2-sp" aria-live="polite" style="padding:4px 16px 14px;margin:0"></p>
  </div>
</section>
` + suite(
  "Oublier le signe : pour <i>x</i>² + <i>bx</i> + <i>c</i>, la somme des racines est −<i>b</i>, et non <i>b</i>. Avec les racines 2 et 3, le polynôme est <i>x</i>² − 5<i>x</i> + 6, de sorte que <i>b</i> = −5 et la somme vaut bien 5. La seconde erreur est d'appliquer ces formules sans avoir divisé par le coefficient dominant : pour 2<i>x</i>² − 10<i>x</i> + 12, la somme est 10/2 = 5 et le produit 12/2 = 6.",
  "Le chapitre de Première <a href=\"#cours/p-01\">Polynôme du second degré</a> établit la somme et le produit des racines d'un trinôme, et celui de Maths Sup <a href=\"#cours/ma-13\">Polynômes et fractions rationnelles</a> généralise à tout degré. Dans l'édifice : <a href=\"#z-polynomes.pol-racines\">Racines et multiplicités</a>.",
  "Les racines avancent par pas de 0,05 et sont traitées en vingtièmes entiers : les coefficients, sommes et produits sont calculés en entiers puis divisés par 20, 400 ou 8 000, donc exacts. Pour la troisième partie, le discriminant <i>S</i>² − 4<i>P</i> est lui aussi calculé exactement ; seules les racines carrées sont arrondies, à 10⁻⁴. Rien n'est enregistré ni envoyé.");

const dec = (num, den) => { const v = num / den; let d = 0; while (d < 6 && Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) > 1e-9) d++; return frc(v, d); };
const terme = (num, den, x, premier) => { if (num === 0) return ''; const a = Math.abs(num), v = dec(a, den); return (num < 0 ? ' − ' : premier ? '' : ' + ') + (v === '1' && x ? '' : v) + x; };

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { deg: 3, r: [-2, 1, 3], S: 5, P: 6 };
  let V = null, pris = -1;
  for (const [nom, d] of [['degré 2', 2], ['degré 3', 3]]) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = nom; b.dataset.d = d;
    b.addEventListener('click', () => { E.deg = d; S.planifier(); }); q('#rc2-deg').append(b); }
  for (const i of [0, 1, 2]) q('#rc2-r' + (i + 1)).addEventListener('input', e => { E.r[i] = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  q('#rc2-S').addEventListener('input', e => { E.S = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  q('#rc2-P').addEventListener('input', e => { E.P = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  function rendre(C) {
    const n = E.deg, R = E.r.slice(0, n), I = R.map(x => Math.round(x * 20));
    const s1 = I.reduce((a, b) => a + b, 0), s2 = n === 3 ? I[0] * I[1] + I[0] * I[2] + I[1] * I[2] : I[0] * I[1], s3 = n === 3 ? I[0] * I[1] * I[2] : null;
    const P = x => R.reduce((p, r) => p * (x - r), 1);
    const { ctx, w, h } = toile(q('#rc2-fig')), v = vue(w, h, -4.6, 4.6, n === 3 ? -14 : -7, n === 3 ? 14 : 12); V = v;
    grille(ctx, v, C, false); courbe(ctx, v, P, C.encre, 2.6);
    R.forEach((r, i) => poignee(ctx, C, v.X(r), v.Y(0), C.orange, 'r' + '₁₂₃'[i], i % 2 === 1));
    racine.querySelectorAll('#rc2-deg .chip').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.d === n)));
    for (const i of [0, 1, 2]) { const sl = q('#rc2-r' + (i + 1)); if (Math.abs(+sl.value - E.r[i]) > 1e-9) sl.value = E.r[i]; ecrire(q('#rc2-r' + (i + 1) + 'v'), fr(E.r[i], 2)); const cache = i === 2 && n === 2; sl.hidden = cache; q('#rc2-r3l').hidden = n === 2; q('#rc2-r3v').hidden = n === 2; }
    ecrire(q('#rc2-fact'), 'P(x) = ' + R.map(r => r === 0 ? 'x' : `(x ${r < 0 ? '+' : '−'} ${frc(Math.abs(r), 2)})`).join(''));
    ecrire(q('#rc2-dev'), '     = ' + (n === 3 ? 'x³' + terme(-s1, 20, 'x²') + terme(s2, 400, 'x') + terme(-s3, 8000, '') : 'x²' + terme(-s1, 20, 'x') + terme(s2, 400, '')));
    ecrire(q('#rc2-s1'), dec(s1, 20)); ecrire(q('#rc2-l2'), n === 3 ? 'somme des produits deux à deux' : 'produit des racines'); ecrire(q('#rc2-s2'), dec(s2, 400));
    q('#rc2-s3').hidden = n === 2; q('#rc2-s3').previousElementSibling.hidden = n === 2; if (n === 3) ecrire(q('#rc2-s3'), dec(s3, 8000));
    // somme et produit
    const Si = Math.round(E.S * 20), Pi = Math.round(E.P * 20), disc = Si * Si - 80 * Pi;   // (S² − 4P) × 400
    ecrire(q('#rc2-Sv'), fr(E.S, 2)); ecrire(q('#rc2-Pv'), fr(E.P, 2));
    const poly = 'x²' + terme(-Si, 20, 'x') + terme(Pi, 20, '');
    ecrire(q('#rc2-sp'), `Les deux nombres sont les racines de ${poly}. Ici S² − 4P = ${dec(disc, 400)} : ` + (disc < 0 ? 'c\'est négatif, aucun couple de réels n\'a cette somme et ce produit.' : disc === 0 ? `les deux nombres sont égaux à ${dec(Si, 40)}.` : (() => { const rc = Math.sqrt(disc), ex = Number.isInteger(rc); return `les deux nombres sont ${ex ? dec(Si - rc, 40) : '≈ ' + fr((Si - rc) / 40, 4)} et ${ex ? dec(Si + rc, 40) : '≈ ' + fr((Si + rc) / 40, 4)}.`; })()));
  }
  const S = scene(racine, rendre);
  glisser(q('#rc2-fig'), (p, phase) => { if (!V) return; const x = V.ix(p.x);
    if (phase === 'debut') { const d = E.r.slice(0, E.deg).map(r => Math.abs(r - x)); pris = d.indexOf(Math.min(...d)); }
    const e = Math.round(x * 2) / 2; E.r[pris] = borne(Math.round((Math.abs(x - e) < 0.07 ? e : x) * 20) / 20, -4, 4); S.planifier(); });
  return S.arreter;
}
