// Trouver l'erreur : Première, dix raisonnements (MEMO_atlas_activites.md §145).
import { T, faux } from './raisonner-outils.js';
const H = ` Si la ligne est fausse, c'est qu'une erreur a été commise plus haut.`;
export default [
faux('racine-carree', 'premiere', '', 'p-01', '−3 = 3', T`« Démontrons » que $-3 = 3$.`, [
  [T`On a $(-3)^2 = 9$.`, T`C'est exact : le carré d'un nombre négatif est positif.`],
  [T`On a aussi $3^2 = 9$.`, T`C'est exact.`],
  [T`Donc $(-3)^2 = 3^2$.`, T`Deux nombres égaux à 9 sont égaux entre eux.`],
  [T`En prenant la racine carrée des deux membres : $-3 = 3$.`] ],
  T`La racine carrée de $x^2$ n'est pas $x$, mais $|x|$ : $\sqrt{(-3)^2} = \sqrt9 = 3$. En prenant la racine des deux membres, on obtient donc $3 = 3$, ce qui est vrai et n'apprend rien. De l'égalité de deux carrés, on déduit seulement que les nombres sont égaux ou opposés.`,
  T`Pour tout réel $x$, $\sqrt{x^2} = |x|$. L'équation $x^2 = a^2$ a deux solutions, $a$ et $-a$ : la fonction carré n'est pas injective sur $\mathbb{R}$.`, T`Que vaut exactement $\sqrt{(-3)^2}$ ?`),
faux('solution-perdue', 'premiere', '', 'p-01', 'Une solution perdue', T`« Démontrons » que l'équation $x^2 = 5x$ a pour seule solution le nombre 5.`, [
  [T`Soit $x$ une solution : $x^2 = 5x$, c'est-à-dire $x \times x = 5 \times x$.`, T`C'est l'équation, où l'on a écrit $x^2 = x \times x$.`],
  [T`En divisant les deux membres par $x$ : $x = 5$.`],
  [T`Inversement, $5^2 = 25 = 5 \times 5$ : le nombre 5 est bien solution.`, T`La vérification est exacte : 5 est une solution de l'équation.`],
  [T`L'équation a donc une seule solution, le nombre 5.`, T`Si toute solution vaut 5 et que 5 convient, la conclusion est légitime : le passage est correct.` + H] ],
  T`On ne peut diviser par $x$ que si $x$ n'est pas nul, et rien ne l'assure : précisément, $x = 0$ est solution, puisque $0^2 = 5 \times 0$. La méthode sûre est de tout ramener dans un membre et de factoriser : $x^2 - 5x = 0$ s'écrit $x(x - 5) = 0$, d'où $x = 0$ ou $x = 5$.`,
  T`Diviser par une quantité qui dépend de l'inconnue fait perdre les solutions qui l'annulent. On factorise, puis on applique la règle du produit nul.`, T`Essayez quelques valeurs simples de $x$ dans l'équation.`),
faux('inequation-inverse', 'premiere', '', 'p-01', 'Une inéquation mal résolue', T`« Démontrons » que les solutions de l'inéquation $\dfrac1x < 1$ sont exactement les réels strictement supérieurs à 1.`, [
  [T`L'inéquation n'a de sens que pour $x \neq 0$.`, T`C'est exact : on ne divise pas par zéro.`],
  [T`En multipliant les deux membres par $x$ : $1 < x$.`],
  [T`Inversement, si $x > 1$, alors $\dfrac1x < 1$, car la fonction inverse est strictement décroissante sur $]0, +\infty[$ et $\dfrac11 = 1$.`, T`C'est exact : les réels strictement supérieurs à 1 sont bien solutions.`],
  [T`Les solutions sont donc les réels de $]1, +\infty[$.`, T`Si toute solution est supérieure à 1 et que tout réel supérieur à 1 est solution, la conclusion suit : le passage est correct.` + H] ],
  T`Multiplier une inégalité par $x$ conserve son sens si $x > 0$ et le renverse si $x < 0$ : il faut distinguer les deux cas. Pour $x < 0$, on obtient $1 > x$, qui est toujours vrai : tous les réels strictement négatifs sont solutions, par exemple $\dfrac{1}{-2} = -0{,}5 < 1$. L'ensemble des solutions est $]-\infty, 0[\, \cup \,]1, +\infty[$.`,
  T`On ne multiplie pas une inégalité par une quantité dont on ignore le signe. Pour une inéquation avec un quotient, on ramène tout dans un membre et l'on dresse un tableau de signes : ici $\dfrac{1 - x}{x} < 0$.`, T`Le nombre $-2$ est-il solution de l'inéquation ?`),
faux('fausse-geometrique', 'premiere', '', 'p-02', 'Une suite prétendue géométrique', T`Soit $(u_n)$ la suite définie par $u_0 = 1$ et $u_{n+1} = 2u_n + 1$. « Démontrons » que $u_3 = 8$.`, [
  [T`Pour passer d'un terme au suivant, on multiplie par 2 (puis on ajoute 1) : la suite $(u_n)$ est géométrique de raison 2.`],
  [T`Le terme général d'une suite géométrique de raison $q$ est $u_n = u_0 \times q^n$.`, T`C'est la formule du cours pour une suite géométrique.`],
  [T`Donc $u_n = 1 \times 2^n = 2^n$.`, T`La formule est appliquée correctement, avec $u_0 = 1$ et $q = 2$ : le passage est correct.` + H],
  [T`En particulier, $u_3 = 2^3 = 8$.`, T`Le calcul de $2^3$ est exact : le passage est correct.` + H] ],
  T`Une suite est géométrique quand on passe d'un terme au suivant en multipliant par un nombre fixe, et rien d'autre. Ici, on ajoute 1 après avoir multiplié : la suite n'est ni géométrique ni arithmétique. Le calcul direct donne $u_1 = 3$, $u_2 = 7$, $u_3 = 15$. C'est la suite $(u_n + 1)$ qui est géométrique de raison 2, d'où $u_n = 2^{n+1} - 1$.`,
  T`Avant d'appliquer une formule de suite géométrique, on vérifie que le quotient $\dfrac{u_{n+1}}{u_n}$ est constant. Ici $\dfrac{u_1}{u_0} = 3$ et $\dfrac{u_2}{u_1} = \dfrac73$.`, T`Calculez $u_1$, $u_2$ et $u_3$ à la main.`),
faux('derivee-produit-fausse', 'premiere', '', 'p-04', 'La dérivée du carré vaudrait 1', T`« Démontrons » que la dérivée de $x \mapsto x^2$ est la fonction constante égale à 1.`, [
  [T`Pour tout réel $x$, $x^2 = x \times x$ : la fonction carré est le produit $u \times v$, avec $u(x) = x$ et $v(x) = x$.`, T`C'est exact : c'est la définition du carré.`],
  [T`On a $u'(x) = 1$ et $v'(x) = 1$.`, T`C'est exact : la dérivée de $x \mapsto x$ est la constante 1.`],
  [T`La dérivée d'un produit est le produit des dérivées : $(uv)'(x) = u'(x) \times v'(x)$.`],
  [T`Donc la dérivée de la fonction carré est $x \mapsto 1 \times 1 = 1$.`, T`Le calcul $1 \times 1 = 1$ est exact, et la formule de la ligne précédente est appliquée telle qu'elle est écrite : le passage est correct.` + H] ],
  T`La dérivée d'un produit n'est pas le produit des dérivées. La formule correcte est $(uv)' = u'v + uv'$, qui donne ici $1 \times x + x \times 1 = 2x$, comme attendu. La règle « terme à terme » ne vaut que pour la somme : $(u + v)' = u' + v'$.`,
  T`$(uv)' = u'v + uv'$. Une vérification rapide sur un exemple connu, comme $x^2$, suffit à écarter la fausse formule.`, T`Comparez avec la dérivée de $x \mapsto x^2$ que vous connaissez.`),
faux('extremum-cube', 'premiere', '', 'p-04', 'Un minimum qui n\'existe pas', T`« Démontrons » que la fonction $f : x \mapsto x^3$ admet un minimum en 0.`, [
  [T`La fonction $f$ est dérivable sur $\mathbb{R}$, et $f'(x) = 3x^2$.`, T`C'est la dérivée d'une fonction puissance.`],
  [T`En particulier, $f'(0) = 0$.`, T`C'est exact : $3 \times 0^2 = 0$.`],
  [T`La dérivée s'annule en 0 : la fonction $f$ admet donc un extremum en 0.`],
  [T`Comme $f'(x) \geqslant 0$ pour tout $x$, la fonction ne décroît jamais : cet extremum ne peut être qu'un minimum.`, T`Il est vrai que $3x^2 \geqslant 0$ pour tout réel $x$, et la déduction s'appuie sur la ligne précédente : le passage est correct.` + H] ],
  T`Une dérivée qui s'annule ne suffit pas : il faut qu'elle s'annule <em>en changeant de signe</em>. Ici $f'(x) = 3x^2$ est positive de part et d'autre de 0 : la fonction est strictement croissante sur $\mathbb{R}$, et $f(-1) = -1 < f(0) = 0$. Il n'y a ni minimum ni maximum en 0, seulement une tangente horizontale.`,
  T`Si $f$ a un extremum local en un point intérieur, alors $f'$ s'y annule ; la réciproque est fausse. On conclut toujours par le tableau de variations.`, T`Comparez $f(0)$ et $f(-1)$.`),
faux('test-medical', 'premiere', '', 'p-05', 'Le test positif', T`Une maladie touche 1 % de la population. Un test est positif chez 99 % des malades et négatif chez 99 % des personnes saines. « Démontrons » qu'une personne dont le test est positif est malade avec une probabilité de 0,99.`, [
  [T`Notons $M$ l'événement « la personne est malade » et $T$ l'événement « le test est positif ». L'énoncé donne $P(M) = 0{,}01$ et $P_M(T) = 0{,}99$.`, T`C'est la traduction exacte de l'énoncé : 99 % des malades ont un test positif.`],
  [T`La probabilité cherchée est celle d'être malade sachant que le test est positif, c'est-à-dire $P_T(M)$.`, T`C'est exact : l'information connue est le résultat du test, c'est donc elle qui conditionne.`],
  [T`Or $P_T(M) = P_M(T)$.`],
  [T`Donc la probabilité cherchée vaut 0,99.`, T`C'est la valeur de $P_M(T)$ donnée par l'énoncé, reportée d'après la ligne précédente : le passage est correct.` + H] ],
  T`Les probabilités $P_T(M)$ et $P_M(T)$ ne sont pas égales en général : on ne conditionne pas par le même événement. Par la formule des probabilités totales, $P(T) = 0{,}01 \times 0{,}99 + 0{,}99 \times 0{,}01 = 0{,}0198$, d'où $P_T(M) = \dfrac{0{,}0099}{0{,}0198} = 0{,}5$. Une personne positive n'a qu'une chance sur deux d'être malade : les personnes saines sont si nombreuses que leurs 1 % de faux positifs pèsent autant que les vrais.`,
  T`$P_A(B)$ et $P_B(A)$ sont deux nombres différents, reliés par $P_B(A) = \dfrac{P(A)\,P_A(B)}{P(B)}$. Un arbre pondéré évite la confusion.`, T`Sur 10 000 personnes, combien sont malades et positives ? Combien sont saines et positives ?`),
faux('incompatibles-independants', 'premiere', '', 'p-05', 'Incompatibles, donc indépendants ?', T`On lance un dé équilibré. On note $A$ l'événement « le résultat est pair » et $B$ l'événement « le résultat est impair ». « Démontrons » que $0 = \dfrac14$.`, [
  [T`On a $P(A) = \dfrac12$ et $P(B) = \dfrac12$.`, T`C'est exact : trois faces sur six sont paires, trois sont impaires.`],
  [T`Les événements $A$ et $B$ ne peuvent pas se produire ensemble : $P(A \cap B) = 0$.`, T`C'est exact : aucun résultat n'est à la fois pair et impair.`],
  [T`Les événements $A$ et $B$ n'ont rien en commun : ils sont donc indépendants.`],
  [T`Par indépendance, $P(A \cap B) = P(A) \times P(B) = \dfrac14$.`, T`C'est la définition de l'indépendance, appliquée à la ligne précédente, et le produit est exact : le passage est correct.` + H],
  [T`Donc $0 = \dfrac14$.`, T`Deux valeurs d'une même probabilité sont égales : la déduction est correcte.` + H] ],
  T`« N'avoir rien en commun », c'est être <em>incompatibles</em>, pas indépendants. Les deux notions s'opposent presque : si $A$ est réalisé, on est certain que $B$ ne l'est pas, ce qui est une dépendance totale. Ici $P_A(B) = 0$, alors que $P(B) = \dfrac12$.`,
  T`Incompatibles : $P(A \cap B) = 0$. Indépendants : $P(A \cap B) = P(A)\,P(B)$. Deux événements de probabilités non nulles ne peuvent pas être les deux à la fois.`, T`Si l'on sait que $A$ est réalisé, que devient la probabilité de $B$ ?`),
faux('simplifier-scalaire', 'premiere', '', 'p-07', 'Simplifier un produit scalaire', T`Dans un repère orthonormé, on considère $\vec u(1 ; 0)$, $\vec v(0 ; 1)$ et $\vec w(0 ; 2)$. « Démontrons » que $\vec v = \vec w$.`, [
  [T`On a $\vec u \cdot \vec v = 1 \times 0 + 0 \times 1 = 0$.`, T`C'est la formule $xx' + yy'$ dans un repère orthonormé, et le calcul est exact.`],
  [T`On a aussi $\vec u \cdot \vec w = 1 \times 0 + 0 \times 2 = 0$.`, T`Le calcul est exact.`],
  [T`Donc $\vec u \cdot \vec v = \vec u \cdot \vec w$.`, T`Deux nombres égaux à 0 sont égaux entre eux.`],
  [T`Le vecteur $\vec u$ n'est pas nul : en simplifiant par $\vec u$, on obtient $\vec v = \vec w$.`] ],
  T`On ne « simplifie » pas un produit scalaire : il n'existe pas de division par un vecteur. L'égalité $\vec u \cdot \vec v = \vec u \cdot \vec w$ équivaut à $\vec u \cdot (\vec v - \vec w) = 0$, c'est-à-dire que $\vec v - \vec w$ est orthogonal à $\vec u$, ce qui est le cas ici : $\vec v - \vec w$ a pour coordonnées $(0 ; -1)$.`,
  T`Un produit scalaire nul ne signifie pas que l'un des vecteurs est nul, mais qu'ils sont orthogonaux. La règle du produit nul et la simplification, valables pour les nombres, ne s'étendent pas au produit scalaire.`, T`Que signifie géométriquement $\vec u \cdot \vec v = 0$ ?`),
faux('exp-somme', 'premiere', '', 'p-08', 'e = 2', T`« Démontrons » que le nombre $e$ est égal à 2.`, [
  [T`On a $e^2 = e^{1 + 1}$.`, T`C'est exact : $2 = 1 + 1$.`],
  [T`L'exponentielle d'une somme est la somme des exponentielles : $e^{1+1} = e^1 + e^1$.`],
  [T`Donc $e^2 = 2e$.`, T`La somme $e + e = 2e$ est exacte : le passage est correct.` + H],
  [T`En divisant par $e$, qui n'est pas nul : $e = 2$.`, T`L'exponentielle ne s'annule jamais, la division est permise : le passage est correct.` + H] ],
  T`L'exponentielle transforme les sommes en <em>produits</em> : $e^{a+b} = e^a \times e^b$. On a donc $e^{1+1} = e \times e = e^2$, ce qui n'apprend rien. Numériquement, $e^2 \approx 7{,}39$ alors que $2e \approx 5{,}44$.`,
  T`$e^{a+b} = e^a e^b$ : c'est la propriété fondamentale de l'exponentielle, celle qui la distingue des fonctions linéaires, pour lesquelles $f(a + b) = f(a) + f(b)$.`, T`Comparez les valeurs approchées de $e^2$ et de $2e$.`),
];
