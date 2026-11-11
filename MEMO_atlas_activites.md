# Mémo ATLAS — complément : rubrique Activités

> Complément de `MEMO_atlas.md` (à lire d'abord, section 0). Ce mémo décrit la rubrique des activités
> interactives : pages où l'on manipule une figure ou un paramètre avant de lire l'énoncé et la démonstration.
> Sections numérotées à partir de 117 (numérotation commune à tous les mémos).

### 117. La rubrique (11 nov. 2026)

**Domaine de la conversation.** `rubriques/activites.yaml`, le dossier `activites/`, `lecture-activites.mjs`,
ce mémo, tout outil `outils/activites_*` ; dans `gabarit.html`, `pageActivites`, `activitesMonter`,
`activitesEnCours`, les styles `.activites-…`, le symbole `sym-activites`, la ligne `activites` de `RUBRIQUES`,
l'entrée du menu et la carte de l'accueil. Dans `rendu.mjs` (commun), trois ajouts locaux : la copie de
`activites/` vers `site/activites/` avec l'empreinte `Dsite.vActivites`, l'appel de `pagesActivites`, et
l'entrée `activites` de `RUBRIQUES_PARTAGE`. Dans `construire.py` (commun), une branche de la vérification des
liens des Nouveautés reconnaît les ancres `activites`, `activites/<groupe>` et `activites/<id>`.

**Nom.** « Activités », identifiant `activites`. L'auteur avait demandé d'autres idées (proposées :
Explorations, Planches, Expériences) et n'a pas tranché ; la rubrique a été publiée sous « Activités », qu'il
disait bien aimer. Un changement de nom toucherait l'identifiant, donc les adresses, le dossier et les préfixes.

**Adresses.** `#activites` (toutes les activités), `#activites/<groupe>` (les activités d'un groupe),
`#activites/<id>` (une activité). Un identifiant de groupe ne doit pas être celui d'une activité.

**Navigation (demandes successives de l'auteur, 11 nov.).** En haut de page, des onglets en forme
d'intercalaires de classeur tournés vers le haut, dans l'ordre du catalogue : « Toutes », puis un intercalaire
par *groupe* d'activités (aujourd'hui « Explorations », qui réunit les deux explorables de visualisation ; le
nombre d'activités est affiché) et un intercalaire par activité *sans groupe* (« Atelier de construction »),
qui s'ouvre directement. Les activités d'un groupe ne sont pas des onglets.
La page du groupe (`#activites/explorations`) les présente en cartes, avec deux filtres à puces, par niveau et
par domaine, dans l'esprit de la banque d'exercices (demande de l'auteur, les explorations devant devenir
nombreuses) : état dans `pageActivites.filtre`, clic géré par un écouteur délégué qui appelle
`rafraichirRubrique`, seules les valeurs présentes sont proposées. Une activité ouverte dans un groupe porte une
barre `.activites-sous` : retour à la liste, activité précédente, activité suivante (le sous-menu qui citait
toutes les activités ne tenait plus au-delà de quelques-unes). Une activité sans groupe n'a rien de cela. Versions écartées par l'auteur : un intercalaire
par activité, puis un découpage par domaine mathématique (« Analyse », « Géométrie »), qui créait un sous-menu à
une seule entrée pour l'atelier. Les intercalaires sont en olive, couleur de la rubrique, sauf « Toutes », en gris. Le domaine mathématique ne
colore plus les intercalaires mais, à la demande de l'auteur, les entrées du sous-menu et les cartes des
explorations (champ `domaine` : analyse en vert, géométrie en violet, algèbre en orange, nombres et probabilités
en bleu, comme les familles de l'édifice) ; une activité sans domaine reste en olive. Sur
téléphone, la rangée d'intercalaires défile horizontalement dans son cadre ; la page ne déborde pas.

**Repères.** Couleur de la rubrique : `--c-ord` (olive), la seule couleur de thème qu'aucune rubrique
n'employait. Symbole : une courbe dans un cadre, un point que l'on déplace, un curseur (trois nuances obtenues
par opacité, classes `.activites-sy1` à `3`). Menu : après Annales. Accueil : cinquième carte de « Les
rubriques ». D'abord seule sur une deuxième ligne, ce que l'auteur a refusé : à partir de 1040 px de large, les
cinq cartes tiennent sur une ligne (`repeat(5, 1fr)`, cartes resserrées : titre 19 px, nombre 21 px, texte
14,5 px), et le texte de la carte Annales a été raccourci à sa demande (plus de liste des banques de concours).
En dessous de 1040 px, la grille d'origine s'applique (3 + 2 sur tablette, une colonne sur téléphone). L'encadré « Par curiosité » de « Par où commencer ? » (domaine À propos)
n'a pas été modifié : la proposition d'y mettre un lien vers les activités attend la réponse de l'auteur. La
barre de rubriques des pages de lecture (`lecture.mjs`, domaine À propos) ne cite pas encore « Activités ».

**Catalogue : `rubriques/activites.yaml`.** `intro` ; `groupes` (`id`, `titre`, `intro`) ; `activites` (`id`,
`titre`, `onglet`, `niveau` (texte affiché), `niveaux` (identifiants, pour le filtre), `resume`, `texte`,
`cours`, `noeuds`, `groupe` ou rien, `domaine`) ; `niveaux` et `domaines` (`id`, `titre`) : listes des filtres.
`construire.py` vérifie les `noeuds` comme pour toute rubrique ; `rendu.mjs` compose `intro`, `resume` et
`texte`. Les identifiants de `cours` et de `groupe` ne sont vérifiés par personne : les relire à la main.

**Une activité = un module.** `activites/<id>.js` exporte `css` (styles, précédés des styles communs), `html`
(texte et cadres des figures) et `monter()`, qui lance les figures et rend la fonction qui les arrête. Rien de
cela n'est dans `gabarit.html` : `activitesMonter` importe le module (`import('./activites/<id>.js?v=…')`)
quand un cadre `.activites-act[data-act]` apparaît dans `#rubrique` (un MutationObserver propre à la rubrique
le surveille, pour ne pas toucher `afficherRubrique`, qui est commun), pose une balise `<style>`, insère le
HTML, appelle `monter()`. Quand le cadre disparaît (autre activité, autre rubrique, retour à l'édifice), les
styles sont retirés et les figures arrêtées. La page d'accueil ne s'alourdit donc que du code de la rubrique
(environ 10 Ko) ; les trois modules pèsent 26 à 43 Ko.

**`activites/commun.js`.** Les styles communs (`css`), tous préfixés par `.activites-act`, et `bac()`. Les
figures lisent leurs couleurs dans des variables de `:root` (`--sheet`, `--ink`, `--sec`, `--tan`, `--mark`,
`--free`, `--semi`, `--ok`, `--hl`…) : elles sont branchées là sur celles du site, si bien que le clair et le
sombre suivent le bouton du site. Code couleur : orange = ce qui varie ou échoue (sécante, terme hors de la
bande, point libre ; #ad5900 en clair pour le contraste, `--c-alg` en sombre) ; vert `--c-ana` = ce qui est
acquis (tangente, bande, propriété vérifiée) ; bleu `--c-nb` = les mesures ; violet `--c-geo` = point lié à une
ligne. Le rouge reste réservé : le seul rouge est le filet de l'encadré de la définition de la limite.
`bac()` rend des doublures de `window`, `MutationObserver` et `ResizeObserver` qui retiennent chaque
abonnement, et `demonter()` qui les annule tous. Raison : les prototypes s'abonnent à la fenêtre sans jamais se
désabonner, ce qui est sans conséquence dans une page autonome mais pas dans un site à une seule page
(l'atelier interceptait Ctrl+Z partout après sa première ouverture). Le module déclare ces trois noms en tête
de `monter()` ; le code des figures les emploie sans le savoir.

**Collisions de noms.** Les prototypes emploient des classes courtes (`.chip`, `.fig`, `.enonce`, `.verdict`,
`.tool`…) dont certaines existent dans le site : tout style d'activité est préfixé par `.activites-act`, et
`.activites-act .enonce` annule le style d'énoncé du site. Les identifiants (`#tab`, `#verdict`, `#b-next`…)
sont communs à plusieurs activités : une seule activité est montée à la fois.

### 118. Les trois premières activités, venues de prototypes de l'auteur (11 nov. 2026)

L'auteur a fourni trois pages autonomes : deux « explorables » (la dérivée en Première, la limite d'une suite
en Terminale) et un atelier de géométrie dynamique à dix défis. Consigne : reprendre la charte, la navigation
et la structure du site, garder tel quel le code JavaScript des figures et, pour l'atelier, le moteur de
vérification entre `//<engine>` et `//</engine>`.

**Ce qui a été gardé.** Le code de chaque prototype est recopié dans `monter()` entre deux repères (« début du
code du prototype », « fin »), sans réécriture ni remise en forme. Le HTML est repris section par section, avec
les mêmes identifiants. Ont disparu : les polices Google, la marge rouge de cahier, le grand titre, les notes
« prototype » et « site de recherche ».

**Ce qui a changé dans le code, avec l'accord de l'auteur.**
1. *Vouvoiement.* Le site vouvoie ; les prototypes tutoyaient, y compris dans des messages écrits dans le code
   (consignes et indices des défis de l'atelier, à l'intérieur du moteur ; verdicts ; aides des outils). Ces
   chaînes ont été passées au « vous », sans toucher à la logique.
2. *Limite d'une suite : comparaisons exactes.* Deux erreurs de même nature, trouvées en vérifiant.
   (a) Quand la limite proposée est fausse et que ε = |ℓ − L|, `rankFor` répondait « aucun rang » sans
   regarder : or pour (3n − 2)/(n + 1), ℓ = 2,5 et ε = 0,5 (valeur par défaut), tous les termes sont dans
   ]2 ; 3[ dès n = 5 ; le verdict « dès que ε ≤ 0,50… » était faux lui aussi (désormais « ε < »).
   (b) Le test « u_n dans la bande » calculait `Math.abs(u(n) - l) < e` en flottants : pour 2 + (−1)ⁿ/n, ℓ = 2,
   ε = 0,01, la machine trouve 2 + 1/100 − 2 < 0,01 et la page affichait N = 100 au lieu de 101 (de même 20 au
   lieu de 21 pour ε = 0,05, dans le tableau affiché à l'ouverture). Correction : ℓ et ε étant des décimaux à
   trois chiffres au plus, chaque suite porte une fonction `ins(n, l, e)` qui compare en millièmes entiers
   (exact pour les trois suites rationnelles ou géométrique et pour 2 + (−1)ⁿ ; la suite en sin n, dont aucun
   terme ne peut tomber sur un bord puisque sin n est transcendant, reste comparée en flottants), et un champ
   `side` (signe constant de u_n − L) qui tranche le cas ε = |ℓ − L|. `inBand` sert au calcul du rang, à la
   couleur des points et au jeu. Contrôle : 4 392 triplets (suite, ℓ, ε) comparés à l'arithmétique exacte de
   Python (`fractions`), zéro écart.

3. *Atelier : outil « Intersection »* (demande de l'auteur : avec l'outil Point, un seul des deux objets
   survolés était surligné, et l'on ne savait pas si le point serait bien l'intersection). Ajouts dans
   l'interface seulement, le moteur entre `//<engine>` et `//</engine>` restant identique au prototype hors
   chaînes de texte (contrôlé par comparaison) : `snapInter` (croisement à portée du pointeur), `addInter`,
   une branche de `click`, l'état `snap`. L'outil s'emploie de deux façons : cliquer sur un croisement crée ce
   point ; cliquer sur une ligne puis sur une autre crée tous leurs points communs (les deux pour deux cercles),
   ce qui convient au doigt, où il n'y a pas de survol. Avec les outils Point et Intersection, le survol d'un
   croisement surligne désormais les deux lignes et entoure en vert le point qui sera créé ; pour Point,
   l'aperçu emploie les mêmes seuils que `makePoint`, donc il montre exactement ce que le clic fera. Vérifié :
   triangle équilatéral construit avec l'outil et reconnu, à la souris (1280 px) et sur 360 px.

**Vérifications faites.** Construction sans erreur ; Playwright en clair et en sombre, à 1280 et à 360 px :
aucun débordement horizontal, aucune erreur de script (la seule erreur de console est la requête vers Google
Fonts, sans réseau dans l'environnement de travail). Atelier : un triangle équilatéral construit par deux
cercles est reconnu, le même placé à vue est refusé et le contre-exemple est rejoué. Après avoir quitté une
activité, plus aucun style ni abonnement ne reste.

**Points à connaître, non traités.**
- Les formules des activités sont en HTML simple (italiques, indices), pas en KaTeX : elles sont mêlées aux
  nombres que l'on fait glisser. Les textes des pages de lecture, eux, sont en LaTeX.
- « Vérifier » de l'atelier est un test sur quarante déplacements aléatoires, pas une démonstration ; le texte
  ajouté sous l'atelier le dit.
- Dérivée : le verdict « dérivable ou non » compare deux taux d'accroissement pour h = ±10⁻⁶ ; c'est exact pour
  les quatre fonctions proposées, ce ne serait pas une méthode générale.
- Les nombres surlignés se règlent au clavier (flèches) ; les points des figures (canvas) et la planche de
  l'atelier ne se manipulent qu'à la souris ou au doigt.
- L'atelier garde la liste des défis réussis dans `localStorage` (`atelier-construction-done`).
- Sous chaque activité, trois blocs rédigés ont été ajoutés : « Le piège le plus courant », « Où lire la
  démonstration » (chapitre de cours, fiches de l'édifice), « Ce que la page calcule ».

**Ajouter une activité.** Écrire `activites/<id>.js` sur le modèle des trois autres (importer `bac` et `css`
de `commun.js`) ; ajouter l'entrée dans `rubriques/activites.yaml` (avec `groupe: explorations` pour une
exploration, ou sans groupe pour un intercalaire à elle) ; construire ; regarder ;
entrée dans `rubriques/nouveautes.yaml`. Une première liste de dix idées (toile d'araignée des suites
récurrentes, sommes de Riemann, accroissements finis, polynômes de Taylor, méthode d'Euler, de Moivre-Laplace,
racines n-ièmes, argument diagonal, polynômes de Bernstein, phénomène de Gibbs) a été proposée à l'auteur, qui
décidera plus tard.

### 119. Pages de lecture et partage (11 nov. 2026)

`lecture-activites.mjs` (`pagesActivites(ctxLecture)`, appelé par `rendu.mjs` après les cours) écrit
`/activites/` (les activités par groupe, puis les autres) et `/activites/<id>/` : niveau, résumé, « Ce que l'on y fait » (champ
`texte` du catalogue : ce qu'on manipule, ce que cela signifie, le piège, avec des valeurs vérifiées), liens
vers `/cours/<id>/` et `/edifice/<nœud>/`, bouton « Ouvrir dans l'atlas ». Ces adresses entrent d'elles-mêmes
dans le plan du site (4 adresses). Le bouton « Partager » donne `/activites/<id>/` pour une activité et
`/activites/` sinon (ligne `activites` de `adressePartage`). « Signaler une erreur » : `aProposSignalBouton`
au pied de chaque activité.

### 120. Explorations écrites pour le site ; liste d'attente (11 nov. 2026)

**`activites/figures.js`.** Outils communs aux explorations qui ne viennent pas d'un prototype : `scene(racine,
rendre)` (couleurs du thème, rendu différé, suivi du thème et de la taille, `arreter()`), `toile`, `vue`,
`vueEgale`, `grille`, `courbe` (avec coupures aux discontinuités), `droite`, `etiquette`, `poignee`, `pastille`,
`glisser` (souris et doigt), nombres à la française (`fr`, `frc`), `fraction` exacte, styles `cssFigures`
(réglages par curseurs étiquetés, lectures) et `suite()` (piège, démonstration, ce que la page calcule). Les
fonctions de tracé reprennent celles des prototypes de l'auteur, pour un aspect identique. Règle suivie : tout
paramètre se règle par un curseur natif (donc au clavier), le glissement sur la figure venant en plus.

**Trois explorations publiées le 11 nov.**, une par couleur.
- `cercle-trigo` (Première, géométrie) : point sur le cercle, cos et sin lus comme coordonnées, courbes
  déroulées, angles associés avec la symétrie correspondante. Angle en douzièmes de π ; valeurs exactes tirées
  d'une table pour les multiples de π/6 et π/4, décimales à 10⁻⁴ sinon.
- `second-degre` (Première, algèbre) : coefficients par demi-unités, stockés en entiers doublés (A, B, K) ;
  Δ = (B² − 4AK)/4, α = −B/(2A), β = −(B² − 4AK)/(8A) calculés en entiers et écrits en fractions ; racines
  exactes si B² − 4AK est un carré parfait. Le curseur de *a* saute par-dessus 0. Lieu du sommet quand *b*
  varie : y = −ax² + c. Contrôles faits à la main sur quatre trinômes, dont −1,5x² + 2,5x + 2 (Δ = 18,25,
  S(5/6 ; 73/24)).
- `aire-primitive` (Terminale, analyse) : F(x) = G(x) − G(a) avec une primitive G exacte par fonction (dérivée
  de G comparée à f numériquement, écart < 10⁻⁹) ; rectangle de même aire que la tranche [x ; x + h] ; fonction
  en escalier pour montrer la nécessité de la continuité (taux 2,5 à droite, 1 à gauche en x = 1).

**Liste validée par l'auteur (« les vingt idées »), restant à écrire**, dans l'ordre proposé : toile d'araignée
des suites récurrentes ; suites arithmétiques et géométriques ; le nombre e ; l'intégrale par rectangles ;
valeurs intermédiaires et dichotomie ; méthode d'Euler ; accroissements finis ; développements limités ;
convexité ; produit scalaire ; multiplication complexe et racines n-ièmes ; droites et plans de l'espace ;
matrice 2×2 et déterminant ; racines et coefficients d'un polynôme ; algorithme d'Euclide en rectangles ;
binomiale et courbe en cloche ; loi des grands nombres. Demandes en attente du même message : des défis plus
difficiles dans l'atelier (figure codée à reproduire), des explorations de dénombrement et des casse-têtes.

### 121. Groupe « Casse-têtes » : taquin et tours de Hanoï (11 nov. 2026)

**Demande de l'auteur.** Une troisième sous-rubrique, à côté d'Explorations et de l'Atelier, pour les vrais
casse-têtes : on y joue d'abord, sur la page, avec des dimensions réglables dans la limite du jouable. N'y
entrent que des jeux ; les visualisations de dénombrement (chemins sur une grille, anniversaires, tiroirs…)
vont dans Explorations. Teinte propre au groupe : bleu pétrole `--activites-jeu` (#0e7490 en clair, #5cc8dc en
sombre), posée par `couleur: jeu` sur le groupe (attribut `data-teinte`), distincte du bleu de l'édifice et du
vert de l'analyse ; contraste 5,4:1 sur blanc.

**`activites/jeux.js`.** Styles communs (`.jeu`, plateau, ligne d'état, message). Les jeux sont faits de
boutons de la page et non de dessins : toute pièce se joue à la souris, au doigt et au clavier, et porte un
libellé pour les lecteurs d'écran.

**`taquin`.** Plateau de 2 à 5 lignes et colonnes. Mélange par une marche aléatoire de coups permis (donc
toujours soluble) ; bouton d'échange des pièces 1 et 2 pour produire une position insoluble. Invariant affiché :
signature de la permutation des cases (vide compris, par les cycles) × (−1)^d, d distance du vide au coin.
Jusqu'à 9 cases, parcours en largeur depuis la position rangée (Map code → distance), d'où le minimum restant
et le bouton « Un coup » ; au-delà, minorant par la somme des distances de Manhattan. Contrôle (Node) : pour
2×2, 2×3, 3×2, 2×4, 4×2 et 3×3, le nombre de positions accessibles vaut N!/2 (12, 360, 360, 20 160, 20 160,
181 440), toutes d'invariant +1, et le diamètre du 3×3 est 31, valeur connue. La réciproque générale (toute
position d'invariant +1 est soluble dès 2 lignes et 2 colonnes) est marquée « admis ici ». Source vérifiée :
W. W. Johnson et W. E. Story, « Notes on the “15” Puzzle », American Journal of Mathematics 2 (1879), 397-404.

**`hanoi`.** 3, 4 ou 5 tours, 1 à 8 disques. Parcours en largeur des p^n positions depuis la position finale
(au plus 390 625, environ un quart de seconde pour tous les réglages réunis) : minimum exact depuis le départ et
depuis la position courante, « Un coup », « Montrer une solution » (animation lancée par l'utilisateur,
arrêtable). Contrôle (Node) : 3 tours 1, 3, 7, …, 255 ; 4 tours 1, 3, 5, 9, 13, 17, 25, 33 ; 5 tours 1, 3, 5,
7, 11, 15, 19, 23. Le texte démontre T(n) = 2T(n−1) + 1 (stratégie, puis premier et dernier déplacement du
grand disque). Sources vérifiées : jeu d'Édouard Lucas (1883) ; Thierry Bousch, « La quatrième tour de
Hanoï », Bull. Belg. Math. Soc. Simon Stevin 21(5) (2014), 895-912 ; cinq tours et plus : question ouverte,
ce que le texte dit, les nombres affichés venant du parcours exhaustif et non de la conjecture.

**Casse-têtes envisagés ensuite** : jeu des inversions (« Lights Out », système linéaire sur le corps à deux
éléments, taille réglable), solitaire à pions (invariant de coloriage), grenouilles sauteuses, problème des
huit dames (taille réglable), pavage par dominos de l'échiquier écorné.

### 122. Atelier de construction : neuf défis de plus, dont cinq figures codées (11 nov. 2026)

Demande de l'auteur, avec son accord pour étendre le moteur (entre `//<engine>` et `//</engine>`) : des défis
plus difficiles, et des figures montrées avec leurs codages, à reproduire. Les ajouts sont insérés par
`CH.splice` juste avant la liste d'ordre, sans modifier le code existant du moteur ; l'atelier compte
dix-neuf défis et l'atelier libre.

**Constructions classiques** (même forme que les défis d'origine : `cands` tolérant, `strict` à 10⁻⁶) : centre
de gravité, symétrique d'un point par rapport à une droite (il n'y a pas d'outil symétrie), orthocentre, partage
d'or d'un segment (les deux points de partage sont acceptés ; l'indice donne la construction par le triangle
rectangle de côtés AB et AB/2, pour laquelle AD = AC − CB = (√5 − 1)/2 · AB).

**Figures codées** (`modele(id, titre, texte, indice, modèle, contraintes)`). Le modèle (points, segments,
pointillés, traits d'égalité, angles droits) est dessiné en SVG dans la fiche du défi par `modelSvg`, côté
interface. Les contraintes portent sur les rôles 0, 1, 2… du modèle : `eq` (longueurs égales), `perp`, `par`,
`mid` (milieu), chacune avec une tolérance relative à ses propres longueurs (`ctrOne`). `modCands` cherche par
retour arrière les points de l'élève qui peuvent tenir les rôles (contrainte testée dès que ses rôles sont tous
attribués ; au plus 24 candidats), `modStrict` exige toutes les contraintes à 10⁻⁶ et des points distincts.
Cinq figures : deux triangles équilatéraux accolés, triangle rectangle et milieu de l'hypoténuse, médiane
prolongée (parallélogramme), rectangle deux fois plus long que large, carré surmonté d'un triangle équilatéral.

**Contrôle** (`node`, moteur extrait du module) : pour chacun des neuf défis, une construction correcte est
reconnue (« ok ») et la même figure posée à vue, tous points libres, est refusée (« fragile »). Vérifié aussi
dans le navigateur sur une figure codée.

### 123. Retouches demandées et deux explorations de plus (11 nov. 2026, après-midi)

**Retouches demandées par l'auteur.**
- *Largeur du texte.* Le texte des activités était limité à 46rem (longueur de ligne de lecture) alors que les
  figures occupaient toute la page : l'auteur y a vu un défaut. `.activites-act .col` n'a plus de largeur
  maximale ; le texte remplit la page (1180 px au plus).
- *Curseurs plus fins.* Second degré : pas de 0,05 au lieu de 0,5 ; les coefficients sont stockés en vingtièmes
  entiers (A, B, K), Δ = (B² − 4AK)/400, α = −B/(2A), β = −(B² − 4AK)/(80A), toujours calculés en entiers.
  Affichage : fraction si le dénominateur réduit ne dépasse pas 20, sinon valeur approchée à 10⁻³ précédée de
  « ≈ » (fonction `rat`). Cercle trigonométrique : l'angle avance par degrés entiers (π/180) au lieu de π/12,
  et s'accroche au multiple de π/12 le plus proche, à deux degrés près, quand on relâche le point ; les valeurs
  exactes restent celles des multiples de π/6 et π/4.
- *Taquin.* La case vide est hachurée, bordée de tirets.
- *Hanoï.* Le socle de la tour de départ est orange avec la mention « départ » ; la tour d'arrivée est teintée
  en vert avec la mention « arrivée », et le message rappelle le but.
- *Atelier.* Son intercalaire prend la couleur de la géométrie (`couleur: geo`, violet `--c-geo`). L'auteur a
  écrit « l'orange de la géométrie » : dans le site, la géométrie est violette et l'orange est l'algèbre ; le
  violet a été retenu pour le sens, à confirmer.

**Deux explorations.**
- `toile-suite` (Terminale, Maths Sup ; analyse) : construction en toile d'araignée de u(n+1) = f(u(n)) pour
  a(x − 0,5) + 0,5, cos x et rx(1 − x). Points fixes par formule (0,5 ; 0 et 1 − 1/r) ou, pour le cosinus, par
  dichotomie (0,7391). Les verdicts n'affirment que ce qui est démontré : formule explicite pour l'affine,
  convergence globale pour le cosinus, critère local |f′(ℓ)| < 1 pour le reste.
- `binomiale` (Terminale, Maths Sup ; probabilités, première activité en bleu) : loi exacte calculée par les
  logarithmes, diagramme centré réduit (aires conservées), densité normale, tableau des probabilités à 1, 2, 3
  écarts-types. Valeurs contrôlées avec Python : n = 100, p = 0,5 → 0,7287 ; 0,9648 ; 0,9982 ; n = 30,
  p = 0,05 → 0,5975 ; 0,9392 ; 0,9967 ; n = 50, p = 0,3 → 0,7204 ; 0,9567 ; 0,9969. Le piège retenu est la
  correction de continuité (0,7287 contre 0,6827).

Restent quinze idées de la liste des vingt, les visualisations de dénombrement et d'autres casse-têtes.

