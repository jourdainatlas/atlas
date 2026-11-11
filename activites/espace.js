// Exploration « Droites et plans de l'espace » (rubrique Activités, MEMO_atlas_activites.md §134).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, trait, etiquette, pastille, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Terminale · Géométrie dans l'espace</p>
  <h3>Droites et plans de l'espace</h3>
  <p class="lede">Dans l'espace, un plan se décrit par un seul vecteur : celui qui lui est perpendiculaire. Avec ce vecteur normal et un produit scalaire, on sait dire si une droite coupe le plan, où, et à quelle distance du plan se trouve un point.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Un plan, une droite, et la vue que l'on tourne</h4>
    <p>Le <b class="c-tan">plan</b> a pour équation ${K('ax + by + cz + d = 0')} ; son <b class="c-tan">vecteur normal</b> est ${K('\\vec n(a\\,;b\\,;c)')}. La <b class="c-sec">droite</b> passe par le point <b class="c-mark">A</b> et a pour vecteur directeur ${K('\\vec u')}. Réglez les coefficients, et faites tourner la vue en faisant glisser la figure ou avec les deux derniers curseurs : une figure de l'espace ne se comprend qu'en la regardant sous plusieurs angles. La partie de la droite cachée derrière le plan est en pointillés.</p>
    <p>Point A : <span class="chips" id="es-A"></span> Exemples : <span class="chips" id="es-ex"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="es-fig" class="moyen fixe" aria-label="Vue en perspective d'un plan, de son vecteur normal, d'une droite passant par A et de leur point d'intersection"></canvas>
      <div class="side">
        <h5>Calculs</h5>
        <dl class="lectures" aria-live="polite">
          <dt>${K('\\vec n \\cdot \\vec u')}</dt><dd id="es-nu"></dd>
          <dt>${K('ax_A + by_A + cz_A + d')}</dt><dd id="es-pA"></dd>
          <dt>point d'intersection I</dt><dd id="es-I"></dd>
          <dt>projeté H de A</dt><dd id="es-H"></dd>
          <dt>distance de A au plan</dt><dd id="es-dist"></dd>
        </dl>
        <p class="verdict" id="es-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="es-a"><i>a</i></label><input type="range" id="es-a" min="-3" max="3" step="0.05"><output id="es-av"></output>
      <label for="es-b"><i>b</i></label><input type="range" id="es-b" min="-3" max="3" step="0.05"><output id="es-bv"></output>
      <label for="es-c"><i>c</i></label><input type="range" id="es-c" min="-3" max="3" step="0.05"><output id="es-cv"></output>
      <label for="es-d"><i>d</i></label><input type="range" id="es-d" min="-6" max="6" step="0.05"><output id="es-dv"></output>
      <label for="es-u1"><i>u</i> : <i>x</i></label><input type="range" id="es-u1" min="-3" max="3" step="0.05"><output id="es-u1v"></output>
      <label for="es-u2"><i>u</i> : <i>y</i></label><input type="range" id="es-u2" min="-3" max="3" step="0.05"><output id="es-u2v"></output>
      <label for="es-u3"><i>u</i> : <i>z</i></label><input type="range" id="es-u3" min="-3" max="3" step="0.05"><output id="es-u3v"></output>
      <label for="es-az">tourner</label><input type="range" id="es-az" min="-180" max="180" step="1"><output id="es-azv"></output>
      <label for="es-el">incliner</label><input type="range" id="es-el" min="-5" max="89" step="1"><output id="es-elv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Le vecteur normal dit tout du plan</h4>
    <div class="def"><p>Soit ${K('M_0')} un point et ${K('\\vec n')} un vecteur non nul. L'ensemble des points ${K('M')} tels que ${K('\\overrightarrow{M_0M} \\cdot \\vec n = 0')} est un plan, le plan passant par ${K('M_0')} et de vecteur normal ${K('\\vec n')}. Si ${K('\\vec n(a\\,;b\\,;c)')}, ce plan a une équation de la forme</p>${KD('ax + by + cz + d = 0,')}<p>et réciproquement toute équation de cette forme, avec ${K('(a\\,;b\\,;c) \\neq (0\\,;0\\,;0)')}, est celle d'un plan de vecteur normal ${K('\\vec n(a\\,;b\\,;c)')}.</p></div>
    <p>En effet, si ${K('M_0(x_0\\,;y_0\\,;z_0)')}, la condition s'écrit ${K('a(x - x_0) + b(y - y_0) + c(z - z_0) = 0')}, et il suffit de poser ${K('d = -(ax_0 + by_0 + cz_0)')}. Faites varier ${K('d')} seul : le plan glisse parallèlement à lui-même. Faites varier ${K('a')}, ${K('b')} ou ${K('c')} : il bascule.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Droite et plan : un produit scalaire décide</h4>
    <p>Un point de la droite s'écrit ${K('M = A + t\\,\\vec u')}. Il est dans le plan quand ${K('\\vec n \\cdot \\overrightarrow{OM} + d = 0')}, c'est-à-dire quand</p>
    <div class="def">${KD('t\\,(\\vec n \\cdot \\vec u) = -(ax_A + by_A + cz_A + d).')}<p>Si ${K('\\vec n \\cdot \\vec u \\neq 0')}, il y a une seule solution : la droite coupe le plan en un point. Si ${K('\\vec n \\cdot \\vec u = 0')}, la droite est parallèle au plan : elle y est contenue si A est dans le plan, et ne le rencontre pas sinon.</p></div>
    <p>La même équation, avec ${K('\\vec u = \\vec n')}, donne le projeté orthogonal H de A sur le plan, et la distance de A au plan :</p>
    <div class="def">${KD('AH = \\frac{|ax_A + by_A + cz_A + d|}{\\sqrt{a^2 + b^2 + c^2}}.')}</div>
  </div>
