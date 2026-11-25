"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 5 (Séries de Fourier dans L²)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 10, 'coefficients de Fourier', ['fo-coefficients', 'fo-parseval'], ['base-hilbertienne']),
           (11, 12, 'inégalités', ['fo-parseval'], []),
           (13, 16, 'densité', ['fo-densite', 'f-bases-hilbertiennes'], ['base-hilbertienne'])]
R = [('f \\* g|convol', 'convolution', ['fo-coefficients'], ['produit-convolution']),
     ('Weyl|irrationnel', 'équirépartition', ['fo-densite'], [])]
FOND = ['fo-coefficients']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
