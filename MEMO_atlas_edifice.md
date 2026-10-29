# Mémo ATLAS — complément : rubrique L'édifice

> Complète `MEMO_atlas.md` (sections 0 à 16) et se lit avec lui. Les sections 17 et 18 sont dans
> `MEMO_atlas_annales.md` (ainsi que la 27), les sections 19 à 22 dans `MEMO_atlas_cours.md` ; ce mémo
> commence à 23. Toute nouvelle section prend le numéro suivant le plus grand déjà employé, tous mémos
> confondus (section 0, point 7).
> Il appartient à la conversation « L'édifice » : elle seule le modifie. La version du dépôt fait foi ;
> la copie du projet Claude n'en est que le reflet.
>
> La description du contenu de l'édifice reste dans le mémo commun : format d'un graphe (section 3),
> règles de cohérence (section 4), branches développées (section 2), familles de couleurs (section 11),
> placement (section 12). Ce mémo ne les recopie pas ; il les complète.

### 23. Domaine de la conversation « L'édifice » (27 oct. 2026)

Décision de l'auteur du 27 octobre 2026 : la conversation L'édifice est propriétaire de tout le dossier
`contenu/` (`edifice.yaml`, les 31 fichiers de graphes intérieurs, `lexique.yaml`), de tout outil nommé
`outils/edifice_*` et du présent mémo. Les autres conversations n'écrivent plus dans `contenu/`.

Dans les fichiers communs, elle ne touche qu'à ce qui lui revient, par remplacements locaux après
`git fetch origin main && git rebase origin/main` (section 0, points 2 et 3) :
- dans `construire.py`, les blocs « lecture », « graphes », « niveaux », « références », « ordre
  d'apparition des notions », « rangs et numéros » et « mise en page » (`disposer`), c'est-à-dire tout
  ce qui précède le bloc « rubriques (cours, exercices…) » ;
- dans `gabarit.html`, les fonctions du graphe et des fiches : `dessiner`, `surligner` (la première),
  `appliquerEchelle`, `echelleAjustee`, `chargerBranche`, `aller`, `chemin`, `fil`, `remonter`,
  `ouvrirNoeud`, `puce`, `sourcesMixte`, `couleurNoeud`, `fiche`, `accueil`, `remplirLexique`,
  `ouvrirTerme`, `filtrer`, `montrerOnglet`, `montrerBulle`, `cacherBulle`, `theorieDe`, `miniEdifice`,
  et dans `pageAccueil` la seule carte de l'édifice ; toute nouvelle fonction porte un nom qui contient
  `Edifice`, `Noeud`, `Graphe` ou `Lexique` ;
- dans `rendu.mjs`, la composition des fiches et du lexique, l'écriture de `site/branches/*.json` et des
  pages de partage `edifice/`.

Les messages de commit commencent par « Édifice : ».

**Effet sur les autres rubriques.** Les cours, les feuilles et l'index des annales renvoient à des nœuds
et à des termes (`theories`, `noeuds`, `notions`). Renommer ou supprimer un identifiant de nœud ou de
terme casse donc leurs vérifications. Règle : on ne renomme ni ne supprime un identifiant existant sans
l'accord de l'auteur, et on vérifie d'abord avec `grep -rn '<id>' rubriques/` qu'aucune rubrique ne
l'emploie.

### 24. État au 27 octobre 2026

- Construction : `OK : 380 nœuds, 257 termes, 32 graphes`, zéro erreur (commit de départ `2d7ca3b`) ; voir la section 30 pour l'état au 28 octobre.
- Avertissements permanents : des arêtes redondantes non tracées dans 15 graphes, et 11 renvois en avant
  dans des remarques (`a-transversal → cardinal`, `l-compacite → ultrafiltre`, `l-completude →
  ultrafiltre`, `r-equipotence → cardinal`, `rr-definition → suite-cauchy`, `top → espace-metrique`,
  `z-ordre → corps-ordonne`, `zf-choix → choix-denombrable`, `zf-parties → produit-cartesien`,
  `zf-rempl → bon-ordre`, `zf-rempl → ordinal`). Les renvois en avant sont permis dans les remarques ;
  ce ne sont pas des erreurs.
- Croisements d'arêtes : 19 dans l'édifice (la section 12 du mémo commun parlait de 4 à 10). Dans les
  graphes intérieurs : 5 dans `geod` ; 3 dans `alglin`, `anf`, `continuite` et `geoalg` ; 2 dans `alg`,
  `mes`, `ord` et `top` ; 1 dans `fourier`, `nban` et `proba` ; 0 ailleurs.
- Résultats admis (mot « admis » présent) : dans 19 graphes, surtout `geod` (6), `hom` (4), et `edo`,
  `lie`, `log`, `mart`, `tan` (3 chacun). Champ `choix:` (⋆) : dans 14 fichiers.

### 25. Points ouverts

1. **Mise en page de l'édifice** : 19 croisements. Il faut comprendre ce qui a fait monter ce nombre
   (ajouts de théories depuis le 24 octobre) et améliorer `disposer`, par exemple en essayant davantage
   d'ordres de départ ou en optimisant les croisements couche par couche sur les seules arêtes longues.
2. **Espaces métriques** : nœud de niveau 0 envisagé, dépendant de ℝ et de la topologie (section 2 du
   mémo commun). Le renvoi en avant `top → espace-metrique` l'annonce déjà.
3. **Résultats admis** : faire l'inventaire précis, nœud par nœud, des « Admis ici ». Pour chacun,
   vérifier que la difficulté contournée est bien indiquée, et décider s'il faut le démontrer.

### 26. Méthode de la rubrique

- Tout ajout de nœud respecte l'ordre d'apparition : chaque terme employé dans `texte`, `enonce` ou
  `preuve` est défini dans un ancêtre, et chaque nouveau terme du lexique porte `defini_dans`.
  `construire.py` le vérifie.
- Démonstrations : complètes, ou marquées « Admis ici » avec la difficulté contournée ; tout usage
  d'une forme du choix est signalé dans `choix:` (⋆). Les calculs des exemples sont vérifiés avec sympy
  ou numpy avant d'être écrits.
