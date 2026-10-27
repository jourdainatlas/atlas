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

**Points ouverts.** Année sabbatique 2014-2015 et projet de thèse,
laissés de côté en attendant l'avis de l'auteur.
