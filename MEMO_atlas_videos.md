# MÉMO — Vidéos ATLAS

Ce mémo appartient à la conversation « Vidéos ATLAS ». Son domaine : concevoir et produire de courtes vidéos
d'animation dans le style du site (palette, polices, dessin en aplats des symboles), et, quand l'auteur le
demande, les intégrer au site. Lire d'abord `MEMO_atlas.md` (section 0), puis ce mémo. Le dépôt fait foi.

## 1. Ce qui existe (14 novembre 2026)

Une vidéo : la **présentation d'ATLAS**, dans `videos/presentation/`.

- Format : vertical 9:16, 1080 × 1920, 30 images par seconde, 48 secondes, MP4 (H.264 yuv420p + AAC), environ
  12,5 Mo. Thème sombre, avec son, légendes courtes. Usage visé : Instagram (Reels) et lecture sur téléphone.
- Elle n'est **pas dans le dépôt** (règle de poids, § 6) et **pas sur le site**. Elle a été livrée à l'auteur
  dans la conversation ; `sh videos/presentation/fabriquer.sh` la refait à l'identique en trois à quatre minutes.
- Version validée par l'auteur le 14 novembre : image du « prototype 8 », musique lo-fi « mélange » corrigée
  (« prototype 13 »).

### Déroulé (les instants viennent de `score.js`)

| Plan | Instants | Ce qu'on voit |
|---|---|---|
| Ouverture | 0 – 4,5 s | Le logo complet se trace sommet par sommet (α, point, Ω en rouge), « ATLAS », surtitre de l'accueil. Le chien arrive au galop, le jardinier à pied. |
| L'édifice | 4,5 – 12,5 s | Titre du site ; l'édifice monte rang par rang ; un fil lumineux va de la logique au théorème des nombres premiers. |
| Rubriques | 12,5 – 28,5 s | Quatre secondes par rubrique : un écran animé, un compteur, un arbre planté. |
| Partage | 28,5 – 34,5 s | Boutons « Partager » et « Signaler une erreur » ; des messages deviennent les feuilles d'un grand arbre. |
| Ambition | 34,5 – 42,5 s | Les 38 théories reçoivent chacune trois feuilles : cours, exercices, activités. |
| Fin | 42,5 – 48 s | Logo, « ATLAS », adresse, signature ; le jardinier lève son chapeau. |

## 2. Fichiers de `videos/presentation/`

