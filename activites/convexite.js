// Exploration « Convexité : cordes et tangentes » (rubrique Activités, MEMO_atlas_activites.md §129).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, droite, etiquette, poignee, pastille, glisser, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Convexité</p>
  <h3>Convexité : cordes et tangentes</h3>
  <p class="lede">Une fonction convexe a une courbe « en creux » : elle passe sous chacune de ses cordes et au-dessus de chacune de ses tangentes. Ces deux images disent la même chose, et la seconde fournit d'un coup des inégalités que l'on démontrerait péniblement autrement.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Sous la corde, au-dessus de la tangente</h4>
    <p>Choisissez une fonction : <span class="chips" id="cv-fn"></span></p>
    <p>Déplacez les points <b class="c-sec">A</b> et <b class="c-sec">B</b> qui portent la <b class="c-sec">corde</b>, et le point <b class="c-tan">T</b> où est tracée la <b class="c-tan">tangente</b>. La page dit si, entre A et B, la courbe est sous la corde, au-dessus, ou ni l'un ni l'autre, et de quel côté de la tangente elle se trouve sur toute la fenêtre.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="cv-fig" class="moyen" aria-label="Courbe, corde entre A et B, tangente au point T"></canvas>
      <div class="side">
        <h5>Lecture</h5>
        <dl class="lectures" aria-live="polite">
          <dt><i>f</i>″(<i>t</i>)</dt><dd id="cv-f2"></dd>
          <dt>tangente en T</dt><dd id="cv-tan"></dd>
        </dl>
        <p class="verdict" id="cv-corde" aria-live="polite"></p>
        <p class="verdict" id="cv-tang" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="cv-a"><i>a</i></label><input type="range" id="cv-a" step="0.05"><output id="cv-av"></output>
      <label for="cv-b"><i>b</i></label><input type="range" id="cv-b" step="0.05"><output id="cv-bv"></output>
      <label for="cv-t"><i>t</i></label><input type="range" id="cv-t" step="0.05"><output id="cv-tv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La définition et ses traductions</h4>
    <div class="def"><p>Une fonction <span class="kx">f</span> est convexe sur un intervalle <span class="kx">I</span> si, pour tous <span class="kx">a</span> et <span class="kx">b</span> de <span class="kx">I</span> et tout <span class="kx">\\lambda</span> de <span class="kx">[0\\,;1]</span>,</p><span class="kx kxd">f\\bigl(\\lambda a + (1-\\lambda)\\,b\\bigr) \\leqslant \\lambda f(a) + (1-\\lambda)\\,f(b),</span><p>c'est-à-dire si la courbe est sous ses cordes. Elle est concave si <span class="kx">-f</span> est convexe.</p></div>
    <p>Pour une fonction deux fois dérivable, trois propriétés sont équivalentes : <i>f</i> est convexe ; <i>f</i>′ est croissante ; <i>f</i>″ est positive ou nulle. Et dans ce cas, la courbe est au-dessus de toutes ses tangentes. Un <b>point d'inflexion</b> est un point où la courbe traverse sa tangente : la convexité y change de sens.</p>
    <p>Placez T en 0 sur l'exponentielle : la tangente est la droite <i>y</i> = <i>x</i> + 1, et la courbe reste au-dessus. C'est l'inégalité e<sup><i>x</i></sup> ≥ 1 + <i>x</i>, vraie pour tout réel <i>x</i>. Placez T en 1 sur le logarithme, qui est concave : ln <i>x</i> ≤ <i>x</i> − 1 pour tout <i>x</i> &gt; 0.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Inflexion, ou pas</h4>
    <p>Sur <i>x</i>³ − 3<i>x</i>, placez T en 0 : la dérivée seconde s'annule en changeant de signe, la courbe traverse sa tangente, c'est un point d'inflexion. Faites de même sur <i>x</i>⁴ : la dérivée seconde s'annule aussi en 0, mais sans changer de signe, et la courbe reste d'un seul côté de sa tangente. Elle est convexe sur ℝ tout entier.</p>
  </div>
