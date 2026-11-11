// Exploration « Les chapeaux mélangés » (dérangements), rubrique Activités, MEMO_atlas_activites.md §130.
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .ch-rang { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; padding: 18px 12px; }
.activites-act .ch-rang button { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 54px; padding: 6px 8px 8px; border-radius: 10px; border: 1px solid var(--encre-3); background: var(--surface); color: var(--encre); cursor: pointer; font: 12px var(--f-ui); }
.activites-act .ch-rang button b { font: 700 22px var(--f-mono); color: var(--mark); }
.activites-act .ch-rang button.fixe { border-color: var(--sec); background: color-mix(in srgb, var(--sec) 14%, var(--surface)); }
.activites-act .ch-rang button.fixe b { color: var(--sec); }
.activites-act .ch-rang button.pris { outline: 3px solid var(--tan); outline-offset: 1px; }
`;

const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Dénombrement</p>
  <h3>Les chapeaux mélangés</h3>
  <p class="lede">À la sortie d'une soirée, chacun reprend un chapeau au hasard. Quelle est la probabilité que personne ne reparte avec le sien ? La réponse surprend deux fois : elle ne dépend presque pas du nombre de personnes, et elle fait apparaître le nombre e.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Mélanger, et chercher les points fixes</h4>
    <p>Chaque carte représente une personne et porte le numéro du chapeau qu'elle a reçu. Une personne qui a retrouvé le sien est un <b class="c-sec">point fixe</b> de la permutation, en orange. Mélangez, ou échangez deux chapeaux en cliquant sur deux cartes. Une distribution sans aucun point fixe s'appelle un <b>dérangement</b>.</p>
  </div>
  <div class="fig">
    <div class="ch-rang" id="ch-rang" role="group" aria-label="Chapeau reçu par chaque personne"></div>
    <div class="reglages">
      <label for="ch-n">personnes ${'<i>n</i>'}</label><input type="range" id="ch-n" min="2" max="12" step="1" value="6"><output id="ch-nv"></output>
    </div>
    <div class="bar"><button type="button" class="primary" id="ch-mel">Mélanger</button><button type="button" id="ch-mille">Mélanger 10 000 fois</button><span id="ch-etat" aria-live="polite"></span></div>
    <p id="ch-bilan" aria-live="polite" style="padding:0 16px 12px;margin:0;font:14px/1.5 var(--f-ui)"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Compter les dérangements</h4>
    <p>Notons ${K('D_n')} le nombre de dérangements de ${K('n')} objets. Regardons le chapeau reçu par la dernière personne : c'est celui d'une autre, disons de la personne ${K('k')}, ce qui laisse ${K('n-1')} choix. Deux cas se présentent alors. Ou bien la personne ${K('k')} a reçu le chapeau de la dernière : ces deux-là ont échangé, et les ${K('n-2')} autres forment un dérangement, soit ${K('D_{n-2}')} possibilités. Ou bien non : en rebaptisant « chapeau de ${K('k')} » le chapeau de la dernière personne, les ${K('n-1')} premières personnes forment un dérangement, soit ${K('D_{n-1}')} possibilités.</p>
    <div class="def"><p>Pour tout ${K('n \\geqslant 3')},</p>${KD('D_n = (n-1)\\,\\bigl(D_{n-1} + D_{n-2}\\bigr), \\qquad D_1 = 0,\\quad D_2 = 1.')}<p>On en déduit, par récurrence, la formule</p>${KD('D_n = n!\\,\\sum_{k=0}^{n} \\frac{(-1)^k}{k!} = n!\\left(1 - \\frac1{1!} + \\frac1{2!} - \\frac1{3!} + \\dots + \\frac{(-1)^n}{n!}\\right).')}</div>
    <p>La récurrence est démontrée ci-dessus. La formule close s'en déduit en vérifiant que la suite ${K('n!\\sum_{k=0}^{n} (-1)^k/k!')} satisfait la même relation et les mêmes valeurs initiales ; ce calcul n'est pas détaillé ici.</p>
    <table id="ch-tab" aria-label="Nombre de dérangements et proportion parmi les permutations"><thead><tr><th><i>n</i></th><th><i>n</i>!</th><th><i>D<sub>n</sub></i></th><th><i>D<sub>n</sub></i>/<i>n</i>!</th></tr></thead><tbody></tbody></table>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Une probabilité qui ne bouge presque plus</h4>
    <p>La probabilité que personne ne retrouve son chapeau est ${K('D_n/n!')}. La parenthèse de la formule est la somme qui définit ${K('\\mathrm e^{-1}')}, arrêtée au rang ${K('n')} : la probabilité tend donc vers ${K('1/\\mathrm e \\approx 0{,}3679')}, et très vite, l'écart étant inférieur à ${K('1/(n+1)!')}. Dès six personnes, elle vaut 0,368 à un millième près, et il en irait de même pour un million de personnes.</p>
    <p>Autre constante remarquable : le nombre moyen de personnes qui retrouvent leur chapeau vaut exactement 1, quel que soit ${K('n')}. Chaque personne a en effet une chance sur ${K('n')} de retrouver le sien, et il y a ${K('n')} personnes.</p>
  </div>
</section>
` + suite(
  "Raisonner comme si les personnes étaient indépendantes : « chacune a la probabilité 1 − 1/<i>n</i> de ne pas retrouver son chapeau, donc la probabilité cherchée est (1 − 1/<i>n</i>)<sup><i>n</i></sup> ». Les événements ne sont pas indépendants : si tous les autres ont retrouvé le leur, le dernier aussi. Pour trois personnes, ce calcul donne 8/27 ≈ 0,296 au lieu de la valeur exacte 2/6 ≈ 0,333. Les deux expressions ont la même limite 1/e, ce qui rend l'erreur difficile à repérer.",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> compte les permutations ; celui de Maths Sup <a href=\"#cours/ma-17\">Groupe symétrique et déterminants</a> les étudie comme un groupe. Dans l'édifice : <a href=\"#v-det.v-permutations\">Groupe symétrique et signature</a>, et <a href=\"#ar-exp.ex-serie\">L'exponentielle comme limite de polynômes</a> pour la somme qui définit 1/e.",
  "Les nombres <i>D<sub>n</sub></i> sont calculés par la récurrence, en entiers exacts, et comparés à la formule close. Les mélanges sont tirés uniformément parmi les <i>n</i>! permutations (algorithme de Fisher-Yates) : les fréquences affichées après 10 000 mélanges sont des simulations, à comparer aux probabilités exactes du tableau. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let n = 6, s = [], pris = -1, bilan = '', vivant = true;
  const D = [1, 0]; for (let k = 2; k <= 12; k++) D.push((k - 1) * (D[k - 1] + D[k - 2]));
  const F = [1]; for (let k = 1; k <= 12; k++) F.push(F[k - 1] * k);
  const ent = x => x.toLocaleString('fr-FR').replace(/[  ]/g, ' ');
  const melange = () => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function rendre() {
    if (!vivant) return;
    const R = q('#ch-rang'); if (R.children.length !== n) { R.innerHTML = ''; for (let i = 0; i < n; i++) { const b = document.createElement('button'); b.type = 'button'; b.dataset.i = i; R.append(b); } }
    let fixes = 0; [...R.children].forEach((b, i) => { const f = s[i] === i; if (f) fixes++; b.className = (f ? 'fixe' : '') + (i === pris ? ' pris' : '');
      const h = `<span>personne ${i + 1}</span><b>${s[i] + 1}</b>`; if (b.innerHTML !== h) b.innerHTML = h; b.setAttribute('aria-label', `La personne ${i + 1} a le chapeau ${s[i] + 1}${f ? ' : c\'est le sien' : ''}`); });
    ecrire(q('#ch-nv'), String(n));
    ecrire(q('#ch-etat'), fixes === 0 ? 'Aucun point fixe : c\'est un dérangement.' : fixes === 1 ? 'Une personne a retrouvé son chapeau.' : `${fixes} personnes ont retrouvé leur chapeau.`);
    ecrire(q('#ch-bilan'), bilan);
    let l = ''; for (let k = 1; k <= 12; k++) l += `<tr${k === n ? ' class="now"' : ''}><td>${k}</td><td>${ent(F[k])}</td><td>${ent(D[k])}</td><td>${fr(D[k] / F[k], 6)}</td></tr>`;
    ecrire(q('#ch-tab').tBodies[0], l, true);
  }
  q('#ch-n').addEventListener('input', e => { n = +e.target.value; s = melange(); pris = -1; bilan = ''; rendre(); });
  q('#ch-mel').addEventListener('click', () => { s = melange(); pris = -1; rendre(); });
  q('#ch-mille').addEventListener('click', () => { let sans = 0, tot = 0; for (let t = 0; t < 10000; t++) { const a = melange(); let f = 0; for (let i = 0; i < n; i++) if (a[i] === i) f++; if (!f) sans++; tot += f; }
    bilan = `Sur 10 000 mélanges de ${n} chapeaux : ${ent(sans)} dérangements, soit une fréquence de ${fr(sans / 10000, 4)} (probabilité exacte : ${fr(D[n] / F[n], 4)}) ; en moyenne ${fr(tot / 10000, 3)} personne a retrouvé son chapeau (valeur exacte : 1).`; rendre(); });
  q('#ch-rang').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b) return; const i = +b.dataset.i;
    if (pris < 0) pris = i; else { [s[pris], s[i]] = [s[i], s[pris]]; pris = -1; } rendre(); });
  s = melange(); rendre();
  return () => { vivant = false; };
}
