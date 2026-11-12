# Mémo ATLAS — complément : À propos, apparence et contact

> Complète `MEMO_atlas.md` (sections 0 à 16) et se lit avec lui. Ce mémo appartient à la conversation
> « À propos » : elle seule le modifie. La version du dépôt fait foi ; la copie du projet Claude en est
> le reflet.

### 28. Page À propos (27 oct. 2026)

**Données.** `rubriques/apropos.yaml` : `auteur`, `fonction`, `etablissement`, `initiales`, puis
`sections` (id, titre, texte). Une section peut porter `etapes` (frise : `periode`, `titre`, `lieu`) ou
`epreuves` (cartes : `nom`, `public`, `texte`) ; `a_rediger: true` affiche « À venir » et nourrit le
bandeau « Prototype » de la page. Seuls `titre` et `texte` passent par le rendu (formules, liens) ; les
autres champs sont du texte simple, échappé.

**Code.** `pageAPropos` et `aProposSection` dans `gabarit.html` ; styles `.apropos*`, `.profil`,
`.texte-auteur`. La carte de profil porte un sommaire qui fait défiler jusqu'aux sections sans changer
l'ancre (`data-apropos-section`) ; il est masqué sur téléphone. Le rouge reste réservé aux définitions,
aux axiomes et au logo : le dernier jalon de la frise est à la couleur de l'encre.

**Sources du contenu.** Le CV et la lettre de motivation de l'auteur (avril 2026). Consigne de
l'auteur : aucune mention de la foi ni de la religion (pas d'aumônerie, pas de couvent). Ne publier ni
l'adresse postale ni le téléphone. Parcours abrégé à la demande de l'auteur (27 oct. 2026) : classes préparatoires
(Gustave-Eiffel), court passage en école d'ingénieurs sans la nommer, université de Bordeaux, CAFEP
(2018), agrégation (2025) ; aucun établissement d'exercice passé, seul le lycée actuel, cité dans
« Enseignements ». Descriptions des concours vérifiées le 27 oct. 2026 : TFJM²
(communiqué de l'ENSMA, 2026 : Animath, équipes de 4 à 6, problèmes ouverts, rôles défenseur, opposant,
rapporteur), Olympiades (Éduscol : Première, 4 h, partie nationale individuelle, partie académique en
équipes de 2 à 4), Concours général (Terminale, 5 h), TeSciA (L'Étudiant, 2023 : test de l'AORES, pas
un concours).

**Portrait.** `identite/portrait.jpg` (280 px, recadré sur le visage depuis la photo du CV, converti en
sRGB, sans métadonnées), déclaré par `portrait:` dans `apropos.yaml` et ajouté à la liste des fichiers
d'`identite/` que `rendu.mjs` copie dans `site/`. Si l'image manque (aperçu en fichier unique), les
initiales s'affichent à sa place.

**Contact (27 oct. 2026).** Adresse `contact@atlasjourdain.fr` : redirection gratuite de l'offre MX Plan
« redirect » d'OVH vers l'adresse personnelle de l'auteur (aucune boîte chez OVH ; les réponses partent
de l'adresse personnelle). Zone DNS inchangée : MX et SPF d'OVH, A, AAAA et CNAME `www` vers GitHub.
Dans `apropos.yaml`, champ `courriel: {local, domaine}` ; `aProposSection` assemble l'adresse dans la
page (elle n'apparaît pas en clair dans `site/index.html`) et affiche « Écrire » (`mailto:`) et « Copier
l'adresse ».

**Menu et partage (27 oct. 2026).** Le menu du logo affiche « À propos – Contact », sans badge « en
construction ». Titres d'onglet et de partage : voir `MEMO_atlas.md`, section 13. Un lien copié depuis la
barre d'adresse (`/#annales`) donne toujours l'aperçu générique de l'accueil, car le serveur ne reçoit
pas ce qui suit « # » : seul le bouton « Partager » (`/annales/`) donne l'aperçu propre à la rubrique.
Page d'accueil (27 oct. 2026) : titre « ATLAS – Architecture des mathématiques » (`<title>` de `gabarit.html`, `og:title`
de `rendu.mjs`) ; description choisie par l'auteur, pour l'aperçu, les moteurs et `/accueil/` : « Architecture logique
des théories mathématiques ; cours, exercices corrigés, et annales de concours avec recherche par thème. »

**Voix (27 oct. 2026).** À la demande de l'auteur, les sections sont écrites à la première personne ; restent
impersonnelles les cartes des épreuves et la section « Principes de rédaction » (demande de l'auteur). La section Enseignements ne donne pas de
compte de chapitres, pour ne pas vieillir à chaque dépôt.

**Points ouverts.** Année sabbatique 2014-2015 et projet de thèse,
laissés de côté en attendant l'avis de l'auteur.

### 34. Application installable (30 oct. 2026)

ATLAS est une application web progressive : sur Android, le navigateur propose de l'installer ; sur
iPhone, Partager › « Sur l'écran d'accueil ». Elle s'ouvre en plein écran et affiche toujours la version
publiée : aucune publication en magasin, aucune mise à jour à faire par les utilisateurs.

- **Fichiers (domaine À propos, `identite/`)** : `site.webmanifest` (nom, couleurs, icônes),
  `icone-192.png`, `icone-masquable-512.png` (plein cadre, graphe dans le disque central de 80 %), fabriquées
  par `fabriquer-icones.mjs` (les autres icônes en sortent identiques à l'octet), et `sw.js`.
- **`sw.js`** : réseau d'abord, copie gardée pour le hors-ligne ; PDF (`documents/`) jamais en cache ; polices
  Google en cache d'abord ; hors ligne, une page jamais visitée renvoie à l'accueil gardé. `rendu.mjs` le
  copie dans `site/sw.js` en remplaçant `'atlas-__VERSION__'` par l'empreinte de la page : chaque
  publication installe un nouveau service worker, qui efface le cache précédent.
- **`rendu.mjs`** : balises `manifest` et `apple-mobile-web-app-*` dans la tête de `site/index.html`, copie
  des fichiers ci-dessus.
- **`gabarit.html`** (bloc « Application installable », fonctions `appli…`, styles `.appli-encart`) :
  enregistrement du service worker seulement sur atlasjourdain.fr ou localhost (jamais dans l'aperçu
  Claude) ; encart d'invitation après 4 s, sur Android (événement `beforeinstallprompt`, bouton
  « Installer ») et sur iPhone ou iPad (explication du geste) ; jamais dans l'application installée ni sur
  ordinateur ; fermé, il ne revient plus (`localStorage`, clé `atlas-appli`).
- Vérifié en local (Chromium) : manifeste et icônes servis, page contrôlée, rubriques lisibles hors ligne,
  encart sur iPhone émulé et absent sur ordinateur. Reste à confirmer sur un vrai iPhone.

### 35. Signaler une erreur (31 oct. 2026)

Bouton drapeau dans l'en-tête, entre le thème et « Partager », sur toutes les vues (`#signaler`). Il
ouvre un petit panneau : la page visée (fil d'Ariane, plus la fiche choisie dans l'édifice, l'exercice ou
le sujet d'annales ouvert), « Écrire » (`mailto:` vers l'adresse de contact, objet « ATLAS – erreur :
… » et corps préremplis avec la page et son adresse de partage `adressePartage()`) et « Copier
l'adresse ». Fermeture par ×, Échap, clic au-dehors ou changement de vue. Code dans `gabarit.html`,
bloc « Signaler une erreur » (`aProposCourriel`, `aProposSignalCible`, `aProposFermerSignal`), styles
`.signaler*`. Sur téléphone, la grille de l'en-tête passe à quatre colonnes (marque, thème, drapeau,
Partager) pour que « Partager » reste sur la première ligne.

Extension à toutes les rubriques (31 oct. 2026, accord de l'auteur) : un petit drapeau propre à chaque
élément, par `aProposSignalBouton(cible, url)` (bouton `.signal-elt`, discret à 55 % d'opacité, plein au
survol), inséré par remplacement local dans `fiche()` (titre de la fiche, chemin complet par
`aProposCheminEdifice`), `pageChapitre` (barre du lecteur PDF), `carteExercice` (tête de la carte) et
`ficheSujetHTML` (liens du sujet, donc grille, liste et panneau). Un seul gestionnaire délégué
(`aProposOuvrirSignal`) sert le drapeau de l'en-tête et ceux des éléments ; le panneau suit son drapeau au
défilement et se ferme s'il sort de l'écran.

### 36. Nouveautés (31 oct. 2026)

Rubrique `#nouveautes` (menu du logo, entre Annales et À propos ; page de partage `/nouveautes/`).
Données : `rubriques/nouveautes.yaml` (`intro`, `entrees` : date entre guillemets, sinon PyYAML en fait une
date que le JSON refuse ; `rubrique` edifice | cours | exercices | annales | activites | site (activites ajouté le 11 nov. 2026, couleur `--c-ord`) ; `titre` ; `texte` ;
`liens: [{nom, ancre}]`, champ nommé `nom` et non `texte`, que `rendu.mjs` composerait en paragraphe ;
`couvre`). Espaces insécables avant ; : ! ? » et après « dans les textes.
Code : `pageNouveautes` et auxiliaires `nouv…` dans `gabarit.html`, styles `.nouv*` ; chronologie par
jour, une carte par nouveauté (bord à la couleur de la rubrique : édifice `--c-nb`, cours `--c-ana`,
exercices `--c-geo`, annales `--c-alg`, site `--encre-3`), filtres par rubrique. Date de la dernière
visite de la page gardée sur l'appareil (`localStorage`, clé `atlas-nouveautes-vu`) : cartes plus
récentes marquées « nouveau », pastille « nouveau » dans le menu tant qu'il reste du neuf (jamais à la
première visite).
Règle d'alimentation et filet de sécurité : `MEMO_atlas.md`, section 0, point 8 ; vérifications dans
`construire.py` (bloc « Nouveautés » : forme des entrées et ancres en erreur, oublis en avertissement).
Onze entrées initiales (25-31 oct.), rédigées d'après l'historique du dépôt.

