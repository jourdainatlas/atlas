// Casse-tête « Le solitaire », rubrique Activités, MEMO_atlas_activites.md §133.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .so { display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; width: min(100%, 392px); }
.activites-act .so span { aspect-ratio: 1 / 1; }
.activites-act .so button { aspect-ratio: 1 / 1; padding: 0; border-radius: 50%; border: 2px solid var(--encre-3); background: var(--papier); cursor: pointer; position: relative; }
.activites-act .so button.pion::after { content: ""; position: absolute; inset: 14%; border-radius: 50%; background: var(--activites-jeu); }
.activites-act .so button.pris { border-color: var(--sec); box-shadow: 0 0 0 3px color-mix(in srgb, var(--sec) 35%, transparent); }
.activites-act .so button.cible { border-color: var(--tan); border-style: dashed; box-shadow: 0 0 0 3px color-mix(in srgb, var(--tan) 30%, transparent); }
.activites-act .so button.arrivee::before { content: ""; position: absolute; inset: -6px; border-radius: 50%; border: 2px dotted var(--tan); }
.activites-act .so button.conseil { box-shadow: 0 0 0 4px color-mix(in srgb, var(--tan) 60%, transparent); }
/* Coloriage affiché : le pion lui-même prend la couleur de son trou (bleu, orange, vert), le trou vide en garde le contour. */
.activites-act .so.teintes button.t0 { border-color: var(--mark); background: color-mix(in srgb, var(--mark) 16%, var(--papier)); }
.activites-act .so.teintes button.t1 { border-color: var(--sec); background: color-mix(in srgb, var(--sec) 16%, var(--papier)); }
.activites-act .so.teintes button.t2 { border-color: var(--tan); background: color-mix(in srgb, var(--tan) 16%, var(--papier)); }
.activites-act .so.teintes button.t0.pion::after { background: var(--mark); }
.activites-act .so.teintes button.t1.pion::after { background: var(--sec); }
.activites-act .so.teintes button.t2.pion::after { background: var(--tan); }
.activites-act .so-puce { display: inline-block; width: .8em; height: .8em; border-radius: 50%; margin: 0 .25em 0 .7em; vertical-align: -.05em; }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible dès la Première</p>
  <h3>Le solitaire</h3>
  <p class="lede">Un pion saute par-dessus son voisin, qui est retiré. Il faut n'en laisser qu'un. Le jeu est difficile ; mais savoir <em>où</em> le dernier pion peut finir, et pourquoi le plateau français ne peut pas être vidé en partant du centre, ne demande que trois couleurs et un peu de parité.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Plateau <select id="so-plateau"><option value="0" selected>anglais (33 trous)</option><option value="1">français (37 trous)</option></select></label>
    <button type="button" class="primary" id="so-debut">Recommencer</button>
    <button type="button" id="so-annuler">Annuler un coup</button>
    <button type="button" id="so-vide">Changer le trou vide de départ</button>
    <button type="button" id="so-conseil">Un coup</button>
    <label><input type="checkbox" id="so-teintes"> montrer les trois couleurs</label>
    <label><input type="checkbox" id="so-arrivees"> montrer où le dernier pion peut finir</label>
  </div>
  <div class="jeu-plateau"><div class="so" id="so-grille" role="group" aria-label="Plateau du solitaire"></div></div>
  <div class="jeu-etat"><span>Pions : <b id="so-nb">0</b></span><span>Coups : <b id="so-coups">0</b></span><span id="so-coul"></span></div>
  <div class="jeu-message" id="so-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Un pion peut sauter par-dessus un pion voisin, horizontalement ou verticalement, si le trou situé juste derrière est libre ; le pion sauté est retiré. Cliquez sur un pion : s'il n'a qu'un saut possible, il le fait ; sinon, cliquez sur l'un des trous d'arrivée, entourés de tirets verts. La partie est gagnée quand il ne reste qu'un pion.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Trois couleurs et une parité</h4>
    <p>Cochez « montrer les trois couleurs ». Les trous sont coloriés en diagonale, en bleu, en orange et en vert, et chaque pion prend la couleur du trou qu'il occupe, de sorte que trois trous alignés et consécutifs portent toujours les trois couleurs. Un saut met en jeu trois trous consécutifs : il retire un pion de deux couleurs et en ajoute un sur la troisième. Les nombres de pions sur chaque couleur, affichés sous le plateau, changent donc tous les trois d'une unité à chaque coup.</p>
    <div class="def"><p>À chaque coup, les trois nombres de pions par couleur changent tous de parité. Deux d'entre eux qui avaient la même parité la gardent donc pour toujours ; deux qui avaient des parités différentes aussi.</p></div>
    <p>S'il ne reste qu'un pion, les trois nombres sont 1, 0 et 0 : un impair et deux pairs. Il faut donc qu'au départ, la couleur du dernier pion soit la seule de sa parité. Cela désigne une couleur, donc une diagonale sur trois. En recommençant avec le coloriage selon l'autre diagonale, on obtient une seconde condition : le dernier pion ne peut finir qu'aux croisements des deux familles de diagonales permises.</p>
    <p id="so-bilan" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Ce que l'invariant dit, et ce qu'il ne dit pas</h4>
    <p>Sur le plateau anglais, en partant du trou central vide, l'invariant ne laisse que cinq arrivées possibles : le centre et les milieux des quatre bords. Ces cinq arrivées sont effectivement atteintes : une solution qui finit au centre s'achève par un saut venu d'un bord, et il suffit de faire ce dernier saut dans l'autre sens pour finir au milieu du bord. L'existence d'une solution finissant au centre est un fait classique, que la page constate en la trouvant (bouton « Un coup », répété).</p>
    <p>Sur le plateau français, avec le trou central vide, les trois nombres de pions valent 12 au départ : ils ont la même parité, et l'auront toujours. Il est donc impossible de finir avec un seul pion. C'est une impossibilité démontrée, non un constat d'échec.</p>
    <p>Dans l'autre sens, l'invariant est seulement une condition nécessaire : qu'une arrivée soit permise ne prouve pas qu'on puisse l'atteindre.</p>
  </div>
