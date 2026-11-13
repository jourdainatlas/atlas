// Exploration « Asymptotes » (rubrique Activités, MEMO_atlas_activites.md §160).
// Terminale : asymptotes horizontales et verticales ; Maths Sup : asymptotes obliques en plus.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, courbe, etiquette, poignee, glisser, ecrire, fr, frc, borne } from './figures.js';
import { lireParcours } from './jour.js';

export const css = cssCommun + cssFigures + `
.activites-act .as-tab { overflow-x: auto; border-top: 1px solid var(--filet); }
.activites-act .as-tab table { min-width: 420px; }
.activites-act .as-tab th, .activites-act .as-tab td { padding: 6px 10px; text-align: right; white-space: nowrap; border-bottom: 1px solid var(--filet); }
.activites-act .as-tab th:first-child, .activites-act .as-tab td:first-child { text-align: left; color: var(--encre-2); }
.activites-act .as-tab caption { caption-side: top; text-align: left; padding: 8px 10px 4px; font: 500 12px var(--f-ui); letter-spacing: .05em; text-transform: uppercase; color: var(--encre-3); }
.activites-act .as-choix { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; padding: 10px 16px; border-top: 1px solid var(--filet); font: 14px var(--f-ui); color: var(--encre-2); }
.activites-act .as-formule { margin: 0; padding: 10px 16px 0; font: 15px/1.5 var(--f-texte, Georgia, serif); min-height: 62px; display: flex; align-items: center; }   /* hauteur réservée : la figure ne bouge pas quand la formule change */
.activites-act .reglages .inutile { display: none; }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Limites de fonctions</p>
  <h3>Asymptotes : les droites que la courbe rejoint</h3>
  <p class="lede">Une asymptote est une droite dont la courbe se rapproche autant que l'on veut, sans que l'on ait besoin de la tracer très loin pour le croire : c'est une limite qui le dit. Cette page fait varier les coefficients d'une fonction, montre les droites que sa courbe rejoint, et mesure l'écart qui reste.</p>
  <p>Votre classe : <span class="chips" id="as-classe"></span> <span id="as-classe-dit"></span></p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Asymptotes horizontales et verticales</h4>
    <p>Choisissez une fonction, réglez ses coefficients, puis déplacez le point <b class="c-sec">M</b> sur la courbe. Les <b class="c-tan">asymptotes</b> sont tracées en pointillés ; le trait orange mesure l'écart entre le point M et l'asymptote horizontale. Agrandissez la fenêtre : vue de loin, la courbe se confond avec ses asymptotes, là où elle en a.</p>
  </div>
  <div class="fig">
    <div class="as-choix"><span>Fonction :</span><span class="chips" id="as-f1"></span></div>
    <p class="as-formule" id="as-e1"></p>
    <div class="split">
      <canvas id="as-fig1" class="moyen" aria-label="Courbe de la fonction, ses asymptotes horizontale et verticale, et le point M"></canvas>
      <div class="side">
        <h5>Limites</h5>
        <dl class="lectures" aria-live="polite" id="as-l1"></dl>
        <p class="verdict" id="as-v1" aria-live="polite"></p>
        <p class="verdict" id="as-m1" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages" id="as-r1">
      <label for="as1-a"><i>a</i></label><input type="range" id="as1-a" min="-5" max="5" step="0.05"><output id="as1-av"></output>
      <label for="as1-b"><i>b</i></label><input type="range" id="as1-b" min="-5" max="5" step="0.05"><output id="as1-bv"></output>
      <label for="as1-c"><i>c</i></label><input type="range" id="as1-c" min="-5" max="5" step="0.05"><output id="as1-cv"></output>
      <label for="as1-x">abscisse de M</label><input type="range" id="as1-x" step="0.05"><output id="as1-xv"></output>
    </div>
    <div class="as-choix"><span>Fenêtre :</span><span class="chips" id="as-z1"></span></div>
    <div class="as-tab" id="as-t1"></div>
  </div>
</section>

<section id="as-sec2">
  <div class="col">
    <h4><span class="n">2</span>Asymptotes obliques</h4>
    <p>Quand <span class="kx">f(x)</span> tend vers l'infini avec <span class="kx">x</span>, la courbe peut encore rejoindre une droite, cette fois inclinée. On la cherche en deux temps : la pente est la limite de <span class="kx">\\dfrac{f(x)}{x}</span>, si elle existe et est finie ; l'ordonnée à l'origine est alors la limite de <span class="kx">f(x) - ax</span>, si elle existe et est finie elle aussi. Le tableau sous la figure calcule ces deux quantités pour de grandes valeurs de <span class="kx">x</span>.</p>
  </div>
  <div class="fig">
    <div class="as-choix"><span>Fonction :</span><span class="chips" id="as-f2"></span></div>
    <p class="as-formule" id="as-e2"></p>
    <div class="split">
      <canvas id="as-fig2" class="moyen" aria-label="Courbe de la fonction, son asymptote oblique et le point M"></canvas>
      <div class="side">
        <h5>Branches infinies</h5>
        <dl class="lectures" aria-live="polite" id="as-l2"></dl>
        <p class="verdict" id="as-v2" aria-live="polite"></p>
        <p class="verdict" id="as-m2" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages" id="as-r2">
      <label for="as2-a"><i>a</i></label><input type="range" id="as2-a" min="-3" max="3" step="0.05"><output id="as2-av"></output>
      <label for="as2-b"><i>b</i></label><input type="range" id="as2-b" min="-5" max="5" step="0.05"><output id="as2-bv"></output>
      <label for="as2-c"><i>c</i></label><input type="range" id="as2-c" min="-5" max="5" step="0.05"><output id="as2-cv"></output>
      <label for="as2-d"><i>d</i></label><input type="range" id="as2-d" min="-5" max="5" step="0.05"><output id="as2-dv"></output>
      <label for="as2-x">abscisse de M</label><input type="range" id="as2-x" step="0.05"><output id="as2-xv"></output>
    </div>
    <div class="as-choix"><span>Fenêtre :</span><span class="chips" id="as-z2"></span></div>
    <div class="as-tab" id="as-t2"></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n" id="as-n3">3</span>Les définitions</h4>
    <div class="def">
      <p>Soit <span class="kx">f</span> une fonction à valeurs réelles et <span class="kx">\\mathcal{C}</span> sa courbe. Pour parler d'asymptote en <span class="kx">+\\infty</span>, on suppose <span class="kx">f</span> définie au moins sur un intervalle <span class="kx">[A\\,; +\\infty[</span> ; en <span class="kx">-\\infty</span>, sur un intervalle <span class="kx">]-\\infty\\,; A]</span> ; en un réel <span class="kx">c</span>, sur un intervalle ouvert dont <span class="kx">c</span> est une extrémité.</p>
      <p>La droite d'équation <span class="kx">y = \\ell</span> est <b>asymptote horizontale</b> à <span class="kx">\\mathcal{C}</span> en <span class="kx">+\\infty</span> si <span class="kx">\\displaystyle\\lim_{x \\to +\\infty} f(x) = \\ell</span> ; de même en <span class="kx">-\\infty</span>.</p>
      <p>La droite d'équation <span class="kx">x = c</span> est <b>asymptote verticale</b> à <span class="kx">\\mathcal{C}</span> si <span class="kx">f(x)</span> tend vers <span class="kx">+\\infty</span> ou vers <span class="kx">-\\infty</span> quand <span class="kx">x</span> tend vers <span class="kx">c</span>, d'un côté au moins.</p>
      <p class="as-sup">La droite d'équation <span class="kx">y = ax + b</span> est <b>asymptote</b> à <span class="kx">\\mathcal{C}</span> en <span class="kx">+\\infty</span> si <span class="kx">\\displaystyle\\lim_{x \\to +\\infty} \\bigl(f(x) - (ax + b)\\bigr) = 0</span> ; elle est dite oblique quand <span class="kx">a \\neq 0</span>.</p>
    </div>
    <p>Une asymptote horizontale se lit donc sur une limite en l'infini, une asymptote verticale sur une limite infinie en un point. Les deux notions sont indépendantes : pour <span class="kx">b \\neq 0</span>, la fonction <span class="kx">x \\mapsto a + b\\,e^{-x}</span> n'a qu'une asymptote horizontale, et d'un seul côté ; le logarithme n'a qu'une asymptote verticale. À la lettre, une droite est sa propre asymptote : quand les coefficients rendent la fonction constante ou affine, la page le signale au lieu de tracer une asymptote confondue avec la courbe.</p>
    <div class="as-sup">
      <p><b>Proposition.</b> La droite <span class="kx">y = ax + b</span> est asymptote à <span class="kx">\\mathcal{C}</span> en <span class="kx">+\\infty</span> si et seulement si <span class="kx">\\dfrac{f(x)}{x}</span> tend vers <span class="kx">a</span> et <span class="kx">f(x) - ax</span> tend vers <span class="kx">b</span> quand <span class="kx">x</span> tend vers <span class="kx">+\\infty</span>.</p>
      <p><i>Démonstration.</i> Si <span class="kx">f(x) - ax - b</span> tend vers 0, alors <span class="kx">f(x) - ax</span> tend vers <span class="kx">b</span>, et <span class="kx">\\dfrac{f(x)}{x} = a + \\dfrac{b}{x} + \\dfrac{f(x) - ax - b}{x}</span> tend vers <span class="kx">a</span>. Réciproquement, si <span class="kx">f(x) - ax</span> tend vers <span class="kx">b</span>, alors <span class="kx">f(x) - (ax + b)</span> tend vers 0 : c'est la définition. La première condition, sur <span class="kx">\\dfrac{f(x)}{x}</span>, est donc une conséquence de la seconde ; elle sert à <em>trouver</em> la pente <span class="kx">a</span>, que la seconde suppose connue.</p>
      <p>Quand <span class="kx">\\dfrac{f(x)}{x}</span> tend vers <span class="kx">a</span> mais que <span class="kx">f(x) - ax</span> n'a pas de limite finie, la courbe n'a pas d'asymptote : elle a seulement une <b>direction asymptotique</b>, celle de la droite <span class="kx">y = ax</span>. Si <span class="kx">f(x) - ax</span> tend vers l'infini, on parle de <b>branche parabolique</b> de direction <span class="kx">y = ax</span> : c'est le cas de <span class="kx">x \\mapsto ax + b\\ln x</span> dès que <span class="kx">b \\neq 0</span>. Et si <span class="kx">\\dfrac{f(x)}{x}</span> tend lui-même vers l'infini, la branche parabolique est de direction l'axe des ordonnées, comme pour l'exponentielle.</p>
    </div>
  </div>
</section>
` + suite(
  "Croire qu'une courbe ne coupe jamais son asymptote. La définition ne parle que d'une limite : pour <span class=\"kx\">b \\neq 0</span>, la courbe de <span class=\"kx\">x \\mapsto a + b\\,\\dfrac{\\sin x}{x}</span> coupe la droite <span class=\"kx\">y = a</span> en chaque multiple non nul de <span class=\"kx\">\\pi</span>, et cette droite est bien son asymptote. Deuxième erreur : conclure à une asymptote verticale dès qu'un dénominateur s'annule. Pour <span class=\"kx\">\\dfrac{\\sin x}{x}</span> en 0, ou pour <span class=\"kx\">\\dfrac{ax+b}{x-c}</span> quand <span class=\"kx\">ac + b = 0</span>, la limite est finie et il n'y a pas d'asymptote verticale. Troisième erreur : prendre une croissance lente pour une asymptote horizontale ; <span class=\"kx\">\\ln x</span> tend vers <span class=\"kx\">+\\infty</span>, lentement, et n'en a pas.",
  "Le chapitre de Terminale <a href=\"#cours/t-03\">Fonctions numériques</a> définit les limites et les asymptotes horizontales et verticales ; ceux de Maths Sup <a href=\"#cours/ma-05\">Fonctions usuelles et dérivation pratique</a> et <a href=\"#cours/ma-10\">Analyse asymptotique et développements limités</a> traitent les branches infinies et les asymptotes obliques. Dans l'édifice : <a href=\"#ar-deriv.de-limite\">Limite en un point</a>, et <a href=\"#ar-asymptotique.as-etude-locale\">Étude locale</a>, où l'asymptote de <span class=\"kx\">\\sqrt{x^2+x}</span> est obtenue par un développement limité.",
  "Les coefficients avancent par pas de 0,05 et sont gardés en vingtièmes entiers : les tests qui décident de la nature de la courbe (<span class=\"kx\">ac + b = 0</span>, reste nul de la division, <span class=\"kx\">4c = b^2</span>) sont faits sur ces entiers, sans arrondi. Les asymptotes, les limites et les écarts viennent de formules exactes pour chaque famille ; les tableaux évaluent la fonction en machine, à une précision relative de l'ordre de 10⁻¹⁵, et affichent six chiffres ; l'écart à une asymptote horizontale y est calculé par sa formule, et non par soustraction, pour ne pas s'annuler à tort quand il devient minuscule. Rien n'est enregistré ni envoyé.");

