"""Métadonnées proposées pour la feuille Licence 3, UE Espaces de Hilbert et séries de Fourier, chapitre 3 (Bases hilbertiennes, formule de Parseval)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 4, 'inégalité de Bessel', ['f-bases-hilbertiennes'], ['famille-orthonormee', 'espace-l2-suites']),
           (5, 6, 'bases hilbertiennes', ['f-bases-hilbertiennes'], ['base-hilbertienne', 'espace-separable']),
           (7, 8, 'polynômes orthogonaux', ['f-bases-hilbertiennes'], ['base-hilbertienne', 'famille-orthonormee'])]
R = [('Parseval', 'formule de Parseval', ['f-bases-hilbertiennes'], ['base-hilbertienne']),
     ('s[ée]parable', 'espace séparable', ['f-bases-hilbertiennes'], ['espace-separable'])]
FOND = ['f-bases-hilbertiennes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
