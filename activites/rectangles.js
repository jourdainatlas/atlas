// Exploration « L'intégrale par les rectangles » (rubrique Activités, MEMO_atlas_activites.md §127).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, courbe, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Intégration</p>
  <h3>L'intégrale par les rectangles</h3>
  <p class="lede">Pour mesurer l'aire sous une courbe, on la remplace par des rectangles de plus en plus étroits. Toutes les façons de choisir leur hauteur mènent à la même limite, l'intégrale ; mais elles n'y vont pas à la même vitesse, et c'est ce que l'on mesure ici.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Découper, additionner</h4>
    <p>Choisissez une fonction : <span class="chips" id="rc-fn"></span></p>
    <p>L'intervalle est découpé en <i>n</i> parts égales. Sur chaque part, on dresse un rectangle dont la hauteur est la valeur de la fonction à gauche, à droite ou au milieu ; ou bien un trapèze, qui joint les deux valeurs des extrémités. Choisissez la méthode : <span class="chips" id="rc-me"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="rc-fig" class="moyen" aria-label="Courbe de la fonction et rectangles ou trapèzes de la méthode choisie"></canvas>
      <div class="side">
        <h5>Pour ce découpage (<span id="rc-nn"></span> parts)</h5>
        <dl class="lectures" aria-live="polite">
          <dt>somme</dt><dd id="rc-somme"></dd>
          <dt>intégrale</dt><dd id="rc-exact"></dd>
          <dt>erreur</dt><dd id="rc-err"></dd>
        </dl>
        <table id="rc-tab" aria-label="Erreur selon le nombre de parts"><thead><tr><th><i>n</i></th><th>erreur</th><th>rapport</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
    <div class="reglages">
      <label for="rc-n">parts <i>n</i></label><input type="range" id="rc-n" min="1" max="200" step="1" value="8"><output id="rc-nv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Encadrer, puis passer à la limite</h4>
    <p>Quand la fonction est croissante, les rectangles « à gauche » restent sous la courbe et les rectangles « à droite » passent au-dessus : l'intégrale est encadrée par les deux sommes. Leur différence se calcule sans rien savoir de l'intégrale : c'est (<i>b</i> − <i>a</i>)(<i>f</i>(<i>b</i>) − <i>f</i>(<i>a</i>))/<i>n</i>, qui tend vers 0. Les deux sommes ont donc la même limite.</p>
    <div class="def"><p>Si <span class="kx">f</span> est continue sur <span class="kx">[a\\,;b]</span> et si <span class="kx">x_k = a + k\\,\\dfrac{b-a}{n}</span>, alors</p><span class="kx kxd">\\frac{b-a}{n}\\,\\sum_{k=0}^{n-1} f(x_k) \\;\\xrightarrow[n \\to +\\infty]{}\\; \\int_a^b f(x)\\,\\mathrm dx.</span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>La vitesse dépend de la méthode</h4>
    <p>Le tableau donne l'erreur pour <i>n</i> = 10, 20, 40, 80, 160, et le rapport d'une ligne à la suivante. Avec les rectangles à gauche ou à droite, doubler <i>n</i> divise l'erreur par 2 environ : elle est de l'ordre de 1/<i>n</i>. Avec le point milieu ou les trapèzes, elle est divisée par 4 : elle est de l'ordre de 1/<i>n</i>². Prendre la hauteur au milieu ne coûte rien de plus, et fait gagner un ordre de grandeur.</p>
    <p>Essayez enfin la racine carrée : sa pente est infinie en 0, les majorations d'erreur, qui supposent la dérivée bornée, ne s'appliquent plus, et les rapports du tableau ne sont plus 2 ni 4.</p>
  </div>
