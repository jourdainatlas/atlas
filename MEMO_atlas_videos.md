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

- Reporter le chien, le jardinier et l'herbe dans le jardin de l'accueil (`accueilJardin`, domaine « À propos »,
  son mémo § 73) : prototype demandé par l'auteur le 14 novembre, à lui montrer avant toute publication.
- Autres idées proposées au départ : générique de six secondes, épisode du jardinier, démonstration en une minute.
- Si la vidéo va sur le site : image d'attente, pas de lecture automatique avec son, respect de « réduire les
  animations », et accord préalable sur l'endroit où vit le fichier et sur son poids.
