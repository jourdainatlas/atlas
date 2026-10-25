"""Métadonnées proposées pour la feuille Terminale, chapitre 2 (probabilités)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'arbre', 'arbre pondéré', ['p-espace'], ['espace-probabilise']),
    (r'p_\{?[a-z]', 'probabilité conditionnelle', ['p-espace'], ['espace-probabilise']),
    (r'probabilités totales', 'probabilités totales', ['p-espace'], []),
    (r'indépendan', 'indépendance', ['p-independance'], ['independance']),
    (r'variable aléatoire', 'variable aléatoire', ['p-variables'], ['variable-aleatoire']),
    (r'loi de probabilité|loi de \$x|la loi de', 'loi de probabilité', ['p-variables'], ['loi-variable']),
    (r'espérance|\be\(', 'espérance', ['p-esperance'], ['esperance']),
    (r'variance|v\(x\)', 'variance', ['p-esperance'], []),
    (r'écart-type|écart type|\\sigma', 'écart-type', ['p-esperance'], []),
    (r'équitable', 'jeu équitable', ['p-esperance'], []),
    (r'linéarité|e\(ax|e\(3x|e\(x\+y|e\(-', "linéarité de l'espérance", ['p-esperance'], []),
    (r'bernoulli', 'épreuve de Bernoulli', ['p-variables'], []),
    (r'schéma de bernoulli|répétition|répète|identiques et indépendantes', 'schéma de Bernoulli', ['p-independance'], []),
    (r'pmatrix|coefficient binomial|coefficients binomiaux|combinaison', 'coefficient binomial', [], []),
    (r'pascal', 'triangle de Pascal', [], []),
    (r'factorielle|n!', 'factorielle', [], []),
    (r'mathcal\{b\}|loi binomiale', 'loi binomiale', ['p-variables'], ['loi-variable']),
    (r'au moins un|au moins une', 'au moins un succès', [], []),
    (r'seuil|plus petit entier|le plus petit|minimal', 'seuil', [], []),
    (r'sans remise', 'tirage sans remise', [], []),
    (r'avec remise', 'tirage avec remise', [], []),
    (r'\b(un|deux|trois|le|les|des|du|ce|ces|chaque) dés?\b', 'dés', [], []),
    (r'urne|boule', 'urne', [], []),
    (r'```python|python', 'Python', [], []),
    (r'\bmode\b|plus probable', 'valeur la plus probable', [], []),
    (r'inégalité|majorer|majoration', 'inégalité', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, enonce + '\n' + corrige)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
