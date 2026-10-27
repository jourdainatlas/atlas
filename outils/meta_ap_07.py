"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 07 (endomorphismes)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'linéaire', 'applications linéaires', ['v-applications'], ['application-lineaire']),
    (r'endomorphisme|\\lc\(', 'endomorphismes', ['v-applications'], []),
    (r'forme linéaire', 'formes linéaires', ['v-applications'], []),
    (r'noyau|\\ker', 'noyau', ['v-applications'], ['noyau']),
    (r'\\img', 'image', ['v-applications'], []),
    (r'injecti|surjecti|bijecti', 'injectivité et surjectivité', ['v-applications'], []),
    (r'automorphisme|\\gl|f\^\{-1\}', 'automorphismes', ['v-applications', 'a-groupe'], ['isomorphisme', 'groupe-lineaire']),
    (r'\\circ', 'composition', ['a-anneau'], []),
    (r'projecteur', 'projecteurs', ['v-somme-directe'], ['supplementaire']),
    (r'symétrie', 'symétries', ['v-somme-directe'], []),
    (r'rotation|homothétie', 'rotations et homothéties', ['v-applications'], []),
    (r'décalage|dérivation', 'exemples en dimension infinie', ['v-applications'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
