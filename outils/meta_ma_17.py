"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 17 (groupe symétrique et déterminants)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 17, 'groupe symétrique', ['v-permutations'], ['groupe-symetrique']),
    (18, 24, 'formes multilinéaires alternées', ['v-formes-alternees'], ['forme-alternee']),
    (25, 32, "déterminant d'une matrice", ['v-determinant', 'v-det-matrice'], ['determinant']),
    (33, 49, 'calcul des déterminants', ['v-det-matrice', 'v-comatrice'], ['determinant']),
    (50, 56, 'comatrice et Cramer', ['v-comatrice'], ['comatrice']),
]
R = [
    (r'transposition', 'transpositions', ['v-permutations'], ['transposition']),
    (r'cycle|orbite', 'cycles', ['v-permutations'], []),
    (r'signature|\\varepsilon\(\\sigma|\\sgn|inversion', 'signature', ['v-permutations'], ['signature-permutation']),
    (r'altern', 'groupe alterné', ['v-permutations'], ['groupe-alterne']),
    (r'ordre d|engendr|générat', 'générateurs du groupe symétrique', ['v-permutations', 'gf-cycliques'], []),
    (r'n-linéaire|multilinéaire|bilinéaire', 'formes multilinéaires', ['v-formes-alternees'], ['forme-alternee']),
    (r'\\det|déterminant', 'déterminants', ['v-det-matrice'], ['determinant']),
    (r'vandermonde', 'déterminant de Vandermonde', ['v-comatrice', 'pol-racines'], []),
    (r'comatrice|cofacteur|\\com', 'comatrice', ['v-comatrice'], ['comatrice', 'cofacteur']),
    (r'cramer', 'formules de Cramer', ['v-comatrice'], []),
    (r'orient', 'orientation', ['v-formes-alternees'], ['orientation']),
    (r'inversible|\\gl', 'matrices inversibles', ['v-det-matrice'], ['matrice-inversible']),
    (r'triangulaire|blocs?', 'matrices triangulaires par blocs', ['v-det-matrice'], []),
    (r'polynôme|\\mathbb\{[kr]\}\[x\]', 'polynômes et déterminants', ['pol-anneau'], []),
    (r'récurren|tridiagonal', 'déterminants récurrents', ['v-comatrice', 'n-recurrence'], []),
]
FOND = ['v-det']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
