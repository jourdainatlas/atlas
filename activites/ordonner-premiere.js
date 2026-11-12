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
// ---------- Ajouts du 12 nov. (audit des programmes, §146) ----------
demo('racine-non-derivable', 'premiere', '', 'p-04', 'La racine carrée n\'est pas dérivable en 0', T`La fonction $f : x \mapsto \sqrt x$ n'est pas dérivable en 0.`, [
  [T`Pour $h > 0$, le taux de variation de $f$ entre 0 et $h$ est $\dfrac{\sqrt h - \sqrt 0}{h} = \dfrac{\sqrt h}{h}$.`, '', T`le taux de variation $\dfrac{\sqrt h}{h}$`],
  [T`Comme $h = \sqrt h \times \sqrt h$, ce taux vaut $\dfrac{1}{\sqrt h}$.`, 'a', T`l'écriture du taux sous la forme $\dfrac{1}{\sqrt h}$`],
  [T`Soit $A > 0$ un réel quelconque. Dès que $0 < h < \dfrac{1}{A^2}$, on a $\sqrt h < \dfrac1A$, donc $\dfrac{1}{\sqrt h} > A$.`, 'b', T`le fait que le taux dépasse tout réel $A$ donné`],
  [T`Le taux de variation dépasse donc n'importe quel réel pourvu que $h$ soit assez petit : il tend vers $+\infty$ quand $h$ tend vers 0, et n'a pas de limite finie.`, 'c', T`l'absence de limite finie du taux`],
  [T`La fonction racine carrée n'est donc pas dérivable en 0.`, 'd'] ], [
  [T`Ce taux vaut $\dfrac{\sqrt h}{h} = \sqrt h$, qui tend vers 0 : la fonction est dérivable en 0, de nombre dérivé 0.`, T`On a $\dfrac{\sqrt h}{h} = \dfrac{1}{\sqrt h}$, et non $\sqrt h$ : pour $h = 0{,}01$, le taux vaut 10. La courbe a d'ailleurs en 0 une tangente verticale, pas horizontale.`],
  [T`La formule $f'(x) = \dfrac{1}{2\sqrt x}$ n'a pas de sens pour $x = 0$ : cela suffit à prouver que $f$ n'est pas dérivable en 0.`, T`Cette formule n'a été établie que pour $x > 0$. Qu'une formule cesse d'avoir un sens ne dit rien de la fonction : il faut revenir à la définition, c'est-à-dire au taux de variation.`] ]),
demo('tangente', 'premiere', '', 'p-04', 'Équation de la tangente', T`Soit $f$ une fonction dérivable en $a$. La tangente à sa courbe au point d'abscisse $a$ a pour équation $y = f'(a)(x - a) + f(a)$.`, [
  [T`Par définition, la tangente est la droite qui passe par le point $A\bigl(a ; f(a)\bigr)$ et dont le coefficient directeur est $f'(a)$.`, '', T`la définition de la tangente`],
  [T`Son équation réduite est donc de la forme $y = f'(a)\,x + p$, où $p$ est un réel à déterminer.`, 'a', T`la forme $y = f'(a)x + p$ de l'équation`],
  [T`Le point $A$ appartient à la droite : $f(a) = f'(a) \times a + p$, d'où $p = f(a) - a f'(a)$.`, 'b', T`la valeur de $p$`],
  [T`L'équation s'écrit donc $y = f'(a)\,x + f(a) - a f'(a)$, c'est-à-dire $y = f'(a)(x - a) + f(a)$.`, 'c'] ], [
  [T`Le point $A$ appartient à la droite : donc $p = f(a)$.`, T`Le nombre $p$ est l'ordonnée à l'origine, c'est-à-dire l'ordonnée du point de la droite d'abscisse 0, et non celle du point $A$. Les deux ne coïncident que si $a = 0$.`],
  [T`Par définition, la tangente est la droite qui passe par $A$ et dont le coefficient directeur est $f(a)$.`, T`Le coefficient directeur de la tangente est le nombre dérivé $f'(a)$, limite des pentes des sécantes. Le nombre $f(a)$ est l'ordonnée du point de contact.`] ]),
