// Exploration « L'algorithme d'Euclide en rectangles » (rubrique Activités, MEMO_atlas_activites.md §126).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, etiquette, ecrire } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Maths expertes, Maths Sup · PGCD</p>
  <h3>L'algorithme d'Euclide en rectangles</h3>
  <p class="lede">Prenez un rectangle de côtés entiers <i>a</i> et <i>b</i>, et découpez-y le plus grand carré possible, autant de fois que vous pouvez. Recommencez dans le rectangle qui reste. Le découpage s'arrête toujours, et le côté du dernier carré est le plus grand diviseur commun de <i>a</i> et de <i>b</i>.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Découper en carrés</h4>
    <p>Réglez <i>a</i> et <i>b</i>. Chaque couleur correspond à une étape : on enlève du rectangle restant autant de carrés que possible, de côté égal à son petit côté. Le nombre de carrés enlevés est le <b>quotient</b> de la division euclidienne du grand côté par le petit, et ce qui reste a pour petit côté le <b>reste</b>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ec-fig" class="moyen" aria-label="Rectangle de côtés a et b découpé en carrés par l'algorithme d'Euclide"></canvas>
      <div class="side">
        <h5>Les divisions successives</h5>
        <table id="ec-tab" aria-label="Divisions euclidiennes successives"><tbody></tbody></table>
        <dl class="lectures" aria-live="polite" style="margin-top:8px"><dt>PGCD</dt><dd id="ec-pgcd"></dd><dt>carrés</dt><dd id="ec-nb"></dd><dt>fraction</dt><dd id="ec-fr"></dd></dl>
      </div>
    </div>
    <div class="reglages">
      <label for="ec-a"><i>a</i></label><input type="range" id="ec-a" min="1" max="120" step="1" value="45"><output id="ec-av"></output>
      <label for="ec-b"><i>b</i></label><input type="range" id="ec-b" min="1" max="120" step="1" value="12"><output id="ec-bv"></output>
    </div>
    <div class="bar"><span class="chips" id="ec-ex"></span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi le dernier carré donne le PGCD</h4>
    <p>Écrivons la division euclidienne <i>a</i> = <i>bq</i> + <i>r</i>. Un entier qui divise <i>a</i> et <i>b</i> divise aussi <i>r</i> = <i>a</i> − <i>bq</i> ; un entier qui divise <i>b</i> et <i>r</i> divise aussi <i>a</i> = <i>bq</i> + <i>r</i>. Les couples (<i>a</i> ; <i>b</i>) et (<i>b</i> ; <i>r</i>) ont donc exactement les mêmes diviseurs communs, et en particulier le même plus grand.</p>
    <p class="def">Si <i>a</i> = <i>bq</i> + <i>r</i>, alors PGCD(<i>a</i> ; <i>b</i>) = PGCD(<i>b</i> ; <i>r</i>). Les restes successifs sont des entiers positifs strictement décroissants : l'un d'eux est nul, et le PGCD est le dernier reste non nul.</p>
    <p>Sur la figure, cela se voit : un carré qui pave le rectangle de départ pave chacun des carrés découpés, donc le rectangle restant, et ainsi de suite jusqu'au dernier carré. Celui-ci pave tout : c'est le plus grand carré qui pave le rectangle.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Combien d'étapes ?</h4>
    <p>Comparez 120 et 7, puis 89 et 55. Dans le premier cas, le découpage commence par dix-sept grands carrés et s'achève vite. Dans le second, chaque étape sauf la dernière n'enlève qu'un seul carré, et il faut neuf divisions : 89 et 55 sont deux termes consécutifs de la suite de Fibonacci, et ce sont ces nombres qui font durer l'algorithme le plus longtemps pour leur taille.</p>
    <p>Les quotients successifs ont un autre usage : ils écrivent le rapport <i>a</i>/<i>b</i> comme une fraction à étages, sa <b>fraction continue</b>, affichée à côté de la figure.</p>
  </div>
