"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 6 (Convergence ponctuelle des séries de Fourier)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 8, 'théorème de Dirichlet', ['fo-dirichlet'], []),
           (9, 10, 'régularité', ['fo-dirichlet', 'fo-parseval'], []),
           (11, 13, 'sommes de Fejér', ['fo-fejer'], ['produit-convolution']),
           (14, 15, 'coefficients des fonctions intégrables', ['fo-coefficients'], [])]
R = [('Parseval', 'formule de Parseval', ['fo-parseval'], []),
     ('Gibbs', 'phénomène de Gibbs', ['fo-dirichlet'], [])]
FOND = ['fo-dirichlet']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
