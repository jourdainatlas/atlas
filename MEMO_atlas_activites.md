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
Sur téléphone (≤ 640 px), les intercalaires passent à la ligne et se partagent la largeur, pour être tous visibles
d'emblée : le défilement latéral, que rien ne signalait, cachait des groupes (demande de l'auteur, 12 nov., faite
depuis le domaine À propos – apparence).
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

### 132. Retouches demandées : complexes et cercle trigonométrique (11 nov. 2026, soir)

**Complexes.** (1) Case « afficher w et le produit zw » : décochée, w, zw, leur triangle, leurs curseurs et
leurs lignes du tableau disparaissent, et la fenêtre se resserre (±2,5 au lieu de ±4,2). Les boutons des racines
de l'unité la décochent. (2) Erreur signalée par l'auteur : pour n = 3, on lisait z⁴ et z⁵ sur le triangle. La
page traçait toujours 24 puissances et les étiquetait de z² à z⁶ ; sur un cycle de longueur 3, z⁴ et z⁵
recouvraient z et z². Désormais, si |z| = 1 et si l'argument est un nombre entier de degrés, la période
360/pgcd(360, |arg|) est calculée et le tracé s'arrête au retour en 1, étiqueté « zⁿ = 1 » ; tous les sommets
portent leur nom, placé vers l'extérieur du cercle. Les puissances sont calculées directement
(|z|^k, k·arg réduit modulo 360 en entiers), sans produit itéré.

**Cercle trigonométrique.** L'auteur ne voyait pas la sinusoïde bouger avec le point : les courbes étaient dans
une seconde figure, plus bas, séparée par un paragraphe. Le cercle et les courbes sont maintenant dans la même
figure, côte à côte, à la même échelle verticale (pixels par unité calculés sur le cercle et repris par les
courbes) : un trait pointillé horizontal relie M au point de la sinusoïde. Le curseur et les lectures (en
ligne) sont sous l'ensemble ; la figure fait moins de 500 px de haut sur ordinateur. Sur téléphone, cercle puis
courbes sont empilés dans le même cadre, sans le trait de report. RÈGLE retenue : deux vues d'un même réglage
doivent tenir ensemble à l'écran, dans un seul cadre.

### 133. Solitaire et anagrammes (11 nov. 2026, soir)

**`solitaire`** (casse-tête). Plateau anglais (33 trous) ou français (37), trou de départ au choix. Pion à un
seul saut possible : il saute au clic ; sinon on choisit l'arrivée. Coloriage en trois couleurs selon
(ligne + colonne) mod 3, compteurs par couleur ; arrivées permises du dernier pion calculées avec les deux
coloriages diagonaux. Contrôlé (Node) : anglais, centre vide → 5 arrivées (centre et milieux des bords) ;
français, centre vide → aucune (12, 12, 12) ; français, trou voisin du centre → 4. « Un coup » : recherche en
profondeur avec mémoire des positions sans issue, bornée à 400 000 positions, trois réponses distinctes (coup
trouvé, aucune suite, recherche non aboutie) ; si l'invariant interdit déjà la victoire, elle n'est pas lancée.
Depuis le départ anglais : solution en 31 coups après environ 1 000 positions (une trentaine de millisecondes).
L'atteinte des cinq arrivées est justifiée dans la page (dernier saut fait dans l'autre sens) ; l'existence
d'une solution centrale est constatée par la recherche.

**`anagrammes`** (Terminale, Maths Sup ; dénombrement). Mot saisi (12 lettres au plus, accents retirés),
décompte des lettres, n!/(m₁!…m_k!) en entiers, liste sans doublon (complète jusqu'à 360 mots, sinon les 120
premiers). Seconde figure : pour un mot de 3 ou 4 lettres, les n! rangements numérotés rangés par mot obtenu
(principe des bergers). Contrôlé : MATHS 120 ; ANANAS 60 ; ELEVE 20 ; BANANE 180 ; AABBB 10 ; MISSISSIPPI
34 650 ; OTTO : 6 cases de 4.

