"""Métadonnées proposées pour la feuille de Seconde, chapitre 11 (statistiques)."""
from meta_commun import types_exercice, appliquer

R = [
    ('population|individu|caractère|effectif|fréquence', 'vocabulaire statistique', ['n-sommes'], []),
    ('moyenne', 'moyenne', ['p-esperance'], ['esperance']),
    ('coefficient|pondérée', 'moyenne pondérée', ['n-sommes'], []),
    ('médiane', 'médiane', ['p-variables'], []),
    ('quartile|q_\\{1\\}|interquartile', 'quartiles', ['p-variables'], []),
    ('étendue', 'étendue', ['p-variables'], []),
    ('boîte|boite', 'diagramme en boîte', ['p-variables'], []),
    ('bâtons|diagramme', 'représentations graphiques', [], []),
    ('salaire|euro|prix', 'contexte économique', ['p-esperance'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
