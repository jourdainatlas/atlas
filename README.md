# ATLAS

Atlas interactif des dépendances entre les théories mathématiques, de la logique
du premier ordre aux grandes théories, au niveau Master. Chaque bulle du graphe est
une théorie ; certaines s'ouvrent sur un graphe intérieur, jusqu'aux définitions et
aux théorèmes démontrés. Les termes soulignés affichent leur définition au survol.

## Organisation

| Fichier | Rôle |
|---|---|
| `contenu/edifice.yaml` | le graphe général (niveau 0) |
| `contenu/<graphe>.yaml` | un graphe intérieur par fichier |
| `contenu/lexique.yaml` | les définitions affichées au survol |
| `construire.py` | vérifie le contenu et dispose les graphes |
| `rendu.mjs` | compose les formules (KaTeX) et assemble la page |
| `gabarit.html` | l'apparence et le comportement de la page |
| `.github/workflows/publier.yml` | la publication automatique sur GitHub Pages |
| `LICENCE.md` | la licence du contenu et les crédits |

On ne modifie en principe que le dossier `contenu/`. À chaque modification
enregistrée sur la branche `main`, GitHub reconstruit et republie le site. Si une
vérification échoue, rien n'est publié et l'erreur s'affiche dans l'onglet *Actions*.

## Syntaxe des fiches

- `$...$` et `$$...$$` : formules LaTeX ;
- `[[id]]` ou `[[id|texte affiché]]` : terme du lexique ;
- `{{id|texte}}` : lien vers un autre nœud ;
- `**gras**`, `*italique*` ; une ligne vide sépare deux paragraphes.

## Construire sur un ordinateur

```sh
pip install -r requirements.txt
npm ci
sh construire.sh        # écrit site/index.html
```

## Licence

Le contenu de l'atlas est sous licence
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr) ; le code reste
sous tous droits réservés. Détails et composants tiers : voir `LICENCE.md`.
