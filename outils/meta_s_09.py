"""Métadonnées proposées pour la feuille de Seconde, chapitre 9 (inéquations)."""
from meta_commun import types_exercice, appliquer

R = [
    ('inéquation|inégalit|\\\\leqslant|\\\\geqslant', 'inéquations', ['q-ordre'], ['corps-ordonne']),
    ('encadr', 'encadrement', ['q-ordre'], ['intervalle']),
    ('affine|racine|signe', 'signe des fonctions affines', ['ar-corps'], []),
    ('tableau de signes|produit|\\)\\(', 'inéquation produit', ['ar-corps'], []),
    ('quotient|\\\\dfrac\\{', 'inéquation quotient', ['ar-corps'], []),
    ('position relative|au-dessus|en dessous|courbe', 'position relative de courbes', [], []),
    ('formule|séance|euro|prix|aire|note', 'mise en inéquation', ['q-ordre'], []),
    ('intervalle', 'intervalles', [], ['intervalle']),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
