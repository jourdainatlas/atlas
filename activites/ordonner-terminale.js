// Démonstrations à remettre en ordre : Terminale (MEMO_atlas_activites.md §145).
import { T, demo } from './raisonner-outils.js';
const rec = T`Par le principe de récurrence, la propriété est vraie pour tout entier $n \geqslant 0$.`;
export default [
demo('bernoulli', 'terminale', '', 't-01', 'Inégalité de Bernoulli', T`Pour tout réel $a > 0$ et tout entier $n \geqslant 0$ : $(1 + a)^n \geqslant 1 + na$.`, [
  [T`Soit $a > 0$. Pour tout entier $n \geqslant 0$, notons $P(n)$ l'inégalité $(1 + a)^n \geqslant 1 + na$.`, '', T`la propriété $P(n)$`],
  [T`Initialisation : $(1 + a)^0 = 1$ et $1 + 0 \times a = 1$. Donc $P(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ un entier tel que $P(n)$ soit vraie.`, 'a', T`le choix d'un entier $n$ tel que $P(n)$ soit vraie`],
  [T`Comme $1 + a > 0$, on peut multiplier l'inégalité $P(n)$ par $1 + a$ : $(1 + a)^{n+1} \geqslant (1 + a)(1 + na)$.`, 'c', T`la minoration de $(1+a)^{n+1}$ par $(1+a)(1+na)$`],
  [T`Or $(1 + a)(1 + na) = 1 + (n+1)a + na^2 \geqslant 1 + (n+1)a$, car $na^2 \geqslant 0$. Donc $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [rec, 'be'] ], [
  [T`On peut multiplier l'inégalité $P(n)$ par $1 + a$, quel que soit le signe de ce nombre : $(1 + a)^{n+1} \geqslant (1 + a)(1 + na)$.`, T`Multiplier une inégalité par un nombre négatif en renverse le sens. C'est parce que $1 + a > 0$ que le sens est conservé, et cette justification fait partie de la démonstration.`],
  [T`Or $(1 + a)(1 + na) = 1 + (n+1)a$. Donc $P(n+1)$ est vraie.`, T`Le développement donne $1 + na + a + na^2$ : le terme $na^2$ a été oublié. L'égalité écrite est fausse dès que $n \geqslant 1$ ; c'est une inégalité que l'on obtient, en minorant $na^2$ par 0.`] ]),
demo('qn-infini', 'terminale', '', 't-01', 'Limite de qⁿ quand q > 1', T`Si $q > 1$, alors la suite $(q^n)$ tend vers $+\infty$.`, [
  [T`Posons $a = q - 1$ : alors $a > 0$ et $q = 1 + a$.`, '', T`le réel $a = q - 1$`],
  [T`D'après l'inégalité de Bernoulli, $q^n = (1 + a)^n \geqslant 1 + na$ pour tout entier $n$.`, 'a', T`la minoration $q^n \geqslant 1 + na$`],
  [T`Comme $a > 0$, la suite $(1 + na)$ tend vers $+\infty$.`, 'a', T`la limite de $(1 + na)$`],
  [T`Par comparaison, la suite $(q^n)$ tend vers $+\infty$.`, 'bc'] ], [
  [T`Comme $q > 1$, on a $q^n \geqslant n$ pour tout entier $n$.`, T`C'est faux : pour $q = 1{,}1$ et $n = 2$, on a $q^n = 1{,}21 < 2$. La minoration utile est celle de Bernoulli, $q^n \geqslant 1 + n(q - 1)$.`],
  [T`La suite $(1 + na)$ tend vers $+\infty$, quel que soit le signe de $a$.`, T`Si $a < 0$, la suite $(1 + na)$ tend vers $-\infty$, et si $a = 0$ elle est constante. C'est bien $a > 0$, donc $q > 1$, qui est utilisé ici.`] ]),
demo('comparaison', 'terminale', '', 't-01', 'Théorème de comparaison', T`Soit $(u_n)$ et $(v_n)$ deux suites telles que $u_n \leqslant v_n$ à partir d'un certain rang. Si $(u_n)$ tend vers $+\infty$, alors $(v_n)$ tend vers $+\infty$.`, [
  [T`Soit $A$ un réel quelconque.`, '', T`le réel $A$`],
  [T`Comme $(u_n)$ tend vers $+\infty$, il existe un rang $N_1$ tel que $u_n > A$ pour tout $n \geqslant N_1$.`, 'a', T`le rang $N_1$`],
  [T`Notons $N_0$ un rang à partir duquel $u_n \leqslant v_n$, et posons $N = \max(N_0, N_1)$.`, 'b', T`le rang $N$`],
  [T`Pour tout $n \geqslant N$, on a $v_n \geqslant u_n > A$.`, 'c', T`l'inégalité $v_n > A$ à partir du rang $N$`],
  [T`Ceci vaut pour tout réel $A$ : la suite $(v_n)$ tend vers $+\infty$.`, 'd'] ], [
  [T`Posons $N = \min(N_0, N_1)$ : pour tout $n \geqslant N$, on a $v_n \geqslant u_n > A$.`, T`Il faut que les deux propriétés soient vraies en même temps, donc se placer après les <em>deux</em> rangs : c'est le maximum qu'il faut prendre. Entre le minimum et le maximum, l'une des deux peut être fausse.`],
  [T`Pour tout $n \geqslant N$, on a $v_n \leqslant u_n$, donc $v_n \leqslant A$.`, T`L'hypothèse est $u_n \leqslant v_n$ : c'est $v_n$ qui est le plus grand. L'inégalité est écrite à l'envers, et la conclusion aussi.`] ]),
demo('unicite-solution', 'terminale', '', 't-03', 'Unicité d\'une solution', T`Soit $f$ une fonction continue et strictement croissante sur $[a, b]$, et $k$ un réel compris entre $f(a)$ et $f(b)$. Alors l'équation $f(x) = k$ a une unique solution dans $[a, b]$.`, [
  [T`Comme $f$ est continue sur $[a, b]$ et que $k$ est compris entre $f(a)$ et $f(b)$, le théorème des valeurs intermédiaires fournit un réel $c$ de $[a, b]$ tel que $f(c) = k$.`, '', T`l'existence d'une solution $c$`],
  [T`Supposons qu'il existe une autre solution $c' \neq c$ ; quitte à échanger les noms, $c < c'$.`, 'a', T`l'hypothèse d'une seconde solution $c'$`],
  [T`Comme $f$ est strictement croissante, $f(c) < f(c')$.`, 'b', T`l'inégalité stricte $f(c) < f(c')$`],
  [T`Or $f(c) = f(c') = k$ : on obtient $k < k$, ce qui est absurde. La solution est donc unique.`, 'c'] ], [
  [T`Comme $f$ est croissante, $f(c) \leqslant f(c')$ : c'est absurde, puisque $f(c) = f(c')$.`, T`L'inégalité large $f(c) \leqslant f(c')$ est tout à fait compatible avec $f(c) = f(c')$ : il n'y a aucune contradiction. C'est la croissance <em>stricte</em> qui interdit deux solutions ; une fonction constante est croissante et prend la même valeur partout.`],
  [T`Comme $f$ est continue sur $[a, b]$, elle est strictement monotone : l'équation a donc au plus une solution.`, T`La continuité n'entraîne pas la monotonie : la fonction carré est continue sur $[-1, 1]$ sans y être monotone. La stricte croissance est une hypothèse de l'énoncé, distincte de la continuité.`] ]),
demo('croissance-comparee', 'terminale', '', 't-05', 'Croissance comparée de l\'exponentielle', T`On a $\displaystyle\lim_{x \to +\infty} \frac{e^x}{x} = +\infty$.`, [
  [T`Posons $f(x) = e^x - \dfrac{x^2}{2}$ pour $x \geqslant 0$. Alors $f'(x) = e^x - x$ et $f''(x) = e^x - 1$.`, '', T`la fonction $f$ et ses deux dérivées`],
  [T`Pour $x \geqslant 0$, $f''(x) \geqslant 0$ : la fonction $f'$ est croissante, donc $f'(x) \geqslant f'(0) = 1 > 0$.`, 'a', T`le signe de $f'$`],
  [T`La fonction $f$ est donc strictement croissante sur $[0, +\infty[$, et $f(x) \geqslant f(0) = 1 > 0$.`, 'b', T`l'inégalité $e^x > \frac{x^2}{2}$`],
  [T`Ainsi, pour tout $x > 0$ : $e^x > \dfrac{x^2}{2}$, d'où $\dfrac{e^x}{x} > \dfrac x2$.`, 'c', T`la minoration de $\frac{e^x}{x}$ par $\frac x2$`],
  [T`Comme $\dfrac x2$ tend vers $+\infty$ quand $x$ tend vers $+\infty$, il en va de même de $\dfrac{e^x}{x}$, par comparaison.`, 'd'] ], [
  [T`On a $f'(x) = e^x - x \geqslant 0$, puisque $e^x \geqslant 0$.`, T`Savoir que $e^x$ est positif ne dit rien du signe de $e^x - x$, puisque $x$ l'est aussi. Il faut comparer $e^x$ et $x$, ce que l'on fait en étudiant les variations de $f'$ à l'aide de $f''$.`],
  [T`Ainsi, pour tout $x > 0$ : $\dfrac{e^x}{x} > \dfrac{x^2}{2}$.`, T`En divisant $e^x > \frac{x^2}{2}$ par $x > 0$, on obtient $\frac{e^x}{x} > \frac x2$ : le membre de droite doit être divisé par $x$ lui aussi.`] ]),
demo('ln-produit', 'terminale', '', 't-05', 'Logarithme d\'un produit', T`Pour tous réels $a > 0$ et $b > 0$ : $\ln(ab) = \ln a + \ln b$.`, [
  [T`D'après la propriété de l'exponentielle, $\exp(\ln a + \ln b) = \exp(\ln a) \times \exp(\ln b)$.`, '', T`la transformation de $\exp(\ln a + \ln b)$ en produit`],
  [T`Or $\exp(\ln a) = a$ et $\exp(\ln b) = b$ : donc $\exp(\ln a + \ln b) = ab$.`, 'a', T`l'égalité $\exp(\ln a + \ln b) = ab$`],
  [T`Comme $ab > 0$, on a $\exp\bigl(\ln(ab)\bigr) = ab$.`, '', T`l'égalité $\exp(\ln(ab)) = ab$`],
  [T`Les réels $\ln(ab)$ et $\ln a + \ln b$ ont donc la même image par l'exponentielle. Celle-ci étant strictement croissante, ils sont égaux.`, 'bc'] ], [
  [T`D'après la propriété de l'exponentielle, $\exp(\ln a + \ln b) = \exp(\ln a) + \exp(\ln b) = a + b$.`, T`L'exponentielle transforme une somme en <em>produit</em> : $\exp(x + y) = \exp(x)\exp(y)$. C'est précisément ce qui fait que le logarithme transforme un produit en somme.`],
  [T`Deux réels qui ont la même image par une fonction sont égaux : donc $\ln(ab) = \ln a + \ln b$.`, T`C'est faux pour une fonction quelconque : $-1$ et $1$ ont la même image par la fonction carré. L'argument exige que la fonction soit strictement monotone, ce qui est le cas de l'exponentielle.`] ]),
demo('ln-derivee', 'terminale', '', 't-05', 'Dérivée du logarithme', T`En admettant que la fonction $\ln$ est dérivable sur $]0, +\infty[$, on a $\ln'(x) = \dfrac1x$ pour tout $x > 0$.`, [
  [T`Pour tout réel $x > 0$, on a $\exp(\ln x) = x$.`, '', T`l'égalité $\exp(\ln x) = x$`],
  [T`Dérivons les deux membres. À gauche, la dérivée d'une fonction composée donne $\ln'(x) \times \exp(\ln x)$ ; à droite, la dérivée vaut 1.`, 'a', T`la dérivation des deux membres`],
  [T`Comme $\exp(\ln x) = x$, on obtient $x \times \ln'(x) = 1$.`, 'b', T`l'égalité $x \ln'(x) = 1$`],
  [T`Puisque $x > 0$, on peut diviser par $x$ : $\ln'(x) = \dfrac1x$.`, 'c'] ], [
  [T`Dérivons les deux membres. À gauche, la dérivée est $\exp(\ln x)$, puisque l'exponentielle est sa propre dérivée ; à droite, la dérivée vaut 1.`, T`La dérivée de $x \mapsto \exp(u(x))$ est $u'(x)\exp(u(x))$ : le facteur $u'(x) = \ln'(x)$ a été oublié. Sans lui, on obtiendrait $x = 1$ pour tout $x$.`],
  [T`Comme la fonction $\ln$ est la réciproque de l'exponentielle, sa dérivée est l'inverse de l'exponentielle : $\ln'(x) = \dfrac{1}{e^x}$.`, T`La dérivée de la réciproque se calcule au point $\ln x$, et non au point $x$ : on obtient $\frac{1}{\exp(\ln x)} = \frac1x$.`] ]),
demo('primitives', 'terminale', '', 't-06', 'Deux primitives diffèrent d\'une constante', T`Soit $F$ et $G$ deux primitives d'une même fonction $f$ sur un intervalle $I$. Alors il existe un réel $k$ tel que $G(x) = F(x) + k$ pour tout $x$ de $I$.`, [
  [T`Posons $H = G - F$ : c'est une fonction dérivable sur $I$.`, '', T`la fonction $H = G - F$`],
  [T`Pour tout $x$ de $I$ : $H'(x) = G'(x) - F'(x) = f(x) - f(x) = 0$.`, 'a', T`le calcul $H' = 0$`],
  [T`Une fonction dont la dérivée est nulle sur un intervalle y est constante : il existe un réel $k$ tel que $H(x) = k$ pour tout $x$ de $I$.`, 'b', T`le fait que $H$ est constante`],
  [T`Donc $G(x) = F(x) + k$ pour tout $x$ de $I$.`, 'c'] ], [
  [T`Une fonction dont la dérivée est nulle est la fonction nulle : $H = 0$, donc $G = F$.`, T`Une dérivée nulle caractérise les fonctions constantes sur un intervalle, pas seulement la fonction nulle : la fonction constante égale à 3 a une dérivée nulle. C'est bien pour cela que deux primitives peuvent différer.`],
  [T`Une fonction dont la dérivée est nulle est constante, quel que soit son ensemble de définition.`, T`C'est faux hors d'un intervalle : la fonction qui vaut 0 sur $]-\infty, 0[$ et 1 sur $]0, +\infty[$ a une dérivée nulle sur son ensemble de définition sans être constante. L'hypothèse « $I$ est un intervalle » est indispensable.`] ]),
demo('equation-differentielle', 'terminale', '', 't-08', 'Solutions de y′ = ay', T`Soit $a$ un réel. Les solutions sur $\mathbb{R}$ de l'équation $y' = ay$ sont les fonctions $x \mapsto Ce^{ax}$, où $C$ est un réel quelconque.`, [
  [T`Pour tout réel $C$, la fonction $x \mapsto Ce^{ax}$ est solution : sa dérivée est $x \mapsto aCe^{ax}$.`, '', T`la vérification que les fonctions proposées sont solutions`],
  [T`Réciproquement, soit $f$ une solution, et posons $g(x) = f(x)e^{-ax}$ pour tout réel $x$.`, 'a', T`la fonction $g$`],
  [T`Alors $g'(x) = f'(x)e^{-ax} - af(x)e^{-ax} = \bigl(f'(x) - af(x)\bigr)e^{-ax} = 0$, puisque $f' = af$.`, 'b', T`le calcul $g' = 0$`],
  [T`La fonction $g$ a une dérivée nulle sur $\mathbb{R}$ : elle est constante, égale à un réel $C$.`, 'c', T`le fait que $g$ est constante`],
  [T`Donc $f(x)e^{-ax} = C$, c'est-à-dire $f(x) = Ce^{ax}$ pour tout réel $x$.`, 'd'] ], [
  [T`Alors $g'(x) = f'(x)e^{-ax}$, qui n'est pas nul en général.`, T`La fonction $g$ est un produit : sa dérivée comporte deux termes, $f'(x)e^{-ax}$ et $f(x) \times (-a)e^{-ax}$. C'est leur somme qui est nulle.`],
  [T`Réciproquement, soit $f$ une solution : comme $f' = af$, on a $\dfrac{f'}{f} = a$, donc $\ln f(x) = ax + k$.`, T`Diviser par $f$ suppose que $f$ ne s'annule pas, et écrire $\ln f$ suppose de plus que $f$ est strictement positive : rien de cela n'est connu, et la fonction nulle est une solution. Multiplier par $e^{-ax}$ évite toute division.`] ]),
demo('integration-parties', 'terminale', '', 't-06', 'Intégration par parties', T`Soit $u$ et $v$ deux fonctions dérivables sur $[a, b]$, de dérivées continues. Alors $\displaystyle\int_a^b u(x)v'(x)\,dx = \bigl[u(x)v(x)\bigr]_a^b - \int_a^b u'(x)v(x)\,dx$.`, [
  [T`La fonction $uv$ est dérivable sur $[a, b]$, et $(uv)' = u'v + uv'$.`, '', T`la dérivée du produit $uv$`],
  [T`La fonction $uv$ est donc une primitive de la fonction continue $u'v + uv'$ : $\displaystyle\int_a^b \bigl(u'(x)v(x) + u(x)v'(x)\bigr)dx = \bigl[u(x)v(x)\bigr]_a^b$.`, 'a', T`l'intégrale de $u'v + uv'$`],
  [T`Par linéarité de l'intégrale, $\displaystyle\int_a^b u'(x)v(x)\,dx + \int_a^b u(x)v'(x)\,dx = \bigl[u(x)v(x)\bigr]_a^b$.`, 'b', T`la séparation en deux intégrales`],
  [T`En retranchant la première intégrale aux deux membres, on obtient la formule annoncée.`, 'c'] ], [
  [T`La fonction $uv$ est dérivable sur $[a, b]$, et $(uv)' = u'v'$.`, T`La dérivée d'un produit n'est pas le produit des dérivées : $(uv)' = u'v + uv'$. Avec la formule fausse, l'intégration par parties n'existerait pas.`],
  [T`L'intégrale d'un produit étant le produit des intégrales, $\displaystyle\int_a^b u(x)v'(x)\,dx = \int_a^b u(x)\,dx \times \int_a^b v'(x)\,dx$.`, T`C'est faux : sur $[0, 1]$, l'intégrale de $x \times x$ vaut $\frac13$, alors que le produit des intégrales vaut $\frac14$. L'intégrale est linéaire, elle n'est pas multiplicative.`] ]),
demo('pascal', 'terminale', '', 't-07', 'Relation de Pascal', T`Pour tous entiers $n$ et $k$ tels que $1 \leqslant k \leqslant n - 1$ : $\displaystyle\binom nk = \binom{n-1}{k-1} + \binom{n-1}{k}$.`, [
  [T`Soit $E$ un ensemble à $n$ éléments, et $x$ un élément fixé de $E$. Classons les parties de $E$ à $k$ éléments selon qu'elles contiennent $x$ ou non.`, '', T`l'ensemble $E$ et l'élément $x$`],
  [T`Une partie à $k$ éléments qui contient $x$ est déterminée par le choix de ses $k - 1$ autres éléments parmi les $n - 1$ éléments restants : il y en a $\displaystyle\binom{n-1}{k-1}$.`, 'a', T`le nombre de parties contenant $x$`],
  [T`Une partie à $k$ éléments qui ne contient pas $x$ est une partie à $k$ éléments de l'ensemble des $n - 1$ autres éléments : il y en a $\displaystyle\binom{n-1}{k}$.`, 'a', T`le nombre de parties ne contenant pas $x$`],
  [T`Toute partie à $k$ éléments est dans un cas et un seul : le nombre total, $\displaystyle\binom nk$, est la somme des deux nombres précédents.`, 'bc'] ], [
  [T`Une partie à $k$ éléments qui contient $x$ est déterminée par le choix de $k$ éléments parmi les $n - 1$ éléments restants : il y en a $\displaystyle\binom{n-1}{k}$.`, T`L'élément $x$ occupe déjà une des $k$ places : il ne reste que $k - 1$ éléments à choisir. Avec $k$ éléments choisis en plus de $x$, la partie en aurait $k + 1$.`],
  [T`Certaines parties sont dans les deux cas à la fois : il faut retrancher leur nombre à la somme.`, T`Une partie contient $x$ ou ne le contient pas, jamais les deux : les deux familles sont disjointes, et c'est ce qui permet d'additionner sans rien retrancher.`] ]),
demo('nombre-parties', 'terminale', '', 't-07', 'Nombre de parties d\'un ensemble', T`Un ensemble à $n$ éléments possède $2^n$ parties.`, [
  [T`Soit $E = \{x_1, \dots, x_n\}$. À toute partie $A$ de $E$, associons le mot $(\varepsilon_1, \dots, \varepsilon_n)$, où $\varepsilon_i = 1$ si $x_i \in A$ et $\varepsilon_i = 0$ sinon.`, '', T`le mot de 0 et de 1 associé à une partie`],
  [T`Deux parties différentes donnent deux mots différents, et tout mot de $n$ lettres 0 ou 1 provient d'une partie : il y a autant de parties que de mots.`, 'a', T`la correspondance entre parties et mots`],
  [T`Pour écrire un mot de $n$ lettres, on a 2 choix pour chaque lettre : par le principe multiplicatif, il y a $2^n$ mots.`, '', T`le nombre de mots`],
  [T`Donc $E$ possède $2^n$ parties.`, 'bc'] ], [
  [T`Pour écrire un mot de $n$ lettres, on a 2 choix pour chaque lettre : il y a $2n$ mots.`, T`Les choix se multiplient, ils ne s'ajoutent pas : pour chacun des 2 choix de la première lettre, il y a 2 choix pour la deuxième, et ainsi de suite. Pour $n = 3$, il y a 8 mots et non 6.`],
  [T`À toute partie $A$ de $E$, associons son nombre d'éléments, compris entre 0 et $n$ : il y a donc $n + 1$ parties.`, T`Plusieurs parties ont le même nombre d'éléments : cette association ne distingue pas les parties entre elles, et ne permet donc pas de les compter. Pour $n = 2$, il y a 4 parties et non 3.`] ]),
demo('esperance-binomiale', 'terminale', '', 't-02', 'Espérance de la loi binomiale', T`Si $X$ suit la loi binomiale de paramètres $n$ et $p$, alors $E(X) = np$.`, [
  [T`On répète $n$ épreuves de Bernoulli indépendantes de paramètre $p$. Pour $i$ de 1 à $n$, notons $X_i$ la variable qui vaut 1 si la $i$-ième épreuve est un succès, et 0 sinon.`, '', T`les variables $X_i$`],
  [T`Le nombre de succès est $X = X_1 + X_2 + \dots + X_n$.`, 'a', T`l'écriture de $X$ comme somme`],
  [T`Chaque $X_i$ vaut 1 avec la probabilité $p$ et 0 avec la probabilité $1 - p$ : $E(X_i) = 1 \times p + 0 \times (1 - p) = p$.`, 'a', T`l'espérance de chaque $X_i$`],
  [T`Par linéarité de l'espérance, $E(X) = E(X_1) + \dots + E(X_n) = np$.`, 'bc'] ], [
  [T`Les épreuves étant indépendantes, $E(X) = E(X_1) \times \dots \times E(X_n) = p^n$.`, T`$X$ est la <em>somme</em> des $X_i$, non leur produit : c'est la linéarité de l'espérance qui s'applique, et elle ne demande même pas l'indépendance. Le nombre $p^n$ est la probabilité de n'obtenir que des succès.`],
  [T`Chaque $X_i$ prend les valeurs 0 et 1 : $E(X_i) = \dfrac{0 + 1}{2} = \dfrac12$.`, T`L'espérance est la moyenne des valeurs pondérée par leurs probabilités, et non leur moyenne simple. Les deux coïncident seulement si $p = \frac12$.`] ]),
demo('concentration', 'terminale', '', 't-10', 'Inégalité de concentration', T`Soit $X_1, \dots, X_n$ des variables aléatoires indépendantes de même loi, d'espérance $\mu$ et de variance $V$, et $M_n$ leur moyenne. Pour tout $\delta > 0$ : $P\bigl(|M_n - \mu| \geqslant \delta\bigr) \leqslant \dfrac{V}{n\delta^2}$.`, [
  [T`Par linéarité de l'espérance, $E(M_n) = \dfrac1n\bigl(E(X_1) + \dots + E(X_n)\bigr) = \mu$.`, '', T`l'espérance de $M_n$`],
  [T`Les variables étant indépendantes, la variance de leur somme est la somme des variances, $nV$ ; donc $V(M_n) = \dfrac{1}{n^2} \times nV = \dfrac Vn$.`, '', T`la variance de $M_n$`],
  [T`L'inégalité de Bienaymé-Tchebychev, appliquée à $M_n$, donne $P\bigl(|M_n - E(M_n)| \geqslant \delta\bigr) \leqslant \dfrac{V(M_n)}{\delta^2}$.`, '', T`l'inégalité de Bienaymé-Tchebychev appliquée à $M_n$`],
  [T`En remplaçant $E(M_n)$ par $\mu$ et $V(M_n)$ par $\dfrac Vn$, on obtient l'inégalité annoncée.`, 'abc'] ], [
  [T`La variance d'une moyenne est la moyenne des variances : $V(M_n) = V$.`, T`Diviser une variable par $n$ divise sa variance par $n^2$ : $V(M_n) = \frac{1}{n^2} \times nV = \frac Vn$. C'est cette décroissance en $\frac1n$ qui fait que la moyenne se concentre autour de $\mu$.`],
  [T`La variance de la somme vaut $nV$, donc $V(M_n) = \dfrac{nV}{n} = V$.`, T`Pour tout réel $a$, $V(aX) = a^2 V(X)$ : diviser par $n$ divise la variance par $n^2$, et non par $n$.`] ]),
demo('orthogonalite', 'terminale', '', 't-04', 'Droite orthogonale à un plan', T`Si une droite $d$ est orthogonale à deux droites sécantes d'un plan $\mathcal{P}$, alors elle est orthogonale à toute droite de $\mathcal{P}$.`, [
  [T`Soit $\vec u$ un vecteur directeur de $d$, et $\vec v_1$, $\vec v_2$ des vecteurs directeurs des deux droites sécantes : par hypothèse, $\vec u \cdot \vec v_1 = 0$ et $\vec u \cdot \vec v_2 = 0$.`, '', T`les vecteurs $\vec u$, $\vec v_1$, $\vec v_2$ et les deux produits scalaires nuls`],
  [T`Les deux droites étant sécantes, $\vec v_1$ et $\vec v_2$ ne sont pas colinéaires : ils forment une base du plan $\mathcal{P}$.`, 'a', T`le fait que $(\vec v_1, \vec v_2)$ est une base du plan`],
  [T`Soit $\Delta$ une droite quelconque de $\mathcal{P}$, de vecteur directeur $\vec w$ : il existe deux réels $\alpha$ et $\beta$ tels que $\vec w = \alpha\vec v_1 + \beta\vec v_2$.`, 'b', T`la décomposition de $\vec w$`],
  [T`Par linéarité du produit scalaire, $\vec u \cdot \vec w = \alpha\,\vec u \cdot \vec v_1 + \beta\,\vec u \cdot \vec v_2 = 0$.`, 'c', T`le calcul $\vec u \cdot \vec w = 0$`],
  [T`Les droites $d$ et $\Delta$ sont donc orthogonales.`, 'd'] ], [
  [T`Soit $\Delta$ une droite quelconque de $\mathcal{P}$, de vecteur directeur $\vec w$ : ce vecteur est colinéaire à $\vec v_1$ ou à $\vec v_2$.`, T`Un plan contient une infinité de directions, pas seulement deux. Un vecteur du plan est une <em>combinaison</em> de $\vec v_1$ et $\vec v_2$, ce qui est beaucoup plus général que d'être colinéaire à l'un d'eux.`],
  [T`Deux droites quelconques du plan suffisent : $\vec v_1$ et $\vec v_2$ forment toujours une base de $\mathcal{P}$.`, T`Si les deux droites sont parallèles, leurs vecteurs directeurs sont colinéaires et n'engendrent qu'une direction. Une droite peut alors être orthogonale aux deux sans l'être au plan : c'est pourquoi l'énoncé exige des droites sécantes.`] ]),
// ---------- Ajouts du 12 nov. (audit des programmes, §146) ----------
demo('exp-limites', 'terminale', '', 't-05', 'Limites de l\'exponentielle', T`On a $\displaystyle\lim_{x \to +\infty} e^x = +\infty$ et $\displaystyle\lim_{x \to -\infty} e^x = 0$.`, [
  [T`Posons $g(x) = e^x - x$ pour tout réel $x$ : alors $g'(x) = e^x - 1$.`, '', T`la fonction $g$ et sa dérivée`],
  [T`Pour $x \geqslant 0$, on a $e^x \geqslant 1$, donc $g'(x) \geqslant 0$ : la fonction $g$ est croissante sur $[0, +\infty[$, et $g(x) \geqslant g(0) = 1 > 0$.`, 'a', T`le fait que $g$ est strictement positive sur $[0, +\infty[$`],
  [T`Ainsi $e^x > x$ pour tout $x \geqslant 0$. Par comparaison, $e^x$ tend vers $+\infty$ quand $x$ tend vers $+\infty$.`, 'b', T`la limite de l'exponentielle en $+\infty$`],
  [T`Pour tout réel $x$, $e^x = \dfrac{1}{e^{-x}}$. Quand $x$ tend vers $-\infty$, $-x$ tend vers $+\infty$, donc $e^{-x}$ tend vers $+\infty$ d'après ce qui précède.`, 'c', T`la limite de $e^{-x}$ en $-\infty$`],
  [T`Par passage à l'inverse, $e^x$ tend vers 0 quand $x$ tend vers $-\infty$.`, 'd'] ], [
  [T`Comme $e^x > 0$ pour tout réel $x$, la limite de l'exponentielle en $-\infty$ est 0.`, T`Être strictement positive ne donne pas une limite nulle : la fonction constante égale à 1 est strictement positive. Il faut un argument qui force $e^x$ à devenir petit, ici l'écriture $e^x = \dfrac{1}{e^{-x}}$.`],
  [T`On a $g'(x) = e^x - 1 \geqslant 0$ pour tout réel $x$ : la fonction $g$ est croissante sur $\mathbb{R}$.`, T`Pour $x < 0$, on a $e^x < 1$, donc $g'(x) < 0$ : la fonction $g$ décroît sur $]-\infty, 0]$. L'inégalité $g' \geqslant 0$ n'est vraie que sur $[0, +\infty[$, ce qui suffit ici.`] ]),
demo('x-ln-x', 'terminale', '', 't-05', 'Limite de x ln x en 0', T`On a $\displaystyle\lim_{x \to 0^+} x\ln x = 0$. On utilise la croissance comparée : $\dfrac{X}{e^X}$ tend vers 0 quand $X$ tend vers $+\infty$.`, [
  [T`Pour $x > 0$, posons $X = -\ln x$, c'est-à-dire $x = e^{-X}$.`, '', T`le changement de variable $X = -\ln x$`],
  [T`Alors $x\ln x = e^{-X} \times (-X) = -\dfrac{X}{e^X}$.`, 'a', T`l'écriture $x\ln x = -\dfrac{X}{e^X}$`],
  [T`Quand $x$ tend vers 0 par valeurs positives, $\ln x$ tend vers $-\infty$, donc $X$ tend vers $+\infty$.`, 'a', T`la limite de $X$`],
  [T`Par croissance comparée, $\dfrac{X}{e^X}$ tend vers 0 quand $X$ tend vers $+\infty$ ; par composition de limites, $x\ln x$ tend vers 0.`, 'bc'] ], [
  [T`Quand $x$ tend vers 0, $x$ tend vers 0 et $\ln x$ vers $-\infty$ : le produit tend vers $0 \times (-\infty) = 0$.`, T`« $0 \times \infty$ » est une forme indéterminée : selon les cas, un tel produit peut tendre vers 0, vers l'infini ou vers n'importe quel réel. Par exemple $x \times \dfrac1x$ tend vers 1.`],
  [T`Quand $x$ tend vers 0 par valeurs positives, $X = -\ln x$ tend vers 0.`, T`C'est $\ln 1$ qui vaut 0. En 0, le logarithme tend vers $-\infty$, donc $X$ tend vers $+\infty$.`] ]),
demo('convexe-tangentes', 'terminale', '', 't-03', 'Fonction convexe et tangentes', T`Soit $f$ une fonction deux fois dérivable sur un intervalle $I$, telle que $f'' \geqslant 0$. Alors la courbe de $f$ est au-dessus de chacune de ses tangentes.`, [
  [T`Soit $a \in I$. La tangente en $a$ a pour équation $y = f'(a)(x - a) + f(a)$ ; posons $d(x) = f(x) - f'(a)(x - a) - f(a)$ pour $x \in I$.`, '', T`la fonction $d$, écart entre la courbe et la tangente`],
  [T`La fonction $d$ est dérivable sur $I$, et $d'(x) = f'(x) - f'(a)$.`, 'a', T`la dérivée $d'(x) = f'(x) - f'(a)$`],
  [T`Comme $f'' \geqslant 0$, la fonction $f'$ est croissante sur $I$ : donc $d'(x) \leqslant 0$ pour $x \leqslant a$, et $d'(x) \geqslant 0$ pour $x \geqslant a$.`, 'b', T`le signe de $d'$`],
  [T`La fonction $d$ est donc décroissante avant $a$ et croissante après : elle admet un minimum en $a$, qui vaut $d(a) = 0$.`, 'c', T`le minimum de $d$`],
  [T`Ainsi $d(x) \geqslant 0$ pour tout $x$ de $I$, c'est-à-dire $f(x) \geqslant f'(a)(x - a) + f(a)$ : la courbe est au-dessus de sa tangente en $a$.`, 'd'] ], [
  [T`La fonction $d$ est dérivable sur $I$, et $d'(x) = f'(x)$.`, T`Il faut aussi dériver la partie affine : la dérivée de $x \mapsto f'(a)(x - a)$ est la constante $f'(a)$. On obtient $d'(x) = f'(x) - f'(a)$, qui s'annule en $a$.`],
  [T`Comme $f'' \geqslant 0$, la fonction $f$ est croissante sur $I$.`, T`Le signe de $f''$ donne les variations de $f'$, pas celles de $f$ : c'est $f'$ qui est croissante. La fonction carré vérifie $f'' = 2 > 0$ et n'est pas croissante sur $\mathbb{R}$.`] ]),
demo('projete-proche', 'terminale', '', 't-04', 'Le projeté orthogonal est le point le plus proche', T`Soit $M$ un point, $\mathcal{P}$ un plan et $H$ le projeté orthogonal de $M$ sur $\mathcal{P}$. Pour tout point $N$ de $\mathcal{P}$, $MN \geqslant MH$, avec égalité seulement si $N = H$.`, [
  [T`Soit $N$ un point de $\mathcal{P}$. Par la relation de Chasles, $\overrightarrow{MN} = \overrightarrow{MH} + \overrightarrow{HN}$, donc $MN^2 = MH^2 + 2\,\overrightarrow{MH} \cdot \overrightarrow{HN} + HN^2$.`, '', T`le développement de $MN^2$`],
  [T`Or la droite $(MH)$ est orthogonale au plan $\mathcal{P}$, qui contient $H$ et $N$ : donc $\overrightarrow{MH} \cdot \overrightarrow{HN} = 0$.`, 'a', T`l'égalité $\overrightarrow{MH} \cdot \overrightarrow{HN} = 0$`],
  [T`Par conséquent $MN^2 = MH^2 + HN^2 \geqslant MH^2$.`, 'b', T`l'inégalité $MN^2 \geqslant MH^2$`],
  [T`Les longueurs étant positives, $MN \geqslant MH$ ; et il y a égalité si et seulement si $HN = 0$, c'est-à-dire $N = H$.`, 'c'] ], [
  [T`Les longueurs s'ajoutent : $MN = MH + HN$.`, T`Cette égalité n'a lieu que si $H$ est sur le segment $[MN]$. Ici le triangle $MHN$ est rectangle en $H$ : ce sont les <em>carrés</em> des longueurs qui s'ajoutent.`],
  [T`Or $\overrightarrow{MH} \cdot \overrightarrow{HN} = MH \times HN$.`, T`Le produit scalaire vaut le produit des longueurs seulement pour des vecteurs colinéaires et de même sens. Ici les vecteurs sont orthogonaux : leur produit scalaire est nul.`] ]),
demo('equation-plan', 'terminale', '', 't-04', 'Équation cartésienne d\'un plan', T`Soit $A(x_A ; y_A ; z_A)$ un point et $\vec n(a ; b ; c)$ un vecteur non nul. Le plan $\mathcal{P}$ passant par $A$ et de vecteur normal $\vec n$ a pour équation $ax + by + cz + d = 0$, où $d = -(ax_A + by_A + cz_A)$.`, [
  [T`Un point $M(x ; y ; z)$ appartient à $\mathcal{P}$ si et seulement si $\overrightarrow{AM} \cdot \vec n = 0$.`, '', T`la caractérisation de $\mathcal{P}$ par $\overrightarrow{AM} \cdot \vec n = 0$`],
  [T`Le vecteur $\overrightarrow{AM}$ a pour coordonnées $(x - x_A ; y - y_A ; z - z_A)$ : donc $\overrightarrow{AM} \cdot \vec n = a(x - x_A) + b(y - y_A) + c(z - z_A)$.`, 'a', T`l'expression du produit scalaire en coordonnées`],
  [T`En développant : $\overrightarrow{AM} \cdot \vec n = ax + by + cz - (ax_A + by_A + cz_A)$.`, 'b', T`le développement du produit scalaire`],
  [T`Donc $M$ appartient à $\mathcal{P}$ si et seulement si $ax + by + cz + d = 0$, avec $d = -(ax_A + by_A + cz_A)$.`, 'c'] ], [
  [T`Un point $M$ appartient à $\mathcal{P}$ si et seulement si $\overrightarrow{AM}$ est colinéaire à $\vec n$.`, T`Les points $M$ tels que $\overrightarrow{AM}$ est colinéaire à $\vec n$ forment la <em>droite</em> passant par $A$ et dirigée par $\vec n$, qui est perpendiculaire au plan. Les points du plan sont ceux pour lesquels $\overrightarrow{AM}$ est orthogonal à $\vec n$.`],
  [T`Donc $\overrightarrow{AM} \cdot \vec n = ax + by + cz$, et le plan a pour équation $ax + by + cz = 0$.`, T`Les coordonnées de $A$ ont été oubliées : cette équation est celle du plan de même direction qui passe par l'origine. Le plan cherché ne passe par l'origine que si $d = 0$.`] ]),
demo('aire-primitive', 'terminale', '', 't-06', 'L\'aire sous la courbe est une primitive', T`Soit $f$ une fonction continue, positive et croissante sur $[a, b]$, et $F(x) = \displaystyle\int_a^x f(t)\,dt$. Alors $F$ est dérivable sur $[a, b]$ et $F' = f$.`, [
  [T`Soit $x_0 \in [a, b]$ et $h > 0$ tel que $x_0 + h \leqslant b$. Le nombre $F(x_0 + h) - F(x_0)$ est l'aire sous la courbe de $f$ entre $x_0$ et $x_0 + h$.`, '', T`l'interprétation de $F(x_0 + h) - F(x_0)$ comme une aire`],
  [T`Comme $f$ est croissante, $f(x_0) \leqslant f(t) \leqslant f(x_0 + h)$ sur $[x_0, x_0 + h]$ : cette aire est comprise entre celles de deux rectangles de largeur $h$, soit $h\,f(x_0) \leqslant F(x_0 + h) - F(x_0) \leqslant h\,f(x_0 + h)$.`, 'a', T`l'encadrement de l'aire par deux rectangles`],
  [T`En divisant par $h > 0$ : $f(x_0) \leqslant \dfrac{F(x_0 + h) - F(x_0)}{h} \leqslant f(x_0 + h)$.`, 'b', T`l'encadrement du taux de variation de $F$`],
  [T`Comme $f$ est continue en $x_0$, $f(x_0 + h)$ tend vers $f(x_0)$ quand $h$ tend vers 0 : par encadrement, le taux de variation tend vers $f(x_0)$.`, 'c', T`la limite du taux de variation pour $h > 0$`],
  [T`On procède de même pour $h < 0$ : la fonction $F$ est dérivable en $x_0$, et $F'(x_0) = f(x_0)$.`, 'd'] ], [
  [T`Cette aire est celle d'un rectangle de largeur $h$ et de hauteur $f(x_0)$ : $F(x_0 + h) - F(x_0) = h\,f(x_0)$.`, T`Ce ne serait vrai que si $f$ était constante sur $[x_0, x_0 + h]$. En général, on ne peut qu'encadrer l'aire entre celles de deux rectangles.`],
  [T`Comme $f$ est croissante, $f(t) \leqslant f(x_0)$ pour tout $t$ de $[x_0, x_0 + h]$.`, T`Une fonction croissante prend ses plus petites valeurs à gauche : pour $t \geqslant x_0$, on a $f(t) \geqslant f(x_0)$. L'inégalité est écrite à l'envers.`] ]),
demo('integrale-primitive', 'terminale', '', 't-06', 'Intégrale et primitive', T`Soit $f$ une fonction continue sur $[a, b]$ et $F$ une primitive quelconque de $f$. Alors $\displaystyle\int_a^b f(x)\,dx = F(b) - F(a)$.`, [
  [T`La fonction $G : x \mapsto \displaystyle\int_a^x f(t)\,dt$ est une primitive de $f$ sur $[a, b]$, et $G(a) = 0$.`, '', T`la primitive $G$, nulle en $a$`],
  [T`Les fonctions $F$ et $G$ sont deux primitives de $f$ sur un intervalle : il existe un réel $k$ tel que $F(x) = G(x) + k$ pour tout $x$.`, 'a', T`la constante $k$ telle que $F = G + k$`],
  [T`En $x = a$ : $F(a) = G(a) + k = k$.`, 'b', T`l'égalité $k = F(a)$`],
  [T`En $x = b$ : $F(b) = G(b) + k = \displaystyle\int_a^b f(t)\,dt + F(a)$.`, 'c', T`l'expression de $F(b)$`],
  [T`Donc $\displaystyle\int_a^b f(x)\,dx = F(b) - F(a)$.`, 'd'] ], [
  [T`Les fonctions $F$ et $G$ sont deux primitives de $f$ : elles sont donc égales.`, T`Deux primitives d'une même fonction sur un intervalle diffèrent d'une constante, qui n'est pas nulle en général. C'est pour l'éliminer que l'on forme la différence $F(b) - F(a)$.`],
  [T`La fonction $G$ vérifie $G(a) = f(a)$.`, T`$G(a)$ est l'intégrale de $f$ entre $a$ et $a$, qui est nulle. C'est la dérivée de $G$ en $a$ qui vaut $f(a)$.`] ]),
demo('k-succes', 'terminale', '', 't-02', 'Probabilité de k succès', T`On répète $n$ épreuves de Bernoulli indépendantes de paramètre $p$, et l'on note $X$ le nombre de succès. Pour tout entier $k$ de 0 à $n$ : $P(X = k) = \displaystyle\binom nk p^k (1 - p)^{n-k}$.`, [
  [T`Une issue de l'expérience est une liste de $n$ résultats, succès ou échec. L'événement $(X = k)$ est formé des listes qui comportent exactement $k$ succès.`, '', T`la description de l'événement $(X = k)$ par des listes`],
  [T`Par indépendance, la probabilité d'une telle liste est le produit des probabilités de ses $n$ résultats : $p^k(1 - p)^{n-k}$, quel que soit l'ordre des succès et des échecs.`, 'a', T`la probabilité d'une liste comportant $k$ succès`],
  [T`Une telle liste est déterminée par les positions de ses $k$ succès parmi les $n$ épreuves : il y en a $\displaystyle\binom nk$.`, 'a', T`le nombre de listes comportant $k$ succès`],
  [T`Ces listes sont des issues deux à deux incompatibles, toutes de même probabilité : $P(X = k) = \displaystyle\binom nk p^k(1 - p)^{n-k}$.`, 'bc'] ], [
  [T`L'événement $(X = k)$ a donc pour probabilité $p^k(1 - p)^{n-k}$.`, T`C'est la probabilité d'<em>une seule</em> liste. L'événement $(X = k)$ en réunit plusieurs, une par façon de placer les succès : pour $n = 2$ et $k = 1$, il y a « succès, échec » et « échec, succès ».`],
  [T`Le nombre de listes comportant $k$ succès est $n(n-1)\cdots(n-k+1)$.`, T`Ce nombre compte les façons de choisir les $k$ positions <em>dans un certain ordre</em>. Or choisir les positions 1 puis 3 ou 3 puis 1 donne la même liste : il faut diviser par $k!$, ce qui donne $\displaystyle\binom nk$.`] ]),
demo('variance-binomiale', 'terminale', '', 't-02', 'Variance de la loi binomiale', T`Si $X$ suit la loi binomiale de paramètres $n$ et $p$, alors $V(X) = np(1 - p)$.`, [
  [T`Écrivons $X = X_1 + \dots + X_n$, où $X_i$ vaut 1 si la $i$-ième épreuve est un succès et 0 sinon ; ces variables sont indépendantes.`, '', T`la décomposition $X = X_1 + \dots + X_n$`],
  [T`On a $E(X_i) = p$. De plus $X_i^2 = X_i$, puisque $X_i$ ne prend que les valeurs 0 et 1 : donc $E(X_i^2) = p$.`, 'a', T`les valeurs de $E(X_i)$ et $E(X_i^2)$`],
  [T`Par conséquent $V(X_i) = E(X_i^2) - E(X_i)^2 = p - p^2 = p(1 - p)$.`, 'b', T`la variance de chaque $X_i$`],
  [T`Les variables $X_i$ étant indépendantes, la variance de leur somme est la somme de leurs variances : $V(X) = np(1 - p)$.`, 'c'] ], [
  [T`Les $X_i$ ayant la même loi, $X = nX_1$, donc $V(X) = n^2\,V(X_1) = n^2 p(1 - p)$.`, T`Avoir la même loi n'est pas être égales : $X_1 + X_2$ peut valoir 1, ce que $2X_1$ ne peut pas. La variance de $n$ variables indépendantes de même loi est $n$ fois la variance commune, pas $n^2$ fois.`],
  [T`Par conséquent $V(X_i) = E(X_i^2) = p$.`, T`La variance est $E(X_i^2) - E(X_i)^2$ : il faut retrancher le carré de l'espérance. On ne peut l'oublier que pour une variable d'espérance nulle.`] ]),
demo('pascal-calcul', 'terminale', '', 't-07', 'Relation de Pascal par le calcul', T`Pour tous entiers $n$ et $k$ tels que $1 \leqslant k \leqslant n - 1$ : $\displaystyle\binom{n-1}{k-1} + \binom{n-1}{k} = \binom nk$, en partant de $\displaystyle\binom nk = \frac{n!}{k!\,(n-k)!}$.`, [
  [T`Par la formule : $\displaystyle\binom{n-1}{k-1} + \binom{n-1}{k} = \frac{(n-1)!}{(k-1)!\,(n-k)!} + \frac{(n-1)!}{k!\,(n-k-1)!}$.`, '', T`l'écriture des deux coefficients avec des factorielles`],
  [T`Réduisons au dénominateur commun $k!\,(n-k)!$ : comme $k! = k \times (k-1)!$ et $(n-k)! = (n-k) \times (n-k-1)!$, on multiplie la première fraction par $\dfrac kk$ et la seconde par $\dfrac{n-k}{n-k}$.`, 'a', T`la réduction au même dénominateur`],
  [T`La somme vaut donc $\dfrac{(n-1)!\,\bigl(k + (n - k)\bigr)}{k!\,(n-k)!}$.`, 'b', T`la somme écrite sur un seul dénominateur`],
  [T`Or $k + (n - k) = n$, et $n \times (n-1)! = n!$ : la somme vaut $\dfrac{n!}{k!\,(n-k)!} = \displaystyle\binom nk$.`, 'c'] ], [
  [T`On additionne les numérateurs entre eux et les dénominateurs entre eux : la somme vaut $\dfrac{2\,(n-1)!}{(k-1)!\,(n-k)! + k!\,(n-k-1)!}$.`, T`On n'additionne pas deux fractions ainsi : $\dfrac12 + \dfrac12$ ne vaut pas $\dfrac24$. Il faut d'abord les réduire au même dénominateur.`],
  [T`Comme $k! = k + (k-1)!$, on multiplie la première fraction par $\dfrac kk$.`, T`La factorielle est un produit : $k! = k \times (k-1)!$. Pour $k = 4$, on a $24 = 4 \times 6$, et non $4 + 6$.`] ]),
demo('affine-ordre-1', 'terminale', '', 't-08', 'Solutions de y′ = ay + b', T`Soit $a \neq 0$ et $b$ deux réels. Les solutions sur $\mathbb{R}$ de l'équation $y' = ay + b$ sont les fonctions $x \mapsto Ce^{ax} - \dfrac ba$, où $C$ est un réel quelconque.`, [
  [T`La fonction constante $y_0 = -\dfrac ba$ est solution : sa dérivée est nulle, et $a \times \left(-\dfrac ba\right) + b = 0$.`, '', T`la solution constante $y_0 = -\dfrac ba$`],
  [T`Soit $f$ une fonction dérivable sur $\mathbb{R}$. Comme $y_0' = ay_0 + b$, l'égalité $f' = af + b$ équivaut, en retranchant, à $(f - y_0)' = a(f - y_0)$.`, 'a', T`l'équivalence avec $(f - y_0)' = a(f - y_0)$`],
  [T`Autrement dit, $f$ est solution si et seulement si $f - y_0$ est solution de $y' = ay$, c'est-à-dire de la forme $x \mapsto Ce^{ax}$.`, 'b', T`la forme de $f - y_0$`],
  [T`Les solutions sont donc les fonctions $x \mapsto Ce^{ax} - \dfrac ba$, où $C$ est un réel.`, 'c'] ], [
  [T`La fonction constante égale à $b$ est solution : sa dérivée est nulle.`, T`Pour une fonction constante égale à $k$, l'équation s'écrit $0 = ak + b$ : il faut $k = -\dfrac ba$. La constante $b$ donnerait $ab + b$, qui n'est pas nul en général.`],
  [T`Autrement dit, $f$ est solution si et seulement si $f - y_0$ est solution de la même équation $y' = ay + b$.`, T`En retranchant les deux égalités, le terme $b$ s'élimine : $f - y_0$ est solution de l'équation <em>sans second membre</em> $y' = ay$. C'est tout l'intérêt de retrancher une solution particulière.`] ]),
demo('loi-faible', 'terminale', '', 't-10', 'Loi faible des grands nombres', T`Soit $X_1, \dots, X_n$ des variables aléatoires indépendantes de même loi, d'espérance $\mu$ et de variance $V$, et $M_n$ leur moyenne. Pour tout $\delta > 0$, $P\bigl(|M_n - \mu| \geqslant \delta\bigr)$ tend vers 0 quand $n$ tend vers $+\infty$.`, [
  [T`Soit $\delta > 0$ un réel fixé.`, '', T`le réel $\delta$`],
  [T`D'après l'inégalité de concentration, pour tout entier $n \geqslant 1$ : $0 \leqslant P\bigl(|M_n - \mu| \geqslant \delta\bigr) \leqslant \dfrac{V}{n\delta^2}$.`, 'a', T`l'encadrement de la probabilité`],
  [T`Les nombres $V$ et $\delta$ ne dépendent pas de $n$ : la suite $\left(\dfrac{V}{n\delta^2}\right)$ tend vers 0 quand $n$ tend vers $+\infty$.`, 'a', T`la limite du majorant`],
  [T`D'après le théorème des gendarmes, $P\bigl(|M_n - \mu| \geqslant \delta\bigr)$ tend vers 0.`, 'bc'] ], [
  [T`Par conséquent, $M_n = \mu$ dès que $n$ est assez grand.`, T`Le théorème dit que les écarts d'au moins $\delta$ deviennent improbables, pas que la moyenne atteint $\mu$. Pour une pièce équilibrée, la fréquence de pile n'est jamais $\dfrac12$ après un nombre impair de lancers.`],
  [T`Le majorant $\dfrac{V}{n\delta^2}$ tend vers 0 quand $\delta$ tend vers 0.`, T`Quand $\delta$ tend vers 0, ce majorant tend vers $+\infty$ : plus la précision demandée est fine, moins la majoration est bonne. Ici $\delta$ est fixé, et c'est $n$ qui tend vers l'infini.`] ]),
];
