// Casse-tête « Le jeu de Nim », rubrique Activités, MEMO_atlas_activites.md §138 : contre la page ou à deux sur le même écran.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .nm { display: grid; gap: 10px; width: min(100%, 560px); }
.activites-act .nm-tas { display: flex; align-items: center; gap: 10px; }
.activites-act .nm-tas > span { flex: 0 0 4.6em; font: 500 13px var(--f-ui); color: var(--encre-2); }
.activites-act .nm-tas > div { display: flex; flex-wrap: wrap; gap: 5px; min-height: 30px; }
.activites-act .nm-tas button { width: 26px; height: 30px; padding: 0; border-radius: 6px; border: 1px solid var(--activites-jeu); background: var(--activites-jeu); cursor: pointer; }
.activites-act .nm-tas button.ote { background: transparent; border-style: dashed; border-color: var(--sec); cursor: default; }
.activites-act .nm-tas button.conseil { background: var(--tan); border-color: var(--tan); }
.activites-act .nm-tas div:hover button:hover, .activites-act .nm-tas div:hover button:hover ~ button:not(.ote) { background: var(--sec); border-color: var(--sec); }
.activites-act .nm-tour { padding: 10px 16px; border-top: 1px solid var(--filet); font: 600 15px/1.4 var(--f-ui); }
.activites-act .nm-tour b.a { color: var(--mark); } .activites-act .nm-tour b.b { color: var(--sec); }
.activites-act .nm-bin { border-collapse: collapse; font: 14px var(--f-mono); margin: 4px 0 0; }
.activites-act .nm-bin td, .activites-act .nm-bin th { padding: 3px 9px; text-align: right; border-bottom: 1px solid var(--filet); }
.activites-act .nm-bin tr.somme td { border-top: 2px solid var(--encre); font-weight: 700; }
.activites-act .nm-bin td.un { color: var(--activites-jeu); font-weight: 700; }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Jeu à deux · accessible à tous, la théorie relève de Maths Sup</p>
  <h3>Le jeu de Nim</h3>
  <p class="lede">Quelques tas d'objets. À tour de rôle, chacun en retire autant qu'il veut, mais dans un seul tas. Celui qui prend le dernier objet gagne. Le jeu semble ouvert ; il est entièrement résolu depuis 1901, et la clé tient en une addition faite en base 2, sans retenue.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Adversaire <select id="nm-mode"><option value="page" selected>la page</option><option value="deux">un ami, sur le même écran</option></select></label>
    <label id="nm-force-l">La page <select id="nm-force"><option value="1">joue parfaitement</option><option value="0" selected>se trompe parfois</option></select></label>
    <label id="nm-qui-l">Premier à jouer <select id="nm-qui"><option value="moi" selected>moi</option><option value="page">la page</option></select></label>
    <label>Tas <select id="nm-nb"><option>2</option><option selected>3</option><option>4</option><option>5</option><option>6</option></select></label>
    <label>Taille maximale <select id="nm-max"><option>3</option><option>5</option><option selected>7</option><option>9</option><option>12</option></select></label>
    <button type="button" class="primary" id="nm-neuf">Nouvelle partie</button>
    <button type="button" id="nm-rejouer">Rejouer la même</button>
    <button type="button" id="nm-annuler">Annuler</button>
    <button type="button" id="nm-conseil">Un coup</button>
  </div>
  <div class="bar"><span>Positions classiques : <span class="chips" id="nm-ex"></span></span><label><input type="checkbox" id="nm-bin"> montrer l'écriture en base 2</label></div>
  <p class="nm-tour" id="nm-tour" aria-live="polite"></p>
  <div class="jeu-plateau"><div class="nm" id="nm-plateau" role="group" aria-label="Tas d'objets"></div></div>
  <div class="jeu-etat" id="nm-etat-bin" hidden><div id="nm-table"></div></div>
  <div class="jeu-message" id="nm-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Pour jouer, cliquez sur un objet : il est retiré, avec tous ceux qui le suivent dans le même tas. On peut donc vider un tas d'un coup, ou n'y prendre qu'un objet. Le joueur qui retire le dernier objet gagne.</p>
    <p>Vous pouvez affronter la page, qui joue parfaitement ou se trompe parfois selon le réglage, ou jouer à deux sur le même écran, chacun cliquant à son tour : la page arbitre, annonce à qui est le trait et désigne le gagnant.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La somme de Nim</h4>
    <p>Écrivons les tailles des tas en base 2, les unes sous les autres, et additionnons colonne par colonne <em>sans retenue</em> : dans chaque colonne, on écrit 0 s'il y a un nombre pair de 1, et 1 sinon. Le résultat est la <b>somme de Nim</b>, notée ${K('a_1 \\oplus a_2 \\oplus \\dots \\oplus a_k')}. Cochez « montrer l'écriture en base 2 » pour la voir calculée sur la partie en cours.</p>
    <div class="def"><p><b>Théorème (Bouton, 1901).</b> Le joueur qui doit jouer a une stratégie gagnante si, et seulement si, la somme de Nim des tas n'est pas nulle. Sa stratégie : jouer, à chaque coup, de façon à rendre cette somme nulle.</p></div>
    <p>La démonstration repose sur trois faits.</p>
    <p><b>1. La position finale a une somme nulle.</b> Quand tous les tas sont vides, la somme vaut 0, et le joueur qui doit jouer a perdu : c'est son adversaire qui a pris le dernier objet.</p>
    <p><b>2. Depuis une somme nulle, tout coup donne une somme non nulle.</b> Un coup change la taille d'un seul tas, de ${K('a')} en ${K('a\'')} avec ${K('a\' \\neq a')}. Les écritures de ${K('a')} et ${K('a\'')} diffèrent dans au moins une colonne, et dans cette colonne le nombre de 1, qui était pair, devient impair.</p>
    <p><b>3. Depuis une somme non nulle, il existe un coup qui donne une somme nulle.</b> Soit ${K('s \\neq 0')} la somme, et regardons sa colonne non nulle la plus à gauche. Un tas au moins, de taille ${K('a')}, a un 1 dans cette colonne. Alors ${K('a \\oplus s < a')} : on passe de ${K('a')} à ${K('a \\oplus s')} en changeant ce 1 en 0, et en modifiant seulement des chiffres situés plus à droite. Ramener ce tas à ${K('a \\oplus s')} objets est donc un coup permis, et la nouvelle somme vaut ${K('s \\oplus s = 0')}.</p>
    <p>Concluons par récurrence sur le nombre total d'objets. Si la somme est nulle, tout coup la rend non nulle (fait 2), et l'adversaire se retrouve, avec moins d'objets, dans une position gagnante pour lui. Si elle n'est pas nulle, on la rend nulle (fait 3), et l'adversaire est alors dans une position perdante. Le fait 1 amorce la récurrence.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Une addition pas comme les autres</h4>
    <p>L'opération ${K('\\oplus')} est associative, commutative, a pour élément neutre 0, et chaque entier est son propre opposé : ${K('a \\oplus a = 0')}. C'est l'addition de l'espace vectoriel ${K('\\mathbb F_2^{\\,n}')} sur le corps à deux éléments, celui du casse-tête <a href="#activites/inversions">Tout éteindre</a>. C'est aussi le « ou exclusif » des informaticiens.</p>
    <p>Essayez la position 1, 3, 5, 7, rendue célèbre par le film <i>L'Année dernière à Marienbad</i> : sa somme de Nim est nulle. Celui qui commence perd, si l'autre connaît le théorème.</p>
  </div>
