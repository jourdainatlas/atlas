"""Métadonnées proposées pour la feuille Maths expertes, chapitre 1 (divisibilité et primalité)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'divis|multiple|diviseur', 'divisibilité', ['z-division'], []),
    (r'division euclidienne|reste|quotient', 'division euclidienne', ['z-division'], ['division-euclidienne']),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'premier|premiers|primalité', 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (r'décompos|facteurs premiers', 'décomposition en facteurs premiers', ['z-premiers'], ['nombre-premier']),
    (r'nombre de diviseurs|diviseurs positifs|\\sigma|d\(n\)', 'nombre et somme des diviseurs', ['z-premiers'], []),
    (r'pair|impair', 'parité', [], []),
    (r'carré', 'carrés', [], []),
    (r'chiffre|écriture décimale|critère', 'critères de divisibilité', [], []),
    (r'mersenne|fermat|parfait', 'nombres remarquables', ['z-premiers'], []),
    (r'irrationnel', 'irrationalité', ['q-irrationnel'], []),
    (r'infinité', 'infinité des nombres premiers', ['z-premiers'], []),
    (r'factoris|identité remarquable', 'factorisation', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {1: (['équations en entiers'], ['z-division'], []), 29: (['produit d\'entiers consécutifs'], ['z-anneau'], []), 39: (['puissances de 2'], ['z-premiers'], ['nombre-premier'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