demo('cercle-diametre', 'premiere', '', 'p-07', 'Cercle de diamètre [AB]', T`Soit $A$ et $B$ deux points distincts et $I$ le milieu de $[AB]$. L'ensemble des points $M$ tels que $\overrightarrow{MA} \cdot \overrightarrow{MB} = 0$ est le cercle de diamètre $[AB]$.`, [
  [T`Pour tout point $M$, la relation de Chasles donne $\overrightarrow{MA} = \overrightarrow{MI} + \overrightarrow{IA}$ et $\overrightarrow{MB} = \overrightarrow{MI} + \overrightarrow{IB}$.`, '', T`la décomposition de $\overrightarrow{MA}$ et $\overrightarrow{MB}$ par le point $I$`],
  [T`Comme $I$ est le milieu de $[AB]$, $\overrightarrow{IB} = -\overrightarrow{IA}$. Donc $\overrightarrow{MA} \cdot \overrightarrow{MB} = \bigl(\overrightarrow{MI} + \overrightarrow{IA}\bigr) \cdot \bigl(\overrightarrow{MI} - \overrightarrow{IA}\bigr)$.`, 'a', T`l'écriture du produit scalaire avec $\overrightarrow{MI}$ et $\overrightarrow{IA}$`],
  [T`En développant : $\overrightarrow{MA} \cdot \overrightarrow{MB} = MI^2 - IA^2$.`, 'b', T`l'égalité $\overrightarrow{MA} \cdot \overrightarrow{MB} = MI^2 - IA^2$`],
  [T`Ainsi $\overrightarrow{MA} \cdot \overrightarrow{MB} = 0$ équivaut à $MI^2 = IA^2$, c'est-à-dire à $MI = IA$, puisque ce sont des longueurs.`, 'c', T`l'équivalence avec $MI = IA$`],
  [T`L'ensemble cherché est donc le cercle de centre $I$ et de rayon $IA = \dfrac{AB}{2}$ : c'est le cercle de diamètre $[AB]$.`, 'd'] ], [
  [T`En développant : $\overrightarrow{MA} \cdot \overrightarrow{MB} = MI^2 + IA^2$.`, T`Le produit $(\vec u + \vec v) \cdot (\vec u - \vec v)$ vaut $\vec u^{\,2} - \vec v^{\,2}$ : les doubles produits s'éliminent et le second carré est précédé d'un signe moins. Avec un signe plus, le produit scalaire ne s'annulerait jamais.`],
  [T`Un produit scalaire est nul si et seulement si l'un des vecteurs est nul : $M = A$ ou $M = B$.`, T`Un produit scalaire est nul quand les vecteurs sont <em>orthogonaux</em>, ce qui ne demande pas que l'un d'eux soit nul. Les points $A$ et $B$ conviennent, mais ils sont loin d'être les seuls.`] ]),
demo('somme-produit-racines', 'premiere', '', 'p-01', 'Somme et produit des racines', T`Soit $a \neq 0$. Si le trinôme $ax^2 + bx + c$ a deux racines $x_1$ et $x_2$, éventuellement égales, alors $x_1 + x_2 = -\dfrac ba$ et $x_1 x_2 = \dfrac ca$.`, [
  [T`Le trinôme s'écrit sous forme factorisée : pour tout réel $x$, $ax^2 + bx + c = a(x - x_1)(x - x_2)$.`, '', T`la forme factorisée du trinôme`],
  [T`En développant : $a(x - x_1)(x - x_2) = ax^2 - a(x_1 + x_2)\,x + a\,x_1 x_2$.`, 'a', T`le développement de la forme factorisée`],
  [T`Deux polynômes égaux pour tout réel $x$ ont les mêmes coefficients : $b = -a(x_1 + x_2)$ et $c = a\,x_1 x_2$.`, 'b', T`les égalités $b = -a(x_1 + x_2)$ et $c = a\,x_1 x_2$`],
  [T`Comme $a \neq 0$, on divise par $a$ : $x_1 + x_2 = -\dfrac ba$ et $x_1 x_2 = \dfrac ca$.`, 'c'] ], [
  [T`Le trinôme s'écrit sous forme factorisée : $ax^2 + bx + c = (x - x_1)(x - x_2)$.`, T`Le coefficient $a$ a été oublié : le membre de droite a pour terme de plus haut degré $x^2$, et non $ax^2$. L'égalité n'est vraie que si $a = 1$.`],
  [T`Par identification, $b = a(x_1 + x_2)$, d'où $x_1 + x_2 = \dfrac ba$.`, T`Le coefficient de $x$ dans le développement est $-a(x_1 + x_2)$ : le signe moins vient des deux facteurs $(x - x_1)$ et $(x - x_2)$. Pour $x^2 - 3x + 2$, de racines 1 et 2, la somme est bien $3 = -\frac ba$.`] ]),
