"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 8 (fonction exponentielle)."""
from meta_commun import types_exercice, appliquer

R = [
    ('exp|\\\\mathrm\\{e\\}|e\\^', 'fonction exponentielle', ['cx-exponentielle'], ['exponentielle']),
    ('propriétés? algébrique|e\\^\\{a\\+b\\}|simplifier', 'propriétés algébriques', ['cx-exponentielle'], []),
    ('équation|inéquation', 'équations et inéquations', [], []),
    ("dériv|f\\'", 'dérivation', ['ar-deriv'], ['derivable']),
    ('variation|croissante|décroissante', 'variations', ['ar-deriv'], []),
    ('tangente', 'tangente', ['ar-deriv'], []),
    ('suite|\\(e\\^\\{na\\}\\)|u_n', 'suites géométriques', ['ar-suites'], []),
    ('convex|position relative|inégalité', 'inégalités', [], []),
    ('e\\^\\{-?kx\\}|e\\^\\{kt\\}|e\\^\\{-kt\\}|décroissance|radioactiv|refroidissement|population|médicament', 'modélisation', [], []),
    ("euler|méthode d\\'euler", "méthode d'Euler", [], []),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
