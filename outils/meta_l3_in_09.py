"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 9 (Convolution, régularisation)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 8, 'existence et calcul de convolées', ['ds-regularisation'], ['produit-convolution', 'localement-integrable']),
           (9, 14, 'régularité et support d\'une convolée', ['ds-regularisation'], ['produit-convolution', 'support-fonction']),
           (15, 21, 'densité, approximations de l\'unité', ['ds-regularisation', 'lp-densite'], ['noyau-regularisant', 'espace-Lp']),
           (22, 25, 'applications de la convolution', ['ds-regularisation', 'fo-densite'], ['produit-convolution']),
           (26, 28, 'convolution sur le cercle', ['fo-parseval', 'fc-weierstrass'], ['produit-convolution'])]
R = [(r'Fourier|\\widehat', 'transformée de Fourier', ['fo-densite'], ['transformee-fourier']),
     (r'Weierstrass|polyn[ôo]m', 'théorème de Weierstrass', ['fc-weierstrass'], []),
     (r'Parseval|Fejér|Fejer', 'séries de Fourier', ['fo-parseval'], []),
     (r'L\^\{?p', 'espaces L^p', ['lp-densite'], ['espace-Lp'])]
FOND = ['ds-regularisation']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
