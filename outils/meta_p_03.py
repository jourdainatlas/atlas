"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 3 (géométrie cartésienne)."""
from meta_commun import types_exercice, appliquer

R = [
    ('vecteur|overrightarrow', 'vecteurs', ['v-espace'], ['espace-vectoriel']),
    ('chasles', 'relation de Chasles', ['v-espace'], []),
    ('coordonnées', 'coordonnées', ['v-espace'], []),
    ('milieu', 'milieu', [], []),
    ('norme|distance|longueur|\\\\\\|', 'norme et distance', [], []),
    ('colinéa|déterminant|\\\\det', 'colinéarité', ['v-libre', 'v-determinant'], ['famille-libre']),
    ('align', 'alignement', ['v-libre'], []),
    ('parallèle|parallélisme', 'parallélisme', ['v-libre'], []),
    ('parallélogramme', 'parallélogramme', [], []),
    ('équation (cartésienne|réduite)|droite', 'équations de droite', ['v-espace'], []),
    ('vecteur directeur|coefficient directeur', 'vecteur directeur', [], []),
    ('système', "systèmes d'équations", ['v-determinant'], []),
    ("intersection|sécantes|point d\\'intersection", 'intersection de droites', [], []),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {33: (['systèmes d\'équations', 'identité remarquable'], ['v-determinant'], [])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
