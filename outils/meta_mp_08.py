"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 8 (suites et séries de fonctions)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, 'normes uniformes', ['fc-uniforme'], ['convergence-uniforme']),
    (5, 12, 'convergence simple et uniforme', ['fc-uniforme'], ['convergence-simple', 'convergence-uniforme']),
    (13, 15, 'double limite', ['fc-uniforme'], ['convergence-uniforme']),
    (16, 22, 'intégration et dérivation', ['fc-uniforme', 'ri-integrable'], ['convergence-uniforme']),
    (23, 31, 'modes de convergence des séries', ['cx-convergence-uniforme', 'as-series'], ['convergence-uniforme']),
    (32, 43, 'fonctions définies par une série', ['cx-convergence-uniforme'], []),
    (44, 50, 'approximation uniforme', ['fc-weierstrass'], []),
    (51, 58, 'synthèse', [], []),
]
R = [
    (r'simplement', 'convergence simple', ['fc-uniforme'], ['convergence-simple']),
    (r'uniform', 'convergence uniforme', ['fc-uniforme'], ['convergence-uniforme']),
    (r'normale', 'convergence normale', ['cx-convergence-uniforme'], []),
    (r'tout segment', 'convergence sur tout segment', ['fc-uniforme'], ['convergence-uniforme-compact']),
    (r'\\int|intégr', 'intégration', ['ri-integrable'], []),
    (r'dériv|classe', 'dérivation', ['de-derivee'], []),
    (r'\\zeta|zêta', 'fonction zêta', ['as-series'], []),
    (r'weierstrass|polynomiale|polynômes', 'théorème de Weierstrass', ['fc-weierstrass'], []),
    (r'escalier', 'fonctions en escalier', ['ri-integrable'], []),
    (r'\\sim|équivalent', 'équivalents', ['as-series'], []),
]
FOND = ['fc-uniforme']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
