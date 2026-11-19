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
  Elle sert d'image d'attente au lecteur et de miniature YouTube. Les trois films en ont une (dérivation : la colline,
  le chien et la tangente ; équations : 3x + 2 = x + 10 et sa balance en équilibre).
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

## 10. Protocole de publication d'une vidéo de cours (fixé avec l'auteur le 15 novembre 2026)

Les trois premières vidéos (dérivation, équations, nombres réels et suites) sont **validées** et le protocole est lancé.

1. **L'auteur valide la vidéo.**
2. **La session prépare le dépôt YouTube** : le fichier final, la miniature (1280 × 720, tirée de la vignette du film)
   et la fiche (`python3 videos/fiche.py <cours> <dossier>` : titre, description, repères de temps, mots-clés,
   réglages conseillés). L'entrée de la vidéo est créée dans `videos/catalogue.json` (cours, dossier, nom de fichier,
   titre YouTube, présentation, mots-clés, `youtube` vide). Noms des fichiers : `atlas-<niveau>-<chapitre>-<sujet>`.
3. **L'auteur dépose lui-même la vidéo sur YouTube** (chaîne créée le 15 novembre) et donne l'adresse. C'est la seule
   étape manuelle, par choix : l'envoi automatique par l'interface de programmation de YouTube laisse les vidéos
   bloquées en privé tant que le projet Google n'a pas passé un audit (ne pas reproposer cette voie sans fait nouveau) ;
   piloter son navigateur reste possible, mais n'a pas été retenu.
4. **La session met la vidéo sur le site** : version allégée (libx264, crf 27, `-g 60`, `+faststart`) et vignette
   servies par l'hébergement dans `/videos/`, hors de la branche `main` ; adresse YouTube inscrite au catalogue ; puis
   `"en_ligne": true`, qui fait paraître le bouton « Vidéo » et le lecteur ; construction, contrôle du rendu (clair,
   sombre, ordinateur, téléphone), poussée.

**Fait le 15 novembre** : adresses YouTube des trois vidéos
au catalogue (seconde `Ll1S6FZrqK4`, première `kbkuh8Pka5k`, MPSI `VYHA0HfCdbs`) ; lecture du catalogue par
`construire.py` ; bouton et lecteur dans `gabarit.html` (détail dans `MEMO_atlas_cours.md` §51) ; `/videos/` exclu du
service worker (`MEMO_atlas_apropos.md` §83). Vérifié sur le site construit servi localement, la vidéo de MPSI placée
à la main dans `site/videos/` : liste et page de chapitre, clair et sombre, ordinateur, téléphone droit et couché.
Piège : le site a déjà des classes `.lecteur`, `.vue`, `.lecture`, `.bulle` ; celles du lecteur vidéo sont préfixées
(`vl-`, `vx-`), faute de quoi la bulle de la piste et l'icône de lecture étaient déformées.

