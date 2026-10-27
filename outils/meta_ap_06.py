"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 06 (espaces vectoriels)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'espace vectoriel|espaces vectoriels', 'espaces vectoriels', ['v-espace'], ['espace-vectoriel']),
    (r'axiome|loi externe', 'axiomes', ['v-espace'], []),
    (r'sous-espace', 'sous-espaces vectoriels', ['v-espace'], ['sous-espace-vectoriel']),
    (r'\\vect', 'sous-espace engendré', ['v-combinaisons'], ['combinaison-lineaire']),
    (r'\\cap|\\cup|f\+g', 'opérations sur les sous-espaces', ['v-somme-directe'], []),
    (r'supplémentaire|somme directe|\\oplus', 'somme directe et supplémentaires', ['v-somme-directe'], ['supplementaire']),
    (r'libre|liée', 'familles libres', ['v-libre'], ['famille-libre']),
    (r'génératrice', 'familles génératrices', ['v-libre'], ['famille-generatrice']),
    (r'base', 'bases', ['v-libre'], ['base-vectorielle']),
    (r'suite|\\su\(', 'espaces de suites', ['v-espace'], []),
    (r'fonction|\\fc\(', 'espaces de fonctions', ['v-espace'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
