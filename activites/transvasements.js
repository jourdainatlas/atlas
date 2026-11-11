// Casse-tête « Les transvasements », rubrique Activités, MEMO_atlas_activites.md §139 : deux récipients, une quantité à mesurer, et le théorème de Bézout.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, pgcd } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .tv-but { padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); }
.activites-act .tv-but b { color: var(--activites-jeu); }
.activites-act .tv-duo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: center; width: min(100%, 720px); }
.activites-act .tv-duo svg { display: block; width: 100%; height: auto; max-height: 300px; }
.activites-act .tv-cmd { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; padding: 10px 16px; border-top: 1px solid var(--filet); }
.activites-act .tv-cmd button { font: 500 13.5px/1.25 var(--f-ui); padding: 8px 6px; border-radius: 6px; border: 1px solid var(--encre-3); background: var(--surface); color: var(--encre); cursor: pointer; }
.activites-act .tv-cmd button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .tv-cmd button:disabled { opacity: .4; cursor: default; }
.activites-act .tv-cmd button.conseil { border-color: var(--tan); box-shadow: inset 0 0 0 2px var(--tan); }
.activites-act .tv-eau { fill: var(--activites-jeu); opacity: .55; }
.activites-act .tv-verre { fill: none; stroke: var(--encre); stroke-width: 2; }
.activites-act .tv-grad { stroke: var(--encre-3); stroke-width: 1; }
.activites-act .tv-txt { font: 600 13px var(--f-ui); fill: var(--encre); } .activites-act .tv-txt.petit { font-weight: 400; font-size: 10px; fill: var(--encre-2); }
.activites-act .tv-pt { fill: var(--encre-3); } .activites-act .tv-cible { fill: none; stroke: var(--tan); stroke-width: 2; }
.activites-act .tv-chemin { fill: none; stroke: var(--sec); stroke-width: 2.2; stroke-linejoin: round; } .activites-act .tv-ici { fill: var(--sec); }
.activites-act .tv-cadre { fill: none; stroke: var(--filet-fort, var(--encre-3)); stroke-width: 1; }
@media (max-width: 560px) { .activites-act .tv-duo { grid-template-columns: 1fr; } .activites-act .tv-cmd { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, auto); grid-auto-flow: column; } }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie relève de Maths expertes</p>
  <h3>Les transvasements</h3>
  <p class="lede">Deux récipients sans graduation, une fontaine, un évier. Avec un récipient de 3 litres et un de 5, comment mesurer exactement 4 litres ? Le casse-tête est ancien ; il se résout à tâtons, mais c'est l'arithmétique qui dit quelles quantités sont accessibles, et le théorème de Bézout en est le cœur.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Récipient A <select id="tv-a"></select></label>
    <label>Récipient B <select id="tv-b"></select></label>
    <label>À mesurer <select id="tv-c"></select></label>
    <button type="button" class="primary" id="tv-neuf">Nouveau défi</button>
    <button type="button" id="tv-depart">Revenir au départ</button>
    <button type="button" id="tv-annuler">Annuler</button>
    <button type="button" id="tv-conseil">Un coup</button>
    <button type="button" id="tv-possible">Est-ce possible ?</button>
  </div>
  <div class="bar"><span>Défis classiques : <span class="chips" id="tv-ex"></span></span></div>
  <p class="tv-but" id="tv-but" aria-live="polite"></p>
  <div class="jeu-plateau"><div class="tv-duo"><div id="tv-vases"></div><div id="tv-carte"></div></div></div>
  <div class="tv-cmd" id="tv-cmd" role="group" aria-label="Opérations permises">
    <button type="button" data-m="0">Remplir A</button><button type="button" data-m="2">Vider A</button><button type="button" data-m="4">Verser A dans B</button>
    <button type="button" data-m="1">Remplir B</button><button type="button" data-m="3">Vider B</button><button type="button" data-m="5">Verser B dans A</button>
  </div>
  <div class="jeu-etat"><span>Opérations : <b id="tv-n">0</b></span><span>Contenu : <b id="tv-etat"></b></span><span id="tv-min-l" hidden>Minimum : <b id="tv-min"></b></span></div>
  <div class="jeu-message" id="tv-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Le but est d'obtenir exactement la quantité demandée dans l'un des deux récipients, en aussi peu d'opérations que possible. Trois opérations sont permises : remplir entièrement un récipient à la fontaine, le vider entièrement dans l'évier, ou verser l'un dans l'autre jusqu'à ce que le premier soit vide ou le second plein. Rien d'autre : les récipients n'ont pas de graduation, et l'on ne verse jamais « à peu près la moitié ».</p>
    <p>À droite des récipients, chaque point du quadrillage est un état possible : son abscisse est le contenu de A, son ordonnée celui de B. Votre parcours s'y dessine en orange. Remplir ou vider déplace le point horizontalement ou verticalement jusqu'à un bord ; verser le fait glisser en diagonale, puisque la quantité totale d'eau ne change pas. Les points cerclés de vert sont ceux où le but est atteint.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que l'on peut mesurer</h4>
    <p>Notons ${K('a')} et ${K('b')} les capacités, en litres entiers, et ${K('d = \\operatorname{pgcd}(a, b)')}.</p>
    <div class="def"><p><b>Théorème.</b> Les quantités que l'on peut obtenir dans l'un des récipients sont exactement les multiples de ${K('d')} compris entre ${K('0')} et ${K('\\max(a, b)')}.</p></div>
    <p><b>Ces quantités sont les seules possibles.</b> Au départ, les deux contenus valent 0. Montrons que les contenus restent des multiples de ${K('d')}. Remplir donne ${K('a')} ou ${K('b')}, vider donne 0. Verser un contenu ${K('x')} dans un récipient de capacité ${K('b')} qui contient ${K('y')} donne soit ${K('(0,\\ x + y)')}, soit ${K('(x + y - b,\\ b)')}. Dans tous les cas, les nouveaux contenus s'obtiennent par additions et soustractions à partir de ${K('x')}, ${K('y')}, ${K('a')}, ${K('b')}, tous multiples de ${K('d')}. Par récurrence sur le nombre d'opérations, les contenus sont toujours des multiples de ${K('d')}, et aucun ne dépasse la capacité de son récipient.</p>
    <p><b>Elles sont toutes accessibles.</b> Supposons ${K('a \\leqslant b')}, et répétons le cycle suivant : remplir A, verser A dans B ; si B est plein, le vider, puis verser le reste de A dans B. Si B contenait ${K('r < b')} au début du cycle, A est vide à la fin et B contient ${K('r + a')} si ${K('r + a < b')}, et ${K('r + a - b')} sinon ; autrement dit, B contient le reste de ${K('r + a')} dans la division par ${K('b')}. Après ${K('k')} cycles, B contient donc le reste de ${K('ka')} dans la division par ${K('b')}.</p>
    <p>Soit maintenant ${K('c')} un multiple de ${K('d')} avec ${K('0 < c < b')}. Le théorème de Bézout fournit des entiers ${K('u')} et ${K('v')} tels que ${K('ua + vb = d')}, d'où ${K('\\dfrac cd\\,u \\cdot a \\equiv c \\pmod b')}. En ajoutant à ${K('\\dfrac cd\\,u')} un multiple de ${K('b')}, on obtient un entier ${K('k > 0')} tel que ${K('ka \\equiv c \\pmod b')} : après ${K('k')} cycles, B contient exactement ${K('c')}. Enfin ${K('c = b')} s'obtient en remplissant B.</p>
    <p>Avec 3 et 5, le PGCD vaut 1 : toutes les quantités de 0 à 5 sont accessibles. Avec 6 et 9, il vaut 3 : on ne mesurera jamais 4 litres, et le bouton « Est-ce possible ? » le confirme en explorant tous les états.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le plus court chemin</h4>
    <p>Le cycle de la démonstration réussit toujours, mais il n'est pas toujours le plus rapide : on peut aussi partir du récipient B, ce qui revient à échanger les rôles. Pour 3, 5 et un but de 4 litres, partir de A demande 8 opérations, partir de B en demande 6. La page trouve le minimum en explorant les états de proche en proche, par un parcours en largeur du quadrillage : il n'y a que ${K('(a+1)(b+1)')} états, et six opérations au plus depuis chacun.</p>
    <p>Sur le quadrillage, tout parcours longe les bords : après la première opération, l'un des deux récipients est toujours vide ou plein. C'est pourquoi l'on représente parfois ce casse-tête par une bille qui rebondit sur les bords d'un billard.</p>
  </div>
