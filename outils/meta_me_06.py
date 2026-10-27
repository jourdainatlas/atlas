"""Métadonnées proposées pour la feuille Maths expertes, chapitre 6 (applications des matrices)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'système', 'systèmes linéaires', ['v-matrices'], ['espace-matrices']),
    (r'inverse|inversible|\^\{-1\}', 'matrice inverse', ['v-determinant'], ['inversible']),
    (r'déterminant|\\det', 'déterminant', ['v-determinant'], ['determinant']),
    (r'transformation|translation|homothétie|symétrie|rotation', 'transformations du plan', ['v-applications'], []),
    (r'rotation', 'rotations', ['v-applications', 'cx-pi'], []),
    (r'graphe|sommet|arête|arc', 'graphes', [], []),
    (r'adjacence', "matrice d'adjacence", ['v-matrices'], []),
    (r'chaîne|chemin|circuit|trajet', 'chaînes et chemins', [], []),
    (r'parabole|cercle|polynôme|interpolation', 'interpolation', [], []),
    (r'complexe', 'complexes et matrices', ['c-calcul'], []),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'\\cos|\\sin|trigonom', 'trigonométrie', ['cx-pi'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
