// Casse-tête « Les ponts de Königsberg » (tracés d'un seul trait), rubrique Activités, MEMO_atlas_activites.md §138.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .pk { width: min(100%, 520px); touch-action: manipulation; }
.activites-act .pk .arete { fill: none; stroke: var(--encre-3); stroke-width: 5; stroke-linecap: round; }
.activites-act .pk .arete.faite { stroke: var(--activites-jeu); stroke-width: 6; }
.activites-act .pk .arete.conseil { stroke: var(--tan); stroke-width: 7; }
.activites-act .pk .arete.edit { cursor: pointer; }
.activites-act .pk .sommet circle { fill: var(--surface); stroke: var(--encre); stroke-width: 2.5; cursor: pointer; }
.activites-act .pk .sommet.ici circle { fill: var(--activites-jeu); stroke: var(--activites-jeu); }
.activites-act .pk .sommet.possible circle { stroke: var(--tan); stroke-width: 4; }
.activites-act .pk .sommet.choisi circle { stroke: var(--sec); stroke-width: 4; }
.activites-act .pk .sommet text { font: 600 13px var(--f-ui); fill: var(--encre); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
.activites-act .pk .sommet.ici text { fill: var(--surface); }
.activites-act .pk .sommet.impair text { fill: var(--sec); } .activites-act .pk .sommet.ici.impair text { fill: var(--surface); }
.activites-act .pk .num { font: 600 11px var(--f-mono); fill: var(--activites-jeu); text-anchor: middle; dominant-baseline: central; paint-order: stroke; stroke: var(--papier); stroke-width: 4px; }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie relève de Maths Sup</p>
  <h3>Les ponts de Königsberg</h3>
  <p class="lede">Peut-on se promener dans la ville en passant une fois, et une seule, sur chacun de ses sept ponts ? Euler a montré en 1735 que non, et sa réponse tient en un geste : compter combien de ponts aboutissent à chaque quartier. C'est l'acte de naissance de la théorie des graphes.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Figure <select id="pk-fig"></select></label>
    <label id="pk-n-l">Sommets <select id="pk-n"><option>4</option><option>5</option><option selected>6</option><option>7</option><option>8</option></select></label>
    <button type="button" class="primary" id="pk-debut">Recommencer le tracé</button>
    <button type="button" id="pk-annuler">Annuler un trait</button>
    <button type="button" id="pk-conseil">Un trait</button>
    <button type="button" id="pk-verdict">Est-ce possible ?</button>
    <label><input type="checkbox" id="pk-deg"> montrer les degrés</label>
    <label><input type="checkbox" id="pk-edit"> modifier la figure</label>
  </div>
  <div class="jeu-plateau"><svg class="pk" id="pk-svg" viewBox="0 0 400 300" role="group" aria-label="Figure à tracer d'un seul trait"></svg></div>
  <div class="jeu-etat"><span>Traits parcourus : <b id="pk-fait">0</b> sur <b id="pk-total">0</b></span><span id="pk-info"></span></div>
  <div class="jeu-message" id="pk-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Il faut parcourir tous les traits de la figure, chacun une fois et une seule, sans lever le crayon. Cliquez sur un sommet pour y poser le crayon, puis sur un sommet voisin pour tracer le trait qui les relie ; les sommets que l'on peut atteindre sont cerclés de vert. Dans la figure de Königsberg, les sommets sont les quatre quartiers et les traits sont les sept ponts.</p>
    <p>Cochez « modifier la figure » pour dessiner la vôtre : cliquez sur deux sommets pour les relier par un trait, cliquez sur un trait pour l'effacer. La figure « au hasard » en tire une nouvelle à chaque fois.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Compter les traits à chaque sommet</h4>
    <p>Le <b>degré</b> d'un sommet est le nombre de traits qui y aboutissent. Cochez « montrer les degrés » : les degrés impairs sont en orange.</p>
    <p>Supposons qu'un tracé d'un seul trait existe, et regardons un sommet qui n'est ni son départ ni son arrivée. Chaque fois que le crayon y arrive, il en repart : les traits qui y aboutissent se groupent par deux, et son degré est pair. Seuls le départ et l'arrivée peuvent donc avoir un degré impair.</p>
    <div class="def"><p><b>Théorème d'Euler.</b> Une figure connexe peut être tracée d'un seul trait si, et seulement si, elle a zéro ou deux sommets de degré impair. S'il y en a zéro, on peut partir de n'importe quel sommet, et l'on y revient. S'il y en a deux, il faut partir de l'un et l'on arrive à l'autre.</p></div>
    <p>À Königsberg, les quatre quartiers ont pour degrés 5, 3, 3 et 3 : quatre sommets impairs, la promenade est impossible. On vient de démontrer que la condition est nécessaire ; voici pourquoi elle suffit.</p>
    <p><b>Cas où tous les degrés sont pairs.</b> On raisonne par récurrence sur le nombre de traits. Partons d'un sommet ${K('v')} et avançons sans jamais reprendre un trait, tant que c'est possible. On ne peut rester bloqué qu'en ${K('v')} : ailleurs, le crayon a utilisé un nombre impair de traits du sommet où il se trouve, et il en reste donc un, puisque le degré est pair. On obtient ainsi un circuit ${K('C')} fermé. Effaçons ses traits : les degrés restent pairs, et chaque morceau connexe de ce qui reste a moins de traits, donc se trace d'un seul trait fermé par hypothèse de récurrence. Comme la figure était connexe, chaque morceau touche ${K('C')} ; il suffit de parcourir ${K('C')} et, la première fois que l'on rencontre un morceau, d'en faire le tour avant de continuer.</p>
    <p><b>Cas de deux sommets impairs.</b> Ajoutons un trait entre eux : tous les degrés deviennent pairs, il existe un circuit fermé, et en retirant le trait ajouté on obtient un tracé qui va de l'un à l'autre.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Jamais un seul sommet impair</h4>
    <p>Additionnons les degrés de tous les sommets : chaque trait est compté deux fois, une à chaque bout. La somme est donc le double du nombre de traits, et elle est paire.</p>
    <div class="def"><p><b>Lemme des poignées de main.</b> Dans toute figure, le nombre de sommets de degré impair est pair.</p></div>
    <p>C'est pourquoi le théorème ne mentionne ni « un » ni « trois » sommets impairs : cela n'arrive jamais. Essayez d'en fabriquer un avec « modifier la figure ».</p>
  </div>
</section>
` + suite(
  "Partir de n'importe où quand deux sommets sont impairs. Avec la figure de l'enveloppe ouverte, les deux sommets du bas ont pour degré 3 : le tracé n'est possible qu'en partant de l'un d'eux, et en partant du sommet du toit, on échoue à coup sûr, quelle que soit la suite. L'autre erreur est d'oublier la connexité : deux triangles séparés ont tous leurs sommets de degré pair, et ne se tracent évidemment pas d'un seul trait.",
  "Euler a présenté sa solution à l'Académie de Saint-Pétersbourg le 26 août 1735 ; elle a paru sous le titre « Solutio problematis ad geometriam situs pertinentis » dans les <i>Commentarii</i> de l'Académie, tome 8, daté de 1736 et publié en 1741. Euler démontre que la condition est nécessaire ; la réciproque a été démontrée par Carl Hierholzer. Dans l'édifice : <a href=\"#n.n-recurrence\">Principe de récurrence</a>, pour la démonstration de la réciproque, et <a href=\"#n.n-fini\">Ensembles finis et principe des tiroirs</a> pour les décomptes. Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> pratique le double comptage du lemme des poignées de main.",
  "Les degrés sont comptés sur la figure affichée, traits multiples compris. « Est-ce possible ? » applique le théorème : connexité vérifiée par parcours, puis décompte des sommets impairs. « Un trait » suit la règle de Fleury : parmi les traits disponibles, éviter celui dont le passage couperait en deux ce qui reste à tracer, sauf s'il n'y en a pas d'autre. Rien n'est enregistré ni envoyé.");

const cercle = (n, r = 115) => Array.from({ length: n }, (_, k) => [200 + r * Math.sin(2 * Math.PI * k / n), 150 - r * Math.cos(2 * Math.PI * k / n)]);
const FIG = [
  { id: 'kon', nom: 'Königsberg', s: [[200, 150], [200, 40], [200, 260], [350, 150]], noms: ['île', 'nord', 'sud', 'est'], a: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 3], [2, 3]] },
  { id: 'env', nom: 'enveloppe ouverte', s: [[110, 250], [290, 250], [290, 120], [110, 120], [200, 40]], a: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [2, 4], [3, 4]] },
  { id: 'etoile', nom: 'pentagone étoilé', s: cercle(5), a: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [2, 4], [4, 1], [1, 3], [3, 0]] },
  { id: 'carres', nom: 'deux carrés emboîtés', s: [[80, 60], [320, 60], [320, 240], [80, 240], [200, 60], [320, 150], [200, 240], [80, 150]], a: [[0, 4], [4, 1], [1, 5], [5, 2], [2, 6], [6, 3], [3, 7], [7, 0], [4, 5], [5, 6], [6, 7], [7, 4]] },
  { id: 'k4', nom: 'quatre points tous reliés', s: [[200, 40], [330, 250], [70, 250], [200, 175]], a: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]] },
  { id: 'hasard', nom: 'au hasard' },
  { id: 'libre', nom: 'figure vide, à dessiner' },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let S = [], A = [], noms = null, faits = [], chemin = [], choisi = -1, conseil = -1, msg = '', vivant = true;   // faits : indices d'arêtes parcourues, dans l'ordre ; chemin : sommets visités
  FIG.forEach(f => { const o = document.createElement('option'); o.value = f.id; o.textContent = f.nom; q('#pk-fig').append(o); });
  const deg = () => { const d = S.map(() => 0); A.forEach(([u, v]) => { d[u]++; d[v]++; }); return d; };
  const ici = () => chemin.length ? chemin[chemin.length - 1] : -1;
  const libres = v => A.map((a, k) => k).filter(k => !faits.includes(k) && (A[k][0] === v || A[k][1] === v));
  // connexité des arêtes restantes (sommets isolés ignorés) ; rend le nombre de composantes portant des arêtes
  function composantes(aretes) { const adj = new Map(); aretes.forEach(k => { const [u, v] = A[k]; if (!adj.has(u)) adj.set(u, []); if (!adj.has(v)) adj.set(v, []); adj.get(u).push(v); adj.get(v).push(u); }); const vus = new Set(); let c = 0;
    for (const s of adj.keys()) { if (vus.has(s)) continue; c++; const pile = [s]; vus.add(s); while (pile.length) { const x = pile.pop(); for (const y of adj.get(x)) if (!vus.has(y)) { vus.add(y); pile.push(y); } } } return c; }
  // le tracé peut-il être terminé depuis l'état courant ? (théorème d'Euler appliqué à ce qui reste, en partant du sommet courant)
  function faisable(restantes, depuis) { if (!restantes.length) return true; if (composantes(restantes) !== 1) return false; const d = S.map(() => 0); restantes.forEach(k => { d[A[k][0]]++; d[A[k][1]]++; }); const imp = d.map((x, i) => x % 2 ? i : -1).filter(i => i >= 0);
    if (depuis < 0) return imp.length === 0 || imp.length === 2; if (d[depuis] === 0) return false; return imp.length === 0 || (imp.length === 2 && imp.includes(depuis)); }
  function charger() { const id = q('#pk-fig').value, f = FIG.find(x => x.id === id), n = +q('#pk-n').value; q('#pk-n-l').hidden = !(id === 'hasard' || id === 'libre'); noms = null;
    if (id === 'libre') { S = cercle(n); A = []; q('#pk-edit').checked = true; }
    else if (id === 'hasard') { S = cercle(n); for (let essai = 0; essai < 200; essai++) { A = []; for (let u = 0; u < n; u++) for (let v = u + 1; v < n; v++) if (Math.random() < 0.42) A.push([u, v]); const d = deg(); if (A.length >= n && d.every(x => x > 0) && composantes(A.map((_, k) => k)) === 1) break; } }
    else { S = f.s.map(p => p.slice()); A = f.a.map(a => a.slice()); noms = f.noms || null; }
    faits = []; chemin = []; choisi = -1; conseil = -1; msg = ''; rendre(); }
  // tracé d'une arête : droite, ou arc quand plusieurs arêtes relient les deux mêmes sommets
  function trace(k) { const [u, v] = A[k], memes = A.map((a, i) => i).filter(i => (A[i][0] === u && A[i][1] === v) || (A[i][0] === v && A[i][1] === u)), rang = memes.indexOf(k), m = memes.length, [x1, y1] = S[Math.min(u, v)], [x2, y2] = S[Math.max(u, v)];
    const dec = (rang - (m - 1) / 2) * 44, mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    return { d: `M${x1} ${y1}Q${mx + nx * dec} ${my + ny * dec} ${x2} ${y2}`, c: [mx + nx * dec / 2, my + ny * dec / 2] }; }
  function rendre() {
    if (!vivant) return;
    const edit = q('#pk-edit').checked, d = deg(), v = ici(), voisins = new Set(v >= 0 ? libres(v).map(k => A[k][0] === v ? A[k][1] : A[k][0]) : []), montre = q('#pk-deg').checked;
    let h = ''; A.forEach((a, k) => { const t = trace(k), n = faits.indexOf(k); h += `<path class="arete${n >= 0 ? ' faite' : ''}${k === conseil ? ' conseil' : ''}${edit ? ' edit' : ''}" data-a="${k}" data-u="${a[0]}" data-v="${a[1]}" d="${t.d}"/>` + (n >= 0 ? `<text class="num" x="${t.c[0]}" y="${t.c[1]}">${n + 1}</text>` : ''); });
    S.forEach(([x, y], i) => { h += `<g class="sommet${i === v ? ' ici' : ''}${!edit && voisins.has(i) ? ' possible' : ''}${i === choisi ? ' choisi' : ''}${montre && d[i] % 2 ? ' impair' : ''}" data-s="${i}" tabindex="0" role="button" aria-label="Sommet ${noms ? noms[i] : i + 1}, degré ${d[i]}${i === v ? ', crayon ici' : ''}"><circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y}">${montre ? d[i] : noms ? '' : i + 1}</text></g>`;
      if (noms) h += `<text class="num" style="fill:var(--encre-2)" x="${x + (x > 300 ? 0 : x < 100 ? 0 : 34)}" y="${y + (x > 300 ? 30 : 0)}">${noms[i]}</text>`; });
    q('#pk-svg').innerHTML = h;
    const total = A.length, fini = total > 0 && faits.length === total, bloque = !edit && v >= 0 && !fini && libres(v).length === 0;
    ecrire(q('#pk-fait'), entier(faits.length)); ecrire(q('#pk-total'), entier(total));
    const imp = d.filter(x => x % 2).length; ecrire(q('#pk-info'), montre ? `Sommets de degré impair : ${imp}` : '');
    q('#pk-annuler').disabled = !chemin.length; q('#pk-debut').disabled = !chemin.length; q('#pk-conseil').disabled = edit || fini || !total; q('#pk-verdict').disabled = !total;
    const m = q('#pk-message'); m.className = 'jeu-message' + (fini ? ' gagne' : bloque ? ' bloque' : '');
    ecrire(m, edit ? (msg || 'Cliquez sur deux sommets pour les relier par un trait, sur un trait pour l\'effacer. Décochez « modifier la figure » pour tracer.') : fini ? `Réussi : les ${total} traits sont parcourus d'un seul trait${chemin[0] === v ? ', et vous êtes revenu au point de départ' : ''}.` : bloque ? `Le crayon est bloqué : plus aucun trait libre ne part de ce sommet, et il en reste ${total - faits.length} à parcourir. Annulez des traits, ou recommencez.` : msg || (v < 0 ? 'Cliquez sur un sommet pour y poser le crayon.' : 'Cliquez sur un sommet cerclé de vert pour tracer le trait.'));
  }
  function clicSommet(i) { const edit = q('#pk-edit').checked; conseil = -1; msg = '';
    if (edit) { if (choisi < 0) choisi = i; else if (choisi === i) choisi = -1; else { A.push([Math.min(choisi, i), Math.max(choisi, i)]); choisi = -1; faits = []; chemin = []; } rendre(); return; }
    const v = ici(); if (v < 0) { chemin = [i]; rendre(); return; }
    const k = libres(v).find(k => (A[k][0] === v ? A[k][1] : A[k][0]) === i); if (k === undefined) { msg = i === v ? '' : 'Aucun trait libre ne relie ces deux sommets.'; rendre(); return; }
    faits.push(k); chemin.push(i); rendre(); }
  q('#pk-svg').addEventListener('click', e => { const s = e.target.closest('[data-s]'), a = e.target.closest('[data-a]'); if (s) clicSommet(+s.dataset.s); else if (a && q('#pk-edit').checked) { A.splice(+a.dataset.a, 1); faits = []; chemin = []; choisi = -1; conseil = -1; msg = ''; rendre(); } });
  q('#pk-svg').addEventListener('keydown', e => { if (e.key !== 'Enter' && e.key !== ' ') return; const s = e.target.closest('[data-s]'); if (s) { e.preventDefault(); clicSommet(+s.dataset.s); const n = q(`#pk-svg [data-s="${s.dataset.s}"]`); if (n) n.focus(); } });
  q('#pk-debut').addEventListener('click', () => { faits = []; chemin = []; conseil = -1; msg = ''; rendre(); });
  q('#pk-annuler').addEventListener('click', () => { if (faits.length) faits.pop(); chemin.pop(); conseil = -1; msg = ''; rendre(); });
  q('#pk-conseil').addEventListener('click', () => { const v = ici(), reste = A.map((a, k) => k).filter(k => !faits.includes(k)); conseil = -1;
    if (v < 0) { const d = deg(), imp = d.map((x, i) => x % 2 ? i : -1).filter(i => i >= 0); if (!faisable(reste, -1)) msg = 'Vous avez demandé de l\'aide : cette figure ne peut pas être tracée d\'un seul trait, d\'où que l\'on parte.'; else { const dep = imp.length ? imp[0] : d.findIndex(x => x > 0); chemin = [dep]; msg = imp.length ? 'Le crayon a été posé sur l\'un des deux sommets de degré impair : c\'est de là qu\'il faut partir.' : 'Tous les degrés sont pairs : on peut partir de n\'importe quel sommet. Le crayon a été posé sur l\'un d\'eux.'; } rendre(); return; }
    if (!faisable(reste, v)) { msg = 'Vous avez demandé de l\'aide : depuis cette position, le tracé ne peut plus être terminé. Annulez des traits.'; rendre(); return; }
    const bon = libres(v).find(k => { const w = A[k][0] === v ? A[k][1] : A[k][0]; return faisable(reste.filter(x => x !== k), reste.length > 1 ? w : -1) || reste.length === 1; });
    if (bon !== undefined) { conseil = bon; msg = 'Le trait en vert peut être parcouru sans couper en deux ce qui reste à tracer.'; } rendre(); });
  q('#pk-verdict').addEventListener('click', () => { const d = deg(), tous = A.map((a, k) => k), comp = composantes(tous), imp = d.map((x, i) => x % 2 ? i : -1).filter(i => i >= 0), nm = i => noms ? `« ${noms[i]} »` : String(i + 1); conseil = -1;
    msg = comp > 1 ? `Non : la figure est en ${comp} morceaux séparés, et le crayon ne peut pas sauter de l'un à l'autre.` : imp.length === 0 ? 'Oui : tous les sommets ont un degré pair. On peut partir de n\'importe quel sommet, et le tracé y revient.' : imp.length === 2 ? `Oui, mais pas de n'importe où : les sommets ${nm(imp[0])} et ${nm(imp[1])} ont un degré impair. Il faut partir de l'un, et le tracé finit à l'autre.` : `Non : ${imp.length} sommets ont un degré impair (${imp.map(i => nm(i) + ' : ' + d[i]).join(', ')}), et le théorème d'Euler n'en tolère que zéro ou deux.`; rendre(); });
  q('#pk-fig').addEventListener('change', () => { q('#pk-edit').checked = false; charger(); }); q('#pk-n').addEventListener('change', charger);
  q('#pk-deg').addEventListener('change', rendre); q('#pk-edit').addEventListener('change', () => { choisi = -1; faits = []; chemin = []; msg = ''; rendre(); });
  charger();
  return () => { vivant = false; };
}
