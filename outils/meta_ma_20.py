"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 20 (séries et familles sommables)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 6, 'séries numériques', ['as-series'], []),
    (7, 29, 'séries à termes positifs', ['as-series'], []),
    (30, 34, 'convergence absolue', ['as-series'], ['serie-absolument-convergente']),
    (35, 44, 'séries alternées', ['as-series'], []),
    (45, 51, 'familles sommables positives', ['q-denombrable', 'as-series'], ['denombrable']),
    (52, 55, 'familles sommables complexes', ['q-denombrable', 'as-series'], ['serie-absolument-convergente']),
]
R = [
    (r'riemann|\\frac\{1\}\{n\^\{\\alpha', 'séries de Riemann', ['as-series'], []),
    (r'géométrique', 'séries géométriques', ['as-series'], []),
    (r'télescop|u_\{n\+1\} - u_\{n\}|v_\{n\+1\} - v_\{n\}', 'séries télescopiques', ['as-series'], []),
    (r'\\sim|équivalent', 'comparaison par équivalents', ['as-series', 'as-comparaison'], []),
    (r'\\int|intégrale', 'comparaison série-intégrale', ['as-series', 'ri-proprietes'], []),
    (r'altern|\(-1\)\^\{n', 'séries alternées', ['as-series'], []),
    (r'absolument', 'convergence absolue', ['as-series'], ['serie-absolument-convergente']),
    (r'sommable|paquets|fubini|\\ell\^\{1\}|\\lun', 'familles sommables', ['q-denombrable'], ['denombrable']),
    (r'produit de cauchy', 'produit de Cauchy', ['as-series', 'ex-serie'], []),
    (r'\\frac\{[a-z0-9^{}]*\}\{n!\}|exponentielle|\\ee\^', 'série exponentielle', ['ex-serie'], []),
    (r'euler|stirling|\\ln\(n!\)', 'constante d\'Euler et Stirling', ['as-series', 'as-dl'], []),
    (r'développement limité|\\dl|o\\big', 'développements asymptotiques', ['as-dl'], []),
    (r'zeta|\\zeta', 'fonction zêta', ['as-series'], []),
]
FOND = ['as-series']
EXTRA = {
    61: (['équations fonctionnelles', 'séries de fonctions'], ['as-series', 'c-sequentielle'], []),
    62: (['indicatrice d\'Euler', 'sommation par paquets'], ['q-denombrable', 'z-premiers'], ['denombrable']),
    63: (['interversion limite-somme', 'familles sommables'], ['q-denombrable', 'as-series'], []),
    64: (['fonctions préservant la convergence'], ['as-series'], []),
}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
