// Casse-tête « Polyominos », rubrique Activités, MEMO_atlas_activites.md §135 et §136 : formes à paver par un type, une taille ou une liste de pièces.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .po { display: grid; grid-template-columns: repeat(var(--col), 1fr); width: min(100%, calc(var(--col) * 44px)); touch-action: manipulation; }
.activites-act .po span { aspect-ratio: 1 / 1; }
.activites-act .po button { aspect-ratio: 1 / 1; padding: 0; border-radius: 0; border: 1px solid var(--encre-3); margin: -0.5px; background: var(--surface); cursor: pointer; position: relative; }
.activites-act .po button.pleine { border-color: transparent; }
.activites-act .po button.pleine.h { border-top: 2px solid var(--papier); } .activites-act .po button.pleine.b { border-bottom: 2px solid var(--papier); }
.activites-act .po button.pleine.g { border-left: 2px solid var(--papier); } .activites-act .po button.pleine.d { border-right: 2px solid var(--papier); }
.activites-act .po button.apercu { background: color-mix(in srgb, var(--tan) 45%, var(--surface)); }
.activites-act .po button.refus { background: color-mix(in srgb, var(--sec) 35%, var(--surface)); }
.activites-act .po button.conseil::after { content: ""; position: absolute; inset: 32%; border-radius: 50%; background: var(--tan); }
.activites-act .po-pieces { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 12px 16px; border-top: 1px solid var(--filet); background: var(--papier); }
.activites-act .po-pieces button, .activites-act .po button.pleine { touch-action: none; }
.activites-act .po-but { margin: 0; padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.45 var(--f-ui); color: var(--encre); background: color-mix(in srgb, var(--activites-jeu) 10%, var(--surface)); }
.activites-act .po-but b { color: var(--activites-jeu); }
.activites-act .po-fantome { position: fixed; z-index: 50; pointer-events: none; opacity: .8; }
.activites-act .po-fantome i { position: absolute; border-radius: 3px; box-shadow: inset 0 0 0 1px var(--papier); }
.activites-act .po-pieces button { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 8px; min-width: 54px; border-radius: 8px; border: 1px solid var(--filet); background: var(--surface); color: var(--encre-2); font: 12px var(--f-ui); cursor: pointer; }
.activites-act .po-pieces button[aria-pressed="true"] { border-color: var(--encre); box-shadow: 0 0 0 2px var(--encre); color: var(--encre); }
.activites-act .po-pieces button:disabled { opacity: .3; cursor: default; }
.activites-act .po-pieces svg { width: 46px; height: 46px; }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie va jusqu'en Maths Sup</p>
  <h3>Polyominos</h3>
  <p class="lede">Un polyomino est une pièce faite de carrés collés par leurs côtés : le domino en a deux, les pièces de Tetris quatre. Il faut recouvrir exactement une forme donnée, sans trou ni chevauchement, et le faire <b>avec le moins de pièces possible</b> parmi celles qui sont proposées. La page fabrique les formes et les jeux de pièces ; les mathématiques disent quand un pavage est impossible, et pourquoi.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Pièces <select id="po-mode"></select></label>
    <label>Forme <select id="po-forme"><option value="rect" selected>rectangle</option><option value="trou">rectangle troué</option><option value="esc">escalier</option><option value="croix">croix</option><option value="hasard">forme au hasard</option></select></label>
    <label>Lignes <select id="po-l"></select></label>
    <label>Colonnes <select id="po-c"></select></label>
    <button type="button" class="primary" id="po-neuf">Nouveau casse-tête</button>
  </div>
  <p class="po-but" id="po-but" aria-live="polite"></p>
  <div class="bar"><button type="button" id="po-tourner">Tourner la pièce (touche R)</button><button type="button" id="po-retourner">La retourner (touche F)</button><button type="button" id="po-annuler">Annuler</button><button type="button" id="po-vider">Tout retirer</button><button type="button" id="po-conseil">Une pièce</button></div>
  <div class="jeu-plateau"><div class="po" id="po-plateau" role="group" aria-label="Forme à paver"></div></div>
  <div class="po-pieces" id="po-pieces" role="group" aria-label="Pièces disponibles"></div>
  <div class="jeu-etat"><span>Cases à couvrir : <b id="po-reste">0</b></span><span>Pièces posées : <b id="po-nb">0</b></span><span id="po-info"></span></div>
  <div class="jeu-message" id="po-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p><b>Le but du jeu</b> est de recouvrir toute la forme en utilisant le moins de pièces possible. Les grandes pièces couvrent plus de cases, mais elles se casent mal : tout l'art est de les placer sans laisser de recoins qu'il faudrait boucher une case à la fois. Quand la forme est recouverte, la page annonce votre nombre de pièces et le compare au minimum.</p>
    <p>Faites glisser une pièce de la réserve jusqu'à la forme : l'emplacement s'affiche en vert s'il convient, en orange sinon, et la pièce se pose quand vous la lâchez. Une pièce déjà posée se déplace de la même façon, et retourne à la réserve si vous la lâchez hors de la forme. Pour l'orienter, utilisez « Tourner » et « La retourner », ou les touches R et F, y compris pendant le déplacement.</p>
    <p>On peut aussi jouer sans glisser, à la souris, au doigt ou au clavier : choisissez une pièce dans la réserve, puis cliquez sur une case libre, et la pièce s'y pose de façon à couvrir cette case si c'est possible ; cliquez sur une pièce posée pour la reprendre. Un nouveau clic sur la pièce déjà choisie dans la réserve la tourne d'un quart de tour, comme la touche R.</p>
    <p>Le défi proposé à l'ouverture, « type TFJM² de Marie », met à votre disposition six pièces, à volonté : le monomino, le domino, le tromino droit, le tromino en L, le tétromino en T et le pentomino en X. Avec le monomino, n'importe quelle forme se recouvre ; tout l'intérêt est donc d'y parvenir avec <b>le moins de pièces possible</b>. Une fois la forme recouverte, la page compare votre nombre de pièces au minimum.</p>
    <p>Trois autres sortes de défis : paver avec <b>un seul type</b> de pièce, répété autant qu'il faut ; avec <b>toutes les pièces d'une taille donnée</b>, à volonté ; ou avec <b>une liste</b> de pièces, chacune utilisée une fois. Dans ces trois cas, le nombre de pièces est imposé par l'aire de la forme, et le but est seulement de réussir le pavage. Chaque forme proposée a été pavée par la page avant de vous être soumise : une solution existe toujours.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Combien de pièces ?</h4>
    <p>On compte les polyominos <b>libres</b>, c'est-à-dire à rotation et retournement près. La page les énumère en faisant grandir les pièces case par case, et en ne gardant qu'un représentant de chaque forme.</p>
    <p id="po-compte" aria-live="polite"></p>
    <p>Ces nombres croissent très vite, à peu près comme une suite géométrique, et l'on n'en connaît aucune formule : c'est un problème ouvert. Le mot « polyomino » et l'étude systématique de ces pièces sont dus à Solomon Golomb, à partir de 1953.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Quand l'aire ne suffit pas</h4>
    <p>Pour paver une forme de ${K('N')} cases avec des pièces de ${K('k')} cases, il faut que ${K('k')} divise ${K('N')}. Cette condition est nécessaire, et très loin d'être suffisante. Le coloriage en damier en fournit une seconde.</p>
    <div class="def"><p>Les cinq tétrominos, utilisés chacun une fois, ne peuvent paver aucun rectangle.</p></div>
    <p>Colorions le rectangle en damier. Il a 20 cases, donc ses dimensions sont 4 sur 5, 2 sur 10 ou 1 sur 20, et dans tous les cas 10 cases claires et 10 foncées. Quatre des tétrominos couvrent toujours deux cases de chaque couleur, où qu'on les pose. Le cinquième, en forme de T, en couvre trois d'une couleur et une de l'autre. Les cinq pièces couvrent donc 11 cases d'une couleur et 9 de l'autre : contradiction. C'est pourquoi, pour la liste « les cinq tétrominos », la page ne vous propose jamais un rectangle, mais une forme qu'elle a assemblée elle-même.</p>
    <p>Dans l'autre sens, voici un résultat d'existence, démontré par récurrence.</p>
    <div class="def"><p>Pour tout entier ${K('n \\geqslant 1')}, un carré de côté ${K('2^n')} privé d'une case quelconque peut être pavé par des trominos en L.</p></div>
    <p>Pour ${K('n = 1')}, le carré de côté 2 privé d'une case <em>est</em> un tromino en L. Supposons le résultat vrai au rang ${K('n')} et coupons un carré de côté ${K('2^{n+1}')} en quatre carrés de côté ${K('2^n')}. La case manquante est dans l'un d'eux. Posons un tromino en L au centre, à cheval sur les trois autres : chacun des quatre carrés est alors privé d'exactement une case, et se pave par hypothèse de récurrence. Essayez avec « tromino en L », la forme « rectangle troué » et un carré de côté 8.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Chercher, et compter les solutions</h4>
    <p>Pour s'assurer qu'une forme est pavable, et pour conseiller une pièce, la page cherche : elle prend la première case libre, essaie d'y poser chaque pièce dans chaque orientation, et recommence, en revenant en arrière à chaque impasse. C'est un problème de <b>couverture exacte</b> : choisir des placements de sorte que chaque case soit couverte une fois et une seule.</p>
    <p>Les douze pentominos, qui totalisent 60 cases, pavent les rectangles de 6 sur 10 (2 339 façons), 5 sur 12 (1 010), 4 sur 15 (368) et 3 sur 20 (2 seulement), ainsi que le carré de 8 sur 8 privé du carré central de 2 sur 2 (65 façons). Ces nombres, qui ne comptent qu'une fois les solutions symétriques l'une de l'autre, sont <b>admis ici</b> : ils ont été obtenus par ordinateur, le premier dès 1960 par C. B. et J. Haselgrove, le dernier par Dana Scott en 1958.</p>
  </div>
