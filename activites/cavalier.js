// Casse-tête « La promenade du cavalier », rubrique Activités, MEMO_atlas_activites.md §138.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .cv2 { display: grid; grid-template-columns: repeat(var(--col), 1fr); width: min(100%, calc(var(--col) * 56px)); border: 2px solid var(--encre-2); border-radius: 4px; }
/* Deux gris fixes, indépendants du thème, comme pour les dominos : « claire » et « foncée » gardent leur sens en mode sombre. */
.activites-act .cv2 button { aspect-ratio: 1 / 1; padding: 0; border: 0; border-radius: 0; background: #dfe3e8; color: #1c2430; font: 600 clamp(11px, 3.4vw, 17px)/1 var(--f-mono); cursor: pointer; position: relative; }
.activites-act .cv2 button.f { background: #9aa3b0; }
.activites-act .cv2 button.vue { box-shadow: inset 0 0 0 100px color-mix(in srgb, var(--activites-jeu) 42%, transparent); }
.activites-act .cv2 button.ici { background: var(--activites-jeu); color: #fff; font-size: clamp(18px, 6vw, 30px); }
.activites-act .cv2 button.possible::after { content: ""; position: absolute; inset: 30%; border-radius: 50%; border: 3px solid #0b7a4b; background: rgba(255,255,255,.55); }
.activites-act .cv2 button.possible span { position: relative; z-index: 1; color: #0b5a38; font-size: .85em; }
.activites-act .cv2 button.conseil::after { background: #0b7a4b; }
.activites-act .cv2 button.depart { outline: 3px solid var(--sec); outline-offset: -3px; }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · accessible à tous, la théorie relève de Maths Sup</p>
  <h3>La promenade du cavalier</h3>
  <p class="lede">Le cavalier des échecs saute de deux cases dans une direction et d'une dans l'autre. Peut-il visiter toutes les cases de l'échiquier, chacune une seule fois ? Le problème ressemble à celui des ponts de Königsberg ; il est en réalité d'une tout autre nature, et bien plus difficile.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Lignes <select id="cv-l"><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option><option>8</option></select></label>
    <label>Colonnes <select id="cv-c"><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option><option>8</option></select></label>
    <button type="button" class="primary" id="cv-debut">Recommencer</button>
    <button type="button" id="cv-annuler">Annuler un saut</button>
    <button type="button" id="cv-conseil">Un saut</button>
    <button type="button" id="cv-verdict">Est-ce possible ?</button>
    <label><input type="checkbox" id="cv-sorties"> compter les sorties</label>
  </div>
  <div class="jeu-plateau"><div class="cv2" id="cv-plateau" role="group" aria-label="Échiquier du cavalier"></div></div>
  <div class="jeu-etat"><span>Cases visitées : <b id="cv-nb">0</b> sur <b id="cv-total">0</b></span><span id="cv-info"></span></div>
  <div class="jeu-message" id="cv-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>La règle</h4>
    <p>Cliquez sur une case pour y poser le cavalier, puis sur l'une des cases marquées d'un rond vert pour l'y faire sauter. Les cases déjà visitées portent le numéro de leur passage. Il faut les visiter toutes. Si, de la dernière case, le cavalier peut revenir d'un saut à la première, le parcours est dit <b>fermé</b>.</p>
    <p>« Compter les sorties » inscrit dans chaque case accessible le nombre de cases libres que l'on pourrait atteindre ensuite. Une vieille règle pratique, due à Warnsdorff, conseille d'aller toujours vers la case qui en offre le moins : elle réussit très souvent, sans qu'aucun théorème le garantisse.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que les couleurs imposent</h4>
    <p>Un saut de cavalier change toujours de couleur : il déplace d'un nombre impair de cases au total, trois, donc la somme du numéro de ligne et du numéro de colonne change de parité. Le cavalier alterne donc cases claires et cases foncées.</p>
    <div class="def"><p>Sur un échiquier qui a un nombre impair de cases, aucun parcours n'est fermé, et tout parcours commence et finit sur la couleur la plus nombreuse.</p></div>
    <p>En effet, un tel échiquier a une case de plus d'une couleur que de l'autre. Un parcours alterne les couleurs sur un nombre impair de cases : il commence et finit sur la même couleur, qui apparaît une fois de plus que l'autre ; c'est donc la couleur la plus nombreuse. Et de la dernière case à la première, de même couleur, aucun saut n'est possible. Sur l'échiquier de 5 sur 5, les coins sont de la couleur la plus nombreuse : partir d'une case de l'autre couleur, c'est échouer à coup sûr.</p>
    <p id="cv-coul" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Pourquoi c'est plus dur que les ponts</h4>
    <p>Relions deux cases quand un saut de cavalier mène de l'une à l'autre : on obtient un graphe, et l'on cherche un chemin qui passe une fois par chaque <em>sommet</em>. Pour les <a href="#activites/ponts">ponts de Königsberg</a>, il fallait passer une fois par chaque <em>trait</em>, et le théorème d'Euler répond en comptant les degrés. Pour les sommets, on ne connaît aucun critère de ce genre : il faut chercher, et la page le fait, par essais et retours en arrière.</p>
    <div class="def"><p><b>Théorème (Schwenk, 1991).</b> Un échiquier de ${K('m')} lignes et ${K('n')} colonnes, avec ${K('m \\leqslant n')}, admet un parcours fermé du cavalier, sauf dans les trois cas suivants : ${K('m')} et ${K('n')} sont tous deux impairs ; ${K('m')} vaut 1, 2 ou 4 ; ${K('m = 3')} et ${K('n')} vaut 4, 6 ou 8. <b>Admis ici</b> : le premier cas est celui que l'on vient de démontrer, les deux autres demandent des coloriages plus fins et une construction explicite des parcours.</p></div>
    <p id="cv-bilan" aria-live="polite"></p>
  </div>
</section>
` + suite(
  "Croire que le point de départ est indifférent. Sur un échiquier de 5 sur 5, treize cases sont d'une couleur et douze de l'autre : un parcours ne peut partir que de l'une des treize. L'autre confusion est de traiter ce problème comme celui des ponts : passer une fois par chaque trait et passer une fois par chaque sommet sont deux questions sans rapport, la première facile, la seconde difficile.",
  "Le théorème sur les parcours fermés a été établi par Schwenk en 1991, dans un article intitulé « Which rectangular chessboards have a knight's tour? ». Dans l'édifice : <a href=\"#rel.r-injections\">Injections, surjections, bijections</a>, pour l'argument des couleurs, et <a href=\"#n.n-recurrence\">Principe de récurrence</a>. Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> fournit les décomptes.",
  "« Un saut » et « Est-ce possible ? » lancent une recherche par essais et retours en arrière, qui essaie d'abord les cases offrant le moins de sorties ; elle est limitée à 400 000 positions examinées et distingue trois réponses : parcours trouvé, aucun parcours, recherche non aboutie. Les nombres de cases de chaque couleur sont comptés sur l'échiquier affiché. Rien n'est enregistré ni envoyé.");

const SAUTS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let L = 5, C = 5, N = 25, V = [], chemin = [], conseil = -1, msg = '', bilan = new Map(), vivant = true;
  const coul = i => (Math.floor(i / C) + i % C) % 2;
  function voisins() { V = Array.from({ length: N }, (_, i) => { const r = Math.floor(i / C), c = i % C, o = []; for (const [dr, dc] of SAUTS) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < L && cc >= 0 && cc < C) o.push(rr * C + cc); } return o; }); }
  // prolongement du chemin en parcours complet : rend la suite des cases, null (aucun), ou undefined (limite atteinte)
  function chercher(dep, budget = 400000) { const vu = new Uint8Array(N), ch = dep.slice(); dep.forEach(i => { vu[i] = 1; }); let n = 0, depasse = false;
    const sorties = i => { let s = 0; for (const j of V[i]) if (!vu[j]) s++; return s; };
    const f = () => { if (ch.length === N) return true; if (++n > budget) { depasse = true; return false; } const ici = ch[ch.length - 1], cand = V[ici].filter(j => !vu[j]).map(j => [sorties(j), j]).sort((a, b) => a[0] - b[0]);
      // élagage : une case libre sans aucune sortie, autre que la dernière à venir, condamne la branche
      for (const [s, j] of cand) { if (s === 0 && ch.length < N - 1) continue; vu[j] = 1; ch.push(j); if (f()) return true; ch.pop(); vu[j] = 0; if (depasse) return false; } return false; };
    const ok = f(); return ok ? ch : depasse ? undefined : null; }
  // existence d'un parcours sur le plateau entier, d'un départ quelconque (mis en mémoire par taille)
  function existence() { const cle = L + 'x' + C; if (bilan.has(cle)) return bilan.get(cle); let res = null, doute = false; const deps = [...Array(N).keys()].sort((a, b) => V[a].length - V[b].length);
    for (const d of deps) { const r = chercher([d], Math.floor(400000 / Math.min(N, 12))); if (r) { res = r; break; } if (r === undefined) doute = true; }
    const o = { parcours: res, doute: !res && doute }; bilan.set(cle, o); return o; }
  function rendre() {
    if (!vivant) return;
    const P = q('#cv-plateau'); P.style.setProperty('--col', C);
    if (P.children.length !== N) { P.innerHTML = ''; for (let i = 0; i < N; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; P.append(b); } }
    const ici = chemin.length ? chemin[chemin.length - 1] : -1, rang = new Map(chemin.map((c, k) => [c, k + 1])), poss = ici >= 0 ? V[ici].filter(j => !rang.has(j)) : [], montre = q('#cv-sorties').checked;
    [...P.children].forEach((b, i) => { const r = rang.get(i); b.className = (coul(i) ? 'f' : '') + (i === ici ? ' ici' : r ? ' vue' : '') + (poss.includes(i) ? ' possible' : '') + (i === conseil ? ' conseil' : '') + (chemin[0] === i && chemin.length > 1 ? ' depart' : '');
      const s = poss.includes(i) && montre ? V[i].filter(j => !rang.has(j) && j !== i).length : null;
      b.innerHTML = i === ici ? '♞' : r ? String(r) : s !== null ? `<span>${s}</span>` : '';
      b.setAttribute('aria-label', `Ligne ${Math.floor(i / C) + 1}, colonne ${i % C + 1} : ${i === ici ? 'le cavalier, saut ' + r : r ? 'visitée au saut ' + r : poss.includes(i) ? 'accessible' + (s !== null ? ', ' + s + ' sorties' : '') : 'libre'}`); });
    const fini = chemin.length === N, bloque = ici >= 0 && !fini && !poss.length, ferme = fini && V[ici].includes(chemin[0]);
    ecrire(q('#cv-nb'), entier(chemin.length)); ecrire(q('#cv-total'), entier(N));
    q('#cv-annuler').disabled = !chemin.length; q('#cv-debut').disabled = !chemin.length; q('#cv-conseil').disabled = fini;
    const m = q('#cv-message'); m.className = 'jeu-message' + (fini ? ' gagne' : bloque ? ' bloque' : '');
    ecrire(m, fini ? `Réussi : les ${N} cases sont visitées. ${ferme ? 'Le parcours est fermé : de la dernière case, un saut ramène à la première.' : 'Le parcours est ouvert : la dernière case n\'est pas à un saut de la première.'}` : bloque ? `Le cavalier est bloqué : plus aucune case libre n'est à sa portée, et il en reste ${N - chemin.length} à visiter. Annulez des sauts, ou recommencez.` : msg || (ici < 0 ? 'Cliquez sur une case pour y poser le cavalier.' : 'Cliquez sur une case marquée d\'un rond vert.'));
    const cl = [...Array(N).keys()].filter(i => !coul(i)).length;
    ecrire(q('#cv-coul'), `L'échiquier affiché, de ${L} sur ${C}, a ${cl} cases de la couleur du coin en haut à gauche et ${N - cl} de l'autre. ` + (N % 2 ? 'Le nombre de cases est impair : aucun parcours fermé n\'existe, et un parcours ne peut partir que de la couleur la plus nombreuse.' : 'Les deux couleurs sont à égalité : l\'argument des couleurs n\'interdit rien.'));
    const mm = Math.min(L, C), nn = Math.max(L, C), sansFerme = (mm % 2 && nn % 2) || [1, 2, 4].includes(mm) || (mm === 3 && [4, 6, 8].includes(nn));
    ecrire(q('#cv-bilan'), `Pour l'échiquier de ${L} sur ${C}, le théorème dit qu'${sansFerme ? 'il n\'existe aucun parcours fermé' : 'il existe un parcours fermé'}. Il ne dit rien des parcours ouverts : demandez « Est-ce possible ? » pour que la page en cherche un.`);
  }
  q('#cv-plateau').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i, ici = chemin.length ? chemin[chemin.length - 1] : -1; conseil = -1; msg = '';
    if (ici < 0) chemin = [i]; else if (V[ici].includes(i) && !chemin.includes(i)) chemin.push(i); else if (i !== ici) msg = chemin.includes(i) ? 'Cette case a déjà été visitée.' : 'Cette case n\'est pas à un saut de cavalier.';
    rendre(); });
  q('#cv-debut').addEventListener('click', () => { chemin = []; conseil = -1; msg = ''; rendre(); });
  q('#cv-annuler').addEventListener('click', () => { chemin.pop(); conseil = -1; msg = ''; rendre(); });
  q('#cv-conseil').addEventListener('click', () => { conseil = -1;
    if (!chemin.length) { const e = existence(); if (e.parcours) { chemin = [e.parcours[0]]; msg = 'Le cavalier a été posé sur une case d\'où un parcours complet existe.'; } else msg = e.doute ? 'Vous avez demandé de l\'aide : la recherche n\'a pas abouti dans sa limite.' : 'Vous avez demandé de l\'aide : sur cet échiquier, aucun parcours complet n\'existe, d\'où que l\'on parte.'; rendre(); return; }
    const r = chercher(chemin);
    if (r) { conseil = r[chemin.length]; msg = 'La case marquée d\'un rond plein vert est le début d\'une suite de sauts qui visite tout le reste.'; }
    else msg = r === null ? 'Vous avez demandé de l\'aide : depuis cette position, la page a examiné toutes les suites de sauts, et aucune ne visite toutes les cases. Annulez des sauts.' : 'Vous avez demandé de l\'aide : la recherche n\'a pas abouti dans sa limite. Elle ne permet de conclure ni dans un sens ni dans l\'autre.';
    rendre(); });
  q('#cv-verdict').addEventListener('click', () => { const e = existence(); conseil = -1;
    msg = e.parcours ? `Oui : la page a trouvé un parcours complet de cet échiquier, qui part de la case ligne ${Math.floor(e.parcours[0] / C) + 1}, colonne ${e.parcours[0] % C + 1}. À vous d'en trouver un.` : e.doute ? 'La recherche n\'a pas abouti dans sa limite : la page ne sait pas.' : 'Non : la page a essayé tous les départs et toutes les suites de sauts, et aucun parcours ne visite toutes les cases de cet échiquier.'; rendre(); });
  q('#cv-sorties').addEventListener('change', rendre);
  function taille() { L = +q('#cv-l').value; C = +q('#cv-c').value; N = L * C; voisins(); chemin = []; conseil = -1; msg = ''; rendre(); }
  q('#cv-l').addEventListener('change', taille); q('#cv-c').addEventListener('change', taille);
  taille();
  return () => { vivant = false; };
}
