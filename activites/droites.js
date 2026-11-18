// Exploration « Deux droites, un système » (rubrique Activités, MEMO_atlas_activites.md §167).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vueEgale, grille, trait, etiquette, pastille, ecrire, fr, frc, pgcd } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .dr-eq { font: 15px/1.5 var(--f-ui); margin: 0 0 8px; }
.activites-act .dr-eq b { font-weight: 600; }
.activites-act .dr-etapes { margin: 8px 0 0; padding-left: 20px; font: 14px/1.55 var(--f-ui); }
.activites-act .dr-etapes li { margin-bottom: 4px; }
`;
const K = t => `<span class="kx">${t}</span>`;

export const html = `
<header class="col">
  <p class="eyebrow">Seconde, Première · Équations de droites et systèmes</p>
  <h3>Deux droites, un système</h3>
  <p class="lede">Résoudre un système de deux équations linéaires à deux inconnues, c'est chercher les points communs à deux droites. La figure et le calcul disent alors la même chose : un point, aucun, ou une droite entière.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Les deux droites</h4>
    <p>Chaque équation ${K('ax + by = c')}, où ${K('a')} et ${K('b')} ne sont pas tous deux nuls, est celle d'une droite, comme l'établit le chapitre <a href="#cours/s-08">Équations cartésiennes</a>. On écrit ici le second membre à droite : l'équation ${K('ax + by + c = 0')} du cours correspond à ${K('ax + by = -c')}. Réglez les six coefficients, ou partez de l'un de ces exemples : <span class="chips" id="dr-ex"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="dr-fig" class="moyen" aria-label="Les deux droites du système et leur éventuel point d'intersection"></canvas>
      <div class="side">
        <h5>Le système</h5>
        <p class="dr-eq" id="dr-s1" aria-live="polite"></p>
        <p class="dr-eq" id="dr-s2" aria-live="polite"></p>
        <dl class="lectures" aria-live="polite">
          <dt>déterminant</dt><dd id="dr-det"></dd>
          <dt>solution</dt><dd id="dr-sol"></dd>
        </dl>
        <p class="verdict" id="dr-v" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="dr-a1"><b class="c-mark">d₁</b> : <i>a</i></label><input type="range" id="dr-a1" min="-5" max="5" step="0.05"><output id="dr-a1v"></output>
      <label for="dr-b1"><b class="c-mark">d₁</b> : <i>b</i></label><input type="range" id="dr-b1" min="-5" max="5" step="0.05"><output id="dr-b1v"></output>
      <label for="dr-c1"><b class="c-mark">d₁</b> : <i>c</i></label><input type="range" id="dr-c1" min="-10" max="10" step="0.05"><output id="dr-c1v"></output>
      <label for="dr-a2"><b class="c-sec">d₂</b> : <i>a′</i></label><input type="range" id="dr-a2" min="-5" max="5" step="0.05"><output id="dr-a2v"></output>
      <label for="dr-b2"><b class="c-sec">d₂</b> : <i>b′</i></label><input type="range" id="dr-b2" min="-5" max="5" step="0.05"><output id="dr-b2v"></output>
      <label for="dr-c2"><b class="c-sec">d₂</b> : <i>c′</i></label><input type="range" id="dr-c2" min="-10" max="10" step="0.05"><output id="dr-c2v"></output>
    </div>
  </div>
  <div class="col">
    <p>Ce qu'il faut lire : un couple ${K('(x \\,;\\, y)')} est solution du système exactement quand le point de coordonnées ${K('(x \\,;\\, y)')} est sur les deux droites à la fois. Deux droites du plan sont sécantes, strictement parallèles ou confondues : le système a donc une solution, aucune, ou une infinité, et jamais exactement deux.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que décide le déterminant</h4>
    <p>La droite ${K('ax + by = c')} a pour vecteur directeur ${K('\\vec u(-b \\,;\\, a)')}. Les deux droites sont parallèles, au sens large, quand leurs vecteurs directeurs ${K('(-b \\,;\\, a)')} et ${K("(-b' \\,;\\, a')")} sont colinéaires, c'est-à-dire quand ${K("(-b) \\times a' - a \\times (-b') = 0")}.</p>
    <div class="def"><p>On suppose que ${K('a')} et ${K('b')} ne sont pas tous deux nuls, et ${K("a'")} et ${K("b'")} non plus. Le système formé par ${K('ax + by = c')} et ${K("a'x + b'y = c'")} a une solution unique si, et seulement si, ${K("ab' - a'b \\neq 0")}. Cette solution est alors</p><p>${`<span class="kx kxd">x = \\dfrac{cb' - c'b}{ab' - a'b}, \\qquad y = \\dfrac{ac' - a'c}{ab' - a'b}.</span>`}</p></div>
    <p>La démonstration tient dans la méthode par combinaison, que la page déroule ci-dessous avec vos coefficients : on multiplie la première équation par ${K("b'")}, la seconde par ${K('b')}, et l'on retranche pour faire disparaître ${K('y')}. Ce calcul montre qu'une solution, s'il y en a une, ne peut être que le couple annoncé ; on vérifie ensuite que ce couple convient, car ${K("a(cb' - c'b) + b(ac' - a'c) = c(ab' - a'b)")} et ${K("a'(cb' - c'b) + b'(ac' - a'c) = c'(ab' - a'b)")}.</p>
    <ol class="dr-etapes" id="dr-etapes" aria-live="polite"></ol>
    <p>Si ${K("ab' - a'b = 0")}, les vecteurs ${K('(a \\,;\\, b)')} et ${K("(a' \\,;\\, b')")}, qui ne sont pas nuls, sont colinéaires, d'après le critère que l'exploration <a href="#activites/vecteurs">Vecteurs</a> démontre : il existe un nombre ${K('k')}, non nul, tel que ${K("a' = ka")} et ${K("b' = kb")}. Ou bien ${K("c' = kc")} : la seconde équation est la première multipliée par ${K('k')}, et les deux décrivent la même droite. Ou bien ${K("c' \\neq kc")} : un point commun vérifierait à la fois ${K("a'x + b'y = kc")} et ${K("a'x + b'y = c'")}, ce qui est impossible. Le système n'a donc une solution unique que si le déterminant n'est pas nul.</p>
    <p>La résolution générale d'un système et les formules ci-dessus vont au-delà de ce que le programme de Seconde exige depuis la rentrée 2026 : il se limite au point d'intersection de deux droites sécantes données par leur équation réduite.</p>
  </div>
</section>
` + suite(
  `Croire qu'un système a toujours une solution, et « trouver » ${K('0 = 3')} ou ${K('0 = 0')} sans savoir qu'en faire. Quand l'élimination d'une inconnue, faite avec des multiplicateurs non nuls, fait disparaître les deux, une égalité fausse signifie que les droites sont strictement parallèles : le système n'a aucune solution. Une égalité toujours vraie signifie qu'elles sont confondues : il y en a une infinité, tous les points de la droite. L'autre piège est de lire le coefficient directeur sur ${K('ax + by = c')} comme étant ${K('a')} : il vaut ${K('-\\dfrac{a}{b}')} quand ${K('b \\neq 0')}, et la droite est parallèle à l'axe des ordonnées quand ${K('b = 0')}.`,
  `Le chapitre de Seconde <a href="#cours/s-08">Équations cartésiennes</a> établit le vecteur directeur ${K('(-b \\,;\\, a)')}, le critère de parallélisme par le déterminant et les deux méthodes de résolution, par substitution et par combinaison ; le chapitre <a href="#cours/s-10">Vecteurs</a> énonce le critère de colinéarité. Dans l'édifice, la fiche <a href="#alglin.v-det">Déterminant</a> généralise ce nombre aux matrices carrées de taille ${K('n')}.`,
  `Les six coefficients avancent par pas de 0,05 et sont traités comme des entiers, en vingtièmes. Le déterminant et les deux numérateurs sont donc calculés exactement, et les trois cas (sécantes, strictement parallèles, confondues) sont distingués sans aucun arrondi. La solution est écrite en fraction irréductible quand son dénominateur ne dépasse pas 20, en écriture décimale quand celle-ci est exacte avec quatre décimales au plus, et sinon par une valeur approchée à 10⁻³, précédée de « ≈ ». Rien n'est enregistré ni envoyé.`);

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const EX = [['sécantes', [20, 20, 80, 20, -40, 20]], ['perpendiculaires', [40, 20, 60, 20, -40, -20]], ['strictement parallèles', [20, 40, 80, 10, 20, -20]], ['confondues', [20, -40, 60, -10, 20, -30]], ['une verticale', [20, 0, 60, 20, 20, 40]]];
  const E = { c: EX[0][1].slice(), ex: 0 }, ID = ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'];
  ID.forEach((id, i) => q('#dr-' + id).addEventListener('input', e => { E.c[i] = Math.round(+e.target.value * 20); E.ex = -1; S.planifier(); }));
  EX.forEach((x, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = x[0]; bt.addEventListener('click', () => { E.c = x[1].slice(); E.ex = i; S.planifier(); }); q('#dr-ex').append(bt, ' '); });
  // Écritures : nombres en vingtièmes ; fraction n/d réduite (d > 0), affichée exacte si d ≤ 20.
  const dc = n => frc(n / 20, 2), rat = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = pgcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n).replace('-', '−') : d <= 20 ? `${String(n).replace('-', '−')}/${d}` : 10000 % d === 0 ? frc(n / d, 4) : '≈ ' + fr(n / d, 3); };
  const sol = (nom, n, d) => { const t = rat(n, d); return t[0] === '≈' ? `${nom} ${t}` : `${nom} = ${t}`; };
  const equation = (a, b, c) => { const t = []; const terme = (k, l) => { if (!k) return; const v = Math.abs(k) / 20, s = k < 0 ? '−' : '+'; t.push((t.length ? ` ${s} ` : (k < 0 ? '−' : '')) + (v === 1 ? '' : frc(v, 2)) + l); }; terme(a, 'x'); terme(b, 'y'); return (t.join('') || '0') + ' = ' + dc(c); };

  function rendre(C) {
    const [a, b, c, a2, b2, c2] = E.c, D = a * b2 - a2 * b, Nx = c * b2 - c2 * b, Ny = a * c2 - a2 * c;   // D, Nx, Ny en 1/400
    const deg1 = !a && !b, deg2 = !a2 && !b2;
    const { ctx, w, h } = toile(q('#dr-fig')), v = vueEgale(w, h, 0, 0, Math.max(7.2, 5 * w / h)); grille(ctx, v, C, true);
    const tracer = (A, B, Cc, couleur, nom, ep) => { if (!A && !B) return; ctx.strokeStyle = couleur; ctx.lineWidth = ep;
      // point de la droite le plus proche de l'origine, puis direction (−b ; a)
      const n2 = A * A + B * B, x0 = A * Cc / n2, y0 = B * Cc / n2, n = Math.sqrt(n2), dx = -B / n, dy = A / n, T = 40;
      trait(ctx, v.X(x0 - T * dx), v.Y(y0 - T * dy), v.X(x0 + T * dx), v.Y(y0 + T * dy));
      // étiquette posée sur la droite, à l'intérieur de la fenêtre
      for (const t of [4.2, -4.2, 2.5, -2.5, 1, 0]) { const X = v.X(x0 + t * dx), Y = v.Y(y0 + t * dy); if (X > 24 && X < w - 24 && Y > 18 && Y < h - 18) { etiquette(ctx, C, nom, X + 12 * dy, Y + 12 * dx, couleur, 'center', 14); break; } } };
    const confondues = !deg1 && !deg2 && D === 0 && Nx === 0 && Ny === 0;
    tracer(a2, b2, c2, C.orange, 'd₂', confondues ? 7 : 3); tracer(a, b, c, C.bleu, 'd₁', 3);
    if (!deg1 && !deg2 && D !== 0) { const X = v.X(Nx / D), Y = v.Y(Ny / D); if (X > -20 && X < w + 20 && Y > -20 && Y < h + 20) { pastille(ctx, X, Y, C.fond, 8); pastille(ctx, X, Y, C.vert, 6); etiquette(ctx, C, 'I', X + 14, Y - 14, C.vert, 'center', 15); } }
    ID.forEach((id, i) => { const r = q('#dr-' + id); if (Math.round(+r.value * 20) !== E.c[i]) r.value = E.c[i] / 20; ecrire(q('#dr-' + id + 'v'), fr(E.c[i] / 20, 2)); });
    racine.querySelectorAll('#dr-ex .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.ex)));
    ecrire(q('#dr-s1'), `<b class="c-mark">d₁</b> : ${equation(a, b, c)}`, true); ecrire(q('#dr-s2'), `<b class="c-sec">d₂</b> : ${equation(a2, b2, c2)}`, true);
    ecrire(q('#dr-det'), `ab′ − a′b = ${frc(D / 400, 4)}`);
    const et = [];
    if (deg1 || deg2) {
      // Équations sans x ni y : 0 = c. Fausse si c ≠ 0 (aucune solution) ; sinon elle ne dit rien, et il reste l'autre.
      const faux = (deg1 && c !== 0) || (deg2 && c2 !== 0), deux = deg1 && deg2, nom = deux ? 'les deux équations' : deg1 ? 'la première équation' : 'la seconde équation';
      ecrire(q('#dr-sol'), faux ? 'aucune' : deux ? 'tous les couples' : 'une infinité');
      ecrire(q('#dr-v'), `Dans ${nom}, les coefficients de x et de y sont tous deux nuls : ${deux ? 'ce ne sont pas des équations de droites' : 'ce n\'est pas l\'équation d\'une droite'}. ${faux ? `Une équation qui s'écrit 0 = k avec k non nul (ici 0 = ${dc(deg1 && c !== 0 ? c : c2)}) est toujours fausse : le système n'a aucune solution.` : deux ? 'Toutes deux s\'écrivent 0 = 0, ce qui est toujours vrai : tout couple de nombres est solution.' : 'Elle s\'écrit 0 = 0, ce qui est toujours vrai : il ne reste que l\'autre équation, et les solutions sont tous les points de l\'autre droite.'}`);
    } else if (D !== 0) {
      ecrire(q('#dr-sol'), `${sol('x', Nx, D)} ; ${sol('y', Ny, D)}`);
      ecrire(q('#dr-v'), `Le déterminant n'est pas nul : les droites sont sécantes, et le système a une solution unique, les coordonnées du point I${Math.abs(Nx / D) > v.x1 || Math.abs(Ny / D) > v.y1 ? ' (hors de la figure)' : ''}.${a * a2 + b * b2 === 0 ? ' Ici aa′ + bb′ = 0 : dans ce repère orthonormé, les deux droites sont de plus perpendiculaires, critère que le produit scalaire établira en Première.' : ''}`);
    } else if (confondues) {
      ecrire(q('#dr-sol'), 'une infinité');
      ecrire(q('#dr-v'), "Le déterminant est nul et les deux équations sont proportionnelles, seconds membres compris : les droites sont confondues. Tout point de la droite donne une solution.");
    } else {
      ecrire(q('#dr-sol'), 'aucune');
      ecrire(q('#dr-v'), "Le déterminant est nul, mais les seconds membres ne sont pas dans le même rapport que les premiers : les droites sont strictement parallèles, et le système n'a aucune solution.");
    }
    if (!deg1 && !deg2) {
      et.push(!b && !b2 ? "Ici b et b′ sont nuls : aucune des deux équations ne contient y, il n'y a rien à éliminer, et la combinaison ne donne que 0 = 0." : `On multiplie la première équation par b′ = ${dc(b2)} et la seconde par b = ${dc(b)}, puis on retranche : les termes en y disparaissent, et il reste (ab′ − a′b) x = cb′ − c′b, c'est-à-dire ${frc(D / 400, 4)} × x = ${frc(Nx / 400, 4)}.`);
      et.push(!a && !a2 ? "Ici a et a′ sont nuls : aucune des deux équations ne contient x, il n'y a rien à éliminer, et la combinaison ne donne que 0 = 0." : `De même, en multipliant la première par a′ = ${dc(a2)} et la seconde par a = ${dc(a)}, puis en retranchant la première de la seconde : (ab′ − a′b) y = ac′ − a′c, c'est-à-dire ${frc(D / 400, 4)} × y = ${frc(Ny / 400, 4)}.`);
      et.push(D !== 0 ? `Comme ${frc(D / 400, 4)} n'est pas nul, on divise : ${sol('x', Nx, D)} et ${sol('y', Ny, D)}. Ce couple convient bien aux deux équations, d'après la vérification faite plus haut.`
        : Nx === 0 && Ny === 0 ? "Les deux combinaisons s'écrivent 0 = 0 : elles n'apprennent rien, et les deux équations de départ sont proportionnelles. Les droites sont confondues."
        : `L'une au moins des deux combinaisons s'écrit 0 = k avec k non nul (ici 0 × x = ${frc(Nx / 400, 4)} et 0 × y = ${frc(Ny / 400, 4)}) : c'est impossible. Le système n'a aucune solution.`);
    } else et.push("L'une des deux équations n'est pas celle d'une droite : la discussion par les droites ne s'applique pas.");
    ecrire(q('#dr-etapes'), et.map(t => `<li>${t}</li>`).join(''), true);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
