"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 08 (dimension finie)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'dimension|\\dim', 'dimension', ['v-dimension'], ['dimension']),
    (r'base', 'bases', ['v-libre'], ['base-vectorielle']),
    (r'libre|génératrice', 'familles libres et génératrices', ['v-libre', 'v-echange'], []),
    (r'sous-espace', 'sous-espaces et dimension', ['v-dimension'], []),
    (r'grassmann|\\cap', 'formule de Grassmann', ['v-dimension', 'v-somme-directe'], []),
    (r'supplémentaire|\\oplus', 'supplémentaires', ['v-somme-directe'], ['supplementaire']),
    (r'rang|\\rg', 'rang', ['v-rang'], ['rang']),
    (r'théorème du rang|\\ker', 'théorème du rang', ['v-rang'], []),
    (r'hyperplan|forme linéaire', 'hyperplans', ['v-rang'], []),
    (r'polynôme|\[x\]', 'espaces de polynômes', ['z-polynomes'], []),
    (r'interpolation|lagrange|a_\{0\}', 'interpolation', ['v-rang'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