demo('exp-unicite', 'premiere', '', 'p-08', 'Unicité de la fonction exponentielle', T`Il existe au plus une fonction $f$ dérivable sur $\mathbb{R}$ telle que $f' = f$ et $f(0) = 1$. On utilise qu'une telle fonction ne s'annule pas.`, [
  [T`Soit $f$ et $g$ deux fonctions vérifiant ces conditions. Comme $g$ ne s'annule pas, on peut poser $h = \dfrac fg$.`, '', T`la fonction $h = \dfrac fg$`],
  [T`La fonction $h$ est dérivable sur $\mathbb{R}$, et $h' = \dfrac{f'g - fg'}{g^2} = \dfrac{fg - fg}{g^2} = 0$.`, 'a', T`le fait que $h'$ est nulle`],
  [T`La fonction $h$ est donc constante sur $\mathbb{R}$ : pour tout $x$, $h(x) = h(0) = \dfrac{f(0)}{g(0)} = 1$.`, 'b', T`le fait que $h$ est constante égale à 1`],
  [T`Ainsi $f(x) = g(x)$ pour tout réel $x$ : les deux fonctions sont égales.`, 'c'] ], [
  [T`La fonction $h$ est dérivable, et $h' = \dfrac{f'}{g'} = \dfrac fg = h$.`, T`La dérivée d'un quotient n'est pas le quotient des dérivées : $\left(\dfrac fg\right)' = \dfrac{f'g - fg'}{g^2}$.`],
  [T`Comme $f(0) = g(0)$, les fonctions $f$ et $g$ sont égales.`, T`Deux fonctions qui prennent la même valeur en un point peuvent différer partout ailleurs. C'est la condition $f' = f$, traduite par $h' = 0$, qui propage l'égalité à tout réel.`] ]),
demo('exp-somme', 'premiere', '', 'p-08', 'Exponentielle d\'une somme', T`Pour tous réels $a$ et $b$ : $\exp(a + b) = \exp(a) \times \exp(b)$. On utilise que $\exp(x) \times \exp(-x) = 1$ pour tout réel $x$.`, [
  [T`Soit $a$ un réel fixé. Considérons la fonction $\varphi$ définie sur $\mathbb{R}$ par $\varphi(x) = \exp(a + x) \times \exp(-x)$.`, '', T`la fonction $\varphi$`],
  [T`Elle est dérivable, et $\varphi'(x) = \exp(a + x)\exp(-x) - \exp(a + x)\exp(-x) = 0$.`, 'a', T`le fait que $\varphi'$ est nulle`],
  [T`La fonction $\varphi$ est donc constante : $\varphi(x) = \varphi(0) = \exp(a) \times \exp(0) = \exp(a)$ pour tout $x$.`, 'b', T`l'égalité $\exp(a + x)\exp(-x) = \exp(a)$`],
  [T`En multipliant les deux membres par $\exp(x)$, et comme $\exp(-x)\exp(x) = 1$ : $\exp(a + x) = \exp(a) \times \exp(x)$ pour tout réel $x$.`, 'c', T`l'égalité $\exp(a + x) = \exp(a)\exp(x)$`],
  [T`En particulier, pour $x = b$ : $\exp(a + b) = \exp(a) \times \exp(b)$.`, 'd'] ], [
  [T`La fonction $\varphi$ est donc constante : $\varphi(x) = \varphi(0) = \exp(0) = 1$ pour tout $x$.`, T`On a $\varphi(0) = \exp(a + 0) \times \exp(0) = \exp(a)$, et non 1 : le réel $a$ est toujours là. C'est lui qui fournit le facteur $\exp(a)$ du résultat.`],
  [T`L'exponentielle d'une somme est la somme des exponentielles : $\exp(a + x) = \exp(a) + \exp(x)$.`, T`Pour $a = x = 0$, on obtiendrait $1 = 2$. L'exponentielle transforme les sommes en produits.`] ]),