### 37. Mesure d'audience (31 oct. 2026)

GoatCounter, code de site `atlasjourdain` ; tableau de bord privé de l'auteur
(https://atlasjourdain.goatcounter.com), option « Allow adding visitor counts » désactivée : aucun chiffre
affiché. Bloc « Mesure d'audience » de `gabarit.html` (`AUDIENCE`, `audience…`) : script
`https://gc.zgo.at/count.js` chargé seulement sur atlasjourdain.fr (jamais en local ni dans l'aperçu
Claude), `no_onload`, puis une vue par ancre stable depuis une seconde, sous un chemin lisible
(`#annales/sujet/x` → `/annales/sujet/x`, `#continuite.c-tvi` → `/edifice/continuite/c-tvi`, accueil → `/`) ;
provenance transmise seulement à l'arrivée. Retiré puis rétabli le même soir à la demande de l'auteur.
Information des visiteurs (CNIL), choix de l'auteur : une seule ligne discrète en pied de l'À propos, sans
nommer l'outil (`mention:` dans `apropos.yaml`, classe `.apropos-mention`) : « Ce site mesure sa
fréquentation de façon anonyme, sans cookie ni suivi d'un site à l'autre. » Pas de mention dans les
crédits de l'accueil ; l'outil est cité dans `LICENCE.md` seulement. L'auteur exclut ses propres visites
par `#toggle-goatcounter` sur chaque appareil, ou par son adresse IP (Settings › Tracking).

### 38. Référencement, premiers pas (3 nov. 2026)

`rendu.mjs` (bloc « Référencement ») écrit `site/robots.txt` (tout autorisé, adresse du plan) et
`site/sitemap.xml` : l'accueil et les PDF déposés des cours et des feuilles (179 adresses au 3 nov.), que
Google indexe comme documents. Les pages de partage n'y sont pas (elles redirigent vers une ancre :
« pages avec redirection » dans la Search Console), ni les PDF d'annales (copies de sujets officiels).
Données structurées `WebSite` (schema.org, JSON-LD) dans la tête de `site/index.html` : nom, auteur,
licence. L'auteur déclare le domaine dans Google Search Console (enregistrement TXT chez OVH), y soumet
le plan, puis importe le compte dans Bing Webmaster Tools. Suite prévue : « voie A » (pages de lecture
indexables), qui ajoutera ses pages au plan.

### 39. Pages de lecture indexables : édifice et annales (3 nov. 2026, « voie A »)

`lecture.mjs` (domaine À propos, référencement), appelé par `rendu.mjs` à la place des pages de partage
de l'édifice : écrit une page complète, sans redirection, pour chaque nœud (`/edifice/<id>/`, 1 013 au
3 nov.), pour chaque sujet d'annales (`/annales/sujet/<slug>/`, 562 ; slug = `slugSujet` du gabarit) et deux
pages d'entrée (`/edifice/` : les théories ; `/annales/` : tous les sujets par famille, concours et
session). Accord de l'auteur : un lien partagé ouvre désormais cette page de lecture, avec un bouton
« Ouvrir dans l'atlas » vers l'ancre interactive ; pas de redirection automatique (Google n'indexe pas une
page qui redirige, et le « cloaking » est sanctionné).
Contenu : texte, énoncé, démonstration (dépliée), remarques, ⋆, documents, « Repose sur » et « Sert à »
en liens vers les pages voisines, contenu du sous-graphe pour une théorie ou un chapitre ; pour un
sujet : PDF, rapport, source, aperçu, parties avec thèmes et mots-clés (formules composées depuis `Fh`),
fiches de l'édifice reliées aux thèmes. Liens `{{nœud}}` du texte réécrits vers `/edifice/<id>/`.
Fil d'Ariane visible et en données structurées (`BreadcrumbList`). Feuille `site/lecture.css` = style du
gabarit + mise en page propre (classe `l-corps` sur `body` : la classe `.lecture` existe déjà dans le
gabarit, pour les chapitres de cours). Thème : même cookie `atlas-theme` que le site.
Partage : `adressePartage` et le drapeau d'un sujet d'annales visent `/annales/sujet/<slug>/`.
Plan du site : ces 1 577 pages s'ajoutent à l'accueil et aux PDF (1 756 adresses). Poids : environ 115 Mo
de plus dans `site/` (494 Mo au total avant ; la limite conseillée de GitHub Pages est 1 Go).
Restent à faire par leurs conversations : exercices (`/exercices/<id>/`) et cours (`/cours/<id>/`), dont les
pages de partage leur appartiennent (message proposé à l'auteur le 3 nov.).

### 40. Page introuvable, termes reliés, PDF.js servi par le site, accueil (3 nov. 2026)

- **404** : `site/404.html`, écrite par `lecture.mjs` avec le gabarit des pages de lecture (option
  `fichier`, `indexable: false` → `noindex`, hors plan du site) : message et liens vers les rubriques.
- **Termes du lexique** sur les pages de lecture : `relier(html, ici)` change chaque `span.terme` en lien
  vers la page de la fiche qui le définit (`defini`), avec la définition en infobulle (texte brut, 180
  caractères) ; un terme défini dans la fiche même et les notations dans les formules restent des
  mentions. Profite aussi aux pages des cours et des exercices, qui appellent `relier`.
- **PDF.js** : copie exacte de `pdfjs-dist` 3.11.174 (npm) dans `vendor/pdfjs-3.11.174/` (licence Apache 2.0
  jointe), copiée par `rendu.mjs` dans `site/pdfjs/` ; le gabarit la charge sur le site, le CDN reste pour
  l'aperçu Claude. Pas de dépendance npm : `pdfjs-dist` tire `canvas`, module natif optionnel, que `npm ci`
  tenterait de compiler. Plus aucun script d'un CDN dans le site, hors mesure d'audience. `LICENCE.md`.
- **Accueil** (`pageAccueil`, deux appels) : `aProposCommencer()` après l'ouverture, quatre profils (lycée,
  prépa, CAPES-agrégation-Master, curiosité) avec puces calculées sur les niveaux en ligne ;
  `nouvAccueil()` avant le pied, les trois dernières nouveautés. Styles `.acc-profil*`, `.acc-nouv*`.
- **Fil RSS** : `site/nouveautes.xml` (RSS 2.0, bloc de `rendu.mjs`), lien `alternate` dans la tête de la
  page ; le lien d'un article vise la page de lecture de son premier lien, sinon l'ancre.

### 41. Poids du site publié (mesure du 3 nov. 2026, après les pages de lecture)

