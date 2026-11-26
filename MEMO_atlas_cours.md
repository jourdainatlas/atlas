# Mémo ATLAS — complément : rubriques Cours et Exercices

> Complète `MEMO_atlas.md` (sections 0 à 16, dont la section 0 sur le travail en parallèle) et se lit
> avec lui. Sections réservées à ce mémo : 19 à 22 (17-18 : Annales ; 23 et suivantes : Édifice). Une
> section nouvelle prend le numéro suivant le plus grand employé, tous mémos confondus. Les
> conventions de rédaction des cours et des feuilles sont dans les documents du projet Claude
> `MEMO_conventions_cours.md`, `CONVENTIONS_Exercices.md` et `PREAMBULE_TYPE.tex`, qui ne sont pas
> dans le dépôt.

### 19. Domaine de la conversation « Cours » (27 oct. 2026)

**Rôle (consigne de l'auteur, 27 oct. 2026).** Cette conversation transfère les documents vers le site :
dépôt des PDF, fiches de `cours.yaml`, conversion et versement des feuilles d'exercices, aménagement
de la rubrique. Elle ne relit pas et ne corrige pas le contenu mathématique des cours et des
exercices, ni leurs épigraphes : ces corrections se font ailleurs. Les résumés et les sommaires des
fiches restent rédigés d'après le PDF, pour décrire fidèlement ce qu'il contient.

La conversation Cours n'écrit que dans son domaine, tel que le définit `MEMO_atlas.md` (section 0,
point 1) : `rubriques/cours.yaml`, `rubriques/exercices.yaml`, `rubriques/exercices/`,
`documents/cours/`, `documents/exercices/`, `documents/figures/`, `outils/tex2exos.py`,
`outils/meta_*.py` et le présent mémo. Dans les fichiers communs, elle ne touche qu'à ce qui lui
appartient, par remplacements locaux après `git fetch` et `git rebase` sur `origin/main` :
- dans `gabarit.html`, les fonctions `pageCours`, `coursLies`, `pageChapitre`, `chargerExercices`, `enLigneExos`,
  `pageExercices`, `vueFeuilles`, `bilanNiveauExos`, `vueNiveauxExos`, `filtrerExercices`, `vueExercices`, `carteExercice`, et dans
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
- **Master, théorie de Galois** (31 oct. 2026) : le niveau `master` est recréé (dernier de `niveaux`). Cours
  `m-galois` (64 pages, 7 chapitres, PDF `documents/cours/master/galois.pdf`) et feuille `f-m-galois`
  (55 exercices sur 4 niveaux d'étoiles, `\etoilesv` = 4 ; préfixe `m-galois`, métadonnées
  `outils/meta_m_galois.py` ; PDF dans `documents/exercices/master/`). Les sept blocs « Questions de
  cours » (`\qdc`, un par chapitre, avec leurs réponses dans le corrigé) ne sont pas des exercices
  numérotés : ils restent dans les PDF et ne sont pas sur le site, par choix de l'auteur (31 oct. 2026).
