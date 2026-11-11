// Exploration « La méthode d'Euler » (rubrique Activités, MEMO_atlas_activites.md §125).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, courbe, pastille, etiquette, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;
const T = 2;   // on résout sur [0 ; 2]

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Équations différentielles</p>
  <h3>La méthode d'Euler</h3>
  <p class="lede">Une équation différentielle dit, en chaque point, dans quelle direction part la solution. La méthode d'Euler prend cette indication au pied de la lettre : elle avance en ligne droite pendant un petit pas, puis recommence. Plus le pas est petit, plus la ligne brisée colle à la vraie courbe.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Avancer par petits pas</h4>
    <p>On cherche la fonction <i>y</i> telle que <i>y</i> ′ = <i>ky</i> et <i>y</i>(0) = 1, sur l'intervalle [0 ; 2]. On découpe cet intervalle en <i>N</i> pas de longueur <i>h</i> = 2/<i>N</i>. Partant du point (0 ; 1), on suit la tangente, dont la pente est <i>k</i> fois l'ordonnée où l'on se trouve, pendant un pas : l'ordonnée est multipliée par 1 + <i>kh</i>. Et l'on recommence. Augmentez <i>N</i>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="eu-fig" class="moyen" aria-label="Solution exacte de l'équation différentielle et ligne brisée de la méthode d'Euler"></canvas>
      <div class="side">
        <h5>En <i>x</i> = 2</h5>
        <dl class="lectures" aria-live="polite">
          <dt>pas <i>h</i></dt><dd id="eu-h"></dd>
          <dt class="c-sec">Euler</dt><dd id="eu-e"></dd>
          <dt>exacte</dt><dd id="eu-x"></dd>
          <dt>écart</dt><dd id="eu-d"></dd>
        </dl>
        <h5 style="margin-top:6px">Quand le pas est divisé par 2</h5>
        <table id="eu-tab" aria-label="Écart en x = 2 pour des nombres de pas doublés"><thead><tr><th><i>N</i></th><th>écart</th><th>rapport</th></tr></thead><tbody></tbody></table>
      </div>
    </div>
    <div class="reglages">
      <label for="eu-n">nombre de pas <i>N</i></label><input type="range" id="eu-n" min="1" max="80" step="1" value="5"><output id="eu-nv"></output>
      <label for="eu-k">coefficient <i>k</i></label><input type="range" id="eu-k" min="-3" max="1" step="0.05" value="1"><output id="eu-kv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que l'on retrouve à la limite</h4>
    <p>Après <i>N</i> pas, la méthode donne en <i>x</i> = 2 la valeur (1 + 2<i>k</i>/<i>N</i>)<sup><i>N</i></sup>, alors que la solution exacte est <i>x</i> ↦ e<sup><i>kx</i></sup>, qui vaut e<sup>2<i>k</i></sup> en 2. Dire que la méthode converge, c'est dire que (1 + 2<i>k</i>/<i>N</i>)<sup><i>N</i></sup> tend vers e<sup>2<i>k</i></sup> quand <i>N</i> tend vers l'infini : c'est l'une des définitions classiques de l'exponentielle.</p>
    <p>Le tableau montre à quelle vitesse : chaque fois que le pas est divisé par 2, l'écart est à peu près divisé par 2. On dit que la méthode est d'ordre 1 : l'erreur est proportionnelle au pas.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Quand le pas est trop grand</h4>
    <p>Prenez <i>k</i> = −3. La vraie solution, e<sup>−3<i>x</i></sup>, décroît vers 0 en restant positive. Réglez maintenant <i>N</i> sur 2, puis 3, puis 5.</p>
    <p id="eu-verdict" aria-live="polite"></p>
    <p>Tout se lit sur le facteur 1 + <i>kh</i> par lequel chaque pas multiplie l'ordonnée. S'il est entre 0 et 1, la ligne brisée décroît sagement. S'il est négatif, elle change de signe à chaque pas, ce que la vraie solution ne fait jamais. S'il est inférieur à −1, c'est-à-dire si <i>h</i> &gt; 2/|<i>k</i>|, elle s'amplifie au lieu de s'éteindre.</p>
  </div>