`site/` : 626 Mo, 4 914 fichiers. Limite de GitHub Pages : 1 Go publié, sans offre payante pour la relever
(les plans payants ne changent que la disponibilité de Pages pour les dépôts privés) ; bande passante
souple de 100 Go par mois ; déploiement limité à 10 minutes.
Répartition : `exercices/` (pages de lecture) 138 Mo, `exercices-textes/` (JSON du site interactif) 132,
`documents/` 124 (annales 35, exercices 43, cours 32, figures 13), `branches/` (JSON de l'édifice) 105,
`edifice/` (pages de lecture) 105, `annales/` 11.
Cause principale : les formules sont livrées déjà composées en HTML KaTeX (environ 860 octets par
formule) : 5 Mo de sources YAML d'exercices donnent 132 Mo de JSON, 5 Mo de sources de l'édifice
105 Mo ; et ces textes sont présents deux fois, dans le JSON du site interactif et dans les pages de
lecture. Pistes, de la plus efficace à la plus simple : (1) composer les formules dans le navigateur
(KaTeX y est déjà) et ne livrer que le TeX, la construction gardant la vérification des formules :
de l'ordre de 400 Mo de moins ; (2) supprimer le doublon, le site interactif lisant les textes dans les
pages de lecture : de l'ordre de 240 Mo de moins ; (3) changer d'hébergeur (Cloudflare Pages gratuit :
pas de limite de taille totale, mais 20 000 fichiers et 25 Mio par fichier). Seuil d'alerte : 800 Mo.

### 42. Repères de couleur des rubriques (4 nov. 2026)

Une couleur par rubrique de contenu, la même partout (accueil, menu, Nouveautés) : édifice `--r-edifice`
(= `--c-nb`, bleu), cours `--r-cours` (`--c-ana`, vert d'eau), exercices `--r-exercices` (`--c-geo`,
violet), annales `--r-annales` (`--c-alg`, orange) ; accueil, nouveautés et à propos `--r-neutre` (gris).
Bloc CSS « repères de couleur des rubriques » de `gabarit.html` : sélection par `data-rubrique` (menu) et
par `href` (cartes de l'accueil), donc sans toucher au code des rubriques. Accueil : bande de 3 px en haut
des encadrés (cartes des rubriques, étapes de « Comment les rubriques se
répondent », dernières nouveautés ; pas sur la miniature de l'édifice, à la demande de l'auteur) ; profils de « Par où commencer ? » en dégradé des rubriques visées
(classes `p-lycee`, `p-prepa`, `p-concours`, `p-curiosite`). Menu : barre de couleur à gauche de chaque
entrée ; la rubrique courante sur fond `--trame` (elle avait une barre rouge, le rouge étant réservé).

### 43. Symboles des rubriques (4 nov. 2026)

Sept symboles en aplats de trois nuances de la couleur de leur rubrique, choisis par l'auteur : arbre au
tronc courbé et aux feuilles en amande (édifice), livre ouvert (cours), stylo à bille sur une feuille
(exercices), deux sujets empilés avec un sceau (annales), calendrier (nouveautés), silhouette (à propos),
maison (accueil). Sprite SVG au début de `.app` dans `gabarit.html` (`<symbol id="sym-…">`, feuille
commune `#sym-fe`), couleurs par variables `--sy-…` (classes `.sy-…`), inversées sous
`:root[data-theme="dark"]`. Fonction `symbole(nom)` ; placés dans le menu du logo (devant chaque titre,
par script), sur les cartes des rubriques de l'accueil (`carte()`), en tête du fil d'Ariane de l'en-tête
(observateur du fil : le symbole de la rubrique courante, `li.fil-icone`, sans séparateur), et dans les
cartes et filtres des Nouveautés (rubrique « site » → maison). Variantes écartées : arbre au trait,
ramures, façade ; la ramure penchée reste en réserve (dessin dans la conversation du 4 nov.).

Alignement des cartes de l'accueil : la ligne de titre (`.acc-rubriques .acc-rub .r-tete`) est centrée
(`align-items: center`) et non plus alignée sur la ligne de base, sinon le titre se calait sur le bas du
grand nombre et paraissait décalé par rapport au symbole. Sélecteur renforcé car la règle d'origine,
`.acc-rub .r-tete`, vient plus loin dans le fichier.
Symboles des encadrés « Par où commencer ? » (choix de l'auteur, 4 nov.) : `sym-p-lycee` (cartable vert,
fermoir violet), `sym-p-prepa` (pile de trois livres vert, violet, orange), `sym-p-concours` (toque bleue,
gland orange, livre vert), `sym-p-curiosite` (loupe grise sur un petit graphe bleu). Couleurs = celles de la
bande de l'encadré. Le symbole est calé sur la première ligne du titre (`align-items: flex-start`), car
« CAPES, agrégation, Master » passe sur deux lignes en quatre colonnes. Variantes écartées : tableau vert,
marches et fanion, rosette, boussole, lunette.
Nouveautés (4 nov.) : les cinq entrées du 3 nov. sur les étapes vers le second théorème d'incomplétude
(PA, β, syntaxe, instances, Σ₁-complétude) sont fondues en une seule, avec les six liens ; la règle de
regroupement est ajoutée au point 8 de MEMO_atlas.md §0 et en tête de `nouveautes.yaml`.
Accueil, « Par où commencer ? » (4 nov.) : les puces de niveau (Seconde, Première…, Maths approfondies,
Maths Sup) ouvrent la page Cours filtrée sur ce niveau, et non plus son premier chapitre : lien `#cours`
avec `data-cours-niveau`, un écouteur en capture pose `pageCours.filtre` avant la navigation ; « Tous les
cours » remet le filtre sur `tous`. Lien « Le cours de Master » retiré à la demande de l'auteur.

## 44. Recherche globale (4 nov. 2026)

Loupe dans l'en-tête (`#chercher-tout`, entre le fil et le bouton de thème ; grille de l'en-tête du
téléphone passée à cinq colonnes), raccourcis Ctrl K, ⌘ K et « / ». Panneau `#rg-fond` créé à la première
ouverture (plein écran sur téléphone). Sans rien charger, il cherche dans : l'édifice (même notation que
`chercherEdifice`, via `indexEdifice()` ; 6 résultats), le lexique (`D.lexique`, 4 → `#lexique/<id>`), les
chapitres de cours déposés (titre, niveau, sommaire, résumé ; 4), les feuilles en ligne (4), les sujets
d'annales (5, seulement si la recherche nomme un concours, une filière ou une année, sinon « maths »
prendrait tout ; → `#annales/sujet/<slug>`). Deux renvois finissent toujours la liste : la même recherche
parmi les exercices (pose `etatExo.q`) et dans le moteur des annales (pose `etatRech.q`, remplit `#ann-q`).
Bonus de titre exact, pluriel compris (« groupe » → Groupes). Fonctions `rg…` dans le bloc « Recherche
globale » du gabarit. Les exercices un à un ne sont pas indexés ici (l'index pèse 1,7 Mo) : c'est le
renvoi qui les couvre.

## 45. Mentions légales et licence (4 nov. 2026)

Section `mentions` de `apropos.yaml`, à la troisième personne (registre juridique, comme « Principes ») :
éditeur personnel et non commercial, directeur de la publication, hébergeur (GitHub, Inc., 88 Colin P.
Kelly Jr. Street, San Francisco, CA 94107, États-Unis : obligation de la LCEN pour un éditeur non
professionnel, qui peut taire son adresse), registrar OVH ; licence CC BY-NC-SA 4.0 (choix de l'auteur,
déjà en §9 de MEMO_atlas.md) étendue explicitement aux cours et feuilles ; sujets et rapports des Annales
exclus (propriété de leurs auteurs) ; données : aucun cookie, audience anonyme, thème et date de dernière
visite restent dans le navigateur ; crédits KaTeX, PDF.js, polices. Liens externes dans les textes de l'À
propos : syntaxe `[texte](https://…)`, convertie par `aProposLiens` dans le gabarit (le rendu commun n'a
pas de syntaxe de lien externe). Espaces insécables écrites dans le YAML (U+202F avant « ; », U+00A0
avant « : »), car le rendu ne les ajoute pas.

## 46. Chargement plus rapide (4 nov. 2026)

Détail au §12 de MEMO_atlas.md : `cherche.json` à part, lexique différé à l'inoccupation, cache durable
`atlas-fixe` du service worker pour les fichiers `?v=`. Mesure (Playwright, 390 px, 1,6 Mb/s, 150 ms, sans
service worker, serveur gzip local) : affichage de l'accueil et de l'édifice 2,5 s → 2,0 s. Pistes suivantes,
non faites car dans le domaine d'autres conversations : résumés KaTeX des cours (26 Ko compressés) et liste
des sujets d'annales (8 Ko) à charger avec leur rubrique ; tracé des arêtes (`aretes`, 52 Ko) par branche.

## 47. Images d'aperçu par rubrique (4 nov. 2026)

`identite/apercu-<rubrique>.png` (édifice, cours, exercices, annales, nouveautés, à propos ; 1200 × 630,
fond sombre, bande et adresse dans la couleur de la rubrique, symbole de la rubrique dans une tuile, titre
et sous-titre en Spectral), fabriquées par `identite/fabriquer-apercus.mjs`, qui lit la planche de
symboles et la palette sombre dans le gabarit (à relancer si un symbole change ; polices @fontsource
installées à part). `rendu.mjs` les copie (`APERCUS`) ; `og:image` choisi par le premier segment de
l'adresse, dans `page()` de `lecture.mjs` (`imageApercu`, donc aussi pour les pages de cours et
d'exercices) et dans `pagePartage` ; l'accueil, la 404 et le reste gardent `apercu.png`. Les messageries
gardent souvent l'ancien aperçu en cache : un lien déjà partagé peut mettre du temps à changer.
Mise à jour (4 nov., demande de l'auteur) : la section `mentions` porte `repliable: true` ; `aProposSection`
la rend en `<details>` fermé (classe `apropos-repli`, chevron, titre 17 px gris), texte en 14 px au lieu de
17 px. Le lien du sommaire de la carte de profil ouvre le repli avant d'y défiler.

## 48. Impression des fiches de l'édifice (4 nov. 2026)

Choix de l'auteur : imprimante au trait juste après le drapeau du titre de chaque fiche (`.imp-elt`, même
réglage que `.signal-elt` : 26 px, opacité .55, `top: -2px`), menu « Cette fiche » / « Toute la théorie »
ou « Tout le chapitre » (graphe que la fiche ouvre, sinon celui qui la contient ; absent pour une théorie
sans graphe intérieur), case « Avec les démonstrations » cochée par défaut ; feuille montante sur
téléphone. Couleurs gardées (thème clair imposé à l'impression, même en thème sombre) ; les annales ne
sont pas concernées. La feuille est composée dans `#impression` (`impImprimer`, après `chargerBranche`),
seule visible sous `@media print` (classe `body.imprime`) ; couverture et sommaire pour un ensemble ;
nature, ⋆, †, Repose sur, encadrés choix et Admis, énoncé, démonstration dépliée, remarques, Sert à.
En-têtes et pieds par les boîtes de marge de `@page` (style `#imp-page` écrit à chaque impression :
chemin, adresse, © et licence, date, page / total) ; Safari et Firefox ne les affichent pas, d'où un pied
de document qui répète licence et adresse. Une figure ne se coupe pas, ce qui peut laisser un blanc en
bas de page ; une remarque illustrée peut se couper (`:has(figure)`). Essai : « Les entiers relatifs »,
9 pages avec démonstrations, 8 sans ; fiche Bézout, 1 page.
Mise à jour (4 nov., demande de l'auteur) : l'encadré « ⋆ Axiome du choix » des fiches est un `<details
class="choix">` replié (« + ⋆ Axiome du choix · où et comment il intervient »), ouvert d'un clic ; le ⋆ du
titre suffit à signaler le choix. Il n'est plus imprimé : la feuille garde seulement le ⋆ après la nature.
Accueil, encadré « Vers la prépa, en prépa » (4 nov., texte validé par l'auteur) : dernière phrase « Le
moteur des annales retrouve, par thème, les parties de sujets de concours d'ingénieurs qui portent sur le
chapitre que l'on vient d'étudier. » ; lien « Chercher un thème dans les annales → » (`data-vers-moteur`),
qui ouvre les Annales sur `#rech-ann` et place le curseur dans le champ (ordinateur seulement).

## 49. Projection d'un exercice en classe (4 nov. 2026)

Choix de l'auteur : projection des exercices seulement (pas des fiches de l'édifice), un exercice à la fois.
Bouton « écran » au trait à droite du drapeau de chaque carte d'exercice (`pjBouton(e)` dans
`carteExercice`, masqué sous 760 px). Plein écran (`requestFullscreen`) ; écran 0 : la carte de l'exercice
en grand (symbole de la rubrique, « Exercice n », barres de difficulté, types, ligne de lieu, énoncé) ;
puis le corrigé par étapes, une par question (un bloc qui commence par « 2. », « (b) » ou « b) » ouvre une
étape, les blocs suivants s'y rattachent ; sans marque, une étape par bloc), l'énoncé restant en colonne à
gauche ; étapes vues estompées, la dernière ramenée à l'écran. Touches : → Espace Entrée Page suivante,
← Page précédente, C tout le corrigé (sans estomper), E énoncé, T clair ou sombre (départ : thème du
site), Échap quitter (aussi en sortant du plein écran). Couleurs : palettes claire et sombre du site
reprises dans `.pj` / `.pj.sombre` ; liens et termes non cliquables. Fonctions `pj…`, bloc « Projection »
du gabarit. Message envoyé à la conversation Exercices (structure des corrigés, espaces insécables).
Incident de publication (4 nov., 17 h) : la mise en ligne de ed94977 a dépassé le délai de 10 min de
`deploy-pages` (« updating_pages » sans fin, côté GitHub), puis le relancement manuel a été annulé car il
portait la même version. Remède : un nouveau commit (une version différente) ; `gh run rerun` est refusé.
À surveiller : si les délais se répètent, le poids du site (≈ 630 Mo) en est une cause probable (§41).
Accueil, « Par où commencer ? » (4 nov., demande de l'auteur, qui prépare des cours de Maths Spé) : Maths
approfondies passe dans « Au lycée » (« Choisissez votre classe ou votre option… ») ; le deuxième encadré
devient « En prépa », texte « Les cours suivent les programmes des classes préparatoires, chapitre par
chapitre. Le moteur des annales… » ; ses puces sont calculées : tous les niveaux rangés entre
`approfondies` et `master` dans `cours.yaml` qui ont des chapitres (une Maths Spé y apparaîtra seule). Lien
raccourci en « Les annales par thème → » pour tenir sur une ligne ; espace insécable avant chaque flèche.
En-tête (4 nov., demande de l'auteur) : sur téléphone, loupe, thème et drapeau ont la même boîte de 36 px
(32 px sous 350 px), 2 px d'écart entre eux, 10 px avant la loupe (elle touchait le chevron du menu à 375 px)
et 8 px avant Partager ; icône du thème ramenée à 24 px. Sur ordinateur, les trois sont aussi serrés à 4 px
(marges négatives sur l'écart de 20 px de l'en-tête). Loupe et drapeau du même gris (`--encre-2`).

## 50. Cours : symbole et ligne de couleur des chapitres (4 nov. 2026)

Choix de l'auteur : ligne en dégradé (pas en tronçons proportionnels) et un symbole en aplat sous le numéro de
chaque chapitre de la page Cours. Bloc « Cours : symbole et ligne de couleur » du gabarit :
`SYM_DESSINS` (45 dessins, viewBox 24, classes `f1` plein, `f2` .55, `f3` .2, `t` trait fin, `t3` trait
épais, couleur `--c`) et `SYM_CHAPITRES` (id du chapitre → dessin ; les 62 chapitres du 4 nov.). Un même
sujet garde le même dessin d'un niveau à l'autre (Venn pour ap-01 et ma-01, tangente pour p-04 et ma-05,
cercle trigonométrique pour p-06 et ma-04, aire pour t-06 et ma-06, convergence pour t-01 et ma-07, matrice
pour me-03 et ap-09…). Couleur du symbole : la famille de l'édifice la plus représentée parmi les
`theories` du chapitre (`couleurNoeud(theorieDe(id))`, comme les pastilles) ; ligne de 4 px : dégradé des
familles distinctes, dans l'ordre de la liste (`bandeChapitre`). Un chapitre absent de `SYM_CHAPITRES`
n'a que la ligne. **Partage des tâches (décision de l'auteur, 4 nov.)** : les tables `SYM_DESSINS` et
`SYM_CHAPITRES` passent dans le domaine de la conversation Cours, qui dessine le symbole de chaque nouveau
chapitre au moment de son dépôt et retouche un symbole à la demande de l'auteur (planche montrée avant
publication) ; le reste du bloc (CSS, `bandeChapitre`, `symboleChapitre`) reste au domaine apparence. Planche de contrôle : script de la
conversation du 4 nov. (toutes les cartes à 72 px, clair et sombre).

## 51. Termes définis des PDF de cours dans la recherche globale (5 nov. 2026)

Convention des cours : le terme défini est écrit en rouge dans le PDF. `outils/cours_termes.py` (lancé par
`construire.sh`, dépendance `pdfplumber` dans `requirements.txt`) relève ce texte rouge hors formules, page par
page, élimine le bruit (intitulés, consignes, ligatures mal codées des PDF de Maths Sup : `(cid:28)` = fi,
`Ø` = é…), marque ce qui suit un intitulé « Définition », et écrit `outils/cours-termes.json` (versionné), rangé
par PDF avec son SHA-256 : seuls les PDF nouveaux ou modifiés sont relus (≈ 1 min pour les 62, 0,3 s sinon) ;
sans pdfplumber, le fichier en place sert. Exclusions : `outils/cours-termes-exclus.txt` (appliquées par
`rendu.mjs`, le cache garde tout). `rendu.mjs` écrit `site/cours-termes.json?v=` (≈ 33 Ko, chapitres déposés
seulement), chargé avec les extraits (`chargerTermesCours`, à l'inoccupation ou à l'ouverture de la
recherche). Recherche globale : groupe « Définis dans les cours » (5 résultats, bonus aux termes d'un bloc
Définition) ; le lien ouvre le chapitre et le lecteur PDF va à la page (`allerPage`, sans toucher au code
des cours). Au 5 nov. : 1 395 termes, bruit estimé à moins d'un sur dix. Après le dépôt d'un PDF, committer
`outils/cours-termes.json` (sinon la publication relit ce PDF à chaque fois).

## 52. Allègement : formules composées dans le navigateur (9 nov. 2026)

Le site passait de 632 à 704 Mo en deux jours (limite GitHub Pages : 1 Go). Le HTML composé par KaTeX pesait 20 à
30 fois la source (fiche « Théorème central limite » : 276 Ko publiés pour 8 Ko de source). Désormais :
- `rendu.mjs`, `formule()` : chaque formule est **vérifiée** par KaTeX à la construction (une erreur bloque toujours
  la publication), mais **publiée comme un repère** `<span class="kx">source échappée</span>` (`kxd` : formule
  centrée ; `\lex{id}` déjà converti en `\htmlData{g=id}`). La ponctuation collée (insécable) devient les attributs
  `data-av` / `data-ap`. `texteBrut` convertit les repères en texte simple (`texteTex`).
- `gabarit.html`, tout en tête du script : `composerFormule`, `composerDans(racine, tout)`, un MutationObserver
  qui confie chaque repère inséré à un IntersectionObserver (marge 150 %) : seules les formules proches de l'écran
  sont composées (onglet Lexique ≈ 7 000 formules, corrigés fermés, bas des listes : plus tard). `.kx` est invisible
  jusqu'à sa composition (jamais de LaTeX brut) ; sans KaTeX, `html.sans-katex` les montre en clair.
  `texteFormule` (ℕ ℤ ℚ ℝ ℂ…) sert aux textes simples (`rgTexte`). `katex.min.js?v=` est chargé par la page avant
  le script (cache durable du service worker). **Règle pour tout code** : un contenu inséré puis lu ou mesuré
  aussitôt (texte des formules, hauteur) doit d'abord appeler `composerDans(élément, true)` ; c'est fait pour
  l'impression (`#impression`, cachée à l'écran).
- `lecture.mjs`, `page()` : dans les pages de lecture (référencement), les repères deviennent du **MathML**
  (`output: 'mathml'`), lisible sans script par les navigateurs et les moteurs ; les lettres stylées (`mathvariant`
  double-struck, script, fraktur, bold, sans-serif, que Chrome n'applique pas) sont remplacées par leurs
  caractères Unicode mathématiques.
- Aperçu à fichier unique : KaTeX y est inséré en ligne.
Mesures : site 704 → 308 Mo (branches 107 → 22, textes des exercices 137 → 8,5, pages de lecture des exercices
158 → 67, de l'édifice 113 → 58, exemples 38 → 8). Composition : 500 formules en 133 ms (440 ms à CPU ÷ 4, ordre
d'un téléphone moyen), d'où la composition paresseuse. Vérifié : fiche, démonstration, lexique, cours, exercice et
corrigé, feuille, annales, recherche, projection, impression, pages de lecture.

## 53. Visionneuse de PDF de l'application installée (9 nov. 2026)

Signalé par l'auteur : dans l'application installée sur l'écran d'accueil de l'iPhone, un PDF du site ouvert
(`target="_blank"`) s'affichait en plein écran sans aucun moyen de revenir. Bloc « Visionneuse de PDF » du gabarit :
**seulement quand `appliInstallee()`**, un clic sur un lien vers un PDF du même site (cours, feuilles, corrigés,
sujets hébergés ; `download` compris) ouvre `.vp` par-dessus la page : barre « ← Retour », titre (titre du cours
si le PDF en est un), page courante / total, Partager (si `navigator.share`), Télécharger ; pages dessinées par
PDF.js (`/pdfjs/`). `history.pushState` à l'ouverture : le geste ou le bouton retour du téléphone la ferme
(`popstate`). `#page=n` ouvre à la page n. Les PDF des sites officiels (annales) gardent leur comportement (feuille
Safari avec « OK »). Dans un navigateur ordinaire, rien ne change.

## 54. Cours : « Ce que ce chapitre définit » (9 nov. 2026)

Carte de la colonne d'un chapitre de cours, sous le Sommaire (`definitChapitre(c)`, appelée dans la page du chapitre
du gabarit) : les termes définis relevés dans son PDF (`TERMES_COURS`, §51), dans l'ordre des pages ; un clic mène à
la page (`data-pdf-page`, comme le sommaire). Douze montrés, le reste sous « Voir les n termes ». La carte se remplit
à l'arrivée de `cours-termes.json` si besoin.

## 55. Pont lexique ↔ cours (9 nov. 2026)

Un terme du lexique de l'édifice aussi défini dans un cours (même terme à la casse et au s/x final près,
`normTerme`) : sa fiche du lexique porte « Dans les cours » (`.dans-cours`, un lien par chapitre, du lycée au master,
qui ouvre le PDF à la page : `a[data-cours-page]`), et sa bulle une ligne « Aussi défini dans le cours … » (`bulleCours`).
Au 9 nov. : 131 termes du lexique reliés. Les variantes de nom (« divisibilité des entiers » / « divisible ») ne sont
pas rapprochées : seule l'égalité des termes compte.

## 56. Index alphabétique (9 nov. 2026)

Page `#index` (rubrique « Index » du menu, couleur neutre ; `RUBRIQUES.index`, `pageIndex` du gabarit) : tous les
termes définis du site, de A à Z, en deux colonnes sur ordinateur. Un terme du lexique et le même terme défini dans
des cours (`normTerme`) forment une entrée ; renvois « lexique » (bleu de l'édifice) et « Niveau, ch. n p. k » (vert
des cours ; le PDF s'ouvre à la page). Barre collante : champ de filtre (sans accents) et lettres. Au 9 nov. : 1 934
entrées (1 090 au lexique, ≈ 950 dans les cours). Pour l'index, `rendu.mjs` écarte aussi des termes des cours les
fragments coupés par une formule (début en « de », « pour », « dans »…, « def », « deg ») : 1 395 → 1 345 termes,
ce qui profite aussi à la recherche globale.

## 57. « Reprendre où j'en étais » (9 nov. 2026)

`repriseDepuisAncre` (à chaque `hashchange` et au chargement) retient dans le navigateur (`localStorage`
« atlas-reprise », jamais envoyé ; mentionné dans les mentions légales : « ne quittent pas le navigateur ») le dernier
chapitre de cours, la dernière feuille ou le dernier exercice, et la dernière fiche de l'édifice ouverts (un par sorte,
le plus récent en tête). L'accueil les propose sous les boutons du bandeau (« Reprendre », avec le symbole de la
rubrique ; « Effacer »). Un exercice ouvert avant l'arrivée de l'index est noté à son arrivée.