Explorations : vingt-six. Casse-têtes : sept. Reste de la liste : droites et plans de l'espace. La liste
d'origine est donc épuisée à une idée près ; idées en réserve : polynômes de Bernstein, phénomène de Gibbs,
argument diagonal, marche aléatoire, théorème de Thalès et homothéties, lieux géométriques (pour l'atelier).

### 134. Espace ; texte courant en LaTeX ; couleurs du solitaire (11 nov. 2026, soir)

**`espace`**, « Droites et plans de l'espace » (Terminale ; géométrie). Plan ax + by + cz + d = 0 et droite
(A, u) ; coefficients par pas de 0,05, traités en vingtièmes entiers (n·u et n·A + d exacts, donc « parallèle »
et « contenue » sans arrondi) ; trois points A au choix, quatre exemples. Vue en projection orthogonale, que
l'on tourne en faisant glisser la figure ou par deux curseurs (azimut, hauteur) ; carré du plan centré sur le
projeté de l'origine ; partie de la droite située de l'autre côté du plan en pointillés ; vecteur normal posé
dans un coin du carré ; point I, projeté H, distance. Contrôlé : plan x + y + 2z − 4 = 0, A(1 ; 2 ; 3),
u(0 ; −0,5 ; −1) → n·u = −2,5, I(1 ; 1 ; 1), distance 5/√6 ≈ 2,041. La liste des vingt idées est épuisée.

**Texte courant en LaTeX (demande de l'auteur).** Outil `/tmp/conv/conv.py` (non versionné : un script de
passage unique) : dans le HTML statique d'un module, il repère les suites de lettres en italique, d'indices,
d'exposants, de nombres et de signes, les traduit en LaTeX et les enveloppe dans `<span class=kx>`. Il ne touche
ni aux libellés des curseurs, ni aux lectures, ni aux titres de tableaux, ni au code. Chaque traduction a été
relue dans son journal (environ 370 formules). Appliqué à : dérivée, limite d'une suite (prototypes), cercle
trigonométrique, second degré, aire, toile d'araignée, binomiale, produit scalaire, chemins sur une grille,
Euler, complexes, taquin, Hanoï, Tout éteindre, dames. Laissés tels quels : les titres de revues en italique,
deux fragments à parenthèses non fermées, les libellés des réglages, les textes écrits par le code (verdicts,
tableaux) et l'atelier, qui ne contient pas de formules. Contrôle : aucune formule en erreur ni en attente sur
les quinze pages, à 1280 et à 360 px.

**Solitaire : couleurs lisibles (demande de l'auteur).** Les trois teintes pâles derrière des pions tous bleu
pétrole ne se distinguaient pas. Quand le coloriage est affiché, chaque pion prend maintenant la couleur de son
trou (bleu, orange, vert, pleines), le trou vide en garde le contour, et la ligne des compteurs porte une
pastille et le nom de chaque couleur.

Explorations : vingt-sept. Casse-têtes : sept. Idées en réserve : polynômes de Bernstein, phénomène de Gibbs,
argument diagonal, marche aléatoire, Thalès et homothéties. L'auteur a annoncé deux idées à décrire en détail.

### 135. Deux prototypes de casse-têtes, NON PUBLIÉS : sudoku et polyominos (11 nov. 2026, soir)

L'auteur a demandé deux prototypes à discuter avant toute publication. Ils ne sont ni dans `activites/` ni dans
le catalogue. Leurs sources sont dans le projet (documents `claude/prototype-sudoku.js` et
`claude/prototype-polyominos.js`) ; pour les essayer, les copier dans `activites/` sous les noms `sudoku.js` et
`polyominos.js`, ajouter deux entrées au catalogue (groupe `casse-tetes`), construire. Une page autonome de
chacun a été remise à l'auteur (page du site où le module est inséré en ligne au lieu d'être importé).

**Sudoku.** Demande : générateur, difficulté réglable, résolution possible jusqu'au bout ; n'afficher une erreur
que si deux chiffres se gênent directement, jamais si la grille est devenue impossible ; variante où l'on pose
ses propres chiffres et où la grille est engendrée autour d'eux ; exposé mathématique. Prototype : tailles 4 × 4,
6 × 6, 9 × 9 ; moteur générique (blocs br × bc) ; solution tirée par retour arrière, indices retirés tant que la
solution reste unique et que le résolveur par déductions reste dans le niveau visé ; cinq niveaux définis par la
déduction la plus fine nécessaire (1 : place unique dans une zone ; 2 : chiffre unique dans une case ; 3 :
candidats confinés, paires ; 4 : triplets, X-wing ; 5 : au-delà) ; « Un pas » expliqué, « Résoudre jusqu'au
bout » ; notes ; clavier. Contrôlé (Node) : 288 grilles de 4 × 4 ; pour 9 × 9, les cinq niveaux sont atteints
exactement, grilles à solution unique, 10 à 600 ms par grille ; les petites tailles ne dépassent guère le
niveau 1 à 3. Sources vérifiées (recherche web) : 6 670 903 752 021 072 936 960 grilles (Felgenhauer et Jarvis,
2005), 5 472 730 538 essentiellement différentes (Russell et Jarvis, 2006), minimum de 17 indices (McGuire,
Tugemann, Civario, 2012). Proposition démontrée dans la page : unicité ⇒ au moins n − 1 chiffres distincts
parmi les indices.

**Polyominos.** Demande : générateur de formes quadrillées, du rectangle aux formes non simplement connexes, à
paver avec un type de pièce, toutes les pièces d'une taille, ou une liste établie ; exposé mathématique.
Prototype : pièces libres énumérées par croissance (1, 1, 2, 5, 12, 35, 108, contrôlé) ; trois familles de
défis (onze types seuls ; trominos, tétrominos, pentominos à volonté ; listes : cinq tétrominos, deux jeux,
douze pentominos, six pentominos au hasard) ; formes : rectangle, rectangle troué, escalier, croix, forme au
hasard par assemblage ; case « garantir une solution » (la page pave avant de proposer, sinon construit une
forme par assemblage et dit pourquoi) ; pose par clic avec aperçu au survol, rotation et retournement (R, F) ;
« Une pièce », « Est-ce possible ? » par recherche de couverture exacte bornée. Contrôlé (Node) : cinq
tétrominos sur 4 × 5 : aucun pavage ; T sur 6 × 6 : aucun ; L sur 8 × 8 privé d'une case : 21 pièces ;
pentominos sur 6 × 10 et sur 8 × 8 troué : pavage trouvé (1,7 s et 0,15 s) ; 3 × 20 : hors de la limite de
recherche. Sources vérifiées : 2 339, 1 010, 368 et 2 pavages des rectangles par les douze pentominos, 65 pour
le carré troué (Dana Scott, 1958) ; 6 × 10 résolu en 1960 par C. B. et J. Haselgrove ; Golomb, à partir de 1953.

Points soumis à l'auteur : voir la réponse de la conversation (niveaux du sudoku, saisie tactile des
polyominos, formes impossibles proposées comme défis, limites de calcul).

