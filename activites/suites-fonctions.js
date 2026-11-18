// Exploration « Suites de fonctions : convergence simple, convergence uniforme » (rubrique Activités, MEMO_atlas_activites.md §167).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, poignee, pastille, glisser, ecrire, fr, frc, borne } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .sf-table { border-collapse: collapse; font: 14px var(--f-ui); margin: 6px 0; }
.activites-act .sf-table th, .activites-act .sf-table td { border: 1px solid var(--filet); padding: 5px 10px; text-align: right; font-variant-numeric: tabular-nums; }
.activites-act .sf-table th { font-weight: 600; color: var(--encre-2); }
.activites-act .sf-formule { min-height: 46px; display: flex; flex-wrap: wrap; gap: 2px 36px; align-items: center; justify-content: center; padding: 8px 12px 0; font-size: 17px; }
`;
const K = t => `<span class="kx">${t}</span>`, KD = t => `<span class="kx kxd">${t}</span>`;

export const html = `
<header class="col">
  <p class="eyebrow">Maths Spé · Suites de fonctions</p>
  <h3>Suites de fonctions : convergence simple, convergence uniforme</h3>
  <p class="lede">Dire qu'une suite de fonctions tend vers une fonction peut vouloir dire deux choses. Point par point, chaque valeur finit par s'approcher de sa limite ; uniformément, c'est la courbe entière qui entre dans une bande aussi fine que l'on veut. La figure montre les deux à la fois, et ce qui se perd quand on n'a que la première.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Une suite, sa limite, une bande</h4>
    <p>Choisissez une suite de fonctions : <span class="chips" id="sf-fn"></span></p>
    <p>La courbe de ${K('f_n')} est en bleu, celle de la limite simple ${K('f')} en vert, entourée de la bande de demi-largeur ${K('\\varepsilon')}. Faites croître ${K('n')}, déplacez le point d'abscisse ${K('x_0')}, réglez ${K('\\varepsilon')}.</p>
  </div>
  <div class="fig">
    <div class="sf-formule" id="sf-formule" aria-live="polite"></div>
    <div class="split">
      <canvas id="sf-fig" class="moyen fixe" aria-label="Courbe de f_n, courbe de la limite f et bande de demi-largeur epsilon autour de f"></canvas>
      <div class="side">
        <h5>Au rang <span id="sf-rang"></span></h5>
        <dl class="lectures" aria-live="polite">
          <dt>au point <i>x</i>₀</dt><dd id="sf-pt"></dd>
          <dt>écart en <i>x</i>₀</dt><dd id="sf-ec"></dd>
          <dt>borne supérieure</dt><dd id="sf-sup"></dd>
          <dt>intégrales</dt><dd id="sf-int"></dd>
        </dl>
        <p class="verdict" id="sf-v" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="sf-n">rang <i>n</i></label><input type="range" id="sf-n" min="1" max="60" step="1"><output id="sf-nv"></output>
      <label for="sf-e">bande <i>ε</i></label><input type="range" id="sf-e" min="0.02" max="0.6" step="0.01"><output id="sf-ev"></output>
      <label for="sf-x">point <i>x</i>₀</label><input type="range" id="sf-x" min="0" max="1" step="0.005"><output id="sf-xv"></output>
    </div>
  </div>
  <div class="col">
    <p>Ce qu'il faut lire : la « borne supérieure de l'écart » est celle de ${K('|f_n(x) - f(x)|')} sur tout l'intervalle ; elle peut ne pas être atteinte. La bande est fermée, bords compris : la courbe de ${K('f_n')} y est entièrement exactement quand cette borne supérieure est au plus égale à ${K('\\varepsilon')}.</p>
    <div class="def">
      <p>Soit ${K('(f_n)')} une suite de fonctions définies sur un intervalle ${K('I')}, à valeurs réelles, et ${K('f')} une fonction définie sur ${K('I')}, à valeurs réelles.</p>
      <p>La suite <b>converge simplement</b> vers ${K('f')} si, pour tout ${K('x \\in I')}, la suite de nombres ${K('(f_n(x))')} tend vers ${K('f(x)')}.</p>
      <p>Elle <b>converge uniformément</b> vers ${K('f')} sur ${K('I')} si ${K('\\displaystyle\\sup_{x \\in I} |f_n(x) - f(x)|')} est fini à partir d'un certain rang et tend vers 0.</p>
    </div>
    <p>La différence tient à l'ordre des quantificateurs. Simplement : pour tout ${K('x')} et tout ${K('\\varepsilon > 0')}, il existe un rang ${K('N')}, <em>qui peut dépendre de ${K('x')}</em>, à partir duquel ${K('|f_n(x) - f(x)| \\leqslant \\varepsilon')}. Uniformément : pour tout ${K('\\varepsilon > 0')}, il existe un rang ${K('N')}, <em>le même pour tous les ${K('x')}</em>. La convergence uniforme entraîne la convergence simple, puisque ${K('|f_n(x) - f(x)|')} est majoré par la borne supérieure ; la réciproque est fausse, et quatre des six exemples le montrent.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La borne supérieure de l'écart, rang après rang</h4>
    <p>Pour la suite choisie, voici cette borne supérieure sur l'intervalle, calculée par sa formule. Elle tend vers 0 si, et seulement si, la convergence est uniforme.</p>
    <div id="sf-tab" aria-live="polite"></div>
    <p id="sf-pourquoi" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Ce que la convergence uniforme transmet</h4>
    <div class="def">
      <p><b>Continuité.</b> Si les ${K('f_n')} sont continues sur ${K('I')} et convergent uniformément vers ${K('f')} sur ${K('I')}, alors ${K('f')} est continue sur ${K('I')}. <i>Admis ici</i> : la démonstration, qui découpe ${K('|f(x) - f(a)|')} en trois morceaux, est celle du chapitre de cours.</p>
      <p><b>Intégrale.</b> Si les ${K('f_n')} sont continues sur le segment ${K('[a, b]')} et convergent uniformément vers ${K('f')} sur ${K('[a, b]')}, alors ${K('\\displaystyle\\int_a^b f_n \\to \\int_a^b f')}.</p>
    </div>
    <p>Le second énoncé se démontre en une ligne, une fois la continuité de ${K('f')} acquise : ${KD('\\left|\\int_a^b f_n - \\int_a^b f\\right| \\leqslant \\int_a^b |f_n - f| \\leqslant (b - a) \\sup_{[a, b]} |f_n - f|,')} et le dernier membre tend vers 0.</p>
    <p>Les exemples montrent que l'hypothèse ne se supprime pas. Avec ${K('x^n')} sur ${K('[0, 1]')}, les ${K('f_n')} sont continues et leur limite ne l'est pas : la convergence ne peut donc pas être uniforme, et la bande le confirme. Avec la bosse haute ${K('n^2x\\,e^{-nx}')}, la limite simple est la fonction nulle alors que les intégrales tendent vers 1 : l'aire de la bosse ne disparaît pas, elle se concentre près de 0. À l'inverse, ${K('x^n')} et la bosse glissante ${K('nx\\,e^{-nx}')} ont des intégrales qui tendent bien vers celle de la limite sans que la convergence soit uniforme : l'hypothèse est suffisante, elle n'est pas nécessaire.</p>
  </div>
