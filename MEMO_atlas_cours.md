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
4. Contrôle de la conversion (et non du contenu, qui n'est pas relu ici, voir section 19) : aucun
   avertissement de l'outil (corrigé manquant, étoiles différentes, image introuvable), numéros
   consécutifs, pages trouvées, aucune commande LaTeX ni aucun jeton `@@…@@` hors des formules ou dans
   les blocs ```tableau, sources toutes retrouvées ; comparaison des mots de chaque énoncé et corrigé
   avec le texte du PDF dans les deux sens (seuls doivent manquer les en-têtes, les pieds de page, les
   césures et les étiquettes des figures) ; enfin regarder sur le site les tableaux, les figures et
   les images, en clair et en sombre, sur ordinateur et sur téléphone.

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

### 47. Niveau Python – Lycée et atelier Python (13 nov. 2026)

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
