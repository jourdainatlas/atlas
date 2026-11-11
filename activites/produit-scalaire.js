// Exploration « Le produit scalaire » (rubrique Activités, MEMO_atlas_activites.md §124).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, etiquette, poignee, pastille, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Première · Produit scalaire</p>
  <h3>Le produit scalaire</h3>
  <p class="lede">Deux vecteurs, un nombre. Ce nombre se calcule de trois façons, avec les coordonnées, avec les longueurs et l'angle, avec un projeté, et il dit d'un coup d'œil si l'angle des deux vecteurs est aigu, droit ou obtus.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Trois calculs, un seul nombre</h4>
    <p>Déplacez les extrémités A et B des vecteurs <b class="c-mark"><i>u</i></b> = OA et <b class="c-sec"><i>v</i></b> = OB, ou réglez leurs coordonnées. Le point H est le projeté orthogonal de B sur la droite (OA). Le tableau calcule le produit scalaire <i>u</i> · <i>v</i> des trois façons.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ps-fig" class="moyen fixe" aria-label="Vecteurs u et v d'origine O, angle entre eux et projeté orthogonal H de B sur la droite (OA)"></canvas>
      <div class="side">
        <h5>Le produit scalaire <i>u</i> · <i>v</i></h5>
        <dl class="lectures" aria-live="polite">
          <dt>coordonnées</dt><dd id="ps-c"></dd>
          <dt>longueurs et angle</dt><dd id="ps-a"></dd>
          <dt>projeté</dt><dd id="ps-p"></dd>
        </dl>
        <p class="verdict" id="ps-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="ps-ux"><i>u</i> : abscisse</label><input type="range" id="ps-ux" min="-5" max="5" step="0.05"><output id="ps-uxv"></output>
      <label for="ps-uy"><i>u</i> : ordonnée</label><input type="range" id="ps-uy" min="-4" max="4" step="0.05"><output id="ps-uyv"></output>
      <label for="ps-vx"><i>v</i> : abscisse</label><input type="range" id="ps-vx" min="-5" max="5" step="0.05"><output id="ps-vxv"></output>
      <label for="ps-vy"><i>v</i> : ordonnée</label><input type="range" id="ps-vy" min="-4" max="4" step="0.05"><output id="ps-vyv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que dit le signe</h4>
    <p>Comme <i>u</i> · <i>v</i> = ‖<i>u</i>‖ × ‖<i>v</i>‖ × cos θ et que les longueurs sont positives, le produit scalaire de deux vecteurs non nuls a le signe de cos θ : positif si l'angle est aigu, négatif s'il est obtus. Faites tourner B autour de O et regardez H passer de l'autre côté de O au moment où l'angle devient obtus.</p>
    <p class="def">Deux vecteurs sont orthogonaux si, et seulement si, leur produit scalaire est nul.</p>
    <p>Dans un repère orthonormé, cela donne un test sans aucune mesure d'angle : <i>u</i>(<i>x</i> ; <i>y</i>) et <i>v</i>(<i>x</i>′ ; <i>y</i>′) sont orthogonaux exactement quand <i>xx</i>′ + <i>yy</i>′ = 0. Cherchez plusieurs vecteurs <i>v</i> orthogonaux à <i>u</i>(3 ; 2) : ils sont tous alignés.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le projeté</h4>
    <p>La troisième expression n'emploie que des points de la droite (OA) : <i>u</i> · <i>v</i> est le produit de OA par OH, compté positivement si H est du même côté de O que A, négativement sinon. Déplacer B perpendiculairement à (OA) ne change donc pas le produit scalaire, puisque H ne bouge pas. Essayez : avec <i>u</i>(4 ; 0), faites varier seulement l'ordonnée de <i>v</i>.</p>
  </div>