### 136. Sudoku et polyominos publiés, après discussion avec l'auteur (11 nov. 2026, soir)

**Décisions de l'auteur.** Les cinq niveaux du sudoku par techniques sont validés. Un indice discret doit
précéder le coup joué ; le bouton qui joue le coup s'appelle « Remplir une case » (et non « Un pas »). Les
polyominos se manipulent par glisser-déposer. Pas de formes impossibles pour le moment (à revoir plus tard) :
la case « garantir une solution » et le bouton « Est-ce possible ? » ont été retirés, toute forme proposée a été
pavée par la page. Tailles gardées : cadre de 12 sur 12 au plus, pièces de 5 cases au plus.

**Sudoku.** Trois aides : « Un indice » (teinte en vert la zone où une déduction est possible et en dit la
nature, sans case ni chiffre) ; « Remplir une case » (enchaîne les éliminations nécessaires, barrées dans les
cases, jusqu'à poser un chiffre, et explique) ; « Résoudre jusqu'au bout ». Chaque déduction du moteur porte
désormais `zone` et `discret`. Saisie : cliquer une case puis taper le chiffre au clavier (écoute sur la
fenêtre, règle du §125), ou touches sous la grille ; flèches, effacement, N pour les notes.

**Polyominos.** Glisser-déposer par événements de pointeur, depuis la réserve ou depuis le plateau : la pièce
suit le pointeur (calque `po-fantome`), l'emplacement visé est teinté en vert ou en orange, la pièce se pose au
lâcher ; lâchée hors de la forme, une pièce du plateau retourne à la réserve ; R et F tournent et retournent
pendant le déplacement, la case saisie restant sous le pointeur. Un déplacement de moins de 7 px reste un clic :
choisir une pièce, la poser sur une case, reprendre une pièce posée. La réserve n'est pas reconstruite pendant
un déplacement (l'élément saisi doit rester en place, pour le toucher). Vérifié à la souris ; le toucher n'a pu
être essayé que par émulation de la largeur, pas avec un vrai doigt.

Explorations : vingt-sept. Casse-têtes : neuf. Les documents `claude/prototype-*.js` du projet sont périmés :
la source est dans `activites/`.

### 137. Polyominos : défi « type TFJM² de Marie » et but du jeu affiché (11 nov. 2026, soir)

Demande de l'auteur. Une catégorie mise en avant (groupe « À la une » de la liste, précédée d'une étoile) et
proposée par défaut à l'ouverture : « type TFJM² de Marie », avec six pièces à volonté, le monomino, le domino,
le tromino droit, le tromino en L, le tétromino en T et le pentomino en X. But : recouvrir la forme avec le
moins de pièces possible. Un bandeau « But du jeu » est affiché en permanence sous les réglages, et son texte
dépend du défi (moins de pièces possible ; chaque pièce une fois ; pièces à volonté). Les boutons d'orientation
portent le nom de leur touche (R, F), rappelé aussi dans le message d'accueil.

Pour les autres défis, le nombre de pièces est imposé par l'aire (pièces de même taille) : le but reste de
réussir le pavage, ce que la page dit. Si l'auteur veut d'autres jeux de pièces de tailles mêlées, il suffit
d'ajouter une entrée `moins: true` à `MODES`.

**Minimum.** `minimum()` : recherche en profondeur sur la première case libre, pièces essayées de la plus grande
à la plus petite, élagage par (pièces posées) + ⌈cases restantes / 5⌉ ≥ meilleur connu, bornée à 400 000
nœuds. Rend le minimum et dit s'il est prouvé (recherche allée au bout). Contrôlé (Node), rectangles : 3 × 3 →
3 ; 4 × 4 → 4 ; 4 × 5 → 6 ; 5 × 5 → 7 ; 5 × 6 → 8 ; 6 × 6 → 10 ; 6 × 8 → 12 ; 8 × 8 → 16, tous prouvés (1 ms
à 1,2 s) ; 10 × 10 → 26 et 12 × 12 → 37, non prouvés (la page le dit). Le minimum n'est annoncé qu'une fois la
forme recouverte, pour comparer, comme dans « Tout éteindre ».

La liste des défis est groupée (`optgroup`) : À la une ; un seul type de pièce ; toutes les pièces d'une
taille ; une liste, chaque pièce une fois.
Compléments du même soir, à la demande de l'auteur : le but (« le moins de pièces possible ») est écrit dans le
chapeau, en tête de la partie « Jouer », dans le bandeau et dans le résumé de la carte ; la vignette de la carte
a été redessinée (les formes n'étaient pas alignées sur un quadrillage commun) : c'est maintenant un carré de
4 sur 4 pavé par un T, un L, un tromino droit et trois dominos, tous sur la même grille de 16 px.

### Note de la conversation Cours (11 nov. 2026) : champ `cours` complété

À la demande de l'auteur, la conversation Cours a ajouté les chapitres de MPSI concernés au champ `cours` de 14
activités (voir §42 de `MEMO_atlas_cours.md`) ; elle n'a rien changé d'autre dans `rubriques/activites.yaml`. Elle
vérifiera ce champ à chaque nouveau chapitre. Les pages de chapitre montrent maintenant, dans une carte
« Activités », les activités qui les citent.

### 138. Nim, ponts de Königsberg, promenade du cavalier (11 nov. 2026, soir)

**Décision de l'auteur : jeux à deux.** Un jeu à deux doit pouvoir se jouer avec un ami assis à côté, sur le
même écran. RÈGLE pour les prochains jeux à deux : un réglage « Adversaire » offre toujours « la page » et « un
ami, sur le même écran » ; dans le second cas la page arbitre (à qui le trait, coup permis, gagnant), nomme les
joueurs A et B avec deux couleurs, et propose « Rejouer la même » en plus de « Nouvelle partie ».

**`nim`** (premier jeu à deux). 2 à 6 tas, taille maximale 3 à 12, positions classiques ; cliquer un objet le
retire avec ceux qui le suivent. Contre la page : elle joue parfaitement (rend la somme de Nim nulle, sinon
retire un objet du plus grand tas) ou se trompe une fois sur deux ; on choisit qui commence. La page répond dans
le même geste que le coup du joueur (pas d'animation) et laisse en pointillés les objets qu'elle a pris.
Écriture en base 2 et somme de Nim sur demande ; « Un coup ». Théorème de Bouton démontré en entier (trois
faits et une récurrence). Contrôlé (Node) : le théorème, par recherche exhaustive, sur 3 072 positions de
quatre tas ; 3 ⊕ 4 ⊕ 5 = 2 ; 1 ⊕ 3 ⊕ 5 ⊕ 7 = 0. Source vérifiée : C. L. Bouton, Annals of Mathematics, 2ᵉ
série, vol. 3 (1901-1902), p. 35-39.

**`ponts`** (tracés d'un seul trait). Figures : Königsberg (multigraphe, arêtes multiples dessinées en arcs),
enveloppe ouverte, pentagone étoilé, deux carrés emboîtés, quatre points tous reliés, figure au hasard (4 à 8
sommets, connexe), figure vide. « Modifier la figure » : deux sommets cliqués créent un trait, un trait cliqué
s'efface. Degrés affichables. « Est-ce possible ? » : connexité puis décompte des sommets impairs. « Un trait » :
règle de Fleury, mise en œuvre par le test « ce qui reste est-il encore traçable depuis le sommet d'arrivée ».
Les deux sens du théorème d'Euler et le lemme des poignées de main sont démontrés dans la page. Contrôlé dans
le navigateur : les trois figures traçables le sont entièrement en suivant les conseils. Source vérifiée :
mémoire présenté le 26 août 1735, paru dans les Commentarii, tome 8 (daté de 1736, publié en 1741) ; réciproque
démontrée par Hierholzer.

**`cavalier`**. Échiquiers de 3 à 8 lignes et colonnes ; numérotation des passages, nombre de sorties sur
demande (règle de Warnsdorff, présentée comme une heuristique) ; « Un saut » et « Est-ce possible ? » par
retour arrière ordonné par nombre de sorties, borné, à trois réponses. L'argument des couleurs est démontré ; le
théorème de Schwenk (1991) est « admis ici ». Contrôlé (Node) contre une recherche exhaustive pour les plateaux
de 20 cases au plus : aucun parcours pour 3 × 3, 3 × 5, 3 × 6, 4 × 4 ; un parcours pour toutes les autres
tailles proposées, trouvé en moins de 30 ms. Cases en deux gris fixes, comme pour les dominos.

Explorations : vingt-sept. Casse-têtes : douze.

### 139. Coloriage de cartes, transvasements, carrés latins, Monty Hall ; message rouge quand le minimum n'est pas atteint (11 novembre 2026)

**Règle nouvelle (demande de l'auteur).** Quand le but d'un jeu est un minimum et que le joueur termine sans
l'atteindre, le message final n'est pas vert mais rouge : classe `.jeu-message.mieux` de `jeux.js` (couleur
`--rouge`). Appliquée à `polyominos`, `coloriage`, `transvasements`. Le vert (`.gagne`) reste pour la réussite
au minimum. `jeux.js` exporte aussi `TEINTES` et `NOMS_TEINTES` : sept teintes fixes (sans rouge) pour les jeux
qui colorient ; chaque couleur est doublée d'un numéro ou d'une lettre.

**`coloriage`** (casse-tête). Cartes sur quadrillage : au hasard (croissance de germes, 8 à 26 régions, 10 × 14),
rectangles superposés (côtés d'abscisses et d'ordonnées toutes distinctes, 12 × 16), roue à cinq quartiers.
Voisinage = côté commun de deux cases. Palette de six couleurs (touches 1 à 6), fautes directes seulement
(frontière épaisse rayée), minimum annoncé à la fin, indice par recherche d'un coloriage minimal prolongeant les
choix. Nombre chromatique exact par retour arrière. Démontré dans la page : deux couleurs pour les rectangles
superposés (parité) ; la roue exige quatre couleurs ; six couleurs suffisent, en admettant qu'une région a au
plus cinq voisines. Admis : théorème des quatre couleurs. Contrôlé (Node) : 1 600 cartes de rectangles, toutes
de nombre chromatique 2 et coloriées par la parité ; roue : 4, sans quatre régions mutuellement voisines ;
cartes au hasard : 3 ou 4. Sources vérifiées : conjecture de 1852, Kempe 1879, Heawood 1890, Appel et Haken 1976.

**`transvasements`** (casse-tête). Capacités 2 à 12, but réglable, six opérations (les opérations sans effet
sont grisées), quadrillage des états avec le parcours, minimum par parcours en largeur, « Un coup », « Est-ce
possible ? ». « Nouveau défi » ne tire que des défis réalisables d'au moins quatre opérations. Théorème démontré
en entier (invariant ; cycle « remplir A, verser dans B » et Bézout). Contrôlé (Node) : le théorème sur toutes
les capacités de 2 à 12 ; 3 et 5 → 4 : minimum 6, 8 par le cycle partant de A ; 3 et 5 → 1 : 4 opérations.

**`carres-latins`** (casse-tête). Jeu gréco-latin (officiers lettre latine + lettre grecque, réserve d'un
officier de chaque sorte) et jeu latin simple ; ordres 3 à 7 ; départ : grille vide, première ligne, un tiers,
la moitié. Solutions : i + j et 2i + j modulo n pour n impair, corps à quatre éléments pour n = 4, brouillées
par permutations. L'ordre 6 gréco-latin est proposé vide, annoncé sans solution dans le bandeau du but (choix
assumé : c'est le problème historique). Indice : la solution d'origine si la position la respecte, sinon retour
arrière plafonné à 40 000 essais, à trois réponses. Démontré : existence des carrés latins, construction pour n
impair, impossibilité à l'ordre 2, au plus n − 1 carrés orthogonaux, absence de carré orthogonal à la table de
ℤ/nℤ pour n pair. Admis : Tarry (1900-1901), Bose-Shrikhande-Parker (1960). Contrôlé (Node) : 200 solutions par
ordre, toutes valides ; aucune transversale dans ℤ/4ℤ ni ℤ/6ℤ. Source vérifiée : Euler, « Recherches sur une
nouvelle espèce de quarrés magiques », 1782.

**`monty-hall`** (exploration, probabilités). Trois vues : le jeu (3 à 10 portes, l'animateur ouvre n − 2
portes ; animateur qui sait, ou qui ouvre au hasard, la partie étant alors annulée s'il montre la voiture) ; un
mur de 300 parties coloriées selon la stratégie gagnante, que l'on peut ranger par couleur ; le carré des
probabilités (trois portes, porte 1 choisie, colonnes = place de la voiture, découpées selon la porte ouverte),
avec la préférence p de l'animateur par vingtièmes et l'observation choisie ; fractions exactes. Démontré :
1/n et (n − 1)/n ; Bayes : p/(1 + p). Contrôlé (Node, 400 000 parties) : 1/3, 2/3 ; au hasard 1/3, 1/3, 1/3
d'annulées ; dix portes au hasard : 0,1 ; 0,1 ; 0,8. Sources vérifiées : Selvin 1975, vos Savant 1990.

Explorations : vingt-huit. Casse-têtes : quinze.

### 140. Le jeu de go (11 novembre 2026, nuit)

Demande de l'auteur : un go en 9 × 9, selon la proposition faite (plateaux de 5, 7 et 9 lignes, la page ou un
ami pour adversaire, problèmes de vie et de mort). Module `activites/go.js`, en trois parties.

**Moteur (`plateau(n)`).** Voisins et diagonales précalculés ; `respire` (une chaîne a-t-elle une liberté,
parcours à pile), `chaine` (pierres et libertés), `poser` (prises, refus du suicide, point de ko simple),
`oeil`, `aire` (décompte par aire). Règle de répétition de la partie : aucune disposition du plateau ne revient
(ensemble `vus` des dispositions). Fin par deux passes ; la page propose les pierres mortes d'après le
propriétaire moyen de chaque case sur 400 parties finies au hasard (chaîne morte si la moyenne dépasse 0,4 en
faveur de l'adversaire), les joueurs corrigent en cliquant, « Reprendre la partie » ou « Valider le décompte ».
Komi au choix (0 ; 5,5 ; 6,5 ; 7,5). Libertés et chaînes à une liberté affichables. Clavier : flèches, Entrée,
P (écoute sur la fenêtre). Plateau en teintes fixes (bois, noir, blanc), identiques en clair et en sombre.

**Adversaire (`monteCarlo`).** Recherche arborescente de Monte-Carlo avec statistiques « tous les coups comme
premiers » (RAVE) ; parties au hasard qui ne remplissent pas leurs propres yeux ; calcul par tranches de 35 ms
pour ne pas figer la page ; trois durées (0,4 s ; 1,2 s ; 3 s). Après une passe adverse, la page passe si le
décompte du plateau tel quel lui donne la victoire. Mesuré (Node) : environ 11 000 parties par seconde sur
9 × 9 ; 20 victoires sur 20 contre un joueur au hasard avec 400 parties par coup ; 16 sur 16 pour 1 500 parties
contre 150 sur 7 × 7 ; sur 5 × 5 sans komi, Noir gagne d'environ 22 points contre lui-même (valeur théorique
25). Niveau réel face à un humain : non mesuré ; la page se présente comme un adversaire de débutant.
« Un conseil » : même recherche pendant 0,7 s, annoncée comme une suggestion.

**Vie et mort (`vieEtMort`, `probleme`).** Dix espaces intérieurs (trois en ligne, trois en coude, quatre en
ligne, en coude, en T, en carré, cinq en croix, en massue, six en fleur, en rectangle) sur un plateau de 9 :
l'espace est entouré de Blanc (voisinage à huit cases), lui-même entouré de Noir. Recherche exhaustive sans
table : seuls les points de l'espace se jouent, Blanc et Noir peuvent passer, deux passes = le groupe vit,
aucune disposition ne se répète le long d'une variante. Au plus 17 000 nœuds, 30 ms. L'utilisateur joue Noir, la
page défend parfaitement ; option « Blanc joue d'abord » ; « Un indice », « Où en est-on ? », « Renoncer : Blanc
vit ». Résultats (tableau calculé par la page à l'ouverture), conformes aux résultats classiques : trois en
ligne, trois en coude, quatre en T, cinq en croix, cinq en massue, six en fleur : le trait décide ; quatre en
ligne, quatre en coude, six en rectangle : vivants ; quatre en carré : mort même si Blanc commence. Contrôlé :
Blanc est une seule chaîne sans liberté extérieure dans les dix problèmes.

**Mathématiques de la page.** Démontré : une partie compte au plus 2 × 3^(n²) coups ; une chaîne à deux yeux
ne peut être prise. Calculé (Node, énumération) : 57, 12 675 et 24 318 165 dispositions légales pour n = 2, 3,
4. Admis ou cité : nombre de dispositions légales sur 19 × 19 (Tromp, 2016, environ 2,08 × 10^170, 1,2 % du
total, vérifié par recherche web) ; 5 × 5 résolu, Noir gagne tout le plateau (van der Werf, van den Herik,
Uiterwijk, 2003, vérifié). Le titre « Solving Go on Small Boards », ICGA Journal, est cité de mémoire.

**Niveaux de la page (demande de l'auteur, même nuit).** L'auteur trouvait la page forte et les libellés
« réfléchit peu, un peu plus, longtemps » peu parlants. Le réglage est désormais « Niveau de la page » : 1 ·
débutant (15 parties par coup, et un coup au hasard trois fois sur dix), 2 · facile (120, par défaut), 3 · moyen
(1 200), 4 · fort (10 000, plafonné à 8 s). Le niveau fixe un nombre de parties et non plus une durée : la force
ne dépend plus de l'appareil. Mesuré (Node, 9 × 9, komi 7,5) : débutant contre hasard 19 sur 20 ; facile contre
débutant 20 sur 20 ; moyen contre facile 16 sur 16 ; fort contre moyen 8 sur 8.

**Retouches du 12 novembre (demandes de l'auteur, qui a joué sur téléphone).**
- *Niveaux 2 et 3 relevés* : 250 et 3 000 parties par coup (au lieu de 120 et 1 200) ; 1 et 4 inchangés.
  Mesuré : facile contre débutant 20 sur 20 ; moyen contre facile 16 sur 16 ; fort contre moyen 11 sur 16.
- *« Arrêter et estimer »* : à tout moment, 600 parties finies au hasard donnent le propriétaire moyen de chaque
  intersection ; les intersections encore ouvertes reçoivent un carré estompé si la moyenne dépasse 0,3 en valeur
  absolue, et sont comptées dans un score annoncé comme « Estimation ». Pierres mortes proposées comme avant.
- *Arrêt automatique* (`arretAuto`, avant chaque coup, à partir de 2n coups joués, 300 parties) : si aucune
  intersection n'est « disputée » (moyenne inférieure à 0,8 en valeur absolue, soit moins de neuf parties sur
  dix pour le même joueur), la page ouvre le décompte estimé. L'auteur demandait un arrêt « quand plus rien n'est
  mathématiquement disputable » : le critère retenu est statistique et la page le dit ; un critère exact
  (algorithme de Benson) ne se déclencherait presque jamais dans une partie réelle.
- *Abandon de la page* : au trait, si elle gagne au plus 1 % de ces 300 parties, elle abandonne (partie finie,
  estimation affichée). « Annuler » et « Reprendre la partie » permettent de continuer ; l'arrêt automatique est
  alors suspendu jusqu'à la partie suivante (`G.sansArret`).

**Taquin (même demande).** Bouton « Revenir au départ » (position d'après le dernier mélange ou le dernier
échange, compteur remis à zéro). Une fois le taquin rangé, le message rappelle le minimum depuis la position de
départ (exact jusqu'à neuf cases ; minorant de Manhattan au-delà, annoncé comme tel).

**Polyominos (12 nov., demande de l'auteur, sur téléphone).** Un nouveau clic sur la pièce déjà choisie dans la
réserve la tourne d'un quart de tour, comme la touche R (utile au doigt, où il n'y a pas de clavier).
Ordre de la liste des défis, à sa demande : À la une ; une liste, chaque pièce une fois ; un seul type de
pièce ; toutes les pièces d'une taille.

Explorations : vingt-huit. Jeux et casse-têtes : seize.

### 141. Prototype NON PUBLIÉ : « Le compte est bon », pour une sous-rubrique de calcul mental (12 nov. 2026)

Demande de l'auteur : une sous-rubrique de calcul mental, avec un nombre du jour à atteindre à partir de six
nombres et des quatre opérations (interface donnée par une capture : cinq lignes « a op b = résultat », touches
C, +, −, ×, ÷, annuler, six plaques), en trois niveaux : 1, trois ou quatre étapes ; 2, cinq étapes et plusieurs
chemins ; 3, une seule solution. Prototype remis à l'auteur (page autonome) ; il n'est ni dans `activites/` ni
dans le catalogue. Source : document `claude/prototype-compte-est-bon.js` du projet.

**Choix faits, à discuter.**
- *Nombre du jour sans serveur* : une banque de tirages classés est embarquée dans le module ; l'indice du jour
  est le nombre de jours écoulés depuis le 1er janvier 2026 à Paris, modulo la taille de la banque. Tous les
  visiteurs ont donc le même tirage. « Un autre tirage » en prend un au hasard dans la banque.
- *Banque* (prototype : 150, 150 et 142 tirages ; à porter à 400 environ avant publication, une seconde de
  calcul par tirage) : plaques tirées parmi 1 à 10 en double, 25, 50, 75, 100 ; pour chaque tirage, toutes les
  suites d'opérations sont énumérées (résultats entiers strictement positifs ; sont écartées les opérations
  inutiles : fois 1, divisé par 1, a − b = b, a ÷ b = b). Chaque calcul est ramené à une forme normale (sommes
  et produits aplatis, opérandes triés) : deux solutions sont identiques si elles ont la même forme normale.
  Niveau 1 : minimum de 3 ou 4 opérations et au moins trois formes ; niveau 2 : minimum 5 et au moins trois
  formes ; niveau 3 : une seule forme. Outils : `gen.mjs`, `banque.mjs` (gardés dans /home/claude/proto, à
  verser dans `outils/activites_compte.mjs` à la publication).
- *Dans la page* : recherche du plus court calcul par approfondissement itératif (48 ms au plus), pour
  « Un indice » (deux temps : nature de la première opération, puis l'opération) et « Voir une solution ».
  Contrôlé : sur les 442 tirages, cette recherche retrouve le minimum inscrit dans la banque.
- Un clic sur un nombre remplit la prochaine case vide ; un clic sur un nombre de la ligne en cours le retire.
- Groupe du catalogue à créer (`calcul`), nom et couleur à décider avec l'auteur.

### 142. Sous-rubrique « Calcul mental » : « Le compte est bon » publié (12 nov. 2026)

**Décisions de l'auteur.** Nom de l'onglet : « Calcul mental » ; titre de l'activité : « Le compte est bon ».
Deux solutions qui ne diffèrent que par l'ordre des calculs sont identiques (définition du §141, acceptée).
Le niveau 3 impose cinq opérations. Tirage plus varié que celui du jeu télévisé. Banque de 400 tirages par
niveau. Le navigateur retient que le nombre du jour a été trouvé (mention « Fait »), sans empêcher de
recommencer. Couleur propre au groupe, distincte du bleu pétrole. La case du résultat est en surbrillance bleue.
D'autres activités de calcul mental viendront plus tard (idées : jeu du 24, ordres de grandeur, critères de
divisibilité, carrés et produits remarquables, fractions à comparer).

**Groupe `calcul`** du catalogue (`couleur: calcul`) : teinte `--activites-calcul` (indigo, #4051c4 en clair,
#9aa8ff en sombre), déclarée dans `gabarit.html` à côté de `--activites-jeu`, avec la règle
`[data-teinte="calcul"]`. Le module remplace `--activites-jeu` par cette teinte à l'intérieur de son cadre
`.jeu`. L'onglet est placé avant l'atelier. Les descriptions de la rubrique (menu, cartes de l'accueil, titre
« Explorer, jouer, calculer, construire », introduction « Quatre façons… ») citent le calcul mental.

**Tirage** (`outils/activites_compte.mjs`, graine fixe, `node outils/activites_compte.mjs 500`, une vingtaine
de minutes) : six nombres dont un, deux ou trois (55 %, 37 %, 8 %) parmi 25, 50, 75, 100 ; les autres parmi 1 à
12 (deux exemplaires chacun), 15 et 20. But de 101 à 999. Niveau 1 : minimum 3 ou 4 opérations, au moins trois
formes normales ; niveau 2 : minimum 5, au moins trois formes ; niveau 3 : minimum 5, une seule forme. La banque
(1 200 chaînes « plaques:but:minimum », 48 Ko) est inscrite dans `activites/compte-est-bon.js` (constante
`BANQUE`). Contrôlé : la recherche de la page retrouve le minimum inscrit pour les 1 200 tirages (68 ms au
plus). Le nombre du jour est le tirage d'indice (jours depuis le 1er janvier 2026 à Paris) modulo 400 : la
liste revient au bout de 400 jours ; pour la renouveler, changer la graine et régénérer.

**Mémoire** : `localStorage`, clé `atlas-compte-est-bon`, valeur `{ jour, faits: { niveau: opérations } }`,
ignorée dès que le jour change ; le meilleur nombre d'opérations est gardé ; rien n'est noté si la solution a
été affichée avant la réussite, ni pour un tirage libre. La page le dit (« rien n'est envoyé »).

Le document `claude/prototype-compte-est-bon.js` du projet est périmé : la source est dans `activites/`.

**Retouches du même jour (demandes de l'auteur).** (1) Tirage élargi : les petits nombres vont de 1 à 20 (1 à
12 en deux exemplaires, 13 à 20 en un seul), et non plus 1 à 12, 15 et 20 ; banque régénérée (graine
2026111201) : 400, 400 et 396 tirages (le niveau 3, plus rare, n'en a fourni que 396 sur 520 tirages essayés ;
chaque niveau tourne sur sa propre longueur). Les nombres du jour ont donc changé le 12 novembre en cours de
journée. Contrôle refait sur les 1 196 tirages. (2) La flèche n'efface plus une ligne entière : après une ligne
calculée, elle retire seulement le second nombre, la ligne redevenant incomplète ; puis l'opération, puis le
premier nombre.

Explorations : vingt-huit. Jeux et casse-têtes : seize. Calcul mental : une activité.

### 143. Prototypes NON PUBLIÉS : sous-rubrique « Raisonner » (12 nov. 2026)

Demande de l'auteur : un prototype de la sous-rubrique « Raisonner » proposée (démonstrations à remettre en
ordre, erreurs à trouver), en rouge, celui du logo et du titre de l'accueil (`--rouge`). Page autonome remise à
l'auteur. Rien n'est dans `activites/` ni dans le catalogue. Sources dans le dépôt, hors du site :
`outils/activites_prototypes/ordonner.js` et `erreur.js` ; `page_autonome.py` (dans le même dossier) fabrique
une page autonome à partir d'un module installé provisoirement dans `activites/` (les chemins y sont ceux de la
session de travail ; les fichiers de KaTeX sont pris sur le site en ligne, sans quoi les formules restent en
LaTeX brut quand la page est ouverte hors du site).

**Pour publier** : déplacer les deux modules dans `activites/` ; ajouter au catalogue le groupe `raisonner`
(`couleur: raison`) et les deux activités ; dans `gabarit.html`, la règle
`[data-teinte="raison"] { --o: var(--rouge) !important; }` ; compléter les descriptions de la rubrique.

**`ordonner`.** Une pièce = un énoncé, des étapes, un intrus. Chaque étape porte ses dépendances, chacune avec
la phrase dite quand elle manque (« cette étape emploie l'entier k, qui n'a pas encore été introduit »).
« Vérifier » (sur demande seulement) parcourt la démonstration : intrus (avec l'explication de sa faute),
première dépendance manquante, ou étapes manquantes. Tout ordre compatible avec les dépendances est accepté.
Pose par clic, flèches pour monter et descendre, croix pour renvoyer en réserve ; pas encore de glisser-déposer.
Trois pièces : irrationalité de √2 (intrus : réciproque prise pour l'énoncé direct), infinité des nombres
premiers (intrus : « donc N est premier » ; 30 031 = 59 × 509, vérifié), somme des n premiers impairs par
récurrence (intrus : hypothèse « pour tout n »). Contrôlé (Node) sur les 720 ordres de chaque pièce : un seul
ordre accepté pour les deux premières, quatre pour la récurrence (l'initialisation peut venir après l'hérédité).

**`erreur`.** Une pièce = un raisonnement en lignes numérotées, dont une fautive. Clic sur une ligne : si elle
est juste, la page dit pourquoi et la marque ; si c'est la faute, elle l'explique et donne « À retenir ».
Nombre d'essais compté. Trois pièces : 1 = 2 (division par a − b = 0), 2 > 3 (division d'une inégalité par
ln(1/2) < 0), les chevaux de même couleur (hérédité fausse pour n = 1).

**Questions posées à l'auteur** : une activité par genre avec une liste de pièces (choix du prototype), ou une
carte par pièce ; glisser-déposer ; nombre et choix des pièces ; plusieurs intrus par pièce ; mémoire des pièces
réussies.
