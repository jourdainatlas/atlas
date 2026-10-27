"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 2 (suites)."""
from meta_commun import types_exercice, appliquer

R = [
    ('suite', 'suites', ['ar-suites'], ['suite']),
    ('récurrence|u_\\{n\\+1\\}=', 'suite définie par récurrence', ['n-recdef'], []),
    ('u_n ?= ?|u_\\{n\\} ?= ?f|forme explicite|explicite', 'forme explicite', ['ar-suites'], []),
    ('arithmétique', 'suite arithmétique', ['ar-suites'], []),
    ('géométrique', 'suite géométrique', ['ar-suites'], []),
    ('raison', 'raison', [], []),
    ('somme|\\\\sum|\\+ ?\\\\cdots ?\\+|\\+ ?\\\\dots ?\\+', 'sommes de termes', ['n-sommes'], []),
    ('croissante|décroissante|monoton|sens de variation|variations', 'sens de variation', ['ar-suites'], []),
    ('conjectur|limite|tend vers', "comportement à l'infini", [], []),
    ('auxiliaire|v_n ?= ?u_n|v_\\{n\\} ?= ?u_\\{n\\}', 'suite auxiliaire', [], []),
    ('représent|graphique|escalier|toile', 'représentation graphique', [], []),
    ('pourcentage|%|intérêts?|capital|population|placement', 'évolution en pourcentage', [], []),
    ('python|algorithme|tableur', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
