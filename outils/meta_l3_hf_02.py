"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 2 (Espaces de Hilbert, théorème de projection)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 2, 'espaces de Hilbert', ['f-hilbert'], ['espace-hilbert', 'espace-l2-suites']),
           (3, 6, 'projection sur un convexe fermé', ['f-hilbert'], ['espace-hilbert', 'projection-orthogonale']),
           (7, 11, 'projection orthogonale', ['f-hilbert'], ['projection-orthogonale', 'orthogonal-partie'])]
R = [('c_\\{00\\}', 'suites à support fini', ['f-hilbert'], ['orthogonal-partie'])]
FOND = ['f-hilbert']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
