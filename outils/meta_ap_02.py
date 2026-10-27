"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 02 (applications)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'application|sagittal|diagramme', 'applications', ['r-produit', 'rel'], ['application']),
    (r'égales|égalité de deux applications', 'égalité de deux applications', ['rel'], ['application']),
    (r'\\circ|compos', 'composition', ['r-composition'], []),
    (r'involutive', 'involutions', ['r-inverses'], []),
    (r'injecti', 'injectivité', ['r-injections'], ['injection']),
    (r'surjecti', 'surjectivité', ['r-injections'], ['surjection']),
    (r'bijecti', 'bijectivité', ['r-injections'], ['bijection']),
    (r'réciproque|f\^\{-1\} \\circ|\^\{-1\}=', 'bijection réciproque', ['r-inverses'], ['bijection']),
    (r'f\\big\(\[|image directe|f\(a_\{1\}|f\(\\z\)|g\\big\(\[', 'image directe', ['r-images'], ['image-directe']),
    (r'\^\{-1\}\\big\(|image réciproque|\^\{-1\}\(b', 'image réciproque', ['r-images'], ['image-reciproque']),
    (r'indicatrice', 'fonctions indicatrices', ['zf-parties'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
