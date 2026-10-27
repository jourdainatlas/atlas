"""Métadonnées proposées pour la feuille de Seconde, chapitre 5 (géométrie cartésienne)."""
from meta_commun import types_exercice, appliquer

R = [
    ('repère', 'repères', ['v-espace'], []),
    ('coordonnées', 'coordonnées', ['v-espace'], ['couple']),
    ('milieu', 'milieu', ['v-espace'], []),
    ('distance|longueur|\\bab=|isocèle|rectangle', 'distance', ['gd-normes'], ['norme']),
    ('parallélogramme|losange|carré', 'quadrilatères', [], []),
    ('symétrique', 'symétrique', [], []),
    ('cercle|médiatrice|équidistant', 'cercle et médiatrice', ['gd-normes'], []),
    ('python|def |```', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
