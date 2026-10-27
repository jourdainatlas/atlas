"""Métadonnées proposées pour la feuille Maths approfondies, chapitre 03 (groupes)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'loi de composition interne|internité|\\ast y', 'lois de composition interne', ['a-loi'], ['loi-composition']),
    (r'commutati|associati', 'commutativité et associativité', ['a-loi'], []),
    (r'neutre', 'élément neutre', ['a-monoide'], ['element-neutre']),
    (r'symétri|inverse|\^\{-1\}', 'symétrique', ['a-monoide'], ['inversible']),
    (r'cayley', 'tables de Cayley', ['a-loi'], []),
    (r'groupe', 'groupes', ['a-groupe'], ['groupe']),
    (r'abélien', 'groupes abéliens', ['a-groupe'], []),
    (r'bijections de|\\mathcal\{s\}|permutation', 'groupe symétrique', ['a-groupe'], ['groupe-symetrique']),
    (r'groupe produit|\\z \\times \\z|\\times \\r\^\{\*\}', 'groupe produit', ['a-groupe'], []),
    (r'sous-groupe', 'sous-groupes', ['a-sous-groupe'], ['sous-groupe']),
    (r'n\\z|2\\z', 'sous-groupes de Z', ['z-ideaux'], []),
    (r'\\mathbb\{u\}', 'racines de l\'unité', ['a-sous-groupe'], []),
]

EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
