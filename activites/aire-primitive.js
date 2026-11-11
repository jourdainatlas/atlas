// Exploration « L'aire sous la courbe » (rubrique Activités, MEMO_atlas_activites.md §120).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, droite, etiquette, poignee, pastille, glisser, ecrire, fr, frc, borne, pas } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale · Calcul intégral</p>
  <h3>L'aire sous la courbe</h3>
  <p class="lede">Fixez une borne <i>a</i>, laissez l'autre libre : l'aire comprise entre la courbe et l'axe devient une fonction de <i>x</i>. Cette page fait voir pourquoi la dérivée de cette fonction est la fonction de départ.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Une aire qui dépend de sa borne</h4>
    <p>Choisissez une fonction <i>f</i> : <span class="chips" id="ap-fn"></span></p>
    <p>La figure du haut colore le domaine compris entre la courbe de <i>f</i>, l'axe des abscisses et les droites verticales d'abscisses <i>a</i> et <i>x</i>. Déplacez <i>x</i>. L'intégrale de <i>a</i> à <i>x</i> compte <b class="c-tan">positivement</b> ce qui est au-dessus de l'axe et <b class="c-sec">négativement</b> ce qui est au-dessous, quand <i>x</i> est à droite de <i>a</i> ; les signes s'inversent quand <i>x</i> passe à gauche de <i>a</i>.</p>
    <p>La figure du bas reporte cette valeur au-dessus de <i>x</i> : c'est la courbe de la fonction <i>F</i>, définie par <i>F</i>(<i>x</i>) = ∫<sub><i>a</i></sub><sup><i>x</i></sup> <i>f</i>(<i>t</i>) d<i>t</i>.</p>
  </div>
  <div class="fig">
    <div class="cap"><span>courbe de <i>f</i> et aire algébrique de <i>a</i> à <i>x</i></span><span id="ap-l1"></span></div>
    <canvas id="ap-haut" class="large fixe paire" aria-label="Courbe de f ; domaine coloré entre a et x ; rectangle de même aire entre x et x + h"></canvas>
    <div class="cap"><span>courbe de <i>F</i> : l'aire, reportée au-dessus de <i>x</i></span><span id="ap-l2"></span></div>
    <canvas id="ap-bas" class="large fixe paire" style="border-top:1px dashed var(--filet)" aria-label="Courbe de la fonction F, sa sécante entre x et x + h et sa tangente en x"></canvas>
    <div class="reglages">
      <label for="ap-x"><i>x</i></label><input type="range" id="ap-x" min="-4" max="4" step="0.05" value="2"><output id="ap-xv"></output>
      <label for="ap-a"><i>a</i></label><input type="range" id="ap-a" min="-3" max="3" step="0.05" value="0"><output id="ap-av"></output>
      <label for="ap-h"><i>h</i></label><input type="range" id="ap-h" min="0.02" max="1.5" step="0.02" value="1"><output id="ap-hv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La pente de la courbe des aires</h4>
    <p>Avancez de <i>x</i> à <i>x</i> + <i>h</i>. L'aire gagne une tranche, <i>F</i>(<i>x</i> + <i>h</i>) − <i>F</i>(<i>x</i>). Le <b class="c-mark">rectangle bleu</b> de la figure du haut a la même base <i>h</i> et la même aire que cette tranche : sa hauteur est donc le taux d'accroissement de <i>F</i>, qui est aussi la valeur moyenne de <i>f</i> entre <i>x</i> et <i>x</i> + <i>h</i>.</p>
    <dl class="lectures" aria-live="polite" style="margin:0 0 14px">
      <dt><i>F</i>(<i>x</i>)</dt><dd id="ap-F"></dd>
      <dt><i>f</i>(<i>x</i>)</dt><dd id="ap-f"></dd>
      <dt>taux à droite</dt><dd id="ap-td"></dd>
      <dt>taux à gauche</dt><dd id="ap-tg"></dd>
    </dl>
    <p>Réduisez <i>h</i> : la tranche devient si fine que <i>f</i> n'a plus le temps de varier, et la hauteur du rectangle se rapproche de <i>f</i>(<i>x</i>). <span id="ap-verdict" aria-live="polite"></span></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le théorème, et son hypothèse</h4>
    <div class="def"><p>Si <span class="kx">f</span> est continue sur un intervalle <span class="kx">I</span> et si <span class="kx">a</span> est un point de <span class="kx">I</span>, alors la fonction</p><span class="kx kxd">F : x \\longmapsto \\int_a^x f(t)\\,\\mathrm dt</span><p>est dérivable sur <span class="kx">I</span> et <span class="kx">F' = f</span>. C'est la primitive de <span class="kx">f</span> qui s'annule en <span class="kx">a</span>.</p></div>
    <p>Changer <i>a</i> ne change pas la forme de la courbe du bas : elle monte ou descend d'un bloc, parce que deux primitives d'une même fonction sur un intervalle diffèrent d'une constante. Vérifiez-le avec le curseur <i>a</i>.</p>
    <p>L'hypothèse de continuité n'est pas décorative. Choisissez la fonction « en escalier », qui saute de 1 à 2,5 en <i>x</i> = 1, et placez <i>x</i> en 1 : l'aire reste une fonction continue, mais sa courbe fait un angle, et les taux à droite et à gauche ne s'accordent pas.</p>
  </div>
