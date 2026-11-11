// Exploration « Une matrice déforme le plan » (rubrique Activités, MEMO_atlas_activites.md §126).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, etiquette, poignee, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Maths expertes, Maths Sup · Matrices</p>
  <h3>Une matrice déforme le plan</h3>
  <p class="lede">Une matrice carrée de taille 2 n'est pas seulement un tableau de quatre nombres : c'est une transformation du plan. Ses deux colonnes disent où vont les deux vecteurs de base, et son déterminant, de combien elle multiplie les aires.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Lire une matrice sur ses colonnes</h4>
    <p>La matrice <i>M</i> envoie le vecteur (1 ; 0) sur sa première colonne, <b class="c-mark">(<i>a</i> ; <i>c</i>)</b>, et le vecteur (0 ; 1) sur sa seconde colonne, <b class="c-sec">(<i>b</i> ; <i>d</i>)</b>. Tout le reste suit par linéarité : le carré unité devient le parallélogramme construit sur ces deux colonnes, et la lettre F, dessinée dans ce carré, montre comment le plan est déformé. Déplacez les extrémités des deux colonnes, réglez les coefficients, ou essayez les exemples.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="mx-fig" class="carre fixe" aria-label="Le carré unité et la lettre F, et leurs images par la matrice M"></canvas>
      <div class="side">
        <h5>La matrice <i>M</i></h5>
        <p class="verdict" id="mx-m" style="font-family:var(--f-mono);white-space:pre"></p>
        <dl class="lectures" aria-live="polite">
          <dt>det <i>M</i> = <i>ad</i> − <i>bc</i></dt><dd id="mx-det"></dd>
          <dt>aire de l'image du carré</dt><dd id="mx-aire"></dd>
          <dt>valeurs propres</dt><dd id="mx-vp"></dd>
        </dl>
        <p class="verdict" id="mx-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="mx-a"><i>a</i></label><input type="range" id="mx-a" min="-2.5" max="2.5" step="0.05"><output id="mx-av"></output>
      <label for="mx-b"><i>b</i></label><input type="range" id="mx-b" min="-2.5" max="2.5" step="0.05"><output id="mx-bv"></output>
      <label for="mx-c"><i>c</i></label><input type="range" id="mx-c" min="-2.5" max="2.5" step="0.05"><output id="mx-cv"></output>
      <label for="mx-d"><i>d</i></label><input type="range" id="mx-d" min="-2.5" max="2.5" step="0.05"><output id="mx-dv"></output>
    </div>
    <div class="bar"><span class="chips" id="mx-ex"></span><label><input type="checkbox" id="mx-dir"> montrer les directions propres</label></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Le déterminant, une aire avec un signe</h4>
    <p>Le nombre <i>ad</i> − <i>bc</i> est le <b>déterminant</b> de <i>M</i>. Sa valeur absolue est l'aire du parallélogramme image du carré unité, et plus généralement le facteur par lequel <i>M</i> multiplie toutes les aires. Son signe dit si la figure est retournée : quand il est négatif, le F apparaît comme dans un miroir.</p>
    <p class="def">La matrice <i>M</i> est inversible si, et seulement si, son déterminant n'est pas nul. Quand il est nul, les deux colonnes sont colinéaires et tout le plan est écrasé sur une droite, ou sur un point.</p>
    <p>Faites tourner la seconde colonne jusqu'à l'aligner avec la première : l'aire fond, le déterminant passe par 0, puis change de signe, et le F se retourne.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Les directions qui ne tournent pas</h4>
    <p>Cochez « montrer les directions propres ». Pour la plupart des vecteurs, l'image n'a pas la même direction que le vecteur de départ. Mais il peut exister des droites passant par l'origine que <i>M</i> envoie sur elles-mêmes : sur une telle droite, <i>M</i> se contente de multiplier par un nombre λ, une <b>valeur propre</b>. Ces nombres sont les racines du trinôme λ² − (<i>a</i> + <i>d</i>)λ + (<i>ad</i> − <i>bc</i>).</p>
    <p>Essayez la rotation d'un quart de tour : aucune droite n'est conservée, et le trinôme n'a pas de racine réelle. Essayez le cisaillement : une seule direction est conservée.</p>
  </div>
