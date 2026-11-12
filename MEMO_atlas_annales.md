# Mémo ATLAS — complément : rubrique Annales

> Complète `MEMO_atlas.md` (sections 0 à 16) ; sections propres : 17, 18, 27, 44, à lire avec lui. Ce mémo appartient à la conversation
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

**Inventaire (241 sujets, 241 corrigés, tous vérifiés en HTTP 200).** Terminale S 2011-2020 (série S, un sujet
par centre et par session ; 2020 : quatre sujets de septembre et décembre seulement), Terminale spécialité
2021-2026 (jour 1 et jour 2 ; 2021 : candidats libres, sujet zéro et les deux sujets du 15 mars, épreuves
annulées en janvier 2021 mais sujets publiés), Première 2026 (10 sujets de l'épreuve anticipée de spécialité
et 2 sujets zéro). Exclus : compilations annuelles, sujets « hors spécialité » et technologiques de Première.
Le PDF de Pondichéry 2017 est un corrigé qui reproduit l'énoncé (l'APMEP ne publie que lui) ; les versions
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