- **Passe de schématisation obligatoire (consigne de l'auteur, 28 oct. 2026).** Toute fiche créée ou
  réécrite passe par le travail de la section 29 avant publication : relire chaque définition,
  énoncé, preuve, exemple et remarque, décider où un schéma ou un diagramme commutatif éclaire
  vraiment (mécanisme d'une preuve, contenu géométrique ou combinatoire d'une définition, exemple
  qui se lit mieux dessiné ; jamais décoratif), le dessiner par le calcul dans le module du graphe
  (`outils/edifice_schemas_<groupe>.py`), le regarder (clair et sombre, bureau et téléphone), et
  consigner dans le rapport les endroits examinés et écartés. Une consigne donnée à un agent de
  rédaction comporte toujours cette étape ; elle n'est jamais facultative.
- Après chaque lot : construire jusqu'à zéro erreur, regarder le rendu du graphe modifié et de ses
  fiches (clair et sombre, bureau et téléphone), relever le nombre de croisements du graphe touché,
  puis rebaser, pousser et suivre la publication (section 0).

### 29. Schémas dans les fiches (28 oct. 2026)

**Syntaxe.** Dans `texte`, `enonce`, `preuve` ou une remarque, sur des lignes à part :

    ```schema <nom>
    Légende : une ou deux phrases complètes qui disent ce qu'il faut lire sur la figure.
    ```

`rendu.mjs` insère `contenu/schemas/<nom>.svg` tel quel dans la page (`<figure class="schema">`), puis
la légende rendue comme le texte (formules, mais ni `[[…]]` ni `{{…}}` par prudence) en `figcaption`.
Un schéma manquant est une erreur de construction. Le nom est l'id du nœud, suivi de `-2`, `-3`… s'il y
en a plusieurs. Un diagramme commutatif ne passe pas par un SVG : on écrit `$$\begin{CD}…\end{CD}$$`
(KaTeX 0.16), suivi d'une phrase.

**Couleurs.** Aucune couleur n'est écrite dans les SVG, seulement des classes, que `gabarit.html` relie
au thème (règles `svg.schema`, `figure.schema > svg` ; ne jamais écrire `figure.schema svg`, qui
atteindrait les radicaux de KaTeX). Code constant : `t` encre (trait principal), `g` gris (axes,
constructions, exclu), `r` rouge (objet étudié, point décisif), `b` bleu (second objet), `v` vert
(troisième), `o` or (ce que fournit l'axiome du choix) ; `s-X` trait, `d` pointillé, `f-X` remplissage
léger, `p-X` point plein, `x-X` texte.

**Prime.** Dans une étiquette, `′` est placé automatiquement en exposant (au pied, la police KaTeX le
dessine comme « / »).

**Outils.** `outils/edifice_svg.py` (classes `Schema` et `Repere`, flèches, étiquettes en polices KaTeX
avec indices `x_0`, exposants, `` `sup` `` en romain, ℝ en ajouré ; l'épaisseur `l=` passe par un style
en ligne) ; `outils/edifice_schemas.py` (registre ; `python3 outils/edifice_schemas.py [noms]` régénère
les SVG) ; un module par groupe de graphes, `outils/edifice_schemas_<groupe>.py` (analyse, reelle,
fondations, topologie, geod, integration, proba, algebre), chaque figure étant une fonction qui calcule
ses positions et vérifie par `assert` ce qu'elle affirme ; `outils/edifice_apercu.mjs SORTIE noms…`
(aperçu clair/sombre, bureau 560 px et téléphone 358 px, sans construire le site). Largeur 460 à 540,
étiquettes 15 à 17.

**État.** 106 schémas et 7 diagrammes commutatifs, dans 29 graphes (zf et n n'en ont pas, ni les
fiches de l'édifice). Relevé fait par quatre lecteurs, production par sept agents ; relecture du rendu
de chaque schéma dans le site construit. Corrections de fond faites à cette occasion : `geod`
(‖·‖₂ et ⟨·,·⟩ définis là où ils servent, coquille « a + c s e_i » dans Schwarz, « 2π » donné comme
renvoi à l'analyse complexe), `top` (e^{2iπt} signalé comme renvoi en avant). Écartés : q-denombrable
(un tableau n'apporte rien), gs-correspondance-2 (la remarque ne traite pas ℚ(∛2, j)), et la fiche ℚ de
l'édifice (doublon de q-irrationnel).

Précision ajoutée dans ta-revetement (iii) : la partie déjà traitée du bord d'un carré est un seul côté
dans la première rangée ou la première colonne, et le coin $(0, 0)$ pour le premier carré.

### 30. Chapitres de l'analyse réelle détaillés ; candidats suivants (28 oct. 2026)

**Fait.** Les quatre chapitres `ar-suites` (10 nœuds), `ar-topo` (10), `ar-deriv` (12) et `ar-riemann`
(11) s'ouvrent désormais sur un graphe intérieur, comme `continuite` ; ils gardent leur identifiant
(cités par les cours, les feuilles et les annales). Rédaction par quatre agents dans des copies de
travail séparées, fusion sans conflit, construction à zéro erreur, 0 croisement dans chacun. Bilan :
`OK : 423 nœuds, 265 termes, 36 graphes`. Borel-Lebesgue n'est plus admis. Choix signalé (⋆) :
caractérisation séquentielle de l'adhérence et compacité séquentielle ⇒ compacité (équivalentes dans ZF
au choix dénombrable sur ℝ, Herrlich et Strecker, Comment. Math. Univ. Carolinae 38, 1997). Termes
déplacés : `limite-suite`, `suite-extraite` (de `ar-bw` vers `su-extraites`), `sphere-unite`,
`derivable`, `subdivision`, `fonction-escalier`, `riemann-integrable` ; créés : `limite-infinie`,
`suites-adjacentes`, `topologie-usuelle`, `partie-dense`, `limite-fonction`, `extremum-local`,
`derivee-successive`, `somme-riemann`. Retouches de fusion : Rolle cite `de-extremum` au lieu de
refaire l'argument ; `gd-accroissements` (i) renvoie à `de-taf` ; renvoi à `q-irrationnel` dans une
remarque de `ri-integrable` ; source exacte du mémoire de Riemann (présenté en 1854, publié par
Dedekind en 1867, Abh. Göttingen 13).

**Faits ensuite (28 oct. 2026).** Passe de schématisation des quatre chapitres (27 schémas). Candidat 1 :
`rr-multiplication` devient un graphe de 7 nœuds (`rm-`), ℝ corps ordonné entièrement démontré.
Candidats 2 et 3 : `z-polynomes` devient un graphe de 10 nœuds (`pol-` ; racines, factorisation,
dérivée formelle, binôme et p | C(p,k), Gauss, Eisenstein, énoncés sur le corps des fractions de ℤ
puisque ℚ vient après) ; arête z-zn → z-polynomes ; galois et ℂ y renvoient ; `gs-abel-ruffini` (ii)
récrit sans d'Alembert-Gauss (TVI, Rolle, racine ⇔ facteur, `c-racines-carrees`), et deux lacunes de
l'ancienne preuve comblées (élément d'ordre 5 = 5-cycle ; génération de 𝔖₅). Bilan :
`OK : 440 nœuds, 271 termes, 38 graphes`. Croisement préexistant relevé : `zf` (1).
Candidat 5 : `l-completude` devient un graphe de 8 nœuds (`hk-` : règles dérivées, constantes,
égalité, témoins par étages L₀ ⊂ L₁ ⊂ … ⊂ L⁺ et conservativité, Lindenbaum, modèle des termes clos,
lemme de vérité, existence d'un modèle) ; `l-lowenheim` démontré (corollaire, sans choix). Choix : le cas
dénombrable est sans choix (énumération) ; le cas général invoque, dans la métathéorie, un principe de
maximalité (Zorn pour l'inclusion), signalé ⋆ dans `hk-lindenbaum` (ii) : pour une signature quelconque,
la complétude équivaut dans ZF au lemme de l'ultrafiltre. Bilan : `OK : 448 nœuds, 274 termes, 39 graphes`.
Candidat 4 : nouvelle théorie de niveau 0 `met` « Espaces métriques et normés » (famille ana ; arêtes
analyse-reelle → met, alglin → met, met → geod, anf, anc, topalg ; top → anf retirée). Graphe de 12 nœuds :
8 nœuds `me-` et 4 nœuds déménagés avec leur id (gd-normes, gd-equivalence, gd-point-fixe généralisé aux
espaces complets, f-baire). Doublons remplacés par des renvois : f-evn (i), ed-cauchy-lipschitz (i),
cx-suites (i, iv), lemme de Lebesgue de ta-revetement (dont la preuve cachait un choix de rayons). Ordre de
edifice.yaml réglé : 16 croisements (19 avant) ; geod 1 (5), anf 1 (3), met 0. Entrées réduites aux
nœuds de départ (gd-gl et f-application-ouverte n'affichent plus leur entrée, pour un croisement de moins).
Texte d'accueil de l'édifice mis à jour (31 branches). Bilan : `OK : 457 nœuds, 276 termes, 40 graphes`.

**Candidats suivants** (relevé du 28 oct. 2026 sur tout l'édifice ; priorité 1 d'abord) :
1. `rr-multiplication` (r) : « admise en partie », sous toute l'analyse → sous-graphe (axiomes de corps
   des positives, inverse, signes, morphisme q ↦ q*). Petit à moyen.
2. `z-polynomes` (z) : de fait un chapitre ; « racine ⇔ facteur », « au plus d racines », factorisation
   dans K[X] sont employés sans être démontrés ; Gauss et Eisenstein prouvés dans `gs-abel-ruffini`,
   dérivée formelle dans `gs-separabilite`, binôme et p | C(p,k) dispersés → sous-graphe « polynômes »
   (+ arête z-zn → z-polynomes). Moyen.
3. `gs-abel-ruffini` : la preuve s'appuie sur `c-dalembert`, admis dans `c` (démontré dans `anc`, qui
   n'est pas un ancêtre de galois) ; correction : trois racines réelles par le TVI, le quotient de
   degré 2 par `c-racines-carrees`. Petit.
4. Niveau 0 « Espaces métriques et normés » (point ouvert 25.2) : matière aujourd'hui dispersée et
   démontrée deux fois (boules : gd-normes et f-evn ; point fixe : gd-point-fixe et
   ed-cauchy-lipschitz ; fermés bornés : cx-suites et gd-equivalence ; Lebesgue dans ta-revetement).
   Gros.
5. `l-completude` (log) : existence d'un modèle admise → sous-graphe Henkin (Löwenheim-Skolem en
   devient un corollaire). Moyen.
Priorité 2 : ~~`li-cartan`~~ (fait le 28 oct. 2026, voir plus bas), ~~`ga-nullstellensatz`~~ (fait le 28 oct. 2026),
`t-tychonov` (écarté par l'auteur le 28 oct. 2026 : il demanderait la flèche ordin → top, qui ferait remonter la topologie et ses 19 descendants ; l'énoncé conditionnel « ultrafiltre ⇒ Tychonov » a été proposé sans être retenu), ~~scindages de `gs-groupes`~~ (fait), ~~`v-determinant`~~ (fait),
~~`ta-revetement`~~ (fait) ; ~~réduction et trace en algèbre linéaire~~ (fait) ;
~~découpage de `geod`~~ (fait en deux théories, voir plus bas) ; ~~suites i.i.d. uniformes en proba~~ (fait). Priorité 3 : Mayer-Vietoris
(subdivision, gros), ~~`derham` en degré 1~~ (fait), compléments des théories terminales, ~~théories « groupes
finis » et « algèbre commutative »~~ (faites le 29 oct. 2026, voir plus bas), scindages de confort.

### 31. Recherche dans tout l'édifice (28 oct. 2026)

Demande de l'auteur : une barre de recherche au-dessus des onglets Fiche et Lexique, pour trouver un
nœud dans n'importe quelle théorie ou sous-théorie sans les ouvrir une à une.
- **Gabarit** : bloc `.tete-panneau` (collant) qui contient `.cherche-edifice` (champ `#cherche-edifice`,
  liste `#resultats-edifice`) puis `.onglets`. Fonctions `indexEdifice`, `surligneEdifice`,
  `chercherEdifice`, `fermerResultatsEdifice`, `ouvrirResultatEdifice`, `clavierEdifice` (après
  `montrerOnglet`). Tous les mots doivent figurer (sans accents) ; classement : titre et étiquette
  (début de mot 60, ailleurs 40, titre exact +100, titre commençant par la requête +40), puis termes du
  lexique que le nœud définit (25, ligne « définit : … »), puis texte de la fiche (8, « dans le texte de
  la fiche ») ; léger avantage aux niveaux supérieurs ; 40 résultats au plus. Chaque résultat donne le
  titre surligné, la nature (couleur de la fiche) et le chemin (Théorie › Sous-théorie). Flèches,
  Entrée, Échap ; clic ou Entrée → `ouvrirNoeud` (sur téléphone, défilement jusqu'au panneau). Bouton
  « Effacer la recherche » (`#effacer-edifice`, style de `.rech-effacer` des Annales, icône seule sur
  téléphone), visible dès que le champ n'est pas vide ; la croix native du champ est masquée.
- **rendu.mjs** : champ `cherche` de chaque nœud (texte et énoncé en texte brut, sans formules ni
  schémas, minuscules sans accents, 400 caractères), présent dans la page même quand les fiches des
  branches sont chargées à la demande (environ 150 Ko non compressés de plus dans `site/index.html`).

### 32. Zoom du graphe au pincement (28 oct. 2026)

Demande de l'auteur : sur téléphone, zoomer à deux doigts plutôt qu'avec + et −. `.vue` porte
`touch-action: pan-x pan-y` : un doigt garde le défilement natif, le navigateur n'agrandit plus la page
entière au pincement. Gabarit : `zoomGraphe(échelle, cx, cy)` change `etat.echelle` (bornes 0,35 à 1,6,
celles des boutons) et corrige le défilement pour que le point du graphe sous (cx, cy) y reste ; les
écouteurs `touchstart`/`touchmove`/`touchend` sur `#vue` suivent deux doigts (échelle = échelle initiale ×
écart courant / écart initial ; le milieu des doigts fait aussi glisser le graphe) ; Ctrl + molette (pincement
du pavé tactile sur ordinateur) appelle la même fonction. Vérifié en simulation tactile (CDP) : écart
80 → 200 px donne 0,55 → 1,375, point central conservé à 3 px près, page non agrandie ; défilement à un
doigt et toucher d'une bulle inchangés. Les boutons + et − restent.


## 33. Routage des arêtes en pistes (28 octobre 2026)

Demande de l'auteur : d'abord supprimer les ondulations des arêtes longues, puis (même jour) pouvoir suivre
le trajet de chaque flèche, sans chevauchement. Une première version (fils tendus arrondis en splines)
a été remplacée le jour même par un routage orthogonal à coins arrondis, dans `disposer` (`construire.py`) :
1. Redressement : les fictifs de chaque arête longue sont alignés à la verticale aussi longtemps que leurs
   voisins de couche le permettent (intersection des intervalles admissibles, couche après couche ;
   4 passes, arêtes les plus longues d'abord), de préférence à l'aplomb du départ ou de l'arrivée.
   L'ordre et les écarts `sep` sont gardés : croisements inchangés (édifice 16).
2. Ports : chaque arête part d'un point distinct du haut de sa bulle et arrive en un point distinct du
   bas de sa cible (pas de 14 px au plus, rangés comme les destinations ; bord du cercle calculé pour
   ℕ, ℤ, ℚ, ℝ, ℂ ; départ des entrées « niveau supérieur » 7 px au-dessus de leur étiquette).
3. Pistes : dans la bande entre deux couches, chaque changement d'abscisse se fait sur une horizontale
   propre (coins en quart d'arc, rayon 8 px au plus). Deux horizontales qui se recouvrent (marge 10 px)
   ont des pistes différentes ; quand l'ordre est conservé, vers la droite celle de gauche est au-dessus,
   vers la gauche celle de droite (sinon une horizontale couperait la verticale de l'autre). La bande
   vaut max(ECART_Y − HMAX, (pistes + 1) × 8 px) : les rangs s'écartent selon le besoin, et les
   ordonnées des étiquettes de rang suivent (`ycouche`).
Deux arêtes ne se superposent donc jamais ; elles ne peuvent que se croiser à angle droit.
4. Gabarit : chaque arête a une zone de saisie invisible de 12 px (`.zone-arete`) ; la survoler (ou la
   toucher sur téléphone) met la flèche en évidence, au premier plan, avec ses deux extrémités, comme le
   survol d'une bulle le faisait déjà pour toutes ses flèches.
Vérifié : édifice (clair, sombre, téléphone), continuite, geod ; zéro traversée de bulle.

Légende sur téléphone (28 oct. 2026) : le panneau, calé à droite du bouton, sortait de l'écran par la
gauche quand le bouton passe à la ligne. `placerLegende` (événement `toggle`, et `resize`) le décale pour
qu'il tienne entre deux marges de 16 px, et borne sa hauteur à l'écran (défilement interne) ; largeur
min(374 px, 100vw − 32 px) en `border-box`. Vérifié à 375 et 390 px (clair, sombre) et sur ordinateur.

Cartan-von Neumann démontré (28 oct. 2026, graphe `lie`, 7 nœuds). Deux lemmes ajoutés :
`li-series` (une série de polynômes de N variables dont toutes les séries de dérivées partielles
convergent normalement sur les cubes est C^∞ ; preuve par la dérivation terme à terme en une variable,
établie sur place par l'intégrale, puis récurrence via gd-classe-ck (i)) rend `li-exponentielle`
C^∞ (majoration n^{k-1} k^m ρ^{k-m}/k! des dérivées des coefficients de A^k/k!, vérifiée par sympy) ;
`li-petits` (aucun e^Y ∈ G avec Y petit dans un supplémentaire m de g) par un recouvrement fini de la
sphère unité de m par des « bonnes boules », ce qui évite l'extraction de suite et donc le choix
dénombrable de la preuve habituelle ; schéma `li-petits` (t = 3, δ = 0,6, s = 0,45, m = 6). La preuve
de `li-cartan` redresse G en I par Ψ(x, y) = e^{X}e^{Y}, puis partout par translation à gauche.
Relecture indépendante (second agent, deux passes) : huit remarques, toutes traitées. Points notables :
dΨ(0) justifié par gd-differentielle (iii)-(iv) ; la « structure produit » employée par li-definition
n'était définie nulle part : ajout du point (iv) *Produit* à `gd-varietes` (atlas produit, séparation,
base dénombrable par q-denombrable (i), et, pour deux sous-variétés, même atlas maximal que celui de
(ii)) ; densité de l'enroulement irrationnel et non-sous-variété marquées « admis ici » ; remarque de
li-series corrigée (on applique le premier pas de la preuve, pas le lemme ; argument de positivité).

Nullstellensatz complété (28 oct. 2026, graphe `geoalg`, 10 nœuds). Nouveau nœud `ga-lemme-zariski` :
un corps L = K[x₁, …, xₙ] est de dimension finie sur K, par récurrence sur n (pour tous les couples
K ⊂ L à la fois) ; cas algébrique (K[x] corps de dimension ≤ deg Q, tour de dimensions finies) et cas
transcendant (un dénominateur commun f écrit tout F = K(x) comme P(x)/f(x)^k, contredit par
1/(1 + xf(x)) via le binôme). Aucun choix. Schéma `ga-lemme-zariski` (tour à deux étages). Dans
l'édifice, arête alglin → geoalg (alg → geoalg devient redondante) ; croisements de l'édifice 16 → 19.
Entrées de geoalg : alglin et z alimentent le lemme. Champ `choix` du Nullstellensatz précisé : seul
« un idéal propre a un zéro » passe par Krull. Relu par un second agent (six remarques, traitées).

Survol des bulles (28 oct. 2026, signalé par l'auteur : la mise en évidence restait après le survol).
Cause : le gabarit contenait deux fonctions `surligner`, celle de l'édifice (bulle) et celle des Annales
(texte, requête), déclarée plus bas ; la seconde remplaçait la première, si bien que le survol d'une
bulle n'avait aucun effet, et que la mise en évidence d'une flèche (`surlignerArete`) n'était jamais
effacée. La fonction de l'édifice s'appelle désormais `surlignerNoeud`. Vérifié : survol d'une bulle
(4 flèches, 5 bulles), retour à l'aspect initial sur le fond, après un clic, et hors du graphe.
Précaution : préfixer les fonctions globales du gabarit par rubrique.

Scindage de `gs-groupes` (28 oct. 2026) en quatre nœuds : `gs-lagrange` (schéma `gs-lagrange` : les
classes de {0, 4, 8} dans ℤ/12ℤ, quatre triangles), `gs-cauchy` (McKay ; exemple 𝔖₃, p = 3 : 36 triplets,
3 points fixes, 11 orbites, vérifié par Python), `gs-resolubles` (définition, commutateurs, quotients ;
preuves détaillées), `gs-sn` (𝔖ₙ non résoluble pour n ≥ 5 ; remarque vérifiée : dans 𝔖₄ le commutateur
de deux 3-cycles est l'identité ou une double transposition). Liens réorientés : corps finis → Lagrange,
radicaux → résolubles, Abel-Ruffini → Cauchy et 𝔖ₙ ; lexique `groupe-resoluble` défini dans
`gs-resolubles`. L'ancre `#galois.gs-groupes` n'existe plus.

Scindage de `v-determinant` (28 oct. 2026) en trois nœuds : `v-determinant` (id conservé, car les
rubriques Cours, Exercices et Annales y renvoient : déterminant d'un endomorphisme, (i) existence et
multiplicativité, (ii) bijectivité), `v-det-matrice` ((i) matrice dans toute base, (ii) produit et
inversibilité, (iii) transposée, lignes ; remarques non-additivité et orientation, schéma `v-determinant`),
`v-comatrice` (développement, comatrice ; exemple 3×3 vérifié par sympy, schéma `v-comatrice` du cofacteur
C₂₁ = −4). Liens réorientés dans alglin (algèbre extérieure), geod (gd-gl, orientation), edo, tan.
Croisements d'alglin 3 → 4.

Scindage de `ta-revetement` (28 oct. 2026) en trois nœuds : `ta-revetement` (id conservé pour le
lexique : définition et unicité des relèvements ; contre-exemple ℝ → ℝ/ℤ restreint à ]0, 3/2[, schéma
`ta-revetement-0`), `ta-relevement-chemins` (lemme de Lebesgue, existence par subdivision, schéma
`ta-revetement` ; entrée met), `ta-relevement-homotopies` (carrés rangée par rangée, schéma
`ta-revetement-2`). ta-cercle renvoie au relèvement des homotopies. Arêtes : chemins → revêtements,
homotopie → relèvement des homotopies.

Trace et réduction (28 oct. 2026, alglin, 20 nœuds) : `v-trace` (linéarité, tr(AB) = tr(BA), tr(ᵗC H) =
Σ c_ij h_ij, invariance par changement de base ; remarque : seulement les permutations circulaires,
E₁₁E₁₂E₂₁ contre E₁₂E₁₁E₂₁) et `v-valeurs-propres` (det(u − λ id) = 0, liberté des vecteurs propres,
n valeurs propres distinctes ⇒ diagonalisable, trace et déterminant d'une matrice diagonale ; exemples
vérifiés par sympy, rotation sans valeur propre réelle, Jordan 2×2 non diagonalisable ; schéma
`v-valeurs-propres`). Le polynôme caractéristique n'est pas traité : K[X] vit dans z-polynomes, qui
n'est pas un ancêtre d'alglin. `v-matrices` définit maintenant K^n en colonnes, M_n, I_n, la
transposée, et (iii) l'associativité. Liouville (ed-lineaires (iii)) : différentiabilité de det et règle
de la chaîne justifiées. Lexique : `trace`, `valeur-propre`. Relu par un second agent (deux passes).

Découpage de la géométrie différentielle (28 oct. 2026). Proposé en trois théories (calcul différentiel,
variétés, formes) ; l'auteur a écarté la séparation des formes, dont l'usage est essentiellement
géométrique et dont le contraste avec les variétés est trop faible. Fait en deux : `cdiff` (Calcul
différentiel, famille ana, 7 fiches : gd-differentielle, gd-accroissements, gd-classe-ck, gd-gl,
gd-inversion-locale, gd-submersions, gd-schwarz) et `geod` (13 fiches, nom et id conservés). Ids des
fiches inchangés, donc aucun renvoi à retoucher. Entrées : cdiff ← met, analyse-reelle, alglin ; geod ←
cdiff (sous-variétés, formes), met (base dénombrable), alglin (formes). Les deux arêtes croisées
(submersions → sous-variétés, Schwarz → formes) passent par les entrées. Texte d'accueil : « Trente-deux
branches », lien {{cdiff}} ajouté dans le gabarit. Les rubriques Cours et Exercices qui rangent sous la
théorie `geod` des notions de calcul différentiel pourraient les rattacher à `cdiff` (domaine des autres
conversations).

Suites indépendantes (28 oct. 2026, proba, 15 nœuds) : `p-suites-iid`, après p-normaux. (i) U_m =
Σ_j d_{2^m(2j+1)} 2^{-(j+1)} indépendantes uniformes (partage des chiffres par k = 2^m(2j+1), regroupement ;
loi de V par les dyadiques et P(V = x) = 0) ; (ii) fonction quantile G(u) = inf{F ≥ u}, X = h(U) borélienne ;
(iii) suites indépendantes de lois données, donc i.i.d. de loi quelconque. Schéma `p-suites-iid` (24
chiffres colorés selon U_m). Remarques : variables décalées 2^m ω mod 1 uniformes mais dépendantes ;
produits infinis (Andersen-Jessen, Ionescu Tulcea, Kolmogorov polonais) admis ; choix dénombrable seulement
via la mesure de Lebesgue. Relu par un second agent (deux passes, cinq remarques traitées). La priorité 2
est épuisée, à l'exception de Tychonov, écarté par l'auteur.

De Rham en degré 1 (28 oct. 2026) : le nœud `derham` devient un conteneur (graphe `derham.yaml`, 5 nœuds,
entrées geod et hom). `dr-primitives` (primitive sur toute boule ‖·‖∞ par Poincaré translaté ; unicité à
constante près sur un connexe), `dr-integrale` (intégrale d'une forme fermée le long d'un chemin continu par
subdivision adaptée, indépendance, accord avec gd-integrale-curviligne, Chasles, linéarité),
`dr-homotopie` (bord d'un carré : grille de Lebesgue, schéma `dr-homotopie` ; homotopie à extrémités
fixes), `dr-chaines` (intégration sur C₁, nulle sur les bords via (s,t) ↦ (1−s, s(1−t), st), schéma
`dr-chaines` ; Φ : H¹(U) → Hom(H₁(U), ℝ)), `dr-degre1` (Φ injective, primitive construite sur chaque
classe de points liés par lignes brisées, point de base pris dans une énumération fixée de ℚⁿ, sans choix ;
corollaire H¹(ℝ²∖0) ≅ ℝ et critère du carré). Surjectivité admise (Mayer-Vietoris de de Rham, partitions de
l'unité). Remarques de gd-de-rham mises à jour ; accueil : « Trente-trois branches », derham « démontré en
degré 1 ». Relu par un second agent (trois passes, dix remarques traitées).

Groupes finis (29 oct. 2026, priorité 3) : nouvelle théorie de niveau 0 `gf` (famille alg ; arêtes z, alglin,
alg → gf → galois), 14 fiches. Les nœuds gs-lagrange, gs-cauchy, gs-resolubles et gs-sn quittent galois avec leurs
ids (entrée gf de galois : gs-corps-finis, gs-radicaux, gs-abel-ruffini). Nouveaux : gf-cycliques (produit direct
défini là), gf-actions, gf-sylow (Wielandt ; dénombrement des parties ajouté en pol-binome (v)), gf-produits
(transport des produits semi-directs), gf-abeliens (lemme du supplémentaire puis existence), gf-diedraux (𝒬₈ réalisé
dans GL₂(ℤ/3ℤ)), gf-ordres-pq, gf-ordre-8, gf-ordre-12 (3-cycles et doubles transpositions définis ; Dic₃ et 𝒟₆ par
transport), gf-petits-ordres (tableau des 24 groupes, résolubilité démontrée en remarque, 𝔄₅ non résoluble par
gs-sn, minimalité admise). Admis : 𝒟ₙ = isométries du polygone, 𝔄₄ = rotations du tétraèdre, unicité du groupe
non abélien d'ordre pq, nombres 14 et 51 de groupes d'ordres 16 et 32. Cinq schémas (`outils/edifice_schemas_gf.py`) :
treillis de ℤ/12ℤ, orbite et stabilisateur du carré, pentagone et hexagone, treillis de 𝒟₄ et 𝒬₈, nombre de groupes
par ordre ; écartés : Sylow et produits semi-directs (rien à dessiner qui ne soit déjà dans les treillis).
**Document de l'auteur** « Liste des premiers groupes finis » (41 p.) : `documents/edifice/liste-premiers-groupes-finis.pdf`,
proposé par une carte « Ouvrir / Télécharger » dans la fiche gf-petits-ordres (champ générique `documents:` d'un nœud,
rendu par le gabarit, `.document-fiche`) et mentionné dans le texte de la théorie. Relu par un second agent (deux
passes, quinze remarques traitées, dont deux identités de permutations qu'il proposait fausses et qui ont été
recalculées). Accueil : « Trente-quatre branches », lien {{gf}}.

Algèbre commutative (29 oct. 2026, priorité 3) : nouvelle théorie de niveau 0 `ac` (famille alg ; arêtes alg, z,
alglin → ac → geoalg, tan), 10 fiches, 0 croisement. ac-divisibilite (associés, irréductibles, premiers ; contre-exemple
K[X², X³], X⁶ = X²·X²·X² = X³·X³), ac-factoriels (factoriel ⇔ existence + irréductibles premiers ; PGCD), ac-noetheriens
(⋆ choix dépendant pour la condition maximale ; sous-anneau non noethérien {P ∈ F[X] : P(0) ∈ ℤ}), ac-principaux (⋆,
principal ⇒ factoriel ; premiers non nuls maximaux), ac-gauss (A factoriel ⇒ A[X] factoriel, sans choix : ne dépend
pas de ac-principaux ; K[X, Y] non principal), ac-hilbert (base de Hilbert, Math. Ann. 36, 1890, p. 473-534),
ac-chinois (idéaux comaximaux, interpolation de Lagrange en remarque), ac-localisation (S⁻¹A, propriété universelle,
idéaux premiers de S⁻¹A), ac-locaux (définition par l'idéal des non-inversibles, sans Krull ; A_𝔭 ; ℤ₍ₚ₎ et
valuation), ac-nakayama (1 + I ⊂ A^×, générateurs minimaux = dim M/𝔪M). Quatre schémas
(`outils/edifice_schemas_ac.py`) : exposants de K[X², X³], escalier des L_d de (4, 2X, X²), bijection chinoise
ℤ/12 → ℤ/3 × ℤ/4, spectre de ℤ vu par ℤ₍₃₎ et ℤ[1/6] ; écartés : factoriels, principaux, Gauss, locaux, Nakayama
(rien de géométrique qu’un dessin éclaire). Relu par un second agent (sept remarques et dix suggestions traitées, dont une fausse affirmation sur la dimension de plongement et le mot « spectre » employé avant sa définition). Retouches : ga-zeros (iv) (tout ensemble algébrique est défini par un
nombre fini d'équations, par Hilbert ; entrée ac de geoalg), an-ideaux (i) (ℤ[√−5] non factoriel, 2 irréductible non
premier ; entrée ac de tan). Lexique : element-irreductible, element-premier, anneau-factoriel, anneau-noetherien,
localise, anneau-local. Accueil : « Trente-cinq branches », lien {{ac}}.

Pointes de flèches (29 oct. 2026, signalé par l'auteur sur l'édifice : pointes détachées ou retournées sous
« Théorie analytique des nombres » et « Analyse fonctionnelle »). Cause : dans une bande chargée, la piste la plus
haute tombait à moins de 6 px (longueur de la pointe) sous la bulle d'arrivée ; le dernier segment était alors trop
court, ou redescendait, et la pointe s'inversait. Le défaut touchait presque tous les graphes. Corrections dans
`disposer` : marge `DEGAGE = 10` px sous chaque couche avant la première piste ; passe `caler` qui glisse en bloc les
ports d'une bulle (écart inchangé, sans sortir de la bulle) pour aligner les flèches sur leur verticale, ce qui fait
passer les crochets de moins de 16 px de 114 à 15 sur les 708 arêtes ; vérification bloquante « la flèche … arrive
par un segment trop court ». Croisements inchangés. Document de l'auteur remplacé par sa version recompilée
(sommaire visible, 42 p.).

Mayer-Vietoris (29 oct. 2026, priorité 3) : le théorème des petites chaînes n'est plus admis. Deux nœuds dans
`hom` : `h-subdivision` (chaînes linéaires augmentées LC(Y), cône, S et T par récurrence, ∂S = S∂ et
∂T + T∂ = id − S, transfert aux chaînes singulières par S σ = σ_#(S ι_n), naturalité, diamètres pour d_∞ :
facteur n/(n+1)) et `h-petites-chaines` (recouvrement ouvert quelconque ; entier m(σ) le plus petit k tel que
toute partie de diamètre ≤ (n/(n+1))^k soit dans un σ⁻¹(U), sans choix ; monotonie sur les faces ; D = D_{m(σ)} ;
ρ = id − ∂D − D∂). `h-mayer-vietoris` (i) cite ce nœud. Schémas `h-subdivision` (S ι₂ : 6 triangles, S² ι₂ :
36, côté maximal 7/18) et `h-petites-chaines` (ancien schéma de Mayer-Vietoris, m(σ) = 3 calculé par fenêtres
glissantes). Relu par un second agent (deux passes ; une affirmation fausse corrigée : m(σ) = 2 dans la légende).
Identités vérifiées par un calcul exact jusqu'en dimension 3.

Compléments des théories terminales (29 oct. 2026). Inventaire des « admis » des théories sans successeur
(fourier, lie, mart, tan, derham, nban). Faits : `mart` — `mt-montees` (inégalité des montées, stratégie H) et
`mt-doob-l1` (martingales bornées dans L¹ : convergence p.s. ; M_∞ défini hors d'un négligeable), l'urne de Pólya
cite désormais `p-suites-iid` (elle admettait encore l'existence de variables uniformes indépendantes) et justifie
l'espérance conditionnelle du tirage ; schéma `mt-montees`. Relu par un second agent (deux passes).
Restent candidats : tan (factorisation de Dedekind, en cours ; groupe des classes), fourier (continuité de Lévy),
lie (deux faits admis en remarque), derham (surjectivité, partitions de l'unité).
Formules longues : 79 fiches ont une formule centrée plus large que l'écran d'un téléphone de 390 px (défilement
horizontal) ; relevé dans le dossier de travail, à traiter avec l'auteur.
Factorisation de Dedekind (29 oct. 2026) : trois nœuds dans `tan`, après an-ideaux : `an-dedekind-lemmes` (indice
et Lagrange, idéaux de type fini, 𝒪 intégralement clos sous la forme « xI ⊂ I ⇒ x ∈ 𝒪 », tout idéal non nul contient
un produit de premiers, par récurrence sur l'indice, sans choix), `an-inverse` (𝔭′ = {x : x𝔭 ⊂ 𝒪}, 𝔭𝔭′ = 𝒪),
`an-factorisation` (existence et unicité ; exemple (6) = 𝔭²𝔮𝔮′ dans ℤ[√−5] avec primalité par des morphismes
vers 𝔽₂, 𝔽₃ et non-principalité ; schéma `an-factorisation`, produits vérifiés par formes d'Hermite). Groupe des
classes : défini, finitude admise. `outils/edifice_svg.py` : 𝔮 ajouté aux lettres gothiques. Relu par un second
agent (deux passes ; une affirmation fausse corrigée sur les idéaux non principaux de ℤ[√−5]).
Lévy (29 oct. 2026) : nœud `fo-levy` dans `fourier` (convergence en loi, terme `convergence-loi` ; lemme de Scheffé ;
sens direct du théorème de continuité de Lévy par lissage gaussien et encadrement ; la forme complète, avec tension,
reste admise ; exemple des lois uniformes discrètes, schéma `fo-levy`). Relu par un second agent (deux passes).
Lie (29 oct. 2026) : les deux faits admis en remarque sont démontrés : (−1, 1 ; 0, −1) n'est pas une exponentielle
(commutant de N) ; l'enroulement irrationnel est dense, non fermé (le point (I, R_{πα})) et n'est pas une
sous-variété (localement fermé ⇒ ouvert dans son adhérence ⇒ fermé).
Surlignage sur écran tactile (29 oct. 2026, signalé sur iPhone : en ouvrant une théorie, toutes les bulles
restaient atténuées). Cause : les survols simulés par le navigateur au toucher posaient la classe `focus` sur
`#plan`, sans sortie pour l'effacer. Gabarit : le survol (`pointerover`/`pointerleave`) ne réagit qu'à une souris ;
au toucher, un appui sur une flèche la met en évidence et un appui hors des bulles l'efface (`pointerup`) ; le
focus ne surligne qu'au clavier (`:focus-visible`) ; `dessiner` retire `focus` à chaque nouveau graphe.

Découpages de confort (29 oct. 2026, accord de l'auteur ; contenu inchangé, ids conservés pour la partie principale) :
- `alglin` : sous-graphe `v-det` « Groupe symétrique et déterminant » (v-permutations, v-formes-alternees,
  v-determinant, v-det-matrice, v-comatrice) ; alglin 20 → 16 nœuds, 4 → 1 croisement.
- `log` : sous-graphe `l-syntaxe` « Syntaxe du premier ordre » (l-langage, l-quantificateurs, l-termes,
  l-formules, l-lecture ; la substitution reste dehors, elle dépend de la satisfaction) ; log 23 → 19 nœuds.
- `gs-abel-ruffini` en trois, dans galois : `gs-engendrer-sp` (lemme : transposition et p-cycle engendrent 𝔖ₚ,
  cite gf-cycliques ; remarque 𝔖₄ : ⟨(1 3), (1 2 3 4)⟩ d'ordre 8 ; placé dans gf, il imposait une longue arête et
  11 croisements), `gs-quintique` (X⁵ − 4X + 2, ses racines, corps de décomposition), et Abel-Ruffini ; galois 0 croisement.
- `gf-ordre-12` : `gf-alterne-4` (3-cycles, doubles transpositions, 𝔄₄, absence de sous-groupe d'ordre 6
  démontrée en (ii)) ; gf 6 croisements ; la réciproque fausse de Lagrange passe en remarque, sans arête nouvelle.
- `gd-varietes` : `gd-exemples-varietes` (ouverts, sous-variétés, sphère stéréographique, produit).
- `ac-gauss` : `ac-contenu` en amont (contenu, lemme de Gauss) ; la découpe d'abord proposée (irréductibles seuls)
  aurait créé un cycle.
Onglet du navigateur (même jour) : `aller` met « ATLAS – <étiquette du nœud> » ou « ATLAS – <titre du graphe> ».

## 34. Aération des fiches (29 octobre 2026)

Style validé par l'auteur sur la remarque de `li-series`, puis appliqué aux 45 graphes intérieurs. Quatre règles :
une idée par paragraphe (coupure aux articulations du raisonnement) ; en display seulement les formules qui portent
l'argument (égalité centrale, objet construit, chaîne de plus de deux membres), un ou deux par paragraphe au plus ;
la ponctuation reste dans le display et la phrase continue autour ; rien n'est retiré (mêmes affirmations, renvois,
termes, ordre), seules des liaisons minimales (« Soit », « on a ») sont permises. Retouches de formules permises :
`a/b` → `\frac`, coupure `aligned`, ponctuation, `\big` → `\Big` autour des grands opérateurs en display, et
intervalles `]{-1}, 1[` (sinon KaTeX lit le moins comme binaire). À suivre pour toute fiche nouvelle.
Contrôle : `verif_aer.py` (comparaison à HEAD : champs non textuels, renvois, termes, `\lex`, schémas identiques ;
écarts de formules et de mots listés), huit lots relus chacun par un agent indépendant, puis mesure de largeur dans
Chromium à 390 px sur les 478 fiches : 79 fiches débordaient avant, aucune après (reste un artefact de 2 px de
KaTeX dans `f-baire`, invisible). Les modèles de consigne sont à reprendre pour un futur lot.
Garde-fous (même jour) : `construire.py` refuse un intervalle « ]-… » dans une formule d'une fiche ou du lexique
(`verifie_typo`, réservé à l'édifice ; les rubriques ne sont pas contrôlées) ; `outils/edifice_largeurs.py [graphes…]`
mesure les débordements à 390 px dans Chromium sur le site construit (tolérance 2 px, code de sortie 1 s'il en reste) :
à lancer avant de publier un lot de fiches.
Rendu (`rendu.mjs`) : la ponctuation qui suit une formule en ligne est placée dans le dernier bloc insécable de la
formule (`.ponct`, police du texte) ; le navigateur ne coupe plus la ligne entre une formule et sa virgule.
Erreurs de fond corrigées au passage : changement de variable inversé dans `p-normale` (u = √2 x), π-système de
la remarque de `m-dynkin` (il faut le vide), N non introduit dans `f-operateurs` (iii), renvoi à un point (iii)
inexistant de `gd-denombrable` dans `gd-exemples-varietes` ; cas de `gf-ordre-12` en intitulés italiques
(« Premier cas », « Second cas ») au lieu de tirets que le moteur ne rend pas.
Signalés, non tranchés : `nb-zeros` attribue à Mertens une version de l'inégalité 3 + 4 cos θ + cos 2θ ⩾ 0 (formulation
conforme aux sources consultées, Elkies : « Mertens' elegant version of the original arguments ») ; `gd-equivalence`
appelait « norme sur ℚ² » une application sur un espace non réel (corrigé : la remarque élargit la définition aux scalaires
rationnels et démontre la non-équivalence par densité de ℚ) ; `hk-egalite` (iv) citait mal l'hypothèse (corrigé).
