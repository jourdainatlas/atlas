# Mémo ATLAS — complément : rubrique L'édifice

> Complète `MEMO_atlas.md` (sections 0 à 16) et se lit avec lui. Les sections 17 et 18 sont dans
> `MEMO_atlas_annales.md`, les sections 19 à 22 dans `MEMO_atlas_cours.md` ; ce mémo commence à 23.
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

- Construction : `OK : 380 nœuds, 257 termes, 32 graphes`, zéro erreur (commit de départ `2d7ca3b`).
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
- Après chaque lot : construire jusqu'à zéro erreur, regarder le rendu du graphe modifié et de ses
  fiches (clair et sombre, bureau et téléphone), relever le nombre de croisements du graphe touché,
  puis rebaser, pousser et suivre la publication (section 0).
