# Adresse racine https://jourdainatlas.github.io/

GitHub sert l'adresse racine d'un compte à partir d'un dépôt qui porte exactement le nom
`jourdainatlas.github.io`. Ce dossier contient la seule page dont ce dépôt a besoin : elle renvoie
aussitôt vers l'accueil du site (https://jourdainatlas.github.io/atlas/), en conservant une éventuelle
ancre, et donne le même aperçu que le site dans les messageries.

Mise en place (une fois) :
1. Sur github.com, créer un dépôt public nommé `jourdainatlas.github.io` (compte jourdainatlas).
2. Y déposer ce fichier `index.html` (bouton « Add file » → « Upload files »).
3. Dans Settings → Pages, vérifier que la source est « Deploy from a branch », branche `main`, dossier `/ (root)`.

Le site lui-même reste dans le dépôt `atlas` et continue d'être publié à l'adresse /atlas/.
