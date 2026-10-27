"""Métadonnées proposées pour la feuille de Première spécialité, « sommes de termes d'une suite géométrique »."""
from meta_commun import types_exercice, appliquer

R = [
    (r'somme|\\sum|\+ ?\\cdots ?\+|\+ ?\\dots ?\+', 'sommes de termes', ['n-sommes'], []),
    (r'géométrique|raison|q\^', 'suite géométrique', ['ar-suites'], ['suite']),
    (r'puissance|\^\{', 'puissances', ['n-operations'], []),
    (r'arithmétique', 'comparaison avec une suite arithmétique', ['ar-suites'], []),
    (r'pourcentage|%|salaire|contrat', 'évolution en pourcentage', [], []),
    (r'aire|carré|rebond|balle|échiquier|grain', 'modélisation', [], []),
    (r'plus petit entier|seuil|dépasse', 'seuil', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {7: (['sommes de termes', 'suite géométrique'], ['n-sommes', 'ar-suites'], ['suite']), 8: (['suite géométrique', 'suite arithmétique', 'sommes de termes'], ['ar-suites', 'n-sommes'], ['suite'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
