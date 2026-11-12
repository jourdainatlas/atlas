// Raisonner « Trouver l'erreur », rubrique Activités, MEMO_atlas_activites.md §143 et §144.
import { css as cssCommun } from './commun.js';
import { cssRaison, lireMemoire, noterMemoire, filtrer, pucesNiveaux, pucesThemes, options } from './raisonner.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire } from './jeux.js';
import premiere from './erreur-premiere.js';
import terminale from './erreur-terminale.js';
import expertes from './erreur-expertes.js';
import sup from './erreur-sup.js';

export const css = cssCommun + cssFigures + cssJeux + cssRaison + `
.activites-act .er-enonce { padding: 12px 16px; border-bottom: 1px solid var(--filet); font: 17px/1.5 var(--f-texte, Georgia, serif); color: var(--encre); }
.activites-act .er-enonce b { font-family: var(--f-ui); font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: var(--activites-jeu); margin-right: 8px; }
.activites-act .er-lignes { display: grid; gap: 8px; padding: 14px 16px; margin: 0; list-style: none; counter-reset: ligne; }
.activites-act .er-lignes button { counter-increment: ligne; width: 100%; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 10px; align-items: start; text-align: left; padding: 10px 12px; border: 1px solid var(--encre-3); border-radius: 6px; background: var(--surface); color: var(--encre); font: 16px/1.5 var(--f-texte, Georgia, serif); }
.activites-act .er-lignes button::before { content: counter(ligne); font: 700 13px var(--f-mono); color: var(--encre-3); padding-top: 3px; min-width: 1.2em; }
.activites-act .er-lignes button:hover:not(:disabled) { border-color: var(--activites-jeu); }
.activites-act .er-lignes button .etat { font: 600 12.5px var(--f-ui); white-space: nowrap; padding-top: 3px; }
.activites-act .er-lignes button.juste { border-color: var(--tan); } .activites-act .er-lignes button.juste .etat { color: var(--tan); }
.activites-act .er-lignes button.faute { border-color: var(--rouge); box-shadow: inset 4px 0 0 var(--rouge); background: var(--rouge-fond); } .activites-act .er-lignes button.faute .etat { color: var(--rouge); }
.activites-act .er-lignes button:disabled { cursor: default; opacity: 1; }
.activites-act .er-retenir { margin: 0 16px 14px; padding: 10px 14px; border-left: 3px solid var(--tan); background: color-mix(in srgb, var(--tan) 8%, var(--surface)); font: 15.5px/1.55 var(--f-texte, Georgia, serif); color: var(--encre); }
@media (max-width: 640px) { .activites-act .er-lignes button { grid-template-columns: auto minmax(0, 1fr); } .activites-act .er-lignes button .etat { grid-column: 2; padding-top: 0; } .activites-act .er-lignes button .etat:empty { display: none; } }
`;
const K = t => '<span class="kx">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Raisonner · de la Première à Maths Sup</p>
  <h3>Trouver l'erreur</h3>
  <p class="lede">Chacun de ces raisonnements aboutit à une absurdité ou à un résultat faux : 1 = 2, 2 &gt; 3, 0 = 1, tous les chevaux ont la même couleur. Toutes les lignes ont l'air justes, et toutes le sont, sauf une. Laquelle ?</p>
</header>

