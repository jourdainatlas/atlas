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
  numérotés : ils restent dans les PDF et ne sont pas sur le site.
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
   d'un niveau à l'autre), `pdf`, `pages` (lu par `pdfinfo`), `statut: depose`. Préfixes : `s-` Seconde, `p-`
   Première, `t-` Terminale, `me-` Maths expertes, `ap-` Maths approfondies.
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