- **Niveau Master retiré** (27 oct. 2026, demande de l'auteur) : le niveau `master`, la fiche prototype
  `m-homologie` et la feuille annoncée `f-m-galois` sont supprimés, faute de cours prêt. Le même jour, les
  bandeaux « En construction » des pages Cours et Exercices et les badges du menu pour ces deux
  rubriques sont retirés (la fonction `enLigneExos` de `gabarit.html`, qui ne servait qu'au bandeau, aussi).
- **Seconde** (27 oct. 2026) : chapitres 1 à 11 (`s-01` à `s-11`), PDF dans `documents/cours/seconde/`
  (7,0 Mo). Le site compte 38 chapitres déposés. Feuilles `f-s-01` à `f-s-11` (42, 35, 30, 33, 30, 32,
  29, 31, 33, 33, 34 exercices), soit 362 exercices ; PDF dans `documents/exercices/seconde/` (5,1 Mo),
  166 figures ajoutées (519 au total). Le site compte 1 343 exercices. Les PDF, d'abord compilés ici à partir
  des `.tex`, ont été remplacés le jour même par ceux de l'auteur : texte et pagination identiques, la
  reconversion n'a rien changé aux champs `page_enonce` et `page_corrige`. Si l'on doit compiler
  soi-même une feuille, l'environnement de travail n'a
  pas, d'origine, `babel-french`, `lmodern`, `tkz-tab` ni `diagbox` : `apt-get install
  texlive-lang-french lmodern texlive-latex-extra texlive-pictures texlive-fonts-recommended
  texlive-science`.
- **Maths approfondies** (27 oct. 2026) : option de Terminale donnée par l'auteur, préparation à l'entrée
  en CPGE scientifique (« Initiation au programme de MPSI »), partie Algèbre. Niveau `approfondies`
  (« Maths approfondies »), rangé après `expertes`. Chapitres 1 à 9 (`ap-01` à `ap-09` : ensembles et
  logique, applications, groupes, morphismes, structures algébriques, espaces vectoriels,
  endomorphismes, dimension finie, matrices), PDF de l'auteur dans `documents/cours/approfondies/`
  (3,2 Mo). Le site compte 47 chapitres en ligne. Les feuilles d'exercices suivront (`f-ap-NN`, préfixe
  `ap-NN`). Pour éviter deux niveaux de même nom, le niveau vide `ma`, réservé aux cours de classe
  préparatoire, s'intitule désormais « MPSI ».
  Feuilles `f-ap-01` à `f-ap-09` (27 oct. 2026) : 30, 25, 22, 20, 22, 21, 22, 22, 25 exercices, soit 209 ;
  PDF de l'auteur dans `documents/exercices/approfondies/` (3,9 Mo), 23 figures ajoutées (545 au total),
  métadonnées `outils/meta_ap_01.py` à `meta_ap_09.py`. Le site compte 1562 exercices. Les avertissements
  KaTeX « No character metrics » passent à 205 : les guillemets de `\gui{…}` placés dans des `\text{…}`
  de formules encadrées (point ouvert ci-dessous).
- **Niveaux sans cours** : MPSI (`ma`), ECG. Le programme officiel
  MPSI-MP2I est un fichier du projet Claude (`programme-mpsi-mp2i_mathematiques.pdf`).
- **Première** (27 oct. 2026) : chapitres 1 à 8 (`p-01` à `p-08`), PDF dans `documents/cours/premiere/`
  (3,5 Mo). Le site compte 27 chapitres en ligne. Feuilles `f-p-01` à `f-p-08` (29, 30, 34, 36, 35,
  30, 35, 30 exercices) et la feuille complémentaire `f-p-sommes` (« Sommes de termes d'une suite
  arithmétique », 10 exercices, préfixe `p-sa`, sans numéro de chapitre, rattachée au cours `p-02`
  par son champ `cours` ; corrigé ajouté le 27 oct.), et `f-p-sommes-g` (« Sommes de termes d'une suite
  géométrique », 10 exercices, préfixe `p-sg`, même rattachement), soit 279 exercices ; PDF dans `documents/exercices/premiere/`
  (4,6 Mo), 151 figures ajoutées (353 au total). Le site compte 981 exercices.
- **Maths expertes** (27 oct. 2026) : chapitres 1 à 9 (`me-01` à `me-09`), PDF dans
  `documents/cours/expertes/` (4,4 Mo). Niveau `expertes` (« Maths expertes »), rangé après
  `terminale` dans `niveaux`. Feuilles `f-me-01` à `f-me-09`, soit 305 exercices (41, 37, 28, 37, 37,
  29, 42, 31, 23), PDF dans `documents/exercices/expertes/` (4,9 Mo), 59 figures ajoutées à
  `documents/figures/` (202 au total). Le site compte 712 exercices.
- Le dépôt ne contient aucune source `.tex`. Les cours et les feuilles arrivent de l'auteur, en `.tex`
  et en PDF, à chaque session.

- **Design v5 des feuilles** (29 oct. 2026) : l'auteur a refait le design de ses 49 feuilles et de
  leurs corrigés (archive `Exercices_MAJ.zip` : `.tex`, PDF, rapports de migration). Les énoncés sont
  inchangés hormis les noms de couleurs (palette `cdesign`, `cardoise`, `cocre`, `cpetrole`, fond
  `cfond`), les phrases qui nomment une couleur et toutes les figures. Les 49 feuilles ont été
  reconverties : textes, figures et pages tirés des nouvelles sources, **métadonnées conservées**
  (types, mots-clés, nœuds, notions, titres, sources : fusion par exercice, script hors dépôt). Les 98
  PDF sont remplacés ; 540 figures SVG régénérées, les 540 anciennes supprimées, les 5 images PNG
  (`f-me-06` ex. 14 et 17, `f-p-02` ex. 7, 8 et 30) inchangées. Les PDF fournis des énoncés `f-me-06` et
  `f-p-02` montraient un cadre vide à la place de ces images : ils ont été recompilés ici depuis les
  `.tex` v5 avec les PNG du site (9 pages au lieu de 8, la dernière courte). Trois titres de `f-t-01`
  (ex. 10, 11, 31), passés dans le corps en gras, restent des titres d'exercice, la ligne en gras étant
  retirée de l'énoncé. Le tableau de `p-06-09` (corrigé) passe d'array KaTeX à tableau HTML.
  Point signalé à l'auteur : dans le corrigé `f-me-03`, `\Id` vaut désormais `\mathrm{Id}` (préambule
  v5) là où l'ancien PDF imprimait $I_{2}$ ; le site reproduit le nouveau PDF.

**Points ouverts.**
- Les avertissements KaTeX de la construction (« No character metrics » pour «, » et €), 98 depuis
  l'ajout des feuilles de Maths expertes, viennent des feuilles d'exercices, où des guillemets ou le
  symbole euro sont placés dans `\text{…}` à l'intérieur d'une formule. Ils ne bloquent rien. Il faut
  les corriger dans `tex2exos.py`, en sortant ces signes de la formule, puis dans les feuilles déjà
  versées.
- Les deux défauts de `tex2exos.py` corrigés le 27 octobre (premier mot perdu dans un `\emph{…}`,
  couleurs restées noires) sont réglés pour la Terminale aussi : ses feuilles ont été reconverties le
  29 octobre à partir des sources v5.
- L'édifice n'a aucun nœud pour les graphes (matrice d'adjacence) ni pour les chaînes de Markov :
  `me-06` et `me-09` se rattachent à des nœuds voisins (matrices, espaces probabilisés). Le dossier
  `contenu/` appartient désormais à la conversation Édifice : un nœud manquant se demande à l'auteur.

**Page Exercices (27 oct. 2026).** Trois onglets : « Par exercice » (recherche et filtres), « Par
feuille » (cartes rangées sous un titre par niveau, dans l'ordre de `niveaux` de `cours.yaml`) et
« Par niveau », demandé par l'auteur pour que les élèves n'aient pas à fouiller toutes les feuilles. Ce
dernier montre une carte par niveau qui a des feuilles en ligne (nombre de feuilles et d'exercices,
répartition des difficultés), les autres niveaux étant cités en une ligne ; une carte ouvre
`#exercices/niveau/<id>`, qui liste les feuilles du niveau et propose « Chercher parmi ces N
exercices », c'est-à-dire la vue « Par exercice » filtrée sur ce niveau. Le bouton Partager donne
`…/#exercices/niveau/<id>` (pas de page de partage dédiée).

### 21. Déposer un cours

1. Placer le PDF dans `documents/cours/<niveau>/chapNN_<sujet>.pdf`, en minuscules, sans accent, avec
   un numéro sur deux chiffres.
2. Dans `rubriques/cours.yaml`, compléter ou créer l'entrée : `id` (par exemple `t-11`), `niveau`, `chapitre`, `titre`, `resume` (en prose, rédigé à partir de la lecture du cours
   et non d'après le titre), `sommaire` (sections réelles du PDF), `theories` (nœuds de l'édifice
   effectivement mobilisés), `notions` (termes du lexique), `exercices` (identifiant de la feuille),
   `liens` (identifiants d'autres cours : chapitres liés, affichés dans les deux sens, y compris
   d'un niveau à l'autre), `pdf`, `pages` (lu par `pdfinfo`), `sommaire_pages` (page de début de chaque partie, calculée par
   `python3 outils/pages_sommaire.py --ecrire <id>` ; relire les lignes signalées « ~ »), `statut: depose`. Préfixes : `s-` Seconde, `p-`
   Première, `t-` Terminale, `me-` Maths expertes, `ap-` Maths approfondies, `ma-` Maths Sup – MPSI
   (niveau `ma`, PDF dans `documents/cours/ma/`), `m-` Master.
3. `construire.py` vérifie que les fichiers existent, que les renvois aux nœuds, aux termes et aux
   feuilles sont valides, que les identifiants sont uniques, que le niveau est déclaré, que chaque
   lien vise un autre cours existant et qu'un numéro de chapitre n'est pas pris deux fois dans un
   niveau. Le bandeau de la page Cours et la carte de l'accueil listent seuls les niveaux en ligne.
4. Les cours suivent la chronologie scolaire, et non celle de l'édifice. Un écart de statut (admis au
   lycée, démontré dans l'édifice) n'est pas une incohérence.
5. **Image d'aperçu de la page (règle du point 9 de `MEMO_atlas.md` §0, rappelée le 26 nov. 2026).** Avant de valider,
lire la dernière ligne « Images d'aperçu par page » de `sh construire.sh`. Si elle porte « … à fabriquer » : installer
les polices hors du dépôt (`npm i @fontsource/spectral @fontsource/ibm-plex-sans @fontsource/gfs-didot` dans un dossier
du scratchpad), lancer `node identite/fabriquer-apercus-pages.mjs <ce dossier>` (seules les images manquantes ou
périmées sont refaites), relancer `sh construire.sh` (la ligne doit dire « N sur N »), regarder deux ou trois images de
`identite/apercus/` (titre lisible, pas de débordement, bon niveau dans la ligne de contexte) et joindre
`identite/apercus/` au commit du dépôt. Ne jamais pousser un dépôt qui laisse « à fabriquer » pour ses propres pages ;
si la ligne signale des pages d'autres domaines (activités, édifice, annales), ne pas les fabriquer et le signaler à
l'auteur. Vaut aussi pour tout ajout d'UE ou de niveau et tout changement de titre.

### 22. Verser une feuille d'exercices

1. Conversion :
   `python3 outils/tex2exos.py ENONCE.tex CORRIGE.tex ENONCE.pdf CORRIGE.pdf f-<niv>-NN <niv>-NN > rubriques/exercices/f-<niv>-NN.yaml`.
   L'outil a besoin de `pdflatex`, `pdftocairo`, `pdfinfo` et `pdftotext`, tous présents dans
   l'environnement de travail. Les figures TikZ sont compilées en SVG dans `documents/figures/`.
   Il lit deux formes d'en-tête : la macro `\exo{N : titre}{\etoiles}` et
   `\noindent\textbf{\underline{Exercice N : titre}}` suivi de `$\star…$` ou de `\etoilesv` (titres
   à formules lus par accolades appariées). Les commentaires `% Source : …` et `% Inspiré de : …`
   placés avant un exercice deviennent son champ `source` (« inspiré de … » dans le second cas).
   Les blocs `minipage` et `flushright` sont retirés, `\cline` est ignoré, les cellules
   `\textcolor{c}{$x$}` et `\textbf{… $x$ …}` sont converties, `\multicolumn{n}{…}{x}` devient `x`
   suivi de n−1 cellules vides.
   **Feuille sans corrigé** : « - » à la place de CORRIGE.tex et de CORRIGE.pdf ; on omet alors
   `pdf_corrige` dans `exercices.yaml`. Une feuille sans chapitre (complémentaire) se rattache à un cours
   par son champ `cours` : la page du chapitre l'affiche sous la feuille principale.
   **Étiquettes cerclées** : `\textcircled{…}` et la macro TikZ `\textcircledd{…}` des feuilles
   (avec `\eun`, `\edeux`, `\eunc`, `\edeuxc`) deviennent `\textcircled{…}` de KaTeX, en formule ou
   enveloppées de `$…$`, et non plus une figure par occurrence. Dans un tableau de texte, ①…⑳.
   **Couleurs** : les `\definecolor` de la source (`crouge` = #c61e2d, `cbleu`…) sont remplacées par leur
   code hexadécimal hors des figures. **Pseudo-code** : `$\leftarrow$` dans un `\texttt{…}` devient ←.
   Une étiquette cerclée dessinée en ligne, `\tikz[baseline=(n.base)]{\node[circle,…] (n) {$e_{1}$};}`
   (macro `\eq` des corrigés de Seconde), devient elle aussi `\textcircled{…}`. Dans les tableaux, les
   étais `\rule[…]{…}{…}` sont retirés, `\newline` devient une espace et `\diagbox{A}{B}` devient
   « A / B ».
   **Préambule v5** (oct. 2026) : le commentaire d'en-tête cite `\begin{document}` ; l'outil coupe au
   `\begin{document}` placé en début de ligne. Les `\renewcommand` du corps (commandes déjà définies par
   le préambule commun, `\cl`, `\Q`…) l'emportent sur la définition commune. Les en-têtes « EXERCICE N »
   en capitales sont reconnus pour les pages. Le choix entre tableau HTML et array KaTeX mesure les
   cellules avec l'ancien nom de fond (`cfond` lu comme `orange!50`). `\textcolor{#…}{$x$}` devient
   `$\textcolor{#…}{x}$`. Un nom de commande précédé d'une barre oblique (`\\F`, saut de ligne puis F)
   n'est pas développé. Les sorties de pdflatex sont lues avec `errors='replace'`.
   **Images** : un `\includegraphics{nom.png}` n'est pas dans les sources. On extrait les images du PDF
   de la feuille (`pdfimages -list` pour les repérer, puis `pdfimages -png`), on les range sous leur nom
   d'origine dans un dossier, et l'on passe ce dossier par `TEX2EXOS_IMAGES=dossier`. Le PNG est
   enveloppé dans un SVG de même taille que dans le PDF (96 ppp, option `scale=`). Exemple : les deux
   graphes de `f-me-06` (exercices 14 et 17).
2. Métadonnées : `outils/meta_<niv>_NN.py` (préfixe avec `_`, ainsi `meta_me_01.py` pour `me-01`), fondé
   sur `meta_commun.py`, propose les types, les mots-clés, les nœuds et les notions ; les étoiles
   viennent de l'en-tête. Ces propositions sont à relire. Les mots-clés sont cherchés dans l'énoncé
   seul. Le dictionnaire `EXTRA` de chaque fichier complète les exercices que les règles ne
   reconnaissent pas (numéro → mots-clés, nœuds, notions) : aucun exercice ne reste sans nœud.
3. Déclarer la feuille dans `rubriques/exercices.yaml` (`pdf_enonce`, `pdf_corrige`, `cours`,
   `statut: depose`) et relier le cours par son champ `exercices`.
   Puis `python3 outils/exercices_cours.py <feuille>` (« Dans le cours » des cartes, §57).
4. Contrôle de la conversion (et non du contenu, qui n'est pas relu ici, voir section 19) : aucun
   avertissement de l'outil (corrigé manquant, étoiles différentes, image introuvable), numéros
   consécutifs, pages trouvées, aucune commande LaTeX ni aucun jeton `@@…@@` hors des formules ou dans
   les blocs ```tableau, sources toutes retrouvées ; comparaison des mots de chaque énoncé et corrigé
   avec le texte du PDF dans les deux sens (seuls doivent manquer les en-têtes, les pieds de page, les
   césures et les étiquettes des figures) ; enfin regarder sur le site les tableaux, les figures et
   les images, en clair et en sombre, sur ordinateur et sur téléphone.
5. **Image d'aperçu de la page (règle du point 9 de `MEMO_atlas.md` §0, rappelée le 26 nov. 2026).** Avant de valider,
lire la dernière ligne « Images d'aperçu par page » de `sh construire.sh`. Si elle porte « … à fabriquer » : installer
les polices hors du dépôt (`npm i @fontsource/spectral @fontsource/ibm-plex-sans @fontsource/gfs-didot` dans un dossier
du scratchpad), lancer `node identite/fabriquer-apercus-pages.mjs <ce dossier>` (seules les images manquantes ou
périmées sont refaites), relancer `sh construire.sh` (la ligne doit dire « N sur N »), regarder deux ou trois images de
`identite/apercus/` (titre lisible, pas de débordement, bon niveau dans la ligne de contexte) et joindre
`identite/apercus/` au commit du dépôt. Ne jamais pousser un dépôt qui laisse « à fabriquer » pour ses propres pages ;
si la ligne signale des pages d'autres domaines (activités, édifice, annales), ne pas les fabriquer et le signaler à
l'auteur. Vaut aussi pour tout ajout d'UE ou de niveau et tout changement de titre.

### 23. Page d'un cours : colonne de droite et raccourci sur téléphone (31 oct. 2026)

Sur ordinateur, `.cote` (sommaire, Dans l'atlas, chapitres liés, exercices, fichiers) est collante
(`top: 16px`) et a son propre défilement (`max-height: calc(100dvh - 104px); overflow-y: auto;
overscroll-behavior: contain`) : on atteint le bas de la colonne sans faire défiler le PDF. Le
`.lecteur` passe de `overflow: hidden` à `overflow: clip`, sans quoi l'élément collant du téléphone
ne colle pas.

Sur téléphone (≤ 860 px), la colonne reprend sa place sous le PDF, sans hauteur maximale.
`pageChapitre` ajoute dans le lecteur un `.lecteur-raccourci` (bouton « Sommaire et liens ↓ »,
`data-vers-cote`), collant en bas à droite du visualiseur avec une hauteur nulle, donc sans masquer
la lecture hors de son coin. En tête de la colonne, `.cote-retour` (« ↑ Revenir au PDF »,
`data-vers-lecteur`) ramène à la position mémorisée dans `posLecture` (remise à zéro à chaque
`pageChapitre`). Les deux sont gérés dans l'écouteur de clic de `#rubrique`. Pour tester sans pdf.js
(qui ne dessine pas en mode sans tête), on remplace `.lecteur-pages` par de fausses pages de 900 px.

Même dispositif dans la banque d'exercices (`vueExercices`, 31 oct. 2026). Sur ordinateur, `.filtres`
est collante avec son propre défilement (même `max-height`). Sur téléphone, les filtres restent
au-dessus de la liste. La liste s'appelle désormais `.resultats` et se termine par un
`.lecteur-raccourci` (« Rechercher et filtrer ↑ », `data-vers-filtres`), et les filtres commencent par un
`.cote-retour` (« ↓ Aller aux exercices », `data-vers-resultats`). Le retour rend la position mémorisée
dans `posExo` seulement si la recherche n'a pas changé entre-temps (`signatureExo()`). Sinon, il va en
tête des résultats.

### 24. Maths Sup – MPSI (1er nov. 2026)

Niveau `ma`, intitulé « Maths Sup – MPSI ». Sept chapitres déposés (`ma-01` à `ma-07` : logique et
ensembles, applications et relations, calcul algébrique, complexes et trigonométrie, fonctions
usuelles, primitives et équations différentielles, réels et suites), avec leurs feuilles `f-ma-01`
à `f-ma-07` (354 exercices, versées le 1er novembre ; PDF dans `documents/exercices/ma/`).
Les métadonnées des feuilles MPSI passent par `outils/meta_ma_commun.py`. Chaque `meta_ma_0N.py` y
déclare des règles par motif, `R`, et des règles par partie de la feuille, `PARTIES` (intervalle de
numéros → mot-clé, nœuds, notions). Il déclare aussi `FOND` : les nœuds donnés aux exercices de synthèse
qu'aucune règle n'atteint. `tex2exos.py` ôte désormais les séparateurs `@{…}` des préambules d'`array`,
que KaTeX refuse. Les résumés
ont été rédigés d'après les énoncés numérotés et les bilans des .tex. Le sommaire
reprend les titres longs des `\section`, introduction historique et bilan compris. Nouveauté annoncée
le 1er novembre.

Le 2 novembre : chapitres 1 à 7 mis à jour par l'auteur. Les ajouts sont des encadrés « Méthode », et les
sections et énoncés numérotés n'ont pas changé, si bien que les résumés restent valables. Les PDF ont été
remplacés et les pages du sommaire recalculées. Les chapitres 8 (limites et continuité), 9 (dérivabilité et
convexité) et 10 (analyse asymptotique et développements limités) ont été déposés sans feuille d'exercices
pour l'instant. Le soir même, leurs feuilles `f-ma-08` à `f-ma-10` (158 exercices) ont été versées. Pour cela,
`tex2exos.py` a reçu trois ajouts. Il lit `\providecommand` (l'exponentielle `\ee`), sauf si la commande est
déjà définie. Il ôte `\texorpdfstring{A}{B}` des titres de partie, en gardant A. Il convertit l'environnement
`redaction` (raisonnement d'élève à analyser) en paragraphe cité `> …`, que `rendu.mjs` rend en
`<blockquote class="redaction">` (filet à gauche, gabarit).

Le 4 novembre : chapitres 11 (structures algébriques usuelles), 12 (arithmétique dans $\mathbb{Z}$), 13 (polynômes
et fractions rationnelles) et 14 (espaces vectoriels et applications linéaires) déposés avec leurs feuilles
`f-ma-11` à `f-ma-14` (55, 63, 68 et 82 exercices, soit 268), métadonnées dans `outils/meta_ma_11.py` à
`meta_ma_14.py`. Aucun ajout au convertisseur n'a été nécessaire. Le sommaire de `ma-14` calculé par
`pages_sommaire.py` donnait la page 1 (page de titre) pour la première section : corrigé à la main en 2.
Les avertissements KaTeX « No character metrics » (« », € dans `\text`) viennent de feuilles plus anciennes
et sont sans effet sur le rendu.

### 25. Sommaire cliquable (1er nov. 2026)

Chaque partie du sommaire d'un cours mène à sa page dans le visualiseur (bouton `.vers-page`,
`data-pdf-page`, avec le numéro de page en petit). La page de début de chaque partie est stockée dans
`sommaire_pages` (cours.yaml), un entier par partie, croissant, au plus `pages`, ce que vérifie
`construire.py` (avertissement si un cours déposé a un sommaire sans pages). Les PDF n'ayant pas de
signets, `outils/pages_sommaire.py` cherche chaque titre dans `pdftotext -layout`. La comparaison ignore
les lettres f, i, l, parce que pdftotext perd les ligatures (« coecients »), et joint les titres sur deux
lignes. À défaut, elle accepte un titre de section que le titre du sommaire prolonge, puis le titre
numéroté le plus proche. Ces cas sont signalés « ~ » et doivent être relus. Les 55 cours ont été remplis
le 1er novembre et contrôlés contre les titres de section numérotés. Côté page, `allerPage(n)` fait défiler
jusqu'au canevas `n` ; si pdf.js ne l'a pas encore dessiné, `pageVoulue` est servie dès qu'il l'est.

### 26. Banque d'exercices : filtres à facettes et recherche par numéro (1er nov. 2026)

Dans `vueExercices`, chaque filtre ne propose que les valeurs présentes parmi les exercices que retiennent
les autres filtres (`filtrerExercices(tous, sauf)`), avec leur nombre. Une feuille choisie restreint
donc les thèmes, les types, les difficultés (boutons grisés à zéro), les notions de l'atlas et les niveaux à
ceux de la feuille. Les thèmes sont comptés sur les exercices affichés, et une valeur cochée reste
visible. « N exercices sur M » compte désormais M dans la feuille, ou l'exercice, en cours. Dans le
champ de recherche, un nombre seul désigne le numéro de l'exercice dans sa feuille (`motsRecherche` :
« exercice 6 », « exo 6 », « n° 6 », « 6 »). Les mots de niveau (`NIVEAUX_TAPES` : seconde, 2nde,
première, 1re, terminale, tle, expertes, approfondies, mpsi, sup, prépa, ecg, master) filtrent par niveau. Dans
ce cas, « maths », « spé » et « option » sont ignorés. « chapitre N », « chap N » ou « ch N » filtre par
chapitre. Ainsi « exercice 6 MPSI » ou « MPSI chap 7 ex 3 » s'écrivent sans toucher aux boutons, et les
deux voies se combinent. Les autres mots sont cherchés dans le texte de l'exercice et dans le titre
de sa feuille, c'est-à-dire du chapitre (« exercice 6 MPSI logique », « complexes exo 6 »). Le nom du niveau et ses abréviations font aussi partie du texte cherché.
Chaque mot tapé doit commencer un mot de ce texte, ce qui permet les mots partiels : « maths expert » trouve
les Maths expertes avant la fin de la frappe, et « termin » trouve « terminale » mais pas « déterminer ».
Un mot de niveau complet reste un filtre strict. Dès qu'une
recherche ou un filtre est actif, un bouton corbeille « Effacer » (`.effacer-recherche-exo`, `data-reinit`)
apparaît à droite du titre Rechercher et remet tout à zéro.

### 27. Audit de l'étiquetage d'après l'édifice étendu (2 novembre 2026)

L'édifice est passé d'environ 320 à près de 1000 nœuds depuis le dépôt des premiers cours (26 octobre), et le
lexique de 257 à 574 termes. L'audit a comparé l'étiquetage des 58 cours et des 2129 exercices à l'édifice
actuel. Il a relevé quatre défauts.
1. **Nœuds d'un autre niveau.** L'exponentielle, le logarithme et la trigonométrie réels renvoyaient à
   l'analyse complexe (`cx-exponentielle`, `cx-pi`) ou à l'analyse des nombres (`nb-logarithme`).
   L'analyse réelle les construit désormais (`ar-exp` : `ex-*` ; `ar-trigo` : `tg-*`). Le produit
   scalaire du lycée renvoyait aux espaces de Hilbert (`f-hilbert`), et non à `me-produit-scalaire`.
   Le déterminant 2 × 2 renvoyait au déterminant d'un endomorphisme (`v-determinant`), et non à
   `v-det-matrice`.
2. **Graphes entiers au lieu de nœuds précis** : `ar-deriv`, `ar-suites`, `ar-riemann`, `continuite`,
   `z-polynomes`, devenus des graphes à nœuds `de-*`, `su-*`, `ri-*`, `c-*`, `pol-*`.
3. **Nœuds manquants** : chaînes de Markov (`mart-markov`) pour me-09, binôme (`pol-binome`).
4. **38 exercices sans aucun nœud** (Terminale surtout).

Outils. `outils/etiquetage.py` (`affiner`, `completer`, relecture `MANUELS`) applique ces règles. Les nœuds
complexes (`cx-*`) restent quand l'énoncé est en contexte complexe, et un graphe entier n'est remplacé que si
l'énoncé désigne un de ses nœuds. `outils/reetiqueter.py` réécrit les seules lignes `noeuds:` et `notions:`
des feuilles versées. `tex2exos.py` appelle `affiner` après `meta_<préfixe>.py`, de sorte qu'une
reconversion redonne le même étiquetage.

Bilan des exercices : 698 réétiquetés, aucun sans nœud. Les nœuds remplacés sont
`cx-exponentielle` (206 → 57, contexte complexe), `cx-pi` (145 → 51), `nb-logarithme`, `f-hilbert` et
`ar-riemann` (→ 0), `ar-deriv` (116 → 2), `v-determinant` (55 → 1). `ar-suites`, `continuite` et
`z-polynomes` restent là où l'énoncé ne désigne aucun nœud précis. Les notions nouvelles du lexique ont été
ajoutées par motif (cosinus et sinus, nombre e, fonction convexe, produit scalaire, chaîne de Markov,
mesure invariante…).

Cours : 30 entrées revues à la main dans `cours.yaml` (champ `theories`, notions complétées). Les graphes
`ar-exp`, `ar-trigo` et `met` remplacent `anc` et `nban` en Première et Terminale. Les cours de MPSI
reçoivent les nœuds `ex-*`, `tg-*`, `c-point`, `ex-convexite` et `pol-binome` ; Galois reçoit `pol-*`.

### 28. Index des exercices chargé à la demande (3 novembre 2026)

Mesure de l'auteur : les données des exercices pesaient 1,7 Mo sur les 3,7 Mo de `site/index.html`, dont
911 Ko pour le seul champ `recherche`, et elles ne servaient qu'à la rubrique Exercices. Le tableau
`rubriques.exercices.exercices` (2129 exercices, sans leurs textes) est désormais écrit par `rendu.mjs` dans
`site/exercices-index.json`. Son adresse, avec empreinte, est dans `R.exercices.indexACharger`. La page ne garde
que l'introduction, les types, les feuilles (avec `nombre` et `etoiles`), `nombre` (total) et `parNoeud`
(compte des exercices par nœud, pour le bouton « N exercices sur cette notion » des fiches).

Gabarit. `chargerExercices` demande l'index, puis les textes des feuilles (`exercices-textes/`). La vue « Par
exercice » affiche « Chargement des N exercices… » et se redessine dès l'arrivée de l'index ; les énoncés
suivent. En cas d'échec (hors ligne sans copie), elle affiche « Réessayer » (`data-recharger-exos`), sans
nouvelle tentative automatique. Les vues par feuille et par niveau, l'accueil, les cours, À propos et les
fiches de l'édifice n'ont besoin que des feuilles et de `parNoeud` (`nombreExosNoeud`, `exosEnLigne`).
L'aperçu `construction/atlas.html`, qui garde les exercices dans la page, fonctionne sans changement.

Poids, mesurés à la construction du 3 novembre :

| | Avant | Après |
|---|---|---|
| `site/index.html` | 3 841 595 octets (669 Ko compressé) | 2 156 950 octets (394 Ko compressé) |
| données des exercices dans la page | 1 716 843 octets | 40 803 octets |
| `site/exercices-index.json` | | 1 680 799 octets (276 Ko compressé) |

Vérifié avec un serveur local et Playwright :
- l'accueil (2129 exercices) ne demande pas l'index ;
- la fiche `ex-exponentielle` affiche 106 exercices, le cours `ma-03` affiche « Les 46 exercices en ligne », À propos affiche 2129 ;
- la recherche (« exercice 6 MPSI logique ») et les filtres (QCM : 29) fonctionnent, ainsi que les adresses `#exercices/ex/ma-08-18` et `#exercices/notion/ex-exponentielle` ouvertes directement ;
- application installée (service worker actif) : hors ligne, une feuille déjà visitée s'affiche ; une rubrique jamais visitée propose « Réessayer », qui fonctionne au retour du réseau.

### 29. Pages de lecture des cours et des exercices (3 novembre 2026)

Demande de l'auteur, dans le prolongement de `lecture.mjs` (MEMO_atlas_apropos.md §39 ; MEMO_atlas.md §13) : les
pages de partage `cours/` et `exercices/`, qui redirigeaient vers une ancre, sont remplacées par des pages
complètes, sans redirection, écrites par `lecture-cours.mjs` (fonction `pagesCoursExercices(ctxLecture)`, appelée par
`rendu.mjs`). L'enveloppe vient de `outilsLecture` : `page()`, `puce()`, `relier()`, le plan du site et `lecture.css`,
qui reçoit un petit bloc de mise en page propre (sommaire, extraits, précédent et suivant).
- `/cours/` : les niveaux (ancre `#<niveau>`) et leurs chapitres.
- `/cours/<id>/` : résumé, boutons PDF du cours, de la feuille et du corrigé, sommaire relié aux pages du PDF
  (`#page=`), théories de l'édifice (puces vers `/edifice/<id>/`), notions (lien vers la fiche qui les définit),
  chapitres liés dans les deux sens, chapitres précédent et suivant.
- `/exercices/` : les niveaux, puis leurs feuilles. `/exercices/feuille/<id>/` : les exercices partie par partie,
  avec étoiles et un extrait de l'énoncé.
- `/exercices/<id>/` : sur-titre (niveau, chapitre, feuille, partie), étoiles et types, énoncé composé, corrigé
  dans un `<details>` replié (dans la classe `exo` du site, pour en reprendre le style), source, PDF à la bonne
  page, nœuds de l'édifice, thèmes, notions, exercices précédent et suivant.

Textes des descriptions et des extraits : `texteSource` part du Markdown d'origine (`construction/donnees.json`,
car `rendu.mjs` compose en place et le rendu KaTeX, sans MathML, est illisible une fois réduit en texte). Les
formules y sont simplifiées par `texSimple` : `\frac{a}{b}` devient a/b, `\pi` devient π, etc.

Partage. `adressePartage` mène à `exercices/feuille/<id>/` pour une feuille ; les adresses `cours/<id>/` et
`exercices/<id>/` sont inchangées et ouvrent désormais ces pages. Le bandeau des pages de lecture renvoie à
`/cours/` et `/exercices/`.

Bilan au 3 novembre : 2249 pages (2129 exercices, 60 feuilles, 58 cours, 2 pages d'entrée). Le plan du site
compte 4005 adresses. Poids de `site/`, en taille réelle : environ 508 Mio avant, 637 Mio après. Les pages
d'exercices pèsent 132 Mio, soit 63 Ko en moyenne, en dessous du seuil de 800 Mo à signaler. Vérifications : les
93 394 liens internes des 3 829 pages de lecture mènent tous à une page ou à une ancre existante ; rendu
regardé en clair et en sombre, sur ordinateur et sur téléphone, sans débordement horizontal.

### 30. Projection en classe et espaces insécables (4 novembre 2026)

Projection (conversation « À propos – apparence », MEMO_atlas_apropos.md §49). `carteExercice` appelle `${pjBouton(e)}`
après le bouton « Signaler une erreur » : ne pas le retirer si l'on retouche l'en-tête des cartes. La projection découpe le
corrigé en étapes d'après ses blocs de premier niveau. Un paragraphe qui commence par une marque de question
(« 2. », « (b) », « b) ») ouvre une étape. Pour les feuilles à venir, trois règles :
- chaque question du corrigé commence un nouveau paragraphe portant son numéro, comme le produit tex2exos ;
- ne jamais envelopper tout le corrigé dans un seul bloc ;
- ne pas commencer par un numéro un paragraphe qui n'ouvre pas une question.

Typographie. `tex2exos.typographie` met une espace insécable (U+00A0) avant « : », une espace fine insécable (U+202F)
avant « ; », « ? », « ! » et à l'intérieur des guillemets. Elle s'applique au texte converti, mais pas aux formules,
au code en ligne ni aux blocs de code ; les tableaux sont traités comme du texte. Une formule suivie de « : » compte comme
un mot, et l'indentation n'est jamais touchée. `outils/typographier.py` a appliqué la même règle aux 60 feuilles
versées, sur 3 550 champs (énoncés, corrigés, titres, sources). Il ne reste aucune espace ordinaire devant ces signes
hors des formules, contre environ 15 500 auparavant. Sur 40 exercices tirés au hasard, affichés à 360 px de
large, aucun des 402 signes ne commence une ligne.

### 31. Symboles des chapitres de la page Cours (confiés le 4 nov. 2026)

Le bloc « Cours : symbole et ligne de couleur des chapitres » de `gabarit.html` (décrit au §50 de
`MEMO_atlas_apropos.md`) appartient au domaine apparence, sauf ses deux tables, qui reviennent à la conversation
Cours : `SYM_DESSINS` (nom → contenu SVG) et `SYM_CHAPITRES` (id du chapitre → nom du dessin). La feuille de style,
`bandeChapitre`, `symboleChapitre` et les appels dans la ligne qui écrit chaque `<li>` de `ol.chapitres` ne se
touchent pas. Toujours `git fetch` puis `git rebase origin/main` avant de modifier `gabarit.html`.
Les couleurs se calculent seules d'après le champ `theories` du chapitre, qui doit donc rester juste.

**À chaque dépôt de chapitre, sans attendre qu'on le demande :**

- *Réutiliser d'abord.* Un même sujet garde le même symbole d'un niveau à l'autre, par exemple `tangente`
  (dérivation), `cercle` (trigonométrie), `matrice`, `venn`, `aire`, `convergence`, `blocs` (divisibilité),
  `table` (structures algébriques), `vecteurs`.
- *Sinon, dessiner* un dessin nouveau, nommé d'après son sujet, qui montre l'idée centrale du chapitre et non son titre.
- *Faire valider avant de publier.* Montrer à l'auteur une planche, avec le symbole à environ 72 px en clair et en
  sombre à côté de ses voisins du même niveau, et un aperçu en place sur la page Cours. On ne publie qu'après son accord.
- *Annoncer* : l'entrée Nouveautés reste due comme d'habitude.

Quand l'auteur demande de changer un symbole, on propose une ou deux variantes sur une planche, en clair et en
sombre, puis on remplace le dessin choisi. Si le dessin sert à plusieurs chapitres, on demande d'abord s'il faut
les changer tous ou créer un dessin à part.

**Règles de dessin.**

- *Cadre.* `viewBox 0 0 24 24`, et rien ne dépasse le bord de plus d'1 px.
- *Couleurs.* Aucune couleur écrite en dur, seulement des classes : `f1` (aplat plein), `f2` (moyen), `f3` (pâle),
  `t` (trait fin : axes, pointillés avec `stroke-dasharray`), `t3` (trait épais : courbe ou vecteur principal).
- *Style.* Des formes simples et pleines, deux ou trois éléments au plus. Pas de texte ni de chiffre, sauf un signe
  mathématique qui est le sujet même (le Σ du calcul algébrique). Jamais d'étoile ⋆, réservée à l'axiome du choix.
- *Lisibilité.* Le symbole doit se lire à 40 px, sa taille sur la page, en clair comme en sombre.
- *Justesse.* La figure est mathématiquement exacte : une corde relie deux points de la courbe, une tangente la
  touche, les racines sont sur l'axe. Les coordonnées se calculent, elles ne s'estiment pas.

Ne jamais changer l'`id` d'un chapitre existant : il perdrait son symbole tant que `SYM_CHAPITRES` ne suit pas.

État au 4 novembre : les 62 chapitres déposés ont tous un symbole, y compris `ma-11` à `ma-14` (`table`, `blocs`,
`racines`, `vecteurs`), attribués par la conversation apparence.

Le 4 novembre au soir, à la demande de l'auteur, trois symboles ont été changés, après validation sur planche :
- `tangente` (`p-04`, `ma-05`) est redessiné. La courbe est une bosse en arc de parabole exact, avec la tangente
  au flanc droit, calculée par la dérivée. S'y ajoutent l'axe et le pointillé jusqu'à l'abscisse du point.
- `i2` (« i² = −1 », glyphes en formes pleines, i à tige arrondie) remplace `planComplexe` pour `me-02`.
- `loi` (deux éléments qui se composent en un troisième) remplace `table` pour `ma-11` et `ap-05`.
Les dessins `planComplexe` et `table` restent dans `SYM_DESSINS`, sans chapitre pour l'instant.
Les scripts de planche sont à refaire dans chaque session : on injecte les dessins dans la page `#cours`
servie localement, pour que les variables de couleur `--c-…` s'y résolvent.

### 32. Résumés des cours : pas d'introduction historique (5 nov. 2026)

À la demande de l'auteur, le résumé d'un chapitre (`resume` dans `rubriques/cours.yaml`) ne mentionne plus
l'introduction historique, ni son contenu (personnages, dates, anecdotes, figure d'ouverture). Il décrit seulement
ce que le chapitre définit, démontre et étudie. Les 48 résumés qui la mentionnaient ont été repris le 5 novembre :
la phrase ou les phrases sur l'introduction ont été retirées, et les phrases suivantes qui en dépendaient ont été
réécrites (`ma-04`, `ma-07`, `ma-09`, `ma-10`). **Règle pour tout chapitre futur** : ne jamais rédiger de phrase
sur l'introduction historique dans le résumé, même si le .tex en a une. Le sommaire, lui, garde la section
« Introduction historique » quand le PDF l'a, puisqu'il renvoie aux pages du PDF.

### 33. Termes des cours dans la recherche globale (5 nov. 2026)

Depuis le 5 novembre, `outils/cours_termes.py` (domaine apparence, §51 de `MEMO_atlas_apropos.md`), lancé par
`construire.sh`, relève le texte en rouge des PDF de `documents/cours/`, page par page. Ces termes paraissent dans
la recherche de l'en-tête, sous « Définis dans les cours », avec un lien vers la page de la définition. Le résultat
est gardé dans `outils/cours-termes.json`, avec l'empreinte de chaque PDF : seuls les PDF nouveaux ou modifiés
sont relus.

**Au dépôt ou au remplacement d'un PDF de cours :**
- lancer `sh construire.sh` avec `pdfplumber` installé (il est dans `requirements.txt`) ; la ligne
  « cours_termes : … PDF relus » confirme la lecture ;
- joindre `outils/cours-termes.json` au commit du PDF, sinon la publication relit ce PDF à chaque fois ;
- vérifier que le champ `pdf` du chapitre dans `rubriques/cours.yaml` pointe vers le fichier, car c'est lui qui
  relie les termes au chapitre.

**Convention des sources.** Dans un cours, seul le terme défini s'écrit en rouge. Un mot mis en rouge pour
insister devient un faux terme (cas observés : « coupent », « parmi »). Les formules en rouge sont ignorées.
Si l'auteur signale un faux terme, on l'ajoute à `outils/cours-termes-exclus.txt`, une ligne par terme. Le mieux
reste de corriger le rouge dans la source LaTeX, ce qui relève de l'auteur, puisque cette conversation ne corrige
pas les cours. Le programme, le passage de `rendu.mjs` qui écrit `site/cours-termes.json` et le code de la
recherche dans `gabarit.html` ne se modifient pas ici.

### 34. « À revoir avant » : `rubriques/cours-prerequis.yaml` (9 nov. 2026)

La carte « À revoir avant » de la page d'un chapitre (domaine apparence, §61 de `MEMO_atlas_apropos.md`) lit
`rubriques/cours-prerequis.yaml`, dont la seule clé `a_revoir` associe à un id de chapitre une liste de trois ids
au plus (`t-05: [p-08, p-04]`). Ce fichier est du domaine Cours, il fait foi et se corrige à la main.

**Règle de l'auteur**, vérifiée par `construire.py` (un renvoi fautif bloque la publication) : on ne renvoie qu'au
niveau scolaire juste en dessous. La Première renvoie à la Seconde. La Terminale, les Maths expertes et les Maths
approfondies renvoient à la Première. La Maths Sup renvoie à la Terminale, aux expertes et aux approfondies. Le
Master renvoie à la Maths Sup. On ne renvoie jamais au même niveau ni à un niveau supérieur, et la Seconde n'a
pas de renvoi. Pour un niveau nouveau (Maths Spé, qui renverra à la Maths Sup), il faut ajouter sa ligne à la table
`PRECEDENT` de `construire.py` et à celle de `outils/cours_prerequis.py`. Ces deux fichiers sont du domaine
apparence : il faut le signaler à l'auteur.

**Au dépôt d'un chapitre**, on ajoute son entrée dans le même travail. Le critère est pédagogique : ce que l'élève
doit avoir en tête avant de commencer, et non tout ce dont le chapitre dépend dans l'édifice. Pour une proposition
de départ, lancer `python3 outils/cours_prerequis.py` après `sh construire.sh`. Le programme refuse d'écraser le
fichier, et `--forcer` recalcule tout : on écrit donc dans un fichier temporaire, ou on ne reprend que l'entrée du
nouveau chapitre. Quand l'auteur signale un défaut, on corrige directement la liste du chapitre.
État au 9 novembre : 42 entrées. Les chapitres de Seconde n'en ont pas, et `p-06`, `me-01`, `me-04`, `me-07`
et `ap-01` à `ap-05` n'en ont pas non plus.

### 35. MPSI : feuilles 12 à 14 mises à jour, chapitre 15 déposé (9 nov. 2026)

Les feuilles `f-ma-12`, `f-ma-13` et `f-ma-14` ont reçu de nouveaux exercices : elles en comptent maintenant 67,
72 et 85. Les nouveaux s'insèrent parmi les exercices de synthèse, ce qui décale les numéros suivants, et donc les
identifiants `ma-1N-NN` de ces exercices. Les `EXTRA` de `meta_ma_12.py` et `meta_ma_13.py` ont été renumérotés
en conséquence. Pour retrouver ce qui a changé, on compare les énoncés de l'ancienne et de la nouvelle conversion :
à texte d'énoncé égal, c'est le même exercice.

Le chapitre 15, « Dimension finie et rang », est déposé avec son cours de 12 pages et la feuille `f-ma-15` de
60 exercices (`meta_ma_15.py`). Son entrée « À revoir avant » est `[ap-08, ap-06]`, et une nouveauté l'annonce.

`tex2exos.developper` ajoute désormais une espace après une macro à arguments dont le développement finit par une
commande, quand une lettre suit : `\ent{\frac{x}{T}}T` donnait `\rfloorT`, une erreur KaTeX.

Faux termes du chapitre 15 dans la recherche : les formules en rouge de son cours contiennent des `\text{…}`
(`base \iff libre \iff génératrice` au théorème 4, `injective \iff surjective \iff bijective` au théorème 10).
`cours_termes.py` les relève comme termes. On ne peut pas les exclure par la liste, qui est globale : « base »,
« libre » et « injective » sont de vrais termes dans d'autres chapitres. Le défaut est signalé à l'auteur.

### 36. MPSI : feuilles 1 à 11 enrichies, cours 2 retouché, chapitre 16 déposé (9 nov. 2026)

Les feuilles 1 à 11 ont reçu 38 exercices nouveaux, tous dans les exercices de synthèse : elles comptent maintenant
49, 48, 49, 64, 59, 55, 54, 57, 55, 56 et 59 exercices. Les exercices d'après sont renumérotés, et les identifiants
`ma-NN-KK` ont glissé d'autant. Méthode (script `maj.py` dans le scratchpad, à refaire au besoin) :
1. Convertir les nouvelles sources à part.
2. Apparier l'ancienne et la nouvelle conversion par texte d'énoncé (égalité, sinon ressemblance de plus de 0,8).
3. Renuméroter les clés `EXTRA` des `meta_ma_NN.py` d'après cet appariement, **avant** d'y ajouter de nouvelles
   clés : sinon la renumérotation les décale à leur tour, ce qui est arrivé pour `meta_ma_07`.
4. Reconvertir.
Pour les 565 exercices inchangés, l'étiquetage est resté le même, sauf `ma-05-42` et `ma-05-44`, qui avaient
perdu leurs nœuds (`de-derivee`, `de-operations`), rendus par `EXTRA`. Le cours 2 a changé d'une phrase : le PDF
est remplacé, et ses pages et son sommaire sont inchangés.

Le chapitre 16, « Matrices », est déposé avec son cours de 19 pages et la feuille `f-ma-16` de 71 exercices
(`meta_ma_16.py`). Ses termes rouges sont tous de vraies définitions. Son entrée « À revoir avant » est
`[ap-09, me-03]`. Pour le symbole, on propose de reprendre `matrice` (`me-03`, `ap-09`), à faire valider.

### 37. MPSI : chapitres 17 et 18 déposés (10 nov. 2026)

Le chapitre 17, « Groupe symétrique et déterminants » (16 pages), est déposé avec la feuille `f-ma-17`, qui compte
65 exercices. Le chapitre 18, « Intégration » (21 pages), l'est avec `f-ma-18`, qui en compte 56. Les métadonnées
sont dans `meta_ma_17.py` et `meta_ma_18.py`, et les entrées « À revoir avant » sont `[ap-09, ap-03]` et
`[t-06, t-05]`.

**Correction de `tex2exos.lire`.** Ces sources appellent par endroits `\par\needspace{…}\exoorig{N}{…}` ou
`\partieorig{…}` directement, au lieu de `\exo` ou `\partie`, pour réduire la réserve de place avant un exercice
court. Le convertisseur ne les voyait pas : la première conversion perdait l'énoncé 65 du chapitre 17, l'énoncé 37
et le corrigé 53 du chapitre 18, ainsi que la partie « Exercices de synthèse » du chapitre 18. Désormais, dans le
corps du document (après la ligne `\begin{document}`), ces appels sont ramenés à `\exo` et `\partie`. Les
définitions du préambule ne sont pas touchées. Aucune source des chapitres 1 à 16 n'emploie ces appels dans son corps.

**Paragraphe de notations perdu.** Depuis le chapitre 13, l'énoncé commence par un paragraphe « Dans toute la
feuille, … » qui fixe les notations. Le site n'a pas de place pour lui : il n'est pas repris sur les pages
d'exercices. Décision de l'auteur (10 nov.) : ce paragraphe ne va pas sur le site. Les notations sont celles
du cours, et le PDF de la feuille les rappelle. On le laisse donc de côté à la conversion, sans le signaler.
Symboles validés le 10 novembre : `permutation` (`ma-17`, trois éléments envoyés par le cycle (1 2 3)) et
`escalier` (`ma-18`, quatre marches sous un arc de parabole exact, chacune touchant la courbe à son extrémité gauche).

### 38. Publication par OVHcloud (10 nov. 2026)

Depuis le 10 novembre, www.atlasjourdain.fr est servi par l'hébergement OVHcloud, et non plus par GitHub Pages
(§64 de `MEMO_atlas_apropos.md`, et `MEMO_atlas.md`). Le travail ne change pas : construire, valider, pousser.
Le workflow « Publier ATLAS » a trois jobs :
- `construire` ;
- `publier`, la publication GitHub Pages gardée en secours ;
- `ovh`, la mise en ligne réelle. **C'est ce job qui doit réussir.**

Une publication n'annule plus la précédente : elle peut rester « queued » quelques minutes derrière celle d'une
autre conversation, et c'est normal. Pour suivre une publication, on attend la fin du run, puis on vérifie la
conclusion du job `ovh` avec `gh run view <id> --json jobs`, puis la page en ligne. La limite de 1 Go pour le site
tient tant que GitHub Pages reste en secours (le site construit fait environ 380 Mo au 10 nov.). On ne modifie pas
`outils/publier_ovh.py`, `identite/htaccess-ovh` ni le job `ovh` de `.github/workflows/publier.yml`, qui relèvent
du domaine apparence.

### 39. Partager un exercice ; revenir en arrière dans un corrigé (11 nov. 2026)

**Partager.** Chaque carte d'exercice a un bouton « Partager » (`partageExoBouton`, classe `.partage-exo`), placé
après le bouton de projection. Il copie l'adresse `https://www.atlasjourdain.fr/#exercices/feuille/<feuille>/<exercice>`,
ou ouvre la feuille de partage du système sur téléphone (`navigator.share` avec un pointeur tactile). Cette adresse
ouvre la page Exercices filtrée sur la feuille. `pageExercices` lit le troisième segment du chemin dans
`etatExo.cible` ; `vueExercices` montre assez de cartes pour inclure l'exercice ; `viserExercice` attend que la
carte et son énoncé soient affichés, descend jusqu'à elle, recommence 500 ms plus tard (KaTeX et figures), et
l'entoure 2,5 s (`.exo-vise`). Le lien « Exercice N » du titre garde son ancienne cible, `#exercices/ex/<id>`,
qui montre l'exercice seul.

**Corrigé question par question** (`corrMaj`, §63 de `MEMO_atlas_apropos.md`). La barre propose aussi
« Masquer la dernière réponse » dès que deux réponses sont visibles, et « Revenir à la première » dès qu'il y en
a trois. Elle reste affichée quand tout le corrigé est déroulé.

**Symboles sur les cartes de feuilles (11 nov. 2026).** Dans la rubrique Exercices, vues « Par niveau » et
« Par feuille », le titre de chaque carte de feuille (`vueFeuilles`) est précédé du symbole de son chapitre, à
32 px. On appelle `symboleChapitre(c)` du domaine apparence, sans le modifier, avec le cours `f.cours`. Une
feuille sans cours, ou dont le chapitre n'a pas de symbole, garde son titre seul.

**Liens partagés : redirection directe (11 nov. 2026).** Le bouton Partager de l'en-tête donne, pour un cours,
`/cours/<id>/?page=n`, avec toujours le paramètre, même pour la page 1. Pour un exercice ou une feuille, il donne
`/exercices/<id>/?ouvrir` ou `/exercices/feuille/<id>/?ouvrir`. Sur ces pages de lecture (`lecture-cours.mjs`,
constante `ALLER`), un script renvoie aussitôt le visiteur vers la page interactive, à la bonne page du PDF, quand
l'adresse porte `page=` ou `ouvrir`. Sans paramètre (adresse canonique, plan du site, moteurs), la page de lecture
s'affiche comme avant. Les aperçus des messageries, qui n'exécutent pas de script, restent ceux de la page de
lecture. Les pages de lecture de l'édifice et des annales (`lecture.mjs`, domaine apparence) ne sont pas concernées.

### 40. Formulaires (11 nov. 2026)

Les formulaires d'une page (PDF) sont rangés dans `documents/formulaires/<niveau>/` et non dans `documents/cours/`,
où `cours_termes.py` chercherait des termes définis dans leur rouge, qui marque ici les formules à connaître. Ils
sont déclarés sous la clé `formulaires` de `rubriques/cours.yaml` (`id`, `titre`, `niveau`, `pdf`, `chapitres`).
Chaque chapitre de la liste `chapitres` les montre :
- dans la colonne de droite de sa page, avec une carte « Formulaires » placée sous le sommaire, au-dessus de la carte
  « Exercices », elle-même remontée avant « Ce que ce chapitre définit » à la demande de l'auteur
  (`gabarit.html`) ;
- sur sa page de lecture, avec un bouton « Formulaire : … (PDF) » (`lecture-cours.mjs`).

On rattache un formulaire aux chapitres qui établissent ou emploient ses formules. Au 11 novembre :
- trigonométrie : `ma-04`, `ma-05`, `ma-06`, `ma-10` ;
- fonctions hyperboliques : `ma-05`, `ma-06`, `ma-10`.

Les liens des Nouveautés ne prennent que des ancres internes (`ancre`) : l'annonce renvoie donc aux chapitres, et
non aux PDF.

### 41. MPSI : chapitres 19, 20 et 21 déposés (11 nov. 2026, soir)

Trois chapitres sont déposés, avec leurs feuilles et leurs métadonnées :
- chapitre 19, « Espaces préhilbertiens réels » : cours de 19 pages, `f-ma-19` (57 exercices), `meta_ma_19.py` ;
- chapitre 20, « Séries et familles sommables » : cours de 23 pages, `f-ma-20` (64 exercices), `meta_ma_20.py` ;
- chapitre 21, « Dénombrement et probabilités » : cours de 29 pages, `f-ma-21` (110 exercices), `meta_ma_21.py`.

Les entrées « À revoir avant » sont `[t-04, ap-08]`, `[t-01, t-06]` et `[t-07, t-02, t-10]`. Les feuilles comptent
39 figures TikZ, toutes vérifiées sur une planche de contrôle.

**Pièges.**
- Un titre de sommaire qui contient « : » doit être mis entre guillemets dans `cours.yaml` : sinon YAML en fait
  un dictionnaire et `pages_sommaire.py` échoue. Les numéros de page de `ma-20` et `ma-21` ont été relevés à la main.
- Dans une règle `R` d'un `meta_ma_NN.py`, une alternative vide (`\\|` en fin de motif) correspond à tout.
- `c-continuite` n'existe pas : on écrit `c-sequentielle` ou `c-point`.

**Faux termes repérés par `cours_termes.py`** (rouge d'insistance dans des théorèmes ; signalés à l'auteur, non
exclus) :
- chapitre 19 : « sous-espace vectoriel », « non nuls », « simples », « unique » ;
- chapitre 20 : « majorée », « de même nature », « décroissante », « positive » ;
- chapitre 21 : « éléments », « sachant ».

Certains termes sortent abîmés par l'extraction du PDF (`mŒme`, `cid:224`), un défaut qui relève du programme du
domaine apparence.
Symboles validés le 11 novembre : `projection` (`ma-19`, repris de `p-07`), `serie` (`ma-20`, dessin nouveau : un
carré coupé en moitiés successives, 1/2 + 1/4 + … = 1) et `binomiale` (`ma-21`, repris de `t-02`). Ajoutés à
`outils/cours-termes-exclus.txt`, parce qu'ils n'apparaissent comme termes nulle part ailleurs : « non nuls »,
« simples », « de mŒme nature ». Les autres faux termes servent aussi de vrais termes dans d'autres cours ; ils
restent signalés à l'auteur.

### 42. Activités reliées aux chapitres (11 nov. 2026)

À la demande de l'auteur, la conversation Cours vérifie à chaque dépôt de chapitre quelles activités
(`rubriques/activites.yaml`, domaine Activités) s'y rattachent, et ajoute l'id du chapitre au champ `cours` de
l'activité. On ne touche à rien d'autre dans ce fichier. Le 11 novembre, rétrospectivement :
- `ma-21` : binomiale, chemins-grille, grands-nombres, anniversaires, derangements, catalan, anagrammes ;
- `ma-20` : nombre-e, derangements ;
- `ma-19` : espace, produit-scalaire ;
- `ma-05` et `ma-09` : derivee ;
- `ma-07` : limite-suite ;
- `ma-04` : cercle-trigo ;
- `ma-18` : aire-primitive.

En sens inverse, la page d'un chapitre a une carte « Activités », placée sous « Exercices » (`gabarit.html`).
Elle liste les activités dont le champ `cours` cite le chapitre. Sa page de lecture a une section « Activités »
(`lecture-cours.mjs`).

### 43. « Dans les annales » sur les pages de chapitre (11 nov. 2026)

Chaque chapitre de MPSI porte dans `rubriques/cours.yaml` un champ `annales_themes`. C'est une liste choisie à la
main de thèmes du moteur des annales (ids de `rubriques/annales-themes.yaml`, domaine Annales, lu sans être
modifié). Une correspondance automatique par les nœuds de l'édifice donnait trop de bruit : « Enseignement et
didactique » pour le chapitre 1, rien sur les séries pour le chapitre 20.

La page du chapitre affiche ces thèmes dans une carte « Dans les annales », placée sous « Activités ». Un clic ouvre
la rubrique Annales avec le moteur prérempli : un gestionnaire `a[data-rech-q]` écrit `etatRech.q` avant la
navigation, puis le gestionnaire existant `data-vers-moteur` fait défiler jusqu'au moteur.

**À chaque dépôt de chapitre**, on choisit de 1 à 11 thèmes qui recouvrent son programme, en préférant les thèmes
fins (`parent:`), et on vérifie leurs ids. On ne relie pas encore les niveaux du lycée : les sujets du baccalauréat
ne sont pas indexés par thème.

### 44. MPSI ch. 5 mis à jour (11 nov. 2026, soir)

Le cours passe à 19 pages. Il ajoute les symétries par rapport à une droite `x = a` et à un point, ainsi qu'un
exemple complet d'étude de la fonction périodique `x ↦ sin x cos² x`. Le résumé et le sommaire (pages) sont repris.

La feuille passe de 59 à 64 exercices. Les 5 nouveaux (11, 15, 16, 17 et 19) s'insèrent dans la partie
« Dérivation », et non dans les exercices de synthèse : il a donc fallu décaler à la main les intervalles
`PARTIES` de `meta_ma_05.py`, en plus de la renumérotation automatique des `EXTRA` par `maj.py`. **Quand une
partie autre que la synthèse grandit**, on compare les intervalles des parties de l'ancienne et de la nouvelle
conversion avant de reconvertir.

### 45. MPSI ch. 22 déposé ; correction de `tex2exos` sur les boucles `\foreach` (12 nov. 2026)

Le chapitre 22, « Fonctions de deux variables », est déposé : cours de 18 pages et feuille `f-ma-22` de
39 exercices (`meta_ma_22.py`). Ses autres réglages :
- `annales_themes` : calcul-differentiel, optimisation, points-critiques, edp ;
- « À revoir avant » : `[t-03, t-06]` ;
- activités : aucune ne s'y rattache.

« min max » et « flèches », étiquettes rouges d'une figure du bilan, sont exclus de la recherche. « sommet »
(introduction), « col », « strict » et « classe » restent signalés à l'auteur.

**Correction de `tex2exos.lire`.** La figure du corrigé 18 contient `\foreach \R in {…}`, et `\R` est une macro du
préambule (`\mathbb{R}`). Le développement des macros changeait la variable de boucle en `\mathbb{R}`, et
`pdftocairo` produisait un SVG vide (hauteur 0). Dans chaque `tikzpicture` du corps, les variables de `\foreach`
sont maintenant renommées en `\fv<nom>`. Les figures qui ont une boucle changent donc d'empreinte à la prochaine
conversion : on supprime les SVG orphelins non suivis par git, ceux qu'aucun fichier de `rubriques/` ne cite.
Contrôle utile : aucun SVG de `documents/figures` ne doit contenir `<pageSet>` ni `height="0"`.

### 46. Symbole du ch. 22 : « surface » (12 nov. 2026)

Le dessin `surface` (validé par l'auteur, troisième proposition) représente le graphe de z = 1 − (x² + y²)/2 sur
[−1, 1]², projeté par P(x, y) = (12 + 5,3√2·(x cos45° − y sin45°), 14,3 + 4,3√2·(x sin45° + y cos45°) − 4·f).
Le jacobien de la projection reste strictement positif, la surface ne se replie donc pas : une seule teinte `f3`
remplit le bord, sans élimination des parties cachées. Quadrillage `t` de deux lignes par sens, bord `t3`.
Abandonnés : la colline en cloche (lue comme une tente) et la selle (illisible à 40 px). Générateur :
`scratchpad/sym/surf_inj.py` (21 points par arête, coordonnées arrondies au dixième).

### 47. Niveau Python – Lycée et atelier Python (13 nov. 2026) Depuis le 13 novembre 2026, `monterAtelier` accepte l'option `disposition: 'cote'`, ajoutée par la conversation Activités pour son bac à sable (`activites/bac-a-sable.js`) : au-dessus de 720 px, l'éditeur occupe toute la hauteur à gauche, la console puis les variables sont à droite, et la console défile ; sans l'option, et toujours en dessous de 720 px, la disposition est inchangée (vérifié sur `#exercices/feuille/f-py-01`).

**Niveau.** `python`, intitulé « Python – Lycée », déclaré en dernier dans `rubriques/cours.yaml` (après Master) :
placé après les Maths approfondies, il serait compté parmi les niveaux de prépa de la carte « Par où commencer ? »
de l'accueil (domaine À propos, tranche `approfondies` → `master`). Aucun niveau ne le précède (choix de l'auteur) :
pas d'entrée dans `cours-prerequis.yaml` ni dans les tables `PRECEDENT`. Cours `py-01` (« Initiation à Python »,
41 pages, huit chapitres et deux annexes dans un seul PDF, `documents/cours/python/chap01_initiation_python.pdf`),
feuille `f-py-01` (43 exercices en sept parties), métadonnées `outils/meta_py_01.py` (nœuds : les objets
mathématiques manipulés, division euclidienne, connecteurs, définition par récurrence…, et une table `RETIRER` pour
les correspondances fortuites). Symbole `console` (fenêtre de terminal, dessin générique : pas de logo).