</section>
` + suite(
  "Croire qu'une forme est pavable dès que son aire est un multiple de la taille des pièces. Le rectangle de 4 sur 5 a 20 cases, les cinq tétrominos aussi, et le pavage est impossible. Un carré de 6 sur 6 a 36 cases, multiple de 4, et ne peut pas être pavé par des tétrominos en T : chaque T couvre un nombre impair de cases claires, il en faudrait neuf, et neuf nombres impairs ne peuvent pas avoir pour somme 18.",
  "Les arguments de coloriage sont ceux des <a href=\"#activites/dominos\">dominos sur l'échiquier</a> et du <a href=\"#activites/solitaire\">solitaire</a>. Dans l'édifice : <a href=\"#n.n-recurrence\">Principe de récurrence</a>, pour le pavage par trominos, et <a href=\"#rel.r-injections\">Injections, surjections, bijections</a>. Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> fournit les décomptes.",
  "Les polyominos sont énumérés par croissance, avec une forme normale sous les huit symétries du carré. Chaque casse-tête proposé a été résolu par la page avant d'être affiché ; si la forme demandée n'est pas pavable avec les pièces choisies, la page le dit et construit à la place une forme de même aire par assemblage de pièces. Pour le défi « le moins de pièces possible », le minimum est obtenu par une recherche qui abandonne une piste dès qu'elle ne peut plus battre le meilleur pavage connu ; quand elle va au bout, le minimum est démontré, sinon la page dit qu'elle n'a pas pu conclure. La recherche d'un pavage est limitée à 600 000 placements examinés et distingue trois réponses : pavage trouvé, aucun pavage, recherche non aboutie. Rien n'est enregistré ni envoyé.");

// ------------------------------------------------------------------ pièces
const norm = c => { const r0 = Math.min(...c.map(x => x[0])), c0 = Math.min(...c.map(x => x[1])); return c.map(([r, k]) => [r - r0, k - c0]).sort((a, b) => a[0] - b[0] || a[1] - b[1]); };
const cle = c => c.map(x => x.join(',')).join(';');
function orientations(c) { const o = new Map(); let p = c; for (let m = 0; m < 2; m++) { for (let r = 0; r < 4; r++) { p = norm(p.map(([a, b]) => [b, -a])); o.set(cle(p), p); } p = norm(p.map(([a, b]) => [a, -b])); } return [...o.values()]; }
const canon = c => orientations(c).map(cle).sort()[0];
const LIBRES = [null]; (() => { let cur = new Map([[canon([[0, 0]]), norm([[0, 0]])]]); LIBRES.push([...cur.values()]);
  for (let k = 2; k <= 7; k++) { const nx = new Map(); for (const p of cur.values()) { const s = new Set(p.map(x => x.join(','))); for (const [r, c] of p) for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const q = [r + dr, c + dc]; if (s.has(q.join(','))) continue; const np = p.concat([q]), id = canon(np); if (!nx.has(id)) nx.set(id, orientations(np).find(o => cle(o) === id)); } } cur = nx; LIBRES.push([...cur.values()]); } })();
const P = t => norm(t.trim().split('/').flatMap((l, r) => [...l].map((ch, c) => ch === '#' ? [r, c] : null).filter(Boolean)));
const TYPES = [['domino', '##'], ['tromino droit', '###'], ['tromino en L', '#./##'], ['tétromino droit', '####'], ['tétromino carré', '##/##'], ['tétromino en T', '###/.#.'], ['tétromino en L', '#./#./##'], ['tétromino en S', '.##/##.'], ['pentomino en L', '#./#./#./##'], ['pentomino en P', '##/##/#.'], ['pentomino en U', '#.#/###']];
const MODES = [
  { id: 'tfjm', nom: '★ type TFJM² de Marie', groupe: 'À la une', pieces: ['#', '##', '###', '#./##', '###/.#.', '.#./###/.#.'].map(P), illimite: true, moins: true },
  ...TYPES.map(([nom, t]) => ({ id: 'type:' + nom, nom: nom, groupe: 'Un seul type de pièce', pieces: [P(t)], illimite: true })),
  { id: 'taille:3', nom: 'tous les trominos', groupe: 'Toutes les pièces d\'une taille, à volonté', pieces: LIBRES[3], illimite: true }, { id: 'taille:4', nom: 'tous les tétrominos', groupe: 'Toutes les pièces d\'une taille, à volonté', pieces: LIBRES[4], illimite: true }, { id: 'taille:5', nom: 'tous les pentominos', groupe: 'Toutes les pièces d\'une taille, à volonté', pieces: LIBRES[5], illimite: true },
  { id: 'liste:t4', nom: 'les cinq tétrominos', groupe: 'Une liste, chaque pièce une fois', pieces: LIBRES[4], illimite: false, aire: 20, dims: [4, 5] },
  { id: 'liste:t4x2', nom: 'deux jeux de tétrominos', groupe: 'Une liste, chaque pièce une fois', pieces: LIBRES[4].concat(LIBRES[4]), illimite: false, aire: 40, dims: [5, 8] },
  { id: 'liste:p5', nom: 'les douze pentominos', groupe: 'Une liste, chaque pièce une fois', pieces: LIBRES[5], illimite: false, aire: 60, dims: [6, 10] },
  { id: 'liste:p5m', nom: 'six pentominos au hasard', groupe: 'Une liste, chaque pièce une fois', pieces: null, illimite: false, aire: 30, dims: [5, 6] },
];
const COUL = ['var(--mark)', 'var(--sec)', 'var(--tan)', 'var(--semi)', 'var(--activites-jeu)', '#b58900', '#d33682', '#6c71c4', '#859900', '#cb4b16', '#2aa198', '#93a1a1'];

// Recherche d'un pavage : cases = Set d'indices r·C + c ; types = [{o: orientations, reste}] ; rend la liste des placements, null ou undefined (budget).
function paver(cases, C, types, budget = 600000, hasard = false) { const libre = new Set(cases), ordre = [...cases].sort((a, b) => a - b), sol = []; let n = 0, depasse = false;
  const f = () => { let premier = -1; for (const i of ordre) if (libre.has(i)) { premier = i; break; } if (premier < 0) return true; if (++n > budget) { depasse = true; return false; }
    const r0 = Math.floor(premier / C), c0 = premier % C, idx = types.map((_, k) => k); if (hasard) idx.sort(() => Math.random() - 0.5); const vus = new Set();
    for (const k of idx) { const t = types[k]; if (t.reste <= 0 || vus.has(t.cle)) continue; vus.add(t.cle);
      for (const o of t.o) { const a = o[0], pl = []; let ok = true; for (const [r, c] of o) { const rr = r0 + r - a[0], cc = c0 + c - a[1]; if (cc < 0 || cc >= C || !libre.has(rr * C + cc)) { ok = false; break; } pl.push(rr * C + cc); } if (!ok) continue;
        pl.forEach(i => libre.delete(i)); t.reste--; sol.push({ k, cases: pl }); if (f()) return true; if (depasse) return false; sol.pop(); t.reste++; pl.forEach(i => libre.add(i)); } }
    return false; };
  const ok = f(); return ok ? sol : depasse ? undefined : null; }

// Plus petit nombre de pièces d'un pavage : recherche en profondeur, élaguée dès que (pièces posées) + ⌈cases restantes / plus grande taille⌉
// atteint le meilleur connu. Rend { m, prouve } : prouve est faux si la limite de recherche a été atteinte.
function minimum(cases, C, types, budget = 400000) { const libre = new Set(cases), ordre = [...cases].sort((a, b) => a - b), T = types.slice().sort((a, b) => b.o[0].length - a.o[0].length), gmax = T[0].o[0].length; let meilleur = Infinity, n = 0, depasse = false;
  const f = (posees, reste) => { if (reste === 0) { if (posees < meilleur) meilleur = posees; return; } if (posees + Math.ceil(reste / gmax) >= meilleur) return; if (++n > budget) { depasse = true; return; }
    let premier = -1; for (const i of ordre) if (libre.has(i)) { premier = i; break; } const r0 = Math.floor(premier / C), c0 = premier % C;
    for (const t of T) for (const o of t.o) { const a = o[0], pl = []; let ok = true; for (const [r, c] of o) { const rr = r0 + r - a[0], cc = c0 + c - a[1]; if (cc < 0 || cc >= C || !libre.has(rr * C + cc)) { ok = false; break; } pl.push(rr * C + cc); } if (!ok) continue;
      pl.forEach(i => libre.delete(i)); f(posees + 1, reste - pl.length); pl.forEach(i => libre.add(i)); if (depasse) return; } };
  f(0, libre.size); return { m: meilleur, prouve: !depasse }; }

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let L = 6, C = 6, cases = new Set(), types = [], poses = [], hist = [], sel = 0, ori = 0, survol = -1, conseil = [], conseilPose = null, glisse = null, mini = null, modeCourant = null, msg = '', info = '', vivant = true;
  { const G = new Map(); MODES.forEach(m => { if (!G.has(m.groupe)) { const og = document.createElement('optgroup'); og.label = m.groupe; G.set(m.groupe, og); q('#po-mode').append(og); } const o = document.createElement('option'); o.value = m.id; o.textContent = m.nom; G.get(m.groupe).append(o); }); } q('#po-mode').value = 'tfjm';
  for (const id of ['#po-l', '#po-c']) for (let k = 2; k <= 12; k++) { const o = document.createElement('option'); o.textContent = k; q(id).append(o); } q('#po-l').value = 5; q('#po-c').value = 6;
  const occupe = () => { const m = new Map(); poses.forEach((p, k) => p.cases.forEach(i => m.set(i, k))); return m; };
  const restes = () => types.map((t, k) => t.illimite ? Infinity : t.nb - poses.filter(p => p.k === k).length);
  // emplacement de la pièce choisie couvrant la case i : premier placement légal parmi les ancrages possibles
  function emplacement(i, occ) { const t = types[sel]; if (!t) return null; const o = t.o[ori % t.o.length], r0 = Math.floor(i / C), c0 = i % C;
    for (const a of o) { const pl = []; let ok = true; for (const [r, c] of o) { const rr = r0 + r - a[0], cc = c0 + c - a[1]; if (rr < 0 || rr >= L || cc < 0 || cc >= C || !cases.has(rr * C + cc) || occ.has(rr * C + cc)) { ok = false; break; } pl.push(rr * C + cc); } if (ok) return pl; } return null; }
  // emplacement d'une pièce (type k, orientation o) dont la case d'indice anc est posée sur la case i
  function emplacementAncre(i, k, o, anc, occ) { const t = types[k]; if (!t || i < 0) return null; const cs = t.o[o % t.o.length], a = cs[anc] || cs[0], r0 = Math.floor(i / C), c0 = i % C, pl = [];
    for (const [r, c] of cs) { const rr = r0 + r - a[0], cc = c0 + c - a[1]; if (rr < 0 || rr >= L || cc < 0 || cc >= C || !cases.has(rr * C + cc) || occ.has(rr * C + cc)) return null; pl.push(rr * C + cc); } return pl; }
  function gabarit(forme) { const s = new Set(), tout = () => { for (let i = 0; i < L * C; i++) s.add(i); };
    if (forme === 'rect') tout();
    else if (forme === 'trou') { tout(); if (types[0] && types[0].o[0].length === 3 && L === C && (L & (L - 1)) === 0) s.delete(Math.floor(Math.random() * L * C)); else { const kk = types[0] ? types[0].o[0].length : 1, h0 = Math.max(1, Math.floor(L / 3)), w0 = Math.max(1, Math.floor(C / 3)); let h = h0, w = w0;   // trou dont l'aire laisse un multiple de la taille des pièces, si possible
      choix: for (const dh of [0, 1, -1, 2]) for (const dw of [0, 1, -1, 2]) { const hh = h0 + dh, ww = w0 + dw; if (hh >= 1 && ww >= 1 && hh <= L - 2 && ww <= C - 2 && (L * C - hh * ww) % kk === 0) { h = hh; w = ww; break choix; } }
      const r0 = Math.floor((L - h) / 2), c0 = Math.floor((C - w) / 2); for (let r = r0; r < r0 + h; r++) for (let c = c0; c < c0 + w; c++) s.delete(r * C + c); } }
    else if (forme === 'esc') { for (let r = 0; r < L; r++) for (let c = 0; c < C; c++) if (c <= Math.floor((r + 1) * C / L) - 1 || r === L - 1) s.add(r * C + c); }
    else if (forme === 'croix') { const a = Math.max(1, Math.floor(L / 3)), b = Math.max(1, Math.floor(C / 3)); for (let r = 0; r < L; r++) for (let c = 0; c < C; c++) if ((r >= a && r < L - a) || (c >= b && c < C - b)) s.add(r * C + c); }
    return s; }
  // forme construite par assemblage de pièces dans le cadre L × C, jusqu'à l'aire visée : pavable par construction
  function assembler(aire) { for (let essai = 0; essai < 60; essai++) { const s = new Set(), R = types.map(t => t.illimite ? Infinity : t.nb); let ok = true;
      while (s.size < aire && ok) { const ks = types.map((_, k) => k).filter(k => R[k] > 0).sort(() => Math.random() - 0.5); let pose = false;
        for (const k of ks) { const os = types[k].o.slice().sort(() => Math.random() - 0.5); const front = s.size ? [...s].flatMap(i => [i - C, i + C, i % C ? i - 1 : -1, i % C < C - 1 ? i + 1 : -1]).filter(i => i >= 0 && i < L * C && !s.has(i)).sort(() => Math.random() - 0.5) : [Math.floor(L / 2) * C + Math.floor(C / 2)];
          for (const i of front.slice(0, 24)) { for (const o of os) { for (const a of o) { const pl = []; let v = true; for (const [r, c] of o) { const rr = Math.floor(i / C) + r - a[0], cc = i % C + c - a[1]; if (rr < 0 || rr >= L || cc < 0 || cc >= C || s.has(rr * C + cc)) { v = false; break; } pl.push(rr * C + cc); } if (v) { pl.forEach(x => s.add(x)); R[k]--; pose = true; break; } } if (pose) break; } if (pose) break; } if (pose) break; }
        if (!pose) ok = false; }
      if (ok && s.size === aire) return s; } return null; }
  function nouveau() { const m = MODES.find(x => x.id === q('#po-mode').value), forme = q('#po-forme').value, sur = true; L = +q('#po-l').value; C = +q('#po-c').value;
    let pieces = m.pieces; if (m.id === 'liste:p5m') pieces = LIBRES[5].slice().sort(() => Math.random() - 0.5).slice(0, 6);
    const groupes = new Map(); pieces.forEach(p => { const id = canon(p); if (!groupes.has(id)) groupes.set(id, { cle: id, o: orientations(p), nb: 0, illimite: m.illimite }); groupes.get(id).nb++; });
    types = [...groupes.values()]; const k = types[0].o[0].length, aireListe = m.illimite ? null : pieces.length * k;
    poses = []; hist = []; sel = 0; ori = 0; conseil = []; msg = ''; info = '';
    let g = forme === 'hasard' ? null : gabarit(forme), raison = '';
    if (g && aireListe !== null && g.size !== aireListe) { raison = `La liste de pièces couvre ${aireListe} cases et la forme demandée en a ${g.size} : essayez par exemple ${m.dims[0]} lignes et ${m.dims[1]} colonnes.`; g = null; }
    else if (g && g.size % k) { raison = `La forme demandée a ${g.size} cases, qui n'est pas un multiple de ${k}.`; if (sur) g = null; }
    if (g && sur) { const r = paver(g, C, types.map(t => ({ ...t, reste: t.illimite ? Infinity : t.nb })), 400000, true); if (r === null) { raison = 'La page a cherché tous les pavages de la forme demandée avec ces pièces : il n\'y en a aucun.'; g = null; } else if (r === undefined) { raison = 'La page n\'a pas su décider en un temps raisonnable si la forme demandée est pavable.'; g = null; } }
    if (!g) { const aire = aireListe !== null ? aireListe : Math.max(k, Math.floor(L * C * (forme === 'hasard' ? 0.62 : 0.8) / k) * k); g = assembler(Math.min(aire, Math.floor(L * C / k) * k));
      if (!g && L < 12 && C < 12) { L = Math.min(12, L + 2); C = Math.min(12, C + 2); q('#po-l').value = L; q('#po-c').value = C; g = assembler(aire); if (g) raison += ' Le cadre a été agrandi pour laisser de la place.'; }
      if (!g) { g = gabarit('rect'); info = (raison ? raison + ' ' : '') + 'Le cadre est trop petit pour y assembler ces pièces : agrandissez-le. La forme affichée n\'est pas garantie.'; }
      else info = (raison ? raison + ' La page a donc construit une autre forme, par assemblage des pièces.' : 'Forme construite par assemblage des pièces : elle est pavable par construction.'); }
    else info = sur ? 'La page a trouvé un pavage de cette forme avant de vous la proposer.' : (raison || 'Rien ne garantit que cette forme soit pavable.');
    cases = g; modeCourant = m; mini = m.moins ? minimum(cases, C, types.map(t => ({ o: t.o }))) : null; rendre(); }
  const svg = (o, coul) => { const h = Math.max(...o.map(x => x[0])) + 1, w = Math.max(...o.map(x => x[1])) + 1, u = 46 / Math.max(h, w, 3); return `<svg viewBox="0 0 46 46" aria-hidden="true">${o.map(([r, c]) => `<rect x="${((46 - w * u) / 2 + c * u + .6).toFixed(1)}" y="${((46 - h * u) / 2 + r * u + .6).toFixed(1)}" width="${(u - 1.2).toFixed(1)}" height="${(u - 1.2).toFixed(1)}" rx="1.5" fill="${coul}"/>`).join('')}</svg>`; };
  function rendre() {
    if (!vivant) return;
    const G = q('#po-plateau'), clef = L + 'x' + C + ':' + [...cases].sort((a, b) => a - b).join(','); G.style.setProperty('--col', C);
    if (G.dataset.t !== clef) { G.dataset.t = clef; G.innerHTML = ''; for (let i = 0; i < L * C; i++) { if (!cases.has(i)) { G.append(document.createElement('span')); continue; } const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; G.append(b); } }
    const occ = occupe(), R = restes(), ap = glisse && glisse.bouge ? emplacementAncre(survol, glisse.k, glisse.o, glisse.anc, occ) : survol >= 0 && !occ.has(survol) ? emplacement(survol, occ) : null;
    G.querySelectorAll('button').forEach(b => { const i = +b.dataset.i, k = occ.get(i); let c = '';
      if (k !== undefined) { const m = j => occ.get(j) === k; c = 'pleine' + (!m(i - C) ? ' h' : '') + (!m(i + C) ? ' b' : '') + (i % C === 0 || !m(i - 1) ? ' g' : '') + (i % C === C - 1 || !m(i + 1) ? ' d' : ''); b.style.background = COUL[(poses[k].k + (types.length === 1 ? k : 0)) % COUL.length]; } else { b.style.background = ''; if (ap && ap.includes(i)) c = 'apercu'; else if (survol === i && !ap && (!glisse || glisse.bouge)) c = 'refus'; }
      if (conseil.includes(i)) c += ' conseil'; b.className = c; b.setAttribute('aria-label', `Ligne ${Math.floor(i / C) + 1}, colonne ${i % C + 1} : ${k !== undefined ? 'couverte' : 'libre'}`); });
    const Pc = q('#po-pieces'), hp = types.map((t, k) => `<button type="button" data-k="${k}" aria-pressed="${k === sel}"${R[k] <= 0 ? ' disabled' : ''} aria-label="Pièce ${k + 1}">${svg(k === sel ? t.o[ori % t.o.length] : t.o[0], COUL[k % COUL.length])}<span>${t.illimite ? 'à volonté' : 'reste ' + R[k]}</span></button>`).join(''); if (Pc.dataset.h !== hp && !(glisse && glisse.bouge)) { Pc.dataset.h = hp; Pc.innerHTML = hp; }   // pas de reconstruction pendant un déplacement : l'élément saisi doit rester en place
    const reste = cases.size - occ.size, gagne = reste === 0; let jouable = false;
    if (!gagne) { const sv = sel, so = ori; outer: for (let k = 0; k < types.length; k++) { if (R[k] <= 0) continue; sel = k; for (let o = 0; o < types[k].o.length; o++) { ori = o; for (const i of cases) if (!occ.has(i) && emplacement(i, occ)) { jouable = true; break outer; } } } sel = sv; ori = so; }
    ecrire(q('#po-reste'), entier(reste)); ecrire(q('#po-nb'), entier(poses.length)); ecrire(q('#po-info'), info);
    ecrire(q('#po-but'), modeCourant && modeCourant.moins ? '<b>But du jeu :</b> recouvrir toute la forme, sans trou ni chevauchement, en utilisant <b>le moins de pièces possible</b>. Les six pièces sont disponibles à volonté.' : modeCourant && !modeCourant.illimite ? '<b>But du jeu :</b> recouvrir toute la forme, sans trou ni chevauchement, en utilisant chaque pièce de la réserve une fois.' : '<b>But du jeu :</b> recouvrir toute la forme, sans trou ni chevauchement, avec les pièces de la réserve, disponibles à volonté.', true);
    q('#po-annuler').disabled = !hist.length; q('#po-vider').disabled = !poses.length; q('#po-conseil').disabled = gagne;
    const m = q('#po-message'); m.className = 'jeu-message' + (gagne ? (mini && poses.length > mini.m ? ' mieux' : ' gagne') : !jouable ? ' bloque' : '');
    ecrire(m, gagne ? (mini ? (poses.length <= mini.m ? `Réussi, avec ${poses.length} pièces : ${mini.prouve ? 'c\'est le minimum possible, la page l\'a vérifié en examinant tous les pavages' : 'la page n\'a pas trouvé mieux, sans avoir pu examiner tous les pavages'}.` : `La forme est recouverte, avec ${poses.length} pièces. ${mini.prouve ? `Le minimum possible est de ${mini.m} pièces` : `La page a trouvé un pavage en ${mini.m} pièces, sans avoir pu vérifier que c'est le minimum`} : reprenez des pièces et essayez d'en utiliser moins.`) : `Réussi : la forme est pavée par ${poses.length} pièces.`) : !jouable ? `Plus aucune pièce ne peut être posée, et il reste ${reste} case${reste > 1 ? 's' : ''} à couvrir. Reprenez des pièces.` : msg || (poses.length ? 'Continuez.' : 'Faites glisser une pièce sur la forme, ou choisissez-la puis cliquez sur une case. Les touches R et F la tournent et la retournent.'));
    let t = ''; for (let k = 1; k <= 7; k++) t += `${k === 1 ? '' : k === 7 ? ' et ' : ', '}${LIBRES[k].length} de ${k} case${k > 1 ? 's' : ''}`;
    ecrire(q('#po-compte'), `Résultat de l'énumération faite par la page : ${t}. Les cinq pièces de 4 cases sont les tétrominos, les douze de 5 cases les pentominos.`);
  }
  q('#po-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i, occ = occupe(), cp = conseilPose; conseil = []; conseilPose = null; msg = '';
    if (cp && cp.cases.includes(i) && cp.cases.every(x => !occ.has(x))) { hist.push(poses.slice()); poses.push({ k: cp.k, cases: cp.cases }); const R2 = restes(); if (R2[sel] <= 0) { const s2 = R2.findIndex(x => x > 0); if (s2 >= 0) { sel = s2; ori = 0; } } rendre(); return; }
    if (occ.has(i)) { hist.push(poses.slice()); const k = occ.get(i); sel = poses[k].k; poses.splice(k, 1); ori = 0; }
    else { const pl = emplacement(i, occ); if (pl && restes()[sel] > 0) { hist.push(poses.slice()); poses.push({ k: sel, cases: pl }); if (restes()[sel] <= 0) { const s = restes().findIndex(x => x > 0); if (s >= 0) { sel = s; ori = 0; } } } else msg = restes()[sel] > 0 ? 'La pièce ne tient pas ici dans cette orientation : tournez-la, ou choisissez une autre case.' : 'Il ne reste plus d\'exemplaire de cette pièce.'; }
    rendre(); });
  // Glisser-déposer : depuis la réserve ou depuis le plateau. Un simple clic (sans déplacement) garde son rôle.
  const fantome = document.createElement('div'); fantome.className = 'po-fantome'; fantome.hidden = true; racine.append(fantome);
  function dessinerFantome(x, y) { const b = q('#po-plateau button'), u = b ? b.getBoundingClientRect().width : 36, cs = types[glisse.k].o[glisse.o % types[glisse.k].o.length], a = cs[glisse.anc] || cs[0];
    fantome.innerHTML = cs.map(([r, c]) => `<i style="left:${(c - a[1] - .5) * u}px;top:${(r - a[0] - .5) * u}px;width:${u}px;height:${u}px;background:${COUL[glisse.k % COUL.length]}"></i>`).join(''); fantome.style.left = x + 'px'; fantome.style.top = y + 'px'; fantome.hidden = false; }
  const caseSous = (x, y) => { const el = document.elementFromPoint(x, y), b = el && el.closest ? el.closest('#po-plateau button[data-i]') : null; return b && racine.contains(b) ? +b.dataset.i : -1; };
  function debutGlisse(e) { if (e.button) return; const bp = e.target.closest('#po-pieces button[data-k]'), bc = e.target.closest('#po-plateau button.pleine');
    if (bp && !bp.disabled) { const k = +bp.dataset.k, o = k === sel ? ori : 0, cs = types[k].o[o % types[k].o.length]; let anc = 0, best = 1e9; const mr = cs.reduce((a, x) => a + x[0], 0) / cs.length, mc = cs.reduce((a, x) => a + x[1], 0) / cs.length; cs.forEach((x, n) => { const d = (x[0] - mr) ** 2 + (x[1] - mc) ** 2; if (d < best) { best = d; anc = n; } });
      glisse = { k, o, anc, x0: e.clientX, y0: e.clientY, bouge: false, depuis: -1 }; }
    else if (bc) { const i = +bc.dataset.i, occ = occupe(), n = occ.get(i), p = poses[n], t = types[p.k], rc = p.cases.map(x => [Math.floor(x / C), x % C]), nm = norm(rc), o = t.o.findIndex(x => cle(x) === cle(nm)), r0 = Math.min(...rc.map(x => x[0])), c0 = Math.min(...rc.map(x => x[1]));
      const anc = nm.findIndex(x => x[0] === Math.floor(i / C) - r0 && x[1] === i % C - c0); glisse = { k: p.k, o: Math.max(0, o), anc: Math.max(0, anc), x0: e.clientX, y0: e.clientY, bouge: false, depuis: n }; }
  }
  function suiteGlisse(e) { if (!glisse) return; if (!glisse.bouge) { if (Math.hypot(e.clientX - glisse.x0, e.clientY - glisse.y0) < 7) return; glisse.bouge = true; conseil = []; conseilPose = null; msg = '';
      if (glisse.depuis >= 0) { hist.push(poses.slice()); poses.splice(glisse.depuis, 1); } sel = glisse.k; ori = glisse.o; }
    e.preventDefault(); glisse.x = e.clientX; glisse.y = e.clientY; const i = caseSous(e.clientX, e.clientY); dessinerFantome(e.clientX, e.clientY); if (i !== survol) { survol = i; rendre(); } }
  function finGlisse(e) { if (!glisse) return; const gl = glisse; glisse = null; fantome.hidden = true; if (!gl.bouge) return;   // simple clic : les écouteurs de clic s'en chargent
    const i = caseSous(e.clientX, e.clientY), occ = occupe(), pl = emplacementAncre(i, gl.k, gl.o, gl.anc, occ); survol = -1; clicAnnule = true; setTimeout(() => { clicAnnule = false; }, 0);
    if (pl && restes()[gl.k] > 0) { if (gl.depuis < 0) hist.push(poses.slice()); poses.push({ k: gl.k, cases: pl }); const R2 = restes(); if (R2[sel] <= 0) { const s2 = R2.findIndex(x => x > 0); if (s2 >= 0) { sel = s2; ori = 0; } } }
    else msg = gl.depuis >= 0 ? 'La pièce est retournée à la réserve.' : i >= 0 ? 'La pièce ne tient pas à cet endroit dans cette orientation.' : '';
    rendre(); }
  let clicAnnule = false;
  racine.addEventListener('pointerdown', debutGlisse); document.addEventListener('pointermove', suiteGlisse, { passive: false }); document.addEventListener('pointerup', finGlisse); document.addEventListener('pointercancel', finGlisse);
  racine.addEventListener('click', e => { if (clicAnnule) { e.stopPropagation(); e.preventDefault(); } }, true);
  q('#po-plateau').addEventListener('pointermove', e => { if (glisse) return; const b = e.target.closest && e.target.closest('button[data-i]'); const i = b ? +b.dataset.i : -1; if (i !== survol && e.pointerType === 'mouse') { survol = i; rendre(); } });
  q('#po-plateau').addEventListener('pointerleave', () => { if (survol >= 0) { survol = -1; rendre(); } });
  q('#po-pieces').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b || b.disabled) return; const k = +b.dataset.k; if (k === sel) { tourner(); return; }   // un nouveau clic sur la pièce choisie la tourne d'un quart de tour, comme la touche R
    sel = k; ori = 0; rendre(); });
  const garderAncre = (avant, apres, f) => { if (!glisse) return; const a = avant[glisse.anc] || avant[0], img = f(a), brut = avant.map(f), r0 = Math.min(...brut.map(x => x[0])), c0 = Math.min(...brut.map(x => x[1])); glisse.anc = Math.max(0, apres.findIndex(x => x[0] === img[0] - r0 && x[1] === img[1] - c0)); glisse.o = ori; };
  const tourner = () => { const t = types[sel], o = t.o[ori % t.o.length], f = ([a, b]) => [b, -a], c = cle(norm(o.map(f))); ori = t.o.findIndex(x => cle(x) === c); garderAncre(o, t.o[ori], f); if (glisse && glisse.bouge) dessinerFantome(glisse.x, glisse.y); rendre(); };
  const retourner = () => { const t = types[sel], o = t.o[ori % t.o.length], f = ([a, b]) => [a, -b], c = cle(norm(o.map(f))); ori = t.o.findIndex(x => cle(x) === c); garderAncre(o, t.o[ori], f); if (glisse && glisse.bouge) dessinerFantome(glisse.x, glisse.y); rendre(); };
  q('#po-tourner').addEventListener('click', tourner); q('#po-retourner').addEventListener('click', retourner);
  q('#po-annuler').addEventListener('click', () => { const h = hist.pop(); if (h) { poses = h; conseil = []; msg = ''; rendre(); } });
  q('#po-vider').addEventListener('click', () => { hist.push(poses.slice()); poses = []; conseil = []; msg = ''; rendre(); });
  const chercher = depuisVide => { const occ = depuisVide ? new Map() : occupe(), libres = new Set([...cases].filter(i => !occ.has(i))), R = depuisVide ? types.map(t => t.illimite ? Infinity : t.nb) : restes(); return paver(libres, C, types.map((t, k) => ({ ...t, reste: R[k] }))); };
  q('#po-conseil').addEventListener('click', () => { const r = chercher(false);
    if (r && r.length) { const p = r[0]; conseil = p.cases; conseilPose = p; sel = p.k; msg = 'Une pièce de la réserve peut couvrir les cases marquées d\'un point vert, sans fermer la porte : cliquez sur l\'une d\'elles pour la poser ainsi.'; }
    else if (r === null) { conseil = []; msg = 'Vous avez demandé de l\'aide : la page a examiné toutes les façons de continuer, et aucune ne termine le pavage. Reprenez des pièces.'; }
    else { conseil = []; msg = 'Vous avez demandé de l\'aide : la recherche n\'a pas abouti dans sa limite. Elle ne permet de conclure ni dans un sens ni dans l\'autre.'; } rendre(); });
  for (const id of ['#po-mode', '#po-forme', '#po-l', '#po-c']) q(id).addEventListener('change', () => { if (id === '#po-mode') { const m = MODES.find(x => x.id === q('#po-mode').value); if (m.dims) { q('#po-l').value = m.dims[0]; q('#po-c').value = m.dims[1]; } } nouveau(); });
  q('#po-neuf').addEventListener('click', nouveau);
  const touche = e => { if (e.altKey || e.ctrlKey || e.metaKey || (e.target.closest && e.target.closest('input, select, textarea'))) return; if (e.key === 'r' || e.key === 'R') tourner(); else if (e.key === 'f' || e.key === 'F') retourner(); };
  document.addEventListener('keydown', touche);
  nouveau();
  return () => { vivant = false; document.removeEventListener('keydown', touche); document.removeEventListener('pointermove', suiteGlisse); document.removeEventListener('pointerup', finGlisse); document.removeEventListener('pointercancel', finGlisse); };
}
