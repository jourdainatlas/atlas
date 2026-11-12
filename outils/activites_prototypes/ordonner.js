// PROTOTYPE, non publié : « Démonstrations à remettre en ordre », sous-rubrique Raisonner (MEMO_atlas_activites.md §143).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .jeu { --activites-jeu: var(--rouge); }
.activites-act .od-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .od-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .od-duo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0; }
.activites-act .od-duo > div { padding: 12px 16px 16px; min-width: 0; } .activites-act .od-duo > div + div { border-left: 1px solid var(--filet); }
.activites-act .od-duo h5 { font: 500 12px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; color: var(--encre-3); margin: 0 0 10px; }
.activites-act .od-liste { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; counter-reset: etape; }
.activites-act .od-pas { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 8px; align-items: start; padding: 9px 10px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); font: 15.5px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .od-preuve .od-pas { counter-increment: etape; } .activites-act .od-preuve .od-pas::before { content: counter(etape); font: 700 13px var(--f-mono); color: var(--activites-jeu); padding-top: 3px; min-width: 1.2em; }
.activites-act .od-reserve .od-pas { grid-template-columns: minmax(0, 1fr) auto; cursor: pointer; } .activites-act .od-reserve .od-pas:hover { border-color: var(--activites-jeu); }
.activites-act .od-pas.faute { border-color: var(--rouge); box-shadow: inset 3px 0 0 var(--rouge); } .activites-act .od-pas.juste { border-color: var(--tan); } .activites-act .od-pas.conseil { border-color: var(--tan); box-shadow: inset 0 0 0 2px var(--tan); }
.activites-act .od-pas .cmd { display: flex; gap: 4px; } .activites-act .od-pas .cmd button, .activites-act .od-reserve .od-pas button { width: 30px; height: 30px; padding: 0; border-radius: 6px; border: 1px solid var(--encre-3); background: var(--surface); color: var(--encre); font: 600 15px var(--f-ui); }
.activites-act .od-pas .cmd button:disabled { opacity: .3; }
.activites-act .od-vide { padding: 18px 10px; border: 1px dashed var(--encre-3); border-radius: 6px; font: 14px var(--f-ui); color: var(--encre-3); text-align: center; }
@media (max-width: 760px) { .activites-act .od-duo { grid-template-columns: 1fr; } .activites-act .od-duo > div + div { border-left: 0; border-top: 1px solid var(--filet); } }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Démonstrations à remettre en ordre</h3>
  <p class="lede">Une démonstration n'est pas une liste de phrases vraies : chaque étape s'appuie sur celles qui la précèdent. Ici, les étapes d'une démonstration classique sont mélangées, et une phrase fausse s'est glissée parmi elles. À vous de reconstruire le raisonnement, sans l'intrus.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Démonstration <select id="od-piece"></select></label>
    <button type="button" class="primary" id="od-verifier">Vérifier</button>
    <button type="button" id="od-indice">Un indice</button>
    <button type="button" id="od-depart">Tout remettre en réserve</button>
  </div>
  <p class="od-enonce" id="od-enonce"></p>
  <div class="od-duo">
    <div><h5>Votre démonstration</h5><ol class="od-liste od-preuve" id="od-preuve"></ol></div>
    <div><h5>La réserve</h5><ul class="od-liste od-reserve" id="od-reserve"></ul></div>
  </div>
  <div class="jeu-message" id="od-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Cliquez sur une phrase de la réserve pour l'ajouter à la fin de votre démonstration. Les flèches la montent ou la descendent, la croix la renvoie en réserve. Quand le raisonnement vous paraît complet, cliquez sur « Vérifier ». La page ne juge rien avant : elle vous laisse chercher.</p>
    <p>La vérification ne compare pas votre texte à un modèle. Pour chaque étape, la page connaît les étapes dont elle a besoin : elle contrôle que celles-ci figurent plus haut. Plusieurs ordres peuvent donc être justes. Dans une récurrence, par exemple, rien n'oblige à écrire l'initialisation avant l'hérédité ; il faut seulement que les deux précèdent la conclusion.</p>
    <p>Si quelque chose ne va pas, la page désigne la première étape en défaut et dit ce qui lui manque : « cette étape emploie un nombre qui n'a pas encore été introduit ». Si vous avez retenu l'intrus, elle explique pourquoi la phrase est fausse, ou pourquoi elle ne démontre pas ce qu'elle prétend.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Ce que l'exercice apprend</h4>
    <p>Dans tout le site, aucun objet n'est employé avant d'avoir été défini, et aucun résultat avant d'avoir été démontré : c'est la règle de l'édifice, où chaque fiche repose sur celles qui la précèdent. Une démonstration obéit à la même règle, à petite échelle. Remettre des étapes en ordre oblige à se demander, pour chaque phrase : de quoi a-t-elle besoin, et qu'apporte-t-elle ?</p>
    <p>Les intrus sont choisis parmi les erreurs que l'on rencontre vraiment : une réciproque prise pour l'énoncé direct, une conclusion plus forte que ce que le raisonnement permet, une hypothèse de récurrence qui suppose ce qu'il faut démontrer.</p>
  </div>
