// Exploration « La loi des grands nombres » (rubrique Activités, MEMO_atlas_activites.md §128).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, trait, etiquette, ecrire, fr, frc } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Probabilités</p>
  <h3>La loi des grands nombres</h3>
  <p class="lede">On répète une même expérience, qui réussit avec la probabilité <i>p</i>. La fréquence des succès se rapproche de <i>p</i> : c'est ce qui donne un sens concret au mot « probabilité ». Mais le hasard ne « rattrape » rien pour autant, et c'est le malentendu que cette page veut dissiper.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Lancer, et regarder la fréquence</h4>
    <p>Réglez <i>p</i>, puis lancez : chaque bouton ajoute des épreuves à la série en cours. La <b class="c-sec">fréquence des succès</b> est tracée en fonction du nombre <i>n</i> d'épreuves, sur une échelle où chaque graduation multiplie <i>n</i> par 10. L'<b class="c-tan">entonnoir vert</b> est la zone <i>p</i> ± 2σ/√<i>n</i>, où σ = √(<i>p</i>(1 − <i>p</i>)) : la fréquence s'y trouve le plus souvent. Les séries précédentes restent affichées en gris.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="gn-fig" class="moyen" aria-label="Fréquence des succès en fonction du nombre d'épreuves, et zone p plus ou moins deux sigma sur racine de n"></canvas>
      <div class="side">
        <h5>La série en cours</h5>
        <dl class="lectures" aria-live="polite">
          <dt>épreuves <i>n</i></dt><dd id="gn-n"></dd>
          <dt>succès <i>S<sub>n</sub></i></dt><dd id="gn-s"></dd>
          <dt>fréquence <i>S<sub>n</sub></i>/<i>n</i></dt><dd id="gn-f"></dd>
          <dt>écart <i>S<sub>n</sub></i>/<i>n</i> − <i>p</i></dt><dd id="gn-ef"></dd>
          <dt>écart <i>S<sub>n</sub></i> − <i>np</i></dt><dd id="gn-es"></dd>
          <dt>2σ/√<i>n</i></dt><dd id="gn-b"></dd>
        </dl>
      </div>
    </div>
    <div class="reglages">
      <label for="gn-p"><i>p</i></label><input type="range" id="gn-p" min="0.05" max="0.95" step="0.01" value="0.5"><output id="gn-pv"></output>
    </div>
    <div class="bar"><button type="button" id="gn-10">10 épreuves de plus</button><button type="button" id="gn-100">100 de plus</button><button type="button" class="primary" id="gn-1000">1 000 de plus</button><button type="button" id="gn-10000">10 000 de plus</button><button type="button" id="gn-neuf">Nouvelle série</button><button type="button" id="gn-vide">Tout effacer</button></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>L'énoncé, et la raison de l'entonnoir</h4>
    <p>Le nombre de succès <i>S<sub>n</sub></i> suit la loi binomiale de paramètres <i>n</i> et <i>p</i> : son espérance est <i>np</i>, sa variance <i>np</i>(1 − <i>p</i>). La fréquence <i>S<sub>n</sub></i>/<i>n</i> a donc pour espérance <i>p</i> et pour écart-type σ/√<i>n</i>, qui tend vers 0 : il faut multiplier <i>n</i> par 100 pour diviser cet écart-type par 10.</p>
    <p class="def">Inégalité de Bienaymé-Tchebychev appliquée à la fréquence : pour tout δ &gt; 0, P(|<i>S<sub>n</sub></i>/<i>n</i> − <i>p</i>| ≥ δ) ≤ <i>p</i>(1 − <i>p</i>)/(<i>n</i>δ²). Cette probabilité tend donc vers 0 quand <i>n</i> tend vers l'infini : c'est la loi faible des grands nombres.</p>
    <p id="gn-tch" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le hasard ne compense pas</h4>
    <p>Comparez les deux écarts du tableau. L'écart de la fréquence, <i>S<sub>n</sub></i>/<i>n</i> − <i>p</i>, se resserre. Mais l'écart du nombre de succès, <i>S<sub>n</sub></i> − <i>np</i>, ne se resserre pas du tout : son ordre de grandeur est σ√<i>n</i>, qui grandit. Après 10 000 lancers d'une pièce équilibrée, un écart de 50 faces en trop ou en moins est banal. La fréquence converge parce que cet écart est divisé par <i>n</i>, et non parce que les piles viendraient rattraper les faces.</p>
  </div>
