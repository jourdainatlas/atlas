"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 4 (Fonctions intégrables, convergence dominée)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 8, 'fonctions intégrables', ['m-integrables'], ['integrable-lebesgue']),
           (9, 25, 'convergence dominée', ['m-convergence-dominee'], ['integrable-lebesgue']),
           (26, 30, 'Riemann et Lebesgue', ['m-riemann'], ['riemann-integrable'])]
R = [(r'\\Gamma|Euler', 'fonction Gamma', ['m-convergence-dominee'], []),
     (r'Riemann', 'intégrale de Riemann', ['m-riemann'], ['riemann-integrable']),
     (r'Jensen|convexe', 'inégalité de Jensen', ['m-integrables'], [])]
FOND = ['m-convergence-dominee']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
