"""Métadonnées proposées pour la feuille Maths expertes, chapitre 8 (configurations géométriques)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'racines? \$?n|racines? (huitièmes|cubiques|n-ièmes)|\\mathbb\{u\}|z\^\{6\}=1|z\^\{n\}', "racines de l'unité", ['cx-exponentielle', 'a-sous-groupe'], []),
    (r'résoudre|équation', 'équations dans ℂ', ['c-racines-carrees'], ['nombre-complexe']),
    (r'affixe|vecteur', 'affixe d\'un vecteur', ['c-calcul'], []),
    (r'\|z|distance|longueur|module', 'module et distances', ['c-calcul'], ['module-complexe']),
    (r'ensemble des points|ensembles', 'ensembles de points', ['c-calcul'], []),
    (r'cercle|médiatrice', 'cercles et médiatrices', ['c-calcul'], []),
    (r'align|parallèle|perpendiculaire|orthogon', 'alignement et orthogonalité', ['c-calcul'], []),
    (r'triangle|carré|losange|parallélogramme|rectangle|quadrilatère|polygone|octogone', 'nature de figures', [], []),
    (r'argument|angle|\\arg', 'angles orientés', ['cx-pi'], []),
    (r'orthocentre|hauteur|médiane|euler|gravité', 'droites remarquables du triangle', [], []),
    (r'ptolémée|inégalité', 'inégalités', [], []),
    (r'\\bj\b|le nombre \$j', 'le nombre j', ['cx-exponentielle'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {19: (['racines carrées complexes'], ['c-racines-carrees', 'cx-pi'], []), 20: (['réel ou imaginaire pur'], ['c-calcul'], []), 28: (['inégalité triangulaire'], ['c-calcul'], ['module-complexe'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
