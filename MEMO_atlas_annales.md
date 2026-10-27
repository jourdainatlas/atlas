# Mémo ATLAS — complément : rubrique Annales

> Complète `MEMO_atlas.md` (sections 0 à 16), à lire avec lui. Ce mémo appartient à la conversation
> « Annales » : elle seule le modifie (voir `MEMO_atlas.md`, section 0). La version du dépôt fait foi ;
> la copie du projet Claude en est le reflet.

### 17. Annales et moteur de recherche (26-27 oct. 2026)

**Grille.** `rubriques/annales.yaml` : familles `ingenieurs` (X-ENS, Mines-Ponts, Centrale, CCINP, e3a ; MP, MPI dès 2023, PC, PSI) et `enseignement` (CAPES externe, CAPES bac+3 dès 2026, agrégation externe, agrégation interne ; agrégation spéciale et troisième concours exclus). Sessions 2011 à 2026, 562 cases pour 542 PDF distincts. Chaque case porte `sujet`, `rapport`, `source: {nom, url}`. Règles de l'auteur : un clic ouvre le PDF tel qu'il est publié sur le site officiel ; vmaths.fr seulement à défaut de source officielle ; Mines-Ponts 2014-2025 hébergés depuis les ZIP officiels (`documents/annales/AAAA/mines-ponts/`), source citée ; pas de corrigés pour l'instant. Grille coulissante avec curseur, vue Grille par défaut (aussi sur téléphone), vue Liste, fiche latérale « Contenu » par sujet (`#annales/sujet/<slug>`), présentation de la rubrique repliable.

**Moteur.** Vocabulaire `rubriques/annales-themes.yaml` : 7 domaines, 240 thèmes, thèmes fins rattachés par `parent:` à un thème large, chacun relié à des nœuds de l'édifice (`noeuds:`) et muni de synonymes. Index : `rubriques/annales-index/AAAA.yaml` (un fichier par session, 2 411 parties au total pour 542 sujets), fusionné par `construire.py`, écrit par `rendu.mjs` dans `site/annales-index.json` et chargé à la demande. Chaque sujet : `cle`, `sujet` (URL), `titre`, `resume`, `pages`, `blocs` (nom, pages PDF, 1 à 4 thèmes principaux, au plus 5 secondaires, 2 à 8 mots-clés). Champs nommés `nom`, `apercu`, `blocs` pour éviter le rendu Markdown de `rendu.mjs` ; jamais `[[` dans un texte (lien de lexique) ; titres à virgules entre guillemets. Les PDF de devenirenseignant forcent le téléchargement : pas de `#page=`.

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
