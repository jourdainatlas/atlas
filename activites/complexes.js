// Exploration « Multiplier par un nombre complexe » (rubrique Activités, MEMO_atlas_activites.md §125).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, etiquette, poignee, pastille, glisser, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Maths expertes, Maths Sup · Nombres complexes</p>
  <h3>Multiplier par un nombre complexe</h3>
  <p class="lede">Additionner deux nombres complexes, c'est additionner deux vecteurs. Mais que fait la multiplication ? Elle tourne et elle agrandit : les arguments s'ajoutent, les modules se multiplient. Tout le reste, les puissances, les racines de l'unité, en découle.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Tourner et agrandir</h4>
    <p>Déplacez les points d'affixes <b class="c-mark"><i>z</i></b> et <b class="c-sec"><i>w</i></b>, ou réglez leur module et leur argument. Le point d'affixe <b class="c-tan"><i>zw</i></b> suit. Les deux triangles colorés, de sommets 0, 1, <i>z</i> et 0, <i>w</i>, <i>zw</i>, ont toujours la même forme : multiplier par <i>w</i>, c'est appliquer à tout le plan la rotation d'angle arg <i>w</i> suivie de l'agrandissement de rapport |<i>w</i>|, et cette transformation envoie 1 sur <i>w</i> et <i>z</i> sur <i>zw</i>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="cx-fig" class="carre fixe" aria-label="Plan complexe : les points z, w et zw, le cercle unité, et les puissances de z"></canvas>
      <div class="side">
        <h5>Modules et arguments</h5>
        <table id="cx-tab" aria-label="Module et argument de z, de w et de zw"><thead><tr><th></th><th>module</th><th>argument</th></tr></thead><tbody></tbody></table>
        <p class="verdict" id="cx-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="cx-zr">|<i>z</i>|</label><input type="range" id="cx-zr" min="0.2" max="2" step="0.05"><output id="cx-zrv"></output>
      <label for="cx-za">arg <i>z</i></label><input type="range" id="cx-za" min="-180" max="180" step="1"><output id="cx-zav"></output>
      <label for="cx-wr">|<i>w</i>|</label><input type="range" id="cx-wr" min="0.2" max="2" step="0.05"><output id="cx-wrv"></output>
      <label for="cx-wa">arg <i>w</i></label><input type="range" id="cx-wa" min="-180" max="180" step="1"><output id="cx-wav"></output>
    </div>
    <div class="bar"><label><input type="checkbox" id="cx-puiss"> montrer les puissances de <i>z</i></label><span>Racines de l'unité : <span class="chips" id="cx-rac"></span></span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La règle</h4>
    <div class="def"><p>Pour tous nombres complexes non nuls <span class="kx">z</span> et <span class="kx">w</span> :</p><span class="kx kxd">\\begin{aligned} |zw| &= |z| \\times |w|, \\\\[2pt] \\arg(zw) &= \\arg z + \\arg w \\pmod{2\\pi}. \\end{aligned}</span></div>
    <p>C'est une conséquence des formules d'addition du cosinus et du sinus : en écrivant <i>z</i> = <i>r</i>(cos α + i sin α) et <i>w</i> = <i>s</i>(cos β + i sin β), le produit se développe en <i>rs</i>(cos(α + β) + i sin(α + β)). Le tableau le vérifie sur vos valeurs.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Puissances et racines de l'unité</h4>
    <p>Cochez « montrer les puissances de <i>z</i> ». Multiplier encore et encore par <i>z</i>, c'est tourner chaque fois du même angle en multipliant la distance à l'origine par |<i>z</i>| : les points <i>z</i>, <i>z</i>², <i>z</i>³… dessinent une spirale, qui s'éloigne si |<i>z</i>| &gt; 1 et s'enroule vers 0 si |<i>z</i>| &lt; 1.</p>
    <p>Sur le cercle de rayon 1, la spirale devient un cercle. Si de plus l'argument de <i>z</i> est un <i>n</i>-ième de tour, on revient à 1 au bout de <i>n</i> pas : les puissances de <i>z</i> sont les <i>n</i> sommets d'un polygone régulier. Ce sont les <i>n</i> solutions de l'équation <i>z</i><sup><i>n</i></sup> = 1, les <b>racines <i>n</i>-ièmes de l'unité</b>. Les boutons placent <i>z</i> sur la première d'entre elles.</p>
  </div>
