"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 7 (produit scalaire)."""
from meta_commun import types_exercice, appliquer

R = [
    ('produit scalaire|cdot', 'produit scalaire', ['f-hilbert'], []),
    ('norme|\\\\\\||longueur|distance', 'norme', ['gd-normes'], ['norme']),
    ('projeté|projection', 'projeté orthogonal', ['f-hilbert'], []),
    ('\\\\cos|angle', 'angle et cosinus', [], []),
    ('orthogon|perpendicul', 'orthogonalité', ['f-hilbert'], []),
    ("coordonnées|xx\\'|repère orthonormé", 'expression analytique', ['f-hilbert'], []),
    ('al-kashi|kashi', "théorème d'Al-Kashi", [], []),
    ('médiane', 'théorème de la médiane', [], []),
    ('polarisation|identités? remarquables?', 'identités de polarisation', ['f-hilbert'], []),
    ('vecteur normal|normal', 'vecteur normal', ['f-hilbert'], []),
    ('droite|équation cartésienne', 'équations de droites', [], []),
    ('cercle', 'équations de cercles', ['gd-normes'], ['norme']),
    ('ensemble des points|lieu', 'lignes de niveau', [], []),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