</section>
` + suite(
  "Croire qu'une intégrale est une aire au sens ordinaire. C'est une aire algébrique : pour <i>f</i>(<i>x</i>) = <i>x</i>²/4 − 1, négative entre −2 et 2, l'intégrale de −2 à 2 vaut −8/3, alors que l'aire du domaine vaut 8/3. Et l'intégrale change de signe quand on échange ses bornes.",
  "Le chapitre de Terminale <a href=\"#cours/t-06\">Calcul intégral</a> démontre ce résultat pour une fonction continue, positive et croissante, par un encadrement de la tranche entre deux rectangles. La démonstration générale est dans l'édifice, à la fiche <a href=\"#analyse-reelle.ar-tfa\">Théorème fondamental de l'analyse</a>.",
  "Les valeurs de <i>F</i> ne viennent pas d'une somme approchée : chaque fonction proposée a une primitive connue (<i>x</i>²/4 + <i>x</i>, sin <i>x</i>, <i>x</i>³/12 − <i>x</i>, et une fonction affine par morceaux pour l'escalier), et la page calcule <i>F</i>(<i>x</i>) = <i>G</i>(<i>x</i>) − <i>G</i>(<i>a</i>). Les affichages sont arrondis à 10⁻⁴. Rien n'est enregistré ni envoyé.");

// Chaque fonction avec une primitive G exacte ; saut : abscisse d'une discontinuité de f.
const FN = [
  { nom: 'x/2 + 1', f: x => x / 2 + 1, G: x => x * x / 4 + x, y: [-1.6, 3.6] },
  { nom: 'cos x', f: Math.cos, G: Math.sin, y: [-1.7, 1.7] },
  { nom: 'x²/4 − 1', f: x => x * x / 4 - 1, G: x => x * x * x / 12 - x, y: [-1.8, 3.6] },
  { nom: 'en escalier', f: x => x < 1 ? 1 : 2.5, G: x => x < 1 ? x : 1 + 2.5 * (x - 1), y: [-0.8, 3.4], saut: 1 },
];
const XM = 4.5;

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, a: 0, x: 2, h: 1 };
  let V = null;
  const boite = q('#ap-fn');
  FN.forEach((F, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = F.nom;
    b.addEventListener('click', () => { E.fn = i; S.planifier(); }); boite.append(b); });
  const arr = (v, p) => Math.round(v / p) * p;
  q('#ap-x').addEventListener('input', e => { E.x = +e.target.value; S.planifier(); });
  q('#ap-a').addEventListener('input', e => { E.a = +e.target.value; S.planifier(); });
  q('#ap-h').addEventListener('input', e => { E.h = +e.target.value; S.planifier(); });

  function rendre(C) {
    const fn = FN[E.fn], { a, x, h } = E, f = fn.f, F = t => fn.G(t) - fn.G(a);
    const Fx = F(x), td = (F(x + h) - Fx) / h, tg = (F(x - h) - Fx) / (-h), coup = fn.saut !== undefined ? [fn.saut] : [];
    const auSaut = fn.saut !== undefined && Math.abs(x - fn.saut) < 1e-9;
    { const { ctx, w, h: H } = toile(q('#ap-haut')), v = vue(w, H, -XM, XM, fn.y[0], fn.y[1]); V = v;
      grille(ctx, v, C, false);
      // aire algébrique : bandes verticales, vertes si elles comptent positivement, orange sinon
      const n = 360, x0 = Math.min(a, x), x1 = Math.max(a, x), sens = x >= a ? 1 : -1; ctx.globalAlpha = .28;
      for (let i = 0; i < n; i++) { const u0 = x0 + (x1 - x0) * i / n, u1 = x0 + (x1 - x0) * (i + 1) / n, y = f((u0 + u1) / 2);
        ctx.fillStyle = y * sens >= 0 ? C.vert : C.orange; ctx.fillRect(v.X(u0), Math.min(v.Y(0), v.Y(y)), v.X(u1) - v.X(u0) + .6, Math.abs(v.Y(y) - v.Y(0))); }
      ctx.globalAlpha = 1;
      // rectangle de base h et de hauteur le taux à droite : même aire que la tranche
      ctx.strokeStyle = C.bleu; ctx.lineWidth = 2.2; ctx.strokeRect(v.X(x), Math.min(v.Y(0), v.Y(td)), v.X(x + h) - v.X(x), Math.abs(v.Y(td) - v.Y(0)));
      courbe(ctx, v, f, C.encre, 2.6, null, coup);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); trait(ctx, v.X(a), 0, v.X(a), H); ctx.setLineDash([]);
      etiquette(ctx, C, 'a', v.X(a), 11, C.doux, 'center', 13);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.6; trait(ctx, v.X(x), 0, v.X(x), H);
      poignee(ctx, C, v.X(x), v.Y(f(x)), C.encre, '', false); etiquette(ctx, C, 'x', v.X(x), 11, C.encre, 'center', 13);
      if (v.X(x + h) - v.X(x) > 26) etiquette(ctx, C, 'h', (v.X(x) + v.X(x + h)) / 2, v.Y(0) + (td >= 0 ? 12 : -12), C.bleu, 'center', 12);
    }
    { // courbe de F : cadrage calculé sur ses valeurs
      let lo = 0, hi = 0; for (let i = 0; i <= 120; i++) { const y = F(-XM + 2 * XM * i / 120); lo = Math.min(lo, y); hi = Math.max(hi, y); }
      const m = Math.max(0.6, (hi - lo) * 0.12), { ctx, w, h: H } = toile(q('#ap-bas')), v = vue(w, H, -XM, XM, lo - m, hi + m);
      grille(ctx, v, C, false);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); trait(ctx, v.X(a), 0, v.X(a), H); ctx.setLineDash([]);
      if (!auSaut) droite(ctx, v, x, Fx, f(x), C.vert, 2, [7, 6]);
      droite(ctx, v, x, Fx, td, C.bleu, 1.8);
      courbe(ctx, v, F, C.encre, 2.6);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.2; trait(ctx, v.X(x), v.Y(0), v.X(x), v.Y(Fx));
      pastille(ctx, v.X(x + h), v.Y(F(x + h)), C.bleu, 5); pastille(ctx, v.X(a), v.Y(0), C.doux, 4);
      poignee(ctx, C, v.X(x), v.Y(Fx), C.encre, '', false);
    }
    racine.querySelectorAll('#ap-fn .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.fn)));
    for (const [id, val, d] of [['#ap-x', x, 2], ['#ap-a', a, 2], ['#ap-h', h, 2]]) { if (Math.abs(+q(id).value - val) > 1e-9) q(id).value = val; ecrire(q(id + 'v'), fr(val, d)); }
    ecrire(q('#ap-l1'), 'f(x) = ' + fr(f(x), 4)); ecrire(q('#ap-l2'), 'F(x) = ' + fr(Fx, 4));
    ecrire(q('#ap-F'), fr(Fx, 4)); ecrire(q('#ap-f'), fr(f(x), 4) + (auSaut ? ' (saut : 1 à gauche, 2,5 à droite)' : ''));
    ecrire(q('#ap-td'), '(F(x + h) − F(x))/h = ' + fr(td, 4)); ecrire(q('#ap-tg'), '(F(x − h) − F(x))/(−h) = ' + fr(tg, 4));
    ecrire(q('#ap-verdict'), auSaut
      ? "Ici, les taux à droite valent tous 2,5 et les taux à gauche valent tous 1, aussi petit que soit h : F n'est pas dérivable en 1."
      : `Pour h = ${fr(h, 2)}, l'écart entre le taux à droite et f(x) est ${fr(Math.abs(td - f(x)), 4)} ; la droite verte, de pente f(x), est la tangente à la courbe de F.`);
  }
  const S = scene(racine, rendre);
  const suivre = (p) => { if (V) { E.x = borne(arr(V.ix(p.x), 0.05), -4, 4); if (Math.abs(E.x) < 1e-9) E.x = 0; S.planifier(); } };
  glisser(q('#ap-haut'), suivre); glisser(q('#ap-bas'), suivre);
  return S.arreter;
}