**Dépôt des fichiers : la branche `videos-fichiers` (choix de l'auteur, 15 novembre).** La session ne peut pas créer
de publication GitHub (« releases » interdites à ce type de session, erreur 403) et n'a pas les accès OVH. Les
versions allégées et les vignettes vivent donc dans une branche orpheline du dépôt, `videos-fichiers`, séparée de
`main` pour que le dépôt de travail reste léger. Le job `ovh` de `publier.yml` la récupère, copie ses `.mp4` et `.jpg`
dans `site/videos/` et s'arrête si un fichier d'une vidéo `en_ligne` manque ; l'envoi étant différentiel, une vidéo
déjà en ligne ne repart pas. GitHub Pages ne reçoit pas les vidéos : le lecteur les demande toujours à
`https://www.atlasjourdain.fr/videos/`.
Pour ajouter une vidéo : `git worktree add /tmp/wt videos-fichiers`, y copier les deux fichiers, valider, pousser
(jamais `--force`) ; **puis seulement** passer `en_ligne` à vrai dans le catalogue et pousser `main`, ce qui lance la
publication. Limite à surveiller : environ 20 Mo par vidéo dans le dépôt (GitHub conseille de rester sous quelques
gigaoctets) ; au-delà d'une cinquantaine de vidéos, revoir le dépôt des fichiers.

Repères de temps : YouTube n'active les chapitres que si le premier est à 0:00 et si chacun dure au moins dix secondes ;
l'ouverture (huit secondes) est donc rattachée à la première partie, et `fiche.py` refuse un chapitre trop court.
État au 15 novembre : les quatre étapes sont faites pour les trois vidéos (`en_ligne` vrai).

## 11. Trois nouvelles vidéos (16 novembre 2026), validées par l'auteur le 18 novembre 2026

**Validées toutes les trois le 18 novembre** (matrices : prototype 1 ; géométrie : prototype 2 ; probabilités :
prototype 1, teintes des boules comprises). Étapes 1 et 2 du protocole (§ 10) faites : entrées au catalogue
(`me-03`, `t-04`, `s-03`, `youtube` vide, `en_ligne` faux), fichiers, miniatures et fiches remis à l'auteur
(`atlas-expertes-03-matrices`, `atlas-terminale-04-geometrie-espace`, `atlas-seconde-03-probabilites`).
**Étape 4 faite le 18 novembre** : adresses YouTube au catalogue (seconde `ctVEQI9F4z4`, terminale `MOjC5I8yaew`,
Maths expertes `mnR8HGAnZLU`), versions allégées (16,7 à 18,7 Mo) et vignettes dans `videos-fichiers`, `en_ligne`
vrai ; lecteur ouvert et lu pour les trois sur le site construit (clair, sombre, ordinateur, téléphone). Les pages
YouTube n'ont pas pu être relues depuis la session (accès refusé) : les adresses sont inscrites telles que données
par l'auteur. Six vidéos sont en ligne.

- **« Les matrices », Terminale Maths expertes, chapitre 3** — `videos/matrices/`, 3 min 47 s
  (`matrices-expertes-prototype-1.mp4`). Parties (mesures 2, 6, 10, 22, 26, 30 ; bilan 42 ; fin 46) : un tableau de
  nombres, somme et produit par un réel, le produit de deux matrices, un produit où l'ordre compte, les puissances,
  l'inverse d'une matrice. Tous les exemples sont ceux du cours `me-03`, sauf D = diag(2, 3) pour les puissances et
  la matrice sans inverse (2 4 ; 1 2). Mise en scène : pendant le produit, disposé « au brouillon » comme dans le
  cours, le chien quitte le jardin par la droite, entre par la droite sur une tablette, reçoit chaque coefficient
  calculé sur une étiquette, la porte sous sa case et l'y dépose d'un petit bond ; il repart par la droite.
- **« La géométrie dans l'espace », Terminale spécialité, chapitre 4** — `videos/espace/`, 4 min 03 s
  (`espace-terminale-prototype-1.mp4`). Parties (2, 6, 14, 22, 26, 34 ; bilan 46 ; fin 50) : un repère de l'espace, le
  produit scalaire, le plan et son vecteur normal, la droite et son paramètre, positions relatives, le projeté
  orthogonal. Exemples du cours `t-04` ; le point M(2 ; 3 ; 2) du repère est propre à la vidéo. Le chien joue quatre
  fois : il marche les coordonnées de M dans le repère ; il est le point M qui se promène sur le plan ; il est le
  point de paramètre t sur la droite (valeur affichée en direct) ; perché en M, il saute à la verticale sur son
  projeté H. `film.js` y a des outils de figure en perspective cavalière (`vue`, `seg`, `poly`, `angleDroit`) et les
  trois mouvements motivés du chien en fonctions (`bond`, `chute`, `sautJardin`), à reprendre dans les films suivants.

Retours de l'auteur sur la géométrie (16 novembre), corrigés dans `espace-terminale-prototype-2.mp4` : la droite
sécante du croquis doit rester alignée de part et d'autre du plan (partie cachée en pointillé, puis visible au-delà
du bord) ; sur le cube, (CG), à l'arrière, s'interrompt là où elle croise en apparence (AB) ; la carte de l'équation
cartésienne rappelle M(x ; y ; z) et les coordonnées de AM, écrites en bleu comme le vecteur AM. **À retenir pour
toute figure de l'espace : respecter la profondeur (ce qui est derrière s'interrompt ou passe en pointillé) et
faire suivre le code couleur des figures jusque dans les calculs.**

