# Mémo — ATLAS, atlas interactif des mathématiques

> **Usage.** Ce mémo permet à une nouvelle conversation de reprendre le développement de l'atlas
> sans réapprentissage. Les sources sont dans le projet, sous `atlas/` ; le site publié vit sur
> GitHub Pages et, en aperçu, dans un artifact Claude (lien ci-dessous). Les conventions de style
> de `MEMO_conventions_cours.md` s'appliquent aussi aux textes de l'atlas.

---

## 0. Travail en parallèle (27 oct. 2026)

Plusieurs conversations du projet travaillent en même temps sur le même dépôt, chacune pour une
rubrique (une pour les **Cours** et les exercices, une pour les **Annales**, d'autres possibles). Le
site n'est pas menacé, car `site/` et `construction/` ne sont pas versionnés et chaque publication
reconstruit tout `main`. Les risques sont ailleurs : une poussée refusée parce que l'autre conversation
a poussé entre-temps, un fichier commun réécrit à partir d'une copie périmée, un mémo du projet
écrasé, une erreur de construction d'une rubrique qui bloque la publication de l'autre. Règles :

1. **Chaque conversation a son domaine de fichiers et n'écrit pas dans celui des autres.**
   - *Annales* : `rubriques/annales.yaml`, `rubriques/annales-themes.yaml`, `rubriques/annales-index.yaml`,
     `rubriques/annales-index/`, `documents/annales/`, `MEMO_atlas_annales.md`, et tout outil nommé
     `outils/annales_*`.
   - *Cours et exercices* : `rubriques/cours.yaml`, `rubriques/exercices.yaml`, `rubriques/exercices/`,
     `documents/cours/`, `documents/exercices/`, `documents/figures/`, `outils/tex2exos.py`,
     `outils/meta_*.py`, et son propre mémo `MEMO_atlas_cours.md` (à créer par cette conversation).
   - *L'édifice* (27 oct. 2026) : tout le dossier `contenu/` (`edifice.yaml`, les graphes intérieurs,
     `lexique.yaml`), tout outil nommé `outils/edifice_*`, et `MEMO_atlas_edifice.md`. Les autres
     conversations n'écrivent plus dans `contenu/` ; si elles ont besoin d'un nœud ou d'un terme, elles
     le demandent à l'auteur.
   - *Communs* (toute conversation peut y toucher, avec les précautions du point 2) : `construire.py`,
     `rendu.mjs`, `gabarit.html`, `MEMO_atlas.md`, `rubriques/apropos.yaml`, `LICENCE.md`,
     `identite/`, `.github/`, `package*.json`, `requirements.txt`.
2. **Fichiers communs : modifications ciblées, jamais de réécriture complète.** On les modifie par
   remplacements locaux (outil Edit) sur la version du dépôt fraîchement récupérée, jamais en recopiant
   un fichier entier tiré d'une ancienne copie ou du projet. Dans `gabarit.html`, chaque rubrique garde son code
   dans ses propres fonctions (`pageAnnales`, `pageCours`, `pageChapitre`, `pageExercices`…) ; toute
   nouvelle fonction porte le nom de sa rubrique, pour que les modifications ne se chevauchent pas.
   `pageAccueil` est commune : on n'y touche que la carte de sa rubrique.
3. **Juste avant chaque commit :** `git fetch origin main && git rebase origin/main` (le clone est
   superficiel : ne jamais pousser depuis une copie périmée), puis `sh construire.sh` à nouveau sur la
   version rebasée, jusqu'à zéro erreur. Un conflit de rebase se résout à la main, en conservant les
   modifications des deux côtés ; en cas de doute, on s'arrête et on demande à l'auteur.
4. **Pousser :** `git push origin HEAD:main`. Si la poussée est refusée, on refait le point 3 puis on
   repousse. Jamais de `--force`, jamais de réécriture de l'historique.
5. **Commits petits et fréquents**, un par lot cohérent, avec un message qui commence par la rubrique
   (« Annales : … », « Cours : … »). Une conversation ne laisse jamais de travail non poussé qui
   touche un fichier commun.
6. **Publication :** le flux `publier.yml` annule une publication en cours quand une autre poussée
   arrive (`cancel-in-progress`) ; c'est normal. Seule compte la dernière exécution : on la suit avec
   `gh run list -R jourdainatlas/atlas` jusqu'au succès. Si elle échoue à cause des fichiers de l'autre
   rubrique, on ne les corrige pas soi-même : on signale l'erreur à l'auteur.
7. **Mémos du projet Claude :** chaque conversation n'écrit dans le projet que son propre mémo
   (`MEMO_atlas_annales.md`, `MEMO_atlas_cours.md`, `MEMO_atlas_edifice.md`). `MEMO_atlas.md` est commun : on le modifie dans le
   dépôt (point 2), et la copie du projet ne fait que refléter la version du dépôt ; avant de l'écrire
   dans le projet, on relit la copie du projet et on vérifie qu'elle ne contient rien que le dépôt
   n'ait pas. Une nouvelle section commune prend le numéro suivant le plus grand déjà employé, tous
   mémos confondus (sections 17-18 et 27 dans `MEMO_atlas_annales.md`, 19-22 dans `MEMO_atlas_cours.md`,
   23-26 dans `MEMO_atlas_edifice.md` ; prochain numéro libre : 28).

## 1. Ce qu'est l'atlas

Un site web statique, d'un seul fichier HTML, qui représente les mathématiques comme un graphe
orienté de dépendances, à plusieurs niveaux emboîtés. **Public : niveau Master, sans compromis sur
la rigueur** : toute définition est exacte, toute proposition et tout théorème des graphes
intérieurs sont démontrés, ou marqués *Admis ici* avec l'indication de la difficulté contournée.

