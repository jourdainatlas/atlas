// Démonstrations à remettre en ordre : Maths expertes (MEMO_atlas_activites.md §145).
import { T, demo } from './raisonner-outils.js';
export default [
demo('division-unicite', 'expertes', '', 'me-01', 'Unicité de la division euclidienne', T`Soit $a$ un entier et $b$ un entier strictement positif. Il existe au plus un couple d'entiers $(q, r)$ tel que $a = bq + r$ et $0 \leqslant r < b$.`, [
  [T`Supposons que $a = bq + r = bq' + r'$, avec $0 \leqslant r < b$ et $0 \leqslant r' < b$.`, '', T`les deux écritures de $a$`],
  [T`En retranchant, $b(q - q') = r' - r$.`, 'a', T`l'égalité $b(q - q') = r' - r$`],
  [T`Comme $0 \leqslant r' < b$ et $-b < -r \leqslant 0$, on a $-b < r' - r < b$.`, 'a', T`l'encadrement de $r' - r$`],
  [T`Donc $-b < b(q - q') < b$, et, en divisant par $b > 0$ : $-1 < q - q' < 1$. L'entier $q - q'$ est donc nul : $q = q'$.`, 'bc', T`l'égalité $q = q'$`],
  [T`En reportant, $r' - r = 0$ : $r = r'$. Les deux couples sont égaux.`, 'd'] ], [
  [T`Comme $r$ et $r'$ sont compris entre 0 et $b$, on a $0 \leqslant r' - r < b$.`, T`La différence de deux nombres positifs peut être négative : si $r' < r$, alors $r' - r < 0$. L'encadrement correct est $-b < r' - r < b$.`],
  [T`L'égalité $b(q - q') = r' - r$ montre que $b$ divise $r$ et $r'$.`, T`Elle montre que $b$ divise la <em>différence</em> $r' - r$, ce qui n'entraîne pas qu'il divise chacun des deux nombres : 5 divise $7 - 2$ sans diviser 7 ni 2.`] ]),
demo('diviseur-premier', 'expertes', '', 'me-01', 'Existence d\'un diviseur premier', T`Tout entier $n \geqslant 2$ possède au moins un diviseur premier.`, [
  [T`L'ensemble $D$ des diviseurs de $n$ supérieurs ou égaux à 2 n'est pas vide, puisqu'il contient $n$ : il a un plus petit élément, noté $p$.`, '', T`le plus petit diviseur $p \geqslant 2$ de $n$`],
  [T`Supposons que $p$ ne soit pas premier : il possède un diviseur $d$ tel que $1 < d < p$.`, 'a', T`un diviseur $d$ de $p$ avec $1 < d < p$`],
  [T`Comme $d$ divise $p$ et que $p$ divise $n$, l'entier $d$ divise $n$.`, 'b', T`le fait que $d$ divise $n$`],
  [T`Donc $d$ appartient à $D$ et $d < p$, ce qui contredit la définition de $p$. Ainsi $p$ est premier, et il divise $n$.`, 'c'] ], [
  [T`L'ensemble $D$ a un plus grand élément, $n$ lui-même, qui est donc un diviseur premier de $n$.`, T`Le plus grand diviseur de $n$ est $n$, qui n'a aucune raison d'être premier : pour $n = 12$, c'est 12. C'est le <em>plus petit</em> diviseur supérieur à 1 qui est toujours premier.`],
  [T`Comme $d$ divise $p$, l'entier $p$ divise $d$.`, T`La divisibilité n'est pas symétrique : 3 divise 6, mais 6 ne divise pas 3. De $d \mid p$ et $p \mid n$, on tire $d \mid n$ par transitivité.`] ]),
demo('critere-racine', 'expertes', '', 'me-01', 'Test de primalité par la racine carrée', T`Si un entier $n \geqslant 2$ n'est pas premier, alors il possède un diviseur premier $p$ tel que $p \leqslant \sqrt n$.`, [
  [T`Comme $n$ n'est pas premier, il s'écrit $n = ab$ avec $1 < a \leqslant b < n$.`, '', T`l'écriture $n = ab$ avec $1 < a \leqslant b$`],
  [T`Puisque $a \leqslant b$, on a $a^2 \leqslant ab = n$, donc $a \leqslant \sqrt n$.`, 'a', T`l'inégalité $a \leqslant \sqrt n$`],
  [T`L'entier $a \geqslant 2$ possède un diviseur premier $p$, et $p \leqslant a$.`, 'a', T`un diviseur premier $p$ de $a$`],
  [T`Comme $p$ divise $a$ et que $a$ divise $n$, le nombre premier $p$ divise $n$, et $p \leqslant a \leqslant \sqrt n$.`, 'bc'] ], [
  [T`Puisque $a \leqslant b$, on a $b^2 \leqslant ab = n$, donc $b \leqslant \sqrt n$.`, T`De $a \leqslant b$ on tire $ab \leqslant b^2$, c'est-à-dire $n \leqslant b^2$ : c'est le <em>plus petit</em> des deux facteurs qui est inférieur à $\sqrt n$, le plus grand lui est supérieur.`],
  [T`Tout diviseur de $n$ est donc inférieur ou égal à $\sqrt n$.`, T`C'est faux : 6 divise 12 et $6 > \sqrt{12}$. L'énoncé affirme l'existence d'<em>un</em> diviseur premier inférieur à $\sqrt n$, pas que tous le sont.`] ]),
demo('congruence-produit', 'expertes', '', 'me-04', 'Produit de congruences', T`Soit $n \geqslant 2$. Si $a \equiv b \pmod n$ et $c \equiv d \pmod n$, alors $ac \equiv bd \pmod n$.`, [
  [T`Par hypothèse, $n$ divise $a - b$ et $n$ divise $c - d$.`, '', T`la traduction des deux congruences`],
  [T`Écrivons $ac - bd = (a - b)c + b(c - d)$.`, '', T`la décomposition de $ac - bd$`],
  [T`L'entier $n$ divise $(a - b)c$ et $b(c - d)$ : il divise donc leur somme.`, 'ab', T`le fait que $n$ divise $ac - bd$`],
  [T`Ainsi $n$ divise $ac - bd$, c'est-à-dire $ac \equiv bd \pmod n$.`, 'c'] ], [
  [T`Écrivons $ac - bd = (a - b)(c - d)$.`, T`Le développement de $(a - b)(c - d)$ donne $ac - ad - bc + bd$, qui n'est pas $ac - bd$. La bonne décomposition fait apparaître chaque différence une seule fois : $(a - b)c + b(c - d)$.`],
  [T`Par hypothèse, $n$ divise $a$, $b$, $c$ et $d$.`, T`Une congruence dit que $n$ divise la <em>différence</em> des deux nombres, pas chacun d'eux : $7 \equiv 2 \pmod 5$ sans que 5 divise 7.`] ]),
demo('bezout-reciproque', 'expertes', '', 'me-07', 'Réciproque du théorème de Bézout', T`Soit $a$ et $b$ deux entiers. S'il existe deux entiers $u$ et $v$ tels que $au + bv = 1$, alors $a$ et $b$ sont premiers entre eux.`, [
  [T`Soit $u$ et $v$ deux entiers tels que $au + bv = 1$, et notons $d$ le PGCD de $a$ et $b$.`, '', T`les entiers $u$, $v$ et le PGCD $d$`],
  [T`L'entier $d$ divise $a$ et $b$ : il divise donc $au$ et $bv$.`, 'a', T`le fait que $d$ divise $au$ et $bv$`],
  [T`Il divise alors leur somme $au + bv$, c'est-à-dire 1.`, 'b', T`le fait que $d$ divise 1`],
  [T`Le seul entier positif qui divise 1 est 1 : donc $d = 1$, et $a$ et $b$ sont premiers entre eux.`, 'c'] ], [
  [T`Plus généralement, s'il existe $u$ et $v$ tels que $au + bv = k$, alors le PGCD de $a$ et $b$ est $k$.`, T`C'est faux : $1 \times 1 + 1 \times 1 = 2$, alors que le PGCD de 1 et 1 est 1. On peut seulement dire que le PGCD <em>divise</em> $k$ ; c'est parce que $k = 1$ qu'il est égal à 1.`],
  [T`L'entier $d$ divise $a$ et $b$ : il divise donc $u$ et $v$.`, T`Rien ne relie $d$ à $u$ et $v$. Ce que l'on sait, c'est que $d$ divise tout multiple de $a$ et tout multiple de $b$, donc $au$ et $bv$.`] ]),
demo('gauss-produit', 'expertes', '', 'me-07', 'Deux diviseurs premiers entre eux', T`Soit $a$, $b$, $c$ trois entiers. Si $a$ et $b$ divisent $c$ et sont premiers entre eux, alors $ab$ divise $c$.`, [
  [T`Comme $a$ divise $c$, il existe un entier $k$ tel que $c = ak$.`, '', T`l'entier $k$ tel que $c = ak$`],
  [T`Par hypothèse, $b$ divise $c = ak$, et $b$ est premier avec $a$ : d'après le théorème de Gauss, $b$ divise $k$.`, 'a', T`le fait que $b$ divise $k$`],
  [T`Il existe donc un entier $\ell$ tel que $k = b\ell$.`, 'b', T`l'entier $\ell$ tel que $k = b\ell$`],
  [T`Ainsi $c = ak = ab\ell$ : l'entier $ab$ divise $c$.`, 'c'] ], [
  [T`Si deux entiers divisent $c$, leur produit divise $c$ : donc $ab$ divise $c$, sans autre hypothèse.`, T`C'est faux : 4 et 6 divisent 12, mais 24 ne divise pas 12. L'hypothèse « premiers entre eux » est indispensable, et c'est elle qui permet d'appliquer le théorème de Gauss.`],
  [T`Comme $b$ divise $ak$, il divise $a$ ou il divise $k$.`, T`Cette alternative n'est vraie que si $b$ est premier : 6 divise $4 \times 3$ sans diviser ni 4 ni 3. Pour un entier quelconque, il faut l'hypothèse « premier avec $a$ » et le théorème de Gauss.`] ]),
demo('euclide-algorithme', 'expertes', '', 'me-07', 'Principe de l\'algorithme d\'Euclide', T`Soit $a$ et $b$ deux entiers naturels, $b \neq 0$, et $r$ le reste de la division euclidienne de $a$ par $b$. Alors les diviseurs communs à $a$ et $b$ sont les diviseurs communs à $b$ et $r$ ; en particulier, $\mathrm{pgcd}(a, b) = \mathrm{pgcd}(b, r)$.`, [
  [T`Écrivons la division euclidienne : $a = bq + r$.`, '', T`l'égalité $a = bq + r$`],
  [T`Si un entier $d$ divise $a$ et $b$, alors il divise $a - bq$, c'est-à-dire $r$ : il divise $b$ et $r$.`, 'a', T`le premier sens : un diviseur commun à $a$ et $b$ divise $r$`],
  [T`Si un entier $d$ divise $b$ et $r$, alors il divise $bq + r$, c'est-à-dire $a$ : il divise $a$ et $b$.`, 'a', T`le second sens : un diviseur commun à $b$ et $r$ divise $a$`],
  [T`Les couples $(a, b)$ et $(b, r)$ ont donc les mêmes diviseurs communs, et en particulier le même plus grand diviseur commun.`, 'bc'] ], [
  [T`Le reste $r$ divise $a$ et $b$ : c'est donc leur PGCD.`, T`Le reste n'est pas un diviseur en général : dans la division de 8 par 3, le reste est 2, qui ne divise ni 8 ni 3, dont le PGCD est 1.`],
  [T`Si un entier $d$ divise $a$, alors il divise $b$ et $r$.`, T`Il faut que $d$ divise à la fois $a$ <em>et</em> $b$ pour diviser $r = a - bq$. Un diviseur de $a$ seul ne divise pas $b$ en général : 4 divise 8, mais pas 3.`] ]),
demo('fermat', 'expertes', '', 'me-04', 'Petit théorème de Fermat', T`Soit $p$ un nombre premier et $a$ un entier non divisible par $p$. Alors $a^{p-1} \equiv 1 \pmod p$.`, [
  [T`Considérons les $p - 1$ entiers $a, 2a, 3a, \dots, (p-1)a$.`, '', T`la liste $a, 2a, \dots, (p-1)a$`],
  [T`Si $ia \equiv ja \pmod p$ avec $1 \leqslant i, j \leqslant p - 1$, alors $p$ divise $(i - j)a$ ; comme $p$ est premier et ne divise pas $a$, il divise $i - j$, ce qui impose $i = j$ puisque $|i - j| < p$.`, 'a', T`le fait que les entiers de la liste sont deux à deux non congrus modulo $p$`],
  [T`De même, aucun des entiers $ia$ n'est divisible par $p$. Leurs restes modulo $p$ sont donc $p - 1$ entiers distincts entre 1 et $p - 1$ : ce sont exactement $1, 2, \dots, p - 1$, dans un certain ordre.`, 'b', T`le fait que les restes sont $1, 2, \dots, p-1$ dans un certain ordre`],
  [T`En multipliant : $a \times 2a \times \dots \times (p-1)a \equiv 1 \times 2 \times \dots \times (p-1) \pmod p$, c'est-à-dire $a^{p-1}(p-1)! \equiv (p-1)! \pmod p$.`, 'c', T`la congruence $a^{p-1}(p-1)! \equiv (p-1)!$`],
  [T`Donc $p$ divise $\bigl(a^{p-1} - 1\bigr)(p-1)!$. Or $p$, premier, ne divise aucun des facteurs de $(p-1)!$, donc il est premier avec $(p-1)!$ : d'après le théorème de Gauss, $p$ divise $a^{p-1} - 1$.`, 'd'] ], [
  [T`On peut toujours simplifier une congruence : en divisant par $(p-1)!$, on obtient $a^{p-1} \equiv 1 \pmod p$.`, T`On ne simplifie une congruence modulo $p$ que par un entier premier avec $p$ : $2 \times 3 \equiv 2 \times 0 \pmod 6$, et pourtant $3 \not\equiv 0$. Il faut justifier que $(p-1)!$ est premier avec $p$, ce qui utilise le fait que $p$ est premier.`],
  [T`Les restes modulo $p$ des entiers $a, 2a, \dots, (p-1)a$ sont tous égaux à 1.`, T`Ils sont au contraire tous différents : c'est ce qui permet de dire qu'ils forment la liste complète $1, 2, \dots, p - 1$. Pour $p = 5$ et $a = 2$, les restes de 2, 4, 6, 8 sont 2, 4, 1, 3.`] ]),
demo('module-produit', 'expertes', '', 'me-02', 'Module d\'un produit', T`Pour tous nombres complexes $z$ et $z'$ : $|zz'| = |z|\,|z'|$.`, [
  [T`Par définition du module, $|zz'|^2 = zz' \times \overline{zz'}$.`, '', T`l'écriture de $|zz'|^2$ avec le conjugué`],
  [T`Le conjugué d'un produit est le produit des conjugués : $\overline{zz'} = \overline z\,\overline{z'}$.`, '', T`le conjugué du produit`],
  [T`Donc $|zz'|^2 = (z\overline z)(z'\overline{z'}) = |z|^2\,|z'|^2 = \bigl(|z|\,|z'|\bigr)^2$.`, 'ab', T`l'égalité des carrés $|zz'|^2 = (|z||z'|)^2$`],
  [T`Les nombres $|zz'|$ et $|z|\,|z'|$ sont des réels positifs qui ont le même carré : ils sont égaux.`, 'c'] ], [
  [T`Le conjugué d'un produit est la somme des conjugués : $\overline{zz'} = \overline z + \overline{z'}$.`, T`La conjugaison est compatible avec la somme <em>et</em> avec le produit : le conjugué d'un produit est le produit des conjugués. Pour $z = z' = i$, on a $\overline{zz'} = -1$, alors que $\overline z + \overline{z'} = -2i$.`],
  [T`Deux nombres qui ont le même carré sont égaux : donc $|zz'| = |z|\,|z'|$.`, T`Deux réels de même carré sont égaux <em>ou opposés</em> : $2$ et $-2$ ont le même carré. C'est parce que les deux modules sont positifs que l'on peut conclure.`] ]),
demo('racines-unite', 'expertes', '', 'me-05', 'Racines n-ièmes de l\'unité', T`Soit $n \geqslant 1$. L'équation $z^n = 1$ a exactement $n$ solutions complexes, les nombres $e^{2ik\pi/n}$ pour $k$ entier de 0 à $n - 1$.`, [
  [T`Zéro n'est pas solution. Soit $z \neq 0$, écrit sous forme exponentielle $z = re^{i\theta}$, avec $r > 0$ : alors $z^n = r^n e^{in\theta}$.`, '', T`la forme exponentielle de $z^n$`],
  [T`Deux nombres complexes non nuls sont égaux si et seulement s'ils ont le même module et le même argument à $2\pi$ près : $z^n = 1$ équivaut à $r^n = 1$ et $n\theta = 2k\pi$ pour un entier $k$.`, 'a', T`la traduction de $z^n = 1$ sur le module et l'argument`],
  [T`Comme $r > 0$, la condition $r^n = 1$ équivaut à $r = 1$. Les solutions sont donc les nombres $e^{2ik\pi/n}$, où $k$ est un entier.`, 'b', T`la forme $e^{2ik\pi/n}$ des solutions`],
  [T`Les entiers $k$ et $k + n$ donnent le même nombre, puisque $e^{2i\pi} = 1$ ; et pour $k$ de 0 à $n - 1$, les arguments $\dfrac{2k\pi}{n}$ sont distincts et compris dans $[0, 2\pi[$. Il y a donc exactement $n$ solutions.`, 'c'] ], [
  [T`La condition $r^n = 1$ donne $r = 1$ ou $r = -1$.`, T`Un module est un réel strictement positif : $r = -1$ est exclu. C'est l'argument, et non le module, qui porte les différentes solutions.`],
  [T`La condition $n\theta = 0$ donne $\theta = 0$ : la seule solution est $z = 1$.`, T`Un argument n'est défini qu'à $2\pi$ près : l'égalité des arguments s'écrit $n\theta = 2k\pi$, avec $k$ entier, et non $n\theta = 0$. Oublier ce « $2k\pi$ », c'est perdre $n - 1$ solutions.`] ]),
demo('moivre', 'expertes', '', 'me-02', 'Formule de Moivre', T`Pour tout réel $\theta$ et tout entier $n \geqslant 0$ : $(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$.`, [
  [T`Soit $\theta$ un réel. Pour tout entier $n \geqslant 0$, notons $P(n)$ l'égalité $(\cos\theta + i\sin\theta)^n = \cos(n\theta) + i\sin(n\theta)$.`, '', T`la propriété $P(n)$`],
  [T`Initialisation : les deux membres valent 1 pour $n = 0$. Donc $P(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ un entier tel que $P(n)$ soit vraie.`, 'a', T`le choix d'un entier $n$ tel que $P(n)$ soit vraie`],
  [T`Alors $(\cos\theta + i\sin\theta)^{n+1} = \bigl(\cos(n\theta) + i\sin(n\theta)\bigr)(\cos\theta + i\sin\theta)$.`, 'c', T`l'écriture de la puissance $n + 1$ à l'aide de $P(n)$`],
  [T`En développant, la partie réelle est $\cos(n\theta)\cos\theta - \sin(n\theta)\sin\theta = \cos\bigl((n+1)\theta\bigr)$ et la partie imaginaire est $\sin(n\theta)\cos\theta + \cos(n\theta)\sin\theta = \sin\bigl((n+1)\theta\bigr)$ : $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 0$.`, 'be'] ], [
  [T`Alors $(\cos\theta + i\sin\theta)^{n+1} = \cos^{n+1}\theta + i\sin^{n+1}\theta$.`, T`On n'élève pas une somme à une puissance en élevant chaque terme : déjà $(a + b)^2 \neq a^2 + b^2$. C'est l'angle qui est multiplié par $n$, pas le cosinus et le sinus qui sont élevés à la puissance $n$.`],
  [T`Hérédité : supposons que $P(n)$ soit vraie pour tout entier $n \geqslant 0$.`, T`Cette phrase suppose ce qu'il faut démontrer. Dans l'hérédité, on fixe <em>un</em> entier $n$ pour lequel $P(n)$ est vraie.`] ]),
demo('racine-conjuguee', 'expertes', '', 'me-02', 'Racines conjuguées', T`Soit $P$ un polynôme à coefficients réels. Si un nombre complexe $z$ est racine de $P$, alors $\overline z$ est aussi racine de $P$.`, [
  [T`Écrivons $P(z) = a_n z^n + \dots + a_1 z + a_0$, où les $a_k$ sont réels, et supposons $P(z) = 0$.`, '', T`l'écriture de $P(z)$ et l'hypothèse $P(z) = 0$`],
  [T`En conjuguant les deux membres : $\overline{a_n z^n + \dots + a_1 z + a_0} = \overline 0 = 0$.`, 'a', T`la conjugaison de l'égalité $P(z) = 0$`],
  [T`Le conjugué d'une somme est la somme des conjugués, et celui d'un produit le produit des conjugués : on obtient $\overline{a_n}\,\overline z^{\,n} + \dots + \overline{a_1}\,\overline z + \overline{a_0} = 0$.`, 'b', T`l'égalité obtenue en distribuant la conjugaison`],
  [T`Les coefficients étant réels, $\overline{a_k} = a_k$ pour tout $k$ : l'égalité s'écrit $a_n \overline z^{\,n} + \dots + a_1 \overline z + a_0 = 0$.`, 'c', T`l'égalité avec les coefficients $a_k$`],
  [T`C'est dire que $P(\overline z) = 0$ : le nombre $\overline z$ est racine de $P$.`, 'd'] ], [
  [T`Les coefficients étant réels, $\overline{a_k} = -a_k$ pour tout $k$.`, T`Le conjugué d'un réel est ce réel lui-même : c'est la partie imaginaire qui change de signe, et elle est nulle. Ce sont les imaginaires purs qui vérifient $\overline a = -a$.`],
  [T`Le résultat vaut pour tout polynôme à coefficients complexes.`, T`C'est faux : $i$ est racine de $X - i$, mais son conjugué $-i$ ne l'est pas. La démonstration utilise $\overline{a_k} = a_k$, c'est-à-dire le fait que les coefficients sont réels.`] ]),
demo('inverse-unique', 'expertes', '', 'me-03', 'Unicité de l\'inverse d\'une matrice', T`Une matrice carrée $A$ possède au plus une inverse.`, [
  [T`Soit $B$ et $C$ deux inverses de $A$ : $AB = BA = I$ et $AC = CA = I$.`, '', T`les deux inverses $B$ et $C$`],
  [T`Comme $I$ est neutre pour le produit, $B = BI = B(AC)$.`, 'a', T`l'écriture $B = B(AC)$`],
  [T`Le produit matriciel étant associatif, $B(AC) = (BA)C = IC = C$.`, 'b', T`le calcul $B(AC) = C$`],
  [T`Donc $B = C$ : l'inverse, quand elle existe, est unique.`, 'c'] ], [
  [T`Comme $AB = AC$ et que $A$ n'est pas la matrice nulle, on peut simplifier par $A$ : $B = C$.`, T`On ne simplifie pas par une matrice non nulle quelconque : avec $A = \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ et $B = \begin{pmatrix} 0 & 0 \\ 0 & 1 \end{pmatrix}$, on a $AB = A \times 0$ sans que $B$ soit nulle. Ce qui permet de simplifier, c'est de multiplier à gauche par une inverse de $A$, et c'est exactement ce que fait la démonstration.`],
  [T`Comme $I$ est neutre pour le produit, $B = BI = BA$.`, T`On a $BA = I$, et non $BA = B$. Pour faire apparaître $C$, on remplace $I$ par $AC$.`] ]),
demo('inverse-2x2', 'expertes', '', 'me-03', 'Inverse d\'une matrice d\'ordre 2', T`Soit $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$. Si $ad - bc \neq 0$, alors $A$ est inversible, et $A^{-1} = \dfrac{1}{ad - bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$.`, [
  [T`Posons $B = \begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ et $\delta = ad - bc$.`, '', T`la matrice $B$ et le réel $\delta$`],
  [T`Le calcul donne $AB = \begin{pmatrix} ad - bc & -ab + ba \\ cd - dc & -cb + da \end{pmatrix} = \delta I$.`, 'a', T`l'égalité $AB = \delta I$`],
  [T`De même, $BA = \begin{pmatrix} da - bc & db - bd \\ -ca + ac & -cb + ad \end{pmatrix} = \delta I$.`, 'a', T`l'égalité $BA = \delta I$`],
  [T`Comme $\delta \neq 0$, on peut diviser par $\delta$ : $A \times \dfrac1\delta B = \dfrac1\delta B \times A = I$.`, 'bc', T`les deux produits égaux à $I$`],
  [T`La matrice $A$ est donc inversible, d'inverse $\dfrac1\delta B$.`, 'd'] ], [
  [T`Le calcul donne $AB = \begin{pmatrix} ad + bc & 0 \\ 0 & ad + bc \end{pmatrix}$.`, T`Le coefficient en haut à gauche est $a \times d + b \times (-c) = ad - bc$ : le signe moins vient du coefficient $-c$ de $B$.`],
  [T`Ce calcul ne dépend pas de la valeur de $\delta$ : la matrice $A$ est inversible dans tous les cas.`, T`Si $\delta = 0$, on obtient $AB = 0$, et l'on ne peut pas diviser par $\delta$. La matrice $A$ n'est alors pas inversible : sinon, en multipliant $AB = 0$ par $A^{-1}$, on trouverait $B = 0$, donc $A = 0$, qui n'est pas inversible.`] ]),
demo('poignees', 'expertes', '', 'me-06', 'Somme des degrés d\'un graphe', T`Dans un graphe non orienté, sans boucle, la somme des degrés des sommets est égale au double du nombre d'arêtes.`, [
  [T`Comptons de deux façons les couples $(s, a)$ formés d'un sommet $s$ et d'une arête $a$ dont $s$ est une extrémité.`, '', T`les couples (sommet, arête) à compter`],
  [T`En regroupant par sommet : un sommet $s$ figure dans autant de couples qu'il a d'arêtes, c'est-à-dire $\deg(s)$. Le nombre de couples est la somme des degrés.`, 'a', T`le décompte par sommet`],
  [T`En regroupant par arête : chaque arête a exactement deux extrémités, donc figure dans deux couples. S'il y a $m$ arêtes, le nombre de couples est $2m$.`, 'a', T`le décompte par arête`],
  [T`Les deux décomptes portent sur le même ensemble : la somme des degrés vaut $2m$.`, 'bc'] ], [
  [T`En regroupant par arête : chaque arête figure dans un seul couple. S'il y a $m$ arêtes, le nombre de couples est $m$.`, T`Une arête relie deux sommets : elle figure dans un couple avec chacune de ses deux extrémités. C'est ce facteur 2 qui fait que la somme des degrés est toujours paire.`],
  [T`Chaque sommet est relié à tous les autres : si le graphe a $n$ sommets, la somme des degrés vaut $n(n - 1)$.`, T`Ce n'est vrai que pour un graphe complet. Dans un graphe quelconque, les degrés varient en général d'un sommet à l'autre et ne valent pas tous $n - 1$ : on ne peut que les additionner.`] ]),
// ---------- Ajouts du 12 nov. (audit des programmes, §146) ----------
demo('zn-an', 'expertes', '', 'me-02', 'Factorisation de zⁿ − aⁿ', T`Pour tous nombres complexes $z$ et $a$ et tout entier $n \geqslant 1$ : $z^n - a^n = (z - a)\bigl(z^{n-1} + a z^{n-2} + \dots + a^{n-2} z + a^{n-1}\bigr)$.`, [
  [T`Notons $S = z^{n-1} + a z^{n-2} + \dots + a^{n-2} z + a^{n-1}$.`, '', T`la somme $S$`],
  [T`En multipliant par $z$ : $zS = z^n + a z^{n-1} + \dots + a^{n-2} z^2 + a^{n-1} z$.`, 'a', T`le produit $zS$`],
  [T`En multipliant par $a$ : $aS = a z^{n-1} + a^2 z^{n-2} + \dots + a^{n-1} z + a^n$.`, 'a', T`le produit $aS$`],
  [T`En retranchant, tous les termes de $a z^{n-1}$ à $a^{n-1} z$ se simplifient : $(z - a)S = z^n - a^n$.`, 'bc'] ], [
  [T`En retranchant : $(z - a)S = z^n + a^n$.`, T`Le terme $a^n$ provient de $aS$, que l'on retranche : il est précédé d'un signe moins. Pour $n = 1$, la formule écrite donnerait $z - a = z + a$.`],
  [T`Plus simplement, $z^n - a^n = (z - a)^n$.`, T`C'est faux dès $n = 2$ : $(z - a)^2 = z^2 - 2az + a^2$, qui n'est pas $z^2 - a^2 = (z - a)(z + a)$.`] ]),
demo('factorisation-racine', 'expertes', '', 'me-02', 'Factorisation par z − a', T`Soit $P$ un polynôme à coefficients complexes de degré $n \geqslant 1$, et $a$ un nombre complexe tel que $P(a) = 0$. Alors il existe un polynôme $Q$ de degré $n - 1$ tel que $P(z) = (z - a)Q(z)$ pour tout $z$.`, [
  [T`Écrivons $P(z) = c_n z^n + \dots + c_1 z + c_0$, avec $c_n \neq 0$. Comme $P(a) = 0$, on a $P(z) = P(z) - P(a)$.`, '', T`l'écriture $P(z) = P(z) - P(a)$`],
  [T`Les termes constants s'éliminent : $P(z) = c_n(z^n - a^n) + \dots + c_2(z^2 - a^2) + c_1(z - a)$.`, 'a', T`l'écriture de $P(z)$ avec les différences $z^k - a^k$`],
  [T`Pour chaque $k \geqslant 1$, $z^k - a^k = (z - a)Q_k(z)$, où $Q_k(z) = z^{k-1} + a z^{k-2} + \dots + a^{k-1}$ est de degré $k - 1$.`, 'b', T`la factorisation de chaque $z^k - a^k$`],
  [T`En mettant $z - a$ en facteur : $P(z) = (z - a)\bigl(c_n Q_n(z) + \dots + c_2 Q_2(z) + c_1\bigr)$.`, 'c', T`la mise en facteur de $z - a$`],
  [T`Le polynôme $Q = c_n Q_n + \dots + c_2 Q_2 + c_1$ convient : il est de degré $n - 1$, car seul $c_n Q_n$ contient un terme en $z^{n-1}$, de coefficient $c_n \neq 0$.`, 'd'] ], [
  [T`Comme $P(a) = 0$, on a $P(z) = P(z) - P(a) = P(z - a)$.`, T`Un polynôme n'est pas une fonction linéaire : $P(z) - P(a)$ n'est pas $P(z - a)$. Pour $P(z) = z^2$, on a $z^2 - a^2 \neq (z - a)^2$.`],
  [T`Pour chaque $k \geqslant 1$, $z^k - a^k = (z - a)^k$.`, T`C'est faux dès $k = 2$. La bonne factorisation est $z^k - a^k = (z - a)\bigl(z^{k-1} + a z^{k-2} + \dots + a^{k-1}\bigr)$, où $z - a$ n'apparaît qu'une fois.`] ]),
demo('au-plus-n', 'expertes', '', 'me-02', 'Au plus n solutions', T`Une équation polynomiale de degré $n \geqslant 1$, à coefficients complexes, a au plus $n$ solutions dans $\mathbb{C}$.`, [
  [T`Pour tout entier $n \geqslant 1$, notons $H(n)$ : « toute équation $P(z) = 0$, où $P$ est un polynôme de degré $n$, a au plus $n$ solutions ».`, '', T`la propriété $H(n)$`],
  [T`Initialisation : une équation de degré 1 s'écrit $c_1 z + c_0 = 0$ avec $c_1 \neq 0$ ; elle a pour unique solution $-\dfrac{c_0}{c_1}$. Donc $H(1)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 1$ tel que $H(n)$ soit vraie, et $P$ un polynôme de degré $n + 1$. Si l'équation $P(z) = 0$ n'a pas de solution, il n'y a rien à démontrer ; sinon, soit $a$ une solution : $P(z) = (z - a)Q(z)$, avec $Q$ de degré $n$.`, 'a', T`la factorisation $P(z) = (z - a)Q(z)$`],
  [T`Un produit de nombres complexes est nul si et seulement si l'un des facteurs est nul : les solutions de $P(z) = 0$ sont $a$ et les solutions de $Q(z) = 0$.`, 'c', T`la description des solutions de $P(z) = 0$`],
  [T`D'après $H(n)$, l'équation $Q(z) = 0$ a au plus $n$ solutions : l'équation $P(z) = 0$ en a au plus $n + 1$, et $H(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $H(n)$ est vraie pour tout entier $n \geqslant 1$.`, 'be'] ], [
  [T`Soit $a$ une solution : $P(z) = (z - a)Q(z)$, avec $Q$ de degré $n + 1$.`, T`Le degré d'un produit est la somme des degrés : $Q$ est de degré $n$. C'est cette baisse d'une unité qui permet d'appliquer l'hypothèse de récurrence.`],
  [T`Hérédité : supposons que $H(n)$ soit vraie pour tout entier $n \geqslant 1$.`, T`Cette phrase suppose ce qu'il faut démontrer. Dans l'hérédité, on fixe <em>un</em> entier $n$ pour lequel $H(n)$ est vraie.`] ]),
demo('binome-recurrence', 'expertes', '', 'me-02', 'Formule du binôme dans ℂ', T`Pour tous nombres complexes $a$ et $b$ et tout entier $n \geqslant 0$ : $(a + b)^n = \displaystyle\sum_{k=0}^{n} \binom nk a^k b^{n-k}$.`, [
  [T`Pour tout entier $n \geqslant 0$, notons $P(n)$ l'égalité $(a + b)^n = \displaystyle\sum_{k=0}^{n} \binom nk a^k b^{n-k}$.`, '', T`la propriété $P(n)$`],
  [T`Initialisation : pour $n = 0$, les deux membres valent 1. Donc $P(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ tel que $P(n)$ soit vraie. Alors $(a + b)^{n+1} = (a + b)\displaystyle\sum_{k=0}^{n} \binom nk a^k b^{n-k} = \sum_{k=0}^{n} \binom nk a^{k+1} b^{n-k} + \sum_{k=0}^{n} \binom nk a^k b^{n+1-k}$.`, 'a', T`le développement de $(a + b)^{n+1}$ en deux sommes`],
  [T`Dans la première somme, posons $j = k + 1$ : elle s'écrit $\displaystyle\sum_{j=1}^{n+1} \binom{n}{j-1} a^j b^{n+1-j}$.`, 'c', T`le changement d'indice dans la première somme`],
  [T`Regroupons les termes en $a^k b^{n+1-k}$ : pour $1 \leqslant k \leqslant n$, le coefficient est $\displaystyle\binom{n}{k-1} + \binom nk = \binom{n+1}{k}$, d'après la relation de Pascal ; les termes $a^{n+1}$ et $b^{n+1}$ ont pour coefficient 1.`, 'd', T`le regroupement des termes par la relation de Pascal`],
  [T`Donc $(a + b)^{n+1} = \displaystyle\sum_{k=0}^{n+1} \binom{n+1}{k} a^k b^{n+1-k}$ : $P(n+1)$ est vraie.`, 'e', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 0$.`, 'bf'] ], [
  [T`Alors $(a + b)^{n+1} = a^{n+1} + b^{n+1}$.`, T`On n'élève pas une somme à une puissance terme à terme : $(a + b)^2 = a^2 + 2ab + b^2$. Les termes mixtes sont justement ceux que comptent les coefficients binomiaux.`],
  [T`D'après la relation de Pascal, $\displaystyle\binom{n}{k-1} + \binom nk = \binom{n+1}{k+1}$.`, T`La relation de Pascal donne $\displaystyle\binom{n+1}{k}$ : le grand indice augmente d'une unité, le petit reste $k$. Pour $n = 3$ et $k = 1$ : $\displaystyle\binom30 + \binom31 = 1 + 3 = 4 = \binom41$, alors que $\displaystyle\binom42 = 6$.`] ]),
demo('addition-cosinus', 'expertes', '', 'me-05', 'Formule d\'addition du cosinus', T`Pour tous réels $a$ et $b$ : $\cos(a - b) = \cos a\cos b + \sin a\sin b$, puis $\cos(a + b) = \cos a\cos b - \sin a\sin b$.`, [
  [T`Dans un repère orthonormé, soit $\vec u(\cos a ; \sin a)$ et $\vec v(\cos b ; \sin b)$ : ce sont deux vecteurs de norme 1, qui font les angles $a$ et $b$ avec le premier vecteur du repère.`, '', T`les vecteurs $\vec u$ et $\vec v$`],
  [T`Avec les coordonnées : $\vec u \cdot \vec v = \cos a\cos b + \sin a\sin b$.`, 'a', T`le produit scalaire calculé avec les coordonnées`],
  [T`Avec les normes et l'angle : l'angle de $\vec v$ à $\vec u$ vaut $a - b$, donc $\vec u \cdot \vec v = 1 \times 1 \times \cos(a - b)$.`, 'a', T`le produit scalaire calculé avec l'angle`],
  [T`En égalant les deux expressions : $\cos(a - b) = \cos a\cos b + \sin a\sin b$.`, 'bc', T`la formule pour $\cos(a - b)$`],
  [T`En remplaçant $b$ par $-b$, et comme $\cos(-b) = \cos b$ et $\sin(-b) = -\sin b$ : $\cos(a + b) = \cos a\cos b - \sin a\sin b$.`, 'd'] ], [
  [T`Le cosinus d'une différence est la différence des cosinus : $\cos(a - b) = \cos a - \cos b$.`, T`Le cosinus n'est pas une fonction linéaire. Pour $a = b$, on obtiendrait $\cos 0 = 0$, alors que $\cos 0 = 1$.`],
  [T`Avec les coordonnées : $\vec u \cdot \vec v = \cos a\sin a + \cos b\sin b$.`, T`Dans un repère orthonormé, $\vec u \cdot \vec v = xx' + yy'$ : on multiplie les abscisses entre elles et les ordonnées entre elles, et non les deux coordonnées d'un même vecteur.`] ]),
demo('conjugue-produit', 'expertes', '', 'me-02', 'Conjugué d\'un produit et d\'un inverse', T`Pour tous nombres complexes $z$ et $z'$ : $\overline{zz'} = \overline z\,\overline{z'}$ ; et si $z \neq 0$, $\overline{\left(\dfrac1z\right)} = \dfrac{1}{\overline z}$.`, [
  [T`Écrivons $z = a + ib$ et $z' = a' + ib'$, avec $a, b, a', b'$ réels. Alors $zz' = (aa' - bb') + i(ab' + a'b)$.`, '', T`la forme algébrique de $zz'$`],
  [T`Donc $\overline{zz'} = (aa' - bb') - i(ab' + a'b)$.`, 'a', T`la forme algébrique de $\overline{zz'}$`],
  [T`De son côté, $\overline z\,\overline{z'} = (a - ib)(a' - ib') = (aa' - bb') - i(ab' + a'b)$.`, 'a', T`la forme algébrique de $\overline z\,\overline{z'}$`],
  [T`Les deux nombres ont la même partie réelle et la même partie imaginaire : $\overline{zz'} = \overline z\,\overline{z'}$.`, 'bc', T`l'égalité $\overline{zz'} = \overline z\,\overline{z'}$`],
  [T`Si $z \neq 0$, appliquons ce résultat à $z$ et $\dfrac1z$ : $\overline z \times \overline{\left(\dfrac1z\right)} = \overline{1} = 1$, donc $\overline{\left(\dfrac1z\right)} = \dfrac{1}{\overline z}$.`, 'd'] ], [
  [T`De son côté, $\overline z\,\overline{z'} = (a - ib)(a' - ib') = (aa' + bb') - i(ab' + a'b)$.`, T`Le produit $(-ib)(-ib')$ vaut $i^2 bb' = -bb'$ : la partie réelle est $aa' - bb'$. Le signe vient de $i^2 = -1$, pas des deux signes moins, qui se compensent.`],
  [T`Le conjugué change tous les signes : $\overline{zz'} = -zz'$.`, T`La conjugaison ne change que le signe de la partie imaginaire. L'égalité $\overline w = -w$ caractérise les imaginaires purs.`] ]),
demo('chemins', 'expertes', '', 'me-06', 'Nombre de chemins et puissances de la matrice d\'adjacence', T`Soit un graphe de sommets numérotés de 1 à $p$ et $A = (a_{ij})$ sa matrice d'adjacence. Pour tout entier $n \geqslant 1$, le coefficient d'indices $(i, j)$ de $A^n$ est le nombre de chemins de longueur $n$ allant du sommet $i$ au sommet $j$.`, [
  [T`Pour tout entier $n \geqslant 1$, notons $P(n)$ : « pour tous sommets $i$ et $j$, le coefficient $(i, j)$ de $A^n$ est le nombre de chemins de longueur $n$ de $i$ à $j$ ».`, '', T`la propriété $P(n)$`],
  [T`Initialisation : par définition, $a_{ij}$ est le nombre d'arêtes de $i$ à $j$, c'est-à-dire le nombre de chemins de longueur 1. Donc $P(1)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 1$ tel que $P(n)$ soit vraie. Un chemin de longueur $n + 1$ de $i$ à $j$ est formé d'un chemin de longueur $n$ de $i$ à un sommet $k$, suivi d'une arête de $k$ à $j$.`, 'a', T`la décomposition d'un chemin de longueur $n + 1$`],
  [T`Pour un sommet $k$ fixé, il y a, d'après $P(n)$ et le principe multiplicatif, $(A^n)_{ik} \times a_{kj}$ chemins de cette sorte.`, 'c', T`le nombre de chemins dont l'avant-dernier sommet est $k$`],
  [T`En additionnant sur tous les sommets $k$, le nombre de chemins de longueur $n + 1$ de $i$ à $j$ est $\displaystyle\sum_{k=1}^{p} (A^n)_{ik}\,a_{kj}$ : c'est le coefficient $(i, j)$ du produit $A^n \times A = A^{n+1}$. Donc $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 1$.`, 'be'] ], [
  [T`Pour un sommet $k$ fixé, il y a $(A^n)_{ik} + a_{kj}$ chemins de cette sorte.`, T`Chaque chemin de $i$ à $k$ peut être prolongé par chaque arête de $k$ à $j$ : les possibilités se multiplient. S'il n'y a aucune arête de $k$ à $j$, il n'y a aucun chemin de cette sorte, ce que la somme ne donnerait pas.`],
  [T`Le coefficient $(i, j)$ de $A^n$ est $(a_{ij})^n$.`, T`On n'élève pas une matrice à une puissance en élevant chacun de ses coefficients : le produit matriciel mêle lignes et colonnes. C'est ce mélange qui fait passer par les sommets intermédiaires.`] ]),
demo('markov-transition', 'expertes', '', 'me-09', 'Chaîne de Markov : distribution après n transitions', T`Soit une chaîne de Markov à $p$ états, de matrice de transition $P = (p_{ij})$, où $p_{ij}$ est la probabilité de passer de l'état $i$ à l'état $j$, et $\pi_n$ la matrice ligne des probabilités des états après $n$ transitions. Alors $\pi_{n+1} = \pi_n P$, et $\pi_n = \pi_0 P^n$.`, [
  [T`Notons $X_n$ l'état après $n$ transitions. Les événements $(X_n = 1), \dots, (X_n = p)$ forment un système complet.`, '', T`le système complet des événements $(X_n = i)$`],
  [T`D'après la formule des probabilités totales, $P(X_{n+1} = j) = \displaystyle\sum_{i=1}^{p} P(X_n = i) \times P_{(X_n = i)}(X_{n+1} = j)$.`, 'a', T`la formule des probabilités totales pour $P(X_{n+1} = j)$`],
  [T`Par définition de la matrice de transition, $P_{(X_n = i)}(X_{n+1} = j) = p_{ij}$ : en notant $\pi_n(i) = P(X_n = i)$, on obtient $\pi_{n+1}(j) = \displaystyle\sum_{i=1}^{p} \pi_n(i)\,p_{ij}$.`, 'b', T`l'égalité $\pi_{n+1}(j) = \sum \pi_n(i)\,p_{ij}$`],
  [T`C'est le coefficient d'indice $j$ du produit de la ligne $\pi_n$ par la matrice $P$ : donc $\pi_{n+1} = \pi_n P$.`, 'c', T`la relation $\pi_{n+1} = \pi_n P$`],
  [T`Par une récurrence immédiate, $\pi_n = \pi_0 P^n$ pour tout entier $n \geqslant 0$.`, 'd'] ], [
  [T`C'est le coefficient d'indice $j$ du produit $P\pi_n$ : donc $\pi_{n+1} = P\pi_n$.`, T`Le produit d'une matrice carrée par une matrice ligne placée à sa droite n'est pas défini dès que $p \geqslant 2$. Avec la convention des lignes, la distribution se place à gauche : $\pi_{n+1} = \pi_n P$.`],
  [T`D'après la formule des probabilités totales, $P(X_{n+1} = j) = \displaystyle\sum_{i=1}^{p} p_{ij}$.`, T`Chaque probabilité de transition doit être pondérée par la probabilité $P(X_n = i)$ d'être dans l'état de départ. La somme des $p_{ij}$ sur $i$ peut d'ailleurs dépasser 1.`] ]),
demo('triangulaire-complexe', 'expertes', '', 'me-02', 'Inégalité triangulaire', T`Pour tous nombres complexes $z$ et $z'$ : $|z + z'| \leqslant |z| + |z'|$.`, [
  [T`On a $|z + z'|^2 = (z + z')(\overline z + \overline{z'}) = |z|^2 + z\overline{z'} + \overline z z' + |z'|^2$.`, '', T`le développement de $|z + z'|^2$`],
  [T`Or $\overline z z'$ est le conjugué de $z\overline{z'}$ : leur somme vaut $2\,\mathrm{Re}(z\overline{z'})$.`, 'a', T`l'égalité $z\overline{z'} + \overline z z' = 2\,\mathrm{Re}(z\overline{z'})$`],
  [T`Pour tout complexe $w$, $\mathrm{Re}(w) \leqslant |w|$ ; et $|z\overline{z'}| = |z|\,|z'|$. Donc $|z + z'|^2 \leqslant |z|^2 + 2|z|\,|z'| + |z'|^2 = \bigl(|z| + |z'|\bigr)^2$.`, 'b', T`l'inégalité $|z + z'|^2 \leqslant (|z| + |z'|)^2$`],
  [T`Les nombres $|z + z'|$ et $|z| + |z'|$ sont des réels positifs, et la fonction carré est strictement croissante sur $[0, +\infty[$ : donc $|z + z'| \leqslant |z| + |z'|$.`, 'c'] ], [
  [T`Pour tout complexe $w$, $\mathrm{Re}(w) = |w|$.`, T`C'est faux en général : pour $w = i$, la partie réelle est 0 et le module 1. On a seulement $\mathrm{Re}(w) \leqslant |w|$, avec égalité lorsque $w$ est un réel positif.`],
  [T`On a $|z + z'|^2 = |z|^2 + |z'|^2$.`, T`Il manque les termes mixtes $z\overline{z'} + \overline z z'$. L'égalité écrite n'est vraie que si $\mathrm{Re}(z\overline{z'}) = 0$, c'est-à-dire si les vecteurs images sont orthogonaux : c'est le théorème de Pythagore.`] ]),
demo('division-existence', 'expertes', '', 'me-01', 'Existence de la division euclidienne', T`Soit $a$ un entier naturel et $b$ un entier strictement positif. Il existe deux entiers $q$ et $r$ tels que $a = bq + r$ et $0 \leqslant r < b$.`, [
  [T`L'ensemble des entiers naturels $k$ tels que $bk \leqslant a$ contient 0, et tous ses éléments sont inférieurs ou égaux à $a$, puisque $k \leqslant bk$ : c'est une partie non vide et majorée de $\mathbb{N}$, qui a un plus grand élément $q$.`, '', T`l'entier $q$, plus grand entier tel que $bq \leqslant a$`],
  [T`Par définition de $q$ : $bq \leqslant a$, et $b(q + 1) > a$.`, 'a', T`l'encadrement $bq \leqslant a < b(q + 1)$`],
  [T`Posons $r = a - bq$. En retranchant $bq$ dans l'encadrement précédent : $0 \leqslant r < b$.`, 'b', T`l'entier $r$ et son encadrement`],
  [T`On a donc $a = bq + r$, avec $0 \leqslant r < b$.`, 'c'] ], [
  [T`Cet ensemble a un plus petit élément $q$, et l'on pose $r = a - bq$.`, T`Le plus petit élément de cet ensemble est 0 : on obtiendrait $q = 0$ et $r = a$, qui peut dépasser $b$. C'est le plus <em>grand</em> multiple de $b$ inférieur ou égal à $a$ qu'il faut retrancher.`],
  [T`Comme $bq \leqslant a$, l'entier $r = a - bq$ vérifie $r < b$.`, T`L'inégalité $bq \leqslant a$ donne seulement $r \geqslant 0$. La majoration $r < b$ vient de l'autre inégalité, $a < b(q + 1)$, c'est-à-dire du fait que $q$ est le plus grand possible.`] ]),
demo('decomposition-existence', 'expertes', '', 'me-01', 'Existence de la décomposition en facteurs premiers', T`Tout entier $n \geqslant 2$ est un produit de nombres premiers (éventuellement réduit à un seul facteur).`, [
  [T`Raisonnons par l'absurde : supposons qu'il existe des entiers supérieurs ou égaux à 2 qui ne sont pas des produits de nombres premiers, et soit $n$ le plus petit d'entre eux.`, '', T`l'entier $n$, plus petit contre-exemple`],
  [T`L'entier $n$ n'est pas premier, sinon il serait un produit réduit à un seul facteur premier : il s'écrit $n = ab$ avec $1 < a < n$ et $1 < b < n$.`, 'a', T`la factorisation $n = ab$`],
  [T`Les entiers $a$ et $b$ sont supérieurs ou égaux à 2 et strictement inférieurs à $n$ : par définition de $n$, chacun d'eux est un produit de nombres premiers.`, 'b', T`le fait que $a$ et $b$ sont des produits de nombres premiers`],
  [T`Alors $n = ab$ est lui aussi un produit de nombres premiers : contradiction. Tout entier $n \geqslant 2$ est donc un produit de nombres premiers.`, 'c'] ], [
  [T`L'entier $n$ n'est pas premier : il s'écrit $n = ab$, où $a$ et $b$ sont premiers.`, T`Un entier qui n'est pas premier est un produit de deux entiers plus petits, qui n'ont aucune raison d'être premiers : $12 = 2 \times 6$. C'est pour cela qu'il faut appliquer le résultat à $a$ et à $b$.`],
  [T`Soit $n$ le plus grand des entiers qui ne sont pas des produits de nombres premiers.`, T`Rien ne garantit qu'un tel ensemble d'entiers ait un plus grand élément. Une partie non vide de $\mathbb{N}$ a toujours un plus <em>petit</em> élément, et c'est lui qui permet de conclure.`] ]),
];
