// Exploration « Le nombre e » (rubrique Activités, MEMO_atlas_activites.md §127).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, courbe, droite, etiquette, pastille, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Première, Terminale · Exponentielle</p>
  <h3>Le nombre e</h3>
  <p class="lede">Parmi toutes les fonctions <i>x</i> ↦ <i>a<sup>x</sup></i>, une seule a pour tangente en 0 la droite de pente 1. Sa base est le nombre e ≈ 2,718. On le retrouve comme limite de deux suites très différentes, l'une lente, l'autre foudroyante.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>La base dont la pente en 0 vaut 1</h4>
    <p>Toutes les courbes d'équation <i>y</i> = <i>a<sup>x</sup></i> passent par le point (0 ; 1). Faites varier la base <i>a</i> : la <b class="c-sec">tangente</b> en ce point pivote. La <b class="c-tan">droite d'équation <i>y</i> = <i>x</i> + 1</b>, de pente 1, sert de repère : cherchez la base pour laquelle la tangente se couche exactement sur elle.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ne-fig" class="moyen" aria-label="Courbe de a puissance x, sa tangente en 0 et la droite de pente 1"></canvas>
      <div class="side">
        <h5>En 0</h5>
        <dl class="lectures" aria-live="polite">
          <dt>base <i>a</i></dt><dd id="ne-a2"></dd>
          <dt>pente de la tangente</dt><dd id="ne-pente"></dd>
          <dt>(<i>a<sup>h</sup></i> − 1)/<i>h</i>, <i>h</i> = 0,001</dt><dd id="ne-taux"></dd>
        </dl>
        <p class="verdict" id="ne-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="ne-a">base <i>a</i></label><input type="range" id="ne-a" min="1.2" max="4.5" step="0.001" value="2"><output id="ne-av"></output>
    </div>
    <div class="bar"><span class="chips" id="ne-ex"></span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Deux suites qui tendent vers e</h4>
    <p>La première vient des intérêts composés : placer 1 à 100 % par an, en versant les intérêts <i>n</i> fois dans l'année, donne (1 + 1/<i>n</i>)<sup><i>n</i></sup> au bout d'un an. La seconde additionne les inverses des factorielles : 1 + 1/1! + 1/2! + … + 1/<i>m</i>!. Réglez <i>n</i> et <i>m</i>, et comparez le nombre de décimales exactes.</p>
  </div>
  <div class="fig">
    <div class="reglages">
      <label for="ne-n"><i>n</i> = 10<sup><i>k</i></sup></label><input type="range" id="ne-n" min="0" max="6" step="1" value="1"><output id="ne-nv"></output>
      <label for="ne-m"><i>m</i></label><input type="range" id="ne-m" min="0" max="17" step="1" value="4"><output id="ne-mv"></output>
    </div>
    <table id="ne-tab" aria-label="Valeurs des deux suites et écart avec e"><thead><tr><th>suite</th><th>valeur</th><th>écart avec e</th></tr></thead><tbody></tbody></table>
  </div>
  <div class="col">
    <p>Avec <i>n</i> = 1 000 000, la première suite n'a encore que cinq décimales exactes : son écart avec e est voisin de e/(2<i>n</i>). La seconde atteint la même précision dès <i>m</i> = 9, et quinze décimales pour <i>m</i> = 17, parce que les factorielles croissent plus vite que toute suite géométrique.</p>
    <p class="def">e = lim (1 + 1/<i>n</i>)<sup><i>n</i></sup> = lim (1 + 1/1! + 1/2! + … + 1/<i>m</i>!) ≈ 2,718 281 828 459. La fonction exponentielle <i>x</i> ↦ e<sup><i>x</i></sup> est l'unique fonction dérivable sur ℝ, égale à sa dérivée et valant 1 en 0.</p>
  </div>
