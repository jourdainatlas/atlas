"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 4 (dérivation)."""
from meta_commun import types_exercice, appliquer

R = [
    ("taux de variation|taux d\\'accroissement", 'taux de variation', ['ar-deriv'], ['derivable']),
    ("nombre dérivé|f\\'\\([0-9a-]|dérivable en", 'nombre dérivé', ['ar-deriv'], ['derivable']),
    ('tangente', 'tangente', ['ar-deriv'], []),
    ("dérivée|f\\'|dériver", 'fonction dérivée', ['ar-deriv'], ['derivable']),
    ('produit|quotient|uv|\\\\dfrac\\{u\\}\\{v\\}', 'produit et quotient', ['ar-deriv'], []),
    ('sqrt|racine carrée', 'racine carrée', [], []),
    ('variation|croissante|décroissante', 'variations', ['ar-deriv'], []),
    ('extremum|maximum|minimum', 'extremums', ['ar-deriv'], []),
    ('inégalité|position relative|au-dessus|au-dessous', 'position relative', [], []),
    ('optimis|aire|volume|coût|bénéfice|vitesse', 'optimisation', [], []),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