</section>
` + suite(
  "Confondre les deux vecteurs : une droite se donne par un vecteur <em>directeur</em>, un plan par un vecteur <em>normal</em>. La droite est parallèle au plan quand son vecteur directeur est <em>orthogonal</em> au vecteur normal, et elle est perpendiculaire au plan quand il lui est <em>colinéaire</em> : c'est l'inverse de ce que l'on écrit par réflexe. Avec le plan <i>z</i> = 0, de vecteur normal (0 ; 0 ; 1), la droite dirigée par (1 ; 2 ; 0) est parallèle au plan, et celle dirigée par (0 ; 0 ; 3) lui est perpendiculaire.",
  "Le chapitre de Terminale <a href=\"#cours/t-04\">Géométrie dans l'espace</a> établit l'équation cartésienne d'un plan, les positions relatives et la distance d'un point à un plan. Dans l'édifice : <a href=\"#met.me-produit-scalaire\">Produit scalaire et inégalité de Cauchy-Schwarz</a>, et <a href=\"#anf.f-hilbert\">Espaces de Hilbert et théorème de projection</a>, qui généralise le projeté orthogonal bien au-delà de la dimension 3.",
  "Les coefficients avancent par pas de 0,05 et sont traités en vingtièmes entiers : le produit scalaire <span class=kx>\\vec n \\cdot \\vec u</span> et la valeur de <span class=kx>ax_A + by_A + cz_A + d</span> sont exacts, de sorte que « parallèle » et « contenue » sont reconnus sans erreur d'arrondi. Les coordonnées de I et de H et la distance sont arrondies à 10⁻³. La vue est une projection orthogonale ; elle ne change aucun calcul. Rien n'est enregistré ni envoyé.");

const PA = [[1, 2, 3], [0, 0, 0], [2, -1, 1]];
const EX = [['sécants', 1, 1, 2, -4, 0, -0.5, -1], ['parallèles', 0, 0, 1, 0, 1, 2, 0], ['perpendiculaires', 1, -1, 2, -1, 1, -1, 2], ['plan vertical', 1, 1, 0, -2, 0, 1, 1]];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { a: 1, b: 1, c: 2, d: -4, u1: 0, u2: -0.5, u3: -1, A: 0, az: 35, el: 22 };
  let prec = null;
  for (const k of ['a', 'b', 'c', 'd', 'u1', 'u2', 'u3']) q('#es-' + k).addEventListener('input', e => { E[k] = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  for (const k of ['az', 'el']) q('#es-' + k).addEventListener('input', e => { E[k] = +e.target.value; S.planifier(); });
  PA.forEach((p, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = `(${p.join(' ; ')})`.replace(/-/g, '−'); b.addEventListener('click', () => { E.A = i; S.planifier(); }); q('#es-A').append(b); });
  EX.forEach(([nom, a, b, c, d, u1, u2, u3]) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = nom; bt.addEventListener('click', () => { Object.assign(E, { a, b, c, d, u1, u2, u3 }); S.planifier(); }); q('#es-ex').append(bt); });
  const tri = v => `(${frc(v[0], 3)} ; ${frc(v[1], 3)} ; ${frc(v[2], 3)})`;
  function rendre(C) {
    const n = [E.a, E.b, E.c], u = [E.u1, E.u2, E.u3], A = PA[E.A], I20 = t => Math.round(t * 20);
    const nu400 = I20(n[0]) * I20(u[0]) + I20(n[1]) * I20(u[1]) + I20(n[2]) * I20(u[2]);          // n·u × 400
    const pA20 = I20(n[0]) * A[0] + I20(n[1]) * A[1] + I20(n[2]) * A[2] + I20(E.d);                // (n·A + d) × 20
    const nn = n[0] * n[0] + n[1] * n[1] + n[2] * n[2], nul = nn === 0, unul = u.every(x => x === 0), pA = pA20 / 20, nu = nu400 / 400;
    const { ctx, w, h } = toile(q('#es-fig')), az = E.az * Math.PI / 180, el = E.el * Math.PI / 180, ech = Math.min(w, h) / 9.8;
    // projection orthogonale : la caméra regarde le long de la direction vue
    const ca = Math.cos(az), sa = Math.sin(az), ce = Math.cos(el), se = Math.sin(el), vue = [ca * ce, sa * ce, se];
    const P = p => [w / 2 + ech * (-sa * p[0] + ca * p[1]), h / 2 - ech * (-se * ca * p[0] - se * sa * p[1] + ce * p[2])];
    const seg = (p, r, coul, ep, tirets) => { const a = P(p), b = P(r); ctx.strokeStyle = coul; ctx.lineWidth = ep; ctx.setLineDash(tirets || []); trait(ctx, a[0], a[1], b[0], b[1]); ctx.setLineDash([]); };
    const pt = (p, coul, nom, dx = 10, dy = -10) => { const a = P(p); pastille(ctx, a[0], a[1], coul, 5); if (nom) etiquette(ctx, C, nom, a[0] + dx, a[1] + dy, coul, 'center', 14); };
    // axes
    for (const [v, nom] of [[[4.6, 0, 0], 'x'], [[0, 4.6, 0], 'y'], [[0, 0, 4.6], 'z']]) { seg([0, 0, 0], v, C.doux, 1.4); const e = P(v); etiquette(ctx, C, nom, e[0] + 8, e[1] - 6, C.doux, 'center', 13); seg([0, 0, 0], v.map(x => -x * 0.5), C.filetFort, 1, [3, 4]); }
    if (!nul) {
      // carré du plan autour du projeté de l'origine
      const k0 = -E.d / nn, c0 = n.map(x => x * k0), nl = Math.sqrt(nn), nh = n.map(x => x / nl);
      let e1 = Math.abs(nh[2]) < 0.9 ? [-nh[1], nh[0], 0] : [1, 0, -nh[0] / nh[2]]; const l1 = Math.hypot(...e1); e1 = e1.map(x => x / l1);
      const e2 = [nh[1] * e1[2] - nh[2] * e1[1], nh[2] * e1[0] - nh[0] * e1[2], nh[0] * e1[1] - nh[1] * e1[0]], R = 3.4;
      const coin = (s, t) => c0.map((x, i) => x + R * (s * e1[i] + t * e2[i])), Q = [coin(-1, -1), coin(1, -1), coin(1, 1), coin(-1, 1)].map(P);
      ctx.beginPath(); Q.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.globalAlpha = .2; ctx.fillStyle = C.vert; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = C.vert; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.globalAlpha = .35; for (let g = -2; g <= 2; g++) { seg(coin(g / 3 * 1.5, -1), coin(g / 3 * 1.5, 1), C.vert, .8); seg(coin(-1, g / 3 * 1.5), coin(1, g / 3 * 1.5), C.vert, .8); } ctx.globalAlpha = 1;
      // côté du plan où se trouve l'observateur : signe de n·vue
      const cote = Math.sign(n[0] * vue[0] + n[1] * vue[1] + n[2] * vue[2]) || 1, val = p => n[0] * p[0] + n[1] * p[1] + n[2] * p[2] + E.d;
      const H = A.map((x, i) => x - (pA / nn) * n[i]);
      if (!unul) { const ul = Math.hypot(...u), L = 6.5 / ul, p1 = A.map((x, i) => x - L * u[i]), p2 = A.map((x, i) => x + L * u[i]);
        if (nu400 !== 0) { const t = -pA / nu, I = A.map((x, i) => x + t * u[i]); const cache = p => val(p) * cote < 0;
          if (Math.abs(t) < L) { seg(p1, I, C.orange, 2.6, cache(p1) ? [6, 5] : null); seg(I, p2, C.orange, 2.6, cache(p2) ? [6, 5] : null); } else seg(p1, p2, C.orange, 2.6, cache(A) ? [6, 5] : null);
          pt(I, C.encre, 'I', -12, -10); }
        else seg(p1, p2, C.orange, 2.6, pA20 !== 0 && pA * cote < 0 ? [6, 5] : null);
        const fl = A.map((x, i) => x + u[i]); seg(A, fl, C.orange, 4.5); }
      if (pA20 !== 0) { seg(A, H, C.bleu, 1.6, [4, 4]); pt(H, C.bleu, 'H', 12, 12); }
      { const B = c0.map((x, i) => x + 2.3 * e1[i] + 2.3 * e2[i]), T = B.map((x, i) => x + nh[i] * 1.5), cacheN = val(T) * cote < 0;   // vecteur normal, posé dans un coin du carré
        seg(B, T, C.vert, 3.2, cacheN ? [5, 4] : null); pt(B, C.vert, ''); const fn = P(T); etiquette(ctx, C, 'n', fn[0] + 10, fn[1] - 8, C.vert, 'center', 13); }
      ecrire(q('#es-H'), tri(H)); ecrire(q('#es-dist'), pA20 === 0 ? '0 : A est dans le plan' : fr(Math.abs(pA) / nl, 3));
      ecrire(q('#es-I'), unul ? '' : nu400 !== 0 ? tri(A.map((x, i) => x - pA / nu * u[i])) : 'aucun point isolé');
    } else { ecrire(q('#es-H'), ''); ecrire(q('#es-dist'), ''); ecrire(q('#es-I'), ''); }
    pt(A, C.bleu, 'A', 12, -10);
    for (const k of ['a', 'b', 'c', 'd', 'u1', 'u2', 'u3']) { const r = q('#es-' + k); if (Math.abs(+r.value - E[k]) > 1e-9) r.value = E[k]; ecrire(q('#es-' + k + 'v'), fr(E[k], 2)); }
    for (const k of ['az', 'el']) { const r = q('#es-' + k); if (+r.value !== E[k]) r.value = E[k]; ecrire(q('#es-' + k + 'v'), E[k] + '°'); }
    racine.querySelectorAll('#es-A .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.A)));
    ecrire(q('#es-nu'), frc(nu, 4)); ecrire(q('#es-pA'), frc(pA, 2));
    const col = !nul && !unul && [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]].every(x => Math.abs(x) < 1e-9);
    ecrire(q('#es-verdict'), nul ? 'Les trois coefficients a, b et c sont nuls : l\'équation ne définit pas un plan.' : unul ? 'Le vecteur directeur est nul : il ne définit pas une droite.'
      : nu400 !== 0 ? (col ? 'Le vecteur directeur est colinéaire au vecteur normal : la droite est perpendiculaire au plan, et le coupe en I.' : 'Le produit scalaire n·u n\'est pas nul : la droite coupe le plan en un seul point, I.')
      : pA20 === 0 ? 'Le produit scalaire n·u est nul et A est dans le plan : la droite est contenue dans le plan.' : 'Le produit scalaire n·u est exactement nul et A n\'est pas dans le plan : la droite est strictement parallèle au plan.');
  }
  const S = scene(racine, rendre);
  glisser(q('#es-fig'), (p, phase) => { if (phase === 'debut') { prec = p; return; } if (!prec) return;
    E.az = Math.round(((E.az - (p.x - prec.x) * 0.5 + 180) % 360 + 360) % 360 - 180); E.el = Math.round(borne(E.el + (p.y - prec.y) * 0.4, -5, 89)); prec = p; S.planifier(); });
  return S.arreter;
}