</section>
` + suite(
  "Croire à la compensation : « pile est sorti cinq fois de suite, face a donc plus de chances de sortir ». Les épreuves sont indépendantes, et la sixième a exactement la même loi que la première. La loi des grands nombres ne dit pas que les écarts se corrigent ; elle dit qu'ils se diluent : l'écart entre le nombre de succès et <i>np</i> grandit en général comme √<i>n</i>, mais il est divisé par <i>n</i>.",
  "Le chapitre de Terminale <a href=\"#cours/t-10\">Loi des grands nombres</a> démontre l'inégalité de Bienaymé-Tchebychev et en déduit la loi faible. Dans l'édifice : <a href=\"#proba.p-loi-faible\">Loi faible des grands nombres et théorème de Weierstrass</a>, puis <a href=\"#proba.p-loi-forte\">Loi forte des grands nombres</a>, qui affirme que presque toute série, prise isolément, voit sa fréquence converger.",
  "Les épreuves sont tirées par le générateur de nombres pseudo-aléatoires du navigateur : les séries affichées sont des simulations, différentes à chaque visite, et non des résultats de calcul. L'entonnoir, les bornes et les majorations sont, eux, calculés exactement à partir de <i>p</i> et de <i>n</i>. Une série s'arrête à 100 000 épreuves. Rien n'est enregistré ni envoyé.");

const MAX = 100000;
export function monter(racine) {
  const q = s => racine.querySelector(s);
  let p = 0.5, cur = { S: new Uint32Array(MAX + 1), n: 0 }, anciennes = [];
  const ajouter = k => { k = Math.min(k, MAX - cur.n); for (let i = 0; i < k; i++) { cur.S[cur.n + 1] = cur.S[cur.n] + (Math.random() < p ? 1 : 0); cur.n++; } S.planifier(); };
  const neuve = () => { if (cur.n) { anciennes.push(cur); if (anciennes.length > 6) anciennes.shift(); } cur = { S: new Uint32Array(MAX + 1), n: 0 }; S.planifier(); };
  for (const k of [10, 100, 1000, 10000]) q('#gn-' + k).addEventListener('click', () => ajouter(k));
  q('#gn-neuf').addEventListener('click', neuve);
  q('#gn-vide').addEventListener('click', () => { anciennes = []; cur = { S: new Uint32Array(MAX + 1), n: 0 }; S.planifier(); });
  q('#gn-p').addEventListener('input', e => { p = Math.round(+e.target.value * 100) / 100; anciennes = []; cur = { S: new Uint32Array(MAX + 1), n: 0 }; S.planifier(); });
  function rendre(C) {
    const { ctx, w, h } = toile(q('#gn-fig')), mg = 38, md = 12, mh = 12, mb = 26, sg = Math.sqrt(p * (1 - p));
    const X = n => mg + Math.log10(n) / 5 * (w - mg - md), dy = Math.min(0.5, Math.max(p, 1 - p)), y0 = Math.max(0, p - 0.5), y1 = Math.min(1, p + 0.5), Y = y => mh + (y1 - y) / (y1 - y0) * (h - mh - mb);
    ctx.lineWidth = 1; ctx.strokeStyle = C.filet;
    for (let k = 0; k <= 5; k++) { trait(ctx, X(10 ** k), mh, X(10 ** k), h - mb); etiquette(ctx, C, k === 0 ? '1' : k === 1 ? '10' : k === 2 ? '100' : k === 3 ? '1 000' : k === 4 ? '10 000' : '100 000', X(10 ** k), h - mb + 13, C.doux, k === 5 ? 'right' : k === 0 ? 'left' : 'center', 11); }
    for (let t = Math.ceil(y0 * 10) / 10; t <= y1 + 1e-9; t += 0.1) { trait(ctx, mg, Y(t), w - md, Y(t)); etiquette(ctx, C, fr(t, 1), mg - 6, Y(t), C.doux, 'right', 11); }
    // entonnoir p ± 2σ/√n
    ctx.beginPath(); for (let i = 0; i <= 200; i++) { const n = 10 ** (5 * i / 200); ctx.lineTo(X(n), Y(Math.min(y1, p + 2 * sg / Math.sqrt(n)))); } for (let i = 200; i >= 0; i--) { const n = 10 ** (5 * i / 200); ctx.lineTo(X(n), Y(Math.max(y0, p - 2 * sg / Math.sqrt(n)))); } ctx.closePath();
    ctx.globalAlpha = .16; ctx.fillStyle = C.vert; ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.vert; ctx.lineWidth = 1.6; ctx.setLineDash([6, 4]); trait(ctx, mg, Y(p), w - md, Y(p)); ctx.setLineDash([]); etiquette(ctx, C, 'p', w - md - 4, Y(p) - 9, C.vert, 'right', 12);
    const tracer = (s, coul, ep, alpha) => { if (!s.n) return; ctx.strokeStyle = coul; ctx.lineWidth = ep; ctx.globalAlpha = alpha; ctx.beginPath(); let der = 0;
      for (let i = 0; i <= 700; i++) { const n = Math.min(s.n, Math.max(1, Math.round(10 ** (5 * i / 700)))); if (n === der) continue; der = n; const yy = Y(Math.max(y0, Math.min(y1, s.S[n] / n))); if (n === 1) ctx.moveTo(X(n), yy); else ctx.lineTo(X(n), yy); if (n === s.n) break; } ctx.stroke(); ctx.globalAlpha = 1; };
    anciennes.forEach(s => tracer(s, C.doux, 1.2, .55)); tracer(cur, C.orange, 2.2, 1);
    ecrire(q('#gn-pv'), fr(p, 2)); const n = cur.n, s = cur.S[n];
    ecrire(q('#gn-n'), n.toLocaleString('fr-FR').replace(/[  ]/g, ' ')); ecrire(q('#gn-s'), n ? s.toLocaleString('fr-FR').replace(/[  ]/g, ' ') : '');
    ecrire(q('#gn-f'), n ? fr(s / n, 4) : ''); ecrire(q('#gn-ef'), n ? frc(s / n - p, 4) : ''); ecrire(q('#gn-es'), n ? frc(Math.round((s - n * p) * 100) / 100, 2) : ''); ecrire(q('#gn-b'), n ? fr(2 * sg / Math.sqrt(n), 4) : '');
    for (const k of [10, 100, 1000, 10000]) q('#gn-' + k).disabled = n >= MAX;
    const nb = d => Math.ceil(p * (1 - p) / (0.05 * d * d));
    ecrire(q('#gn-tch'), `Pour p = ${fr(p, 2)}, la variance p(1 − p) vaut ${frc(Math.round(p * (1 - p) * 10000) / 10000, 4)}. L'inégalité garantit que la fréquence est à moins de 0,05 de p avec une probabilité d'au moins 95 % dès que n ≥ ${nb(0.05).toLocaleString('fr-FR').replace(/[  ]/g, ' ')}, et à moins de 0,01 de p dès que n ≥ ${nb(0.01).toLocaleString('fr-FR').replace(/[  ]/g, ' ')}. Ces nombres sont suffisants, pas nécessaires : l'inégalité est très prudente, et l'entonnoir montre que la fréquence se resserre en réalité plus tôt.`);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
