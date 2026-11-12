"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 22 (fonctions de deux variables)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, 'ouverts et continuité', ['tr-ouverts', 'c-sequentielle'], ['ouvert', 'boule-ouverte']),
    (5, 13, 'dérivées partielles', ['gd-differentielle'], ['derivee-partielle']),
    (14, 22, 'règle de la chaîne', ['gd-differentielle', 'gd-classe-ck'], ['gradient']),
    (23, 33, 'extrema', ['fq-points-critiques'], ['point-critique', 'extremum-local']),
]
R = [
    (r'ouvert|boule', 'ouverts du plan', ['tr-ouverts'], ['ouvert']),
    (r'continu', 'continuité', ['c-sequentielle'], []),
    (r'\\pd|dérivée partielle|\\partial', 'dérivées partielles', ['gd-differentielle'], ['derivee-partielle']),
    (r'classe \$\\cc\^\{1\}|\\cc\^\{1\}|classe \$\\mathcal\{c\}', 'fonctions de classe C1', ['gd-classe-ck'], []),
    (r'gradient|\\grad|\\nabla', 'gradient', ['gd-differentielle'], ['gradient']),
    (r'plan tangent|tangent', 'plan tangent', ['gd-differentielle'], ['plan-tangent']),
    (r'ligne de niveau|niveau', 'lignes de niveau', ['gd-differentielle'], []),
    (r'polaire', 'coordonnées polaires', ['gd-differentielle'], []),
    (r'équation aux dérivées partielles|edp|homogène', 'équations aux dérivées partielles', ['gd-classe-ck'], []),
    (r'extremum|maximum|minimum|point critique|point col', 'extrema', ['fq-points-critiques'], ['point-critique', 'extremum-local']),
    (r'triangle|aire|géométri', 'problèmes géométriques d\'optimisation', ['fq-points-critiques'], []),
    (r'probabilit|dés\b', 'optimisation et probabilités', ['p-espace', 'fq-points-critiques'], []),
    (r'loi de groupe|\\ast', 'lois de groupe différentiables', ['a-groupe', 'gd-differentielle'], []),
    (r'courbe|\\gamma|implicite', 'courbes définies implicitement', ['gd-differentielle'], []),
]
FOND = ['gd-differentielle']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
