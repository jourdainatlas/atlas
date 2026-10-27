"""Métadonnées proposées pour la feuille Maths expertes, chapitre 9 (chaînes de Markov)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'graphe', 'graphes probabilistes', [], []),
    (r'matrice de transition|stochastique', 'matrice de transition', ['v-matrices'], ['espace-matrices']),
    (r'markov', 'chaînes de Markov', ['p-variables', 'p-espace'], ['variable-aleatoire']),
    (r'probabilité|p_\{', 'probabilités conditionnelles', ['p-espace'], ['espace-probabilise']),
    (r'distribution|\\pi_|répartition', 'distributions', ['p-variables'], []),
    (r'invariante|stable', 'distribution invariante', ['p-variables'], []),
    (r'\^\{n\}|\^\{20\}|puissance|p\^\{2\}', 'puissances de matrices', ['v-matrices'], []),
    (r'limite|converg', 'convergence', [], []),
    (r'suite|géométrique|récurrence', 'suites', ['n-recurrence'], []),
    (r'arbre', 'arbres pondérés', ['p-espace'], []),
    (r'absorbant|ruine', 'états absorbants', [], []),
    (r'binomiale', 'loi binomiale', ['p-variables'], []),
    (r'dé |pièce|lance', 'dés et pièces', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