</section>
` + suite(
  "Juger une étape sur sa seule vérité. Une phrase vraie peut être mal placée, parce qu'elle emploie un objet qui n'existe pas encore, ou mal justifiée, parce que l'argument invoqué ne la démontre pas. « Le carré d'un nombre pair est pair, donc <i>p</i> est pair » part d'un fait exact et arrive à une conclusion exacte, mais le « donc » est faux : c'est la réciproque qu'il fallait.",
  "La récurrence repose sur la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a> de l'édifice. Le chapitre de Maths Sup <a href=\"#cours/ma-12\">Arithmétique dans ℤ</a> établit les propriétés de divisibilité et des nombres premiers employées dans les deux premières démonstrations.",
  "Chaque étape porte la liste des étapes dont elle dépend. « Vérifier » parcourt votre démonstration de haut en bas et s'arrête à la première étape dont une dépendance manque plus haut, à l'intrus s'il est présent, ou constate qu'il manque des étapes. L'indice désigne une étape de la réserve qui peut être écrite dès maintenant. Rien n'est enregistré ni envoyé.");

// Une pièce : énoncé, étapes { id, t (texte), dep: { id: phrase dite quand cette dépendance manque } }, intrus { t, pourquoi }.
const PIECES = [
  { nom: 'Irrationalité de √2', enonce: `Le nombre ${K('\\sqrt2')} est irrationnel.`, etapes: [
    { id: 'a', t: `Raisonnons par l'absurde : supposons qu'il existe deux entiers ${K('p > 0')} et ${K('q > 0')}, sans diviseur commun autre que 1, tels que ${K('\\sqrt2 = \\dfrac pq')}.`, dep: {} },
    { id: 'b', t: `En élevant au carré, on obtient ${K('p^2 = 2q^2')}.`, dep: { a: `Cette étape parle de ${K('p')} et de ${K('q')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Donc ${K('p^2')} est pair. Or le carré d'un nombre impair est impair : ${K('p')} est donc pair, et il existe un entier ${K('k')} tel que ${K('p = 2k')}.`, dep: { b: `Pour dire que ${K('p^2')} est pair, il faut avoir établi ${K('p^2 = 2q^2')}.` } },
    { id: 'd', t: `En reportant dans l'égalité, ${K('4k^2 = 2q^2')}, c'est-à-dire ${K('q^2 = 2k^2')}.`, dep: { c: `Cette étape emploie l'entier ${K('k')}, qui n'a pas encore été introduit.`, b: `Il faut disposer de l'égalité ${K('p^2 = 2q^2')} pour y reporter.` } },
    { id: 'e', t: `Par le même argument, ${K('q^2')} est pair, donc ${K('q')} est pair.`, dep: { d: `Pour dire que ${K('q^2')} est pair, il faut avoir établi ${K('q^2 = 2k^2')}.`, c: `« Le même argument » renvoie à un argument qui n'a pas encore été donné.` } },
    { id: 'f', t: `Ainsi 2 divise à la fois ${K('p')} et ${K('q')}, ce qui contredit le choix de ${K('p')} et ${K('q')}. Donc ${K('\\sqrt2')} est irrationnel.`, dep: { c: `Il faut avoir établi que ${K('p')} est pair.`, e: `Il faut avoir établi que ${K('q')} est pair.`, a: `La contradiction porte sur une hypothèse qui n'a pas été posée.` } }],
    intrus: [{ id: 'x', t: `Donc ${K('p^2')} est pair. Or le carré d'un nombre pair est pair : ${K('p')} est donc pair, et il existe un entier ${K('k')} tel que ${K('p = 2k')}.`, pourquoi: `« Le carré d'un nombre pair est pair » est vrai, mais ne permet pas de conclure : cela dit que si ${K('p')} est pair alors ${K('p^2')} l'est, alors qu'on sait ici que ${K('p^2')} est pair et qu'on veut en déduire que ${K('p')} l'est. Il faut la réciproque, que l'on obtient par contraposée : le carré d'un impair est impair.` }] },
  { nom: 'Infinité des nombres premiers', enonce: `Il existe une infinité de nombres premiers.`, etapes: [
    { id: 'a', t: `Raisonnons par l'absurde : supposons qu'il n'existe qu'un nombre fini de nombres premiers, et notons-les ${K('p_1, p_2, \\dots, p_n')}.`, dep: {} },
    { id: 'b', t: `Posons ${K('N = p_1 p_2 \\cdots p_n + 1')}.`, dep: { a: `Cette étape emploie les nombres ${K('p_1, \\dots, p_n')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Comme ${K('N \\geqslant 2')}, l'entier ${K('N')} possède un diviseur premier ${K('p')}.`, dep: { b: `Cette étape parle de ${K('N')}, qui n'a pas encore été défini.` } },
    { id: 'd', t: `D'après l'hypothèse, ${K('p')} est l'un des ${K('p_i')} : il divise donc le produit ${K('p_1 p_2 \\cdots p_n')}.`, dep: { c: `Cette étape parle du nombre premier ${K('p')}, qui n'a pas encore été introduit.`, a: `« L'hypothèse » invoquée n'a pas encore été posée.` } },
    { id: 'e', t: `Divisant ${K('N')} et ${K('p_1 p_2 \\cdots p_n')}, le nombre ${K('p')} divise leur différence, qui vaut 1.`, dep: { d: `Il faut avoir établi que ${K('p')} divise le produit ${K('p_1 p_2 \\cdots p_n')}.`, c: `Il faut avoir établi que ${K('p')} divise ${K('N')}.` } },
    { id: 'f', t: `C'est impossible, puisque ${K('p \\geqslant 2')}. Il existe donc une infinité de nombres premiers.`, dep: { e: `La contradiction vient de ce que ${K('p')} divise 1, ce qui n'a pas encore été établi.` } }],
    intrus: [{ id: 'x', t: `Aucun des ${K('p_i')} ne divise ${K('N')}, donc ${K('N')} est un nombre premier, différent de tous les ${K('p_i')}.`, pourquoi: `C'est l'erreur la plus répandue sur cette démonstration. Dans le raisonnement par l'absurde, la conclusion est seulement que ${K('N')} a un diviseur premier qui n'est pas dans la liste. Et hors de ce raisonnement, le produit des premiers nombres premiers augmenté de 1 n'est pas toujours premier : ${K('2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30\\,031 = 59 \\times 509')}.` }] },
  { nom: 'Somme des premiers nombres impairs', enonce: `Pour tout entier ${K('n \\geqslant 1')}, on a ${K('1 + 3 + 5 + \\dots + (2n - 1) = n^2')}.`, etapes: [
    { id: 'a', t: `Pour tout entier ${K('n \\geqslant 1')}, notons ${K('P(n)')} l'égalité ${K('1 + 3 + \\dots + (2n - 1) = n^2')}.`, dep: {} },
    { id: 'b', t: `Initialisation : pour ${K('n = 1')}, la somme se réduit à ${K('1')}, et ${K('1^2 = 1')}. Donc ${K('P(1)')} est vraie.`, dep: { a: `Cette étape parle de ${K('P(1)')}, alors que ${K('P(n)')} n'a pas encore été définie.` } },
    { id: 'c', t: `Hérédité : soit ${K('n \\geqslant 1')} un entier tel que ${K('P(n)')} soit vraie.`, dep: { a: `Cette étape parle de ${K('P(n)')}, qui n'a pas encore été définie.` } },
    { id: 'd', t: `Alors ${K('1 + 3 + \\dots + (2n - 1) + (2n + 1) = n^2 + (2n + 1)')}.`, dep: { c: `Cette égalité utilise ${K('P(n)')} : il faut avoir fixé un entier ${K('n')} pour lequel elle est supposée vraie.` } },
    { id: 'e', t: `Or ${K('n^2 + 2n + 1 = (n + 1)^2')} : c'est exactement ${K('P(n + 1)')}.`, dep: { d: `Il faut avoir calculé la somme jusqu'à ${K('2n + 1')} avant de la reconnaître.` } },
    { id: 'f', t: `Par le principe de récurrence, ${K('P(n)')} est vraie pour tout entier ${K('n \\geqslant 1')}.`, dep: { b: `Le principe de récurrence exige l'initialisation, qui ne figure pas plus haut.`, e: `Le principe de récurrence exige l'hérédité, qui n'est pas encore achevée.` } }],
    intrus: [{ id: 'x', t: `Hérédité : supposons que ${K('P(n)')} soit vraie pour tout entier ${K('n \\geqslant 1')}.`, pourquoi: `Cette phrase suppose exactement ce qu'il faut démontrer. Dans l'hérédité, on fixe <em>un</em> entier ${K('n')} pour lequel ${K('P(n)')} est vraie, et l'on en déduit ${K('P(n + 1)')} ; on ne suppose pas ${K('P(n)')} pour tous les entiers.` }] },
];