</section>
` + suite(
  "Croire qu'un calcul numérique donne « à peu près » la solution quel que soit le pas. Pour <i>y</i> ′ = −3<i>y</i> avec un pas <i>h</i> = 1, la méthode d'Euler fournit 1, −2, 4 : des valeurs qui oscillent et grandissent, alors que la solution exacte vaut e<sup>−6</sup> ≈ 0,0025 en 2. Un résultat numérique ne vaut que si le pas est assez petit pour l'équation traitée.",
  "Le chapitre de Terminale <a href=\"#cours/t-08\">Équations différentielles</a> résout <i>y</i> ′ = <i>ky</i>, et celui de Maths Sup <a href=\"#cours/ma-06\">Primitives et équations différentielles linéaires</a> le cas général. L'existence et l'unicité de la solution, que la méthode d'Euler suppose acquises, sont dans l'édifice le <a href=\"#edo.ed-cauchy-lipschitz\">Théorème de Cauchy-Lipschitz local</a>.",
  "Les valeurs de la méthode sont (1 + <i>kh</i>)<sup><i>n</i></sup>, calculées telles quelles, et la solution exacte est e<sup><i>kx</i></sup> : aucune des deux n'est approchée autrement que par l'arrondi d'affichage à 10⁻⁴. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { n: 5, k: 1 };
  q('#eu-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#eu-k').addEventListener('input', e => { E.k = Math.round(+e.target.value * 20) / 20; S.planifier(); });
  const euler = (k, n) => Math.pow(1 + k * T / n, n);
  function rendre(C) {
    const { n, k } = E, h = T / n, r = 1 + k * h, ex = Math.exp(k * T), haut = Math.max(1, ex) * 1.18;
    const { ctx, w, h: H } = toile(q('#eu-fig')), v = vue(w, H, -0.12, T + 0.12, k < 0 ? -haut * 0.75 : -haut * 0.08, haut);
    grille(ctx, v, C, false);
    courbe(ctx, v, x => Math.exp(k * x), C.encre, 2.6);
    ctx.strokeStyle = C.orange; ctx.lineWidth = 2.2; ctx.beginPath(); let y = 1; ctx.moveTo(v.X(0), v.Y(1));
    for (let i = 1; i <= n; i++) { y *= r; ctx.lineTo(v.X(i * h), borne(v.Y(y), -3000, 3000)); } ctx.stroke();
    if (n <= 40) { y = 1; for (let i = 0; i <= n; i++) { const Y = v.Y(y); if (Y > -10 && Y < H + 10) pastille(ctx, v.X(i * h), Y, C.orange, 3.5); y *= r; } }
    etiquette(ctx, C, 'exacte', v.X(T) - 30, borne(v.Y(ex) - 14, 12, H - 12), C.encre, 'center', 12);
    for (const [id, val, d] of [['#eu-n', n, 0], ['#eu-k', k, 2]]) { if (Math.abs(+q(id).value - val) > 1e-9) q(id).value = val; ecrire(q(id + 'v'), fr(val, d)); }
    const e = euler(k, n);
    ecrire(q('#eu-h'), fr(h, 4)); ecrire(q('#eu-e'), fr(e, 4)); ecrire(q('#eu-x'), fr(ex, 4)); ecrire(q('#eu-d'), fr(Math.abs(e - ex), 4));
    let lignes = '', avant = null;
    for (const m of [10, 20, 40, 80, 160]) { const d = Math.abs(euler(k, m) - ex); lignes += `<tr><td>${m}</td><td>${fr(d, 4)}</td><td>${avant === null || d === 0 ? '' : fr(avant / d, 2)}</td></tr>`; avant = d; }
    ecrire(q('#eu-tab').tBodies[0], lignes, true);
    ecrire(q('#eu-verdict'), `Ici h = ${fr(h, 4)} et 1 + kh = ${fr(r, 4)}. ` + (k === 0 ? "Avec k = 0, la solution est constante et la méthode est exacte."
      : r < -1 ? "Ce facteur est inférieur à −1 : la ligne brisée change de signe à chaque pas et s'amplifie. Le calcul est instable, il ne ressemble en rien à la solution."
      : r < 0 ? "Ce facteur est négatif : la ligne brisée change de signe à chaque pas, ce que la solution exacte ne fait pas, même si elle finit par s'éteindre."
      : r === 0 ? "Ce facteur est nul : la méthode tombe sur 0 dès le premier pas et n'en bouge plus."
      : "Ce facteur est positif : la ligne brisée garde le signe de la solution et s'en rapproche quand N augmente."));
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
