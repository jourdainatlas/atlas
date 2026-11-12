// Démonstrations à remettre en ordre : Maths Sup, trente pièces classées par thème (MEMO_atlas_activites.md §145).
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
  [T`L'ensemble $E$ des entiers strictement positifs de la forme $au + bv$, avec $u, v \in \mathbb{Z}$, n'est pas vide : il a un plus petit élément $d = au_0 + bv_0$.`, '', T`le plus petit élément $d = au_0 + bv_0$ de $E$`],
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
  [T`Sens réciproque : si $X - a$ divise $P$, alors $P = (X - a)S$ pour un polynôme $S$, et $P(a) = 0 \times S(a) = 0$.`, ''] ], [
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
  [T`En regroupant : $f - f' = g - g'$.`, T`De $f + g = f' + g'$ on tire $f - f' = g' - g$ : le signe est inversé. L'erreur est sans conséquence sur la conclusion, mais l'égalité écrite est fausse.`],
  [T`Le vecteur $f - f'$ appartient à $F$ et à $G$ : donc $f = g$.`, T`On obtient que $f - f'$ est nul, donc que $f = f'$ : ce sont les deux composantes dans $F$ qui sont égales. Rien ne relie $f$, vecteur de $F$, à $g$, vecteur de $G$.`] ]),
demo('image-libre', 'sup', L, 'ma-14', 'Image d\'une famille libre par une injection', T`Soit $u : E \to F$ une application linéaire injective et $(e_1, \dots, e_n)$ une famille libre de $E$. Alors $\bigl(u(e_1), \dots, u(e_n)\bigr)$ est une famille libre de $F$.`, [
  [T`Soit $\lambda_1, \dots, \lambda_n$ des scalaires tels que $\lambda_1 u(e_1) + \dots + \lambda_n u(e_n) = 0_F$.`, '', T`une combinaison linéaire nulle des $u(e_i)$`],
  [T`Par linéarité, cette égalité s'écrit $u(\lambda_1 e_1 + \dots + \lambda_n e_n) = 0_F$.`, 'a', T`l'égalité $u(\lambda_1 e_1 + \dots + \lambda_n e_n) = 0_F$`],
  [T`Comme $u$ est injective, son noyau est réduit à $0_E$ : donc $\lambda_1 e_1 + \dots + \lambda_n e_n = 0_E$.`, 'b', T`l'égalité $\lambda_1 e_1 + \dots + \lambda_n e_n = 0_E$`],
  [T`La famille $(e_1, \dots, e_n)$ étant libre, tous les $\lambda_i$ sont nuls : la famille des images est libre.`, 'c'] ], [
  [T`De $\lambda_1 u(e_1) + \dots + \lambda_n u(e_n) = 0_F$, on déduit que $u(e_i) = 0_F$ pour tout $i$.`, T`Une somme nulle n'a pas tous ses termes nuls, et un terme $\lambda_i u(e_i)$ nul ne donnerait pas $u(e_i) = 0_F$. Ce sont les coefficients $\lambda_i$ dont on veut montrer la nullité.`],
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
  [T`Comme $u_n \leqslant v_n \leqslant w_n$ et que $(u_n)$ et $(w_n)$ convergent, la suite $(v_n)$ converge.`, T`Sans l'égalité des deux limites, c'est faux : $-1 \leqslant (-1)^n \leqslant 1$, les suites constantes $-1$ et $1$ convergent, et $(-1)^n$ diverge. Il faut la même limite $\ell$, et c'est $\varepsilon$ qui la fait intervenir.`] ]),
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
  [T`La suite $(V_n)$ est croissante, car $v_n \geqslant 0$, et elle converge vers la somme $V$ de la série : donc $V_n \leqslant V$ pour tout $n$.`, '', T`la majoration $V_n \leqslant V$`],
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
  [T`L'inégalité de Markov, appliquée à $X - E(X)$ et au réel $\delta$, donne $P\bigl(X - E(X) \geqslant \delta\bigr) \leqslant 0$.`, T`L'inégalité de Markov ne s'applique qu'aux variables positives, et $X - E(X)$ prend des valeurs des deux signes puisque son espérance est nulle. C'est pour cela que l'on passe au carré.`],
  [T`Or $E(Y) = \sigma(X)$, l'écart-type de $X$.`, T`L'espérance du carré de l'écart à la moyenne est la variance ; l'écart-type en est la racine carrée.`] ]),
demo('koenig', 'sup', Pr, 'ma-21', 'Formule de König-Huygens', T`Pour toute variable aléatoire réelle $X$ sur un univers fini : $V(X) = E(X^2) - E(X)^2$.`, [
  [T`Notons $m = E(X)$. Par définition, $V(X) = E\bigl((X - m)^2\bigr)$, et $(X - m)^2 = X^2 - 2mX + m^2$.`, '', T`le développement de $(X - m)^2$`],
  [T`Par linéarité de l'espérance, $m$ étant une constante : $V(X) = E(X^2) - 2m\,E(X) + m^2$.`, 'a', T`l'expression de $V(X)$ obtenue par linéarité`],
  [T`Comme $E(X) = m$, cela s'écrit $V(X) = E(X^2) - 2m^2 + m^2$.`, 'b', T`le remplacement de $E(X)$ par $m$`],
  [T`Donc $V(X) = E(X^2) - m^2 = E(X^2) - E(X)^2$.`, 'c'] ], [
  [T`Par définition, $V(X) = E\bigl((X - m)^2\bigr)$, et $(X - m)^2 = X^2 - m^2$.`, T`Le carré d'une différence comporte un double produit : $(X - m)^2 = X^2 - 2mX + m^2$. Sans lui, le signe de $m^2$ serait faux lui aussi.`],
  [T`Par linéarité, $E(X^2) = E(X)^2$, donc $V(X) = 0$.`, T`L'espérance est linéaire, elle ne commute pas avec le carré. L'écart entre $E(X^2)$ et $E(X)^2$ est précisément la variance, qui n'est nulle que pour une variable presque sûrement constante.`] ]),
];
