"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 04 (morphismes)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'morphisme', 'morphismes de groupes', ['a-morphisme'], ['morphisme-groupes']),
    (r'isomorph', 'isomorphismes', ['a-morphisme'], ['isomorphisme']),
    (r'automorphisme|endomorphisme|aut\(', 'endomorphismes et automorphismes', ['a-morphisme'], []),
    (r'noyau|\\ker', 'noyau', ['a-morphisme'], ['noyau']),
    (r'\\img|image', 'image', ['a-morphisme'], []),
    (r'injecti|surjecti', 'injectivité et surjectivité', ['r-injections'], []),
    (r'sous-groupe', 'sous-groupes', ['a-sous-groupe'], ['sous-groupe']),
    (r'abélien', 'groupes abéliens', ['a-groupe'], []),
    (r'ordre|engendré', 'ordre d\'un élément', ['z-ideaux'], []),
    (r'\\e\^\{x\}|\\ln', 'exponentielle et logarithme', [], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