Les deux films sont bâtis sur celui des équations (boîte à outils, intertitres, jardin, fin, vignette). `BILAN` est
désormais dans la partition (les films plus anciens écrivent la mesure du bilan en dur).
Piège rencontré : dans `chienA`, deux trajets vers la droite qui se suivent additionnaient leurs « face » et étiraient
le chien ; `face` est maintenant borné à [−1 ; 1] dans `videos/espace/film.js` (à reporter si le cas se présente
ailleurs). MathJax espace mal un mot accentué dans `\text{…}` (« parallè le ») : écrire ce texte avec `txt`.

Troisième prototype, demandé par l'auteur « avant de valider » :

- **« Les probabilités », Seconde, chapitre 3** — `videos/probabilites/`, 4 min 03 s
  (`probabilites-seconde-prototype-1.mp4`). Mêmes bornes que la géométrie (2, 6, 14, 22, 26, 34 ; bilan 46 ; fin 50).
  Parties : une expérience aléatoire (dé, Ω, A = {2 ; 4 ; 6}, B = {5 ; 6}) ; contraire, intersection, réunion
  (diagramme, événements incompatibles) ; la loi de probabilité (dé truqué en barres, P(A) = 0,6 ; jeu de 32 cartes,
  8/32 et 4/32) ; deux formules (P(Ā) = 3/4, P(A ∪ B) = 11/32) ; les arbres pondérés (urne de 3 rouges et 2 vertes,
  tirage avec remise, 12/25 = 0,48) ; les probabilités conditionnelles (tableau du lycée de 500 élèves,
  P_S(M) = 0,3, définition, produit, indépendance). Tous les exemples sont ceux du cours `s-03` ; les calculs ont été
  refaits en fractions exactes avec Python. Bilan : « Trois formules ».
  Le chien joue deux fois : il entre par la gauche et pousse le dé, qui roule et s'arrête sur 4 ; il sort du jardin
  par la gauche, entre par la gauche à la racine de l'arbre, suit le chemin (R ; V), descend d'un saut vertical sur la
  branche de (V ; R) et revient à la racine par l'autre chemin. Il s'arrête aux trois quarts de la dernière branche
  (`KS` dans `cheminChien`) pour ne pas masquer l'étiquette de l'issue.
  **Couleurs :** les boules et les branches de l'urne sont en rouge brique `#e2553b` et en vert `#7fc65a`, teintes
  propres à ce film ; le rouge du site reste réservé aux définitions. Accepté avec la validation du 18 novembre.

## 12. Trois nouvelles vidéos (18 novembre 2026), validées par l'auteur le jour même

**Validées toutes les trois le 18 novembre** (géométrie cartésienne : prototype 2 ; fonctions et limites :
prototype 1, étoile ⋆ de la caractérisation séquentielle et courbes bleues comprises). Étapes 1 et 2 du protocole
faites : entrées au catalogue (`p-03`, `t-03`, `ma-08`, `youtube` vide, `en_ligne` faux), fichiers, miniatures et
fiches remis à l'auteur (`atlas-premiere-03-geometrie-cartesienne`, `atlas-terminale-03-fonctions-numeriques`,
`atlas-mpsi-08-limites-continuite`). **Étape 4 faite le 18 novembre** : adresses YouTube au catalogue (première `wp3gFFiFubI`, terminale
`yYJ6w-K-Tyw`, MPSI `pk2gm2xENy0`), versions allégées (18,6 à 19,4 Mo) et vignettes dans `videos-fichiers`,
`en_ligne` vrai ; lecteur ouvert et lu pour les trois sur le site construit (clair, sombre, ordinateur, téléphone).
La vignette de la géométrie cartésienne servie par le site est celle au vecteur. Neuf vidéos sont en ligne.