</section>
` + suite(
  "Oublier que le produit scalaire est un nombre, et non un vecteur, et lui prêter les règles du produit des nombres. En particulier, <i>u</i> · <i>v</i> = 0 n'entraîne pas que l'un des deux vecteurs soit nul : (3 ; 2) · (−2 ; 3) = −6 + 6 = 0, et aucun des deux n'est nul. On ne peut donc pas « simplifier par <i>u</i> » dans une égalité <i>u</i> · <i>v</i> = <i>u</i> · <i>w</i>.",
  "Le chapitre de Première <a href=\"#cours/p-07\">Produit scalaire</a> établit l'égalité des trois expressions. Dans l'édifice, la fiche <a href=\"#met.me-produit-scalaire\">Produit scalaire et inégalité de Cauchy-Schwarz</a> part de la définition générale ; l'inégalité |<i>u</i> · <i>v</i>| ≤ ‖<i>u</i>‖ × ‖<i>v</i>‖ est ce qui permet de définir l'angle par son cosinus.",
  "Le produit scalaire est calculé avec les coordonnées, qui avancent par pas de 0,05 et sont traitées comme des entiers (en vingtièmes) : il est exact. Quand on déplace un point à la souris ou au doigt, il s'accroche légèrement aux nœuds du quadrillage. L'angle θ, donné au dixième de degré, vient de cos θ = <i>u</i> · <i>v</i> / (‖<i>u</i>‖ × ‖<i>v</i>‖) ; le projeté H est OA multiplié par <i>u</i> · <i>v</i> / ‖<i>u</i>‖². Les longueurs sont arrondies à 10⁻³. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { ux: 4, uy: 1, vx: 1.5, vy: 3 };
  let V = null, pris = null;
  for (const k of ['ux', 'uy', 'vx', 'vy']) q('#ps-' + k).addEventListener('input', e => { E[k] = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  const fleche = (ctx, x0, y0, x1, y1, couleur) => { ctx.strokeStyle = couleur; ctx.fillStyle = couleur; ctx.lineWidth = 3; trait(ctx, x0, y0, x1, y1);
    const a = Math.atan2(y1 - y0, x1 - x0); if (Math.hypot(x1 - x0, y1 - y0) < 6) return; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - 12 * Math.cos(a - .4), y1 - 12 * Math.sin(a - .4)); ctx.lineTo(x1 - 12 * Math.cos(a + .4), y1 - 12 * Math.sin(a + .4)); ctx.closePath(); ctx.fill(); };
  function rendre(C) {
    const { ux, uy, vx, vy } = E, ent = t => Math.round(t * 20), ps = (ent(ux) * ent(vx) + ent(uy) * ent(vy)) / 400,   // coordonnées en vingtièmes : produit exact
       nu = Math.hypot(ux, uy), nv = Math.hypot(vx, vy), nuls = nu === 0 || nv === 0;
    const cos = nuls ? NaN : borne(ps / (nu * nv), -1, 1), th = Math.acos(cos), k = nu ? ps / (nu * nu) : 0, hx = k * ux, hy = k * uy;
    const { ctx, w, h } = toile(q('#ps-fig')), v = vueEgale(w, h, 0, 0, Math.max(5.8, 4.8 * w / h)); V = v;
    grille(ctx, v, C, true);
    const O = [v.X(0), v.Y(0)];
    if (nu) { ctx.strokeStyle = C.doux; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); trait(ctx, v.X(-9 * ux / nu), v.Y(-9 * uy / nu), v.X(9 * ux / nu), v.Y(9 * uy / nu)); trait(ctx, v.X(vx), v.Y(vy), v.X(hx), v.Y(hy)); ctx.setLineDash([]);
      ctx.strokeStyle = C.vert; ctx.lineWidth = 6; ctx.globalAlpha = .55; trait(ctx, O[0], O[1], v.X(hx), v.Y(hy)); ctx.globalAlpha = 1; }
    if (!nuls) { const a0 = Math.atan2(uy, ux), a1 = Math.atan2(vy, vx); let d = a1 - a0; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI));
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(O[0], O[1], 26, -a0, -a1, d > 0); ctx.stroke();
      etiquette(ctx, C, 'θ', O[0] + 40 * Math.cos(a0 + d / 2), O[1] - 40 * Math.sin(a0 + d / 2), C.encre, 'center', 13); }
    fleche(ctx, O[0], O[1], v.X(ux), v.Y(uy), C.bleu); fleche(ctx, O[0], O[1], v.X(vx), v.Y(vy), C.orange);
    if (nu) { pastille(ctx, v.X(hx), v.Y(hy), C.vert, 5); etiquette(ctx, C, 'H', v.X(hx) + 4, v.Y(hy) + 16, C.vert, 'center', 13); }
    poignee(ctx, C, v.X(ux), v.Y(uy), C.bleu, 'A', uy < 0); poignee(ctx, C, v.X(vx), v.Y(vy), C.orange, 'B', vy < 0);
    etiquette(ctx, C, 'O', O[0] - 11, O[1] + 13, C.doux, 'center', 12);
    for (const k2 of ['ux', 'uy', 'vx', 'vy']) { const r = q('#ps-' + k2); if (+r.value !== E[k2]) r.value = E[k2]; ecrire(q('#ps-' + k2 + 'v'), fr(E[k2], 2)); }
    const par = x => x < 0 ? '(' + frc(x) + ')' : frc(x);
    ecrire(q('#ps-c'), `${par(ux)} × ${par(vx)} + ${par(uy)} × ${par(vy)} = ${frc(ps, 4)}`);
    ecrire(q('#ps-a'), nuls ? 'pas d\'angle : un vecteur est nul' : `${fr(nu, 3)} × ${fr(nv, 3)} × cos ${fr(th * 180 / Math.PI, 1)}° ≈ ${fr(nu * nv * Math.cos(th), 3)}`);
    ecrire(q('#ps-p'), nu ? `OA × OH = ${fr(nu, 3)} × ${k < 0 ? '(−' + fr(Math.abs(k) * nu, 3) + ')' : fr(k * nu, 3)} ≈ ${fr(nu * k * nu, 3)}` : 'pas de droite (OA) : u est nul');
    ecrire(q('#ps-verdict'), nuls ? "L'un des vecteurs est nul : le produit scalaire vaut 0 et l'angle n'est pas défini."
      : ps === 0 ? "Le produit scalaire est exactement 0 : les deux vecteurs sont orthogonaux, et H est en O."
      : ps > 0 ? `Le produit scalaire est positif : l'angle θ est aigu, et H est du même côté de O que A.` : `Le produit scalaire est négatif : l'angle θ est obtus, et H est de l'autre côté de O.`);
  }
  const S = scene(racine, rendre);
  glisser(q('#ps-fig'), (p, phase) => {
    if (!V) return;
    if (phase === 'debut') pris = Math.hypot(p.x - V.X(E.ux), p.y - V.Y(E.uy)) <= Math.hypot(p.x - V.X(E.vx), p.y - V.Y(E.vy)) ? 'u' : 'v';
    // pas de 0,05, avec une légère aimantation sur les nœuds du quadrillage (coordonnées entières)
    const aimant = t => { const r = Math.round(t * 20) / 20, e = Math.round(t); return Math.abs(t - e) < 0.13 ? e : r; };
    const x = borne(aimant(V.ix(p.x)), -5, 5), y = borne(aimant(V.iy(p.y)), -4, 4);
    E[pris + 'x'] = x; E[pris + 'y'] = y; S.planifier();
  });
  return S.arreter;
}
