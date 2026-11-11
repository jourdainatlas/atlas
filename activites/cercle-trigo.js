// Exploration « Le cercle trigonométrique » (rubrique Activités, MEMO_atlas_activites.md §120).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, vueEgale, trait, courbe, etiquette, poignee, pastille, glisser, ecrire, fr, borne, pgcd } from './figures.js';

export const css = cssCommun + cssFigures + `
/* Cercle et courbes côte à côte, à la même échelle verticale : l'ordonnée de M se reporte à l'horizontale sur la sinusoïde. */
.activites-act .ct-duo { display: grid; grid-template-columns: minmax(230px, 30%) minmax(0, 1fr); }
.activites-act .ct-duo canvas { display: block; width: 100%; height: clamp(250px, 44vh, 380px); max-height: none; touch-action: none; }
.activites-act .ct-duo canvas + canvas { border-left: 1px solid var(--filet); }
.activites-act .ct-lect { display: flex; flex-wrap: wrap; gap: 4px 26px; padding: 10px 16px; border-top: 1px solid var(--filet); }
.activites-act .ct-lect .lectures { display: flex; flex-wrap: wrap; gap: 4px 22px; }
.activites-act .ct-lect .lectures > div { display: flex; gap: 8px; align-items: baseline; }
.activites-act .ct-lect .verdict { margin: 0; flex-basis: 100%; }
@media (max-width: 760px) { .activites-act .ct-duo { grid-template-columns: 1fr; } .activites-act .ct-duo canvas { height: clamp(210px, 32vh, 280px); } .activites-act .ct-duo canvas + canvas { border-left: 0; border-top: 1px solid var(--filet); } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Première · Trigonométrie</p>
  <h3>Le cercle trigonométrique</h3>
  <p class="lede">Le cosinus et le sinus d'un réel ne se calculent pas : ils se lisent, comme l'abscisse et l'ordonnée d'un point du cercle de rayon 1. Faites tourner ce point et regardez ses deux coordonnées se dérouler en deux courbes.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Un point, deux coordonnées, deux courbes</h4>
    <p>On enroule la droite des réels autour du cercle de centre O et de rayon 1, à partir du point I(1 ; 0), dans le sens direct. Le réel <i>t</i> arrive sur un point M. Par définition, <b class="c-mark">cos <i>t</i></b> est l'abscisse de M et <b class="c-sec">sin <i>t</i></b> son ordonnée.</p>
    <p>À droite du cercle, on a reporté <i>t</i> sur un axe horizontal et, au-dessus, les deux coordonnées de M : ce sont les courbes des fonctions <b class="c-mark">cosinus</b> et <b class="c-sec">sinus</b>, tracées à la même échelle que le cercle. Déplacez M sur le cercle, faites glisser le repère vertical sur les courbes, ou réglez <i>t</i> avec le curseur, degré par degré : le trait pointillé horizontal montre que la hauteur de M est exactement celle du point de la sinusoïde.</p>
  </div>
  <div class="fig">
    <div class="ct-duo">
      <canvas id="ct-cercle" aria-label="Cercle trigonométrique : le point M, son abscisse cos t et son ordonnée sin t"></canvas>
      <canvas id="ct-courbes" aria-label="Courbes des fonctions cosinus et sinus entre −2π et 2π, avec la valeur de t choisie"></canvas>
    </div>
    <div class="reglages">
      <label for="ct-k"><i>t</i></label><input type="range" id="ct-k" min="-360" max="360" step="1" value="30"><output id="ct-kv"></output>
    </div>
    <div class="ct-lect">
      <dl class="lectures" aria-live="polite">
        <div><dt><i>t</i></dt><dd id="ct-t"></dd></div>
        <div><dt>en degrés</dt><dd id="ct-deg"></dd></div>
        <div><dt class="c-mark">cos <i>t</i></dt><dd id="ct-cos"></dd></div>
        <div><dt class="c-sec">sin <i>t</i></dt><dd id="ct-sin"></dd></div>
        <div><dt>cos² <i>t</i> + sin² <i>t</i></dt><dd id="ct-pyth"></dd></div>
      </dl>
      <p class="verdict" id="ct-note"></p>
    </div>
  </div>
  <div class="col">
    <p>Comme OM = 1, le théorème de Pythagore donne cos² <i>t</i> + sin² <i>t</i> = 1 pour tout réel <i>t</i>. Et comme un tour complet mesure 2π, les réels <i>t</i> et <i>t</i> + 2π arrivent au même point : cosinus et sinus sont périodiques de période 2π, et leurs courbes se répètent.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Dérouler le cercle</h4>
    <p>Faites faire à M un tour complet, lentement. Son ordonnée monte de 0 à 1 pendant le premier quart de tour, redescend à 0, plonge à −1, puis revient : la sinusoïde n'est rien d'autre que ce va-et-vient vertical, étalé le long de l'axe des <i>t</i>. Le cosinus fait le même mouvement, mais c'est une abscisse : il part de 1 au lieu de 0, avec un quart de tour d'avance.</p>
    <p>Les deux courbes ont donc la même forme : celle du sinus est celle du cosinus décalée de π/2 vers la droite, ce que dit la formule sin <i>t</i> = cos(<i>t</i> − π/2).</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Les angles associés</h4>
    <p>Choisissez un second réel, lié à <i>t</i> : <span class="chips" id="ct-assoc"></span></p>
    <p>Le point <b class="c-tan">M′</b> qui lui correspond apparaît sur le cercle de la figure. <span id="ct-sym"></span></p>
    <p class="def" id="ct-formule" aria-live="polite"></p>
    <p>Ces formules ne s'apprennent pas par cœur : elles se relisent sur le cercle, en comparant les coordonnées de M et de M′.</p>
  </div>
</section>
` + suite(
  "Les erreurs de signe : cos(π − <i>t</i>) vaut −cos <i>t</i>, mais sin(π − <i>t</i>) vaut sin <i>t</i>, et l'on confond facilement les deux. L'autre piège est l'unité : sur le cercle, <i>t</i> est une longueur d'arc, donc un nombre de radians ; une calculatrice réglée en degrés donne cos 3 ≈ 0,9986 au lieu de cos 3 ≈ −0,9900.",
  "Le chapitre de Première <a href=\"#cours/p-06\">Trigonométrie</a> définit l'enroulement de la droite sur le cercle et établit les formules des angles associés. L'édifice construit le cosinus et le sinus sans figure, à partir de l'exponentielle : voir la fiche <a href=\"#ar-trigo.tg-prolongement\">Prolongement du cosinus et du sinus à ℝ</a> et, pour le nombre π et le parcours du cercle, la fiche <a href=\"#ar-trigo.tg-cercle\">Zéros, périodes et paramétrage du cercle</a>.",
  "Pour les multiples de π/6 et de π/4, les valeurs exactes affichées (1/2, √2/2, √3/2…) viennent d'une table, et non d'un arrondi ; les valeurs décimales sont arrondies à 10⁻⁴. L'angle avance par degrés entiers et s'accroche, quand on relâche le point, au multiple de π/12 le plus proche s'il est à moins de deux degrés. Rien n'est enregistré ni envoyé.");