- **« Géométrie cartésienne », Première spécialité, chapitre 3** — `videos/cartesienne/`, 4 min 03 s
  (`geometrie-cartesienne-premiere-prototype-1.mp4`). Parties (2, 6, 14, 22, 26, 34 ; bilan 46) : les vecteurs,
  colinéarité et déterminant, l'équation cartésienne, l'équation réduite, deux droites sécantes, résoudre le système.
  Exemples du cours `p-03` (u(1 ; −3) et v(3 ; −9), d : 2x + 3y − 8 = 0 avec A(1 ; 2) et B(2 ; 1), système de
  solution (1 ; 3) par les deux méthodes) ; propres à la vidéo : A(1 ; 1) et B(4 ; 3) pour le vecteur, w(2 ; 1) comme
  vecteur non colinéaire. Le chien parcourt le vecteur de A à B (la flèche se trace sous ses pattes), puis il est le
  point M de la droite d, dont les coordonnées s'affichent en direct.
  Retour de l'auteur (18 novembre), fait dans `geometrie-cartesienne-premiere-prototype-2.mp4` : **davantage de
  couleurs dans les méthodes**. (E₁) est en bleu et (E₂) en orange partout, comme les droites d₁ et d₂ ; l'expression
  substituée 2y − 5 est en violet ; les résultats restent en turquoise. À retenir pour les calculs en plusieurs
  lignes : une couleur par objet que l'on suit d'une ligne à l'autre.
  Vignette : à la demande de l'auteur, proposée avec un vecteur (flèche de A à B sur un quadrillage, chien dessus,
  coordonnées de AB) à la place de la droite et de son équation ; c'est celle que dessine désormais `film.js`
  (l'auteur a donné l'adresse YouTube aussitôt après, sans objection : c'est la vignette du site).
  Relevé dans le PDF du cours, non corrigé (domaine Cours) : proposition 1, point 5, la somme de deux vecteurs est
  écrite (x + y ; x′ + y′) au lieu de (x + x′ ; y + y′).
- **« Fonctions numériques », Terminale spécialité, chapitre 3** — `videos/fonctions/`, 4 min 03 s
  (`fonctions-terminale-prototype-1.mp4`). Parties : une limite en l'infini, limites infinies et asymptotes, lever
  une indétermination (dont les gendarmes), dériver une composée, la convexité, continuité et valeurs intermédiaires.
  Exemples du cours `t-03` ; propre à la vidéo : la bande ]1,5 ; 2,5[ (atteinte pour x > 7) et la cubique à trois
  solutions de l'illustration du théorème. Le chien court sur la courbe de 2 + 3/(x − 1) et sort par la droite ; il
  parcourt x³ − 3x² + 2 avec la tangente sous ses pattes, que l'on voit changer de côté au point d'inflexion.
  Son inclinaison est bornée à 49° (`incl`) : sur une pente raide, il semblait grimper à la verticale.
- **« Limites et continuité », MPSI, chapitre 8** — `videos/limites-continuite/`, 4 min 07 s
  (`limites-continuite-mpsi-prototype-1.mp4`). Sept parties (2, 6, 14, 18, 26, 34, 38 ; bilan 46) : l'histoire
  (dates de l'introduction du cours, sans citation), la limite en un point (1/x en 2, δ = min(1, 2ε)), le pont avec
  les suites (sin(1/x)), la continuité en un point (partie entière, prolongement de x sin(1/x)), valeurs
  intermédiaires (dichotomie sur x² − 2), bornes atteintes, continuité uniforme et Heine ; bilan en arbre.
  Le chien est le milieu du segment dans la dichotomie, puis il va s'asseoir au point où le maximum est atteint.
  **Étoile ⋆** : la caractérisation séquentielle de la limite porte une ⋆ et la mention « la réciproque utilise
  l'axiome du choix dénombrable ». Le PDF du cours ne le signale pas : à confirmer par l'auteur.
  Rouge : seulement les termes définis et le nœud « axiome » du bilan (la courbe du cours, rouge, est ici en bleu).

**Assembleur** : `videos/outils/asm.py <nom>` fabrique `score.js` et `film.js` d'un film à partir de `videos/espace/`
(en-tête, intertitres, jardin, fin) et de cinq morceaux rangés dans `videos/outils/<nom>/` (`conf.json`,
`score-corps.js`, `scenes.js`, `acteur.js`, `vignette.js`, plus `formules-src.mjs`) ; `outils.js` porte les outils
communs (`seg`, `pt`, `bond`, `chute`, `sautJardin`, `bilanCartes`). **Retoucher les morceaux, puis réassembler** :
une retouche faite dans `film.js` serait perdue. `conf.json` accepte `bornes` et `pas_jardin` pour un film à sept
parties. Pièges : dans une légende, `[…]` est la balise rouge (ne pas y écrire un intervalle) ; lancer deux rendus à
la fois double leur durée ; l'assemblage son-image prend alors plusieurs minutes (attendre la ligne « wrote »).

## 13. Sept prototypes des chapitres 1 (18 novembre 2026), en attente du retour de l'auteur

Demandés par l'auteur en un seul lot, montrés en prototype, **ni validés ni inscrits au catalogue**. Tous durent
4 min 03 s (six parties aux mesures 2, 6, 14, 22, 26, 34 ; bilan 46) et sont assemblés par `videos/outils/asm.py`.

| Dossier | Chapitre | Fichier livré | Rôle du chien |
|---|---|---|---|
| `nombres` | Seconde 1, Nombres et calculs (`s-01`) | `nombres-calculs-seconde-prototype-1.mp4` | il parcourt la diagonale du carré de côté 1 ; il est un réel x dans [1 ; 4] |
| `second-degre` | Première 1, Second degré (`p-01`) | `second-degre-premiere-prototype-2.mp4` | il descend la parabole jusqu'au sommet ; il lit le signe du trinôme le long de l'axe |
| `suites` | Terminale 1, Suites numériques (`t-01`) | `suites-terminale-prototype-2.mp4` | il pousse le premier domino ; il gravit les premiers termes de la suite |
| `divisibilite` | Maths expertes 1 (`me-01`) | `divisibilite-expertes-prototype-1.mp4` | neuf bonds de 5 puis deux pas : 47 = 5 × 9 + 2 |
| `logique-approfondies` | Maths approfondies 1 (`ap-01`) | `ensembles-logique-approfondies-prototype-1.mp4` | il est l'élément x (A inclus dans B ; puis E, E ∩ F, F) |
| `logique-mpsi` | MPSI 1, Logique et ensembles (`ma-01`) | `logique-ensembles-mpsi-prototype-1.mp4` | il est le y qui répond à chaque x, puis se fait dépasser |
| `structures` | MP 1, Structures algébriques (`mp-01`) | `structures-algebriques-mp-prototype-1.mp4` | il avance de 18, recule de 12 : 12ℤ + 18ℤ = 6ℤ |

Retours de l'auteur sur le second degré (19 novembre), faits dans `second-degre-premiere-prototype-2.mp4` : les deux
paraboles (a > 0, a < 0) ont leurs axes sur une même horizontale, au centre de l'écran, étiquettes au-dessus ;
**tout tableau de signes porte une barre verticale, en pointillé, sous chaque valeur où l'expression s'annule**, le
zéro posé dessus, pour séparer les cases « + » des cases « − » (règle à suivre dans tous les films).

Retours de l'auteur sur les suites (19 novembre), faits dans `suites-terminale-prototype-2.mp4` (4 min 35 s, bornes
2, 6, 14, 22, 30, 42 ; bilan 54) : le chien **se dresse sur ses pattes arrière** et pousse le domino des pattes avant
(pose `allure: 'vol'` avec un tangage de 1,2 : à reprendre quand il doit pousser ou s'appuyer) ; la partie 4 commence
par les **limites usuelles** (proposition 2 du cours) avant les formes indéterminées ; la partie 5 énonce les deux
**théorèmes de comparaison** (minoration, majoration ; exemple n + sin n, propre à la vidéo), puis les gendarmes, puis
le **théorème de convergence monotone, nommé**. Leçon : dans une vidéo de cours, ne sauter aucun théorème du
chapitre et donner à chacun son nom, quitte à allonger le film.

Exemples propres aux vidéos (tout le reste vient des cours) : Maths expertes, 47 et −47 divisés par 5, 211 et
30 031 = 59 × 509 pour l'argument d'Euclide, 84/126 = 2/3 ; MPSI, l'exponentielle pour illustrer les parties paire et
impaire (sans nommer ch et sh, définis plus tard). Tous les calculs sont vérifiés avec Python.

**Assembleur, depuis ce lot** : un film se réduit à `conf.json` (titres, noms des parties, vignette, bilan en trois
cartes), `score-parties.js` (un objet d'instants par partie, avec les raccourcis `N`, `P`, `Cl` pour une note, un
« pas », une cloche, et `G` pour les fenêtres des légendes), `formules-src.mjs` et `scenes.js`. Ce dernier se termine
par `ACTES_DEF` (les actes du chien, décrits par `acte(partie, instants, échelle, position(t), [sortie])` : bond sous
l'écran, chute sur la figure, jeu, saut vertical vers le jardin) et par `vignetteFig`. Outils ajoutés dans
`outils.js` : `phase`, `legs`, `fo`, `tx`, `acte`, `axeGradue`. Compter, par film, une heure de travail dont dix
minutes de rendu ; ne lancer qu'un rendu à la fois quand c'est possible.

