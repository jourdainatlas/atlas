"""Métadonnées proposées pour la feuille de Seconde, chapitre 8 (équations cartésiennes)."""
from meta_commun import types_exercice, appliquer

R = [
    ('vecteur directeur', 'vecteur directeur', ['v-libre'], ['famille-libre']),
    ('équation cartésienne|ax\\+by', 'équation cartésienne', ['v-espace'], []),
    ('équation réduite|y=mx|coefficient directeur|ordonnée à l.origine', 'équation réduite', ['v-espace'], []),
    ('tracer|graphique|lecture', 'lecture graphique', ['v-espace'], []),
    ('sécantes|parallèles|ab.-a.b', 'positions relatives', ['v-determinant'], ['determinant']),
    ('système', "systèmes d'équations", ['v-determinant'], ['determinant']),
    ('colinéaire', 'colinéarité', ['v-libre'], []),
    ('prix|forfait|euro|place', 'modélisation', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