</section>
` + suite(
  "Raisonner ainsi : « 1 + 1/<i>n</i> tend vers 1, et 1 à n'importe quelle puissance vaut 1, donc (1 + 1/<i>n</i>)<sup><i>n</i></sup> tend vers 1 ». La base et l'exposant varient ensemble, et l'on ne peut pas passer à la limite dans l'une en gelant l'autre : « 1<sup>∞</sup> » est une forme indéterminée, et la limite est ici e. Une calculatrice tombe dans le même piège : pour <i>n</i> = 10<sup>16</sup>, elle arrondit 1 + 1/<i>n</i> à 1 et répond 1.",
  "Le chapitre de Première <a href=\"#cours/p-08\">Fonction exponentielle</a> introduit la fonction égale à sa dérivée, et celui de Terminale <a href=\"#cours/t-05\">Fonctions exponentielle et logarithme</a> la relie au logarithme. Dans l'édifice : <a href=\"#ar-exp.ex-exponentielle\">L'exponentielle, réciproque du logarithme</a> et <a href=\"#ar-exp.ex-serie\">L'exponentielle comme limite de polynômes</a>, où la somme des inverses des factorielles est démontrée.",
  "La pente de la tangente à <i>y</i> = <i>a<sup>x</sup></i> en 0 est ln <i>a</i>, calculé par la machine ; le taux d'accroissement affiché à côté permet de le constater sans logarithme. Les deux suites sont calculées en nombres flottants, précis à 10⁻¹⁵ près environ : c'est pourquoi <i>n</i> s'arrête à 10⁶ et <i>m</i> à 17, au-delà desquels les arrondis de la machine fausseraient les décimales affichées. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { a: 2, k: 1, m: 4 };
  q('#ne-a').addEventListener('input', e => { E.a = Math.round(+e.target.value * 1000) / 1000; S.planifier(); });
  q('#ne-n').addEventListener('input', e => { E.k = +e.target.value; S.planifier(); });
  q('#ne-m').addEventListener('input', e => { E.m = +e.target.value; S.planifier(); });
  for (const [nom, a] of [['a = 2', 2], ['a = 2,718', 2.718], ['a = 3', 3], ['a = 4', 4]]) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = nom;
    b.addEventListener('click', () => { E.a = a; S.planifier(); }); q('#ne-ex').append(b); }
  const ecart = d => { const a = Math.abs(d); if (a < 5e-16) return 'moins de 10⁻¹⁵'; const p = Math.floor(Math.log10(a)); return p >= -4 ? fr(a, 2 - p) : (a / Math.pow(10, p)).toFixed(1).replace('.', ',') + ' × 10⁻' + [...String(-p)].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join(''); };
  function rendre(C) {
    const a = E.a, p = Math.log(a);
    const { ctx, w, h } = toile(q('#ne-fig')), v = vue(w, h, -2.2, 2.2, -0.4, 4.4);
    grille(ctx, v, C, false);
    droite(ctx, v, 0, 1, 1, C.vert, 2, [7, 5]);
    courbe(ctx, v, x => Math.pow(a, x), C.encre, 2.6);
    droite(ctx, v, 0, 1, p, C.orange, 2.2);
    pastille(ctx, v.X(0), v.Y(1), C.encre, 4.5);
    etiquette(ctx, C, 'y = x + 1', v.X(2.1), v.Y(3.1) + 22, C.vert, 'right', 12);
    if (Math.abs(+q('#ne-a').value - a) > 1e-9) q('#ne-a').value = a; ecrire(q('#ne-av'), fr(a, 3)); ecrire(q('#ne-a2'), fr(a, 3));
    ecrire(q('#ne-pente'), `ln a ≈ ${fr(p, 4)}`); ecrire(q('#ne-taux'), fr((Math.pow(a, 0.001) - 1) / 0.001, 4));
    ecrire(q('#ne-verdict'), Math.abs(a - Math.E) < 0.0006 ? 'La tangente se confond avec la droite de pente 1 : à trois décimales, la base est e ≈ 2,718.' : a < Math.E ? 'La pente est inférieure à 1 : la tangente passe sous la droite repère à droite de 0. Augmentez la base.' : 'La pente est supérieure à 1 : la tangente passe au-dessus de la droite repère à droite de 0. Diminuez la base.');
    const n = Math.pow(10, E.k), un = Math.pow(1 + 1 / n, n); let s = 0, t = 1; for (let k = 0; k <= E.m; k++) { if (k) t /= k; s += t; }
    ecrire(q('#ne-nv'), n.toLocaleString('fr-FR').replace(/ | /g, ' ')); ecrire(q('#ne-mv'), String(E.m));
    ecrire(q('#ne-tab').tBodies[0], `<tr><td>(1 + 1/<i>n</i>)<sup><i>n</i></sup></td><td>${fr(un, 12)}</td><td>${ecart(Math.E - un)}</td></tr><tr><td>1 + 1/1! + … + 1/<i>m</i>!</td><td>${fr(s, 12)}</td><td>${ecart(Math.E - s)}</td></tr><tr class="now"><td>e</td><td>${fr(Math.E, 12)}</td><td></td></tr>`, true);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
