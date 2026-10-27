# Consignes des agents pour la conversion des formules (MEMO_atlas_annales.md, section 27)

Remplacer AAAA par la session. Fichiers de travail : lotN.json (extraire), remplacementsN.json, apercuN.txt (appliquer --montrer).

## Consigne : passer en LaTeX les formules des fiches d'annales

Tu travailles sur l'index des annales du site ATLAS (sujets de concours de mathématiques : X-ENS,
Mines-Ponts, Centrale, CCINP, e3a, CAPES, agrégation). Chaque sujet a un aperçu (`apercu`), et des
parties avec un nom (`blocs.i.nom`) et des mots-clés (`blocs.i.mots.j`). Ces textes écrivent les
formules en notation linéaire (« R1[X] », « Σ λi pi », « sin(t)^x », « Dn ∼ (−1)^n n! »). Le site sait
maintenant composer du LaTeX entre `$…$` avec KaTeX. Ta tâche : produire la liste des remplacements qui
transforment chaque formule en LaTeX. Tu ne réécris jamais le texte lui-même.

## Entrée et sortie

- Entrée : le fichier JSON du lot (clé = URL du sujet ; `champs` = chemin → texte actuel).
- Sortie : un fichier JSON au chemin qu'on t'indique, de la forme
  ```json
  {"<url du sujet>": [
     {"champ": "apercu", "avant": "R1[X]", "apres": "$\\mathbb{R}_1[X]$"},
     {"champ": "blocs.2.mots.4", "avant": "Dn ∼ (−1)^n n!", "apres": "$D_n \\sim (-1)^n n!$"}
   ], ...}
  ```
  plus, à la clé spéciale `"_signalements"`, une liste de chaînes pour tout cas douteux (notation
  ambiguë que tu n'as pas pu trancher, et que tu as laissée en texte ; erreur mathématique apparente
  dans le texte d'origine — ne la corrige pas, signale-la).
- Écris le JSON avec un outil d'écriture de fichier, puis vérifie-le avec
  `cd /home/claude/atlas && python3 outils/annales_formules.py appliquer AAAA <ton fichier> --essai`
  (la clé `_signalements` est ignorée par le script). Corrige jusqu'à ce que l'essai passe sans autre erreur.
  NE LANCE JAMAIS `appliquer` sans `--essai` : seul le coordinateur écrit dans le dépôt.

## Règles des remplacements

1. `avant` est copié **exactement** depuis le texte actuel (mêmes caractères : « − » U+2212 n'est pas
   « - », « ∼ » n'est pas « ~ », espaces compris). Il doit apparaître une seule fois dans le champ, hors
   des formules déjà posées ; sinon allonge-le avec un peu de contexte (le texte de contexte doit alors
   figurer tel quel dans `apres`, hors des `$`), ou mets `"tous": true` si toutes les occurrences
   doivent recevoir la même formule.
2. `apres` = la formule en LaTeX entre `$…$`, avec éventuellement autour le texte de contexte recopié
   de `avant`. Aucun autre mot ne doit changer. On peut englober dans la formule de petits mots qui en
   font partie (« pour tout n », « où ») uniquement s'ils disparaissent au profit de symboles dans le
   LaTeX ; préfère laisser le français en texte.
3. Ce qui doit passer en formule : toute expression mathématique (égalités, inégalités, fonctions et
   leurs arguments, intégrales, sommes, produits, ensembles, intervalles, matrices, lois, exposants,
   indices, lettres grecques désignant des objets), et toute lettre isolée qui désigne un objet
   mathématique (« la fonction f » → « la fonction $f$ », « u est diagonalisable » → « $u$ est… »).
   Les nombres seuls dans le texte courant (« 3 exercices », « dimension 2 ») restent du texte ; un
   nombre qui est une valeur d'objet mathématique (« en −1 », « f(0) = π/2 ») passe en formule.
   Les noms propres et termes français (Cauchy-Schwarz, ln-convexe, Bohr-Mollerup) restent du texte,
   sauf la partie symbolique (« ℓ²-normes » → « $\ell^2$-normes »).
4. Conventions LaTeX (KaTeX) :
   - ensembles : `\mathbb{R}`, `\mathbb{C}`, `\mathbb{N}`, `\mathbb{Z}`, `\mathbb{Q}`, `\mathbb{K}`,
     `\mathbb{R}_n[X]`, `\mathbb{K}[X]`, `\mathcal{M}_n(\mathbb{R})`, `\mathcal{S}_n(\mathbb{R})`,
     `\mathrm{GL}_n(\mathbb{R})`, `\mathrm{O}(n)`, `\mathrm{SO}(n)`, `\mathcal{L}(E)`, `\mathcal{C}^1`,
     `\mathcal{C}^\infty`, `\mathfrak{S}_n` ;
   - intervalles à la française : `\left]-1, +\infty\right[`, `\left[0, 1\right[`, `[0, 1]` ;
     entiers : `[\![1, n]\!]` ;
   - opérateurs en romain : `\ln`, `\exp`, `\sin`, `\cos`, `\det`, `\dim`, `\max`, `\min`, `\sup`,
     `\inf`, `\lim`, `\operatorname{tr}`, `\operatorname{rg}`, `\operatorname{Ker}`, `\operatorname{Im}`,
     `\operatorname{Sp}`, `\operatorname{Vect}`, `\operatorname{Var}`, `\operatorname{Cov}`,
     `\mathbb{E}`, `\mathbb{P}` (ou `P` si le texte écrit P(X = k) : garde la lettre du sujet) ;
   - `\leqslant`, `\geqslant`, `\mathrm{d}t`, `\sim`, `\to`, `\mapsto`, `\infty`, `{}^t\!A` ou `A^\top`
     selon le texte (« Mᵀ » → `M^\top`, « tA » → `{}^t\!A`) ;
   - indices et exposants explicites : « λi pi » → `\lambda_i p_i`, « a_{n+1} » → `a_{n+1}`,
     « u^q » → `u^q`, « x^k/k² » → `x^k/k^2` ; « R1[X] » → `\mathbb{R}_1[X]` ;
   - sommes et intégrales : « Σ x^k/k² » → `\sum x^k/k^2` (n'ajoute des bornes que si le texte les
     donne) ; « ∫ de 0 à π/2 de … dt » → `\int_0^{\pi/2} … \,\mathrm{d}t` ;
   - pas de `$$`, pas de `\[`, pas de `\displaystyle`, pas de commandes hors KaTeX, pas de `\lex`.
5. **Fidélité.** Tu transcris ce que dit le texte, sans rien ajouter ni corriger. Si la notation
   linéaire est ambiguë (exemple : « 1/πu » : 1/π_u ou u/π ? « e^x+1 » : e^{x+1} ou e^x + 1 ?), tranche
   par le sens mathématique quand il est clair et dis-le dans `_signalements` ; sinon laisse le passage
   en texte et signale-le. Les sujets dont l'URL commence par `documents/annales/` sont dans le dépôt :
   `pdftotext -layout /home/claude/atlas/<url> -` en donne le texte, et tu dois t'y reporter en cas
   d'ambiguïté. Les autres PDF ne sont pas accessibles depuis la machine (réseau filtré) : ne tente pas
   de les télécharger.
6. Couvre **tous** les champs de chaque sujet du lot, y compris les noms de parties et les mots-clés.
   Un champ sans formule ne reçoit aucun remplacement.

À la fin, réponds en quelques lignes : nombre de sujets, nombre de remplacements, essai réussi ou non,
et la liste des signalements.

## Consigne : relecture indépendante d'une conversion de formules en LaTeX

Un premier agent a produit, pour un lot de fiches d'annales, une liste de remplacements qui passent en
LaTeX (`$…$`, composé par KaTeX) les formules écrites en notation linéaire. Lis d'abord sa consigne,
`CONSIGNE_conversion.md` (même dossier) : ses règles et conventions s'imposent aussi à toi. Tu n'as pas
vu son travail se faire ; ton rôle est de le contrôler sans complaisance.

### Entrées
- le lot d'origine `lotN.json` (textes actuels, chemin → texte) ;
- les remplacements proposés `remplacementsN.json` ;
- `apercuN.txt` : pour chaque champ modifié, le texte avant et après application.

### Ce que tu vérifies, remplacement par remplacement
1. **Fidélité mathématique** : la formule LaTeX dit exactement ce que disait le texte (mêmes objets,
   mêmes indices, mêmes exposants, mêmes bornes, mêmes signes ; rien d'ajouté, rien d'omis). Attention
   aux parenthèses d'exposant (« e^(−x) » → `e^{-x}`), aux fractions (« 1/2x »), aux transposées, aux
   ensembles (ℝ vs 𝕂), aux intervalles ouverts/fermés.
2. **Conventions** (consigne de conversion, §4) : `\mathbb`, intervalles `\left]…\right[`, opérateurs en
   romain, `\leqslant`, `\mathrm{d}t`, indices explicites.
3. **Exhaustivité** : relis chaque champ du lot dans `apercuN.txt` (et dans `lotN.json` pour les champs
   non modifiés) ; toute formule ou lettre-objet restée en notation linéaire doit être ajoutée.
4. **Texte intact** : hors des `$`, aucun mot ne doit avoir changé ou disparu, sauf de petits mots
   absorbés par un symbole (règle 2 de la consigne) ; refuse toute absorption abusive.
5. **Ambiguïtés** : examine chaque `_signalements` ; pour un sujet dont l'URL commence par
   `documents/annales/`, tranche sur le PDF (`pdftotext -layout /home/claude/atlas/<url> -`) ; sinon par
   le sens, ou laisse en texte.

### Sortie
Écris `remplacementsN_relu.json` : la liste **complète et corrigée** des remplacements (même format,
même clé `_signalements` mise à jour avec tes propres remarques), qui remplacera celle du premier agent.
Vérifie-la avec
`cd /home/claude/atlas && python3 outils/annales_formules.py appliquer AAAA <fichier> --essai`
jusqu'à ce que l'essai passe. NE LANCE JAMAIS `appliquer` sans `--essai`. Ne modifie aucun fichier du dépôt.

Écris aussi `correctionsN.md` : une ligne par correction (sujet, champ, avant → après, motif), puis les
ajouts, puis les points non tranchés. Réponds enfin en quelques lignes : nombre de corrections par
catégorie (fidélité, convention, oubli, texte modifié), et les points non tranchés.