</section>
` + suite(
  "Croire qu'il faut prendre beaucoup, ou égaliser les tas, ou laisser un nombre pair d'objets. Aucune de ces règles n'est juste en général. Avec les tas 3, 4 et 5, le seul coup gagnant est de retirer deux objets du tas de 3, pour laisser 1, 4 et 5 : en effet 3 ⊕ 4 ⊕ 5 = 2, et 3 ⊕ 2 = 1. L'idée d'égaliser n'est juste que pour deux tas, où la somme est nulle exactement quand les deux tas sont égaux.",
  "Le théorème est dû à Charles L. Bouton, « Nim, a game with a complete mathematical theory », <i>Annals of Mathematics</i>, 2<sup>e</sup> série, vol. 3 (1901-1902), p. 35-39. Dans l'édifice : <a href=\"#n.n-recurrence\">Principe de récurrence</a>, sur lequel repose la conclusion, et <a href=\"#galois.gs-corps-finis\">Corps finis</a> pour le corps à deux éléments. Le chapitre de Maths Sup <a href=\"#cours/ma-14\">Espaces vectoriels et applications linéaires</a> donne le cadre de l'addition sans retenue.",
  "La somme de Nim est calculée exactement, en entiers. Quand elle joue parfaitement, la page applique le théorème : elle rend la somme nulle si elle le peut, et retire sinon un objet du plus grand tas, faute de mieux. Quand elle « se trompe parfois », elle joue un coup au hasard une fois sur deux environ. Les tas d'une nouvelle partie sont tirés au hasard. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let tas = [3, 4, 5], depart = [3, 4, 5], trait = 0, hist = [], dernier = null, conseil = null, msg = '', premier = 0, vivant = true;   // trait : 0 = premier joueur (A, ou vous), 1 = second (B, ou la page)
  const somme = t => t.reduce((a, b) => a ^ b, 0), mode = () => q('#nm-mode').value, fini = () => tas.every(x => x === 0);
  const nom = j => mode() === 'deux' ? (j === 0 ? 'Joueur A' : 'Joueur B') : (j === 0 ? 'Vous' : 'La page');
  const gagnant = t => { const s = somme(t); if (!s) return null; for (let i = 0; i < t.length; i++) if ((t[i] ^ s) < t[i]) return [i, t[i] ^ s]; return null; };
  function coupPage() { if (fini()) return; let c = gagnant(tas);
    if (q('#nm-force').value === '0' && Math.random() < 0.5) c = null;
    if (!c) { const pleins = tas.map((x, i) => i).filter(i => tas[i] > 0); if (q('#nm-force').value === '0') { const i = pleins[Math.floor(Math.random() * pleins.length)]; c = [i, Math.floor(Math.random() * tas[i])]; } else { const i = pleins.reduce((a, b) => tas[b] > tas[a] ? b : a); c = [i, tas[i] - 1]; } }
    dernier = { i: c[0], avant: tas[c[0]], apres: c[1], qui: 1 }; tas[c[0]] = c[1]; trait = 0; }
  function jouer(i, reste) { if (fini() || reste >= tas[i]) return; hist.push({ tas: tas.slice(), trait, dernier }); conseil = null; msg = '';
    dernier = { i, avant: tas[i], apres: reste, qui: trait }; tas[i] = reste; trait = 1 - trait;
    if (mode() === 'page' && !fini() && trait === 1) { const d = dernier; coupPage(); msg = `Vous avez retiré ${d.avant - d.apres} objet${d.avant - d.apres > 1 ? 's' : ''} du tas ${d.i + 1}. La page en a retiré ${dernier.avant - dernier.apres} du tas ${dernier.i + 1} (en pointillés).`; }
    rendre(); }
  function debut(t) { tas = t.slice(); depart = t.slice(); hist = []; dernier = null; conseil = null; msg = ''; trait = 0;
    if (mode() === 'page' && q('#nm-qui').value === 'page') { trait = 1; coupPage(); msg = `La page a commencé : elle a retiré ${dernier.avant - dernier.apres} objet${dernier.avant - dernier.apres > 1 ? 's' : ''} du tas ${dernier.i + 1}.`; }
    rendre(); }
  const hasard = () => { const n = +q('#nm-nb').value, m = +q('#nm-max').value; return Array.from({ length: n }, () => 1 + Math.floor(Math.random() * m)); };
  function rendre() {
    if (!vivant) return;
    const deux = mode() === 'deux'; q('#nm-force-l').hidden = deux; q('#nm-qui-l').hidden = deux;
    const P = q('#nm-plateau'); P.innerHTML = tas.map((n, i) => { const fant = dernier && dernier.i === i ? dernier.avant - dernier.apres : 0;
      return `<div class="nm-tas"><span>Tas ${i + 1} : ${n}</span><div>${Array.from({ length: n }, (_, k) => `<button type="button" data-i="${i}" data-k="${k}" class="${conseil && conseil[0] === i && k >= conseil[1] ? 'conseil' : ''}" aria-label="Tas ${i + 1} : en laisser ${k}, en retirer ${n - k}"></button>`).join('')}${Array.from({ length: fant }, () => '<button type="button" class="ote" disabled aria-hidden="true"></button>').join('')}</div></div>`; }).join('');
    const f = fini(), vainqueur = f ? 1 - trait : -1;
    ecrire(q('#nm-tour'), f ? `Partie terminée : <b class="${vainqueur ? 'b' : 'a'}">${nom(vainqueur)}</b> ${deux || vainqueur ? 'a' : 'avez'} pris le dernier objet et gagne${deux || vainqueur ? '' : 'z'}.` : `Au trait : <b class="${trait ? 'b' : 'a'}">${nom(trait)}</b>.`, true);
    q('#nm-annuler').disabled = !hist.length; q('#nm-conseil').disabled = f;
    const m = q('#nm-message'); m.className = 'jeu-message' + (f ? (deux || vainqueur === 0 ? ' gagne' : ' bloque') : '');
    ecrire(m, f ? (deux ? `${nom(vainqueur)} gagne. « Rejouer la même » reprend la position de départ, « Nouvelle partie » en tire une autre.` : vainqueur === 0 ? 'Vous avez gagné.' : 'La page a gagné. « Rejouer la même » vous laisse retenter votre chance depuis la même position.') : msg || 'Cliquez sur un objet pour le retirer, avec tous ceux qui le suivent dans son tas.');
    const bin = q('#nm-bin').checked; q('#nm-etat-bin').hidden = !bin;
    if (bin) { const w = Math.max(1, Math.max(...depart, 1).toString(2).length), b = x => x.toString(2).padStart(w, '0').split('').map(c => `<td class="${c === '1' ? 'un' : ''}">${c}</td>`).join(''), s = somme(tas);
      ecrire(q('#nm-table'), `<table class="nm-bin"><tbody>${tas.map((x, i) => `<tr><th>tas ${i + 1}</th><td>${x}</td><td>=</td>${b(x)}</tr>`).join('')}<tr class="somme"><th>somme de Nim</th><td>${s}</td><td>=</td>${b(s)}</tr></tbody></table><p style="margin:8px 0 0;font:14px/1.45 var(--f-ui)">${f ? '' : s ? `La somme n'est pas nulle : ${nom(trait).toLowerCase() === 'vous' ? 'vous pouvez' : nom(trait) + ' peut'} gagner, en la rendant nulle.` : `La somme est nulle : quel que soit le coup joué, l'adversaire pourra la rendre nulle à nouveau.`}</p>`, true); }
  }
  q('#nm-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) jouer(+b.dataset.i, +b.dataset.k); });
  q('#nm-neuf').addEventListener('click', () => debut(hasard())); q('#nm-rejouer').addEventListener('click', () => debut(depart));
  q('#nm-annuler').addEventListener('click', () => { const h = hist.pop(); if (!h) return; tas = h.tas; trait = h.trait; dernier = h.dernier; conseil = null; msg = ''; rendre(); });
  q('#nm-conseil').addEventListener('click', () => { const c = gagnant(tas); if (c) { conseil = c; msg = `Un coup gagnant : retirer ${tas[c[0]] - c[1]} objet${tas[c[0]] - c[1] > 1 ? 's' : ''} du tas ${c[0] + 1} (en vert), pour en laisser ${c[1]}. La somme de Nim devient nulle.`; } else { conseil = null; msg = 'Vous avez demandé de l\'aide : la somme de Nim est nulle, aucun coup ne gagne contre un adversaire qui joue bien. Jouez, et espérez une erreur.'; } rendre(); });
  for (const t of [[3, 4, 5], [1, 3, 5, 7], [2, 2], [1, 2, 3], [7, 9, 12]]) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = t.join(', '); b.addEventListener('click', () => debut(t)); q('#nm-ex').append(b); }
  for (const id of ['#nm-mode', '#nm-qui']) q(id).addEventListener('change', () => debut(depart)); q('#nm-force').addEventListener('change', rendre);
  for (const id of ['#nm-nb', '#nm-max']) q(id).addEventListener('change', () => debut(hasard())); q('#nm-bin').addEventListener('change', rendre);
  debut([3, 4, 5]);
  return () => { vivant = false; };
}