demo('totales-deux', 'premiere', '', 'p-05', 'Probabilités totales', T`Soit $A$ un événement tel que $0 < P(A) < 1$. Pour tout événement $B$ : $P(B) = P(A)\,P_A(B) + P(\overline A)\,P_{\overline A}(B)$.`, [
  [T`Les événements $B \cap A$ et $B \cap \overline A$ sont incompatibles, et leur réunion est $B$.`, '', T`le partage de $B$ en $B \cap A$ et $B \cap \overline A$`],
  [T`Donc $P(B) = P(B \cap A) + P(B \cap \overline A)$.`, 'a', T`l'égalité $P(B) = P(B \cap A) + P(B \cap \overline A)$`],
  [T`Par définition des probabilités conditionnelles, $P(B \cap A) = P(A)\,P_A(B)$ et $P(B \cap \overline A) = P(\overline A)\,P_{\overline A}(B)$.`, '', T`l'expression de $P(B \cap A)$ et de $P(B \cap \overline A)$`],
  [T`En reportant : $P(B) = P(A)\,P_A(B) + P(\overline A)\,P_{\overline A}(B)$.`, 'bc'] ], [
  [T`Donc $P(B) = P_A(B) + P_{\overline A}(B)$.`, T`Les probabilités conditionnelles doivent être pondérées par $P(A)$ et $P(\overline A)$ : sur un arbre, on multiplie le long des branches avant d'additionner. Si $B$ est l'événement certain, la formule écrite donnerait $1 = 2$.`],
  [T`Par définition des probabilités conditionnelles, $P(B \cap A) = P(A)\,P(B)$.`, T`Cette égalité caractérise l'indépendance de $A$ et $B$, qui n'est pas supposée. En général, c'est $P_A(B)$ qui intervient.`] ]),
demo('vecteur-normal', 'premiere', '', 'p-03', 'Vecteur normal à une droite', T`Soit $a$, $b$, $c$ trois réels, $a$ et $b$ n'étant pas tous deux nuls. Le vecteur $\vec n(a ; b)$ est normal à la droite $d$ d'équation $ax + by + c = 0$.`, [
  [T`Soit $A(x_A ; y_A)$ et $B(x_B ; y_B)$ deux points distincts de $d$ : $ax_A + by_A + c = 0$ et $ax_B + by_B + c = 0$.`, '', T`deux points $A$ et $B$ de la droite`],
  [T`En retranchant ces deux égalités : $a(x_B - x_A) + b(y_B - y_A) = 0$.`, 'a', T`l'égalité $a(x_B - x_A) + b(y_B - y_A) = 0$`],
  [T`Or le vecteur $\overrightarrow{AB}$ a pour coordonnées $(x_B - x_A ; y_B - y_A)$ : le membre de gauche est le produit scalaire $\vec n \cdot \overrightarrow{AB}$.`, 'b', T`l'égalité $\vec n \cdot \overrightarrow{AB} = 0$`],
  [T`Le vecteur $\vec n$ est donc orthogonal à $\overrightarrow{AB}$, qui dirige $d$ : il est normal à la droite $d$.`, 'c'] ], [
  [T`Le vecteur $\vec n(a ; b)$ est un vecteur directeur de $d$.`, T`Un vecteur directeur de la droite d'équation $ax + by + c = 0$ est $(-b ; a)$. Le vecteur $(a ; b)$ lui est orthogonal : $a \times (-b) + b \times a = 0$.`],
  [T`En retranchant ces deux égalités : $a(x_B - x_A) + b(y_B - y_A) + 2c = 0$.`, T`Le terme $c$ figure dans les deux égalités avec le même signe : il s'élimine dans la différence. C'est pourquoi la direction de la droite ne dépend pas de $c$.`] ]),
];
