# Mémo ATLAS — complément : rubrique Annales

> Complète `MEMO_atlas.md` (sections 0 à 16) ; sections propres : 17, 18, 27, à lire avec lui. Ce mémo appartient à la conversation
> « Annales » : elle seule le modifie (voir `MEMO_atlas.md`, section 0). La version du dépôt fait foi ;
> la copie du projet Claude en est le reflet.

### 17. Annales et moteur de recherche (26-27 oct. 2026)

**Grille.** `rubriques/annales.yaml` : familles `ingenieurs` (X-ENS, Mines-Ponts, Centrale, CCINP, e3a ; MP, MPI dès 2023, PC, PSI) et `enseignement` (CAPES externe, CAPES bac+3 dès 2026, agrégation externe, agrégation interne ; agrégation spéciale et troisième concours exclus). Sessions 2011 à 2026, 562 cases pour 542 PDF distincts. Chaque case porte `sujet`, `rapport`, `source: {nom, url}`. Règles de l'auteur : un clic ouvre le PDF tel qu'il est publié sur le site officiel ; vmaths.fr seulement à défaut de source officielle ; Mines-Ponts 2014-2025 hébergés depuis les ZIP officiels (`documents/annales/AAAA/mines-ponts/`), source citée ; pas de corrigés pour l'instant. Grille coulissante avec curseur, vue Grille par défaut (aussi sur téléphone), vue Liste, fiche latérale « Contenu » par sujet (`#annales/sujet/<slug>`), présentation de la rubrique repliable.

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
(`ana`), géométrie en violet (`geo`) ; filet à gauche et soulignement de la même couleur.

**Rubrique achevée (27 oct. 2026).** À la demande de l'auteur, la mention « En construction » est retirée :
plus de badge dans le menu du logo, et la note d'usage de la présentation (`annalesInfo`, classe `ann-info`)
remplace le bandeau `maquette`.

**Filtre des filières (28 oct. 2026).** Le menu des filières du moteur ne propose que celles de la famille
choisie (champ `filieres:` de la famille dans `annales.yaml`) : il disparaît pour l'enseignement, qui n'en a
pas, et une filière choisie auparavant est alors oubliée ; le bloc de recherche est refait au changement
de famille, la saisie est conservée.

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
