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
- *Atelier, fiche de gauche.* Sur ordinateur (au-delà de 900 px), la fiche a exactement la hauteur de la planche
  (`height: 0; min-height: 100%` dans une grille étirée) : la liste des défis prend toute la place restante,
  ses lignes sont resserrées et la planche monte jusqu'à 76 % de la hauteur de la fenêtre (820 px au plus). Sur
  un écran de 1080 px, presque toute la liste est visible sans défiler. Sur téléphone, rien ne change.
- *Taquin au clavier.* Les flèches n'agissaient que si une pièce avait le focus, et le perdaient dès qu'une pièce
  devenait la case vide (bouton désactivé) : l'auteur a constaté qu'elles ne poussaient rien. Elles sont
  maintenant écoutées sur la fenêtre (doublure de `bac()`, donc retirées en quittant l'activité), seulement quand
  le plateau est à l'écran et hors des champs, listes et curseurs ; la case vide n'est plus un bouton désactivé.
- *Vignettes.* Chaque carte d'activité porte un petit dessin au trait (champ `vignette` du catalogue : intérieur
  d'un SVG de 120 × 72, classes `a` trait coloré, `f` aplat, `p` point, `t` tirets, `e` trait fort), à la couleur
  de la carte. Toute nouvelle activité doit avoir la sienne.
- *Atelier, titres des groupes de défis.* En violet (`--c-geo`), gras, soulignés d'un filet, à la demande de
  l'auteur, pour se repérer dans la liste.

### 124. Produit scalaire, chemins sur une grille, « Tout éteindre » ; hauteur des figures (11 nov. 2026)

**Décisions de l'auteur.** L'intercalaire de l'atelier reste violet (confirmé). Les activités continuent dans
l'ordre proposé. L'entrée des Nouveautés porte désormais la rubrique `activites`, acceptée par `construire.py`
depuis un commit de la conversation À propos ; les ajouts du jour sont dans une seconde entrée.

**Hauteur des figures.** L'auteur a signalé que, dans « La pente en un point », les figures superposées
(courbe et trace de la dérivée, courbe mystère et zone de dessin) dépassaient la hauteur de l'écran. Règle
désormais commune (`commun.js`) : une figure seule est limitée à 70 % de la hauteur de la fenêtre, et deux
figures qui se lisent ensemble (classe `paire`, ou les toiles `cv3t`, `cv3b`, `cv4t`, `cv4b` du prototype) ont
chacune 31 % de cette hauteur (entre 150 et 330 px), si bien que la paire tient dans la fenêtre. Aucun code de
figure n'a changé : chaque figure lit la taille réelle de sa toile.

**`produit-scalaire`** (Première, géométrie). Deux vecteurs d'origine O, extrémités déplaçables ou réglées par
quatre curseurs (demi-unités), projeté H de B sur (OA). Trois calculs affichés : coordonnées (exact),
longueurs et angle, OA × OH signé. Contrôlé : (4 ; 1)·(1,5 ; 3) = 9 ; (3 ; 2)·(−2 ; 3) = 0 ; (4 ; 0)·(−2,5 ; 2)
= −10.

**`chemins-grille`** (Terminale, Maths Sup ; nouveau domaine « Dénombrement », en bleu). Grille de n sur p pas
(1 à 8), chemin tracé par boutons, mot du chemin, nombre de chemins en chaque nœud par additions (entiers
exacts, au plus 12 870), relation de Pascal lue sur le nœud choisi. « Au hasard » tire un chemin uniformément.

**`inversions`**, titre « Tout éteindre » (casse-tête ; Maths Sup). Plateau de 2 à 7 lignes et colonnes. La
matrice A (N × N sur F2) est réduite une fois par taille par le pivot de Gauss appliqué à [A | I] ; on en tire
le rang, une base du noyau, puis pour chaque position une solution particulière et la plus courte des 2^k
solutions (k ≤ 4 ici). Contrôles (Node) : dimensions du noyau pour toutes les tailles (3×3 : 0 ; 4×4 : 4 ;
5×5 : 2, rang 23 ; 7×7 : 0…), « tout allumé » soluble pour toutes ; sur 1 440 positions aléatoires, la solution
rendue éteint toujours la position et, pour les plateaux de 12 cases au plus, sa longueur est le minimum trouvé
par recherche exhaustive ; 5×5 tout allumé : 15 appuis.

Explorations : neuf. Casse-têtes : trois. Restent de la liste des vingt : suites arithmétiques et géométriques,
nombre e, intégrale par rectangles, dichotomie, méthode d'Euler, accroissements finis, développements limités,
convexité, multiplication complexe, droites et plans de l'espace, matrice 2×2, racines et coefficients, Euclide
en rectangles, loi des grands nombres ; puis anagrammes, anniversaires, tiroirs, dérangements, Catalan.

### 125. Règle des curseurs fluides ; Euler, nombres complexes, problème des dames (11 nov. 2026)

**RÈGLE DE L'AUTEUR POUR TOUTE VISUALISATION, PRÉSENTE OU FUTURE.** Un curseur ou un point déplaçable ne doit pas
avancer par sauts visibles : le pas est petit (0,05 ou 0,01 pour une grandeur réelle, un degré pour un angle),
de sorte que la figure bouge de façon continue. Pour retrouver facilement les valeurs rondes, un point que l'on
déplace sur la figure s'aimante légèrement sur les nœuds du quadrillage (ou sur les valeurs remarquables), sans
que le curseur lui-même soit grossier. Seules les grandeurs entières par nature (nombre de pas, n d'une loi
binomiale, taille d'un plateau) avancent par unités. L'exactitude reste due : on stocke les valeurs en entiers
(vingtièmes, centièmes, degrés) et l'on calcule sur ces entiers. Appliqué le 11 nov. au second degré (0,05), au
cercle trigonométrique (degré), au produit scalaire (0,05, aimant à 0,13 des entiers, produit calculé en
vingtièmes), à la borne a de l'aire (0,05), à p de la binomiale (0,01), à k d'Euler (0,05).

**Figures basses.** Les figures superposées, limitées en hauteur au §124, étaient étirées sur toute la largeur
de la page, donc aplaties : l'auteur ne lisait plus les variations. Leur cadre est maintenant rétréci à 2,1
fois la hauteur d'une figure et centré (`.fig:has(canvas.paire, #cv3t, #cv4t)`).

**`euler`** (Terminale, Maths Sup ; analyse). y′ = ky, y(0) = 1 sur [0 ; 2], N pas : valeurs (1 + kh)^n et
solution e^{kx}, toutes deux en forme close. Tableau des écarts pour N = 10 à 160 et leurs rapports (1,81 ;
1,90 ; 1,94 ; 1,97 pour k = 1). Verdict selon le facteur 1 + kh (instabilité si h > 2/|k|). Contrôlé : k = 1 →
6,1917 ; 6,7275 ; 7,0400 pour N = 10, 20, 40 ; e² ≈ 7,3891.

**`complexes`** (Maths expertes, Maths Sup ; géométrie). z et w par module (pas de 0,05) et argument (degré) ;
zw calculé par la formule algébrique, puis module et argument lus sur le résultat, pour constater la règle.
Triangles semblables (0, 1, z) et (0, w, zw) ; puissances de z ; boutons des racines n-ièmes de l'unité.

**`dames`** (casse-tête ; n de 4 à 10). Toutes les solutions par retour arrière, familles sous les huit
symétries du carré. Contrôlé (Node) contre les valeurs connues : 2, 10, 4, 40, 92, 352, 724 solutions et
1, 2, 1, 6, 12, 46, 92 familles. Le piège cité est vérifié : sur 8 × 8, les dames en (1, 1) et (2, 3) ne se
menacent pas et n'appartiennent ensemble à aucune solution.

Explorations : onze. Casse-têtes : quatre.

**Clavier (règle).** Quand un texte annonce des touches fléchées, elles doivent agir sans clic préalable : on les
écoute sur la fenêtre par la doublure de `bac()` (retirée en quittant l'activité), seulement quand la figure est
à l'écran et hors des champs, listes et curseurs. Fait pour le taquin et, à la demande de l'auteur qui s'y
attendait, pour les chemins sur une grille (→, ↑, et ← pour retirer un pas).

**Atelier : liaisons visibles (demande de l'auteur).** Avec un outil de tracé, le point survolé (celui par
lequel le cercle ou la ligne va passer) et le premier point déjà choisi portent un anneau vert ; l'aperçu en
pointillés s'accroche à ce point et passe au vert ; une ligne survolée, à laquelle un point va s'attacher, est
doublée d'un trait vert. La ligne d'aide annonce la liaison (« Le cercle passera par le point B : cliquez pour
le relier », point accroché à une ligne, point d'intersection). Ajouts dans l'interface seulement.

**Descriptions de la rubrique (demande de l'auteur).** Elles dataient de l'ouverture, quand il n'y avait que des
explorations. Menu : « Explorations interactives, casse-têtes à résoudre et atelier de géométrie. » Carte de
l'accueil et introduction de la page (titre « Explorer, jouer, construire ») : les trois familles sont nommées.

### 126. Dichotomie, matrice, Euclide ; retouches des casse-têtes (11 nov. 2026)

**`dichotomie`** (Terminale, Maths Sup ; analyse). Quatre équations : x³ − 2x − 5 = 0 sur [2 ; 3], cos x = x sur
[0 ; 1], x² = 2 sur [1 ; 2], et le piège 1/(x − 1,3) sur [1 ; 2], qui change de signe sans s'annuler. Jusqu'à
trente étapes ; les bornes sont des dyadiques exacts en machine. Option « cadrer sur l'intervalle courant ».
Contrôlé : 2,0945515 ; 0,7390851 ; 1,4142136.

**`matrice`** (Maths expertes, Maths Sup ; algèbre). Coefficients de −2,5 à 2,5 par pas de 0,05, traités en
vingtièmes entiers : déterminant et discriminant (a − d)² + 4bc exacts, d'où les cas « déterminant nul » et
« valeur propre double » sans arrondi. Extrémités des colonnes déplaçables, aimantées aux demi-entiers. Carré
unité et lettre F (pour voir le retournement), directions propres sur demande. Contrôlé : (1,5 ; 0,5 ; 0,5 ; 1)
→ dét 1,25, valeurs propres 0,691 et 1,809.

**`euclide`** (Maths expertes, Maths Sup ; algèbre). a, b entiers de 1 à 120 ; carrés d'une couleur par étape,
divisions successives, PGCD, nombre de carrés, fraction continue. Contrôlé : 45 et 12 → quotients 3, 1, 3,
PGCD 3 ; 89 et 55 → neuf divisions (huit quotients 1 puis 2) ; 120 et 7 → 17, 7.

**Dames (demande de l'auteur).** Les cases menacées sont teintées en bleu (couleur du jeu) et non plus en orange.
La page ne dit plus qu'une position sans menace ne peut plus être complétée : elle laisse chercher, et n'annonce
l'impasse que lorsque toutes les cases sont occupées ou menacées. Le bouton « Une dame de plus » le dit s'il
est sollicité sans issue.

**Tout éteindre (demande de l'auteur).** Bouton « Revenir au départ » : rétablit la position d'avant le premier
appui et remet le compteur à zéro. Le minimum d'appuis depuis la position de départ est calculé à sa création et
rappelé en fin de partie (« en 34 appuis ; le minimum était de 5 »), pour que le joueur compare. Règle à suivre pour les prochains casse-têtes : toujours offrir de reprendre
la même position, en plus d'en tirer une nouvelle.

**Atelier : outil « Estomper » (demande de l'auteur).** Quand les traits de construction s'accumulent (cercle
circonscrit : six cercles et trois droites), la figure devient illisible. L'outil, placé avant « Trace », atténue
le trait cliqué (droite, segment ou cercle, donné ou construit) à 16 % d'opacité, et le rétablit au second clic.
Le trait reste un objet à part entière : il retrouve de la présence au survol, on peut y accrocher un point ou
en prendre l'intersection, et la vérification l'ignore (champ `dim` de l'objet, lu seulement par le dessin).
Ajout dans l'interface, hors du moteur. La barre d'outils a été resserrée pour tenir sur une ligne à 1280 px.
`atelier.js` est désormais modifié directement : `/tmp/gen/gen.py` n'est plus la source.

Explorations : quatorze. Casse-têtes : quatre.

### 127. Suites, nombre e, intégrale par les rectangles (11 nov. 2026, soir)

**`suites`** (Première, Terminale ; analyse). u₀ et r (pas de 0,05), v₀, q (pas de 0,01), rang de 2 à 40. Termes
et somme de la suite arithmétique en entiers (centièmes) ; sommes calculées par la formule et recoupées par
addition (un « ? » s'afficherait en cas de désaccord). Rang à partir duquel la géométrique dépasse l'autre pour
toujours : premier rang où vₙ > uₙ et vₙ(q − 1) ≥ r (l'écart ne fait ensuite que croître). Contrôlé : 5 + 3n
contre 0,5 × 1,2ⁿ → rang 29 ; v₂₀ ≈ 19,17 ; v₄₀ ≈ 734,9.

**`nombre-e`** (Première, Terminale ; analyse). Base a de 1,2 à 4,5 (pas de 0,001), tangente en 0 de pente ln a,
droite repère y = x + 1. Puis (1 + 1/n)ⁿ pour n = 10⁰ à 10⁶ et la somme des 1/k! jusqu'à m = 17. Limites
choisies pour que les flottants ne faussent rien : à n = 10⁸, l'arrondi de 1 + 1/n donne un écart de 3,0 × 10⁻⁸
au lieu de 1,36 × 10⁻⁸ ; on s'arrête donc à 10⁶. Contrôlé : 2,5937 ; 2,7048 ; 2,7169 ; m = 9 → 2,7182815.

**`rectangles`** (Terminale, Maths Sup ; analyse). x² sur [0 ; 1], 1/x sur [1 ; 2], sin sur [0 ; π], √x sur
[0 ; 1] ; rectangles à gauche, à droite, au milieu, trapèzes ; n de 1 à 200 ; tableau des erreurs pour n = 10 à
160 et rapports. Contrôlé : x², n = 10 → 0,285 ; 0,385 ; 0,3325 ; 0,335 ; rapports 2 (gauche) et 4 (milieu,
trapèzes) ; √x au milieu → 2,73 à 2,80 ; sin : sommes à gauche et à droite égales.

Explorations : dix-sept. Casse-têtes : quatre. Restent de la liste des vingt : accroissements finis,
développements limités, convexité, droites et plans de l'espace, racines et coefficients d'un polynôme, loi des
grands nombres ; puis anagrammes, anniversaires, tiroirs, dérangements, Catalan ; casse-têtes : solitaire,
grenouilles, dominos sur l'échiquier écorné.

### 128. Polynômes de Taylor, loi des grands nombres, anniversaires (11 nov. 2026, soir)

**`taylor`** (Maths Sup ; analyse). Sept fonctions (sin, cos, exp, ln(1 + x), 1/(1 − x), √(1 + x), et
exp(−1/x²) prolongée par 0), ordre 0 à 15, point x déplaçable. Coefficients en forme close, évaluation par
Horner ; le polynôme est écrit avec des coefficients rationnels retrouvés par fractions continues (5x⁴/128,
x⁷/5040). Bande verte ]−1 ; 1[ pour les trois fonctions de rayon 1. Les verdicts sur la convergence en un point
fixé énoncent des faits connus (rayon de convergence, cas du bord) : ils ne sont pas démontrés dans la page.
Contrôlé : ln(1 + x) en 1,5 → ordre 2 : 0,375 ; ordre 10 : −2,4031 ; exact 0,9163.

**`grands-nombres`** (Terminale, Maths Sup ; probabilités). Épreuves de Bernoulli ajoutées par paquets (aucune
animation), jusqu'à 100 000 ; fréquence sur échelle logarithmique, zone p ± 2σ/√n, six séries précédentes en
gris. Les séries sont des simulations (dit dans la page) ; la zone et les bornes de Bienaymé-Tchebychev sont
calculées. Contrôlé : p = 0,5 → n ≥ 2 000 (δ = 0,05) et n ≥ 50 000 (δ = 0,01) pour 95 %.

**`anniversaires`** (Terminale, Maths Sup ; dénombrement). d = 365, 12 ou 7 ; probabilité exacte par le produit
des 1 − k/d, comparée à 1 − (1 − 1/d)ⁿ (« le même jour que moi ») ; tirage d'un groupe (dates affichées,
coïncidences en orange) ou de 1 000 groupes. Contrôlé : P(22) = 0,4757 ; P(23) = 0,5073 ; P(50) = 0,9704 ;
P(57) = 0,9901 ; 1 − (364/365)²³ = 0,0612 ; seuil de l'autre question : 253 personnes (0,5005 contre 0,4991 pour
252) ; 12 mois → 5 personnes ; 7 jours → 4.

Explorations : vingt. Casse-têtes : quatre. Restent de la liste des vingt : accroissements finis, convexité,
droites et plans de l'espace, racines et coefficients d'un polynôme ; dénombrement : anagrammes, dérangements,
Catalan ; casse-têtes : solitaire, grenouilles, dominos sur l'échiquier écorné.

### 129. Formules en LaTeX ; accroissements finis, convexité, grenouilles (11 nov. 2026, soir)

**Formules composées par KaTeX (demande de l'auteur, qui trouvait la formule de P(n) peu lisible).** Le site
compose de lui-même tout `<span class="kx">…</span>` (en ligne) ou `<span class="kx kxd">…</span>` (hors texte)
inséré dans la page (`composerFormule`, observateur du gabarit) : il suffit donc d'écrire le LaTeX dans le HTML
du module, sans rien ajouter au gabarit. Attention : le HTML est une chaîne JavaScript, chaque barre oblique
inverse doit y être doublée (`\\frac`). RÈGLE désormais : les énoncés encadrés (`.def`) et toute formule à
fraction, somme ou produit sont en LaTeX ; les lettres isolées mêlées aux nombres réglables restent en HTML.
L'encadré est alors un `<div class="def">` (paragraphes et formules hors texte) ; `commun.js` y rétablit la
graisse normale, réduit les formules hors texte sur téléphone (0,7 em) et les laisse défiler si elles débordent.
Les formules longues sont coupées en deux lignes (`aligned`). Converti : anniversaires, suites, Taylor, grands
nombres, rectangles, nombre e, accroissements, convexité, dichotomie, Euclide, matrice. Restent en HTML simple :
les explorations antérieures (§120 à §125) et les prototypes ; à convertir au fil des retouches.
Les lectures (`.lectures`) ne coupent plus un nombre en deux lignes : c'est le libellé qui passe à la ligne.

**`accroissements`** (Maths Sup ; analyse). x³ − 3x, x², sin x, |x| ; A et B déplaçables (pas de 0,05, aimant aux
demi-entiers) ; tous les c de ]a ; b[ tels que f′(c) égale la pente de la corde (changements de signe sur 2 000
points, puis dichotomie). Contrôlé : x³ − 3x sur [−2 ; 2] → pente 1, c = ±1,155 ; x² → milieu ; |x| sur
[−1 ; 2] → aucun.

**`convexite`** (Terminale, Maths Sup ; analyse). exp, x², ln, x³ − 3x, x⁴, sin ; corde [AB] et tangente en T.
Position par rapport à la corde décidée par le signe de f″ (points de changement connus exactement) ; position
par rapport à la tangente contrôlée sur 600 points. Erreur trouvée en vérifiant : le signe initial de f″ pour le
sinus était inversé (la page annonçait « convexe » sur [0,5 ; 2,5]) ; corrigé avant publication.

**`grenouilles`** (casse-tête ; 1 à 6 par couleur). Parcours exhaustif des positions accessibles : impasses,
nombre de solutions, coup conseillé. Démonstration par double comptage : toute solution a nm sauts et n + m pas.
Contrôlé (Node) : 72 positions et 13 impasses pour 3 et 3 ; 476 positions pour 5 et 5, 1 089 pour 6 et 6 ;
exactement deux solutions dès que n ≥ 2 et m ≥ 2 (une par couleur du premier coup) ; avec une seule grenouille
d'un côté, il y en a davantage (3, 5, 8, 13, 21 pour 2 à 6 en face). Comme pour les dames, la page n'annonce
l'impasse que lorsque plus rien ne bouge ; « Annuler un coup » et « Recommencer » sont offerts.

Explorations : vingt-deux. Casse-têtes : cinq. Restent de la liste des vingt : droites et plans de l'espace,
racines et coefficients d'un polynôme ; dénombrement : anagrammes, dérangements, Catalan ; casse-têtes :
solitaire, dominos sur l'échiquier écorné.

### 130. Dominos, chapeaux mélangés, racines et coefficients (11 nov. 2026, soir)

**`dominos`** (casse-tête ; 2 à 8 lignes et colonnes). Plateau entier, privé de deux coins opposés (de même
couleur ; si les dimensions leur donnent des couleurs différentes, on retire un coin voisin), ou de deux cases
tirées au hasard, de couleurs différentes ou non. Pose par deux clics, retrait par un clic. Compteurs des cases
libres claires et foncées (l'invariant). « Est-ce possible ? » : décompte des couleurs, puis couplage parfait
par chemins augmentants ; « Un domino » : une paire du couplage. Nombre de pavages du plateau entier par profils
(contrôlé : 2×3 → 3 ; 3×4 → 11 ; 4×4 → 36 ; 2×8 → 34 ; 6×6 → 6 728 ; 8×8 → 12 988 816 = 3 604²). Théorème de
Gomory « admis ici », avec l'idée du circuit. Sources vérifiées (recherche web) : Kasteleyn, et Temperley et
Fisher, 1961 ; problème attribué à Max Black (1946), popularisé par Martin Gardner. Les deux gris des cases sont
fixes (non pris au thème) pour que « claire » et « foncée » gardent leur sens en mode sombre.

**`derangements`**, titre « Les chapeaux mélangés » (Terminale, Maths Sup ; dénombrement). n de 2 à 12 ; cartes
à échanger, points fixes en orange ; 10 000 mélanges (Fisher-Yates) ; tableau n!, Dₙ, Dₙ/n!. La récurrence
Dₙ = (n − 1)(Dₙ₋₁ + Dₙ₋₂) est démontrée dans la page ; la formule close est annoncée comme s'en déduisant, calcul
non détaillé (dit dans la page). Contrôlé : récurrence et formule close coïncident pour n ≤ 12 ; D₆/6! = 0,3681.

**`racines`** (Première, Maths Sup ; algèbre). Polynôme unitaire de degré 2 ou 3 à racines réelles déplaçables
(vingtièmes entiers, coefficients exacts) ; seconde figure : deux nombres de somme S et de produit P.
Contrôlé : racines −2, 1, 3 → x³ − 2x² − 5x + 6 ; S = 5, P = 6 → 2 et 3 ; S = 2, P = 2 → aucun.

**Écriture des formules dans un module écrit à la main.** Fonctions locales `K(t)` et `KD(t)` qui rendent
`<span class="kx">` et `<span class="kx kxd">` ; dans `${K('…')}`, une commande LaTeX s'écrit avec DEUX barres
obliques inverses (chaîne JavaScript ordinaire), et non quatre.

Explorations : vingt-quatre. Casse-têtes : six. Restent : droites et plans de l'espace ; anagrammes, nombres de
Catalan ; solitaire.

### 131. Nombres de Catalan ; encadrés des activités antérieures en LaTeX (11 nov. 2026, soir)

**`catalan`** (Terminale, Maths Sup ; dénombrement). n de 1 à 8 ; chemin tracé par boutons ou par les flèches
↑ ↓ ← (écoutées sur la fenêtre, règle du §125) ; mot de parenthèses ; galerie de tous les chemins de Dyck
jusqu'à n = 4 ; option « autoriser à passer sous 0 », qui dessine le symétrique par rapport au niveau −1 à
partir du premier contact (principe de réflexion, démontré dans la page) ; récurrence par le premier retour.
Tirage uniforme pas à pas, par le nombre de fins possibles C(r, u) − C(r, u − 1) (contrôlé contre l'énumération
pour r ≤ 12). Contrôlé : 1, 2, 5, 14, 42, 132, 429, 1 430 par la récurrence et par les deux formules.

**Encadrés en LaTeX.** Les énoncés encadrés du second degré, de l'aire sous la courbe, de la toile d'araignée,
de la binomiale, des chemins sur une grille, des complexes, du taquin, de Hanoï, de « Tout éteindre », des dames
et des grenouilles sont maintenant composés par KaTeX (règle du §129) ; formules coupées en deux lignes quand
elles débordaient à 360 px. Restent en HTML simple : le texte courant de ces activités et les trois prototypes
(dérivée, limite d'une suite, atelier).

Explorations : vingt-cinq. Casse-têtes : six. Restent : droites et plans de l'espace ; anagrammes ; solitaire.
