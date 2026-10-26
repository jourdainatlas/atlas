"""Métadonnées proposées pour la feuille Terminale, chapitre 10 (loi des grands nombres)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'échantillon', 'échantillon', ['p-independance'], ['independance']),
    (r's_\{?n|s_\{?\d|somme', 'somme de variables aléatoires', ['p-esperance'], []),
    (r'm_\{?n|m_\{?\d|moyenne', 'moyenne empirique', ['p-esperance'], []),
    (r'espérance|\be\(', 'espérance', ['p-esperance'], ['esperance']),
    (r'variance|v\(|écart-type|\\sigma', 'variance', ['p-esperance'], []),
    (r'markov', 'inégalité de Markov', ['p-esperance'], []),
    (r'bienaymé|tchebychev|\|x\s*-', 'inégalité de Bienaymé-Tchebychev', ['p-esperance'], []),
    (r'concentration|\|m_\{?n', 'inégalité de concentration', ['p-loi-faible'], []),
    (r'loi faible|grands nombres|tend vers \+\\infty|limite', 'loi faible des grands nombres', ['p-loi-faible'], []),
    (r'bernoulli|fréquence', 'loi de Bernoulli', ['p-variables'], ['variable-aleatoire']),
    (r'binomiale', 'loi binomiale', ['p-variables'], []),
    (r'taille d\'échantillon|nombre minimal|plus petite taille|combien de', "taille d'échantillon", [], []),
    (r'sondage|population|proportion', 'sondage', [], []),
    (r'dé |dés|pièce', 'dés et pièces', [], []),
    (r'\\pi|monte', 'méthode de Monte-Carlo', [], []),
    (r'assurance|usine|machine|production|sachets|tiges', 'modélisation', [], []),
    (r'permutation|record|anniversaire|ehrenfest|marche', 'variables indicatrices', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
