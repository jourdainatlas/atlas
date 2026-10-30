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
l'unité) ; démontrée le 29 oct. 2026, voir §35. Remarques de gd-de-rham mises à jour ; accueil : « Trente-trois branches », derham « démontré en
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
lie (deux faits admis en remarque), derham (surjectivité, partitions de l'unité). Tous traités depuis, voir §35.
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


## 35. Résultats admis démontrés (29 octobre 2026)

Inventaire complet des « admis » (énoncés, preuves, remarques) ; d'Alembert-Gauss était déjà démontré dans
`cx-liouville`. Sept résultats démontrés, chacun par un agent auteur puis un relecteur indépendant (une seconde
relecture pour la preuve réécrite de `ed-flot`), consigne `scratchpad/ch1/consigne_admis.md` (à reprendre) :
- **Tychonov** (espaces séparés, ⋆ lemme de l'ultrafiltre) : `o-ultrafiltre` (ordin, après `o-zorn` : filtres,
  ultrafiltres, image, lemme par Zorn, sans notion de fini), `tr-ultrafiltres` et `tr-tychonov` (ar-topo, en aval de
  top et ordin ; entrée `ordin: [ar-topo]` dans analyse-reelle). `t-tychonov` garde l'énoncé, preuve « Admis ici »
  avec renvoi. Lexique `filtre`, `ultrafiltre` (défini dans o-ultrafiltre), `filtre-convergent`.
- **Flot C¹ et Cᵏ, équation variationnelle** (edo, sans choix) : `ed-compacts`, `ed-domaine-flot`,
  `ed-variationnelle`, `ed-flot-ck` ; preuve de `ed-flot` (ii) réécrite (le critère d'explosion n'était énoncé que
  pour I × ℝⁿ ; Grönwall et accroissements finis sur boules ouvertes). Lexique `domaine-flot`, `equation-variationnelle`.
- **Lévy complet et TCL sous moment d'ordre 2** (fourier) : `fo-loi-esperances`, `fo-troncature`, `fo-helly`
  (sélection sans choix : extraction désignée par la preuve de `ar-bw`, qui prend désormais « le plus petit entier »
  au-delà des pics), `fo-levy-complet`, `fo-tcl` (η croissante en |t|, sans caractérisation séquentielle).
  Lexique `suite-tendue`.
- **Groupe des classes fini, h = 2 pour ℤ[√−5]** (tan, sans choix) : `an-norme-ideal`, `an-petit-element`
  (tiroirs, constante C_d), `an-classes`, `an-classes-z5`. Seule la borne de Minkowski reste en ouverture.
  Lexique `norme-ideal`, `groupe-classes`.
- **Groupe non abélien d'ordre pq unique** (gf) : `gf-multiplicatif` (sous-groupes finis de K^× cycliques,
  critère |G[ℓ]| ⩽ ℓ, qui justifie l'arête depuis gf-abeliens : 6 croisements au lieu de 7), `gf-pq-non-abelien` ;
  `gs-corps-finis` (ii) y renvoie. Lexique `racine-primitive`.
- **Haar, base hilbertienne de L²([0, 1])** (anf) : `m-regularite` (mes, ⋆ choix dénombrable), `f-haar` (conclusion
  sans théorème de projection ; les L² borélien et de Lebesgue identifiés). Au passage : `f-bases-hilbertiennes` (ii)
  démontré sans projection, champs `choix` ajoutés à `f-lp` et `f-riesz` ; du Bois-Reymond 1873/1876 harmonisé.
- **de Rham, surjectivité en degré 1** (derham, sans choix) : `dr-exp`, `dr-plateau`, `dr-recouvrement`,
  `dr-partition`, `dr-cocycle`, `dr-surjectivite` ; `dr-degre1` (i) dit « isomorphisme ».
  Lexique `fonction-plateau`, `localement-fini`, `partition-unite`.
Corrigé aussi : Halpern et Lévy datés de 1971 (anf). 539 nœuds, 302 termes ; croisements inchangés (édifice 16).
Restent admis, hors de portée : incomplétude de Gödel, Whitney, boule chevelue, invariance du domaine, Hurewicz,
unités de Dirichlet, Kolmogorov, Carleson, réciproque de `gs-radicaux`, Möbius non orientable, `gd-formes-varietes`
(réciproque, les outils existent désormais en aval). 𝔄₅ plus petit groupe non résoluble : démontré, voir §39. La partie non borélienne mesurable de `m-riemann` est affirmée sans mention « admis ».

## 36. Schémas, deuxième passe (29 octobre 2026)

Couverture mesurée par graphe (fiches avec schéma ou diagramme commutatif) ; la passe vise les graphes les
moins couverts. 27 schémas nouveaux, chacun relu par un agent indépendant (consignes `scratchpad/ch2/`) :
galois 4 (gs-decomposition, gs-galoisiennes, gs-corps-finis, gs-radicaux), mes 5 (m-mesurables, m-integrale,
m-beppo-levi, m-fatou, m-fubini), top et grtop 4 (t-produit, t-compact-prop, t-connexe-prop avec une remarque
nouvelle sur le sinus du topologue, gt-translations), anc 5 (cx-suites, cx-pi, cx-pi-2, cx-integrale-chemin,
cx-zeros-isoles), alg et lie 4 (a-quotient, a-isomorphisme dans une remarque nouvelle, li-exponentielle,
li-algebre), fondations 5 (n-recdef, n-fini, o-representation, o-zorn, l-tautologies ; aucun pour zf, où tout
dessin serait décoratif). Les relectures ont trouvé des légendes fausses (m = 3 au lieu de 6 dans gs-radicaux,
partition du cercle supposée dans cx-pi-2, injection « quelconque » dans n-fini, ω et « fini » employés sans
renvoi avant ℕ), toutes corrigées. Corrigé aussi : trou dans la preuve de cx-zeros-isoles (le point
d'accumulation est un zéro non isolé de la différence). 215 schémas ; les SVG dont les traits viennent d'un
ensemble Python changent d'ordre à chaque génération (gf-ordre-8) : trier avant de tracer.

## 37. Aération, second passage (29 octobre 2026)

Les paragraphes denses (plus de 700 caractères, ou plus de 450 avec au moins 8 formules en ligne) étaient 156 après
le chantier des admis ; quatre agents les ont repris (`scratchpad/aer/consigne_aeration_2.md`), chaque lot relu.
Il en reste 10, laissés à dessein : points d'énoncé d'un seul tenant (gd-normes (i), f-bases-hilbertiennes (ii),
gd-submersions (ii), gd-exemples-varietes (iii)…). Retouches de la relecture : pronoms sans antécédent remplacés
par leur sujet, une coupure trompeuse retirée (ga-nullstellensatz), le « et » d'origine rendu à ac-nakayama (iii),
Tₖ de p-tcl passé en display. Corrigé au passage : accord « Elle en contient un » (an-norme-ideal (iii)), entier q
introduit dans la remarque de li-cartan sur l'enroulement irrationnel (ε ∈ ]0, 1], k ≠ 0 justifié).

## 38. Croisements et renvois en avant (29 octobre 2026)

Mesure : avec le rangement au plus tôt, l'heuristique de Sugiyama de `disposer` atteint le minimum exact de
croisements de chaque graphe intérieur, et 16 contre 15 pour l'édifice. Ce minimum a été calculé par programmation
en nombres entiers (CP-SAT d'OR-Tools, ordre de chaque couche en variables booléennes, transitivité, une variable
par paire de segments ; script `scratchpad/ch5/exact.py`, hors construction). Plus de départs (jusqu'à 300) ou un
tamisage nœud par nœud n'y changent rien : les croisements restants tiennent au rangement et aux dépendances.
Changement retenu dans `disposer` : chaque graphe intérieur essaie trois rangements (au plus tôt, au plus tard,
et un rangement qui ramène chaque nœud à la médiane des rangs que lui imposent ses voisins) et garde celui qui croise
le moins, l'original à égalité ; continuite passe de 3 à 2, alg de 2 à 1 (total 43 → 41). L'édifice garde le
rangement au plus tôt, puisque son texte d'accueil définit le rang comme la longueur du plus long chemin depuis la
logique. Pour gagner davantage, il faudrait changer les dépendances elles-mêmes.
Renvois en avant des remarques (15) : tous sont des ouvertures annoncées (« sera établie », « défini au nœud »…) ;
les quatre mentions du lemme de l'ultrafiltre en logique renvoient désormais à `o-ultrafiltre`.

## 39. Groupes d'ordre < 60 résolubles (29 octobre 2026)

L'« admis » de `gf-petits-ordres` (𝔄₅ plus petit groupe non résoluble) est démontré, sans choix :
`gs-resolubles` (iii) (extension de résolubles), `gf-non-simples` (« Critères de non-simplicité » : centre d'un
p-groupe, Sylow unique quand 1 est le seul diviseur de m congru à 1 mod p, action par translation sur G/H avec
|𝔖(X)| = k! démontré, comptage des éléments d'ordre p), `gf-moins-de-60` (récurrence sur l'ordre, p-groupes
résolubles, tableau des 58 ordres de 2 à 59 : 25 puissances de premiers, 27 à Sylow unique, 12, 24, 36, 48 par
translation, 30 et 56 par comptage ; |𝔄₅| = 60 et 𝔄₅ non résoluble ; schéma du groupe (ℤ/2ℤ)³ ⋊ ℤ/7ℤ d'ordre 56
à huit 7-Sylow). `gs-sn` énoncé pour tout sous-groupe de 𝔖ₙ contenant les 3-cycles. Arête
`gf-petits-ordres → gf-moins-de-60` : par elle la preuve atteint `gs-resolubles` et `gs-sn` (gf reste à
6 croisements). Lettre de Galois à Chevalier (29 mai 1832, Œuvres 1897) citée sans numéro de page : p. 26 ou 27
selon les copies, image non consultable d'ici. Relu par un agent indépendant (script de couverture propre ; sept
retouches). Restent admis : 𝔄₅ simple, unicité du groupe simple d'ordre 60, ordre 168 du suivant.

## 40. Théorème spectral (29 octobre 2026)

Absent jusqu'ici sous tout nom. Ajouté à anf (proposition de l'auteur acceptée) : `f-autoadjoints` (adjonction,
quotient de Rayleigh, |||u||| = sup |⟨u x, x⟩|), `f-spectral-fini` (maximum de Rayleigh sur la sphère compacte, sans ℂ
ni polynôme caractéristique ; A = P D ᵗP), `f-compacts`, `f-compacts-exemples` (diagonal sur ℓ² compact ⇔ aₙ → 0 ;
noyau continu ; multiplication par x sans valeur propre), `f-spectral-compact` (±|||u||| valeur propre par
intersection de fermés emboîtés, sans suite maximisante ; valeurs propres de multiplicité finie tendant vers 0 ;
u = Σ λₙ pₙ ; base hilbertienne de (Ker u)^⊥, ⋆ choix dénombrable sauf suite dense donnée). Dans met :
`me-precompacts` (⋆ si les réseaux sont choisis) ; `gd-equivalence` (iv) étendu aux espaces de dimension finie.
Renvoi depuis `v-valeurs-propres`. Sources vérifiées : Cauchy 1829 (via Hawkins 1975), Hilbert 1906 (p. 157-228),
Hellinger-Toeplitz 1910, Mercer 1909, Enflo 1973. Relu par un agent indépendant (deux fautes de signalement et de
renvoi, neuf retouches). Admis en remarque : approximation des compacts par le rang fini (Hilbert), formule de
Mercer, valeurs propres du noyau min(x, y). 547 nœuds, 308 termes ; anf 1 croisement.

## 41. Réduction des endomorphismes (29 octobre 2026)

Inventaire des grands résultats absents (même calibre que le théorème spectral), proposé à l'auteur : réduction des
endomorphismes, résidus (Laurent, Rouché), changement de variables dans ℝⁿ et Stokes, formes quadratiques (Gauss,
Sylvester), modules de type fini sur un anneau principal, Radon-Nikodym, Riesz-Markov, Hölder et Minkowski pour Lᵖ,
Ascoli, Stone-Weierstrass général, extrema liés, représentations des groupes finis, réciprocité quadratique, Wilson,
Jordan-Hölder, van Kampen, Jordan (courbe), Liapounov. Premier traité, à la demande de l'auteur : la réduction.
Placement : sous-graphe `ac-reduction` (contenu/ac-reduction.yaml), ouvert par le nœud chapitre `ac-reduction`
de ac (qui a déjà alg, z, alglin pour parents : aucune arête nouvelle dans l'édifice ; une arête ac-chinois →
ac-reduction). Douze fiches rd-* : polynômes d'endomorphismes et polynôme minimal, lemme des noyaux (par ac-chinois),
χ_A = det(XI − A) calculé dans K(X) (pas de déterminant sur un anneau ; remarque : la définition par évaluation
échoue sur ℤ/2ℤ), sous-espaces stables, Cayley-Hamilton (comatrice sur K(X), télescopage), diagonalisation,
trigonalisation, nilpotents, sous-espaces caractéristiques, Dunford, Jordan nilpotent, forme de Jordan et critère
de similitude par les rangs. Aucun choix. Admise en remarque : la forme de Jordan réelle. Relu par un agent
indépendant (cinq trous et dix retouches traités). 560 nœuds, 316 termes, 47 graphes ; ac-reduction 1 croisement.

## 42. Théorème des résidus (29 octobre 2026)

Sous-graphe `anc-residus` (contenu/anc-residus.yaml), ouvert par le nœud chapitre `anc-residus` de anc (arête
cx-zeros-isoles → anc-residus ; entrées : formule de Cauchy, zéros isolés). Douze fiches rs-* : indice d'un lacet
(entier par exp(−H)(γ − w), constant sur les connexes du complémentaire, nul hors d'un ouvert convexe), Cauchy sur
une couronne (découpage en N secteurs, chacun dans un convexe V_k = disque ∩ demi-plan, télescopage des rayons, sans
homotopie : l'arbre n'avait Cauchy que pour les convexes), Laurent, singularités (prolongement de Riemann), pôles,
Casorati-Weierstrass, calcul des résidus, théorème des résidus (convexe privé de p points), principe de l'argument,
Rouché (sans paramètre : g/f dans D(1, 1)), intégrales trigonométriques, demi-cercle (∫ dx/(1+x²)² = π/2,
∫ cos x/(1+x²) = π/e). Aucun choix. `cx-formule-cauchy` a un point (i) nouveau (D(c, r + s) ⊂ U, sans fonction de
choix), renvois mis à jour en (ii) ; « point d'accumulation » défini dans `cx-zeros-isoles`. Admis en remarque :
version homologique (Dixon 1971), Jordan pour l'indice d'un lacet simple, grand théorème de Picard. Relu par un
agent indépendant (quatre fautes de définition et de rédaction, dix retouches). 573 nœuds, 323 termes, 48 graphes.
Restent dans la liste du §41 : changement de variables et Stokes, formes quadratiques, modules sur un anneau
principal, Radon-Nikodym, Riesz-Markov, Lᵖ, Ascoli, Stone-Weierstrass, extrema liés, représentations, réciprocité
quadratique, Wilson, Jordan-Hölder, van Kampen, Jordan, Liapounov.

## 43. Changement de variables dans ℝⁿ (30 octobre 2026)

Sous-graphe `edo-changement` (contenu/edo-changement.yaml), ouvert par le nœud chapitre `edo-changement` de edo
(arête ed-variationnelle → edo-changement). Placement : edo et lie sont les seules théories en aval de mes, cdiff,
alglin et anc ; edo vient d'abord, et la formule y donne Liouville. Les arêtes cdiff → proba ou mes → cdiff
faisaient passer l'édifice de 16 à 19 croisements, écartées. Renvois visibles : remarques ajoutées aux théories mes
et cdiff dans edifice.yaml (un lien {{…}} vers l'aval n'est permis qu'en remarque), et remarques de m-produit,
v-det-matrice, gd-orientation, p-normale. Dix fiches cv-* : λₙ = λₙ₋₁ ⊗ λ₁ et boréliens (unicité par les pavés),
cubes dyadiques (décomposition des ouverts sans choix), matrices élémentaires (pivot de Gauss), image linéaire
(λ(b + A(E)) = |det A| λ(E), par unicité de la mesure invariante et Cavalieri), image d'un petit cube (accroissements
finis, point fixe de Banach), mesure de l'image d'un cube (Heine), changement de variables (Dynkin, pas de
régularité), polaires (aire du disque, π du cosinus), intégrale de Gauss, Liouville (det Z = e^{∫ div}). Aucun
choix nouveau ; ⋆ sur la remarque de non-complétude (Vitali). J désigne ici le déterminant jacobien (mise en garde :
matrice jacobienne dans gd-differentielle). Relu par un agent indépendant (deux trous, onze retouches). Source :
Liouville, J. Math. Pures Appl. 3 (1838), p. 342-349. Stokes : voir §44. 584 nœuds, 328 termes, 49 graphes.

## 44. Formule de Stokes (30 octobre 2026)

Sept fiches ajoutées au sous-graphe `derham` (contenu/derham.yaml) : intégrales itérées de Riemann sur un pavé
(dr-iterees), Fubini pour les fonctions continues (dr-fubini), cubes singuliers, faces ι_{i,t} et bord (dr-cubes),
intégrale sur une chaîne cubique (dr-integrale-cubes), formule de Stokes ∫_c dω = ∫_{∂c} ω (dr-stokes), formes
exactes et cycles (dr-fermees), Green-Riemann et divergence (dr-green). Choix de méthode : mes n'est pas ancêtre de
derham, et l'intégrale se fait donc par intégrales itérées de Riemann, Fubini continu démontré sur place ; la
formule sur le cube unité se ramène à Fubini et au théorème fondamental, puis passe aux cubes par image réciproque.
Arête d'entrée geod → dr-integrale-cubes. Non démontré, et dit dans une remarque de dr-stokes : la version sur une
variété compacte orientée à bord (il manque les variétés à bord, le changement de variables n'est pas ancêtre, et
la partition de l'unité subordonnée à un atlas n'est pas faite). Lexique : cube-singulier, formule-stokes. Quatre
schémas (outils/edifice_schemas_derham.py) : dr-cubes, dr-cubes-2, dr-stokes, dr-green. Remarques ajoutées à
gd-orientation, gd-integrale-curviligne et à la théorie geod ; textes de derham et geod dans edifice.yaml mis à
jour. Relu par un agent indépendant (18 points) : attributions corrigées (Green 1828, Ostrogradski, Cauchy et
Riemann pour Green-Riemann), remarque de gd-orientation et texte de geod rectifiés, notations unifiées, convention
pour le pavé de ℝ⁰. Aucun choix nouveau. derham : 0 croisement ; édifice : 16. 591 nœuds, 330 termes, 49 graphes.

## 45. Formes quadratiques (30 octobre 2026)

Sous-graphe `cdiff-quadratiques` (contenu/cdiff-quadratiques.yaml), ouvert par le nœud chapitre `cdiff-quadratiques`
de cdiff (arête gd-schwarz → cdiff-quadratiques ; entrée gd-schwarz → fq-taylor-young). Placement : alglin n'a ni q
ni r pour ancêtres, anf n'a pas le calcul différentiel ; cdiff a ℝ, l'algèbre linéaire, et donne l'application aux
extremums. Treize fiches fq-* : sur un corps où 2 est inversible, formes et congruence, rang et noyau,
orthogonalité, bases orthogonales, algorithme de Gauss (cas sans terme carré compris), classification quand tout
élément est un carré ; sur ℝ, loi d'inertie, forme normale et (n+1)(n+2)/2 classes, formes positives (minoration
sans compacité), critère des mineurs (dominants pour défini positif, tous les principaux pour positif) ; puis
Taylor-Young à l'ordre 2 dans ℝⁿ (absente jusque-là), points critiques, conditions suffisantes, cols, surface de
Peano. Le théorème spectral (f-spectral-fini) n'est pas redémontré : ses remarques renvoient au chapitre. Hors du
lot, en remarque : Witt, Morse, corps finis, extrema liés. Aucun choix. cdiff passe à 1 croisement (entrée met →
gd-inversion-locale gardée visible : c'est la dépendance au point fixe). Relu par un agent indépendant : une faute
historique (Sylvester nomme la loi d'inertie dès 1852 et la démontre en 1853) et treize retouches. Douteux : la
source de Peano (Genocchi-Peano 1899, p. 332) ne repose que sur Wikipedia. 605 nœuds, 345 termes, 50 graphes.

## 46. Modules de type fini sur un anneau principal (30 octobre 2026)

Sous-graphe `ac-modules` (contenu/ac-modules.yaml), ouvert par le nœud chapitre `ac-modules` de ac (arêtes
ac-principaux → ac-modules, ac-reduction → ac-modules ; entrées ac-principaux, ac-chinois, ac-reduction). Treize
fiches md-* : modules libres et rang (corps des fractions), sous-modules de Aⁿ (récurrence finie), matrices
équivalentes et matrices de Bézout, lemme du pivot, forme de Smith, base adaptée, théorème de structure, unicité
(idéaux de mineurs calculés dans Frac(A), indépendance de la présentation par la matrice Θ), diviseurs élémentaires,
groupes abéliens de type fini, K[X]-module d'un endomorphisme, forme de Frobenius, critère de similitude et descente
de L à K. Choix : la forme de Smith existe dans ZF pour tout anneau principal (md-pivot : la suite canonique
I_{i+1} = {x : x(I_i + cA) ⊂ I_i}, stationnaire par ac-noetheriens (i), donne la condition de Kaplansky ;
Kaplansky 1949, Cano et al. LMCS 2016) ; l'algorithme usuel, lui, cache une suite de choix de Bézout. Seule
l'existence des diviseurs élémentaires est ⋆ (factorisation ; Hodges 1976 : ZF ne prouve pas que tout principal est
factoriel). Relu deux fois : la première relecture a fourni l'argument sans choix (l'auteur et moi avions gardé ⋆,
ma propre récurrence colonne/ligne était fausse : les opérations d'une colonne dérangent les précédentes) et deux
autres fautes ; la seconde, ciblée sur md-pivot, un exemple mal attribué et une référence. 619 nœuds, 357 termes,
51 graphes ; ac et ac-modules 0 croisement.

## 47. Lᵖ, Radon-Nikodym, dual de Lᵖ, Riesz-Markov (30 octobre 2026)

Deux chapitres de anf (18 fiches, scindés à partir de quinze) : `anf-lp` (contenu/anf-lp.yaml, arête f-riesz →
anf-lp, entrées f-lp et f-riesz) et `anf-riesz-markov` (contenu/anf-riesz-markov.yaml, arête f-evn →
anf-riesz-markov ; C(K) et sa norme sont posés sur place pour ne pas dépendre de f-exemples, qui ajoutait un
croisement). anf-lp : puissances réelles (ln x = ∫₁ˣ dt/t ; l'exponentielle de anc n'est pas ancêtre de anf, et
aucun ancêtre ne les définit : pas de doublon, vérifié par le relecteur), Young, Lᵖ et ‖·‖_∞, Hölder (cas
d'égalité), Minkowski, complétude (⋆ comme f-lp), inclusions, densité (étagées, continues nulles hors d'un segment
par λ* seule), absolue continuité, lemme de von Neumann (Riesz dans L²(μ+ν)), Radon-Nikodym-Lebesgue σ-fini et
règle de la chaîne, formes positives, dual (Lᵖ)' ≅ L^q pour 1 ⩽ p < ∞ et μ σ-finie. anf-riesz-markov : sur un
compact métrique, Urysohn par la distance, formes positives, mesure extérieure des ouverts, Carathéodory et
régularité, représentation par tranches, unicité par Dynkin ; exemples Dirac et Riemann → λ. Choix : ⋆ dénombrable
pour Riesz-Markov, inévitable (dans le modèle de Feferman-Lévy, la forme de Riemann n'a pas de mesure de Riesz) ;
Radon-Nikodym et le dual héritent du choix de f-riesz ; σ-finitude fixée une fois, sans choix. Admis en remarque :
version localement compacte, dual sans σ-finitude, mesure de Dieudonné (⋆, régularité de ω₁). Renvois ajoutés dans
f-lp, f-riesz, f-exemples, p-poisson-exp, mt-conditionnelle, fo-densite ; n₋₁ = −1 posé aussi dans f-lp et f-evn.
Relu par un agent indépendant : six fautes (rôle du ε dans mk-construction, régularité héritant du choix, réunion
d'intervalles non disjointe, σ-finitude omise dans deux textes, intervalle négligeable, Dieudonné sans « Admis
ici ») et une quinzaine de retouches. Non vérifiés : le passage de von Neumann (Ann. of Math. 41, 1940,
p. 94-161), la date de Minkowski (non donnée). 639 nœuds, 371 termes, 53 graphes ; anf 1 croisement.

## 48. Ascoli, Stone-Weierstrass, Peano, extremums liés ; mémoire du rendu (30 octobre 2026)

Chapitre `anf-continues` « Espaces de fonctions continues » (contenu/anf-continues.yaml, arête f-evn →
anf-continues ; C(K, ℝᵖ) posé sur place, comme anf-riesz-markov, pour ne pas dépendre de f-exemples) : onze fiches
fc-* — convergence uniforme et complétude, Dini (et la suite p_{n+1} = p_n + (t − p_n²)/2 → √t), équicontinuité,
précompacité par une grille, Ascoli (trois formes), polynômes de Bernstein et Weierstrass, lemme des treillis,
Stone-Weierstrass (et variante nulle en un point), polynômes de plusieurs variables, cercle, lipschitziennes,
séparabilité de C(K). Choix : Ascoli ensembliste et la réciproque de (iii) ⋆ (me-precompacts (iii)) ; forme
séquentielle sans choix (réseaux pris parmi les termes de la suite au plus petit indice, pas d'extraction
diagonale) ; Dini, Bernstein, Stone-Weierstrass sans choix ; séparabilité ⋆ pour un compact métrique quelconque,
non démontrable dans ZF (remarque, modèle admis ici). Fiche ed-peano dans edo (arête ed-cauchy-lipschitz →
ed-peano), sans choix ; la remarque « Peano admis ici » de ed-cauchy-lipschitz y renvoie. Relu : trois fautes (⋆ de
la réciproque d'Ascoli, « métrique » oublié dans f-exemples, numéro de point) et onze retouches.

Chapitre `cdiff-lagrange` « Extremums liés » (contenu/cdiff-lagrange.yaml, arêtes gd-submersions → cdiff-lagrange
et cdiff-quadratiques → cdiff-lagrange) : el-niveau (T_aΓ = Ker dg(a) par les vitesses des courbes), el-lagrange
(multiplicateurs, contre-exemple x³ = y²), el-second-ordre (lemme sur la hessienne de f∘ψ, conditions nécessaire
et suffisante ; hessienne bordée démontrée pour n = 2, p = 1, admise en général : Mann 1943, Debreu 1952),
el-exemples (moyennes arithmético-géométriques, ᵗxAx sur la sphère, distance). Aucun choix. Relu : aucune faute
mathématique, une notion non définie (« centre de courbure », retirée) et douze retouches.

Mémoire : rendu.mjs dépassait le tas par défaut de Node (≈ 2 Go ; atlas.html fait 182 Mo). Les grandes chaînes de la
page d'aperçu sont désormais dans un bloc libéré avant la suite, les tranches `tete`/`corps` inutilisées sont
supprimées et la copie profonde passe par structuredClone (sans chaîne intermédiaire) : le rendu tient dans
1,8 Go. construire.sh passe --max-old-space-size=4096 pour la marge. 657 nœuds, 382 termes, 55 graphes.

## 49. Page d'aperçu à la demande (30 octobre 2026)

`construction/atlas.html` (182 Mo, inutilisé par le site publié) n'est plus écrit par défaut : `ATLAS_APERCU=1 sh
construire.sh` le produit. Le rendu tient alors dans 0,9 Go de tas au lieu de 1,8 Go (limite fixée à 4 Go). Si la
mémoire redevenait un souci, le levier suivant est de rendre et d'écrire branche par branche dans rendu.mjs.

## 50. Réciprocité quadratique ; représentations des groupes finis (30 octobre 2026)

Chapitre `tan-reciprocite` (contenu/tan-reciprocite.yaml, arête an-gauss → tan-reciprocite) : huit fiches rq-* —
Euler et Fermat (absents jusque-là), Wilson et réciproque, Legendre et critère d'Euler (par pol-racines), lemme de
Gauss et (2/p), lemme d'Eisenstein (parties entières par division euclidienne), réciprocité par le comptage, dû à
Eisenstein, des points d'un réseau, seconde preuve par les sommes de Gauss dans F_{p^n}, applications. Aucun choix.
Relu : une faute d'ordre (ζ = e^{2iπ/q}, anc non ancêtre, désormais annoncé) et huit retouches (Euler 1736 rédigé,
publié en 1741).

Chapitre `galois-representations` (contenu/galois-representations.yaml) : douze fiches rp-* — représentations,
Maschke, Schur (d'Alembert-Gauss admis dans c-dalembert : le dire), caractères (χ(g⁻¹) = conj χ(g) par une forme
hermitienne moyennée, sans valeur propre), invariants, orthogonalité, régulière, base des fonctions centrales,
caractères linéaires, tables de 𝔖₃, 𝔖₄, 𝒟₄/𝒬₈ (indicateur de Frobenius-Schur admis). Admis : d | |G| (intégralité),
Burnside. Placement : galois est la seule théorie fille à la fois de gf et de c ; une théorie nouvelle portait
l'édifice à 19 croisements. Le chapitre n'a pas de parent dans galois, seulement les entrées gf et c : construire.py
fait désormais suivre au contenu d'un chapitre aussi les entrées qui visent son nœud (ajout d'arêtes d'ordre
seulement ; vérifié par le relecteur). galois passe à 2 croisements. Relu : une attribution non vérifiée (lettres
de Frobenius, réduite) et une dépendance à un admis non signalée (d'Alembert-Gauss), douze retouches.
679 nœuds, 394 termes, 57 graphes.

## 51. Jordan-Hölder (30 octobre 2026)

Chapitre `gf-jordan-holder` (contenu/gf-jordan-holder.yaml, arête gf-moins-de-60 → gf-jordan-holder) : sept fiches
jh-* — deuxième et troisième théorèmes d'isomorphisme et correspondance (alg n'avait que le premier), papillon de
Zassenhaus, Schreier (groupes quelconques, longueurs ⩾ 1), suites de composition (existence pour un groupe fini,
sous-groupe distingué propre d'ordre maximal, sans choix), Jordan-Hölder par Schreier, simplicité de 𝔄₅ (Cauchy,
Sylow, dénombrement : le « restent admis : 𝔄₅ simple » du §39 est levé), exemples (ℤ/12ℤ, 𝔖₄, 𝔖₅, mêmes facteurs
sans isomorphisme), résolubilité par les facteurs. Admis en remarque : 𝔄ₙ simple pour n ⩾ 6, unicité du groupe
simple d'ordre 60. Aucun choix. gf reste à 6 croisements. Relu : aucune faute, douze retouches (deux renvois vers
le mauvais nœud, la lettre e à la fois point et neutre).

## 52. Stabilité de Liapounov (30 octobre 2026)

Chapitre `edo-liapounov` « Stabilité des équilibres » (contenu/edo-liapounov.yaml, arête ed-variationnelle →
edo-liapounov) : neuf fiches ly-* — définitions (exemple attractif non stable r′ = r(1 − r), θ′ = 1 − cos θ),
trigonalisation dans M_n(ℂ) avec χ_B défini par Leibniz dans ℂ[X] (ac-reduction n'est pas ancêtre de edo ;
d'Alembert-Gauss par cx-liouville, ancêtre) et mise à l'échelle, systèmes linéaires (|||e^{tA}||| ⩽ Ce^{γt} pour
γ > μ(A)), théorèmes de Liapounov, équation ᵗAP + PA = −I, LaSalle sans suite extraite (et Barbachine-Krasovski),
linéarisation, instabilité si μ(A) > 0 dans le cas non linéaire, pendule amorti. Aucun choix. Remarques non
démontrées : vitesse optimale κ < −μ(A), cycle limite de van der Pol, variété stable. Relu : aucune faute bloquante,
deux affirmations inexactes en remarque et treize retouches. edo et edo-liapounov à 0 croisement.

## 53. Théorème de Jordan et Jordan-Brouwer (30 octobre 2026)

Chapitre `hom-jordan` (contenu/hom-jordan.yaml, arête h-applications → hom-jordan) : onze fiches hj-* — homologie
réduite (complexe augmenté, degré −1 pour le vide), Mayer-Vietoris réduite, compacité des classes dans une réunion
croissante d'ouverts, calottes et projection stéréographique, composantes d'un ouvert de Sⁿ, cellules (Hatcher
2B.1 a, segments emboîtés par une règle explicite), sphères plongées (cas k = n : injective Sⁿ → Sⁿ surjective),
Jordan-Brouwer dans Sⁿ (deux composantes, Fr U = Fr V = Σ, séparateur minimal) et dans ℝⁿ, Jordan dans le plan
(lacet simple par le bord du carré, sans trigonométrie), invariance du domaine (l'« admise ici » de h-applications
est levé : le mémo §35 qui la range parmi les admis est périmé). Aucun choix. Admis en remarque : critère de parité
des polygones, Schoenflies, sphère cornue, dualité d'Alexander. Brouwer daté 1912 (Math. Ann. 71). Relu : six
fautes (lexique faux pour le vide, « caractérise la sphère » faux — tore de S³ —, parité incomplète et présentée
comme démontrée dans la légende, sin et mesure de Lebesgue non annoncés) et une quinzaine de retouches.

## 54. Seifert-van Kampen (30 octobre 2026)

Chapitre `topalg-van-kampen` (contenu/topalg-van-kampen.yaml, sous ta-consequences ; entrées ta-consequences →
vk-decoupage, ta-cercle → vk-bouquet) : quatorze fiches vk-* — partie algébrique (alg n'a pas les entiers, gf n'est
pas ancêtre de topalg) : mots réduits par l'action de van der Waerden, groupe libre (ℤ libre sur {1} définit les
puissances gⁿ), sous-groupe distingué engendré et présentations, produit libre (inclusions injectives par la
propriété universelle, forme normale admise), produit amalgamé ; partie topologique : découpage par Lebesgue
(pour des chemins), surjectivité, π₁(Sⁿ) = 1 pour n ⩾ 2 (projection stéréographique démontrée ici ; h-spheres et
hj-calottes y renvoient), noyau par grille et escaliers, théorème, rétractes par déformation, bouquet ≅ F₂ (ℝ/ℤ
séparé, losange, sans trigonométrie), tore ≅ ℤ². Aucun choix ; Nielsen-Schreier ⋆ en remarque (choix pour les
familles d'ensembles finis : Läuchli 1962, Howard 1985). Seifert : Ber. Sächs. Akad. 83 (1931), et non Math. Ann.
104 (Threlfall-Seifert). Relu : une référence fausse (Schreier 1927, « freien Gruppen », p. 161-183), deux trous
mineurs (image d'un sous-groupe engendré, découpage énoncé pour des lacets), W connexe par arcs non établi, une
dizaine de retouches. 725 nœuds, 420 termes, 61 graphes ; topalg et le chapitre à 0 croisement.

Avec ce lot, la liste du §41 est épuisée.

## 55. Outil de diagnostic de l'ordre logique (30 octobre 2026)

`outils/edifice_diagnostic.py [--detail] [graphe …]` écrit `construction/diagnostic.md` et un bilan. Il ne bloque
rien et complète construire.py (qui garantit déjà liens et termes balisés vers l'amont) par six familles de
candidats : A, notations sans balise employées hors de l'aval de leur fiche de définition (exp, ln, sin, π nombre,
ℂ, ℝ, ℚ, det, √, mesure de Lebesgue, intégrale, dérivée, lim, valeur propre ; dictionnaire NOTATIONS à enrichir) ;
B, numéros de point cités absents de la fiche visée ; C, « même nœud, (x) » dont le nœud désigné (le dernier cité)
n'a pas ce point ; D, fiche sans champ choix qui cite hors remarque une fiche ⋆ (D2 : points cités disjoints de
ceux qui utilisent le choix, ou convention de la mesure de Lebesgue) ; E, citation hors remarque d'une fiche admise
sans le dire ; F, terme du lexique (plusieurs mots) écrit en clair avant sa fiche de définition. Premier passage
(725 nœuds) : A 5, B 0 (sur 1514 citations de points), C 2, D 30, D2 10, E 0, F 27 — candidats, non erreurs
certaines. À lancer avant chaque relecture de lot.

## 56. Premier passage du diagnostic : corrections (30 octobre 2026)

Cinq agents (algèbre ; analyse fonctionnelle et mesure ; Fourier et probabilités ; topologie, géométrie, analyse
réelle ; logique et fondements) ont tranché les quelque 70 candidats du §55 : 33 vraies erreurs corrigées, le reste
faux positifs ; puis deux relectures indépendantes (d'ensemble, puis ciblée). Principales corrections :
- notations ou notions avant leur définition : gs-radicaux (e^{iπ/3} retiré), nb-chebyshev (ln : arête
  nb-logarithme → nb-chebyshev), gs-separabilite (corps de décomposition : arête gs-decomposition →
  gs-separabilite, retrait de gs-algebriques → gs-separabilite et gs-decomposition → gs-galoisiennes), hk-temoins
  (codage 2^{code(w)}(2k+1) au lieu des nombres premiers), l-lowenheim, a-groupe, v-applications, de-operations,
  f-hilbert, f-hahn-banach, f-autoadjoints, fq-sylvester, gd-de-rham (ouverts de ℝ^m ; variétés en remarque),
  gt-translations (schéma en remarque), rm-positives ; « même nœud » faux dans jh-composition et h-petites-chaines ;
- choix : c-heine et c-bornes ont désormais des démonstrations sans choix, par la borne supérieure (les preuves
  séquentielles restent en remarque, avec leur choix dénombrable) — ce qui rend sans choix toute l'intégration des
  fonctions continues (ri-continues est découpée en (i) uniformément continue, (ii) continue, toutes deux sans
  choix) ; la chaîne de Fourier jusqu'au TCL est réécrite sans convergence dominée à paramètre continu
  (fo-transformee par majoration directe et Taylor-Lagrange, fo-inversion par découpage, ε = 1/k) ;
  m-convergence-dominee est numérotée (i) suites, sans choix, (ii) continuité et (iii) dérivation à paramètre, ⋆ ;
  champs choix ajoutés à f-evn, f-banach-steinhaus, m-convergence-dominee, ga-correspondance, mt-martingales,
  fo-divergence ;
- trous comblés au passage : fo-inversion (ii) (égalité aux points de continuité), fo-plancherel (L² complexe
  ramené aux parties réelle et imaginaire), ri-sommes (ii) (hypothèse « intégrable »).
Diagnostic après passage : A, B, C, E à 0 ; D 21, D2 22, F 18, tous jugés faux positifs (points sans choix cités,
définitions sur place, homonymes du lexique). Croisements : galois 2 → 1, nban 1 → 2, édifice 16. Restent signalés,
non traités : « espace tangent » défini trois fois (el-niveau, gd-tangent-sm, gd-espace-tangent) ; « convergence
uniforme » rattachée au lexique à cx-convergence-uniforme alors que fc-uniforme la définit plus tôt ; « forme
positive » homonyme (quadratique / linéaire) ; entrée de lexique `choix-dependant` absente ; améliorations de
l'outil proposées par les agents (négations dans les champs choix, héritage transitif, homonymes, définitions en
gras ou « c'est-à-dire »).

## 57. Politique : le moins de choix possible (30 octobre 2026)

Décision de l'auteur : utiliser le moins possible l'axiome du choix, surtout quand une démonstration sans choix
n'est pas trop complexe. En pratique : un ⋆ évitable est retiré en réécrivant la preuve (au plus une fois et demie
plus longue, sans outil lourd nouveau), l'ancienne preuve pouvant rester en remarque avec son choix ; si la version
sans choix demande une hypothèse (séparabilité avec suite dense donnée, signature dénombrable, anneau de
polynômes…), on énonce le cas sans choix et le cas général ⋆, et l'aval cite le premier quand il suffit. Un ⋆
inévitable (énoncé non démontrable dans ZF) est gardé, avec la bonne forme de choix et, si possible, une source.
Premier exemple : Heine et bornes atteintes par la borne supérieure, chaîne de Fourier (§56).
