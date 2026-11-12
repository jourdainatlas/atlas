// Démonstrations à remettre en ordre : Maths Sup, soixante-huit pièces classées par thème (MEMO_atlas_activites.md §145 et §146).
import { T, demo } from './raisonner-outils.js';
const F = 'fondements', A = 'algebre', L = 'lineaire', N = 'analyse', Pr = 'probabilites';
export default [
// ---------- Fondements ----------
demo('composee-injective', 'sup', F, 'ma-02', 'Si g ∘ f est injective, f l\'est', T`Soit $f : E \to F$ et $g : F \to G$ deux applications. Si $g \circ f$ est injective, alors $f$ est injective.`, [
  [T`Soit $x$ et $x'$ deux éléments de $E$ tels que $f(x) = f(x')$.`, '', T`deux éléments $x$, $x'$ de même image par $f$`],
  [T`En appliquant $g$ aux deux membres : $g\bigl(f(x)\bigr) = g\bigl(f(x')\bigr)$, c'est-à-dire $(g \circ f)(x) = (g \circ f)(x')$.`, 'a', T`l'égalité $(g \circ f)(x) = (g \circ f)(x')$`],
  [T`Comme $g \circ f$ est injective, $x = x'$.`, 'b', T`l'égalité $x = x'$`],
  [T`Deux éléments de même image par $f$ sont donc égaux : $f$ est injective.`, 'c'] ], [
  [T`Comme $g \circ f$ est injective, $g$ est injective.`, T`C'est faux en général : avec $f : \{0\} \to \{0, 1\}$, $f(0) = 0$, et $g$ constante égale à 0, la composée est injective et $g$ ne l'est pas. L'injectivité de $g \circ f$ ne dit rien de $g$ hors de l'image de $f$.`],
  [T`Comme $f(x) = f(x')$, on a $g(x) = g(x')$.`, T`L'application $g$ est définie sur $F$, pas sur $E$ : $g(x)$ n'a pas de sens. C'est à $f(x)$ et $f(x')$ que l'on applique $g$.`] ]),
demo('composee-surjective', 'sup', F, 'ma-02', 'Si g ∘ f est surjective, g l\'est', T`Soit $f : E \to F$ et $g : F \to G$ deux applications. Si $g \circ f$ est surjective, alors $g$ est surjective.`, [
  [T`Soit $z$ un élément quelconque de $G$.`, '', T`un élément $z$ de $G$`],
  [T`Comme $g \circ f$ est surjective, il existe $x \in E$ tel que $g\bigl(f(x)\bigr) = z$.`, 'a', T`un antécédent $x$ de $z$ par $g \circ f$`],
  [T`Posons $y = f(x)$ : c'est un élément de $F$, et $g(y) = z$.`, 'b', T`l'élément $y = f(x)$, antécédent de $z$ par $g$`],
  [T`Tout élément de $G$ a donc un antécédent par $g$ : $g$ est surjective.`, 'c'] ], [
  [T`Comme $g \circ f$ est surjective, $f$ est surjective.`, T`C'est faux en général : avec $f : \{0\} \to \{0, 1\}$, $f(0) = 0$, et $g : \{0, 1\} \to \{0\}$, la composée est surjective et $f$ ne l'est pas. C'est la dernière application appliquée, $g$, qui hérite de la surjectivité.`],
  [T`Il existe $x \in E$ tel que $f\bigl(g(x)\bigr) = z$.`, T`La composée $g \circ f$ applique d'abord $f$, puis $g$ : $(g \circ f)(x) = g(f(x))$. L'expression $f(g(x))$ n'a d'ailleurs pas de sens ici, $g$ n'étant pas définie sur $E$.`] ]),
demo('classes', 'sup', F, 'ma-02', 'Classes d\'équivalence', T`Soit $\sim$ une relation d'équivalence sur un ensemble $E$. Deux classes d'équivalence sont soit égales, soit disjointes.`, [
  [T`Soit $x$ et $y$ deux éléments de $E$ dont les classes $\mathrm{cl}(x)$ et $\mathrm{cl}(y)$ ne sont pas disjointes : il existe $z$ appartenant aux deux.`, '', T`un élément $z$ commun aux deux classes`],
  [T`On a $z \sim x$ et $z \sim y$. Par symétrie $x \sim z$, puis par transitivité $x \sim y$.`, 'a', T`la relation $x \sim y$`],
  [T`Soit $t \in \mathrm{cl}(x)$ : alors $t \sim x$ et $x \sim y$, donc $t \sim y$ par transitivité. Ainsi $\mathrm{cl}(x) \subset \mathrm{cl}(y)$.`, 'b', T`l'inclusion $\mathrm{cl}(x) \subset \mathrm{cl}(y)$`],
  [T`En échangeant les rôles de $x$ et $y$, on obtient l'inclusion inverse : $\mathrm{cl}(x) = \mathrm{cl}(y)$.`, 'c'] ], [
  [T`On a $z \sim x$ et $z \sim y$, donc $x = y$.`, T`Être en relation n'est pas être égal : deux entiers de même parité sont en relation pour la congruence modulo 2 sans être égaux. On obtient $x \sim y$, pas $x = y$.`],
  [T`Par réflexivité, $x \sim y$.`, T`La réflexivité dit seulement que tout élément est en relation avec lui-même, $x \sim x$. Pour relier deux éléments différents, il faut passer par $z$, avec la symétrie et la transitivité.`] ]),
// ---------- Algèbre ----------
demo('intersection-sous-groupes', 'sup', A, 'ma-11', 'Intersection de deux sous-groupes', T`Soit $H$ et $K$ deux sous-groupes d'un groupe $(G, \cdot)$. Alors $H \cap K$ est un sous-groupe de $G$.`, [
  [T`L'élément neutre $e$ appartient à $H$ et à $K$, qui sont des sous-groupes : $H \cap K$ n'est pas vide.`, '', T`le fait que $H \cap K$ n'est pas vide`],
  [T`Soit $x$ et $y$ deux éléments de $H \cap K$.`, '', T`deux éléments $x$, $y$ de $H \cap K$`],
  [T`Comme $x$ et $y$ sont dans le sous-groupe $H$, l'élément $xy^{-1}$ est dans $H$ ; de même, il est dans $K$.`, 'b', T`l'appartenance de $xy^{-1}$ à $H$ et à $K$`],
  [T`Donc $xy^{-1} \in H \cap K$. Non vide et stable par $(x, y) \mapsto xy^{-1}$, la partie $H \cap K$ est un sous-groupe de $G$.`, 'ac'] ], [
  [T`De même, la réunion $H \cup K$ est stable par $(x, y) \mapsto xy^{-1}$ : c'est un sous-groupe de $G$.`, T`C'est faux en général : dans $(\mathbb{Z}, +)$, la réunion de $2\mathbb{Z}$ et de $3\mathbb{Z}$ contient 2 et 3, mais pas leur somme 5. Si $x \in H$ et $y \in K$, rien ne place $xy^{-1}$ dans $H$ ou dans $K$.`],
  [T`Comme $xy^{-1}$ est dans $H$, les éléments $x$ et $y$ sont dans $H$.`, T`Le raisonnement est mené à l'envers : c'est de $x \in H$ et $y \in H$ que l'on déduit $xy^{-1} \in H$. La réciproque est fausse : $xy^{-1}$ peut être dans $H$ sans que $x$ ni $y$ y soient.`] ]),
demo('morphisme', 'sup', A, 'ma-11', 'Image du neutre et de l\'inverse par un morphisme', T`Soit $f : G \to G'$ un morphisme de groupes, $e$ et $e'$ les éléments neutres. Alors $f(e) = e'$, et $f(x^{-1}) = f(x)^{-1}$ pour tout $x \in G$.`, [
  [T`Comme $e = e \cdot e$ et que $f$ est un morphisme, $f(e) = f(e)\,f(e)$.`, '', T`l'égalité $f(e) = f(e)f(e)$`],
  [T`En multipliant les deux membres par l'inverse de $f(e)$ dans $G'$, on obtient $e' = f(e)$.`, 'a', T`l'égalité $f(e) = e'$`],
  [T`Soit $x \in G$. Alors $f(x)\,f(x^{-1}) = f(x \cdot x^{-1}) = f(e) = e'$.`, 'b', T`l'égalité $f(x)f(x^{-1}) = e'$`],
  [T`De même $f(x^{-1})\,f(x) = e'$ : l'élément $f(x^{-1})$ est l'inverse de $f(x)$.`, 'c'] ], [
  [T`De $f(e) = f(e)\,f(e)$, on déduit $f(e) = 0$.`, T`Dans un groupe, il n'y a pas de « zéro » absorbant : tout élément est inversible, et l'on simplifie par $f(e)$. On obtient l'élément neutre $e'$.`],
  [T`Comme $f$ est un morphisme, $f(x^{-1}) = f(x)$ pour tout $x$.`, T`Un morphisme transforme le produit en produit, donc l'inverse en inverse : $f(x^{-1}) = f(x)^{-1}$, qui n'est égal à $f(x)$ que si $f(x)$ est son propre inverse.`] ]),
demo('bezout', 'sup', A, 'ma-12', 'Théorème de Bézout : existence', T`Soit $a$ et $b$ deux entiers non tous deux nuls. Il existe deux entiers $u$ et $v$ tels que $au + bv$ soit le PGCD de $a$ et $b$.`, [
  [T`L'ensemble $E$ des entiers strictement positifs de la forme $au + bv$, avec $u, v \in \mathbb{Z}$, n'est pas vide, puisqu'il contient $|a|$ ou $|b|$ : il a un plus petit élément $d = au_0 + bv_0$.`, '', T`le plus petit élément $d = au_0 + bv_0$ de $E$`],
  [T`Effectuons la division euclidienne de $a$ par $d$ : $a = dq + r$, avec $0 \leqslant r < d$.`, 'a', T`la division euclidienne $a = dq + r$`],
  [T`Alors $r = a - dq = a(1 - u_0 q) + b(-v_0 q)$ : le reste $r$ est lui aussi de la forme $au + bv$.`, 'b', T`l'écriture de $r$ sous la forme $au + bv$`],
  [T`Si $r$ était strictement positif, il appartiendrait à $E$ tout en étant strictement inférieur à $d$ : c'est impossible. Donc $r = 0$, et $d$ divise $a$.`, 'c', T`le fait que $d$ divise $a$`],
  [T`Le même raisonnement, appliqué à $b$, montre que $d$ divise $b$ : $d$ est un diviseur commun à $a$ et $b$.`, 'd', T`le fait que $d$ est un diviseur commun`],
  [T`Enfin, tout diviseur commun à $a$ et $b$ divise $au_0 + bv_0 = d$, donc lui est inférieur ou égal : $d$ est le PGCD de $a$ et $b$.`, 'e'] ], [
  [T`Le reste $r$ est de la forme $au + bv$ et $r < d$ : donc $r = d$.`, T`C'est contradictoire avec $r < d$. La conclusion correcte est que $r$ ne peut pas être dans $E$, donc qu'il n'est pas strictement positif : $r = 0$.`],
  [T`L'ensemble $E$ a un plus grand élément $d = au_0 + bv_0$.`, T`L'ensemble $E$ n'est pas majoré : si $n$ y figure, $2n$ aussi. C'est une partie non vide de $\mathbb{N}^*$, qui possède un plus <em>petit</em> élément.`] ]),
demo('euclide', 'sup', A, 'ma-12', 'Lemme d\'Euclide', T`Soit $p$ un nombre premier, $a$ et $b$ deux entiers. Si $p$ divise $ab$, alors $p$ divise $a$ ou $p$ divise $b$.`, [
  [T`Supposons que $p$ ne divise pas $a$, et montrons qu'il divise $b$.`, '', T`l'hypothèse que $p$ ne divise pas $a$`],
  [T`Les seuls diviseurs positifs de $p$ sont 1 et $p$. Comme $p$ ne divise pas $a$, le seul diviseur positif commun à $p$ et $a$ est 1 : ils sont premiers entre eux.`, 'a', T`le fait que $p$ et $a$ sont premiers entre eux`],
  [T`Or $p$ divise $ab$ et $p$ est premier avec $a$ : d'après le lemme de Gauss, $p$ divise $b$.`, 'b', T`le fait que $p$ divise $b$`],
  [T`Dans tous les cas, $p$ divise $a$ ou $p$ divise $b$.`, 'c'] ], [
  [T`Comme $p$ ne divise pas $a$, le PGCD de $p$ et $a$ est $p$.`, T`Le PGCD de $p$ et $a$ divise $a$ : s'il valait $p$, alors $p$ diviserait $a$. Il vaut donc 1, l'autre diviseur positif de $p$.`],
  [T`Ce résultat est vrai pour tout entier $p \geqslant 2$, premier ou non.`, T`C'est faux : 6 divise $4 \times 3$ sans diviser 4 ni 3. La primalité sert à garantir que $p$ est premier avec tout entier qu'il ne divise pas.`] ]),
demo('racine-facteur', 'sup', A, 'ma-13', 'Racine et factorisation', T`Soit $P \in \mathbb{K}[X]$ et $a \in \mathbb{K}$. Alors $a$ est racine de $P$ si et seulement si $X - a$ divise $P$.`, [
  [T`Effectuons la division euclidienne de $P$ par $X - a$ : $P = (X - a)Q + R$, avec $\deg R < 1$. Le reste $R$ est donc un polynôme constant, égal à un scalaire $c$.`, '', T`la division euclidienne $P = (X - a)Q + c$`],
  [T`En évaluant en $a$ : $P(a) = (a - a)Q(a) + c = c$.`, 'a', T`l'égalité $P(a) = c$`],
  [T`Sens direct : si $a$ est racine de $P$, alors $c = P(a) = 0$, donc $P = (X - a)Q$ : le polynôme $X - a$ divise $P$.`, 'b', T`le sens direct`],
  [T`Sens réciproque : si $X - a$ divise $P$, alors $P = (X - a)S$ pour un polynôme $S$, et $P(a) = 0 \times S(a) = 0$.`, 'c'] ], [
  [T`Comme $\deg R < 1$, le reste $R$ est le polynôme nul.`, T`Un polynôme de degré strictement inférieur à 1 est un polynôme <em>constant</em>, éventuellement non nul : la constante 3 est de degré 0. C'est la valeur $P(a)$ qui décide si cette constante est nulle.`],
  [T`En évaluant en $a$ : $P(a) = Q(a)$.`, T`Le facteur $(X - a)$ s'annule en $a$ : le terme $(X - a)Q$ disparaît tout entier, et il reste la constante $c$.`] ]),
demo('nombre-racines', 'sup', A, 'ma-13', 'Nombre de racines d\'un polynôme', T`Un polynôme non nul de degré $n$, à coefficients dans un corps $\mathbb{K}$, possède au plus $n$ racines distinctes dans $\mathbb{K}$.`, [
  [T`Pour tout entier $n \geqslant 0$, notons $H(n)$ : « tout polynôme de degré $n$ a au plus $n$ racines distinctes ».`, '', T`la propriété $H(n)$`],
  [T`Initialisation : un polynôme de degré 0 est une constante non nulle, qui n'a aucune racine. Donc $H(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ tel que $H(n)$ soit vraie, et $P$ un polynôme de degré $n + 1$. S'il n'a pas de racine, il n'y a rien à démontrer ; sinon, soit $a$ une racine : $P = (X - a)Q$, avec $\deg Q = n$.`, 'a', T`la factorisation $P = (X - a)Q$ avec $\deg Q = n$`],
  [T`Soit $b$ une racine de $P$ différente de $a$ : alors $(b - a)Q(b) = 0$ avec $b - a \neq 0$, donc $Q(b) = 0$. Les racines de $P$ autres que $a$ sont des racines de $Q$.`, 'c', T`le fait que les autres racines de $P$ sont des racines de $Q$`],
  [T`D'après $H(n)$, le polynôme $Q$ a au plus $n$ racines : $P$ en a au plus $n + 1$, et $H(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $H(n)$ est vraie pour tout entier $n \geqslant 0$.`, 'be'] ], [
  [T`Soit $b$ une racine de $P$ : alors $(b - a)Q(b) = 0$, donc $b = a$. Le polynôme $P$ n'a qu'une racine.`, T`Un produit nul dans un corps a l'un de ses facteurs nul, pas forcément le premier : si $b \neq a$, c'est $Q(b)$ qui est nul. Le polynôme $(X - 1)(X - 2)$ a bien deux racines.`],
  [T`Soit $a$ une racine : $P = (X - a)Q$, avec $\deg Q = n + 1$.`, T`Le degré d'un produit est la somme des degrés : $\deg P = 1 + \deg Q$, donc $\deg Q = n$. C'est cette baisse du degré qui permet d'appliquer l'hypothèse de récurrence.`] ]),
// ---------- Algèbre linéaire ----------
demo('noyau-sev', 'sup', L, 'ma-14', 'Le noyau est un sous-espace vectoriel', T`Soit $u : E \to F$ une application linéaire. Alors $\operatorname{Ker} u$ est un sous-espace vectoriel de $E$.`, [
  [T`Comme $u$ est linéaire, $u(0_E) = 0_F$ : le vecteur nul appartient à $\operatorname{Ker} u$, qui n'est donc pas vide.`, '', T`le fait que $0_E$ appartient au noyau`],
  [T`Soit $x$ et $y$ deux vecteurs de $\operatorname{Ker} u$, et $\lambda$, $\mu$ deux scalaires.`, '', T`deux vecteurs du noyau et deux scalaires`],
  [T`Par linéarité, $u(\lambda x + \mu y) = \lambda u(x) + \mu u(y) = \lambda 0_F + \mu 0_F = 0_F$.`, 'b', T`le calcul $u(\lambda x + \mu y) = 0_F$`],
  [T`Donc $\lambda x + \mu y \in \operatorname{Ker} u$ : le noyau, non vide et stable par combinaison linéaire, est un sous-espace vectoriel de $E$.`, 'ac'] ], [
  [T`Le noyau n'est pas vide, puisque $u$ est injective.`, T`Rien ne dit que $u$ est injective, et ce n'est pas le sujet : le noyau contient toujours $0_E$, que $u$ soit injective ou non. L'injectivité signifierait d'ailleurs que le noyau ne contient <em>que</em> $0_E$.`],
  [T`Par linéarité, $u(\lambda x + \mu y) = u(\lambda)u(x) + u(\mu)u(y)$.`, T`L'application $u$ est définie sur les vecteurs de $E$, pas sur les scalaires : $u(\lambda)$ n'a pas de sens. La linéarité fait <em>sortir</em> les scalaires : $u(\lambda x) = \lambda u(x)$.`] ]),
demo('somme-directe', 'sup', L, 'ma-14', 'Somme directe et unicité de la décomposition', T`Soit $F$ et $G$ deux sous-espaces vectoriels de $E$ tels que $F \cap G = \{0_E\}$. Alors tout vecteur de $F + G$ s'écrit de façon unique comme somme d'un vecteur de $F$ et d'un vecteur de $G$.`, [
  [T`Soit $x \in F + G$, et supposons $x = f + g = f' + g'$, avec $f, f' \in F$ et $g, g' \in G$.`, '', T`les deux décompositions de $x$`],
  [T`En regroupant : $f - f' = g' - g$.`, 'a', T`l'égalité $f - f' = g' - g$`],
  [T`Le vecteur $f - f'$ appartient à $F$, et $g' - g$ appartient à $G$ : leur valeur commune appartient à $F \cap G$.`, 'b', T`l'appartenance de $f - f'$ à $F \cap G$`],
  [T`Comme $F \cap G = \{0_E\}$, on a $f - f' = 0_E$ et $g' - g = 0_E$ : $f = f'$ et $g = g'$.`, 'c'] ], [
  [T`Comme $x$ appartient à $F + G$, il appartient à $F$ ou à $G$ : sa décomposition est $x + 0_E$ ou $0_E + x$.`, T`La somme $F + G$ n'est pas la réunion $F \cup G$ : un vecteur de $F + G$ est la somme d'un vecteur de $F$ et d'un vecteur de $G$, et n'est en général dans aucun des deux. Dans $\mathbb{R}^2$, le vecteur $(1, 1)$ est somme de $(1, 0)$ et de $(0, 1)$ sans être sur aucun des deux axes.`],
  [T`Le vecteur $f - f'$ appartient à $F$ et à $G$ : donc $f = g$.`, T`On obtient que $f - f'$ est nul, donc que $f = f'$ : ce sont les deux composantes dans $F$ qui sont égales. Rien ne relie $f$, vecteur de $F$, à $g$, vecteur de $G$.`] ]),
demo('image-libre', 'sup', L, 'ma-14', 'Image d\'une famille libre par une injection', T`Soit $u : E \to F$ une application linéaire injective et $(e_1, \dots, e_n)$ une famille libre de $E$. Alors $\bigl(u(e_1), \dots, u(e_n)\bigr)$ est une famille libre de $F$.`, [
  [T`Soit $\lambda_1, \dots, \lambda_n$ des scalaires tels que $\lambda_1 u(e_1) + \dots + \lambda_n u(e_n) = 0_F$.`, '', T`une combinaison linéaire nulle des $u(e_i)$`],
  [T`Par linéarité, cette égalité s'écrit $u(\lambda_1 e_1 + \dots + \lambda_n e_n) = 0_F$.`, 'a', T`l'égalité $u(\lambda_1 e_1 + \dots + \lambda_n e_n) = 0_F$`],
  [T`Comme $u$ est injective, son noyau est réduit à $0_E$ : donc $\lambda_1 e_1 + \dots + \lambda_n e_n = 0_E$.`, 'b', T`l'égalité $\lambda_1 e_1 + \dots + \lambda_n e_n = 0_E$`],
  [T`La famille $(e_1, \dots, e_n)$ étant libre, tous les $\lambda_i$ sont nuls : la famille des images est libre.`, 'c'] ], [
  [T`De $\lambda_1 u(e_1) + \dots + \lambda_n u(e_n) = 0_F$, on déduit que $u(e_i) = 0_F$ pour tout $i$.`, T`Une somme nulle n'a pas nécessairement tous ses termes nuls, et un terme $\lambda_i u(e_i)$ nul ne donnerait pas $u(e_i) = 0_F$. Ce sont les coefficients $\lambda_i$ dont on veut montrer la nullité.`],
  [T`Ce résultat vaut pour toute application linéaire, injective ou non.`, T`C'est faux : l'application nulle envoie toute famille libre sur une famille de vecteurs nuls, qui est liée. L'injectivité est utilisée pour passer de $u(v) = 0_F$ à $v = 0_E$.`] ]),
demo('rang', 'sup', L, 'ma-15', 'Théorème du rang', T`Soit $E$ un espace vectoriel de dimension finie $n$ et $u : E \to F$ une application linéaire. Alors $\dim \operatorname{Ker} u + \operatorname{rg} u = n$.`, [
  [T`Soit $(e_1, \dots, e_p)$ une base de $\operatorname{Ker} u$. D'après le théorème de la base incomplète, on la complète en une base $(e_1, \dots, e_n)$ de $E$.`, '', T`une base de $E$ dont les $p$ premiers vecteurs forment une base du noyau`],
  [T`L'image de $u$ est engendrée par $u(e_1), \dots, u(e_n)$ ; comme $u(e_i) = 0_F$ pour $i \leqslant p$, elle est engendrée par $u(e_{p+1}), \dots, u(e_n)$.`, 'a', T`le fait que $u(e_{p+1}), \dots, u(e_n)$ engendrent l'image`],
  [T`Montrons que cette famille est libre. Si $\lambda_{p+1} u(e_{p+1}) + \dots + \lambda_n u(e_n) = 0_F$, alors le vecteur $\lambda_{p+1} e_{p+1} + \dots + \lambda_n e_n$ appartient à $\operatorname{Ker} u$.`, 'a', T`le vecteur $\lambda_{p+1} e_{p+1} + \dots + \lambda_n e_n$ du noyau`],
  [T`Il est donc combinaison linéaire de $e_1, \dots, e_p$. Comme $(e_1, \dots, e_n)$ est libre, tous les coefficients sont nuls, en particulier $\lambda_{p+1} = \dots = \lambda_n = 0$.`, 'c', T`la liberté de la famille $u(e_{p+1}), \dots, u(e_n)$`],
  [T`La famille $\bigl(u(e_{p+1}), \dots, u(e_n)\bigr)$ est une base de $\operatorname{Im} u$ : donc $\operatorname{rg} u = n - p = n - \dim \operatorname{Ker} u$.`, 'bd'] ], [
  [T`L'image de $u$ est engendrée par $u(e_1), \dots, u(e_p)$.`, T`Ces vecteurs sont tous nuls, puisque $e_1, \dots, e_p$ sont dans le noyau : ils n'engendrent que $\{0_F\}$. Ce sont les images des vecteurs <em>ajoutés</em> pour compléter la base qui engendrent l'image.`],
  [T`Si $\lambda_{p+1} u(e_{p+1}) + \dots + \lambda_n u(e_n) = 0_F$, alors $\lambda_{p+1} e_{p+1} + \dots + \lambda_n e_n = 0_E$, puisque $u$ est injective.`, T`Rien ne dit que $u$ est injective : le théorème vaut pour toute application linéaire. On sait seulement que ce vecteur est dans le noyau, et c'est la liberté de la base complète qui permet de conclure.`] ]),
demo('trace', 'sup', L, 'ma-16', 'Trace d\'un produit', T`Pour toutes matrices $A$ et $B$ de $\mathcal{M}_n(\mathbb{K})$ : $\operatorname{tr}(AB) = \operatorname{tr}(BA)$.`, [
  [T`Notons $A = (a_{ij})$ et $B = (b_{ij})$. Le coefficient diagonal d'indice $i$ de $AB$ est $\displaystyle\sum_{k=1}^n a_{ik}b_{ki}$.`, '', T`le coefficient diagonal de $AB$`],
  [T`Donc $\operatorname{tr}(AB) = \displaystyle\sum_{i=1}^n \sum_{k=1}^n a_{ik}b_{ki}$.`, 'a', T`l'expression de $\operatorname{tr}(AB)$ comme somme double`],
  [T`Les sommes étant finies, on peut les intervertir, et le produit des scalaires est commutatif : $\operatorname{tr}(AB) = \displaystyle\sum_{k=1}^n \sum_{i=1}^n b_{ki}a_{ik}$.`, 'b', T`l'interversion des deux sommes`],
  [T`Or $\displaystyle\sum_{i=1}^n b_{ki}a_{ik}$ est le coefficient diagonal d'indice $k$ de $BA$ : la somme double est $\operatorname{tr}(BA)$.`, 'c'] ], [
  [T`La trace d'un produit est le produit des traces : $\operatorname{tr}(AB) = \operatorname{tr}(A)\operatorname{tr}(B) = \operatorname{tr}(BA)$.`, T`C'est faux : pour $A = B = I_2$, on a $\operatorname{tr}(AB) = 2$ et $\operatorname{tr}(A)\operatorname{tr}(B) = 4$. La trace est linéaire, elle n'est pas multiplicative.`],
  [T`Le coefficient diagonal d'indice $i$ de $AB$ est $a_{ii}b_{ii}$.`, T`Le coefficient $(i, i)$ d'un produit est la somme des $a_{ik}b_{ki}$ pour $k$ de 1 à $n$ : il fait intervenir toute la ligne $i$ de $A$ et toute la colonne $i$ de $B$, pas seulement leurs coefficients diagonaux.`] ]),
demo('symetrique-antisymetrique', 'sup', L, 'ma-16', 'Parties symétrique et antisymétrique', T`Toute matrice $M \in \mathcal{M}_n(\mathbb{R})$ s'écrit de façon unique $M = S + A$, avec $S$ symétrique et $A$ antisymétrique.`, [
  [T`Analyse : supposons $M = S + A$, avec $S^\top = S$ et $A^\top = -A$. En transposant, $M^\top = S - A$.`, '', T`les égalités $M = S + A$ et $M^\top = S - A$`],
  [T`En ajoutant et en retranchant ces deux égalités : $S = \dfrac{M + M^\top}{2}$ et $A = \dfrac{M - M^\top}{2}$. Il y a donc au plus une décomposition.`, 'a', T`les seules valeurs possibles de $S$ et de $A$`],
  [T`Synthèse : posons $S = \dfrac{M + M^\top}{2}$ et $A = \dfrac{M - M^\top}{2}$. Alors $S^\top = \dfrac{M^\top + M}{2} = S$ et $A^\top = \dfrac{M^\top - M}{2} = -A$.`, 'b', T`la vérification que $S$ est symétrique et $A$ antisymétrique`],
  [T`De plus $S + A = M$ : la décomposition existe, et elle est unique d'après l'analyse.`, 'c'] ], [
  [T`En transposant, $M^\top = S + A$, donc $M^\top = M$.`, T`La transposition change le signe de la partie antisymétrique : $A^\top = -A$, donc $M^\top = S - A$. Avec l'égalité écrite, toute matrice serait symétrique.`],
  [T`En ajoutant ces deux égalités : $S = M + M^\top$.`, T`La somme donne $M + M^\top = 2S$ : il faut diviser par 2.`] ]),
// ---------- Analyse ----------
demo('gendarmes', 'sup', N, 'ma-07', 'Théorème d\'encadrement', T`Soit $(u_n)$, $(v_n)$, $(w_n)$ trois suites réelles telles que $u_n \leqslant v_n \leqslant w_n$ pour tout $n$. Si $(u_n)$ et $(w_n)$ convergent vers le même réel $\ell$, alors $(v_n)$ converge vers $\ell$.`, [
  [T`Soit $\varepsilon > 0$.`, '', T`le réel $\varepsilon$`],
  [T`Il existe un rang $N_1$ tel que $|u_n - \ell| \leqslant \varepsilon$ pour $n \geqslant N_1$, et un rang $N_2$ tel que $|w_n - \ell| \leqslant \varepsilon$ pour $n \geqslant N_2$.`, 'a', T`les rangs $N_1$ et $N_2$`],
  [T`Pour $n \geqslant \max(N_1, N_2)$ : $\ell - \varepsilon \leqslant u_n \leqslant v_n \leqslant w_n \leqslant \ell + \varepsilon$.`, 'b', T`l'encadrement de $v_n$ entre $\ell - \varepsilon$ et $\ell + \varepsilon$`],
  [T`Donc $|v_n - \ell| \leqslant \varepsilon$ pour tout $n \geqslant \max(N_1, N_2)$.`, 'c', T`la majoration de $|v_n - \ell|$`],
  [T`Ceci vaut pour tout $\varepsilon > 0$ : la suite $(v_n)$ converge vers $\ell$.`, 'd'] ], [
  [T`À partir d'un certain rang, $u_n = w_n = \ell$, donc $v_n = \ell$.`, T`Converger vers $\ell$ n'est pas valoir $\ell$ à partir d'un rang : les suites $-\frac1n$ et $\frac1n$ convergent vers 0 sans jamais s'annuler.`],
  [T`Comme $u_n \leqslant v_n \leqslant w_n$ et que $(u_n)$ et $(w_n)$ convergent, la suite $(v_n)$ converge.`, T`Sans l'égalité des deux limites, c'est faux : $-1 \leqslant (-1)^n \leqslant 1$, les suites constantes $-1$ et $1$ convergent, et $(-1)^n$ diverge. Il faut que les deux suites qui encadrent aient la même limite $\ell$.`] ]),
demo('adjacentes', 'sup', N, 'ma-07', 'Suites adjacentes', T`Soit $(u_n)$ une suite croissante et $(v_n)$ une suite décroissante telles que $v_n - u_n$ tend vers 0. Alors $(u_n)$ et $(v_n)$ convergent vers la même limite.`, [
  [T`La suite $(v_n - u_n)$ est décroissante, comme différence d'une suite décroissante et d'une suite croissante, et elle tend vers 0 : tous ses termes sont donc positifs, c'est-à-dire $u_n \leqslant v_n$ pour tout $n$.`, '', T`l'inégalité $u_n \leqslant v_n$`],
  [T`Par conséquent $u_n \leqslant v_n \leqslant v_0$ : la suite $(u_n)$ est croissante et majorée par $v_0$, donc elle converge vers un réel $\ell$.`, 'a', T`la convergence de $(u_n)$`],
  [T`De même $v_n \geqslant u_n \geqslant u_0$ : la suite $(v_n)$ est décroissante et minorée par $u_0$, donc elle converge vers un réel $\ell'$.`, 'a', T`la convergence de $(v_n)$`],
  [T`Par différence de limites, $v_n - u_n$ tend vers $\ell' - \ell$. Or cette suite tend vers 0 : par unicité de la limite, $\ell = \ell'$.`, 'bc'] ], [
  [T`La suite $(u_n)$ est croissante, donc elle converge.`, T`Une suite croissante peut tendre vers $+\infty$ : il faut qu'elle soit de plus majorée. C'est le rôle de l'inégalité $u_n \leqslant v_0$, qui demande d'avoir d'abord comparé les deux suites.`],
  [T`Comme $v_n - u_n$ tend vers 0, on a $u_n = v_n$ à partir d'un certain rang.`, T`Une suite peut tendre vers 0 sans jamais s'annuler : avec $u_n = -\frac1n$ et $v_n = \frac1n$, la différence $\frac2n$ tend vers 0 et n'est jamais nulle.`] ]),
demo('derivable-continue', 'sup', N, 'ma-09', 'Une fonction dérivable est continue', T`Si une fonction $f$ est dérivable en $a$, alors elle est continue en $a$.`, [
  [T`Pour tout $x \neq a$ du domaine de $f$, écrivons $f(x) - f(a) = \dfrac{f(x) - f(a)}{x - a} \times (x - a)$.`, '', T`l'écriture de $f(x) - f(a)$ comme produit`],
  [T`Quand $x$ tend vers $a$, le taux d'accroissement tend vers le réel $f'(a)$, et $x - a$ tend vers 0.`, '', T`les limites des deux facteurs`],
  [T`Par produit de limites, $f(x) - f(a)$ tend vers $f'(a) \times 0 = 0$.`, 'ab', T`la limite de $f(x) - f(a)$`],
  [T`Donc $f(x)$ tend vers $f(a)$ quand $x$ tend vers $a$ : la fonction $f$ est continue en $a$.`, 'c'] ], [
  [T`Pour tout $x$, on a $f(x) - f(a) = f'(a)(x - a)$.`, T`Cette égalité n'est vraie que pour les fonctions affines. En général, le taux d'accroissement <em>tend vers</em> $f'(a)$ sans lui être égal.`],
  [T`Réciproquement, toute fonction continue en $a$ est dérivable en $a$.`, T`C'est faux : la valeur absolue est continue en 0 sans y être dérivable, ses taux d'accroissement à gauche et à droite valant $-1$ et $1$.`] ]),
demo('extremum', 'sup', N, 'ma-09', 'Condition nécessaire d\'extremum', T`Soit $f$ une fonction définie sur un intervalle $I$, dérivable en un point $c$ intérieur à $I$. Si $f$ admet un maximum local en $c$, alors $f'(c) = 0$.`, [
  [T`Comme $c$ est intérieur à $I$ et que $f$ a un maximum local en $c$, il existe $\eta > 0$ tel que $]c - \eta, c + \eta[ \subset I$ et $f(x) \leqslant f(c)$ sur cet intervalle.`, '', T`un intervalle ouvert centré en $c$ sur lequel $f \leqslant f(c)$`],
  [T`Pour $c < x < c + \eta$, le taux $\dfrac{f(x) - f(c)}{x - c}$ est négatif ou nul ; en passant à la limite à droite, $f'(c) \leqslant 0$.`, 'a', T`l'inégalité $f'(c) \leqslant 0$`],
  [T`Pour $c - \eta < x < c$, le numérateur est négatif ou nul et le dénominateur strictement négatif : le taux est positif ou nul ; en passant à la limite à gauche, $f'(c) \geqslant 0$.`, 'a', T`l'inégalité $f'(c) \geqslant 0$`],
  [T`Donc $f'(c) = 0$.`, 'bc'] ], [
  [T`Pour $c - \eta < x < c$, le taux $\dfrac{f(x) - f(c)}{x - c}$ est négatif ou nul, comme à droite.`, T`À gauche de $c$, le dénominateur $x - c$ est négatif : le quotient de deux nombres négatifs est positif. C'est ce changement de signe qui force la dérivée à être nulle.`],
  [T`Le résultat reste vrai si $c$ est une extrémité de $I$.`, T`C'est faux : $x \mapsto x$ atteint son maximum sur $[0, 1]$ en 1, où sa dérivée vaut 1. À une extrémité, on ne dispose des taux que d'un seul côté, donc d'une seule des deux inégalités.`] ]),
demo('tvi', 'sup', N, 'ma-08', 'Théorème des valeurs intermédiaires', T`Soit $f$ une fonction continue sur $[a, b]$ telle que $f(a) \leqslant 0 \leqslant f(b)$. Alors il existe $c \in [a, b]$ tel que $f(c) = 0$.`, [
  [T`Construisons par récurrence deux suites : $a_0 = a$, $b_0 = b$ ; puis, $m_n$ désignant le milieu de $[a_n, b_n]$, on pose $(a_{n+1}, b_{n+1}) = (m_n, b_n)$ si $f(m_n) \leqslant 0$, et $(a_n, m_n)$ sinon.`, '', T`les suites $(a_n)$ et $(b_n)$ construites par dichotomie`],
  [T`Par construction, pour tout $n$ : $f(a_n) \leqslant 0 \leqslant f(b_n)$, la suite $(a_n)$ est croissante, $(b_n)$ est décroissante, et $b_n - a_n = \dfrac{b - a}{2^n}$.`, 'a', T`les propriétés des deux suites`],
  [T`Les suites $(a_n)$ et $(b_n)$ sont adjacentes : elles convergent vers une même limite $c$, qui appartient à $[a, b]$.`, 'b', T`la limite commune $c$`],
  [T`Comme $f$ est continue en $c$, les suites $\bigl(f(a_n)\bigr)$ et $\bigl(f(b_n)\bigr)$ convergent toutes deux vers $f(c)$.`, 'c', T`la convergence de $f(a_n)$ et $f(b_n)$ vers $f(c)$`],
  [T`En passant à la limite dans $f(a_n) \leqslant 0 \leqslant f(b_n)$, on obtient $f(c) \leqslant 0 \leqslant f(c)$ : donc $f(c) = 0$.`, 'd'] ], [
  [T`Comme $b_n - a_n$ tend vers 0, on a $a_n = b_n$ à partir d'un certain rang, et ce nombre commun annule $f$.`, T`La différence $\frac{b - a}{2^n}$ tend vers 0 sans jamais s'annuler. Le point $c$ n'est en général atteint par aucune des deux suites : c'est une limite, et c'est la continuité qui transporte l'information jusqu'à lui.`],
  [T`Ce raisonnement ne se sert pas de la continuité : le résultat vaut pour toute fonction.`, T`La continuité sert à passer de $a_n \to c$ à $f(a_n) \to f(c)$. Sans elle, le résultat est faux : la fonction qui vaut $-1$ sur $[0, 1[$ et $1$ en 1 change de signe sans s'annuler.`] ]),
demo('croissance', 'sup', N, 'ma-09', 'Dérivée positive et croissance', T`Soit $f$ une fonction dérivable sur un intervalle $I$. Si $f'(x) \geqslant 0$ pour tout $x \in I$, alors $f$ est croissante sur $I$.`, [
  [T`Soit $x$ et $y$ deux points de $I$ tels que $x < y$.`, '', T`deux points $x < y$ de $I$`],
  [T`Comme $I$ est un intervalle, $[x, y] \subset I$ : la fonction $f$ est continue sur $[x, y]$ et dérivable sur $]x, y[$. L'égalité des accroissements finis fournit $c \in \,]x, y[$ tel que $f(y) - f(x) = f'(c)(y - x)$.`, 'a', T`le point $c$ donné par les accroissements finis`],
  [T`Or $f'(c) \geqslant 0$ et $y - x > 0$ : donc $f(y) - f(x) \geqslant 0$.`, 'b', T`l'inégalité $f(x) \leqslant f(y)$`],
  [T`Ainsi $f(x) \leqslant f(y)$ dès que $x < y$ : la fonction $f$ est croissante sur $I$.`, 'c'] ], [
  [T`D'après le théorème de Rolle, il existe $c \in \,]x, y[$ tel que $f'(c) = 0$.`, T`Le théorème de Rolle exige $f(x) = f(y)$, que rien n'assure ici. C'est l'égalité des accroissements finis, qui ne suppose rien sur les valeurs aux bornes, qu'il faut invoquer.`],
  [T`Le résultat reste vrai sur une réunion d'intervalles.`, T`C'est faux : $x \mapsto -\frac1x$ a une dérivée positive sur $\mathbb{R}^*$, et pourtant $f(-1) = 1 > f(1) = -1$. L'hypothèse « $I$ est un intervalle » sert à garantir que $[x, y]$ est contenu dans $I$.`] ]),
demo('fondamental', 'sup', N, 'ma-18', 'Théorème fondamental de l\'analyse', T`Soit $f$ une fonction continue sur un intervalle $I$, $a \in I$, et $F(x) = \displaystyle\int_a^x f(t)\,dt$. Alors $F$ est dérivable sur $I$ et $F' = f$.`, [
  [T`Soit $x_0 \in I$ et $h \neq 0$ tel que $x_0 + h \in I$. Par la relation de Chasles, et comme $f(x_0)$ est une constante : $\dfrac{F(x_0 + h) - F(x_0)}{h} - f(x_0) = \dfrac1h \displaystyle\int_{x_0}^{x_0 + h} \bigl(f(t) - f(x_0)\bigr)dt$.`, '', T`l'écriture de l'écart entre le taux d'accroissement et $f(x_0)$ comme une intégrale`],
  [T`Soit $\varepsilon > 0$. Par continuité de $f$ en $x_0$, il existe $\delta > 0$ tel que $|f(t) - f(x_0)| \leqslant \varepsilon$ dès que $|t - x_0| \leqslant \delta$.`, '', T`le réel $\delta$ donné par la continuité`],
  [T`Pour $0 < |h| \leqslant \delta$, tout $t$ compris entre $x_0$ et $x_0 + h$ vérifie $|t - x_0| \leqslant \delta$ : l'intégrale est majorée en valeur absolue par $\varepsilon|h|$, donc l'écart par $\varepsilon$.`, 'ab', T`la majoration de l'écart par $\varepsilon$`],
  [T`Le taux d'accroissement de $F$ en $x_0$ tend donc vers $f(x_0)$ : $F$ est dérivable en $x_0$, et $F'(x_0) = f(x_0)$.`, 'c'] ], [
  [T`Comme $f$ est continue, $f(t) = f(x_0)$ pour tout $t$ assez proche de $x_0$ : l'intégrale est nulle.`, T`La continuité dit que $f(t)$ est <em>proche</em> de $f(x_0)$, à $\varepsilon$ près, pas qu'elle lui est égale : seule une fonction localement constante vérifierait cela.`],
  [T`On a $\dfrac1h \displaystyle\int_{x_0}^{x_0 + h} \bigl(f(t) - f(x_0)\bigr)dt = f(x_0 + h) - f(x_0)$.`, T`L'intégrale d'une fonction sur un segment n'est pas sa valeur à une extrémité multipliée par la longueur. On ne peut que l'encadrer, à l'aide d'une majoration de la fonction sur tout le segment.`] ]),
demo('terme-general', 'sup', N, 'ma-20', 'Le terme général d\'une série convergente tend vers 0', T`Si la série $\sum u_n$ converge, alors la suite $(u_n)$ tend vers 0.`, [
  [T`Notons $S_n = u_0 + \dots + u_n$ la somme partielle d'indice $n$. Par hypothèse, la suite $(S_n)$ converge vers un réel $S$.`, '', T`les sommes partielles $S_n$ et leur limite $S$`],
  [T`Pour tout $n \geqslant 1$, on a $u_n = S_n - S_{n-1}$.`, 'a', T`l'égalité $u_n = S_n - S_{n-1}$`],
  [T`La suite $(S_{n-1})$ converge elle aussi vers $S$.`, 'a', T`la limite de $(S_{n-1})$`],
  [T`Par différence de limites, $u_n$ tend vers $S - S = 0$.`, 'bc'] ], [
  [T`Réciproquement, si $(u_n)$ tend vers 0, la série $\sum u_n$ converge.`, T`C'est la réciproque fausse la plus célèbre du chapitre : $\frac1n$ tend vers 0 et la série harmonique diverge. La condition est nécessaire, elle n'est pas suffisante.`],
  [T`Pour tout $n$, on a $u_n = S_n$, donc $u_n$ tend vers $S$.`, T`La somme partielle $S_n$ additionne tous les termes de $u_0$ à $u_n$ : elle n'est égale à $u_n$ que si tous les précédents sont nuls. C'est la <em>différence</em> de deux sommes partielles consécutives qui redonne $u_n$.`] ]),
demo('serie-geometrique', 'sup', N, 'ma-20', 'Somme d\'une série géométrique', T`Pour tout réel $q$ tel que $|q| < 1$, la série $\sum q^n$ converge, et $\displaystyle\sum_{n=0}^{+\infty} q^n = \frac{1}{1 - q}$.`, [
  [T`Comme $q \neq 1$, la somme partielle vaut $S_n = 1 + q + \dots + q^n = \dfrac{1 - q^{n+1}}{1 - q}$.`, '', T`l'expression des sommes partielles`],
  [T`Comme $|q| < 1$, la suite $(q^{n+1})$ tend vers 0.`, '', T`la limite de $q^{n+1}$`],
  [T`Donc $S_n$ tend vers $\dfrac{1}{1 - q}$.`, 'ab', T`la limite des sommes partielles`],
  [T`La suite des sommes partielles converge : la série converge, et sa somme est $\dfrac{1}{1 - q}$.`, 'c'] ], [
  [T`La suite $(q^{n+1})$ tend vers 0 pour tout réel $q \neq 1$.`, T`Pour $q = 2$, elle tend vers $+\infty$, et pour $q = -1$ elle n'a pas de limite. C'est l'hypothèse $|q| < 1$ qui assure que les puissances tendent vers 0.`],
  [T`La formule $\dfrac{1}{1 - q}$ donne donc la somme de la série pour tout $q \neq 1$ : par exemple $1 + 2 + 4 + 8 + \dots = -1$.`, T`Pour $|q| \geqslant 1$, le terme général ne tend pas vers 0 et la série diverge : elle n'a pas de somme. La formule n'a de sens que là où la série converge.`] ]),
demo('comparaison-series', 'sup', N, 'ma-20', 'Comparaison de séries à termes positifs', T`Soit $(u_n)$ et $(v_n)$ deux suites telles que $0 \leqslant u_n \leqslant v_n$ pour tout $n$. Si la série $\sum v_n$ converge, alors la série $\sum u_n$ converge.`, [
  [T`Notons $U_n$ et $V_n$ les sommes partielles des deux séries. En additionnant les inégalités, $U_n \leqslant V_n$ pour tout $n$.`, '', T`l'inégalité $U_n \leqslant V_n$ entre les sommes partielles`],
  [T`La suite $(V_n)$ est croissante, car $v_n \geqslant 0$, et elle converge vers la somme $V$ de la série : donc $V_n \leqslant V$ pour tout $n$.`, 'a', T`la majoration $V_n \leqslant V$`],
  [T`La suite $(U_n)$ est croissante, car $u_n \geqslant 0$, et majorée par $V$ d'après ce qui précède.`, 'ab', T`le fait que $(U_n)$ est croissante et majorée`],
  [T`D'après le théorème de la limite monotone, la suite $(U_n)$ converge : la série $\sum u_n$ converge.`, 'c'] ], [
  [T`La suite $(U_n)$ est majorée par $V$. Or toute suite majorée converge : la série $\sum u_n$ converge.`, T`Une suite majorée ne converge pas forcément : $(-1)^n$ est majorée et diverge. C'est la croissance de $(U_n)$, due à la positivité des $u_n$, qui permet d'invoquer la limite monotone.`],
  [T`Ce résultat vaut sans hypothèse de signe sur $u_n$.`, T`C'est faux : avec $u_n = -1$ et $v_n = 0$, on a $u_n \leqslant v_n$, la série $\sum v_n$ converge et la série $\sum u_n$ diverge. La positivité est ce qui rend les sommes partielles croissantes.`] ]),
// ---------- Probabilités ----------
demo('union', 'sup', Pr, 'ma-21', 'Probabilité d\'une réunion', T`Pour tous événements $A$ et $B$ d'un espace probabilisé : $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.`, [
  [T`Les événements $A$ et $B \setminus A$ sont incompatibles, et leur réunion est $A \cup B$ : $P(A \cup B) = P(A) + P(B \setminus A)$.`, '', T`la décomposition de $P(A \cup B)$`],
  [T`Les événements $A \cap B$ et $B \setminus A$ sont incompatibles, et leur réunion est $B$ : $P(B) = P(A \cap B) + P(B \setminus A)$.`, '', T`la décomposition de $P(B)$`],
  [T`Donc $P(B \setminus A) = P(B) - P(A \cap B)$.`, 'b', T`l'expression de $P(B \setminus A)$`],
  [T`En reportant dans l'expression de $P(A \cup B)$ : $P(A \cup B) = P(A) + P(B) - P(A \cap B)$.`, 'ac'] ], [
  [T`Par additivité, $P(A \cup B) = P(A) + P(B)$ pour tous événements $A$ et $B$.`, T`L'additivité ne vaut que pour des événements incompatibles. Sinon, les issues de $A \cap B$ sont comptées deux fois : c'est pour cela qu'il faut retrancher $P(A \cap B)$.`],
  [T`Donc $P(B \setminus A) = P(B) - P(A)$.`, T`On retranche à $P(B)$ la probabilité de la partie de $A$ qui est dans $B$, soit $P(A \cap B)$, et non celle de $A$ tout entier. La formule écrite pourrait donner un nombre négatif.`] ]),
demo('totales', 'sup', Pr, 'ma-21', 'Formule des probabilités totales', T`Soit $(A_1, \dots, A_n)$ un système complet d'événements de probabilités non nulles. Pour tout événement $B$ : $P(B) = \displaystyle\sum_{i=1}^n P(A_i)\,P_{A_i}(B)$.`, [
  [T`Les $A_i$ ont pour réunion l'univers : donc $B = (B \cap A_1) \cup \dots \cup (B \cap A_n)$.`, '', T`la décomposition de $B$ selon les $A_i$`],
  [T`Les $A_i$ étant deux à deux incompatibles, les événements $B \cap A_i$ le sont aussi.`, '', T`l'incompatibilité des $B \cap A_i$`],
  [T`Par additivité, $P(B) = \displaystyle\sum_{i=1}^n P(B \cap A_i)$.`, 'ab', T`l'égalité $P(B) = \sum P(B \cap A_i)$`],
  [T`Par définition de la probabilité conditionnelle, $P(B \cap A_i) = P(A_i)\,P_{A_i}(B)$, ce qui donne la formule.`, 'c'] ], [
  [T`Par définition de la probabilité conditionnelle, $P(B \cap A_i) = P(A_i)\,P(B)$.`, T`Cette égalité caractérise l'indépendance de $A_i$ et $B$, qui n'est pas supposée. En général, c'est la probabilité <em>conditionnelle</em> $P_{A_i}(B)$ qui intervient.`],
  [T`Les événements $B \cap A_i$ ne sont pas incompatibles : il faut retrancher les probabilités de leurs intersections.`, T`Deux événements $B \cap A_i$ et $B \cap A_j$ sont contenus dans $A_i$ et $A_j$, qui sont incompatibles : ils le sont donc aussi, et l'on additionne sans rien retrancher.`] ]),
demo('markov', 'sup', Pr, 'ma-21', 'Inégalité de Markov', T`Soit $X$ une variable aléatoire réelle positive sur un univers fini, et $a > 0$. Alors $P(X \geqslant a) \leqslant \dfrac{E(X)}{a}$.`, [
  [T`Notons $\mathbf{1}_A$ l'indicatrice de l'événement $A = (X \geqslant a)$. On a $X \geqslant a\,\mathbf{1}_A$ : si $X \geqslant a$, le membre de droite vaut $a$ ; sinon il vaut 0, et $X \geqslant 0$.`, '', T`l'inégalité $X \geqslant a\,\mathbf{1}_A$`],
  [T`Par croissance et linéarité de l'espérance, $E(X) \geqslant a\,E(\mathbf{1}_A)$.`, 'a', T`l'inégalité $E(X) \geqslant a\,E(\mathbf{1}_A)$`],
  [T`Or l'espérance d'une indicatrice est la probabilité de l'événement : $E(\mathbf{1}_A) = P(X \geqslant a)$.`, 'a', T`l'espérance de l'indicatrice`],
  [T`Donc $E(X) \geqslant a\,P(X \geqslant a)$, et l'on conclut en divisant par $a > 0$.`, 'bc'] ], [
  [T`On a $X \leqslant a\,\mathbf{1}_A$.`, T`L'inégalité est dans l'autre sens : quand $X \geqslant a$, la variable $X$ peut dépasser $a$ de beaucoup, alors que $a\,\mathbf{1}_A$ vaut exactement $a$.`],
  [T`L'inégalité vaut pour toute variable aléatoire réelle, positive ou non.`, T`C'est faux : pour $X$ valant $2$ ou $-4$ avec probabilité $\frac12$ chacune et $a = 1$, on a $P(X \geqslant 1) = \frac12$ alors que $E(X) = -1$. La positivité sert quand $X < a$, pour écrire $X \geqslant 0$.`] ]),
demo('tchebychev', 'sup', Pr, 'ma-21', 'Inégalité de Bienaymé-Tchebychev', T`Soit $X$ une variable aléatoire réelle sur un univers fini, et $\delta > 0$. Alors $P\bigl(|X - E(X)| \geqslant \delta\bigr) \leqslant \dfrac{V(X)}{\delta^2}$.`, [
  [T`Posons $Y = \bigl(X - E(X)\bigr)^2$ : c'est une variable aléatoire positive.`, '', T`la variable positive $Y$`],
  [T`Comme $\delta > 0$, les événements $\bigl(|X - E(X)| \geqslant \delta\bigr)$ et $(Y \geqslant \delta^2)$ sont égaux.`, 'a', T`l'égalité des deux événements`],
  [T`L'inégalité de Markov, appliquée à $Y$ et au réel $\delta^2 > 0$, donne $P(Y \geqslant \delta^2) \leqslant \dfrac{E(Y)}{\delta^2}$.`, 'a', T`l'inégalité de Markov appliquée à $Y$`],
  [T`Or $E(Y) = V(X)$, par définition de la variance : on obtient l'inégalité annoncée.`, 'bc'] ], [
  [T`L'inégalité de Markov, appliquée à $X - E(X)$ et au réel $\delta$, donne $P\bigl(X - E(X) \geqslant \delta\bigr) \leqslant 0$.`, T`L'inégalité de Markov ne s'applique qu'aux variables positives, et $X - E(X)$, dont l'espérance est nulle, prend des valeurs des deux signes dès que $X$ n'est pas constante. C'est pour cela que l'on passe au carré.`],
  [T`Or $E(Y) = \sigma(X)$, l'écart-type de $X$.`, T`L'espérance du carré de l'écart à la moyenne est la variance ; l'écart-type en est la racine carrée.`] ]),
demo('koenig', 'sup', Pr, 'ma-21', 'Formule de König-Huygens', T`Pour toute variable aléatoire réelle $X$ sur un univers fini : $V(X) = E(X^2) - E(X)^2$.`, [
  [T`Notons $m = E(X)$. Par définition, $V(X) = E\bigl((X - m)^2\bigr)$, et $(X - m)^2 = X^2 - 2mX + m^2$.`, '', T`le développement de $(X - m)^2$`],
  [T`Par linéarité de l'espérance, $m$ étant une constante : $V(X) = E(X^2) - 2m\,E(X) + m^2$.`, 'a', T`l'expression de $V(X)$ obtenue par linéarité`],
  [T`Comme $E(X) = m$, cela s'écrit $V(X) = E(X^2) - 2m^2 + m^2$.`, 'b', T`le remplacement de $E(X)$ par $m$`],
  [T`Donc $V(X) = E(X^2) - m^2 = E(X^2) - E(X)^2$.`, 'c'] ], [
  [T`Par définition, $V(X) = E\bigl((X - m)^2\bigr)$, et $(X - m)^2 = X^2 - m^2$.`, T`Le carré d'une différence comporte un double produit : $(X - m)^2 = X^2 - 2mX + m^2$. L'égalité écrite est donc fausse, même si elle conduirait par hasard à la bonne formule : l'oubli du double produit et l'erreur de signe sur $m^2$ s'y compensent.`],
  [T`Par linéarité, $E(X^2) = E(X)^2$, donc $V(X) = 0$.`, T`L'espérance est linéaire, elle ne commute pas avec le carré. L'écart entre $E(X^2)$ et $E(X)^2$ est précisément la variance, qui n'est nulle que pour une variable presque sûrement constante.`] ]),
// ---------- Ajouts du 12 nov. (audit des chapitres, §146) ----------
// Fondements et calcul
demo('binome-denombrement', 'sup', F, 'ma-03', 'Formule du binôme par dénombrement', T`Soit $a$ et $b$ deux nombres complexes et $n \geqslant 1$ un entier. Alors $(a + b)^n = \displaystyle\sum_{k=0}^{n} \binom nk a^k b^{n-k}$.`, [
  [T`Le nombre $(a + b)^n$ est le produit de $n$ facteurs égaux à $(a + b)$. Pour le développer, on choisit dans chaque facteur soit $a$, soit $b$, on multiplie les $n$ termes choisis, et l'on additionne les résultats de tous les choix possibles.`, '', T`la description du développement par des choix`],
  [T`Comme $ab = ba$, un choix où $a$ est pris dans exactement $k$ facteurs donne le produit $a^k b^{n-k}$.`, 'a', T`la valeur $a^k b^{n-k}$ d'un choix`],
  [T`Le nombre de choix où $a$ est pris dans exactement $k$ facteurs est le nombre de parties à $k$ éléments de l'ensemble des $n$ facteurs : $\displaystyle\binom nk$.`, 'a', T`le nombre de choix donnant $a^k b^{n-k}$`],
  [T`En regroupant les termes égaux : $(a + b)^n = \displaystyle\sum_{k=0}^{n} \binom nk a^k b^{n-k}$.`, 'bc'] ], [
  [T`Le nombre de choix où $a$ est pris dans exactement $k$ facteurs est $n(n-1)\cdots(n-k+1)$.`, T`Ce nombre compte les façons de désigner $k$ facteurs dans un certain ordre. Or seul compte l'ensemble des facteurs où l'on prend $a$ : il faut diviser par $k!$.`],
  [T`Ce raisonnement n'utilise pas $ab = ba$ : la formule vaut pour deux matrices carrées quelconques.`, T`Sans commutativité, les produits obtenus dépendent de l'ordre : $(A + B)^2 = A^2 + AB + BA + B^2$, que l'on ne peut pas regrouper en $A^2 + 2AB + B^2$. La formule vaut pour des matrices qui commutent.`] ]),
demo('somme-carres', 'sup', F, 'ma-03', 'Somme des carrés', T`Pour tout entier $n \geqslant 1$ : $\displaystyle\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$.`, [
  [T`Pour tout entier $n \geqslant 1$, notons $P(n)$ l'égalité $\displaystyle\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}$.`, '', T`la propriété $P(n)$`],
  [T`Initialisation : pour $n = 1$, la somme vaut 1, et $\dfrac{1 \times 2 \times 3}{6} = 1$. Donc $P(1)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 1$ tel que $P(n)$ soit vraie. Alors $\displaystyle\sum_{k=1}^{n+1} k^2 = \frac{n(n+1)(2n+1)}{6} + (n+1)^2$.`, 'a', T`l'expression de la somme au rang $n + 1$`],
  [T`En mettant $\dfrac{n+1}{6}$ en facteur : cette somme vaut $\dfrac{(n+1)\bigl(n(2n+1) + 6(n+1)\bigr)}{6} = \dfrac{(n+1)(2n^2 + 7n + 6)}{6}$.`, 'c', T`la factorisation par $n + 1$`],
  [T`Or $2n^2 + 7n + 6 = (n + 2)(2n + 3)$ : la somme vaut $\dfrac{(n+1)(n+2)\bigl(2(n+1) + 1\bigr)}{6}$, et $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 1$.`, 'be'] ], [
  [T`Or $2n^2 + 7n + 6 = (n + 1)(2n + 6)$.`, T`Le développement de $(n + 1)(2n + 6)$ donne $2n^2 + 8n + 6$. La bonne factorisation est $(n + 2)(2n + 3)$, que l'on devine en écrivant ce que doit être la formule au rang $n + 1$.`],
  [T`La somme des carrés est le carré de la somme : $\displaystyle\sum_{k=1}^{n} k^2 = \left(\frac{n(n+1)}{2}\right)^2$.`, T`Pour $n = 2$, la somme des carrés vaut 5 et le carré de la somme vaut 9. Le carré de la somme des $n$ premiers entiers est en fait la somme de leurs <em>cubes</em>.`] ]),
demo('egalite-triangulaire', 'sup', F, 'ma-04', 'Cas d\'égalité de l\'inégalité triangulaire', T`Soit $z$ et $z'$ deux nombres complexes, avec $z' \neq 0$. Alors $|z + z'| = |z| + |z'|$ si et seulement s'il existe un réel $\lambda \geqslant 0$ tel que $z = \lambda z'$.`, [
  [T`Posons $w = z\overline{z'}$. On a $|z + z'|^2 = |z|^2 + 2\,\mathrm{Re}(w) + |z'|^2$ et $\bigl(|z| + |z'|\bigr)^2 = |z|^2 + 2|w| + |z'|^2$ : l'égalité des modules équivaut à $\mathrm{Re}(w) = |w|$.`, '', T`l'équivalence avec $\mathrm{Re}(w) = |w|$, où $w = z\overline{z'}$`],
  [T`Écrivons $w = x + iy$ : l'égalité $x = \sqrt{x^2 + y^2}$ équivaut à $y = 0$ et $x \geqslant 0$. Ainsi $\mathrm{Re}(w) = |w|$ si et seulement si $w$ est un réel positif.`, 'a', T`la condition « $w$ est un réel positif »`],
  [T`Si $w$ est un réel positif : en multipliant $w = z\overline{z'}$ par $z'$, on obtient $wz' = z|z'|^2$, donc $z = \lambda z'$ avec $\lambda = \dfrac{w}{|z'|^2} \geqslant 0$.`, 'b', T`le sens direct`],
  [T`Inversement, si $z = \lambda z'$ avec $\lambda \geqslant 0$, alors $w = \lambda z'\overline{z'} = \lambda|z'|^2$ est un réel positif.`, 'c'] ], [
  [T`Ainsi $\mathrm{Re}(w) = |w|$ si et seulement si $w$ est réel.`, T`Il faut de plus que ce réel soit positif : pour $w = -1$, la partie réelle vaut $-1$ et le module 1. Géométriquement, $z$ et $z'$ doivent être de même sens, pas seulement alignés avec l'origine.`],
  [T`L'égalité $|z + z'| = |z| + |z'|$ n'a lieu que si $z = z'$.`, T`Elle a lieu dès que les points images sont sur une même demi-droite issue de l'origine : $|1 + 2| = |1| + |2|$.`] ]),
demo('bijective-reciproque', 'sup', F, 'ma-02', 'Une application qui a une réciproque est bijective', T`Soit $f : E \to F$ une application. S'il existe $g : F \to E$ telle que $g \circ f = \mathrm{id}_E$ et $f \circ g = \mathrm{id}_F$, alors $f$ est bijective.`, [
  [T`Injectivité : soit $x$ et $x'$ dans $E$ tels que $f(x) = f(x')$. En appliquant $g$ : $g\bigl(f(x)\bigr) = g\bigl(f(x')\bigr)$, c'est-à-dire $x = x'$, puisque $g \circ f = \mathrm{id}_E$.`, '', T`l'injectivité de $f$`],
  [T`Surjectivité : soit $y$ un élément de $F$, et posons $x = g(y)$, qui est un élément de $E$.`, 'a', T`l'élément $x = g(y)$`],
  [T`Alors $f(x) = f\bigl(g(y)\bigr) = y$, puisque $f \circ g = \mathrm{id}_F$ : tout élément de $F$ a un antécédent par $f$.`, 'b', T`la surjectivité de $f$`],
  [T`L'application $f$ est injective et surjective : elle est bijective.`, 'ac'] ], [
  [T`Comme $g \circ f = \mathrm{id}_E$, l'application $f$ est surjective.`, T`L'égalité $g \circ f = \mathrm{id}_E$ donne l'injectivité de $f$, pas sa surjectivité : avec $f : \{0\} \to \{0, 1\}$, $f(0) = 0$, et $g$ constante égale à 0, on a $g \circ f = \mathrm{id}$ et $f$ n'est pas surjective. C'est $f \circ g = \mathrm{id}_F$ qui fournit les antécédents.`],
  [T`Une seule des deux égalités suffit : si $g \circ f = \mathrm{id}_E$, alors $f$ est bijective.`, T`Le même exemple le réfute : $f : \{0\} \to \{0, 1\}$ vérifie $g \circ f = \mathrm{id}$ sans être bijective. Les deux égalités jouent des rôles différents, l'une pour l'injectivité, l'autre pour la surjectivité.`] ]),
demo('de-morgan', 'sup', F, 'ma-01', 'Loi de De Morgan', T`Soit $A$ et $B$ deux parties d'un ensemble $E$. Alors $\overline{A \cup B} = \overline A \cap \overline B$, où la barre désigne le complémentaire dans $E$.`, [
  [T`Soit $x$ un élément de $E$. Par définition du complémentaire, $x \in \overline{A \cup B}$ équivaut à $x \notin A \cup B$.`, '', T`la traduction de $x \in \overline{A \cup B}$`],
  [T`Or $x \in A \cup B$ signifie « $x \in A$ ou $x \in B$ », et la négation de « $P$ ou $Q$ » est « non $P$ et non $Q$ » : donc $x \notin A \cup B$ équivaut à « $x \notin A$ et $x \notin B$ ».`, 'a', T`la négation de l'appartenance à la réunion`],
  [T`C'est dire que $x \in \overline A$ et $x \in \overline B$, c'est-à-dire $x \in \overline A \cap \overline B$.`, 'b', T`la traduction en $x \in \overline A \cap \overline B$`],
  [T`Les deux ensembles ont les mêmes éléments : ils sont égaux.`, 'c'] ], [
  [T`La négation de « $P$ ou $Q$ » est « non $P$ ou non $Q$ » : donc $x \notin A \cup B$ équivaut à « $x \notin A$ ou $x \notin B$ ».`, T`Nier « l'un des deux au moins est vrai », c'est affirmer « aucun des deux n'est vrai » : la négation échange « ou » et « et ». Un élément de $A$ qui n'est pas dans $B$ vérifie « $x \notin A$ ou $x \notin B$ » tout en appartenant à $A \cup B$.`],
  [T`Il suffit de le vérifier sur un exemple : avec $E = \{1, 2, 3\}$, $A = \{1\}$ et $B = \{2\}$, les deux ensembles valent $\{3\}$.`, T`Un exemple illustre un énoncé général, il ne le démontre pas. Il faut un raisonnement valable pour toutes les parties $A$ et $B$ de tout ensemble $E$.`] ]),
// Algèbre
demo('sous-groupes-z', 'sup', A, 'ma-11', 'Sous-groupes de ℤ', T`Tout sous-groupe $H$ de $(\mathbb{Z}, +)$ est de la forme $n\mathbb{Z}$, pour un entier $n \geqslant 0$.`, [
  [T`Si $H = \{0\}$, alors $H = 0\mathbb{Z}$. Sinon, $H$ contient un entier non nul et son opposé, donc un entier strictement positif : soit $n$ le plus petit élément strictement positif de $H$.`, '', T`l'entier $n$, plus petit élément strictement positif de $H$`],
  [T`Comme $H$ est stable par addition et par passage à l'opposé, il contient tous les multiples de $n$ : $n\mathbb{Z} \subset H$.`, 'a', T`l'inclusion $n\mathbb{Z} \subset H$`],
  [T`Soit maintenant $x \in H$. Effectuons la division euclidienne de $x$ par $n$ : $x = nq + r$, avec $0 \leqslant r < n$.`, 'a', T`la division euclidienne $x = nq + r$`],
  [T`Alors $r = x - nq$ appartient à $H$, puisque $x$ et $nq$ y sont. Si $r$ était strictement positif, ce serait un élément strictement positif de $H$ plus petit que $n$ : donc $r = 0$.`, 'bc', T`le fait que $r = 0$`],
  [T`Ainsi $x = nq \in n\mathbb{Z}$ : on a $H \subset n\mathbb{Z}$, et finalement $H = n\mathbb{Z}$.`, 'd'] ], [
  [T`Soit $n$ le plus grand élément de $H$.`, T`Un sous-groupe non nul de $\mathbb{Z}$ n'est pas majoré : s'il contient $x > 0$, il contient $2x$, $3x$, et ainsi de suite. C'est le plus petit élément strictement positif qui existe toujours.`],
  [T`Comme $r < n$, on a $r = 0$.`, T`L'inégalité $r < n$ laisse à $r$ les valeurs $0, 1, \dots, n - 1$. Ce qui force $r = 0$, c'est que $r$ appartient à $H$ et que $n$ est le plus petit élément strictement positif de $H$.`] ]),
demo('noyau-sous-groupe', 'sup', A, 'ma-11', 'Le noyau d\'un morphisme est un sous-groupe', T`Soit $f : G \to G'$ un morphisme de groupes et $e'$ l'élément neutre de $G'$. Alors $\operatorname{Ker} f = \{x \in G \mid f(x) = e'\}$ est un sous-groupe de $G$.`, [
  [T`L'image par $f$ de l'élément neutre $e$ de $G$ est $e'$ : donc $e \in \operatorname{Ker} f$, qui n'est pas vide.`, '', T`le fait que le noyau n'est pas vide`],
  [T`Soit $x$ et $y$ deux éléments de $\operatorname{Ker} f$.`, '', T`deux éléments $x$, $y$ du noyau`],
  [T`Comme $f$ est un morphisme, $f(xy^{-1}) = f(x)\,f(y)^{-1} = e'\,e'^{-1} = e'$.`, 'b', T`le calcul $f(xy^{-1}) = e'$`],
  [T`Donc $xy^{-1} \in \operatorname{Ker} f$. Non vide et stable par $(x, y) \mapsto xy^{-1}$, le noyau est un sous-groupe de $G$.`, 'ac'] ], [
  [T`Comme $x$ et $y$ sont dans le noyau, $x = y = e$.`, T`Le noyau peut contenir d'autres éléments que le neutre : pour $n \mapsto (-1)^n$, de $(\mathbb{Z}, +)$ dans $(\{-1, 1\}, \times)$, le noyau est l'ensemble des entiers pairs. Il n'est réduit à $\{e\}$ que si $f$ est injectif.`],
  [T`Le noyau contient l'élément neutre $e'$ de $G'$ : il n'est donc pas vide.`, T`Le noyau est une partie de $G$, l'ensemble de départ : il ne peut pas contenir $e'$, qui est dans $G'$. C'est $e$, le neutre de $G$, qui lui appartient.`] ]),
demo('morphisme-injectif', 'sup', A, 'ma-11', 'Morphisme injectif et noyau', T`Soit $f : G \to G'$ un morphisme de groupes, $e$ et $e'$ les éléments neutres. Alors $f$ est injectif si et seulement si $\operatorname{Ker} f = \{e\}$.`, [
  [T`Supposons $f$ injectif, et soit $x \in \operatorname{Ker} f$ : alors $f(x) = e' = f(e)$, donc $x = e$. Comme $e$ est dans le noyau, $\operatorname{Ker} f = \{e\}$.`, '', T`le sens direct`],
  [T`Réciproquement, supposons $\operatorname{Ker} f = \{e\}$, et soit $x$ et $y$ dans $G$ tels que $f(x) = f(y)$.`, 'a', T`deux éléments $x$, $y$ de même image`],
  [T`Alors $f(xy^{-1}) = f(x)\,f(y)^{-1} = e'$.`, 'b', T`le calcul $f(xy^{-1}) = e'$`],
  [T`Donc $xy^{-1} \in \operatorname{Ker} f = \{e\}$ : $xy^{-1} = e$, c'est-à-dire $x = y$. Le morphisme $f$ est injectif.`, 'c'] ], [
  [T`Comme $f(e) = e'$, le noyau de $f$ est $\{e\}$ : tout morphisme de groupes est injectif.`, T`L'égalité $f(e) = e'$ dit que le noyau <em>contient</em> $e$, pas qu'il s'y réduit. Le morphisme $n \mapsto (-1)^n$ de $\mathbb{Z}$ dans $\{-1, 1\}$ n'est pas injectif.`],
  [T`Donc $xy^{-1} = e$, c'est-à-dire $x = y^{-1}$.`, T`En multipliant $xy^{-1} = e$ à droite par $y$, on obtient $x = y$. L'égalité $x = y^{-1}$ correspondrait à $xy = e$.`] ]),
demo('integre-fini', 'sup', A, 'ma-11', 'Un anneau intègre fini est un corps', T`Soit $A$ un anneau commutatif intègre et fini. Alors $A$ est un corps.`, [
  [T`Soit $a$ un élément non nul de $A$, et considérons l'application $\varphi : A \to A$, $x \mapsto ax$.`, '', T`l'application $\varphi : x \mapsto ax$`],
  [T`Elle est injective : si $ax = ay$, alors $a(x - y) = 0$, et comme $A$ est intègre et $a \neq 0$, on a $x - y = 0$.`, 'a', T`l'injectivité de $\varphi$`],
  [T`L'ensemble $A$ étant fini, une application injective de $A$ dans $A$ est bijective : $\varphi$ est en particulier surjective.`, 'b', T`la surjectivité de $\varphi$`],
  [T`L'élément 1 a donc un antécédent $b$ : $ab = 1$, et $a$ est inversible.`, 'c', T`l'existence d'un inverse de $a$`],
  [T`Tout élément non nul de $A$ est inversible : l'anneau commutatif $A$ est un corps.`, 'd'] ], [
  [T`Une application injective de $A$ dans $A$ est bijective, que $A$ soit fini ou non.`, T`C'est faux pour un ensemble infini : $x \mapsto 2x$ est injective de $\mathbb{Z}$ dans $\mathbb{Z}$ sans être surjective. Aussi $\mathbb{Z}$, anneau intègre infini, n'est-il pas un corps.`],
  [T`Elle est injective : si $ax = ay$, on multiplie par $a^{-1}$ pour obtenir $x = y$.`, T`L'existence de $a^{-1}$ est précisément ce que l'on cherche à démontrer : on ne peut pas s'en servir. L'intégrité permet de simplifier par $a$ sans disposer d'un inverse.`] ]),
demo('decomposition-unicite', 'sup', A, 'ma-12', 'Unicité de la décomposition en facteurs premiers', T`Si $p_1 \cdots p_r = q_1 \cdots q_s$, où les $p_i$ et les $q_j$ sont des nombres premiers, alors $r = s$ et les $q_j$ sont les $p_i$, à l'ordre près.`, [
  [T`Raisonnons par récurrence sur $r \geqslant 1$, en notant $H(r)$ : « si un produit de $r$ nombres premiers $p_1 \cdots p_r$ est égal à un produit de nombres premiers $q_1 \cdots q_s$, alors $s = r$ et les $q_j$ sont les $p_i$ à l'ordre près ».`, '', T`la propriété $H(r)$`],
  [T`Initialisation : si $p_1 = q_1 \cdots q_s$, alors $q_1$ divise le nombre premier $p_1$, donc $q_1 = p_1$ ; en simplifiant, le produit des autres $q_j$ vaut 1, ce qui impose $s = 1$. Donc $H(1)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $r \geqslant 1$ tel que $H(r)$ soit vraie, et supposons $p_1 \cdots p_{r+1} = q_1 \cdots q_s$. Le nombre premier $p_{r+1}$ divise le produit $q_1 \cdots q_s$ : d'après le lemme d'Euclide, il divise l'un des $q_j$, que l'on peut supposer être $q_s$ en changeant l'ordre.`, 'a', T`le fait que $p_{r+1}$ divise $q_s$`],
  [T`Comme $q_s$ est premier et que $p_{r+1} \geqslant 2$ le divise, $p_{r+1} = q_s$.`, 'c', T`l'égalité $p_{r+1} = q_s$`],
  [T`En simplifiant par ce facteur : $p_1 \cdots p_r = q_1 \cdots q_{s-1}$ ; le membre de gauche étant au moins égal à 2, on a $s \geqslant 2$. D'après $H(r)$, $s - 1 = r$ et les facteurs sont les mêmes à l'ordre près : $H(r+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $H(r)$ est vraie pour tout entier $r \geqslant 1$.`, 'be'] ], [
  [T`Le nombre premier $p_{r+1}$ divise le produit $q_1 \cdots q_s$ : il divise donc chacun des $q_j$.`, T`Le lemme d'Euclide dit qu'un nombre premier qui divise un produit divise <em>l'un</em> des facteurs, pas tous : 3 divise $2 \times 3$ sans diviser 2.`],
  [T`Comme $p_{r+1}$ divise $q_s$, le nombre $q_s$ n'est pas premier : contradiction.`, T`Un nombre premier est divisible par 1 et par lui-même. Qu'un nombre premier $p_{r+1}$ divise $q_s$ n'a rien de contradictoire : cela impose seulement $p_{r+1} = q_s$.`] ]),
demo('division-polynomes', 'sup', A, 'ma-13', 'Unicité de la division euclidienne des polynômes', T`Soit $A$ et $B$ deux polynômes de $\mathbb{K}[X]$, avec $B \neq 0$. Il existe au plus un couple $(Q, R)$ tel que $A = BQ + R$ et $\deg R < \deg B$.`, [
  [T`Supposons $A = BQ + R = BQ' + R'$, avec $\deg R < \deg B$ et $\deg R' < \deg B$.`, '', T`les deux écritures de $A$`],
  [T`En retranchant : $B(Q - Q') = R' - R$.`, 'a', T`l'égalité $B(Q - Q') = R' - R$`],
  [T`Le degré d'une différence est au plus le plus grand des deux degrés : $\deg(R' - R) < \deg B$.`, 'a', T`la majoration $\deg(R' - R) < \deg B$`],
  [T`Si $Q \neq Q'$, alors $\deg\bigl(B(Q - Q')\bigr) = \deg B + \deg(Q - Q') \geqslant \deg B$, ce qui contredit les deux lignes précédentes. Donc $Q = Q'$.`, 'bc', T`l'égalité $Q = Q'$`],
  [T`En reportant, $R' - R = 0$ : $R = R'$. Les deux couples sont égaux.`, 'd'] ], [
  [T`Le degré d'une différence est la différence des degrés : $\deg(R' - R) = \deg R' - \deg R$.`, T`C'est le degré d'un <em>quotient</em> qui est une différence de degrés. Pour une somme ou une différence, on a seulement $\deg(R' - R) \leqslant \max(\deg R, \deg R')$.`],
  [T`L'égalité $B(Q - Q') = R' - R$ montre que $B$ divise $R$ et $R'$.`, T`Elle montre que $B$ divise la <em>différence</em> $R' - R$, ce qui n'entraîne pas qu'il divise chacun des deux. C'est par les degrés que l'on conclut.`] ]),
demo('racine-multiple', 'sup', A, 'ma-13', 'Racine multiple et dérivée', T`Soit $P \in \mathbb{K}[X]$ et $a$ une racine de $P$. Alors $(X - a)^2$ divise $P$ si et seulement si $P'(a) = 0$.`, [
  [T`Comme $a$ est racine de $P$, il existe un polynôme $Q$ tel que $P = (X - a)Q$.`, '', T`la factorisation $P = (X - a)Q$`],
  [T`En dérivant ce produit : $P' = Q + (X - a)Q'$, donc $P'(a) = Q(a)$.`, 'a', T`l'égalité $P'(a) = Q(a)$`],
  [T`Par ailleurs, $(X - a)^2$ divise $P = (X - a)Q$ si et seulement si $X - a$ divise $Q$, c'est-à-dire si et seulement si $Q(a) = 0$.`, 'a', T`l'équivalence entre « $(X - a)^2$ divise $P$ » et $Q(a) = 0$`],
  [T`Ainsi $(X - a)^2$ divise $P$ si et seulement si $Q(a) = 0$, c'est-à-dire si et seulement si $P'(a) = 0$.`, 'bc'] ], [
  [T`En dérivant : $P' = Q'$, donc $P'(a) = Q'(a)$.`, T`Le polynôme $P$ est un produit : $P' = (X - a)'Q + (X - a)Q' = Q + (X - a)Q'$. Le facteur $X - a$ n'est pas une constante que l'on pourrait oublier.`],
  [T`Toute racine $a$ de $P$ vérifie $P'(a) = 0$.`, T`C'est faux : 0 est racine de $X$, dont le polynôme dérivé est la constante 1. L'annulation de $P'$ caractérise les racines <em>multiples</em>.`] ]),
demo('lagrange', 'sup', A, 'ma-13', 'Polynôme d\'interpolation de Lagrange', T`Soit $x_0, \dots, x_n$ des scalaires deux à deux distincts et $y_0, \dots, y_n$ des scalaires quelconques. Il existe un unique polynôme $P$ de degré au plus $n$ tel que $P(x_i) = y_i$ pour tout $i$.`, [
  [T`Unicité : si $P$ et $Q$ conviennent, le polynôme $P - Q$ est de degré au plus $n$ et s'annule aux $n + 1$ points distincts $x_0, \dots, x_n$.`, '', T`le polynôme $P - Q$, qui a $n + 1$ racines`],
  [T`Un polynôme non nul de degré au plus $n$ a au plus $n$ racines : le polynôme $P - Q$, qui en a $n + 1$, est donc nul, et $P = Q$.`, 'a', T`l'unicité`],
  [T`Existence : pour chaque $i$, posons $L_i = \displaystyle\prod_{j \neq i} \frac{X - x_j}{x_i - x_j}$. C'est un polynôme de degré $n$, qui vaut 1 en $x_i$ et 0 en $x_j$ pour $j \neq i$.`, 'b', T`les polynômes $L_i$`],
  [T`Le polynôme $P = \displaystyle\sum_{i=0}^{n} y_i L_i$ est de degré au plus $n$, et $P(x_j) = y_j$ pour tout $j$ : il convient.`, 'c'] ], [
  [T`Le polynôme $P - Q$ s'annule en $n + 1$ points : il est donc de degré $n + 1$.`, T`Différence de deux polynômes de degré au plus $n$, il est de degré au plus $n$. Avoir plus de racines que son degré ne le permet l'oblige à être le polynôme nul.`],
  [T`Pour chaque $i$, posons $L_i = \displaystyle\prod_{j \neq i} (X - x_j)$ : ce polynôme vaut 1 en $x_i$.`, T`Ce produit s'annule bien aux $x_j$ pour $j \neq i$, mais en $x_i$ il vaut $\displaystyle\prod_{j \neq i}(x_i - x_j)$, qui n'est pas 1 en général. Il faut diviser par ce nombre, non nul parce que les $x_j$ sont distincts.`] ]),
// Algèbre linéaire
demo('grassmann', 'sup', L, 'ma-15', 'Formule de Grassmann', T`Soit $F$ et $G$ deux sous-espaces de dimension finie d'un espace vectoriel $E$. Alors $\dim(F + G) = \dim F + \dim G - \dim(F \cap G)$.`, [
  [T`Considérons l'application $\varphi : F \times G \to E$, $(f, g) \mapsto f + g$. Elle est linéaire, et son image est $F + G$.`, '', T`l'application $\varphi$, d'image $F + G$`],
  [T`Son noyau est formé des couples $(f, g)$ tels que $g = -f$ ; alors $f = -g$ appartient à $F$ et à $G$. Donc $\operatorname{Ker}\varphi = \{(x, -x) \mid x \in F \cap G\}$, qui est isomorphe à $F \cap G$ par $x \mapsto (x, -x)$.`, 'a', T`le noyau de $\varphi$, de dimension $\dim(F \cap G)$`],
  [T`D'après le théorème du rang, $\dim(F \times G) = \dim \operatorname{Ker}\varphi + \operatorname{rg}\varphi$, c'est-à-dire $\dim F + \dim G = \dim(F \cap G) + \dim(F + G)$.`, 'b', T`l'égalité donnée par le théorème du rang`],
  [T`On en déduit $\dim(F + G) = \dim F + \dim G - \dim(F \cap G)$.`, 'c'] ], [
  [T`Son noyau est réduit à $(0_E, 0_E)$ : si $f + g = 0_E$, alors $f = g = 0_E$.`, T`De $f + g = 0_E$ on tire seulement $g = -f$, avec $f \in F \cap G$. Le noyau n'est nul que si $F \cap G = \{0_E\}$, c'est-à-dire si la somme est directe.`],
  [T`D'après le théorème du rang, $\dim(F \times G) = \dim F \times \dim G$.`, T`La dimension d'un produit d'espaces est la <em>somme</em> des dimensions : une base de $F \times G$ s'obtient en réunissant les $(e_i, 0)$ et les $(0, e'_j)$. C'est le cardinal d'un produit d'ensembles finis qui est un produit.`] ]),
demo('injectif-surjectif', 'sup', L, 'ma-15', 'Injectif, surjectif, bijectif en dimension finie', T`Soit $E$ un espace vectoriel de dimension finie $n$ et $u$ un endomorphisme de $E$. Alors $u$ est injectif si et seulement s'il est surjectif.`, [
  [T`D'après le théorème du rang, $\dim \operatorname{Ker} u + \operatorname{rg} u = n$.`, '', T`le théorème du rang`],
  [T`L'endomorphisme $u$ est injectif si et seulement si $\operatorname{Ker} u = \{0_E\}$, c'est-à-dire si et seulement si $\dim \operatorname{Ker} u = 0$.`, '', T`la traduction de l'injectivité`],
  [T`Il est surjectif si et seulement si $\operatorname{Im} u = E$, c'est-à-dire si et seulement si $\operatorname{rg} u = n$, car un sous-espace de $E$ de dimension $n$ est égal à $E$.`, '', T`la traduction de la surjectivité`],
  [T`Or, d'après le théorème du rang, $\dim \operatorname{Ker} u = 0$ équivaut à $\operatorname{rg} u = n$ : l'injectivité équivaut à la surjectivité.`, 'abc'] ], [
  [T`L'image de $u$ est un sous-espace de $E$ : donc $\operatorname{Im} u = E$, et $u$ est toujours surjectif.`, T`Un sous-espace de $E$ peut être strictement plus petit que $E$ : l'image de l'endomorphisme nul est $\{0_E\}$. C'est l'égalité des dimensions qui force l'égalité des espaces.`],
  [T`Ce résultat vaut aussi en dimension infinie.`, T`C'est faux : sur $\mathbb{R}[X]$, la dérivation est surjective sans être injective. Le théorème du rang, sur lequel tout repose, suppose l'espace de départ de dimension finie.`] ]),
demo('projecteur', 'sup', L, 'ma-14', 'Noyau et image d\'un projecteur', T`Soit $p$ un endomorphisme d'un espace vectoriel $E$ tel que $p \circ p = p$. Alors $E = \operatorname{Ker} p \oplus \operatorname{Im} p$.`, [
  [T`Soit $x \in E$. Écrivons $x = \bigl(x - p(x)\bigr) + p(x)$.`, '', T`la décomposition $x = (x - p(x)) + p(x)$`],
  [T`On a $p\bigl(x - p(x)\bigr) = p(x) - p\bigl(p(x)\bigr) = 0_E$ : le vecteur $x - p(x)$ est dans $\operatorname{Ker} p$, et $p(x)$ est dans $\operatorname{Im} p$. Donc $E = \operatorname{Ker} p + \operatorname{Im} p$.`, 'a', T`l'égalité $E = \operatorname{Ker} p + \operatorname{Im} p$`],
  [T`Soit $y \in \operatorname{Ker} p \cap \operatorname{Im} p$ : il existe $z \in E$ tel que $y = p(z)$, et $p(y) = 0_E$.`, 'b', T`un vecteur $y$ de l'intersection`],
  [T`Alors $p(y) = p\bigl(p(z)\bigr) = p(z) = y$, donc $y = 0_E$ : l'intersection est réduite au vecteur nul.`, 'c', T`le fait que l'intersection est nulle`],
  [T`La somme est donc directe : $E = \operatorname{Ker} p \oplus \operatorname{Im} p$.`, 'bd'] ], [
  [T`D'après le théorème du rang, $\dim \operatorname{Ker} p + \dim \operatorname{Im} p = \dim E$ : le noyau et l'image sont donc supplémentaires.`, T`L'égalité des dimensions ne suffit pas à rendre deux sous-espaces supplémentaires : pour $u(x, y) = (y, 0)$, le noyau et l'image sont égaux. De plus, rien ne dit ici que $E$ est de dimension finie.`],
  [T`Comme $p \circ p = p$, on simplifie par $p$ : $p = \mathrm{id}_E$.`, T`On ne simplifie par un endomorphisme que s'il est inversible, ce qu'un projecteur n'est pas en général : la projection de $\mathbb{R}^2$ sur le premier axe vérifie $p \circ p = p$ sans être l'identité.`] ]),
demo('transposee-produit', 'sup', L, 'ma-16', 'Transposée d\'un produit', T`Pour toutes matrices $A \in \mathcal{M}_{n,p}(\mathbb{K})$ et $B \in \mathcal{M}_{p,q}(\mathbb{K})$ : $(AB)^\top = B^\top A^\top$.`, [
  [T`Le coefficient d'indices $(i, j)$ de $(AB)^\top$ est le coefficient d'indices $(j, i)$ de $AB$, soit $\displaystyle\sum_{k=1}^{p} a_{jk}\,b_{ki}$.`, '', T`le coefficient $(i, j)$ de $(AB)^\top$`],
  [T`Le coefficient d'indices $(i, j)$ de $B^\top A^\top$ est $\displaystyle\sum_{k=1}^{p} (B^\top)_{ik}\,(A^\top)_{kj} = \sum_{k=1}^{p} b_{ki}\,a_{jk}$.`, '', T`le coefficient $(i, j)$ de $B^\top A^\top$`],
  [T`Le produit des scalaires étant commutatif, ces deux sommes sont égales.`, 'ab', T`l'égalité des coefficients`],
  [T`Les matrices $(AB)^\top$ et $B^\top A^\top$ ont la même taille, $q \times n$, et les mêmes coefficients : elles sont égales.`, 'c'] ], [
  [T`La transposée d'un produit est le produit des transposées, dans le même ordre : $(AB)^\top = A^\top B^\top$.`, T`Le produit $A^\top B^\top$, d'une matrice $p \times n$ par une matrice $q \times p$, n'est même pas défini en général. La transposition renverse l'ordre des facteurs.`],
  [T`Le coefficient d'indices $(i, j)$ de $(AB)^\top$ est $\displaystyle\sum_{k=1}^{p} a_{ik}\,b_{kj}$.`, T`C'est le coefficient $(i, j)$ de $AB$ lui-même. Transposer échange les deux indices : il faut prendre le coefficient $(j, i)$ de $AB$.`] ]),
demo('orthogonale-libre', 'sup', L, 'ma-19', 'Une famille orthogonale est libre', T`Dans un espace préhilbertien réel, toute famille orthogonale $(e_1, \dots, e_n)$ de vecteurs non nuls est libre.`, [
  [T`Soit $\lambda_1, \dots, \lambda_n$ des réels tels que $\lambda_1 e_1 + \dots + \lambda_n e_n = 0$.`, '', T`une combinaison linéaire nulle`],
  [T`Fixons un indice $j$ et prenons le produit scalaire avec $e_j$ : par linéarité, $\displaystyle\sum_{i=1}^{n} \lambda_i \langle e_i, e_j \rangle = 0$.`, 'a', T`l'égalité obtenue par produit scalaire avec $e_j$`],
  [T`La famille étant orthogonale, $\langle e_i, e_j \rangle = 0$ pour $i \neq j$ : il reste $\lambda_j \|e_j\|^2 = 0$.`, 'b', T`l'égalité $\lambda_j \|e_j\|^2 = 0$`],
  [T`Comme $e_j \neq 0$, on a $\|e_j\|^2 \neq 0$, donc $\lambda_j = 0$. Ceci vaut pour tout $j$ : la famille est libre.`, 'c'] ], [
  [T`Le résultat vaut même si l'un des vecteurs est nul.`, T`Une famille qui contient le vecteur nul est liée, et le vecteur nul est orthogonal à tous les autres. L'hypothèse « non nuls » sert à diviser par $\|e_j\|^2$.`],
  [T`Il reste $\lambda_j = 0$, puisque $\langle e_j, e_j \rangle = 1$.`, T`On a $\langle e_j, e_j \rangle = \|e_j\|^2$, qui ne vaut 1 que pour une famille ortho<em>normée</em>. Ici on sait seulement que ce nombre n'est pas nul.`] ]),
demo('pythagore', 'sup', L, 'ma-19', 'Théorème de Pythagore', T`Dans un espace préhilbertien réel, deux vecteurs $x$ et $y$ sont orthogonaux si et seulement si $\|x + y\|^2 = \|x\|^2 + \|y\|^2$.`, [
  [T`Par bilinéarité et symétrie du produit scalaire, $\|x + y\|^2 = \langle x + y, x + y \rangle = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2$.`, '', T`le développement de $\|x + y\|^2$`],
  [T`Donc $\|x + y\|^2 - \|x\|^2 - \|y\|^2 = 2\langle x, y \rangle$.`, 'a', T`l'égalité $\|x + y\|^2 - \|x\|^2 - \|y\|^2 = 2\langle x, y \rangle$`],
  [T`Cette quantité est nulle si et seulement si $\langle x, y \rangle = 0$.`, 'b', T`la condition $\langle x, y \rangle = 0$`],
  [T`Autrement dit, l'égalité $\|x + y\|^2 = \|x\|^2 + \|y\|^2$ a lieu si et seulement si $x$ et $y$ sont orthogonaux.`, 'c'] ], [
  [T`Pour tous vecteurs $x$ et $y$, $\|x + y\|^2 = \|x\|^2 + \|y\|^2$.`, T`Il manque le double produit $2\langle x, y \rangle$. Pour $y = x$, on obtiendrait $4\|x\|^2 = 2\|x\|^2$.`],
  [T`Si $x$ et $y$ sont orthogonaux, alors $\|x + y\| = \|x\| + \|y\|$.`, T`Ce sont les carrés des normes qui s'ajoutent. Dans $\mathbb{R}^2$, pour $x = (1, 0)$ et $y = (0, 1)$, on a $\|x + y\| = \sqrt2$, et non 2.`] ]),
demo('triangulaire-norme', 'sup', L, 'ma-19', 'Inégalité triangulaire pour la norme euclidienne', T`Dans un espace préhilbertien réel, pour tous vecteurs $x$ et $y$ : $\|x + y\| \leqslant \|x\| + \|y\|$.`, [
  [T`On a $\|x + y\|^2 = \|x\|^2 + 2\langle x, y \rangle + \|y\|^2$.`, '', T`le développement de $\|x + y\|^2$`],
  [T`D'après l'inégalité de Cauchy-Schwarz, $\langle x, y \rangle \leqslant |\langle x, y \rangle| \leqslant \|x\|\,\|y\|$.`, '', T`la majoration de $\langle x, y \rangle$`],
  [T`Donc $\|x + y\|^2 \leqslant \|x\|^2 + 2\|x\|\,\|y\| + \|y\|^2 = \bigl(\|x\| + \|y\|\bigr)^2$.`, 'ab', T`l'inégalité entre les carrés`],
  [T`Les deux nombres $\|x + y\|$ et $\|x\| + \|y\|$ étant positifs, on en déduit $\|x + y\| \leqslant \|x\| + \|y\|$.`, 'c'] ], [
  [T`D'après l'inégalité de Cauchy-Schwarz, $\langle x, y \rangle = \|x\|\,\|y\|$.`, T`Cauchy-Schwarz est une inégalité ; l'égalité $\langle x, y \rangle = \|x\|\,\|y\|$ n'a lieu que pour des vecteurs colinéaires et de même sens. Pour deux vecteurs orthogonaux non nuls, le produit scalaire est nul.`],
  [T`Deux réels dont les carrés sont rangés dans un certain ordre sont rangés dans le même ordre, quel que soit leur signe.`, T`C'est faux sans positivité : $(-3)^2 \geqslant 2^2$, et pourtant $-3 < 2$. La fonction carré n'est croissante que sur $[0, +\infty[$.`] ]),
demo('projete-distance', 'sup', L, 'ma-19', 'Le projeté orthogonal réalise la distance', T`Soit $F$ un sous-espace de dimension finie d'un espace préhilbertien réel $E$, $x \in E$, et $p(x)$ le projeté orthogonal de $x$ sur $F$. Pour tout $y \in F$ : $\|x - y\| \geqslant \|x - p(x)\|$, avec égalité si et seulement si $y = p(x)$.`, [
  [T`Soit $y \in F$. Écrivons $x - y = \bigl(x - p(x)\bigr) + \bigl(p(x) - y\bigr)$.`, '', T`la décomposition de $x - y$`],
  [T`Le vecteur $x - p(x)$ appartient à $F^\perp$, et $p(x) - y$ appartient à $F$ : ces deux vecteurs sont orthogonaux.`, 'a', T`l'orthogonalité des deux termes`],
  [T`D'après le théorème de Pythagore, $\|x - y\|^2 = \|x - p(x)\|^2 + \|p(x) - y\|^2 \geqslant \|x - p(x)\|^2$.`, 'b', T`l'inégalité entre les carrés des normes`],
  [T`Donc $\|x - y\| \geqslant \|x - p(x)\|$, avec égalité si et seulement si $\|p(x) - y\| = 0$, c'est-à-dire $y = p(x)$.`, 'c'] ], [
  [T`Les normes s'ajoutent : $\|x - y\| = \|x - p(x)\| + \|p(x) - y\|$.`, T`Pour deux vecteurs orthogonaux, ce sont les <em>carrés</em> des normes qui s'ajoutent. La somme des normes ne majore la norme de la somme que par l'inégalité triangulaire.`],
  [T`Le vecteur $p(x) - y$ appartient à $F^\perp$.`, T`Les vecteurs $p(x)$ et $y$ sont tous deux dans $F$, donc leur différence aussi. C'est $x - p(x)$ qui est dans l'orthogonal de $F$.`] ]),
demo('det-triangulaire', 'sup', L, 'ma-17', 'Déterminant d\'une matrice triangulaire', T`Le déterminant d'une matrice triangulaire supérieure est le produit de ses coefficients diagonaux.`, [
  [T`Pour tout entier $n \geqslant 1$, notons $H(n)$ : « le déterminant de toute matrice triangulaire supérieure de taille $n$ est le produit de ses coefficients diagonaux ».`, '', T`la propriété $H(n)$`],
  [T`Initialisation : une matrice de taille 1 a pour déterminant son unique coefficient. Donc $H(1)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 1$ tel que $H(n)$ soit vraie, et $T = (t_{ij})$ triangulaire supérieure de taille $n + 1$. Dans sa première colonne, seul $t_{11}$ peut être non nul : en développant selon cette colonne, $\det T = t_{11} \det T'$, où $T'$ s'obtient en supprimant la première ligne et la première colonne.`, 'a', T`l'égalité $\det T = t_{11} \det T'$`],
  [T`La matrice $T'$ est triangulaire supérieure de taille $n$, de coefficients diagonaux $t_{22}, \dots, t_{n+1,n+1}$ : d'après $H(n)$, $\det T' = t_{22} \cdots t_{n+1,n+1}$.`, 'c', T`la valeur de $\det T'$`],
  [T`Donc $\det T = t_{11}\,t_{22} \cdots t_{n+1,n+1}$ : $H(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $H(n)$ est vraie pour tout entier $n \geqslant 1$.`, 'be'] ], [
  [T`En développant selon cette colonne, $\det T = t_{11} + \det T'$.`, T`Dans un développement, chaque coefficient est <em>multiplié</em> par son cofacteur. Pour la matrice identité de taille 2, la formule écrite donnerait 2 au lieu de 1.`],
  [T`Ce résultat vaut pour toute matrice carrée : le déterminant est le produit des coefficients diagonaux.`, T`C'est faux : la matrice $\begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$ a pour déterminant $-1$, alors que le produit de ses coefficients diagonaux est nul. Les zéros sous la diagonale sont indispensables.`] ]),
// Analyse
demo('densite-q', 'sup', N, 'ma-07', 'Densité de ℚ dans ℝ', T`Soit $a < b$ deux réels. Il existe un nombre rationnel dans l'intervalle $]a, b[$.`, [
  [T`Comme $b - a > 0$ et que $\mathbb{R}$ est archimédien, il existe un entier $q \geqslant 1$ tel que $q(b - a) > 1$, c'est-à-dire $\dfrac1q < b - a$.`, '', T`l'entier $q$ tel que $\dfrac1q < b - a$`],
  [T`Posons $p = \lfloor qa \rfloor + 1$ : c'est un entier, et $qa < p \leqslant qa + 1$.`, 'a', T`l'entier $p$ et son encadrement`],
  [T`En divisant par $q > 0$ : $a < \dfrac pq \leqslant a + \dfrac1q$.`, 'b', T`l'encadrement de $\dfrac pq$`],
  [T`Or $a + \dfrac1q < a + (b - a) = b$ : le rationnel $\dfrac pq$ vérifie $a < \dfrac pq < b$.`, 'c'] ], [
  [T`Posons $p = \lfloor qa \rfloor$ : c'est un entier, et $qa < p$.`, T`La partie entière vérifie $\lfloor qa \rfloor \leqslant qa$ : elle est à gauche de $qa$, pas à droite. C'est l'entier suivant, $\lfloor qa \rfloor + 1$, qui dépasse strictement $qa$.`],
  [T`Le milieu $\dfrac{a + b}{2}$ est un rationnel de $]a, b[$.`, T`Le milieu est bien dans l'intervalle, mais il n'est rationnel que dans des cas particuliers : pour $a = 0$ et $b = \sqrt2$, il vaut $\dfrac{\sqrt2}{2}$, qui est irrationnel.`] ]),
demo('bolzano-weierstrass', 'sup', N, 'ma-07', 'Théorème de Bolzano-Weierstrass', T`De toute suite réelle bornée, on peut extraire une suite convergente.`, [
  [T`Soit $(u_n)$ une suite à valeurs dans un segment $[a_0, b_0]$. Construisons par récurrence des segments $[a_k, b_k]$ : on coupe $[a_k, b_k]$ en son milieu, et l'on garde une moitié qui contient $u_n$ pour une infinité d'indices $n$ ; l'une des deux au moins convient.`, '', T`les segments emboîtés $[a_k, b_k]$`],
  [T`La suite $(a_k)$ est croissante, $(b_k)$ est décroissante, et $b_k - a_k = \dfrac{b_0 - a_0}{2^k}$ tend vers 0 : ces suites sont adjacentes, et convergent vers une même limite $\ell$.`, 'a', T`la limite commune $\ell$ des suites $(a_k)$ et $(b_k)$`],
  [T`Construisons l'extraction : $\varphi(0) = 0$, puis, pour chaque $k$, un indice $\varphi(k+1) > \varphi(k)$ tel que $u_{\varphi(k+1)} \in [a_{k+1}, b_{k+1}]$ ; c'est possible, car ce segment contient $u_n$ pour une infinité d'indices.`, 'a', T`l'extraction $\varphi$`],
  [T`Pour tout $k$, on a $a_k \leqslant u_{\varphi(k)} \leqslant b_k$ : par encadrement, la suite extraite $\bigl(u_{\varphi(k)}\bigr)$ converge vers $\ell$.`, 'bc'] ], [
  [T`On garde une moitié qui contient au moins un terme de la suite.`, T`Un seul terme ne suffit pas : pour extraire une suite, il faut pouvoir choisir des indices de plus en plus grands, donc disposer d'une infinité d'indices dans chaque segment.`],
  [T`La suite $(u_n)$ est bornée : elle converge donc vers $\ell$.`, T`Une suite bornée peut diverger : $(-1)^n$ est bornée et n'a pas de limite. Le théorème n'affirme la convergence que d'une suite <em>extraite</em>.`] ]),
demo('bornes-atteintes', 'sup', N, 'ma-08', 'Théorème des bornes atteintes', T`Soit $f$ une fonction continue sur un segment $[a, b]$. Alors $f$ est majorée et atteint sa borne supérieure.`, [
  [T`Notons $M$ la borne supérieure de $f$ sur $[a, b]$, avec $M = +\infty$ si $f$ n'est pas majorée. Il existe une suite $(x_n)$ de points de $[a, b]$ telle que $f(x_n)$ tend vers $M$ (⋆ : on choisit un point $x_n$ pour chaque $n$, ce qui emploie l'axiome du choix dénombrable).`, '', T`la suite $(x_n)$ telle que $f(x_n) \to M$`],
  [T`La suite $(x_n)$ est bornée : d'après le théorème de Bolzano-Weierstrass, elle admet une suite extraite $\bigl(x_{\varphi(n)}\bigr)$ qui converge vers un réel $c$ ; et $a \leqslant x_{\varphi(n)} \leqslant b$ donne, à la limite, $c \in [a, b]$.`, 'a', T`la suite extraite convergeant vers $c \in [a, b]$`],
  [T`Comme $f$ est continue en $c$, la suite $\bigl(f(x_{\varphi(n)})\bigr)$ converge vers $f(c)$.`, 'b', T`la convergence de $f(x_{\varphi(n)})$ vers $f(c)$`],
  [T`Or cette suite, extraite de $\bigl(f(x_n)\bigr)$, tend aussi vers $M$ : par unicité de la limite, $M = f(c)$.`, 'c', T`l'égalité $M = f(c)$`],
  [T`Ainsi $M$ est un réel, donc $f$ est majorée, et sa borne supérieure est atteinte en $c$.`, 'd'] ], [
  [T`La suite $(x_n)$ est bornée : elle converge donc vers un réel $c$ de $[a, b]$.`, T`Une suite bornée ne converge pas nécessairement. On peut seulement en extraire une suite convergente, et cela suffit.`],
  [T`Ce raisonnement vaut aussi sur un intervalle ouvert $]a, b[$.`, T`Sur un intervalle ouvert, la limite $c$ peut être une borne exclue de l'intervalle : pour $f(x) = x$ sur $]0, 1[$, la borne supérieure 1 n'est pas atteinte. Le passage à la limite dans des inégalités larges exige un intervalle fermé.`] ]),
demo('inegalite-accroissements', 'sup', N, 'ma-09', 'Inégalité des accroissements finis', T`Soit $f$ une fonction dérivable sur un intervalle $I$, à valeurs réelles, et $k$ un réel tel que $|f'(t)| \leqslant k$ pour tout $t \in I$. Alors $|f(y) - f(x)| \leqslant k\,|y - x|$ pour tous $x, y \in I$.`, [
  [T`Soit $x$ et $y$ dans $I$. Si $x = y$, l'inégalité est évidente ; sinon, quitte à échanger les deux points, on suppose $x < y$.`, '', T`deux points $x < y$ de $I$`],
  [T`La fonction $f$ est continue sur $[x, y]$ et dérivable sur $]x, y[$ : l'égalité des accroissements finis fournit $c \in \,]x, y[$ tel que $f(y) - f(x) = f'(c)(y - x)$.`, 'a', T`le point $c$ donné par les accroissements finis`],
  [T`En prenant les valeurs absolues : $|f(y) - f(x)| = |f'(c)|\,|y - x|$.`, 'b', T`l'égalité entre valeurs absolues`],
  [T`Comme $|f'(c)| \leqslant k$, on obtient $|f(y) - f(x)| \leqslant k\,|y - x|$.`, 'c'] ], [
  [T`On a $f(y) - f(x) = f'(x)(y - x)$.`, T`La dérivée n'est pas prise en $x$, mais en un point $c$ strictement compris entre $x$ et $y$, dont on ne connaît que l'existence. L'égalité écrite n'est vraie que pour les fonctions affines.`],
  [T`D'après le théorème de Rolle, il existe $c \in \,]x, y[$ tel que $f'(c) = 0$, donc $f(y) = f(x)$.`, T`Le théorème de Rolle suppose $f(x) = f(y)$, et ne permet donc pas de l'obtenir. C'est l'égalité des accroissements finis qu'il faut invoquer.`] ]),
demo('leibniz', 'sup', N, 'ma-09', 'Formule de Leibniz', T`Soit $f$ et $g$ deux fonctions $n$ fois dérivables sur un intervalle. Alors $(fg)^{(n)} = \displaystyle\sum_{k=0}^{n} \binom nk f^{(k)} g^{(n-k)}$.`, [
  [T`Pour tout entier $n \geqslant 0$, notons $P(n)$ : « pour toutes fonctions $f$ et $g$ $n$ fois dérivables, $(fg)^{(n)} = \displaystyle\sum_{k=0}^{n} \binom nk f^{(k)} g^{(n-k)}$ ».`, '', T`la propriété $P(n)$`],
  [T`Initialisation : pour $n = 0$, les deux membres valent $fg$. Donc $P(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ tel que $P(n)$ soit vraie, et $f$, $g$ deux fonctions $n + 1$ fois dérivables. En dérivant chaque produit : $(fg)^{(n+1)} = \displaystyle\sum_{k=0}^{n} \binom nk \bigl(f^{(k+1)} g^{(n-k)} + f^{(k)} g^{(n+1-k)}\bigr)$.`, 'a', T`la dérivée de la formule au rang $n$`],
  [T`En posant $j = k + 1$ dans les premiers termes, puis en regroupant : pour $1 \leqslant k \leqslant n$, le coefficient de $f^{(k)} g^{(n+1-k)}$ est $\displaystyle\binom{n}{k-1} + \binom nk$.`, 'c', T`le regroupement des termes`],
  [T`D'après la relation de Pascal, ce coefficient vaut $\displaystyle\binom{n+1}{k}$ ; les termes extrêmes, $f g^{(n+1)}$ et $f^{(n+1)} g$, ont pour coefficient 1. Donc $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 0$.`, 'be'] ], [
  [T`La dérivée $n$-ième d'un produit est le produit des dérivées $n$-ièmes : $(fg)^{(n)} = f^{(n)} g^{(n)}$.`, T`C'est faux dès $n = 1$ : $(fg)' = f'g + fg'$. La formule de Leibniz est l'analogue, pour la dérivation, de la formule du binôme.`],
  [T`En dérivant chaque produit : $(fg)^{(n+1)} = \displaystyle\sum_{k=0}^{n} \binom nk f^{(k+1)} g^{(n+1-k)}$.`, T`La dérivée de $f^{(k)} g^{(n-k)}$ comporte deux termes, $f^{(k+1)} g^{(n-k)}$ et $f^{(k)} g^{(n+1-k)}$ : on ne dérive pas les deux facteurs à la fois.`] ]),
demo('convexe-derivable', 'sup', N, 'ma-09', 'Dérivée croissante et position par rapport aux tangentes', T`Soit $f$ une fonction dérivable sur un intervalle $I$, dont la dérivée $f'$ est croissante. Alors, pour tous $a$ et $x$ dans $I$ : $f(x) \geqslant f(a) + f'(a)(x - a)$.`, [
  [T`Soit $a$ et $x$ dans $I$, avec $x \neq a$, le cas $x = a$ étant évident. L'égalité des accroissements finis fournit un réel $c$ strictement compris entre $a$ et $x$ tel que $f(x) - f(a) = f'(c)(x - a)$.`, '', T`le point $c$ donné par les accroissements finis`],
  [T`Si $x > a$ : alors $c > a$, donc $f'(c) \geqslant f'(a)$, et comme $x - a > 0$, on a $f'(c)(x - a) \geqslant f'(a)(x - a)$.`, 'a', T`le cas $x > a$`],
  [T`Si $x < a$ : alors $c < a$, donc $f'(c) \leqslant f'(a)$ ; en multipliant par $x - a < 0$, le sens s'inverse : $f'(c)(x - a) \geqslant f'(a)(x - a)$.`, 'a', T`le cas $x < a$`],
  [T`Dans les deux cas, $f(x) - f(a) \geqslant f'(a)(x - a)$ : la courbe de $f$ est au-dessus de sa tangente en $a$.`, 'bc'] ], [
  [T`Si $x < a$ : alors $f'(c) \leqslant f'(a)$, donc $f'(c)(x - a) \leqslant f'(a)(x - a)$.`, T`On multiplie l'inégalité par $x - a$, qui est strictement négatif : le sens change. C'est ce qui fait que la courbe est au-dessus de sa tangente des deux côtés du point de contact.`],
  [T`L'égalité des accroissements finis donne $f(x) - f(a) = f'(a)(x - a)$.`, T`La dérivée est prise en un point $c$ situé strictement entre $a$ et $x$, et non en $a$. Avec l'égalité écrite, toute fonction dérivable serait affine.`] ]),
demo('dl-unicite', 'sup', N, 'ma-10', 'Unicité du développement limité', T`Si une fonction $f$ admet en 0 deux développements limités à l'ordre $n$, $f(x) = a_0 + a_1 x + \dots + a_n x^n + o(x^n)$ et $f(x) = b_0 + b_1 x + \dots + b_n x^n + o(x^n)$, alors $a_k = b_k$ pour tout $k$.`, [
  [T`Raisonnons par l'absurde : supposons que les coefficients ne soient pas tous égaux, et soit $p$ le plus petit indice tel que $a_p \neq b_p$.`, '', T`l'indice $p$, plus petit indice où les coefficients diffèrent`],
  [T`En retranchant les deux développements : $0 = (a_p - b_p)x^p + \dots + (a_n - b_n)x^n + o(x^n)$.`, 'a', T`la différence des deux développements`],
  [T`En divisant par $x^p$, pour $x \neq 0$ : $0 = (a_p - b_p) + (a_{p+1} - b_{p+1})x + \dots + (a_n - b_n)x^{n-p} + o(x^{n-p})$.`, 'b', T`l'égalité obtenue après division par $x^p$`],
  [T`Quand $x$ tend vers 0, tous les termes du second membre tendent vers 0, sauf le premier : donc $a_p - b_p = 0$, ce qui contredit le choix de $p$.`, 'c'] ], [
  [T`En retranchant, les deux restes s'éliminent, puisque $o(x^n) - o(x^n) = 0$ : les deux polynômes sont égaux pour tout $x$.`, T`La notation $o(x^n)$ ne désigne pas une fonction précise : les deux restes sont deux fonctions différentes, négligeables devant $x^n$. Leur différence est encore un $o(x^n)$, pas zéro.`],
  [T`En divisant par $x^p$, le reste $o(x^n)$ reste un $o(x^n)$.`, T`Dès que $p \geqslant 1$ (pour $p = 0$, la division ne change rien), diviser par $x^p$ une fonction négligeable devant $x^n$ donne une fonction négligeable devant $x^{n-p}$, ce qui est moins précis. Pour $p = n$, il ne reste qu'un $o(1)$, c'est-à-dire une fonction qui tend vers 0.`] ]),
demo('edl-ordre-1', 'sup', N, 'ma-06', 'Équation différentielle linéaire homogène d\'ordre 1', T`Soit $a$ une fonction continue sur un intervalle $I$ et $A$ une primitive de $a$. Les solutions sur $I$ de $y' + a(x)\,y = 0$ sont les fonctions $x \mapsto Ce^{-A(x)}$, où $C$ est une constante.`, [
  [T`Pour toute constante $C$, la fonction $x \mapsto Ce^{-A(x)}$ est solution : sa dérivée est $x \mapsto -a(x)\,Ce^{-A(x)}$.`, '', T`le fait que les fonctions $Ce^{-A}$ sont solutions`],
  [T`Réciproquement, soit $f$ une solution, et posons $g = f e^{A}$.`, 'a', T`la fonction $g = f e^{A}$`],
  [T`Alors $g' = f' e^{A} + f\,a\,e^{A} = (f' + af)\,e^{A} = 0$.`, 'b', T`le fait que $g'$ est nulle`],
  [T`Comme $I$ est un intervalle, la fonction $g$ est constante : il existe $C$ tel que $f(x)e^{A(x)} = C$ pour tout $x \in I$.`, 'c', T`la constante $C$`],
  [T`Donc $f(x) = Ce^{-A(x)}$ pour tout $x \in I$.`, 'd'] ], [
  [T`Alors $g' = f' e^{A}$, qui n'est pas nul en général.`, T`La fonction $g$ est un produit, et la dérivée de $e^{A}$ est $a\,e^{A}$ : il y a un second terme, $f\,a\,e^{A}$, et c'est la somme des deux qui est nulle.`],
  [T`Les solutions sont les fonctions $x \mapsto Ce^{-a(x)}$.`, T`C'est une <em>primitive</em> de $a$ qui figure dans l'exponentielle, pas $a$ elle-même. Pour $a(x) = 1$, les solutions de $y' + y = 0$ sont les $Ce^{-x}$, et non les constantes $Ce^{-1}$.`] ]),
demo('integrale-nulle', 'sup', N, 'ma-18', 'Fonction continue positive d\'intégrale nulle', T`Soit $f$ une fonction continue et positive sur $[a, b]$, avec $a < b$. Si $\displaystyle\int_a^b f = 0$, alors $f$ est nulle sur $[a, b]$.`, [
  [T`Raisonnons par contraposée : supposons qu'il existe $x_0 \in [a, b]$ tel que $f(x_0) > 0$.`, '', T`un point $x_0$ où $f(x_0) > 0$`],
  [T`Par continuité de $f$ en $x_0$, il existe un segment $[c, d] \subset [a, b]$, avec $c < d$, contenant $x_0$, sur lequel $f(t) \geqslant \dfrac{f(x_0)}{2}$.`, 'a', T`un segment $[c, d]$ sur lequel $f \geqslant \dfrac{f(x_0)}{2}$`],
  [T`Comme $f$ est positive, la relation de Chasles donne $\displaystyle\int_a^b f \geqslant \int_c^d f$.`, 'b', T`la minoration de l'intégrale par celle sur $[c, d]$`],
  [T`Par croissance de l'intégrale, $\displaystyle\int_c^d f \geqslant (d - c)\,\frac{f(x_0)}{2} > 0$.`, 'b', T`la minoration de l'intégrale sur $[c, d]$`],
  [T`Donc $\displaystyle\int_a^b f > 0$ : la contraposée est établie.`, 'cd'] ], [
  [T`Ce résultat vaut pour toute fonction positive, continue ou non.`, T`C'est faux pour une fonction continue par morceaux : la fonction nulle partout sauf en un point, où elle vaut 1, est positive, d'intégrale nulle, et n'est pas la fonction nulle. La continuité fournit le segment $[c, d]$.`],
  [T`Ce résultat vaut pour toute fonction continue, positive ou non.`, T`C'est faux : l'intégrale du sinus sur $[0, 2\pi]$ est nulle. Sans positivité, des aires de signes contraires peuvent se compenser.`] ]),
demo('taylor-integral', 'sup', N, 'ma-18', 'Formule de Taylor avec reste intégral', T`Soit $f$ une fonction de classe $\mathcal{C}^{n+1}$ sur un intervalle $I$, et $a, x \in I$. Alors $f(x) = \displaystyle\sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x - a)^k + \int_a^x \frac{(x - t)^n}{n!}\,f^{(n+1)}(t)\,dt$.`, [
  [T`Pour tout entier $n \geqslant 0$, notons $P(n)$ : « la formule est vraie à l'ordre $n$ pour toute fonction de classe $\mathcal{C}^{n+1}$ sur $I$ ».`, '', T`la propriété $P(n)$`],
  [T`Initialisation : pour $f$ de classe $\mathcal{C}^1$, $f(x) = f(a) + \displaystyle\int_a^x f'(t)\,dt$, d'après le théorème fondamental de l'analyse. Donc $P(0)$ est vraie.`, 'a', T`l'initialisation`],
  [T`Hérédité : soit $n \geqslant 0$ tel que $P(n)$ soit vraie, et $f$ de classe $\mathcal{C}^{n+2}$. Intégrons par parties le reste d'ordre $n$, en dérivant $f^{(n+1)}$ et en prenant pour primitive de $t \mapsto \dfrac{(x - t)^n}{n!}$ la fonction $t \mapsto -\dfrac{(x - t)^{n+1}}{(n+1)!}$.`, 'a', T`le choix de l'intégration par parties`],
  [T`On obtient $\displaystyle\int_a^x \frac{(x - t)^n}{n!} f^{(n+1)}(t)\,dt = \left[-\frac{(x - t)^{n+1}}{(n+1)!} f^{(n+1)}(t)\right]_a^x + \int_a^x \frac{(x - t)^{n+1}}{(n+1)!} f^{(n+2)}(t)\,dt$.`, 'c', T`le résultat de l'intégration par parties`],
  [T`Le crochet s'annule en $t = x$ et vaut $\dfrac{(x - a)^{n+1}}{(n+1)!} f^{(n+1)}(a)$ : c'est le terme d'ordre $n + 1$ de la somme, et $P(n+1)$ est vraie.`, 'd', T`l'hérédité`],
  [T`Par le principe de récurrence, $P(n)$ est vraie pour tout entier $n \geqslant 0$.`, 'be'] ], [
  [T`Une primitive de $t \mapsto \dfrac{(x - t)^n}{n!}$ est $t \mapsto \dfrac{(x - t)^{n+1}}{(n+1)!}$.`, T`La variable est $t$, et $x - t$ a pour dérivée $-1$ : en dérivant la fonction proposée, on trouve $-\dfrac{(x - t)^n}{n!}$. Il faut un signe moins devant la primitive.`],
  [T`Le crochet est nul, puisque $(x - t)^{n+1}$ s'annule.`, T`Ce facteur s'annule en $t = x$, mais pas en $t = a$, où il vaut $(x - a)^{n+1}$. C'est la borne $a$ qui fournit le nouveau terme de la somme.`] ]),
demo('convergence-absolue', 'sup', N, 'ma-20', 'La convergence absolue entraîne la convergence', T`Soit $(u_n)$ une suite réelle. Si la série $\sum |u_n|$ converge, alors la série $\sum u_n$ converge.`, [
  [T`Posons $u_n^+ = \max(u_n, 0)$ et $u_n^- = \max(-u_n, 0)$ : ce sont des réels positifs, et $u_n = u_n^+ - u_n^-$.`, '', T`les parties positive et négative de $u_n$`],
  [T`Pour tout $n$ : $0 \leqslant u_n^+ \leqslant |u_n|$ et $0 \leqslant u_n^- \leqslant |u_n|$.`, 'a', T`les majorations par $|u_n|$`],
  [T`Par comparaison de séries à termes positifs, les séries $\sum u_n^+$ et $\sum u_n^-$ convergent.`, 'b', T`la convergence des deux séries à termes positifs`],
  [T`La série $\sum u_n$, différence de deux séries convergentes, converge.`, 'c'] ], [
  [T`On a $u_n \leqslant |u_n|$ et la série $\sum |u_n|$ converge : par comparaison, la série $\sum u_n$ converge.`, T`Le théorème de comparaison exige des termes positifs : il ne s'applique pas directement à $u_n$, dont le signe est quelconque. C'est pour cela que l'on sépare les parties positive et négative.`],
  [T`Réciproquement, si la série $\sum u_n$ converge, alors la série $\sum |u_n|$ converge.`, T`C'est faux : la série harmonique alternée $\sum \dfrac{(-1)^n}{n}$ converge, alors que la série de ses valeurs absolues est la série harmonique, qui diverge.`] ]),
demo('riemann', 'sup', N, 'ma-20', 'Séries de Riemann convergentes', T`Pour tout réel $\alpha > 1$, la série $\displaystyle\sum \frac{1}{n^\alpha}$ converge.`, [
  [T`Soit $n \geqslant 2$. La fonction $t \mapsto \dfrac{1}{t^\alpha}$ étant décroissante, $\dfrac{1}{n^\alpha} \leqslant \dfrac{1}{t^\alpha}$ pour $t \in [n - 1, n]$ : donc $\dfrac{1}{n^\alpha} \leqslant \displaystyle\int_{n-1}^{n} \frac{dt}{t^\alpha}$.`, '', T`la majoration de $\dfrac{1}{n^\alpha}$ par une intégrale`],
  [T`En sommant de $n = 2$ à $N$, par la relation de Chasles : $\displaystyle\sum_{n=2}^{N} \frac{1}{n^\alpha} \leqslant \int_1^N \frac{dt}{t^\alpha}$.`, 'a', T`la majoration de la somme par une intégrale`],
  [T`Pour tout entier $N \geqslant 1$, $\displaystyle\int_1^N \frac{dt}{t^\alpha} = \frac{1 - N^{1-\alpha}}{\alpha - 1} \leqslant \frac{1}{\alpha - 1}$, puisque $\alpha > 1$.`, '', T`la majoration de l'intégrale`],
  [T`Les sommes partielles sont donc majorées par $1 + \dfrac{1}{\alpha - 1}$. La série étant à termes positifs, ses sommes partielles sont croissantes : elle converge.`, 'bc'] ], [
  [T`Le terme général $\dfrac{1}{n^\alpha}$ tend vers 0 : la série converge.`, T`C'est une condition nécessaire, pas suffisante : $\dfrac1n$ tend vers 0 et la série harmonique diverge. Il faut majorer les sommes partielles.`],
  [T`Ce calcul vaut aussi pour $\alpha = 1$ : l'intégrale $\displaystyle\int_1^N \frac{dt}{t}$ est majorée par 1.`, T`Pour $\alpha = 1$, la primitive n'est plus une puissance : l'intégrale vaut $\ln N$, qui tend vers $+\infty$. La série harmonique diverge.`] ]),
// Probabilités
demo('bayes', 'sup', Pr, 'ma-21', 'Formule de Bayes', T`Soit $A$ et $B$ deux événements tels que $0 < P(A) < 1$ et $P(B) > 0$. Alors $P_B(A) = \dfrac{P(A)\,P_A(B)}{P(A)\,P_A(B) + P(\overline A)\,P_{\overline A}(B)}$.`, [
  [T`Par définition, $P_B(A) = \dfrac{P(A \cap B)}{P(B)}$.`, '', T`la définition de $P_B(A)$`],
  [T`Par définition de $P_A(B)$, on a $P(A \cap B) = P(A)\,P_A(B)$.`, '', T`l'expression de $P(A \cap B)$`],
  [T`Donc $P_B(A) = \dfrac{P(A)\,P_A(B)}{P(B)}$.`, 'ab', T`la formule $P_B(A) = \dfrac{P(A)\,P_A(B)}{P(B)}$`],
  [T`D'après la formule des probabilités totales, appliquée au système complet $(A, \overline A)$ : $P(B) = P(A)\,P_A(B) + P(\overline A)\,P_{\overline A}(B)$.`, '', T`l'expression de $P(B)$ par les probabilités totales`],
  [T`En remplaçant $P(B)$ par cette expression, on obtient la formule annoncée.`, 'cd'] ], [
  [T`Les probabilités conditionnelles se renversent : $P_B(A) = P_A(B)$.`, T`C'est la confusion la plus répandue du chapitre. Les deux nombres sont reliés par $P_B(A) = \dfrac{P(A)\,P_A(B)}{P(B)}$, et ne sont égaux que si $P(A) = P(B)$ ou si $P(A \cap B) = 0$.`],
  [T`D'après la formule des probabilités totales, $P(B) = P_A(B) + P_{\overline A}(B)$.`, T`Chaque probabilité conditionnelle doit être pondérée par la probabilité de l'événement qui conditionne. Si $B$ est l'événement certain, la formule écrite donnerait $1 = 2$.`] ]),
demo('variance-somme', 'sup', Pr, 'ma-21', 'Variance d\'une somme de variables indépendantes', T`Soit $X$ et $Y$ deux variables aléatoires réelles indépendantes sur un univers fini. Alors $V(X + Y) = V(X) + V(Y)$.`, [
  [T`Posons $X' = X - E(X)$ et $Y' = Y - E(Y)$ : ce sont des variables d'espérance nulle, et $V(X + Y) = E\bigl((X' + Y')^2\bigr)$.`, '', T`les variables centrées $X'$ et $Y'$`],
  [T`En développant, par linéarité de l'espérance : $V(X + Y) = E(X'^2) + 2E(X'Y') + E(Y'^2)$.`, 'a', T`le développement de $V(X + Y)$`],
  [T`Les variables $X'$ et $Y'$ sont indépendantes, comme $X$ et $Y$ : donc $E(X'Y') = E(X')\,E(Y') = 0$.`, 'a', T`le fait que $E(X'Y') = 0$`],
  [T`Il reste $V(X + Y) = E(X'^2) + E(Y'^2) = V(X) + V(Y)$.`, 'bc'] ], [
  [T`On a $E(X'Y') = 0$ pour toutes variables aléatoires $X$ et $Y$, indépendantes ou non.`, T`C'est faux : pour $Y = X$, on a $E(X'Y') = E(X'^2) = V(X)$, qui n'est pas nul en général, et $V(X + X) = 4V(X)$. L'indépendance est ce qui annule le terme mixte.`],
  [T`En développant : $(X' + Y')^2 = X'^2 + Y'^2$.`, T`Le carré d'une somme comporte un double produit, $2X'Y'$. C'est son espérance qui doit être nulle, et elle ne l'est que sous une hypothèse sur $X$ et $Y$.`] ]),
demo('esperance-produit', 'sup', Pr, 'ma-21', 'Espérance d\'un produit de variables indépendantes', T`Soit $X$ et $Y$ deux variables aléatoires réelles indépendantes sur un univers fini. Alors $E(XY) = E(X)\,E(Y)$.`, [
  [T`D'après la formule de transfert, appliquée au couple $(X, Y)$ : $E(XY) = \displaystyle\sum_{x}\sum_{y} xy\,P(X = x, Y = y)$, les sommes portant sur les valeurs prises par $X$ et par $Y$.`, '', T`l'expression de $E(XY)$ par la formule de transfert`],
  [T`Les variables étant indépendantes, $P(X = x, Y = y) = P(X = x)\,P(Y = y)$ pour toutes valeurs $x$ et $y$.`, '', T`la factorisation des probabilités par indépendance`],
  [T`Donc $E(XY) = \displaystyle\sum_{x}\sum_{y} x\,P(X = x) \times y\,P(Y = y)$.`, 'ab', T`la somme double à variables séparées`],
  [T`Cette somme double finie se factorise : $E(XY) = \left(\displaystyle\sum_{x} x\,P(X = x)\right)\left(\displaystyle\sum_{y} y\,P(Y = y)\right) = E(X)\,E(Y)$.`, 'c'] ], [
  [T`Ce résultat vaut pour toutes variables aléatoires, indépendantes ou non.`, T`C'est faux : pour $X$ valant 1 ou $-1$ avec la probabilité $\dfrac12$ et $Y = X$, on a $E(XY) = E(X^2) = 1$, alors que $E(X)\,E(Y) = 0$.`],
  [T`Les variables étant indépendantes, $P(X = x, Y = y) = P(X = x) + P(Y = y)$.`, T`L'indépendance se traduit par un <em>produit</em> de probabilités. La somme écrite pourrait dépasser 1.`] ]),
demo('loi-faible-sup', 'sup', Pr, 'ma-21', 'Loi faible des grands nombres', T`Soit $(X_n)$ une suite de variables aléatoires indépendantes de même loi, d'espérance $m$ et de variance $\sigma^2$, et $M_n = \dfrac{X_1 + \dots + X_n}{n}$. Pour tout $\varepsilon > 0$, $P\bigl(|M_n - m| \geqslant \varepsilon\bigr)$ tend vers 0 quand $n$ tend vers $+\infty$.`, [
  [T`Par linéarité de l'espérance, $E(M_n) = \dfrac1n\bigl(E(X_1) + \dots + E(X_n)\bigr) = m$.`, '', T`l'espérance de $M_n$`],
  [T`Les variables étant indépendantes, $V(X_1 + \dots + X_n) = n\sigma^2$ ; donc $V(M_n) = \dfrac{1}{n^2} \times n\sigma^2 = \dfrac{\sigma^2}{n}$.`, '', T`la variance de $M_n$`],
  [T`D'après l'inégalité de Bienaymé-Tchebychev, appliquée à $M_n$ : $0 \leqslant P\bigl(|M_n - m| \geqslant \varepsilon\bigr) \leqslant \dfrac{\sigma^2}{n\varepsilon^2}$.`, 'ab', T`la majoration de la probabilité`],
  [T`Le majorant tend vers 0 quand $n$ tend vers $+\infty$ : par encadrement, $P\bigl(|M_n - m| \geqslant \varepsilon\bigr)$ tend vers 0.`, 'c'] ], [
  [T`La variance d'une moyenne est la moyenne des variances : $V(M_n) = \sigma^2$.`, T`Diviser une variable par $n$ divise sa variance par $n^2$ : $V(M_n) = \dfrac{\sigma^2}{n}$. Si la variance de la moyenne ne décroissait pas, il n'y aurait pas de loi des grands nombres.`],
  [T`La suite $(M_n)$ converge donc vers $m$ : pour tout tirage, $M_n$ tend vers $m$.`, T`Le théorème porte sur des probabilités d'écart, pas sur chaque suite de tirages : c'est une convergence « en probabilité ». L'énoncé sur presque toutes les suites de tirages est la loi <em>forte</em> des grands nombres, hors programme.`] ]),
];
