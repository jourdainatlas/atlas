// Exploration « Vecteurs : translation, somme, colinéarité » (rubrique Activités, MEMO_atlas_activites.md §167).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, etiquette, poignee, pastille, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures;
const K = t => `<span class="kx">${t}</span>`;

export const html = `
<header class="col">
  <p class="eyebrow">Seconde · Vecteurs</p>
  <h3>Vecteurs : translation, somme, colinéarité</h3>
  <p class="lede">Un vecteur n'est pas une flèche posée quelque part : c'est un déplacement, le même où qu'on le dessine. On le voit agir sur un triangle, on ajoute deux déplacements bout à bout, puis on reconnaît par un seul calcul deux vecteurs colinéaires.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Un vecteur est un déplacement</h4>
    <p>La translation de vecteur ${K('\\vec u')} déplace tous les points du plan de la même façon. Déplacez l'extrémité de ${K('\\vec u')}, ou réglez ses coordonnées : le triangle ${K('ABC')} glisse en ${K("A'B'C'")}, et les trois flèches ${K("\\overrightarrow{AA'}")}, ${K("\\overrightarrow{BB'}")}, ${K("\\overrightarrow{CC'}")} sont trois dessins du même vecteur. Vous pouvez aussi déplacer les sommets ${K('A')}, ${K('B')} et ${K('C')}.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="vc-f1" class="moyen fixe" aria-label="Triangle ABC et son image A'B'C' par la translation de vecteur u"></canvas>
      <div class="side">
        <h5>Coordonnées</h5>
        <dl class="lectures" aria-live="polite">
          <dt>vecteur <i>u</i></dt><dd id="vc-u1"></dd>
          <dt>de <i>A</i> à <i>A′</i></dt><dd id="vc-aa"></dd>
          <dt>de <i>B</i> à <i>B′</i></dt><dd id="vc-bb"></dd>
          <dt>de <i>C</i> à <i>C′</i></dt><dd id="vc-cc"></dd>
        </dl>
        <p class="verdict" id="vc-v1" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="vc-ux"><i>u</i> : abscisse</label><input type="range" id="vc-ux" min="-6" max="6" step="0.05"><output id="vc-uxv"></output>
      <label for="vc-uy"><i>u</i> : ordonnée</label><input type="range" id="vc-uy" min="-4" max="4" step="0.05"><output id="vc-uyv"></output>
    </div>
  </div>
  <div class="col">
    <p>Ce qu'il faut lire : pour aller d'un point à son image, on ajoute toujours les mêmes nombres à l'abscisse et à l'ordonnée. Ce sont les coordonnées du vecteur.</p>
    <div class="def"><p>Dans un repère, le vecteur ${K('\\overrightarrow{AB}')} a pour coordonnées ${K('(x_B - x_A \\,;\\, y_B - y_A)')}. Deux vecteurs sont égaux si, et seulement si, ils ont les mêmes coordonnées ; ${K("\\overrightarrow{AA'} = \\overrightarrow{BB'}")} signifie que ${K("AA'B'B")} est un parallélogramme, éventuellement aplati.</p></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ajouter deux vecteurs : bout à bout</h4>
    <p>Faire le déplacement ${K('\\vec u')} puis le déplacement ${K('\\vec v')}, c'est faire un seul déplacement, que l'on note ${K('\\vec u + \\vec v')}. Sur la figure, ${K('\\vec u')} mène de ${K('O')} à ${K('A')}, puis ${K('\\vec v')} de ${K('A')} à ${K('B')} : la somme mène directement de ${K('O')} à ${K('B')}. Déplacez ${K('A')} et ${K('B')}.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="vc-f2" class="moyen fixe" aria-label="Vecteurs u de O à A, v de A à B, et leur somme de O à B, avec le parallélogramme"></canvas>
      <div class="side">
        <h5>La somme</h5>
        <dl class="lectures" aria-live="polite">
          <dt><i>u</i></dt><dd id="vc-su"></dd>
          <dt><i>v</i></dt><dd id="vc-sv"></dd>
          <dt><i>u</i> + <i>v</i></dt><dd id="vc-ss"></dd>
          <dt>longueurs</dt><dd id="vc-sl"></dd>
        </dl>
        <p class="verdict" id="vc-v2" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="vc-ax"><i>u</i> : abscisse</label><input type="range" id="vc-ax" min="-5" max="5" step="0.05"><output id="vc-axv"></output>
      <label for="vc-ay"><i>u</i> : ordonnée</label><input type="range" id="vc-ay" min="-4" max="4" step="0.05"><output id="vc-ayv"></output>
      <label for="vc-bx"><i>v</i> : abscisse</label><input type="range" id="vc-bx" min="-5" max="5" step="0.05"><output id="vc-bxv"></output>
      <label for="vc-by"><i>v</i> : ordonnée</label><input type="range" id="vc-by" min="-4" max="4" step="0.05"><output id="vc-byv"></output>
    </div>
  </div>
  <div class="col">
    <div class="def"><p><b>Relation de Chasles.</b> Pour tous points ${K('O')}, ${K('A')}, ${K('B')} : ${K('\\overrightarrow{OA} + \\overrightarrow{AB} = \\overrightarrow{OB}')}. En coordonnées, on ajoute les abscisses entre elles et les ordonnées entre elles.</p></div>
    <p>Avec la formule des coordonnées de ${K('\\overrightarrow{AB}')}, la relation de Chasles se vérifie en une ligne : ${K('(x_A - x_O) + (x_B - x_A) = x_B - x_O')}, et de même pour les ordonnées. Le tracé en pointillés montre l'autre ordre, ${K('\\vec v')} d'abord puis ${K('\\vec u')} : on arrive au même point ${K('B')}, ce qui dessine un parallélogramme. Remarquez enfin que la longueur de la somme, que l'on appelle aussi sa norme, n'est presque jamais la somme des longueurs : elle lui est inférieure ou égale. C'est l'inégalité triangulaire, <i>admise ici</i> : vous la connaissez pour les côtés d'un triangle, et sa démonstration générale utilise le produit scalaire de Première.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Même direction : la colinéarité</h4>
    <p>Multiplier un vecteur non nul ${K('\\vec u')} par un nombre ${K('k')} non nul l'allonge, le raccourcit ou le retourne, sans changer sa direction ; pour ${K('k = 0')}, on obtient le vecteur nul. Deux vecteurs sont <b>colinéaires</b> quand l'un est le produit de l'autre par un nombre. Le vecteur nul, qui n'a pas de direction, est donc colinéaire à tous les autres. Réglez ${K('k')} pour voir ${K('k\\vec u')}, puis déplacez l'extrémité de ${K('\\vec w')} et cherchez à le rendre colinéaire à ${K('\\vec u')} : le déterminant vous dit quand c'est fait.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="vc-f3" class="moyen fixe" aria-label="Vecteur u, son multiple k u, et un vecteur w à rendre colinéaire à u"></canvas>
      <div class="side">
        <h5>Le déterminant de <i>u</i> et <i>w</i></h5>
        <dl class="lectures" aria-live="polite">
          <dt><i>u</i></dt><dd id="vc-cu"></dd>
          <dt><i>k</i><i>u</i></dt><dd id="vc-ck"></dd>
          <dt><i>w</i></dt><dd id="vc-cw"></dd>
          <dt>déterminant</dt><dd id="vc-cd"></dd>
        </dl>
        <p class="verdict" id="vc-v3" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="vc-k">nombre <i>k</i></label><input type="range" id="vc-k" min="-3" max="3" step="0.05"><output id="vc-kv"></output>
      <label for="vc-wx"><i>w</i> : abscisse</label><input type="range" id="vc-wx" min="-6" max="6" step="0.05"><output id="vc-wxv"></output>
      <label for="vc-wy"><i>w</i> : ordonnée</label><input type="range" id="vc-wy" min="-4" max="4" step="0.05"><output id="vc-wyv"></output>
    </div>
  </div>
  <div class="col">
    <div class="def"><p>Dans un repère, le <b>déterminant</b> de ${K('\\vec u(x \\,;\\, y)')} et ${K("\\vec w(x' \\,;\\, y')")} est le nombre ${K("xy' - x'y")}. Les vecteurs ${K('\\vec u')} et ${K('\\vec w')} sont colinéaires si, et seulement si, ce nombre est nul.</p></div>
    <p>Un sens se vérifie d'un calcul : si ${K('\\vec w = k\\vec u')}, alors ${K("xy' - x'y = x \\times ky - kx \\times y = 0")}, et de même si ${K('\\vec u = k\\vec w')}. Réciproquement, supposons ${K("xy' - x'y = 0")}. Si ${K('\\vec u')} est nul, alors ${K('\\vec u = 0 \\times \\vec w')}. Sinon, l'une de ses coordonnées n'est pas nulle. Si c'est ${K('x')}, on pose ${K("k = \\dfrac{x'}{x}")} : alors ${K("x' = kx")}, et l'égalité ${K("xy' = x'y")} donne ${K("y' = ky")} après division par ${K('x')}, donc ${K('\\vec w = k\\vec u')}. Si c'est ${K('y')}, on pose de même ${K("k = \\dfrac{y'}{y}")}. L'activité <a href="#activites/ordonner">Démonstrations à remettre en ordre</a> propose de reconstituer cette preuve. C'est ce critère qui sert ensuite à reconnaître trois points alignés ou deux droites parallèles.</p>
  </div>
</section>
` + suite(
  `Confondre un vecteur avec l'une de ses flèches. ${K("\\overrightarrow{AA'}")} et ${K("\\overrightarrow{BB'}")} partent de deux points différents et sont pourtant le même vecteur ; à l'inverse, ${K('\\overrightarrow{AB}')} et ${K('\\overrightarrow{BA}')} ont la même direction et la même longueur, mais des sens contraires : ils sont opposés. L'autre erreur fréquente est d'ajouter les longueurs : pour ${K('\\vec u(3 \\,;\\, 0)')} et ${K('\\vec v(0 \\,;\\, 4)')}, la somme ${K('(3 \\,;\\, 4)')} a pour longueur 5, et non 7.`,
  `Le chapitre de Seconde <a href="#cours/s-10">Vecteurs</a> définit la translation, la somme et le produit par un réel, et énonce le critère de colinéarité par le déterminant, démontré ci-dessus. Dans l'édifice, les fiches <a href="#alglin.v-espace">Espace vectoriel</a> et <a href="#alglin.v-combinaisons">Combinaisons linéaires</a> reprennent ces deux opérations comme point de départ de toute l'algèbre linéaire.`,
  `Toutes les coordonnées avancent par pas de 0,05 et sont traitées comme des entiers, en vingtièmes : les sommes, les différences et le déterminant sont exacts, et le test « déterminant nul » ne dépend d'aucun arrondi. Un point que l'on déplace s'accroche légèrement aux points à coordonnées entières. Les longueurs, calculées par le théorème de Pythagore dans ce repère orthonormé, sont arrondies à 10⁻². Rien n'est enregistré ni envoyé.`);

