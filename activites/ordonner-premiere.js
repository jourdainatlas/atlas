// Démonstrations à remettre en ordre : Première (MEMO_atlas_activites.md §145).
import { T, demo } from './raisonner-outils.js';
export default [
demo('canonique', 'premiere', '', 'p-01', 'Forme canonique du trinôme', T`Pour tous réels $a \neq 0$, $b$, $c$ et tout réel $x$ : $ax^2 + bx + c = a\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{\Delta}{4a}$, où $\Delta = b^2 - 4ac$.`, [
  [T`Comme $a \neq 0$, on met $a$ en facteur dans les deux premiers termes : $ax^2 + bx + c = a\left(x^2 + \dfrac ba x\right) + c$.`, '', T`la mise en facteur de $a$`],
  [T`Or $x^2 + \dfrac ba x$ est le début d'un carré : $x^2 + \dfrac ba x = \left(x + \dfrac{b}{2a}\right)^2 - \dfrac{b^2}{4a^2}$.`, 'a', T`l'écriture de $x^2 + \frac ba x$ à l'aide d'un carré`],
  [T`En reportant et en développant : $ax^2 + bx + c = a\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{b^2}{4a} + c$.`, 'b', T`l'expression avec le terme $-\frac{b^2}{4a} + c$`],
  [T`Enfin $-\dfrac{b^2}{4a} + c = -\dfrac{b^2 - 4ac}{4a} = -\dfrac{\Delta}{4a}$, ce qui donne la formule annoncée.`, 'c'] ], [
  [T`Or $x^2 + \dfrac ba x = \left(x + \dfrac ba\right)^2 - \dfrac{b^2}{a^2}$.`, T`Le développement de $\left(x + \frac ba\right)^2$ donne $x^2 + \frac{2b}{a}x + \frac{b^2}{a^2}$ : le double produit vaut $\frac{2b}{a}x$, et non $\frac ba x$. Il faut prendre la moitié du coefficient de $x$, soit $\frac{b}{2a}$.`],
  [T`Enfin $-\dfrac{b^2}{4a} + c = -\dfrac{b^2 - c}{4a}$.`, T`Pour mettre $c$ au dénominateur $4a$, il faut l'écrire $\frac{4ac}{4a}$ : on obtient $-\frac{b^2 - 4ac}{4a}$.`] ]),
demo('deux-racines', 'premiere', '', 'p-01', 'Deux racines quand Δ > 0', T`Soit $a \neq 0$. Si $\Delta = b^2 - 4ac > 0$, l'équation $ax^2 + bx + c = 0$ a exactement deux solutions, $\dfrac{-b - \sqrt\Delta}{2a}$ et $\dfrac{-b + \sqrt\Delta}{2a}$.`, [
  [T`D'après la forme canonique, $ax^2 + bx + c = a\left[\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{\Delta}{4a^2}\right]$.`, '', T`la forme canonique`],
  [T`Comme $\Delta > 0$, on peut écrire $\dfrac{\Delta}{4a^2} = \left(\dfrac{\sqrt\Delta}{2a}\right)^2$.`, '', T`l'écriture de $\frac{\Delta}{4a^2}$ comme un carré`],
  [T`La différence de deux carrés se factorise : $ax^2 + bx + c = a\left(x + \dfrac{b - \sqrt\Delta}{2a}\right)\left(x + \dfrac{b + \sqrt\Delta}{2a}\right)$.`, 'ab', T`la forme factorisée`],
  [T`Un produit est nul si et seulement si l'un de ses facteurs est nul, et $a \neq 0$ : les solutions sont $\dfrac{-b + \sqrt\Delta}{2a}$ et $\dfrac{-b - \sqrt\Delta}{2a}$.`, 'c', T`les deux solutions`],
  [T`Ces deux nombres sont distincts, puisque $\sqrt\Delta \neq 0$ : l'équation a exactement deux solutions.`, 'd'] ], [
  [T`Comme $\Delta > 0$, l'expression $\left(x + \dfrac{b}{2a}\right)^2 - \dfrac{\Delta}{4a^2}$ est strictement positive pour tout $x$ : l'équation n'a pas de solution.`, T`On retranche un nombre strictement positif à un carré : le résultat peut être négatif, nul ou positif selon $x$. C'est quand $\Delta < 0$ que l'expression, somme d'un carré et d'un nombre strictement positif, ne s'annule jamais.`],
  [T`Un produit est nul si et seulement si tous ses facteurs sont nuls : il faudrait $a = 0$, ce qui est exclu.`, T`Un produit est nul dès que <em>l'un</em> de ses facteurs est nul, et non seulement quand tous le sont.`] ]),
demo('somme-entiers', 'premiere', '', 'p-02', 'Somme des n premiers entiers', T`Pour tout entier $n \geqslant 1$ : $1 + 2 + \dots + n = \dfrac{n(n+1)}{2}$.`, [
  [T`Notons $S = 1 + 2 + \dots + (n-1) + n$.`, '', T`la somme $S$`],
  [T`En écrivant les termes dans l'ordre inverse : $S = n + (n-1) + \dots + 2 + 1$.`, 'a', T`l'écriture de $S$ dans l'ordre inverse`],
  [T`Additionnons les deux écritures terme à terme : $2S = (1 + n) + (2 + n - 1) + \dots + (n + 1)$, et chaque parenthèse vaut $n + 1$.`, 'b', T`l'addition terme à terme des deux écritures`],
  [T`Il y a $n$ parenthèses : $2S = n(n+1)$.`, 'c', T`l'égalité $2S = n(n+1)$`],
  [T`Donc $S = \dfrac{n(n+1)}{2}$.`, 'd'] ], [
  [T`Il y a $n + 1$ parenthèses : $2S = (n+1)^2$.`, T`La somme $S$ compte $n$ termes, de 1 à $n$ : il y a donc $n$ parenthèses, et non $n + 1$. Pour $n = 3$, on aurait $2S = 16$ au lieu de $12$.`],
  [T`Additionnons les deux écritures : $2S = 2(1 + n)$.`, T`On n'a additionné que les premiers termes des deux écritures. L'addition porte sur les $n$ colonnes.`] ]),
demo('somme-geometrique', 'premiere', '', 'p-02', 'Somme des termes d\'une suite géométrique', T`Pour tout réel $q \neq 1$ et tout entier $n \geqslant 0$ : $1 + q + q^2 + \dots + q^n = \dfrac{1 - q^{n+1}}{1 - q}$.`, [
  [T`Notons $S = 1 + q + q^2 + \dots + q^n$.`, '', T`la somme $S$`],
  [T`En multipliant par $q$ : $qS = q + q^2 + \dots + q^n + q^{n+1}$.`, 'a', T`l'expression de $qS$`],
  [T`En retranchant, tous les termes de $q$ à $q^n$ se simplifient : $S - qS = 1 - q^{n+1}$.`, 'b', T`la différence $S - qS$`],
  [T`Autrement dit, $(1 - q)S = 1 - q^{n+1}$.`, 'c', T`l'égalité $(1-q)S = 1 - q^{n+1}$`],
  [T`Comme $q \neq 1$, on peut diviser par $1 - q$ : $S = \dfrac{1 - q^{n+1}}{1 - q}$.`, 'd'] ], [
  [T`En retranchant : $S - qS = 1 - q^n$.`, T`Le dernier terme de $qS$ est $q \times q^n = q^{n+1}$ : c'est lui qui reste, et non $q^n$, qui figure dans les deux sommes et se simplifie.`],
  [T`On peut toujours diviser par $1 - q$ : $S = \dfrac{1 - q^{n+1}}{1 - q}$ pour tout réel $q$.`, T`Pour $q = 1$, on diviserait par zéro. Dans ce cas la somme vaut simplement $n + 1$, et la formule n'a pas de sens : l'hypothèse $q \neq 1$ est indispensable.`] ]),
demo('derivee-carre', 'premiere', '', 'p-04', 'Dérivée de la fonction carré', T`La fonction $f : x \mapsto x^2$ est dérivable en tout réel $a$, et $f'(a) = 2a$.`, [
  [T`Soit $a$ un réel et $h \neq 0$. Le taux de variation de $f$ entre $a$ et $a + h$ est $\dfrac{(a+h)^2 - a^2}{h}$.`, '', T`le taux de variation`],
  [T`Or $(a + h)^2 - a^2 = 2ah + h^2$.`, 'a', T`le calcul de $(a+h)^2 - a^2$`],
  [T`Le taux de variation vaut donc $\dfrac{2ah + h^2}{h} = 2a + h$, puisque $h \neq 0$.`, 'ab', T`l'expression simplifiée $2a + h$ du taux`],
  [T`Quand $h$ tend vers 0, $2a + h$ tend vers $2a$.`, 'c', T`la limite du taux de variation`],
  [T`Le taux de variation a une limite finie : $f$ est dérivable en $a$, et $f'(a) = 2a$.`, 'd'] ], [
  [T`Or $(a + h)^2 - a^2 = h^2$.`, T`L'identité remarquable donne $(a+h)^2 = a^2 + 2ah + h^2$ : le double produit $2ah$ ne disparaît pas. C'est lui qui fournit la dérivée.`],
  [T`Pour $h = 0$, le taux de variation vaut $\dfrac{0}{0}$, c'est-à-dire $2a$.`, T`Le taux de variation n'est pas défini pour $h = 0$, et $\frac00$ n'est pas un nombre. La dérivée est la <em>limite</em> du taux quand $h$ tend vers 0, sans jamais le valoir.`] ]),
demo('derivee-inverse', 'premiere', '', 'p-04', 'Dérivée de la fonction inverse', T`La fonction $f : x \mapsto \dfrac1x$ est dérivable en tout réel $a \neq 0$, et $f'(a) = -\dfrac{1}{a^2}$.`, [
  [T`Soit $a \neq 0$, et $h \neq 0$ assez petit pour que $a + h \neq 0$. Le taux de variation est $\dfrac1h\left(\dfrac{1}{a+h} - \dfrac1a\right)$.`, '', T`le taux de variation`],
  [T`En réduisant au même dénominateur : $\dfrac{1}{a+h} - \dfrac1a = \dfrac{a - (a+h)}{a(a+h)} = \dfrac{-h}{a(a+h)}$.`, 'a', T`le calcul de $\frac{1}{a+h} - \frac1a$`],
  [T`Le taux de variation vaut donc $\dfrac{-1}{a(a+h)}$.`, 'ab', T`l'expression simplifiée du taux`],
  [T`Quand $h$ tend vers 0, $a(a + h)$ tend vers $a^2$, qui n'est pas nul : le taux tend vers $-\dfrac{1}{a^2}$.`, 'c', T`la limite du taux de variation`],
  [T`Donc $f$ est dérivable en $a$, et $f'(a) = -\dfrac{1}{a^2}$.`, 'd'] ], [
  [T`En réduisant au même dénominateur : $\dfrac{1}{a+h} - \dfrac1a = \dfrac{1}{h}$.`, T`On ne soustrait pas des fractions en soustrayant leurs dénominateurs. Le dénominateur commun est $a(a+h)$, et le numérateur vaut $a - (a + h) = -h$.`],
  [T`Quand $h$ tend vers 0, le taux de variation $\dfrac{-1}{a(a+h)}$ tend vers 0.`, T`C'est $h$ qui tend vers 0, pas le taux : le dénominateur $a(a+h)$ tend vers $a^2$, donc le taux tend vers $-\frac{1}{a^2}$, qui n'est pas nul.`] ]),
demo('derivee-produit', 'premiere', '', 'p-04', 'Dérivée d\'un produit', T`Si $u$ et $v$ sont deux fonctions dérivables en $a$, alors $uv$ est dérivable en $a$, et $(uv)'(a) = u'(a)v(a) + u(a)v'(a)$.`, [
  [T`Pour $h \neq 0$, le taux de variation de $uv$ est $\dfrac{u(a+h)v(a+h) - u(a)v(a)}{h}$.`, '', T`le taux de variation de $uv$`],
  [T`En retranchant puis en ajoutant $u(a)v(a+h)$ au numérateur, ce taux s'écrit $\dfrac{u(a+h) - u(a)}{h}\,v(a+h) + u(a)\,\dfrac{v(a+h) - v(a)}{h}$.`, 'a', T`la décomposition du taux en deux termes`],
  [T`Quand $h$ tend vers 0, les taux de variation de $u$ et de $v$ tendent vers $u'(a)$ et $v'(a)$ ; et $v(a + h)$ tend vers $v(a)$, car une fonction dérivable en $a$ est continue en $a$.`, '', T`les trois limites nécessaires`],
  [T`Par somme et produit de limites, le taux de variation de $uv$ tend vers $u'(a)v(a) + u(a)v'(a)$.`, 'bc', T`la limite du taux de variation de $uv$`],
  [T`Donc $uv$ est dérivable en $a$, et $(uv)'(a) = u'(a)v(a) + u(a)v'(a)$.`, 'd'] ], [
  [T`La dérivée d'un produit est le produit des dérivées : le taux de variation de $uv$ tend vers $u'(a)v'(a)$.`, T`C'est l'erreur la plus répandue sur les dérivées. Avec $u(x) = v(x) = x$, le produit est $x^2$, de dérivée $2x$, alors que $u'(x)v'(x) = 1$.`],
  [T`Comme $v(a + h) = v(a)$ pour tout $h$, le premier terme vaut $\dfrac{u(a+h) - u(a)}{h}\,v(a)$.`, T`La fonction $v$ n'est pas constante : $v(a+h)$ diffère en général de $v(a)$. On sait seulement que $v(a+h)$ <em>tend vers</em> $v(a)$, par continuité.`] ]),
demo('exp-non-nulle', 'premiere', '', 'p-08', 'L\'exponentielle ne s\'annule pas', T`Pour tout réel $x$, $\exp(x) \times \exp(-x) = 1$ ; en particulier, $\exp(x) \neq 0$.`, [
  [T`Considérons la fonction $\varphi$ définie sur $\mathbb{R}$ par $\varphi(x) = \exp(x) \times \exp(-x)$.`, '', T`la fonction $\varphi$`],
  [T`Elle est dérivable, et $\varphi'(x) = \exp(x)\exp(-x) + \exp(x) \times \bigl(-\exp(-x)\bigr) = 0$.`, 'a', T`le calcul $\varphi' = 0$`],
  [T`Une fonction de dérivée nulle sur $\mathbb{R}$ est constante : $\varphi(x) = \varphi(0) = \exp(0)^2 = 1$ pour tout $x$.`, 'b', T`le fait que $\varphi$ est constante égale à 1`],
  [T`Ainsi $\exp(x) \times \exp(-x) = 1$ pour tout réel $x$.`, 'c', T`l'égalité $\exp(x)\exp(-x) = 1$`],
  [T`Si l'on avait $\exp(x) = 0$ pour un réel $x$, ce produit serait nul, et non égal à 1 : donc $\exp(x) \neq 0$.`, 'd'] ], [
  [T`Elle est dérivable, et $\varphi'(x) = \exp(x)\exp(-x) + \exp(x)\exp(-x) = 2\varphi(x)$.`, T`La dérivée de $x \mapsto \exp(-x)$ est $x \mapsto -\exp(-x)$ : il faut multiplier par la dérivée de $x \mapsto -x$, qui vaut $-1$. Le second terme est donc précédé d'un signe moins.`],
  [T`Comme $\exp(0) = 1$, on a $\exp(x) = 1$ pour tout réel $x$.`, T`Connaître une fonction en 0 ne la détermine pas ailleurs. C'est $\varphi$ qui est constante, parce que sa dérivée est nulle ; l'exponentielle, elle, est égale à sa dérivée et n'est pas constante.`] ]),
demo('al-kashi', 'premiere', '', 'p-07', 'Formule d\'Al-Kashi', T`Dans un triangle $ABC$, avec $a = BC$, $b = AC$, $c = AB$ : $a^2 = b^2 + c^2 - 2bc\cos\widehat{A}$.`, [
  [T`D'après la relation de Chasles, $\overrightarrow{BC} = \overrightarrow{AC} - \overrightarrow{AB}$.`, '', T`l'écriture de $\overrightarrow{BC}$`],
  [T`Donc $BC^2 = \overrightarrow{BC} \cdot \overrightarrow{BC} = \bigl(\overrightarrow{AC} - \overrightarrow{AB}\bigr) \cdot \bigl(\overrightarrow{AC} - \overrightarrow{AB}\bigr)$.`, 'a', T`l'écriture de $BC^2$ comme un produit scalaire`],
  [T`En développant par bilinéarité : $BC^2 = AC^2 - 2\,\overrightarrow{AB} \cdot \overrightarrow{AC} + AB^2$.`, 'b', T`le développement de $BC^2$`],
  [T`Par définition du produit scalaire, $\overrightarrow{AB} \cdot \overrightarrow{AC} = AB \times AC \times \cos\widehat{A}$.`, '', T`l'expression du produit scalaire avec le cosinus`],
  [T`En reportant : $a^2 = b^2 + c^2 - 2bc\cos\widehat{A}$.`, 'cd'] ], [
  [T`En développant : $BC^2 = AC^2 - AB^2$.`, T`Le carré d'une différence n'est pas la différence des carrés : il manque le double produit $-2\,\overrightarrow{AB} \cdot \overrightarrow{AC}$, et le signe de $AB^2$ est positif.`],
  [T`Par définition du produit scalaire, $\overrightarrow{AB} \cdot \overrightarrow{AC} = AB \times AC$.`, T`Cette égalité n'est vraie que si les vecteurs sont colinéaires et de même sens. En général, le produit scalaire fait intervenir le cosinus de l'angle : c'est ce qui le distingue du produit des longueurs.`] ]),
demo('independance-contraire', 'premiere', '', 'p-05', 'Indépendance et événement contraire', T`Si deux événements $A$ et $B$ sont indépendants, alors $A$ et $\overline{B}$ sont indépendants.`, [
  [T`Les événements $A \cap B$ et $A \cap \overline{B}$ sont incompatibles, et leur réunion est $A$ : donc $P(A) = P(A \cap B) + P(A \cap \overline{B})$.`, '', T`la décomposition de $P(A)$`],
  [T`Comme $A$ et $B$ sont indépendants, $P(A \cap B) = P(A)\,P(B)$.`, '', T`l'égalité $P(A \cap B) = P(A)P(B)$`],
  [T`Donc $P(A \cap \overline{B}) = P(A) - P(A)\,P(B) = P(A)\bigl(1 - P(B)\bigr)$.`, 'ab', T`le calcul de $P(A \cap \overline{B})$`],
  [T`Or $1 - P(B) = P(\overline{B})$ : ainsi $P(A \cap \overline{B}) = P(A)\,P(\overline{B})$, et $A$ et $\overline{B}$ sont indépendants.`, 'c'] ], [
  [T`Comme $A$ et $B$ sont indépendants, ils ne peuvent pas se produire en même temps : $P(A \cap B) = 0$.`, T`C'est la confusion entre « indépendants » et « incompatibles ». Deux événements indépendants de probabilités non nulles se produisent ensemble avec la probabilité $P(A)P(B)$, qui n'est pas nulle.`],
  [T`Donc $P(A \cap \overline{B}) = P(A) - P(B)$.`, T`On retranche à $P(A)$ la probabilité de $A \cap B$, et non celle de $B$ tout entier : une partie de $B$ peut se trouver hors de $A$.`] ]),
];