</section>
` + suite(
  "Prendre le déterminant pour une aire, alors que c'est une aire munie d'un signe, et lui prêter des règles qu'il n'a pas. La symétrie d'axe horizontal a pour déterminant −1 : elle conserve les aires et retourne le plan. Et le déterminant d'une somme n'est pas la somme des déterminants : la matrice identité et son opposée ont toutes deux pour déterminant 1, alors que leur somme, la matrice nulle, a pour déterminant 0.",
  "Les chapitres de Maths expertes <a href=\"#cours/me-03\">Matrices</a> et <a href=\"#cours/me-06\">Applications des matrices</a>, puis celui de Maths Sup <a href=\"#cours/ma-16\">Matrices</a>, introduisent ces transformations. Dans l'édifice : <a href=\"#v-det.v-det-matrice\">Déterminant d'une matrice carrée</a> pour le déterminant en toute dimension, et <a href=\"#alglin.v-valeurs-propres\">Valeurs propres et diagonalisation</a>.",
  "Les coefficients avancent par pas de 0,05 et sont traités en vingtièmes entiers : le déterminant <i>ad</i> − <i>bc</i> et le discriminant (<i>a</i> − <i>d</i>)² + 4<i>bc</i> sont exacts, de sorte que les cas « déterminant nul » et « valeur propre double » sont reconnus sans erreur d'arrondi. Les valeurs propres sont arrondies à 10⁻³. Rien n'est enregistré ni envoyé.");

const EX = [['identité', 1, 0, 0, 1], ['quart de tour', 0, -1, 1, 0], ['cisaillement', 1, 1, 0, 1], ['symétrie', 1, 0, 0, -1], ['étirement', 2, 0, 0, 0.5], ['projection', 1, 0, 0, 0], ['mélange', 1.5, 0.5, 0.5, 1]];
const F = [[0.2, 0.1], [0.2, 0.9], [0.75, 0.9], [0.75, 0.72], [0.4, 0.72], [0.4, 0.58], [0.65, 0.58], [0.65, 0.4], [0.4, 0.4], [0.4, 0.1]];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { a: 1.5, b: 0.5, c: 0.5, d: 1, dir: false };
  let V = null, pris = null;
  for (const k of ['a', 'b', 'c', 'd']) q('#mx-' + k).addEventListener('input', e => { E[k] = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  q('#mx-dir').addEventListener('change', e => { E.dir = e.target.checked; S.planifier(); });
  EX.forEach(([nom, a, b, c, d]) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = nom;
    bt.addEventListener('click', () => { Object.assign(E, { a, b, c, d }); S.planifier(); }); q('#mx-ex').append(bt); });
  function rendre(C) {
    const { a, b, c, d } = E, I = t => Math.round(t * 20), det400 = I(a) * I(d) - I(b) * I(c), det = det400 / 400;
    const disc400 = (I(a) - I(d)) * (I(a) - I(d)) + 4 * I(b) * I(c), tr = a + d;   // discriminant du trinôme, × 400
    const img = ([x, y]) => [a * x + b * y, c * x + d * y];
    const { ctx, w, h } = toile(q('#mx-fig')), v = vueEgale(w, h, 0, 0, 2.8 * Math.max(1, w / h)); V = v;
    grille(ctx, v, C, true);
    const poly = (pts, coul, alpha, ep) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(v.X(p[0]), v.Y(p[1])) : ctx.moveTo(v.X(p[0]), v.Y(p[1]))); ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = coul; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = coul; ctx.lineWidth = ep; ctx.stroke(); };
    const carre = [[0, 0], [1, 0], [1, 1], [0, 1]];
    ctx.setLineDash([4, 4]); poly(carre, C.doux, 0.06, 1.2); poly(F, C.doux, 0.12, 1); ctx.setLineDash([]);
    poly(carre.map(img), det400 < 0 ? C.violet : C.vert, 0.16, 2); poly(F.map(img), C.encre, 0.5, 1.2);
    if (E.dir && disc400 >= 0) { const s = Math.sqrt(disc400) / 20;
      for (const l of disc400 === 0 ? [tr / 2] : [(tr - s) / 2, (tr + s) / 2]) { let ux = b, uy = l - a; if (Math.abs(ux) + Math.abs(uy) < 1e-9) { ux = l - d; uy = c; } if (Math.abs(ux) + Math.abs(uy) < 1e-9) continue;
        const n = Math.hypot(ux, uy); ctx.strokeStyle = C.orange; ctx.lineWidth = 1.6; ctx.setLineDash([7, 5]); trait(ctx, v.X(-9 * ux / n), v.Y(-9 * uy / n), v.X(9 * ux / n), v.Y(9 * uy / n)); ctx.setLineDash([]); } }
    const O = [v.X(0), v.Y(0)];
    ctx.lineWidth = 3; ctx.strokeStyle = C.bleu; trait(ctx, O[0], O[1], v.X(a), v.Y(c)); ctx.strokeStyle = C.orange; trait(ctx, O[0], O[1], v.X(b), v.Y(d));
    poignee(ctx, C, v.X(a), v.Y(c), C.bleu, '', false); poignee(ctx, C, v.X(b), v.Y(d), C.orange, '', false);
    for (const k of ['a', 'b', 'c', 'd']) { const r = q('#mx-' + k); if (Math.abs(+r.value - E[k]) > 1e-9) r.value = E[k]; ecrire(q('#mx-' + k + 'v'), fr(E[k], 2)); }
    const col = t => frc(t).padStart(6, ' ');
    ecrire(q('#mx-m'), `(${col(a)} ${col(b)} )\n(${col(c)} ${col(d)} )`);
    ecrire(q('#mx-det'), frc(det, 4)); ecrire(q('#mx-aire'), frc(Math.abs(det), 4));
    const s = disc400 >= 0 ? Math.sqrt(disc400) / 20 : 0;
    ecrire(q('#mx-vp'), disc400 < 0 ? 'aucune valeur propre réelle' : disc400 === 0 ? `λ = ${fr(tr / 2, 3)} (double)` : `λ₁ ≈ ${fr((tr - s) / 2, 3)} ; λ₂ ≈ ${fr((tr + s) / 2, 3)}`);
    ecrire(q('#mx-verdict'), det400 === 0 ? (a || b || c || d ? "Le déterminant est exactement 0 : les deux colonnes sont colinéaires, le carré est écrasé sur un segment et M n'est pas inversible." : "C'est la matrice nulle : tout le plan est envoyé sur l'origine.")
      : det400 > 0 ? `Le déterminant est positif : les aires sont multipliées par ${frc(det, 4)} et le F garde son sens.` : `Le déterminant est négatif : les aires sont multipliées par ${frc(-det, 4)} et le F est retourné, comme dans un miroir.`);
  }
  const S = scene(racine, rendre);
  const aimant = t => { const r = Math.round(t * 20) / 20, e = Math.round(t * 2) / 2; return Math.abs(t - e) < 0.09 ? e : r; };
  glisser(q('#mx-fig'), (p, phase) => {
    if (!V) return; const x = V.ix(p.x), y = V.iy(p.y);
    if (phase === 'debut') pris = Math.hypot(x - E.a, y - E.c) <= Math.hypot(x - E.b, y - E.d) ? ['a', 'c'] : ['b', 'd'];
    E[pris[0]] = borne(aimant(x), -2.5, 2.5); E[pris[1]] = borne(aimant(y), -2.5, 2.5); S.planifier();
  });
  return S.arreter;
}
