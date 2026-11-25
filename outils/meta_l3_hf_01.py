"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 1 (Espaces préhilbertiens)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'produits scalaires et inégalités', ['f-hilbert'], ['produit-scalaire', 'norme', 'identite-parallelogramme']),
           (6, 10, 'orthonormalisation et projection', ['f-hilbert'], ['famille-orthonormee', 'projection-orthogonale', 'vecteurs-orthogonaux']),
           (11, 11, 'espace non complet', ['f-hilbert', 'f-evn'], ['espace-complet', 'produit-scalaire'])]
R = [('Gram', 'matrice de Gram', ['f-hilbert'], ['produit-scalaire']),
     ('Legendre|Laguerre', 'polynômes orthogonaux', ['f-hilbert'], ['famille-orthonormee'])]
FOND = ['f-hilbert']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
