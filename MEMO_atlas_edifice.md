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
Priorité 2 : `li-cartan` (à portée), `ga-nullstellensatz` (lemme de Zariski, arête alglin → geoalg),
`t-tychonov` (ultrafiltres, arête ordin → top), scindages de `gs-groupes`, `v-determinant`,
`ta-revetement` ; réduction et trace en algèbre linéaire (la trace est employée sans être définie) ;
découpage de `geod` en trois théories ; suites i.i.d. uniformes en proba. Priorité 3 : Mayer-Vietoris
(subdivision, gros), `derham` en degré 1, compléments des théories terminales, théories « groupes
finis » et « algèbre commutative », scindages de confort.

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
  Entrée, Échap ; clic ou Entrée → `ouvrirNoeud` (sur téléphone, défilement jusqu'au panneau).
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