</section>
` + suite(
  `Vérifier la convergence en chaque point et conclure que « ${K('f_n')} tend vers ${K('f')} » avec toutes les conséquences que l'on en attend. Pour la bosse glissante ${K('nx\\,e^{-nx}')}, chaque valeur ${K('f_n(x_0)')} tend vers 0, et pourtant le sommet de la bosse reste à la hauteur ${K('\\dfrac1e')} : il se déplace seulement vers la gauche, en ${K('x = \\dfrac1n')}. Déplacez ${K('x_0')} : plus il est proche de 0, plus il faut attendre pour que la bosse soit passée. L'autre erreur est d'oublier l'intervalle : la même suite ${K('x^n')} converge uniformément sur ${K('[0, a]')} pour tout ${K('a')} de ${K(']0, 1[')}, où la borne supérieure de l'écart vaut ${K('a^n')}, et pas sur ${K('[0, 1]')}.`,
  `Le chapitre de deuxième année <a href="#cours/mp-08">Suites et séries de fonctions</a> démontre les deux théorèmes de la section 3 et celui de dérivation. Dans l'édifice, la fiche <a href="#anf-continues.fc-uniforme">Convergence uniforme</a> place ces énoncés dans l'espace des fonctions continues sur un compact, muni de la norme de la borne supérieure.`,
  `Aucune borne supérieure n'est estimée sur le tracé : chacune vient de sa formule, établie par l'étude de ${K('f_n - f')} (dérivée, point où elle s'annule). Pour ${K('x^n')}, la borne supérieure vaut 1 et n'est pas atteinte ; pour ${K('x^n(1 - x)')}, elle vaut ${K('\\dfrac{n^n}{(n+1)^{n+1}}')}, atteinte en ${K('\\dfrac{n}{n+1}')} ; pour les deux bosses, ${K('\\dfrac1e')} et ${K('\\dfrac{n}{e}')}, atteintes en ${K('\\dfrac1n')} ; pour ${K('\\dfrac{\\sin(nx)}{n}')}, ${K('\\dfrac1n')} ; pour ${K('\\dfrac{nx}{1 + n^2x^2}')}, ${K('\\dfrac12')}, atteinte en ${K('\\dfrac1n')}. Les intégrales sont elles aussi données par leur formule. Le rang à partir duquel la courbe reste dans la bande est cherché en parcourant les rangs un à un, ce qui est légitime ici parce que la borne supérieure de l'écart décroît avec ${K('n')} dans les deux exemples uniformes : c'est évident pour ${K('\\dfrac1n')}, et pour le second la fonction ${K('t \\mapsto t\\ln t - (t+1)\\ln(t+1)')} a pour dérivée ${K('\\ln\\dfrac{t}{t+1} < 0')}. Les nombres sont arrondis à 10⁻⁴, avec moins de décimales au-delà de 10 : dans le tableau, « 0,0000 » désigne un nombre strictement positif inférieur à 0,00005, et « 1,0000 » un nombre strictement inférieur à 1 ; seule l'intégrale de ${K('\\dfrac{\\sin(nx)}{n}')}, exactement nulle, est écrite 0. Rien n'est enregistré ni envoyé.`);

