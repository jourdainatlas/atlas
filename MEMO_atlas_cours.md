# Mémo ATLAS — complément : rubriques Cours et Exercices

> Complète `MEMO_atlas.md` (sections 0 à 16, dont la section 0 sur le travail en parallèle) et se lit
> avec lui. Sections réservées à ce mémo : 19 à 22 (17-18 : Annales ; 23 et suivantes : Édifice). Une
> section nouvelle prend le numéro suivant le plus grand employé, tous mémos confondus. Les
> conventions de rédaction des cours et des feuilles sont dans les documents du projet Claude
> `MEMO_conventions_cours.md`, `CONVENTIONS_Exercices.md` et `PREAMBULE_TYPE.tex`, qui ne sont pas
> dans le dépôt.

### 19. Domaine de la conversation « Cours » (27 oct. 2026)

La conversation Cours n'écrit que dans son domaine, tel que le définit `MEMO_atlas.md` (section 0,
point 1) : `rubriques/cours.yaml`, `rubriques/exercices.yaml`, `rubriques/exercices/`,
`documents/cours/`, `documents/exercices/`, `documents/figures/`, `outils/tex2exos.py`,
`outils/meta_*.py` et le présent mémo. Dans les fichiers communs, elle ne touche qu'à ce qui lui
appartient, par remplacements locaux après `git fetch` et `git rebase` sur `origin/main` :
- dans `gabarit.html`, les fonctions `pageCours`, `coursLies`, `pageChapitre`, `chargerExercices`, `enLigneExos`,
  `pageExercices`, `vueFeuilles`, `filtrerExercices`, `vueExercices`, `carteExercice`, et dans
  `pageAccueil` la seule carte des cours et des exercices ; toute nouvelle fonction porte un nom qui
  commence par `Cours`, `Chapitre`, `Exo` ou `Feuille` (ou les contient) ;
- dans `construire.py`, le bloc « rubriques (cours, exercices…) » et ses vérifications ;
- les styles `.cours-lies` et `.cours-lie` de `gabarit.html` ;
- dans `rendu.mjs`, l'écriture de `site/exercices-textes/` et des pages de partage `cours/` et `exercices/`.

Les PDF de cours et de feuilles et les figures SVG sont versés dans des commits séparés du code et des
données YAML. Les messages de commit commencent par « Cours : » ou « Exercices : ».

### 20. État au 27 octobre 2026 et points ouverts

- **Cours en ligne** : Terminale, chapitres 1 à 10, de `chap01_suites.pdf` à `chap10_lgn.pdf`, dans
  `documents/cours/terminale/`, soit 7,7 Mo.
- **Feuilles en ligne** : `f-t-01` à `f-t-10`, soit 407 exercices transcrits (33, 42, 45, 38, 40, 50,
  38, 36, 42, 43). Les PDF sont dans `documents/exercices/terminale/` (6,7 Mo) et les 143 figures dans
  `documents/figures/` (4,0 Mo).
- **Déclaré, non déposé** : `m-homologie` (Master).
- **Niveaux sans cours** : Seconde, Première, Maths approfondies (MPSI), ECG. Le programme officiel
  MPSI-MP2I est un fichier du projet Claude (`programme-mpsi-mp2i_mathematiques.pdf`).
- **Maths expertes** (27 oct. 2026) : chapitres 1 à 9 (`me-01` à `me-09`), PDF dans
  `documents/cours/expertes/` (4,4 Mo), sans feuilles d'exercices pour l'instant. Niveau `expertes`
  (« Maths expertes »), rangé après `terminale` dans `niveaux`.
- Le dépôt ne contient aucune source `.tex`. Les cours et les feuilles arrivent de l'auteur, en `.tex`
  et en PDF, à chaque session.

**Points ouverts.**
- Les 80 avertissements KaTeX de la construction (« No character metrics » pour «, » et €) viennent
  des feuilles d'exercices, où des guillemets ou le symbole euro sont placés dans `\text{…}` à
  l'intérieur d'une formule (au moins `f-t-02`, `f-t-05` et `f-t-10`). Ils ne bloquent rien. Il faut
  les corriger dans `tex2exos.py`, en sortant ces signes de la formule, puis dans les feuilles déjà
  versées.
- Le cours `m-homologie` attend son PDF.
- L'édifice n'a aucun nœud pour les graphes (matrice d'adjacence) ni pour les chaînes de Markov :
  `me-06` et `me-09` se rattachent à des nœuds voisins (matrices, espaces probabilisés). Le dossier
  `contenu/` appartient désormais à la conversation Édifice : un nœud manquant se demande à l'auteur.

### 21. Déposer un cours

1. Placer le PDF dans `documents/cours/<niveau>/chapNN_<sujet>.pdf`, en minuscules, sans accent, avec
   un numéro sur deux chiffres.
2. Dans `rubriques/cours.yaml`, compléter ou créer l'entrée : `id` (par exemple `t-11`, `m-…` pour le
   Master), `niveau`, `chapitre`, `titre`, `resume` (en prose, rédigé à partir de la lecture du cours
   et non d'après le titre), `sommaire` (sections réelles du PDF), `theories` (nœuds de l'édifice
   effectivement mobilisés), `notions` (termes du lexique), `exercices` (identifiant de la feuille),
   `liens` (identifiants d'autres cours : chapitres liés, affichés dans les deux sens, y compris
   d'un niveau à l'autre), `pdf`, `pages` (lu par `pdfinfo`), `statut: depose`. Préfixes : `t-`
   Terminale, `me-` Maths expertes, `m-` Master.
3. `construire.py` vérifie que les fichiers existent, que les renvois aux nœuds, aux termes et aux
   feuilles sont valides, que les identifiants sont uniques, que le niveau est déclaré, que chaque
   lien vise un autre cours existant et qu'un numéro de chapitre n'est pas pris deux fois dans un
   niveau. Le bandeau de la page Cours et la carte de l'accueil listent seuls les niveaux en ligne.
4. Les cours suivent la chronologie scolaire, et non celle de l'édifice. Un écart de statut (admis au
   lycée, démontré dans l'édifice) n'est pas une incohérence.

### 22. Verser une feuille d'exercices

1. Conversion :
   `python3 outils/tex2exos.py ENONCE.tex CORRIGE.tex ENONCE.pdf CORRIGE.pdf f-<niv>-NN <niv>-NN > rubriques/exercices/f-<niv>-NN.yaml`.
   L'outil a besoin de `pdflatex`, `pdftocairo`, `pdfinfo` et `pdftotext`, tous présents dans
   l'environnement de travail. Les figures TikZ sont compilées en SVG dans `documents/figures/`.
2. Métadonnées : `outils/meta_<niv>_NN.py`, fondé sur `meta_commun.py`, propose les étoiles, les types,
   les mots-clés, les nœuds et les notions. Ces propositions sont à relire exercice par exercice. Les
   mots-clés sont cherchés dans l'énoncé seul.
3. Déclarer la feuille dans `rubriques/exercices.yaml` (`pdf_enonce`, `pdf_corrige`, `cours`,
   `statut: depose`) et relier le cours par son champ `exercices`.
4. Contrôle : vérifier les calculs des corrigés avec Python (sympy, numpy) sur un échantillon au moins,
   et regarder les figures rendues sur le site, en clair et en sombre.