// ---------- écriture des nombres ----------
const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
// Nombre d'un tableau : six chiffres significatifs, écriture scientifique au-delà de 10⁶ ou en deçà de 10⁻⁴.
function num(v) {
  if (Number.isNaN(v)) return '—';
  if (!isFinite(v)) return v < 0 ? 'moins de −10³⁰⁸' : 'plus de 10³⁰⁸';
  const a = Math.abs(v); if (a === 0) return '0';
  if (a >= 999999.5 || a < 1e-4) { const [m, e] = v.toExponential(5).split('e'); return frc(+m, 5) + ' × 10' + String(+e).split('').map(ch => SUP[ch]).join(''); }
  const d = Math.max(0, 5 - Math.floor(Math.log10(a))); return frc(v, Math.min(d, 8));
}
const dec = (v, d = 4) => frc(v, d);
const INF = s => (s > 0 ? '+∞' : '−∞');
// Équation d'une droite y = mx + p, en texte.
const eq = (m, p) => 'y = ' + (m === 0 ? dec(p) : (m === 1 ? '' : m === -1 ? '−' : dec(m)) + 'x' + (p ? (p < 0 ? ' − ' : ' + ') + dec(Math.abs(p)) : ''));
const K = t => `<span class="kx">${t}</span>`;
const tx = v => String(dec(v)).replace('−', '-').replace(',', '{,}');           // nombre pour LaTeX
const plus = v => (v < 0 ? '-' : '+') + tx(Math.abs(v));
// Somme de termes [coefficient, facteur LaTeX] : les termes nuls sont omis, les coefficients ±1 ne s'écrivent pas devant un facteur.
function som(T) { let r = ''; for (const [k, t] of T) { if (!k) continue; const a = Math.abs(k); r += (k < 0 ? '-' : r ? '+' : '') + (a === 1 && t ? '' : tx(a)) + t; } return r || '0'; }

