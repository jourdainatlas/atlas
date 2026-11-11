// Casse-tête « Dominos sur l'échiquier », rubrique Activités, MEMO_atlas_activites.md §130.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .dm2 { display: grid; grid-template-columns: repeat(var(--col), 1fr); width: min(100%, calc(var(--col) * 52px)); border: 2px solid var(--encre-2); border-radius: 4px; }
/* Deux gris fixes, indépendants du thème : « claire » et « foncée » doivent garder leur sens en mode sombre. */
.activites-act .dm2 button { aspect-ratio: 1 / 1; padding: 0; border: 0; border-radius: 0; cursor: pointer; position: relative; background: #dfe3e8; }
.activites-act .dm2 button.f { background: #8d96a3; }
.activites-act .dm2 button.ote { background: repeating-linear-gradient(45deg, transparent 0 5px, color-mix(in srgb, var(--encre) 30%, transparent) 5px 6px), var(--papier); cursor: default; }
.activites-act .dm2 button.choisie { outline: 3px solid var(--sec); outline-offset: -3px; }
.activites-act .dm2 button.conseil::before { content: ""; position: absolute; inset: 30%; border-radius: 50%; background: var(--tan); }
.activites-act .dm2 button.d::after { content: ""; position: absolute; background: var(--activites-jeu); border: 2px solid #f4f6f8; }
.activites-act .dm2 button.d.g::after { inset: 12% 0 12% 12%; border-right: 0; border-radius: 9px 0 0 9px; }
.activites-act .dm2 button.d.dr::after { inset: 12% 12% 12% 0; border-left: 0; border-radius: 0 9px 9px 0; }
.activites-act .dm2 button.d.h::after { inset: 12% 12% 0 12%; border-bottom: 0; border-radius: 9px 9px 0 0; }
.activites-act .dm2 button.d.b::after { inset: 0 12% 12% 12%; border-top: 0; border-radius: 0 0 9px 9px; }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible dès la Première</p>
  <h3>Dominos sur l'échiquier</h3>
  <p class="lede">Un domino couvre deux cases voisines. Recouvrir un échiquier entier est facile. Retirez-lui deux cases, et tout dépend de leur couleur : c'est l'un des plus beaux exemples d'une impossibilité que l'on démontre en une ligne, sans essayer aucun pavage.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Lignes <select id="do-l"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option selected>8</option></select></label>
    <label>Colonnes <select id="do-c"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option selected>8</option></select></label>
    <label>Plateau <select id="do-mode"><option value="coins" selected>deux coins opposés retirés</option><option value="entier">entier</option><option value="diff">deux cases retirées, de couleurs différentes</option><option value="meme">deux cases retirées, de même couleur</option></select></label>
    <button type="button" class="primary" id="do-debut">Retirer tous les dominos</button>
    <button type="button" id="do-annuler">Annuler</button>
    <button type="button" id="do-conseil">Un domino</button>
    <button type="button" id="do-verdict">Est-ce possible ?</button>
  </div>
  <div class="jeu-plateau"><div class="dm2" id="do-plateau" role="group" aria-label="Échiquier à recouvrir de dominos"></div></div>
  <div class="jeu-etat"><span>Dominos posés : <b id="do-nb">0</b></span><span>Cases libres claires : <b id="do-cl">0</b></span><span>Cases libres foncées : <b id="do-fo">0</b></span></div>
  <div class="jeu-message" id="do-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Cliquez sur une case libre, puis sur une case libre voisine : un domino les recouvre. Cliquez sur un domino pour le retirer. Les cases hachurées ont été retirées du plateau. Il faut recouvrir toutes les autres. Essayez d'abord, avec le plateau proposé à l'ouverture, avant de lire la suite ou de demander le verdict.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Compter les couleurs suffit à dire non</h4>
    <p>Deux cases voisines sont toujours de couleurs différentes : un domino couvre donc une case claire et une case foncée. Un plateau recouvert de dominos a autant de cases claires que de cases foncées, chaque domino mettant en regard une case de chaque couleur.</p>
    <div class="def"><p>Si un plateau n'a pas autant de cases claires que de cases foncées, aucun pavage par dominos n'existe. Deux coins opposés d'un échiquier de 8 sur 8 ont la même couleur : une fois retirés, il reste 30 cases d'une couleur et 32 de l'autre, et le pavage est impossible.</p></div>
    <p>Regardez les deux compteurs sous le plateau : chaque domino posé les fait baisser tous les deux de 1. Leur différence ne change jamais. C'est un <b>invariant</b> : si elle n'est pas nulle au départ, elle ne le sera pas à la fin.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Et quand les couleurs s'équilibrent ?</h4>
    <p>La condition est nécessaire ; elle n'est pas suffisante en général, car un plateau peut avoir autant de cases de chaque couleur et une case isolée dans un coin. Mais pour un échiquier auquel on retire une case claire et une case foncée, où qu'elles soient, le pavage existe toujours : c'est le théorème de Gomory. L'idée est de tracer un circuit fermé qui passe par toutes les cases ; les deux cases retirées le coupent en deux tronçons, chacun de longueur paire, que l'on recouvre de dominos mis bout à bout. Ce résultat est <b>admis ici</b> : la page se contente de le constater, en cherchant un pavage pour le plateau affiché.</p>
    <p id="do-compte" aria-live="polite"></p>
  </div>
</section>
` + suite(
  "Croire que l'on a « presque réussi » et qu'il suffirait de mieux s'y prendre. Sur l'échiquier privé de deux coins opposés, on arrive facilement à poser 30 dominos, et il reste alors deux cases, toujours de la même couleur, jamais voisines. Aucune habileté n'y changera rien : l'impossibilité ne vient pas de la façon de poser, mais du décompte des couleurs. L'erreur inverse existe aussi : un décompte équilibré ne garantit pas, à lui seul, qu'un pavage existe.",
  "L'argument met en bijection les cases claires et les cases foncées d'un plateau pavé : dans l'édifice, <a href=\"#rel.r-injections\">Injections, surjections, bijections</a>. Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> emploie le même principe : deux ensembles en bijection ont le même nombre d'éléments.",
  "Pour répondre à « Est-ce possible ? » et pour conseiller un domino, la page cherche un couplage parfait entre cases libres claires et foncées voisines (algorithme des chemins augmentants) : la réponse est exacte, non estimée. Le nombre de pavages du plateau entier est calculé colonne par colonne ; pour 8 sur 8 on retrouve 12 988 816 = 3 604², valeur établie en 1961 par Kasteleyn et, indépendamment, par Temperley et Fisher. Le problème de l'échiquier écorné est attribué à Max Black (1946) et a été popularisé par Martin Gardner. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let L = 8, K = 8, N = 64, ote = new Set(), dom = [], choisie = -1, conseil = [], msg = '', vivant = true;
  const coul = i => (Math.floor(i / K) + i % K) % 2;   // 0 : claire, 1 : foncée
  const voisines = i => { const y = Math.floor(i / K), x = i % K, o = []; if (x > 0) o.push(i - 1); if (x < K - 1) o.push(i + 1); if (y > 0) o.push(i - K); if (y < L - 1) o.push(i + K); return o; };
  const couvertes = () => { const m = new Map(); dom.forEach(([a, b], k) => { m.set(a, k); m.set(b, k); }); return m; };
  // Couplage maximal des cases libres (chemins augmentants) ; rend la liste des paires.
  function couplage(occ) { const lib = i => !ote.has(i) && !occ.has(i), paire = new Map();
    const essayer = (u, vus) => { for (const v of voisines(u)) { if (!lib(v) || vus.has(v)) continue; vus.add(v); if (!paire.has(v) || essayer(paire.get(v), vus)) { paire.set(v, u); return true; } } return false; };
    let n = 0; for (let i = 0; i < N; i++) if (lib(i) && coul(i) === 0 && essayer(i, new Set())) n++;
    return { n, paires: [...paire].map(([v, u]) => [u, v]) }; }
  // Nombre de pavages du plateau entier L × K, par profils (colonne par colonne).
  function pavages() { if (L * K % 2) return 0; let cur = new Map([[0, 1]]);
    for (let c = 0; c < K; c++) for (let r = 0; r < L; r++) { const nx = new Map(), add = (m, v) => nx.set(m, (nx.get(m) || 0) + v);
      for (const [m, v] of cur) { if (m & 1) add(m >> 1, v); else { add((m >> 1) | (1 << (L - 1)), v); if (r < L - 1 && !(m & 2)) add((m >> 1) | 1, v); } } cur = nx; }
    return cur.get(0) || 0; }
  function plateau() { ote = new Set(); const mode = q('#do-mode').value;
    if (mode === 'coins') { ote.add(0); ote.add(N - 1); if (coul(0) !== coul(N - 1)) { ote.delete(N - 1); ote.add(N - K); } }
    else if (mode !== 'entier' && N > 2) { let a, b, t = 0; do { a = Math.floor(Math.random() * N); b = Math.floor(Math.random() * N); t++; } while ((a === b || (mode === 'diff') !== (coul(a) !== coul(b))) && t < 5000); if (t < 5000) { ote.add(a); ote.add(b); } }
    dom = []; choisie = -1; conseil = []; msg = ''; }
  function rendre() {
    if (!vivant) return;
    const P = q('#do-plateau'); P.style.setProperty('--col', K);
    if (P.children.length !== N) { P.innerHTML = ''; for (let i = 0; i < N; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; P.append(b); } }
    const occ = couvertes(); let cl = 0, fo = 0, paireLibre = false;
    for (let i = 0; i < N; i++) if (!ote.has(i) && !occ.has(i)) { coul(i) ? fo++ : cl++; if (voisines(i).some(j => !ote.has(j) && !occ.has(j))) paireLibre = true; }
    [...P.children].forEach((b, i) => { let c = coul(i) ? 'f' : ''; const k = occ.get(i);
      if (ote.has(i)) c = 'ote'; else if (k !== undefined) { const [a, bb] = dom[k], autre = a === i ? bb : a; c += ' d ' + (autre === i + 1 ? 'g' : autre === i - 1 ? 'dr' : autre === i + K ? 'h' : 'b'); }
      if (i === choisie) c += ' choisie'; if (conseil.includes(i)) c += ' conseil'; b.className = c; b.disabled = ote.has(i);
      b.setAttribute('aria-label', `Ligne ${Math.floor(i / K) + 1}, colonne ${i % K + 1} : ${ote.has(i) ? 'case retirée' : (coul(i) ? 'case foncée' : 'case claire') + (k !== undefined ? ', couverte par un domino' : ', libre')}`); });
    ecrire(q('#do-nb'), entier(dom.length)); ecrire(q('#do-cl'), entier(cl)); ecrire(q('#do-fo'), entier(fo));
    q('#do-annuler').disabled = !dom.length; const gagne = cl + fo === 0, bloque = !gagne && !paireLibre;
    const m = q('#do-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : bloque ? ' bloque' : '');
    ecrire(m, gagne ? `Réussi : le plateau est recouvert par ${dom.length} dominos.` : bloque ? `Impasse : il reste ${cl + fo} case${cl + fo > 1 ? 's' : ''} libre${cl + fo > 1 ? 's' : ''} (${cl} claire${cl > 1 ? 's' : ''}, ${fo} foncée${fo > 1 ? 's' : ''}) et plus aucune paire de cases voisines. Retirez des dominos, ou demandez si le pavage est possible.` : msg || (choisie >= 0 ? 'Cliquez sur une case libre voisine pour poser le domino.' : dom.length ? 'Continuez.' : 'Cliquez sur une case libre, puis sur une case voisine.'));
    const np = pavages();
    ecrire(q('#do-compte'), `Le plateau entier de ${L} sur ${K} ` + (np ? `admet ${entier(np)} pavage${np > 1 ? 's' : ''} par dominos.` : `a un nombre impair de cases (${N}) : il n'admet aucun pavage.`) + (L === 8 && K === 8 ? ' C\'est le carré de 3 604. Il suffit pourtant de retirer deux coins opposés pour qu\'il n\'en reste aucun.' : ''));
  }
  q('#do-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b || b.disabled) return; const i = +b.dataset.i, occ = couvertes(); conseil = []; msg = '';
    if (occ.has(i)) { dom.splice(occ.get(i), 1); choisie = -1; }
    else if (choisie < 0) choisie = i;
    else if (choisie === i) choisie = -1;
    else if (voisines(choisie).includes(i)) { dom.push([choisie, i]); choisie = -1; }
    else choisie = i;
    rendre(); });
  q('#do-debut').addEventListener('click', () => { dom = []; choisie = -1; conseil = []; msg = ''; rendre(); });
  q('#do-annuler').addEventListener('click', () => { dom.pop(); choisie = -1; conseil = []; msg = ''; rendre(); });
  const libres = occ => { let n = 0, cl = 0; for (let i = 0; i < N; i++) if (!ote.has(i) && !occ.has(i)) { n++; if (!coul(i)) cl++; } return [n, cl]; };
  q('#do-conseil').addEventListener('click', () => { const occ = couvertes(), [n] = libres(occ), c = couplage(occ); choisie = -1;
    if (n && 2 * c.n === n) { conseil = c.paires[0]; msg = 'Les deux cases marquées d\'un point vert peuvent recevoir un domino sans fermer la porte.'; }
    else { conseil = []; msg = n ? 'Vous avez demandé de l\'aide : depuis cette position, plus aucun pavage n\'est possible. Retirez des dominos, ou demandez si le plateau lui-même peut être pavé.' : ''; } rendre(); });
  q('#do-verdict').addEventListener('click', () => { const vide = new Map(), [n, cl] = libres(vide), fo = n - cl, c = couplage(vide); conseil = []; choisie = -1;
    msg = cl !== fo ? `Non. Ce plateau a ${cl} cases claires et ${fo} cases foncées ; or chaque domino couvre une case de chaque couleur. Aucun pavage n'existe, quelle que soit la façon de s'y prendre.`
      : 2 * c.n === n ? `Oui. Ce plateau a ${cl} cases claires et ${fo} cases foncées, et la page a trouvé un pavage : il existe donc. À vous de le construire.`
      : `Non, bien que ce plateau ait autant de cases claires que de cases foncées (${cl}) : la recherche exhaustive d'un couplage ne recouvre au mieux que ${2 * c.n} cases sur ${n}. Le décompte des couleurs est une condition nécessaire, pas suffisante.`; rendre(); });
  function taille() { L = +q('#do-l').value; K = +q('#do-c').value; N = L * K; plateau(); rendre(); }
  q('#do-l').addEventListener('change', taille); q('#do-c').addEventListener('change', taille); q('#do-mode').addEventListener('change', taille);
  taille();
  return () => { vivant = false; };
}
