// Démonstrations à remettre en ordre : Seconde (MEMO_atlas_activites.md §162).
import { T, demo } from './raisonner-outils.js';
export default [
demo('sec-tiers', 'seconde', '', 's-01', 'Un tiers n\'est pas décimal', T`Le nombre $\dfrac13$ n'est pas un nombre décimal.`, [
  [T`Raisonnons par l'absurde : supposons que $\dfrac13$ soit un nombre décimal.`, '', T`l'hypothèse que $\frac13$ est décimal`],
  [T`Il existe alors un entier $a$ et un entier naturel $n$ tels que $\dfrac13 = \dfrac{a}{10^n}$.`, 'a', T`l'écriture $\frac13 = \frac{a}{10^n}$`],
  [T`En multipliant les deux membres par $3 \times 10^n$, on obtient $10^n = 3a$ : le nombre $10^n$ est un multiple de 3.`, 'b', T`le fait que $10^n$ est un multiple de 3`],
  [T`Or $10^n$ s'écrit avec un 1 suivi de $n$ zéros : la somme de ses chiffres vaut 1, qui n'est pas un multiple de 3, donc $10^n$ n'est pas un multiple de 3.`, 'c', T`le fait que $10^n$ n'est pas un multiple de 3`],
  [T`C'est une contradiction : $\dfrac13$ n'est pas un nombre décimal.`, 'd'] ], [
  [T`Il existe alors un entier $a$ tel que $\dfrac13 = \dfrac{a}{10}$.`, T`Un nombre décimal s'écrit $\frac{a}{10^n}$ pour un certain entier naturel $n$, qui n'est pas forcément 1 : $0{,}25 = \frac{25}{100}$ ne s'écrit pas $\frac{a}{10}$ avec $a$ entier. Avec le seul dénominateur 10, on n'écarterait que les nombres à un chiffre après la virgule.`],
  [T`Or $10^n$ est un nombre pair, donc $10^n$ n'est pas un multiple de 3.`, T`Un nombre pair peut très bien être un multiple de 3, comme 6 ou 12 : la parité ne dit rien de la divisibilité par 3. C'est la somme des chiffres qui permet de conclure.`] ]),
demo('sec-carre-impair', 'seconde', '', 's-01', 'Le carré d\'un entier impair', T`Le carré d'un entier impair est un entier impair.`, [
  [T`Soit $n$ un entier impair : il existe un entier $k$ tel que $n = 2k + 1$.`, '', T`l'écriture $n = 2k + 1$`],
  [T`On développe : $n^2 = (2k + 1)^2 = 4k^2 + 4k + 1$.`, 'a', T`le développement de $n^2$`],
  [T`En mettant 2 en facteur dans les deux premiers termes : $n^2 = 2(2k^2 + 2k) + 1$.`, 'b', T`l'écriture $n^2 = 2(2k^2 + 2k) + 1$`],
  [T`Le nombre $k' = 2k^2 + 2k$ est un entier, puisque $k$ en est un.`, 'c', T`l'entier $k' = 2k^2 + 2k$`],
  [T`Ainsi $n^2 = 2k' + 1$ avec $k'$ entier : $n^2$ est impair.`, 'd'] ], [
  [T`On développe : $n^2 = (2k + 1)^2 = 4k^2 + 1$.`, T`Le double produit a été oublié : $(2k + 1)^2 = 4k^2 + 2 \times 2k \times 1 + 1 = 4k^2 + 4k + 1$.`],
  [T`Prenons $n = 3$, qui est impair : $n^2 = 9$ est impair, ce qui démontre la propriété.`, T`Un exemple ne démontre pas une propriété annoncée pour <em>tous</em> les entiers impairs : il faut raisonner sur un entier impair quelconque, écrit $2k + 1$.`] ]),
demo('sec-somme-multiples', 'seconde', '', 's-01', 'Somme de deux multiples', T`Soit $a$ un entier. La somme de deux multiples de $a$ est un multiple de $a$.`, [
  [T`Soit $m$ et $n$ deux multiples de $a$.`, '', T`les deux multiples $m$ et $n$`],
  [T`Il existe un entier $k$ tel que $m = ka$, et un entier $k'$ tel que $n = k'a$.`, 'a', T`les entiers $k$ et $k'$`],
  [T`Alors $m + n = ka + k'a = (k + k')a$.`, 'b', T`l'égalité $m + n = (k + k')a$`],
  [T`Or $k + k'$ est un entier, comme somme de deux entiers.`, 'c', T`le fait que $k + k'$ est un entier`],
  [T`Donc $m + n$ est le produit de $a$ par un entier : c'est un multiple de $a$.`, 'd'] ], [
  [T`Il existe un entier $k$ tel que $m = ka$ et $n = ka$.`, T`Avec le même entier $k$ pour les deux, on aurait $m = n$ : on ne traiterait que la somme d'un multiple avec lui-même. Chaque multiple a son propre quotient, d'où les deux lettres $k$ et $k'$.`],
  [T`Alors $m + n = ka + k'a = (k + k')a^2$.`, T`En mettant $a$ en facteur, il n'apparaît qu'une fois : $ka + k'a = (k + k')a$. Avec $a = 3$, $k = 1$, $k' = 2$, on a $3 + 6 = 9$, et non $(1 + 2) \times 9 = 27$.`] ]),
demo('sec-racine-produit', 'seconde', '', 's-01', 'Racine carrée d\'un produit', T`Pour tous réels positifs $a$ et $b$ : $\sqrt{ab} = \sqrt a \times \sqrt b$.`, [
  [T`Comme $a$ et $b$ sont positifs, leur produit $ab$ est positif : $\sqrt{ab}$ est bien défini.`, '', T`l'existence de $\sqrt{ab}$`],
  [T`Le nombre $\sqrt a \times \sqrt b$ est positif, comme produit de deux nombres positifs.`, 'a', T`le fait que $\sqrt a \times \sqrt b$ est positif`],
  [T`Son carré vaut $\left(\sqrt a \times \sqrt b\right)^2 = \left(\sqrt a\right)^2 \times \left(\sqrt b\right)^2 = ab$.`, 'b', T`le carré de $\sqrt a \times \sqrt b$`],
  [T`Or $\sqrt{ab}$ est, par définition, le seul nombre positif dont le carré vaut $ab$.`, 'c', T`la définition de $\sqrt{ab}$`],
  [T`Donc $\sqrt a \times \sqrt b = \sqrt{ab}$.`, 'd'] ], [
  [T`Deux nombres qui ont le même carré sont égaux, donc $\sqrt a \times \sqrt b = \sqrt{ab}$.`, T`Les nombres 3 et $-3$ ont le même carré sans être égaux. Deux nombres de même carré sont égaux ou opposés : pour conclure à l'égalité, il faut savoir de plus qu'ils sont tous deux positifs.`],
  [T`Son carré vaut $\left(\sqrt a \times \sqrt b\right)^2 = \left(\sqrt a\right)^2 + \left(\sqrt b\right)^2 = a + b$.`, T`Le carré d'un produit est le produit des carrés, et non leur somme : $(xy)^2 = x^2y^2$. Avec $a = 4$ et $b = 9$, $\left(\sqrt4 \times \sqrt9\right)^2 = 6^2 = 36$, et non 13.`] ]),
demo('sec-racine-somme', 'seconde', '', 's-01', 'Racine carrée d\'une somme', T`Pour tous réels strictement positifs $a$ et $b$ : $\sqrt{a + b} < \sqrt a + \sqrt b$.`, [
  [T`Les nombres $\sqrt{a + b}$ et $\sqrt a + \sqrt b$ sont positifs : pour les comparer, on compare leurs carrés.`, '', T`l'idée de comparer les carrés`],
  [T`D'une part, $\left(\sqrt{a + b}\right)^2 = a + b$.`, 'a', T`le carré de $\sqrt{a + b}$`],
  [T`D'autre part, $\left(\sqrt a + \sqrt b\right)^2 = a + 2\sqrt a\sqrt b + b$.`, 'b', T`le carré de $\sqrt a + \sqrt b$`],
  [T`Comme $a > 0$ et $b > 0$, on a $2\sqrt a\sqrt b > 0$, donc $a + b < a + 2\sqrt a\sqrt b + b$.`, 'c', T`l'inégalité entre les deux carrés`],
  [T`Deux nombres positifs sont rangés dans le même ordre que leurs carrés : $\sqrt{a + b} < \sqrt a + \sqrt b$.`, 'd'] ], [
  [T`D'autre part, $\left(\sqrt a + \sqrt b\right)^2 = a + b$.`, T`Le double produit a été oublié : $(x + y)^2 = x^2 + 2xy + y^2$, donc $\left(\sqrt a + \sqrt b\right)^2 = a + 2\sqrt a\sqrt b + b$. C'est justement ce terme qui crée l'inégalité.`],
  [T`Deux nombres réels quelconques sont rangés dans le même ordre que leurs carrés, d'où le résultat.`, T`C'est faux pour des nombres négatifs : $-3 < 2$, mais $(-3)^2 = 9 > 4 = 2^2$. La règle ne vaut que pour des nombres positifs, sur lesquels la fonction carré est croissante.`] ]),
demo('sec-carre-croissante', 'seconde', '', 's-07', 'La fonction carré est croissante sur [0 ; +∞[', T`La fonction carré est strictement croissante sur $[0\,;\,+\infty[$.`, [
  [T`Soit $a$ et $b$ deux réels tels que $0 \leqslant a < b$.`, '', T`les réels $a$ et $b$`],
  [T`On étudie le signe de la différence $b^2 - a^2 = (b - a)(b + a)$.`, 'a', T`la factorisation de $b^2 - a^2$`],
  [T`Le facteur $b - a$ est strictement positif, puisque $a < b$.`, 'b', T`le signe de $b - a$`],
  [T`Le facteur $b + a$ est strictement positif, puisque $a \geqslant 0$ et $b > 0$.`, 'b', T`le signe de $b + a$`],
  [T`Le produit de deux nombres strictement positifs est strictement positif : $b^2 - a^2 > 0$, c'est-à-dire $a^2 < b^2$.`, 'cd', T`l'inégalité $a^2 < b^2$`],
  [T`La fonction carré conserve donc l'ordre des nombres positifs : elle est strictement croissante sur $[0\,;\,+\infty[$.`, 'e'] ], [
  [T`Le facteur $b - a$ est strictement négatif, puisque $a < b$.`, T`Si $a < b$, alors $b - a > 0$ : on retranche le plus petit au plus grand. C'est $a - b$ qui est strictement négatif.`],
  [T`On étudie le signe de la différence $b^2 - a^2 = (b - a)^2$.`, T`$(b - a)^2 = b^2 - 2ab + a^2$, ce qui n'est pas $b^2 - a^2$. L'identité à employer est $b^2 - a^2 = (b - a)(b + a)$.`] ]),
demo('sec-inverse-decroissante', 'seconde', '', 's-07', 'La fonction inverse est décroissante sur ]0 ; +∞[', T`La fonction inverse est strictement décroissante sur $]0\,;\,+\infty[$.`, [
  [T`Soit $a$ et $b$ deux réels tels que $0 < a < b$.`, '', T`les réels $a$ et $b$`],
  [T`On réduit au même dénominateur : $\dfrac1a - \dfrac1b = \dfrac{b}{ab} - \dfrac{a}{ab} = \dfrac{b - a}{ab}$.`, 'a', T`l'égalité $\frac1a - \frac1b = \frac{b - a}{ab}$`],
  [T`Le numérateur $b - a$ est strictement positif, puisque $a < b$.`, 'b', T`le signe du numérateur`],
  [T`Le dénominateur $ab$ est strictement positif, comme produit de deux nombres strictement positifs.`, 'b', T`le signe du dénominateur`],
  [T`Le quotient est donc strictement positif : $\dfrac1a - \dfrac1b > 0$, c'est-à-dire $\dfrac1a > \dfrac1b$.`, 'cd', T`l'inégalité $\frac1a > \frac1b$`],
  [T`La fonction inverse renverse donc l'ordre des nombres strictement positifs : elle est strictement décroissante sur $]0\,;\,+\infty[$.`, 'e'] ], [
  [T`On réduit au même dénominateur : $\dfrac1a - \dfrac1b = \dfrac{a - b}{ab}$.`, T`Pour passer au dénominateur $ab$, on multiplie le numérateur de $\frac1a$ par $b$ et celui de $\frac1b$ par $a$ : $\frac1a - \frac1b = \frac{b}{ab} - \frac{a}{ab} = \frac{b - a}{ab}$. Avec $a = 1$ et $b = 2$ : $1 - \frac12 = \frac12$, et non $-\frac12$.`],
  [T`Le même calcul montre que, pour tous réels non nuls $a < b$, on a $\dfrac1a > \dfrac1b$.`, T`Si $a < 0 < b$, le dénominateur $ab$ est négatif et le quotient change de signe : $-1 < 1$, mais $\frac{1}{-1} < \frac11$. La fonction inverse est décroissante sur $]-\infty\,;\,0[$ et sur $]0\,;\,+\infty[$, pas sur leur réunion.`] ]),
demo('sec-affine-croissante', 'seconde', '', 's-09', 'Fonction affine de coefficient positif', T`Soit $m$ et $p$ deux réels, avec $m > 0$. La fonction affine $f : x \mapsto mx + p$ est strictement croissante sur $\mathbb{R}$.`, [
  [T`Soit $a$ et $b$ deux réels tels que $a < b$.`, '', T`les réels $a$ et $b$`],
  [T`On calcule $f(b) - f(a) = (mb + p) - (ma + p) = m(b - a)$.`, 'a', T`l'égalité $f(b) - f(a) = m(b - a)$`],
  [T`Or $b - a > 0$, puisque $a < b$, et $m > 0$ par hypothèse.`, 'b', T`les signes de $b - a$ et de $m$`],
  [T`Le produit $m(b - a)$ est donc strictement positif : $f(b) - f(a) > 0$, c'est-à-dire $f(a) < f(b)$.`, 'c', T`l'inégalité $f(a) < f(b)$`],
  [T`La fonction $f$ conserve l'ordre : elle est strictement croissante sur $\mathbb{R}$.`, 'd'] ], [
  [T`On calcule $f(b) - f(a) = (mb + p) - (ma + p) = m(b - a) + 2p$.`, T`Les deux termes $p$ se retranchent : $(mb + p) - (ma + p) = mb - ma + p - p = m(b - a)$. L'ordonnée à l'origine ne joue aucun rôle dans le sens de variation.`],
  [T`Comme $m > 0$, les nombres $f(a) = ma + p$ et $f(b) = mb + p$ sont tous deux positifs.`, T`Le signe de $m$ ne donne pas le signe des images : pour $f(x) = 2x - 10$, on a $m = 2 > 0$ et $f(1) = -8$. Ce que $m > 0$ donne, c'est le signe de la <em>différence</em> $f(b) - f(a)$.`] ]),
demo('sec-colinearite', 'seconde', '', 's-10', 'Colinéarité et déterminant', T`Soit $\vec u(x\,;\,y)$ et $\vec v(x'\,;\,y')$ deux vecteurs, avec $x \neq 0$. Il existe un réel $k$ tel que $\vec v = k\vec u$ si et seulement si $xy' - yx' = 0$.`, [
  [T`Sens direct : supposons qu'il existe un réel $k$ tel que $\vec v = k\vec u$, c'est-à-dire $x' = kx$ et $y' = ky$.`, '', T`l'hypothèse $\vec v = k\vec u$ du sens direct`],
  [T`Alors $xy' - yx' = x \times ky - y \times kx = kxy - kxy = 0$.`, 'a', T`la conclusion du sens direct`],
  [T`Réciproquement, supposons que $xy' - yx' = 0$, c'est-à-dire $xy' = yx'$.`, 'b', T`l'hypothèse $xy' = yx'$ de la réciproque`],
  [T`Comme $x \neq 0$, on peut poser $k = \dfrac{x'}{x}$ : on a alors $x' = kx$.`, 'c', T`le réel $k = \frac{x'}{x}$`],
  [T`L'hypothèse s'écrit alors $xy' = y \times kx$ ; en divisant les deux membres par $x$, non nul, on obtient $y' = ky$.`, 'd', T`l'égalité $y' = ky$`],
  [T`On a donc $x' = kx$ et $y' = ky$, c'est-à-dire $\vec v = k\vec u$.`, 'e'] ], [
  [T`Alors $xy' - yx' = x \times ky - y \times kx = 2kxy$.`, T`Les deux produits sont égaux et se retranchent : $kxy - kxy = 0$. Ils ne s'ajoutent pas.`],
  [T`De $xy' = yx'$, on tire, en divisant par $y$ : $x' = \dfrac{xy'}{y}$, et l'on pose $k = \dfrac{y'}{y}$.`, T`Rien ne dit que $y$ est non nul : seul $x \neq 0$ est supposé. Pour $\vec u(1\,;\,0)$, cette division est impossible. On divise donc par $x$.`] ]),
demo('sec-projete', 'seconde', '', '', 'Le projeté orthogonal est le point le plus proche', T`Soit $d$ une droite, $M$ un point qui n'appartient pas à $d$ et $H$ le projeté orthogonal de $M$ sur $d$. Pour tout point $A$ de $d$ distinct de $H$ : $MH < MA$.`, [
  [T`Soit $A$ un point de $d$, distinct de $H$.`, '', T`le point $A$`],
  [T`Par définition du projeté orthogonal, la droite $(MH)$ est perpendiculaire à $d$ : le triangle $MHA$ est rectangle en $H$.`, 'a', T`le triangle $MHA$ rectangle en $H$`],
  [T`D'après le théorème de Pythagore, $MA^2 = MH^2 + HA^2$.`, 'b', T`l'égalité de Pythagore`],
  [T`Comme $A \neq H$, on a $HA^2 > 0$, donc $MA^2 > MH^2$.`, 'c', T`l'inégalité $MA^2 > MH^2$`],
  [T`Deux longueurs sont rangées dans le même ordre que leurs carrés : $MA > MH$.`, 'd'] ], [
  [T`Par définition du projeté orthogonal, le triangle $MHA$ est rectangle en $M$.`, T`L'angle droit est au point $H$ : c'est la droite $(MH)$ qui est perpendiculaire à $d$, donc à $(HA)$. L'hypoténuse est alors $[MA]$, ce qui est le cœur de la démonstration.`],
  [T`D'après le théorème de Pythagore, $MH^2 = MA^2 + HA^2$.`, T`Le carré de l'hypoténuse est la somme des carrés des deux autres côtés, et l'hypoténuse est le côté opposé à l'angle droit, ici $[MA]$ : $MA^2 = MH^2 + HA^2$.`] ]),
demo('sec-cos-sin', 'seconde', '', '', 'cos² + sin² = 1 dans un triangle rectangle', T`Soit $ABC$ un triangle rectangle en $A$ et $\alpha$ la mesure de l'angle $\widehat{ABC}$. Alors $\cos^2\alpha + \sin^2\alpha = 1$.`, [
  [T`Dans le triangle $ABC$ rectangle en $A$, l'hypoténuse est $[BC]$ : $\cos\alpha = \dfrac{AB}{BC}$ et $\sin\alpha = \dfrac{AC}{BC}$.`, '', T`les expressions de $\cos\alpha$ et de $\sin\alpha$`],
  [T`En élevant au carré et en ajoutant : $\cos^2\alpha + \sin^2\alpha = \dfrac{AB^2}{BC^2} + \dfrac{AC^2}{BC^2} = \dfrac{AB^2 + AC^2}{BC^2}$.`, 'a', T`l'égalité $\cos^2\alpha + \sin^2\alpha = \frac{AB^2 + AC^2}{BC^2}$`],
  [T`Or, d'après le théorème de Pythagore dans ce triangle, $AB^2 + AC^2 = BC^2$.`, 'b', T`l'égalité de Pythagore`],
  [T`Donc $\cos^2\alpha + \sin^2\alpha = \dfrac{BC^2}{BC^2} = 1$.`, 'c'] ], [
  [T`En élevant au carré et en ajoutant : $\cos^2\alpha + \sin^2\alpha = \dfrac{(AB + AC)^2}{BC^2}$.`, T`La somme des carrés n'est pas le carré de la somme : $AB^2 + AC^2$ et $(AB + AC)^2$ diffèrent du double produit $2 \times AB \times AC$.`],
  [T`Or, d'après le théorème de Pythagore dans ce triangle, $AB^2 + BC^2 = AC^2$.`, T`Le triangle est rectangle en $A$ : son hypoténuse est le côté opposé, $[BC]$, et c'est son carré qui est la somme des deux autres, $AB^2 + AC^2 = BC^2$.`] ]),
demo('sec-positions', 'seconde', '', 's-07', 'x³ < x² < x entre 0 et 1', T`Pour tout réel $x$ de l'intervalle $]0\,;\,1[$ : $x^3 < x^2 < x$.`, [
  [T`Soit $x$ un réel tel que $0 < x < 1$.`, '', T`le réel $x$`],
  [T`On étudie le signe de $x^2 - x = x(x - 1)$.`, 'a', T`la factorisation de $x^2 - x$`],
  [T`Comme $x > 0$ et $x - 1 < 0$, le produit $x(x - 1)$ est strictement négatif : $x^2 < x$.`, 'b', T`l'inégalité $x^2 < x$`],
  [T`En multipliant les deux membres de $x^2 < x$ par le nombre strictement positif $x$, le sens est conservé : $x^3 < x^2$.`, 'c', T`l'inégalité $x^3 < x^2$`],
  [T`On a donc bien $x^3 < x^2 < x$.`, 'd'] ], [
  [T`En multipliant les deux membres de $x^2 < x$ par $x$, l'inégalité change de sens : $x^3 > x^2$.`, T`Une inégalité change de sens quand on multiplie par un nombre strictement <em>négatif</em>. Ici $x > 0$ : le sens est conservé. Avec $x = \frac12$ : $\frac18 < \frac14$.`],
  [T`On étudie le signe de $x^2 - x = x(x + 1)$.`, T`$x(x + 1) = x^2 + x$. En mettant $x$ en facteur dans $x^2 - x$, on obtient $x(x - 1)$.`] ]),
demo('sec-proba-union', 'seconde', '', 's-03', 'Probabilité d\'une réunion', T`Soit $A$ et $B$ deux événements d'un univers fini muni d'une loi de probabilité. Alors $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.`, [
  [T`Par définition, $P(A)$ est la somme des probabilités des issues de $A$, et $P(B)$ la somme des probabilités des issues de $B$.`, '', T`la définition de $P(A)$ et de $P(B)$`],
  [T`Dans la somme $P(A) + P(B)$, la probabilité de chaque issue de $A \cup B$ figure donc au moins une fois, et aucune autre issue n'intervient.`, 'a', T`le contenu de la somme $P(A) + P(B)$`],
  [T`Plus précisément, les issues qui sont à la fois dans $A$ et dans $B$, c'est-à-dire celles de $A \cap B$, y sont comptées deux fois ; les autres issues de $A \cup B$ y sont comptées une seule fois.`, 'b', T`le décompte des issues de $A \cap B$`],
  [T`Par conséquent, $P(A) + P(B) = P(A \cup B) + P(A \cap B)$.`, 'c', T`l'égalité $P(A) + P(B) = P(A \cup B) + P(A \cap B)$`],
  [T`En retranchant $P(A \cap B)$ aux deux membres : $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.`, 'd'] ], [
  [T`Plus précisément, les issues de $A \cap B$ ne sont comptées ni dans $P(A)$ ni dans $P(B)$.`, T`Une issue de $A \cap B$ appartient à $A$ <em>et</em> à $B$ : sa probabilité figure dans $P(A)$ et dans $P(B)$, donc deux fois dans la somme.`],
  [T`Par conséquent, $P(A) + P(B) = P(A \cup B)$.`, T`Cette égalité n'est vraie que si aucune issue n'est comptée deux fois, c'est-à-dire si $A$ et $B$ sont incompatibles. Pour un dé équilibré, avec $A$ « pair » et $B$ « multiple de 3 » : $\frac12 + \frac13 = \frac56$, alors que $P(A \cup B) = \frac46$.`] ]),
demo('sec-moyenne-affine', 'seconde', '', 's-11', 'Moyenne et transformation affine', T`Soit $x_1, x_2, \dots, x_n$ une série de moyenne $\bar x$, et $a$, $b$ deux réels. La série $ax_1 + b,\ ax_2 + b,\ \dots,\ ax_n + b$ a pour moyenne $a\bar x + b$.`, [
  [T`Notons $m$ la moyenne de la nouvelle série : $m = \dfrac{(ax_1 + b) + (ax_2 + b) + \dots + (ax_n + b)}{n}$.`, '', T`la définition de la nouvelle moyenne $m$`],
  [T`Au numérateur, on regroupe les termes : le nombre $b$ y figure $n$ fois, donc le numérateur vaut $a(x_1 + x_2 + \dots + x_n) + nb$.`, 'a', T`le regroupement des termes du numérateur`],
  [T`En séparant la fraction : $m = a \times \dfrac{x_1 + x_2 + \dots + x_n}{n} + \dfrac{nb}{n}$.`, 'b', T`la séparation de la fraction en deux`],
  [T`Or $\dfrac{x_1 + x_2 + \dots + x_n}{n} = \bar x$ par définition de la moyenne, et $\dfrac{nb}{n} = b$.`, 'c', T`la reconnaissance de $\bar x$`],
  [T`Donc $m = a\bar x + b$.`, 'd'] ], [
  [T`Au numérateur, on regroupe les termes : il vaut $a(x_1 + x_2 + \dots + x_n) + b$.`, T`Le nombre $b$ est ajouté à chacune des $n$ valeurs : il figure $n$ fois au numérateur, qui vaut $a(x_1 + \dots + x_n) + nb$. Avec un seul $b$, on trouverait la moyenne $a\bar x + \frac bn$.`],
  [T`Notons $m$ la moyenne de la nouvelle série : $m = (ax_1 + b) + (ax_2 + b) + \dots + (ax_n + b)$.`, T`C'est la somme des valeurs, et non leur moyenne : il reste à diviser par l'effectif $n$.`] ]),
demo('sec-evolution-reciproque', 'seconde', '', 's-06', 'Taux de l\'évolution réciproque', T`Une grandeur non nulle subit une évolution de taux $t$, avec $t > -1$. Le taux $t'$ de l'évolution réciproque, qui ramène à la valeur de départ, vérifie $1 + t' = \dfrac{1}{1 + t}$.`, [
  [T`Notons $V_0$ la valeur de départ, non nulle, et $V_1$ la valeur d'arrivée : $V_1 = (1 + t)V_0$.`, '', T`les valeurs $V_0$ et $V_1$`],
  [T`Comme $t > -1$, le nombre $1 + t$ est non nul : on peut écrire $V_0 = \dfrac{V_1}{1 + t}$.`, 'a', T`l'égalité $V_0 = \frac{V_1}{1 + t}$`],
  [T`L'évolution réciproque fait passer de $V_1$ à $V_0$ : par définition de son taux $t'$, on a aussi $V_0 = (1 + t')V_1$.`, 'b', T`l'égalité $V_0 = (1 + t')V_1$`],
  [T`En comparant les deux écritures de $V_0$ : $(1 + t')V_1 = \dfrac{V_1}{1 + t}$.`, 'c', T`la comparaison des deux écritures de $V_0$`],
  [T`Enfin $V_1$ est non nul, comme produit de deux nombres non nuls : en divisant par $V_1$, on obtient $1 + t' = \dfrac{1}{1 + t}$.`, 'd'] ], [
  [T`L'évolution réciproque a pour taux $-t$ : on a donc $V_0 = (1 - t)V_1$.`, T`Une hausse de $25\,\%$ suivie d'une baisse de $25\,\%$ multiplie par $1{,}25 \times 0{,}75 = 0{,}9375$ : on ne revient pas à la valeur de départ. Le taux réciproque d'une hausse de $25\,\%$ est une baisse de $20\,\%$, car $\frac{1}{1{,}25} = 0{,}8$.`],
  [T`Comme $V_1 = (1 + t)V_0$, on peut écrire $V_0 = V_1 - tV_1$.`, T`De $V_1 = V_0 + tV_0$, on tire $V_0 = V_1 - tV_0$ : le taux s'applique à la valeur de départ $V_0$, et non à $V_1$.`] ]),
];