<div class="jeu">
  <div class="bar top">
    <span class="rz-niveaux" id="er-niveaux" role="group" aria-label="Niveau"></span>
    <span class="rz-niveaux" id="er-themes" role="group" aria-label="Thème de Maths Sup" hidden></span>
  </div>
  <div class="bar">
    <label class="rz-choix">Raisonnement <select id="er-piece"></select></label>
    <button type="button" class="primary" id="er-depart">Recommencer</button>
    <button type="button" id="er-indice">Un indice</button>
  </div>
  <p class="er-enonce" id="er-enonce"></p>
  <ol class="er-lignes" id="er-lignes"></ol>
  <div class="jeu-message" id="er-message" aria-live="polite"></div>
  <p class="er-retenir" id="er-retenir" hidden></p>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Comment jouer</h4>
    <p>Choisissez un niveau et, pour Maths Sup, un thème (fondements, algèbre, algèbre linéaire, analyse, probabilités), puis un raisonnement. Lisez-le, puis cliquez sur la ligne que vous croyez fautive. Si vous vous trompez, la page dit pourquoi cette ligne-là est correcte, et vous laisse chercher encore. Quand vous trouvez, elle explique l'erreur et ce qu'il faut en retenir. Le nombre d'essais est compté : un raisonnement lu avec soin se résout au premier. Un raisonnement résolu est marqué d'une coche dans la liste, et votre navigateur s'en souvient ; « Recommencer » permet de le refaire.</p>
    <p>Une ligne est fautive quand le passage de la ligne précédente à celle-ci n'est pas justifié. Les lignes qui suivent l'erreur sont souvent fausses elles aussi, mais elles se déduisent correctement de la ligne fautive : ce n'est pas elles qu'il faut désigner. La faute peut aussi se trouver dès la première ligne, quand elle introduit un objet qui n'existe pas, et quelques raisonnements aboutissent à un résultat faux sans être absurde : c'est alors la règle invoquée qu'il faut contrôler.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Pourquoi chercher des erreurs</h4>
    <p>Une conclusion absurde prouve qu'une étape est fausse, sans dire laquelle : c'est le principe même du raisonnement par l'absurde, retourné contre l'auteur. Trouver l'étape oblige à vérifier, pour chaque « donc », la règle qui l'autorise et les conditions de cette règle. Diviser exige un diviseur non nul ; multiplier une inégalité exige de connaître le signe du facteur ; une hérédité doit valoir pour tous les rangs, y compris le premier ; la somme d'une série n'existe que si la série converge.</p>
    <p>Ces fautes ne sont pas des curiosités. Ce sont celles que l'on commet soi-même dans un calcul long, quand la conclusion a l'air raisonnable et que rien n'alerte.</p>
  </div>
