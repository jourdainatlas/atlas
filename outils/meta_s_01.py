"""Métadonnées proposées pour la feuille de Seconde, chapitre 1 (nombres et calculs)."""
from meta_commun import types_exercice, appliquer

R = [
    ('fraction|irréductible|\\\\dfrac|\\\\frac', 'fractions', ['q-construction'], ['ensemble-rationnels']),
    ('premier|décompos|diviseur', 'nombres premiers et décomposition', ['z-premiers'], ['nombre-premier']),
    ('puissance|\\^\\{-|\\^\\{[0-9]', 'puissances', ['n-operations'], []),
    ('scientifique|10\\^', 'écriture scientifique', [], []),
    ('sqrt|racine', 'racines carrées', ['c-racine-reelle'], []),
    ('irrationnel|mathbb\\{q\\}|rationnel', 'rationnels et irrationnels', ['q-irrationnel'], ['ensemble-rationnels']),
    ('mathbb\\{n\\}|mathbb\\{z\\}|mathbb\\{d\\}|mathbb\\{r\\}|ensemble', 'ensembles de nombres', ['r'], ['ensemble-reels']),
    ('périodique|0\\{,\\}777|\\\\ldots', 'écriture décimale périodique', ['q'], []),
    ('intervalle|droite graduée|\\\\cap|\\\\cup', 'intervalles', ['ar-corps'], ['intervalle']),
    ('encadr', 'encadrement', ['q-ordre'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