## 58. Contrôle hebdomadaire des liens des annales (9 nov. 2026)

`outils/verifier_liens.py` teste les ≈ 720 adresses externes de `rubriques/annales.yaml` (sujet, rapport, source ;
HEAD puis GET partiel ; deux échecs espacés de 20 s avant de déclarer un lien cassé). `.github/workflows/liens.yml` le
lance chaque lundi à 5 h 17 UTC (ou à la main, onglet Actions) et ouvre ou met à jour le ticket « Liens cassés des
annales » du dépôt (GitHub prévient l'auteur par courriel), ou le ferme quand tout répond. Les corrections relèvent
de la conversation Annales. Testé ici sur la lecture des adresses seulement (le réseau de cette session ne joint pas
les sites des concours) : le premier vrai passage se fait sur GitHub.

## 59. Accessibilité (9 nov. 2026)

Audit axe-core (WCAG 2 A et AA) sur l'accueil, une fiche, Cours, un chapitre, Exercices, Annales, Nouveautés, À propos
et Index, en clair et en sombre. Corrigé (domaine apparence) :
- contrastes : `--encre-3` #858b96 → **#686e79** en clair (4,7:1 sur le papier), #7c838e → **#90979f** en sombre ;
  `--corrige-filet` #3f8f63 → **#2b7550** en clair (onglet « Corrigé ») ; comptes des pastilles sans opacité, et lisibles
  sur une pastille active ; pastilles « Ce que ce chapitre définit » sur fond blanc (≈ 390 éléments en défaut → 0) ;
- carte de l'édifice de l'accueil : n'est plus un lien contenant des liens (div, clic hors bulle → édifice) ; SVG
  `role="group"` ;
- termes du lexique dans les formules : `tabindex="-1"` (ils étaient focalisables dans la partie aria-hidden de KaTeX) ;
- séparateur du panneau : `aria-valuenow` (part du panneau en %), barres de difficulté `role="img"`, liste « Notion de
  l'atlas » nommée ;
- contour de focus visible au clavier pour tout lien, bouton et résumé (`:focus-visible`), et pour les bulles SVG.
Reste, hors domaine : titres h4 orange des familles de concours dans les Annales (#d26d00 sur blanc, 3,5:1 ; à
assombrir en #ad5900 par la conversation Annales).

## 60. Retour après un renvoi vers un cours ; symbole de l'Index (9 nov. 2026)

Demande de l'auteur : un lien `a[data-cours-page]` (lexique « Dans les cours », index) note la page de départ et sa
position (`RETOUR`, conteneur qui défile : `#panneau` pour le lexique, `#rubrique` et la fenêtre sinon) ; sur le
chapitre ouvert, un bouton flottant « ← Retour au lexique » ou « ← Retour à l'index » (`#retour-renvoi`, en bas au
centre) revient par l'historique et remet la position (deux fois, 250 puis 700 ms, après la remise en haut de page de
la rubrique) ; la fiche du lexique d'où l'on venait est brièvement soulignée. Il disparaît si l'on quitte le chapitre
autrement. Symbole `sym-index` (répertoire gris à onglets sur la tranche, sans lettres), dans le menu, le fil d'Ariane
et la carte de l'index ; gris neutre comme Nouveautés et À propos.

