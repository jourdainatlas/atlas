// Jeu à deux « Le jeu de go », rubrique Activités, MEMO_atlas_activites.md §140 : plateaux de 5, 7 et 9 lignes,
// contre la page (recherche de Monte-Carlo) ou à deux sur le même écran ; problèmes de vie et de mort résolus exhaustivement.
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .go-but { padding: 10px 16px; border-bottom: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); }
.activites-act .go-but b { color: var(--activites-jeu); }
.activites-act .go-tour { padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); display: flex; flex-wrap: wrap; gap: 4px 18px; align-items: center; }
.activites-act .go-tour i.p { display: inline-block; width: 14px; height: 14px; border-radius: 50%; vertical-align: -2px; margin-right: 6px; border: 1.5px solid #8b8f96; }
.activites-act .go-tour i.p.n { background: #1b1d21; } .activites-act .go-tour i.p.b { background: #f6f5f0; }
.activites-act .go-plateau { width: min(100%, 520px); } .activites-act .go-plateau.petit { width: min(100%, 430px); }
.activites-act .go-plateau svg { display: block; width: 100%; height: auto; touch-action: manipulation; border-radius: 6px; }
.activites-act .go-plateau .bois { fill: #e2bd72; } .activites-act .go-plateau .ligne { stroke: #4a3a1c; stroke-width: 1.2; fill: none; } .activites-act .go-plateau .hoshi { fill: #4a3a1c; }
.activites-act .go-plateau .zone { fill: #fff; opacity: .34; }
.activites-act .go-plateau .pn { fill: #1b1d21; stroke: #000; stroke-width: 1; } .activites-act .go-plateau .pb { fill: #f6f5f0; stroke: #55514a; stroke-width: 1; }
.activites-act .go-plateau .morte { opacity: .32; }
.activites-act .go-plateau .dern { fill: none; stroke-width: 2.4; } .activites-act .go-plateau .dern.n { stroke: #f6f5f0; } .activites-act .go-plateau .dern.b { stroke: #1b1d21; }
.activites-act .go-plateau .atari { fill: none; stroke: #d9480f; stroke-width: 3; stroke-dasharray: 5 4; }
.activites-act .go-plateau .conseil { fill: none; stroke: #0b7a3b; stroke-width: 3.5; }
.activites-act .go-plateau .curseur { fill: none; stroke: #1b1d21; stroke-width: 2; stroke-dasharray: 3 3; }
.activites-act .go-plateau .terr.n { fill: #1b1d21; } .activites-act .go-plateau .terr.b { fill: #f6f5f0; stroke: #55514a; stroke-width: .8; }
.activites-act .go-plateau text { font: 700 15px var(--f-ui); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
.activites-act .go-plateau text.n { fill: #f6f5f0; } .activites-act .go-plateau text.b { fill: #1b1d21; } .activites-act .go-plateau text.rep { font-weight: 500; font-size: 11px; fill: #4a3a1c; }
.activites-act .go-plateau .pt { fill: transparent; cursor: pointer; } .activites-act .go-plateau .pt:hover { fill: rgba(27, 29, 33, .16); }
.activites-act .go-plateau.fige .pt { cursor: default; } .activites-act .go-plateau.fige .pt:hover { fill: transparent; }
.activites-act .go-tab td, .activites-act .go-tab th { text-align: left; font-family: var(--f-ui); font-size: 14px; padding: 5px 8px; }
.activites-act .go-tab td:nth-child(2), .activites-act .go-tab td:nth-child(3) { font-weight: 600; }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Jeu à deux · accessible à tous</p>
  <h3>Le jeu de go</h3>
  <p class="lede">Deux joueurs posent tour à tour une pierre sur les intersections d'un quadrillage, et celui qui entoure le plus grand domaine gagne. Les règles tiennent en cinq phrases ; le jeu qui en sort est si profond qu'aucune machine ne sait le jouer parfaitement, même sur le petit plateau de neuf lignes. On joue ici sur 5, 7 ou 9 lignes, contre la page ou à deux.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Adversaire <select id="go-mode"><option value="page" selected>la page</option><option value="deux">un ami, sur le même écran</option></select></label>
    <label id="go-coul-l">Vous jouez <select id="go-coul"><option value="1" selected>Noir (qui commence)</option><option value="2">Blanc</option></select></label>
    <label id="go-force-l">Niveau de la page <select id="go-force"><option value="0">1 · débutant</option><option value="1" selected>2 · facile</option><option value="2">3 · moyen</option><option value="3">4 · fort</option></select></label>
    <label>Plateau <select id="go-n"><option value="5">5 × 5</option><option value="7">7 × 7</option><option value="9" selected>9 × 9</option></select></label>
    <label>Komi <select id="go-komi"><option value="0">0</option><option value="5.5">5,5</option><option value="6.5">6,5</option><option value="7.5" selected>7,5</option></select></label>
    <button type="button" class="primary" id="go-neuf">Nouvelle partie</button>
  </div>
  <p class="go-but">But : à la fin, avoir <b>plus de points que l'adversaire</b>. Un point par pierre posée et vivante, un point par intersection vide entourée par vos seules pierres. Blanc reçoit le komi en compensation du premier coup de Noir.</p>
  <div class="bar"><button type="button" id="go-passer">Passer</button><button type="button" id="go-annuler">Annuler</button><button type="button" id="go-conseil">Un conseil</button><button type="button" id="go-reprendre" hidden>Reprendre la partie</button><button type="button" class="primary" id="go-valider" hidden>Valider le décompte</button>
    <label><input type="checkbox" id="go-libs"> afficher les libertés</label><label><input type="checkbox" id="go-atari"> signaler les chaînes à une liberté</label></div>
  <p class="go-tour" id="go-tour" aria-live="polite"></p>
  <div class="jeu-plateau"><div class="go-plateau" id="go-plateau"></div></div>
  <div class="jeu-etat"><span>Pierres prises par Noir : <b id="go-pn">0</b></span><span>par Blanc : <b id="go-pb">0</b></span><span>Coups joués : <b id="go-nb">0</b></span></div>
  <div class="jeu-message" id="go-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Les règles</h4>
    <p><b>1.</b> Noir commence ; chacun à son tour pose une pierre sur une intersection vide, ou passe. Une pierre posée ne bouge plus.</p>
    <p><b>2.</b> Des pierres de même couleur qui se suivent le long des lignes forment une <b>chaîne</b>. Les intersections vides voisines d'une chaîne sont ses <b>libertés</b>. Les diagonales ne comptent pas.</p>
    <p><b>3.</b> Une chaîne dont l'adversaire occupe la dernière liberté est <b>prise</b> : ses pierres sont retirées du plateau.</p>
    <p><b>4.</b> Il est interdit de poser une pierre qui laisserait sa propre chaîne sans liberté, sauf si ce coup prend des pierres adverses. Il est interdit de reproduire une disposition du plateau déjà apparue dans la partie : c'est la règle du <b>ko</b>.</p>
    <p><b>5.</b> Quand les deux joueurs passent l'un après l'autre, la partie s'arrête. On retire les pierres <b>mortes</b>, celles qui seraient prises à coup sûr si l'on continuait, puis chacun compte ses pierres et les intersections vides que ses pierres sont seules à border.</p>
    <p>Pour jouer, cliquez sur une intersection. Au clavier, les flèches déplacent un repère, la touche Entrée pose la pierre et la touche P passe. Quand les deux joueurs ont passé, la page propose les pierres mortes, en grisé : cliquez sur une chaîne pour changer son statut, puis validez. À deux, mettez-vous d'accord ; en cas de désaccord, « Reprendre la partie » permet de trancher en jouant.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Un jeu sur un graphe</h4>
    <p>Le plateau est un <b>graphe</b> : ses sommets sont les intersections, ses arêtes les segments qui relient deux intersections voisines. Une chaîne est une composante connexe de l'ensemble des pierres d'une couleur, et ses libertés sont les sommets vides qui lui sont adjacents. Cochez « afficher les libertés » : chaque pierre porte alors le nombre de libertés de sa chaîne, que la page obtient en parcourant le graphe de proche en proche.</p>
    <p>Une disposition des pierres est <b>légale</b> si toute chaîne a au moins une liberté. Sur un plateau de ${K('n')} lignes, il y a ${K('3^{n^2}')} façons de marquer chaque intersection « vide », « noire » ou « blanche », mais toutes ne sont pas légales. En les examinant une par une, on en trouve 57 légales sur 81 pour ${K('n = 2')}, 12 675 sur 19 683 pour ${K('n = 3')}, et 24 318 165 sur 43 046 721 pour ${K('n = 4')}. Pour le plateau de 19 lignes, le nombre exact n'a été obtenu qu'en 2016 par John Tromp : il a 171 chiffres, vaut environ ${K('2{,}08 \\times 10^{170}')}, et représente à peu près 1,2 % des ${K('3^{361}')} dispositions.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>La partie se termine toujours</h4>
    <p>Sans la règle du ko, deux joueurs pourraient se reprendre indéfiniment la même pierre. La règle retenue ici, qui interdit toute répétition, suffit à l'empêcher.</p>
    <div class="def"><p><b>Proposition.</b> Sur un plateau de ${K('n')} lignes, une partie compte au plus ${K('2 \\times 3^{n^2}')} coups, passes comprises.</p></div>
    <p><b>Démonstration.</b> Chaque pose de pierre produit une disposition qui n'est encore jamais apparue, et il n'existe que ${K('3^{n^2}')} dispositions, dont le plateau vide du départ : il y a donc moins de ${K('3^{n^2}')} poses. Deux passes de suite arrêtent la partie : avant chaque pose il y a donc au plus une passe, et la partie s'achève par deux passes au plus après la dernière pose. S'il y a ${K('k')} poses, il y a au plus ${K('k + 2')} passes, donc au plus ${K('2k + 2 \\leqslant 2 \\times 3^{n^2}')} coups.</p>
    <p>La borne est gigantesque et sans rapport avec la durée réelle d'une partie, quelques dizaines de coups sur 9 lignes. Mais elle établit que le jeu est fini, donc qu'il possède, en théorie, une issue déterminée quand les deux joueurs jouent au mieux.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Deux yeux pour vivre</h4>
    <p>Appelons <b>œil</b> d'une chaîne une intersection vide dont toutes les voisines appartiennent à cette chaîne.</p>
    <div class="def"><p><b>Proposition.</b> Une chaîne qui possède deux yeux ne peut pas être prise, tant que son propriétaire ne joue pas lui-même dans l'un d'eux.</p></div>
    <p><b>Démonstration.</b> Pour prendre la chaîne, l'adversaire doit occuper toutes ses libertés, donc en particulier ses deux yeux, l'un après l'autre. Supposons qu'il pose une pierre dans un œil alors que l'autre est encore vide. Les voisines de cette pierre appartiennent toutes à la chaîne : la pierre n'a aucune liberté, et elle ne touche aucune autre chaîne. Elle ne prend rien, car la chaîne garde son second œil pour liberté. Le coup laisserait donc une pierre sans liberté sans rien prendre : la règle 4 l'interdit. Aucun des deux yeux ne peut être occupé le premier.</p>
    <p>Avec un seul œil, l'argument tombe : une fois les libertés extérieures occupées, jouer dans l'œil prend la chaîne, et le coup est permis. Toute la tactique du go découle de là : il s'agit de savoir si un groupe encerclé parviendra à former deux yeux.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">5</span>Vie et mort : la forme compte, pas la taille</h4>
    <p>Un groupe blanc est encerclé. Il lui reste un espace intérieur de quelques intersections, et plus aucune liberté à l'extérieur. Vous jouez Noir : pouvez-vous le capturer ? Ici la page ne devine pas : l'espace est assez petit pour qu'elle examine <em>toutes</em> les suites de coups possibles. Elle défend donc parfaitement, et ses verdicts sont des certitudes.</p>
  </div>
  <div class="jeu">
    <div class="bar top">
      <label>Espace intérieur <select id="gv-pb"></select></label>
      <label><input type="checkbox" id="gv-blanc"> Blanc joue d'abord</label>
      <button type="button" class="primary" id="gv-depart">Revenir au départ</button>
      <button type="button" id="gv-indice">Un indice</button>
      <button type="button" id="gv-ou">Où en est-on ?</button>
      <button type="button" id="gv-renoncer">Renoncer : Blanc vit</button>
    </div>
    <p class="go-but">But : <b>capturer le groupe blanc</b> en jouant dans la zone claire. Si vous pensez que c'est impossible, dites-le par « Renoncer : Blanc vit ».</p>
    <div class="jeu-plateau"><div class="go-plateau petit" id="gv-plateau"></div></div>
    <div class="jeu-message" id="gv-message" aria-live="polite"></div>
  </div>
  <div class="col">
    <p>Voici ce que donne la recherche exhaustive pour les dix formes proposées, selon le joueur qui a le trait. Elle retrouve les résultats que les joueurs de go apprennent par cœur.</p>
    <table class="go-tab"><thead><tr><th>Espace intérieur</th><th>Noir joue d'abord</th><th>Blanc joue d'abord</th></tr></thead><tbody id="gv-table"></tbody></table>
    <p>Trois cases en ligne et quatre cases en ligne ne diffèrent que d'une intersection ; les premières ont un <b>point vital</b>, au centre, que les deux joueurs se disputent, et les secondes vivent quoi que fasse Noir, parce qu'elles ont deux points équivalents : si Noir prend l'un, Blanc prend l'autre. Le carré de quatre, lui, est mort même si Blanc commence. Cinq ou six cases bien groupées peuvent encore être tuées d'un seul coup au centre.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">6</span>Ce que l'on sait, et comment joue la page</h4>
    <p>Le plateau de 5 lignes est résolu : Erik van der Werf, Jaap van den Herik et Jos Uiterwijk ont établi par ordinateur, en 2003, que Noir gagne la totalité du plateau en jouant au mieux (<i>admis ici</i> : le résultat repose sur une recherche exhaustive hors de portée de cette page). Pour 9 lignes, et à plus forte raison pour 19, on ne connaît pas l'issue du jeu parfait.</p>
    <p>La page ne joue donc pas parfaitement. Pour choisir un coup, elle termine des milliers de parties en jouant au hasard à partir de la position, et retient le coup après lequel son camp gagne le plus souvent, en explorant davantage les coups prometteurs. Cette méthode, la <b>recherche arborescente de Monte-Carlo</b>, repose sur la loi des grands nombres : la fréquence des victoires estime la valeur d'un coup. Le bouton « Un conseil » emploie la même méthode : c'est une suggestion, pas une certitude.</p>
    <p>Les quatre niveaux ne diffèrent que par le nombre de parties examinées avant chaque coup. Au niveau 1, <b>débutant</b>, la page n'en examine que 15, et joue de plus un coup tiré au hasard trois fois sur dix : elle laisse prendre ses pierres et convient pour une toute première partie. Au niveau 2, <b>facile</b>, elle en examine 120 ; au niveau 3, <b>moyen</b>, 1 200 ; au niveau 4, <b>fort</b>, 10 000, ce qui demande une seconde ou davantage par coup, selon l'appareil. L'échelle est nette : dans les essais faits en écrivant cette page, chaque niveau a gagné toutes ses parties contre le niveau inférieur, sur 8 à 20 parties selon les niveaux. Aucun de ces niveaux n'a été mesuré contre des joueurs classés.</p>
  </div>
</section>
` + suite(
  "Croire qu'un groupe vit parce qu'il entoure beaucoup d'intersections. Quatre cases en carré ne donnent jamais deux yeux, alors que quatre cases en ligne en donnent toujours : c'est la forme de l'espace intérieur qui décide, et la page le démontre par l'examen de toutes les suites. L'autre erreur des débuts est de compter les diagonales : deux pierres qui se touchent par un coin ne forment pas une chaîne, et l'adversaire peut les séparer.",
  "Le chapitre de Maths expertes <a href=\"#cours/me-06\">Applications des matrices</a> introduit les graphes ; celui de Terminale <a href=\"#cours/t-10\">sur la loi des grands nombres</a> fonde la méthode de Monte-Carlo, que l'exploration <a href=\"#activites/grands-nombres\">La loi des grands nombres</a> fait voir. Dans l'édifice : <a href=\"#n.n-fini\">Ensembles finis et principe des tiroirs</a>, pour la finitude de la partie. Sources : J. Tromp, « The Number of Legal Go Positions » (2016) ; E. van der Werf, J. van den Herik et J. Uiterwijk, « Solving Go on Small Boards », <i>ICGA Journal</i> (2003).",
  "Les règles (prises, suicide, répétition) sont appliquées exactement. Le décompte se fait par aire, avec le komi choisi ; les pierres mortes proposées viennent de quelques centaines de parties terminées au hasard, et c'est à vous de les corriger. L'adversaire et le conseil relèvent de la recherche de Monte-Carlo : le niveau fixe le nombre de parties examinées par coup, si bien que la force de la page ne dépend pas de la vitesse de votre appareil, mais ses coups n'ont rien de certain. Les problèmes de vie et de mort, eux, sont résolus par une recherche exhaustive où seules les intersections de l'espace intérieur se jouent, où Blanc peut passer, et où aucune disposition ne se répète : leurs verdicts sont exacts pour ces règles. Rien n'est enregistré ni envoyé.");

// ---------- Moteur : plateau, chaînes, libertés, prises ----------
export function plateau(n) {
  const N = n * n, vois = [], diag = [];
  for (let p = 0; p < N; p++) { const i = Math.floor(p / n), j = p % n, v = [], d = [];
    if (i > 0) v.push(p - n); if (i < n - 1) v.push(p + n); if (j > 0) v.push(p - 1); if (j < n - 1) v.push(p + 1);
    for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) if (i + a >= 0 && i + a < n && j + b >= 0 && j + b < n) d.push((i + a) * n + j + b);
    vois.push(v); diag.push(d); }
  const marque = new Int32Array(N), pile = new Int32Array(N); let tampon = 0;
  // La chaîne de p a-t-elle au moins une liberté ?
  function respire(col, p) { const c = col[p]; let h = 0; pile[h++] = p; marque[p] = ++tampon;
    while (h) { const q = pile[--h], v = vois[q]; for (let k = 0; k < v.length; k++) { const r = v[k]; if (col[r] === 0) return true; if (col[r] === c && marque[r] !== tampon) { marque[r] = tampon; pile[h++] = r; } } }
    return false; }
  function chaine(col, p) { const c = col[p], pierres = [p], libs = new Set(), vu = new Set([p]);
    for (let h = 0; h < pierres.length; h++) for (const r of vois[pierres[h]]) { if (col[r] === 0) libs.add(r); else if (col[r] === c && !vu.has(r)) { vu.add(r); pierres.push(r); } }
    return { pierres, libs: [...libs] }; }
  function oter(col, p) { const c = col[p]; let h = 0, k = 0; pile[h++] = p; col[p] = 0; k++;
    while (h) { const q = pile[--h], v = vois[q]; for (let t = 0; t < v.length; t++) { const r = v[t]; if (col[r] === c) { col[r] = 0; k++; pile[h++] = r; } } }
    return k; }
  // Pose la pierre c en p (case vide) dans col, modifié sur place. Rend -1 si le coup est un suicide (col inchangé),
  // sinon le nombre de pierres prises ; E.ko reçoit le point de ko simple éventuel.
  const E = { ko: -1 };
  function poser(col, p, c) { const a = 3 - c, v = vois[p]; col[p] = c; let pris = 0, seul = -1;
    for (let k = 0; k < v.length; k++) { const q = v[k]; if (col[q] === a && !respire(col, q)) { const t = oter(col, q); pris += t; seul = t === 1 ? q : -1; } }
    if (!pris && !respire(col, p)) { col[p] = 0; return -1; }
    E.ko = -1; if (pris === 1 && seul >= 0) { let amis = 0, libs = 0; for (let k = 0; k < v.length; k++) { if (col[v[k]] === c) amis++; else if (col[v[k]] === 0) libs++; } if (!amis && libs === 1) E.ko = seul; }
    return pris; }
  // Œil simple de c : case vide dont tous les voisins sont à c, et dont les diagonales ne sont pas trop occupées par l'adversaire.
  function oeil(col, p, c) { const v = vois[p]; for (let k = 0; k < v.length; k++) if (col[v[k]] !== c) return false;
    const d = diag[p]; let adv = 0; for (let k = 0; k < d.length; k++) if (col[d[k]] === 3 - c) adv++;
    return d.length < 4 ? adv === 0 : adv < 2; }
  // Décompte par aire : pierres, plus cases vides dont la région ne touche qu'une couleur. Rend [noir, blanc, propriétaire par case].
  function aire(col) { const prop = new Int8Array(N), vu = new Uint8Array(N); let s = [0, 0, 0];
    for (let p = 0; p < N; p++) { if (col[p]) { prop[p] = col[p]; s[col[p]]++; continue; } if (vu[p]) continue;
      const reg = [p]; vu[p] = 1; let bord = 0; for (let h = 0; h < reg.length; h++) for (const r of vois[reg[h]]) { if (col[r]) bord |= col[r]; else if (!vu[r]) { vu[r] = 1; reg.push(r); } }
      if (bord === 1 || bord === 2) { for (const r of reg) prop[r] = bord; s[bord] += reg.length; } }
    return [s[1], s[2], prop]; }
  return { n, N, vois, diag, respire, chaine, poser, oeil, aire, E };
}

// ---------- Adversaire : recherche arborescente de Monte-Carlo (UCT avec statistiques « tous les coups comme premiers ») ----------
export function monteCarlo(P, komi) {
  const { N, vois, poser, oeil, E } = P, tmp = new Int8Array(N), vides = new Int32Array(N), premier = [null, new Int32Array(N), new Int32Array(N)];
  let dernierProp = null;
  // Partie au hasard depuis col (modifié), trait c, ko simple. Rend la marge noire (aire noire − aire blanche).
  function hasard(col, c, ko, rang) { let passes = 0, coups = 0;
    while (passes < 2 && coups < 3 * N) { let nv = 0; for (let p = 0; p < N; p++) if (col[p] === 0) vides[nv++] = p;
      let joue = false;
      for (let reste = nv; reste > 0; reste--) { const t = Math.floor(Math.random() * reste), p = vides[t]; vides[t] = vides[reste - 1];
        if (p === ko || oeil(col, p, c)) continue; if (poser(col, p, c) < 0) continue; ko = E.ko; if (premier[c][p] === 0) premier[c][p] = rang + coups + 1; joue = true; break; }
      if (!joue) { passes++; ko = -1; } else passes = 0; coups++; c = 3 - c; }
    let m = 0; for (let p = 0; p < N; p++) { let o = col[p]; if (!o) { const v = vois[p]; o = col[v[0]]; for (let k = 1; k < v.length; k++) if (col[v[k]] !== o) { o = 0; break; } } if (o === 1) m++; else if (o === 2) m--; if (dernierProp) dernierProp[p] += o === 1 ? 1 : o === 2 ? -1 : 0; }
    return m; }
  const noeud = (coup, parent) => ({ coup, parent, fils: null, n: 0, g: 0, rn: 0, rg: 0 });
  function etendre(nd, col, c, ko, interdits) { nd.fils = [];
    for (let p = 0; p < N; p++) { if (col[p] !== 0 || p === ko || oeil(col, p, c) || (interdits && interdits.has(p))) continue; tmp.set(col); if (poser(tmp, p, c) < 0) continue; nd.fils.push(noeud(p, nd)); }
    if (!nd.fils.length) nd.fils.push(noeud(-1, nd)); }
  // Recherche depuis la position (col, trait c, ko). interdits : coups exclus à la racine (répétition de position).
  function chercheur(col0, c0, ko0, interdits) {
    const racine = noeud(-2, null), col = new Int8Array(N), chemin = []; let total = 0;
    etendre(racine, col0, c0, ko0, interdits);
    function tour() { col.set(col0); premier[1].fill(0); premier[2].fill(0); let nd = racine, c = c0, ko = ko0, rang = 0; chemin.length = 0; chemin.push(nd);
      for (;;) { if (!nd.fils) { if (nd.n < 2 && nd !== racine) break; etendre(nd, col, c, ko, null); }
        let best = null, bv = -1; const lg = Math.log(nd.n + 1);
        for (const f of nd.fils) { const beta = f.rn / (f.rn + f.n + f.rn * f.n / 2500 + 1e-9);
          const v = (f.n ? (1 - beta) * f.g / f.n : 0) + (f.rn ? beta * f.rg / f.rn : (f.n ? 0 : 0.5)) + 0.25 * Math.sqrt(lg / (f.n + 1)) + Math.random() * 1e-6;
          if (v > bv) { bv = v; best = f; } }
        nd = best; chemin.push(nd); rang++;
        if (nd.coup >= 0) { poser(col, nd.coup, c); ko = E.ko; if (premier[c][nd.coup] === 0) premier[c][nd.coup] = rang; } else { ko = -1; if (nd.parent && nd.parent.coup === -1) { c = 3 - c; break; } }
        c = 3 - c; if (rang > 2 * N) break; }
      const marge = hasard(col, c, ko, rang) - komi, noirGagne = marge > 0; total++;
      for (let d = 0; d < chemin.length; d++) { const x = chemin[d], joueur = (d % 2 === 1) ? c0 : 3 - c0;   // joueur qui a joué le coup menant à x
        x.n++; if ((joueur === 1) === noirGagne) x.g++;
        if (x.fils) { const qui = (d % 2 === 0) ? c0 : 3 - c0, gagne = (qui === 1) === noirGagne; for (const f of x.fils) if (f.coup >= 0 && premier[qui][f.coup] > d) { f.rn++; if (gagne) f.rg++; } } } }
    return { tour, racine, get total() { return total; },
      meilleur() { let b = null; for (const f of racine.fils) if (!b || f.n > b.n) b = f; return b ? { coup: b.coup, taux: b.n ? b.g / b.n : 0.5, n: b.n } : { coup: -1, taux: 0.5, n: 0 }; } }; }
  // Pierres mortes probables : propriétaire moyen de chaque case sur k parties au hasard.
  function proprietaires(col0, c0, k) { dernierProp = new Float64Array(N); const col = new Int8Array(N); premier[1].fill(1); premier[2].fill(1);
    for (let t = 0; t < k; t++) { col.set(col0); hasard(col, t % 2 ? c0 : 3 - c0, -1, 0); } const r = Array.from(dernierProp, x => x / k); dernierProp = null; return r; }
  return { chercheur, proprietaires };
}

// ---------- Vie et mort : recherche exhaustive dans une région ----------
// Noir attaque, Blanc défend ; seuls les points de « region » se jouent ; « cible » est une pierre blanche du groupe.
// Aucune position ne se répète le long d'une variante. Deux passes de suite : le groupe vit.
export function vieEtMort(P, region, cible) {
  const { N, poser } = P; let noeuds = 0;
  const cle = col => { let s = ''; for (const p of region) s += col[p]; return s + (col[cible] ? '' : 'x'); };
  // Noir peut-il capturer ? trait : 1 ou 2 ; passe : le coup précédent était une passe ; vus : positions de la variante.
  function tue(col, trait, passe, vus) { noeuds++;
    for (const p of region) { if (col[p] !== 0) continue; const s = col.slice(); if (poser(s, p, trait) < 0) continue;
      if (trait === 1 && s[cible] === 0) return true; const k = cle(s); if (vus.has(k)) continue;
      vus.add(k); const r = tue(s, 3 - trait, false, vus); vus.delete(k);
      if (trait === 1 ? r : !r) return trait === 1; }
    if (passe) return false;                       // deux passes : le groupe n'est pas capturé
    const r = tue(col, 3 - trait, true, vus); return r; }
  // Meilleurs coups : pour le trait donné, liste des coups (point ou -1 pour passer) qui lui donnent le résultat voulu.
  function coups(col, trait, passe, vus) { const bons = [], tous = [];
    for (const p of region) { if (col[p] !== 0) continue; const s = col.slice(); if (poser(s, p, trait) < 0) continue; const k = cle(s);
      if (trait === 1 && s[cible] === 0) { bons.push(p); tous.push(p); continue; } if (vus.has(k)) continue; tous.push(p);
      vus.add(k); const r = tue(s, 3 - trait, false, vus); vus.delete(k); if (trait === 1 ? r : !r) bons.push(p); }
    tous.push(-1); const rp = passe ? false : tue(col, 3 - trait, true, vus); if (trait === 1 ? rp : !rp) bons.push(-1);
    return { bons, tous }; }
  return { tue, coups, cle, get noeuds() { return noeuds; } };
}

// Problème : un espace intérieur (liste de [ligne, colonne] sur un plateau de 9), entouré de Blanc, lui-même entouré de Noir.
export function probleme(P, forme) {
  const { n, N, vois, diag } = P, col = new Int8Array(N), E = new Set(forme.map(([i, j]) => i * n + j));
  const autour = (S) => { const r = new Set(); for (const p of S) for (const q of vois[p].concat(diag[p])) if (!S.has(q)) r.add(q); return r; };
  const B = autour(E), tout = new Set([...E, ...B]), Nn = autour(tout);
  for (const p of B) col[p] = 2; for (const p of Nn) col[p] = 1;
  return { col, region: [...E].sort((a, b) => a - b), cible: [...B][0] };
}

const FORMES = [
  ['trois en ligne', [[4, 3], [4, 4], [4, 5]]], ['trois en coude', [[4, 4], [4, 5], [5, 4]]],
  ['quatre en ligne', [[4, 2], [4, 3], [4, 4], [4, 5]]], ['quatre en coude', [[4, 3], [4, 4], [4, 5], [5, 5]]],
  ['quatre en T', [[4, 3], [4, 4], [4, 5], [5, 4]]], ['quatre en carré', [[4, 4], [4, 5], [5, 4], [5, 5]]],
  ['cinq en croix', [[3, 4], [4, 3], [4, 4], [4, 5], [5, 4]]], ['cinq en massue', [[4, 3], [4, 4], [4, 5], [5, 4], [5, 5]]],
  ['six en fleur', [[3, 4], [4, 3], [4, 4], [4, 5], [5, 4], [5, 5]]], ['six en rectangle', [[4, 3], [4, 4], [4, 5], [5, 3], [5, 4], [5, 5]]]];

// Dessin d'un plateau : o = { dernier, libs, atari, conseil, curseur, mortes (Set), prop (propriétaires), zone (points clairs), fige }.
function dessin(P, col, o = {}) {
  const { n, N } = P, u = 44, m = 38, T = (n - 1) * u + 2 * m, X = p => m + (p % n) * u, Y = p => m + Math.floor(p / n) * u;
  let s = `<rect class="bois" x="0" y="0" width="${T}" height="${T}" rx="6"/>`;
  if (o.zone) for (const p of o.zone) s += `<rect class="zone" x="${X(p) - u / 2}" y="${Y(p) - u / 2}" width="${u}" height="${u}"/>`;
  let d = ''; for (let k = 0; k < n; k++) d += `M${m} ${m + k * u}H${T - m}M${m + k * u} ${m}V${T - m}`; s += `<path class="ligne" d="${d}"/>`;
  const h = n === 9 ? [20, 24, 40, 56, 60] : [(N - 1) / 2]; if (!o.zone) for (const p of h) s += `<circle class="hoshi" cx="${X(p)}" cy="${Y(p)}" r="3.4"/>`;
  const fait = new Set(), info = new Map();
  if (o.libs || o.atari) for (let p = 0; p < N; p++) if (col[p] && !fait.has(p)) { const c = P.chaine(col, p); for (const q of c.pierres) { fait.add(q); info.set(q, c.libs.length); } }
  for (let p = 0; p < N; p++) { const c = col[p], x = X(p), y = Y(p);
    if (c) { const morte = o.mortes && o.mortes.has(p); s += `<circle class="${c === 1 ? 'pn' : 'pb'}${morte ? ' morte' : ''}" cx="${x}" cy="${y}" r="${u / 2 - 2.5}"/>`;
      if (o.atari && info.get(p) === 1 && !morte) s += `<circle class="atari" cx="${x}" cy="${y}" r="${u / 2 - 5}"/>`;
      if (o.libs && !o.prop) s += `<text class="${c === 1 ? 'n' : 'b'}" x="${x}" y="${y}">${info.get(p)}</text>`;
      else if (o.dernier === p) s += `<circle class="dern ${c === 1 ? 'n' : 'b'}" cx="${x}" cy="${y}" r="7"/>`; }
    if (o.prop && o.prop[p] && (!c || (o.mortes && o.mortes.has(p)))) s += `<rect class="terr ${o.prop[p] === 1 ? 'n' : 'b'}" x="${x - 6}" y="${y - 6}" width="12" height="12"/>`;
    if (o.conseil === p) s += `<circle class="conseil" cx="${x}" cy="${y}" r="${u / 2 - 6}"/>`;
    if (o.curseur === p) s += `<rect class="curseur" x="${x - u / 2 + 3}" y="${y - u / 2 + 3}" width="${u - 6}" height="${u - 6}" rx="4"/>`; }
  for (let k = 0; k < n; k++) s += `<text class="rep" x="${m + k * u}" y="10">${'ABCDEFGHJ'[k]}</text><text class="rep" x="9" y="${m + k * u}">${n - k}</text>`;
  for (let p = 0; p < N; p++) s += `<circle class="pt" data-p="${p}" cx="${X(p)}" cy="${Y(p)}" r="${u / 2 - 1}"/>`;
  return `<svg viewBox="0 0 ${T} ${T}" role="img" aria-label="Plateau de go de ${n} lignes">${s}</svg>`;
}
// Niveaux de la page : [parties au hasard examinées par coup, probabilité de jouer un coup tiré au hasard].
const NIVEAUX = [[15, 0.3], [120, 0], [1200, 0], [10000, 0]];
const nomPoint = (P, p) => 'ABCDEFGHJ'[p % P.n] + (P.n - Math.floor(p / P.n));

export function monter(racine) {
  const q = s => racine.querySelector(s), { window: fenetre, demonter } = bac();
  const NOM = ['', 'Noir', 'Blanc'], cle = col => Array.prototype.join.call(col, '');
  let vivant = true, jeton = 0;

  // ---------- La partie ----------
  let P = plateau(9), M = null, G = null;
  const mode = () => q('#go-mode').value, humain = () => +q('#go-coul').value, komi = () => +q('#go-komi').value;
  const aLaPage = () => mode() === 'page' && G.phase === 'jeu' && G.trait !== humain();
  function nouvelle() { jeton++; P = plateau(+q('#go-n').value); M = monteCarlo(P, komi());
    G = { col: new Int8Array(P.N), trait: 1, passes: 0, pris: [0, 0, 0], dernier: -1, hist: [], vus: new Set(), phase: 'jeu', mortes: new Set(), curseur: (P.N - 1) / 2, clavier: false, conseil: -1, msg: '', pense: false, nb: 0 };
    G.vus.add(cle(G.col)); rendre(); if (aLaPage()) penser(); }
  // Coups qui reproduiraient une disposition déjà vue.
  function repetitions(c) { const r = new Set(); for (let p = 0; p < P.N; p++) { if (G.col[p]) continue; const s = G.col.slice(); if (P.poser(s, p, c) >= 0 && G.vus.has(cle(s))) r.add(p); } return r; }
  function jouer(p) {                                   // p = -1 : passe. Rend false si le coup est interdit.
    if (G.phase !== 'jeu') return false; const c = G.trait, s = G.col.slice(); let pris = 0;
    if (p >= 0) { if (G.col[p]) { G.msg = 'Cette intersection est occupée.'; return false; }
      pris = P.poser(s, p, c); if (pris < 0) { G.msg = 'Coup interdit : cette pierre n\'aurait aucune liberté et ne prendrait rien (règle 4).'; return false; }
      if (G.vus.has(cle(s))) { G.msg = 'Coup interdit : il reproduirait une disposition déjà apparue dans la partie (règle du ko).'; return false; } }
    G.hist.push({ col: G.col, trait: c, passes: G.passes, pris: G.pris.slice(), dernier: G.dernier, cle: p >= 0 ? cle(s) : null, nb: G.nb });
    G.col = s; G.pris[c] += Math.max(0, pris); G.dernier = p; G.passes = p < 0 ? G.passes + 1 : 0; if (p >= 0) G.vus.add(cle(s)); G.trait = 3 - c; G.nb++; G.conseil = -1;
    G.msg = p < 0 ? `${NOM[c]} passe.` : `${NOM[c]} joue en ${nomPoint(P, p)}${pris > 0 ? ` et prend ${pris} pierre${pris > 1 ? 's' : ''}` : ''}.`;
    if (G.passes >= 2) decompter(); return true; }
  function decompter() { G.phase = 'decompte'; G.mortes = new Set(); const pr = M.proprietaires(G.col, G.trait, 400), fait = new Set();
    for (let p = 0; p < P.N; p++) if (G.col[p] && !fait.has(p)) { const ch = P.chaine(G.col, p); let s = 0; for (const x of ch.pierres) { fait.add(x); s += pr[x]; } s /= ch.pierres.length;
      if ((G.col[p] === 1 && s < -0.4) || (G.col[p] === 2 && s > 0.4)) for (const x of ch.pierres) G.mortes.add(x); }
    G.msg = ''; }
  function score() { const s = G.col.slice(); for (const p of G.mortes) s[p] = 0; const [a, b, prop] = P.aire(s); return { a, b, prop }; }
  function penser() { const moi = ++jeton, c = G.trait; G.pense = true; rendre();
    // Après une passe adverse, la page passe aussi si le décompte du plateau tel quel lui donne déjà la victoire.
    if (G.passes === 1) { const [a, b] = P.aire(G.col), marge = a - b - komi(); if ((c === 1) === (marge > 0)) { setTimeout(() => { if (moi !== jeton || !vivant) return; G.pense = false; jouer(-1); rendre(); }, 30); return; } }
    const [cible, etourderie] = NIVEAUX[+q('#go-force').value], S = M.chercheur(G.col, c, -1, repetitions(c)), fin = performance.now() + 8000;
    if (Math.random() < etourderie) { const f = S.racine.fils, p = f[Math.floor(Math.random() * f.length)].coup; setTimeout(() => { if (moi !== jeton || !vivant) return; G.pense = false; if (!jouer(p)) jouer(-1); rendre(); }, 30); return; }
    const tranche = () => { if (moi !== jeton || !vivant) return; const t = performance.now() + 35; while (performance.now() < t && S.total < cible) S.tour();
      if (S.total < cible && performance.now() < fin) { setTimeout(tranche, 0); return; }
      G.pense = false; const b = S.meilleur(); if (!jouer(b.coup)) jouer(-1); rendre(); };
    setTimeout(tranche, 20); }
  function clic(p) { if (G.pense) return;
    if (G.phase === 'decompte') { if (!G.col[p]) return; const ch = P.chaine(G.col, p).pierres, morte = G.mortes.has(p); for (const x of ch) morte ? G.mortes.delete(x) : G.mortes.add(x); rendre(); return; }
    if (G.phase !== 'jeu' || aLaPage()) return; const ok = jouer(p); rendre(); if (ok && aLaPage()) penser(); }
  function rendre() {
    if (!vivant) return; const deux = mode() === 'deux', dec = G.phase !== 'jeu';
    q('#go-coul-l').hidden = deux; q('#go-force-l').hidden = deux;
    const o = { dernier: G.dernier, libs: q('#go-libs').checked, atari: q('#go-atari').checked, conseil: G.conseil, curseur: G.clavier && !dec ? G.curseur : -1 };
    let sc = null; if (dec) { sc = score(); o.mortes = G.mortes; o.prop = sc.prop; }
    const pl = q('#go-plateau'); pl.classList.toggle('fige', G.pense || G.phase === 'fini' || aLaPage()); ecrire(pl, dessin(P, G.col, o), true);
    ecrire(q('#go-pn'), String(G.pris[1])); ecrire(q('#go-pb'), String(G.pris[2])); ecrire(q('#go-nb'), String(G.nb));
    q('#go-passer').disabled = dec || G.pense || aLaPage(); q('#go-conseil').disabled = dec || G.pense || aLaPage(); q('#go-annuler').disabled = !G.hist.length || G.pense;
    q('#go-reprendre').hidden = G.phase !== 'decompte'; q('#go-valider').hidden = G.phase !== 'decompte';
    const pastille = c => `<i class="p ${c === 1 ? 'n' : 'b'}"></i>`, qui = c => deux ? NOM[c] : (c === humain() ? 'vous (' + NOM[c] + ')' : 'la page (' + NOM[c] + ')');
    let tour, msg = G.msg, cl = '';
    if (!dec) tour = G.pense ? `<span>${pastille(G.trait)}La page réfléchit…</span>` : `<span>${pastille(G.trait)}Au trait : ${qui(G.trait)}.</span>`;
    else { const k = komi(), tb = sc.b + k, fr1 = x => String(x).replace('.', ','), ecart = sc.a - tb, g = ecart > 0 ? 1 : 2;
      tour = `<span>${pastille(1)}Noir : ${sc.a}</span><span>${pastille(2)}Blanc : ${sc.b}${k ? ' + ' + fr1(k) + ' = ' + fr1(tb) : ''}</span><span>${ecart === 0 ? 'Égalité.' : `${NOM[g]} gagne de ${fr1(Math.abs(ecart))} point${Math.abs(ecart) > 1 ? 's' : ''}.`}</span>`;
      if (G.phase === 'decompte') msg = 'Les deux joueurs ont passé. Les pierres grisées sont proposées comme mortes, et les petits carrés indiquent à qui revient chaque intersection. Cliquez sur une chaîne pour changer son statut, puis validez le décompte.';
      else { msg = ecart === 0 ? 'Partie nulle.' : deux ? `${NOM[g]} gagne la partie.` : g === humain() ? 'Vous gagnez la partie.' : 'La page gagne la partie.'; cl = ecart === 0 ? '' : deux || g === humain() ? ' gagne' : ' bloque'; } }
    ecrire(q('#go-tour'), tour, true); const m = q('#go-message'); m.className = 'jeu-message' + cl;
    ecrire(m, msg || (G.nb ? '' : 'Noir commence. Cliquez sur une intersection pour y poser une pierre.'));
  }
  q('#go-plateau').addEventListener('click', e => { const c = e.target.closest('.pt'); if (c) { G.clavier = false; clic(+c.dataset.p); } });
  q('#go-passer').addEventListener('click', () => { if (G.pense || aLaPage()) return; jouer(-1); rendre(); if (aLaPage()) penser(); });
  q('#go-annuler').addEventListener('click', () => { if (G.pense || !G.hist.length) return; jeton++;
    do { const h = G.hist.pop(); if (h.cle) G.vus.delete(h.cle); G.col = h.col; G.trait = h.trait; G.passes = h.passes; G.pris = h.pris; G.dernier = h.dernier; G.nb = h.nb; } while (mode() === 'page' && G.hist.length && G.trait !== humain());
    G.phase = 'jeu'; G.mortes = new Set(); G.conseil = -1; G.msg = ''; rendre(); if (aLaPage()) penser(); });
  q('#go-conseil').addEventListener('click', () => { if (G.pense || G.phase !== 'jeu') return; const S = M.chercheur(G.col, G.trait, -1, repetitions(G.trait)), fin = performance.now() + 700; while (performance.now() < fin) S.tour(); const b = S.meilleur();
    G.conseil = b.coup; G.msg = b.coup < 0 ? 'Vous avez demandé un conseil : la page ne voit plus de coup utile et passerait.' : `Vous avez demandé un conseil : la page jouerait en ${nomPoint(P, b.coup)} (cerclé de vert). C'est une suggestion tirée de ${S.total.toLocaleString('fr-FR')} parties terminées au hasard, pas une certitude.`; rendre(); });
  q('#go-reprendre').addEventListener('click', () => { G.phase = 'jeu'; G.passes = 0; G.mortes = new Set(); G.msg = 'La partie reprend.'; rendre(); if (aLaPage()) penser(); });
  q('#go-valider').addEventListener('click', () => { G.phase = 'fini'; rendre(); });
  q('#go-neuf').addEventListener('click', nouvelle); for (const id of ['#go-n', '#go-mode', '#go-coul', '#go-komi']) q(id).addEventListener('change', nouvelle);
  for (const id of ['#go-libs', '#go-atari']) q(id).addEventListener('change', rendre);
  fenetre.addEventListener('keydown', e => { if (e.altKey || e.ctrlKey || e.metaKey || !G || G.phase !== 'jeu') return; if (e.target && e.target.closest && e.target.closest('input, select, textarea, button, [contenteditable]')) return;
    const r = q('#go-plateau').getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -P.n, ArrowDown: P.n }[e.key], c = G.curseur;
    if (d) { e.preventDefault(); G.clavier = true; if ((d === -1 && c % P.n === 0) || (d === 1 && c % P.n === P.n - 1) || c + d < 0 || c + d >= P.N) { rendre(); return; } G.curseur = c + d; rendre(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); G.clavier = true; clic(G.curseur); }
    else if (e.key === 'p' || e.key === 'P') { q('#go-passer').click(); } });

  // ---------- Vie et mort ----------
  const P9 = plateau(9); let Vp = null;
  q('#gv-pb').innerHTML = FORMES.map((f, i) => `<option value="${i}">${f[0]}</option>`).join('');
  const verdict = (pb, trait) => { const V = vieEtMort(P9, pb.region, pb.cible); return V.tue(pb.col.slice(), trait, false, new Set([V.cle(pb.col)])); };
  ecrire(q('#gv-table'), FORMES.map(f => { const pb = probleme(P9, f[1]); return `<tr><td>${f[0]}</td><td>${verdict(pb, 1) ? 'Noir tue' : 'Blanc vit'}</td><td>${verdict(pb, 2) ? 'Blanc meurt quand même' : 'Blanc vit'}</td></tr>`; }).join(''), true);
  function vmDepart() { const f = FORMES[+q('#gv-pb').value], pb = probleme(P9, f[1]), V = vieEtMort(P9, pb.region, pb.cible);
    Vp = { ...pb, V, nom: f[0], vus: new Set([V.cle(pb.col)]), dernier: -1, conseil: -1, fini: false, msg: '', cl: '', tuable: null, passeB: false };
    if (q('#gv-blanc').checked) { Vp.msg = reponse(true); } Vp.tuable = Vp.V.tue(Vp.col.slice(), 1, Vp.passeB, new Set(Vp.vus)); vmRendre(); }
  // Blanc répond au mieux ; rend la phrase qui décrit son coup.
  function reponse(premier) { const c = Vp.V.coups(Vp.col.slice(), 2, false, new Set(Vp.vus)), bons = c.bons; let p;
    if (!premier && bons.includes(-1)) p = -1; else { const b = bons.filter(x => x >= 0); p = b.length ? b[0] : -1; }
    Vp.passeB = p < 0; if (p < 0) return premier ? (bons.includes(-1) ? 'Blanc n\'a pas besoin de jouer : il passe. À vous.' : 'Blanc ne trouve aucun coup qui le sauve : il passe. À vous de le capturer.') : 'Blanc passe. À vous.';
    P9.poser(Vp.col, p, 2); Vp.vus.add(Vp.V.cle(Vp.col)); Vp.dernier = p; return `Blanc joue en ${nomPoint(P9, p)}. À vous.`; }
  function vmClic(p) { if (Vp.fini || !Vp.region.includes(p)) return; Vp.conseil = -1; Vp.cl = '';
    if (Vp.col[p]) { Vp.msg = 'Cette intersection est occupée.'; vmRendre(); return; } const s = Vp.col.slice();
    if (P9.poser(s, p, 1) < 0) { Vp.msg = 'Coup interdit : cette pierre n\'aurait aucune liberté et ne prendrait rien.'; vmRendre(); return; }
    if (s[Vp.cible] !== 0 && Vp.vus.has(Vp.V.cle(s))) { Vp.msg = 'Coup interdit : il reproduirait une disposition déjà apparue.'; vmRendre(); return; }
    Vp.col = s; Vp.dernier = p; Vp.vus.add(Vp.V.cle(s));
    if (s[Vp.cible] === 0) { Vp.fini = true; Vp.cl = ' gagne'; Vp.msg = 'Le groupe blanc est capturé : il n\'avait pas deux yeux.'; vmRendre(); return; }
    Vp.msg = reponse(false); vmRendre(); }
  function vmRendre() { if (!vivant) return; const pl = q('#gv-plateau'); pl.classList.toggle('fige', Vp.fini);
    ecrire(pl, dessin(P9, Vp.col, { zone: Vp.region, dernier: Vp.dernier, conseil: Vp.conseil }), true);
    const m = q('#gv-message'); m.className = 'jeu-message' + Vp.cl; ecrire(m, Vp.msg || `Espace intérieur : ${Vp.nom}. Noir joue : cliquez dans la zone claire.`); }
  const encore = () => Vp.V.tue(Vp.col.slice(), 1, Vp.passeB, new Set(Vp.vus));
  q('#gv-plateau').addEventListener('click', e => { const c = e.target.closest('.pt'); if (c) vmClic(+c.dataset.p); });
  q('#gv-pb').addEventListener('change', vmDepart); q('#gv-blanc').addEventListener('change', vmDepart); q('#gv-depart').addEventListener('click', vmDepart);
  q('#gv-indice').addEventListener('click', () => { if (Vp.fini) return; const b = Vp.V.coups(Vp.col.slice(), 1, Vp.passeB, new Set(Vp.vus)).bons.filter(x => x >= 0); Vp.cl = '';
    if (b.length) { Vp.conseil = b[0]; Vp.msg = `Vous avez demandé un indice : jouer en ${nomPoint(P9, b[0])} (cerclé de vert) mène à la capture, quoi que réponde Blanc.`; } else { Vp.conseil = -1; Vp.msg = 'Vous avez demandé un indice : dans cette position, aucun coup de Noir ne mène à la capture si Blanc répond bien.'; } vmRendre(); });
  q('#gv-ou').addEventListener('click', () => { if (Vp.fini) return; Vp.cl = ''; Vp.msg = encore() ? 'Vous avez demandé où en est la position : Noir peut encore capturer le groupe, s\'il joue juste.' : 'Vous avez demandé où en est la position : Noir ne peut plus capturer le groupe, si Blanc répond bien. La page a examiné toutes les suites.'; vmRendre(); });
  q('#gv-renoncer').addEventListener('click', () => { if (Vp.fini) return; Vp.fini = true; const maintenant = encore();
    if (!Vp.tuable) { Vp.cl = ' gagne'; Vp.msg = 'Bien vu : ce groupe ne pouvait pas être capturé. La page a examiné toutes les suites de coups, et Blanc a toujours une réponse.'; }
    else if (maintenant) { Vp.cl = ' mieux'; Vp.msg = 'Ce groupe peut pourtant être capturé, et il peut encore l\'être dans cette position. « Revenir au départ » vous laisse chercher, « Un indice » montre le premier coup.'; }
    else { Vp.cl = ' mieux'; Vp.msg = 'Ce groupe vit maintenant, mais il pouvait être capturé au départ : un autre premier coup le tuait. « Revenir au départ » vous laisse le chercher.'; }
    vmRendre(); });

  nouvelle(); vmDepart();
  return () => { vivant = false; jeton++; demonter(); };
}