</section>
` + suite(
  "Conclure à un point d'inflexion dès que la dérivée seconde s'annule. Il faut qu'elle s'annule <em>en changeant de signe</em> : pour <i>x</i>⁴, <i>f</i>″(0) = 0 et pourtant la fonction est convexe partout, sans inflexion. L'autre confusion fréquente est de mêler convexité et sens de variation : l'exponentielle est croissante et convexe, le logarithme est croissant et concave.",
  "Le chapitre de Terminale <a href=\"#cours/t-03\">Fonctions numériques</a> introduit la convexité et les points d'inflexion ; celui de Maths Sup <a href=\"#cours/ma-09\">Dérivabilité et convexité</a> démontre les équivalences. Dans l'édifice : <a href=\"#ar-exp.ex-convexite\">Convexité de l'exponentielle</a>.",
  "La dérivée et la dérivée seconde sont données par leurs formules. La position de la courbe par rapport à la corde est décidée par le signe de <i>f</i>″ entre <i>a</i> et <i>b</i>, connu exactement pour chaque fonction (les points où il change sont 0 pour <i>x</i>³ − 3<i>x</i> et les multiples de π pour le sinus) ; sa position par rapport à la tangente est contrôlée sur 600 points de la fenêtre affichée. Rien n'est enregistré ni envoyé.");

// chg : abscisses où f″ change de signe, dans la fenêtre ; s0 : signe de f″ à gauche du premier changement.
const FN = [
  { nom: 'exp x', f: Math.exp, d: Math.exp, d2: Math.exp, vx: [-3, 2.2], vy: [-1, 7], chg: [], s0: 1, a: -1.5, b: 1.5, t: 0 },
  { nom: 'x²', f: x => x * x, d: x => 2 * x, d2: () => 2, vx: [-2.6, 2.6], vy: [-1.5, 6], chg: [], s0: 1, a: -1, b: 2, t: 0.5 },
  { nom: 'ln x', f: x => x > 0 ? Math.log(x) : NaN, d: x => 1 / x, d2: x => -1 / (x * x), vx: [-0.4, 5], vy: [-3, 2.4], chg: [], s0: -1, a: 0.5, b: 4, t: 1, min: 0.1 },
  { nom: 'x³ − 3x', f: x => x * x * x - 3 * x, d: x => 3 * x * x - 3, d2: x => 6 * x, vx: [-2.6, 2.6], vy: [-4.5, 4.5], chg: [0], s0: -1, a: 0.5, b: 2, t: 0 },
  { nom: 'x⁴', f: x => x ** 4, d: x => 4 * x ** 3, d2: x => 12 * x * x, vx: [-1.8, 1.8], vy: [-0.6, 4], chg: [], s0: 1, a: -1, b: 1.2, t: 0 },
  { nom: 'sin x', f: Math.sin, d: Math.cos, d2: x => -Math.sin(x), vx: [-7, 7], vy: [-2.4, 2.4], chg: [-2 * Math.PI, -Math.PI, 0, Math.PI, 2 * Math.PI], s0: 1, a: 0.5, b: 2.5, t: 0 },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, a: -1.5, b: 1.5, t: 0 };
  let V = null, pris = null;
  FN.forEach((F, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = F.nom;
    bt.addEventListener('click', () => { E.fn = i; E.a = F.a; E.b = F.b; E.t = F.t; S.planifier(); }); q('#cv-fn').append(bt); });
  const bornes = F => [Math.max(F.vx[0] + 0.2, F.min || -Infinity), F.vx[1] - 0.2];
  const regler = (k, val) => { const F = FN[E.fn], [lo, hi] = bornes(F); val = borne(Math.round(val * 20) / 20, Math.ceil(lo * 20 - 1e-9) / 20, hi);
    if (k === 'a') E.a = Math.min(val, E.b - 0.1); else if (k === 'b') E.b = Math.max(val, E.a + 0.1); else E.t = val; for (const c of ['a', 'b', 't']) E[c] = Math.round(E[c] * 20) / 20; };
  for (const k of ['a', 'b', 't']) q('#cv-' + k).addEventListener('input', e => { regler(k, +e.target.value); S.planifier(); });
  function rendre(C) {
    const F = FN[E.fn], { a, b, t } = E, [lo, hi] = bornes(F);
    for (const k of ['a', 'b', 't']) { const sl = q('#cv-' + k); sl.min = Math.ceil(lo * 20 - 1e-9) / 20; sl.max = hi; if (Math.abs(+sl.value - E[k]) > 1e-9) sl.value = E[k]; ecrire(q('#cv-' + k + 'v'), fr(E[k], 2)); }
    const { ctx, w, h } = toile(q('#cv-fig')), v = vue(w, h, F.vx[0], F.vx[1], F.vy[0], F.vy[1]); V = v;
    grille(ctx, v, C, false);
    const pt = F.d(t), ft = F.f(t);
    droite(ctx, v, t, ft, pt, C.vert, 2, [7, 5]);
    courbe(ctx, v, F.f, C.encre, 2.6);
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2.4; trait(ctx, v.X(a), v.Y(F.f(a)), v.X(b), v.Y(F.f(b)));
    poignee(ctx, C, v.X(a), v.Y(F.f(a)), C.orange, 'A', false); poignee(ctx, C, v.X(b), v.Y(F.f(b)), C.orange, 'B', false); poignee(ctx, C, v.X(t), v.Y(ft), C.vert, 'T', true);
    racine.querySelectorAll('#cv-fn .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.fn)));
    const f2 = F.d2(t); ecrire(q('#cv-f2'), Math.abs(f2) < 5e-10 ? '0' : fr(f2, 3));
    const ord = ft - pt * t; ecrire(q('#cv-tan'), `y = ${fr(pt, 3)}x ${ord < 0 ? '−' : '+'} ${fr(Math.abs(ord), 3)}`);
    // signe de f″ sur ]a ; b[ : changements strictement intérieurs
    const dedans = F.chg.filter(c => c > a + 1e-9 && c < b - 1e-9), sg = F.chg.filter(c => c <= a + 1e-9).length % 2 ? -F.s0 : F.s0;
    ecrire(q('#cv-corde'), dedans.length ? 'Entre A et B, la dérivée seconde change de signe : la courbe n\'est ni convexe ni concave sur [a ; b], et la position par rapport à la corde n\'est pas garantie.'
      : sg > 0 ? 'Entre A et B, f″ ≥ 0 : la fonction est convexe sur [a ; b] et la courbe est sous la corde.' : 'Entre A et B, f″ ≤ 0 : la fonction est concave sur [a ; b] et la courbe est au-dessus de la corde.');
    let dessus = 0, dessous = 0; for (let i = 0; i <= 600; i++) { const x = F.vx[0] + (F.vx[1] - F.vx[0]) * i / 600, y = F.f(x); if (!isFinite(y)) continue; const e = y - (ft + pt * (x - t)); if (e > 1e-9) dessus++; else if (e < -1e-9) dessous++; }
    const infl = F.chg.some(c => Math.abs(c - t) < 1e-9);
    ecrire(q('#cv-tang'), infl ? 'T est un point d\'inflexion : f″ s\'y annule en changeant de signe, et la courbe traverse sa tangente.'
      : dessus && dessous ? 'Dans la fenêtre, la courbe passe d\'un côté à l\'autre de cette tangente, mais pas en T : près de T, elle reste ' + (f2 > 0 ? 'au-dessus.' : 'au-dessous.')
      : dessous ? 'Dans toute la fenêtre, la courbe est sous cette tangente.' : 'Dans toute la fenêtre, la courbe est au-dessus de cette tangente.' + (Math.abs(f2) < 5e-10 ? ' Pourtant f″(t) = 0 : ce n\'est pas un point d\'inflexion.' : ''));
  }
  const S = scene(racine, rendre);
  glisser(q('#cv-fig'), (p, phase) => { if (!V) return; const x = V.ix(p.x);
    if (phase === 'debut') { const d = ['a', 'b', 't'].map(k => Math.hypot(V.X(E[k]) - p.x, V.Y(FN[E.fn].f(E[k])) - p.y)); pris = ['a', 'b', 't'][d.indexOf(Math.min(...d))]; }
    const e = Math.round(x * 2) / 2; regler(pris, Math.abs(x - e) < 0.07 ? e : x); S.planifier(); });
  return S.arreter;
}