// t = kπ/12 : écriture en fraction de π, et valeurs exactes pour les multiples de π/6 et de π/4.
const EXACT = { 0: '1', 2: '√3/2', 3: '√2/2', 4: '1/2', 6: '0', 8: '−1/2', 9: '−√2/2', 10: '−√3/2', 12: '−1' };
function cosExact(k) { k = ((k % 24) + 24) % 24; if (k > 12) k = 24 - k; return EXACT[k] ?? null; }
const sinExact = k => cosExact(k - 6);
function enPi(k, d0 = 12) {   // k·π/d0 en fraction irréductible de π
  if (k === 0) return '0';
  const g = pgcd(k, d0), n = k / g, d = d0 / g;
  return (n < 0 ? '−' : '') + (Math.abs(n) === 1 ? '' : Math.abs(n)) + 'π' + (d === 1 ? '' : '/' + d);
}
// Angles associés : image t′ de t, formules, symétrie qui envoie M sur M′.
const ASSOC = [
  { id: 'aucun', nom: 'aucun' },
  { id: 'opp', nom: '−t', f: t => -t, kf: k => -k, cos: 'cos(−t) = cos t', sin: 'sin(−t) = −sin t', sym: "M′ est le symétrique de M par rapport à l'axe des abscisses : même abscisse, ordonnée opposée." },
  { id: 'sup', nom: 'π − t', f: t => Math.PI - t, kf: k => 12 - k, cos: 'cos(π − t) = −cos t', sin: 'sin(π − t) = sin t', sym: "M′ est le symétrique de M par rapport à l'axe des ordonnées : abscisse opposée, même ordonnée." },
  { id: 'dia', nom: 'π + t', f: t => Math.PI + t, kf: k => 12 + k, cos: 'cos(π + t) = −cos t', sin: 'sin(π + t) = −sin t', sym: "M′ est le symétrique de M par rapport à O : les deux coordonnées changent de signe." },
  { id: 'com', nom: 'π/2 − t', f: t => Math.PI / 2 - t, kf: k => 6 - k, cos: 'cos(π/2 − t) = sin t', sin: 'sin(π/2 − t) = cos t', sym: "M′ est le symétrique de M par rapport à la droite d'équation y = x : les deux coordonnées s'échangent." },
  { id: 'qua', nom: 'π/2 + t', f: t => Math.PI / 2 + t, kf: k => 6 + k, cos: 'cos(π/2 + t) = −sin t', sin: 'sin(π/2 + t) = cos t', sym: "M′ est l'image de M par le quart de tour direct de centre O : le point (x ; y) devient (−y ; x)." },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  // t = deg·π/180, deg entier entre −360 et 360 ; k = deg/15 quand t est un multiple de π/12 (valeurs exactes), sinon null.
  const E = { deg: 30, k: 2, t: Math.PI / 6, assoc: 'aucun' };
  let V1 = null, V2 = null;
  const poser = (t, accroche) => {
    let deg = borne(Math.round(t * 180 / Math.PI), -360, 360);
    if (accroche) { const m = Math.round(deg / 15) * 15; if (Math.abs(deg - m) <= 2) deg = m; }
    E.deg = deg; E.t = deg * Math.PI / 180; E.k = deg % 15 === 0 ? deg / 15 : null;
    S.planifier();
  };
  const boite = q('#ct-assoc');
  ASSOC.forEach(a => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = a.nom; b.dataset.a = a.id;
    b.addEventListener('click', () => { E.assoc = a.id; S.planifier(); }); boite.append(b); });
  q('#ct-k').addEventListener('input', e => poser(+e.target.value * Math.PI / 180, false));

  function rendre(C) {
    const t = E.t, c = Math.cos(t), s = Math.sin(t), A = ASSOC.find(a => a.id === E.assoc), t2 = A.f ? A.f(t) : null; let ppu = 100;
    const cote = Math.abs(q('#ct-cercle').getBoundingClientRect().top - q('#ct-courbes').getBoundingClientRect().top) < 4;   // côte à côte ?
    { // le cercle
      const { ctx, w, h } = toile(q('#ct-cercle')); ppu = Math.min(h / 2.9, w / 2.5);   // pixels par unité, repris par les courbes
      const v = vueEgale(w, h, 0, 0, w / (2 * ppu)); V1 = v;
      ctx.strokeStyle = C.filetFort; ctx.lineWidth = 1;
      for (const g of [-1, -0.5, 0.5, 1]) { trait(ctx, v.X(g), 0, v.X(g), h); trait(ctx, 0, v.Y(g), w, v.Y(g)); }
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1.5; trait(ctx, 0, v.Y(0), w, v.Y(0)); trait(ctx, v.X(0), 0, v.X(0), h);
      const R = v.X(1) - v.X(0), X0 = v.X(0), Y0 = v.Y(0);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(X0, Y0, R, 0, 7); ctx.stroke();
      // arc parcouru depuis I
      if (t !== 0) { ctx.strokeStyle = C.vert; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X0, Y0, R * 0.22, 0, -t, t > 0); ctx.stroke(); }
      const X = v.X(c), Y = v.Y(s);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); trait(ctx, X, Y, X, Y0); trait(ctx, X, Y, X0, Y); ctx.setLineDash([]);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.6; trait(ctx, X0, Y0, X, Y);
      ctx.strokeStyle = C.bleu; ctx.lineWidth = 5; trait(ctx, X0, Y0, X, Y0);
      ctx.strokeStyle = C.orange; ctx.lineWidth = 5; trait(ctx, X0, Y0, X0, Y);
      if (Math.abs(c) > 0.16) etiquette(ctx, C, 'cos t', (X0 + X) / 2, Y0 + (s >= 0 ? 14 : -14), C.bleu, 'center', 12);
      if (Math.abs(s) > 0.12) etiquette(ctx, C, 'sin t', X0 + (c >= 0 ? -8 : 8), (Y0 + Y) / 2, C.orange, c >= 0 ? 'right' : 'left', 12);
      etiquette(ctx, C, 'O', X0 - 10, Y0 + 12, C.doux, 'center', 12); pastille(ctx, v.X(1), Y0, C.doux, 3.5); etiquette(ctx, C, 'I', v.X(1) + 11, Y0 + 12, C.doux, 'center', 12);
      if (t2 !== null) { const X2 = v.X(Math.cos(t2)), Y2 = v.Y(Math.sin(t2));
        ctx.strokeStyle = C.vert; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); trait(ctx, X2, Y2, X2, Y0); trait(ctx, X2, Y2, X0, Y2); ctx.setLineDash([]);
        ctx.lineWidth = 1.6; trait(ctx, X0, Y0, X2, Y2); pastille(ctx, X2, Y2, C.vert, 6);
        etiquette(ctx, C, 'M′', X2 + (Math.cos(t2) >= 0 ? 16 : -16), Y2 + (Math.sin(t2) >= 0 ? -12 : 12), C.vert, 'center', 14); }
      if (cote) { ctx.strokeStyle = C.orange; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); trait(ctx, X, Y, w, Y); ctx.setLineDash([]); }
      poignee(ctx, C, X, Y, C.encre, '', false);
      etiquette(ctx, C, 'M', X + (c >= 0 ? 16 : -16), Y + (s >= 0 ? -14 : 14), C.encre, 'center', 15);
    }
    { // les courbes
      const { ctx, w, h } = toile(q('#ct-courbes')), dy = cote ? h / (2 * ppu) : 1.45, v = vue(w, h, -2 * Math.PI - 0.25, 2 * Math.PI + 0.25, -dy, dy); V2 = v;
      ctx.lineWidth = 1; ctx.strokeStyle = C.filetFort; trait(ctx, 0, v.Y(1), w, v.Y(1)); trait(ctx, 0, v.Y(-1), w, v.Y(-1));
      ctx.fillStyle = C.doux; ctx.font = '500 11px ' + C.police; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      for (let j = -4; j <= 4; j++) { const X = Math.round(v.X(j * Math.PI / 2)) + .5; trait(ctx, X, 0, X, h); if (j && (w > 520 || j % 2 === 0)) ctx.fillText(enPi(j * 6), X + (j === 4 ? -12 : j === -4 ? 14 : 0), h - 6); }
      ctx.textAlign = 'right'; ctx.fillText('1', v.X(0) - 5, v.Y(1) + 4); ctx.fillText('−1', v.X(0) - 5, v.Y(-1) + 4);
      ctx.strokeStyle = C.doux; ctx.lineWidth = 1.5; trait(ctx, 0, v.Y(0), w, v.Y(0)); trait(ctx, v.X(0), 0, v.X(0), h);
      courbe(ctx, v, Math.cos, C.bleu, 2.6); courbe(ctx, v, Math.sin, C.orange, 2.6);
      etiquette(ctx, C, 'cos', v.X(-2 * Math.PI) + 22, v.Y(1) - 11, C.bleu, 'center', 12); etiquette(ctx, C, 'sin', v.X(w > 520 ? -1.5 * Math.PI : 0.5 * Math.PI), v.Y(1) - 11, C.orange, 'center', 12);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.6; ctx.setLineDash([5, 4]); trait(ctx, v.X(t), 0, v.X(t), h); ctx.setLineDash([]);
      if (cote) { ctx.strokeStyle = C.orange; ctx.lineWidth = 1.4; ctx.setLineDash([5, 4]); trait(ctx, 0, v.Y(s), v.X(t), v.Y(s)); ctx.setLineDash([]); }
      pastille(ctx, v.X(t), v.Y(c), C.bleu, 6); pastille(ctx, v.X(t), v.Y(s), C.orange, 6);
      etiquette(ctx, C, 't', v.X(t), 11, C.encre, 'center', 13);
    }
    // lectures
    const k = E.k, ce = k !== null ? cosExact(k) : null, se = k !== null ? sinExact(k) : null;
    ecrire(q('#ct-t'), enPi(E.deg, 180) + (E.deg ? ' ≈ ' + fr(t, 4) : ''));
    ecrire(q('#ct-deg'), fr(E.deg, 0) + '°');
    ecrire(q('#ct-cos'), (ce !== null && !/^(0|1|−1|1\/2|−1\/2)$/.test(ce) ? ce + ' ≈ ' : ce !== null ? ce : '') + (ce !== null && /^(0|1|−1|1\/2|−1\/2)$/.test(ce) ? '' : fr(c, 4)));
    ecrire(q('#ct-sin'), (se !== null && !/^(0|1|−1|1\/2|−1\/2)$/.test(se) ? se + ' ≈ ' : se !== null ? se : '') + (se !== null && /^(0|1|−1|1\/2|−1\/2)$/.test(se) ? '' : fr(s, 4)));
    ecrire(q('#ct-pyth'), '1');
    ecrire(q('#ct-note'), ce === null ? "Pour cet angle, cosinus et sinus n'ont pas d'écriture aussi simple qu'aux multiples de π/6 et de π/4 : la page donne leurs valeurs arrondies." : "Valeurs exactes : cet angle est un multiple de π/6 ou de π/4.");
    const kr = q('#ct-k'); if (+kr.value !== E.deg) kr.value = E.deg;
    ecrire(q('#ct-kv'), enPi(E.deg, 180));
    racine.querySelectorAll('#ct-assoc .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.a === E.assoc)));
    if (!A.f) { ecrire(q('#ct-sym'), ''); ecrire(q('#ct-formule'), "Choisissez un angle associé pour lire les deux formules qui lui correspondent."); }
    else {
      const c2 = Math.cos(t2), s2 = Math.sin(t2);
      ecrire(q('#ct-sym'), A.sym);
      ecrire(q('#ct-formule'), `<span class="c-mark">${A.cos}</span> et <span class="c-sec">${A.sin}</span>.<br>Ici : cos t′ = ${fr(c2, 4)} et sin t′ = ${fr(s2, 4)}, à comparer à cos t = ${fr(c, 4)} et sin t = ${fr(s, 4)}.`.replace(/\bt′/g, '<i>t</i>′').replace(/ t\b/g, ' <i>t</i>'), true);
    }
  }
  const S = scene(racine, rendre);
  // Déplacer M : l'angle suit le pointeur tour après tour (on ajoute la variation d'angle, sans saut de 2π).
  let dernier = 0, cumul = 0;
  glisser(q('#ct-cercle'), (p, phase) => {
    if (!V1) return;
    const a = Math.atan2(V1.iy(p.y), V1.ix(p.x));
    if (phase === 'debut') { let d = a - E.t; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI)); cumul = borne(E.t + d, -2 * Math.PI, 2 * Math.PI); dernier = a; poser(cumul, false); return; }
    let d = a - dernier; d -= 2 * Math.PI * Math.round(d / (2 * Math.PI)); dernier = a; cumul = borne(cumul + d, -2 * Math.PI, 2 * Math.PI);
    poser(cumul, phase === 'fin');
  });
  glisser(q('#ct-courbes'), (p, phase) => { if (V2) poser(V2.ix(p.x), phase === 'fin'); });
  return S.arreter;
}
