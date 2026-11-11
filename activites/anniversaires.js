// Exploration « Le paradoxe des anniversaires » (rubrique Activités, MEMO_atlas_activites.md §128).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, etiquette, pastille, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .an-groupe { display: flex; flex-wrap: wrap; gap: 5px; margin: 10px 0 4px; padding: 0; list-style: none; }
.activites-act .an-groupe li { font: 500 12px var(--f-mono); padding: 2px 7px; border: 1px solid var(--filet); border-radius: 5px; color: var(--encre-douce); }
.activites-act .an-groupe li.meme { border-color: var(--sec); color: var(--sec); font-weight: 700; background: color-mix(in srgb, var(--sec) 12%, transparent); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Dénombrement</p>
  <h3>Le paradoxe des anniversaires</h3>
  <p class="lede">Dans une classe de 23 élèves, il y a plus d'une chance sur deux que deux d'entre eux fêtent leur anniversaire le même jour. Ce n'est pas un paradoxe, c'est un calcul de dénombrement dont le résultat heurte l'intuition, parce que l'on compte mal les paires.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Compter les groupes sans coïncidence</h4>
    <p>On suppose les <i>d</i> jours équiprobables et les naissances indépendantes. Un groupe de <i>n</i> personnes correspond à une liste de <i>n</i> jours : il y en a <i>d<sup>n</sup></i>. Les listes sans répétition sont au nombre de <i>d</i>(<i>d</i> − 1)…(<i>d</i> − <i>n</i> + 1). La probabilité d'au moins une coïncidence est donc</p>
    <p class="def">P(<i>n</i>) = 1 − <i>d</i>(<i>d</i> − 1)…(<i>d</i> − <i>n</i> + 1)/<i>d<sup>n</sup></i> = 1 − (1 − 1/<i>d</i>)(1 − 2/<i>d</i>)…(1 − (<i>n</i> − 1)/<i>d</i>).</p>
    <p>La <b class="c-sec">courbe orange</b> donne cette probabilité en fonction de <i>n</i>. La <b class="c-mark">courbe bleue</b> répond à une autre question, que l'on confond souvent avec la première : la probabilité qu'une personne au moins du groupe ait le même anniversaire que <em>vous</em>. Choisissez le calendrier : <span class="chips" id="an-d"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="an-fig" class="moyen" aria-label="Probabilité d'une coïncidence d'anniversaires en fonction de la taille du groupe"></canvas>
      <div class="side">
        <h5>Pour ce groupe</h5>
        <dl class="lectures" aria-live="polite">
          <dt>personnes <i>n</i></dt><dd id="an-n2"></dd>
          <dt>paires <i>n</i>(<i>n</i> − 1)/2</dt><dd id="an-paires"></dd>
          <dt>P(deux le même jour)</dt><dd id="an-p"></dd>
          <dt>P(un le même jour que vous)</dt><dd id="an-moi"></dd>
        </dl>
        <p class="verdict" id="an-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="an-n">personnes <i>n</i></label><input type="range" id="an-n" min="1" max="100" step="1" value="23"><output id="an-nv"></output>
    </div>
    <div class="bar"><button type="button" class="primary" id="an-tirer">Tirer un groupe au hasard</button><button type="button" id="an-cent">Tirer 1 000 groupes</button><span id="an-bilan" aria-live="polite"></span></div>
    <ul class="an-groupe" id="an-groupe" aria-label="Anniversaires du groupe tiré" style="padding:0 16px 12px"></ul>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi 23 suffisent</h4>
    <p>L'intuition compare 23 à 365 et conclut que c'est peu. Mais une coïncidence peut se produire dans n'importe quelle <b>paire</b> de personnes, et un groupe de 23 contient 23 × 22/2 = 253 paires. Chacune a une chance sur 365 de coïncider : 253 occasions à 1/365, cela fait beaucoup, même si ces occasions ne sont pas indépendantes.</p>
    <p>La seconde question, elle, ne met en jeu que <i>n</i> paires : celles qui vous contiennent. Sa probabilité est 1 − (1 − 1/<i>d</i>)<sup><i>n</i></sup>, et il faut cette fois 253 personnes, et non 23, pour dépasser une chance sur deux avec 365 jours.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>La certitude, par les tiroirs</h4>
    <p>Poussez <i>n</i> au-delà du nombre de jours, par exemple 13 personnes pour 12 mois : la probabilité vaut exactement 1. C'est le <b>principe des tiroirs</b> : si l'on range <i>n</i> objets dans <i>d</i> tiroirs et que <i>n</i> &gt; <i>d</i>, un tiroir en contient au moins deux. Dans la formule, le facteur 1 − <i>d</i>/<i>d</i> apparaît et annule le produit. Mais la courbe montre que la quasi-certitude arrive bien avant : avec 365 jours, 57 personnes suffisent pour dépasser 99 %.</p>
  </div>
</section>
` + suite(
  "Confondre « deux personnes du groupe ont le même anniversaire » avec « quelqu'un a le même anniversaire que moi ». Dans un groupe de 23 personnes, la première probabilité est d'environ 0,507, la seconde d'environ 0,061. L'erreur de calcul associée est d'additionner les probabilités des paires, 253/365 ≈ 0,69 : les événements ne sont pas incompatibles, et il faut passer par l'événement contraire.",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> compte les listes et les listes sans répétition utilisées ici. Dans l'édifice : <a href=\"#n.n-fini\">Ensembles finis et principe des tiroirs</a>.",
  "Les probabilités sont calculées par le produit exact des facteurs 1 − <i>k</i>/<i>d</i>, puis arrondies à 10⁻⁴. Le modèle suppose 365 jours équiprobables : il ignore le 29 février et les variations saisonnières des naissances, qui ne font qu'augmenter légèrement la probabilité d'une coïncidence. Les groupes tirés au hasard sont des simulations, différentes à chaque clic. Rien n'est enregistré ni envoyé.");

const CAL = [{ nom: '365 jours', d: 365, max: 100 }, { nom: '12 mois', d: 12, max: 14 }, { nom: '7 jours de la semaine', d: 7, max: 9 }];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'], LG = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], SEM = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const nomJour = (j, d) => { if (d === 12) return MOIS[j]; if (d === 7) return SEM[j]; let m = 0; while (j >= LG[m]) { j -= LG[m]; m++; } return (j + 1 === 1 ? '1er' : j + 1) + ' ' + MOIS[m]; };
const P = (n, d) => { let s = 1; for (let k = 1; k < n; k++) s *= Math.max(0, 1 - k / d); return 1 - s; };

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { c: 0, n: 23, groupe: null, bilan: '' };
  CAL.forEach((c, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = c.nom;
    b.addEventListener('click', () => { E.c = i; E.n = Math.min(E.n, c.max); if (i === 1) E.n = Math.min(E.n, 5); if (i === 2) E.n = Math.min(E.n, 4); E.groupe = null; E.bilan = ''; S.planifier(); }); q('#an-d').append(b); });
  q('#an-n').addEventListener('input', e => { E.n = +e.target.value; E.groupe = null; E.bilan = ''; S.planifier(); });
  const tirer = (n, d) => { const g = []; for (let i = 0; i < n; i++) g.push(Math.floor(Math.random() * d)); return g; };
  const coincide = g => new Set(g).size < g.length;
  q('#an-tirer').addEventListener('click', () => { E.groupe = tirer(E.n, CAL[E.c].d).sort((a, b) => a - b); E.bilan = ''; S.planifier(); });
  q('#an-cent').addEventListener('click', () => { let k = 0; for (let i = 0; i < 1000; i++) if (coincide(tirer(E.n, CAL[E.c].d))) k++; E.bilan = `Sur 1 000 groupes tirés, ${k} contiennent une coïncidence (fréquence ${fr(k / 1000, 3)}).`; S.planifier(); });
  function rendre(C) {
    const cal = CAL[E.c], d = cal.d, n = E.n, sl = q('#an-n'); sl.max = cal.max;
    const { ctx, w, h } = toile(q('#an-fig')), v = vue(w, h, -0.07 * cal.max, cal.max * 1.03, -0.1, 1.08);
    grille(ctx, v, C, false);
    ctx.strokeStyle = C.doux; ctx.lineWidth = 1; ctx.setLineDash([5, 4]); trait(ctx, v.X(0), v.Y(0.5), v.X(cal.max), v.Y(0.5)); ctx.setLineDash([]);
    const ligne = (f, coul) => { ctx.strokeStyle = coul; ctx.lineWidth = 2.2; ctx.beginPath(); for (let k = 1; k <= cal.max; k++) k === 1 ? ctx.moveTo(v.X(k), v.Y(f(k))) : ctx.lineTo(v.X(k), v.Y(f(k))); ctx.stroke(); if (cal.max <= 20) for (let k = 1; k <= cal.max; k++) pastille(ctx, v.X(k), v.Y(f(k)), coul, 3); };
    const moi = k => 1 - Math.pow(1 - 1 / d, k);
    ligne(moi, C.bleu); ligne(k => P(k, d), C.orange);
    ctx.strokeStyle = C.encre; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); trait(ctx, v.X(n), v.Y(0), v.X(n), v.Y(P(n, d))); ctx.setLineDash([]);
    pastille(ctx, v.X(n), v.Y(P(n, d)), C.orange, 5.5); pastille(ctx, v.X(n), v.Y(moi(n)), C.bleu, 5);
    racine.querySelectorAll('#an-d .chip').forEach((b, i) => b.setAttribute('aria-pressed', String(i === E.c)));
    if (+sl.value !== n) sl.value = n; ecrire(q('#an-nv'), String(n)); ecrire(q('#an-n2'), String(n)); ecrire(q('#an-paires'), String(n * (n - 1) / 2));
    const pn = P(n, d); ecrire(q('#an-p'), n > d ? '1 (exactement)' : fr(pn, 4)); ecrire(q('#an-moi'), fr(moi(n), 4));
    let seuil = 1; while (P(seuil, d) < 0.5) seuil++;
    ecrire(q('#an-verdict'), n > d ? `Il y a plus de personnes que de jours possibles : par le principe des tiroirs, une coïncidence est certaine.` : `Avec ${d} jours, la probabilité dépasse une chance sur deux à partir de ${seuil} personnes : ${fr(P(seuil - 1, d), 4)} pour ${seuil - 1}, ${fr(P(seuil, d), 4)} pour ${seuil}.`);
    ecrire(q('#an-bilan'), E.bilan);
    const G = q('#an-groupe');
    if (!E.groupe) ecrire(G, '', true); else { const cpt = {}; E.groupe.forEach(j => { cpt[j] = (cpt[j] || 0) + 1; }); ecrire(G, E.groupe.map(j => `<li${cpt[j] > 1 ? ' class="meme"' : ''}>${nomJour(j, d)}</li>`).join(''), true); if (!E.bilan) ecrire(q('#an-bilan'), coincide(E.groupe) ? 'Ce groupe contient une coïncidence (en orange).' : 'Aucune coïncidence dans ce groupe.'); }
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
