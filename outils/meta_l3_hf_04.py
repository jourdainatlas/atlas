"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 4 (Dualité, adjoint, théorème ergodique)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'théorème de Riesz', ['f-riesz'], ['forme-lineaire', 'dual-topologique', 'norme-operateur']),
           (6, 15, 'adjoint', ['f-operateurs', 'f-riesz'], ['norme-operateur', 'espace-hilbert']),
           (16, 18, 'opérateurs de Hilbert-Schmidt', ['f-operateurs', 'f-bases-hilbertiennes'], ['norme-operateur', 'base-hilbertienne'])]
R = [('ergodique', 'théorème ergodique', ['f-operateurs'], []),
     ('projecteur|projection orthogonale', 'projection orthogonale', ['f-hilbert'], ['projection-orthogonale'])]
FOND = ['f-operateurs']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