## 61. Cours : « À revoir avant » (9 nov. 2026)

Carte de la colonne d'un chapitre, avant « Chapitres liés » (qui ne répète plus ces chapitres). Liste dans
`rubriques/cours-prerequis.yaml` (`a_revoir: {chapitre: [chapitres]}`), **domaine de la conversation Cours**, qui fait
foi et se corrige à la main. Règle de l'auteur, vérifiée par `construire.py` (erreur bloquante) : seulement des
chapitres du **niveau scolaire juste en dessous** (Seconde pour la Première ; Première pour la Terminale, les Maths
expertes et approfondies ; ces trois-là pour la Maths Sup ; Maths Sup pour le Master ; rien pour la Seconde).
Proposition initiale : `outils/cours_prerequis.py` (fiche intérieure commune ou ancêtre dans l'édifice, fiches citées
par plus du quart des chapitres ignorées, trois au plus ; refuse d'écraser le fichier sans `--forcer`), puis relue :
retirés les liens faibles (« Notion de suite » proposée par les seules limites, « Espaces vectoriels » pour la logique,
« Groupes » pour les polynômes…), ajoutés les évidents (Fonctions numériques avant la Dérivation et l'exponentielle,
Pourcentages avant les suites, Trigonométrie avant la géométrie complexe). 42 chapitres, 74 renvois.

## 62. Lien vers une page précise d'un cours (9 nov. 2026)

- Ancre `#cours/<id>/<n>` : `depuisAncre` ouvre le chapitre puis le lecteur à la page n (`allerPage`), sans toucher à
  `pageCours`.
- « Partager » sur un chapitre : si le lecteur affiche une page au-delà de la première, l'adresse copiée est
  `…/cours/<id>/?page=n` (le bouton dit « Lien de la page n copié ») ; l'aperçu des messageries reste celui du chapitre.
- Page de lecture du cours (`lecture.mjs`, pages dont l'ancre commence par `cours/`) : un court script lit `?page=n`
  et change les boutons en « Ouvrir le cours à la page n → » (`/#cours/<id>/n`). Google ignore le paramètre.

Idée écartée par l'auteur (9 nov. 2026) : « exercice au hasard » / « exercice du jour » (bouton M'entraîner,
encadré d'accueil). Ne pas la reproposer.

## 63. Corrigé question par question ; suivi des exercices (10 nov. 2026)

**Corrigé.** À l'ouverture d'un corrigé dans la banque d'exercices, seule la première question est montrée ;
« Question suivante (k sur n) » dévoile la suivante, « Tout le corrigé » le reste. Le découpage est celui de la
projection, mis en commun dans `etapesCorrige(C, parBloc)` : un bloc qui commence par « 2. », « (b) » ou « b) »
ouvre une étape. Sans marque de question, le corrigé s'ouvre en entier (la projection, elle, garde une étape par
bloc). Le découpage se fait dans le DOM au premier `toggle` (`corrEtapes`, `corrMaj`) : `e.corrige`, la
projection et les pages de lecture ne changent pas.

**Suivi.** Boutons « ✓ Fait » et « ↻ À revoir » au pied de chaque exercice (second clic : retire la marque),
pastille à côté du titre (`.exo[data-suivi]`), jauge sur la carte de chaque feuille et dans le bandeau d'une
feuille ouverte (`suiviJauge`, cachée tant qu'aucun exercice de la feuille n'est marqué). Stockage :
localStorage « atlas-suivi », `{ id: [état, feuille] }`, propre au navigateur, jamais envoyé. Couleurs : vert du
corrigé pour « fait », ambre pour « à revoir » (jetons `--revoir` et `--revoir-fond`, clair et sombre ; le rouge
reste réservé).

