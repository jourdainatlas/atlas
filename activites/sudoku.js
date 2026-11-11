// Casse-tête « Sudoku », rubrique Activités, MEMO_atlas_activites.md §135 et §136 : générateur gradué, indice, aide pas à pas, grille à partir de chiffres choisis.
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .sk { display: grid; grid-template-columns: repeat(var(--n), 1fr); width: min(100%, calc(var(--n) * 52px)); border: 2px solid var(--encre); user-select: none; }
.activites-act .sk button { aspect-ratio: 1 / 1; padding: 0; border: 0; border-right: 1px solid var(--filet-fort, var(--encre-3)); border-bottom: 1px solid var(--filet-fort, var(--encre-3)); border-radius: 0; background: var(--surface); color: var(--activites-jeu); font: 600 clamp(15px, 4.6vw, 24px)/1 var(--f-ui); cursor: pointer; position: relative; }
.activites-act .sk button.bd { border-right: 2px solid var(--encre); } .activites-act .sk button.bb { border-bottom: 2px solid var(--encre); }
.activites-act .sk button.fin-l { border-right: 0; } .activites-act .sk button.fin-c { border-bottom: 0; }
.activites-act .sk button.donne { color: var(--encre); background: color-mix(in srgb, var(--encre) 7%, var(--surface)); }
.activites-act .sk button.mien { color: var(--semi); }
.activites-act .sk button.vue { background: color-mix(in srgb, var(--activites-jeu) 9%, var(--surface)); }
.activites-act .sk button.meme { background: color-mix(in srgb, var(--activites-jeu) 24%, var(--surface)); }
.activites-act .sk button.choisie { outline: 3px solid var(--activites-jeu); outline-offset: -3px; z-index: 1; }
.activites-act .sk button.conflit { color: var(--sec); background: color-mix(in srgb, var(--sec) 20%, var(--surface)); }
.activites-act .sk button.aide { box-shadow: inset 0 0 0 3px var(--tan); }
.activites-act .sk button.zone { background: color-mix(in srgb, var(--tan) 22%, var(--surface)); }
.activites-act .sk .notes { position: absolute; inset: 2px; display: grid; grid-template-columns: repeat(var(--bc), 1fr); font: 500 clamp(7px, 1.7vw, 10.5px)/1 var(--f-mono); color: var(--encre-2); align-items: center; justify-items: center; }
.activites-act .sk .notes i { font-style: normal; } .activites-act .sk .notes i.ote { color: var(--sec); text-decoration: line-through; }
.activites-act .sk-clavier { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 0 16px 16px; background: var(--papier); }
.activites-act .sk-clavier button { min-width: 40px; height: 40px; border-radius: 8px; border: 1px solid var(--encre-3); background: var(--surface); color: var(--encre); font: 600 18px var(--f-ui); cursor: pointer; }
.activites-act .sk-clavier button.large { padding: 0 12px; font: 500 14px var(--f-ui); }
.activites-act .sk-clavier button[aria-pressed="true"] { background: var(--encre); color: var(--surface); }
.activites-act .sk-clavier button.fini { opacity: .35; }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie va jusqu'en Maths Sup</p>
  <h3>Sudoku</h3>
  <p class="lede">Chaque ligne, chaque colonne et chaque bloc doit contenir une fois chaque chiffre. La page fabrique des grilles à la demande, de la plus douce à la plus retorse, et sait expliquer chaque déduction. Derrière le jeu : des carrés latins, un coloriage de graphe, et quelques nombres vertigineux.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Mode <select id="sk-mode"><option value="gen" selected>grille générée</option><option value="moi">à partir de mes chiffres</option></select></label>
    <label>Taille <select id="sk-taille"><option value="2x2">4 × 4</option><option value="2x3">6 × 6</option><option value="3x3" selected>9 × 9</option></select></label>
    <label>Difficulté <select id="sk-niv"><option value="1">1 · très facile</option><option value="2" selected>2 · facile</option><option value="3">3 · moyen</option><option value="4">4 · difficile</option><option value="5">5 · très difficile</option></select></label>
    <button type="button" class="primary" id="sk-neuf">Nouvelle grille</button>
    <button type="button" id="sk-depart">Revenir au départ</button>
    <button type="button" id="sk-annuler">Annuler</button>
    <button type="button" id="sk-indice">Un indice</button>
    <button type="button" id="sk-pas">Remplir une case</button>
    <button type="button" id="sk-tout">Résoudre jusqu'au bout</button>
  </div>
  <div class="jeu-plateau"><div class="sk" id="sk-grille" role="grid" aria-label="Grille de sudoku"></div></div>
  <div class="sk-clavier" id="sk-clavier" role="group" aria-label="Chiffres"></div>
  <div class="jeu-etat"><span>Cases à remplir : <b id="sk-reste">0</b></span><span id="sk-indices"></span><span id="sk-mesure"></span></div>
  <div class="jeu-message" id="sk-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>Cliquez sur une case, puis tapez un chiffre au clavier, ou servez-vous des touches sous la grille ; les flèches déplacent la sélection, la touche d'effacement vide la case. La touche « notes » permet d'inscrire en petit les chiffres encore possibles. La page ne signale en orange que deux chiffres qui se gênent directement, sur une même ligne, une même colonne ou dans un même bloc. Elle ne dit pas si un chiffre posé, sans gêner personne, a rendu la grille impossible à finir : c'est à vous de vous en apercevoir.</p>
    <p>Trois aides, de la plus discrète à la plus directe. « Un indice » montre seulement où regarder : la zone où une déduction est possible, et sa nature, sans donner ni la case ni le chiffre. « Remplir une case » fait la déduction la plus simple disponible, inscrit le chiffre et explique pourquoi. « Résoudre jusqu'au bout » enchaîne ces déductions. Dans le mode « à partir de mes chiffres », vous posez d'abord quelques chiffres où vous voulez, puis la page construit une grille à solution unique qui les contient tous.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Un carré latin sous contrainte</h4>
    <p>Une grille remplie est un <b>carré latin</b> d'ordre ${K('n')} : chaque chiffre figure une fois par ligne et par colonne, autrement dit chaque ligne est une permutation de ${K('\\{1, \\dots, n\\}')} et deux lignes ne coïncident en aucune colonne. Le sudoku ajoute la condition des blocs. On peut aussi y voir un coloriage : les cases sont les sommets d'un graphe, deux cases étant reliées si elles partagent une ligne, une colonne ou un bloc, et il s'agit de colorier les sommets avec ${K('n')} couleurs sans que deux sommets reliés aient la même. Dans la grille de 9 sur 9, chaque case a ${K('8 + 8 + 4 = 20')} voisines.</p>
    <p id="sk-compte" aria-live="polite"></p>
    <div class="def"><p>Il existe exactement</p>${KD('6\\,670\\,903\\,752\\,021\\,072\\,936\\,960 \\approx 6{,}67 \\times 10^{21}')}<p>grilles de sudoku de 9 sur 9 remplies (Felgenhauer et Jarvis, 2005), dont ${K('5\\,472\\,730\\,538')} seulement sont essentiellement différentes (Russell et Jarvis, 2006). <b>Admis ici</b> : ces deux nombres résultent de calculs par ordinateur.</p></div>
    <p>« Essentiellement différentes » signifie : à une symétrie près. Renommer les chiffres, échanger deux lignes d'une même bande, échanger deux bandes entières, faire de même avec les colonnes, ou échanger lignes et colonnes, transforme une grille valide en une grille valide. Ces opérations engendrent un groupe de symétries, et deux grilles sont dites essentiellement différentes quand aucune d'elles ne fait passer de l'une à l'autre.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Combien d'indices faut-il ?</h4>
    <p>Un bon sudoku a une solution et une seule. Voici une condition nécessaire qui se démontre en deux lignes.</p>
    <div class="def"><p>Si une grille à compléter a une solution unique, alors ses indices portent au moins ${K('n - 1')} chiffres différents.</p></div>
    <p>En effet, si deux chiffres, disons 1 et 2, ne figurent pas parmi les indices, prenons une solution et échangeons-y partout les 1 et les 2 : on obtient une autre grille valide, qui respecte encore tous les indices. La solution n'est donc pas unique.</p>
    <p>La vraie borne est bien plus difficile : pour la grille de 9 sur 9, il faut au moins 17 indices, et il existe des grilles à 17 indices. Ce résultat, dû à McGuire, Tugemann et Civario (2012), est <b>admis ici</b> : sa démonstration est une recherche exhaustive par ordinateur. La ligne d'état indique le nombre d'indices de la grille affichée.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Déduire, ou essayer</h4>
    <p>La difficulté d'une grille ne tient pas au nombre de ses indices, mais aux raisonnements qu'elle exige. La page classe ses grilles d'après la déduction la plus fine dont son propre résolveur a besoin :</p>
    <ol>
      <li><b>Niveau 1.</b> Dans une ligne, une colonne ou un bloc, un chiffre n'a plus qu'une place possible.</li>
      <li><b>Niveau 2.</b> Dans une case, il ne reste qu'un chiffre possible.</li>
      <li><b>Niveau 3.</b> Candidats confinés (dans un bloc, un chiffre ne peut aller que sur une ligne : on l'élimine du reste de cette ligne) et paires (deux cases d'une même zone n'admettent que les deux mêmes chiffres).</li>
      <li><b>Niveau 4.</b> Triplets, et figure dite « X-wing » : un chiffre confiné aux deux mêmes colonnes dans deux lignes.</li>
      <li><b>Niveau 5.</b> Aucune de ces déductions ne suffit : il faut des raisonnements plus longs, ou une hypothèse que l'on pousse jusqu'à la contradiction.</li>
    </ol>
    <p>Toute grille à solution unique peut être résolue par essais et retours en arrière : c'est ce que fait la page pour vérifier l'unicité. Mais ce n'est pas ainsi qu'un joueur veut résoudre, et c'est pourquoi le niveau se mesure sur les déductions, non sur le temps de calcul.</p>
  </div>
</section>
` + suite(
  "Croire qu'une grille est d'autant plus facile qu'elle a plus d'indices. Le nombre d'indices ne dit presque rien : une grille à 30 indices peut exiger des raisonnements que n'exige pas une grille à 24. L'autre illusion est de se croire en bonne voie parce qu'aucun chiffre ne gêne directement un autre : une erreur peut ne se révéler que vingt cases plus tard, quand une case n'admet plus aucun chiffre.",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> compte les permutations dont les lignes d'une grille sont faites ; celui de Maths Sup <a href=\"#cours/ma-17\">Groupe symétrique et déterminants</a> étudie les groupes de permutations, dont relèvent les symétries du sudoku. Dans l'édifice : <a href=\"#v-det.v-permutations\">Groupe symétrique et signature</a>.",
  "Une grille complète est tirée au hasard par recherche avec retour arrière. Les indices sont ensuite retirés un à un, dans un ordre aléatoire, tant que la solution reste unique (vérifié par une recherche exhaustive qui s'arrête à la deuxième solution) et que le résolveur par déductions reste dans le niveau demandé. Le nombre de grilles de 4 sur 4 est obtenu par énumération. Rien n'est enregistré ni envoyé.");

// ------------------------------------------------------------------ moteur
function moteur(br, bc) {
  const n = br * bc, N = n * n, TOUT = (1 << n) - 1;
  const L = i => Math.floor(i / n), Cc = i => i % n, B = i => Math.floor(L(i) / br) * br + Math.floor(Cc(i) / bc);
  const unites = []; for (let k = 0; k < n; k++) { unites.push({ t: 'l', k, c: [] }, { t: 'c', k, c: [] }, { t: 'b', k, c: [] }); }
  for (let i = 0; i < N; i++) { unites[3 * L(i)].c.push(i); unites[3 * Cc(i) + 1].c.push(i); unites[3 * B(i) + 2].c.push(i); }
  const pairs = Array.from({ length: N }, (_, i) => { const s = new Set(); for (const u of [unites[3 * L(i)], unites[3 * Cc(i) + 1], unites[3 * B(i) + 2]]) for (const j of u.c) if (j !== i) s.add(j); return [...s]; });
  const bits = m => { let c = 0; while (m) { m &= m - 1; c++; } return c; }, liste = m => { const o = []; for (let d = 1; d <= n; d++) if (m >> (d - 1) & 1) o.push(d); return o; };
  const nom = u => (u.t === 'l' ? 'la ligne ' : u.t === 'c' ? 'la colonne ' : 'le bloc ') + (u.k + 1), ou = i => `ligne ${L(i) + 1}, colonne ${Cc(i) + 1}`;
  const cands = (g, elim) => g.map((v, i) => { if (v) return 0; let m = TOUT; for (const j of pairs[i]) if (g[j]) m &= ~(1 << (g[j] - 1)); return m & ~(elim ? elim[i] : 0); });
  const conflits = g => { const s = new Set(); for (let i = 0; i < N; i++) if (g[i]) for (const j of pairs[i]) if (g[j] === g[i]) s.add(i); return s; };
  // nombre de solutions (au plus max) ; si hasard, renvoie aussi une solution tirée au hasard
  function resoudre(g0, max, hasard) { const g = g0.slice(); let nb = 0, sol = null;
    (function f() { let best = -1, bm = 0, bn = 99; for (let i = 0; i < N; i++) if (!g[i]) { let m = TOUT; for (const j of pairs[i]) if (g[j]) m &= ~(1 << (g[j] - 1)); const c = bits(m); if (c < bn) { bn = c; best = i; bm = m; if (c <= 1) break; } }
      if (best < 0) { nb++; if (!sol) sol = g.slice(); return; } if (bn === 0) return;
      const ds = liste(bm); if (hasard) for (let k = ds.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [ds[k], ds[j]] = [ds[j], ds[k]]; }
      for (const d of ds) { g[best] = d; f(); if (nb >= max) return; } g[best] = 0; })();
    return { nb, sol }; }
  // prochaine déduction ; rend { pose: [case, chiffre] } ou { ote: [[case, masque]…] }, avec niveau et explication
  function pas(g, elim, plafond = 4) { const c = cands(g, elim);
    for (const u of unites) for (let d = 1; d <= n; d++) { const b = 1 << (d - 1); if (u.c.some(i => g[i] === d)) continue; const pl = u.c.filter(i => c[i] & b); if (pl.length === 1) return { pose: [pl[0], d], niveau: 1, cases: [pl[0]], zone: u.c, discret: `Regardez ${nom(u)} : un chiffre n'y a plus qu'une place possible.`, texte: `Dans ${nom(u)}, le ${d} n'a plus qu'une place possible : ${ou(pl[0])}.` }; }
    if (plafond < 2) return null;
    for (let i = 0; i < N; i++) if (!g[i] && bits(c[i]) === 1) { const d = liste(c[i])[0]; return { pose: [i, d], niveau: 2, cases: [i], zone: unites[3 * B(i) + 2].c, discret: `Regardez le bloc ${B(i) + 1} : l'une de ses cases n'admet plus qu'un seul chiffre, tous les autres étant exclus par sa ligne, sa colonne ou son bloc.`, texte: `Dans la case ${ou(i)}, tous les autres chiffres sont exclus par sa ligne, sa colonne ou son bloc : il ne reste que le ${d}.` }; }
    if (plafond < 3) return null;
    const ote = (liste2, niveau, cases, texte, zone, discret) => { const o = liste2.filter(([i, m]) => c[i] & m).map(([i, m]) => [i, c[i] & m]); return o.length ? { ote: o, niveau, cases, texte, zone, discret } : null; };
    // candidats confinés
    for (const u of unites) for (let d = 1; d <= n; d++) { const b = 1 << (d - 1), pl = u.c.filter(i => c[i] & b); if (pl.length < 2) continue;
      for (const v of unites) { if (v === u || v.t === u.t || (u.t !== 'b' && v.t !== 'b')) continue; if (pl.every(i => v.c.includes(i))) { const r = ote(v.c.filter(i => !u.c.includes(i)).map(i => [i, b]), 3, pl, `Dans ${nom(u)}, le ${d} ne peut aller que dans des cases de ${nom(v)} : on peut donc l'exclure des autres cases de ${nom(v)}.`, u.c, `Aucun chiffre ne se place directement. Regardez ${nom(u)} : l'un des chiffres manquants y est confiné à une seule ${v.t === 'l' ? 'ligne' : v.t === 'c' ? 'colonne' : 'zone commune avec un bloc'}, ce qui permet de l'exclure ailleurs.`); if (r) return r; } } }
    // paires et triplets nus, paires cachées
    for (const taille of [2, 3]) { if (taille === 3 && plafond < 4) break;
      for (const u of unites) { const vides = u.c.filter(i => !g[i]); if (vides.length <= taille) continue;
        const combi = (dep, pris) => { if (pris.length === taille) { let m = 0; for (const i of pris) m |= c[i]; if (bits(m) !== taille) return null; return ote(vides.filter(i => !pris.includes(i)).map(i => [i, m]), taille === 2 ? 3 : 4, pris, `Dans ${nom(u)}, ${taille === 2 ? 'deux' : 'trois'} cases n'admettent à elles ${taille === 2 ? 'deux' : 'trois'} que les chiffres ${liste(m).join(', ')} : ces chiffres leur sont réservés, et on les exclut des autres cases de ${nom(u)}.`, u.c, `Aucun chiffre ne se place directement. Regardez ${nom(u)} : ${taille === 2 ? 'deux' : 'trois'} cases s'y partagent ${taille === 2 ? 'deux' : 'trois'} chiffres à elles seules.`); }
          for (let k = dep; k < vides.length; k++) { if (bits(c[vides[k]]) > taille || !c[vides[k]]) continue; const r = combi(k + 1, pris.concat(vides[k])); if (r) return r; } return null; };
        const r = combi(0, []); if (r) return r; } }
    for (const u of unites) for (let d1 = 1; d1 < n; d1++) for (let d2 = d1 + 1; d2 <= n; d2++) { const m = (1 << (d1 - 1)) | (1 << (d2 - 1)), p1 = u.c.filter(i => c[i] >> (d1 - 1) & 1), p2 = u.c.filter(i => c[i] >> (d2 - 1) & 1);
      if (p1.length === 2 && p2.length === 2 && p1[0] === p2[0] && p1[1] === p2[1]) { const r = ote(p1.map(i => [i, TOUT & ~m]), 3, p1, `Dans ${nom(u)}, le ${d1} et le ${d2} n'ont que les deux mêmes cases possibles : ces deux cases leur sont réservées, et on y exclut tous les autres chiffres.`, u.c, `Aucun chiffre ne se place directement. Regardez ${nom(u)} : deux chiffres n'y ont que les deux mêmes cases possibles.`); if (r) return r; } }
    if (plafond < 4) return null;
    // X-wing
    for (const [ta, tb] of [['l', 'c'], ['c', 'l']]) for (let d = 1; d <= n; d++) { const b = 1 << (d - 1), U = unites.filter(u => u.t === ta), pos = U.map(u => u.c.filter(i => c[i] & b));
      for (let x = 0; x < n; x++) for (let y = x + 1; y < n; y++) { if (pos[x].length !== 2 || pos[y].length !== 2) continue; const k = i => ta === 'l' ? Cc(i) : L(i); if (k(pos[x][0]) !== k(pos[y][0]) || k(pos[x][1]) !== k(pos[y][1])) continue;
        const cols = [k(pos[x][0]), k(pos[x][1])], coins = pos[x].concat(pos[y]), cible = []; for (let i = 0; i < N; i++) if (cols.includes(k(i)) && !coins.includes(i)) cible.push([i, b]);
        const r = ote(cible, 4, coins, `Le ${d} n'a que deux places dans ${nom(U[x])} et dans ${nom(U[y])}, et ce sont les deux mêmes ${tb === 'c' ? 'colonnes' : 'lignes'} : il occupera donc ces deux ${tb === 'c' ? 'colonnes' : 'lignes'} à ces endroits, et on l'exclut du reste de ces ${tb === 'c' ? 'colonnes' : 'lignes'}.`, U[x].c.concat(U[y].c), `Aucun chiffre ne se place directement. Regardez ${nom(U[x])} et ${nom(U[y])} : un même chiffre n'y a que deux places, dans les deux mêmes ${tb === 'c' ? 'colonnes' : 'lignes'}.`); if (r) return r; } }
    return null; }
  // niveau mesuré d'une grille : la déduction la plus fine nécessaire, 5 si les déductions connues ne suffisent pas
  function mesurer(g0, plafond = 4) { const g = g0.slice(), elim = new Array(N).fill(0); let niv = 0;
    for (;;) { if (g.every(v => v)) return niv; const p = pas(g, elim, plafond); if (!p) return 5; niv = Math.max(niv, p.niveau); if (p.pose) g[p.pose[0]] = p.pose[1]; else for (const [i, m] of p.ote) elim[i] |= m; } }
  // grille à compléter : solution tirée au hasard (contenant les chiffres imposés), puis retrait des indices
  function engendrer(niveau, imposes) { const base = imposes || new Array(N).fill(0), r0 = resoudre(base, 1, true); if (!r0.sol) return null;
    const cible = niveau, plafond = Math.min(niveau, 4), garde = n === 9 ? [0, 36, 30, 0, 0, 0][niveau] : 0; let meilleur = null;
    for (let essai = 0; essai < (niveau === 1 ? 2 : niveau === 4 ? 40 : 16); essai++) { const sol = essai === 0 || imposes ? (essai === 0 ? r0.sol : resoudre(base, 1, true).sol) : resoudre(new Array(N).fill(0), 1, true).sol, g = sol.slice();
      const ordre = [...Array(N).keys()].filter(i => !base[i]); for (let k = ordre.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [ordre[k], ordre[j]] = [ordre[j], ordre[k]]; }
      let nb = N; for (const i of ordre) { if (nb <= garde) break; const v = g[i]; g[i] = 0; if (resoudre(g, 2).nb !== 1 || (niveau < 5 && mesurer(g, plafond) > cible)) g[i] = v; else nb--; }
      const m = mesurer(g); if (!meilleur || Math.abs(m - cible) < Math.abs(meilleur.m - cible)) meilleur = { g, sol, m }; if (m === cible) break; }
    return meilleur; }
  // nombre de grilles complètes (pour les petites tailles)
  const compterTout = () => resoudre(new Array(N).fill(0), 1e9).nb;
  return { n, N, br, bc, L, Cc, B, pairs, cands, conflits, resoudre, pas, mesurer, engendrer, compterTout, liste, ou };
}

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let M = moteur(3, 3), donne = [], g = [], notes = [], elim = [], hist = [], sel = 0, modeNotes = false, mode = 'gen', saisie = false, mesure = 0, msg = '', aide = [], zone = [], vivant = true, total4 = null;
  const instant = () => ({ g: g.slice(), notes: notes.slice(), elim: elim.slice() });
  function vider() { donne = new Array(M.N).fill(0); g = new Array(M.N).fill(0); notes = new Array(M.N).fill(0); elim = new Array(M.N).fill(0); hist = []; aide = []; zone = []; sel = 0; }
  function nouvelle() { const niv = +q('#sk-niv').value; aide = []; zone = []; msg = '';
    if (mode === 'moi' && !saisie) { vider(); saisie = true; mesure = 0; msg = 'Posez vos chiffres où vous voulez, puis appuyez sur « Générer à partir de mes chiffres ».'; rendre(); return; }
    let imposes = null;
    if (mode === 'moi') { if (M.conflits(g).size) { msg = 'Deux de vos chiffres se gênent : corrigez-les avant de générer.'; rendre(); return; } imposes = g.slice(); }
    const r = M.engendrer(niv, imposes);
    if (!r) { msg = 'Vos chiffres ne se gênent pas directement, et pourtant aucune grille complète ne les contient tous : il faut en retirer.'; rendre(); return; }
    const miens = imposes; vider(); donne = r.g.slice(); g = r.g.slice(); mesure = r.m; saisie = false; if (miens) vider.miens = miens; else vider.miens = null;
    msg = mesure === niv ? '' : `La page n'a pas trouvé de grille du niveau ${niv} en un temps raisonnable${miens ? ' avec vos chiffres' : ''} : celle-ci est de niveau ${mesure}.`; rendre(); }
  function poser(i, d) { if (donne[i] && !saisie) return; hist.push(instant()); aide = []; zone = []; msg = '';
    if (modeNotes && !saisie && d) { if (!g[i]) notes[i] ^= 1 << (d - 1); } else { g[i] = g[i] === d ? 0 : d; if (g[i]) notes[i] = 0; } rendre(); }
  function rendre() {
    if (!vivant) return;
    const G = q('#sk-grille'), n = M.n, cle = M.br + 'x' + M.bc; G.style.setProperty('--n', n); G.style.setProperty('--bc', M.bc);
    if (G.dataset.t !== cle) { G.dataset.t = cle; G.innerHTML = ''; for (let i = 0; i < M.N; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; b.setAttribute('role', 'gridcell'); G.append(b); }
      const Kb = q('#sk-clavier'); Kb.innerHTML = ''; for (let d = 1; d <= n; d++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.d = d; b.textContent = d; Kb.append(b); }
      for (const [id, t] of [['eff', 'effacer'], ['notes', 'notes']]) { const b = document.createElement('button'); b.type = 'button'; b.className = 'large'; b.dataset.a = id; b.textContent = t; Kb.append(b); } }
    const conf = M.conflits(g), vus = new Set(M.pairs[sel]), miens = vider.miens;
    [...G.children].forEach((b, i) => { const v = g[i]; let c = (donne[i] && !saisie ? (miens && miens[i] ? 'donne mien' : 'donne') : '') + (M.Cc(i) % M.bc === M.bc - 1 ? ' bd' : '') + (M.L(i) % M.br === M.br - 1 ? ' bb' : '') + (M.Cc(i) === n - 1 ? ' fin-l' : '') + (M.L(i) === n - 1 ? ' fin-c' : '');
      if (i === sel) c += ' choisie'; else if (v && v === g[sel]) c += ' meme'; else if (vus.has(i)) c += ' vue'; if (zone.includes(i) && i !== sel) c += ' zone'; if (conf.has(i)) c += ' conflit'; if (aide.includes(i)) c += ' aide'; b.className = c;
      const h = v ? String(v) : (notes[i] || elim[i] ? `<span class="notes">${Array.from({ length: n }, (_, k) => `<i${elim[i] >> k & 1 ? ' class="ote"' : ''}>${(notes[i] | elim[i]) >> k & 1 ? k + 1 : ''}</i>`).join('')}</span>` : ''); if (b.innerHTML !== h) b.innerHTML = h;
      b.setAttribute('aria-label', `${M.ou(i)} : ${v ? v + (donne[i] && !saisie ? ', indice' : '') : 'vide'}${conf.has(i) ? ', en conflit' : ''}`); b.tabIndex = i === sel ? 0 : -1; });
    const reste = g.filter(v => !v).length, gagne = !saisie && reste === 0 && conf.size === 0;
    q('#sk-clavier').querySelectorAll('button[data-d]').forEach(b => b.classList.toggle('fini', g.filter(v => v === +b.dataset.d).length >= n));
    q('#sk-clavier').querySelector('[data-a="notes"]').setAttribute('aria-pressed', String(modeNotes));
    ecrire(q('#sk-reste'), entier(reste)); ecrire(q('#sk-indices'), saisie ? `Chiffres posés : ${M.N - reste}` : `Indices : ${donne.filter(v => v).length}`);
    ecrire(q('#sk-mesure'), saisie || !mesure ? '' : `Niveau mesuré : ${mesure}`);
    q('#sk-neuf').textContent = mode === 'moi' ? (saisie ? 'Générer à partir de mes chiffres' : 'Recommencer avec d\'autres chiffres') : 'Nouvelle grille';
    for (const id of ['#sk-indice', '#sk-pas', '#sk-tout', '#sk-depart']) q(id).disabled = saisie || (id !== '#sk-depart' && gagne); q('#sk-annuler').disabled = !hist.length;
    const m = q('#sk-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : conf.size ? ' bloque' : '');
    ecrire(m, gagne ? (msg.startsWith('Grille résolue') ? msg : 'Réussi : la grille est complète et sans erreur.') : conf.size ? 'Deux chiffres identiques se gênent (en orange).' : msg || (saisie ? 'Posez vos chiffres, puis générez.' : 'Choisissez une case, puis un chiffre.'));
    if (total4 === null) total4 = moteur(2, 2).compterTout();
    ecrire(q('#sk-compte'), `La page a compté par énumération les grilles de 4 sur 4 (blocs de 2 sur 2) : il y en a ${entier(total4)}. Pour 9 sur 9, le décompte dépasse de loin ce qu'une page peut faire :`);
  }
  // Une déduction ; rend false si rien n'a pu être fait. Les éliminations ne remplissent rien : remplir() les enchaîne jusqu'à une pose.
  function unPas() { aide = []; zone = [];
    if (M.conflits(g).size) { msg = 'Corrigez d\'abord les chiffres qui se gênent.'; return false; }
    const p = M.pas(g, elim);
    if (p) { hist.push(instant()); aide = p.cases; if (p.pose) { g[p.pose[0]] = p.pose[1]; notes[p.pose[0]] = 0; sel = p.pose[0]; } else for (const [i, mk] of p.ote) elim[i] |= mk; msg = `Niveau ${p.niveau}. ${p.texte}`; return p.pose ? 'pose' : 'ote'; }
    const r = M.resoudre(g, 1);
    if (!r.sol) { msg = 'Vous avez demandé de l\'aide : depuis cette position, la grille ne peut plus être complétée. L\'un des chiffres que vous avez posés est faux ; annulez, ou revenez au départ.'; return false; }
    const c = M.cands(g, elim); let i = -1, bn = 99; for (let k = 0; k < M.N; k++) if (!g[k]) { let b = 0, mm = c[k]; while (mm) { mm &= mm - 1; b++; } if (b < bn) { bn = b; i = k; } }
    hist.push(instant()); g[i] = r.sol[i]; notes[i] = 0; sel = i; aide = [i]; msg = `Niveau 5. Aucune des déductions que la page connaît ne s'applique : le ${r.sol[i]} de la case ${M.ou(i)} a été obtenu par essais et retours en arrière, non par un raisonnement court.`; return 'pose'; }
  function remplir() { const avant = []; for (let k = 0; k < 60; k++) { const r = unPas(); if (!r) return false; if (r === 'pose') { if (avant.length) msg = `Il a d'abord fallu ${avant.length} élimination${avant.length > 1 ? 's' : ''} (chiffres barrés dans les cases). ${avant[avant.length - 1]} Puis : ${msg}`; return true; } avant.push(msg); } return false; }
  q('#sk-indice').addEventListener('click', () => { aide = []; zone = [];
    if (M.conflits(g).size) msg = 'Corrigez d\'abord les chiffres qui se gênent.';
    else { const p = M.pas(g, elim);
      if (p) { zone = p.zone; msg = `Indice de niveau ${p.niveau}. ${p.discret}`; }
      else if (!M.resoudre(g, 1).sol) msg = 'Vous avez demandé un indice : depuis cette position, la grille ne peut plus être complétée. L\'un des chiffres que vous avez posés est faux.';
      else msg = 'Indice de niveau 5. Aucune des déductions que la page connaît ne s\'applique ici : il faut un raisonnement plus long, par exemple supposer un chiffre dans une case qui n\'en admet que deux et chercher une contradiction.'; }
    rendre(); });
  q('#sk-pas').addEventListener('click', () => { remplir(); rendre(); });
  q('#sk-tout').addEventListener('click', () => { let k = 0, essais = 0, n5 = 0; while (g.some(v => !v) && k < 2000) { const ok = unPas(); if (!ok) break; if (ok === 'pose') k++; if (msg.startsWith('Niveau 5')) n5++; }
    if (!g.some(v => !v)) { aide = []; zone = []; msg = `Grille résolue : ${k} cases remplies${n5 ? `, dont ${n5} par essais` : ', toutes par déduction'}.`; } rendre(); });
  q('#sk-neuf').addEventListener('click', () => { if (mode === 'moi' && !saisie && donne.some(v => v)) { saisie = false; vider(); vider.miens = null; donne = []; donne = new Array(M.N).fill(0); mesure = 0; saisie = true; msg = ''; rendre(); return; } nouvelle(); });
  q('#sk-depart').addEventListener('click', () => { hist.push(instant()); g = donne.slice(); notes = new Array(M.N).fill(0); elim = new Array(M.N).fill(0); aide = []; zone = []; msg = ''; rendre(); });
  q('#sk-annuler').addEventListener('click', () => { const h = hist.pop(); if (h) { g = h.g; notes = h.notes; elim = h.elim; aide = []; zone = []; msg = ''; rendre(); } });
  q('#sk-grille').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) { sel = +b.dataset.i; rendre(); } });
  q('#sk-clavier').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.dataset.d) poser(sel, +b.dataset.d); else if (b.dataset.a === 'eff') { if (!donne[sel] || saisie) { hist.push(instant()); g[sel] = 0; notes[sel] = 0; rendre(); } } else { modeNotes = !modeNotes; rendre(); } });
  const reglage = () => { const [a, b] = q('#sk-taille').value.split('x').map(Number); M = moteur(a, b); mode = q('#sk-mode').value; saisie = false; vider.miens = null; vider(); nouvelle(); };
  q('#sk-taille').addEventListener('change', reglage); q('#sk-mode').addEventListener('change', reglage); q('#sk-niv').addEventListener('change', () => { if (mode === 'gen') nouvelle(); });
  // clavier : chiffres, flèches, effacement ; écouté sur la fenêtre quand la grille est à l'écran, hors des champs
  const { window: fenetre, demonter } = bac();
  fenetre.addEventListener('keydown', e => { if (e.altKey || e.ctrlKey || e.metaKey) return; if (e.target && e.target.closest && e.target.closest('input, select, textarea, [contenteditable], [role="slider"]')) return;
    const r = q('#sk-grille').getBoundingClientRect(); if (r.bottom < 60 || r.top > innerHeight - 40) return; const n = M.n;
    if (/^[1-9]$/.test(e.key) && +e.key <= n) { e.preventDefault(); poser(sel, +e.key); }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); if (!donne[sel] || saisie) { hist.push(instant()); g[sel] = 0; notes[sel] = 0; rendre(); } }
    else if (e.key.startsWith('Arrow')) { e.preventDefault(); const l = M.L(sel), c = M.Cc(sel); sel = e.key === 'ArrowUp' ? ((l + n - 1) % n) * n + c : e.key === 'ArrowDown' ? ((l + 1) % n) * n + c : e.key === 'ArrowLeft' ? l * n + (c + n - 1) % n : l * n + (c + 1) % n; rendre(); }
    else if (e.key === 'n' || e.key === 'N') { modeNotes = !modeNotes; rendre(); } });
  vider.miens = null; vider(); nouvelle();
  return () => { vivant = false; demonter(); };
}
