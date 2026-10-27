"""Métadonnées proposées pour la feuille de Seconde, chapitre 2 (calcul littéral)."""
from meta_commun import types_exercice, appliquer

R = [
    ('valeur numérique|remplace|pour \\$x=', 'valeur numérique', ['z-anneau'], []),
    ('programme de calcul|choisir un nombre', 'programme de calcul', [], []),
    ('développer|distributivité|réduire', 'développement', ['z-anneau'], ['anneau']),
    ('identité remarquable|a\\^2|\\(a\\+b\\)', 'identités remarquables', ['z-anneau'], ['anneau']),
    ('factoris|facteur commun', 'factorisation', ['z-polynomes'], ['anneau-polynomes']),
    ('valeurs? interdite|rationnelle|quotient unique|simplifier', 'expressions rationnelles', ['q-construction'], []),
    ('aire|rectangle|carré de côté', 'interprétation géométrique', [], []),
    ('entier|consécutifs|multiple', 'arithmétique', ['z-anneau'], []),
    ('somme|produit', 'somme et produit', ['z-anneau'], ['anneau']),
    ('\\)\\^\\{?2', "carré d'une expression", ['z-anneau'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
