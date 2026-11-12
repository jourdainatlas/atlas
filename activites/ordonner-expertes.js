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
  [T`Le produit matriciel étant commutatif, $B(AC) = (AC)B = B$.`, T`Le produit de deux matrices n'est pas commutatif en général. La propriété utilisée ici est l'associativité, qui permet de déplacer les parenthèses sans changer l'ordre des facteurs.`],
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
  [T`Chaque sommet est relié à tous les autres : si le graphe a $n$ sommets, la somme des degrés vaut $n(n - 1)$.`, T`Ce n'est vrai que pour un graphe complet. Dans un graphe quelconque, les degrés sont différents d'un sommet à l'autre, et l'on ne peut que les additionner.`] ]),
];
