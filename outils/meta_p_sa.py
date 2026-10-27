"""Métadonnées proposées pour la feuille de Première spécialité, « sommes de termes d'une suite arithmétique »."""
from meta_commun import types_exercice, appliquer

R = [
    ('somme|\\\\sum|\\+ ?\\\\cdots ?\\+|\\+ ?\\\\dots ?\\+', 'sommes de termes', ['n-sommes'], []),
    ('arithmétique', 'suite arithmétique', ['ar-suites'], ['suite']),
    ('nombre de termes', 'nombre de termes', [], []),
    ('1 ?\\+ ?2 ?\\+|premiers entiers|gauss', 'somme des premiers entiers', ['n-sommes'], []),
    ('impairs|pairs', 'entiers pairs et impairs', [], []),
    ('récurrence|u_\\{n\\+1\\}', 'suite définie par récurrence', ['n-recdef'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {7: (['suite arithmétique', 'sommes de termes'], ['ar-suites', 'n-sommes'], ['suite'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
