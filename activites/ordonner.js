// Raisonner « Démonstrations à remettre en ordre », rubrique Activités, MEMO_atlas_activites.md §143 et §144.
import { css as cssCommun } from './commun.js';
import { cssRaison, lireMemoire, noterMemoire, filtrer, pucesNiveaux, pucesThemes, options } from './raisonner.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import premiere from './ordonner-premiere.js';
import terminale from './ordonner-terminale.js';
import expertes from './ordonner-expertes.js';
import sup from './ordonner-sup.js';

export const css = cssCommun + cssFigures + cssJeux + cssRaison + `
.activites-act .od-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .od-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .od-duo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0; }
.activites-act .od-duo > div { padding: 12px 16px 16px; min-width: 0; } .activites-act .od-duo > div + div { border-left: 1px solid var(--filet); }
.activites-act .od-duo h5 { font: 500 12px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; color: var(--encre-3); margin: 0 0 10px; }
.activites-act .od-liste { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; counter-reset: etape; }
.activites-act .od-pas { display: grid; grid-template-columns: auto auto minmax(0, 1fr) auto; gap: 8px; align-items: start; padding: 9px 10px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); font: 15.5px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .od-preuve .od-pas { counter-increment: etape; } .activites-act .od-preuve .od-pas::before { content: counter(etape); font: 700 13px var(--f-mono); color: var(--activites-jeu); padding-top: 3px; min-width: 1.2em; }
.activites-act .od-reserve .od-pas { grid-template-columns: auto minmax(0, 1fr) auto; cursor: pointer; } .activites-act .od-reserve .od-pas:hover { border-color: var(--activites-jeu); }
.activites-act .od-pas.faute { border-color: var(--rouge); box-shadow: inset 3px 0 0 var(--rouge); } .activites-act .od-pas.juste { border-color: var(--tan); } .activites-act .od-pas.conseil { border-color: var(--tan); box-shadow: inset 0 0 0 2px var(--tan); }
.activites-act .od-pas .cmd { display: flex; gap: 4px; } .activites-act .od-pas .cmd button, .activites-act .od-reserve .od-pas button { width: 30px; height: 30px; padding: 0; border-radius: 6px; border: 1px solid var(--encre-3); background: var(--surface); color: var(--encre); font: 600 15px var(--f-ui); }
.activites-act .od-pas .cmd button:disabled { opacity: .3; }
.activites-act .od-vide { padding: 18px 10px; border: 1px dashed var(--encre-3); border-radius: 6px; font: 14px var(--f-ui); color: var(--encre-3); text-align: center; }
.activites-act .od-pas .poignee { touch-action: none; cursor: grab; color: var(--encre-3); font: 700 15px/1 var(--f-mono); padding: 6px 2px 0; user-select: none; letter-spacing: -2px; }
.activites-act .od-pas { user-select: none; -webkit-user-select: none; }
.activites-act .od-pas.porte { opacity: .35; }
.activites-act .od-liste .insertion { height: 0; border-top: 3px solid var(--activites-jeu); margin: -5.5px 0; border-radius: 2px; list-style: none; }
.activites-act .od-zone.vise { background: color-mix(in srgb, var(--activites-jeu) 6%, transparent); }
.od-fantome { position: fixed; z-index: 50; pointer-events: none; margin: 0; padding: 9px 12px; border: 2px solid var(--rouge); border-radius: 6px; background: var(--surface); color: var(--encre); font: 15.5px/1.5 var(--f-texte, Georgia, serif); box-shadow: 0 8px 22px rgba(0, 0, 0, .28); opacity: .96; }
@media (max-width: 640px) { .activites-act .od-preuve .od-pas { grid-template-columns: auto auto minmax(0, 1fr); } .activites-act .od-preuve .od-pas .cmd { grid-column: 1 / -1; justify-content: flex-end; } }
@media (max-width: 760px) { .activites-act .od-duo { grid-template-columns: 1fr; } .activites-act .od-duo > div + div { border-left: 0; border-top: 1px solid var(--filet); } }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Démonstrations à remettre en ordre</h3>
  <p class="lede">Une démonstration n'est pas une liste de phrases vraies : chaque étape s'appuie sur celles qui la précèdent. Ici, les étapes d'une démonstration classique sont mélangées, et une ou deux phrases fausses se sont glissées parmi elles. À vous de reconstruire le raisonnement, sans les intrus.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <span class="rz-niveaux" id="od-niveaux" role="group" aria-label="Niveau"></span>
    <span class="rz-niveaux" id="od-themes" role="group" aria-label="Thème de Maths Sup" hidden></span>
  </div>
  <div class="bar">
    <label class="rz-choix">Démonstration <select id="od-piece"></select></label>
    <label>Intrus <select id="od-intrus"><option value="0">aucun</option><option value="1" selected>un</option><option value="2">deux</option></select></label>
    <button type="button" class="primary" id="od-verifier">Vérifier</button>
    <button type="button" id="od-indice">Un indice</button>
    <button type="button" id="od-depart">Tout remettre en réserve</button>
  </div>
  <p class="od-enonce" id="od-enonce"></p>
  <div class="od-duo">
    <div class="od-zone" id="od-zone-preuve"><h5>Votre démonstration</h5><ol class="od-liste od-preuve" id="od-preuve"></ol></div>
    <div class="od-zone" id="od-zone-reserve"><h5>La réserve</h5><ul class="od-liste od-reserve" id="od-reserve"></ul></div>
  </div>
  <div class="jeu-message" id="od-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Choisissez un niveau et, pour Maths Sup, un thème (fondements, algèbre, algèbre linéaire, analyse, probabilités), puis une démonstration. Faites glisser les phrases de la réserve vers votre démonstration, à la place voulue ; vous pouvez aussi les déplacer entre elles, ou les ramener dans la réserve. Sur un écran tactile, saisissez une phrase par sa poignée, à gauche. Sans glisser, un clic sur une phrase de la réserve l'ajoute à la fin, les flèches la montent ou la descendent, et la croix la renvoie en réserve. Quand le raisonnement vous paraît complet, cliquez sur « Vérifier ». La page ne juge rien avant : elle vous laisse chercher.</p>
    <p>Le réglage « Intrus » fixe la difficulté : aucune phrase fausse, une seule, ou deux. Une démonstration réussie est marquée d'une coche dans la liste, et votre navigateur s'en souvient ; vous pouvez la refaire autant de fois que vous voulez.</p>
    <p>La vérification ne compare pas votre texte à un modèle. Pour chaque étape, la page connaît les étapes dont elle a besoin : elle contrôle que celles-ci figurent plus haut. Plusieurs ordres peuvent donc être justes. Dans une récurrence, par exemple, rien n'oblige à écrire l'initialisation avant l'hérédité ; il faut seulement que les deux précèdent la conclusion.</p>
    <p>Si quelque chose ne va pas, la page désigne la première étape en défaut et dit ce qui lui manque : « cette étape emploie un nombre qui n'a pas encore été introduit ». Si vous avez retenu un intrus, elle explique pourquoi la phrase est fausse, ou pourquoi elle ne démontre pas ce qu'elle prétend. Chaque démonstration renvoie au chapitre du cours où le résultat est établi ; la rédaction du cours peut suivre un autre chemin, et la comparaison des deux fait partie de l'exercice.</p>
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
  "Sous chaque énoncé, un lien mène au chapitre du cours où le résultat est établi, avec ses remarques : par exemple <a href=\"#cours/ma-07\">Nombres réels et suites numériques</a> pour l'unicité de la limite et le théorème de la limite monotone, ou <a href=\"#cours/ma-09\">Dérivabilité et convexité</a> pour le théorème de Rolle. Les récurrences reposent sur la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a> de l'édifice.",
  "Chaque étape porte la liste des étapes dont elle dépend. « Vérifier » parcourt votre démonstration de haut en bas et s'arrête à la première étape dont une dépendance manque plus haut, à l'intrus s'il est présent, ou constate qu'il manque des étapes. Quand une démonstration a deux parties indépendantes, comme les deux sens d'une équivalence, la page demande aussi qu'elles ne soient pas entremêlées. L'indice désigne une étape de la réserve qui peut être écrite dès maintenant. Votre navigateur retient seulement quelles démonstrations ont été réussies ; rien n'est envoyé.");

// Une pièce : id, nom, niveau, cours (chapitre où lire la démonstration), énoncé, étapes { id, t (texte), dep: { id: phrase dite quand
// cette dépendance manque }, bloc (facultatif) }, intrus [{ id, t, pourquoi }] (deux par pièce ; le réglage en retient zéro, un ou deux).
// Les démonstrations de Maths Sup suivent celles des chapitres du cours du site.
const ANCIENNES = [
  { id: 'racine2', nom: 'Irrationalité de √2', niveau: 'premiere', cours: '', enonce: `Le nombre ${K('\\sqrt2')} est irrationnel.`, etapes: [
    { id: 'a', t: `Raisonnons par l'absurde : supposons qu'il existe deux entiers ${K('p > 0')} et ${K('q > 0')}, sans diviseur commun autre que 1, tels que ${K('\\sqrt2 = \\dfrac pq')}.`, dep: {} },
    { id: 'b', t: `En élevant au carré, on obtient ${K('p^2 = 2q^2')}.`, dep: { a: `Cette étape parle de ${K('p')} et de ${K('q')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Donc ${K('p^2')} est pair. Or le carré d'un nombre impair est impair : ${K('p')} est donc pair, et il existe un entier ${K('k')} tel que ${K('p = 2k')}.`, dep: { b: `Pour dire que ${K('p^2')} est pair, il faut avoir établi ${K('p^2 = 2q^2')}.` } },
    { id: 'd', t: `En reportant dans l'égalité, ${K('4k^2 = 2q^2')}, c'est-à-dire ${K('q^2 = 2k^2')}.`, dep: { c: `Cette étape emploie l'entier ${K('k')}, qui n'a pas encore été introduit.`, b: `Il faut disposer de l'égalité ${K('p^2 = 2q^2')} pour y reporter.` } },
    { id: 'e', t: `Par le même argument, ${K('q^2')} est pair, donc ${K('q')} est pair.`, dep: { d: `Pour dire que ${K('q^2')} est pair, il faut avoir établi ${K('q^2 = 2k^2')}.`, c: `« Le même argument » renvoie à un argument qui n'a pas encore été donné.` } },
    { id: 'f', t: `Ainsi 2 divise à la fois ${K('p')} et ${K('q')}, ce qui contredit le choix de ${K('p')} et ${K('q')}. Donc ${K('\\sqrt2')} est irrationnel.`, dep: { c: `Il faut avoir établi que ${K('p')} est pair.`, e: `Il faut avoir établi que ${K('q')} est pair.`, a: `La contradiction porte sur une hypothèse qui n'a pas été posée.` } }],
    intrus: [{ id: 'x', t: `Donc ${K('p^2')} est pair. Or le carré d'un nombre pair est pair : ${K('p')} est donc pair, et il existe un entier ${K('k')} tel que ${K('p = 2k')}.`, pourquoi: `« Le carré d'un nombre pair est pair » est vrai, mais ne permet pas de conclure : cela dit que si ${K('p')} est pair alors ${K('p^2')} l'est, alors qu'on sait ici que ${K('p^2')} est pair et qu'on veut en déduire que ${K('p')} l'est. Il faut la réciproque, que l'on obtient par contraposée : le carré d'un impair est impair.` },
      { id: 'y', t: `En reportant dans l'égalité, ${K('2k^2 = 2q^2')}, c'est-à-dire ${K('q = k')}.`, pourquoi: `Le calcul est faux : si ${K('p = 2k')}, alors ${K('p^2 = 4k^2')}, et non ${K('2k^2')}.` }] },
  { id: 'impairs', nom: 'Somme des premiers nombres impairs', niveau: 'terminale', cours: 't-01', enonce: `Pour tout entier ${K('n \\geqslant 1')}, on a ${K('1 + 3 + 5 + \\dots + (2n - 1) = n^2')}.`, etapes: [
    { id: 'a', t: `Pour tout entier ${K('n \\geqslant 1')}, notons ${K('P(n)')} l'égalité ${K('1 + 3 + \\dots + (2n - 1) = n^2')}.`, dep: {} },
    { id: 'b', t: `Initialisation : pour ${K('n = 1')}, la somme se réduit à ${K('1')}, et ${K('1^2 = 1')}. Donc ${K('P(1)')} est vraie.`, dep: { a: `Cette étape parle de ${K('P(1)')}, alors que ${K('P(n)')} n'a pas encore été définie.` } },
    { id: 'c', t: `Hérédité : soit ${K('n \\geqslant 1')} un entier tel que ${K('P(n)')} soit vraie.`, dep: { a: `Cette étape parle de ${K('P(n)')}, qui n'a pas encore été définie.` } },
    { id: 'd', t: `Alors ${K('1 + 3 + \\dots + (2n - 1) + (2n + 1) = n^2 + (2n + 1)')}.`, dep: { c: `Cette égalité utilise ${K('P(n)')} : il faut avoir fixé un entier ${K('n')} pour lequel elle est supposée vraie.` } },
    { id: 'e', t: `Or ${K('n^2 + 2n + 1 = (n + 1)^2')} : c'est exactement ${K('P(n + 1)')}.`, dep: { d: `Il faut avoir calculé la somme jusqu'à ${K('2n + 1')} avant de la reconnaître.` } },
    { id: 'f', t: `Par le principe de récurrence, ${K('P(n)')} est vraie pour tout entier ${K('n \\geqslant 1')}.`, dep: { b: `Le principe de récurrence exige l'initialisation, qui ne figure pas plus haut.`, e: `Le principe de récurrence exige l'hérédité, qui n'est pas encore achevée.` } }],
    intrus: [{ id: 'x', t: `Hérédité : supposons que ${K('P(n)')} soit vraie pour tout entier ${K('n \\geqslant 1')}.`, pourquoi: `Cette phrase suppose exactement ce qu'il faut démontrer. Dans l'hérédité, on fixe <em>un</em> entier ${K('n')} pour lequel ${K('P(n)')} est vraie, et l'on en déduit ${K('P(n + 1)')} ; on ne suppose pas ${K('P(n)')} pour tous les entiers.` },
      { id: 'y', t: `Alors ${K('1 + 3 + \\dots + (2n - 1) + (2n + 1) = (n + 1)^2')}, puisque ${K('P(n + 1)')} est vraie.`, pourquoi: `Cette phrase invoque ${K('P(n + 1)')}, qui est précisément ce que l'hérédité doit établir. On ne dispose que de ${K('P(n)')}.` }] },
  { id: 'nonmajoree', nom: 'Suite croissante non majorée', niveau: 'terminale', cours: 't-01', enonce: `Toute suite réelle croissante et non majorée tend vers ${K('+\\infty')}.`, etapes: [
    { id: 'a', t: `Soit ${K('(u_n)')} une suite croissante et non majorée, et soit ${K('A')} un réel quelconque.`, dep: {} },
    { id: 'b', t: `Comme la suite n'est pas majorée, ${K('A')} n'en est pas un majorant : il existe un rang ${K('N')} tel que ${K('u_N > A')}.`, dep: { a: `Cette étape parle de la suite et du réel ${K('A')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Soit ${K('n \\geqslant N')}. Comme la suite est croissante, ${K('u_n \\geqslant u_N')}.`, dep: { b: `Cette étape emploie le rang ${K('N')}, qui n'a pas encore été introduit.` } },
    { id: 'd', t: `Donc ${K('u_n > A')} pour tout entier ${K('n \\geqslant N')}.`, dep: { c: `Il faut avoir comparé ${K('u_n')} à ${K('u_N')} pour ${K('n \\geqslant N')}.`, b: `Il faut savoir que ${K('u_N > A')}.` } },
    { id: 'e', t: `Ceci vaut pour tout réel ${K('A')} : par définition, la suite ${K('(u_n)')} tend vers ${K('+\\infty')}.`, dep: { d: `La définition de la limite infinie demande que ${K('u_n > A')} à partir d'un certain rang, ce qui n'est pas encore établi.` } }],
    intrus: [{ id: 'x', t: `Comme la suite n'est pas majorée, on a ${K('u_n > A')} pour tout entier ${K('n')}.`, pourquoi: `« Non majorée » signifie qu'aucun réel ne majore tous les termes : pour chaque ${K('A')}, il existe <em>un</em> terme qui le dépasse, pas tous. C'est la croissance qui permet ensuite de passer d'un terme à tous les suivants.` },
      { id: 'y', t: `Comme la suite est croissante, elle tend vers ${K('+\\infty')}.`, pourquoi: `La croissance seule ne suffit pas : la suite de terme général ${K('1 - \\dfrac1n')} est croissante et converge vers 1. L'hypothèse « non majorée » est indispensable.` }] },
  { id: 'premiers', nom: 'Infinité des nombres premiers', niveau: 'expertes', cours: 'me-01', enonce: `Il existe une infinité de nombres premiers.`, etapes: [
    { id: 'a', t: `Raisonnons par l'absurde : supposons qu'il n'existe qu'un nombre fini de nombres premiers, et notons-les ${K('p_1, p_2, \\dots, p_n')}.`, dep: {} },
    { id: 'b', t: `Posons ${K('N = p_1 p_2 \\cdots p_n + 1')}.`, dep: { a: `Cette étape emploie les nombres ${K('p_1, \\dots, p_n')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Comme ${K('N \\geqslant 2')}, l'entier ${K('N')} possède un diviseur premier ${K('p')}.`, dep: { b: `Cette étape parle de ${K('N')}, qui n'a pas encore été défini.` } },
    { id: 'd', t: `D'après l'hypothèse, ${K('p')} est l'un des ${K('p_i')} : il divise donc le produit ${K('p_1 p_2 \\cdots p_n')}.`, dep: { c: `Cette étape parle du nombre premier ${K('p')}, qui n'a pas encore été introduit.`, a: `« L'hypothèse » invoquée n'a pas encore été posée.` } },
    { id: 'e', t: `Divisant ${K('N')} et ${K('p_1 p_2 \\cdots p_n')}, le nombre ${K('p')} divise leur différence, qui vaut 1.`, dep: { d: `Il faut avoir établi que ${K('p')} divise le produit ${K('p_1 p_2 \\cdots p_n')}.`, c: `Il faut avoir établi que ${K('p')} divise ${K('N')}.` } },
    { id: 'f', t: `C'est impossible, puisque ${K('p \\geqslant 2')}. Il existe donc une infinité de nombres premiers.`, dep: { e: `La contradiction vient de ce que ${K('p')} divise 1, ce qui n'a pas encore été établi.` } }],
    intrus: [{ id: 'x', t: `Aucun des ${K('p_i')} ne divise ${K('N')}, donc ${K('N')} est un nombre premier, différent de tous les ${K('p_i')}.`, pourquoi: `C'est l'erreur la plus répandue sur cette démonstration. Dans le raisonnement par l'absurde, la conclusion est seulement que ${K('N')} a un diviseur premier qui n'est pas dans la liste. Et hors de ce raisonnement, le produit des premiers nombres premiers augmenté de 1 n'est pas toujours premier : ${K('2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30\\,031 = 59 \\times 509')}.` },
      { id: 'y', t: `Divisant ${K('N')} et ${K('p_1 p_2 \\cdots p_n')}, le nombre ${K('p')} divise leur somme, qui vaut 1.`, pourquoi: `Le nombre ${K('p')} divise bien la somme, mais celle-ci vaut ${K('2 p_1 p_2 \\cdots p_n + 1')}, et non 1. C'est la différence ${K('N - p_1 p_2 \\cdots p_n')} qui vaut 1.` }] },
  { id: 'unicite', nom: 'Unicité de la limite', niveau: 'sup', cours: 'ma-07', enonce: `Si une suite réelle ${K('(u_n)')} converge vers ${K('\\ell')} et vers ${K('\\ell\'')}, alors ${K('\\ell = \\ell\'')}.`, etapes: [
    { id: 'a', t: `Raisonnons par l'absurde : supposons ${K('\\ell \\neq \\ell\'')}, et posons ${K('\\varepsilon = \\dfrac{|\\ell - \\ell\'|}{3} > 0')}.`, dep: {} },
    { id: 'b', t: `Il existe un rang ${K('N_1')} tel que ${K('|u_n - \\ell| \\leqslant \\varepsilon')} pour tout ${K('n \\geqslant N_1')}, et un rang ${K('N_2')} tel que ${K('|u_n - \\ell\'| \\leqslant \\varepsilon')} pour tout ${K('n \\geqslant N_2')}.`, dep: { a: `Cette étape applique la définition de la limite à un réel ${K('\\varepsilon')} qui n'a pas encore été choisi.` } },
    { id: 'c', t: `Posons ${K('n = \\max(N_1, N_2)')} : les deux inégalités sont vraies pour cet entier.`, dep: { b: `Cette étape emploie les rangs ${K('N_1')} et ${K('N_2')}, qui n'ont pas encore été introduits.` } },
    { id: 'd', t: `L'inégalité triangulaire donne alors ${K('|\\ell - \\ell\'| \\leqslant |\\ell - u_n| + |u_n - \\ell\'| \\leqslant 2\\varepsilon')}.`, dep: { c: `Il faut avoir fixé un entier ${K('n')} pour lequel les deux inégalités sont vraies à la fois.` } },
    { id: 'e', t: `Or ${K('|\\ell - \\ell\'| = 3\\varepsilon')} : on obtient ${K('3\\varepsilon \\leqslant 2\\varepsilon')}, ce qui est absurde puisque ${K('\\varepsilon > 0')}. Donc ${K('\\ell = \\ell\'')}.`, dep: { d: `La contradiction vient de la majoration de ${K('|\\ell - \\ell\'|')} par ${K('2\\varepsilon')}, qui n'est pas encore établie.`, a: `Il faut avoir défini ${K('\\varepsilon')}.` } }],
    intrus: [{ id: 'x', t: `Puisque la suite tend vers ${K('\\ell')} et vers ${K('\\ell\'')}, il existe un rang ${K('N')} à partir duquel ${K('u_n = \\ell')} et ${K('u_n = \\ell\'')}.`, pourquoi: `Converger vers ${K('\\ell')} ne signifie pas valoir ${K('\\ell')} à partir d'un certain rang : la suite de terme général ${K('\\dfrac1n')} converge vers 0 sans jamais s'annuler. La définition donne seulement ${K('|u_n - \\ell| \\leqslant \\varepsilon')}.` },
      { id: 'y', t: `L'inégalité triangulaire donne alors ${K('|\\ell - \\ell\'| \\geqslant |\\ell - u_n| + |u_n - \\ell\'|')}.`, pourquoi: `L'inégalité triangulaire est écrite à l'envers : la distance de ${K('\\ell')} à ${K('\\ell\'')} est <em>inférieure</em> ou égale à la somme des deux autres.` }] },
  { id: 'bornee', nom: 'Toute suite convergente est bornée', niveau: 'sup', cours: 'ma-07', enonce: `Toute suite réelle convergente est bornée.`, etapes: [
    { id: 'a', t: `Soit ${K('(u_n)')} une suite qui converge vers un réel ${K('\\ell')}. La définition de la limite, avec ${K('\\varepsilon = 1')}, fournit un rang ${K('N')} tel que ${K('|u_n - \\ell| \\leqslant 1')} pour tout ${K('n \\geqslant N')}.`, dep: {} },
    { id: 'b', t: `Pour ${K('n \\geqslant N')}, l'inégalité triangulaire donne ${K('|u_n| \\leqslant |u_n - \\ell| + |\\ell| \\leqslant 1 + |\\ell|')}.`, dep: { a: `Cette étape emploie le rang ${K('N')} et le réel ${K('\\ell')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Les termes ${K('u_0, \\dots, u_{N-1}')} sont en nombre fini : posons ${K('M = \\max\\bigl(|u_0|, \\dots, |u_{N-1}|, 1 + |\\ell|\\bigr)')}.`, dep: { a: `Cette étape emploie le rang ${K('N')}, qui n'a pas encore été introduit.` } },
    { id: 'd', t: `Alors ${K('|u_n| \\leqslant M')} pour tout entier ${K('n')} : par définition de ${K('M')} si ${K('n < N')}, et par la majoration précédente si ${K('n \\geqslant N')}.`, dep: { c: `Cette étape emploie le réel ${K('M')}, qui n'a pas encore été défini.`, b: `Il faut avoir majoré ${K('|u_n|')} pour ${K('n \\geqslant N')}.` } },
    { id: 'e', t: `La suite ${K('(|u_n|)')} est majorée : la suite ${K('(u_n)')} est bornée.`, dep: { d: `Il faut avoir trouvé un réel qui majore tous les ${K('|u_n|')}.` } }],
    intrus: [{ id: 'x', t: `Posons ${K('M = \\max\\{|u_n| \\ ;\\ n \\in \\mathbb{N}\\}')}.`, pourquoi: `Un ensemble infini de réels n'a pas toujours de plus grand élément, ni même de majorant : affirmer que ce maximum existe, c'est admettre ce qu'il faut démontrer. On ne peut prendre le maximum que d'un nombre fini de termes, d'où le découpage en ${K('n < N')} et ${K('n \\geqslant N')}.` },
      { id: 'y', t: `Pour ${K('n \\geqslant N')}, l'inégalité triangulaire donne ${K('|u_n| \\leqslant |u_n - \\ell| - |\\ell| \\leqslant 1 - |\\ell|')}.`, pourquoi: `L'inégalité triangulaire s'écrit ${K('|a + b| \\leqslant |a| + |b|')}, avec une somme : en écrivant ${K('u_n = (u_n - \\ell) + \\ell')}, on obtient ${K('|u_n - \\ell| + |\\ell|')}.` }] },
  { id: 'monotone', nom: 'Théorème de la limite monotone', niveau: 'sup', cours: 'ma-07', enonce: `Toute suite réelle croissante et majorée converge, et sa limite est la borne supérieure de l'ensemble de ses termes.`, etapes: [
    { id: 'a', t: `Soit ${K('(u_n)')} une suite croissante et majorée. L'ensemble ${K('\\{u_n \\ ;\\ n \\in \\mathbb{N}\\}')} est une partie non vide et majorée de ${K('\\mathbb{R}')} : il possède une borne supérieure ${K('\\ell')}.`, dep: {} },
    { id: 'b', t: `Soit ${K('\\varepsilon > 0')}. Le réel ${K('\\ell - \\varepsilon')} n'est pas un majorant, puisque ${K('\\ell')} est le plus petit : il existe un rang ${K('N')} tel que ${K('u_N > \\ell - \\varepsilon')}.`, dep: { a: `Cette étape emploie la borne supérieure ${K('\\ell')}, qui n'a pas encore été introduite.` } },
    { id: 'c', t: `Soit ${K('n \\geqslant N')}. Par croissance, ${K('u_n \\geqslant u_N')} ; et ${K('u_n \\leqslant \\ell')}, car ${K('\\ell')} majore tous les termes.`, dep: { b: `Cette étape emploie le rang ${K('N')}, qui n'a pas encore été introduit.` } },
    { id: 'd', t: `Donc ${K('\\ell - \\varepsilon < u_n \\leqslant \\ell')}, d'où ${K('|u_n - \\ell| \\leqslant \\varepsilon')} pour tout ${K('n \\geqslant N')}.`, dep: { c: `Il faut avoir encadré ${K('u_n')} pour ${K('n \\geqslant N')}.` } },
    { id: 'e', t: `Ceci vaut pour tout ${K('\\varepsilon > 0')} : la suite ${K('(u_n)')} converge vers ${K('\\ell')}.`, dep: { d: `La définition de la convergence demande ${K('|u_n - \\ell| \\leqslant \\varepsilon')} à partir d'un rang, ce qui n'est pas encore établi.` } }],
    intrus: [{ id: 'x', t: `Soit ${K('M')} un majorant de la suite : montrons que ${K('(u_n)')} converge vers ${K('M')}.`, pourquoi: `Une suite majorée a une infinité de majorants, et un seul peut être sa limite : la suite constante égale à 0 est majorée par 5 sans converger vers 5. La limite est le <em>plus petit</em> des majorants, la borne supérieure.` },
      { id: 'y', t: `Le réel ${K('\\ell')} est le plus grand terme de la suite : il existe un rang ${K('N')} tel que ${K('u_N = \\ell')}.`, pourquoi: `Une borne supérieure n'est pas toujours atteinte : la suite de terme général ${K('1 - \\dfrac1n')} a pour borne supérieure 1, et aucun de ses termes ne vaut 1. On sait seulement que des termes s'en approchent autant que l'on veut.` }] },
  { id: 'gauss', nom: 'Lemme de Gauss', niveau: 'sup', cours: 'ma-12', enonce: `Soit ${K('a')}, ${K('b')}, ${K('c')} trois entiers. Si ${K('a')} divise ${K('bc')} et si ${K('a')} et ${K('b')} sont premiers entre eux, alors ${K('a')} divise ${K('c')}.`, etapes: [
    { id: 'a', t: `Comme ${K('a')} et ${K('b')} sont premiers entre eux, le théorème de Bézout fournit deux entiers ${K('u')} et ${K('v')} tels que ${K('au + bv = 1')}.`, dep: {} },
    { id: 'b', t: `En multipliant cette égalité par ${K('c')}, on obtient ${K('acu + bcv = c')}.`, dep: { a: `Il n'y a pas encore d'égalité à multiplier : les entiers ${K('u')} et ${K('v')} n'ont pas été introduits.` } },
    { id: 'c', t: `Or ${K('a')} divise ${K('acu')} ; et ${K('a')} divise ${K('bc')} par hypothèse, donc il divise ${K('bcv')}.`, dep: { a: `Cette étape emploie les entiers ${K('u')} et ${K('v')}, qui n'ont pas encore été introduits.` } },
    { id: 'd', t: `Donc ${K('a')} divise la somme ${K('acu + bcv')}, c'est-à-dire ${K('c')}.`, dep: { b: `Il faut avoir établi que ${K('acu + bcv = c')}.`, c: `Il faut avoir établi que ${K('a')} divise chacun des deux termes.` } }],
    intrus: [{ id: 'x', t: `Comme ${K('a')} divise ${K('bc')} et ne divise pas ${K('b')}, il divise ${K('c')}.`, pourquoi: `C'est faux : 6 divise ${K('4 \\times 3')} sans diviser ni 4 ni 3. « Premier avec ${K('b')} » est une hypothèse bien plus forte que « ne divise pas ${K('b')} », et c'est elle qui donne l'égalité de Bézout.` },
      { id: 'y', t: `Comme ${K('a')} divise ${K('bc')}, il existe deux entiers ${K('u')} et ${K('v')} tels que ${K('au + bv = 1')}.`, pourquoi: `L'égalité de Bézout ${K('au + bv = 1')} vient de ce que ${K('a')} et ${K('b')} sont premiers entre eux, et non de ce que ${K('a')} divise ${K('bc')}. Avec ${K('a = 6')}, ${K('b = 4')}, ${K('c = 3')}, l'hypothèse invoquée est vraie et l'égalité impossible, puisque ${K('6u + 4v')} est pair.` }] },
  { id: 'rolle', nom: 'Théorème de Rolle', niveau: 'sup', cours: 'ma-09', enonce: `Soit ${K('a < b')} et ${K('f')} une fonction continue sur ${K('[a, b]')}, dérivable sur ${K(']a, b[')}, telle que ${K('f(a) = f(b)')}. Alors il existe ${K('c \\in \\,]a, b[')} tel que ${K('f\'(c) = 0')}.`, etapes: [
    { id: 'a', t: `La fonction ${K('f')} est continue sur le segment ${K('[a, b]')} : d'après le théorème des bornes atteintes, elle y atteint son minimum ${K('m')} et son maximum ${K('M')}.`, dep: {} },
    { id: 'b', t: `Si ${K('m = M')}, la fonction ${K('f')} est constante sur ${K('[a, b]')}, sa dérivée est nulle sur ${K(']a, b[')}, et tout ${K('c')} de ${K(']a, b[')} convient.`, dep: { a: `Cette étape emploie ${K('m')} et ${K('M')}, qui n'ont pas encore été introduits.` } },
    { id: 'c', t: `Sinon, ${K('m < M')} : l'une de ces deux valeurs est différente de ${K('f(a) = f(b)')}. Supposons que ce soit ${K('M')}, l'autre cas étant analogue.`, dep: { b: `« Sinon » renvoie à un premier cas qui n'a pas encore été traité.` } },
    { id: 'd', t: `Le maximum ${K('M')} est atteint en un point ${K('c')} de ${K('[a, b]')}. Comme ${K('f(c) = M')} diffère de ${K('f(a)')} et de ${K('f(b)')}, le point ${K('c')} n'est ni ${K('a')} ni ${K('b')} : il appartient à ${K(']a, b[')}.`, dep: { c: `Il faut avoir établi que ${K('M')} est différent de ${K('f(a) = f(b)')}.` } },
    { id: 'e', t: `La fonction ${K('f')} est dérivable en ${K('c')}, point intérieur à l'intervalle où elle atteint un maximum : donc ${K('f\'(c) = 0')}.`, dep: { d: `Il faut avoir établi que ${K('c')} est intérieur à l'intervalle : en une borne, la dérivée n'a aucune raison de s'annuler.` } }],
    intrus: [{ id: 'x', t: `Le maximum ${K('M')} est atteint en un point ${K('c')} de ${K('[a, b]')}. Or la dérivée s'annule en tout point où une fonction atteint un maximum : donc ${K('f\'(c) = 0')}.`, pourquoi: `La dérivée ne s'annule en un extremum que si celui-ci est atteint en un point <em>intérieur</em> à l'intervalle. La fonction ${K('x \\mapsto x')} atteint son maximum sur ${K('[0, 1]')} en 1, où sa dérivée vaut 1. C'est pour cela que l'hypothèse ${K('f(a) = f(b)')} sert à écarter les bornes.` },
      { id: 'y', t: `Comme ${K('f(a) = f(b)')}, la fonction ${K('f')} est constante sur ${K('[a, b]')}.`, pourquoi: `Prendre la même valeur aux deux bornes n'oblige pas à être constante : ${K('x \\mapsto x(1 - x)')} s'annule en 0 et en 1 sans être nulle entre les deux.` }] },
  { id: 'taf', nom: 'Égalité des accroissements finis', niveau: 'sup', cours: 'ma-09', enonce: `Soit ${K('a < b')} et ${K('f')} une fonction continue sur ${K('[a, b]')} et dérivable sur ${K(']a, b[')}. Alors il existe ${K('c \\in \\,]a, b[')} tel que ${K('f(b) - f(a) = f\'(c)(b - a)')}.`, etapes: [
    { id: 'a', t: `Posons ${K('p = \\dfrac{f(b) - f(a)}{b - a}')} et, pour ${K('x \\in [a, b]')}, ${K('g(x) = f(x) - f(a) - p(x - a)')}.`, dep: {} },
    { id: 'b', t: `La fonction ${K('g')} est continue sur ${K('[a, b]')} et dérivable sur ${K(']a, b[')}, comme différence de ${K('f')} et d'une fonction affine.`, dep: { a: `Cette étape parle de la fonction ${K('g')}, qui n'a pas encore été définie.` } },
    { id: 'c', t: `De plus ${K('g(a) = 0')} et ${K('g(b) = f(b) - f(a) - p(b - a) = 0')} : donc ${K('g(a) = g(b)')}.`, dep: { a: `Cette étape parle de la fonction ${K('g')}, qui n'a pas encore été définie.` } },
    { id: 'd', t: `Le théorème de Rolle s'applique à ${K('g')} : il existe ${K('c \\in \\,]a, b[')} tel que ${K('g\'(c) = 0')}.`, dep: { b: `Le théorème de Rolle exige que ${K('g')} soit continue sur ${K('[a, b]')} et dérivable sur ${K(']a, b[')}, ce qui n'est pas encore vérifié.`, c: `Le théorème de Rolle exige ${K('g(a) = g(b)')}, ce qui n'est pas encore vérifié.` } },
    { id: 'e', t: `Or ${K('g\'(c) = f\'(c) - p')} : donc ${K('f\'(c) = p')}, c'est-à-dire ${K('f(b) - f(a) = f\'(c)(b - a)')}.`, dep: { d: `Cette étape emploie le point ${K('c')}, qui n'a pas encore été obtenu.` } }],
    intrus: [{ id: 'x', t: `Le théorème de Rolle s'applique à ${K('f')} : il existe ${K('c \\in \\,]a, b[')} tel que ${K('f\'(c) = 0')}.`, pourquoi: `Le théorème de Rolle exige ${K('f(a) = f(b)')}, que l'énoncé ne suppose pas. C'est précisément pour s'y ramener que l'on retranche à ${K('f')} la fonction affine dont la courbe est la corde.` },
      { id: 'y', t: `Or ${K('g\'(c) = f\'(c) - p(c - a)')} : donc ${K('f\'(c) = p(c - a)')}.`, pourquoi: `La dérivée est mal calculée : la dérivée de ${K('x \\mapsto p(x - a)')} est la constante ${K('p')}, et celle de la constante ${K('f(a)')} est nulle.` }] },
  { id: 'noyau', nom: 'Injectivité et noyau', niveau: 'sup', cours: 'ma-14', enonce: `Soit ${K('u : E \\to F')} une application linéaire. Alors ${K('u')} est injective si et seulement si ${K('\\operatorname{Ker} u = \\{0_E\\}')}.`, blocs: 'Vous mêlez les deux sens de l\'équivalence : terminez la démonstration d\'un sens avant de commencer celle de l\'autre.', etapes: [
    { id: 'a', bloc: 1, t: `Sens direct. Supposons ${K('u')} injective, et soit ${K('x \\in \\operatorname{Ker} u')}.`, dep: {} },
    { id: 'b', bloc: 1, t: `Alors ${K('u(x) = 0_F = u(0_E)')}, puisqu'une application linéaire envoie ${K('0_E')} sur ${K('0_F')}.`, dep: { a: `Cette étape parle d'un vecteur ${K('x')} du noyau, qui n'a pas encore été introduit.` } },
    { id: 'c', bloc: 1, t: `Par injectivité, ${K('x = 0_E')}. Ainsi ${K('\\operatorname{Ker} u \\subset \\{0_E\\}')}, et l'inclusion inverse est toujours vraie : ${K('\\operatorname{Ker} u = \\{0_E\\}')}.`, dep: { b: `L'injectivité s'applique à une égalité ${K('u(x) = u(0_E)')}, qui n'est pas encore écrite.` } },
    { id: 'd', bloc: 2, t: `Réciproque. Supposons ${K('\\operatorname{Ker} u = \\{0_E\\}')}, et soit ${K('x')} et ${K('y')} deux vecteurs de ${K('E')} tels que ${K('u(x) = u(y)')}.`, dep: {} },
    { id: 'e', bloc: 2, t: `Par linéarité, ${K('u(x - y) = u(x) - u(y) = 0_F')} : le vecteur ${K('x - y')} appartient à ${K('\\operatorname{Ker} u')}.`, dep: { d: `Cette étape parle de deux vecteurs ${K('x')} et ${K('y')} tels que ${K('u(x) = u(y)')}, qui n'ont pas encore été introduits.` } },
    { id: 'f', bloc: 2, t: `Donc ${K('x - y = 0_E')}, c'est-à-dire ${K('x = y')} : l'application ${K('u')} est injective.`, dep: { e: `Il faut avoir établi que ${K('x - y')} appartient au noyau.` } }],
    intrus: [{ id: 'x', t: `Réciproque. Supposons ${K('\\operatorname{Ker} u = \\{0_E\\}')}, et soit ${K('x')} tel que ${K('u(x) = 0_F')} : alors ${K('x = 0_E')}, donc ${K('u')} est injective.`, pourquoi: `Cette phrase redit seulement que le noyau est réduit à ${K('0_E')}. L'injectivité concerne deux vecteurs quelconques ayant la même image : il faut partir de ${K('u(x) = u(y)')} et se ramener au noyau par linéarité.` },
      { id: 'y', t: `Par linéarité, ${K('u(x - y) = 0_F')}, donc ${K('u(x) = 0_F')} et ${K('u(y) = 0_F')}.`, pourquoi: `De ${K('u(x) - u(y) = 0_F')} on tire ${K('u(x) = u(y)')}, et rien de plus : les deux images sont égales, pas nulles.` }] },
  { id: 'cantor', nom: 'Théorème de Cantor', niveau: 'sup', cours: 'ma-02', enonce: `Pour tout ensemble ${K('E')}, il n'existe aucune surjection de ${K('E')} sur l'ensemble ${K('\\mathcal{P}(E)')} de ses parties.`, etapes: [
    { id: 'a', t: `Soit ${K('f : E \\to \\mathcal{P}(E)')} une application quelconque. Considérons la partie ${K('D = \\{x \\in E \\mid x \\notin f(x)\\}')} de ${K('E')}.`, dep: {} },
    { id: 'b', t: `Supposons par l'absurde que ${K('D')} ait un antécédent ${K('a \\in E')} : ${K('f(a) = D')}.`, dep: { a: `Cette étape parle de la partie ${K('D')}, qui n'a pas encore été définie.` } },
    { id: 'c', t: `Si ${K('a \\in D')}, alors, par définition de ${K('D')}, ${K('a \\notin f(a) = D')} : c'est contradictoire.`, dep: { b: `Cette étape emploie l'élément ${K('a')}, qui n'a pas encore été introduit.` } },
    { id: 'd', t: `Si ${K('a \\notin D')}, alors ${K('a \\notin f(a)')} : l'élément ${K('a')} vérifie la condition qui définit ${K('D')}, donc ${K('a \\in D')}. C'est encore contradictoire.`, dep: { b: `Cette étape emploie l'élément ${K('a')}, qui n'a pas encore été introduit.` } },
    { id: 'e', t: `Les deux cas sont impossibles : ${K('D')} n'a pas d'antécédent par ${K('f')}, et ${K('f')} n'est pas surjective.`, dep: { c: `Il reste à examiner le cas ${K('a \\in D')}.`, d: `Il reste à examiner le cas ${K('a \\notin D')}.` } }],
    intrus: [{ id: 'x', t: `Soit ${K('f : E \\to \\mathcal{P}(E)')} une application quelconque. Considérons la partie ${K('D = \\{x \\in E \\mid x \\in f(x)\\}')} de ${K('E')}.`, pourquoi: `Avec cette partie, l'argument ne donne rien : si ${K('f(a) = D')}, alors « ${K('a \\in D')} » équivaut à « ${K('a \\in f(a)')} », c'est-à-dire à lui-même, sans contradiction. C'est la négation, ${K('x \\notin f(x)')}, qui fait tout.` },
      { id: 'y', t: `Comme ${K('\\mathcal{P}(E)')} a plus d'éléments que ${K('E')}, aucune application de ${K('E')} dans ${K('\\mathcal{P}(E)')} n'est surjective.`, pourquoi: `C'est l'énoncé lui-même, redit autrement : pour un ensemble infini, « avoir plus d'éléments » n'a de sens que par l'absence de surjection, qui est ce qu'il faut démontrer.` }] },
  { id: 'cs', nom: 'Inégalité de Cauchy-Schwarz', niveau: 'sup', cours: 'ma-19', enonce: `Soit ${K('E')} un espace préhilbertien réel. Pour tous vecteurs ${K('x')} et ${K('y')} de ${K('E')}, on a ${K('|\\langle x, y \\rangle| \\leqslant \\|x\\| \\, \\|y\\|')}.`, etapes: [
    { id: 'a', t: `Si ${K('y = 0')}, les deux membres sont nuls et l'inégalité est vraie. Supposons désormais ${K('y \\neq 0')}.`, dep: {} },
    { id: 'b', t: `Pour tout réel ${K('t')}, posons ${K('P(t) = \\|x + ty\\|^2 = \\|y\\|^2 t^2 + 2\\langle x, y \\rangle\\, t + \\|x\\|^2')}.`, dep: {} },
    { id: 'c', t: `Comme ${K('y \\neq 0')}, on a ${K('\\|y\\|^2 > 0')} : la fonction ${K('P')} est un trinôme du second degré, et ${K('P(t) \\geqslant 0')} pour tout réel ${K('t')}.`, dep: { b: `Cette étape parle de la fonction ${K('P')}, qui n'a pas encore été définie.`, a: `Pour que ${K('P')} soit du second degré, il faut avoir supposé ${K('y \\neq 0')}.` } },
    { id: 'd', t: `Un trinôme qui ne prend que des valeurs positives ou nulles a au plus une racine réelle : son discriminant est négatif ou nul.`, dep: { c: `Il faut avoir établi que ${K('P')} est un trinôme du second degré à valeurs positives ou nulles.` } },
    { id: 'e', t: `Donc ${K('4\\langle x, y \\rangle^2 - 4\\|x\\|^2\\|y\\|^2 \\leqslant 0')}, c'est-à-dire ${K('\\langle x, y \\rangle^2 \\leqslant \\|x\\|^2\\|y\\|^2')}.`, dep: { d: `Il faut avoir établi le signe du discriminant.` } },
    { id: 'f', t: `La racine carrée étant croissante sur ${K('\\mathbb{R}_+')}, on en déduit ${K('|\\langle x, y \\rangle| \\leqslant \\|x\\| \\, \\|y\\|')}.`, dep: { e: `Il faut disposer de l'inégalité entre les carrés.` } }],
    intrus: [{ id: 'x', t: `Un trinôme du second degré a toujours deux racines réelles distinctes : son discriminant est strictement positif.`, pourquoi: `C'est faux : ${K('t^2 + 1')} n'a aucune racine réelle. Ici, le trinôme ne change pas de signe, donc il ne peut pas avoir deux racines distinctes : son discriminant est négatif ou nul.` },
      { id: 'y', t: `En prenant la racine carrée des deux membres, on en déduit ${K('\\langle x, y \\rangle = \\|x\\| \\, \\|y\\|')}.`, pourquoi: `D'une inégalité entre carrés on tire une inégalité entre valeurs absolues, pas une égalité : ${K('\\sqrt{\\langle x, y \\rangle^2} = |\\langle x, y \\rangle|')}, et l'égalité n'a lieu que si ${K('x')} et ${K('y')} sont colinéaires.` }] },
  { id: 'harmonique', nom: 'Divergence de la série harmonique', niveau: 'sup', cours: 'ma-20', enonce: `La suite de terme général ${K('H_n = 1 + \\dfrac12 + \\dots + \\dfrac1n')} tend vers ${K('+\\infty')}.`, etapes: [
    { id: 'a', t: `Pour tout entier ${K('n \\geqslant 1')}, on a ${K('H_{2n} - H_n = \\dfrac{1}{n+1} + \\dfrac{1}{n+2} + \\dots + \\dfrac{1}{2n}')}.`, dep: {} },
    { id: 'b', t: `Cette somme compte ${K('n')} termes, tous supérieurs ou égaux à ${K('\\dfrac{1}{2n}')} : donc ${K('H_{2n} - H_n \\geqslant n \\times \\dfrac{1}{2n} = \\dfrac12')}.`, dep: { a: `« Cette somme » n'a pas encore été écrite.` } },
    { id: 'c', t: `La suite ${K('(H_n)')} est croissante : d'après le théorème de la limite monotone, ou bien elle converge vers un réel, ou bien elle tend vers ${K('+\\infty')}.`, dep: {} },
    { id: 'd', t: `Supposons par l'absurde qu'elle converge vers un réel ${K('\\ell')}. Alors la suite extraite ${K('(H_{2n})')} converge aussi vers ${K('\\ell')}, donc ${K('H_{2n} - H_n')} tend vers 0.`, dep: { c: `Il faut d'abord savoir que la suite n'a que deux comportements possibles, pour que l'hypothèse absurde ait un contraire.` } },
    { id: 'e', t: `C'est incompatible avec ${K('H_{2n} - H_n \\geqslant \\dfrac12')} pour tout ${K('n')}. La suite ne converge donc pas : elle tend vers ${K('+\\infty')}.`, dep: { b: `Il faut avoir minoré ${K('H_{2n} - H_n')}.`, d: `Il faut avoir établi que ${K('H_{2n} - H_n')} tendrait vers 0.` } }],
    intrus: [{ id: 'x', t: `Le terme ${K('\\dfrac1n')} ajouté à chaque étape tend vers 0 : la suite ${K('(H_n)')} converge donc.`, pourquoi: `C'est la réciproque fausse qui fait tout l'intérêt de cet exemple. Si une série converge, son terme général tend vers 0 ; mais un terme général qui tend vers 0 ne garantit rien, et la série harmonique en est le contre-exemple de référence.` },
      { id: 'y', t: `Cette somme compte ${K('n')} termes, tous inférieurs ou égaux à ${K('\\dfrac1n')} : donc ${K('H_{2n} - H_n \\geqslant 1')}.`, pourquoi: `Majorer chaque terme donne une majoration de la somme, pas une minoration : on obtiendrait ${K('H_{2n} - H_n \\leqslant 1')}, qui ne sert à rien ici. Pour minorer la somme, il faut minorer chaque terme.` }] },
];

// Vérifie une démonstration (liste d'identifiants). Rend { ok } ou { pos, texte } (pos : rang de l'étape en défaut, -1 s'il manque des étapes).
export function verifier(piece, L) {
  for (let i = 0; i < L.length; i++) { const x = piece.intrus.find(e => e.id === L[i]); if (x) return { pos: i, intrus: true, texte: x.pourquoi };
    const e = piece.etapes.find(s => s.id === L[i]); for (const d in e.dep) if (!L.slice(0, i).includes(d)) return { pos: i, texte: e.dep[d] }; }
  if (piece.blocs) { const B = L.map(id => piece.etapes.find(s => s.id === id).bloc), clos = new Set();
    for (let i = 0; i < B.length; i++) { if (i && B[i] !== B[i - 1]) { clos.add(B[i - 1]); if (clos.has(B[i])) return { pos: i, texte: piece.blocs }; } } }
  const manque = piece.etapes.length - L.length; if (manque > 0) return { pos: -1, texte: `Tout ce qui est écrit s'enchaîne correctement, mais la démonstration n'est pas terminée : il manque ${manque} étape${manque > 1 ? 's' : ''}.` };
  return { ok: true };
}
// Thèmes des dix premières pièces de Maths Sup, puis réunion de toutes les pièces, rangées par niveau et, en Maths Sup, par thème (§145).
const TH = { unicite: 'analyse', bornee: 'analyse', monotone: 'analyse', rolle: 'analyse', taf: 'analyse', harmonique: 'analyse', gauss: 'algebre', noyau: 'lineaire', cs: 'lineaire', cantor: 'fondements' };
for (const p of ANCIENNES) p.theme = TH[p.id] || '';
const PIECES = ANCIENNES.concat(premiere, terminale, expertes, sup);
// Pièces montrées aussi sous un second niveau : Bézout et Gauss figurent au programme de Maths expertes (§146).
for (const p of PIECES) if (p.id === 'bezout' || p.id === 'gauss') p.aussi = ['expertes'];
export { PIECES };

export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], L = [], ordre = [], msg = '', cl = '', marque = -1, conseil = '', niveau = 'tous', theme = 'tous', nbIntrus = 1, vivant = true;
  const texte = id => (P.etapes.find(e => e.id === id) || P.intrus.find(e => e.id === id)).t, visibles = () => filtrer(PIECES, niveau, theme);
  function listes() { const M = lireMemoire('ordonner'), V = visibles();
    ecrire(q('#od-niveaux'), pucesNiveaux(PIECES, niveau), true); const th = q('#od-themes'); th.hidden = niveau !== 'sup'; if (niveau === 'sup') ecrire(th, pucesThemes(PIECES, theme), true);
    if (!V.includes(P)) P = V[0]; const sel = q('#od-piece'); sel.innerHTML = options(V, niveau, theme, M); sel.value = P.id; }
  function charger() { nbIntrus = +q('#od-intrus').value; L = []; ordre = P.etapes.concat(P.intrus.slice(0, nbIntrus)).map(e => e.id); for (let i = ordre.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ordre[i], ordre[j]] = [ordre[j], ordre[i]]; } raz(); }
  const raz = () => { msg = ''; cl = ''; marque = -1; conseil = ''; rendre(); };
  const pas = (id, i) => i >= 0
    ? `<li class="od-pas${marque === i ? ' faute' : ''}${cl === ' gagne' ? ' juste' : ''}" data-id="${id}" data-i="${i}"><span class="poignee" aria-hidden="true">⋮⋮</span><span>${texte(id)}</span><span class="cmd"><button type="button" data-a="h" data-i="${i}" ${i ? '' : 'disabled'} aria-label="Monter l'étape ${i + 1}">↑</button><button type="button" data-a="b" data-i="${i}" ${i < L.length - 1 ? '' : 'disabled'} aria-label="Descendre l'étape ${i + 1}">↓</button><button type="button" data-a="x" data-i="${i}" aria-label="Renvoyer l'étape ${i + 1} en réserve">✕</button></span></li>`
    : `<li class="od-pas${conseil === id ? ' conseil' : ''}" data-id="${id}" tabindex="0" role="button"><span class="poignee" aria-hidden="true">⋮⋮</span><span>${texte(id)}</span><button type="button" tabindex="-1" aria-hidden="true">+</button></li>`;
  function rendre() { if (!vivant) return; const fait = lireMemoire('ordonner')[P.id];
    ecrire(q('#od-enonce'), '<b>À démontrer</b>' + P.enonce + (fait ? ` <span class="rz-fait">Fait${fait > 1 ? `, avec ${fait === 2 ? 'un intrus' : 'deux intrus'}` : ''}</span>` : '') + (P.cours ? ` <a class="rz-cours" href="#cours/${P.cours}">Le résultat dans le cours</a>` : ''), true);
    ecrire(q('#od-preuve'), L.length ? L.map((id, i) => pas(id, i)).join('') : '<li class="od-vide">Faites glisser ici les phrases de la réserve, ou cliquez sur elles.</li>', true);
    const R = ordre.filter(id => !L.includes(id));
    ecrire(q('#od-reserve'), R.length ? R.map(id => pas(id, -1)).join('') : '<li class="od-vide">La réserve est vide.</li>', true);
    const m = q('#od-message'); m.className = 'jeu-message' + cl; ecrire(m, msg || `Reconstituez la démonstration, puis cliquez sur « Vérifier ».${nbIntrus ? ` Attention : ${nbIntrus === 1 ? 'une phrase de la réserve est un intrus' : 'deux phrases de la réserve sont des intrus'}.` : ''}`, true); }
  const ajouter = id => { L.push(id); raz(); };
  q('#od-reserve').addEventListener('click', e => { if (clicAnnule) return; const li = e.target.closest('li[data-id]'); if (li) ajouter(li.dataset.id); });
  q('#od-reserve').addEventListener('keydown', e => { const li = e.target.closest('li[data-id]'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ajouter(li.dataset.id); } });
  q('#od-preuve').addEventListener('click', e => { if (clicAnnule) return; const b = e.target.closest('button[data-a]'); if (!b) return; const i = +b.dataset.i, a = b.dataset.a;
    if (a === 'x') L.splice(i, 1); else { const j = a === 'h' ? i - 1 : i + 1; [L[i], L[j]] = [L[j], L[i]]; } raz(); });
  q('#od-verifier').addEventListener('click', () => { conseil = ''; if (!L.length) { msg = 'Votre démonstration est vide.'; cl = ''; rendre(); return; } const r = verifier(P, L);
    if (r.ok) { msg = 'La démonstration est complète, et chaque étape s\'appuie sur ce qui la précède.' + (P.cours ? ' Le cours établit ce résultat, avec ses remarques.' : ''); cl = ' gagne'; marque = -1; noterMemoire('ordonner', P.id, nbIntrus + 1); listes(); }
    else { marque = r.pos; cl = r.pos < 0 ? '' : ' bloque'; msg = (r.pos >= 0 ? `<b>Étape ${r.pos + 1}${r.intrus ? ' : c\'est un intrus' : ''}.</b> ` : '') + r.texte; } rendre(); });
  q('#od-indice').addEventListener('click', () => { marque = -1; cl = ''; const r = verifier(P, L);
    if (r.pos >= 0) { marque = r.pos; msg = `Vous avez demandé un indice : commencez par revoir l'étape ${r.pos + 1}, marquée d'un filet rouge.`; }
    else { const s = P.etapes.find(e => !L.includes(e.id) && Object.keys(e.dep).every(d => L.includes(d)) && !verifier(P, L.concat([e.id])).texte?.startsWith?.('Vous mêlez')); conseil = s ? s.id : ''; msg = s ? 'Vous avez demandé un indice : la phrase entourée de vert, dans la réserve, peut être écrite maintenant.' : 'Vous avez demandé un indice : la démonstration est complète.'; } rendre(); });
  q('#od-depart').addEventListener('click', () => { L = []; raz(); });
  q('#od-piece').addEventListener('change', e => { P = PIECES.find(p => p.id === e.target.value); charger(); }); q('#od-intrus').addEventListener('change', charger);
  q('#od-niveaux').addEventListener('click', e => { const b = e.target.closest('button[data-n]'); if (!b) return; niveau = b.dataset.n; theme = 'tous'; listes(); charger(); });
  q('#od-themes').addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; theme = b.dataset.t; listes(); charger(); });

  // Glisser-déposer : à la souris, on saisit une phrase n'importe où ; au doigt, par sa poignée (pour que la page puisse encore défiler).
  let glisse = null, clicAnnule = false; const fantome = document.createElement('p'); fantome.className = 'od-fantome'; fantome.hidden = true; document.body.append(fantome);
  const zones = () => ({ pr: q('#od-zone-preuve').getBoundingClientRect(), re: q('#od-zone-reserve').getBoundingClientRect() }), dans = (r, x, y) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  function cible(x, y) { const { pr, re } = zones(); if (dans(pr, x, y)) { const items = [...q('#od-preuve').querySelectorAll('li.od-pas')]; let k = items.length; for (let i = 0; i < items.length; i++) { const r = items[i].getBoundingClientRect(); if (y < r.top + r.height / 2) { k = i; break; } } return { zone: 'preuve', k }; }
    return dans(re, x, y) ? { zone: 'reserve' } : { zone: '' }; }
  function marquer(c) { racine.querySelectorAll('.insertion').forEach(e => e.remove()); q('#od-zone-preuve').classList.toggle('vise', c.zone === 'preuve'); q('#od-zone-reserve').classList.toggle('vise', c.zone === 'reserve' && glisse.de >= 0);
    if (c.zone !== 'preuve') return; const ol = q('#od-preuve'), items = [...ol.querySelectorAll('li.od-pas')], m = document.createElement('li'); m.className = 'insertion'; m.setAttribute('aria-hidden', 'true'); if (c.k < items.length) ol.insertBefore(m, items[c.k]); else ol.append(m); }
  function debut(e) { if (e.button) return; const li = e.target.closest('li.od-pas[data-id]'); if (!li || e.target.closest('button[data-a]')) return; if (e.pointerType !== 'mouse' && !e.target.closest('.poignee')) return;
    glisse = { id: li.dataset.id, de: li.dataset.i !== undefined ? +li.dataset.i : -1, x0: e.clientX, y0: e.clientY, bouge: false, li, w: li.getBoundingClientRect().width }; }
  function suite_(e) { if (!glisse) return; if (!glisse.bouge) { if (Math.hypot(e.clientX - glisse.x0, e.clientY - glisse.y0) < 7) return; glisse.bouge = true; glisse.li.classList.add('porte'); fantome.innerHTML = glisse.li.children[1].innerHTML; fantome.style.width = Math.min(glisse.w, 520) + 'px'; fantome.hidden = false; }
    e.preventDefault(); fantome.style.left = (e.clientX + 10) + 'px'; fantome.style.top = (e.clientY + 8) + 'px'; marquer(cible(e.clientX, e.clientY)); }
  function fin(e) { if (!glisse) return; const g = glisse; glisse = null; fantome.hidden = true; racine.querySelectorAll('.insertion').forEach(x => x.remove()); racine.querySelectorAll('.od-zone').forEach(z => z.classList.remove('vise')); if (!g.bouge) return;
    clicAnnule = true; setTimeout(() => { clicAnnule = false; }, 0); const c = e.type === 'pointercancel' ? { zone: '' } : cible(e.clientX, e.clientY);
    if (c.zone === 'preuve') { let k = c.k; if (g.de >= 0) { L.splice(g.de, 1); if (g.de < k) k--; } L.splice(k, 0, g.id); raz(); } else if (c.zone === 'reserve' && g.de >= 0) { L.splice(g.de, 1); raz(); } else rendre(); }
  racine.addEventListener('pointerdown', debut); document.addEventListener('pointermove', suite_, { passive: false }); document.addEventListener('pointerup', fin); document.addEventListener('pointercancel', fin);

  listes(); charger();
  return () => { vivant = false; fantome.remove(); document.removeEventListener('pointermove', suite_); document.removeEventListener('pointerup', fin); document.removeEventListener('pointercancel', fin); };
}