// Vérifie une démonstration (liste d'identifiants). Rend { ok } ou { pos, texte } (pos : rang de l'étape en défaut, -1 s'il manque des étapes).
export function verifier(piece, L) {
  for (let i = 0; i < L.length; i++) { const x = piece.intrus.find(e => e.id === L[i]); if (x) return { pos: i, intrus: true, texte: x.pourquoi };
    const e = piece.etapes.find(s => s.id === L[i]); for (const d in e.dep) if (!L.slice(0, i).includes(d)) return { pos: i, texte: e.dep[d] }; }
  const manque = piece.etapes.length - L.length; if (manque > 0) return { pos: -1, texte: `Tout ce qui est écrit s'enchaîne correctement, mais la démonstration n'est pas terminée : il manque ${manque} étape${manque > 1 ? 's' : ''}.` };
  return { ok: true };
}
export { PIECES };

export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], L = [], ordre = [], msg = '', cl = '', marque = -1, conseil = '', vivant = true;
  q('#od-piece').innerHTML = PIECES.map((p, i) => `<option value="${i}">${p.nom}</option>`).join('');
  const texte = id => (P.etapes.find(e => e.id === id) || P.intrus.find(e => e.id === id)).t;
  function charger() { P = PIECES[+q('#od-piece').value]; L = []; ordre = P.etapes.concat(P.intrus).map(e => e.id); for (let i = ordre.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; } raz(); }
  const raz = () => { msg = ''; cl = ''; marque = -1; conseil = ''; rendre(); };
  function rendre() { if (!vivant) return; ecrire(q('#od-enonce'), '<b>À démontrer</b>' + P.enonce, true);
    ecrire(q('#od-preuve'), L.length ? L.map((id, i) => `<li class="od-pas${marque === i ? ' faute' : ''}${cl === ' gagne' ? ' juste' : ''}"><span>${texte(id)}</span><span class="cmd"><button type="button" data-a="h" data-i="${i}" ${i ? '' : 'disabled'} aria-label="Monter l'étape ${i + 1}">↑</button><button type="button" data-a="b" data-i="${i}" ${i < L.length - 1 ? '' : 'disabled'} aria-label="Descendre l'étape ${i + 1}">↓</button><button type="button" data-a="x" data-i="${i}" aria-label="Renvoyer l'étape ${i + 1} en réserve">✕</button></span></li>`).join('') : '<li class="od-vide">Cliquez sur une phrase de la réserve pour commencer.</li>', true);
    const R = ordre.filter(id => !L.includes(id));
    ecrire(q('#od-reserve'), R.length ? R.map(id => `<li class="od-pas${conseil === id ? ' conseil' : ''}" data-id="${id}" tabindex="0" role="button"><span>${texte(id)}</span><button type="button" tabindex="-1" aria-hidden="true">+</button></li>`).join('') : '<li class="od-vide">La réserve est vide.</li>', true);
    const m = q('#od-message'); m.className = 'jeu-message' + cl; ecrire(m, msg || 'Reconstituez la démonstration, puis cliquez sur « Vérifier ». Attention : une phrase de la réserve est un intrus.', true); }
  const ajouter = id => { L.push(id); raz(); };
  q('#od-reserve').addEventListener('click', e => { const li = e.target.closest('li[data-id]'); if (li) ajouter(li.dataset.id); });
  q('#od-reserve').addEventListener('keydown', e => { const li = e.target.closest('li[data-id]'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ajouter(li.dataset.id); } });
  q('#od-preuve').addEventListener('click', e => { const b = e.target.closest('button[data-a]'); if (!b) return; const i = +b.dataset.i, a = b.dataset.a;
    if (a === 'x') L.splice(i, 1); else { const j = a === 'h' ? i - 1 : i + 1; [L[i], L[j]] = [L[j], L[i]]; } raz(); });
  q('#od-verifier').addEventListener('click', () => { conseil = ''; if (!L.length) { msg = 'Votre démonstration est vide.'; cl = ''; rendre(); return; } const r = verifier(P, L);
    if (r.ok) { msg = 'La démonstration est complète et chaque étape s\'appuie sur ce qui la précède.'; cl = ' gagne'; marque = -1; }
    else { marque = r.pos; cl = r.pos < 0 ? '' : ' bloque'; msg = (r.pos >= 0 ? `<b>Étape ${r.pos + 1}${r.intrus ? ' : c\'est l\'intrus' : ''}.</b> ` : '') + r.texte; } rendre(); });
  q('#od-indice').addEventListener('click', () => { marque = -1; cl = ''; const r = verifier(P, L);
    if (r.pos >= 0) { marque = r.pos; msg = `Vous avez demandé un indice : commencez par revoir l'étape ${r.pos + 1}, marquée d'un filet rouge.`; }
    else { const s = P.etapes.find(e => !L.includes(e.id) && Object.keys(e.dep).every(d => L.includes(d))); conseil = s ? s.id : ''; msg = s ? 'Vous avez demandé un indice : la phrase entourée de vert, dans la réserve, peut être écrite maintenant.' : 'Vous avez demandé un indice : la démonstration est complète.'; } rendre(); });
  q('#od-depart').addEventListener('click', () => { L = []; raz(); }); q('#od-piece').addEventListener('change', charger);
  charger(); return () => { vivant = false; };
}