</section>
` + suite(
  "Désigner la dernière ligne, parce que c'est elle qui est absurde. La dernière ligne est fausse, mais elle découle correctement de la précédente : l'erreur est en amont, à l'endroit où une règle a été appliquée hors de ses conditions. L'autre réflexe trompeur est de soupçonner l'étape la plus compliquée ; l'erreur se cache presque toujours dans l'étape qui paraît aller de soi.",
  "Sous chaque raisonnement, un lien mène au chapitre du cours qui établit la règle en cause : par exemple <a href=\"#cours/t-05\">Fonctions exponentielle et logarithme</a> pour le signe d'un logarithme, ou <a href=\"#cours/ma-20\">Séries et familles sommables</a> pour la somme d'une série ; le principe de récurrence, avec le rôle de l'initialisation et de l'hérédité, est à la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a> de l'édifice.",
  "Rien n'est calculé : chaque ligne porte l'explication de sa justesse, ou de sa faute, rédigée à l'avance. Votre navigateur retient seulement quels raisonnements ont été résolus, et en combien d'essais ; rien n'est envoyé.");

// Une pièce : annonce, lignes { t, ok (pourquoi la ligne est juste) } ; faute : rang de la ligne fautive ; pourquoi, retenir, indice.
const ANCIENNES = [
  { id: 'un-deux', niveau: 'premiere', cours: '', nom: '1 = 2', annonce: `Soit ${K('a')} et ${K('b')} deux nombres réels égaux et non nuls. « Démontrons » que ${K('2 = 1')}.`, faute: 4, lignes: [
    { t: `On a ${K('a = b')}.`, ok: `C'est l'hypothèse.` },
    { t: `En multipliant les deux membres par ${K('a')} : ${K('a^2 = ab')}.`, ok: `Multiplier les deux membres d'une égalité par un même nombre donne une égalité.` },
    { t: `En retranchant ${K('b^2')} aux deux membres : ${K('a^2 - b^2 = ab - b^2')}.`, ok: `Retrancher un même nombre aux deux membres d'une égalité donne une égalité.` },
    { t: `En factorisant : ${K('(a - b)(a + b) = b(a - b)')}.`, ok: `Les deux factorisations sont exactes : identité remarquable à gauche, mise en facteur de ${K('b')} à droite.` },
    { t: `En simplifiant par ${K('a - b')} : ${K('a + b = b')}.` },
    { t: `Comme ${K('a = b')}, cela s'écrit ${K('2b = b')}.`, ok: `Cette ligne remplace ${K('a')} par ${K('b')} dans la ligne précédente : le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` },
    { t: `En divisant par ${K('b')}, qui n'est pas nul : ${K('2 = 1')}.`, ok: `La division par ${K('b')} est permise, puisque ${K('b \\neq 0')} : le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` }],
    pourquoi: `Simplifier par ${K('a - b')}, c'est diviser par ${K('a - b')}. Or ${K('a = b')}, donc ${K('a - b = 0')} : on a divisé par zéro. La ligne 4 dit seulement ${K('0 = 0')}, dont on ne peut rien tirer.`,
    retenir: `Avant de simplifier une égalité par une expression, on s'assure qu'elle n'est pas nulle. De ${K('xy = xz')} on déduit ${K('x = 0')} ou ${K('y = z')}, et non ${K('y = z')}.`, indice: `Une opération n'est permise qu'avec un nombre non nul. Quelles quantités sont nulles ici ?` },
  { id: 'deux-trois', niveau: 'terminale', cours: 't-05', nom: '2 > 3', annonce: `« Démontrons » que ${K('2 > 3')}.`, faute: 4, lignes: [
    { t: `On a ${K('\\dfrac14 > \\dfrac18')}.`, ok: `C'est exact : ${K('0{,}25 > 0{,}125')}.` },
    { t: `Autrement dit, ${K('\\left(\\dfrac12\\right)^2 > \\left(\\dfrac12\\right)^3')}.`, ok: `C'est la même inégalité, écrite avec des puissances.` },
    { t: `La fonction logarithme étant strictement croissante : ${K('\\ln\\left(\\left(\\dfrac12\\right)^2\\right) > \\ln\\left(\\left(\\dfrac12\\right)^3\\right)')}.`, ok: `Une fonction strictement croissante conserve le sens des inégalités, et les deux nombres sont strictement positifs.` },
    { t: `Donc ${K('2 \\ln\\dfrac12 > 3 \\ln\\dfrac12')}.`, ok: `C'est la règle ${K('\\ln(x^n) = n \\ln x')}, valable pour ${K('x > 0')}.` },
    { t: `En divisant les deux membres par ${K('\\ln\\dfrac12')} : ${K('2 > 3')}.` }],
    pourquoi: `Le nombre ${K('\\ln\\dfrac12 = -\\ln 2')} est strictement négatif. Diviser les deux membres d'une inégalité par un nombre strictement négatif en renverse le sens : la conclusion correcte est ${K('2 < 3')}.`,
    retenir: `On ne multiplie ni ne divise une inégalité par un nombre sans connaître son signe. Le logarithme d'un nombre compris entre 0 et 1 est négatif.`, indice: `Toutes les quantités écrites sont-elles positives ?` },
  { id: 'chevaux', niveau: 'terminale', cours: 't-01', nom: 'Les chevaux de même couleur', annonce: `« Démontrons » par récurrence que, pour tout entier ${K('n \\geqslant 1')}, dans tout ensemble de ${K('n')} chevaux, tous les chevaux ont la même couleur.`, faute: 5, lignes: [
    { t: `Notons ${K('P(n)')} : « dans tout ensemble de ${K('n')} chevaux, tous ont la même couleur ».`, ok: `C'est seulement la définition de la propriété à démontrer.` },
    { t: `Initialisation : dans un ensemble d'un seul cheval, tous les chevaux ont la même couleur. Donc ${K('P(1)')} est vraie.`, ok: `C'est exact : avec un seul cheval, il n'y a rien à comparer.` },
    { t: `Hérédité : soit ${K('n \\geqslant 1')} tel que ${K('P(n)')} soit vraie, et soit un ensemble de ${K('n + 1')} chevaux, numérotés de ${K('1')} à ${K('n + 1')}.`, ok: `C'est la manière correcte de commencer une hérédité : on fixe un entier ${K('n \\geqslant 1')} quelconque.` },
    { t: `Les chevaux ${K('1')} à ${K('n')} forment un ensemble de ${K('n')} chevaux : d'après ${K('P(n)')}, ils ont tous la même couleur.`, ok: `C'est une application correcte de l'hypothèse de récurrence à un ensemble de ${K('n')} chevaux.` },
    { t: `De même, les chevaux ${K('2')} à ${K('n + 1')} sont au nombre de ${K('n')} : ils ont tous la même couleur.`, ok: `C'est encore une application correcte de l'hypothèse de récurrence.` },
    { t: `Ces deux groupes ont un cheval en commun, le cheval ${K('2')} : les ${K('n + 1')} chevaux ont donc tous sa couleur, et ${K('P(n + 1)')} est vraie.` },
    { t: `Par le principe de récurrence, ${K('P(n)')} est vraie pour tout ${K('n \\geqslant 1')}.`, ok: `Le principe de récurrence est correctement invoqué : dès que l'initialisation et l'hérédité sont établies, la conclusion suit. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` }],
    pourquoi: `Pour ${K('n = 1')}, les deux groupes sont « le cheval 1 » et « le cheval 2 » : ils n'ont aucun cheval en commun, et le cheval 2 n'appartient pas au premier groupe. L'hérédité doit valoir pour tout ${K('n \\geqslant 1')} ; elle échoue pour ${K('n = 1')}, c'est-à-dire au passage de ${K('P(1)')} à ${K('P(2)')}. Elle est correcte pour tout ${K('n \\geqslant 2')}, mais cela ne sert à rien : ${K('P(2)')} est fausse.`,
    retenir: `Dans une hérédité, on vérifie que l'argument fonctionne pour le plus petit rang autorisé. Une récurrence dont le premier pas manque ne démontre rien, même si tous les suivants sont justes.`, indice: `Essayez le raisonnement avec ${K('n = 1')}, donc avec deux chevaux.` },
  { id: 'derivee', niveau: 'premiere', cours: 'p-04', nom: '2 = 1 par dérivation', annonce: `« Démontrons » que ${K('2 = 1')}, en dérivant.`, faute: 2, lignes: [
    { t: `Pour tout entier ${K('x \\geqslant 1')}, on a ${K('x^2 = x + x + \\dots + x')}, où la somme compte ${K('x')} termes.`, ok: `C'est exact : ajouter ${K('x')} fois le nombre ${K('x')}, c'est calculer ${K('x \\times x')}.` },
    { t: `La dérivée du membre de gauche, ${K('x \\mapsto x^2')}, est ${K('x \\mapsto 2x')}.`, ok: `C'est la dérivée de la fonction carré.` },
    { t: `À droite, chaque terme ${K('x')} a pour dérivée 1, et il y a ${K('x')} termes : la dérivée du membre de droite est ${K('1 + 1 + \\dots + 1 = x')}.` },
    { t: `Les deux membres étant égaux, leurs dérivées le sont : ${K('2x = x')}.`, ok: `Deux fonctions égales ont la même dérivée : le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` },
    { t: `En divisant par ${K('x')}, qui n'est pas nul : ${K('2 = 1')}.`, ok: `La division par ${K('x \\geqslant 1')} est permise : le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` }],
    pourquoi: `La règle « la dérivée d'une somme est la somme des dérivées » vaut pour un nombre de termes fixé. Ici, le nombre de termes est ${K('x')} lui-même : il change quand ${K('x')} varie, et la règle ne s'applique pas. De plus, l'égalité de la ligne 1 n'a de sens que pour ${K('x')} entier, et l'on ne dérive pas une fonction connue seulement en des points isolés.`,
    retenir: `Dériver, c'est faire varier ${K('x')} : tout ce qui dépend de ${K('x')} dans une expression doit être pris en compte, y compris le nombre de ses termes. Et une dérivée se calcule sur un intervalle, pas sur les seuls entiers.`, indice: `Dans la somme de la ligne 1, qu'est-ce qui dépend de ${K('x')} ?` },
  { id: 'limite-un', niveau: 'terminale', cours: 't-05', nom: 'Une limite égale à 1', annonce: `« Démontrons » que ${K('\\left(1 + \\dfrac1n\\right)^n')} tend vers 1 quand ${K('n')} tend vers ${K('+\\infty')}.`, faute: 3, lignes: [
    { t: `Quand ${K('n')} tend vers ${K('+\\infty')}, ${K('\\dfrac1n')} tend vers 0.`, ok: `C'est une limite de référence.` },
    { t: `Donc ${K('1 + \\dfrac1n')} tend vers 1.`, ok: `C'est la limite d'une somme.` },
    { t: `Or ${K('1^n = 1')} pour tout entier ${K('n')}.`, ok: `C'est exact : toutes les puissances de 1 valent 1.` },
    { t: `Donc ${K('\\left(1 + \\dfrac1n\\right)^n')} tend vers ${K('1^n = 1')}.` }],
    pourquoi: `On a remplacé la base par sa limite en laissant l'exposant grandir : ce n'est pas une opération permise. La base tend vers 1, mais sans jamais valoir 1, et l'exposant tend vers ${K('+\\infty')} : c'est une forme indéterminée. En écrivant ${K('\\left(1 + \\dfrac1n\\right)^n = e^{\\,n \\ln\\left(1 + \\frac1n\\right)}')} et en utilisant ${K('\\dfrac{\\ln(1 + h)}{h} \\to 1')} quand ${K('h \\to 0')}, on trouve que la limite est ${K('e \\approx 2{,}718')}.`,
    retenir: `Dans une expression où ${K('n')} figure à deux endroits, on ne passe pas à la limite à un endroit en gardant l'autre. « ${K('1^{\\infty}')} » est une forme indéterminée, au même titre que « ${K('\\infty - \\infty')} » ou « ${K('0 \\times \\infty')} ».`, indice: `Calculez la valeur pour ${K('n = 1')}, ${K('n = 2')}, ${K('n = 10')} : s'approche-t-on de 1 ?` },
  { id: 'parties', niveau: 'terminale', cours: 't-06', nom: '0 = 1 en intégrant par parties', annonce: `« Démontrons » que ${K('0 = 1')}, en cherchant une primitive de ${K('x \\mapsto \\dfrac1x')} sur ${K(']0, +\\infty[')} par parties. On note ${K('\\displaystyle\\int f')} une primitive de ${K('f')}.`, faute: 3, lignes: [
    { t: `Posons ${K('u(x) = \\dfrac1x')} et ${K('v\'(x) = 1')}, d'où ${K('u\'(x) = -\\dfrac{1}{x^2}')} et ${K('v(x) = x')}.`, ok: `Les deux dérivées et la primitive sont exactes.` },
    { t: `La formule d'intégration par parties donne ${K('\\displaystyle\\int \\frac1x\\,dx = \\frac1x \\times x - \\int x \\times \\left(-\\frac{1}{x^2}\\right) dx')}.`, ok: `C'est la formule ${K('\\int u v\' = uv - \\int u\' v')}, appliquée correctement : elle dit que le membre de droite est <em>une</em> primitive de ${K('\\dfrac1x')}.` },
    { t: `En simplifiant : ${K('\\displaystyle\\int \\frac1x\\,dx = 1 + \\int \\frac1x\\,dx')}.`, ok: `Les simplifications sont exactes : ${K('\\dfrac1x \\times x = 1')} et ${K('x \\times \\dfrac{1}{x^2} = \\dfrac1x')}. Lue correctement, cette ligne dit qu'une primitive de ${K('\\dfrac1x')} augmentée de 1 est encore une primitive de ${K('\\dfrac1x')}, ce qui est vrai.` },
    { t: `En retranchant ${K('\\displaystyle\\int \\frac1x\\,dx')} aux deux membres : ${K('0 = 1')}.` }],
    pourquoi: `Le symbole ${K('\\int \\frac1x\\,dx')} ne désigne pas un nombre, ni même une fonction précise, mais une primitive, définie à une constante près. Les deux occurrences du symbole peuvent désigner deux primitives différentes, et la ligne 3 dit justement qu'elles diffèrent de la constante 1. On ne peut donc pas les retrancher l'une de l'autre comme une même quantité. Avec des bornes, tout rentre dans l'ordre : ${K('\\bigl[\\,1\\,\\bigr]_a^b = 0')}.`,
    retenir: `Une égalité entre primitives est une égalité « à une constante près ». Pour calculer, on écrit l'intégration par parties avec des bornes : ${K('\\displaystyle\\int_a^b u v\' = \\bigl[uv\\bigr]_a^b - \\int_a^b u\' v')}.`, indice: `Que désigne exactement le symbole ${K('\\int f')}, sans bornes ?` },
  { id: 'congruence', niveau: 'expertes', cours: 'me-04', nom: '12 divise 6', annonce: `« Démontrons » que 12 divise 6.`, faute: 2, lignes: [
    { t: `On a ${K('14 - 2 = 12')}, donc ${K('14 \\equiv 2 \\pmod{12}')}.`, ok: `C'est la définition : deux entiers sont congrus modulo 12 quand leur différence est un multiple de 12.` },
    { t: `Autrement dit, ${K('2 \\times 7 \\equiv 2 \\times 1 \\pmod{12}')}.`, ok: `C'est la même congruence, où l'on a écrit ${K('14 = 2 \\times 7')} et ${K('2 = 2 \\times 1')}.` },
    { t: `En simplifiant par 2 : ${K('7 \\equiv 1 \\pmod{12}')}.` },
    { t: `Donc 12 divise ${K('7 - 1 = 6')}.`, ok: `C'est la définition de la congruence, appliquée à la ligne précédente : le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` }],
    pourquoi: `On peut ajouter et multiplier des congruences, mais on ne peut pas toujours les simplifier. De ${K('2 \\times 7 \\equiv 2 \\times 1 \\pmod{12}')}, on tire que 12 divise ${K('2 \\times 6')}, donc que 6 divise 6 : la conclusion correcte est ${K('7 \\equiv 1 \\pmod 6')}. On ne peut simplifier par ${K('k')} sans changer le module que si ${K('k')} est premier avec le module, d'après le lemme de Gauss ; or 2 et 12 ne sont pas premiers entre eux.`,
    retenir: `Dans une congruence modulo ${K('n')}, on ne simplifie par un entier que s'il est premier avec ${K('n')}. Sinon, le module doit être divisé lui aussi.`, indice: `Vérifiez chaque congruence en calculant la différence des deux membres.` },
  { id: 'serie', niveau: 'sup', cours: 'ma-20', nom: '0 = 1 avec une série', annonce: `« Démontrons » que ${K('0 = 1')}, à l'aide de la série ${K('1 - 1 + 1 - 1 + \\dots')}`, faute: 0, lignes: [
    { t: `Notons ${K('S')} la somme de la série ${K('1 - 1 + 1 - 1 + 1 - 1 + \\dots')}` },
    { t: `En regroupant les termes deux par deux : ${K('S = (1 - 1) + (1 - 1) + (1 - 1) + \\dots = 0')}.`, ok: `Regrouper des termes consécutifs d'une série convergente ne change pas sa somme : les sommes partielles de la série regroupée forment une suite extraite de celles de la série de départ. Le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` },
    { t: `En isolant le premier terme, puis en regroupant : ${K('S = 1 + (-1 + 1) + (-1 + 1) + \\dots = 1')}.`, ok: `Isoler le premier terme puis regrouper des termes consécutifs ne change pas non plus la somme d'une série convergente. Le passage est correct. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` },
    { t: `Donc ${K('0 = 1')}.`, ok: `Un nombre égal à 0 et à 1 donne bien ${K('0 = 1')} : la déduction est correcte. Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.` }],
    pourquoi: `La série diverge : ses sommes partielles valent alternativement 1 et 0, et son terme général ne tend pas vers 0. Le nombre ${K('S')} n'existe donc pas, et tout ce que l'on en déduit est sans valeur. Les lignes suivantes le confirment à leur manière : c'est un raisonnement par l'absurde qui prouve que la série n'a pas de somme.`,
    retenir: `Avant de nommer la somme d'une série ou la limite d'une suite, on s'assure qu'elle existe. Écrire « notons ${K('S')} la somme » est déjà une affirmation, et c'est souvent la seule qui soit fausse.`, indice: `Calculez les premières sommes partielles de la série.` },
];
// Réunion de toutes les pièces, rangées par niveau et, en Maths Sup, par thème (§145).
for (const p of ANCIENNES) p.theme = p.id === 'serie' ? 'analyse' : '';
const PIECES = ANCIENNES.concat(premiere, terminale, expertes, sup);
export { PIECES };

