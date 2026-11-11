// Exploration « Le problème de Monty Hall » (rubrique Activités, MEMO_atlas_activites.md §139) : le jeu, un mur de parties, et le carré des probabilités.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, ecrire, fr, fraction } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .mh-scene { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding: 20px 14px 12px; background: var(--papier); }
.activites-act .mh-porte { width: 62px; height: 96px; padding: 0; border-radius: 6px 6px 0 0; border: 2px solid var(--encre); background: color-mix(in srgb, var(--mark) 16%, var(--surface)); font: 700 20px var(--f-ui); color: var(--encre); display: grid; place-items: center; position: relative; cursor: pointer; }
.activites-act .mh-porte::after { content: ''; position: absolute; right: 7px; top: 50%; width: 6px; height: 6px; border-radius: 50%; background: var(--encre); }
.activites-act .mh-porte:disabled { cursor: default; opacity: 1; }
.activites-act .mh-porte.choisie { box-shadow: 0 0 0 3px var(--papier), 0 0 0 6px var(--mark); }
.activites-act .mh-porte.ouverte { background: var(--papier); border-style: dashed; border-color: var(--encre-3); font: 500 11px var(--f-ui); color: var(--encre-2); }
.activites-act .mh-porte.ouverte::after { display: none; }
.activites-act .mh-porte.voiture { background: color-mix(in srgb, var(--tan) 22%, var(--surface)); border-style: solid; border-color: var(--tan); color: var(--encre); font-weight: 700; }
.activites-act .fig .bar label { min-width: 0; flex-wrap: wrap; } .activites-act .fig .bar select { max-width: 100%; min-width: 0; font: 14px var(--f-ui); color: var(--encre); background: var(--surface); border: 1px solid var(--encre-3); border-radius: 6px; padding: 4px 6px; }
.activites-act .mh-msg { padding: 10px 16px; border-top: 1px solid var(--filet); font: 15px/1.45 var(--f-ui); min-height: 46px; }
.activites-act .mh-bilan { width: auto; margin: 0 16px 12px; }
.activites-act .mh-mur { display: grid; grid-template-columns: repeat(30, minmax(0, 1fr)); gap: 2px; padding: 14px 16px; }
.activites-act .mh-mur i { aspect-ratio: 1; border-radius: 2px; background: var(--trame); }
.activites-act .mh-mur i.g, .activites-act .mh-cle i.g { background: var(--mark); } .activites-act .mh-mur i.c, .activites-act .mh-cle i.c { background: var(--sec); }
.activites-act .mh-mur i.x, .activites-act .mh-cle i.x { background: repeating-linear-gradient(45deg, var(--encre-3) 0 2px, transparent 2px 4px); }
.activites-act .mh-cle { display: flex; flex-wrap: wrap; gap: 6px 18px; padding: 0 16px 12px; font: 13.5px var(--f-ui); color: var(--encre-2); }
.activites-act .mh-cle i { display: inline-block; width: 12px; height: 12px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
.activites-act canvas.mh-carre { aspect-ratio: 4 / 3; cursor: default; }
@media (max-width: 560px) { .activites-act .mh-mur { grid-template-columns: repeat(20, minmax(0, 1fr)); } .activites-act .mh-porte { width: 50px; height: 80px; } .activites-act canvas.mh-carre { aspect-ratio: 1 / 1; } }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Première, Terminale, Maths Sup · Probabilités conditionnelles</p>
  <h3>Le problème de Monty Hall</h3>
  <p class="lede">Trois portes : derrière l'une, une voiture ; derrière les deux autres, une chèvre. Vous en choisissez une. L'animateur, qui sait où est la voiture, ouvre une autre porte et montre une chèvre, puis vous propose de changer d'avis. Faut-il garder sa porte, changer, ou est-ce indifférent ? La réponse a déclenché l'une des plus vives querelles de l'histoire des probabilités.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>Choisissez une porte. L'animateur ouvre alors toutes les autres portes sauf une, sans jamais montrer la voiture, et vous décidez. Avant de calculer, jouez une dizaine de parties et notez votre impression. Vous pouvez augmenter le nombre de portes : <span class="chips" id="mh-n"></span></p>
  </div>
  <div class="fig">
    <div class="bar top"><label>L'animateur <select id="mh-mode"><option value="sait" selected>sait où est la voiture</option><option value="hasard">ouvre au hasard</option></select></label></div>
    <div class="mh-scene" id="mh-scene" role="group" aria-label="Les portes"></div>
    <div class="bar"><button type="button" class="primary" id="mh-garder">Garder ma porte</button><button type="button" class="primary" id="mh-changer">Changer de porte</button><button type="button" id="mh-suivante">Partie suivante</button></div>
    <p class="mh-msg" id="mh-msg" aria-live="polite"></p>
    <table class="mh-bilan" aria-live="polite"><thead><tr><th>Vos parties</th><th>jouées</th><th>gagnées</th><th>fréquence</th></tr></thead><tbody id="mh-bilan"></tbody></table>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Un mur de trois cents parties</h4>
    <p>Jouons maintenant 300 parties d'un coup, avec les mêmes portes et le même animateur. Chaque carré est une partie, coloriée selon la stratégie qui la gagne : <b class="c-mark">en bleu</b>, celles où il fallait garder sa porte ; <b class="c-sec">en orange</b>, celles où il fallait changer. Le bouton « Ranger » regroupe les couleurs pour comparer les proportions.</p>
    <p>Observez un fait qui ne doit rien au hasard : quand l'animateur sait où est la voiture, aucun carré n'est gris. Chaque partie est gagnée par une stratégie et une seule, et « garder » gagne exactement quand le premier choix était le bon.</p>
  </div>
  <div class="fig">
    <div class="bar top"><button type="button" class="primary" id="mh-300">Jouer 300 parties</button><button type="button" id="mh-ranger">Ranger par couleur</button><span id="mh-compte" aria-live="polite"></span></div>
    <div class="mh-mur" id="mh-mur" role="img" aria-label="Mur de 300 parties"></div>
    <div class="mh-cle"><span><i class="g"></i>garder gagne</span><span><i class="c"></i>changer gagne</span><span><i class="x"></i>partie annulée : l'animateur a montré la voiture</span></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le carré des probabilités</h4>
    <p>Revenons à trois portes, et supposons que vous avez choisi la porte 1. Le carré ci-dessous a une aire égale à 1, et chaque rectangle y occupe une aire égale à sa probabilité. Les trois colonnes correspondent aux trois places possibles de la voiture, chacune de probabilité ${K('\\frac13')}. Chaque colonne est ensuite partagée selon la porte que l'animateur ouvre.</p>
    <p>Un détail du problème est presque toujours passé sous silence : que fait l'animateur quand la voiture est derrière votre porte, et qu'il a donc le choix entre deux chèvres ? Notons ${K('p')} la probabilité qu'il ouvre alors la porte 3. Réglez ${K('p')}, puis dites ce que vous avez vu : <span class="chips" id="mh-obs"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="mh-carre" class="mh-carre" aria-label="Carré des probabilités : colonnes selon la place de la voiture, partagées selon la porte ouverte"></canvas>
      <div class="side">
        <h5>Sachant ce que vous avez vu</h5>
        <dl class="lectures" aria-live="polite">
          <dt>probabilité de l'observation</dt><dd id="mh-pobs"></dd>
          <dt>P(garder gagne)</dt><dd id="mh-pg"></dd>
          <dt>P(changer gagne)</dt><dd id="mh-pc"></dd>
        </dl>
        <p class="verdict" id="mh-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="mh-p">préférence <i>p</i></label><input type="range" id="mh-p" min="0" max="20" step="1" value="10"><output id="mh-pv"></output>
    </div>
    <div class="bar"><label>L'animateur <select id="mh-mode2"><option value="sait" selected>sait où est la voiture</option><option value="hasard">ouvre au hasard</option></select></label></div>
  </div>
  <div class="col">
    <p>Une fois la porte 3 ouverte sur une chèvre, seuls comptent les rectangles où l'animateur ouvre la porte 3 : les autres sont estompés. La probabilité que la voiture soit derrière votre porte est la part du bleu dans ce qui reste. Notons ${K('V_k')} l'événement « la voiture est derrière la porte ${K('k')} » et ${K('O_3')} l'événement « l'animateur ouvre la porte 3 ». Quand l'animateur sait, la formule de Bayes donne :</p>
    <div class="def">${KD('\\begin{aligned} P(V_1 \\mid O_3) &= \\frac{P(V_1)\\,P(O_3 \\mid V_1)}{\\sum_{k=1}^{3} P(V_k)\\,P(O_3 \\mid V_k)} \\\\[4pt] &= \\frac{\\frac13\\,p}{\\frac13\\,p + \\frac13 \\cdot 1 + \\frac13 \\cdot 0} = \\frac{p}{1 + p}. \\end{aligned}')}</div>
    <p>Pour ${K('p = \\frac12')}, un animateur sans préférence, on trouve ${K('\\frac13')} : changer gagne deux fois sur trois. Pour toute valeur de ${K('p')}, on a ${K('\\frac{p}{1+p} \\leqslant \\frac12')} : changer n'est jamais désavantageux, et garder n'est aussi bon que si ${K('p = 1')}, c'est-à-dire si l'animateur ouvre la porte 3 chaque fois qu'il le peut.</p>
    <p>Choisissez maintenant l'animateur qui ouvre au hasard. La moitié des colonnes 2 et 3 devient grise et hachurée : ce sont les cas où il montre la voiture, et la partie est annulée. Si vous voyez une chèvre derrière la porte 3, il reste un rectangle bleu et un rectangle orange de même aire ${K('\\frac16')}, et la probabilité vaut ${K('\\frac12')}. La même image, vue par les yeux, ne porte pas la même information selon la manière dont elle a été produite.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Avec ${K('n')} portes</h4>
    <div class="def"><p><b>Proposition.</b> La voiture est placée au hasard, avec la même probabilité, derrière l'une des ${K('n \\geqslant 3')} portes ; le joueur choisit une porte sans rien savoir ; l'animateur, qui sait, ouvre ${K('n - 2')} des autres portes sans jamais montrer la voiture. Alors le joueur gagne avec probabilité ${K('\\dfrac1n')} s'il garde sa porte, et ${K('\\dfrac{n-1}{n}')} s'il change.</p></div>
    <p><b>Démonstration.</b> Le joueur qui garde sa porte gagne exactement quand son premier choix désignait la voiture, événement de probabilité ${K('\\frac1n')} : ce que fait ensuite l'animateur n'y change rien. Si le premier choix était faux, la voiture est derrière l'une des ${K('n-1')} autres portes ; l'animateur ne pouvant l'ouvrir, c'est elle qui reste fermée, et le joueur qui change la trouve. Si le premier choix était juste, le joueur qui change perd. Changer gagne donc exactement quand le premier choix était faux, événement de probabilité ${K('1 - \\frac1n = \\frac{n-1}{n}')}.</p>
    <p>Passez à 10 portes dans la première section : vous choisissez une porte, l'animateur en ouvre huit et en laisse une seule fermée. L'envie de changer devient irrésistible, et le raisonnement est pourtant exactement le même qu'avec trois portes.</p>
    <p>Si l'animateur ouvre au hasard ${K('n - 2')} des autres portes, il montre la voiture avec probabilité ${K('\\frac{n-2}{n}')} ; les deux stratégies gagnent alors chacune avec probabilité ${K('\\frac1n')}, et sont donc à égalité quand la voiture n'a pas été montrée.</p>
  </div>
</section>
` + suite(
  "Dire : « il reste deux portes, donc une chance sur deux ». Deux issues ne sont pas forcément équiprobables. L'animateur n'ouvre pas une porte au hasard : il évite la voiture, et son geste apporte de l'information sur la porte qu'il a laissée fermée, mais aucune sur la vôtre. La réponse « une chance sur deux » n'est juste que pour un animateur qui ouvre au hasard et tombe par chance sur une chèvre : le mur et le carré montrent ce cas.",
  "Le chapitre de Première <a href=\"#cours/p-05\">Probabilités conditionnelles</a> introduit les arbres pondérés et la probabilité de <i>A</i> sachant <i>B</i> ; celui de Terminale <a href=\"#cours/t-02\">Probabilités</a> les reprend, et celui de Maths Sup <a href=\"#cours/ma-21\">Dénombrement et probabilités</a> énonce la formule de Bayes. Dans l'édifice : <a href=\"#proba.p-espace\">Espaces probabilisés et probabilités conditionnelles</a>. Le problème a été posé par Steve Selvin dans une lettre à la revue <i>The American Statistician</i> en 1975 ; il est devenu célèbre en 1990, quand Marilyn vos Savant y a répondu dans sa chronique du magazine <i>Parade</i> et a reçu des milliers de lettres lui affirmant, à tort, qu'elle se trompait.",
  "Les probabilités du carré sont des fractions exactes, calculées en entiers : <i>p</i> varie par vingtièmes. Les parties jouées, à la main ou par trois cents, sont des simulations : la place de la voiture, le premier choix des parties automatiques et les hésitations de l'animateur sont tirés au hasard, et les fréquences observées fluctuent autour des probabilités. Dans la première section, l'animateur qui sait choisit au hasard, sans préférence, quand il a le choix. Rien n'est enregistré ni envoyé.");

const alea = n => Math.floor(Math.random() * n);
// Une partie : place de la voiture, choix, portes ouvertes selon l'animateur. Renvoie { voiture, choix, ouvertes, reste, annulee }.
export function partie(n, mode, choix = alea(n)) {
  const voiture = alea(n), autres = []; for (let i = 0; i < n; i++) if (i !== choix) autres.push(i);
  let reste;
  if (mode === 'sait') reste = voiture !== choix ? voiture : autres[alea(n - 1)]; else reste = autres[alea(n - 1)];
  const ouvertes = autres.filter(i => i !== reste);
  return { voiture, choix, ouvertes, reste, annulee: ouvertes.includes(voiture) };
}

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { n: 3, mode: 'sait', P: null, phase: 0, final: -1, bilan: { g: [0, 0], c: [0, 0], x: 0 }, mur: [], range: false, p: 10, obs: 3, mode2: 'sait' };
  const zero = () => { E.bilan = { g: [0, 0], c: [0, 0], x: 0 }; E.mur = []; E.range = false; E.P = null; E.phase = 0; };
  [3, 4, 5, 7, 10].forEach(n => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = n + ' portes'; b.dataset.n = n; b.addEventListener('click', () => { E.n = n; zero(); jeu(); mur(); }); q('#mh-n').append(b); });
  [[0, 'rien encore'], [3, 'il a ouvert la porte 3 : une chèvre'], [2, 'il a ouvert la porte 2 : une chèvre']].forEach(([o, t]) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t; b.dataset.o = o; b.addEventListener('click', () => { E.obs = o; S.planifier(); }); q('#mh-obs').append(b); });
  function jeu() {
    racine.querySelectorAll('#mh-n .chip').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === E.n)));
    const P = E.P, sc = q('#mh-scene'); let h = '';
    for (let i = 0; i < E.n; i++) { let cl = 'mh-porte', txt = String(i + 1), dis = E.phase !== 0, lab = 'Porte ' + (i + 1);
      if (P && (E.phase === 2 || P.ouvertes.includes(i))) { const v = i === P.voiture; cl += ' ouverte' + (v ? ' voiture' : ''); txt = v ? 'voiture' : 'chèvre'; lab += v ? ' : la voiture' : ' : une chèvre'; }
      if (P && (E.phase === 2 ? i === E.final : i === P.choix)) cl += ' choisie';
      h += `<button type="button" class="${cl}" data-i="${i}" ${dis ? 'disabled' : ''} aria-label="${lab}">${txt}</button>`; }
    ecrire(sc, h, true);
    const dec = E.phase === 1 && !P.annulee; q('#mh-garder').disabled = !dec; q('#mh-changer').disabled = !dec; q('#mh-suivante').disabled = E.phase === 0;
    let m = 'Cliquez sur une porte pour la choisir.';
    if (E.phase === 1) m = P.annulee ? `Vous avez choisi la porte ${P.choix + 1}. L'animateur, qui ouvrait au hasard, a montré la voiture : la partie est annulée.` : `Vous avez choisi la porte ${P.choix + 1} (entourée). L'animateur a ouvert ${E.n === 3 ? 'la porte ' + (P.ouvertes[0] + 1) : (E.n - 2) + ' portes'} : ${E.n === 3 ? 'une chèvre' : 'des chèvres'}. Il reste la vôtre et la porte ${P.reste + 1}. Gardez-vous votre porte, ou changez-vous ?`;
    if (E.phase === 2) { const ok = E.final === P.voiture; m = `Vous avez ${E.final === P.choix ? 'gardé la porte ' + (P.choix + 1) : 'changé pour la porte ' + (P.reste + 1)} : ${ok ? 'la voiture est à vous.' : 'c\'est une chèvre. La voiture était derrière la porte ' + (P.voiture + 1) + '.'}`; }
    ecrire(q('#mh-msg'), m);
    const B = E.bilan, lig = (nom, t) => `<tr><td>${nom}</td><td>${t[0]}</td><td>${t[1]}</td><td>${t[0] ? fr(t[1] / t[0], 2) : '—'}</td></tr>`;
    ecrire(q('#mh-bilan'), lig('en gardant', B.g) + lig('en changeant', B.c) + (E.mode === 'hasard' ? `<tr><td>annulées</td><td>${B.x}</td><td></td><td></td></tr>` : ''), true);
  }
  q('#mh-scene').addEventListener('click', ev => { const b = ev.target.closest('button[data-i]'); if (!b || E.phase !== 0) return; E.P = partie(E.n, E.mode, +b.dataset.i); E.phase = 1; if (E.P.annulee) E.bilan.x++; jeu(); });
  const finir = change => { const P = E.P; if (E.phase !== 1 || P.annulee) return; E.final = change ? P.reste : P.choix; E.phase = 2; const t = E.bilan[change ? 'c' : 'g']; t[0]++; if (E.final === P.voiture) t[1]++; jeu(); };
  q('#mh-garder').addEventListener('click', () => finir(false)); q('#mh-changer').addEventListener('click', () => finir(true));
  q('#mh-suivante').addEventListener('click', () => { E.P = null; E.phase = 0; jeu(); });
  q('#mh-mode').addEventListener('change', ev => { E.mode = ev.target.value; zero(); jeu(); mur(); });
  function mur() {
    const M = E.range ? E.mur.slice().sort((a, b) => 'gcx'.indexOf(a) - 'gcx'.indexOf(b)) : E.mur;
    ecrire(q('#mh-mur'), Array.from({ length: 300 }, (_, i) => `<i class="${M[i] || ''}"></i>`).join(''), true);
    q('#mh-ranger').disabled = !E.mur.length; q('#mh-ranger').textContent = E.range ? 'Remettre dans l\'ordre du jeu' : 'Ranger par couleur';
    if (!E.mur.length) { ecrire(q('#mh-compte'), `${E.n} portes ; l'animateur ${E.mode === 'sait' ? 'sait' : 'ouvre au hasard'}.`); return; }
    const k = c => E.mur.filter(x => x === c).length, g = k('g'), c = k('c'), x = k('x');
    ecrire(q('#mh-compte'), `Garder gagne ${g} fois, changer ${c} fois${x ? `, ${x} parties annulées` : ''}. ${x ? `Parmi les ${g + c} parties valables, garder gagne dans la proportion ${fr(g / (g + c), 2)}.` : `Fréquences : ${fr(g / 300, 2)} et ${fr(c / 300, 2)} ; probabilités : ${fraction(1, E.n)} et ${fraction(E.n - 1, E.n)}.`}`);
  }
  q('#mh-300').addEventListener('click', () => { E.mur = Array.from({ length: 300 }, () => { const P = partie(E.n, E.mode); return P.annulee ? 'x' : P.choix === P.voiture ? 'g' : 'c'; }); mur(); });
  q('#mh-ranger').addEventListener('click', () => { E.range = !E.range; mur(); });
  q('#mh-p').addEventListener('input', ev => { E.p = +ev.target.value; S.planifier(); });
  q('#mh-mode2').addEventListener('change', ev => { E.mode2 = ev.target.value; S.planifier(); });
  function carre(C) {
    const sait = E.mode2 === 'sait', p = sait ? E.p : 10, sl = q('#mh-p'); sl.disabled = !sait; if (+sl.value !== p) sl.value = p;
    ecrire(q('#mh-pv'), fraction(p, 20)); racine.querySelectorAll('#mh-obs .chip').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.o === E.obs)));
    // Rectangles : colonne (place de la voiture), hauteur en vingtièmes, porte ouverte, issue (g, c, x).
    const R = [[0, 0, p, 3, 'g'], [0, p, 20, 2, 'g']];
    if (sait) R.push([1, 0, 20, 3, 'c'], [2, 0, 20, 2, 'c']); else R.push([1, 0, 10, 3, 'c'], [1, 10, 20, 2, 'x'], [2, 0, 10, 2, 'c'], [2, 10, 20, 3, 'x']);
    const { ctx, w, h } = toile(q('#mh-carre')), c = Math.min(w - 40, h - 62), x0 = (w - c) / 2, y0 = 34;
    ctx.font = '600 12px ' + C.police; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let k = 0; k < 3; k++) { ctx.fillStyle = C.encre; ctx.fillText(c < 300 ? 'voit. en ' + (k + 1) : 'voiture en ' + (k + 1), x0 + (k + .5) * c / 3, 12); ctx.fillStyle = C.doux; ctx.fillText('1/3', x0 + (k + .5) * c / 3, 26); }
    let num = { g: 0, c: 0, x: 0 };
    for (const [k, a, b, porte, issue] of R) { if (b === a) continue; const actif = E.obs === 0 || (porte === E.obs && issue !== 'x');
      if (actif) num[issue] += b - a;
      const X = x0 + k * c / 3, Y = y0 + c - b / 20 * c, W = c / 3, H = (b - a) / 20 * c;
      ctx.globalAlpha = actif ? .85 : .13; ctx.fillStyle = issue === 'g' ? C.bleu : issue === 'c' ? C.orange : C.doux; ctx.fillRect(X, Y, W, H);
      if (issue === 'x') { ctx.save(); ctx.beginPath(); ctx.rect(X, Y, W, H); ctx.clip(); ctx.strokeStyle = C.fond; ctx.lineWidth = 2; for (let t = -H; t < W; t += 8) { ctx.beginPath(); ctx.moveTo(X + t, Y + H); ctx.lineTo(X + t + H, Y); ctx.stroke(); } ctx.restore(); }
      ctx.globalAlpha = 1; ctx.strokeStyle = C.fond; ctx.lineWidth = 2; ctx.strokeRect(X, Y, W, H);
      if (H > 15) { ctx.globalAlpha = actif ? 1 : .45; ctx.fillStyle = actif && issue !== 'x' ? '#fff' : C.encre; ctx.font = '600 12px ' + C.police; ctx.fillText(issue === 'x' ? 'annulée' : 'ouvre ' + porte, X + W / 2, Y + H / 2 - (H > 34 ? 7 : 0)); if (H > 34) ctx.fillText(fraction(b - a, 60), X + W / 2, Y + H / 2 + 9); ctx.globalAlpha = 1; } }
    ctx.strokeStyle = C.encre; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0, c, c);
    ctx.fillStyle = C.doux; ctx.font = '500 12px ' + C.police; ctx.fillText('vous avez choisi la porte 1', w / 2, y0 + c + 15);
    const tot = E.obs === 0 ? 60 : num.g + num.c;
    ecrire(q('#mh-pobs'), E.obs === 0 ? '—' : fraction(tot, 60));
    ecrire(q('#mh-pg'), fraction(num.g, tot)); ecrire(q('#mh-pc'), fraction(num.c, tot));
    let v;
    if (E.obs === 0) v = sait ? 'Avant toute ouverture, garder gagne avec probabilité 1/3 et changer avec probabilité 2/3, quelle que soit la préférence de l\'animateur.' : 'Avant toute ouverture, chaque stratégie gagne avec probabilité 1/3 ; avec probabilité 1/3, l\'animateur montrera la voiture.';
    else if (!sait) v = `Les deux rectangles restants ont la même aire 1/6 : sachant que la porte ${E.obs} cachait une chèvre, garder et changer se valent.`;
    else v = num.g === num.c ? `Cas limite : l'animateur ouvre toujours la porte ${E.obs} quand il a le choix. La voir s'ouvrir n'apprend rien, et garder vaut changer.` : num.g === 0 ? `L'animateur n'ouvre jamais la porte ${E.obs} quand il a le choix : s'il l'ouvre, c'est qu'il y était forcé, et la voiture est à coup sûr derrière l'autre porte.` : `Le bleu occupe ${fraction(num.g, tot)} de ce qui reste : sachant que la porte ${E.obs} est ouverte, changer gagne avec probabilité ${fraction(num.c, tot)}.`;
    ecrire(q('#mh-verdict'), v);
  }
  const S = scene(racine, carre);
  jeu(); mur();
  return S.arreter;
}