**Convertisseur.** `tex2exos.py` met à l'abri les environnements `lstlisting`, `python` et `sortie` avant le retrait
des commentaires (« % » est l'opérateur modulo) et le développement des macros ; `python` donne un bloc
```` ```python ````, `sortie` un bloc ```` ```sortie ```` (affichage, fond bleuté). `\code{…}` devient du code en ligne,
y compris dans les cellules (un tableau qui contient du code est rendu en HTML). Correction générale de la
typographie : les clôtures d'un bloc ```` ```tableau ```` étaient prises pour du code en ligne et décalaient la
protection des blocs suivants (espace insécable posée dans un `print("… : ")`). Contrôle : les 28 blocs de l'énoncé
et les 111 du corrigé sont identiques au .tex.

**Atelier** (`python/atelier.js`, `python/atelier-worker.mjs`). Python 3.14 (Pyodide 314.0.6, `vendor/pyodide-314.0.6/`,
13 Mo, licence MPL-2.0) est servi par le site (`site/python/pyodide/`, copié par `rendu.mjs`) et ne se télécharge
qu'au premier « Exécuter ». Le code tourne dans un worker, dans le navigateur du visiteur : rien n'est exécuté sur
le serveur. Éditeur (coloration, numéros, indentation automatique), Exécuter (F5 ou Ctrl+Entrée), Déboguer
(toutes les étapes enregistrées, au plus 1 000, puis parcourues dans les deux sens, variables globales et locales,
celles qui changent en orange), Arrêter (le worker est relancé), variables, console interactive qui partage les
variables du programme, messages d'erreur avec une phrase d'aide en français. `input()` : la réponse se tape dans
la console ; le programme est relancé depuis le début avec les réponses déjà données (même graine du hasard),
l'affichage déjà produit n'étant pas répété, ce qui évite les en-têtes d'isolation (`htaccess-ovh`). Code de
l'élève gardé dans son navigateur (`atlas-python:<id>`).
- **Feuille** : sous l'énoncé de chaque exercice de niveau `python`, « S'entraîner en Python » ; l'éditeur reçoit
  les programmes de l'énoncé, à la suite. Les blocs de code des feuilles sont colorés (observateur sur `#rubrique`).
- **Cours** : `outils/cours_code.py` repère dans le PDF les fonds gris des blocs de code (`fondcode`) et les rattache
  aux environnements `python` du .tex, rangé hors du site dans `outils/sources-cours/` (table `SOURCES`) ; résultat
  versionné `outils/cours-code.json` (empreinte : recalculé seulement si le PDF ou le .tex change ; la page de titre
  n'a pas de bouton). La visionneuse pose un bouton « ▶ Essayer » sur chaque bloc (52) ; l'atelier unique de la page
  s'ouvre sous la page de l'exemple. Carte « Atelier Python » (atelier vide) entre Formulaires et Exercices.
- **Pages de lecture** : une phrase renvoie à la page interactive (cours et exercices).
- **Mise à jour du cours** : remplacer le PDF et le .tex, puis `python3 outils/cours_code.py py-01`.

Signalé à l'auteur : « corps » (corps d'une boucle) est relevé en rouge comme terme défini, alors qu'il en est un
autre en algèbre ; laissé tel quel. Termes écartés : texte, la borne, vaut, Arrêter, et deux fragments.

Le 13 nov., après publication : OVH sert `pyodide.asm.wasm` en `text/x-asm` (Apache lit l'extension « .asm »), que
WebAssembly refuse. Le worker rétablit le type `application/wasm` des réponses `.wasm` (enveloppe de `fetch`), sans
toucher à `htaccess-ovh`. Vérifié en ligne : l'exercice 2 s'exécute. Un `AddType application/wasm .wasm` (avec
compression) dans `htaccess-ovh` rendrait le chargement plus léger : à proposer au domaine de la publication.

Le 13 nov. (après-midi) : sur iPhone, Safari agrandissait le texte du code (« text autosizing » des blocs larges)
sans agrandir les numéros de ligne, qui ne tombaient plus en face des lignes. `.atelier` fixe
`text-size-adjust: 100%` ; sous 720 px, l'éditeur et la ligne de la console passent à 16 px, taille en dessous de
laquelle Safari zoome la page quand on touche le champ.

### 48. Niveau Maths Spé – MP (14 nov. 2026)

Niveau `mp` (« Maths Spé – MP »), déclaré juste après `ma` : il tombe ainsi dans la tranche « prépa » de l'accueil.
Cours `mp-01` (Structures algébriques usuelles, 16 p.), `mp-02` (Éléments propres et diagonalisation, 18 p.),
`mp-03` (Polynômes d'endomorphismes et réduction, 12 p.), dans `documents/cours/mp/` ; feuilles `f-mp-01` (79
exercices), `f-mp-02` (55), `f-mp-03` (50), métadonnées `outils/meta_mp_01.py` à `meta_mp_03.py`. Les PDF reçus
s'appelaient `…_apercu.pdf` : ce sont les PDF compilés, renommés selon la convention `chapNN_sujet[_enonce|_corrige].pdf`.
Pages du sommaire relevées sur les titres de section (taille de police > 13 pt) : `pages_sommaire.py` s'était trompé
pour la section 5 de mp-02 (page 7 au lieu de 10). Recherche : alias `mp` et `spe`. Activités reliées :
`matrice` → mp-02, `euclide` → mp-01. Termes écartés : « -algèbre » et « projecteur sur » (fragments).

Prérequis (après l'ajout de `'mp': ['ma']` aux tables `PRECEDENT` par le domaine apparence, §81 de son mémo) :
mp-01 [ma-11, ma-12, ma-13], mp-02 [ma-15, ma-16, ma-17], mp-03 [ma-13, ma-15, ma-16]. Exclusions par chapitre :
`mp-03 : pour tout` (texte d'une formule en rouge), et `+ ap-01 : pour tout`, vrai terme défini du chapitre de logique
que la règle des fragments écartait. Symboles retenus : mp-01 `cyclique` (dessin partagé avec ap-03, dont la flèche a été refaite le 14 nov. : arc plein
de l'élément mis en avant vers le suivant, pointe tangente au cercle, calculée), mp-02 `diagonale`, mp-03 `blocsdiag`.

### 49. MP, chapitres 4 à 6 (15 nov. 2026)

`mp-04` (Espaces vectoriels normés, 12 p.), `mp-05` (Continuité, compacité, connexité par arcs, 15 p.), `mp-06`
(Séries et fonctions à valeurs vectorielles, 11 p.) ; feuilles `f-mp-04` (62 exercices, deux figures TikZ dans le
corrigé, vérifiées), `f-mp-05` (62), `f-mp-06` (58, un programme Python dans l'énoncé de l'exercice sur la constante
d'Euler) ; `outils/meta_mp_04.py` à `meta_mp_06.py`. Pages du sommaire relevées sur les titres de section du PDF.
Prérequis : mp-04 [ma-08, ma-14, ma-19], mp-05 [ma-08, ma-14], mp-06 [ma-20, ma-18, ma-10]. Activités reliées :
`dichotomie` → mp-05, `taylor`, `accroissements`, `rectangles` → mp-06. Termes écartés : « admet », « 1918 F. Riesz :
dimension finie » (frise historique). Symboles : mp-04 `ouvert` (boule ouverte contenant une petite boule autour d'un de ses points). Pour mp-05 et mp-06,
les premières propositions (chemin, compact, serievect, tangente) ont été refusées ; mp-05 `epsdelta` (bandes ε et δ
autour d'un point du graphe, δ égal à 80 % du plus grand δ possible, calculé). mp-06 `sigma` (le signe Σ, autorisé
comme signe propre au sujet ; les dessins de suites de vecteurs, de sommes partielles et de série-intégrale ont été
écartés).

### 50. MP, chapitres 7 à 9 (15 nov. 2026)

`mp-07` (Endomorphismes des espaces euclidiens, 12 p.), `mp-08` (Suites et séries de fonctions, 13 p.), `mp-09`
(Séries entières, 11 p.) ; feuilles `f-mp-07` (67 exercices), `f-mp-08` (58), `f-mp-09` (51), sans figure ;
`outils/meta_mp_07.py` à `meta_mp_09.py`. Prérequis : mp-07 [ma-15, ma-16, ma-17] (le MPSI publié n'a pas encore de
chapitre sur les espaces préhilbertiens), mp-08 [ma-08, ma-18, ma-20], mp-09 [ma-20, ma-10, ma-05]. Activités
reliées : `matrice` → mp-07, `nombre-e`, `derangements`, `taylor` → mp-09. Termes écartés : les fragments de phrases
mis en rouge dans mp-08 et mp-09, `cid:74` et `cid:75` (glyphes non décodés), « mŒme … » (ligature mal décodée) ;
par chapitre : `mp-08 : limite`, `mp-09 : pour tout`, `mp-09 : de classe`. Symboles : mp-07 `ellipse` (conique
$\langle Ax, x\rangle = 1$ et ses axes propres orthogonaux, image du théorème spectral) ; mp-08 `xn` (courbes de $x^n$
pour n = 1, 3, 8, 25 et leur limite simple discontinue) ; mp-09 `disque` (disque ouvert teinté, sans bord tracé, un point
plein dedans, un point vide dehors).

### 51. Vidéo du chapitre : bouton et lecteur (15 nov. 2026, par la conversation « Vidéos ATLAS », à la demande de l'auteur)

La conversation « Vidéos ATLAS » a ajouté à la rubrique, avec l'accord de l'auteur, de quoi regarder la vidéo d'un
chapitre. Le détail (mise au point du lecteur, décisions, protocole de publication) est dans `MEMO_atlas_videos.md`,
§9 et §10. Ce qui touche ce domaine :

- `construire.py`, à la fin du bloc des rubriques : lecture de `videos/catalogue.json` ; une vidéo marquée
  `en_ligne` donne à son chapitre un champ `video` (`fichier`, `duree`, `reperes`, `youtube`).
- `gabarit.html`, `pageCours` : la pastille d'état est sortie du lien de la ligne, dans `<span class="ch-etat">`, où
  la rejoint le bouton « ▶ Vidéo » (`coursVideoBouton`) : un bouton ne peut pas vivre dans un lien. La ligne `<li>`
  est devenue une grille (lien, état) ; `.chapitre` n'a plus que trois colonnes ; le survol colore le `<li>`.
  Conséquence : un clic sur la pastille « En ligne » n'ouvre plus le chapitre.
- `gabarit.html`, `pageChapitre` : un bouton « Vidéo » dans la barre du lecteur de PDF, quand le chapitre en a une.
- `gabarit.html` : `coursVideoDuree`, `coursVideoBouton`, `ouvrirCoursVideo` et l'écouteur de clic `[data-cours-video]`,
  placés avant `pageCours` ; styles entre les repères « Cours : vidéo du chapitre » et « fin de la vidéo du chapitre ».
  Classes préfixées `vl-` (éléments) et `vx-` (états) : `.lecteur`, `.vue`, `.lecture`, `.bulle` existent déjà sur le site.


### 51. MP, chapitres 10 à 12 (16 nov. 2026)

`mp-10` (Espaces préhilbertiens, 16 p.), `mp-11` (Séries de Fourier, 12 p.), `mp-12` (Intégrales généralisées,
16 p.) ; feuilles `f-mp-10` (52 exercices), `f-mp-11` (34), `f-mp-12` (43), sans figure ; `outils/meta_mp_10.py` à
`meta_mp_12.py`. L'édifice n'a pas de nœud propre aux intégrales généralisées : `ri-integrable`, `ri-proprietes`,
`ar-asymptotique`. Prérequis : mp-10 [ma-14, ma-15, ma-18], mp-11 [ma-18, ma-20, ma-05], mp-12 [ma-18, ma-20, ma-10].
Activité reliée : `produit-scalaire` → mp-10. Termes écartés : deux dates de frise et deux fragments (globaux), et
par chapitre des adjectifs ou fragments mis en rouge (mp-10 : fermé, dimension finie, réelles ; mp-12 : aire,
majorée, continue, positive, limites finies, égales, décroissante, intégrable en). Symboles validés le 16 nov. : mp-10 `plan` (vecteur projeté sur un plan), mp-11 `creneau` (créneau en aplat et somme partielle S₃), mp-12 `singularite` (aire sous 1/√x le long de l'asymptote x = 0).

### 52. Sources des feuilles MPSI (16 nov. 2026)

L'auteur a renvoyé les 44 .tex MPSI (EXO et CORRIGE, chap. 1 à 22) avec des commentaires `% Source :` avant les
exercices. Hors commentaires, les énoncés sont identiques à ceux en ligne ; deux phrases de corrigé diffèrent
(ch. 16, « Piège » : « sur $\C$, on remplace » au lieu de « le chapitre 19 remplacera » ; ch. 17,
« la seconde année appellera » au lieu de « le chapitre 19 appellera »), **non reportées** : les PDF n'ont pas été
fournis, le site garderait sinon un texte différent du PDF. Pas de reconversion : 1 171 champs `source` insérés
directement dans `f-ma-NN.yaml` (avant `page_enonce`), toutes autres métadonnées intactes ; sources EXO et
CORRIGE identiques partout. `tex2exos.sources` reconnaît désormais aussi `\par\needspace{…}\exoorig{N}` (ex. 65
du ch. 17, 37 et 53 du ch. 18 étaient manqués). 185 exercices sur 1 356 restent sans source (aucun commentaire).

**Sources internes masquées (16 nov.).** À la demande de l'auteur, une source qui ne renvoie à aucun document
extérieur (« exercice composé pour la feuille… », « promesse de la feuille… », seules ou entre elles) n'est pas
affichée : `tex2exos.source_interne` l'écarte à la conversion, et les 88 champs existants (MPSI et MP) ont été
retirés. Les sources mixtes (« BibM@th, … ; exercice composé pour la feuille ») sont gardées telles quelles (18).


## Note du domaine À propos – apparence (17 nov. 2026) : pages par niveau

Avec l'accord de l'auteur, `lecture-cours.mjs` écrit maintenant une page par niveau : `/cours/niveau/<id>/` (liste
des chapitres) et `/exercices/niveau/<id>/` (liste des feuilles), avec leur image d'aperçu ; ce sont les adresses
que partage le bouton Partager pour une rubrique filtrée sur un niveau. Elles se mettent à jour d'elles-mêmes quand
un chapitre, une feuille ou un niveau est ajouté ; la construction demandera seulement de refabriquer leur image
(MEMO_atlas.md §0, point 9). Détail : MEMO_atlas_apropos.md §84.

### 53. MP, chapitres 13 à 15 (17 nov. 2026)

`mp-13` (Convergence dominée et intégrales à paramètre, 15 p.), `mp-14` (Espaces probabilisés et variables
aléatoires discrètes, 15 p.), `mp-15` (Espérance, variance et fonctions génératrices, 14 p.) ; feuilles `f-mp-13`
(43 exercices) et `f-mp-15` (46), sans figure ; `outils/meta_mp_13.py`, `meta_mp_15.py`. **La feuille 14 attendait
son corrigé** (reçu et versé le 19 nov., §57) (ni .tex ni PDF reçus) : `mp-14` n'a pas de champ `exercices`, et l'énoncé n'est pas déposé ; à
réception, `meta_mp_14.py` (parties : 1–3, 4–9, 10–21, 22–24, 25–30, 31–33, 34–41, synthèse 42–46), conversion, champ
`exercices: f-mp-14` et entrée dans `exercices.yaml`, sans nouvelle entrée de nouveautés (compléter celle du 17 nov.).
Prérequis : mp-13 [ma-18, ma-20, ma-08], mp-14 [ma-21, ma-20, ma-03], mp-15 [ma-21, ma-20, ma-10]. Activités :
`grands-nombres` → mp-15, `anniversaires` → mp-14. Termes écartés par chapitre (fragments, renvois « théorème N »,
et « presque sßr(ement) », où le PDF code « û » comme « ß »). Symboles validés le 17 nov. : mp-13 `domine` (oscillation φ(t) cos(2,4 t) dans l'enveloppe ±φ, φ(t) = e^{−t/2}), mp-14 `partition` (univers en trois parts et un événement), mp-15 `esperance` (loi de Poisson(1,6) tronquée à 0–5 sur un pivot placé à son espérance, 1,572, calculée).

### 54. MP, chapitres 16 et 17 (17 nov. 2026)

`mp-16` (Équations différentielles linéaires, 11 p.) et `mp-17` (Calcul différentiel et optimisation, 18 p.), derniers
chapitres de MP ; feuilles `f-mp-16` (47 exercices) et `f-mp-17` (51), sans figure ; `outils/meta_mp_16.py`,
`meta_mp_17.py` (la diagonalisation se dit `rd-diagonalisable`). Prérequis : mp-16 [ma-06, ma-16, ma-17], mp-17
[ma-22, ma-14, ma-09]. Activité : `euler` → mp-16. Termes écartés (mp-17) : dérivable en, différentiable en, selon le
vecteur, de classe, global, col (doublon de « point col »), réciproque fausse. Symboles validés le 17 nov., après deux planches refusées (spirale, nœud, gradient sur ellipses, Lagrange sur cercles ; col, famille, jacobienne, relief) : mp-16 `champdir` (champ de directions ; le nom `champ` était déjà pris de y′ = 1 − y et la solution y = 1 + 2,3 e^{−t}), mp-17 `tangence` (disque de contrainte, ligne de niveau de f = x + y tangente au point du maximum, une ligne plus basse en pointillés). La feuille `f-mp-14`, d'abord en attente de son corrigé, est versée le 19 nov. (§57).

**18 nov. : MP 15 à 17 révisés.** Les théorèmes passent de l'environnement `cadre` à un tableau encadré à titre
rouge souligné (« Théorème 1 : Formule de transfert : ») ; aucun nouveau terme relevé par `cours_termes.py`. Seul
changement de pagination : mp-16, section 7 en page 10 (au lieu de 9).

### 55. Niveau Licence 3, par semestre et par UE (19 nov. 2026)

**Niveau** `l3` (« Licence 3 »), déclaré **après `master`** et avant `python` : la carte « En prépa » de l'accueil
(domaine À propos) prend les niveaux situés entre `approfondies` et `master`, et la Licence n'y a pas sa place.
Recherche : alias `l3`, `licence` (`NIVEAUX_TAPES`).

**Données** (`rubriques/cours.yaml`). Clé `ues` : `id`, `niveau`, `semestre` (entier), `titre`, `code` facultatif
(« UE 1 »…), `resume`, `pdf_complet`, `fiches`, `pages`, `prerequis` (ids de chapitres, tout niveau). Chaque chapitre
porte `ue` et, s'il y en a une, `fiche` (PDF d'une page). La numérotation des chapitres recommence dans chaque UE ;
ids `l3-<ue>-NN`. `construire.py` vérifie les UE (niveau, semestre, fichiers, prérequis), le rattachement des chapitres
et l'unicité (niveau, UE, numéro). Fichiers : chapitres dans `documents/cours/l3/`, cours complet (fusion des PDF de
chapitres par pypdf) et fiches dans `documents/ue/l3/`, hors de `documents/cours/` pour que `cours_termes.py` n'y relève
rien. Le PDF des fiches de l'auteur est découpé page par page (une fiche par chapitre).

**Affichage** (`gabarit.html`, domaine Cours). `pageCours` : pour un niveau qui a des UE, `coursNiveauParUE` range
par semestre, chaque UE en `<details class="ue">` fermé au départ (onglet), ouvertes gardées pendant la visite
(`coursUEOuvertes`) ; une UE sans chapitre est une ligne « À venir ». `pageUE` (`#cours/ue/<id>`) : présentation,
boutons « Commencer », cours complet, fiches ; liste des chapitres ; « À revoir avant l'UE » ; autres UE du semestre.
`pageChapitre` : sur-titre en fil d'Ariane (niveau · S5 · UE liée · chapitre), carte de l'UE sous le sommaire (plan,
chapitre courant marqué, fiche du chapitre, présentation, cours complet), précédent et suivant dans l'UE. Ligne d'un
chapitre factorisée (`ligneChapitre`). `adressePartage` : une page d'UE se partage par son adresse `#cours/ue/<id>`.
Pages de lecture (`lecture-cours.mjs`) : lieu « Licence 3, semestre 5, <UE>, chapitre N », boutons fiche et cours complet.
Le prototype du 18 nov. (worktree du scratchpad) a servi de maquette.

**Première UE** : `l3-s5-cd`, « Calcul différentiel et équations différentielles » (semestre 5, 108 pages), chapitres
`l3-cd-01` à `l3-cd-07` (espaces normés ; applications différentiables ; inversion locale et fonctions implicites ;
ordre supérieur et Taylor ; extrema libres et liés ; équations différentielles : existence ; approximation numérique).
Exercices : voir §56. « À revoir avant » : posé par chapitre le 19 nov. au soir, une fois `l3` ajouté aux tables `PRECEDENT` (vers ma et mp), en plus des prérequis
de l'UE (mp-04, mp-05, mp-17) ; liste dans `cours-prerequis.yaml`. Termes écartés : fragments et formes tronquées
(« -difféomorphisme », « -ième dérivée partielle »…), par chapitre. Le chapitre 7 contient du Python (`lstlisting`) :
boutons « Essayer » posés le 19 nov. (voir « Atelier dans la Licence » plus bas).
Symboles validés le 19 nov. : repris `ouvert` (ch. 1, comme mp-04), `tangente` (ch. 2), `dl` (ch. 4), `tangence` (ch. 5, comme mp-17), `champdir` (ch. 6, comme mp-16) ; nouveaux `hyperplan` (ch. 3 : disque {g ≤ 0}, droite tangente et gradient normal au point, calculés) et `euler` (ch. 7 : y = e^t sur [0, 2] et polygone d'Euler de pas 0,5, de 1 à 1,5⁴ ≈ 5,06).

## Note de la conversation « À propos – apparence » (19 nov. 2026) : ordre des niveaux, couleur des UE

À la demande de l'auteur (détail : `MEMO_atlas_apropos.md` §87). Dans `rubriques/cours.yaml`, `l3` est désormais placé avant `master` ; l'accueil range dans « À l'université » tout niveau dont l'identifiant est `l1`, `l2`, `l3`…, `m1`, `m2` ou `master`, pourvu qu'il soit placé entre le dernier niveau de prépa et `python` : garder ces identifiants et cet ordre pour les niveaux à venir. Une UE prend la couleur de la famille de l'édifice la plus représentée parmi les `theories` de ses chapitres (`couleurUE` du gabarit) ; champ facultatif `couleur` (nom de famille : `ana`, `alg`, `geo`…) pour forcer. « À revoir avant » : un chapitre de `l3` peut citer `ma` et `mp` ; un cours de `master`, `ma`, `mp` et `l3`.

**Atelier dans la Licence (19 nov.).** Un chapitre de n'importe quel niveau reçoit les boutons « Essayer » et la carte
« Atelier Python » s'il porte `atelier: true` (l3-cd-07). `outils/cours_code.py` : `SOURCES` donne pour chaque cours
la source (`outils/sources-cours/`), l'environnement des blocs (`python` ou `lstlisting`) et la couleur de fond des
blocs dans le PDF (`fondcode` 0,961 pour py-01, `backcolour` 0,98 pour l3-cd-07) ; les numéros de ligne de listings
sont hors du fond, donc hors des zones. l3-cd-07 : 6 blocs, 6 zones, tous exécutés avec CPython avant dépôt.
Bibliothèques : ces blocs importent numpy, scipy, matplotlib, sympy, absents du cœur de Pyodide hébergé (13 Mo). Le
worker (`bibliotheques`) les charge à la demande par `loadPackagesFromImports`, avec `packageBaseUrl` =
`https://cdn.jsdelivr.net/pyodide/v314.0.6/full/` (même version que `vendor/`), en annonçant « [Chargement de NumPy…] »,
ou « [Téléchargement impossible…] » sans réseau. Matplotlib passe en Agg, `plt.show` ne fait rien, et les figures
ouvertes après l'exécution sont envoyées en PNG (message `image`, `Atelier.image`, classe `.at-figure`). Le CDN n'est
pas joignable depuis l'environnement de travail : le chargement réel n'a pu être vérifié qu'en ligne.

**19 nov., soir : chapitres 1 à 7 révisés.** Retouches de rédaction (`\noindent` retirés, quatre phrases
reformulées, macros `\dpd` et `\Isom` ajoutées au préambule) ; pages et sommaires inchangés, termes identiques ;
cours complet refusionné (108 p.), source du chapitre 7 et zones de code (`cours_code.py l3-cd-07`) mises à jour.

### 56. Feuilles d'exercices de la Licence 3 (19 nov. 2026)

Sept feuilles `f-l3-cd-01` à `f-l3-cd-07` (35, 58, 33, 19, 17, 33 et 17 exercices : 212), converties par
`tex2exos.py` avec `outils/meta_l3_cd_0N.py` ; PDF dans `documents/exercices/l3/`
(`calcul_differentiel_chap0N_<slug>_{enonce,corrige}.pdf`, slug du chapitre 1 raccourci en `espaces_normes`) ;
entrées dans `exercices.yaml` (avant `f-py-01`) et champ `exercices:` des chapitres `l3-cd-0N`. Nouveauté : l'entrée
« Nouveau niveau : Licence 3 » du jour est complétée (lien `exercices/niveau/l3`, `couvre`). Le Python du corrigé 7
(`lstlisting`) passe en blocs de code.

Quatre retouches de `tex2exos.py`. (1) Les feuilles v5 placent `\needspace{…}` seul entre le commentaire de source et
`\exo{N}` : la tête accepte désormais `\needspace` avec ou sans `\par`. (2) Le renommage des variables de `\foreach`
ne touche plus que les variables qui sont aussi des macros du préambule (`\R`…) : il renommait `\x` dans toute la
figure, y compris le `plot (\x, …)` voisin (figure du corrigé 3 cassée). (3) `source_interne` : insensible à la casse,
« cette feuille » accepté, et une source qui ne nomme qu'un fichier de travail (`f3.pdf`, `fic00047.pdf`, `Maudin.pdf`,
« feuille 2 photographiée ») est tenue pour interne. Conséquence : aucune source n'est affichée pour la Licence ; si
l'auteur donne les références réelles de ces fichiers, les remplacer dans les `.tex` et reconvertir.
(4) Les corrigés de Licence écrivent `\boxed{…}` hors de toute formule (amsmath le compose alors en formule
encadrée) : la première conversion en faisait du texte mutilé (« y = (x + C) sur ]-C, +[ »). `maths()` le change
maintenant en formule en ligne ; 142 exercices corrigés avant publication. Les feuilles déjà en ligne n'emploient
`\boxed` qu'en formule.

### 57. « Dans le cours » sur les cartes d'exercice ; feuille MP 14 (19 nov. 2026)

**Feuille `f-mp-14`** (46 exercices, 41 sources affichées), `outils/meta_mp_14.py` ; champ `exercices` de mp-14 ;
nouveauté du 17 nov. complétée (135 exercices, lien vers la feuille). La MP est complète.

**« Dans le cours »** (demande de l'auteur). Sous le pied de chaque carte d'exercice, avant « Dans l'atlas », une ligne
« Dans le cours : » donne une ou deux parties du chapitre (titre du sommaire · p. N). Le lien (`a.puce-cours` avec
`data-cours-page`) ouvre le chapitre à la page de la partie, par le mécanisme existant du domaine apparence (§60 de son
mémo : `retourNoter`, `retourMontrer`, `retourFaire`) ; un écouteur du domaine Cours (`data-retour-exo`) change seulement
le libellé du bouton flottant en « ← Retour à l'exercice N », qui ramène à la carte, à la même position.
Données : `outils/exercices_cours.py` compare, par TF-IDF (mots réduits à six lettres, sans accents ni formules), le texte
de chaque exercice (énoncé, corrigé, titre de partie et mots-clés comptés triple) au texte de chaque partie du PDF du
cours (pdftotext, de la page de début à la suivante) ; « Introduction historique » et « Bilan » sont exclues. Une partie
de feuille dont le titre reprend celui d'une partie du cours (deux tiers de ses mots) y renvoie d'abord ; une seconde
partie est gardée si son score atteint 85 % du premier. Résultat versionné `outils/exercices-cours.json`
({id: [indices du sommaire]}), lu par `construire.py` (champ `cours_parties` de l'index, avertissement si un indice sort
du sommaire). Corrections manuelles éventuelles : `outils/exercices-cours-corrections.yaml` ({id: [indices]}), prioritaire.
4 129 exercices sur 4 132 reliés (3 sans mot commun). **À relancer** après tout dépôt ou remplacement de feuille ou de
cours (`python3 outils/exercices_cours.py [f-…]`), sinon les nouveaux exercices n'ont pas la ligne.

### 58. Atelier Python : chapitres 3 à 6 de la Licence, exercices qui demandent Python (20 nov. 2026)

À la demande de l'auteur. Cours : `l3-cd-03` à `l3-cd-06` reçoivent `atelier: true` et leur source dans
`outils/sources-cours/` (table `SOURCES` de `cours_code.py`, `lstlisting`, fond 0,98) ; 1, 2, 2 et 1 blocs, une zone
chacun, tous exécutés avec CPython avant dépôt (sympy, numpy, scipy). Exercices : `construire.py` marque `python: true`
tout exercice dont l'énoncé nomme Python, un programme, un script, numpy, scipy, matplotlib ou sympy, ou contient un bloc
```` ```python ```` ; la carte montre alors « S'entraîner en Python », comme au niveau `python` (énoncé recopié dans
l'éditeur, corrigé jamais). 49 exercices hors du niveau Python, dont `l3-cd-07-03`, `-09`, `-16`, `-17` ; les autres
exercices numériques du chapitre 7 (tableau d'Euler de l'exercice 2, portraits de phase de l'exercice 13) ne nomment pas
Python : ajoutés à la demande de l'auteur (20 nov.) par la table `PY_AUSSI` de `construire.py`, où l'on inscrit
tout autre exercice à pourvoir. Chargement de NumPy depuis le CDN vérifié en ligne par l'auteur.

### 59. Licence 3 : UE Intégration (21 nov. 2026)

UE `l3-s5-int` (« Intégration », semestre 5, 84 p., sans fiches de révision : champ `fiches` absent), chapitres
`l3-in-01` à `l3-in-09` : tribus et mesures ; mesure de Lebesgue sur ℝⁿ ; fonctions mesurables, intégrale des fonctions
positives ; fonctions intégrables, convergence dominée ; intégrales à paramètres, Fourier, Laplace, Mellin ; changement de
variables, Sard ; Fubini ; espaces Lᵖ ; convolution. PDF `documents/cours/l3/integration_chapNN_<slug>.pdf`, cours
complet `documents/ue/l3/integration_cours_complet.pdf` (fusion pypdf). Résumés rédigés d'après les bilans et les
énoncés numérotés des .tex ; sommaires = titres longs des `\section` (mathématiques en `$…$`), pages relevées sur les
titres de taille > 13 pt. Théories : graphes `mes`, `anf-lp`, `fourier`, `edo-changement`, `edp`. Prérequis de l'UE
[ma-18, mp-12, mp-13] ; « À revoir avant » par chapitre dans `cours-prerequis.yaml`. Activités : aire-primitive (3),
rectangles (3, 4), suites-fonctions (4), matrice (6). Termes exclus : 15 fragments ou mots d'insistance (`l3-in-0N : …`).
Pas de Python. Symboles validés le 21 nov. (variantes A) : repris `partition` (ch. 1) et `domine` (ch. 4) ; nouveaux
`paves` (disque, carrés de côté 3 contenus en f2, rencontrés en f3), `tranches` (étagée à niveaux espacés de 5 sous
16,5·sin(πu)^1,5, franchissements calculés par dichotomie), `gamma` (graphe de Γ, points n = 1, 2, 3), `polaires`
(secteur d'anneau r ∈ [5,5 ; 18], θ ∈ [6°, 84°], grille 3 × 3, cellule centrale), `fubini` (domaine sous 0,28 + 0,62√x,
section verticale en x = 0,55, horizontale en y = 0,62), `boules` (boules unités des normes 1, 2, ∞) et `convolution`
(créneau et son autoconvolée triangulaire). Variantes écartées : `cantor`, `lineaire`. Préparé sur la branche
`ue-integration` en attendant la validation, puis fusionné dans main.



### 60. le corrigé suit l'exercice entre carte et projection

À la demande de l'auteur, qui a confié ce travail à la conversation Cours. `pjOuvrir` appelle `pjDepuisCarte(id)` : si le
corrigé de la carte est ouvert, la projection démarre à la question atteinte (k étapes `.corr-etape` visibles → étape k),
ou sur tout le corrigé s'il est entier (aucune `.corr-etape`, toutes visibles, ou découpages différents). `pjFermer`
appelle `pjVersCarte()` : la carte ouvre son corrigé, appelle `corrEtapes`, montre les questions 1 à k (toutes après C
ou à la dernière étape) puis `corrMaj` et `composerDans` ; revenir à l'énoncé (étape 0) ne touche pas la carte. Avec des
marques de question, `etapesCorrige(C, false)` et `etapesCorrige(C, true)` donnent les mêmes étapes ; sans marque, la
carte n'a pas d'étapes et un corrigé ouvert y est entier. Vérifié sur `ma-10-03` (8 questions) et `ma-10-06` (sans marques).
Saut à chaque étape de la projection corrigé le même jour : `pjRendu` compose ses formules aussitôt (`composerDans(PJ.el, true)`) ; composées à la vue, elles changeaient la hauteur des blocs après le défilement vers la dernière étape.

### 61. Recherche dans le PDF d'un chapitre (21 nov. 2026)

Les pages du visualiseur sont des canvas : Ctrl F du navigateur n'y voit rien. Champ « Chercher dans le PDF » dans la
barre du lecteur (`pageChapitre`, groupe `.pdf-cherche`), objet `pdfCherche` placé avant `monterPdf` (qui l'initialise
avec le document et garde le viewport de chaque page). Texte lu par `getTextContent` à la première recherche,
normalisé caractère par caractère (NFKD, sans accents, minuscules, ligatures dépliées, espaces réduites) avec une table
vers (élément, caractère) d'origine ; rectangles `.pdf-surl` calculés par `pdfjsLib.Util.transform(viewport, item)`,
à la proportion des caractères dans l'élément, posés dans `.lecteur-pages` (position relative) sur la page courante et
ses voisines ; l'occurrence courante en orange. Entrée / Maj Entrée, ↑ ↓, Échap vide ; Ctrl F (⌘ F) met le curseur dans
le champ, un second appui rend la main au navigateur ; au plus 999 occurrences ; redessin au redimensionnement.
Vérifié sur l3-cd-06 : « Picard » 9, « Gronwall » 6, « solution maximale » 11, comme pdftotext. Le visualiseur plein
écran de l'application installée (`vpOuvrir`, domaine apparence) n'a pas ce champ.


### 62. Couleur de la rubrique Exercices (21 nov. 2026)

Variante B validée par l'auteur : titres « Exercice N » (`.exo-tete h3`, lien `.lien-exo`) en `var(--r-exercices)`, filet de 4 px de cette couleur en haut des cartes d'exercice (`.exo.carte`) et de feuille (`.feuille.carte`), barres de difficulté pleines des cartes d'exercice dans la même couleur (styles placés après `.exo-tete h3`).

La barre du lecteur est collante (`.lecteur > .lecteur-barre`, `position: sticky`, fond `--surface`) : champ de recherche, résultat et flèches restent visibles pendant la lecture. Sur écran étroit, `pdfBarreCaler()` (appelée par `monterPdf` et au redimensionnement) décale son haut collant pour ne garder que la ligne de recherche. Pages : `scroll-margin-top: 64px`, pour que « aller à la page » ne cache pas le haut de la page sous la barre.
Projection (21 nov., à la demande de l'auteur) : le titre « Exercice N » (`.pj-tete h1`) et les barres de difficulté pleines (`.pj .difficulte i.plein`) prennent le mauve de la projection, `--pj-v`, comme les cartes de la rubrique.

Le même soir, à la demande de l'auteur, le filet mauve est retiré des cartes de feuille (vues « Par feuille » et « Par niveau ») ; il ne reste que sur les cartes d'exercice.

### 63. Exercices de l'UE Intégration, feuilles 1 à 5 (22 nov. 2026)

`f-l3-in-01` à `f-l3-in-05` (35, 16, 25, 30, 22 exercices : 128), `outils/meta_l3_in_01.py` à `05`, PDF
`documents/exercices/l3/integration_chap0N_<slug>_{enonce,corrige}.pdf`, champ `exercices` des chapitres `l3-in-0N`,
nouveauté du 22 nov., `exercices_cours.py` relancé pour ces feuilles. 31 figures.

**Sources lisibles** (`tex2exos.source_lisible`). Les commentaires `% Source :` de ces feuilles mêlent références et notes
de travail. Gardé : la première phrase seulement (les remarques suivantes, « Correction : … », « La question 3 est
ajoutée. », sont des notes ; une initiale « J. » ne coupe pas). Retiré : les parties « document photographié »,
« les questions … sont reportées … », « questions … ajoutées », et les parenthèses qui parlent de feuilles, de reports,
de corrections ou d'ajouts (les parenthèses citées entre guillemets « d) » ne comptent pas). Les noms de fichiers
deviennent « attribution (nom) » : `TD02_2020.pdf (Lyon 1)` → « Lyon 1 (TD02 2020) », l'attribution donnée une fois
valant pour les autres mentions du même fichier dans la feuille ; un numéro de fichier seul sans attribution
(`fic00047.pdf`, `f3.pdf`) est retiré ; un autre nom sans attribution est gardé sans `.pdf` (« M61B TD3 »). La règle du
19 nov. (toute source commençant par un fichier tenue pour interne) est remplacée par celle-ci. 116 sources affichées
sur 128 exercices ; les 12 autres n'avaient que des documents photographiés.

**`\DeclareMathOperator*`** : forme étoilée et corps composé lus (`\limsupens` = `\mathop{\overline{\lim}}\limits`).

**Figure du corrigé 2, exercice 9.** Le .tex fait `\input{py/kt.tex}` et `\input{py/kg.tex}`, fichiers produits par un
script de l'auteur et non transmis. Les segments des étapes K₀ à K₄ (retrait du tiers central ; retrait d'une fraction
1/(n+1)² de chaque segment) ont été recalculés en fractions exactes et insérés dans une copie du corrigé
(scratchpad `in/CORRIGE_ch2.tex`) ; les mesures obtenues (0,667 ; 0,444 ; 0,296 ; 0,198 et 0,75 ; 0,667 ; 0,625 ; 0,600)
sont celles de la figure du PDF. À refaire à toute nouvelle version de ce corrigé, ou demander à l'auteur les deux
fichiers `py/`.


### 64. Exercices de Licence : un onglet par UE (22 nov. 2026)

Demande de l'auteur. `vueFeuilles` : pour un niveau qui a des UE (vue « Par niveau » et section du niveau dans « Par feuille »), les feuilles sont rangées dans un `<details class="ue ue-exos">` par UE, fermé au départ, avec le code ou le semestre, le titre, « N feuilles · M exercices » et la couleur de l'UE (`couleurUE`) ; les cartes sont écrites par `vueFeuillesCartes`. L'état ouvert est gardé pendant la visite dans `coursUEOuvertes` (clé `exos-<id de l'UE>`, distincte de celle de la rubrique Cours). Les feuilles hors UE suivent les onglets.


### 65. Exercices de Licence 3, UE Intégration, feuilles 6 à 9 (22 nov. 2026)

Feuilles `f-l3-in-06` à `f-l3-in-09` : changement de variables (24 exercices, 4 parties), produits de mesures et Fubini
(25, 3 parties), espaces $L^p$ (22, 4 parties), convolution et régularisation (28, 5 parties), soit 99 exercices et
22 figures ; l'UE compte désormais 227 exercices. Métadonnées dans `outils/meta_l3_in_06.py` à `09.py` (même schéma que
les feuilles 1 à 5) ; PDF sous `documents/exercices/l3/integration_chap0N_<slug>_{enonce,corrige}.pdf` avec les slugs
`changement_variables`, `produits_fubini`, `espaces_lp`, `convolution_regularisation`. Aucun `\input` externe, aucun
avertissement de conversion ; les sources sortent lisibles telles quelles. Contrôle des mots : aucun mot du site absent
des PDF (hors coupures). Test de rendu : 198 pages sans débordement ; figures vérifiées en sombre sur téléphone.
La nouveauté du 22 nov. « Licence 3 : les exercices de l'UE Intégration » a été étendue (neuf feuilles, 227 exercices,
lien vers la feuille 7) plutôt que doublée. Les 217 avertissements KaTeX « No character metrics » sont les anciens (§ plus haut).


### 66. Licence 3 : UE Structures algébriques (23 nov. 2026)

UE `l3-s5-sa` (« Structures algébriques », semestre 5, 65 p., sans fiches), chapitres `l3-sa-01` à `l3-sa-08` : groupes,
anneaux, corps ; idéaux et anneaux quotients ; anneaux factoriels et principaux ; modules, anneaux noethériens,
théorème de Hilbert ; polynômes (factorialité, irréductibilité) ; polynômes symétriques, résultant, discriminant ;
extensions de corps ; extensions quadratiques, corps finis, extensions cyclotomiques. PDF
`documents/cours/l3/structures_algebriques_chapNN_<slug>.pdf` (les PDF reçus `…_apercu.pdf`, renommés), cours complet
`documents/ue/l3/structures_algebriques_cours_complet.pdf` (fusion pypdf). Titres = titres longs des `\chapter` ;
sommaires = `\section` (titre long pour le ch. 5, § 3) ; pages relevées sur les titres de taille > 13 pt. Résumés
rédigés d'après les énoncés numérotés et les bilans des .tex, sans l'introduction historique. Théories : graphes `alg`,
`gf`, `ac`, `z-polynomes`, `galois`, `galois-cyclotomie`, plus `o-zorn` (ch. 2 et 7), `c-dalembert` (ch. 7) et
`v-det-matrice` (ch. 6 : l'édifice n'a pas de nœud pour les polynômes symétriques ni le résultant). Prérequis de l'UE
[ma-11, ma-13, mp-01] ; « À revoir avant » par chapitre dans `cours-prerequis.yaml`. Liens : ma-11, ma-12, ma-13,
ma-14, ma-17, mp-01, m-galois. Activités : taquin → ch. 1, euclide → ch. 3, racines → ch. 6. Annales : thèmes
`groupes`, `anneaux`, `corps`, `corps-finis`, `polynomes-cyclotomiques`, `resultant`… Termes exclus : fragments
(`-algèbres`, `-espace vectoriel`, `-module`, globaux) et, par chapitre, engendre, paires, « groupe symétrique S »,
« tout élément irréductible est premier », -linéaire, engendré, finie, primitives. Pas de Python.
Symboles validés le 23 nov. : repris `loi` (ch. 1), `pgcd` (ch. 3), `racines` (ch. 5 et 6), `tour` (ch. 7, comme
m-galois) ; nouveaux `ideal` (ch. 2 : l'idéal 2ℤ dans ℤ, pairs en f1 sur la droite, impairs en f2), `monomial`
(ch. 4 : escalier de l'idéal ⟨X⁴, X²Y, XY³, Y⁵⟩ de la figure du cours, unité 3, générateurs en f1) et `unite` (ch. 8 :
racines 8-ièmes de l'unité sur le cercle de rayon 8,5, primitives (k impair) en f1). Variantes écartées : `horloge`,
`blocs`, `newton` (polygone de Newton de (X+1)⁴ + 1), `cyclique`. Générateur : scratchpad `sa/sym.py`.
**À faire (demande de l'auteur, 23 nov.)** : une fois les feuilles d'exercices de l'UE Structures algébriques versées,
rappeler à l'auteur d'écrire le prompt pour la conversation Annales (relier les chapitres `l3-sa-01` à `08` et les
feuilles `f-l3-sa-NN`, ainsi que `l3-in-*` et `f-l3-in-*`, aux programmes des annales).

### 67. Exercices de l'UE Structures algébriques (23 nov. 2026)

`f-l3-sa-01` à `f-l3-sa-08` (20, 15, 11, 10, 15, 10, 11, 21 exercices : 113 ; 30 figures), `outils/meta_l3_sa_0N.py`,
PDF `documents/exercices/l3/structures_algebriques_chap0N_<slug>_{enonce,corrige}.pdf` (slug du fichier reçu ; feuille 8 :
`corps_finis_cyclotomie`, différent du cours), champ `exercices` des chapitres `l3-sa-0N`, nouveauté du 23 nov.,
`exercices_cours.py` relancé. Contrôle des mots, rendu (226 pages) et figures en sombre : rien à signaler.
112 sources affichées (l'exercice 7.5, « promesse du cours », n'en a pas).

Retouches de `tex2exos.py`, sans effet sur les feuilles déjà en ligne tant qu'on ne les reconvertit pas :
- **Sources sur plusieurs lignes** : une ligne de commentaire suivante continue la source si une parenthèse est restée
  ouverte, si la précédente finit par « , ; ( » ou si elle commence par une minuscule ou un chiffre ; sinon c'est une
  note de travail. Les `~` deviennent des espaces fines insécables (« Corps finis »).
- **Notes retirées** : parenthèses parlant de fusion, d'inventaire ou d'intégration ; citation de l'énoncé d'origine
  entre parenthèses (`(« … »)`) ; fin « …, démontrés ici car … ».
- **`\def\R{1.6}` dans une figure** (corrigé 1, deux figures) : renommé comme les variables de `\foreach`, sinon `\R`
  devient `\mathbb{R}` et pgf échoue (« Unknown function RR »). Les variables après « / » d'un `\foreach` aussi.
- **`$\boxed{\text{…}}$` long** (plus de 28 caractères visibles) : formule centrée avec sa ponctuation, comme les
  `\boxed` longs en mode texte ; sans cela, trois exercices de la feuille 8 débordaient sur téléphone.

Rappel en attente (§66) : prompt Annales à écrire maintenant que les feuilles sont en ligne (chapitres `l3-sa-*`,
feuilles `f-l3-sa-*` et `f-l3-in-*`).

### 68. Atelier Python : effacer la console, hauteur des cadres (24 nov. 2026)

Demande de l'auteur, dans `python/atelier.js` (vaut pour les exercices, les cours et le bac à sable des Activités).
- **Effacer** : bouton `.at-effacer` au bout de la ligne de saisie de la console (en bas à droite), et Ctrl+L dans
  cette ligne ; méthode `effacer()`, sans effet pendant le débogage (l'affichage des étapes est posé dans la console).
  La ligne de saisie est devenue `<div class="at-ligne"><label>…</label><button>…</button></div>` (le bouton ne peut
  pas vivre dans le `label`).
- **Hauteurs** : poignée `.at-poignee` sur le bord bas de l'éditeur et de la console (pas des variables, qui suivent les deux autres : demande de l'auteur, 24 nov.), visible seulement avec une souris
  (`(hover: hover) and (pointer: fine)`) ; on la tire pour fixer la hauteur de la partie qui défile (`.at-zone`,
  `.at-sortie`, de 60 à 2000 px), double-clic pour revenir à la hauteur automatique. Hauteurs gardées
  dans le navigateur (`atlas-atelier-hauteurs`), les mêmes pour tous les ateliers. Dans la disposition `cote`, le
  `min-height` de 240 px de la console reste le plancher.
Vérifié avec Playwright : exécution, effacement (bouton et Ctrl+L), tirage des poignées, double-clic, téléphone sans
débordement.

### 69. Licence 3 : UE Probabilités, premier semestre 6 (24 nov. 2026)

UE `l3-s6-pr` (« Probabilités », semestre 6, 102 p., sans fiches), chapitres `l3-pr-01` à `l3-pr-10` : espaces
probabilisés ; conditionnement, indépendance ; variables discrètes ; variables réelles et à densité ; vecteurs discrets,
covariance ; séries génératrices et fonctions caractéristiques ; vecteurs à densité ; convergences ; lois des grands
nombres et TCL ; vecteurs gaussiens. PDF `documents/cours/l3/probabilites_chapNN_<slug>.pdf` (PDF `…_apercu` reçus,
renommés), cours complet `documents/ue/l3/probabilites_cours_complet.pdf`. Mêmes conventions qu'aux §59 et §66
(titres longs, sommaires = `\section`, pages relevées sur les titres > 13 pt, résumés sans introduction historique).
Théories : graphes `proba`, `fourier` (`fo-caracteristiques`, `fo-loi-esperances`, `fo-tcl`), `mes` (`m-tribus`,
`m-mesures`, `m-fubini`), `cv-changement`. Prérequis de l'UE [ma-21, mp-14, mp-15] ; « À revoir avant » par chapitre.
Liens vers mp-07, 08, 09, 12, 14, 15, ma-21 et les chapitres de l'UE Intégration. Activités : anniversaires → ch. 1,
monty-hall et conditionnelles → ch. 2, binomiale et grands-nombres → ch. 9. Annales : thèmes du domaine `proba`.
Termes exclus par chapitre : fragments (« mutuellement) indépendantes », « de norme », « degrés de liberté »,
« dans tous les »), « sachant », « loi » (ch. 6), « pour tout », et les formes abîmées « presque sßr(ement) »,
« cid:224) … ». Pas de Python.
Symboles validés le 24 nov. (variantes A) : repris `partition` (ch. 1), `arbre` (ch. 2), `binomiale` (ch. 3),
`polaires` (ch. 7), `convergence` (ch. 8), `lgn` (ch. 9) ; nouveaux `densite` (ch. 4 : N(0, 1), x ↦ 12 + 3,3x,
y = 20 − 15 e^{−x²/2}, aire f2 entre −1 et 0,8), `nuage` (ch. 5 : dix points f1 et leur droite des moindres carrés,
pente −0,67 en coordonnées SVG), `moyennecercle` (ch. 6 : φ(t) = E[e^{itX}] comme barycentre de quatre points du cercle
de rayon 9, aux angles 15°, 75°, 120°, 160°, barycentre (11,52 ; 6,53)) et `niveaux` (ch. 10 : trois ellipses f3, f2,
f1 de demi-axes 10 × 5,2, 6,6 × 3,4, 3,2 × 1,65, tournées de 35°). Écartées : venn, esperance, fubini, domine, tcl.
Générateur : scratchpad `pr/sym.py`.

### 70. Exercices de l'UE Probabilités (24 nov. 2026)

`f-l3-pr-01` à `f-l3-pr-10` (18, 21, 18, 18, 22, 12, 16, 21, 29, 17 exercices : 192 ; 45 figures), reçus en deux lots,
`outils/meta_l3_pr_01.py` à `10.py` (nœuds des graphes `proba`, `fourier`, `mes`, `cv-changement`), PDF
`documents/exercices/l3/probabilites_chapNN_<slug>_{enonce,corrige}.pdf` (slug du fichier reçu, différent de celui du
cours pour les feuilles 2, 6 et 9), champ `exercices` des chapitres `l3-pr-NN`, nouveauté du 24 nov.,
`exercices_cours.py` relancé. Aucun avertissement de conversion.

Sources : nouvelles notes de travail retirées par `source_lisible` — parenthèses « (M1, gardé …) », « (déplacé vers… »,
« (décision du 24/11 …) », « (par renvoi à …) », « (statistique, L3) » ; parties « V9 et V26 sont le même exercice »,
« l'application finale est à l'exercice 10 », « …, même modèle », « ; la simulation … n'est pas reprise » ; le devoir
en temps libre de lycée de l'auteur (document non consultable) est retiré comme les documents photographiés.
« TD vecteurs discrets » devient « Annales ESCP-HEC (TD « Vecteurs aléatoires discrets ») », forme donnée par l'auteur
ailleurs dans la même feuille ; « Bordeaux TD4 ex. 8 » est normalisé. 191 sources affichées (l'exercice 6.12 n'avait
que le devoir de lycée). Seuil de la règle `$\boxed{…}$` → formule centrée abaissé de 28 à 24 caractères visibles :
`\boxed{\mathbb{E}[X] = (1 - p)\Big(20 - \frac{20}{3}\Big) = \frac{40(1 - p)}{3}}` (27) débordait de 3 px sur téléphone
(exercice 4.3) ; six formules de ces feuilles passent en display. Rendu : 384 vues (ordinateur clair, téléphone
sombre) sans débordement ni erreur KaTeX ; 45 figures vérifiées en sombre. Contrôle des mots : seules des coupures.

**Rappel en attente** : prompt Annales pour les chapitres `l3-pr-*` et les feuilles `f-l3-pr-*` (avec `l3-sa-*`,
`l3-in-*` si la conversation Annales ne les a pas encore traités).

### 71. Thèmes d'annales des Probabilités (24 nov. 2026, soir)

Listes `annales_themes` de `l3-pr-01` à `10` remplacées par celles de la conversation Annales (proposées par un agent,
relues par un second ; thème principal en tête) : `crible`, `esperance-queue`, `projection-orthogonale`,
`matrices-symetriques-positives`… ajoutés, `modeles-urnes` passé du ch. 1 au ch. 2, `inegalites-probabilistes` retiré du
ch. 8. Ids vérifiés dans `annales-themes.yaml` (forme `{id: …}`). Le commit d7b79e4 de la conversation Annales, qui avait
modifié elle-même ces listes pour `l3-in-*` et `l3-sa-*`, a été relu : rien à reprendre. Désormais elle passe par des
propositions, et la conversation Cours les reporte. Construction sans avertissement sur les programmes des annales.

### 72. Licence 3 : UE Espaces de Hilbert et séries de Fourier (25 nov. 2026)

UE `l3-s6-hf` (semestre 6, 81 p., sans fiches), chapitres `l3-hf-01` à `l3-hf-08` : espaces préhilbertiens ; espaces de
Hilbert et projection ; bases hilbertiennes, Parseval ; dualité, adjoint, théorème ergodique ; séries de Fourier dans
$L^{2}$ ; convergence ponctuelle ; transformation de Fourier sur $L^{1}(\mathbb{R})$ ; sur $L^{2}(\mathbb{R})$ (Plancherel,
Heisenberg, Shannon). PDF `documents/cours/l3/hilbert_fourier_chapNN_<slug>.pdf` (slugs en minuscules : `series_fourier_l2`,
`transformation_fourier_l1`), cours complet `documents/ue/l3/hilbert_fourier_cours_complet.pdf`. Mêmes conventions qu'aux
§59, §66, §69. Théories : `f-hilbert`, `f-evn`, `f-bases-hilbertiennes`, `f-riesz`, `f-operateurs` (graphe `anf`) et les
nœuds `fo-*` des séries et de la transformée de Fourier. Le chapitre 3 admet, avec le lemme de Zorn, l'existence d'une base
hilbertienne dans le cas non séparable (le résumé le dit). Prérequis de l'UE [mp-10, mp-11, mp-04] ; « À revoir avant » par
chapitre. Activité : produit-scalaire → ch. 1. `annales_themes` : listes de la conversation Annales reportées le 25 nov. (commit 26b4874 de son côté ; `transformees`
retiré des ch. 7 et 8, ajouts `projection-convexe`, `adjoint-normaux`, `theorie-ergodique` au ch. 5, `integrale-gauss`,
`inegalites-fonctionnelles`). Termes exclus : 18 fragments par chapitre (ch. 2, 3, 6, 7, 8).
Symboles validés le 25 nov. : repris `plan` (ch. 1, comme mp-10), `hyperplan` (ch. 4, comme l3-cd-03 : forme linéaire
de Riesz), `creneau` (ch. 5, comme mp-11) ; nouveaux `projconvexe` (ch. 2 : disque de centre (9, 14) et de rayon 7, point
(21, 4), projeté (14,38 ; 9,52) calculé ; le nom `convexe` était pris par ma-09), `parseval` (ch. 3 : carrés 1/n², n = 1…6,
empilés en f1/f2 à côté d'une colonne f3 de même hauteur, leur somme 1,4914 ramenée à 18), `dirichlet` (ch. 6 : noyau
D₂(x) = sin(2,5x)/sin(x/2) sur [−π, π], maximum 5, minimum −1,25), `sinc` (ch. 7 : sin t / t sur [−2π, 2π]) et
`incertitude` (ch. 8 : gaussiennes de σ = 1,5 et 6, de hauteurs 16 et 4, donc de même aire). Écartées : `projection`,
`orbite` (rotation irrationnelle), `echantillons`. Générateur : scratchpad `hf/sym.py`.
Signalé : sur téléphone, le titre court de l'en-tête affiche le LaTeX brut (« L^{2} ») des titres à formule, comme pour
`l3-in-08` ; c'est l'en-tête du domaine apparence.

### 73. Exercices de l'UE Hilbert et Fourier (25 nov. 2026)

`f-l3-hf-01` à `f-l3-hf-08` (11, 11, 8, 18, 16, 15, 12, 7 exercices : 98 ; 42 figures, dont des pgfplots), reçus en deux
lots, `outils/meta_l3_hf_01.py` à `08.py`, PDF `documents/exercices/l3/hilbert_fourier_chapNN_<slug>_{enonce,corrige}.pdf`
(slugs en minuscules, `series_fourier_l2`, `transformation_fourier_l1`). Titres des feuilles = titres des chapitres de
`cours.yaml` (ceux des sources contiennent `\R`). Champ `exercices` des chapitres, nouveauté du 25 nov.,
`exercices_cours.py` relancé. Aucun avertissement de conversion ; 98 sources affichées.

`tex2exos.sources` : une ligne de commentaire continue aussi la source quand la précédente ne finit pas par un point et
qu'elle n'est pas une note (« Mot : … ») — « Mathovore, exercices » / « L3, exercice 7 » était coupé. `source_lisible` retire
aussi « conservé au ch. N ».

### 74. `\everymath{\displaystyle}` : style affiché des formules en ligne (25 nov. 2026)

Remarque de l'auteur : les formules en ligne de ses PDF sont en style affiché (grand Σ à bornes dessous, fractions pleines),
celles du site en style réduit. Cause : le préambule des feuilles de Licence (énoncés et corrigés, sauf les énoncés de Calcul
différentiel) et des corrigés MPSI 10 à 22 et MP 1 à 17 contient `\everymath{\displaystyle}`, que `tex2exos` ignorait. Les
énoncés MPSI et MP, les corrigés MPSI 1 à 9, le lycée, les Maths approfondies et Galois ne l'ont pas.

`tex2exos.style_affiche` (appelée dans `Conv.jeton` pour les formules en ligne quand le préambule contient la ligne) : au
niveau principal de la formule, `\frac`/`\binom` → `\dfrac`/`\dbinom`, et les grands opérateurs avec leurs bornes
(`\sum`, `\int`, `\lim`, `\max`, `\bigcup`…) → `\mathop{\displaystyle …}` ; exposants, indices, arguments de fractions et
textes inchangés, comme sous `\displaystyle`. **Pas de `\displaystyle` en tête de formule** : KaTeX en fait alors un seul
bloc insécable, et 21 exercices débordaient sur téléphone. Les 72 feuilles en ligne ont été traitées par un script
(scratchpad `ds/ds.py`, même fonction, sans reconversion : métadonnées et sources intactes) — 35 feuilles de Licence en
entier, les corrigés de `f-l3-cd-*`, `f-ma-10` à `22` et `f-mp-*` ; environ 11 700 formules, résultat identique à une
reconversion (vérifié sur `f-l3-hf-05`). Test téléphone des 1 957 exercices touchés : un seul débordement nouveau
(`mp-14-10`, question 2 du corrigé, fraction de 49 caractères), passé à la main en formule centrée (à refaire si l'on
reconvertit cette feuille). 20 débordements sur téléphone existaient déjà avant (ma-10-26, ma-18-23, ma-18-56, ma-20-34,
54, 57, 63, ma-21-20, 75, 87, 88, 96, 109, ma-22-28, 30, mp-10-07, 38, 47, l3-cd-06-14, l3-cd-07-07) : signalés, non traités.

### 75. Grands thèmes des exercices (26 nov. 2026)

Remarque de l'auteur : avec le seul filtre « probabilités », la rubrique Exercices ne montrait que la Première, la Terminale
et la Maths Sup. Les thèmes sont les mots-clés des feuilles, fins et propres à chaque feuille (1 122 thèmes distincts).
`construire.py` (bloc des rubriques, après la normalisation des `mots_cles`) ajoute désormais à chaque exercice le grand
thème de chacun de ses nœuds : table `THEME_GRAPHE` (graphe qui contient le nœud → thème : probabilités, algèbre linéaire,
dérivation, suites, intégration, arithmétique, polynômes, nombres complexes, structures algébriques, topologie, calcul
différentiel, équations différentielles, analyse de Fourier, trigonométrie, exponentielle et logarithme, continuité, analyse
asymptotique, séries entières, ensembles et applications, logique, théorie de Galois, géométrie différentielle…), et
exceptions par nœud `THEME_NOEUD` (les nœuds `c-` des complexes et de la continuité sont séparés par leur graphe ; produit
scalaire, espaces de Hilbert, sommes, récurrence, dénombrement, séries ; les fonctions caractéristiques comptent en analyse
de Fourier et en probabilités). Au lycée, l'algèbre linéaire devient « vecteurs ». Rien n'est écrit dans les feuilles : une
nouvelle feuille reçoit ses grands thèmes à la construction. Résultat : « probabilités » 581 exercices (Seconde 58, Première
36, Terminale 92, expertes 20, MPSI 92, MP 88, Licence 192, Python 3). **Un nouveau graphe de l'édifice employé par des
exercices doit être ajouté à `THEME_GRAPHE`**, sinon ses exercices n'ont pas de grand thème.

### 76. Licence 3 : UE Géométrie différentielle (26 nov. 2026)

UE `l3-s6-gd` (semestre 6, 70 p., sans fiches), chapitres `l3-gd-01` à `l3-gd-05` : courbes de $\mathbb{R}^{n}$ ;
sous-variétés de $\mathbb{R}^{n}$ ; surfaces, formes fondamentales et courbures ; géodésiques et Theorema egregium ;
formes différentielles. PDF `documents/cours/l3/geometrie_differentielle_chapNN_<slug>.pdf` (slugs `courbes`,
`sous_varietes`, `surfaces_courbures`, `geodesiques_egregium`, `formes_differentielles` ; PDF `…_apercu` reçus,
renommés), cours complet `documents/ue/l3/geometrie_differentielle_cours_complet.pdf`. Mêmes conventions qu'aux §59, §66,
§69, §72 (résumés d'après les bilans, sans l'introduction historique ; pages relevées sur les titres > 13 pt). Théories :
graphes `edo-courbes` (`cb-*`) et `edo-surfaces` (`sf-*`), nœuds `gd-*` de `geod`, `cdiff-lagrange`, `v-formes-alternees`,
`v-algebre-exterieure`. Seuls des rappels sont admis (Cauchy-Lipschitz avec paramètre, inversion locale) ; pas de choix.
Prérequis de l'UE [l3-cd-03, mp-17, mp-07] ; « À revoir avant » par chapitre (ma, mp). Aucune activité ne s'y rattache.
`annales_themes` : listes de la conversation Annales reportées le 26 nov. au soir (son commit 756b929 ; proposées par un
agent, relues par un second) : ch. 1 longueur-courbure, arcs-parametres ; ch. 2 sous-varietes, extrema-lies, inversion-locale ;
ch. 3 courbes-surfaces, sous-varietes ; ch. 4 courbes-surfaces, calcul-variations ; ch. 5 formes-differentielles,
topologie-algebrique (calcul-differentiel, formes-quadratiques, equations-differentielles retirés : employés, non exposés). Pas de Python.
`THEME_GRAPHE` : `edo-courbes` et `edo-surfaces` → « géométrie différentielle » (sinon ces nœuds, rangés sous `edo`, seraient
comptés en équations différentielles). Termes exclus par chapitre : côtés et sphère (étiquettes de figure), selle, pour tout,
différentielle (rouge d'insistance), « Rappel (admis) : Cauchy-Lipschitz… », -tenseur.
Symboles validés le 26 nov. (toutes variantes A), tous nouveaux : `osculateur` (ch. 1 : y = 4 + 0,11(x − 12)², cercle
osculateur en x = 15, rayon 7,82, centre (10,69 ; 11,52), calculés), `sphere` (ch. 2 : sphère, équateur en pointillés, plan
tangent en un point de la face avant, vu en projection orthogonale), `normales` (ch. 3 : calotte y = 9 + 0,1(x − 12)² et
normales unitaires en x = 5,5, 12, 18,5), `grandcercle` (ch. 4 : grand cercle en ellipse de demi-axes 9,5 et 3,42 tournée
de −22°, moitié arrière en pointillés, deux points) et `lacet` (ch. 5 : plan privé de l'origine en f3, `fill-rule="evenodd"`,
lacet orienté autour du trou : la forme angle, fermée et non exacte). Écartées : `frenet`, `hyperplan`, `surface`,
`parallelogramme`. Générateur : scratchpad `gd/sym.py`. Préparé sur la branche `ue-geometrie-differentielle`.

### 77. Corrigés révisés de l'UE Hilbert et Fourier (26 nov. 2026)

L'auteur a renvoyé les huit corrigés (.tex et PDF). Changement principal : la macro `\etape{N.}` (rendue « ▹ *N.* »)
devient `\qu{N.}` (`\par\smallskip\noindent\textbf{#1}~`, rendue « **N.** »), avec quelques formules passées en display.
Reconversion des huit feuilles avec les énoncés et leurs PDF inchangés : énoncés, sources, pages et métadonnées identiques
à l'ancienne version, sauf `types` de `l3-hf-02-11` (le méta proposait « Problème » en plus), remis à l'ancienne valeur.
Les 42 figures des corrigés changent d'empreinte (préambule modifié) : anciennes retirées, nouvelles versées (contenu
identique, git les voit comme des renommages). Le PDF du corrigé 6 passe de 10 à 11 pages. 196 vues sans débordement.
Le commit des PDF de ces corrigés a emporté aussi les 27 figures TikZ des feuilles de Géométrie différentielle (§78),
convertie juste avant : elles n'ont été citées qu'au commit suivant.

### 78. Exercices de l'UE Géométrie différentielle (26 nov. 2026)

`f-l3-gd-01` à `f-l3-gd-05` (20, 20, 12, 13, 16 exercices : 81), `outils/meta_l3_gd_01.py` à `05.py` (nœuds `cb-*`,
`gd-*`, `cdiff-lagrange`, `sf-*`, `v-formes-alternees`, `v-algebre-exterieure`, `c-dalembert`, `ta-homotopie`), PDF
`documents/exercices/l3/geometrie_differentielle_chapNN_<slug>_{enonce,corrige}.pdf` (slugs des fichiers reçus : `courbes`,
`sous_varietes`, `formes_fondamentales_courbures`, `geodesiques_theorema_egregium`, `formes_differentielles` ; celui du
chapitre 3 diffère de celui du cours). Titres des feuilles = titres des chapitres. Champ `exercices` des chapitres,
nouveauté du 26 nov., `exercices_cours.py` relancé. Le paragraphe de notations n'est pas repris (règle du §37).

**Figures `\input{py/…}`.** Dix figures des corrigés (ch. 2 : parapluie de Cartan, hyperboloïde, Möbius, hélicoïde ;
ch. 3 : loxodromie sur la sphère, triangle de l'octant, caténoïde → hélicoïde, paraboloïde hyperbolique ; ch. 4 : tore et
caténoïde avec géodésiques) lisent des fichiers `py/*.tex` produits par un script de l'auteur et non transmis (13 fichiers).
Elles ont été découpées dans le PDF du corrigé : boîte des tracés relevée par pdfplumber (regroupement vertical des
courbes et traits), élargie aux étiquettes (`Oz`, `y`), page recadrée par pypdf puis `pdftocairo -svg`, et posées à la
place de « La figure est dans le PDF de la feuille » dans l'ordre (script scratchpad `gdx/rogner.py`). Les figures du ch. 4
sont lourdes (≈ 800 Ko chacune, surfaces ombrées). À refaire à toute nouvelle version de ces corrigés, ou demander à
l'auteur les fichiers `py/`.

**Sources** (`tex2exos.source_lisible`, 26 nov.) : « liste N (Bordeaux 2016) » devient « Bordeaux 2016, feuille N » (« feuille » plutôt que « liste » : demande de l'auteur, 26 nov.),
l'attribution valant pour les autres listes de la feuille (clé `__liste__` de `attrib`) ; les parties « manuel (photos) »
(manuel photographié, sans titre), « création(s) » et les fins de note commençant par « on … » sont retirées, ainsi que
les parenthèses qui parlent du cours, de doublons, de photos, de bonus, d'hypothèses ajoutées ou de parties non reprises.
Restent « Bibmath, … », « examen du 25/04/2016 », « devoir surveillé du 18/03/2016 » tels quels. 54 sources affichées
sur 81 exercices (les autres sont des créations ou ne citent que le manuel).

### 79. Figures `py/` intégrées par l'auteur (26 nov. 2026, soir)

À la suite de la remarque sur les fichiers `py/`, l'auteur a renvoyé les corrigés de Géométrie différentielle (ch. 2, 3,
4) et celui d'Intégration (ch. 2) avec le contenu des fichiers `py/*.tex` recopié dans le .tex (entre « % --- debut de
py/… (insere) » et « % --- fin de py/… »), sans autre changement. Les onze figures (dix de Géométrie différentielle,
découpées jusque-là dans le PDF, §78 ; celle des ensembles K₀ à K₄ d'Intégration, recalculée à la main, §63) sont
désormais compilées depuis la source comme les autres. Seuls les chemins des figures ont changé dans les feuilles :
les retouches à la main de `l3-gd-02-04` et `l3-gd-02-11` sont gardées ; le script de découpe n'a plus lieu d'être.
Au passage, cinq sources des feuilles d'Intégration et une de MPSI gardaient des `~` autour des guillemets
(« «~clan~» ») : remplacés par des espaces fines insécables, comme le fait `tex2exos` depuis le 23 nov.

### 80. Images d'aperçu de la Licence 3 ; `texSimple` et les relations (26 nov. 2026, soir)

Signalé par la conversation À propos : 64 pages de Licence 3 (32 cours, 32 feuilles, UE `sa`, `pr`, `hf`, `gd`…)
n'avaient pas leur image d'aperçu et montraient celle de leur rubrique au partage. Images fabriquées (64, et les deux
pages de niveau `niveau-l3` mises à jour), construction à « 2233 sur 2233 ». L'étape est désormais inscrite aux
procédures §21 et §22 (point 5).
`lecture-cours.mjs`, `texSimple` : `\mathrel{…}` est remplacé par son contenu et les relations niées (`\not\subset`,
`\not=`…) par leur signe (table `TEX_NON`, la même que `texteTexLisible` de `rendu.mjs`) ; la description de
`exercices/l3-in-02-10` disait « x mathrel R y », elle dit « x R y ». Les « mathrel » restant dans les pages de lecture
sont dans les annotations TeX du MathML de KaTeX, pas dans le texte.