**Filtre « Mon suivi »** (colonne de gauche, après « Type d'activité ») : puces « À faire » (exercice sans marque),
« Fait », « À revoir », cumulables, avec leur compte (`etatExo.suivi`, critère `suivi` de `filtrerExercices`,
effacé par la corbeille). Marquer un exercice met les comptes à jour sur place sans redessiner la liste, pour que
le corrigé ouvert le reste ; la liste filtrée ne se recalcule qu'au clic suivant sur un filtre.

**Écarté.** Le sommaire latéral des pages longues : les fiches de l'édifice n'ont pas d'intertitres (énoncé,
démonstration, remarques) et s'affichent dans le panneau à côté du graphe ; l'À propos a déjà son sommaire.

## 64. Hébergement OVHcloud (en service depuis le 10 nov. 2026)

**Pourquoi.** Un ordinateur du lycée de l'auteur refuse le site (Firefox : SSL_ERROR_RX_RECORD_TOO_LONG), même
après la mise en liste blanche du domaine : le filtre de l'établissement bloque le réseau Fastly, qui sert
GitHub Pages (le site de Fastly est lui-même bloqué). L'auteur a choisi l'hébergement web OVHcloud **Perso**
(100 Go ; domaine déjà chez OVH).

**Publication.** Le workflow `publier.yml` garde la publication GitHub Pages et ajoute un job `ovh` : il
récupère l'archive du site construit (artefact `github-pages`) et lance `outils/publier_ovh.py` (paramiko,
SFTP port 22) vers le dossier `atlas` du compte FTP. Secrets du dépôt : `OVH_HOTE`, `OVH_UTILISATEUR`,
`OVH_MOT_DE_PASSE` (enregistrés par l'auteur, jamais dans la conversation) ; sans eux, le job est sauté.
Envoi différentiel par la liste d'empreintes `.manifeste-atlas.json` (réécrite en fin d'envoi, interdite au
public par le .htaccess) ; ordre : .htaccess, ressources, pages, puis index.html et sw.js ; suppression des
fichiers retirés du site ; la liste est réécrite tous les 400 fichiers, si bien qu'un envoi interrompu reprend
où il s'était arrêté (vérifié : coupé au bout de 7 s, l'envoi suivant n'avait plus que 4 481 fichiers sur 5 635).
Essai local (sshd) : 5 635 fichiers en 40 s, puis 0 à renvoyer. Le premier envoi réel a été annulé au bout de
10 min par une publication suivante : `concurrency` de publier.yml est passé à `cancel-in-progress: false` (une
publication attend la fin de la précédente ; seule la plus récente attend), job `ovh` limité à 90 min.
Réglages Apache : `identite/htaccess-ovh` (déposé en `.htaccess`) : 404.html, HTTPS forcé (`SERVER_PORT` 80,
méthode d'OVH), atlasjourdain.fr → www, Cache-Control 600 s (sw.js : no-cache), types MIME, compression.

**Bascule, dans l'ordre.** (1) Multisite : `essai.atlasjourdain.fr` → dossier `atlas`, SSL ; test depuis le
lycée. (2) Si le test passe : Multisite `atlasjourdain.fr` et `www.atlasjourdain.fr` → `atlas`, SSL, sans
modification automatique du DNS ; zone DNS : A/AAAA de @ vers l'hébergement, CNAME `www` remplacé par A/AAAA ;
MX, SPF et TXT (Google, GitHub) inchangés. (3) GitHub Pages reste en secours quelques semaines (retour = anciennes
lignes DNS), puis on retire son job et l'auteur désactive Pages. Mettre alors à jour MEMO_atlas.md (ligne
« Le site est servi à… ») et la mention de l'hébergeur dans les mentions légales (rubriques/apropos.yaml).

**Bascule faite le 10 nov. 2026.** Essai validé depuis le lycée sur `essai.atlasjourdain.fr`. Interface OVH (nouvelle) :
onglet « Mes sites » (un dossier = un site : ajouter un domaine par le menu ⋮ du site, pas par « Ajouter un site »,
qui répond « path atlas already used ») ; DNS en configuration **manuelle** ; certificats Let's Encrypt par l'onglet
« Certificats SSL », un par adresse. Zone : un seul A et un seul AAAA sur @ (145.239.37.162, 2001:41d0:301::30),
`www` CNAME `atlasjourdain.fr.`, lignes `essai` A/AAAA. Les certificats affichés « Actif » ont mis environ 30 min à
être servis par tous les frontaux d'OVH (pendant ce temps, une partie des visites recevait le certificat générique
`cluster130.hosting.ovh.net`, erreur SSL_ERROR_BAD_CERT_DOMAIN). Contrôle après coup : 404 servie par 404.html,
http → https, atlasjourdain.fr → www, sw.js no-cache, liste d'empreintes interdite (403) ; `.xml` servi en
application/xml (sitemap), `nouveautes.xml` en application/rss+xml. Mentions légales : hébergeur OVH SAS,
2 rue Kellermann, 59100 Roubaix (d'après les mentions légales d'ovhcloud.com).
**Reste à faire** dans quelques semaines : retirer `essai.atlasjourdain.fr` (Mes sites, certificat, zone DNS) pour
éviter un double du site ; retirer les jobs GitHub Pages de publier.yml (le job `ovh` dépend alors directement de la
construction, qui devra téléverser le site par actions/upload-artifact) et faire désactiver Pages par l'auteur.

## 65. Accueil, encadré « En prépa » : « S'entraîner » filtré sur Maths Sup (10 nov. 2026)

