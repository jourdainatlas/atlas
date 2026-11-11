// Exploration « Suites récurrentes : la toile d'araignée » (rubrique Activités, MEMO_atlas_activites.md §123).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, poignee, pastille, glisser, ecrire, fr, borne } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Suites définies par récurrence</p>
  <h3>Suites récurrentes : la toile d'araignée</h3>
  <p class="lede">Une suite définie par <i>u</i><sub><i>n</i>+1</sub> = <i>f</i>(<i>u<sub>n</sub></i>) se construit sans aucun calcul, avec deux courbes : celle de <i>f</i> et la droite d'équation <i>y</i> = <i>x</i>. Le dessin obtenu, escalier ou spirale, dit si la suite converge, et vers quoi.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Construire les termes</h4>
    <p>Choisissez une fonction : <span class="chips" id="ts-fn"></span></p>
    <p>On part de <i>u</i><sub>0</sub> sur l'axe des abscisses. On monte jusqu'à la courbe de <i>f</i> : on est à la hauteur <i>f</i>(<i>u</i><sub>0</sub>) = <i>u</i><sub>1</sub>. On rejoint horizontalement la droite <i>y</i> = <i>x</i>, ce qui reporte <i>u</i><sub>1</sub> en abscisse. Et l'on recommence. Déplacez <i>u</i><sub>0</sub> sur la figure et augmentez le nombre d'étapes.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ts-fig" class="moyen fixe" aria-label="Courbe de f, droite y = x et construction en toile d'araignée des termes de la suite"></canvas>
      <div class="side">
        <h5>Les premiers termes</h5>
        <table id="ts-tab" aria-label="Premiers termes de la suite"><thead><tr><th><i>n</i></th><th><i>u<sub>n</sub></i></th></tr></thead><tbody></tbody></table>
        <h5 style="margin-top:6px">Point fixe</h5>
        <dl class="lectures" aria-live="polite"><dt>ℓ = <i>f</i>(ℓ)</dt><dd id="ts-l"></dd><dt><i>f</i> ′(ℓ)</dt><dd id="ts-d"></dd></dl>
      </div>
    </div>
    <div class="reglages">
      <label for="ts-u"><i>u</i><sub>0</sub></label><input type="range" id="ts-u" step="0.01"><output id="ts-uv"></output>
      <label for="ts-n">étapes</label><input type="range" id="ts-n" min="1" max="40" step="1" value="8"><output id="ts-nv"></output>
      <label for="ts-p" id="ts-pl"></label><input type="range" id="ts-p" step="0.05"><output id="ts-pv"></output>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Où la suite peut-elle aller ?</h4>
    <p>Si la suite converge vers un réel ℓ et si <i>f</i> est continue en ℓ, alors en passant à la limite dans <i>u</i><sub><i>n</i>+1</sub> = <i>f</i>(<i>u<sub>n</sub></i>) on obtient ℓ = <i>f</i>(ℓ). Les seules limites possibles sont donc les <b>points fixes</b> de <i>f</i> : les abscisses où sa courbe coupe la droite <i>y</i> = <i>x</i>.</p>
    <p id="ts-verdict" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Escalier ou spirale</h4>
    <p>Près d'un point fixe ℓ, la courbe de <i>f</i> ressemble à sa tangente, de pente <i>f</i> ′(ℓ). Tout se joue sur ce nombre. Si <i>f</i> ′(ℓ) est positif, la suite avance en <b>escalier</b>, d'un seul côté de ℓ ; s'il est négatif, elle tourne en <b>spirale</b> et ses termes encadrent ℓ alternativement.</p>
    <p class="def">Si <i>f</i> est dérivable en un point fixe ℓ et si |<i>f</i> ′(ℓ)| &lt; 1, alors la suite converge vers ℓ dès que <i>u</i><sub>0</sub> est assez proche de ℓ. Si |<i>f</i> ′(ℓ)| &gt; 1, elle ne converge vers ℓ que si l'un de ses termes est exactement égal à ℓ.</p>
    <p>Avec la fonction affine, réglez la pente <i>a</i> : pour <i>a</i> = 0,5 un escalier qui converge, pour <i>a</i> = −0,5 une spirale qui converge, pour <i>a</i> = −1,2 une spirale qui s'éloigne. Avec <i>rx</i>(1 − <i>x</i>), montez <i>r</i> au-delà de 3 : le point fixe est toujours là, mais la suite n'y va plus.</p>
  </div>
