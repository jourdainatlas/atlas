"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 13 (convergence dominée et intégrales à paramètre)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'convergence dominée', ['m-convergence-dominee'], ['fonction-dominee']),
    (11, 17, 'intégration terme à terme', ['m-convergence-dominee'], []),
    (18, 24, 'continuité d\'une intégrale à paramètre', ['gd-schwarz'], []),
    (25, 34, 'dérivation d\'une intégrale à paramètre', ['gd-schwarz', 'ds-parametre'], []),
    (35, 38, 'fonction Gamma', ['ri-integrable'], []),
    (39, 43, 'synthèse', [], []),
]
R = [
    (r'domin', 'domination', ['m-convergence-dominee'], ['fonction-dominee']),
    (r'\\sum|série|terme à terme', 'intégration terme à terme', ['m-convergence-dominee', 'as-series'], []),
    (r'continu', 'continuité sous l\'intégrale', ['gd-schwarz'], []),
    (r'dérivable|classe|\\Cc|dériv', 'dérivation sous l\'intégrale', ['gd-schwarz'], []),
    (r'\\Gamma|Gamma', 'fonction Gamma', ['ri-integrable'], []),
    (r'\\sim|équivalent', 'équivalents', ['ar-asymptotique'], []),
    (r'Fourier|transformée', 'transformée de Fourier', ['fo-transformee'], []),
]
FOND = ['m-convergence-dominee']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