// Chaque suite : f(n, x), limite simple, intervalle, fenêtre verticale, sup (valeur, atteint ?, où), intégrales, uniforme ?, explication.
const E1 = Math.E;
const FN = [
  { nom: 'xⁿ', tex: n => `f_n(x) = x^{${n}} \\text{ sur } [0, 1]`, a: 0, b: 1, y0: -0.15, y1: 1.15, f: (n, x) => Math.pow(x, n), lim: x => x === 1 ? 1 : 0, saut: [1],
    sup: n => 1, atteint: false, ou: n => null, int: n => 1 / (n + 1), intLim: 0, unif: false,
    limTex: 'f(x) = 0 \\text{ si } x < 1,\\quad f(1) = 1',
    pourquoi: `Pour ${K('0 \\leqslant x < 1')}, l'écart ${K('|f_n(x) - f(x)| = x^n')} est aussi proche de 1 que l'on veut quand ${K('x')} approche de 1 : la borne supérieure vaut 1 pour tout ${K('n')}, sans être atteinte. Elle ne tend pas vers 0 : la convergence n'est pas uniforme sur ${K('[0, 1]')}. On le savait d'avance, puisque la limite n'est pas continue (section 3).` },
  { nom: 'xⁿ(1 − x)', tex: n => `f_n(x) = x^{${n}}(1 - x) \\text{ sur } [0, 1]`, a: 0, b: 1, y0: -0.05, y1: 0.3, f: (n, x) => Math.pow(x, n) * (1 - x), lim: x => 0, saut: [],
    sup: n => Math.exp(n * Math.log(n) - (n + 1) * Math.log(n + 1)), atteint: true, ou: n => n / (n + 1), int: n => 1 / ((n + 1) * (n + 2)), intLim: 0, unif: true,
    limTex: 'f(x) = 0',
    pourquoi: `La dérivée ${K("f_n'(x) = x^{n-1}\\left(n - (n+1)x\\right)")} s'annule en ${K('\\dfrac{n}{n+1}')}, où ${K('f_n')} atteint son maximum ${K('\\dfrac{n^n}{(n+1)^{n+1}} = \\dfrac{1}{n+1}\\left(1 - \\dfrac{1}{n+1}\\right)^n \\leqslant \\dfrac{1}{n+1}')}. Ce maximum tend vers 0 : la convergence est uniforme sur ${K('[0, 1]')}. Le facteur ${K('1 - x')} écrase la courbe précisément là où ${K('x^n')} résistait.` },
  { nom: 'bosse glissante', tex: n => `f_n(x) = ${n === 1 ? '' : n}x\\,e^{-${n === 1 ? '' : n}x} \\text{ sur } [0, 2]`, a: 0, b: 2, y0: -0.06, y1: 0.5, f: (n, x) => n * x * Math.exp(-n * x), lim: x => 0, saut: [],
    sup: n => 1 / E1, atteint: true, ou: n => 1 / n, int: n => (1 - (1 + 2 * n) * Math.exp(-2 * n)) / n, intLim: 0, unif: false,
    limTex: 'f(x) = 0',
    pourquoi: `La convergence simple vers 0 résulte des croissances comparées. En posant ${K('t = nx')}, on a ${K('f_n(x) = t\\,e^{-t}')}, dont le maximum sur ${K('[0, +\\infty[')} est ${K('\\dfrac1e')}, atteint en ${K('t = 1')}, c'est-à-dire en ${K('x = \\dfrac1n')}, qui est dans l'intervalle. La borne supérieure vaut ${K('\\dfrac1e \\approx 0{,}3679')} pour tout ${K('n')} : elle ne tend pas vers 0, et la convergence n'est pas uniforme sur ${K('[0, 2]')}. Elle l'est en revanche sur ${K('[a, 2]')} pour tout ${K('a')} de ${K(']0, 2[')}, une fois la bosse passée à gauche de ${K('a')}.` },
  { nom: 'sin(nx)/n', tex: n => `f_n(x) = \\dfrac{\\sin(${n === 1 ? '' : n}x)}{${n}} \\text{ sur } [0, 2\\pi]`, a: 0, b: 2 * Math.PI, y0: -1.15, y1: 1.15, f: (n, x) => Math.sin(n * x) / n, lim: x => 0, saut: [],
    sup: n => 1 / n, atteint: true, ou: n => Math.PI / (2 * n), int: n => 0, intLim: 0, unif: true,
    limTex: 'f(x) = 0',
    pourquoi: `Comme ${K('|\\sin(nx)| \\leqslant 1')}, avec égalité en ${K('x = \\dfrac{\\pi}{2n}')}, la borne supérieure vaut exactement ${K('\\dfrac1n')} et tend vers 0 : la convergence est uniforme sur ${K('[0, 2\\pi]')}. Remarquez pourtant que les dérivées ${K("f_n'(x) = \\cos(nx)")} ne convergent même pas simplement, puisqu'en ${K('x = \\pi')} la suite ${K('\\cos(n\\pi) = (-1)^n')} n'a pas de limite : la convergence uniforme ne dit rien des dérivées.` },
  { nom: 'nx/(1 + n²x²)', tex: n => `f_n(x) = \\dfrac{${n === 1 ? '' : n}x}{1 + ${n === 1 ? '' : n * n}x^2} \\text{ sur } [0, 2]`, a: 0, b: 2, y0: -0.08, y1: 0.65, f: (n, x) => n * x / (1 + n * n * x * x), lim: x => 0, saut: [],
    sup: n => 0.5, atteint: true, ou: n => 1 / n, int: n => Math.log(1 + 4 * n * n) / (2 * n), intLim: 0, unif: false,
    limTex: 'f(x) = 0',
    pourquoi: `Pour ${K('t \\geqslant 0')}, ${K('\\dfrac{t}{1 + t^2} \\leqslant \\dfrac12')} car ${K('(1 - t)^2 \\geqslant 0')}, avec égalité en ${K('t = 1')}. Avec ${K('t = nx')}, la borne supérieure vaut ${K('\\dfrac12')}, atteinte en ${K('x = \\dfrac1n')} : elle ne tend pas vers 0, et la convergence n'est pas uniforme sur ${K('[0, 2]')}.` },
  { nom: 'bosse haute', tex: n => `f_n(x) = ${n === 1 ? '' : n * n}x\\,e^{-${n === 1 ? '' : n}x} \\text{ sur } [0, 2]`, a: 0, b: 2, y0: -0.3, y1: 4.2, f: (n, x) => n * n * x * Math.exp(-n * x), lim: x => 0, saut: [],
    sup: n => n / E1, atteint: true, ou: n => 1 / n, int: n => 1 - (1 + 2 * n) * Math.exp(-2 * n), intLim: 0, unif: false,
    limTex: 'f(x) = 0',
    pourquoi: `C'est la bosse glissante multipliée par ${K('n')} : son sommet, toujours en ${K('x = \\dfrac1n')}, est à la hauteur ${K('\\dfrac{n}{e}')}, qui tend vers ${K('+\\infty')}. La convergence simple vers 0 a pourtant lieu en chaque point, par croissances comparées. Et ${K('\\displaystyle\\int_0^2 f_n = 1 - (1 + 2n)e^{-2n}')} tend vers 1, alors que l'intégrale de la limite est nulle : sans convergence uniforme, on ne peut pas échanger limite et intégrale.` }];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, n: 3, e: 20, x: 600 };   // ε en centièmes ; x₀ en millièmes de la longueur de l'intervalle
  let V = null;
  FN.forEach((F, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = F.nom; bt.addEventListener('click', () => { E.fn = i; S.planifier(); }); q('#sf-fn').append(bt, ' '); });
  q('#sf-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#sf-e').addEventListener('input', e => { E.e = Math.round(+e.target.value * 100); S.planifier(); });
  q('#sf-x').addEventListener('input', e => { E.x = Math.round(+e.target.value * 1000); S.planifier(); });
  const d4 = t => fr(t, 4), grand = t => t >= 100 ? fr(t, 1) : t >= 10 ? fr(t, 2) : fr(t, 4);
  // La courbe de f_n est-elle dans la bande de demi-largeur eps ? Décidé par la borne supérieure, non par le tracé.
  const dedans = (F, n, eps) => F.sup(n) <= eps;   // bande fermée

  function rendre(C) {
    const F = FN[E.fn], n = E.n, eps = E.e / 100, x0 = F.a + (F.b - F.a) * E.x / 1000, fx = F.f(n, x0), lx = F.lim(x0), sup = F.sup(n);
    racine.querySelectorAll('#sf-fn .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.fn)));
    { const el = q('#sf-formule'), t = F.tex(n) + ' \\qquad ' + F.limTex; if (el.dataset.tex !== t) { el.dataset.tex = t; el.innerHTML = K(F.tex(n)) + K(F.limTex); } }   // réécrite seulement si le LaTeX change (§160)
    for (const [id, val, txt] of [['n', n, String(n)], ['e', eps, fr(eps, 2)], ['x', E.x / 1000, fr(x0, 3)]]) { const r = q('#sf-' + id); if (+r.value !== val) r.value = val; ecrire(q('#sf-' + id + 'v'), txt); }
    ecrire(q('#sf-rang'), 'n = ' + n);
    const { ctx, w, h } = toile(q('#sf-fig')), m = (F.b - F.a) * 0.04, v = vue(w, h, F.a - m, F.b + m, F.y0, F.y1); V = v;
    grille(ctx, v, C, false);
    // bande autour de la limite (la limite est nulle sauf pour xⁿ, où elle saute en 1)
    ctx.fillStyle = C.vert; ctx.globalAlpha = .16; ctx.fillRect(v.X(F.a), v.Y(eps), v.X(F.b) - v.X(F.a), v.Y(-eps) - v.Y(eps)); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.vert; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); trait(ctx, v.X(F.a), v.Y(eps), v.X(F.b), v.Y(eps)); trait(ctx, v.X(F.a), v.Y(-eps), v.X(F.b), v.Y(-eps)); ctx.setLineDash([]);
    ctx.lineWidth = 3; trait(ctx, v.X(F.a), v.Y(0), v.X(F.b), v.Y(0));
    if (F.saut.length) { pastille(ctx, v.X(1), v.Y(0), C.fond, 5); ctx.strokeStyle = C.vert; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(v.X(1), v.Y(0), 5, 0, 7); ctx.stroke(); pastille(ctx, v.X(1), v.Y(1), C.vert, 5);
      ctx.fillStyle = C.vert; ctx.globalAlpha = .16; ctx.fillRect(v.X(1) - 4, v.Y(1 + eps), 8, v.Y(1 - eps) - v.Y(1 + eps)); ctx.globalAlpha = 1; }
    // courbe de f_n : tracée sur l'intervalle seulement, avec un pas fin près de 0 où sont les bosses
    ctx.strokeStyle = C.bleu; ctx.lineWidth = 2.5; ctx.beginPath(); const N = Math.max(600, Math.round(w * 2));
    for (let i = 0; i <= N; i++) { const t = i / N, x = F.a + (F.b - F.a) * (E.fn === 0 || E.fn === 1 || E.fn === 3 ? t : t * t), X = v.X(x), Y = v.Y(F.f(n, x)); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke();
    // point où la borne supérieure de l'écart est atteint
    const xs = F.ou(n); if (xs !== null && F.f(n, xs) <= F.y1) { ctx.strokeStyle = C.orange; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); trait(ctx, v.X(xs), v.Y(F.lim(xs)), v.X(xs), v.Y(F.f(n, xs))); ctx.setLineDash([]); pastille(ctx, v.X(xs), v.Y(F.f(n, xs)), C.orange, 4.5); }
    // point x₀
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); trait(ctx, v.X(x0), v.Y(F.y0), v.X(x0), v.Y(F.y1)); ctx.setLineDash([]);
    pastille(ctx, v.X(x0), v.Y(lx), C.vert, 4.5); if (fx <= F.y1) poignee(ctx, C, v.X(x0), v.Y(fx), C.bleu, '', false); else etiquette(ctx, C, '↑', v.X(x0), 14, C.bleu, 'center', 15);
    etiquette(ctx, C, 'x₀', v.X(x0), h - 12, C.encre, 'center', 13);
    etiquette(ctx, C, 'fₙ', v.X(F.b) - 16, borne(v.Y(F.f(n, F.b)) - 14, 14, h - 30), C.bleu, 'center', 14); etiquette(ctx, C, 'f', v.X(F.a + (F.b - F.a) * .45), v.Y(0) + 30, C.vert, 'center', 14);
    // lectures
    const ec = Math.abs(fx - lx);
    ecrire(q('#sf-pt'), `fₙ ${fx === 0 ? '= 0' : fx === 1 ? '= 1' : '≈ ' + grand(fx)} ; f = ${fr(lx, 0)}`);
    ecrire(q('#sf-ec'), `${ec === 0 ? '0' : '≈ ' + grand(ec)} ${ec <= eps ? '≤' : '>'} ε`);
    ecrire(q('#sf-sup'), (E.fn === 0 ? '1 ; non atteinte' : (E.fn === 4 ? '0,5' : E.fn === 3 && Number.isInteger(1 / sup) && [1, 2, 4, 5, 8, 10, 16, 20, 25, 40, 50].includes(n) ? fr(sup, 4) : '≈ ' + grand(sup)) + (xs !== null ? ` ; atteint${E.fn === 3 ? ' notamment' : ''} en x ${(E.fn === 1 ? (1000 * n) % (n + 1) === 0 : E.fn !== 3 && 1000 % n === 0) ? '=' : '≈'} ${frc(xs, 3)}` : '')));
    ecrire(q('#sf-int'), `de fₙ : ${E.fn === 3 ? '0' : '≈ ' + d4(F.int(n))} ; de f : ${fr(F.intLim, 0)}`);
    const ok = dedans(F, n, eps);
    let rang = null; if (F.unif) { for (let k = 1; k <= 200000; k++) if (dedans(F, k, eps)) { rang = k; break; } }
    ecrire(q('#sf-v'), F.unif
      ? `${ok ? `La courbe de fₙ est entièrement dans la bande.` : `La courbe de fₙ sort encore de la bande.`} La borne supérieure de l'écart décroît vers 0 : pour ε = ${fr(eps, 2)}, toutes les courbes sont dans la bande dès le rang ${rang}, quel que soit le point. La convergence est uniforme.`
      : E.fn === 0 ? `La courbe de fₙ sort de la bande, et il en sera ainsi à tout rang : près de 1, xⁿ dépasse ε = ${fr(eps, 2)}. En x₀ pourtant, l'écart finit par passer sous ε. La convergence est simple, pas uniforme.`
      : sup <= eps ? `Pour cette valeur de ε, au moins égale à la borne supérieure de l'écart, la courbe est dans la bande. Mais la convergence uniforme demande une bande aussi fine que l'on veut : ${E.fn === 5 ? 'faites croître n, ou diminuez ε' : 'diminuez ε'}.`
      : `La courbe de fₙ sort de la bande au voisinage de x = 1/n, et il en sera ainsi à tous les rangs suivants, puisque la borne supérieure de l'écart ${E.fn === 5 ? 'grandit avec n' : 'ne dépend pas de n'}. En x₀ pourtant, l'écart finit par passer sous ε. La convergence est simple, pas uniforme.`);
    // tableau et explication (réécrits seulement au changement de suite)
    const tab = q('#sf-tab'); if (tab.dataset.fn !== String(E.fn)) { tab.dataset.fn = String(E.fn); const R = [1, 2, 5, 10, 20, 50, 100, 1000];
      tab.innerHTML = `<div style="overflow-x:auto"><table class="sf-table"><tr><th>n</th>${R.map(k => `<td>${k.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ')}</td>`).join('')}</tr><tr><th>borne supérieure de l'écart</th>${R.map(k => `<td>${grand(F.sup(k))}</td>`).join('')}</tr><tr><th>intégrale de fₙ</th>${R.map(k => `<td>${E.fn === 3 ? '0' : d4(F.int(k))}</td>`).join('')}</tr></table></div>`;
      q('#sf-pourquoi').innerHTML = F.pourquoi; }
  }
  const S = scene(racine, rendre);
  glisser(q('#sf-fig'), p => { if (!V) return; const F = FN[E.fn]; E.x = Math.round(borne((V.ix(p.x) - F.a) / (F.b - F.a), 0, 1) * 1000); S.planifier(); });
  return S.arreter;
}
