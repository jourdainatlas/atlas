"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 5 (probabilités conditionnelles)."""
from meta_commun import types_exercice, appliquer

R = [
    ('probabilité', 'probabilités', ['p-espace'], ['espace-probabilise']),
    ('p_\\{?[a-z]|conditionnel|sachant', 'probabilité conditionnelle', ['p-espace'], ['espace-probabilise']),
    ('arbre', 'arbre pondéré', ['p-espace'], []),
    ('probabilités totales|partition', 'probabilités totales', ['p-espace'], []),
    ('double entrée|tableau', 'tableau à double entrée', [], []),
    ('indépendan', 'indépendance', ['p-independance'], ['independance']),
    ('variable aléatoire', 'variable aléatoire', ['p-variables'], ['variable-aleatoire']),
    ('loi de probabilité|la loi de', 'loi de probabilité', ['p-variables'], ['loi-variable']),
    ('espérance|\\be\\(', 'espérance', ['p-esperance'], ['esperance']),
    ('variance|v\\(x\\)', 'variance', ['p-esperance'], []),
    ('écart-type|écart type|\\\\sigma', 'écart-type', ['p-esperance'], []),
    ('équitable|gain|mise', 'jeu et gain', ['p-esperance'], []),
    ('test|malade|dépistage|positif', 'test de dépistage', [], []),
    ('urne|boule', 'urne', [], []),
    ('python|algorithme|simulation', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
