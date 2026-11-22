"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 5 (Intégrales à paramètres)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'continuité, dérivabilité', ['m-convergence-dominee'], ['integrable-lebesgue']),
           (7, 16, 'calculs d\'intégrales', ['m-convergence-dominee'], ['integrable-lebesgue']),
           (17, 22, 'Fourier et Laplace', ['fo-transformee', 'm-convergence-dominee'], ['transformee-fourier'])]
R = [(r'Fourier|\\widehat', 'transformée de Fourier', ['fo-transformee'], ['transformee-fourier']),
     (r'Laplace|\\mathcal\{L\}', 'transformée de Laplace', ['m-convergence-dominee'], []),
     (r'holomorphe|série entière', 'holomorphie', ['cx-derivation-series'], []),
     (r'\\Gamma|\\zeta', 'fonctions Gamma et zêta', ['m-convergence-dominee'], []),
     (r'\\Delta u|harmonique|Dirichlet', 'problème de Dirichlet', ['gd-schwarz'], [])]
FOND = ['m-convergence-dominee']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
