"""Métadonnées proposées pour la feuille de Seconde, chapitre 3 (probabilités)."""
from meta_commun import types_exercice, appliquer

R = [
    ('univers|issue|expérience aléatoire', 'univers et issues', ['p-espace'], ['espace-probabilise']),
    ('événement|contraire|incompatible|\\\\cap|\\\\cup', 'événements', ['p-espace'], []),
    ('loi de probabilité|dé truqué|fréquence', 'loi de probabilité', ['p-espace'], ['espace-probabilise']),
    ('équiprobab|au hasard|équilibré', 'équiprobabilité', ['p-espace'], []),
    ('arbre', 'arbre pondéré', ['p-espace'], []),
    ('tableau à double entrée|double entrée', 'tableau à double entrée', [], []),
    ('sachant|conditionnel|prob_\\{', 'probabilité conditionnelle', ['p-espace'], ['espace-probabilise']),
    ('indépendan', 'indépendance', ['p-independance'], ['independance']),
    ('urne|boule|carte|dé', 'tirages', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