- **Niveau 0** (`contenu/edifice.yaml`) : 31 théories au 27 octobre 2026 (23 à l'origine), de la
  logique du premier ordre aux grandes théories. C'est le graphe du cours `MASTER_COURS_architecture.tex`,
  étendu depuis.
- **Niveaux intérieurs** : un fichier par graphe. Un nœud qui porte `sous: <graphe>` s'ouvre sur ce
  graphe.
- **Lexique** (`contenu/lexique.yaml`) : les définitions affichées au survol des termes marqués.

Aperçu dans Claude : https://claude.ai/artifact/FDQu1nCGLg2f9uDznVZRR7
(pour le mettre à jour depuis une autre conversation : publier `construction/atlas.html` en passant
cette adresse comme `url`, après l'avoir lue).

## 2. Branches développées (au 24 octobre 2026)

| Graphe | Fichier | Conteneur | Contenu |
|---|---|---|---|
| L'édifice | `edifice.yaml` | — | 31 théories (dont le nœud-énoncé `derham`, sans sous-graphe), réduction transitive tracée |
| Logique du premier ordre | `log.yaml` | `log` | cadre métathéorique, connecteurs et tables de vérité, formules propositionnelles, tautologies et complétude fonctionnelle, quantificateurs, signature, termes, formules, lecture unique, substitution, structures, satisfaction, coïncidence, système de Hilbert (Enderton), correction, déduction, cohérence, complétude (admise, ⋆), compacité (⋆), Löwenheim-Skolem (admis), modèles non standard, incomplétude (admise) |
| Axiomes de ZF | `zf.yaml` | `zf` | langage, 8 axiomes, AC ; vide, Russell, opérations, $x \notin x$ |
| Relations, fonctions | `rel.yaml` | `rel` | couple de Kuratowski, produit cartésien, relations, applications, images directe et réciproque, composition, injections/surjections/bijections, réciproque, rétraction et section, familles et produit d'une famille, formes de l'axiome du choix (⋆), équivalence et partitions, passage au quotient, équipotence, Cantor, Cantor-Bernstein (Knaster-Tarski, sans ℕ) |
| Structures d'ordre | `ord.yaml` | `ord` | ordres larges et stricts, majorants et bornes, élément maximal, applications croissantes et isomorphismes d'ordres, intervalles et segments initiaux, treillis complets, Knaster-Tarski, bons ordres (induction, unicité de l'isomorphisme), chaînes et ensembles inductifs, propriété de la borne supérieure, coupures de Dedekind. Antérieur à ℕ ; exemples pris dans $\mathcal P(E)$ |
| Structures algébriques | `alg.yaml` | `alg` | lois, monoïdes et inversibles, groupes (groupe symétrique), sous-groupes et sous-groupe engendré, morphismes et noyau, classes et sous-groupes distingués, groupe quotient, théorème d'isomorphisme, transversale et G ≈ H × G/H (⋆), anneaux, morphismes d'anneaux, idéaux, corps, anneau quotient, idéaux premiers et maximaux, symétrisé d'un monoïde (→ ℤ), corps des fractions (→ ℚ), modules. Antérieur à ℕ : ni puissances, ni finitude, ni polynômes |
| Ordinaux, cardinaux | `ordin.yaml` | `ordin` | ensembles transitifs, ordinaux, comparaison (ordre = inclusion), Burali-Forti, successeurs et limites, induction et récursion transfinies (remplacement), type d'ordre, Hartogs, Zermelo (⋆), Zorn (⋆, deux sens), cardinaux, comparabilité ⇔ AC (⋆), pas de plus grand cardinal. Antérieur à ℕ : ω seulement en remarque |
| Les entiers naturels | `n.yaml` | `n` | successeur, ω, récurrence, Peano, bon ordre, définition par récurrence, opérations, propriétés des opérations (semi-anneau, simplification, ordre et addition), ensembles finis (principe des tiroirs), sommes finies (`n-sommes`, cité par l'algèbre linéaire et la mesure) |
| Les entiers relatifs | `z.yaml` | `z` | symétrisé de ℕ, anneau intègre, ordre et valeur absolue, division euclidienne, idéaux (anneau principal), PGCD, Bézout, Gauss, nombres premiers (Euclide, décomposition), ℤ/nℤ, anneaux de polynômes (propriété universelle, division euclidienne dans K[X]) |
| Les nombres rationnels | `q.yaml` | `q` | corps des fractions, écriture irréductible, corps ordonnés et unicité de l'ordre de ℚ, plongement de ℚ dans tout corps ordonné, Archimède et densité, irrationalité de √2 et absence de borne supérieure |
| Les nombres réels | `r.yaml` | `r` | coupures de ℚ, addition (complète), multiplication (admise en partie : cas de signes), corps ordonné complet, Archimède et densité de ℚ dans tout corps ordonné complet, unicité à unique isomorphisme près. Identifiants `rr-` |
| Les nombres complexes | `c.yaml` | `c` | racine carrée réelle (par la borne supérieure), ℂ = ℝ[X]/(X²+1), conjugaison et module, automorphismes fixant ℝ, non-ordonnabilité, racines carrées complexes et second degré, d'Alembert-Gauss (admis : compacité et racines k-ièmes ; corollaires démontrés) |
| Topologie algébrique | `topalg.yaml` | `topalg` | chemins (recollement, continuité des opérations de ℝ), homotopie, groupe fondamental, fonctorialité et point de base, convexes simplement connexes, revêtements (lemme de Lebesgue, relèvement des chemins et des homotopies), π₁(ℝ/ℤ) ≅ ℤ par le degré, conséquences. Cercle défini comme ℝ/ℤ, sans trigonométrie |
| Analyse complexe | `anc.yaml` | `anc` | suites et séries complexes, compacité des fermés bornés de ℂ, convergence uniforme et intégrale complexe, séries entières (Abel, rayon), holomorphie, dérivation terme à terme, exponentielle, cos et sin, π (plus petit zéro de cos), intégrale curviligne, Goursat, Cauchy convexe, formule de Cauchy, analyticité et inégalités de Cauchy, Liouville et d'Alembert-Gauss, zéros isolés. Construit exp, la trigonométrie et π pour tout l'atlas |
| Géométrie différentielle | `geod.yaml` | `geod` | normes et topologie associée, ℚ dénombrable et base dénombrable de ℝⁿ, équivalence des normes (compacité, complétude, norme subordonnée), différentielle et règle de la chaîne, accroissements finis, classe Cᵏ (dérivées partielles continues, composition), point fixe de Banach, GLₙ ouvert par continuité du déterminant, inversion C^∞ par la comatrice, série de Neumann conservée pour la forme quantitative, inversion locale, submersions et fonctions implicites, sous-variétés de ℝⁿ (équations, graphes, sphère), espace tangent géométrique, variétés abstraites (atlas maximal, sous-variétés, stéréographie), applications lisses, espace tangent abstrait, fibré tangent (⋆ choix dénombrable pour la base dénombrable de TM). Exemples sans exp ni trigonométrie ; approfondissement : Schwarz et intégrales à paramètre (recouvrement fini, sans choix), orientation (sphère via le jacobien de z/|z|²), formes différentielles (d∘d=0, image réciproque), formes sur une variété et formes volume (réciproque admise : partitions de l'unité demandent exp), intégrale d'une 1-forme, lemme de Poincaré (opérateur d'homotopie K), cohomologie de de Rham (H¹(ℝ²∖0)≠0 par le carré, sans trigonométrie). Algèbre linéaire : nœud `v-algebre-exterieure` |
| Mesure, intégration | `mes.yaml` | `mes` | sommes dans [0, +∞] (redéfinies, sommation par paquets), tribus et boréliens, mesures, Dynkin et unicité, Carathéodory, mesure de Lebesgue sur ℝ (⋆ choix dénombrable), Vitali (⋆ AC), fonctions mesurables, étagées, intégrale positive, convergence monotone, Fatou, L¹, convergence dominée et intégrales à paramètre, Riemann ⊂ Lebesgue (subdivisions dyadiques, sans choix), mesure produit, Tonelli-Fubini. Nouveau nœud `q-denombrable` dans ℚ (ℕ×ℕ, ℤ, ℚ dénombrables), cité par `gd-denombrable` et par la mesure |
| Probabilités | `proba.yaml` | `proba` | espace probabilisé, Bayes, indépendance (π-systèmes, regroupement), variables, lois, fonction de répartition, loi du couple = produit, espérance (transfert, Cauchy-Schwarz, Markov, Bienaymé-Tchebychev, E[XY]=E[X]E[Y] par Fubini), loi faible et Weierstrass par Bernstein, Borel-Cantelli (sans exp), modes de convergence, loi forte (moment 4), loi du 0-1, chiffres binaires et nombres normaux. Depuis l'arête anc → proba (édifice) : loi de Poisson et approximation binomiale, loi normale (densité, convolution), Hoeffding, théorème central limite (méthode de Lindeberg par fonctions test). Entrées anc : `p-poisson-exp`, `p-normale` |
| Homologie singulière | `hom.yaml` | `hom` | complexes de chaînes, suites exactes et suite longue, homologie singulière et fonctorialité, H₀ et composantes connexes par arcs, invariance par homotopie (opérateur prisme), Mayer-Vietoris (petites chaînes ADMIS : subdivision barycentrique), homologie des sphères, Brouwer et invariance de la dimension. Entrées topalg |
| Théorème de de Rham | — | (nœud de l'édifice) | énoncé seul, parents geod et hom |
| Théorie de Galois | `galois.yaml` | `galois` | extensions, degré et base télescopique, éléments algébriques et polynôme minimal, corps de décomposition (existence, unicité), séparabilité, lemme d'Artin, extensions galoisiennes, correspondance de Galois, corps finis, groupes (Lagrange, Cauchy par McKay, résolubilité, 𝔖ₙ non résoluble pour n ≥ 5), résolubilité par radicaux (réciproque de Kummer ADMISE), Abel-Ruffini (X⁵−4X+2, groupe 𝔖₅). Entrées alglin, c, analyse-reelle |
| Analyse de Fourier | `fourier.yaml` | `fourier` | densité des polynômes trigonométriques, coefficients, Fejér, Parseval et Σ1/n² = π²/6, Dirichlet, divergence (Banach-Steinhaus, constantes de Lebesgue), transformée sur L¹, inversion, Plancherel, fonctions caractéristiques. Carleson et Lévy admis en remarque. Entrées anf, anc, proba |
| Équations différentielles | `edo.yaml` | `edo` | Cauchy-Lipschitz (point fixe), Gronwall, solutions maximales et sortie de tout compact, systèmes linéaires et exponentielle de matrice (Liouville), flot (régularité C¹ ADMISE), champs de vecteurs sur une variété. Entrées anf, geod, anc |
| Groupes de Lie | `lie.yaml` | `lie` | définition, exponentielle, sous-groupes à un paramètre, algèbre de Lie (formule de Trotter, crochet), Cartan-von Neumann (ADMIS). Entrées grtop, edo |
| Martingales | `mart.yaml` | `mart` | espérance conditionnelle (projection L², ⋆ choix dénombrable hérité), martingales, inégalité maximale de Doob, convergence (L² démontrée, L¹ par les montées ADMISE), applications (série harmonique aléatoire, urne de Pólya). Entrées proba, anf |
| Théorie algébrique des nombres | `tan.yaml` | `tan` | entiers algébriques (anneau), corps quadratiques, unités (Pell), ℤ[i] et théorème des deux carrés, idéaux (ℤ[√−5], factorisation de Dedekind et groupe des classes ADMIS). Entrées galois, geoalg |
| Analyse fonctionnelle | `anf.yaml` | `anf` | espaces normés réels et Banach (séries absolument convergentes), exemples (B(X), C(K), ℓ¹), opérateurs continus et dual, L¹ et L² (Riesz-Fischer, extraction sans choix), Hilbert (projection ⋆ choix dénombrable), Riesz, bases hilbertiennes (Gram-Schmidt sans choix, Zorn ⋆ en général), Hahn-Banach ⋆, Baire ⋆ (DC), Banach-Steinhaus, application ouverte ⋆ et graphe fermé. Pas de Lᵖ général (puissances réelles), scalaires réels seulement |
| Théorie analytique des nombres | `nban.yaml` | `nban` | logarithme réel et puissances complexes, sommation d'Abel et intégrales impropres, lemme de Weierstrass et intégrales à paramètre holomorphes, ζ et prolongement de Z=(s−1)ζ à Re s>0, produit eulérien (sans réarrangement de séries), θ(x) ≤ x ln 4 (Erdős), Φ et −Z'/Z − ψ, non-annulation sur Re s = 1 (coefficients 1,4,6,4,1 sans trigonométrie), théorème de Newman (indice du contour par une primitive de 1/z sur Re z<0), théorème des nombres premiers. Preuve de Newman-Zagier |
| Algèbre linéaire | `alglin.yaml` | `alglin` | espaces et sous-espaces, sommes finies (indépendantes de l'ordre) et combinaisons linéaires, applications linéaires, sommes directes et projecteurs, quotient, familles libres et bases (propriété universelle), existence des bases et base incomplète (⋆, Zorn ; réciproque de Blass admise), lemme d'échange, dimension, théorème du rang et Grassmann, matrices, dual et bidual. Dans l'édifice, dépend de `alg` et de `n` ; ajouts : groupe symétrique et signature (par les paires inversées, à valeurs dans {±1}), formes n-linéaires alternées (espace de dimension 1), déterminant (endomorphisme, matrice, transposée, développement, comatrice). Lexique : `signature-permutation` (l'id `signature` est pris par la logique) |
| Groupes topologiques | `grtop.yaml` | `grtop` | définition, translations et voisinages du neutre, sous-groupes ouverts et fermés, séparation (⇔ {e} fermé), quotient (π ouverte, séparé ⇔ H fermé), composante neutre et sous-groupe engendré par un voisinage, produits de compacts. Antérieur à ℕ et ℝ |
| Géométrie algébrique | `geoalg.yaml` | `geoalg` | spectre, topologie de Zariski, points fermés (⋆), Krull (⋆, réciproque de Hodges admise), quasi-compacité (⋆), radical = intersection des premiers (⋆), ensembles algébriques, Nullstellensatz (forme faible admise en partie : lemme de Zariski ; forme forte par Rabinowitsch), dictionnaire. Dans l'édifice, dépend aussi de ℤ |
| Structures topologiques | `top.yaml` | `top` | topologie, voisinages, adhérence, bases, continuité, induite, produit, quotient, séparés, compacité, produit fini (lemme du tube), Tychonov (admis, ⋆), connexité |
| Analyse réelle | `analyse-reelle.yaml` | `analyse-reelle` | borne sup, Archimède, suites, Bolzano-Weierstrass, complétude, topologie, dérivation, Riemann, TFA |
| Continuité | `continuite.yaml` | `continuite` | ε-δ, uniforme, séquentielle, TVI, bornes, Heine, image d'un segment, monotone, bijection |

Pistes suivantes : les théories mixtes restantes (analyse complexe, mesure, groupes topologiques…).

Point ouvert : au niveau 0, la topologie ne dépend que des relations ; le graphe `top` n'utilise donc ni
$\mathbb R$ ni les espaces métriques (les exemples tirés de $\mathbb R$ figurent seulement en remarque). Les
espaces métriques pourraient devenir un nœud du niveau 0, dépendant de ℝ et de la topologie.

Règle observée dans tous les graphes : éviter les choix infinis cachés (prendre la réunion de *tous*
les ouverts convenables plutôt que d'en choisir un par point), et signaler par ⋆ tout usage d'une
forme de l'axiome du choix.

## 3. Format d'un fichier de graphe

```yaml
graphe: continuite            # identifiant, utilisé dans l'adresse : #continuite.c-tvi
titre: Continuité
conteneur: continuite         # le nœud du graphe parent qui s'ouvre sur ce graphe
entrees:                      # nœuds du graphe PARENT qui alimentent ce graphe
  ar-corps: [c-tvi, c-monotone]
noeuds:
  - id: c-tvi                 # unique dans tout l'atlas, minuscules et tirets
    etiquette: Valeurs intermédiaires     # texte de la bulle, court
    titre: Théorème des valeurs intermédiaires   # facultatif, titre de la fiche
    nature: théorème          # théorie | chapitre | axiome | définition | théorème | proposition | lemme | corollaire
    famille: mix              # niveau 0 seulement : fond | ord | alg | top | mix | n | z | q | r | c
    sous: autre-graphe        # facultatif
    choix: |                  # facultatif : rôle de l'axiome du choix (affiche ⋆)
    texte: |                  # présentation
    enonce: |
    preuve: |
    remarques:
      - |
aretes:
  - [c-point, c-tvi]          # de la notion requise vers celle qui la requiert
```

Syntaxe des textes : `$...$`, `$$...$$` (LaTeX, composé par KaTeX), `[[id]]` ou `[[id|texte]]`
(terme du lexique), `{{id|texte}}` (lien vers un nœud), `**gras**`, `*italique*`, ligne vide entre
paragraphes. Écrire `\leqslant`, `\geqslant`. Les numéros (Théorème 3…) sont attribués
automatiquement dans l'ordre topologique.

**Ensembles usuels (25 octobre 2026).** Dans une formule, `\lex{id}{corps}` marque une notation du
lexique : `$f \in \lex{espace-L2}{L^2}(\mu)$`. `rendu.mjs` la traduit en `\htmlData{g=id}{…}` (KaTeX,
option `trust` limitée à `\htmlData`) et ajoute les classes `terme terme-math` : même rouge, même bulle,
même clic que les termes. Les entrées concernées portent un champ `notation:` (formule affichée à côté
du terme dans le lexique et la bulle, et prise en compte par la recherche). `construire.py` traite
`\lex{id}` comme `[[id]]` pour l'existence et la chronologie. Convention : on marque la **première**
occurrence de chaque notation dans chaque nœud, jamais à l'intérieur d'un indice ou d'un exposant.
Le script de marquage (`marquer.py`, hors dépôt) applique des motifs par notation et refuse tout
marquage contraire à la chronologie. Ensembles ajoutés : ℕ, ℤ, ℚ, ℝ, ℂ, 𝒫(A), ℤ/nℤ, Aⁿ (n-uplets, défini
dans `n-sommes`), Sⁿ (sphère unité, définie dans `ar-topo`), S¹ = ℝ/ℤ (topologie algébrique), [0, +∞],
ℒ¹(μ), L¹, L², ℓ¹, ℓ², ℬ(X), C(K), ℒ(E, F), ℒ_c(E, F), ℳ_{p,n}(K), O(n), Aut(L/K), Λᵏ(E), K(α), 𝒪_K,
𝔽_q, ℤ[i], V(S) ; notations ajoutées aux entrées existantes : 𝔖ₙ, GLₙ(ℝ), E*, E', A[X], Spec A, ℬ(ℝ),
π₁, TₚM, TₐM, TM, Gal, Hₙ(C), Hₙ(X), Hᵏ, 𝔤.

**Fil d'Ariane.** Dans un sous-graphe, quand la fiche d'un nœud est affichée, le dernier élément du fil
(le nom du graphe courant) devient cliquable et réaffiche la fiche de la théorie qui le contient.

## 4. Règles de cohérence (vérifiées par `construire.py`, bloquantes)

1. Identifiants uniques ; natures et familles connues.
2. Chaque graphe est sans cycle ; on ne trace que la réduction transitive (les arêtes redondantes
   sont signalées, ce n'est pas une erreur).
3. **Cohérence entre niveaux** : chaque entrée d'un sous-graphe est un ancêtre du conteneur dans le
   graphe parent, et **chaque parent direct du conteneur doit figurer parmi les entrées**.
4. Tout `[[terme]]` existe dans le lexique, tout `{{nœud|…}}` existe.
5. Toute formule compile avec KaTeX.
6. Aucune arête tracée ne traverse un nœud (mise en page automatique en couches).

7. **Ordre d'apparition (exigence de l'utilisateur, 24 octobre 2026)** : tout objet employé doit avoir
   été défini avant, dans l'ordre de l'arbre. Chaque terme du lexique porte `defini_dans: <nœud>` ;
   l'ordre global place chaque nœud intérieur après les parents de son conteneur et avant le
   conteneur. Un emploi prématuré dans `texte`, `enonce`, `preuve` ou dans une définition du lexique
   est une **erreur** ; dans `remarques` et `choix`, c'est un renvoi en avant, permis et listé. Le nœud
   de définition doit mentionner son terme. Dans le lexique, un renvoi vers une notion ultérieure va
   dans `voir: [ids]` (« Voir aussi »). Les notions intuitives de la métathéorie (ensembles,
   applications, entiers) sont déclarées au nœud `l-metatheorie` de la logique.

8. **Renvois entre nœuds (25 octobre 2026)** : un lien `{{nœud}}` dans `texte`, `enonce` ou `preuve` doit viser un ancêtre (erreur sinon) ; dans `remarques` et `choix`, il peut viser plus loin. Sept infractions trouvées à l'introduction de la règle et corrigées (c-dalembert, rel, ord, zf-infini, ga-zeros, ga-quasi-compact, et le nœud `n-sommes` créé pour v-combinaisons et m-droite-achevee).

9. **Notations dans les formules** : `\lex{id}{…}` obéit aux mêmes règles que `[[id]]`. Trois défauts révélés et corrigés le 25 octobre 2026 : le texte de l'algèbre linéaire nommait ℤ, ℚ, ℝ ; Krull employait Spec A avant sa définition (énoncé reformulé) ; les fonctions mesurables employaient [0, +∞] sans en dépendre (arête m-droite-achevee → m-mesurables).

Homonymes : un même mot peut avoir plusieurs entrées de lexique distinctes par leur id
(exemple : `inductif-successeur` et `inductif-ordre`).

## 5. Construire et vérifier

```sh
pip install -r requirements.txt   # networkx 3.4.2, PyYAML 6.0.2
npm ci                            # KaTeX 0.16.22
sh construire.sh
```

Sorties : `construction/atlas.html` (aperçu Claude) et `site/index.html` (site autonome).
Méthode attendue, comme pour les cours : construire jusqu'à zéro erreur, **regarder le rendu**
(clair et sombre, largeur de bureau et de téléphone), vérifier les démonstrations, puis livrer en
signalant les points douteux.

## 6. Publication

**Dépôt : https://github.com/jourdainatlas/atlas** (branche `main`), site : https://www.atlasjourdain.fr/ (voir section 16 ; l'ancienne adresse
https://jourdainatlas.github.io/atlas/ y redirige).
L'application GitHub de Claude est installée sur ce seul dépôt (24 octobre 2026). Dans une nouvelle
conversation qui dispose de l'outil d'ajout de dépôt : l'attacher avec l'accès en écriture
(`owner: jourdainatlas`, `repo: atlas`, `access: push`), cloner, copier les fichiers modifiés,
construire et vérifier localement, valider (commit) puis pousser sur `main` ; enfin suivre la
publication avec `gh run list -R jourdainatlas/atlas` jusqu'au succès, et reporter les mêmes
fichiers dans le projet Claude. Sans cet outil, livrer une archive des fichiers modifiés et
renvoyer l'utilisateur à l'étape « Mettre à jour ATLAS ensuite » du guide.


Le dépôt GitHub contient ces mêmes fichiers. Le script `.github/workflows/publier.yml` reconstruit
et republie le site à chaque modification de la branche `main` ; une erreur de vérification bloque
la publication et s'affiche dans l'onglet *Actions*.

## 7. Choix de conception à conserver

- Graphes lus **de bas en haut**, comme une coupe de bâtiment ; rangs affichés au niveau 0.
- Couleurs des familles reprises du cours (`couleurN`, `couleurZ`… ; algèbre orange, ordre olive,
  topologie magenta) ; définitions en rouge, théorèmes en double filet, entrées venues du niveau
  supérieur en pointillés.
- Thème sombre et clair tous deux soignés ; l'utilisateur apprécie particulièrement le sombre.
- Panneau de lecture large sur ordinateur (42 % de la fenêtre par défaut), réglable par un séparateur
  que l'on fait glisser, largeur mémorisée ; sur téléphone, il s'ouvre sous le graphe.
- Un clic sur une bulle munie d'un coin carré ouvre son graphe ; un clic sur une autre bulle affiche
  sa fiche. Survol d'un terme : définition ; clic : lexique.

## 8. Nom

Le site s'appelle **ATLAS** (en capitales), depuis le 24 octobre 2026 : titre de la page, en-tête,
licence. Le dépôt GitHub conseillé s'appelle `atlas`, d'où l'adresse `https://<compte>.github.io/atlas/`.
Le cours LaTeX associé garde son titre, « Architecture des mathématiques ».

## 9. Licence

Contenu (dossier `contenu/` et textes du site) : **CC BY-NC-SA 4.0**, © 2026 Armand Jourdain,
choix de l'utilisateur du 24 octobre 2026. Code (scripts, gabarit) : tous droits réservés.
Détails et composants tiers dans `LICENCE.md` ; la mention de licence et les crédits figurent sur
la fiche d'accueil du site, et la notice MIT de KaTeX est insérée dans la page par `rendu.mjs`.
Tout nouveau composant tiers doit être ajouté au tableau de `LICENCE.md` et aux crédits.

## 10. Logo et icônes

Logo retenu : variante « 3e · Icône » de la planche Claude Design (https://claude.ai/artifact/7PkUqRF2rquaTwxsqBMNvo). C'est une tuile sombre (#1d2027, coins arrondis) qui contient un graphe orienté en triangle :
- α au pied gauche, cerclé de blanc, et un point blanc au pied droit ;
- Ω au sommet, en rouge #ff6d7d ;
- les flèches α → Ω et α → point sont grises, la flèche point → Ω est blanche.

Dans les miniatures, Ω est un disque rouge plein et le côté droit du triangle est blanc.

Les fichiers sont dans `identite/` et sont copiés dans `site/` par `rendu.mjs` :
- `favicon.svg` et `favicon-32.png` pour l'onglet ;
- `apple-touch-icon.png` (180 px) pour l'écran d'accueil iOS ;
- `icone-512.png` ;
- `apercu.png` (1200×630), l'image Open Graph des liens partagés.

`rendu.mjs` ajoute aussi les balises `og:*` et `twitter:card`, avec l'adresse complète https://jourdainatlas.github.io/atlas/. Si le logo change, il faut relancer `identite/fabriquer-icones.mjs`.

## 11. Familles de couleurs de l'édifice

Les familles de l'édifice et leurs couleurs (version claire / version sombre) :
- `fond` : socle, en gris ;
- `ord`, `alg`, `top` : les trois structures-mères, en olive, orange et magenta ;
- `n`, `z`, `q`, `r`, `c` : les nombres, dessinés en cercles, et `ari` : l'arithmétique. Ils partagent une seule couleur, le bleu `--c-nb` ;
- `ana` : l'analyse, en vert d'eau. Elle comprend l'analyse réelle, la mesure, les probabilités et l'analyse fonctionnelle ;
- `geo` : la géométrie, en violet. Elle comprend la géométrie différentielle et la géométrie algébrique ;
- `mix` : une théorie mixte n'a pas de couleur propre. Son contour passe en dégradé par les couleurs de ses sources directes, deux ou davantage (classe `.mixte`, fonction `sourcesMixte`). Trois théories sont dans ce cas : les groupes topologiques, l'analyse complexe et la topologie algébrique.

L'algèbre linéaire est rangée dans `alg`. Le rouge est réservé aux définitions, aux axiomes (`--c-axiome`) et au logo. L'or est réservé au signe du choix. Pour garder un graphe lisible, on ne dépasse pas huit couleurs de famille.

Les branches du graphe `rel` sont antérieures à ℕ : on n'y emploie jamais d'entiers, ni de finitude, hors des remarques.

Mise en page (`construire.py`, fonction `disposer`) : deux retouches contre la dérive des longues chaînes vers la droite. Une feuille posée au-dessus d'un nœud pèse 0,2 dans le calcul de sa position. Puis une passe de redressement aligne toute couche réduite à un nœud de parent unique sur ce parent, en décalant d'autant tout ce qui est au-dessus. Les entrées d'un sous-graphe se limitent aux nœuds de départ, pour éviter les longues flèches pointillées.

Modification de l'édifice (24 octobre 2026) : arête ajoutée ℕ → Algèbre linéaire, puisque combinaisons linéaires et dimension reposent sur les entiers ; l'algèbre linéaire passe du rang 4 au rang 6.
Modification de l'édifice : arête ajoutée ℤ → Géométrie algébrique (polynômes, ℕ, et Zorn via les ordinaux). L'édifice passe de 5 à 10 croisements ; une amélioration de l'algorithme de placement est à envisager.

## 12. Site publié, découpage par branche et placement

Le site publié est découpé. `site/index.html` (environ 620 Ko, 67 Ko compressés) ne contient que les graphes, le lexique et les textes de l'édifice. Les textes des fiches de chaque branche sont dans `site/branches/<graphe>.json`, chargés à l'ouverture d'un graphe ou d'une fiche (fonction `chargerBranche` du gabarit, table `D.aCharger`), avec une empreinte `?v=` contre les caches périmés. La feuille KaTeX et ses polices sont dans `site/katex.css` et `site/fonts/`. L'aperçu `construction/atlas.html` reste un fichier unique, car un artifact ne charge pas de fichiers annexes. Pour tester le site découpé, il faut un serveur (`python3 -m http.server` dans `site/`) : en `file://`, le chargement des branches échoue.

Placement (`disposer` dans `construire.py`) :
- l'ordre des nœuds suit les fichiers de contenu, ce qui rend la disposition déterministe (elle variait avec l'ordre de parcours des ensembles de Python : l'édifice sortait tantôt à 4, tantôt à 10 croisements) ;
- balayages par barycentres, échanges de voisins (transposition), et huit ordres de départ (fichier, inverse, six tirages à graines fixes) ; on garde le moins de croisements ;
- puis les deux retouches contre la dérive vers la droite (section 2).
Modification de l'édifice : l'arête ℝ → Topologie algébrique est remplacée par Analyse réelle → Topologie algébrique (compacité et connexité de [0, 1]).

Navigation : un clic sur une bulle « niveau supérieur » (entrée d'un sous-graphe) ouvre directement sa structure interne si elle en a une ; sinon (entrée qui est un nœud interne d'un autre graphe) sa fiche s'affiche sur place, sans quitter le graphe courant. L'ancre `#graphe.entrée` est acceptée.

Publication de l'artifact (25 octobre 2026) : le fichier unique `construction/atlas.html` dépasse 16 Mo (17,7 Mo) ; l'artifact publie désormais le site découpé, `site/index.html` avec ses fichiers annexes (`branches/*.json`, `katex.css`, `fonts/`, icônes) passés dans `files`. Le chargement des branches dans l'artifact reste à confirmer à l'usage ; la remarque de la section 12 sur le fichier unique est caduque.

## 13. Rubriques (25 octobre 2026)

Le logo ouvre un menu : L'édifice, Cours, Exercices, Annales, À propos. Les rubriques vivent sous les
ancres `#cours`, `#cours/<id>`, `#exercices`, `#exercices/feuille/<id>`, `#exercices/notion/<nœud>`,
`#annales`, `#a-propos`. Leurs données sont dans `rubriques/*.yaml` (dossier distinct de `contenu/`) :
`construire.py` vérifie les renvois (`theories`, `noeuds` → nœuds de l'atlas ; `notions` → lexique ;
cours ↔ feuilles), `rendu.mjs` compose les champs `intro`, `resume`, `enonce`, `corrige`, `indication`,
`texte` comme les fiches et les titres courts (`titre`, `sommaire`, `parties`, `partie`) en ligne.
Remplir une rubrique = compléter le YAML ; un PDF déposé se déclare par `pdf:` et `statut: depose`.
Les fiches de l'édifice affichent « n exercices sur cette notion » quand un exercice cite le nœud.
Difficulté des exercices : jauge à quatre niveaux (l'étoile dorée est réservée à l'axiome du choix).
Rubriques en ligne en l'état, avec un bandeau « En construction » ; la description du menu Cours est
« Les cours scolaires, chapitre par chapitre » (demande de l'auteur).
Documents déposés : dossier `documents/` du dépôt (ex. `documents/cours/terminale/chap01_suites.pdf`), copié dans
`site/documents/` par `rendu.mjs` ; un cours déposé porte `pdf:`, `pages:` et `statut: depose` (affiché « En ligne »).
Le lecteur utilise PDF.js 3.11.174 depuis cdnjs, chargé seulement sur la page d'un chapitre. Premier cours en ligne :
Terminale, chapitre 1, Suites numériques (25 octobre 2026). Volume : viser des PDF finalisés (l'historique Git garde
chaque version) ; annales à lier plutôt qu'à héberger (limites GitHub Pages : 1 Go, 100 Go/mois).
Partage (25 octobre 2026) : `rendu.mjs` écrit des pages de partage `site/cours/<id>/`, `site/cours/`, `site/exercices/`,
`site/annales/`, `site/a-propos/` et `site/edifice/<nœud>/` (395 pages), chacune avec titre, description et `og:image`,
qui redirigent vers l'ancre du site. Le bouton « Partager » de l'en-tête copie l'adresse correspondant à la vue.
Cause du problème : tout ce qui suit « # » n'est pas envoyé au serveur, et Telegram gardait un aperçu périmé de l'accueil.
Note de l'auteur : les cours suivent la chronologie scolaire, pas celle de l'édifice ; l'édifice sert à recontextualiser
logiquement le cours. Ne pas signaler comme incohérence un écart de statut (admis au lycée, démontré dans l'édifice).

## 14. Banque d'exercices (25 octobre 2026)

Exercices d'une feuille : `rubriques/exercices/<feuille>.yaml` (liste). Champs : id (t-01-07), feuille, numero, titre
(facultatif), partie, etoiles (1-4), types (liste fermée dans exercices.yaml), mots_cles (thèmes du moteur de recherche,
minuscules), noeuds, notions, page_enonce, page_corrige (pages des PDF), enonce, corrige. La feuille (exercices.yaml)
porte pdf_enonce, pdf_corrige, cours ; nombre, répartition des étoiles et parties sont calculés à la construction.
Balisage : questions **1.**, sous-questions **(a)** (paragraphe en retrait), code en ```python, tableaux en array.
Transcription depuis les PDF : outil de validation (schéma + KaTeX) ; premier lot fait par quatre agents en parallèle,
contrôlé sur échantillon. Site : textes des exercices dans site/exercices-textes/<feuille>.json, chargés à l'ouverture
de la page ; recherche sur titre, partie, mots-clés, types et énoncé sans formules (sans accents).
Adresses : #exercices/ex/<id> (lien permanent), #exercices/feuille/<id>, #exercices/notion/<nœud> ; pages de partage
exercices/<id>/. Feuille en ligne : Terminale chapitre 1 (33 exercices).

### 14 bis. Conversion des feuilles depuis les .tex (25 oct. 2026)
- `outils/tex2exos.py ENONCE.tex CORRIGE.tex ENONCE.pdf CORRIGE.pdf f-t-NN t-NN > rubriques/exercices/f-t-NN.yaml` : conversion exacte (macros du préambule, listes, tableaux → array KaTeX, lstlisting → ```python, TikZ/tkz-tab compilés en SVG dans `documents/figures/<empreinte>.svg`, pages PDF de chaque exercice, commentaires `% Source :` → champ `source`).
- Métadonnées proposées par `outils/meta_t_NN.py` (règles, via `meta_commun.py`) : à relire.
- lmodern absent de la machine : retiré du préambule des figures.
- Rendu : `![Figure](chemin.svg)` → `<figure class="fig">` (fond blanc, taille ×1,5 lue dans le SVG) ; `code` en ligne ; `source` affichée sur la carte.
- Chapitres 1 à 4 de Terminale en ligne (33 + 42 + 45 + 38 exercices).
- Tableaux à colonne p{} ou à texte long (> 40 car.) : bloc ```tableau (rangées par ligne, cellules séparées par « ¦ », 1re rangée = en-tête), rendu en <table class="tab-exo">. Les tableaux numériques restent des array KaTeX.
- meta_t_04 : mots-clés cherchés dans l'énoncé seul (le corrigé élargissait trop).

### 15. Page d'accueil (26 oct. 2026)
- Vue `accueil` (pageAccueil dans gabarit.html), affichée quand l'ancre est vide : /atlas/ ouvre donc l'accueil. Ancre #accueil, page de partage /atlas/accueil/.
- L'édifice : #edifice (aller(D.racine) écrit #edifice dans l'adresse), page de partage /atlas/edifice/ ; le bouton Partager à la racine du graphe donne /atlas/edifice/.
- Contenu : accroche, miniature de l'édifice (positions, arêtes et couleurs réelles, nœuds cliquables), cartes des rubriques avec chiffres calculés (théories, énoncés hors chapitres, termes, chapitres déposés, exercices des feuilles déposées), exemple réel cours → exercices → théories (premier cours déposé qui a une feuille).
- Bandeau de la page Exercices calculé par enLigneExos().
- racine/index.html : page de renvoi vers /atlas/ pour un dépôt jourdainatlas.github.io, à créer par l'auteur (Claude n'a pas accès à la création de dépôt).

### 16. Domaine (26 oct. 2026)
- Le site est servi à https://www.atlasjourdain.fr/ (domaine OVHcloud, déclaré dans Settings → Pages du dépôt atlas ; DNS : CNAME www → jourdainatlas.github.io., A/AAAA de GitHub sur @, TXT de vérification GitHub).
- ADRESSE (rendu.mjs) et ADRESSE_SITE (gabarit.html) valent https://www.atlasjourdain.fr/. GitHub redirige jourdainatlas.github.io/atlas/… vers le domaine ; la page du dépôt jourdainatlas.github.io renvoie aussi vers le domaine.
- Thème : bouton soleil/lune (#theme) ; choix gardé par cookie de session atlas-theme (+ sessionStorage).
