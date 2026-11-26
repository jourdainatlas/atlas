# Liaison des programmes officiels aux cours et exercices — consignes des agents

Rubrique Annales, vue Programme (`MEMO_atlas_annales.md` §45). Outils : `outils/annales_liaison.py`
(catalogue, thèmes, points, exporter, valider, appliquer, notes). Le dépôt est en **lecture seule** pour les
agents : ils écrivent leurs fichiers dans le dossier de travail qu'on leur indique, et l'auteur de la
conversation Annales reporte les liens relus (`appliquer`), puis rend les notes lisibles (`notes`).

## 1. Agent de liaison

**Entrées.** Le texte des points (`annales_liaison.py points <prog> <smin> <smax>`), les liens actuels déjà
relus (`exporter`), le catalogue des cours et exercices concernés (`catalogue <niveau> [préfixes]`), le
vocabulaire des thèmes (`themes`). Les PDF des cours sont dans `documents/cours/<niveau>/` (champ `pdf` et
`sommaire_pages` de `rubriques/cours.yaml`, `pdftotext -layout`) ; les énoncés et corrigés complets des
exercices dans `rubriques/exercices/<feuille>.yaml`.

**Ce qu'on relie à chaque point** (une ligne de la colonne « Contenus » du texte officiel) :
- `cours` : au plus **3** sections, « chapitre:rang du sommaire » (rang à partir de 1). Une section n'est
  reliée que si elle **expose** le point (définition, énoncé démontré, ou admis — ce qu'une note dit). Vérifier
  sur le texte du PDF, jamais d'après le seul titre de la section. La section qui **démontre** passe devant
  celle qui **rappelle** ; à niveau égal, la plus proche du cadre du point (L¹(T) plutôt que fonctions continues
  par morceaux si le programme dit L¹).
- `ex` : au plus **6** exercices, **du plus accessible au plus difficile**, qui **travaillent le point
  lui-même** (pas un exercice qui ne fait que s'en servir) ; un contre-exemple seulement s'il éclaire le point.
  Lire l'énoncé complet (et le corrigé en cas de doute).
- `themes` : au plus **3** thèmes d'annales (ids de `rubriques/annales-themes.yaml`), le plus fin et le plus
  pertinent d'abord. Vocabulaire général pour les concours, vocabulaire `ly-…` pour le bac. Un thème qui ne
  retrouve aucun sujet hors bac est inutile (préférer son parent) ; les thèmes nés pour le bac
  (`limites-fonctions`, `suites-arith-geom`, `second-degre`, `geometrie-espace`) ne s'emploient pas pour un
  concours.
- `note` : une phrase complète qui dit ce qui manque ou ce qui est partiel (« admis dans le cours, démontré
  dans l'exercice … », « le site ne traite que le cas réel »). Pas de note qui ne dit que « aucun exercice »
  (la page montre déjà l'absence). Les notes citent les renvois par identifiant (`mp-05:4`, `l3-in-03-15`) :
  le script `notes` les rend lisibles.
- Point sans cours ni exercice : il s'affiche « à venir » (aucune liste vide n'est une erreur).

**Niveau.** Pour une filière de prépa, relier aux cours de MPSI/MP (ou du niveau de la filière) ; un
exercice dont une partie notable sort du programme de la filière n'est pas relié, sauf s'il est le seul et
qu'une note signale les questions hors programme. Pour le CAPES, un lien de L3 seulement si le point est de
ce niveau ; pour l'agrégation, la L3 et le Master sont bienvenus.

**Quand on repart de liens existants** (nouveaux cours ou exercices) : priorité aux points « à venir » et sans
exercice ; ajouter une section ou un exercice nouveau quand il est meilleur ; au-delà des limites, retirer le
moins pertinent ; **ne retirer aucun lien juste** sans motif ; réécrire ou supprimer toute note devenue fausse.

**Sortie.** Le fichier complet des points des sections confiées, dans l'ordre (format dans
`annales_liaison.py`), validé par `annales_liaison.py valider` ; à côté, `<nom>_changements.md` : une ligne
par changement (point s/b/p, champ, avant → après, motif). **Écrire réellement le fichier** et vérifier
(`cmp`) qu'il diffère de l'entrée là où on a changé quelque chose. Réponse : points modifiés, « à venir »
avant → après, liens hésitants.

## 2. Agent de relecture (indépendant)

1. Vérifier que le fichier du premier agent reflète son journal (diff avec les liens d'avant).
2. Pour chaque changement : la section citée sur le texte du PDF, l'exercice sur son énoncé complet ;
   l'ordre des exercices ; chaque retrait d'un lien juste motivé (rétablir sinon) ; chaque note réécrite exacte,
   chaque note supprimée devenue fausse.
3. Chercher les oublis : parcourir les cours et exercices du catalogue pour les points restés « à venir » ou
   sans exercice.
4. Trancher les hésitations signalées.
5. Sortie : le fichier corrigé (même format, validé) et `<nom>_corrections.md` (une ligne par correction :
   point, champ, avant → après, motif). Réponse : corrections par catégorie (cours, exercices, thèmes,
   notes), décisions, cas non tranchés.

## 3. Champ `annales_themes` d'un chapitre (proposition)

Le chapitre de cours porte dans `cours.yaml` la liste des thèmes d'annales qu'il expose (domaine Cours : la
conversation Annales **propose**, la conversation Cours reporte). Liste ordonnée, **thème principal en
tête** ; un thème seulement si le chapitre expose la notion (pas une simple mention) ; vérifier combien de
sujets hors bac chaque thème retrouve (`annales_liaison.py themes` ; un parent retrouve aussi les sujets de
ses enfants) ; signaler les notions importantes sans thème (synonyme à ajouter dans `annales-themes.yaml`,
domaine Annales, plutôt qu'un thème nouveau qui ne retrouverait aucun sujet). Rendu : tableau chapitre →
liste actuelle → liste proposée → motifs ; relu par un second agent.
