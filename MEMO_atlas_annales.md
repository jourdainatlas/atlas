# Mémo ATLAS — complément : rubrique Annales

> Complète `MEMO_atlas.md` (sections 0 à 16) ; sections propres : 17, 18, 27, 44, 45, à lire avec lui. Ce mémo appartient à la conversation
> « Annales » : elle seule le modifie (voir `MEMO_atlas.md`, section 0). La version du dépôt fait foi ;
> la copie du projet Claude en est le reflet.

### 17. Annales et moteur de recherche (26-27 oct. 2026)

**Grille.** `rubriques/annales.yaml` : familles `ingenieurs` (X-ENS, Mines-Ponts, Centrale, CCINP, e3a ; MP, MPI dès 2023, PC, PSI) et `enseignement` (CAPES externe, CAPES bac+3 dès 2026, agrégation externe, agrégation interne ; agrégation spéciale et troisième concours exclus). Sessions 2011 à 2026, 562 cases pour 542 PDF distincts. Chaque case porte `sujet`, `rapport`, `source: {nom, url}`. Règles de l'auteur : un clic ouvre le PDF tel qu'il est publié sur le site officiel ; vmaths.fr seulement à défaut de source officielle ; Mines-Ponts 2014-2025 hébergés depuis les ZIP officiels (`documents/annales/AAAA/mines-ponts/`), source citée ; pas de corrigés pour les concours (le baccalauréat, §44, en a). Grille coulissante avec curseur, vue Grille par défaut (aussi sur téléphone), vue Liste, fiche latérale « Contenu » par sujet (`#annales/sujet/<slug>`), présentation de la rubrique repliable.

**Moteur.** Vocabulaire `rubriques/annales-themes.yaml` : 10 domaines (l'analyse en quatre : analyse réelle ; séries de fonctions et analyse complexe ; calcul différentiel et équations différentielles ; analyse fonctionnelle et mesure, depuis le 27 oct. 2026), 240 thèmes, thèmes fins rattachés par `parent:` à un thème large, chacun relié à des nœuds de l'édifice (`noeuds:`) et muni de synonymes. Index : `rubriques/annales-index/AAAA.yaml` (un fichier par session, 2 411 parties au total pour 542 sujets), fusionné par `construire.py`, écrit par `rendu.mjs` dans `site/annales-index.json` et chargé à la demande. Chaque sujet : `cle`, `sujet` (URL), `titre`, `resume`, `pages`, `blocs` (nom, pages PDF, 1 à 4 thèmes principaux, au plus 5 secondaires, 2 à 8 mots-clés). Champs nommés `nom`, `apercu`, `blocs` pour éviter le rendu Markdown de `rendu.mjs` ; jamais `[[` dans un texte (lien de lexique) ; titres à virgules entre guillemets. Les PDF de devenirenseignant forcent le téléchargement : pas de `#page=`.

**Chaîne d'étiquetage** (à refaire pour une nouvelle session) : texte page par page (pdftotext, OCR tesseract fra+eng en secours, rendu en image dès que les formules sont abîmées) ; un agent étiquette un lot d'une douzaine de sujets selon une consigne écrite (lecture intégrale, jamais d'après le titre) ; un second agent, indépendant, relit chaque bloc et chaque formule des aperçus et produit un fichier de corrections ; un script fusionne et valide (ids, limites, pages, aucun sujet manquant). Les relectures ont corrigé de 21 à 67 points par session, surtout des formules et des affirmations d'aperçu trop fortes, et des thèmes nommant un théorème non utilisé. Un thème fin ne se pose que si l'objet est réellement étudié ou utilisé.

**Projet Claude.** Les fichiers d'index par année ne sont plus recopiés dans le projet (place) : la référence est le dépôt GitHub.

### 18. Coexistence avec la conversation « Cours » (27 oct. 2026)

La conversation Annales n'écrit que dans son domaine (`MEMO_atlas.md`, section 0, point 1). Les
fonctionnalités de la rubrique qui exigent de toucher aux fichiers communs (`construire.py`,
`rendu.mjs`, `gabarit.html`) s'y font par remplacements locaux, dans les fonctions et blocs propres aux
annales (`pageAnnales` et ses auxiliaires, vérifications des annales dans `construire.py`, écriture de
`annales-index.json` dans `rendu.mjs`), après `git fetch` et `git rebase` sur `origin/main`. Les
fichiers volumineux de la rubrique (PDF de `documents/annales/`) sont versés dans des commits séparés
du code, pour qu'un éventuel retour en arrière n'emporte pas le travail de l'autre conversation.

**Hébergement OVHcloud (10 nov. 2026, `MEMO_atlas_apropos.md` §64).** Le site est servi par OVHcloud ; le
dépôt reste la source. Pour suivre une publication : c'est le job `ovh` de « Publier ATLAS » qui doit
réussir (`publier` = GitHub Pages, gardé en secours) ; une publication n'annule plus la précédente et peut
rester « queued » derrière celle d'une autre conversation. Ne jamais toucher `outils/publier_ovh.py`,
`identite/htaccess-ovh` ni le job `ovh` (domaine À propos – apparence). La limite de 1 Go reste à respecter
tant que Pages sert de secours (site construit : 320 Mo, dont 34 Mo de PDF Mines-Ponts). Vérifié sur le
nouvel hébergement le 10 nov. : PDF (application/pdf), `annales-index.json`, `katex.min.js` et moteur
(formules composées, aucune erreur).

### 27. Formules des fiches en LaTeX (27 oct. 2026)

**Mécanisme.** Dans `rubriques/annales-index/AAAA.yaml`, une formule de l'aperçu (`apercu`), d'un nom de
partie (`nom`) ou d'un mot-clé (`mots`) s'écrit entre `$…$` (en ligne seulement, pas de `$$`). Un sujet
sans `$` s'affiche comme avant. `rendu.mjs` compile chaque formule avec KaTeX (erreur bloquante),
remplace chacune dans le texte par un repère `\uE000` + caractère privé (U+E100 + rang) et range dans le
sujet `F` (source), `Ft` (texte pour la recherche) et, pour l'aperçu à fichier unique seulement, `Fh`
(HTML). Sur le site, `katex.min.js` (copié dans `site/`, empreinte `?v=`) est chargé avec l'index et
compose les formules à l'affichage (`formuleAnn`, `annalesF` dans `gabarit.html`) : composer à la
construction ajouterait ~23 Ko par sujet, contre ~0,7 Ko ainsi. Une formule de 40 caractères au plus,
une parenthèse ouvrante qui la précède et la ponctuation qui la suit ne se coupent pas en fin de ligne
(classe `f-ann`). La recherche porte sur le texte, formules remplacées par `Ft`.

**Panneau des thèmes (27 oct. 2026).** Les domaines s'affichent en colonnes équilibrées (`columns: 3 260px`, un
domaine ne se coupe pas : `break-inside: avoid`) au lieu d'une grille à rangées alignées ; avec l'analyse
scindée en quatre, la hauteur du panneau passe de 1 674 à 1 120 px sur ordinateur, sans vides. Ordre des
domaines : algèbre, algèbre linéaire, arithmétique, les quatre d'analyse, probabilités, géométrie,
numérique et combinatoire. Titres de domaine colorés selon la famille de l'édifice (champ `famille:`
des domaines dans `annales-themes.yaml`, variable `--c-<famille>`) : algèbre et algèbre linéaire en orange
(`alg`), arithmétique et numérique en bleu (`nb`), les quatre d'analyse et les probabilités en vert d'eau
(`ana`), géométrie en violet (`geo`) ; filet à gauche et soulignement de la même couleur. Audit WCAG AA du 9 nov. 2026 :
l'orange `--c-alg` en texte de 13 px donnait 3,5:1 en clair ; le texte des titres est désormais
`color-mix(in srgb, var(--dc) 72%, var(--encre))` (filet et soulignement inchangés). Contrastes calculés
sur `--surface` : clair 5,5 (algèbre), 7,3 (nombres), 6,6 (analyse), 8,2 (géométrie) ; sombre 8,5 à 9,7.