</section>
` + suite(
  "Intervertir les deux règles, en ajoutant les modules ou en multipliant les arguments. Pour <i>z</i> = <i>w</i> = i, de module 1 et d'argument 90°, le produit est i² = −1 : son module est 1 × 1 = 1, et non 2, et son argument est 90° + 90° = 180°. L'autre oubli fréquent est que l'équation <i>z</i><sup><i>n</i></sup> = 1 a <i>n</i> solutions dans ℂ, et non la seule solution 1.",
  "Les chapitres de Maths expertes <a href=\"#cours/me-02\">Nombres complexes</a> et <a href=\"#cours/me-05\">Géométrie complexe</a>, puis celui de Maths Sup <a href=\"#cours/ma-04\">Nombres complexes et trigonométrie</a>, établissent la forme trigonométrique et ses règles. Dans l'édifice, les racines de l'unité sont étudiées à la fiche <a href=\"#galois-cyclotomie.gc-cyclotomiques\">Racines de l'unité et polynômes cyclotomiques</a>.",
  "Les affixes sont calculées à partir du module et de l'argument réglés ; le produit est calculé par la formule (<i>a</i> + i<i>b</i>)(<i>c</i> + i<i>d</i>) = (<i>ac</i> − <i>bd</i>) + i(<i>ad</i> + <i>bc</i>), puis son module et son argument sont lus sur le résultat, ce qui permet de constater la règle au lieu de la supposer. Les affichages sont arrondis à 10⁻³ et au dixième de degré. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { zr: 1.2, za: 40, wr: 1.25, wa: 75, puiss: false };   // modules, arguments en degrés
  let V = null, pris = null;
  for (const k of ['zr', 'za', 'wr', 'wa']) q('#cx-' + k).addEventListener('input', e => { E[k] = +e.target.value; S.planifier(); });
  q('#cx-puiss').addEventListener('change', e => { E.puiss = e.target.checked; S.planifier(); });
  const boite = q('#cx-rac');
  for (const n of [3, 4, 5, 6, 8, 12]) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = 'n = ' + n;
    b.addEventListener('click', () => { E.zr = 1; E.za = 360 / n; E.puiss = true; S.planifier(); }); boite.append(b); }
  const rad = d => d * Math.PI / 180, norm = d => { d = ((d + 180) % 360 + 360) % 360 - 180; return d === -180 ? 180 : d; };
  function rendre(C) {
    const a = rad(E.za), b = rad(E.wa), z = [E.zr * Math.cos(a), E.zr * Math.sin(a)], wv = [E.wr * Math.cos(b), E.wr * Math.sin(b)];
    const p = [z[0] * wv[0] - z[1] * wv[1], z[0] * wv[1] + z[1] * wv[0]], pm = Math.hypot(p[0], p[1]), pa = Math.atan2(p[1], p[0]) * 180 / Math.PI;
    const { ctx, w, h } = toile(q('#cx-fig')), v = vueEgale(w, h, 0, 0, 4.2 * Math.max(1, w / h)); V = v;
    grille(ctx, v, C, true);
    const X = c => v.X(c[0]), Y = c => v.Y(c[1]), O = [0, 0], U = [1, 0];
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(v.X(0), v.Y(0), v.X(1) - v.X(0), 0, 7); ctx.stroke();
    const tri = (A, B, D, coul) => { ctx.beginPath(); ctx.moveTo(X(A), Y(A)); ctx.lineTo(X(B), Y(B)); ctx.lineTo(X(D), Y(D)); ctx.closePath(); ctx.globalAlpha = .16; ctx.fillStyle = coul; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = coul; ctx.lineWidth = 1.6; ctx.stroke(); };
    tri(O, U, z, C.bleu); tri(O, wv, p, C.vert);
    if (E.puiss) { ctx.strokeStyle = C.violet; ctx.lineWidth = 1.5; ctx.beginPath(); let c = [1, 0]; ctx.moveTo(X(c), Y(c)); const pts = [];
      for (let k = 1; k <= 24; k++) { c = [c[0] * z[0] - c[1] * z[1], c[0] * z[1] + c[1] * z[0]]; if (Math.hypot(c[0], c[1]) > 40) break; ctx.lineTo(X(c), Y(c)); pts.push(c); }
      ctx.stroke(); pts.forEach((c2, i) => { pastille(ctx, X(c2), Y(c2), C.violet, 3.5); if (i > 0 && i < 6 && Math.hypot(c2[0] - 1, c2[1]) > 0.2) etiquette(ctx, C, 'z' + '²³⁴⁵⁶'[i - 1], X(c2) + 14, Y(c2) - 10, C.violet, 'center', 12); }); }
    pastille(ctx, X(U), Y(U), C.doux, 4); etiquette(ctx, C, '1', X(U) + 9, Y(U) + 13, C.doux, 'center', 12);
    pastille(ctx, X(p), Y(p), C.vert, 6); etiquette(ctx, C, 'zw', X(p) + 16, Y(p) - 12, C.vert, 'center', 14);
    poignee(ctx, C, X(z), Y(z), C.bleu, 'z', false); poignee(ctx, C, X(wv), Y(wv), C.orange, 'w', false);
    for (const [k, d] of [['zr', 2], ['za', 1], ['wr', 2], ['wa', 1]]) { const r = q('#cx-' + k); if (Math.abs(+r.value - E[k]) > 1e-9) r.value = E[k]; ecrire(q('#cx-' + k + 'v'), fr(E[k], k[1] === 'a' ? (Number.isInteger(E[k]) ? 0 : 1) : d) + (k[1] === 'a' ? '°' : '')); }
    if (q('#cx-puiss').checked !== E.puiss) q('#cx-puiss').checked = E.puiss;
    ecrire(q('#cx-tab').tBodies[0], `<tr><td class="c-mark">z</td><td>${fr(E.zr, 3)}</td><td>${fr(E.za, 1)}°</td></tr><tr><td class="c-sec">w</td><td>${fr(E.wr, 3)}</td><td>${fr(E.wa, 1)}°</td></tr><tr class="now"><td class="c-tan">zw</td><td>${fr(pm, 3)}</td><td>${fr(pa === -180 ? 180 : pa, 1)}°</td></tr>`, true);
    const somme = E.za + E.wa;
    ecrire(q('#cx-verdict'), `Modules : ${fr(E.zr, 3)} × ${fr(E.wr, 3)} = ${fr(E.zr * E.wr, 3)}. Arguments : ${fr(E.za, 1)}° + ${fr(E.wa, 1)}° = ${fr(somme, 1)}°` + (Math.abs(somme - norm(somme)) > 1e-9 ? `, c'est-à-dire ${fr(norm(somme), 1)}° à un tour près.` : '.'));
  }
  const S = scene(racine, rendre);
  glisser(q('#cx-fig'), (pt, phase) => {
    if (!V) return; const x = V.ix(pt.x), y = V.iy(pt.y);
    if (phase === 'debut') { const d = (r, a) => Math.hypot(x - r * Math.cos(a * Math.PI / 180), y - r * Math.sin(a * Math.PI / 180)); pris = d(E.zr, E.za) <= d(E.wr, E.wa) ? 'z' : 'w'; }
    E[pris + 'r'] = borne(Math.round(Math.hypot(x, y) * 20) / 20, 0.2, 2); E[pris + 'a'] = Math.round(Math.atan2(y, x) * 180 / Math.PI); if (E[pris + 'a'] === -180) E[pris + 'a'] = 180;
    S.planifier();
  });
  return S.arreter;
}
