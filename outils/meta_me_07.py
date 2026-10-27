"""Métadonnées proposées pour la feuille Maths expertes, chapitre 7 (PGCD, Bézout, Gauss)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'pgcd', 'PGCD', ['z-bezout'], ['pgcd']),
    (r'euclide', "algorithme d'Euclide", ['z-bezout', 'z-division'], ['division-euclidienne']),
    (r'premiers entre eux|irréductible', 'entiers premiers entre eux', ['z-bezout'], []),
    (r'bézout|ax\s*\+\s*by|x\s*\+\s*\d+y|87x|38x|41x|221x|11u', 'théorème de Bézout', ['z-bezout', 'z-ideaux'], []),
    (r'gauss', 'théorème de Gauss', ['z-bezout'], []),
    (r'diophantienne|couples d.entiers|\\mathbb\{z\}\^\{2\}', 'équations diophantiennes', ['z-bezout'], []),
    (r'\\equiv|congru|modulo', 'congruences', ['z-zn'], ['anneau-zn']),
    (r'restes chinois', 'restes chinois', ['z-zn'], []),
    (r'ppcm', 'PPCM', ['z-bezout'], []),
    (r'fermat|nombres? premiers?(?! entre)|est premier\b|sont premiers\b(?! entre)', 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (r'rsa|chiffr|cod', 'cryptographie', ['z-zn'], []),
    (r'suite|fibonacci', 'suites', [], []),
    (r'irrationnel|racine rationnelle', 'irrationalité', ['q-irrationnel'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {5: (['PGCD', 'division euclidienne'], ['z-bezout', 'z-division'], ['pgcd']), 21: (['équations diophantiennes'], ['z-bezout'], []), 25: (['équations diophantiennes'], ['z-bezout'], [])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
