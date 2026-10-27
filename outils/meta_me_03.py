"""Métadonnées proposées pour la feuille Maths expertes, chapitre 3 (matrices)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'matrice|pmatrix', 'matrices', ['v-matrices'], ['espace-matrices']),
    (r'calcul|somme|produit|\\times', 'opérations matricielles', ['v-matrices'], []),
    (r'puissance|\^\{n\}|\^\{2025\}|\^\{2026\}|récurrence', "puissances d'une matrice", ['v-matrices'], []),
    (r'diagonal', 'matrices diagonales', ['v-matrices'], []),
    (r'inversible|inverse|\^\{-1\}', 'inverse', ['v-determinant'], ['inversible']),
    (r'déterminant|\\det', 'déterminant', ['v-determinant'], ['determinant']),
    (r'commut|ab=ba', 'commutation', [], []),
    (r'nilpotent|n\^\{2\}|n\^\{3\}', 'matrices nilpotentes', [], []),
    (r'diagonalis|matrice de passage|p\^\{-1\}ap', 'diagonalisation', ['v-matrices'], []),
    (r'trace|cayley', 'trace et Cayley-Hamilton', ['v-determinant'], []),
    (r'complexe|z\\overline', 'complexes et matrices', ['c-calcul'], []),
    (r'fibonacci|suite', 'suites récurrentes', [], []),
    (r'binôme', 'binôme de Newton', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
