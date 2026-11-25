"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 8 (Transformation de Fourier sur L², compléments)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 2, 'formule de Plancherel', ['fo-plancherel'], ['transformee-fourier']),
           (3, 6, 'convolution dans L²', ['fo-plancherel', 'f-hilbert'], ['produit-convolution', 'transformee-fourier']),
           (7, 7, "principe d'incertitude", ['fo-plancherel'], ['transformee-fourier'])]
R = [('projection orthogonale', 'projection orthogonale', ['f-hilbert'], ['projection-orthogonale'])]
FOND = ['fo-plancherel']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