</section>
` + suite(
  "Conclure de nombreux échecs qu'une position est impossible, ou d'un seul invariant satisfait qu'elle est possible. Seul un argument qui vaut pour <em>toutes</em> les suites de coups démontre une impossibilité : ici, la parité des trois couleurs. Et cet argument ne marche que dans un sens : sur le plateau français, en retirant au départ un pion voisin du centre plutôt que le pion central, l'invariant ne s'oppose plus à rien, mais il ne fournit pas la solution pour autant.",
  "L'argument est un invariant de parité, comme celui du <a href=\"#activites/taquin\">taquin</a> ou des <a href=\"#activites/dominos\">dominos sur l'échiquier</a>. Dans l'édifice : <a href=\"#n.n-recurrence\">Principe de récurrence</a>, qui est ce qui permet d'affirmer qu'une propriété conservée par chaque coup est vraie après un nombre quelconque de coups. Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> fournit les décomptes.",
  "Les arrivées permises sont calculées pour le plateau et le trou de départ choisis, avec les deux coloriages en diagonale. « Un coup » lance une recherche en profondeur d'une suite de sauts menant à un seul pion, en mémorisant les positions sans issue ; elle est limitée à 400 000 positions examinées et dit si elle n'a pas abouti. Depuis la position de départ anglaise, elle trouve une solution après un millier de positions. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let type = 0, H = [], idx = new Map(), M = [], vide0 = -1, pions = new Set(), hist = [], pris = -1, choixVide = false, conseil = [], msg = '', vivant = true;
  const P = k => Math.pow(2, k), c1 = k => (H[k][0] + H[k][1]) % 3, c2 = k => ((H[k][0] - H[k][1]) % 3 + 3) % 3;
  function plateau() { H = []; idx = new Map(); M = [];
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) if ((i >= 2 && i <= 4) || (j >= 2 && j <= 4) || (type === 1 && (i === 1 || i === 5) && (j === 1 || j === 5))) { idx.set(i * 7 + j, H.length); H.push([i, j]); }
    H.forEach(([i, j], a) => { for (const [di, dj] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) { const i1 = i + di, j1 = j + dj, i2 = i + 2 * di, j2 = j + 2 * dj; if (i2 < 0 || i2 > 6 || j2 < 0 || j2 > 6) continue; const b = idx.get(i1 * 7 + j1), c = idx.get(i2 * 7 + j2); if (b !== undefined && c !== undefined) M.push([a, b, c]); } });
    vide0 = idx.get(24); debut(); }
  function debut() { pions = new Set(H.map((_, k) => k)); pions.delete(vide0); hist = []; pris = -1; conseil = []; msg = ''; choixVide = false; }
  const sauts = a => M.filter(([x, b, c]) => x === a && pions.has(b) && !pions.has(c));
  const comptes = c => { const n = [0, 0, 0]; pions.forEach(k => n[c(k)]++); return n; };
  // arrivées permises par l'invariant, calculées sur la position de départ
  function arrivees() { const dep = new Set(H.map((_, k) => k)); dep.delete(vide0); const ok = [];
    H.forEach((_, f) => { if ([c1, c2].every(c => { const n = [0, 0, 0]; dep.forEach(k => n[c(k)]++); const e = [0, 0, 0]; e[c(f)] = 1; return (n[0] + n[1]) % 2 === (e[0] + e[1]) % 2 && (n[1] + n[2]) % 2 === (e[1] + e[2]) % 2; })) ok.push(f); }); return ok; }
  // recherche en profondeur d'une suite de sauts menant à un seul pion ; rend le premier saut, null (aucune), ou undefined (budget épuisé)
  function chercher() { let s = 0; pions.forEach(k => { s += P(k); }); const a = Math.floor, mauvais = new Set(); let n = 0, premier = null, depasse = false;
    const a1 = (st, k) => a(st / P(k)) % 2 === 1;
    const dfs = (st, cnt, prof) => { if (cnt === 1) return true; if (mauvais.has(st)) return false; if (++n > 400000) { depasse = true; return false; }
      for (const m of M) { if (a1(st, m[0]) && a1(st, m[1]) && !a1(st, m[2])) { if (prof === 0) premier = m; if (dfs(st - P(m[0]) - P(m[1]) + P(m[2]), cnt - 1, prof + 1)) return true; if (depasse) return false; } }
      mauvais.add(st); return false; };
    const ok = dfs(s, pions.size, 0); return ok ? premier : depasse ? undefined : null; }
  function rendre() {
    if (!vivant) return;
    const G = q('#so-grille'), cle = String(type);
    if (G.dataset.t !== cle) { G.dataset.t = cle; G.innerHTML = ''; for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const k = idx.get(i * 7 + j); if (k === undefined) { G.append(document.createElement('span')); continue; } const b = document.createElement('button'); b.type = 'button'; b.dataset.k = k; G.append(b); } }
    G.classList.toggle('teintes', q('#so-teintes').checked);
    const cibles = pris >= 0 ? sauts(pris).map(m => m[2]) : [], arr = q('#so-arrivees').checked ? arrivees() : [], A = arrivees();
    G.querySelectorAll('button').forEach(b => { const k = +b.dataset.k; b.className = 't' + c1(k) + (pions.has(k) ? ' pion' : '') + (k === pris ? ' pris' : '') + (cibles.includes(k) ? ' cible' : '') + (arr.includes(k) ? ' arrivee' : '') + (conseil.includes(k) ? ' conseil' : '');
      b.setAttribute('aria-label', `Ligne ${H[k][0] + 1}, colonne ${H[k][1] + 1} : ${pions.has(k) ? 'pion' : 'trou libre'}${cibles.includes(k) ? ', arrivée possible du saut' : ''}${arr.includes(k) ? ', arrivée permise pour le dernier pion' : ''}`); });
    const n = comptes(c1), peutJouer = M.some(([a, b, c]) => pions.has(a) && pions.has(b) && !pions.has(c)), gagne = pions.size === 1;
    ecrire(q('#so-nb'), entier(pions.size)); ecrire(q('#so-coups'), entier(hist.length));
    ecrire(q('#so-coul'), `Pions par couleur :<span class="so-puce" style="background:var(--mark)"></span>bleu <b>${n[0]}</b><span class="so-puce" style="background:var(--sec)"></span>orange <b>${n[1]}</b><span class="so-puce" style="background:var(--tan)"></span>vert <b>${n[2]}</b>`, true);
    q('#so-annuler').disabled = !hist.length; q('#so-conseil').disabled = gagne || choixVide; q('#so-vide').disabled = hist.length > 0;
    const m = q('#so-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : !peutJouer ? ' bloque' : '');
    ecrire(m, choixVide ? 'Cliquez sur le trou qui sera vide au départ.' : gagne ? `Réussi : il ne reste qu'un pion, en ${hist.length} coups.` : !peutJouer ? `Plus aucun saut n'est possible : il reste ${pions.size} pions. Annulez des coups, ou recommencez.` : msg || (pris >= 0 ? 'Cliquez sur l\'un des trous entourés de tirets verts.' : hist.length ? 'Continuez.' : 'Cliquez sur un pion qui peut sauter.'));
    const dep = (() => { const d = new Set(H.map((_, k) => k)); d.delete(vide0); const x = [0, 0, 0]; d.forEach(k => x[c1(k)]++); return x; })();
    ecrire(q('#so-bilan'), `Pour le plateau ${type ? 'français' : 'anglais'} et le trou de départ choisi (ligne ${H[vide0][0] + 1}, colonne ${H[vide0][1] + 1}), les nombres de pions par couleur valent ${dep[0]}, ${dep[1]} et ${dep[2]} au départ. ` + (A.length ? `L'invariant, appliqué aux deux coloriages, laisse ${A.length} arrivée${A.length > 1 ? 's' : ''} possible${A.length > 1 ? 's' : ''} pour un dernier pion : cochez « montrer où le dernier pion peut finir » pour les voir, entourées de pointillés.` : 'Aucun trou ne satisfait les deux conditions : il est impossible de finir avec un seul pion.'));
  }
  q('#so-grille').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b) return; const k = +b.dataset.k, cons = conseil; conseil = []; msg = '';
    if (choixVide) { vide0 = k; debut(); rendre(); return; }
    if (cons.length && (k === cons[0] || k === cons[1])) { const m = M.find(x => x[0] === cons[0] && x[2] === cons[1]); if (m && pions.has(m[0]) && pions.has(m[1]) && !pions.has(m[2])) { hist.push([...pions]); pions.delete(m[0]); pions.delete(m[1]); pions.add(m[2]); pris = -1; rendre(); return; } }
    if (pris >= 0 && !pions.has(k)) { const m = sauts(pris).find(x => x[2] === k); if (m) { hist.push([...pions]); pions.delete(m[0]); pions.delete(m[1]); pions.add(m[2]); } pris = -1; }
    else if (pions.has(k)) { const S = sauts(k); if (S.length === 1) { const m = S[0]; hist.push([...pions]); pions.delete(m[0]); pions.delete(m[1]); pions.add(m[2]); pris = -1; } else if (S.length) pris = k === pris ? -1 : k; else { pris = -1; msg = 'Ce pion ne peut pas sauter : il lui faut un pion voisin et un trou libre juste derrière.'; } }
    rendre(); });
  q('#so-debut').addEventListener('click', () => { debut(); rendre(); });
  q('#so-annuler').addEventListener('click', () => { if (hist.length) pions = new Set(hist.pop()); pris = -1; conseil = []; msg = ''; rendre(); });
  q('#so-vide').addEventListener('click', () => { choixVide = !choixVide; pris = -1; rendre(); });
  q('#so-conseil').addEventListener('click', () => { pris = -1;
    if (!arrivees().length) { conseil = []; msg = 'Vous avez demandé de l\'aide : inutile de chercher. Avec ce trou de départ, l\'invariant des trois couleurs interdit de finir avec un seul pion.'; rendre(); return; }
    const r = chercher();
    if (r) { conseil = [r[0], r[2]]; msg = 'Le pion entouré de vert peut sauter, vers le trou entouré de vert, ' + (r[2] - r[0] === 2 * (r[1] - r[0]) && H[r[2]][0] === H[r[0]][0] ? (H[r[2]][1] > H[r[0]][1] ? 'vers la droite' : 'vers la gauche') : (H[r[2]][0] > H[r[0]][0] ? 'vers le bas' : 'vers le haut')) + ' : une suite de sauts menant à un seul pion commence ainsi.'; }
    else if (r === null) { conseil = []; msg = 'Vous avez demandé de l\'aide : la recherche a examiné toutes les suites de sauts possibles depuis cette position, et aucune ne mène à un seul pion.'; }
    else { conseil = []; msg = 'Vous avez demandé de l\'aide : la recherche n\'a pas abouti dans la limite de 400 000 positions examinées. Elle ne permet de conclure ni dans un sens ni dans l\'autre.'; } rendre(); });
  q('#so-teintes').addEventListener('change', rendre); q('#so-arrivees').addEventListener('change', rendre);
  q('#so-plateau').addEventListener('change', e => { type = +e.target.value; plateau(); rendre(); });
  plateau(); rendre();
  return () => { vivant = false; };
}
