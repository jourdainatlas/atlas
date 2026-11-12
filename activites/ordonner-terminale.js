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
];
