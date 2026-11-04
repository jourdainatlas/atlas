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
date que le JSON refuse ; `rubrique` edifice | cours | exercices | annales | site ; `titre` ; `texte` ;
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
des encadrés (cartes des rubriques, miniature de l'édifice, étapes de « Comment les rubriques se
répondent », dernières nouveautés) ; profils de « Par où commencer ? » en dégradé des rubriques visées
(classes `p-lycee`, `p-prepa`, `p-concours`, `p-curiosite`). Menu : barre de couleur à gauche de chaque
entrée ; la rubrique courante sur fond `--trame` (elle avait une barre rouge, le rouge étant réservé).

