"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 05 (structures algébriques)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'anneau', 'anneaux', ['a-anneau'], ['anneau']),
    (r'sous-anneau', 'sous-anneaux', ['a-morph-anneau'], []),
    (r'diviseur de zéro|diviseurs de zéro|nilpotent|boole', 'diviseurs de zéro et nilpotents', ['a-anneau'], ['anneau-integre']),
    (r'inversible', 'éléments inversibles', ['a-anneau'], ['inversible']),
    (r'\\z/|\\cl\{', 'anneaux Z/nZ', ['z-zn'], ['anneau-zn']),
    (r'bézout|premiers entre eux', 'théorème de Bézout', ['z-bezout'], []),
    (r'corps', 'corps', ['a-corps'], ['corps']),
    (r'morphisme', "morphismes d'anneaux", ['a-morph-anneau'], []),
    (r'noyau|\\ker', 'noyau et idéal', ['a-ideal'], ['ideal']),
    (r'gauss|\\z\[\\mathrm\{i\}\]|\\q\[', 'anneaux de nombres', ['a-anneau'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
