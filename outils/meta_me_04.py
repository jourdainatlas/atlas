"""Métadonnées proposées pour la feuille Maths expertes, chapitre 4 (congruences)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'\\equiv|congru|modulo', 'congruences', ['z-zn'], ['anneau-zn']),
    (r'reste|division euclidienne', 'division euclidienne', ['z-division'], ['division-euclidienne']),
    (r'divisible|divis', 'divisibilité', ['z-division'], []),
    (r'chiffre|critère', 'chiffres et critères de divisibilité', [], []),
    (r'tableau', 'tableaux de congruences', ['z-zn'], []),
    (r'équation', 'équations', [], []),
    (r'fermat', 'petit théorème de Fermat', ['z-zn', 'z-premiers'], ['nombre-premier']),
    (r'premier', 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'suite', 'suites', [], []),
    (r'sunzi|restes chinois|système de', 'restes chinois', ['z-zn'], []),
    (r'poulet|carmicha', 'pseudo-premiers', ['z-premiers'], []),
    (r'isbn|chiffrement|chiffrer|clé', 'codage et cryptographie', ['z-zn'], []),
    (r'wilson|inverse modulo|carré modulo', 'arithmétique modulo p', ['z-zn'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {7: (['chiffre des unités'], ['z-zn'], ['anneau-zn'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