**Rubrique achevée (27 oct. 2026).** À la demande de l'auteur, la mention « En construction » est retirée :
plus de badge dans le menu du logo, et la note d'usage de la présentation (`annalesInfo`, classe `ann-info`)
remplace le bandeau `maquette`.

**Filtre des filières (28 oct. 2026).** Le menu des filières du moteur ne propose que celles de la famille
choisie (champ `filieres:` de la famille dans `annales.yaml`) : il disparaît pour l'enseignement, qui n'en a
pas, et une filière choisie auparavant est alors oubliée ; le bloc de recherche est refait au changement
de famille, la saisie est conservée. Une famille choisie fait apparaître un second menu (`ann-conc`, état
`etatRech.conc`) : « Toutes les écoles » et les cinq écoles pour les ingénieurs, « Tous les concours » et
les quatre concours pour l'enseignement (seuls ceux qui ont des sujets étiquetés) ; le filtre porte sur
les cases du sujet (`s.cases[].concours`), et le choix est oublié au changement de famille. Les nombres affichés après chaque thème (panneau des
domaines et « Préciser ») suivent les filtres (`compteAnnales`, mis en cache par jeu de filtres ; filtres
communs dans `passeFiltresAnn`) : ils comptent les parties où le thème est principal, dans les sujets
retenus ; un thème à zéro disparaît. Le bilan d'une recherche compte en plus les parties où il est
secondaire, d'où un nombre parfois un peu plus grand.