</section>
` + suite(
  "Croire qu'avec assez de patience on finit par mesurer n'importe quelle quantité. Avec des récipients de 6 et 9 litres, toutes les quantités obtenues sont des multiples de 3, quoi que l'on fasse. L'erreur inverse existe aussi : penser qu'il faut un récipient de 1 litre pour mesurer 1 litre. Avec 3 et 5, on obtient 1 litre en quatre opérations : remplir A, le verser dans B, le remplir à nouveau, compléter B ; il reste 1 litre dans A.",
  "Le chapitre de Maths expertes <a href=\"#cours/me-07\">PGCD</a> démontre le théorème de Bézout utilisé ici ; celui de Maths Sup <a href=\"#cours/ma-12\">Arithmétique dans ℤ</a> le reprend avec les congruences. Dans l'édifice : <a href=\"#z.z-bezout\">PGCD, théorème de Bézout, lemme de Gauss</a>. L'exploration <a href=\"#activites/euclide\">L'algorithme d'Euclide en rectangles</a> calcule le PGCD par découpage.",
  "Les contenus sont des entiers, et tout est calculé exactement. Le minimum, le coup conseillé et la réponse à « Est-ce possible ? » viennent d'un parcours en largeur de tous les états accessibles, qui est exhaustif : la réponse est donc une certitude et non une estimation. Les défis tirés au hasard sont toujours réalisables. Rien n'est enregistré ni envoyé.");

const NOMS = ['Remplir A', 'Remplir B', 'Vider A', 'Vider B', 'Verser A dans B', 'Verser B dans A'];
export const coup = (m, [x, y], a, b) => { let t; switch (m) { case 0: return [a, y]; case 1: return [x, b]; case 2: return [0, y]; case 3: return [x, 0]; case 4: t = Math.min(x, b - y); return [x - t, y + t]; default: t = Math.min(y, a - x); return [x + t, y - t]; } };
// Parcours en largeur depuis l'état e : renvoie la liste des coups d'un plus court chemin vers un état contenant c, ou null.
export function chemin(e, a, b, c) {
  const cle = s => s[0] * (b + 1) + s[1], vu = new Map([[cle(e), null]]), file = [e];
  for (let i = 0; i < file.length; i++) { const s = file[i];
    if (s[0] === c || s[1] === c) { const r = []; let k = cle(s); while (vu.get(k)) { const p = vu.get(k); r.unshift(p.m); k = p.de; } return r; }
    for (let m = 0; m < 6; m++) { const t = coup(m, s, a, b), k = cle(t); if (!vu.has(k)) { vu.set(k, { m, de: cle(s) }); file.push(t); } } }
  return null;
}

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let a = 3, b = 5, c = 4, e = [0, 0], hist = [], conseil = -1, msg = '', vivant = true;
  for (const id of ['#tv-a', '#tv-b']) q(id).innerHTML = Array.from({ length: 11 }, (_, i) => `<option>${i + 2}</option>`).join('');
  const majC = () => { const m = Math.max(a, b); q('#tv-c').innerHTML = Array.from({ length: m - 1 }, (_, i) => `<option>${i + 1}</option>`).join(''); if (c >= m) c = m - 1; q('#tv-c').value = c; };
  const gagne = () => e[0] === c || e[1] === c, L = n => n + ' L';
  function debut(na, nb, nc) { a = na; b = nb; c = nc; q('#tv-a').value = a; q('#tv-b').value = b; majC(); e = [0, 0]; hist = []; conseil = -1; msg = ''; rendre(); }
  function jouer(m) { if (gagne()) return; const t = coup(m, e, a, b); if (t[0] === e[0] && t[1] === e[1]) return; hist.push(e); e = t; conseil = -1; msg = ''; rendre(); }
  function vase(x0, cap, cont, nom, H, u) { const w = 74, h = cap * u, y0 = H - 34 - h; let g = `<rect class="tv-eau" x="${x0}" y="${H - 34 - cont * u}" width="${w}" height="${cont * u}"/>`;
    for (let k = 1; k < cap; k++) g += `<line class="tv-grad" x1="${x0}" x2="${x0 + 9}" y1="${H - 34 - k * u}" y2="${H - 34 - k * u}"/>`;
    return g + `<path class="tv-verre" d="M${x0} ${y0 - 6}V${H - 34}H${x0 + w}V${y0 - 6}"/><text class="tv-txt" x="${x0 + w / 2}" y="${H - 14}" text-anchor="middle">${nom} : ${cont} / ${cap} L</text>`; }
  function rendre() {
    if (!vivant) return;
    const g = gagne(), min0 = chemin([0, 0], a, b, c);
    ecrire(q('#tv-but'), `But : obtenir exactement <b>${L(c)}</b> dans l'un des récipients, en aussi peu d'opérations que possible.`, true);
    const u = Math.min(30, 190 / Math.max(a, b)), H = Math.round(Math.max(a, b) * u) + 56;
    ecrire(q('#tv-vases'), `<svg viewBox="0 0 240 ${H}" role="img" aria-label="Récipient A : ${e[0]} litres sur ${a}. Récipient B : ${e[1]} litres sur ${b}.">${vase(28, a, e[0], 'A', H, u)}${vase(138, b, e[1], 'B', H, u)}</svg>`, true);
    const p = Math.min(36, 200 / Math.max(a, b)), ox = 30, oy = 22 + b * p, X = x => ox + x * p, Y = y => oy - y * p; let s = `<rect class="tv-cadre" x="${X(0)}" y="${Y(b)}" width="${a * p}" height="${b * p}"/>`;
    for (let x = 0; x <= a; x++) for (let y = 0; y <= b; y++) { s += `<circle class="tv-pt" cx="${X(x)}" cy="${Y(y)}" r="1.6"/>`; if (x === c || y === c) s += `<circle class="tv-cible" cx="${X(x)}" cy="${Y(y)}" r="5"/>`; }
    const pts = hist.concat([e]); s += `<polyline class="tv-chemin" points="${pts.map(t => X(t[0]) + ',' + Y(t[1])).join(' ')}"/><circle class="tv-ici" cx="${X(e[0])}" cy="${Y(e[1])}" r="5.5"/>`;
    s += `<text class="tv-txt petit" x="${X(a / 2)}" y="${oy + 22}" text-anchor="middle">contenu de A (0 à ${a})</text><text class="tv-txt petit" x="${ox - 14}" y="${Y(b / 2)}" text-anchor="middle" transform="rotate(-90 ${ox - 14} ${Y(b / 2)})">contenu de B (0 à ${b})</text>`;
    ecrire(q('#tv-carte'), `<svg viewBox="0 0 ${ox + a * p + 22} ${oy + 34}" style="max-width:${ox + a * p + 22}px;margin:0 auto" role="img" aria-label="Quadrillage des états et parcours suivi">${s}</svg>`, true);
    racine.querySelectorAll('#tv-cmd button').forEach(bt => { const m = +bt.dataset.m, t = coup(m, e, a, b); bt.disabled = g || (t[0] === e[0] && t[1] === e[1]); bt.classList.toggle('conseil', m === conseil); });
    ecrire(q('#tv-n'), String(hist.length)); ecrire(q('#tv-etat'), `A = ${L(e[0])}, B = ${L(e[1])}`);
    q('#tv-min-l').hidden = !g; if (g && min0) ecrire(q('#tv-min'), String(min0.length));
    q('#tv-annuler').disabled = !hist.length; q('#tv-depart').disabled = !hist.length; q('#tv-conseil').disabled = g;
    const M = q('#tv-message'); M.className = 'jeu-message' + (g ? (min0 && hist.length > min0.length ? ' mieux' : ' gagne') : '');
    ecrire(M, g ? `Vous avez mesuré ${L(c)} en ${hist.length} opération${hist.length > 1 ? 's' : ''}. ${min0 && hist.length === min0.length ? 'C\'est le minimum : on ne peut pas faire plus court.' : `Le minimum est de ${min0 ? min0.length : '?'} : « Revenir au départ » vous laisse chercher plus court.`}` : msg || 'Choisissez une opération. Les opérations sans effet sont grisées.');
  }
  q('#tv-cmd').addEventListener('click', ev => { const bt = ev.target.closest('button[data-m]'); if (bt) jouer(+bt.dataset.m); });
  q('#tv-annuler').addEventListener('click', () => { if (!hist.length) return; e = hist.pop(); conseil = -1; msg = ''; rendre(); });
  q('#tv-depart').addEventListener('click', () => debut(a, b, c));
  q('#tv-conseil').addEventListener('click', () => { const r = chemin(e, a, b, c);
    if (r && r.length) { conseil = r[0]; msg = `Vous avez demandé de l'aide : « ${NOMS[r[0]]} » (cerclé de vert) est le début d'un plus court chemin, qui compte encore ${r.length} opération${r.length > 1 ? 's' : ''}.`; }
    else msg = `Vous avez demandé de l'aide : aucune suite d'opérations ne donne ${L(c)} avec ces récipients. La section 2 explique pourquoi.`; rendre(); });
  q('#tv-possible').addEventListener('click', () => { const d = pgcd(a, b), r = chemin([0, 0], a, b, c); conseil = -1;
    msg = r ? `Oui : ${c} est un multiple de pgcd(${a}, ${b}) = ${d}, et ne dépasse pas ${Math.max(a, b)}. Depuis des récipients vides, ${r.length} opérations suffisent, et il en faut au moins autant.` : `Non : toutes les quantités obtenues avec ces récipients sont des multiples de pgcd(${a}, ${b}) = ${d}, et ${c} n'en est pas un. La page a exploré tous les états accessibles sans rencontrer ${L(c)}.`; rendre(); });
  q('#tv-neuf').addEventListener('click', () => { let na, nb, nc, r; do { na = 2 + Math.floor(Math.random() * 10); nb = 2 + Math.floor(Math.random() * 10); nc = 1 + Math.floor(Math.random() * (Math.max(na, nb) - 1)); r = na !== nb && nc !== na && nc !== nb && chemin([0, 0], na, nb, nc); } while (!r || r.length < 4); debut(na, nb, nc); });
  for (const id of ['#tv-a', '#tv-b', '#tv-c']) q(id).addEventListener('change', () => { const na = +q('#tv-a').value, nb = +q('#tv-b').value; debut(na, nb, Math.min(+q('#tv-c').value, Math.max(na, nb) - 1)); });
  for (const t of [[3, 5, 4], [3, 5, 1], [4, 9, 6], [5, 7, 6], [7, 11, 2], [6, 9, 4]]) { const bt = document.createElement('button'); bt.type = 'button'; bt.className = 'chip'; bt.textContent = `${t[0]} et ${t[1]}, mesurer ${t[2]}`; bt.addEventListener('click', () => debut(...t)); q('#tv-ex').append(bt); }
  debut(3, 5, 4);
  return () => { vivant = false; };
}