</section>
` + suite(
  "Croire que les rectangles « à gauche » donnent toujours une valeur par défaut. C'est vrai pour une fonction croissante, et c'est l'inverse pour une fonction décroissante : pour 1/<i>x</i> sur [1 ; 2], ce sont eux qui dépassent. Et pour une fonction qui monte puis descend, comme le sinus sur [0 ; π], aucune des deux sommes n'encadre plus rien : par symétrie, elles sont même égales.",
  "Le chapitre de Terminale <a href=\"#cours/t-06\">Calcul intégral</a> définit l'intégrale comme une aire, et celui de Maths Sup <a href=\"#cours/ma-18\">Intégration</a> la construit et démontre la convergence de ces sommes. Dans l'édifice : <a href=\"#ar-riemann.ri-sommes\">Convergence des sommes de Riemann</a>.",
  "Les sommes sont calculées en additionnant les <i>n</i> termes ; l'intégrale exacte vient d'une primitive connue (1/3, ln 2, 2 et 2/3 pour les quatre fonctions). Les erreurs sont affichées avec deux chiffres significatifs. Rien n'est enregistré ni envoyé.");

const FN = [
  { nom: 'x² sur [0 ; 1]', f: x => x * x, a: 0, b: 1, I: 1 / 3, ex: '1/3', y: [-0.08, 1.1] },
  { nom: '1/x sur [1 ; 2]', f: x => 1 / x, a: 1, b: 2, I: Math.LN2, ex: 'ln 2', y: [-0.08, 1.1] },
  { nom: 'sin x sur [0 ; π]', f: Math.sin, a: 0, b: Math.PI, I: 2, ex: '2', y: [-0.08, 1.1] },
  { nom: '√x sur [0 ; 1]', f: Math.sqrt, a: 0, b: 1, I: 2 / 3, ex: '2/3', y: [-0.08, 1.1] },
];
const ME = ['à gauche', 'à droite', 'au milieu', 'trapèzes'];
const somme = (F, n, m) => { const h = (F.b - F.a) / n; let s = 0;
  for (let k = 0; k < n; k++) { const x = F.a + k * h; s += m === 0 ? F.f(x) : m === 1 ? F.f(x + h) : m === 2 ? F.f(x + h / 2) : (F.f(x) + F.f(x + h)) / 2; } return s * h; };
const sci = e => { if (e === 0) return '0'; const a = Math.abs(e), p = Math.floor(Math.log10(a)); if (p >= -3) return (e < 0 ? '−' : '') + fr(a, Math.max(2, 1 - p)); const m = (a / Math.pow(10, p)).toFixed(1).replace('.', ','); return (e < 0 ? '−' : '') + m + ' × 10⁻' + [...String(-p)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join(''); };

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, me: 0, n: 8 };
  const puces = (id, L, cle) => L.forEach((nom, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = nom;
    b.addEventListener('click', () => { E[cle] = i; S.planifier(); }); q(id).append(b); });
  puces('#rc-fn', FN.map(F => F.nom), 'fn'); puces('#rc-me', ME, 'me');
  q('#rc-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  function rendre(C) {
    const F = FN[E.fn], n = E.n, m = E.me, h = (F.b - F.a) / n, L = F.b - F.a;
    const { ctx, w, h: H } = toile(q('#rc-fig')), v = vue(w, H, F.a - 0.06 * L, F.b + 0.06 * L, F.y[0], F.y[1]);
    grille(ctx, v, C, false);
    for (let k = 0; k < n; k++) { const x = F.a + k * h, yg = m === 0 ? F.f(x) : m === 1 ? F.f(x + h) : m === 2 ? F.f(x + h / 2) : F.f(x), yd = m === 3 ? F.f(x + h) : yg;
      ctx.beginPath(); ctx.moveTo(v.X(x), v.Y(0)); ctx.lineTo(v.X(x), v.Y(yg)); ctx.lineTo(v.X(x + h), v.Y(yd)); ctx.lineTo(v.X(x + h), v.Y(0)); ctx.closePath();
      ctx.globalAlpha = .22; ctx.fillStyle = C.bleu; ctx.fill(); ctx.globalAlpha = n > 80 ? .35 : 1; ctx.strokeStyle = C.bleu; ctx.lineWidth = n > 40 ? .6 : 1.2; ctx.stroke(); ctx.globalAlpha = 1; }
    courbe(ctx, v, x => x < F.a || x > F.b ? NaN : F.f(x), C.encre, 2.6);
    racine.querySelectorAll('#rc-fn .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.fn)));
    racine.querySelectorAll('#rc-me .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.me)));
    if (+q('#rc-n').value !== n) q('#rc-n').value = n; ecrire(q('#rc-nv'), String(n)); ecrire(q('#rc-nn'), String(n));
    const s = somme(F, n, m);
    ecrire(q('#rc-somme'), fr(s, 6)); ecrire(q('#rc-exact'), `${F.ex} ≈ ${fr(F.I, 6)}`); ecrire(q('#rc-err'), sci(s - F.I));
    let lignes = '', prec = null;
    for (const N of [10, 20, 40, 80, 160]) { const e = somme(F, N, m) - F.I, nul = Math.abs(e) < 1e-13; lignes += `<tr><td>${N}</td><td>${nul ? '0' : sci(e)}</td><td>${prec === null || nul || Math.abs(prec) < 1e-13 ? '' : fr(prec / e, 2)}</td></tr>`; prec = e; }
    ecrire(q('#rc-tab').tBodies[0], lignes, true);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
