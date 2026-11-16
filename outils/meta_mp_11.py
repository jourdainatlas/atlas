"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 11 (séries de Fourier)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'coefficients de Fourier', ['fo-coefficients'], []),
    (11, 18, 'Bessel et Parseval', ['fo-parseval', 'fo-fejer'], ['famille-orthonormee']),
    (19, 23, 'théorème de Dirichlet', ['fo-dirichlet'], []),
    (24, 28, 'convergence normale', ['fo-coefficients', 'fc-uniforme'], ['convergence-uniforme']),
    (29, 34, 'synthèse', [], []),
]
R = [
    (r'parseval', 'égalité de Parseval', ['fo-parseval'], []),
    (r'bessel', 'inégalité de Bessel', ['fo-parseval'], []),
    (r'fejér|fejer', 'théorème de Fejér', ['fo-fejer'], []),
    (r'dirichlet', 'théorème de Dirichlet', ['fo-dirichlet'], []),
    (r'riemann-lebesgue', 'lemme de Riemann-Lebesgue', ['fo-dirichlet'], []),
    (r'normalement|uniform', 'convergence uniforme', ['fc-uniforme'], ['convergence-uniforme']),
    (r'\\sum|somme', 'sommes de séries', ['as-series'], []),
    (r'équation différentielle|y\'\'', 'équations différentielles', ['fo-coefficients'], []),
]
FOND = ['fo-coefficients']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