Le lien porte `data-niveau-exos` = premier niveau de prépa (`prepa[0]`, aujourd'hui `ma`, Maths Sup – MPSI) : le
gestionnaire existant de #rubrique ouvre la banque d'exercices, vue « Par exercice », avec ce seul niveau coché
(1 081 exercices sur 2 698). Quand Maths Spé aura des exercices, décider s'il faut cocher tous les niveaux de prépa.

## 66. Rubriques en pastilles dans l'en-tête (11 nov. 2026)

Demande de l'auteur : naviguer d'une rubrique à l'autre sans passer par le menu du logo. `<nav class="nav-rub"
id="nav-rub">` après `.marque-menu` : Accueil, L'édifice, Cours, Exercices, Annales, Activités (symbole + nom,
`span.nav-rub-nom`). Le menu du logo reste inchangé (il garde Nouveautés, Index, À propos). Nom de classe : le
premier essai `.onglets` entrait en collision avec les onglets du panneau des fiches (même nom) ; ne pas réutiliser.

`majOnglets()` (après `SYMBOLES`) : rubrique courante = `#rubrique.dataset.nom` en rubrique, sinon `edifice` ;
son lien est enveloppé dans `span.nav-rub-cur` (pastille à la couleur `--r` de la rubrique) suivi de
`span.nav-rub-suite`, qui reprend les éléments du fil `#fil` après le nom de la rubrique (chaque bouton déclenche
le bouton correspondant du fil, qui garde toute la logique). Relancée par un MutationObserver sur `#fil` et au
`hashchange`. Classe `body.a-onglet` quand une rubrique est marquée : le fil est alors masqué (sauf ≥ pages hors
onglets : Nouveautés, Index, À propos gardent leur fil et aucune pastille n'est marquée).

Grand écran (≥ 1100 px) : onglets complets ; dès qu'un fil est à lire (`nav.replie`), les autres rubriques se
replient en pastilles rondes sans couleur (fond de la barre, filet), symbole seul, nom gardé pour les lecteurs
d'écran et en infobulle. `.entete` passe en `nowrap` avec `min-width: 0` (sans quoi la grille `.app` s'élargit au
contenu) ; le titre trop long se raccourcit par points de suspension.
Téléphone et tablette (< 1100 px) : seconde ligne sous la barre ; toutes les rubriques sauf la courante sont
toujours repliées (30 px, 28 px sous 420 px) ; la pastille courante contient le fil sur deux lignes (trois sous
420 px), sans le nom de la rubrique (la couleur suffit ; sous 420 px le symbole aussi disparaît). En grille
(≤ 860 px) : `.nav-rub` en ligne 2 (ligne 3 hors onglets, sous le fil), et dans l'édifice le bouton Légende
partage la ligne 2 (colonnes 5 et suivantes) ; sous 420 px la pastille de l'édifice se réduit à son symbole.
Vérifié de 360 à 1 440 px, clair et sombre, sans débordement horizontal ni erreur de console.

## 67. Symbole de la rubrique Activités (11 nov. 2026)

Choix de l'auteur, parmi six propositions puis cinq variantes : **E1**, une pièce de puzzle claire portant une
courbe en cloche dont le sommet est marqué, et sous elle un curseur dont le bouton est à l'aplomb du sommet
(visualisation et casse-têtes). Il remplace dans `#sym-activites` l'ancien « courbe et curseur ». Tout en aplats
(classes `activites-sy1/2/3`, couleur `--c-ord`) : la courbe est une bande calculée par décalage le long de la
normale (demi-épaisseur 1, repère de la pièce), avec deux disques en bout ; pièce et courbe réduites à 0,88 et
remontées (`translate(1.18 -3.17)`), curseur de 4 à 20 en y = 19,3. Les variantes non retenues (pièce pleine,
point qui suit le curseur, aire teintée, pièce au trait) ne sont pas à reproposer sans demande.

## 68. Référencement : descriptions, titres, données structurées, dates, IndexNow, llms.txt (11 nov. 2026)

Aucun changement visible à l'écran ; tout est dans l'en-tête des pages de lecture ou dans des fichiers à part.
1. **Formules en texte** (`rendu.mjs`, `texteTexLisible`, appelé par `texteBrut`) : symboles Unicode (∣ ≤ ∈ ℤ ℝ
   α…), fractions simples a/b, √, exposants et indices en caractères supérieurs et inférieurs (sinon `^(…)`,
   `_(…)`), `\binom{n}{k}` → « (k parmi n) ». Et la ponctuation collée aux formules (`data-av`, `data-ap` des
   marqueurs kx : « », virgule, point) n'était pas reprise par `texteBrut` depuis §52 : elle l'est. Effet sur les
   descriptions, le fil RSS et l'index de recherche. Avant : « La divisibilité a mid b a divise b , … mathbb Z » ;
   après : « La divisibilité a ∣ b, « a divise b », … c ∈ ℤ ».
2. **Titres** : `page()` de `lecture.mjs` retourne « ATLAS – sujet » en « sujet – ATLAS » pour toutes les rubriques
   (les appelants n'ont pas changé) ; fiches de l'édifice : « Titre (nature) – ATLAS ».
3. **Données structurées** : en plus du BreadcrumbList, une `LearningResource` schema.org par page de lecture,
   déduite de l'adresse (`sorteRessource`) : type de ressource (définition, théorème et démonstration, exercice
   corrigé, feuille, cours en PDF, activité interactive, sujet de concours), auteur (Person, professeur agrégé,
   lien vers l'À propos), licence CC BY-NC-SA 4.0, langue, gratuité, site parent. Paramètre facultatif
   `ressource` de `page()` pour qu'une rubrique la complète (niveau, notions…). 600 blocs vérifiés au hasard : JSON
   valide.
4. **lastmod** : empreinte de contenu par adresse (pages : titre + description + corps ; PDF : le fichier) ;
   `site/sitemap-dates.json` publié ({ adresse: [empreinte, date] }) et relu à la publication suivante depuis le
   site en ligne : empreinte inchangée → date gardée, sinon date du jour (Europe/Paris). Site injoignable → dates
   du jour, rien de signalé. Construction déterministe vérifiée (deux constructions : 0 empreinte différente).
5. **IndexNow** : clé publique `identite/indexnow-cle.txt`, publiée en `/<clé>.txt` ; `rendu.mjs` écrit
   `site/indexnow-a-signaler.json` (adresses nouvelles ou modifiées), que `publier_ovh.py` ne publie pas et que
   l'étape « Signaler les pages modifiées » du job `ovh` envoie à api.indexnow.org (`outils/indexnow.py`) après la
   mise en ligne. Le premier envoi (toutes les adresses) a reçu 403, la clé venant d’être publiée dans la même minute ; les suivants passent (200). Envoi complet à la main : lancer « Publier ATLAS » dans l’onglet Actions en cochant indexnow_tout (fait le 11 nov. 2026).
6. **llms.txt** (`site/llms.txt`, tiré des données) : présentation, auteur, licence, rubriques, chapitres de cours
   et activités avec leurs adresses. Effet incertain (aucun grand moteur ne s'engage à le lire), coût nul.
Bing Webmaster Tools : site inscrit par l'auteur le 11 nov. 2026 (rapport IndexNow et indexation à y suivre).
Ajout du 11 nov. 2026 : lien « Activités » dans l'en-tête des pages de lecture (`.l-rubriques`, masqué sur téléphone comme les autres) et dans la liste de la page 404.

## 69. Haut de l'accueil : fil de l'axiome au théorème, roue des rubriques (11 nov. 2026)

Demande de l'auteur : rendre dynamique le haut de l'accueil, inchangé depuis l'origine. Tout est dans `gabarit.html`.

**Fil de l'édifice** (`accueilFil(premiereFois)`, appelé par `afficherRubrique` et `rafraichirRubrique`). Dans la
miniature (`miniEdifice()` : arêtes `path.ar[data-de][data-vers]`, bulles `a.nd[data-t]`, groupe `g.acc-traits`) :
à la première ouverture l'édifice se monte rang par rang de bas en haut ; ensuite un trait lumineux part de la
logique et grimpe arête par arête (chemin tiré au hasard en redescendant les arêtes) jusqu'à une théorie ; la
légende `.acc-chemin` nomme chaque théorie traversée puis affiche un théorème de la théorie atteinte, lien vers sa
fiche, avec ⋆ s'il a `choix`. Théorèmes tirés : nature théorème, non admis, titre commençant par « Théorème », au
plus 60 caractères ; théories servies à tour de rôle. Survol ou focus d'une bulle : toute l'ascendance de la
théorie (« repose sur N théories de l'édifice »). Bouton `.acc-fil-bouton` (pause/reprise). Arrêt hors écran
(IntersectionObserver) et onglet masqué. `prefers-reduced-motion` : un chemin fixe, le bouton en trace un autre.
Pièges rencontrés : la classe `.fil` est celle du fil d'Ariane (masquée par `body.a-onglet`), d'où `.acc-trait` ;
la page d'accueil est dessinée deux fois au démarrage, d'où `accueilFil.debut` (le montage reprend où il en était)
et `enCours` vrai jusqu'à la fin du montage (sinon l'observateur lance un tracé pendant le montage).

Correctif du 11 nov. (téléphone) : la légende tient sur une ligne (`nowrap`) ; avec la colonne `1fr` du téléphone, un
titre de théorème long élargissait la carte, donc la page entière (390 → 459 px), et le navigateur dézoomait :
l'en-tête paraissait coupé. Colonne passée à `minmax(0, 1fr)`, `min-width: 0` sur la carte, et sur téléphone le
titre du théorème passe à la ligne (hauteur réservée 86 px).

**Roue des rubriques** (`accueilRoue()`, bloc `.acc-roue` de `pageAccueil`) : elle remplace les quatre boutons
(`.acc-actions`), que la barre de navigation (§66) doublait. Cadran `.ro-cadran` : les symboles des rubriques
(`.ro-sym`, celles dont le compte est nul sont omises) sur un cercle qui tourne d'un cran (`--a`) et amène le
symbole courant à droite, face au texte ; au centre le chiffre de la rubrique (`.ro-nb`) ; à droite les volets
`.ro-volet` (nom, phrase, lien) superposés dans une même case de grille et échangés en fondu, ce qui fixe la
hauteur. Le tour `.ro-avance` (animation WAAPI de 5,2 s) sert de minuterie : sa fin fait avancer la roue, sa mise
en pause (survol, focus clavier, onglet masqué) la suspend. Clic sur un symbole : rubrique choisie par le plus
court chemin. Le cran courant est gardé dans `accueilRoue.cran` (page redessinée). Pas de cadre ni de fond coloré
(choix de l'auteur) : la couleur ne porte que sur le tour, le symbole actif et le nom. `prefers-reduced-motion` :
rien ne tourne seul.

**Texte de présentation** : la dernière phrase cite désormais les activités interactives.

Vérification des rendus : le navigateur de test ne charge pas Google Fonts ; pour des captures fidèles, les polices
Spectral et IBM Plex sont installées localement (paquets npm `@fontsource/*`, convertis en TTF dans `~/.fonts`).

## 70. Symboles animés des encadrés de l'accueil et de la roue (11 nov. 2026)

Demande de l'auteur : une petite animation par symbole des neuf encadrés de l'accueil (quatre profils, cinq
rubriques), au survol ; et la même, dans la roue (§69), quand le symbole arrive en face du texte.

Mécanisme (`gabarit.html`). Les pièces à animer sont nommées dans les `<symbol>` par des classes `p-…` (groupes
`<g>` ajoutés, chemins scindés ; le dessin ne change pas, sauf `p-tourne`, page du livre invisible au repos).
`symbole(nom, true)` recopie le dessin en ligne (`svg.sym.sym-anime.sa-<nom>`) au lieu de l'appeler par `<use>`,
car les pièces d'un `<use>` ne sont pas atteignables par les sélecteurs de survol. Les règles ont pour déclencheur
`:is(.acc-rub:hover, .acc-rub:focus-visible, .acc-profil:hover, .acc-profil:focus-within, .ro-sym.actif)` ; chaque
animation joue une fois (0,7 à 1,3 s) ; dans la roue, `--d0` la retarde de 0,45 s. `prefers-reduced-motion` : rien.
Partout ailleurs (barre du haut, menu, pages), les symboles restent des `<use>` immobiles.

Animations : cartable (saut, fermoir relevé) ; pile de livres (chute et empilement) ; toque (lancer, pompon qui se
balance) ; loupe (balayage, les trois points s'allument) ; arbre (tronc, branche, sept feuilles de bas en haut) ;
livre (page tournée, lignes réécrites) ; feuille et crayon (le crayon retrace le paraphe) ; copies (celle du dessus
part, la suivante arrive) ; puzzle (le curseur balaie, le point suit la courbe : images clés calculées sur la
cloche de §67). Pour modifier un symbole, garder ses classes `p-…` ou adapter les règles `sa-…`.

## 71. Intercalaires des Activités sur téléphone (12 nov. 2026)

Demande de l'auteur : sur téléphone, les intercalaires de la rubrique Activités défilaient latéralement sans que rien
ne l'indique, et des groupes restaient cachés. Sous 640 px, `.activites-onglets` passe en `flex-wrap: wrap` et chaque
intercalaire s'étire (`flex: 1 1 auto`) : tous sont visibles, sur deux ou trois rangs. Noté aussi dans
`MEMO_atlas_activites.md` (navigation).

## 72. Téléphone : le fil de position sous les pastilles (12 nov. 2026)

Défaut signalé par l'auteur : sur téléphone, dans une théorie de l'édifice, le fil débordait de la pastille courante
(réduite à 30 px sous 420 px par une règle de §66 qui ne prévoyait pas de fil). Demande : afficher le fil sous les
pastilles. Sous 860 px, `.nav-rub` passe en `flex-wrap: wrap` ; quand un fil existe, `.nav-rub-cur` devient
`display: contents`, son lien porte la pastille colorée (symbole et nom ; symbole seul dans l'édifice sous 420 px,
pour laisser la place à Légende) et `.nav-rub-suite` occupe toute la ligne suivante (`order: 99; flex: 1 1 100%`).
Dans l'édifice, la navigation s'étend alors sur toute la largeur de la grille et le bouton Légende reste en haut à
droite (`align-self: start`). Au-dessus de 860 px, rien ne change (§66).

## 73. Le jardin de l'accueil (12 nov. 2026)

Idée de l'auteur, mise au point en plusieurs propositions : une bande animée entre le haut de l'accueil et « Par où
commencer ? ». Tout est dans `gabarit.html` : bloc `.acc-jardin` (un `<canvas>` décoratif, `aria-hidden`, et un
bouton de pause) inséré par `pageAccueil`, fonction `accueilJardin()` appelée avec `accueilFil` et `accueilRoue`.

**Scène.** Un jardinier mathématicien (π à la craie sur la blouse, chapeau en courbe en cloche, arrosoir qui verse
des symboles + × π = ∑) entre à gauche et s'arrête à intervalles réguliers pour arroser. À chaque arrêt pousse un
arbre : celui du symbole de l'édifice (mêmes tracés), aux feuilles des couleurs des rubriques (une dominante par
arbre), agitées par des rafales. L'arbre vit environ un tour : ses feuilles tombent une à une à partir de 40 % du
tour, puis le tronc s'efface (84 à 97 %), juste avant que le jardinier ne repasse et replante. Le sol se couvre
d'herbe sur son passage (touffes en éventail, brins isolés, petites plantes parfois fleuries, plages nues), qui fane
de même avant son retour. Le rouge n'est pas employé (réservé aux définitions, aux axiomes et au logo).

**Le labrador chocolat** suit son maître : trot, galop pour le rattraper, assis quand il arrose. Au hasard, il joue
dans l'herbe (salut de jeu, bonds), poursuit un symbole papillon (π ∑ ∞ √ ∫) en sautant, tourne après sa queue,
se frotte le dos contre un arbre, renifle un tronc, dépasse son maître et l'attend assis, ou s'assoit et regarde
ailleurs. Postures lissées, queue en trois tronçons qui ondulent, sauts en trois temps (élan, vol, réception), pas
réglé sur le chemin parcouru. La poursuite de la queue quitte un instant le profil (`dessinerRonde`) : le chien
s'enroule sur un cercle vu presque de profil (ellipse de rapport 0,22, demandé par l'auteur pour rester cohérent
avec la scène), avec un enroulement progressif (`rk`) à l'entrée et à la sortie ; étourdi, trois petits Σ tournent
au-dessus de sa tête.

**Mécanique.** Une seule horloge `tau` (état gardé dans `accueilJardin.etat`, la page étant redessinée), qui ne
tourne que si la bande est à l'écran (IntersectionObserver), l'onglet visible et la pause levée. Le jardinier, les
arbres et l'herbe sont des fonctions de `tau` (tirages reproductibles par tour) ; seul le chien a un état propre
(`E.chien`, abscisse cumulée `U`). Un tour dure environ 43 s sur ordinateur (un arbre tous les 130 px), une vingtaine
de secondes sur téléphone. Couleurs lues dans les variables CSS et relues au changement de thème ; le brun du chien
est fixé dans le code (clair et sombre). Si la largeur change, le jardin repart de zéro. `prefers-reduced-motion` :
une image fixe (jardin à tous les âges, jardinier et chien immobiles), pas de bouton.
`accueilJardin.variante = 'a'` redonne la première esquisse (jardinier simple, sans herbe ni chien), gardée dans le
code. `accJardin.ou()` et `accJardin.chien()` servent aux essais (forcer un état du chien, par exemple).

## 74. Partager depuis un groupe d'activités (12 nov. 2026)

Défaut signalé par l'auteur : depuis un groupe d'activités (Raisonner, Casse-têtes…), « Partager » donnait
l'adresse de toute la rubrique. `adressePartage()` ne connaissait que les activités, qui ont une page de lecture
(`/activites/<id>/`). Un groupe n'en a pas : l'adresse partagée est désormais celle de la page affichée,
`https://www.atlasjourdain.fr/#activites/<groupe>` (comme pour les exercices par niveau). L'aperçu dans une
messagerie est alors celui de l'accueil ; un aperçu propre au groupe demanderait une page de lecture par groupe
(`lecture-activites.mjs`, domaine Activités).

## 75. Mode sombre par défaut ; audit des adresses partagées et des aperçus (12 nov. 2026)

**Mode sombre par défaut** (demande de l'auteur) : voir MEMO_atlas.md §0 (ligne « Thème »). Modifiés : le script de
tête de `gabarit.html`, `themeEffectif()`, les libellés du bouton (« Passer en mode clair » / « Revenir au mode
sombre »), `THEME` et `theme-color` de `lecture.mjs`, `theme-color` de `rendu.mjs`, `identite/site.webmanifest`.

**Audit (demande de l'auteur).** Deux contrôles : les 5 057 pages de `site/` (titre, description, image d'aperçu) et
l'adresse que donne « Partager » pour chaque sorte de vue de l'application.
- Textes d'aperçu : chaque page de lecture a un titre et une description propres (un seul doublon de description,
  deux exercices de Seconde au même début d'énoncé). Rien de générique.
- Images d'aperçu : une par rubrique (`apercu-edifice`, `-cours`, `-exercices`, `-annales`, `-nouveautes`,
  `-a-propos`), aucune par page. **Les 53 pages d'Activités emploient l'image générale `apercu.png`** : il manque
  un `apercu-activites.png`.
- Adresses corrigées ce jour dans `adressePartage()` : la rubrique Index donnait `/index/`, page inexistante
  (erreur 404) → `#index` ; un terme du lexique donnait `/edifice/` → `#lexique/<terme>` ; les cours d'un niveau,
  les exercices d'une notion, une section d'À propos donnaient la rubrique entière → adresse « # » de la vue
  (règle générale : toute vue de rubrique sans page de lecture partage son adresse « # »).
- Restent non personnalisés : (a) toute adresse « # » ouvre la bonne page mais son aperçu en messagerie est celui
  de l'accueil (groupes d'activités, exercices par niveau ou par notion, cours par niveau, lexique, Index, sections
  d'À propos) ; (b) les filtres et recherches (banque d'exercices, moteur des annales) ne sont pas dans l'adresse :
  on partage la rubrique, pas la sélection.

## 76. Encart d'installation sur téléphone (12 nov. 2026)

Remarque de l'auteur : l'encart (« Installez ATLAS sur votre écran d'accueil… ») ne disait pas assez que le site
fonctionne alors comme une application. `appliEncart` reçoit maintenant un titre (`b.ae-titre`, « ATLAS existe aussi
en application »), une phrase de bénéfice (gratuite, sans App Store ou magasin d'applications, écran d'accueil,
plein écran) et, sur iPhone, le geste sur une ligne à part (`span.ae-geste`). Sur Android, le bouton « Installer »
est inchangé.

## 77. Images d'aperçu par page (12 nov. 2026)

Demande de l'auteur, après l'audit de §75 : une image d'aperçu propre à chaque lien. L'accueil, À propos, Nouveautés
et les pages mineures gardent leur image ; les Activités ont désormais leur image de rubrique
(`identite/apercu-activites.png`, ajoutée à `fabriquer-apercus.mjs`, qui accepte en 3e argument les rubriques à
refaire). Ont une image par page : les 70 cours, les 1 076 fiches de l'édifice, les 803 sujets d'annales, les
52 activités, et les 72 feuilles d'exercices (une image par feuille, partagée par la page de la feuille et par
celles de ses exercices : choix de l'auteur). Soit 2 073 images, 32 Mo.

**Dessin.** Celui des images de rubrique : bande de couleur, tuile au symbole de la rubrique, marque ATLAS, adresse.
S'y ajoutent une ligne de contexte en capitales (« Cours · Seconde · chapitre 1 », « Théorème · Espaces métriques
et normés », « Annales · X-ENS MP 2025 · Maths A », « Feuille d'exercices corrigés · Seconde », « Activité ·
Casse-têtes ») et le titre de la page, dont la taille suit la longueur (3 lignes, 4 pour les très longs intitulés
de bac). Pour une activité, la tuile porte sa vignette (celle du catalogue) et la bande prend la couleur de son
domaine ou de son groupe. Les capitales ne s'appliquent qu'aux lettres latines (β ne devient pas Β).

**Mécanique.**
- `page()` (lecture.mjs) reçoit un champ `apercu` : `{ cle, rub, sur, titre, sous?, couleur?, vignette? }` (format
  décrit dans `identite/apercus-commun.mjs`, qui calcule aussi l'empreinte d'une fiche). Fiches posées dans
  lecture.mjs (édifice, annales), lecture-cours.mjs (cours, feuilles) et lecture-activites.mjs (activités).
- La construction écrit la liste des fiches dans `construction/apercus.json`, copie `identite/apercus/` dans
  `site/apercus/`, et annonce « Images d'aperçu par page : N sur M » (plus « … à fabriquer » s'il en manque).
- Une page ne désigne son image que si `identite/apercus/empreintes.json` porte l'empreinte de sa fiche actuelle ;
  sinon elle garde l'image de sa rubrique. L'adresse de l'image porte `?v=<empreinte>` : une image refaite n'est
  pas confondue avec l'ancienne par les messageries.
- `identite/fabriquer-apercus-pages.mjs <polices> [--tout]` fabrique les images manquantes ou périmées (Playwright,
  une seule page réutilisée : 2 073 images en deux minutes), supprime celles qui n'ont plus de page, et réduit
  chaque image à 128 couleurs avec Pillow (≈ 15 Ko). Si le dessin change, incrémenter `VERSION_APERCU`.
- Règle pour toutes les conversations : MEMO_atlas.md §0, point 9.

Restent sur l'image de l'accueil : les adresses « # » (groupes d'activités, vues par niveau, lexique…), voir §75.