</section>
` + suite(
  "S'arrêter un cran trop tard et répondre 0, ou un cran trop tôt. Le PGCD est le dernier reste <em>non nul</em>, c'est-à-dire le diviseur de la division qui tombe juste. Pour 45 et 12 : 45 = 12 × 3 + 9, puis 12 = 9 × 1 + 3, puis 9 = 3 × 3 + 0 ; le PGCD est 3, le côté des trois derniers carrés.",
  "Le chapitre de Maths expertes <a href=\"#cours/me-07\">PGCD</a> et celui de Maths Sup <a href=\"#cours/ma-12\">Arithmétique dans ℤ</a> démontrent l'algorithme et en tirent le théorème de Bézout. Dans l'édifice : <a href=\"#z.z-division\">Division euclidienne</a>, puis <a href=\"#z.z-bezout\">PGCD, théorème de Bézout, lemme de Gauss</a>.",
  "Tout est calculé en nombres entiers, par divisions euclidiennes successives : il n'y a aucune approximation. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { a: 45, b: 12 };
  q('#ec-a').addEventListener('input', e => { E.a = +e.target.value; S.planifier(); });
  q('#ec-b').addEventListener('input', e => { E.b = +e.target.value; S.planifier(); });
  for (const [a, b] of [[45, 12], [120, 7], [89, 55], [96, 60], [100, 100]]) { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = a + ' et ' + b;
    bt.addEventListener('click', () => { E.a = a; E.b = b; S.planifier(); }); q('#ec-ex').append(bt); }
  function rendre(C) {
    const A = Math.max(E.a, E.b), B = Math.min(E.a, E.b), etapes = []; let x = A, y = B;
    while (y > 0) { etapes.push([x, y, Math.floor(x / y), x % y]); [x, y] = [y, x % y]; }
    const g = x, { ctx, w, h } = toile(q('#ec-fig')), m = 16, k = Math.min((w - 2 * m) / A, (h - 2 * m) / B), x0 = (w - A * k) / 2, y0 = (h - B * k) / 2;
    const coul = [C.bleu, C.vert, C.orange, C.violet, C.doux];
    // rectangle restant : coin (rx, ry), dimensions (rw, rh) ; on enlève des carrés le long du grand côté
    let rx = 0, ry = 0, rw = A, rh = B, total = 0;
    etapes.forEach(([, c, qn], i) => { const horiz = rw >= rh;
      for (let j = 0; j < qn; j++) { const X = x0 + rx * k, Y = y0 + ry * k, cote = c * k;
        ctx.globalAlpha = i === etapes.length - 1 ? 0.6 : 0.28; ctx.fillStyle = coul[i % coul.length]; ctx.fillRect(X, Y, cote, cote); ctx.globalAlpha = 1;
        ctx.strokeStyle = C.encre; ctx.lineWidth = i === etapes.length - 1 ? 1.4 : 1; ctx.strokeRect(X + .5, Y + .5, cote - 1, cote - 1);
        if (cote > 26 && j === 0) etiquette(ctx, C, String(c), X + cote / 2, Y + cote / 2, C.encre, 'center', cote > 60 ? 15 : 12);
        if (horiz) { rx += c; rw -= c; } else { ry += c; rh -= c; } total++; } });
    for (const [id, val] of [['#ec-a', E.a], ['#ec-b', E.b]]) { if (+q(id).value !== val) q(id).value = val; ecrire(q(id + 'v'), String(val)); }
    ecrire(q('#ec-tab').tBodies[0], etapes.map(([u, c, qn, r], i) => `<tr${r === 0 ? ' class="now"' : ''}><td>${u} = ${c} × ${qn} + ${r}</td></tr>`).join(''), true);
    ecrire(q('#ec-pgcd'), `${g} (dernier reste non nul${etapes.length === 1 ? ' : ici, ' + B + ' divise ' + A : ''})`);
    ecrire(q('#ec-nb'), `${total} carré${total > 1 ? 's' : ''}, en ${etapes.length} étape${etapes.length > 1 ? 's' : ''}`);
    const qs = etapes.map(e => e[2]);
    ecrire(q('#ec-fr'), `${A}/${B} = ${A / g}/${B / g} = [${qs[0]}${qs.length > 1 ? ' ; ' + qs.slice(1).join(', ') : ''}]`);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
