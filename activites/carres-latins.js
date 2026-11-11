// Casse-tête « Carrés latins et gréco-latins », rubrique Activités, MEMO_atlas_activites.md §139 : le problème des officiers d'Euler.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, TEINTES } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .cl-but { padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); }
.activites-act .cl-but b { color: var(--activites-jeu); }
.activites-act .cl-duo { display: flex; flex-wrap: wrap; gap: 22px 34px; justify-content: center; align-items: flex-start; width: 100%; }
.activites-act .cl-duo h5 { font: 500 12px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; color: var(--encre-3); margin: 0 0 8px; text-align: center; }
.activites-act .cl-grille, .activites-act .cl-reserve { display: grid; gap: 3px; }
.activites-act .cl-grille button, .activites-act .cl-reserve button { width: var(--cl-t); height: var(--cl-t); padding: 0; border-radius: 5px; border: 1px solid var(--encre-3); background: var(--surface); color: #fff; font: 700 calc(var(--cl-t) * .4) var(--f-ui); display: grid; place-items: center; line-height: 1; }
.activites-act .cl-grille button { border-radius: 3px; }
.activites-act .cl-grille button.vide:hover { background: var(--trame); }
.activites-act .cl-grille button.donne { box-shadow: inset 0 0 0 2px var(--surface), inset 0 0 0 3.5px rgba(0, 0, 0, .55); cursor: default; }
.activites-act .cl-grille button.heurt { outline: 3px dashed var(--encre); outline-offset: -3px; }
.activites-act .cl-grille button.conseil { outline: 3px dotted var(--tan); outline-offset: 1px; }
.activites-act .cl-reserve button.pose { opacity: .28; }
.activites-act .cl-reserve button[aria-pressed="true"], .activites-act .cl-reserve button.conseil { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--encre); }
.activites-act .cl-reserve button.conseil { box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--tan); }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie relève de Maths Sup</p>
  <h3>Carrés latins et gréco-latins</h3>
  <p class="lede">Trente-six officiers, de six régiments et de six grades différents, un de chaque sorte : peut-on les ranger en carré de façon que chaque ligne et chaque colonne contienne les six régiments et les six grades ? Euler posa la question en 1782 et conjectura que non. Il avait raison pour six, et tort pour presque tout le reste.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Jeu <select id="cl-mode"><option value="greco" selected>carré gréco-latin (les officiers)</option><option value="latin">carré latin simple</option></select></label>
    <label>Ordre <select id="cl-n"><option>3</option><option selected>4</option><option>5</option><option value="6">6</option><option>7</option></select></label>
    <label id="cl-aide-l">Au départ <select id="cl-aide"><option value="0">grille vide</option><option value="1" selected>première ligne posée</option><option value="2">un tiers posé</option><option value="3">la moitié posée</option></select></label>
    <button type="button" class="primary" id="cl-neuf">Nouvelle grille</button>
    <button type="button" id="cl-depart">Revenir au départ</button>
    <button type="button" id="cl-annuler">Annuler</button>
    <button type="button" id="cl-conseil">Un indice</button>
  </div>
  <p class="cl-but" id="cl-but" aria-live="polite"></p>
  <div class="jeu-plateau"><div class="cl-duo"><div><h5>Le carré</h5><div class="cl-grille" id="cl-grille" role="group" aria-label="Le carré à remplir"></div></div><div><h5 id="cl-res-t">La réserve</h5><div class="cl-reserve" id="cl-reserve" role="group" aria-label="La réserve"></div></div></div></div>
  <div class="jeu-etat"><span>Cases remplies : <b id="cl-fait"></b></span></div>
  <div class="jeu-message" id="cl-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Chaque officier porte une lettre latine, son régiment, qui lui donne aussi sa couleur, et une lettre grecque, son grade. Il y a un officier, et un seul, pour chaque couple formé d'un régiment et d'un grade. Cliquez sur un officier de la réserve, puis sur une case du carré pour l'y poser ; cliquez sur un officier posé pour le reprendre. Le but est de remplir le carré de façon que, dans chaque ligne et dans chaque colonne, chaque lettre latine figure une fois et chaque lettre grecque une fois.</p>
    <p>Dans le jeu « carré latin simple », il n'y a que les lettres latines, et chacune sert autant de fois qu'il le faut. Les cases cerclées d'un liseré sont posées par la page et ne bougent pas. La page ne signale que les fautes directes : deux lettres identiques dans une même ligne ou une même colonne sont entourées de tirets.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Carrés latins</h4>
    <div class="def"><p><b>Définition.</b> Un <b>carré latin</b> d'ordre ${K('n')} est un tableau à ${K('n')} lignes et ${K('n')} colonnes, rempli avec ${K('n')} symboles, tel que chaque symbole figure exactement une fois dans chaque ligne et une fois dans chaque colonne.</p></div>
    <p>Il en existe pour tout ${K('n \\geqslant 1')} : numérotons lignes, colonnes et symboles de ${K('0')} à ${K('n-1')}, et plaçons dans la case ${K('(i, j)')} le reste de ${K('i + j')} dans la division par ${K('n')}. Sur une ligne ${K('i')} fixée, si ${K('i + j \\equiv i + j\' \\pmod n')} alors ${K('j \\equiv j\'')}, donc ${K('j = j\'')} : les ${K('n')} cases de la ligne portent ${K('n')} symboles distincts, c'est-à-dire tous. Le même argument vaut pour les colonnes. Ce carré est la table d'addition des entiers modulo ${K('n')} ; plus généralement, la table d'un groupe fini est toujours un carré latin. Une grille de <a href="#activites/sudoku">sudoku</a> résolue est un carré latin d'ordre 9 qui satisfait une contrainte de plus.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Carrés gréco-latins</h4>
    <div class="def"><p><b>Définition.</b> Deux carrés latins de même ordre ${K('n')} sont <b>orthogonaux</b> si, en les superposant, on obtient ${K('n^2')} couples de symboles tous différents. Le tableau des couples est alors un <b>carré gréco-latin</b>.</p></div>
    <p>C'est exactement le problème des officiers : les régiments forment un carré latin, les grades un autre, et l'orthogonalité dit que chaque officier n'existe qu'en un exemplaire.</p>
    <div class="def"><p><b>Proposition.</b> Pour tout ${K('n')} impair, il existe un carré gréco-latin d'ordre ${K('n')} : on place dans la case ${K('(i, j)')} le couple formé des restes de ${K('i + j')} et de ${K('2i + j')} modulo ${K('n')}.</p></div>
    <p><b>Démonstration.</b> Le premier tableau est le carré latin de la section 2. Pour le second, sur une ligne, ${K('2i + j \\equiv 2i + j\'')} entraîne ${K('j = j\'')} ; sur une colonne, ${K('2i + j \\equiv 2i\' + j')} entraîne ${K('2(i - i\') \\equiv 0 \\pmod n')}, donc ${K('i = i\'')}, parce que ${K('n')} est impair et que ${K('2')} est alors premier avec ${K('n')}. C'est bien un carré latin. Enfin, si deux cases ${K('(i, j)')} et ${K('(i\', j\')')} portent le même couple, la différence des deux congruences donne ${K('i \\equiv i\'')}, puis ${K('j \\equiv j\'')} : les ${K('n^2')} cases portent des couples distincts.</p>
    <p><b>À l'ordre 2, c'est impossible.</b> Il n'y a que deux carrés latins d'ordre 2 sur les symboles 0 et 1, et chacun a deux fois le même symbole sur sa diagonale. En les superposant de n'importe quelle façon, les deux cases de la diagonale portent le même couple.</p>
    <p><b>À l'ordre 4</b>, la formule précédente échoue, mais on réussit en remplaçant les entiers modulo 4 par le corps à quatre éléments : la page s'en sert pour fabriquer ses grilles d'ordre 4.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Les trente-six officiers</h4>
    <p>Euler savait construire un carré gréco-latin pour tout ordre impair et pour tout multiple de 4. Restaient les ordres 2, 6, 10, 14…, pour lesquels il conjectura qu'il n'en existe aucun.</p>
    <div class="def"><p><b>Théorème (Tarry, 1900-1901 ; Bose, Shrikhande et Parker, 1960).</b> Il existe un carré gréco-latin d'ordre ${K('n')} pour tout entier ${K('n \\geqslant 3')}, sauf pour ${K('n = 6')}. <i>Admis ici.</i></p></div>
    <p>Gaston Tarry démontra l'impossibilité à l'ordre 6 par un examen de tous les cas, mené à la main ; soixante ans plus tard, Bose, Shrikhande et Parker construisirent des carrés pour tous les autres ordres, réfutant le reste de la conjecture d'Euler. La difficulté contournée ici est double : l'énumération de Tarry est longue, et les constructions de 1960 demandent des outils de combinatoire qui dépassent cette page. Vous pouvez choisir l'ordre 6 ci-dessus : la page vous laisse essayer, en sachant que le carré ne pourra pas être rempli.</p>
    <p>Enfin, on ne peut pas trouver plus de ${K('n - 1')} carrés latins d'ordre ${K('n')} deux à deux orthogonaux. En effet, on peut renommer les symboles de chaque carré pour que sa première ligne soit ${K('0, 1, \\dots, n-1')}, ce qui ne change pas l'orthogonalité. Regardons alors la case située en deuxième ligne, première colonne. Dans aucun carré elle ne porte 0, déjà présent dans cette colonne. Et deux carrés ne peuvent y porter le même symbole ${K('s')} : le couple ${K('(s, s)')} figurerait dans cette case et dans la première ligne. Les carrés y portent donc des symboles distincts parmi ${K('1, \\dots, n-1')}.</p>
  </div>
