"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 7 (Transformation de Fourier sur L¹)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 7, 'transformée et convolution', ['fo-transformee'], ['transformee-fourier', 'produit-convolution']),
           (8, 12, "formule d'inversion", ['fo-inversion', 'fo-transformee'], ['transformee-fourier'])]
R = [('Poisson', 'formule de Poisson', ['fo-inversion'], []),
     ('Wiener', 'algèbre de Wiener', ['fo-transformee'], ['transformee-fourier'])]
FOND = ['fo-transformee']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
