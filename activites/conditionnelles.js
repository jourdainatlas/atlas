// Exploration « Probabilités conditionnelles : arbre, tableau, Bayes » (rubrique Activités, MEMO_atlas_activites.md §167).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, trait, etiquette, pastille, ecrire, fr, pgcd } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .pc-deux { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
.activites-act .pc-deux > div { min-width: 0; padding: 10px 10px 4px; }
.activites-act .pc-deux > div + div { border-left: 1px solid var(--filet); }
.activites-act .pc-deux h5 { margin: 0 0 4px; font: 600 13px var(--f-ui); letter-spacing: .04em; text-transform: uppercase; color: var(--encre-3); }
.activites-act .pc-deux canvas { aspect-ratio: 16 / 11; }
@media (max-width: 720px) { .activites-act .pc-deux { grid-template-columns: 1fr; } .activites-act .pc-deux > div + div { border-left: 0; border-top: 1px solid var(--filet); } }
.activites-act .pc-table { border-collapse: collapse; font: 14px var(--f-ui); margin: 4px 0 10px; width: 100%; }
.activites-act .pc-table th, .activites-act .pc-table td { border: 1px solid var(--filet); padding: 5px 8px; text-align: right; font-variant-numeric: tabular-nums; }
.activites-act .pc-table th { font-weight: 600; color: var(--encre-2); text-align: center; }
.activites-act .pc-table td.t, .activites-act .pc-table tr.t td { color: var(--encre-2); }
.activites-act .pc-table td.ab { background: color-mix(in srgb, var(--tan) 22%, transparent); font-weight: 600; }
.activites-act .pc-table td.nb { background: color-mix(in srgb, var(--sec) 18%, transparent); }
`;
const K = t => `<span class="kx">${t}</span>`;

export const html = `
<header class="col">
  <p class="eyebrow">Seconde, Première, Terminale · Probabilités conditionnelles</p>
  <h3>Probabilités conditionnelles : arbre, tableau, Bayes</h3>
  <p class="lede">La probabilité de ${K('B')} sachant ${K('A')} et celle de ${K('A')} sachant ${K('B')} sont deux nombres en général différents, que l'on confond sans cesse. On règle trois probabilités, et la page montre les mêmes données sous quatre formes : un arbre, le même arbre retourné, un tableau d'effectifs, un carré découpé.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Un arbre, et l'arbre retourné</h4>
    <p>On se donne ${K('P(A)')}, puis la probabilité de ${K('B')} selon que ${K('A')} est réalisé ou non. Pour fixer les idées : ${K('A')} est « la personne est malade » et ${K('B')} « son test est positif ». Réglez les trois nombres, ou partez d'un exemple : <span class="chips" id="pc-ex"></span></p>
  </div>
  <div class="fig">
    <div class="pc-deux">
      <div><h5>Arbre donné : d'abord <i>A</i></h5><canvas id="pc-a1" aria-label="Arbre pondéré : A ou son contraire, puis B ou son contraire"></canvas></div>
      <div><h5>Arbre retourné : d'abord <i>B</i></h5><canvas id="pc-a2" aria-label="Arbre pondéré retourné : B ou son contraire, puis A ou son contraire"></canvas></div>
    </div>
    <div class="reglages">
      <label for="pc-p">${K('P(A)')}</label><input type="range" id="pc-p" min="0" max="1" step="0.01"><output id="pc-pv"></output>
      <label for="pc-x">${K('P_A(B)')}</label><input type="range" id="pc-x" min="0" max="1" step="0.01"><output id="pc-xv"></output>
      <label for="pc-y">${K('P_{\\overline{A}}(B)')}</label><input type="range" id="pc-y" min="0" max="1" step="0.01"><output id="pc-yv"></output>
    </div>
  </div>
  <div class="col">
    <p>Ce qu'il faut lire : sur un arbre, la probabilité d'un chemin est le produit des probabilités de ses branches, et la probabilité d'un événement est la somme de celles des chemins qui y mènent. La première règle est la définition de la probabilité conditionnelle, donnée plus bas ; la seconde vient de ce que des chemins différents décrivent des événements incompatibles. L'arbre de droite décrit exactement la même expérience, lue dans l'autre ordre ; ses quatre chemins ont les mêmes probabilités que ceux de gauche, mais ses branches portent d'autres nombres.</p>
    <p class="verdict" id="pc-v1" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Les mêmes données, en effectifs</h4>
    <p>Imaginez 10 000 personnes réparties exactement selon ces probabilités. Le tableau compte combien sont dans chaque case ; le carré, de côté 1, découpe les mêmes proportions en aires : la largeur d'une colonne est la probabilité de ${K('A')} ou de son contraire, et la hauteur de la partie colorée est la probabilité de ${K('B')} sachant ${K('A')}, ou sachant son contraire.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="pc-carre" class="carre" aria-label="Carré de côté 1 découpé en quatre rectangles dont les aires sont les probabilités des quatre cas"></canvas>
      <div class="side">
        <h5>Sur 10 000 personnes</h5>
        <table class="pc-table" id="pc-table" aria-live="polite"></table>
        <dl class="lectures" aria-live="polite">
          <dt>${K('P(B)')}</dt><dd id="pc-pb"></dd>
          <dt>${K('P_B(A)')}</dt><dd id="pc-ba"></dd>
          <dt>${K('P_{\\overline{B}}(A)')}</dt><dd id="pc-nba"></dd>
        </dl>
      </div>
    </div>
  </div>
  <div class="col">
    <p class="verdict" id="pc-v2" aria-live="polite"></p>
    <div class="def">
      <p>Pour deux événements ${K('A')} et ${K('B')} avec ${K('P(A) \\neq 0')}, la probabilité de ${K('B')} sachant ${K('A')} est ${K('P_A(B) = \\dfrac{P(A \\cap B)}{P(A)}')}.</p>
      <p><b>Probabilités totales.</b> Si ${K('0 < P(A) < 1')} : ${K('P(B) = P(A)\\,P_A(B) + P(\\overline{A})\\,P_{\\overline{A}}(B)')}.</p>
      <p><b>Retourner le conditionnement</b> (formule dite de Bayes, dont le nom n'est pas exigible au lycée). Si de plus ${K('P(B) \\neq 0')} :</p>
      <p><span class="kx kxd">P_B(A) = \\dfrac{P(A)\\,P_A(B)}{P(A)\\,P_A(B) + P(\\overline{A})\\,P_{\\overline{A}}(B)}.</span></p>
    </div>
    <p>Les deux formules se démontrent sur le tableau. Les événements ${K('A \\cap B')} et ${K('\\overline{A} \\cap B')} sont incompatibles et leur réunion est ${K('B')} : c'est la somme de la colonne ${K('B')}, où chaque case vaut, par définition, le total de sa ligne multiplié par une probabilité conditionnelle. La dernière formule est alors la définition de ${K('P_B(A)')}, soit la case ${K('A \\cap B')} divisée par le total de sa colonne.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Indépendance</h4>
    <p>Réglez ${K('P_A(B)')} et ${K('P_{\\overline{A}}(B)')} sur la même valeur : dans le carré, la partie colorée a la même hauteur dans les deux colonnes, et savoir si ${K('A')} est réalisé ne change rien à la probabilité de ${K('B')}.</p>
    <div class="def"><p>Deux événements ${K('A')} et ${K('B')} sont <b>indépendants</b> lorsque ${K('P(A \\cap B) = P(A)\\,P(B)')}. Quand ${K('0 < P(A) < 1')}, cela équivaut à ${K('P_A(B) = P_{\\overline{A}}(B)')}.</p></div>
    <p>L'équivalence se calcule : d'après les probabilités totales, ${K('P(A \\cap B) - P(A)P(B) = P(A)\\,P(\\overline{A})\\left(P_A(B) - P_{\\overline{A}}(B)\\right)')}, produit qui est nul exactement quand le dernier facteur l'est, puisque ${K('P(A)')} et ${K('P(\\overline{A})')} ne sont pas nuls.</p>
  </div>
</section>
` + suite(
  `Confondre ${K('P_A(B)')} et ${K('P_B(A)')}. Avec l'exemple du test médical, une maladie touche 1 % des personnes ; le test est positif pour 99 % des malades et pour 5 % des personnes saines. La probabilité qu'un malade soit positif vaut 0,99, mais la probabilité qu'une personne positive soit malade n'est que de ${K('\\dfrac{99}{594} = \\dfrac16')} : sur 10 000 personnes, 99 malades sont positifs, contre 495 personnes saines. Les personnes saines sont si nombreuses que leurs rares faux positifs dépassent de loin les vrais.`,
  `Le chapitre de Première <a href="#cours/p-05">Probabilités conditionnelles</a> définit ${K('P_A(B)')}, établit la formule des probabilités totales et l'indépendance ; celui de Terminale <a href="#cours/t-02">Probabilités</a> rappelle l'indépendance et poursuit avec les variables aléatoires et la loi binomiale. Depuis la rentrée 2026, la probabilité conditionnelle et les arbres pondérés sont abordés dès la Seconde, où la première section de cette page suffit ; la formule des probabilités totales et l'indépendance relèvent de la Première. Dans l'édifice, les fiches <a href="#proba.p-espace">Espace probabilisé</a> et <a href="#proba.p-independance">Indépendance</a> donnent le cadre général. L'exploration <a href="#activites/monty-hall">Le problème de Monty Hall</a> applique la même formule à un cas célèbre.`,
  `Les trois probabilités avancent par centièmes et sont traitées comme des entiers. Les quatre effectifs sur 10 000 sont donc des entiers exacts (par exemple 1 × 99 = 99), et ${K('P(B)')} est un nombre décimal exact, à quatre décimales au plus. ${K('P_B(A)')} est un quotient de deux entiers : la page l'écrit en fraction irréductible quand le dénominateur ne dépasse pas 1 000, suivie de sa valeur arrondie à 10⁻⁴. Le test d'indépendance compare deux entiers, sans arrondi. Rien n'est enregistré ni envoyé.`);

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const EX = [['test médical', [1, 99, 5]], ['maladie fréquente', [30, 99, 5]], ['indépendants', [40, 25, 25]], ['alarme', [2, 95, 10]], ['presque certain', [90, 80, 60]]];
  const E = { v: EX[0][1].slice(), ex: 0 }, ID = ['p', 'x', 'y'];
  ID.forEach((id, i) => q('#pc-' + id).addEventListener('input', e => { E.v[i] = Math.round(+e.target.value * 100); E.ex = -1; S.planifier(); }));
  EX.forEach((x, i) => { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = x[0]; bt.addEventListener('click', () => { E.v = x[1].slice(); E.ex = i; S.planifier(); }); q('#pc-ex').append(bt, ' '); });
  const d2 = n => fr(n / 100, 2), d4 = n => fr(n / 10000, 4);
  // quotient n/d de deux entiers : fraction réduite si petit dénominateur, et valeur à 10⁻⁴
  const ligne = (n, d, N) => { const g = pgcd(n, d) || 1, a = n / g, b = d / g, P = [`${N(n)} / ${N(d)}`]; if (b === 1) return P[0] + ' = ' + a; if (b !== d && b <= 1000) P.push(`${a}/${b}`); return P.join(' = ') + ((n * 10000) % d === 0 ? ' = ' : ' ≈ ') + fr(n / d, 4); };
  const court = (n, d) => { if (!d) return '—'; if ((n * 1000) % d === 0) return fr(n / d, 3); const v = n / d, k = v < .0995 || v > .9005 ? 4 : 3; return '≈ ' + fr(v, k); };

  function arbre(cv, C, n1, n2, b1, b2, feuilles, coul) {
    // n1 = [nom, nom contraire], b1 = [proba, proba contraire] du premier niveau ; b2 = quatre probas du second ; feuilles = quatre probas des chemins
    const { ctx, w, h } = toile(cv), x0 = 16, x1 = w * .36, x2 = w * .70, Y1 = [h * .27, h * .73], Y2 = [h * .11, h * .43, h * .57, h * .89], T = Math.max(11, Math.min(13.5, w / 34));
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1.6;
    for (let i = 0; i < 2; i++) { trait(ctx, x0 + 6, h / 2, x1 - 16, Y1[i]); for (let j = 0; j < 2; j++) trait(ctx, x1 + 18, Y1[i], x2 - 16, Y2[2 * i + j]); }
    pastille(ctx, x0, h / 2, C.doux, 4);
    for (let i = 0; i < 2; i++) {
      etiquette(ctx, C, n1[i], x1, Y1[i], C.encre, 'center', T + 2);
      etiquette(ctx, C, b1[i], (x0 + x1) / 2 - 2, (h / 2 + Y1[i]) / 2 + (i ? 12 : -12), C.bleu, 'center', T);
      for (let j = 0; j < 2; j++) { const k = 2 * i + j; etiquette(ctx, C, n2[j], x2, Y2[k], C.encre, 'center', T + 2);
        etiquette(ctx, C, b2[k], (x1 + x2) / 2 + 2, (Y1[i] + Y2[k]) / 2 + (j ? 11 : -11), C.orange, 'center', T);
        etiquette(ctx, C, feuilles[k], x2 + 20, Y2[k], coul[k] || C.doux, 'left', T); } }
  }

  function rendre(C) {
    const [p, x, y] = E.v, np = 100 - p, AB = p * x, AnB = p * (100 - x), nAB = np * y, nAnB = np * (100 - y), B = AB + nAB, nB = AnB + nAnB;   // effectifs sur 10 000
    ID.forEach((id, i) => { const r = q('#pc-' + id); if (Math.round(+r.value * 100) !== E.v[i]) r.value = E.v[i] / 100; ecrire(q('#pc-' + id + 'v'), d2(E.v[i])); });
    racine.querySelectorAll('#pc-ex .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.ex)));
    const bar = s => s + '̅';
    arbre(q('#pc-a1'), C, ['A', bar('A')], ['B', bar('B')], [d2(p), d2(np)], [p ? d2(x) : '—', p ? d2(100 - x) : '—', np ? d2(y) : '—', np ? d2(100 - y) : '—'], [d4(AB), d4(AnB), d4(nAB), d4(nAnB)], [C.vert, null, C.orange, null]);
    arbre(q('#pc-a2'), C, ['B', bar('B')], ['A', bar('A')], [d4(B), d4(nB)], [court(AB, B), court(nAB, B), court(AnB, nB), court(nAnB, nB)], [d4(AB), d4(nAB), d4(AnB), d4(nAnB)], [C.vert, C.orange, null, null]);
    // carré des aires
    { const { ctx, w, h } = toile(q('#pc-carre')), m = 34, L = Math.min(w, h) - 2 * m, ox = (w - L) / 2, oy = (h - L) / 2, wa = L * p / 100;
      const rect = (X, Y, W, H, coul, alpha) => { if (W <= 0 || H <= 0) return; ctx.globalAlpha = alpha; ctx.fillStyle = coul; ctx.fillRect(X, Y, W, H); ctx.globalAlpha = 1; };
      rect(ox, oy + L * (1 - x / 100), wa, L * x / 100, C.vert, .55); rect(ox + wa, oy + L * (1 - y / 100), L - wa, L * y / 100, C.orange, .45);
      rect(ox, oy, wa, L * (1 - x / 100), C.doux, .10); rect(ox + wa, oy, L - wa, L * (1 - y / 100), C.doux, .10);
      ctx.strokeStyle = C.encre; ctx.lineWidth = 1.6; ctx.strokeRect(ox, oy, L, L); if (p > 0 && p < 100) trait(ctx, ox + wa, oy, ox + wa, oy + L);
      ctx.lineWidth = 1; ctx.strokeStyle = C.doux; if (p > 0 && x > 0 && x < 100) trait(ctx, ox, oy + L * (1 - x / 100), ox + wa, oy + L * (1 - x / 100)); if (np > 0 && y > 0 && y < 100) trait(ctx, ox + wa, oy + L * (1 - y / 100), ox + L, oy + L * (1 - y / 100));
      if (p >= 8) etiquette(ctx, C, 'A', ox + wa / 2, oy + L + 16, C.encre, 'center', 14); if (np >= 8) etiquette(ctx, C, bar('A'), ox + wa + (L - wa) / 2, oy + L + 16, C.encre, 'center', 14);
      etiquette(ctx, C, d2(p), ox + wa / 2, oy - 14, C.bleu, 'center', 12); etiquette(ctx, C, d2(np), ox + wa + (L - wa) / 2, oy - 14, C.bleu, 'center', 12);
      if (p >= 12 && x >= 10) etiquette(ctx, C, 'A∩B', ox + wa / 2, oy + L * (1 - x / 200), C.encre, 'center', 12); if (np >= 12 && y >= 10) etiquette(ctx, C, bar('A') + '∩B', ox + wa + (L - wa) / 2, oy + L * (1 - y / 200), C.encre, 'center', 12);
      etiquette(ctx, C, 'B', ox - 16, oy + L - 12, C.doux, 'center', 12); }
    const N = n => n.toLocaleString('fr-FR').replace(/ | /g, ' ');
    ecrire(q('#pc-table'), `<tr><th></th><th>B</th><th>B̅</th><th>total</th></tr><tr><th>A</th><td class="ab">${N(AB)}</td><td>${N(AnB)}</td><td class="t">${N(p * 100)}</td></tr><tr><th>A̅</th><td class="nb">${N(nAB)}</td><td>${N(nAnB)}</td><td class="t">${N(np * 100)}</td></tr><tr class="t"><th>total</th><td>${N(B)}</td><td>${N(nB)}</td><td>10 000</td></tr>`, true);
    ecrire(q('#pc-pb'), p === 0 ? `${d2(y)}, la probabilité de B sachant le contraire de A` : p === 100 ? `${d2(x)}, la probabilité de B sachant A` : `${d2(p)} × ${d2(x)} + ${d2(np)} × ${d2(y)} = ${d4(B)}`);
    ecrire(q('#pc-ba'), B ? ligne(AB, B, N) : 'non définie, car P(B) = 0');
    ecrire(q('#pc-nba'), nB ? ligne(AnB, nB, N) : 'non définie, car le contraire de B est de probabilité nulle');
    const bord = p === 0 || p === 100;
    ecrire(q('#pc-v1'), bord ? `Ici, la probabilité de A vaut ${p ? 1 : 0} : ${p ? 'le contraire de A' : 'A'} est de probabilité nulle, et la probabilité de B sachant cet événement n'est pas définie. Les deux branches correspondantes sont notées par un tiret${!B || !nB ? ', de même que celles de l\'arbre retourné qui partent d\'un événement de probabilité nulle' : ''}.`
      : !B || !nB ? `Ici, la probabilité de B vaut ${B ? 1 : 0} : l'arbre retourné n'a qu'une branche utile, l'autre conditionnement n'est pas défini.`
      : `À gauche, la branche de A vers B porte la probabilité de B sachant A, ${d2(x)}. À droite, la branche de B vers A porte la probabilité de A sachant B, ${(AB * 1000) % B === 0 ? '' : 'environ '}${fr(AB / B, 3)} : ${100 * AB === x * B ? 'les deux nombres coïncident ici, ce qui est exceptionnel' : 'ce n\'est pas le même nombre'}. Les deux chemins qui mènent à « A et B » ont ${100 * AB === x * B ? '' : 'pourtant '}la même probabilité, ${d4(AB)}.`);
    ecrire(q('#pc-v2'), bord ? "Quand la probabilité de A vaut 0 ou 1, l'une des deux colonnes du carré disparaît." : x === y ? `La probabilité de B est la même, ${d2(x)}, que A soit réalisé ou non : les événements A et B sont indépendants${B ? `, et la probabilité de A sachant B est égale à celle de A, ${d2(p)}` : ''}.`
      : !B ? "Aucune personne n'est dans la colonne B : la probabilité de B est nulle, et la probabilité de A sachant B n'est pas définie."
      : `${B > 1 ? `Parmi les ${N(B)} personnes de la colonne B, ${N(AB)} ${AB > 1 ? 'sont' : 'est'} dans A` : `La seule personne de la colonne B ${AB ? 'est' : 'n\'est pas'} dans A`} : la probabilité de A sachant B vaut ${(AB * 1000) % B === 0 ? '' : 'environ '}${fr(AB / B, 3)}, alors que celle de A vaut ${d2(p)}. Apprendre que B est réalisé ${AB * 100 > p * B ? 'augmente' : 'diminue'} la probabilité de A, parce que B est ${x > y ? 'plus' : 'moins'} fréquent quand A est réalisé (${d2(x)} contre ${d2(y)}).`);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