// ---------- les familles de fonctions ----------
// Les coefficients arrivent en vingtièmes entiers (A, B, C, D) et en valeurs (a, b, c, d).
// analyse() rend : f, coupures (abscisses où la courbe est interrompue), hor (asymptotes horizontales {y, cote}),
// ver (asymptotes verticales {x}), obl (asymptotes obliques {m, p, cote}), lim (lectures [libellé, valeur]),
// verdict (phrase), dir (pente de la direction asymptotique de chaque côté, ou null).
const T1 = [
  { nom: '(ax + b) / (x − c)', sert: 'abc', def: { A: 40, B: 20, C: 20 },
    tex: P => `f(x) = \\dfrac{${som([[P.a, 'x'], [P.b, '']])}}{${som([[1, 'x'], [-P.c, '']])}}`,
    analyse(P) { const { a, b, c } = P, Kn = P.A * P.C + 20 * P.B, k = Kn / 400;
      if (Kn === 0) return { f: x => x === c ? NaN : a, coupures: [], hor: [], ver: [], lim: [['en −∞', dec(a)], ['en +∞', dec(a)], ['en ' + dec(c), dec(a)]],
        verdict: `Ici ac + b = 0 : le numérateur vaut a(x − c), et f(x) = ${dec(a)} pour tout x différent de ${dec(c)}. La courbe est une droite privée d'un point : il n'y a pas d'asymptote verticale, bien que le dénominateur s'annule.`, trou: [c, a] };
      return { f: x => x === c ? NaN : (a * x + b) / (x - c), coupures: [c], hor: [{ y: a, cote: 0 }], ver: [{ x: c }],
        lim: [['en −∞', dec(a)], ['en +∞', dec(a)], ['à gauche de ' + dec(c), INF(-k)], ['à droite de ' + dec(c), INF(k)]],
        verdict: `Asymptote horizontale ${eq(0, a)} en −∞ et en +∞ ; asymptote verticale x = ${dec(c)}. En effet f(x) = ${P.A ? dec(a) + ' + ' : ''}k/(x − c) avec k = ac + b = ${dec(k)}.`, ecartH: x => k / (x - c) }; } },
  { nom: 'a + b e⁻ˣ', sert: 'ab', def: { A: 20, B: 40, C: 0 },
    tex: P => `f(x) = ${som([[P.a, ''], [P.b, 'e^{-x}']])}`,
    analyse(P) { const { a, b } = P;
      if (P.B === 0) return { f: () => a, coupures: [], hor: [], ver: [], lim: [['en −∞', dec(a)], ['en +∞', dec(a)]], verdict: `Avec b = 0, la fonction est constante : sa courbe est la droite ${eq(0, a)} elle-même.` };
      return { f: x => a + b * Math.exp(-x), coupures: [], hor: [{ y: a, cote: 1 }], ver: [], lim: [['en −∞', INF(b)], ['en +∞', dec(a)]],
        verdict: `Asymptote horizontale ${eq(0, a)} en +∞ seulement : en −∞, e⁻ˣ tend vers +∞ et f(x) tend vers ${INF(b)}. Pas d'asymptote verticale : la fonction est définie et continue sur ℝ.`, ecartH: x => b * Math.exp(-x) }; } },
  { nom: 'a + b ln(x − c)', sert: 'abc', def: { A: 20, B: 20, C: -40 },
    tex: P => `f(x) = ${som([[P.a, ''], [P.b, '\\ln(' + som([[1, 'x'], [-P.c, '']]) + ')']])}`,
    analyse(P) { const { a, b, c } = P;
      if (P.B === 0) return { f: x => x > c ? a : NaN, coupures: [], hor: [], ver: [], lim: [['en +∞', dec(a)], ['à droite de ' + dec(c), dec(a)]], verdict: `Avec b = 0, la fonction est constante sur ]${dec(c)} ; +∞[.` };
      return { f: x => x > c ? a + b * Math.log(x - c) : NaN, coupures: [], hor: [], ver: [{ x: c }], lim: [['en −∞', 'non définie'], ['en +∞', INF(b)], ['à droite de ' + dec(c), INF(-b)]],
        verdict: `Asymptote verticale x = ${dec(c)}, d'un seul côté : la fonction n'est définie que sur ]${dec(c)} ; +∞[. Aucune asymptote horizontale : f(x) tend vers ${INF(b)} en +∞, lentement, mais sans limite finie.` }; } },
  { nom: 'a + b (sin x) / x', sert: 'ab', def: { A: 20, B: 60, C: 0 },
    tex: P => `f(x) = ${som([[P.a, ''], [P.b, '\\dfrac{\\sin x}{x}']])}`,
    analyse(P) { const { a, b } = P;
      if (P.B === 0) return { f: x => x === 0 ? NaN : a, coupures: [], hor: [], ver: [], lim: [['en −∞', dec(a)], ['en +∞', dec(a)], ['en 0', dec(a)]], verdict: `Avec b = 0, la fonction est constante sur ℝ privé de 0.`, trou: [0, a] };
      return { f: x => x === 0 ? NaN : a + b * Math.sin(x) / x, coupures: [], hor: [{ y: a, cote: 0 }], ver: [], lim: [['en −∞', dec(a)], ['en +∞', dec(a)], ['en 0', dec(a + b)]],
        verdict: `Asymptote horizontale ${eq(0, a)} en −∞ et en +∞, puisque |sin x / x| ≤ 1/|x|. La courbe la coupe en chaque multiple non nul de π. En 0, le dénominateur s'annule mais sin x / x tend vers 1 : la limite, ${dec(a + b)}, est finie, et il n'y a pas d'asymptote verticale.`, ecartH: x => b * Math.sin(x) / x, trou: [0, a + b] }; } },
];

