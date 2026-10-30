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

