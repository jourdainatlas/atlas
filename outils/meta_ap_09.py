"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 09 (matrices)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'matrice|pmatrix|\\mdd', 'matrices', ['v-matrices'], ['espace-matrices']),
    (r'produit|calculer|\\times', 'produit matriciel', ['v-matrices'], []),
    (r'nilpotente|binôme|\^\{k\}|\^\{n\}', "puissances d'une matrice", ['v-matrices'], []),
    (r'application linéaire|\\mat|base canonique', "matrice d'une application linéaire", ['v-matrices', 'v-applications'], []),
    (r'inversible|inverse|\^\{-1\}', 'matrices inversibles', ['v-matrices'], ['inversible', 'groupe-lineaire']),
    (r'pivot|opération|augmentée', 'pivot de Gauss', ['v-matrices'], []),
    (r'transpos|\\tr\{|symétrique|antisymétrique', 'transposition', ['v-matrices'], []),
    (r'triangulaire|diagonal', 'matrices remarquables', ['v-matrices'], []),
    (r'ad-bc', 'déterminant 2×2', ['v-determinant'], []),
    (r'sous-anneau|anneau', 'anneau des matrices', ['a-anneau'], []),
    (r'rotation|\\cos', 'rotations', ['v-matrices'], []),
    (r'suite', 'suites récurrentes', [], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