const T2 = [
  { nom: '(ax² + bx + c) / (x − d)', sert: 'abcd', def: { A: 20, B: -20, C: 40, D: 20 },
    tex: P => `f(x) = \\dfrac{${som([[P.a, 'x^2'], [P.b, 'x'], [P.c, '']])}}{${som([[1, 'x'], [-P.d, '']])}}`,
    analyse(P) { const { a, b, c, d } = P, p = (20 * P.B + P.A * P.D) / 400, Rn = P.A * P.D * P.D + 20 * P.B * P.D + 400 * P.C, R = Rn / 8000, f = x => x === d ? NaN : (a * x * x + b * x + c) / (x - d);
      const quot = P.A === 0 ? dec(p) : eq(a, p).slice(4), division = `La division euclidienne donne ax² + bx + c = (x − d)(${quot}) + r, avec r = ad² + bd + c = ${frc(R, 6)}`;
      if (Rn === 0) return { f: x => x === d ? NaN : a * x + p, coupures: [], hor: [], ver: [], obl: [], dir: [a, a], lim: [['f(x)/x en ±∞', dec(a)], ['f(x) − ax en ±∞', dec(p)]],
        verdict: `${division} : le reste est nul, et f(x) = ${quot} pour tout x différent de ${dec(d)}. La courbe est une droite privée d'un point, sans asymptote verticale.`, trou: [d, a * d + p] };
      if (P.A === 0) return { f, coupures: [d], hor: [{ y: p, cote: 0 }], ver: [{ x: d }], obl: [], dir: [0, 0], lim: [['f(x)/x en ±∞', '0'], ['f(x) en ±∞', dec(p)], ['à gauche de ' + dec(d), INF(-R)], ['à droite de ' + dec(d), INF(R)]],
        verdict: `Avec a = 0, le numérateur est de degré au plus 1 : f(x) = ${p ? dec(p) + ' + ' : ''}r/(x − d) avec r = bd + c = ${frc(R, 6)}, et l'asymptote en ±∞ est horizontale, ${eq(0, p)}, et non oblique. Asymptote verticale x = ${dec(d)}.`, ecart: x => R / (x - d), droite: [0, p] };
      return { f, coupures: [d], hor: [], ver: [{ x: d }], obl: [{ m: a, p, cote: 0 }], dir: [a, a], lim: [['f(x)/x en ±∞', dec(a)], ['f(x) − ax en ±∞', dec(p)], ['à gauche de ' + dec(d), INF(-R)], ['à droite de ' + dec(d), INF(R)]],
        verdict: `${division}. Donc f(x) = ${quot} + r/(x − d) : la droite ${eq(a, p)} est asymptote oblique en −∞ et en +∞, et la courbe est ${R > 0 ? 'au-dessus' : 'au-dessous'} d'elle pour x > ${dec(d)}, ${R > 0 ? 'au-dessous' : 'au-dessus'} pour x < ${dec(d)}. Asymptote verticale x = ${dec(d)}.`, ecart: x => R / (x - d), droite: [a, p] }; } },
  { nom: '√(x² + bx + c)', sert: 'bc', def: { A: 20, B: 40, C: 60, D: 0 },
    tex: P => `f(x) = \\sqrt{${som([[1, 'x^2'], [P.b, 'x'], [P.c, '']])}}`,
    analyse(P) { const { b, c } = P, Dn = 80 * P.C - P.B * P.B, q = Dn / 1600, h = b / 2,   // Dn = 400 (4c − b²), donc q = c − b²/4 = Dn / 1600
      f = x => { const t = x * x + b * x + c; return t >= 0 ? Math.sqrt(t) : NaN; };
      const obl = [{ m: 1, p: h, cote: 1, de: -h }, { m: -1, p: -h, cote: -1, de: -h }], lim = [['f(x)/x en +∞', '1'], ['f(x) − x en +∞', dec(h)], ['f(x)/x en −∞', '−1'], ['f(x) + x en −∞', dec(-h)]];
      if (Dn === 0) return { f, coupures: [], hor: [], ver: [], obl, dir: [-1, 1], lim, verdict: `Ici 4c = b² : x² + bx + c = (x + b/2)², et f(x) = ${h === 0 ? '|x|' : '|x ' + (h < 0 ? '−' : '+') + ' ' + dec(Math.abs(h)) + '|'}. La courbe est formée de deux demi-droites, portées par ${eq(1, h)} et ${eq(-1, -h)}.`, ecart: () => 0, droiteDe: x => (x >= -h ? [1, h] : [-1, -h]) };
      return { f, coupures: [], hor: [], ver: [], obl, dir: [-1, 1], lim,
        verdict: `Deux asymptotes obliques différentes : ${eq(1, h)} en +∞ et ${eq(-1, -h)} en −∞. En effet x² + bx + c = (x + b/2)² + q avec q = c − b²/4 = ${frc(q, 6)}, et l'écart vaut q / (f(x) + |x + b/2|), qui tend vers 0 : ${q > 0 ? 'la courbe est au-dessus de ses deux asymptotes' : 'chacune des deux branches de la courbe est au-dessous de son asymptote, et la fonction n\'est pas définie entre les deux racines du trinôme'}.`,
        raccords: q < 0 ? [{ x: -h - Math.sqrt(-q), cote: -1 }, { x: -h + Math.sqrt(-q), cote: 1 }] : [],
        ecart: x => q / (f(x) + Math.abs(x + h)), droiteDe: x => (x >= -h ? [1, h] : [-1, -h]) }; } },
  { nom: 'ax + b ln x', sert: 'ab', def: { A: 10, B: 20, C: 0, D: 0 },
    tex: P => `f(x) = ${som([[P.a, 'x'], [P.b, '\\ln x']])}`,
    analyse(P) { const { a, b } = P, f = x => x > 0 ? a * x + b * Math.log(x) : NaN;
      if (P.B === 0) return { f: x => x > 0 ? a * x : NaN, coupures: [], hor: [], ver: [], obl: [], dir: [null, a], lim: [['f(x)/x en +∞', dec(a)], ['f(x) − ax en +∞', '0']], verdict: `Avec b = 0, la courbe est la demi-droite ${eq(a, 0)}, pour x > 0.` };
      return { f, coupures: [], hor: [], ver: [{ x: 0 }], obl: [], dir: [null, a], fantome: [a, 0], lim: [['f(x)/x en +∞', dec(a)], ['f(x) − ax en +∞', INF(b)], ['à droite de 0', INF(-b)]],
        verdict: `Pas d'asymptote en +∞ : f(x)/x tend bien vers ${dec(a)}, car ln x / x tend vers 0, mais f(x) − ax = b ln x tend vers ${INF(b)}. C'est une branche parabolique de direction ${eq(a, 0)} (droite tracée en gris) : la courbe en prend la direction et s'en éloigne indéfiniment. Asymptote verticale x = 0.`, ecart: x => b * Math.log(x), droite: [a, 0] }; } },
  { nom: 'ax + b + c e⁻ˣ', sert: 'abc', def: { A: 10, B: -20, C: 40, D: 0 },
    tex: P => `f(x) = ${som([[P.a, 'x'], [P.b, ''], [P.c, 'e^{-x}']])}`,
    analyse(P) { const { a, b, c } = P, f = x => a * x + b + c * Math.exp(-x);
      if (P.C === 0) return { f, coupures: [], hor: [], ver: [], obl: [], dir: [a, a], lim: [['f(x)/x en ±∞', dec(a)], ['f(x) − ax en ±∞', dec(b)]], verdict: `Avec c = 0, la courbe est la droite ${eq(a, b)} elle-même.` };
      return { f, coupures: [], hor: P.A === 0 ? [{ y: b, cote: 1 }] : [], ver: [], obl: P.A === 0 ? [] : [{ m: a, p: b, cote: 1 }], dir: [null, a], lim: [['f(x)/x en +∞', dec(a)], ['f(x) − ax en +∞', dec(b)], ['f(x)/x en −∞', INF(-c)]],
        verdict: `En +∞, e⁻ˣ tend vers 0 : la droite ${eq(a, b)} est asymptote${P.A === 0 ? ' (horizontale, puisque a = 0)' : ' oblique'}, et la courbe est ${c > 0 ? 'au-dessus' : 'au-dessous'} d'elle. En −∞, c e⁻ˣ l'emporte sur ax : f(x)/x tend vers ${INF(-c)}, et la courbe a une branche parabolique de direction l'axe des ordonnées, sans asymptote.`, ecart: x => c * Math.exp(-x), droite: [a, b] }; } },
];