| Fichier | Rôle |
|---|---|
| `fabriquer.sh` | Refait tout : données, musique, image, assemblage, contrôle. `MUSIQUE=marimba` rejoue la première musique. |
| `score.js` | **Source unique des instants** (120 à la noire, un temps = 0,5 s, décalage 0,5 s). L'image et le son la lisent tous deux : ne jamais régler un instant ailleurs. Contient aussi les textes et les chiffres des rubriques (`RUB`) et le scénario des écrans (`ECR`). |
| `film.js` | L'image : chaque image est une fonction pure de `t`. Décor, logo, édifice, légendes, cartes des rubriques, jardin, scènes. |
| `chien.js` | Le labrador chocolat (`CHIEN.dessiner`) : squelette posé par cinématique inverse, aplats par-dessus. |
| `jardinier.js` | Le jardinier (`JARDINIER.dessiner`) : costume trois pièces bleu nuit, cheveux châtains mi-longs, petites lunettes rondes, chapeau en courbe en cloche, arrosoir en zinc marqué d'un π. |
| `ecrans.js` | Les écrans des quatre rubriques (visionneuse de cours, banque d'exercices et corrigé, grille des annales et moteur, quatre activités). |
| `song-lofi.js` | La musique retenue (`MELODIE=melange`). Sans variable : mélodie lo-fi seule ; `MELODIE=ancienne` : thème d'origine seul. |
| `song.js` | La première musique (marimba, boîte à musique) ; `MUSIQUE=acoustique` : guitare et piano électrique. Gardée pour mémoire. |
| `gen-data.js` → `data.js` | Tire de `gabarit.html` les symboles de la planche `sym-sprite`, et de `edifice-mini.json` la miniature de l'édifice. |
| `extraire-edifice.mjs` → `edifice-mini.json` | Relève sur le site construit (thème sombre) les positions, couleurs et arêtes de la miniature de l'accueil. À relancer quand l'édifice change. |
| `essai-chien.html`, `essai-jardinier.html` | Planches de poses (à ouvrir dans un navigateur) : c'est là qu'on juge un dessin avant de refaire la vidéo. |
| `fonts/` | Spectral, IBM Plex Sans et Mono (paquets `@fontsource`), GFS Didot pour les lettres du logo, KaTeX Main, Math et AMS pour les formules. |
| `engine/` | Moteur de rendu et de synthèse sonore, copié de l'extension *animation-studio* d'Afaq Rashid (licence MIT, `engine/LICENSE`), sans son dossier de polices (inutile ici ; le moteur signale leur absence sans s'arrêter). Ne pas le modifier. |

## 3. Méthode

1. **Partition d'abord.** Tout événement visible (un rang de l'édifice, une feuille qui se pose, une étape de
   corrigé) est un instant de `score.js`, sur une subdivision du temps ; le son le lit au même endroit.
2. **Image.** `engine/render.js` sert le dossier, ouvre `index.html` dans Chrome sans écran et appelle
   `renderAt(t)` pour chaque image. Aucun hasard non semé : `alea(graine)` seulement, sinon deux rendus diffèrent.
3. **Regarder avant de rendre.** `node engine/render.js stills 12.9 24.3` écrit des images dans `out/stills/` ;
   `sheet 0 48 24 6` une planche de 24 images. Un rendu complet dure trois minutes : on ne le lance qu'après.
4. **Son.** On ne peut pas l'écouter depuis la session : on le mesure (`engine/tools/levels.js` par piste et par
   plan, niveau réglé à −14 LUFS), et l'auteur l'écoute. Le dire à chaque livraison.
5. **Contrôle.** `engine/render.js verify` mesure l'écart son-image aux marqueurs `sync: 'av'` (l'oméga, le
   théorème, la fin). Un éclair bref sur toute l'image rend ces instants mesurables.
6. **Changer seulement la musique** : inutile de refaire l'image. On remplace la piste son par
   `ffmpeg -i video.mp4 -i musique.wav -map 0:v -map 1:a -c:v copy -c:a aac`.

## 4. Décisions de l'auteur

- Avec son, légendes courtes, thème sombre ; format vertical pour Instagram.
- Ton : dynamique, chaleureux, joyeux, coloré, à l'image du jardin de l'accueil.
- **Pas de phrase entre guillemets attribuée à l'auteur**, pas de signature en cours de vidéo : le plan de
  l'édifice affiche le titre du site, « L'architecture des mathématiques, de l'axiome au théorème ».
