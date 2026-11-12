// « Le contre-exemple » : quarante-six énoncés faux et, pour chacun, quatre objets dont un seul le réfute (MEMO_atlas_activites.md §151).
import { T, contre } from './raisonner-outils.js';
const F = 'fondements', A = 'algebre', L = 'lineaire', N = 'analyse', Pr = 'probabilites', B = true;
const HF = ` L'hypothèse n'étant pas vérifiée, cet objet ne dit rien de l'énoncé.`, CV = ` Cet objet vérifie l'hypothèse et la conclusion : il illustre l'énoncé, il ne le réfute pas.`;
export default [
// ---------- Première ----------
contre('carre-grand', 'premiere', '', 'p-01', 'x² > 4 donc x > 2', T`« Si un réel $x$ vérifie $x^2 > 4$, alors $x > 2$. »`, [
  [T`$x = 3$`, T`$3^2 = 9 > 4$ et $3 > 2$.` + CV],
  [T`$x = -3$`, T`$(-3)^2 = 9 > 4$, et pourtant $-3$ n'est pas supérieur à 2 : l'hypothèse est vraie, la conclusion fausse.`, B],
  [T`$x = 1$`, T`$1^2 = 1$ n'est pas supérieur à 4.` + HF],
  [T`$x = 2$`, T`$2^2 = 4$ n'est pas strictement supérieur à 4.` + HF] ],
  T`$x^2 > 4$ équivaut à $x > 2$ ou $x < -2$. Un contre-exemple à « si $H$ alors $C$ » vérifie $H$ sans vérifier $C$.`),
contre('croissante-infini', 'premiere', '', 'p-02', 'Croissante donc de limite infinie', T`« Toute suite croissante finit par dépasser n'importe quel nombre. »`, [
  [T`$u_n = n$`, T`Cette suite est croissante et dépasse n'importe quel nombre.` + CV],
  [T`$u_n = 1 - \dfrac{1}{n + 1}$`, T`Cette suite est croissante, puisque l'on retranche de moins en moins, mais tous ses termes sont inférieurs à 1 : elle ne dépasse jamais 1.`, B],
  [T`$u_n = (-1)^n$`, T`Cette suite n'est pas croissante : elle passe de 1 à $-1$.` + HF],
  [T`$u_n = -n$`, T`Cette suite est décroissante.` + HF] ],
  T`Une suite croissante peut être majorée : elle se rapproche alors d'un plafond sans le dépasser. Croissante ne veut pas dire « qui tend vers $+\infty$ ».`),
contre('derivee-nulle', 'premiere', '', 'p-04', 'Dérivée nulle donc extremum', T`« Si $f'(a) = 0$, alors $f$ admet un extremum local en $a$. »`, [
  [T`$f(x) = x^2$ et $a = 0$`, T`$f'(0) = 0$ et $f$ a un minimum en 0.` + CV],
  [T`$f(x) = x^3$ et $a = 0$`, T`$f'(0) = 0$, mais $f$ est strictement croissante : $f(x) < 0$ avant 0 et $f(x) > 0$ après, il n'y a pas d'extremum.`, B],
  [T`$f(x) = x$ et $a = 0$`, T`$f'(0) = 1$ n'est pas nul.` + HF],
  [T`$f(x) = x^2 - 2x$ et $a = 1$`, T`$f'(1) = 0$ et $f$ a un minimum en 1.` + CV] ],
  T`La dérivée doit s'annuler en changeant de signe. En 0, la dérivée $3x^2$ de $x^3$ s'annule sans changer de signe.`),
contre('carre-plus-grand', 'premiere', '', 'p-01', 'Un carré plus grand que le nombre', T`« Le carré d'un réel positif est toujours supérieur ou égal à ce réel. »`, [
  [T`$x = 2$`, T`$2^2 = 4 \geqslant 2$ : l'énoncé est vérifié pour ce nombre.`],
  [T`$x = 1$`, T`$1^2 = 1 \geqslant 1$ : l'énoncé est vérifié pour ce nombre.`],
  [T`$x = \dfrac12$`, T`$\left(\dfrac12\right)^2 = \dfrac14$, qui est plus petit que $\dfrac12$.`, B],
  [T`$x = 10$`, T`$10^2 = 100 \geqslant 10$ : l'énoncé est vérifié pour ce nombre.`] ],
  T`Pour $0 < x < 1$, on a $x^2 < x$ : multiplier par un nombre inférieur à 1 fait diminuer. Tester seulement des entiers ne révèle pas ce cas.`),
contre('incompatibles', 'premiere', '', 'p-05', 'Incompatibles donc indépendants', T`On lance un dé équilibré. « Deux événements incompatibles sont indépendants. »`, [
  [T`$A$ : « le résultat est pair » ; $B$ : « le résultat est impair »`, T`Ces événements sont incompatibles, donc $P(A \cap B) = 0$, alors que $P(A)\,P(B) = \dfrac14$ : ils ne sont pas indépendants.`, B],
  [T`$A$ : « le résultat est pair » ; $B$ : « le résultat est 1 ou 2 »`, T`Ces événements ne sont pas incompatibles : le résultat 2 réalise les deux.` + HF],
  [T`$A$ : « le résultat est 1 » ; $B$ : « le résultat est 1 ou 2 »`, T`Ces événements ne sont pas incompatibles : le résultat 1 réalise les deux.` + HF],
  [T`$A$ : « le résultat est 7 » ; $B$ : « le résultat est pair »`, T`$A$ est impossible : les événements sont incompatibles, et $P(A \cap B) = 0 = P(A)\,P(B)$.` + CV] ],
  T`Deux événements incompatibles de probabilités non nulles ne sont jamais indépendants : si l'un se produit, l'autre est exclu.`),
contre('carre-somme', 'premiere', '', 'p-01', 'Le carré d\'une somme', T`« Pour tous réels $a$ et $b$, $(a + b)^2 = a^2 + b^2$. »`, [
  [T`$a = 0$ et $b = 5$`, T`$(0 + 5)^2 = 25$ et $0^2 + 5^2 = 25$ : l'égalité est vraie pour ces nombres.`],
  [T`$a = 1$ et $b = 1$`, T`$(1 + 1)^2 = 4$, alors que $1^2 + 1^2 = 2$.`, B],
  [T`$a = 3$ et $b = 0$`, T`$(3 + 0)^2 = 9$ et $3^2 + 0^2 = 9$ : l'égalité est vraie pour ces nombres.`],
  [T`$a = 0$ et $b = 0$`, T`Les deux membres valent 0 : l'égalité est vraie pour ces nombres.`] ],
  T`$(a + b)^2 = a^2 + 2ab + b^2$ : l'égalité proposée n'est vraie que si $ab = 0$. Un exemple avec un zéro ne teste rien.`),
contre('scalaire-simplifier', 'premiere', '', 'p-07', 'Simplifier un produit scalaire', T`« Si $\vec u$ n'est pas nul et si $\vec u \cdot \vec v = \vec u \cdot \vec w$, alors $\vec v = \vec w$. »`, [
  [T`$\vec u(1 ; 0)$, $\vec v(0 ; 1)$, $\vec w(0 ; 2)$`, T`$\vec u \cdot \vec v = 0$ et $\vec u \cdot \vec w = 0$, alors que $\vec v \neq \vec w$.`, B],
  [T`$\vec u(1 ; 0)$, $\vec v(2 ; 1)$, $\vec w(2 ; 1)$`, T`Les produits scalaires sont égaux, et $\vec v = \vec w$.` + CV],
  [T`$\vec u(1 ; 1)$, $\vec v(1 ; 0)$, $\vec w(0 ; 0)$`, T`$\vec u \cdot \vec v = 1$ et $\vec u \cdot \vec w = 0$ : les produits scalaires sont différents.` + HF],
  [T`$\vec u(1 ; 0)$, $\vec v(1 ; 2)$, $\vec w(3 ; 2)$`, T`$\vec u \cdot \vec v = 1$ et $\vec u \cdot \vec w = 3$ : les produits scalaires sont différents.` + HF] ],
  T`$\vec u \cdot \vec v = \vec u \cdot \vec w$ signifie que $\vec v - \vec w$ est orthogonal à $\vec u$, pas qu'il est nul.`),
contre('racine-somme', 'premiere', '', 'p-01', 'La racine d\'une somme', T`« Pour tous réels positifs $a$ et $b$, $\sqrt{a + b} = \sqrt a + \sqrt b$. »`, [
  [T`$a = 0$ et $b = 4$`, T`Les deux membres valent 2 : l'égalité est vraie pour ces nombres.`],
  [T`$a = 9$ et $b = 16$`, T`$\sqrt{25} = 5$, alors que $\sqrt9 + \sqrt{16} = 7$.`, B],
  [T`$a = 0$ et $b = 0$`, T`Les deux membres valent 0 : l'égalité est vraie pour ces nombres.`],
  [T`$a = 1$ et $b = 0$`, T`Les deux membres valent 1 : l'égalité est vraie pour ces nombres.`] ],
  T`La racine carrée est compatible avec le produit, $\sqrt{ab} = \sqrt a\,\sqrt b$, pas avec la somme. L'égalité proposée n'a lieu que si $a = 0$ ou $b = 0$.`),
contre('sinus-nul', 'premiere', '', 'p-06', 'sin x = 0 donc cos x = 1', T`« Si $\sin x = 0$, alors $\cos x = 1$. »`, [
  [T`$x = 0$`, T`$\sin 0 = 0$ et $\cos 0 = 1$.` + CV],
  [T`$x = 2\pi$`, T`$\sin(2\pi) = 0$ et $\cos(2\pi) = 1$.` + CV],
  [T`$x = \pi$`, T`$\sin\pi = 0$, et pourtant $\cos\pi = -1$.`, B],
  [T`$x = \dfrac{\pi}{2}$`, T`$\sin\dfrac{\pi}{2} = 1$ n'est pas nul.` + HF] ],
  T`Sur le cercle trigonométrique, deux points ont une ordonnée nulle : ceux d'abscisses 1 et $-1$. Si $\sin x = 0$, alors $\cos x = 1$ ou $\cos x = -1$.`),
// ---------- Terminale ----------
contre('bornee-convergente', 'terminale', '', 't-01', 'Bornée donc convergente', T`« Toute suite bornée converge. »`, [
  [T`$u_n = (-1)^n$`, T`Cette suite est bornée par $-1$ et 1, et elle n'a pas de limite : elle oscille entre ces deux valeurs.`, B],
  [T`$u_n = \dfrac1n$`, T`Cette suite est bornée et converge vers 0.` + CV],
  [T`$u_n = n$`, T`Cette suite n'est pas bornée.` + HF],
  [T`$u_n = \dfrac{(-1)^n}{n}$`, T`Cette suite est bornée et converge vers 0.` + CV] ],
  T`Convergente entraîne bornée ; la réciproque est fausse. Ce qui est vrai : toute suite monotone et bornée converge.`),
contre('continue-derivable', 'terminale', '', 't-03', 'Continue donc dérivable', T`« Toute fonction continue en $a$ est dérivable en $a$. »`, [
  [T`$f(x) = |x|$ et $a = 0$`, T`Cette fonction est continue en 0, mais ses taux de variation valent $-1$ à gauche et 1 à droite : elle n'est pas dérivable en 0.`, B],
  [T`$f(x) = x^2$ et $a = 0$`, T`Cette fonction est continue et dérivable en 0.` + CV],
  [T`$f(x) = \dfrac1x$ et $a = 0$`, T`Cette fonction n'est pas définie en 0, donc pas continue en 0.` + HF],
  [T`$f(x) = e^x$ et $a = 0$`, T`Cette fonction est continue et dérivable en 0.` + CV] ],
  T`Dérivable entraîne continue ; la réciproque est fausse. Un point anguleux est le cas type d'une fonction continue non dérivable.`),
contre('infini-fois-zero', 'terminale', '', 't-01', 'L\'infini fois zéro', T`« Si $(u_n)$ tend vers $+\infty$ et $(v_n)$ tend vers 0, alors $(u_n v_n)$ tend vers 0. »`, [
  [T`$u_n = n$ et $v_n = \dfrac{1}{n^2}$`, T`Le produit vaut $\dfrac1n$, qui tend vers 0.` + CV],
  [T`$u_n = n^2$ et $v_n = \dfrac1n$`, T`Les hypothèses sont vérifiées, mais le produit vaut $n$, qui tend vers $+\infty$.`, B],
  [T`$u_n = n$ et $v_n = 1$`, T`La suite $(v_n)$ ne tend pas vers 0.` + HF],
  [T`$u_n = 1$ et $v_n = \dfrac1n$`, T`La suite $(u_n)$ ne tend pas vers $+\infty$.` + HF] ],
  T`« $\infty \times 0$ » est une forme indéterminée : selon les suites, le produit peut tendre vers 0, vers l'infini, ou vers n'importe quel réel.`),
contre('inflexion', 'terminale', '', 't-03', 'Dérivée seconde nulle donc inflexion', T`« Si $f''(a) = 0$, alors la courbe de $f$ a un point d'inflexion en $a$. »`, [
  [T`$f(x) = x^3$ et $a = 0$`, T`$f''(0) = 0$ et la courbe a bien un point d'inflexion en 0.` + CV],
  [T`$f(x) = x^4$ et $a = 0$`, T`$f''(x) = 12x^2$ s'annule en 0 sans changer de signe : la fonction est convexe, il n'y a pas de point d'inflexion.`, B],
  [T`$f(x) = x^2$ et $a = 0$`, T`$f''(0) = 2$ n'est pas nul.` + HF],
  [T`$f(x) = e^x$ et $a = 0$`, T`$f''(0) = 1$ n'est pas nul.` + HF] ],
  T`Il faut que $f''$ s'annule en changeant de signe : c'est le changement de convexité qui fait le point d'inflexion.`),
contre('integrale-nulle', 'terminale', '', 't-06', 'Intégrale nulle donc fonction nulle', T`« Si $\displaystyle\int_a^b f(x)\,dx = 0$, alors $f$ est nulle sur $[a, b]$. »`, [
  [T`$f(x) = x$ sur $[-1, 1]$`, T`L'intégrale est nulle, les aires de part et d'autre de 0 se compensant, et $f$ n'est pas la fonction nulle.`, B],
  [T`$f(x) = 0$ sur $[0, 1]$`, T`L'intégrale est nulle et la fonction aussi.` + CV],
  [T`$f(x) = x$ sur $[0, 1]$`, T`L'intégrale vaut $\dfrac12$.` + HF],
  [T`$f(x) = x^2$ sur $[-1, 1]$`, T`L'intégrale vaut $\dfrac23$.` + HF] ],
  T`L'énoncé devient vrai pour une fonction continue et positive. Sans la positivité, des aires de signes contraires peuvent se compenser.`),
contre('ln-somme', 'terminale', '', 't-05', 'Le logarithme d\'une somme', T`« Pour tous réels $a > 0$ et $b > 0$, $\ln(a + b) = \ln a + \ln b$. »`, [
  [T`$a = 2$ et $b = 2$`, T`$\ln 4 = 2\ln 2$ : l'égalité est vraie pour ces nombres, parce que $2 + 2 = 2 \times 2$.`],
  [T`$a = 1$ et $b = 1$`, T`$\ln 2 \approx 0{,}69$, alors que $\ln 1 + \ln 1 = 0$.`, B],
  [T`$a = 3$ et $b = 1{,}5$`, T`$3 + 1{,}5 = 4{,}5 = 3 \times 1{,}5$ : les deux membres valent $\ln 4{,}5$, l'égalité est vraie pour ces nombres.`],
  [T`$a = 4$ et $b = \dfrac43$`, T`$4 + \dfrac43 = \dfrac{16}{3} = 4 \times \dfrac43$ : l'égalité est vraie pour ces nombres.`] ],
  T`$\ln a + \ln b = \ln(ab)$ : l'égalité proposée n'a lieu que si $a + b = ab$. Des exemples bien choisis peuvent donner raison à une formule fausse ; un seul contre-exemple la réfute.`),
contre('non-paralleles', 'terminale', '', 't-04', 'Non parallèles donc sécantes', T`Dans un repère $(O ; \vec i, \vec j, \vec k)$ de l'espace : « Deux droites qui ne sont pas parallèles sont sécantes. »`, [
  [T`La droite $(O ; \vec i)$ et la droite passant par $A(0 ; 0 ; 1)$ dirigée par $\vec j$`, T`Elles ne sont pas parallèles, et n'ont aucun point commun : les points de l'une ont pour cote 0, ceux de l'autre pour cote 1.`, B],
  [T`La droite $(O ; \vec i)$ et la droite $(O ; \vec j)$`, T`Elles ne sont pas parallèles et se coupent en $O$.` + CV],
  [T`La droite $(O ; \vec i)$ et la droite passant par $B(0 ; 1 ; 0)$ dirigée par $\vec i$`, T`Ces deux droites sont parallèles.` + HF],
  [T`La droite $(O ; \vec i)$ et la droite passant par $C(1 ; 0 ; 0)$ dirigée par $\vec k$`, T`Elles ne sont pas parallèles et se coupent en $C$.` + CV] ],
  T`Dans l'espace, deux droites peuvent être non coplanaires : ni parallèles, ni sécantes.`),
contre('meme-loi', 'terminale', '', 't-02', 'Même loi donc égales', T`« Deux variables aléatoires qui ont la même loi sont égales. »`, [
  [T`$X$ est le résultat d'un dé, et $Y = X$`, T`Les deux variables ont la même loi et sont égales.` + CV],
  [T`$X$ vaut 0 ou 1 selon le résultat d'une pièce équilibrée, et $Y = 1 - X$`, T`$X$ et $Y$ valent chacune 0 ou 1 avec la probabilité $\dfrac12$ : même loi. Pourtant elles ne sont jamais égales.`, B],
  [T`$X$ est le résultat d'un dé, et $Y = 2X$`, T`$Y$ prend les valeurs 2, 4, …, 12 : les deux variables n'ont pas la même loi.` + HF],
  [T`$X$ est le résultat d'un dé, et $Y = X + 1$`, T`$Y$ prend les valeurs 2 à 7 : les deux variables n'ont pas la même loi.` + HF] ],
  T`La loi d'une variable décrit les probabilités de ses valeurs, pas la variable elle-même. Deux lancers d'un même dé ont la même loi sans donner le même résultat.`),
contre('tend-vers-zero', 'terminale', '', 't-01', 'Tend vers 0 donc décroît', T`« Une suite de réels positifs qui tend vers 0 est décroissante à partir d'un certain rang. »`, [
  [T`$u_n = \dfrac1n$`, T`Cette suite tend vers 0 et elle est décroissante.` + CV],
  [T`$u_n = \dfrac{2 + (-1)^n}{n}$`, T`Cette suite est positive et tend vers 0, mais $u_{2n} = \dfrac{3}{2n}$ est plus grand que $u_{2n-1} = \dfrac{1}{2n-1}$ : elle remonte à chaque rang pair.`, B],
  [T`$u_n = \dfrac{1}{2^n}$`, T`Cette suite tend vers 0 et elle est décroissante.` + CV],
  [T`$u_n = n$`, T`Cette suite ne tend pas vers 0.` + HF] ],
  T`Avoir une limite ne dit rien du sens de variation : une suite peut converger en oscillant.`),
// ---------- Maths expertes ----------
contre('divise-produit', 'expertes', '', 'me-07', 'Diviser un produit', T`« Si un entier $a$ divise un produit $bc$, alors $a$ divise $b$ ou $a$ divise $c$. »`, [
  [T`$a = 6$, $b = 4$, $c = 9$`, T`6 divise 36, mais ne divise ni 4 ni 9.`, B],
  [T`$a = 3$, $b = 4$, $c = 9$`, T`3 divise 36 et divise 9.` + CV],
  [T`$a = 5$, $b = 4$, $c = 9$`, T`5 ne divise pas 36.` + HF],
  [T`$a = 4$, $b = 4$, $c = 9$`, T`4 divise 36 et divise 4.` + CV] ],
  T`L'énoncé est vrai quand $a$ est premier (lemme d'Euclide), ou quand $a$ est premier avec $b$ (théorème de Gauss).`),
contre('euler-41', 'expertes', '', 'me-01', 'Une formule à nombres premiers', T`« Pour tout entier naturel $n$, le nombre $n^2 + n + 41$ est premier. »`, [
  [T`$n = 0$`, T`On obtient 41, qui est premier : l'énoncé est vérifié pour cet entier.`],
  [T`$n = 10$`, T`On obtient 151, qui est premier : l'énoncé est vérifié pour cet entier.`],
  [T`$n = 40$`, T`On obtient $1600 + 40 + 41 = 1681 = 41^2$, qui n'est pas premier.`, B],
  [T`$n = 39$`, T`On obtient 1601, qui est premier : l'énoncé est vérifié pour cet entier.`] ],
  T`Ce polynôme d'Euler donne un nombre premier pour tous les entiers de 0 à 39 : quarante vérifications ne font pas une démonstration.`),
contre('carres-congrus', 'expertes', '', 'me-04', 'Carrés congrus', T`« Si $a^2 \equiv b^2 \pmod n$, alors $a \equiv b \pmod n$. »`, [
  [T`$a = 3$, $b = 1$, $n = 8$`, T`$9 \equiv 1 \pmod 8$, alors que 3 et 1 ne sont pas congrus modulo 8.`, B],
  [T`$a = 5$, $b = 1$, $n = 4$`, T`$25 \equiv 1 \pmod 4$, et $5 \equiv 1 \pmod 4$.` + CV],
  [T`$a = 7$, $b = 2$, $n = 5$`, T`$49 \equiv 4 \pmod 5$, et $7 \equiv 2 \pmod 5$.` + CV],
  [T`$a = 3$, $b = 2$, $n = 7$`, T`$9 \equiv 2$ et $4 \equiv 4 \pmod 7$ : les carrés ne sont pas congrus.` + HF] ],
  T`On peut élever une congruence au carré, pas en prendre la racine.`),
contre('module-somme', 'expertes', '', 'me-02', 'Le module d\'une somme', T`« Pour tous nombres complexes $z$ et $z'$, $|z + z'| = |z| + |z'|$. »`, [
  [T`$z = 1$ et $z' = 2$`, T`$|3| = 3 = 1 + 2$ : l'égalité est vraie pour ces nombres.`],
  [T`$z = i$ et $z' = 3i$`, T`$|4i| = 4 = 1 + 3$ : l'égalité est vraie pour ces nombres.`],
  [T`$z = 1$ et $z' = i$`, T`$|1 + i| = \sqrt2$, alors que $|1| + |i| = 2$.`, B],
  [T`$z = 0$ et $z' = 5$`, T`Les deux membres valent 5 : l'égalité est vraie pour ces nombres.`] ],
  T`$|z + z'| \leqslant |z| + |z'|$, avec égalité quand les points images sont sur une même demi-droite issue de l'origine.`),
contre('matrices-commutent', 'expertes', '', 'me-03', 'Le produit de matrices commute', T`« Pour toutes matrices carrées $A$ et $B$ d'ordre 2, $AB = BA$. »`, [
  [T`$A = I_2$ et $B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$`, T`$AB = B = BA$ : l'égalité est vraie pour ces matrices.`],
  [T`$A = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$ et $B = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}$`, T`$AB = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$, alors que $BA = \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix}$.`, B],
  [T`$A = 2I_2$ et $B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$`, T`$AB = 2B = BA$ : l'égalité est vraie pour ces matrices.`],
  [T`$A = B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$`, T`$AB = A^2 = BA$ : l'égalité est vraie pour ces matrices.`] ],
  T`Le produit matriciel n'est pas commutatif. Une matrice commute toujours avec elle-même, avec l'identité et avec ses multiples.`),
contre('chaine-eulerienne', 'expertes', '', 'me-06', 'Connexe donc eulérien', T`« Tout graphe connexe admet une chaîne eulérienne. »`, [
  [T`Un triangle : trois sommets reliés deux à deux`, T`Tous les sommets sont de degré 2 : le graphe admet un cycle eulérien.` + CV],
  [T`Une chaîne de trois sommets $A$ — $B$ — $C$`, T`La chaîne $A$, $B$, $C$ emprunte chaque arête une fois.` + CV],
  [T`Le graphe complet à quatre sommets, où chaque sommet est relié aux trois autres`, T`Il est connexe, mais ses quatre sommets sont de degré 3 : il y a plus de deux sommets de degré impair, donc pas de chaîne eulérienne.`, B],
  [T`Un carré $ABCD$ avec sa diagonale $[AC]$`, T`Deux sommets seulement, $A$ et $C$, sont de degré impair : il existe une chaîne eulérienne de $A$ à $C$.` + CV] ],
  T`Théorème d'Euler : un graphe connexe admet une chaîne eulérienne si et seulement s'il a zéro ou deux sommets de degré impair.`),
contre('carre-reel', 'expertes', '', 'me-02', 'Carré réel donc nombre réel', T`« Si le carré d'un nombre complexe $z$ est réel, alors $z$ est réel. »`, [
  [T`$z = 2$`, T`$z^2 = 4$ est réel et $z$ aussi.` + CV],
  [T`$z = i$`, T`$z^2 = -1$ est réel, alors que $i$ ne l'est pas.`, B],
  [T`$z = 1 + i$`, T`$z^2 = 2i$ n'est pas réel.` + HF],
  [T`$z = -3$`, T`$z^2 = 9$ est réel et $z$ aussi.` + CV] ],
  T`$z^2$ est réel si et seulement si $z$ est réel ou imaginaire pur.`),
contre('mersenne', 'expertes', '', 'me-01', 'Nombres de Mersenne', T`« Si $p$ est un nombre premier, alors $2^p - 1$ est premier. »`, [
  [T`$p = 3$`, T`$2^3 - 1 = 7$ est premier.` + CV],
  [T`$p = 5$`, T`$2^5 - 1 = 31$ est premier.` + CV],
  [T`$p = 7$`, T`$2^7 - 1 = 127$ est premier.` + CV],
  [T`$p = 11$`, T`$2^{11} - 1 = 2047 = 23 \times 89$ n'est pas premier.`, B] ],
  T`C'est la réciproque qui est vraie : si $2^n - 1$ est premier, alors $n$ est premier.`),
// ---------- Maths Sup : fondements ----------
contre('composee-g', 'sup', F, 'ma-02', 'g ∘ f injective donc g injective', T`« Si $g \circ f$ est injective, alors $g$ est injective. »`, [
  [T`$f : \{0\} \to \{0, 1\}$, $f(0) = 0$, et $g : \{0, 1\} \to \{0\}$`, T`$g \circ f$ part d'un ensemble à un élément, elle est injective ; $g$ ne l'est pas, puisque $g(0) = g(1)$.`, B],
  [T`$f = \mathrm{id}_{\mathbb{R}}$ et $g = \mathrm{id}_{\mathbb{R}}$`, T`$g \circ f$ est injective et $g$ aussi.` + CV],
  [T`$f = \mathrm{id}_{\mathbb{R}}$ et $g : x \mapsto x^2$ sur $\mathbb{R}$`, T`$g \circ f = g$ n'est pas injective.` + HF],
  [T`$f : x \mapsto 2x$ et $g : x \mapsto x + 1$ sur $\mathbb{R}$`, T`$g \circ f$ est injective et $g$ aussi.` + CV] ],
  T`Si $g \circ f$ est injective, c'est $f$ qui l'est. L'injectivité de $g \circ f$ ne renseigne sur $g$ que sur l'image de $f$.`),
contre('image-intersection', 'sup', F, 'ma-02', 'Image d\'une intersection', T`« Pour toute application $f$ et toutes parties $A$ et $B$, $f(A \cap B) = f(A) \cap f(B)$. »`, [
  [T`$f : x \mapsto x^2$, $A = [-1, 0]$, $B = [0, 1]$`, T`$f(A \cap B) = \{0\}$, alors que $f(A) \cap f(B) = [0, 1]$.`, B],
  [T`$f : x \mapsto x^2$, $A = [0, 1]$, $B = [0, 2]$`, T`$f(A \cap B) = [0, 1]$ et $f(A) \cap f(B) = [0, 1] \cap [0, 4] = [0, 1]$ : l'égalité est vraie ici.`],
  [T`$f : x \mapsto 2x$, $A = [-1, 0]$, $B = [0, 1]$`, T`Les deux ensembles valent $\{0\}$ : l'égalité est vraie ici, $f$ étant injective.`],
  [T`$f : x \mapsto x^2$, $A = [1, 2]$, $B = [3, 4]$`, T`Les deux ensembles sont vides : l'égalité est vraie ici.`] ],
  T`On a toujours $f(A \cap B) \subset f(A) \cap f(B)$, avec égalité pour toutes les parties si et seulement si $f$ est injective.`),
contre('reflexive', 'sup', F, 'ma-02', 'Symétrique et transitive donc réflexive', T`« Toute relation symétrique et transitive sur $\mathbb{Z}$ est réflexive. »`, [
  [T`$x \mathrel{\mathcal{R}} y$ si $xy > 0$`, T`Cette relation est symétrique et transitive, mais 0 n'est pas en relation avec lui-même.`, B],
  [T`$x \mathrel{\mathcal{R}} y$ si $x - y$ est pair`, T`Cette relation est symétrique, transitive et réflexive.` + CV],
  [T`$x \mathrel{\mathcal{R}} y$ si $x \leqslant y$`, T`Cette relation n'est pas symétrique.` + HF],
  [T`$x \mathrel{\mathcal{R}} y$ si $x = y + 1$`, T`Cette relation n'est pas symétrique.` + HF] ],
  T`De $x \mathrel{\mathcal{R}} y$ et $y \mathrel{\mathcal{R}} x$ on tire bien $x \mathrel{\mathcal{R}} x$, mais encore faut-il que $x$ soit en relation avec un élément.`),
// ---------- Maths Sup : algèbre ----------
contre('reunion-sous-groupes', 'sup', A, 'ma-11', 'Réunion de sous-groupes', T`« La réunion de deux sous-groupes de $(\mathbb{Z}, +)$ est un sous-groupe. »`, [
  [T`$2\mathbb{Z} \cup 3\mathbb{Z}$`, T`Cette réunion contient 2 et 3, mais pas leur somme 5.`, B],
  [T`$2\mathbb{Z} \cup 4\mathbb{Z}$`, T`Comme $4\mathbb{Z} \subset 2\mathbb{Z}$, la réunion est $2\mathbb{Z}$ : c'est un sous-groupe.`],
  [T`$3\mathbb{Z} \cup \{0\}$`, T`La réunion est $3\mathbb{Z}$ : c'est un sous-groupe.`],
  [T`$6\mathbb{Z} \cup 3\mathbb{Z}$`, T`Comme $6\mathbb{Z} \subset 3\mathbb{Z}$, la réunion est $3\mathbb{Z}$ : c'est un sous-groupe.`] ],
  T`La réunion de deux sous-groupes est un sous-groupe si et seulement si l'un est contenu dans l'autre. C'est l'intersection qui est toujours un sous-groupe.`),
contre('sans-racine', 'sup', A, 'ma-13', 'Sans racine donc irréductible', T`« Un polynôme réel de degré au moins 2 sans racine réelle est irréductible dans $\mathbb{R}[X]$. »`, [
  [T`$X^2 + 1$`, T`Ce polynôme n'a pas de racine réelle et il est irréductible.` + CV],
  [T`$X^4 + 1$`, T`Il n'a pas de racine réelle, mais $X^4 + 1 = (X^2 + \sqrt2\,X + 1)(X^2 - \sqrt2\,X + 1)$.`, B],
  [T`$X^2 - 1$`, T`Ce polynôme a deux racines réelles, 1 et $-1$.` + HF],
  [T`$X^2 + X + 1$`, T`Son discriminant est $-3$ : il n'a pas de racine réelle et il est irréductible.` + CV] ],
  T`« Sans racine » équivaut à « irréductible » seulement en degrés 2 et 3. Dans $\mathbb{R}[X]$, aucun polynôme de degré supérieur ou égal à 3 n'est irréductible.`),
contre('degre-somme', 'sup', A, 'ma-13', 'Degré d\'une somme', T`« Pour tous polynômes non nuls $P$ et $Q$, $\deg(P + Q) = \max(\deg P, \deg Q)$. »`, [
  [T`$P = X^2$ et $Q = X$`, T`$P + Q = X^2 + X$ est de degré 2 : l'égalité est vraie ici.`],
  [T`$P = X + 1$ et $Q = -X$`, T`$P + Q = 1$ est de degré 0, alors que les deux polynômes sont de degré 1.`, B],
  [T`$P = X^3$ et $Q = X^3$`, T`$P + Q = 2X^3$ est de degré 3 : l'égalité est vraie ici.`],
  [T`$P = 1$ et $Q = X$`, T`$P + Q = X + 1$ est de degré 1 : l'égalité est vraie ici.`] ],
  T`$\deg(P + Q) \leqslant \max(\deg P, \deg Q)$, avec égalité dès que les degrés sont différents ; à degrés égaux, les termes dominants peuvent se détruire.`),
contre('anneau-integre', 'sup', A, 'ma-11', 'Produit nul dans un anneau', T`« Dans un anneau commutatif, si $ab = 0$, alors $a = 0$ ou $b = 0$. »`, [
  [T`Dans $\mathbb{Z}/6\mathbb{Z}$ : $a = \overline2$ et $b = \overline3$`, T`$\overline2 \times \overline3 = \overline6 = \overline0$, alors qu'aucune des deux classes n'est nulle.`, B],
  [T`Dans $\mathbb{Z}/5\mathbb{Z}$ : $a = \overline2$ et $b = \overline3$`, T`$\overline2 \times \overline3 = \overline6 = \overline1$ : le produit n'est pas nul.` + HF],
  [T`Dans $\mathbb{Z}$ : $a = 0$ et $b = 7$`, T`Le produit est nul et $a = 0$.` + CV],
  [T`Dans $\mathbb{Z}/6\mathbb{Z}$ : $a = \overline5$ et $b = \overline5$`, T`$\overline5 \times \overline5 = \overline{25} = \overline1$ : le produit n'est pas nul.` + HF] ],
  T`Un anneau où la règle du produit nul est vraie est dit intègre. $\mathbb{Z}/n\mathbb{Z}$ est intègre si et seulement si $n$ est premier.`),
// ---------- Maths Sup : algèbre linéaire ----------
contre('deux-a-deux', 'sup', L, 'ma-14', 'Deux à deux non colinéaires donc libre', T`« Une famille de vecteurs deux à deux non colinéaires est libre. »`, [
  [T`$\bigl((1, 0), (0, 1), (1, 1)\bigr)$ dans $\mathbb{R}^2$`, T`Aucun de ces vecteurs n'est multiple d'un autre, mais le troisième est la somme des deux premiers : la famille est liée.`, B],
  [T`$\bigl((1, 0), (0, 1)\bigr)$ dans $\mathbb{R}^2$`, T`Ces deux vecteurs ne sont pas colinéaires et la famille est libre.` + CV],
  [T`$\bigl((1, 0), (2, 0), (0, 1)\bigr)$ dans $\mathbb{R}^2$`, T`Les deux premiers vecteurs sont colinéaires.` + HF],
  [T`$\bigl((1, 0, 0), (0, 1, 0), (0, 0, 1)\bigr)$ dans $\mathbb{R}^3$`, T`Ces vecteurs sont deux à deux non colinéaires et la famille est libre.` + CV] ],
  T`« Deux à deux non colinéaires » équivaut à « libre » seulement pour deux vecteurs. Au-delà, il faut qu'aucun vecteur ne soit combinaison linéaire de tous les autres.`),
contre('injectif-surjectif', 'sup', L, 'ma-15', 'Injectif donc surjectif', T`« Tout endomorphisme injectif est surjectif. »`, [
  [T`$P \mapsto XP$ sur $\mathbb{R}[X]$`, T`Cet endomorphisme est injectif, mais le polynôme constant 1 n'a pas d'antécédent.`, B],
  [T`$P \mapsto P'$ sur $\mathbb{R}[X]$`, T`La dérivation n'est pas injective : elle annule les constantes.` + HF],
  [T`$(x, y) \mapsto (y, x)$ sur $\mathbb{R}^2$`, T`Cet endomorphisme est injectif et surjectif.` + CV],
  [T`$(x, y) \mapsto (x, 0)$ sur $\mathbb{R}^2$`, T`Cet endomorphisme n'est pas injectif : il annule $(0, 1)$.` + HF] ],
  T`L'énoncé est vrai en dimension finie, par le théorème du rang. En dimension infinie, il est faux.`),
contre('det-somme', 'sup', L, 'ma-17', 'Déterminant d\'une somme', T`« Pour toutes matrices $A$ et $B$ de $\mathcal{M}_2(\mathbb{R})$, $\det(A + B) = \det A + \det B$. »`, [
  [T`$A = I_2$ et $B = I_2$`, T`$\det(2I_2) = 4$, alors que $\det I_2 + \det I_2 = 2$.`, B],
  [T`$A = 0$ et $B = \begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$`, T`Les deux membres valent $\det B = -2$ : l'égalité est vraie ici.`],
  [T`$A = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ et $B = \begin{pmatrix} 2 & 0 \\ 0 & 0 \end{pmatrix}$`, T`Les trois déterminants sont nuls : l'égalité est vraie ici.`],
  [T`$A = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ et $B = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$`, T`$A + B = \begin{pmatrix} 1 & 1 \\ 0 & 0 \end{pmatrix}$ : les trois déterminants sont nuls, l'égalité est vraie ici.`] ],
  T`Le déterminant est multiplicatif, $\det(AB) = \det A \det B$, pas additif.`),
contre('dimensions', 'sup', L, 'ma-15', 'Dimensions complémentaires donc supplémentaires', T`Dans $\mathbb{R}^2$ : « Si $\dim F + \dim G = 2$, alors $F$ et $G$ sont supplémentaires. »`, [
  [T`$F = G$, tous deux égaux à l'axe des abscisses`, T`La somme des dimensions vaut 2, mais $F + G$ n'est qu'une droite.`, B],
  [T`$F$ l'axe des abscisses, $G$ l'axe des ordonnées`, T`La somme des dimensions vaut 2 et les deux axes sont supplémentaires.` + CV],
  [T`$F = \{0\}$ et $G = \mathbb{R}^2$`, T`La somme des dimensions vaut 2 et ces sous-espaces sont supplémentaires.` + CV],
  [T`$F$ l'axe des abscisses et $G = \mathbb{R}^2$`, T`La somme des dimensions vaut 3.` + HF] ],
  T`Il faut en plus $F \cap G = \{0\}$. La condition sur les dimensions est nécessaire, elle n'est pas suffisante.`),
// ---------- Maths Sup : analyse ----------
contre('ecart', 'sup', N, 'ma-07', 'Écart qui tend vers 0', T`« Si $u_{n+1} - u_n$ tend vers 0, alors la suite $(u_n)$ converge. »`, [
  [T`$u_n = \sqrt n$`, T`L'écart $\dfrac{1}{\sqrt{n+1} + \sqrt n}$ tend vers 0, et la suite tend vers $+\infty$.`, B],
  [T`$u_n = \dfrac1n$`, T`L'écart tend vers 0 et la suite converge.` + CV],
  [T`$u_n = n$`, T`L'écart vaut 1 et ne tend pas vers 0.` + HF],
  [T`$u_n = (-1)^n$`, T`L'écart vaut 2 ou $-2$ et ne tend pas vers 0.` + HF] ],
  T`La condition est nécessaire à la convergence, pas suffisante : des pas de plus en plus petits peuvent mener aussi loin que l'on veut.`),
contre('continue-bornee', 'sup', N, 'ma-08', 'Continue sur un intervalle borné', T`« Toute fonction continue sur un intervalle borné est bornée. »`, [
  [T`$x \mapsto \dfrac1x$ sur $]0, 1]$`, T`Cette fonction est continue sur un intervalle borné, et elle tend vers $+\infty$ en 0.`, B],
  [T`$x \mapsto x^2$ sur $[0, 1]$`, T`Cette fonction est continue et bornée.` + CV],
  [T`$x \mapsto \sin x$ sur $]0, 1[$`, T`Cette fonction est continue et bornée.` + CV],
  [T`$x \mapsto x$ sur $]0, 1[$`, T`Cette fonction est continue et bornée, même si elle n'atteint pas ses bornes.` + CV] ],
  T`Le théorème demande un segment, c'est-à-dire un intervalle fermé et borné.`),
contre('strictement-croissante', 'sup', N, 'ma-09', 'Strictement croissante donc dérivée strictement positive', T`« Si $f$ est dérivable et strictement croissante sur $\mathbb{R}$, alors $f'(x) > 0$ pour tout réel $x$. »`, [
  [T`$f(x) = x^3$`, T`Cette fonction est strictement croissante, et $f'(0) = 0$.`, B],
  [T`$f(x) = e^x$`, T`Cette fonction est strictement croissante et sa dérivée est strictement positive.` + CV],
  [T`$f(x) = x$`, T`Cette fonction est strictement croissante et sa dérivée vaut 1.` + CV],
  [T`$f(x) = x^2$`, T`Cette fonction n'est pas croissante sur $\mathbb{R}$.` + HF] ],
  T`$f' > 0$ entraîne la stricte croissance, pas l'inverse : la dérivée peut s'annuler en des points isolés.`),
contre('terme-general', 'sup', N, 'ma-20', 'Terme général qui tend vers 0', T`« Si $u_n$ tend vers 0, alors la série $\sum u_n$ converge. »`, [
  [T`$u_n = \dfrac1n$`, T`Le terme général tend vers 0 et la série harmonique diverge.`, B],
  [T`$u_n = \dfrac{1}{n^2}$`, T`Le terme général tend vers 0 et la série converge.` + CV],
  [T`$u_n = \dfrac{1}{2^n}$`, T`Le terme général tend vers 0 et la série converge.` + CV],
  [T`$u_n = 1$`, T`Le terme général ne tend pas vers 0.` + HF] ],
  T`C'est la réciproque qui est vraie : si la série converge, son terme général tend vers 0.`),
contre('absolue', 'sup', N, 'ma-20', 'Convergente donc absolument convergente', T`« Si la série $\sum u_n$ converge, alors la série $\sum |u_n|$ converge. »`, [
  [T`$u_n = \dfrac{(-1)^n}{n}$`, T`Cette série converge, et la série de ses valeurs absolues est la série harmonique, qui diverge.`, B],
  [T`$u_n = \dfrac{(-1)^n}{n^2}$`, T`Cette série converge, et la série des valeurs absolues aussi.` + CV],
  [T`$u_n = \dfrac{1}{n^2}$`, T`Cette série converge, et elle est égale à la série de ses valeurs absolues.` + CV],
  [T`$u_n = (-1)^n$`, T`Cette série diverge : son terme général ne tend pas vers 0.` + HF] ],
  T`La convergence absolue entraîne la convergence ; la réciproque est fausse. Une série convergente sans l'être absolument est dite semi-convergente.`),
contre('equivalents-exp', 'sup', N, 'ma-10', 'Composer un équivalent par l\'exponentielle', T`« Si $u_n \sim v_n$, alors $e^{u_n} \sim e^{v_n}$. »`, [
  [T`$u_n = n + 1$ et $v_n = n$`, T`Les suites sont équivalentes, mais $\dfrac{e^{n+1}}{e^n} = e$ ne tend pas vers 1.`, B],
  [T`$u_n = \dfrac1n$ et $v_n = \dfrac1n$`, T`Les suites sont égales, et leurs exponentielles aussi.` + CV],
  [T`$u_n = n + \dfrac1n$ et $v_n = n$`, T`Les suites sont équivalentes, et $\dfrac{e^{u_n}}{e^{v_n}} = e^{1/n}$ tend vers 1.` + CV],
  [T`$u_n = n^2$ et $v_n = n$`, T`Ces suites ne sont pas équivalentes : leur quotient tend vers $+\infty$.` + HF] ],
  T`$e^{u_n} \sim e^{v_n}$ équivaut à $u_n - v_n \to 0$, ce qui est plus fort que $u_n \sim v_n$ quand les suites tendent vers l'infini.`),
contre('derivee-nulle-constante', 'sup', N, 'ma-09', 'Dérivée nulle donc constante', T`« Une fonction dérivable dont la dérivée est nulle sur son ensemble de définition est constante. »`, [
  [T`$x \mapsto \arctan x + \arctan\dfrac1x$ sur $\mathbb{R}^*$`, T`Sa dérivée est nulle sur $\mathbb{R}^*$, mais elle vaut $\dfrac{\pi}{2}$ sur $]0, +\infty[$ et $-\dfrac{\pi}{2}$ sur $]-\infty, 0[$.`, B],
  [T`$x \mapsto 3$ sur $\mathbb{R}$`, T`Sa dérivée est nulle et elle est constante.` + CV],
  [T`$x \mapsto x$ sur $\mathbb{R}$`, T`Sa dérivée vaut 1.` + HF],
  [T`$x \mapsto \cos^2 x + \sin^2 x$ sur $\mathbb{R}$`, T`Sa dérivée est nulle et elle est constante, égale à 1.` + CV] ],
  T`Le théorème vaut sur un intervalle. Sur une réunion d'intervalles, il y a une constante par intervalle.`),
// ---------- Maths Sup : probabilités ----------
contre('deux-a-deux-independants', 'sup', Pr, 'ma-21', 'Deux à deux donc mutuellement indépendants', T`On lance des pièces équilibrées. « Trois événements deux à deux indépendants sont mutuellement indépendants. »`, [
  [T`Deux lancers ; $A$ : « pile au premier », $B$ : « pile au second », $C$ : « les deux lancers donnent le même résultat »`, T`Chaque paire est indépendante, mais $P(A \cap B \cap C) = \dfrac14$, et non $\dfrac18$.`, B],
  [T`Trois lancers ; $A$, $B$, $C$ : « pile » au premier, au deuxième, au troisième`, T`Ces événements sont deux à deux et mutuellement indépendants.` + CV],
  [T`Deux lancers ; $A$ : « pile au premier », $B$ : « pile au second », $C = A$`, T`$A$ et $C$ ne sont pas indépendants : $P(A \cap C) = \dfrac12 \neq \dfrac14$.` + HF],
  [T`Deux lancers ; $A$ : « pile au premier », $B$ : « pile au second », $C$ : l'événement impossible`, T`Toutes les formules du produit se réduisent à $0 = 0$ ou à l'indépendance de $A$ et $B$ : les événements sont mutuellement indépendants.` + CV] ],
  T`L'indépendance mutuelle de trois événements demande quatre égalités : une par paire, et une pour le triplet.`),
contre('non-correlees', 'sup', Pr, 'ma-21', 'E(XY) = E(X)E(Y) donc indépendantes', T`« Si $E(XY) = E(X)\,E(Y)$, alors $X$ et $Y$ sont indépendantes. »`, [
  [T`$X$ uniforme sur $\{-1, 0, 1\}$ et $Y = X^2$`, T`$E(XY) = E(X^3) = 0 = E(X)\,E(Y)$, alors que $Y$ est déterminée par $X$ : $P(X = 0, Y = 1) = 0$.`, B],
  [T`$X$ et $Y$ les résultats de deux dés indépendants`, T`L'égalité est vraie et les variables sont indépendantes.` + CV],
  [T`$X$ le résultat d'un dé et $Y = X$`, T`$E(X^2) = \dfrac{91}{6}$, alors que $E(X)^2 = \dfrac{49}{4}$ : l'égalité est fausse.` + HF],
  [T`$X$ constante égale à 2 et $Y$ le résultat d'un dé`, T`L'égalité est vraie, et une variable constante est indépendante de toute autre.` + CV] ],
  T`L'indépendance entraîne $E(XY) = E(X)\,E(Y)$ ; la réciproque est fausse. Des variables qui vérifient cette égalité sont dites non corrélées.`),
];