export function monter(racine) {
  const q = s => racine.querySelector(s);
  // Tout est en vingtièmes entiers.
  const E = { ux: 60, uy: 20, A: [-80, -40], B: [-20, -50], C: [-50, 10], ax: 60, ay: 40, bx: 20, by: -60, k: 30, wx: -60, wy: -20, u3: [40, 20] };
  const V = {}; let pris = null;
  const v20 = n => n / 20, co = (x, y) => `(${frc(v20(x), 2)} ; ${frc(v20(y), 2)})`;
  const aimant = t => { const e = Math.round(t); return Math.abs(t - e) < 0.13 ? e * 20 : Math.round(t * 20); };
  const fleche = (ctx, x0, y0, x1, y1, couleur, ep = 3, tirets) => { ctx.strokeStyle = couleur; ctx.fillStyle = couleur; ctx.lineWidth = ep; ctx.setLineDash(tirets || []); trait(ctx, x0, y0, x1, y1); ctx.setLineDash([]);
    const a = Math.atan2(y1 - y0, x1 - x0), L = 4 + 3 * ep; if (Math.hypot(x1 - x0, y1 - y0) < 6) return; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 - L * Math.cos(a - .4), y1 - L * Math.sin(a - .4)); ctx.lineTo(x1 - L * Math.cos(a + .4), y1 - L * Math.sin(a + .4)); ctx.closePath(); ctx.fill(); };
  const lier = (id, cle, apres) => q('#vc-' + id).addEventListener('input', e => { E[cle] = Math.round(+e.target.value * 20); if (apres) apres(); S.planifier(); });
  lier('ux', 'ux'); lier('uy', 'uy'); lier('ax', 'ax'); lier('ay', 'ay'); lier('bx', 'bx'); lier('by', 'by'); lier('k', 'k'); lier('wx', 'wx'); lier('wy', 'wy');
  const curseur = (id, val) => { const r = q('#vc-' + id); if (Math.round(+r.value * 20) !== val) r.value = v20(val); ecrire(q('#vc-' + id + 'v'), fr(v20(val), 2)); };

  function rendre(C) {
    // --- 1. translation ---
    { const { ctx, w, h } = toile(q('#vc-f1')), v = vueEgale(w, h, 0, 0, Math.max(7.2, 5 * w / h)); V.f1 = v; grille(ctx, v, C, true);
      const P = [E.A, E.B, E.C], I = P.map(p => [p[0] + E.ux, p[1] + E.uy]), X = p => v.X(v20(p[0])), Y = p => v.Y(v20(p[1]));
      const tri = (T, couleur, alpha) => { ctx.beginPath(); ctx.moveTo(X(T[0]), Y(T[0])); ctx.lineTo(X(T[1]), Y(T[1])); ctx.lineTo(X(T[2]), Y(T[2])); ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = couleur; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = couleur; ctx.lineWidth = 2; ctx.stroke(); };
      tri(P, C.doux, .12); tri(I, C.vert, .16);
      P.forEach((p, i) => fleche(ctx, X(p), Y(p), X(I[i]), Y(I[i]), C.bleu, 2));
      P.forEach((p, i) => { poignee(ctx, C, X(p), Y(p), C.encre, 'ABC'[i], true); pastille(ctx, X(I[i]), Y(I[i]), C.vert, 4); etiquette(ctx, C, 'ABC'[i] + '′', X(I[i]) + 13, Y(I[i]) - 12, C.vert, 'center', 14); });
      // le vecteur u lui-même, dessiné depuis l'origine
      fleche(ctx, v.X(0), v.Y(0), v.X(v20(E.ux)), v.Y(v20(E.uy)), C.orange, 3); poignee(ctx, C, v.X(v20(E.ux)), v.Y(v20(E.uy)), C.orange, 'u', E.uy < 0);
      etiquette(ctx, C, 'O', v.X(0) - 11, v.Y(0) + 13, C.doux, 'center', 12);
      curseur('ux', E.ux); curseur('uy', E.uy);
      ecrire(q('#vc-u1'), co(E.ux, E.uy));
      ['aa', 'bb', 'cc'].forEach((id, i) => ecrire(q('#vc-' + id), `${co(P[i][0], P[i][1])} → ${co(I[i][0], I[i][1])}`));
      ecrire(q('#vc-v1'), E.ux === 0 && E.uy === 0 ? "Le vecteur est nul : la translation ne déplace aucun point, et le triangle est confondu avec son image." : `On ajoute ${frc(v20(E.ux), 2)} à l'abscisse de chaque point et ${frc(v20(E.uy), 2)} à son ordonnée : les trois flèches bleues et la flèche orange représentent le même vecteur.`); }
    // --- 2. somme ---
    { const { ctx, w, h } = toile(q('#vc-f2')), v = vueEgale(w, h, 0, 0, Math.max(7.2, 5 * w / h)); V.f2 = v; grille(ctx, v, C, true);
      const { ax, ay, bx, by } = E, sx = ax + bx, sy = ay + by, O = [v.X(0), v.Y(0)], A = [v.X(v20(ax)), v.Y(v20(ay))], B = [v.X(v20(sx)), v.Y(v20(sy))], D = [v.X(v20(bx)), v.Y(v20(by))];
      fleche(ctx, O[0], O[1], D[0], D[1], C.orange, 1.5, [5, 5]); fleche(ctx, D[0], D[1], B[0], B[1], C.bleu, 1.5, [5, 5]);
      fleche(ctx, O[0], O[1], B[0], B[1], C.vert, 4); fleche(ctx, O[0], O[1], A[0], A[1], C.bleu, 3); fleche(ctx, A[0], A[1], B[0], B[1], C.orange, 3);
      poignee(ctx, C, A[0], A[1], C.bleu, 'A', ay < 0); poignee(ctx, C, B[0], B[1], C.orange, 'B', sy < 0); etiquette(ctx, C, 'O', O[0] - 11, O[1] + 13, C.doux, 'center', 12);
      curseur('ax', ax); curseur('ay', ay); curseur('bx', bx); curseur('by', by);
      const nu = Math.hypot(ax, ay) / 20, nv = Math.hypot(bx, by) / 20, ns = Math.hypot(sx, sy) / 20, det = ax * by - ay * bx, ps = ax * bx + ay * by;
      ecrire(q('#vc-su'), co(ax, ay)); ecrire(q('#vc-sv'), co(bx, by)); ecrire(q('#vc-ss'), `${co(sx, sy)}`);
      let dk = 2; while (dk < 6 && fr(ns, dk) === fr(nu + nv, dk)) dk++;   // assez de décimales pour que deux longueurs distinctes ne s'écrivent pas de la même façon
      ecrire(q('#vc-sl'), `≈ ${fr(nu, 2)} + ${fr(nv, 2)} ≈ ${fr(nu + nv, dk)} ; somme : ≈ ${fr(ns, dk)}`);
      const nulU = !ax && !ay, nulV = !bx && !by;
      ecrire(q('#vc-v2'), nulU || nulV ? "L'un des deux vecteurs est nul : la somme est égale à l'autre." : sx === 0 && sy === 0 ? "Les deux vecteurs sont opposés : leur somme est le vecteur nul, et l'on revient au point de départ." : det === 0 && ps > 0 ? "Les deux vecteurs ont la même direction et le même sens : pour deux vecteurs non nuls, c'est le seul cas où la longueur de la somme est la somme des longueurs." : det === 0 ? "Les deux vecteurs ont la même direction et des sens contraires : la longueur de la somme est la différence entre la plus grande et la plus petite des deux longueurs." : `La somme a pour longueur environ ${fr(ns, dk)}, strictement moins que ${fr(nu + nv, dk)} : le chemin direct de O à B est plus court que le détour par A.`); }
    // --- 3. colinéarité ---
    { const { ctx, w, h } = toile(q('#vc-f3')), v = vueEgale(w, h, 0, 0, Math.max(7.2, 5 * w / h)); V.f3 = v; grille(ctx, v, C, true);
      const [x, y] = E.u3, { k, wx, wy } = E, kx = k * x / 20, ky = k * y / 20, O = [v.X(0), v.Y(0)], det = x * wy - y * wx;   // det en 1/400
      const n = Math.hypot(x, y); if (n) { ctx.strokeStyle = C.doux; ctx.lineWidth = 1; ctx.setLineDash([5, 5]); trait(ctx, v.X(-12 * x / n), v.Y(-12 * y / n), v.X(12 * x / n), v.Y(12 * y / n)); ctx.setLineDash([]); }
      fleche(ctx, O[0], O[1], v.X(v20(kx)), v.Y(v20(ky)), C.vert, 6); fleche(ctx, O[0], O[1], v.X(v20(x)), v.Y(v20(y)), C.bleu, 3); fleche(ctx, O[0], O[1], v.X(v20(wx)), v.Y(v20(wy)), C.orange, 3);
      poignee(ctx, C, v.X(v20(x)), v.Y(v20(y)), C.bleu, 'u', y < 0); poignee(ctx, C, v.X(v20(wx)), v.Y(v20(wy)), C.orange, 'w', wy < 0); etiquette(ctx, C, 'O', O[0] - 11, O[1] + 13, C.doux, 'center', 12);
      curseur('k', k); curseur('wx', wx); curseur('wy', wy);
      ecrire(q('#vc-cu'), co(x, y)); ecrire(q('#vc-ck'), `${frc(v20(k), 2)} × ${co(x, y)} = (${frc(kx / 20, 4)} ; ${frc(ky / 20, 4)})`); ecrire(q('#vc-cw'), co(wx, wy));
      const par = t => t < 0 ? '(' + frc(t, 2) + ')' : frc(t, 2);
      ecrire(q('#vc-cd'), `${par(v20(x))} × ${par(v20(wy))} − ${par(v20(y))} × ${par(v20(wx))} = ${frc(det / 400, 4)}`);
      const nulU = !x && !y, nulW = !wx && !wy;
      ecrire(q('#vc-v3'), nulU ? "Le vecteur u est nul : il est colinéaire à tout vecteur, puisque u = 0 × w." : nulW ? "Le vecteur w est nul : il est colinéaire à u, puisque w = 0 × u." : det === 0 ? (() => { const [n1, d1] = x ? [wx, x] : [wy, y], exact = (n1 * 10000) % d1 === 0; return `Le déterminant est exactement nul : w est colinéaire à u, et w ${exact ? '=' : '≈'} ${frc(n1 / d1, 4)} × u.`; })() : `Le déterminant n'est pas nul : w n'est pas colinéaire à u. Amenez son extrémité sur la droite en pointillés.`); }
  }
  const S = scene(racine, rendre);
  const bx = t => borne(t, -140, 140), by = t => borne(t, -100, 100);
  glisser(q('#vc-f1'), (p, phase) => { const v = V.f1; if (!v) return; const X = t => v.X(v20(t)), Y = t => v.Y(v20(t));
    if (phase === 'debut') { const cibles = [['u', E.ux, E.uy], ['A', ...E.A], ['B', ...E.B], ['C', ...E.C]]; pris = cibles.map(c => [c[0], Math.hypot(p.x - X(c[1]), p.y - Y(c[2]))]).sort((a, b) => a[1] - b[1])[0][0]; }
    const x = aimant(v.ix(p.x)), y = aimant(v.iy(p.y));
    if (pris === 'u') { E.ux = borne(x, -120, 120); E.uy = borne(y, -80, 80); } else E[pris] = [bx(x), by(y)]; S.planifier(); });
  glisser(q('#vc-f2'), (p, phase) => { const v = V.f2; if (!v) return;
    if (phase === 'debut') pris = Math.hypot(p.x - v.X(v20(E.ax)), p.y - v.Y(v20(E.ay))) <= Math.hypot(p.x - v.X(v20(E.ax + E.bx)), p.y - v.Y(v20(E.ay + E.by))) ? 'A' : 'B';
    const x = aimant(v.ix(p.x)), y = aimant(v.iy(p.y));
    if (pris === 'A') { const sx = E.ax + E.bx, sy = E.ay + E.by; E.ax = borne(x, -100, 100); E.ay = borne(y, -80, 80); E.bx = borne(sx - E.ax, -100, 100); E.by = borne(sy - E.ay, -80, 80); }   // B reste en place quand on déplace A
    else { E.bx = borne(x - E.ax, -100, 100); E.by = borne(y - E.ay, -80, 80); } S.planifier(); });
  glisser(q('#vc-f3'), (p, phase) => { const v = V.f3; if (!v) return;
    if (phase === 'debut') pris = Math.hypot(p.x - v.X(v20(E.u3[0])), p.y - v.Y(v20(E.u3[1]))) <= Math.hypot(p.x - v.X(v20(E.wx)), p.y - v.Y(v20(E.wy))) ? 'u' : 'w';
    const x = aimant(v.ix(p.x)), y = aimant(v.iy(p.y));
    if (pris === 'u') E.u3 = [borne(x, -120, 120), borne(y, -80, 80)]; else { E.wx = borne(x, -120, 120); E.wy = borne(y, -80, 80); } S.planifier(); });
  return S.arreter;
}