</section>
` + suite(
  "Croire que l'existence d'un point fixe suffit. L'équation ℓ = <i>f</i>(ℓ) donne les limites <em>possibles</em> ; elle ne dit pas que la suite converge. Pour <i>f</i>(<i>x</i>) = −1,2(<i>x</i> − 0,5) + 0,5, le point fixe est ℓ = 0,5, et pourtant la suite s'en éloigne dès que <i>u</i><sub>0</sub> ≠ 0,5, puisque <i>u<sub>n</sub></i> − 0,5 = (−1,2)<sup><i>n</i></sup>(<i>u</i><sub>0</sub> − 0,5).",
  "Le chapitre de Terminale <a href=\"#cours/t-01\">Suites numériques</a> et celui de Maths Sup <a href=\"#cours/ma-07\">Nombres réels et suites numériques</a> étudient ces suites. Le résultat général derrière l'énoncé encadré est, dans l'édifice, le <a href=\"#met.gd-point-fixe\">Théorème du point fixe de Banach</a> : une application contractante d'un espace complet dans lui-même a un unique point fixe, vers lequel convergent toutes les suites récurrentes.",
  "Les termes sont calculés en appliquant <i>f</i>, sans approximation autre que l'arrondi d'affichage à 10⁻⁴. Les points fixes sont donnés par leur formule : 0,5 pour la fonction affine <i>a</i>(<i>x</i> − 0,5) + 0,5, 0 et 1 − 1/<i>r</i> pour <i>rx</i>(1 − <i>x</i>) ; celui du cosinus, 0,7391 à 10⁻⁴ près, est obtenu par dichotomie. Rien n'est enregistré ni envoyé.");

// Point fixe du cosinus par dichotomie sur [0 ; 1] (cos x − x y change de signe, et y est strictement décroissante).
let PC = (() => { let a = 0, b = 1; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (Math.cos(m) - m > 0) a = m; else b = m; } return (a + b) / 2; })();
const FN = [
  { nom: 'a(x − 0,5) + 0,5', v: [-3, 3, -3, 3], u: [-2.8, 2.8, 2.2], par: { nom: 'pente a', min: -1.5, max: 1.5, val: 0.5 },
    f: (x, a) => a * (x - 0.5) + 0.5, d: (x, a) => a, fixe: a => a === 1 ? [] : [0.5] },
  { nom: 'cos x', v: [-0.4, 1.8, -0.4, 1.8], u: [-0.3, 1.7, 0.1], f: x => Math.cos(x), d: x => -Math.sin(x), fixe: () => [PC] },
  { nom: 'rx(1 − x)', v: [-0.08, 1.08, -0.08, 1.08], u: [0, 1, 0.2], par: { nom: 'r', min: 0.5, max: 4, val: 2.6 },
    f: (x, r) => r * x * (1 - x), d: (x, r) => r * (1 - 2 * x), fixe: r => r === 1 ? [0] : [0, 1 - 1 / r] },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, u0: 2.2, n: 8, p: 0.5 };
  let V = null;
  const boite = q('#ts-fn');
  FN.forEach((F, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = F.nom;
    b.addEventListener('click', () => { E.fn = i; E.u0 = F.u[2]; E.p = F.par ? F.par.val : 0; S.planifier(); }); boite.append(b); });
  q('#ts-u').addEventListener('input', e => { E.u0 = +e.target.value; S.planifier(); });
  q('#ts-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#ts-p').addEventListener('input', e => { E.p = Math.round(+e.target.value * 20) / 20; S.planifier(); });

  function rendre(C) {
    const F = FN[E.fn], p = E.p, f = x => F.f(x, p), u = [E.u0];
    for (let i = 0; i < 40; i++) u.push(f(u[i]));
    const { ctx, w, h } = toile(q('#ts-fig')), v = vue(w, h, F.v[0], F.v[1], F.v[2], F.v[3]); V = v;
    grille(ctx, v, C, false);
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1.8; trait(ctx, v.X(v.x0), v.Y(v.x0), v.X(v.x1), v.Y(v.x1));
    courbe(ctx, v, f, C.encre, 2.6);
    etiquette(ctx, C, 'y = x', v.X(F.v[1]) - 30, v.Y(F.v[1]) + 26, C.doux, 'center', 12);
    // la toile : montée (ou descente) vers la courbe, puis report horizontal sur la droite y = x
    ctx.strokeStyle = C.orange; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(v.X(u[0]), v.Y(0));
    for (let i = 0; i < E.n; i++) { if (!isFinite(u[i + 1]) || Math.abs(u[i + 1]) > 1e6) break;
      ctx.lineTo(v.X(u[i]), borne(v.Y(u[i + 1]), -5000, 5000)); ctx.lineTo(borne(v.X(u[i + 1]), -5000, 5000), borne(v.Y(u[i + 1]), -5000, 5000)); }
    ctx.stroke();
    for (let i = 1; i <= Math.min(E.n, 3); i++) if (u[i] > v.x0 && u[i] < v.x1) { pastille(ctx, v.X(u[i]), v.Y(0), C.orange, 3.5); etiquette(ctx, C, 'u' + '₁₂₃'[i - 1], v.X(u[i]), v.Y(0) + 13, C.orange, 'center', 12); }
    const fixes = F.fixe(p);
    for (const l of fixes) pastille(ctx, v.X(l), v.Y(l), C.vert, 6);
    poignee(ctx, C, v.X(u[0]), v.Y(0), C.encre, '', false); etiquette(ctx, C, 'u₀', v.X(u[0]), v.Y(0) - 18, C.encre, 'center', 13);
    // textes
    racine.querySelectorAll('#ts-fn .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.fn)));
    const ru = q('#ts-u'); ru.min = F.u[0]; ru.max = F.u[1]; if (Math.abs(+ru.value - E.u0) > 1e-9) ru.value = E.u0; ecrire(q('#ts-uv'), fr(E.u0, 2));
    ecrire(q('#ts-nv'), String(E.n));
    const rp = q('#ts-p'), aPar = !!F.par; rp.hidden = q('#ts-pl').hidden = q('#ts-pv').hidden = !aPar;
    if (aPar) { rp.min = F.par.min; rp.max = F.par.max; if (Math.abs(+rp.value - p) > 1e-9) rp.value = p; ecrire(q('#ts-pl'), F.par.nom); ecrire(q('#ts-pv'), fr(p, 2)); }
    let lignes = ''; for (let i = 0; i <= Math.min(E.n, 8); i++) lignes += `<tr><td>${i}</td><td>${Math.abs(u[i]) > 1e6 || !isFinite(u[i]) ? '…' : fr(u[i], 4)}</td></tr>`;
    if (E.n > 8) lignes += `<tr><td>${E.n}</td><td>${Math.abs(u[E.n]) > 1e6 || !isFinite(u[E.n]) ? 'hors d\'échelle' : fr(u[E.n], 4)}</td></tr>`;
    ecrire(q('#ts-tab').tBodies[0], lignes, true);
    const l = fixes[fixes.length - 1], dl = l === undefined ? NaN : F.d(l, p);
    ecrire(q('#ts-l'), fixes.length ? fixes.map(x => fr(x, 4)).join(' ou ') : 'aucun');
    ecrire(q('#ts-d'), l === undefined ? '—' : fr(dl, 4) + (fixes.length > 1 ? ' (en ' + fr(l, 4) + ')' : ''));
    let t;
    if (E.fn === 0) t = p === 1 ? "Avec a = 1, la fonction est x ↦ x : tous les réels sont des points fixes et la suite est constante."
      : `Ici ℓ = 0,5 et u_n − 0,5 = a^n (u₀ − 0,5) avec a = ${fr(p, 2)} : ` + (Math.abs(p) < 1 ? "comme |a| < 1, la suite converge vers 0,5 quel que soit u₀." : Math.abs(E.u0 - 0.5) < 1e-9 ? "la suite est constante, égale à 0,5, parce que u₀ est exactement le point fixe." : p === -1 ? "la suite prend alternativement deux valeurs et ne converge pas." : "comme |a| > 1, l'écart à 0,5 grandit sans fin et la suite diverge.");
    else if (E.fn === 1) t = `La courbe coupe la droite en un seul point, ℓ ≈ ${fr(PC, 4)}, où f ′(ℓ) = −sin ℓ ≈ ${fr(-Math.sin(PC), 4)} : la valeur absolue est inférieure à 1 et le signe est négatif, d'où une spirale qui se resserre. Pour le cosinus, la suite converge vers ℓ quel que soit u₀.`;
    else t = p <= 1 ? `Pour r = ${fr(p, 2)}, le seul point fixe dans [0 ; 1] est 0, et la suite, décroissante et positive, converge vers 0.`
      : `Pour r = ${fr(p, 2)}, les points fixes sont 0 et 1 − 1/r ≈ ${fr(1 - 1 / p, 4)}, où f ′ vaut 2 − r = ${fr(2 - p, 2)}. ` + (p < 3 ? "Sa valeur absolue est inférieure à 1 : ce point fixe attire les suites qui partent assez près de lui." : p === 3 ? "Sa valeur absolue est exactement 1 : l'énoncé encadré ne permet pas de conclure." : "Sa valeur absolue dépasse 1 : ce point fixe repousse les suites voisines, et une suite ne peut converger vers lui que si l'un de ses termes tombe exactement dessus.");
    ecrire(q('#ts-verdict'), t);
  }
  const S = scene(racine, rendre);
  glisser(q('#ts-fig'), p => { if (!V) return; const F = FN[E.fn]; E.u0 = borne(Math.round(V.ix(p.x) * 100) / 100, F.u[0], F.u[1]); S.planifier(); });
  return S.arreter;
}