</section>
` + suite(
  "Croire que deux carrés latins de même ordre se superposent toujours en un carré gréco-latin. Le carré d'addition modulo 4 n'est orthogonal à aucun carré latin, et il en va de même pour tout ordre pair. Voici pourquoi : un carré orthogonal fournirait <i>n</i> cases, une par ligne et une par colonne, portant chacune un symbole différent. La somme de ces symboles vaut 0 + 1 + … + (<i>n</i> − 1) = <i>n</i>(<i>n</i> − 1)/2. Mais chaque symbole est, à un multiple de <i>n</i> près, la somme du numéro de sa ligne et du numéro de sa colonne : la somme totale est donc, à un multiple de <i>n</i> près, le double de 0 + 1 + … + (<i>n</i> − 1), soit <i>n</i>(<i>n</i> − 1), qui est un multiple de <i>n</i>. Il faudrait donc que <i>n</i>(<i>n</i> − 1)/2 soit un multiple de <i>n</i>, ce qui est faux quand <i>n</i> est pair. C'est pour cela qu'à l'ordre 4 il faut une autre addition que celle des entiers modulo 4.",
  "Le chapitre de Maths Sup <a href=\"#cours/ma-12\">Arithmétique dans ℤ</a> fonde les calculs de congruences utilisés ici, et celui de Terminale <a href=\"#cours/t-07\">Dénombrement</a> les comptages. Dans l'édifice : <a href=\"#galois.gs-corps-finis\">Corps finis</a>, pour le corps à quatre éléments, et <a href=\"#z.z-bezout\">PGCD, théorème de Bézout, lemme de Gauss</a>. Le problème vient de L. Euler, « Recherches sur une nouvelle espèce de quarrés magiques » (1782).",
  "Les grilles sont fabriquées à partir de la construction de la section 3 (ou du corps à quatre éléments pour l'ordre 4), puis brouillées en permutant au hasard les lignes, les colonnes, les lettres latines et les lettres grecques, ce qui conserve la propriété. Les cases posées au départ viennent d'une solution : une grille proposée par la page peut donc toujours être terminée, sauf à l'ordre 6 du jeu gréco-latin, où la grille est vide et sans solution. L'indice cherche à compléter votre position par essais et retours en arrière, avec un nombre d'essais plafonné : il répond qu'il a trouvé, qu'il n'y a plus de solution, ou qu'il n'a pas pu conclure. Rien n'est enregistré ni envoyé.");

const LAT = 'ABCDEFG', GRE = 'αβγδεζη';
const alea = n => Math.floor(Math.random() * n), melange = n => { const t = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = alea(i + 1); [t[i], t[j]] = [t[j], t[i]]; } return t; };
const F4 = [[0, 0, 0, 0], [0, 1, 2, 3], [0, 2, 3, 1], [0, 3, 1, 2]];   // multiplication du corps à quatre éléments ; l'addition est le ou exclusif
// Solution brouillée : tableau de n² couples [a, g] (g = -1 en mode latin). Ordre 6 gréco-latin : null.
export function solution(n, greco) {
  if (greco && (n === 6 || n === 2)) return null;
  const pl = melange(n), pc = melange(n), pa = melange(n), pg = melange(n), S = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const u = pl[i], v = pc[j];
    const a = n === 4 && greco ? F4[1][u] ^ v : (u + v) % n, g = !greco ? -1 : n === 4 ? F4[2][u] ^ v : (2 * u + v) % n;
    S.push([pa[a], g < 0 ? -1 : pg[g]]); }
  return S;
}
export function fautes(G, n) {
  const s = new Set();
  for (let x = 0; x < n * n; x++) if (G[x]) for (let y = x + 1; y < n * n; y++) if (G[y] && (Math.floor(x / n) === Math.floor(y / n) || x % n === y % n) && (G[x][0] === G[y][0] || (G[x][1] >= 0 && G[x][1] === G[y][1]))) { s.add(x); s.add(y); }
  return s;
}
// Complète G (sans faute) : renvoie { sol } , { sol: null } s'il n'y a aucune solution, ou { inconnu: true } si le plafond est atteint.
export function completer(G0, n, greco, plafond = 40000) {
  const G = G0.slice(), pris = new Set(G.filter(Boolean).map(c => c[0] * n + c[1])); let essais = 0;
  const cands = x => { const i = Math.floor(x / n), j = x % n, A = new Set(), B = new Set();
    for (let t = 0; t < n; t++) for (const y of [i * n + t, t * n + j]) if (G[y]) { A.add(G[y][0]); B.add(G[y][1]); }
    const r = []; for (let a = 0; a < n; a++) if (!A.has(a)) { if (!greco) r.push([a, -1]); else for (let g = 0; g < n; g++) if (!B.has(g) && !pris.has(a * n + g)) r.push([a, g]); } return r; };
  const rec = () => { let bx = -1, bc = null; for (let x = 0; x < n * n; x++) if (!G[x]) { const c = cands(x); if (!bc || c.length < bc.length) { bx = x; bc = c; if (!c.length) return false; } }
    if (bx < 0) return true; for (const c of bc) { if (++essais > plafond) throw 0; G[bx] = c; if (greco) pris.add(c[0] * n + c[1]); if (rec()) return true; G[bx] = null; if (greco) pris.delete(c[0] * n + c[1]); } return false; };
  try { return { sol: rec() ? G : null }; } catch (e) { return { inconnu: true }; }
}

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let n = 4, greco = true, S = null, G = [], donne = [], hist = [], sel = null, conseil = null, msg = '', vivant = true;
  const meme = (a, b) => a && b && a[0] === b[0] && a[1] === b[1], nom = c => LAT[c[0]] + (c[1] >= 0 ? GRE[c[1]] : '');
  const ou = c => G.findIndex(x => meme(x, c));
  function nouvelle() { n = +q('#cl-n').value; greco = q('#cl-mode').value === 'greco'; S = solution(n, greco); const six = !S; q('#cl-aide-l').hidden = six;
    G = new Array(n * n).fill(null); donne = new Array(n * n).fill(false); const niv = six ? 0 : +q('#cl-aide').value;
    if (niv === 1) for (let j = 0; j < n; j++) donne[j] = true; else if (niv > 1) { const ordre = melange(n * n), k = Math.round(n * n / (niv === 2 ? 3 : 2)); for (let t = 0; t < k; t++) donne[ordre[t]] = true; }
    donne.forEach((d, x) => { if (d) G[x] = S[x]; }); hist = []; sel = null; conseil = null; msg = ''; rendre(); }
  function poser(x) { if (donne[x]) return; const avant = G.slice();
    if (sel) { if (greco) { const y = ou(sel); if (y >= 0) { if (donne[y]) return; G[y] = null; } } if (meme(G[x], sel) && !greco) G[x] = null; else G[x] = sel; if (greco) sel = null; }
    else if (G[x]) { if (greco) sel = G[x]; G[x] = null; } else { msg = 'Choisissez d\'abord ' + (greco ? 'un officier' : 'une lettre') + ' dans la réserve.'; rendre(); return; }
    hist.push(avant); conseil = null; msg = ''; rendre(); }
  function rendre() {
    if (!vivant) return; const F = fautes(G, n), plein = G.every(Boolean), fini = plein && !F.size, t = n >= 7 ? 'min(44px, calc((100vw - 76px) / 7))' : '46px';
    const bouton = (c, cl, attr) => `<button type="button" class="${cl}" ${attr} ${c ? `style="background:${TEINTES[c[0]]};border-color:${TEINTES[c[0]]}"` : ''}>${c ? nom(c) : ''}</button>`;
    const g = q('#cl-grille'); g.style.setProperty('--cl-t', t); g.style.gridTemplateColumns = `repeat(${n}, var(--cl-t))`;
    ecrire(g, G.map((c, x) => bouton(c, (c ? '' : 'vide') + (donne[x] ? ' donne' : '') + (F.has(x) ? ' heurt' : '') + (conseil && conseil.x === x ? ' conseil' : ''), `data-x="${x}" aria-label="Ligne ${Math.floor(x / n) + 1}, colonne ${x % n + 1} : ${c ? nom(c) : 'vide'}${donne[x] ? ', posée par la page' : ''}"`)).join(''), true);
    const r = q('#cl-reserve'); r.style.setProperty('--cl-t', t); r.style.gridTemplateColumns = `repeat(${greco ? n : Math.min(n, 4)}, var(--cl-t))`;
    const items = []; for (let a = 0; a < n; a++) if (greco) for (let gg = 0; gg < n; gg++) items.push([a, gg]); else items.push([a, -1]);
    ecrire(r, items.map(c => bouton(c, (greco && ou(c) >= 0 ? 'pose' : '') + (conseil && meme(conseil.c, c) ? ' conseil' : ''), `data-a="${c[0]}" data-g="${c[1]}" aria-pressed="${meme(sel, c)}" aria-label="${greco ? 'Officier' : 'Lettre'} ${nom(c)}${greco && ou(c) >= 0 ? ', déjà posé' : ''}"`)).join(''), true);
    ecrire(q('#cl-res-t'), greco ? 'La réserve : un officier de chaque sorte' : 'Les lettres');
    ecrire(q('#cl-but'), greco ? `But : ranger les <b>${n * n} officiers</b> de façon que chaque ligne et chaque colonne contienne une fois chaque lettre latine et une fois chaque lettre grecque.${S ? '' : ' À l\'ordre 6, c\'est le problème d\'Euler : il n\'a pas de solution, et la page vous laisse vous en convaincre.'}` : `But : remplir le carré de façon que chaque ligne et chaque colonne contienne <b>une fois chacune des ${n} lettres</b>.`, true);
    ecrire(q('#cl-fait'), `${G.filter(Boolean).length} sur ${n * n}`); q('#cl-annuler').disabled = !hist.length; q('#cl-depart').disabled = !hist.length;
    const m = q('#cl-message'); m.className = 'jeu-message' + (fini ? ' gagne' : F.size ? ' bloque' : '');
    ecrire(m, fini ? (greco ? `Le carré gréco-latin d'ordre ${n} est complet : les ${n * n} officiers sont rangés.` : `Le carré latin d'ordre ${n} est complet.`) : msg || (F.size ? 'Deux lettres identiques se trouvent dans une même ligne ou une même colonne : les cases fautives sont entourées de tirets.' : sel ? `${greco ? 'Officier' : 'Lettre'} ${nom(sel)} en main : cliquez sur une case du carré.` : `Cliquez sur ${greco ? 'un officier' : 'une lettre'} de la réserve, puis sur une case.`));
  }
  q('#cl-grille').addEventListener('click', e => { const b = e.target.closest('button[data-x]'); if (b) poser(+b.dataset.x); });
  q('#cl-reserve').addEventListener('click', e => { const b = e.target.closest('button[data-a]'); if (!b) return; const c = [+b.dataset.a, +b.dataset.g]; if (greco && ou(c) >= 0 && donne[ou(c)]) { msg = `L'officier ${nom(c)} a été posé par la page : il ne bouge pas.`; rendre(); return; } sel = meme(sel, c) ? null : c; conseil = null; msg = ''; rendre(); });
  q('#cl-annuler').addEventListener('click', () => { if (hist.length) { G = hist.pop(); sel = null; conseil = null; msg = ''; rendre(); } });
  q('#cl-depart').addEventListener('click', () => { G = G.map((c, x) => donne[x] ? c : null); hist = []; sel = null; conseil = null; msg = ''; rendre(); });
  q('#cl-conseil').addEventListener('click', () => { conseil = null; sel = null; const aide = 'Vous avez demandé de l\'aide : ';
    if (fautes(G, n).size) msg = aide + 'corrigez d\'abord les cases entourées de tirets.';
    else if (G.every(Boolean)) msg = aide + 'le carré est complet.';
    else if (!S) msg = aide + 'à l\'ordre 6, aucun carré gréco-latin n\'existe (théorème de Tarry, admis ici). Quoi que vous posiez, le carré ne pourra pas être rempli.';
    else { const accord = G.every((c, x) => !c || meme(c, S[x])), R = accord ? { sol: S } : completer(G, n, greco);
      if (R.inconnu) msg = aide + 'la recherche a atteint son plafond sans conclure. Retirez quelques cases et redemandez.';
      else if (!R.sol) msg = aide + 'votre position ne peut plus être complétée. Il faudra reprendre certaines cases.';
      else { const libres = G.map((c, x) => c ? -1 : x).filter(x => x >= 0), x = libres[alea(libres.length)]; conseil = { x, c: R.sol[x] }; msg = aide + `${greco ? 'l\'officier' : 'la lettre'} ${nom(R.sol[x])} peut aller dans la case cerclée de pointillés verts (ligne ${Math.floor(x / n) + 1}, colonne ${x % n + 1}).`; } }
    rendre(); });
  for (const id of ['#cl-neuf']) q(id).addEventListener('click', nouvelle); for (const id of ['#cl-mode', '#cl-n', '#cl-aide']) q(id).addEventListener('change', nouvelle);
  nouvelle();
  return () => { vivant = false; };
}