**Convention de saisie.** Intervalles à la française : `\left]-1, +\infty\right[` (sinon le « − » est
espacé comme une soustraction). Ensembles : `\mathbb{R}`, `\mathbb{R}_n[X]`, `\mathcal{M}_n(\mathbb{K})`.
Indices et exposants explicites (`D_n`, `\lambda_i p_i`, `u^q`). `\leqslant`, `\geqslant`. `\mathrm{d}t`.
Fonctions usuelles en romain (`\ln`, `\sin`, `\exp`, `\det`, `\operatorname{tr}`, `\operatorname{Ker}`).
Une lettre isolée qui désigne un objet mathématique se met aussi en formule (`$f$`). Dans un YAML entre
apostrophes, l'apostrophe se double : `$f''''(0)$` s'écrit pour f''(0).

**Chaîne de conversion.** Un agent ne réécrit pas les textes : il produit, par sujet, une liste de
remplacements `avant → apres` (formule linéaire d'origine → `$…$`), appliquée par un script qui exige
que chaque `avant` figure tel quel dans le champ visé ; le texte hors formules reste donc identique mot
pour mot. Un second agent relit chaque remplacement. Les notations ambiguës sont résolues sur le PDF
quand il est accessible (Mines-Ponts : dans le dépôt ; Centrale, devenirenseignant, e3a, X, vmaths : téléchargeables par `curl`
depuis la machine ; le site du CCINP ferme la connexion et doc-solus est refusé par le filtre, mais
WebFetch lit doc-solus quand l'adresse a été trouvée par WebSearch) ; à défaut, par le sens mathématique,
et un cas indécidable est laissé en texte et signalé. Le titre du sujet (`nom` au niveau du sujet) est couvert aussi. Consignes des deux agents : `outils/annales_formules_consignes.md`. Session 2023 convertie le 27 oct. 2026 (348 remplacements et 10 titres ; relecture : 0 correction sur les lots, 3 titres oubliés ajoutés, 2 titres e3a rectifiés d'après l'aperçu, la fonction étant $x \mapsto \int_0^1 t^{t^x}\,\mathrm{d}t$).

**Bilan (27 oct. 2026).** Les seize sessions sont converties : 542 sujets, 6 502 formules, toutes
compilées par KaTeX à la construction et recomposées sans erreur dans le navigateur (contrôle sur
l'ensemble de l'index) ; `controler` ne trouve plus aucun reste de notation linéaire. Cinq sujets n'ont
aucune formule. Index : 1,43 Mo (334 Ko compressés). Chaque session : trois lots convertis en parallèle,
chacun relu par un agent indépendant, puis retouches à la main consignées et poussées session par session.
Les relectures ont surtout ajouté des formules oubliées et aligné des lettres sur les sujets ; elles ont
aussi révélé des erreurs de fond dans les aperçus et mots-clés, corrigées sur le sujet : K[X] au lieu de
ℂ[X] (X 2025), racines n-ièmes au lieu de p-ièmes (Mines PC 2025), √(2 ln 2) au lieu de 2√(ln 2) (ENS PC
2018), indice ℓ manquant (agrégation interne 2017), GL_n au lieu de GL_{2n} (Mines PSI 2015) et de
GL_{p+1}(ℝ) (Centrale PSI 2014), A(d) au lieu de Δ(d) avec normes infinies (agrégation 2013), K(t) et θ au
lieu de φ(t) et α (CCP PSI 2011), entre autres. Défauts de données réparés : mots-clés coupés à une
virgule interne (`min(x, t)`, `O(r, s)`, `⟨AX, X⟩`, recollés ; à surveiller lors d'un prochain étiquetage) et crochets
perdus (« Rn de X », « K de M », « R de A », « de 0 1 »). Le site du CCINP a fermé la connexion la plupart du
temps mais a répondu à certaines heures ; copies utiles : doc-solus (WebFetch), bibmath, cahier-de-prepa,
groupe-reussite, et vmaths pour 2011-2013. Choix laissés ouverts : les nombres du texte courant (« rang 1 »,
« dimension 2 ») restent en texte, les valeurs d'objets (« en $0$ ») passent en formule ; quand l'aperçu
et le sujet diffèrent par une notation équivalente, on garde l'aperçu, sauf erreur.

### 44. Famille « Baccalauréat » (10 nov. 2026)

**Demande de l'auteur.** Troisième famille à côté des écoles d'ingénieurs et de l'enseignement : sujets de
mathématiques du baccalauréat général pris sur les annales de l'APMEP (pages `Annee-2011` à `Annee-2026` et
`Epreuve-anticipee-2026`, liées depuis `Annales-Terminale-Generale` et `Annales-Premiere-Generale-Technologique`),
avec le lien du corrigé APMEP. Choix de l'auteur : toutes les sessions (normale, remplacement, secours) ; en
Première, la seule spécialité, sujets zéro compris ; un lien « Corrigé APMEP » à la place du rapport du jury.

**Inventaire (241 sujets, 241 corrigés, vérifiés en HTTP 200 le 10 nov. 2026 ; l'audit du 26 nov. a trouvé trois liens rompus depuis, voir la fin du mémo).** Terminale S 2011-2020 (série S, un sujet
par centre et par session ; 2020 : quatre sujets de septembre et décembre seulement), Terminale spécialité
2021-2026 (jour 1 et jour 2 ; 2021 : candidats libres, sujet zéro et les deux sujets du 15 mars, épreuves
annulées en janvier 2021 mais sujets publiés), Première 2026 (10 sujets de l'épreuve anticipée de spécialité
et 2 sujets zéro). Exclus : compilations annuelles, sujets « hors spécialité » et technologiques de Première.
Pondichéry 2017 : l'APMEP ne publie l'énoncé seul que dans sa compilation annuelle `Bac_S_annee_2017_DV.pdf` (pages 3 à 10) ; depuis l'audit du 26 nov. 2026, la case pointe vers elle (champ `page_debut: 3` de la grille, pages des blocs comptées dans la compilation) au lieu du corrigé qui reproduisait l'énoncé ; les versions
« obligatoire » de Nouvelle-Calédonie (mars) et de Polynésie (septembre) ne contiennent pas l'exercice de
spécialité ; l'aperçu le dit.

**Grille (`annales.yaml`, famille `bac`).** Lignes = centres (`bac-metropole`, …, `bac-centres-etrangers-2`
pour les groupes à sujet propre, `bac-entrainement` pour les sujets zéro et inédits), filières `Terminale`
et `Première`. Champs de famille nouveaux, lus par `pageAnnales` (remplacements ciblés dans `gabarit.html`) :
`annees_filiere` (Première : 2026 seul), `cases_sujets: true` (une case par sujet publié, pas par épreuve
déclarée ; ligne vide masquée), `court` sur chaque épreuve (N, R, U, 1, 2, S1, S2, R1, R2, 0, M1, M2, Z1, Z2 ;
légende générée sous la grille), `corriges: true` (liens « corrigés » ; champ `corrige_pdf` des sujets),
`sources` par filière (APMEP, dit une fois sous la grille et dans chaque fiche au lieu de chaque case),
`nom_filiere`, `nom_concours`, `tous_concours` (libellés du moteur : « Tous niveaux », « Tous les centres »),
`prefixe: Bac` (titres des pages de lecture et des résultats : un centre seul serait ambigu). Sujets :
`date` (page APMEP ; en-tête du PDF s'il précise ou si le nom du fichier le confirme ; mois seul si page et
PDF se contredisent : Asie 2011, Centres étrangers 2016, Antilles 2019 et 2020) et `lieu` (centres réunis
sous un sujet). `lecture.mjs` affiche le corrigé et la source de famille (remplacements ciblés). La carte
de l'accueil ne compte pas les centres parmi les concours.

**Fiches (`rubriques/annales-index/bac-AAAA.yaml`, 241 sujets, 1 101 blocs).** Un bloc par exercice, et par
variante au choix (spécialité ou non en série S, exercices A et B en 2021, partie « Automatismes » en
Première). Formules directement en `$…$`. Chaîne : textes page par page, 20 lots de 12 sujets, un agent
étiquette (lecture intégrale, formules vérifiées sur l'image), un second agent relit contre les PDF, puis
un troisième passage sur les 138 blocs QCM et vrai-faux des lots 1 à 16 (les lots 17 à 20 l'ont fait d'emblée) :
**aucun nom, mot-clé ou aperçu ne doit annoncer la réponse d'un QCM ou d'un vrai-faux** (« droites non
coplanaires » → « position relative de deux droites ») ; 196 formulations neutralisées. Relectures : 0 à 20
corrections par lot, surtout des aperçus trop forts ou faux (plans dits parallèles et perpendiculaires,
triangle dit rectangle, fonction dite solution d'une équation qu'elle ne vérifie pas, équation donnée au
mauvais plan) et des noms de points restés hors formule ; aucune erreur de découpage. Règles fixées en
cours de route : un thème fin en secondaire avec son thème large en principal est admis, jamais les deux au
même rang ; une annexe sur une page éloignée n'entre pas dans les pages du bloc (les lots 1 à 8 en ont
parfois inclus une) ; les noms de points et de figures se mettent en formule. Consignes et scripts
(inventaire, `valider.py`, `fusionner.py`) : dans le bloc-notes de la conversation ; la consigne est à
reprendre pour une session nouvelle.

**Thèmes ajoutés (7)** : `fonctions-exp-ln`, `trigonometrie`, `limites-fonctions` (fin de `continuite`),
`suites-arith-geom` (fin de `suites`), `second-degre` (fin de `polynomes`), `geometrie-espace` (fin de
`geometrie-euclidienne`), `automatismes` ; synonyme « arbre pondéré » ajouté à `conditionnement`. Index :
2,31 Mo (783 sujets étiquetés).

**Pour une session nouvelle.** Lire la page `Annee-AAAA` de l'APMEP (tableau : libellé, sujet PDF, corrigé PDF),
classer centre, jour, remplacement ou secours, vérifier la date sur l'en-tête du PDF, ajouter les lignes de
`sujets` (la grille suit sans autre changement), puis étiqueter selon la chaîne ci-dessus.

**Lignes repliables et champ `corrige_pdf` (10 nov. 2026, soir).** À la demande de l'auteur, chaque centre du
bac est une ligne fermée par défaut (champ de famille `lignes_repliables: true`) : un bouton « + » dans la
colonne des centres la déplie (« − » la replie), le « + » de l'en-tête déplie ou replie tout ; fermée, la ligne
montre une pastille verte par sujet (miniature des cases ; référence du sujet au survol ; un clic sur les
pastilles ouvre la ligne). Le bouton est à droite du nom du centre ; l'en-tête porte « tout ouvrir + » (le
texte disparaît sous 640 px) ; seule la pastille survolée s'éclaire ; colonnes étroites (96 px, 84 px sous
640 px, classe `grille-pli`) tant qu'aucune ligne n'est ouverte, 150 px dès qu'une l'est (8 années visibles
au lieu de 4 sur ordinateur) ; une phrase au-dessus de la grille explique le « + » (ce qu'il ouvre : sujets, corrigés, description du contenu) (état
`etatAnn.lignes`). Le lien du corrigé s'appelait
d'abord `corrige` : `rendu.mjs` met ce nom de champ en forme comme un texte riche (corrigés des exercices),
l'adresse devenait `<p>https://…</p>` et le lien menait à la page 404 du site. Le champ s'appelle désormais
`corrige_pdf`. Règle : un champ d'adresse ne prend jamais un nom de `RICHES` ou `COURTS` (`rendu.mjs`).

**Moteur : ordre des résultats et vocabulaire du lycée (12 nov. 2026, demande de l'auteur).**
*Ordre.* Dès qu'un filtre est posé (famille, centre ou école, filière ou niveau, période), les sujets
trouvés sont classés du plus récent au plus ancien (`dateSujetAnn` : l'année, précisée par le jour de
l'épreuve quand le champ `date` le donne ; à date égale, la pertinence) ; sans filtre, par pertinence. Un
lien sous le décompte bascule entre les deux (`etatRech.tri` : '', 'date', 'pertinence').
*Vocabulaire.* Audit : les 1 101 exercices du bac portaient 70 thèmes du vocabulaire prépa (« Dérivabilité »,
« Loi normale et vecteurs gaussiens », « Séries numériques », « Polynômes d'endomorphismes »…), dont une
quarantaine sur cinq exercices ou moins. Les thèmes ont maintenant un **vocabulaire** : domaines marqués
`vocabulaire: lycee` dans `annales-themes.yaml` (5 domaines, 19 thèmes larges et 32 thèmes fins, identifiants
`ly-…`, validés par l'auteur), famille `bac` marquée `vocabulaire: lycee` dans `annales.yaml`. Les blocs du bac
sont étiquetés **uniquement** dans ce vocabulaire. Chaque thème du lycée porte `proches` (thèmes généraux
correspondants) : sans filtre de famille, ou avec une autre famille, le moteur compte et cherche les
exercices du bac par ces correspondances (`thG`, `secG` calculés dans `indexAnnales`) ; avec « Baccalauréat »,
il n'affiche et ne reconnaît que les thèmes du lycée (`vocabAnn`, `themesPartie`). Un thème d'une fiche de bac,
cliqué, relance la recherche dans la famille du bac. L'aide du moteur donne alors des exemples de lycée.
Ré-étiquetage : brouillon automatique (correspondance des anciens thèmes), puis 10 lots de 24 sujets
ré-étiquetés d'après la fiche et le texte des exercices, chacun relu par un second agent (5 à 18 blocs
corrigés par lot) ; règles fixées en cours de route : géométrie plane → « Géométrie plane » seul (les thèmes
fins de l'espace ne s'y emploient pas) ; « Matrices de transition » seulement avec une matrice ou un graphe
probabiliste (un arbre à deux états répété relève des probabilités conditionnelles et des suites) ; un
algorithme qui occupe une partie entière de l'exercice peut être principal, une formule de tableur n'est pas
de l'algorithmique ; « Exponentielle et logarithme » principal quand exp ou ln est au cœur de l'étude,
secondaire comme outil ; dans les automatismes de Première, un thème passe en secondaire s'il porte au moins
deux questions. Consignes et scripts (`CONSIGNE_lycee.md`, `valider_ly.py`, `fusion_ly.py`) : bloc-notes de
la conversation ; une session nouvelle s'étiquette directement dans le vocabulaire du lycée.

**Moteur réglé sur la catégorie de la grille (12 nov. 2026, demande de l'auteur).** À l'ouverture, le menu de
catégorie du moteur est réglé sur celle de la grille (Écoles d'ingénieurs par défaut, `etatRech.famInit`) ;
choisir une catégorie en haut de la grille y règle aussi le moteur (centre ou école remis à « tous »,
filière gardée si elle existe dans la catégorie). Le menu du moteur reste libre ensuite ; « Effacer la
recherche » le ramène à la catégorie de la grille, et ce réglage par défaut n'est pas compté comme un filtre
pour l'affichage du bouton (`rechVide`). Il compte en revanche pour l'ordre des résultats : avec une
catégorie choisie, ils vont du plus récent au plus ancien.

### 45. Vue « Programme » : les programmes officiels reliés aux cours, exercices et annales (21 nov. 2026)

*Demande de l'auteur* : rendre visible le programme détaillé de chaque concours ou examen des Annales, et
relier chaque point aux cours, donc aux exercices, du site. Pilote : MPSI et MP (filière MP de la famille
« Écoles d'ingénieurs »). Suite prévue : MP2I et MPI, PCSI et PC, PSI ; baccalauréat (Première,
Terminale) ; CAPES et agrégations (l'agrégation externe se complétera au fil des cours de L3 et Master).

*Données.* `rubriques/annales-programmes.yaml` : la liste des programmes (`id`, `court`, `annee`) et
`filieres` : famille → filière (« * » pour une famille sans filières) → programmes, dans l'ordre des onglets.
Un fichier par programme, `rubriques/annales-programmes/<id>.yaml` : `intitule`, `source {nom, url}`,
`preambule`, `sections` [`intitule`, `periode`, `objectif`, `hors_programme`, `blocs` [`intitule`, `points`
[`contenu`, `precisions`, `demo`, `filieres`, `cours`, `ex`, `themes`, `note`]]]. Un point = une ligne de la
colonne « Contenus », dans l'ordre et avec les mots du texte officiel ; `precisions` résume la colonne
« Capacités et commentaires » ; `demo` reprend « non exigible » / « hors programme ». Liens : `cours` en
« chapitre:rang du sommaire » (à partir de 1, au plus 3), `ex` (au plus 6, du plus accessible au plus
difficile, seulement des exercices qui travaillent le point lui-même), `themes` (thèmes d'annales, au plus 3).
Point sans cours ni exercice : affiché « à venir ». Les noms de champs évitent ceux de `RICHES`/`COURTS`
(`titre`, `texte`…) et `noeuds`/`notions` (vérifiés par `verifie_rubrique`).

*Construction.* `construire.py` fusionne les fichiers et vérifie chaque renvoi (chapitre et rang de section,
exercice, thème, programme cité par `filieres`). `rendu.mjs` rend les textes en ligne (formules vérifiées par
KaTeX, repères `kx`) et écrit `site/annales-programmes/<id>.json` (chargé à l'ouverture de la vue).
`lecture.mjs` écrit une page de lecture indexable par programme, `/annales/programme/<id>/`, listée sur
`/annales/`.

*Écran* (`vueProgrammeAnnales` du gabarit, `etatPg`) : bandeau orange sous la barre de la grille
(`entreeProgramme`, seulement si la famille et la filière ont un programme ; d'abord un bouton à côté de
Grille et Liste, retiré à la demande de l'auteur car il élargissait la barre), onglets par année, bilan (points, points traités
sur le site, points cochés), **carte du programme** (une case par section, largeur = nombre de points,
teinte = part des sujets étiquetés de la filière dont une partie porte l'un des thèmes de la section,
`frequencePg`), recherche dans le programme (sans redessiner, `filtrerProgramme`), sections repliables.
Chaque point : case « je maîtrise » (localStorage `atlas-programme-maitrise`, clé `prog:s.b.p` — changer le
découpage d'un programme décale les cases cochées), liens Cours (ouvre le PDF à la page de la section,
`data-cours-page`), Exercices (`#exercices/ex/<id>`, numéro « chapitre.numéro » et étoiles ; l'index des
exercices est chargé seul, `chargerIndexExosPg`), Annales (thème + nombre de sujets de la filière ; un clic
règle le moteur sur la famille et la filière, `data-rq-fil` ; à côté, en pointillés, « N en tout » : tous les
sujets étiquetés, toutes familles, `data-rq-tous`, demande de l'auteur du 21 nov. ; un thème sans aucun sujet
est masqué, un thème sans sujet de la filière ne garde que ce second bouton). Depuis un cours ou un exercice, le bouton
« ← Retour au programme » ramène au point. Adresse : `#annales/programme/<id>` (aussi celle du bouton
Partager). Couleurs : celles des rubriques (cours vert, exercices violet, annales orange).

*Méthode suivie pour le pilote* (à reprendre pour chaque programme). 1) Transcription du texte officiel
(BO ; PDF fourni par l'auteur pour MPSI, lu par Exa et Parallel pour MP, le proxy refusant le téléchargement
direct du site du ministère) par un agent, relue contre le texte par un second agent indépendant (MPSI :
12 corrections ; MP : 8, dont une coquille du BO, « X′ = A′(t)X + B(t) » rétabli en $X'=A(t)X+B(t)$).
2) Liaison par lots de 50 à 120 points (catalogue des sections de cours et des exercices), chaque section de
cours vérifiée sur le texte du PDF du chapitre ; puis relecture indépendante de chaque lot (corrections
typiques : exercices qui ne font que se servir du point retirés, contre-exemples gardés seulement s'ils
éclairent le point, section où l'énoncé est démontré mise avant celle qui le rappelle, notes réduites à
« aucun exercice » supprimées — la page montre déjà l'absence). Bilan : MPSI 513 points, tous avec cours,
460 avec exercices (1 343 renvois) ; MP 330 points, tous avec cours, 305 avec exercices (967 renvois).
Consignes et scripts (`CONSIGNE_extraction.md`, `CONSIGNE_verif_extraction.md`, `CONSIGNE_liaison.md`,
`CONSIGNE_relecture_liens.md`, `valider_prog.py`, `valider_liens.py`, `fusion_prog.py`) : bloc-notes de
la conversation, à recréer d'après ce paragraphe. Quand un cours ou une feuille change de sommaire, la
construction signale les renvois devenus faux ; refaire alors la liaison du chapitre concerné.

**Audit du vocabulaire des thèmes et bac écarté des concours (21 nov. 2026, demande de l'auteur).** *Bac.* Le
moteur a un choix « Prépas et enseignement (sans le bac) » (valeur `*sup` de `etatRech.fam` : sujets de
vocabulaire général) ; les boutons « N en tout » de la vue Programme y renvoient et ne comptent que ces sujets
(`frequencePg('*sup')`). « Tous les concours et examens » garde le bac. *Audit.* Trois agents (algèbre ;
analyse ; probabilités, géométrie, numérique) ont confronté le vocabulaire aux programmes et aux 2 411 parties
des concours : 105 thèmes proposés (un doublon fusionné : 104), une centaine de thèmes corrigés (synonymes,
titres, parents : « Nilpotents, Jordan, Dunford » devient « Endomorphismes nilpotents » sous « Réduction », avec
Jordan et Dunford en fins ; « Fonctions usuelles » nouveau thème large de « Fonctions exponentielle et
logarithme », « Fonctions circulaires et trigonométrie », « Fonctions hyperboliques », « Fonctions circulaires
réciproques »), `graphes-denombrement` absorbé par `denombrement`. Liste validée par l'auteur. Les parties
proposées ont été relues par six agents indépendants sur le texte des sujets (retraits, rangs, oublis), puis
appliquées par script : thème fin principal à la place de son parent quand celui-ci est sur la partie, sinon
ajouté ; 1 032 ajouts, 785 remplacements du parent, 40 secondaires non posés faute de place (cinq au plus).
Règle confirmée : « principal » seulement si au moins une question étudie la notion elle-même ; une
application ponctuelle reste secondaire. Les thèmes des points des programmes ont ensuite été revus (MPSI :
141 points changés, MP : 72), chaque lot relu. Les nombres des boutons d'annales de la vue Programme comptent
désormais les parties où le thème est principal ou secondaire (`frequencePg(...).tout`, comme le moteur) ; la
teinte des sections ne compte que les principaux. Scripts (`fusion_themes.py`) et rapports : bloc-notes.

**Filières MPI, PC (21 nov. 2026) et règles de liaison pour les filières plus étroites.** MPI : mêmes programmes
que MP (MPSI et MP2I ont un texte commun, MP et MPI aussi) ; sigles d'onglet par filière (`court_filiere`).
PC : programmes de PCSI (BO spécial n° 1 du 11 févr. 2021, 418 points) et de PC (BO n° 31 du 26 août 2021,
224 points), transcrits puis relus (PC : 11 corrections, PCSI : 9 ; le PDF n'a pu être vu en image : colonnes de
« Extension aux suites C^k », « Exemples d'études… », « Système quasi-complet » (PC) et barre de « A et B̄ » à
contrôler un jour sur le PDF). Le site n'a pas de cours de PCSI ni de PC : les points renvoient aux cours de
MPSI et de MP, en partant des liens relus de MPSI et MP puis en retirant tout exercice dont une partie notable
sort du programme de la filière (trace, comatrice, Vandermonde, blocs, polynôme minimal, adjoint, nilpotents,
compacité, Abel radial, semi-convergence…), sauf si l'essentiel reste au programme et qu'aucun autre exercice
ne travaille le point ; alors une note signale les questions hors programme (cas des vrai-faux). Les notes
citent les exercices par leur numéro affiché (« exercice 13.46 »), jamais par leur identifiant interne. Un
thème posé sur aucune partie hors bac (`limites-fonctions`, `suites-arith-geom`, `second-degre`,
`geometrie-espace`, reliquats du bac) n'est pas employé. PSI : programmes de PCSI et de PSI (BO n° 31, arrêté ESRS2111748A, 255 points ; relecture : 1 correction), liés de même ; l'exercice de Maths expertes 3.22 reste le seul exercice élémentaire de Cayley-Hamilton (les autres passent par le polynôme minimal, hors programme de PSI).

**Veille des cours (21 nov. 2026, demande de l'auteur : actualiser les programmes quand de nouveaux cours
arrivent).** `rubriques/annales-programmes/reference-cours.json` garde, au moment de la dernière liaison, le
sommaire de chaque chapitre et le nombre d'exercices de chaque feuille. À chaque construction, `construire.py`
avertit (sans bloquer) : chapitres nouveaux, sommaires modifiés (un lien « chapitre:rang » pourrait viser une
autre section), feuilles nouvelles ou enrichies. La conversation Cours n'a rien à faire de plus que son travail
habituel. La conversation Annales, quand ces avertissements paraissent : `python3 outils/annales_programmes_bilan.py`
donne la liste de travail (points « à venir », points sans exercice, chapitres et feuilles en cause) ; un agent
relie les points des programmes concernés selon `CONSIGNE_liaison.md` (en priorité les points « à venir » et
sans exercice des sections qui touchent ces chapitres, et la vérification des liens vers un sommaire modifié),
un second agent relit, on fusionne, puis `--mettre-a-jour-reference` enregistre le nouvel état ; les
avertissements disparaissent. Les liens d'exercices étant des identifiants, une feuille renumérotée est déjà
signalée comme erreur par `construire.py` (exercice inconnu).

**Concours de l'enseignement et baccalauréat (21 nov. 2026).** *Écran.* Les quatre concours de l'enseignement
partagent une grille : choix validé par l'auteur, « bandeau + lien par ligne », lien par ligne retiré ensuite. La famille « enseignement » a une
filière « * » listant `capes`, `capes-bac3`, `agreg-ext`, `agreg-int` ; chaque programme porte `concours` (id du
concours dans `annales.yaml`). Le bandeau montre un bouton par programme (`pg-entree-multi`, `data-pg-ouvrir`).
Un lien « programme › » sous chaque ligne de la grille a été retiré à la demande de l'auteur (jugé inutile) ;
le bandeau, un `div` à `width: 100%`, déborde à droite sans `box-sizing: border-box`. Dans la vue, la carte et les nombres ne
comptent que les sujets de ce concours (`frequencePg(fam, fil, p.concours)`), et les libellés nomment le
concours plutôt que la filière. Onglets : `annee` seule (l'intitulé long n'y est plus). Bac : filière Terminale
→ `premiere2019` puis `terminale` (programme de 2019, valable jusqu'à la session 2027 ; un nouveau programme de
Terminale, arrêté du 26 févr. 2026, s'appliquera à la rentrée 2027) ; filière Première → `premiere2026` (arrêté
du 26 févr. 2026, BO n° 14 du 2 avr. 2026, en vigueur à la rentrée 2026). Les familles à vocabulaire propre (bac,
`ly-…`) comptent par `p.themes` (`propre` dans `frequencePg`). *Données.* `sans_lien: true` sur un point
d'organisation (CAPES bac+3, dernière section) : jamais « à venir », jamais compté. Blocs dont l'intitulé est
une lettre seule (« a) », texte de l'agrégation externe qui n'a pas de titres de paragraphe) : simple repère en
pointillés (`pg-bloc-lettre`). Numéros de section retirés des intitulés des agrégations (la case les affiche).
Exercices d'une feuille sans chapitre (Master) : « Galois 3 ». *Notes.* Après chaque fusion,
`notes_lisibles.py` (bloc-notes) réécrit les identifiants internes des notes (« ma-05:4 », « mp-03-50 ») en
« Maths Sup – MPSI, ch. 5, section 4 », « exercice 3.50 », puis on corrige la grammaire (« au Maths Sup » →
« dans Maths Sup », « de exercice » → « de l'exercice »). *Bilan* (outil de bilan) : CAPES 69 points / 0 « à
venir » ; CAPES bac+3 80 / 2 (les deux `sans_lien`) ; agrégation externe 358 / 32 ; agrégation interne 342 / 29 ;
Première 2026 90 / 6 ; Première 2019 67 / 5 ; Terminale 110 / 5. Les « à venir » du lycée tiennent à des
démonstrations absentes des cours (dérivée de ln, convexité, E(X)=np…), signalées à l'auteur ; ceux des
agrégations à des chapitres non encore écrits (quotients, dualité, connexité, angles inscrits, polytopes réguliers). Les options A, B, C de l'agrégation externe ne sont
pas transcrites : elles ne concernent que l'oral de modélisation, et les Annales ne portent que sur l'écrit.
Décisions de l'auteur (21 nov.) : polytopes réguliers laissés « à venir » malgré le triangle et le carré ;
lien vers les fractions rationnelles symétriques (Galois) gardé pour les polynômes symétriques ; exercice 11.10
(groupe affine de la droite) gardé en attendant d'autres. Chaque lot a été relu par un agent indépendant (agrégation externe, sections 1 à 4 : 30 corrections ;
interne, sections 1 à 6 : 50) ; rapports dans le bloc-notes.

**Boutons d'annales des concours de l'enseignement ; élagage du moteur (21 nov. 2026, signalé par l'auteur).** Un
bouton « Densité 11 Agrégation externe » envoyait au moteur la filière « Agrégation externe » (inexistante) :
aucun résultat. Le bouton porte désormais `data-rq-conc` (concours du programme) et `data-rq-fil` vide pour
une famille sans filière ; le moteur règle alors le menu des concours. Le moteur écartait aussi les sujets
dont le score était inférieur au cinquième du meilleur, y compris ceux qui portent le thème reconnu en
secondaire, si bien que le bouton annonçait plus de sujets que le moteur n'en montrait (11 contre 9) : un sujet
qui porte le thème reconnu en tête (ou l'un de ses thèmes fins), même en secondaire, n'est plus écarté. Le
moteur peut encore en montrer davantage (mots-clés). Bouton « Effacer la recherche » : en-tête centré
verticalement et 10 px d'écart avec le texte d'aide.

**Sujets dépliés sous chaque point (21 nov. 2026, demande de l'auteur).** Un clic sur la pastille d'un thème
(« Espaces vectoriels normés 43 MP » : `pg-ann` avec `data-pg-sujets` = le thème, `data-pg-fam`, `-fil`, `-conc`,
`-cible`, `-nt`) déplie sous le point (`pg-sujets`, `sujetsPointPg`) les 4 sujets de la filière, ou du concours,
dont une partie porte ce thème ou l'un de ses thèmes fins, en principal ou en secondaire (mêmes sujets que le
nombre de la pastille) ; un second clic referme, un clic sur l'autre pastille du point remplace la liste ; la
pastille ouverte est teintée (`aria-expanded`). Ordre : thème principal d'abord, du plus récent au plus ancien,
puis secondaire (marqué « thème secondaire ») ; par sujet, au plus deux parties (les principales s'il y en a),
lien vers le PDF à la page. Pied : « N autres sujets MP : tout voir dans le moteur de recherche › » (filière ou
concours), puis, plus sombre, « M sujets en tout, autres filières et concours compris : tout voir… » (`data-rq-tous`).
La pastille pointillée « M en tout » mène toujours directement au moteur ; une pastille sans sujet de la filière
aussi. (Premier essai, remplacé le même soir : un bouton « Voir les sujets » au bout de la ligne.) Limite
connue : deux points de même thème montrent la même liste.

**Première actualisation par la veille des cours (23 nov. 2026, demande de la conversation Cours).** Arrivée de
deux UE de L3 : Structures algébriques (`l3-sa-01` à `08`, 113 exercices) et les 227 exercices d'Intégration
(`f-l3-in-01` à `09`). Procédure suivie (à reprendre) : catalogue régénéré (`mesoutils/gen_catalogue.py l3`,
bloc-notes) ; liens actuels exportés par tranche de sections (`mesoutils/exporter_liens.py`) ; consigne
complémentaire `CONSIGNE_l3nov.md` (repartir des liens relus, priorité aux points « à venir » et sans exercice,
une section qui démontre passe devant celle qui rappelle, au plus 3 sections, notes devenues fausses
réécrites) ; trois agents de liaison (algèbre : agrég. externe §1-3, interne §3-4, CAPES ; intégration : agrég.
externe §7 et §10-11, interne §9-10 et §13 — numéros affichés), trois relectures indépendantes ; report dans
les YAML par `mesoutils/appliquer_liens.py` (ne touche que les points du lot ; vérifié sans effet sur un
export inchangé), puis `notes_lisibles.py` et les corrections de grammaire, puis
`--mettre-a-jour-reference`. Une relecture a découvert que les fichiers d'un agent de liaison étaient restés
identiques aux liens d'avant (bogue de son script) : elle a rejoué son journal de changements. **Toujours
comparer `lie/` à `actuel/` avant de relire.** Bilan : agrég. externe « à venir » 32 → 28, sans exercice
53 → 37 ; agrég. interne 29 → 26 et 53 → 37 ; CAPES : un exercice. Champ `annales_themes` des 17 chapitres
corrigé dans `cours.yaml` (remplacement ciblé, avec l'accord de la conversation Cours) d'après les deux
relectures (par ex. `probabilites-discretes` → `borel-cantelli` en l3-in-01, `galois` retiré de l3-sa-07 et
08, `convolution` ajouté en l3-in-09 ; `analyse-complexe` écarté de l3-in-05, la formule de Cauchy n'y étant
pas exposée). Affichage : l'UE est nommée dans les liens de L3 (« Licence 3 – Intégration, ch. 4 », exercice
« Int. 4.5 », table `UE_COURT_PG` / `UE_MOYEN_PG` du gabarit) et dans les notes (`notes_lisibles.py`).

**Probabilités de L3 (24 nov. 2026).** Même procédure pour l'UE Probabilités (`l3-pr-01` à `10`, 192 exercices ;
consigne `CONSIGNE_l3pr.md` : la section en langage probabiliste passe devant celle en langage de la mesure,
sauf point formulé en termes de mesure ; relire toute note « le site ne traite pas… »). Un agent de liaison
(agrég. externe §10-11, interne §13, CAPES §15, bac+3 §15-17, numéros affichés), une relecture (7 corrections,
dont un exercice rétabli au CAPES bac+3 : `ma-21-61`, seul sur la loi uniforme). Bilan : agrég. externe « à
venir » 28 → 25, sans exercice 37 → 34 ; agrég. interne 26 → 22 et 37 → 32. Synonymes de `loi-normale` enrichis
(théorème de Cochran, lois du khi-deux et de Student : un seul bloc hors bac s'y rattache, un thème propre ne se
justifiait pas). Le champ `annales_themes` des chapitres l3-pr n'a **pas** été modifié : la conversation Cours
demande désormais des propositions, qu'elle reporte elle-même dans `cours.yaml` (propositions relues remises à
l'auteur le 24 nov.). `notes_lisibles` fusionne désormais « ch. N, section A, …, ch. N, section B » en
« ch. N, sections A et B » (script ponctuel).

**Espaces de Hilbert et séries de Fourier (25 nov. 2026).** UE `l3-hf-01` à `08` (cours seuls, pas encore
d'exercices : la veille signalera les feuilles à leur arrivée). Même procédure (consigne `CONSIGNE_l3nov.md`),
un agent de liaison, une relecture (1 note réécrite). Agrég. externe : 18 points (topologie : projection sur un
convexe fermé, Riesz, bases hilbertiennes ; calcul intégral : Plancherel sort de « à venir », inversion,
Dirichlet, Fejér, Parseval dans L¹(T)) ; « à venir » 25 → 24 (l'espace de Schwartz reste absent du site).
Agrég. interne : 2 points. CAPES : rien. Synonymes ajoutés : « théorème de représentation de Riesz »
(`dualite`), « phénomène de Gibbs » (`convergence-fourier`), « inégalité de Heisenberg »
(`inegalites-fonctionnelles`), « principe d'incertitude » (`transformee-fourier`). Listes `annales_themes`
proposées à l'auteur (report par la conversation Cours). Libellés : « Licence 3 – Hilbert et Fourier »,
exercice « Hilb.-Four. ».

**Exercices de Hilbert et Fourier (25 nov. 2026, soir).** Les 98 exercices `f-l3-hf-01` à `08` reliés (agrég.
externe §4, §8, §10 ; interne §6, §10, numéros affichés), un agent puis une relecture (4 retraits, 4
remplacements, 2 ajouts ; `l3-hf-01-01`, sur une forme hermitienne, n'est relié nulle part). 49 points modifiés ;
sans exercice : agrég. externe 34 → 33, interne 32 → 31. Restent sans exercice dans ces sections : formes
bilinéaires générales, non dégénérées, isotropes, décomposition polaire complexe, espace de Schwartz,
meilleure approximation en moyenne quadratique. Grammaire des notes : « les exercices exercice … », « : exercice
N » corrigés (à ajouter aux corrections habituelles après `notes_lisibles`).

**Outils de liaison dans le dépôt (26 nov. 2026).** Le bloc-notes de la conversation a été vidé entre deux
sessions : consignes et scripts de liaison (gardés jusque-là hors dépôt) étaient perdus. Ils sont désormais
dans le dépôt : `outils/annales_liaison.py` (commandes `catalogue`, `themes`, `points`, `exporter`, `valider`,
`appliquer`, `notes` ; ces deux dernières remplacent `appliquer_liens.py` et `notes_lisibles.py` avec les
corrections de grammaire) et `outils/annales_liaison_consignes.md` (règles de l'agent de liaison, de l'agent de
relecture et des propositions `annales_themes`). Les agents travaillent dans le bloc-notes et ne lisent que le
dépôt. Première exécution de `notes` : quelques tournures du lycée corrigées (« : exercice 3.22 » → « : l'exercice
3.22 », « les exercices exercice … »).

**Géométrie différentielle (26 nov. 2026).** UE `l3-gd-01` à `05` (cours seuls). Première liaison avec les outils
du dépôt. Agrég. externe §9 (numéro affiché) : sous-variétés, espace tangent, position par rapport au plan
tangent, courbes, extrema liés ; « à venir » 24 → 22. Agrég. interne §11-13 : courbes, longueur, Frenet,
intégrales curvilignes (l3-gd-05:7) ; « à venir » 22 → 18 (reste la construction en polaires). CAPES bac+3 :
courbes paramétrées (le site n'a pas de cours de MPSI sur ce sujet). Relecture : aucun lien corrigé, trois
notes ajoutées. Synonymes ajoutés (`courbes-surfaces`, `longueur-courbure`, `arcs-parametres`,
`sous-varietes`, `formes-differentielles`, `topologie-algebrique`) ; refusés : « application de Gauss » seul
(fractions continues dans le sujet de 2016) et « point d'inflexion » (déjà lycée). Listes `annales_themes`
proposées à l'auteur.


**Topologie générale (26 nov. 2026).** UE `l3-gt-01` à `07` (cours). Agrég. externe : espaces métriques et
topologiques, connexité, compacité, groupe fondamental, revêtements, point fixe de Brouwer ; agrég. interne :
topologie des espaces métriques. « À venir » de l'agrég. externe : 22 → 19 ; agrég. interne : 14. Listes
`annales_themes` proposées : gt-01 et gt-03 `[topologie-evn]`, gt-02 `[connexite, compacite]`, gt-04
`[topologie-algebrique, actions-groupes]`, gt-05 et gt-07 `[topologie-algebrique]`, gt-06
`[topologie-algebrique, point-fixe-topologique]`. Synonymes ajoutés à `topologie-evn`, `topologie-algebrique`,
`groupes` (« groupe de Klein »).

### 46. Audit du 26 nov. 2026 : ce qui a été appliqué et les règles qui en sortent

L'audit de l'auteur (moteur, vue Programme sur téléphone, grille, fiches, programmes ; décisions 1 à 11) a été
appliqué en huit lots, chacun relu par un second agent (commits f7ab4ce à c170ea7).

**Moteur.** Toute la chaîne des thèmes compte : `indexAnnales` calcule `ancetres` et `descendants`, utilisés par
`compte`, `compteAnnales`, `frequencePg`, `sujetsPointPg` et `rechercherAnnales` (un sujet étiqueté
« Jordan » répond à « réduction »). Rapport T01 du vocabulaire appliqué (environ 195 corrections relues). Les
synonymes s'écrivent en ASCII, puisque `normRech` ne garde que a-z et 0-9.

**Vue Programme.** Plus aucun débordement à 390 px (agrég. externe, MP, MPSI, CAPES vérifiés) : `.kx` et KaTeX
contenus, libellés repliés. `annales-programmes.yaml` porte deux champs nouveaux : `defaut` (onglet ouvert par
défaut : Première → programme de 2026) et `avis` (phrase sous les onglets, qui dit quel programme vaut pour
quels sujets).

**Grille.** Libellés « Maths 1 » / « Mathématiques » / « Maths 2 » par années (e3a ≤ 2019, CCP PC/PSI 2011-2014) :
la liste `annees` des épreuves est **à prolonger à chaque session** si l'intitulé reste le même. Une case sans
sujet officiel trouvable porte `attente: "…"` (texte affiché) plutôt qu'une source non officielle (11 cases :
Centrale MP 2011, 2013, 2014 M2, Centrale PC 2011, Mines PSI 2011 à 2013…). Champ `page_debut` d'une case : le
lien et le bouton « Sujet (PDF) » ouvrent `#page=N` (Pondichéry 2017, page 3 d'une compilation). Sessions de
novembre 2026 ajoutées (Amérique du Sud J1-J2, Nouvelle-Calédonie J1-J2).

**Règles d'étiquetage (s'appliquent désormais à toute fiche).**
- Thème fin et ancêtre jamais au même rang (décision 3), au bac comme aux concours ; `outils/annales_fin_parent.py`
  l'applique (simulation par défaut, `--appliquer`) ; il annonce aujourd'hui « 0 changements ».
- Anti-réponse étendue aux questions fermées (« … est-il un losange ? ») : ni nom, ni mot-clé, ni aperçu ne
  livre la réponse (décision 4).
- Une annexe éloignée n'entre pas dans les pages du bloc ; sa page est citée dans le nom du bloc (« …, algorithme
  en annexe, p. 6 ») ; vaut aussi pour les concours (décision 5). Une page 1 qui porte le début d'un exercice
  entre dans son bloc.
- Contrôle sans construire : `python3 outils/annales_fiches_valider.py [fichiers]` doit dire « Aucune erreur »
  (2 avertissements connus : pages interverties volontairement dans X-ENS 2023 Maths D).

**Images d'aperçu.** 55 fabriquées, 35 obsolètes supprimées (2255 sur 2255). Règle : **à chaque ajout ou
renommage de sujet, l'image se fabrique dans le même commit** (`node identite/fabriquer-apercus-pages.mjs
<polices>`, polices @fontsource spectral, ibm-plex-sans, gfs-didot) ; on ne pousse jamais un lot qui laisse
« à fabriquer ».

**Constats écartés ou en attente.** X-ENS 2023 Maths C : le PDF de l'ENS répond 404, reste sur vmaths (de même
Maths C 2025). Corrigé de Nouvelle-Calédonie J1 2025 : introuvable à l'APMEP, retiré (celui de sujetdebac non
retenu) ; J2 2025 pointe vers la copie maths-paris (source citée) faute de scan officiel. Logique au lycée
(décision 9) et nilpotents de PSI (décision 6) : laissés en l'état. En attente de l'auteur : reclassement des
exercices par étoiles (échelles de MPSI et de MP comparables ?), point PSI 6.2.1.