export function monter(racine) {
  const q = s => racine.querySelector(s); let P = PIECES[0], vus = new Set(), trouve = false, essais = 0, msg = '', niveau = 'tous', theme = 'tous', vivant = true;
  const visibles = () => filtrer(PIECES, niveau, theme);
  function listes() { const M = lireMemoire('erreur'), V = visibles();
    ecrire(q('#er-niveaux'), pucesNiveaux(PIECES, niveau), true); const th = q('#er-themes'); th.hidden = niveau !== 'sup'; if (niveau === 'sup') ecrire(th, pucesThemes(PIECES, theme), true);
    if (!V.includes(P)) P = V[0]; const sel = q('#er-piece'); sel.innerHTML = options(V, niveau, theme, M); sel.value = P.id; }
  function charger() { vus = new Set(); trouve = false; essais = 0; msg = ''; rendre(); }
  function rendre() { if (!vivant) return; const fait = lireMemoire('erreur')[P.id];
    ecrire(q('#er-enonce'), '<b>Le raisonnement</b>' + P.annonce + (fait ? ` <span class="rz-fait">Fait, en ${fait} essai${fait > 1 ? 's' : ''}</span>` : '') + (P.cours ? ` <a class="rz-cours" href="#cours/${P.cours}">La règle dans le cours</a>` : ''), true);
    ecrire(q('#er-lignes'), P.lignes.map((l, i) => { const f = trouve && i === P.faute, j = vus.has(i) && i !== P.faute; return `<li><button type="button" data-i="${i}" class="${f ? 'faute' : j ? 'juste' : ''}" ${trouve || j ? 'disabled' : ''}><span>${l.t}</span><span class="etat">${f ? 'l\'erreur' : j ? 'ligne correcte' : ''}</span></button></li>`; }).join(''), true);
    const m = q('#er-message'); m.className = 'jeu-message' + (trouve ? ' gagne' : ''); ecrire(m, msg || 'Cliquez sur la ligne où le raisonnement cesse d\'être correct.', true);
    const r = q('#er-retenir'); r.hidden = !trouve; if (trouve) ecrire(r, '<b>À retenir.</b> ' + P.retenir, true); q('#er-indice').disabled = trouve; }
  q('#er-lignes').addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (!b || trouve) return; const i = +b.dataset.i; essais++; vus.add(i);
    if (i === P.faute) { trouve = true; noterMemoire('erreur', P.id, essais, false); listes(); msg = `<b>Ligne ${i + 1} : c'est bien l'erreur${essais === 1 ? ', trouvée du premier coup' : `, trouvée en ${essais} essais`}.</b> ` + P.pourquoi; }
    else msg = `<b>Ligne ${i + 1} : ce n'est pas l'erreur.</b> ` + P.lignes[i].ok; rendre(); });
  q('#er-indice').addEventListener('click', () => { if (trouve) return; msg = 'Vous avez demandé un indice : ' + P.indice; rendre(); });
  q('#er-depart').addEventListener('click', charger); q('#er-piece').addEventListener('change', e => { P = PIECES.find(p => p.id === e.target.value); charger(); });
  q('#er-niveaux').addEventListener('click', e => { const b = e.target.closest('button[data-n]'); if (!b) return; niveau = b.dataset.n; theme = 'tous'; listes(); charger(); });
  q('#er-themes').addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; theme = b.dataset.t; listes(); charger(); });
  listes(); charger(); return () => { vivant = false; };
}