const FENETRES = [6, 12, 30, 100];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let classe = lireParcours().niveau === 'sup' ? 'sup' : 'terminale';
  const puces = (hote, noms, quand, html) => noms.map((n, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; if (html) bt.innerHTML = n; else bt.textContent = n; bt.addEventListener('click', () => quand(i)); hote.append(bt); return bt; });
  const bClasse = puces(q('#as-classe'), ['Terminale', 'Maths Sup'], i => { classe = i ? 'sup' : 'terminale'; S.planifier(); });

  // Une figure : sa liste de familles, son état, ses réglages.
  function figure(n, L, lettres) {
    const E = { fn: 0, z: 1, x: 80, ...L[0].def }, id = '#as' + n + '-';
    const bF = puces(q('#as-f' + n), L.map(F => F.nom), i => { E.fn = i; Object.assign(E, L[i].def); E.x = 80; S.planifier(); });
    const bZ = puces(q('#as-z' + n), FENETRES.map(z => '± ' + z), i => { E.z = i; S.planifier(); });
    for (const l of lettres) q(id + l).addEventListener('input', e => { E[l.toUpperCase()] = Math.round(+e.target.value * 20); S.planifier(); });
    q(id + 'x').addEventListener('input', e => { E.x = Math.round(+e.target.value * 20); S.planifier(); });
    let V = null;
    glisser(q('#as-fig' + n), p => { if (!V) return; const x = V.ix(p.x), e = Math.round(x); E.x = Math.round((Math.abs(x - e) < 0.02 * FENETRES[E.z] ? e : x) * 20); S.planifier(); });
    return { E, L, lettres, id, bF, bZ, n, vue: v => { V = v; } };
  }
  const F1 = figure(1, T1, ['a', 'b', 'c']), F2 = figure(2, T2, ['a', 'b', 'c', 'd']);

  function dessiner(G, C) {
    const { E, L, lettres, id, n } = G, F = L[E.fn], Z = FENETRES[E.z];
    const P = { A: E.A, B: E.B, C: E.C, D: E.D || 0, a: E.A / 20, b: E.B / 20, c: E.C / 20, d: (E.D || 0) / 20 }, R = F.analyse(P);
    E.x = borne(E.x, -Z * 20, Z * 20); const x = E.x / 20, y = R.f(x);
    // réglages
    for (const l of lettres) { const sl = q(id + l), sert = F.sert.includes(l); sl.classList.toggle('inutile', !sert); sl.previousElementSibling.classList.toggle('inutile', !sert); sl.nextElementSibling.classList.toggle('inutile', !sert);
      if (Math.abs(+sl.value - P[l]) > 1e-9) sl.value = P[l]; ecrire(q(id + l + 'v'), fr(P[l], 2)); }
    const sx = q(id + 'x'); sx.min = -Z; sx.max = Z; if (Math.abs(+sx.value - x) > 1e-9) sx.value = x; ecrire(q(id + 'xv'), fr(x, 2));
    G.bF.forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.fn))); G.bZ.forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.z)));
    // La formule n'est réécrite que si elle a changé : le site la compose ensuite (KaTeX), ce qui modifie son HTML et sa
    // hauteur ; la réécrire à chaque rendu relançait la composition, donc un changement de hauteur, donc un nouveau rendu
    // (la scène suit la taille de l'activité), sans fin : la figure sautait de quelques pixels en permanence.
    { const el = q('#as-e' + n), t = F.tex(P); if (el.dataset.tex !== t) { el.dataset.tex = t; el.innerHTML = K(t); } }
    // figure
    const { ctx, w, h } = toile(q('#as-fig' + n)), v = vueEgale(w, h, 0, 0, Z); G.vue(v);
    grille(ctx, v, C, true);
    const tirets = [7, 5]; ctx.lineWidth = 2;
    if (R.fantome) { ctx.strokeStyle = C.doux; ctx.setLineDash([3, 5]); trait(ctx, v.X(v.x0), v.Y(R.fantome[0] * v.x0 + R.fantome[1]), v.X(v.x1), v.Y(R.fantome[0] * v.x1 + R.fantome[1])); }
    ctx.strokeStyle = C.vert; ctx.setLineDash(tirets);
    for (const H of R.hor) { const x0 = H.cote > 0 ? Math.max(v.x0, 0) : v.x0, x1 = H.cote < 0 ? Math.min(v.x1, 0) : v.x1; trait(ctx, v.X(x0), v.Y(H.y), v.X(x1), v.Y(H.y)); }
    for (const W of R.ver) trait(ctx, v.X(W.x), 0, v.X(W.x), h);
    for (const O of (R.obl || [])) { const xa = O.cote > 0 ? Math.max(v.x0, O.de || 0) : v.x0, xb = O.cote < 0 ? Math.min(v.x1, O.de || 0) : v.x1; if (xa < xb) trait(ctx, v.X(xa), v.Y(O.m * xa + O.p), v.X(xb), v.Y(O.m * xb + O.p)); }
    ctx.setLineDash([]);
    courbe(ctx, v, R.f, C.encre, 2.6, null, R.coupures);
    // Raccords : près d'une asymptote verticale ou d'une extrémité du domaine, l'échantillonnage de courbe() s'arrête un pas trop tôt.
    // On prolonge le tracé par des points de plus en plus proches (pas divisé par deux, quarante fois).
    { const pasX = (v.x1 - v.x0) / w * 1.6; ctx.strokeStyle = C.encre; ctx.lineWidth = 2.6;
      const racc = (x0, cote, fin) => { ctx.beginPath(); let plume = false; for (let k = 0, hh = pasX; k <= 40; k++, hh /= 2) { const yy = R.f(x0 + cote * hh); if (!isFinite(yy)) continue; const Y = borne(v.Y(yy), -4000, h + 4000); if (plume) ctx.lineTo(v.X(x0 + cote * hh), Y); else { ctx.moveTo(v.X(x0 + cote * hh), Y); plume = true; } } if (plume && fin !== undefined) ctx.lineTo(v.X(x0), v.Y(fin)); ctx.stroke(); };
      for (const W of R.ver) { racc(W.x, -1); racc(W.x, 1); }
      for (const A of (R.raccords || [])) racc(A.x, A.cote, 0); }
    if (R.trou) { ctx.fillStyle = C.fond; ctx.strokeStyle = C.encre; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(v.X(R.trou[0]), v.Y(R.trou[1]), 4.5, 0, 7); ctx.fill(); ctx.stroke(); }
    // étiquettes des asymptotes
    for (const H of R.hor) etiquette(ctx, C, eq(0, H.y), H.cote < 0 ? 8 : w - 8, borne(v.Y(H.y) - 12, 12, h - 12), C.vert, H.cote < 0 ? 'left' : 'right', 12);
    for (const W of R.ver) etiquette(ctx, C, 'x = ' + dec(W.x), borne(v.X(W.x) + 10, 6, w - 60), 14, C.vert, 'left', 12);
    for (const O of (R.obl || [])) { const xe = O.cote < 0 ? v.x0 * 0.72 : v.x1 * 0.72; etiquette(ctx, C, eq(O.m, O.p), borne(v.X(xe), 50, w - 50), borne(v.Y(O.m * xe + O.p) - 14, 12, h - 12), C.vert, 'center', 12); }
    // le point M et l'écart à l'asymptote
    const dr = R.droiteDe ? R.droiteDe(x) : R.droite || (R.hor.length && (R.hor[0].cote === 0 || R.hor[0].cote * x > 0) ? [0, R.hor[0].y] : null);
    const exact = R.ecartH || R.ecart, ecart = isFinite(y) && dr ? (exact ? exact(x) : y - (dr[0] * x + dr[1])) : NaN;   // formule exacte de l'écart quand la famille la donne
    if (isFinite(y)) {
      if (dr && isFinite(ecart)) { ctx.strokeStyle = C.orange; ctx.lineWidth = 2.4; trait(ctx, v.X(x), v.Y(y), v.X(x), v.Y(dr[0] * x + dr[1])); }
      const Y = v.Y(y); if (Y > -20 && Y < h + 20) poignee(ctx, C, v.X(x), Y, C.orange, 'M', Y < 40);
    }
    // lectures
    ecrire(q('#as-l' + n), R.lim.map(([t, val]) => `<dt>${t}</dt><dd>${val}</dd>`).join(''), true);
    ecrire(q('#as-v' + n), R.verdict);
    ecrire(q('#as-m' + n), !isFinite(y) ? `En x = ${fr(x, 2)}, la fonction n'est pas définie.` : `M a pour abscisse ${fr(x, 2)} et pour ordonnée ${num(y)}.` + (dr && isFinite(ecart) ? ` Écart à la droite ${eq(dr[0], dr[1])} : ${num(ecart)}.` : ''));
    // tableau de valeurs
    const xs = [-1000, -100, -10, 10, 100, 1000], lig = (titre, g, infime) => `<tr><td>${titre}</td>${xs.map(t => { const val = g(t); return `<td>${infime && val === 0 ? 'moins de 10⁻³⁰⁸' : num(val)}</td>`; }).join('')}</tr>`;
    let T = `<table><caption>Loin de l'origine</caption><thead><tr><th>x</th>${xs.map(t => `<th>${num(t)}</th>`).join('')}</tr></thead><tbody>${lig('f(x)', R.f)}`;
    if (n === 2) { T += lig('f(x) / x', t => R.f(t) / t);
      if (R.dir && R.dir.some(m => m)) T += lig((() => { const [g, d] = R.dir, m = d === null || d === undefined ? g : d, un = k => 'f(x) ' + (k < 0 ? '+ ' : '− ') + (Math.abs(k) === 1 ? '' : dec(Math.abs(k))) + 'x'; return g !== null && g !== undefined && g !== d ? un(d) + ', ou ' + un(g) + ' si x < 0' : m === 0 ? 'f(x)' : un(m); })(), t => { const m = t < 0 ? R.dir[0] : R.dir[1]; return m === null || m === undefined ? NaN : R.f(t) - m * t; }); }
    else if (R.hor.length && R.hor[0].y !== 0) T += lig('f(x) − ' + dec(R.hor[0].y).replace('−', '(−') + (R.hor[0].y < 0 ? ')' : ''), t => (R.hor[0].cote === 0 || R.hor[0].cote * t > 0) ? (R.ecartH ? R.ecartH(t) : R.f(t) - R.hor[0].y) : NaN, !!R.ecartH && !R.trou);
    T += '</tbody></table>';
    if (R.ver.length) { const c0 = R.ver[0].x, hs = [-0.1, -0.01, -0.001, 0.001, 0.01, 0.1];
      T += `<table><caption>Près de x = ${dec(c0)}</caption><thead><tr><th>${c0 === 0 ? 'x' : 'x − ' + (c0 < 0 ? '(' + dec(c0) + ')' : dec(c0))}</th>${hs.map(t => `<th>${num(t)}</th>`).join('')}</tr></thead><tbody><tr><td>f(x)</td>${hs.map(t => `<td>${num(R.f(c0 + t))}</td>`).join('')}</tr></tbody></table>`; }
    ecrire(q('#as-t' + n), T, true);
  }

  function rendre(C) {
    bClasse.forEach((bt, i) => bt.setAttribute('aria-pressed', String((classe === 'sup') === (i === 1))));
    ecrire(q('#as-classe-dit'), classe === 'sup' ? 'Les asymptotes obliques sont affichées.' : 'Les asymptotes obliques, au programme de Maths Sup, sont masquées.');
    q('#as-sec2').hidden = classe !== 'sup'; racine.querySelectorAll('.as-sup').forEach(e => { e.hidden = classe !== 'sup'; });
    ecrire(q('#as-n3'), classe === 'sup' ? '3' : '2');
    dessiner(F1, C); if (classe === 'sup') dessiner(F2, C);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