- **Logo complet** (α cerclé de blanc, Ω cerclé de rouge, flèches) à l'ouverture et à la fin.
- **Tout est centré sur le milieu réel de l'image** (x = 540), et non sur la « zone sûre » d'Instagram.
- **Chien** : labrador chocolat d'après une photo fournie ; queue épaisse à l'attache, qui **retombe** quand
  il est debout et immobile ; sourcil clair et relevé (un trait sombre lui donnait l'air froncé). Collier
  orange : le rouge de la photo est réservé.
- **Jardinier** : il ressemble à l'auteur (cheveux châtains, petites lunettes rondes, costume trois pièces).
  Pas de visage, les lunettes suffisent. Costume bleu nuit (le gris se confondait avec les troncs ; plus foncé,
  la jambe arrière disparaît sur le fond). Cheveux mi-longs qui bougent, raccourcis d'un cinquième à sa demande.
  La jambe s'arrête à la cheville, dans le soulier.
- **Herbe** : brins pleins sur trois plans, épis, trèfles, fleurs ; le premier plan passe devant les pieds.
- **Annales** : la ligne dit « le bac et 9 concours, à explorer par thème ».
- **Musique** : cuivres écartés ; marimba jugé trop enfantin ; retenue : lo-fi (entendue à 60 à la noire), avec le
  thème d'origine en citations une mesure sur deux pendant les rubriques, puis à la floraison.
- Idées proposées et non faites (ne pas les reproposer sans raison) : reculer d'un pas pour admirer un arbre,
  caresser le chien.

## 5. Exactitude : ce qui est vérifié, ce qui est illustratif

- Chiffres relevés sur la construction du 14 novembre 2026 : 38 théories, 982 définitions, axiomes et théorèmes,
  71 chapitres, 3 016 exercices, 803 sujets, 54 activités. **Ils vieillissent** : les corriger dans `score.js`
  (`RUB`) et dans `film.js` (légende de l'édifice) avant toute nouvelle diffusion.
- Le fil lumineux suit des arêtes réelles : logique → ZF → relations → ordres → ordinaux → ℕ → ℤ → ℚ → ℝ → ℂ →
  analyse complexe → nombres premiers ; `film.js` signale en console toute arête absente.
- Formules : x² − 5x + 6 = 0 a pour discriminant 1 et pour racines 2 et 3 ; la sécante à y = x² entre 1 et
  1 + h a pour pente 2 + h ; le taquin se résout par huit coups légaux ; quatre appuis éteignent toutes les
  lampes ; la médiatrice passe par les intersections des deux arcs.
- « 83 sujets, 138 parties concernées » est la réponse du moteur du site pour « déterminant » (écoles
  d'ingénieurs) le 14 novembre.
- **Illustratif, dit à l'auteur** : l'exercice affiché n'est pas tiré de la banque ; les cases qui s'éclairent
  dans la grille des annales sont tirées au hasard ; le texte de la page de cours est figuré par des lignes grises.
- Le rouge n'apparaît que sur l'oméga du logo et sur « de l'axiome au théorème ». Aucune étoile.

## 6. Pièges rencontrés

1. **Accords du style lo-fi.** Le moteur ajoute à chaque accord la note située dix demi-tons au-dessus de la
   *première* note donnée. Un accord mal ordonné reçoit une note étrangère (un mi bémol sur ré mineur) : l'auteur
   l'a entendu. Ordonner chaque accord pour que la note ajoutée lui appartienne, et vérifier par le calcul
   qu'aucune note de mélodie ne tombe un demi-ton au-dessus d'une note d'accord.
2. **Zone sûre.** Le moteur propose de centrer sur la zone sûre d'Instagram (décalée de 40 pixels) : l'image
   paraît alors décentrée. Garder x = 540 ; laisser seulement le bas de l'image libre (sous y ≈ 1500).
3. **Polices du moteur.** Sans `engine/fonts/`, le moteur écrit « font failed » pour ses polices par défaut :
   c'est sans effet, la vidéo charge les siennes dans `init` de `film.js`.
4. **Symboles mathématiques.** Les lettres ℕ, ℤ, 𝔻, ℚ, ℝ viennent de la police KaTeX AMS (lettres latines
   majuscules) ; la racine carrée est tracée à la main avec son trait.
5. **Texte dans une sous-scène.** Tout texte décoratif passe par `G.decor(...)`, sinon le contrôle `qa` du
   moteur le signale comme hors zone.
6. **Poids.** L'herbe détaillée se compresse moins bien (12,5 Mo contre 10). Ne jamais déposer de MP4 dans le
   dépôt sans accord de l'auteur ; `videos/*/out/` est ignoré par git.
7. **Mise en mémoire des couleurs.** `edifice-mini.json` contient les couleurs du thème sombre calculées par le
   navigateur : le relever avec le cookie `atlas-theme=dark`.
8. **Personnages.** Un dessin se juge sur sa planche de poses, en grand, pas dans la vidéo. Les deux
   personnages glissent encore un peu pendant les déplacements entre rubriques (le décor défile plus vite qu'une
   course réaliste) ; à l'entrée, la phase de la marche suit le chemin parcouru et les pieds ne glissent pas.

## 7. Suites possibles

- Autres idées proposées au départ : générique de six secondes, épisode du jardinier, démonstration en une minute.
- Si la vidéo va sur le site : image d'attente, pas de lecture automatique avec son, respect de « réduire les
  animations », et accord préalable sur l'endroit où vit le fichier et sur son poids.

## 8. Jardin de l'accueil (14 novembre 2026)

À la demande de l'auteur, le chien, le jardinier et l'herbe de la vidéo ont été reportés dans le jardin de la page
d'accueil (`accueilJardin` dans `gabarit.html`, domaine « À propos »). Le détail est dans `MEMO_atlas_apropos.md`,
§ 81. À retenir pour ce domaine : les deux dessins existent désormais **en deux exemplaires** (`videos/presentation/`
et `accueilJardinDessins` dans `gabarit.html`) ; une retouche d'un personnage se fait des deux côtés. L'accueil a en
plus un thème clair, des attitudes aléatoires du jardinier et le chien dressé contre un tronc, que la vidéo n'a pas.

## 9. Vidéos de cours pour YouTube (15 novembre 2026)

Une vidéo par chapitre de cours, en paysage 16:9 (1920 × 1080, 30 images/s), même direction artistique que la vidéo
de présentation : thème sombre, habillage lo-fi à 60 à la noire, jardin en bas de l'écran. Pas de voix : les
explications passent par des légendes en phrases complètes (une voix pourrait se poser dessus plus tard).

### « La dérivation », Première spécialité, chapitre 4 — validée par l'auteur le 15 novembre 2026

`videos/derivation/`, 3 min 51 s, 33 Mo, non versionnée (`out/`), ni sur le site. Elle suit le cours `p-04` avec deux
fonctions seulement : x² (taux de variation, nombre dérivé, fonction dérivée, tangente) et −x³ + 3x² + 2 (la colline du
début, l'exemple de dérivation, les variations). Déroulé (mesures de 4 s, `L(mesure, temps)`) : ouverture (0–2), une
pente en chaque point (2–6, le chien parcourt la colline, la tangente sous ses pattes), taux de variation (6–10),
nombre dérivé (10–18), fonction dérivée (18–22), formules (22–34), tangente (34–38), variations (38–50), bilan (50–54),
fin (54–58). Un arbre est planté à la fin de chacune des sept parties : le jardin sert de barre de progression.

Fichiers : `score.js` (instants et événements sonores `EV`), `commun.js` (couleurs, texte balisé, formules, repères et
courbes, jardin : la boîte à outils des vidéos de cours), `film.js` (les scènes), `song.js`, `formules-src.mjs` →
`gen-formules.mjs` → `formules.js` (formules composées par MathJax en tracés SVG, une image par formule ; MathJax
s'installe hors dépôt), `index.html`, `fabriquer.sh`. Le moteur, les polices, `chien.js` et `jardinier.js` sont copiés
depuis `videos/presentation/` par `fabriquer.sh` et ignorés par git : le serveur du moteur ne suit pas les liens
symboliques.

Conventions retenues : la courbe de f en bleu, ce qui touche à la dérivée (tangente, f′) en turquoise, sécante et taux
de variation en orange, h en violet, signe de f′ en vert (positif) et orange (négatif). Le rouge reste réservé au logo,
au mot « Définition » et aux termes que l'on définit (balise `[ … ]` des légendes). Balisage des phrases : `$…$` pour
les mathématiques, `{ … }` pour une mise en valeur turquoise ; le prime « ′ » est dessiné en exposant (le glyphe de
KaTeX_Main est prévu pour cela). Tous les calculs montrés sont vérifiés avec sympy. Pas de limites en ±∞ dans le
tableau de variations (hors programme de Première).

Décisions de l'auteur : **aucune signature** « Armand Jourdain, professeur agrégé de mathématiques » sur l'écran de
fin, pour cette vidéo comme pour les suivantes ; l'écran de fin porte le logo, le titre et le renvoi vers le cours.

Rendu : environ 4 min 30 pour 6 930 images ; le son n'est que mesuré (−14 LUFS), jamais écouté.

**Idée écartée par l'auteur (15 novembre 2026), à ne pas reproposer** : un filet de la couleur du domaine mathématique du
chapitre (`--c-alg`, `--c-ana`…) tiré sous l'en-tête pour le séparer de la scène. Essayé sur les deux vidéos, non retenu :
l'en-tête reste sans filet.

### « Les équations », Seconde, chapitre 4 — validée par l'auteur le 15 novembre 2026

`videos/equations/`, 3 min 35 s, 30 Mo, non versionnée, ni sur le site. Elle suit le cours `s-04`, avec la balance pour
fil conducteur. Déroulé : ouverture (0–2), vocabulaire sur 5x − 3 = 2x + 9 (2–6), principe de la balance (6–14, une
vraie balance : 3 sacs de graines et 2 poids contre 1 sac et 10 poids, soit 3x + 2 = x + 10, équation absente du cours
mais de même solution 4 ; un sac retiré d'un seul côté la fait pencher), méthode (14–22, 5x − 3 = 2x + 9 ligne à
ligne), deux cas particuliers (22–26), équations produit (26–38), équations quotient (38–46), bilan (46–50), fin
(50–54). Six arbres. Non repris, faute de place : l'introduction historique, 4(x − 2) = 7x + 1, l'équation à
fractions, 5x² + 3x = 0 et le premier exemple de quotient.

Fichiers propres : `score.js`, `film.js` (dont `balanceD`, `objet`, `eq`, `marque`, `carte`, `branches`), `song.js`
(celui de la dérivation, réglé par `score.FIN`), `formules-src.mjs` et `formules.js`. `commun.js` et
`gen-formules.mjs` sont ceux de `videos/derivation/` (le premier est copié par `fabriquer.sh`). Couleurs : l'opération
faite aux deux membres et les solutions en turquoise, le faux et l'interdit en orange, le vrai en vert, l'inconnue des
sacs en violet ; cartes « Définition » à filet rouge, « Propriété » à filet turquoise.

Pour une nouvelle vidéo de cours : copier `videos/equations/` (structure la plus générale : `TITRE`, `NIVEAU`,
`NB_EXERCICES` en tête de `film.js`, parties dans `CH` de `score.js`), réécrire les scènes et les formules.

### Règles des vidéos de cours, fixées par l'auteur le 15 novembre 2026

Elles valent pour les trois vidéos existantes et pour toutes les suivantes.

1. **Un intertitre avant chaque partie et avant le bilan.** Il dure une mesure entière (quatre secondes) et se déroule
   en trois temps qui ne se recouvrent pas : la scène précédente s'efface, le titre de la partie paraît seul avec son
   rang (« 6 / 7 »), puis la scène suivante se découvre. Le jardin reste visible. Dans `score.js`, `INTER = 4` et
   `BORNES` (les mesures où commencent les parties et le bilan) décalent toute l'horloge : `L(b0)` est l'instant où le
   contenu d'une partie démarre, l'intertitre occupe `[L(b0) − INTER, L(b0)]`, et `CH[k].t1 = L(b1) − INTER` est la fin
   réelle de la partie (l'arbre y est planté). Dans `film.js`, `intertitre()` pose un voile ; tant qu'il est fermé, les
   scènes sont dessinées à l'instant `L(b0)` (variable `ts` de `draw`), sans quoi la scène précédente reparaît en
   fantôme à la réouverture. La musique lit la même horloge : pendant cette mesure, `song.js` (événement `titre`) tient
   l'accord de dominante qui termine la phrase précédente. Les parties commencent donc toutes sur une mesure
   congrue à 2 modulo 4, et leur longueur est un multiple de quatre mesures.
2. **Le rythme de lecture.** Décision de l'auteur après essai : **au lycée, on ne ralentit pas** ; les versions
   rallongées de la dérivation (5 min 59 s) et des équations (6 min 27 s) ont été jugées beaucoup trop longues, et
   l'on compte sur la pause pour lire. La même règle vaut pour la vidéo de MPSI, ramenée de 5 min 11 s à 4 min 07 s à
   sa demande. Ne pas reproposer de rallonger une vidéo pour laisser le temps de lire.
3. **Toute légende nomme ce dont elle parle** : pas de « ces nombres » sans que les nombres soient cités ou montrés
   avant (remarque de l'auteur sur la suite 1 ; 1,4 ; 1,41 ; 1,414).
4. Pas de signature sur l'écran de fin ; pas de filet de couleur sous l'en-tête (idée écartée).
5. **Mettre en scène les deux personnages dans les animations, autant que possible.** L'auteur aime beaucoup le chien
   de la vidéo de dérivation, qui parcourt la colline avec la tangente sous ses pattes puis s'assoit au sommet de la
   courbe : le chien et le jardinier ne doivent pas rester cantonnés au jardin du bas, mais porter l'idée mathématique
   quand elle s'y prête (un personnage sur une courbe, sur une droite graduée, sur un plateau de balance…), sans
   jamais fausser la figure.
   **Le chien est l'acteur principal ; le jardinier reste stoïque au jardin** (décision de l'auteur). **Chaque
   déplacement du chien a une raison que l'on voit** : il ne disparaît ni n'apparaît jamais d'un coup. Il sort du
   jardin par un bord pendant un intertitre et entre dans la scène par le même bord, ou bien il saute sous l'écran
   et retombe du haut ; il revient au jardin en sautant devant le jardinier ou en y rentrant par un bord.
   **Un saut reste court et proche de la verticale** : une longue distance se parcourt au sol, en courant, jamais
   par un grand saut oblique (remarque de l'auteur : « on dirait qu'il vole »).
   Mises en scène en place (15 novembre), **validées par l'auteur pour les trois vidéos** une fois les sauts de sortie
   de la dérivation et de la MPSI rendus verticaux (fichiers livrés `derivation-premiere-prototype-7-chien.mp4`,
   `equations-seconde-prototype-6-chien.mp4`, `reels-suites-mpsi-prototype-9-chien.mp4`) :
   - dérivation : sur la colline du début, il traverse l'écran de gauche à droite et rentre au jardin par la droite ;
     pour les variations, il saute sous l'écran, retombe du haut sur la courbe, la parcourt, s'assoit au sommet, puis
     en saute presque à la verticale, se reçoit dans l'herbe au pied de la figure et regagne sa place au galop,
     derrière le jardinier (un long saut oblique du sommet au jardin donnait l'impression qu'il volait : écarté) ;
   - équations : il sort à gauche pendant l'intertitre, entre près de la balance, s'assoit, bondit et vole un sac sur
     le plateau de gauche (l'équilibre est rompu), repart à gauche et rapporte le sac au jardin, devant le jardinier ;
   - MPSI, borne supérieure : il saute sous l'écran, retombe du haut sur l'intervalle A, y marche vers sup A sans
     l'atteindre (il est l'élément a ; le point vert reste sous ses pattes), puis en saute presque à la verticale et
     revient au trot s'asseoir près du jardinier ;
   - MPSI, Archimède : il sort à gauche pendant l'intertitre, entre par la gauche de l'axe, fait les sept sauts de
     longueur a, repart par la droite et revient au jardin par la droite.
   Outils : `acteur(ctx, t)` dans `film.js` (dessiné par-dessus tout) ; `K.chienSur(ctx, px, py, an, ech, pose)` pose
   le chien en un point exact ; `K.poseChute(t)` (pattes qui battent, corps qui tangue, oreilles et queue rabattues
   vers le haut par l'air) et `K.poseChoc(t, u)` (réception) ; `chien.js` accepte `oreille` (rotation de l'oreille ;
   la copie de l'accueil, dans `gabarit.html`, ne l'a pas) ; `EN_SCENE` liste les fenêtres où le chien du jardin
   n'est pas dessiné, et ses `TRAJETS` portent les sorties et les retours.

`song.js` est désormais le même fichier dans les trois dossiers (il lit `score.FIN`, `score.CH` et les événements).
`commun.js` (dans `videos/derivation/`, copié ailleurs par `fabriquer.sh`) sait écrire dans les légendes les indices
(`$u_n$`), les exposants (`$x^2$`), le prime et les lettres ℝ, ℚ, ℕ, ℤ ; un seul caractère après `_` ou `^`.

**Validées en l'état par l'auteur le 15 novembre 2026**, contenu du matin avec les seuls intertitres en plus :
« La dérivation » 4 min 23 s (parties aux mesures 2, 6, 10, 18, 22, 34, 38 ; bilan 50 ; fin 54, fichier livré
`derivation-premiere-prototype-5-intertitres.mp4`), « Les équations » 4 min 03 s (2, 6, 14, 22, 26, 38 ; bilan 46 ;
fin 50, `equations-seconde-prototype-4-intertitres.mp4`). Les versions rallongées, écartées, restent dans l'historique
(validation « intertitres, rythme de lecture » du 15 novembre).

### « Nombres réels et suites numériques », MPSI, chapitre 7 — validée par l'auteur le 15 novembre 2026

`videos/reels-suites/`, 4 min 07 s (rythme d'origine, intertitres compris ; fichier livré
`reels-suites-mpsi-prototype-6.mp4`). Fil du cours `ma-07` : Dedekind bute en 1858 sur « une suite croissante et majorée
a une limite » ; tout découle de l'axiome de la borne supérieure. Parties (mesures 2, 6, 14, 18, 26, 34, 38 ; bilan
46 ; fin 50) : un théorème sans démonstration (les valeurs décimales approchées par défaut de √2), la borne supérieure
(A = [0 ; 1[, caractérisation, axiome), premières conséquences (Archimède avec sa preuve, densité des décimaux),
limite d'une suite (u_n = 2 + (−1)ⁿ·3/(n + 2) ; ε = 0,4, 0,2, 0,1 donnent N = 6, 13, 28), limite monotone (sommes des
1/k², démonstration animée, ε = 0,12 et N = 8), suites adjacentes (sommes des 1/k! et v_n = u_n + 1/(n·n!)),
Bolzano-Weierstrass (dichotomie du cours sur sin n : u₀, u₄, u₅, u₁₁, u₁₇), bilan en arbre. Le rouge y sert aussi au
point sup A et à la droite ℓ = sup{u_n}, comme sur les figures du cours. Aucun usage de l'axiome du choix. La phrase
de 1858 est une paraphrase de l'introduction du cours, sans guillemets.

### Diffusion (question de l'auteur, non tranchée)

YouTube peut afficher des publicités sur toute vidéo, même d'une chaîne non monétisée. Héberger les fichiers est
possible : réencodées (libx264, crf 27), les vidéos pèsent environ 3 Mo par minute. Elles ne doivent pas entrer dans le
dépôt ; il faudrait les déposer à part sur l'hébergement. L'intégration aux pages de cours relève du domaine Cours.

### Lecteur vidéo du site : prototype (15 novembre 2026, en discussion, rien sur le site)

Idée de l'auteur : dans la rubrique Cours, sous la pastille « En ligne » d'un chapitre, un bouton de lecture (rectangle
arrondi au rouge du site, triangle clair) ouvre la vidéo dans un lecteur presque plein écran. Le lecteur montre
d'abord une vignette, puis la vidéo ; sa barre porte au centre lecture/pause (touche Espace) entouré de deux boutons
« 5 secondes » (flèches du clavier), à droite un lien vers YouTube et le plein écran, et au-dessus une piste où chaque
intertitre est une pastille qui donne son titre au survol et y saute au clic.

- Sources du prototype : `videos/lecteur/gabarit-proto.html` (page, styles, script) et `gen.py`, qui y verse les lignes
  des chapitres 7 et 8 de MPSI (lues dans `construction/donnees.json`) et les intertitres (lus dans
  `videos/reels-suites/score.js`). La page fabriquée, la vidéo allégée (crf 27, 19,7 Mo pour 4 min 07 s : l'herbe se
  compresse mal, soit près de 5 Mo par minute et non 3) et la vignette ne sont pas dans le dépôt.
- **Vignette** : `film.js` de `reels-suites` la dessine pour tout instant au-delà de la durée plus 100 s
  (`node engine/render.js stills 1000`) : titre, figure de la borne supérieure avec le chien sur A, jardin planté.
  Elle sert d'image d'attente au lecteur et servira de miniature YouTube. À reporter dans les deux autres films.
- Choix faits dans le prototype, à confirmer : lecteur toujours en thème sombre ; partie lue en turquoise (couleur de
  la rubrique Cours), le rouge restant au seul bouton de lecture ; le bouton vit hors du lien de la ligne (un bouton
  dans un lien est interdit en HTML), ce qui demandera de retoucher la ligne `.chapitre` de `gabarit.html`.
- Retour de l'auteur (15 novembre, soir) : **le lecteur lui plaît**. Corrigé à sa demande : pastilles centrées sur le
  rail (le pseudo-élément n'héritait pas de `box-sizing`), plein écran (un `<dialog>` ne peut pas passer en plein
  écran : on y met un cadre intérieur `.l-cadre`, avec repli « toute la fenêtre » si le navigateur refuse ; touche F,
  double clic), bouton de **vitesse** ×0,5, ×1, ×1,5, ×2 (menu).
- Puis, à sa demande : le gros bouton de la vignette est **en haut à droite**, à la hauteur de la ligne « MPSI ·
  chapitre 7 » ; le minuteur est dans une **pastille** (fond `--trame`, filet), et le titre de la partie en cours, qu'il
  apprécie à cet endroit, est à côté, centré sur elle, en encre pleine.
- **Bouton de la page Cours : piste A retenue par l'auteur**, une pastille pleine turquoise « ▶ Vidéo », jumelle de
  « En ligne » et placée dessous. Écartés, à ne pas reproposer : le rectangle rouge façon YouTube, la mini-vignette,
  le rond au trait, la phrase sous le résumé.
- **Téléphone** (demandes de l'auteur) : sous 640 px la barre passe sur deux rangs (minuteur, partie en cours, YouTube,
  vitesse, plein écran ; puis les trois boutons de lecture seuls), ce qui supprime la collision entre « +5 s » et
  YouTube. Sur écran tactile (`pointer: coarse`), le plein écran est **immersif** : la vidéo occupe tout, l'en-tête et
  la barre se posent par-dessus et s'effacent après trois secondes de lecture ; un appui sur la vidéo les rappelle,
  ils restent visibles en pause. Sur ordinateur, la barre reste toujours visible (souhait de l'auteur). L'iPhone
  n'accorde pas le plein écran à un élément de page : **à la demande de l'auteur**, le bouton y ouvre le lecteur du
  système (`video.webkitEnterFullscreen`), seul vrai plein écran, avec les commandes d'Apple et sans les pastilles ;
  si le système refuse, on retombe sur le mode « toute la fenêtre », immersif. Rien de tout cela n'a été essayé sur
  un vrai téléphone (émulation tactile de Chrome et simulation du cas iPhone seulement).
- **Téléphone couché** (collision signalée par l'auteur) : la disposition de la barre dépend désormais de la largeur du
  lecteur, calculée par `majEtroit()`, et non de celle de l'écran (un téléphone couché a un écran large mais un
  lecteur étroit). Trois états : normal (720 px et plus), `compact` (YouTube réduit à son symbole), `etroit` (moins de
  500 px, deux rangs). Sur écran tactile en paysage de moins de 520 px de haut (classe `couche`), le lecteur prend
  toute la fenêtre ; une fois la vidéo lancée il devient immersif, avant cela la vignette reste entière.
  Piège rencontré : un commentaire `//` ajouté en fin de ligne a avalé deux appels écrits sur la même ligne.
- Validé par l'auteur sur son iPhone : plein écran du système, et lecteur téléphone droit sans plein écran.
- L'intégration au site relève du domaine Cours : ne rien y toucher sans demande de l'auteur.
