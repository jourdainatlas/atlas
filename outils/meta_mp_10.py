"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 10 (espaces préhilbertiens)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 8, 'produits scalaires', ['me-produit-scalaire'], ['produit-scalaire']),
    (9, 19, 'orthogonalité', ['fq-orthogonalite'], ['famille-orthonormee']),
    (20, 29, 'projection orthogonale', ['f-hilbert'], ['projection-orthogonale']),
    (30, 32, 'suites totales', ['f-bases-hilbertiennes'], ['famille-orthonormee']),
    (33, 38, 'polynômes orthogonaux', ['f-bases-hilbertiennes'], []),
    (39, 45, 'espaces hermitiens', ['f-autoadjoints', 'f-spectral-fini'], ['operateur-autoadjoint']),
    (46, 52, 'synthèse', [], []),
]
R = [
    (r'cauchy-schwarz|cauchy–schwarz', 'Cauchy-Schwarz', ['me-produit-scalaire'], []),
    (r'parallélogramme|polarisation', 'identités de polarisation', ['me-produit-scalaire'], ['identite-parallelogramme']),
    (r'gram', 'Gram-Schmidt et matrice de Gram', ['fq-orthogonalite'], ['famille-orthonormee']),
    (r'projet|projection|distance', 'projection orthogonale', ['f-hilbert'], ['projection-orthogonale']),
    (r'bessel|totale', 'suites totales', ['f-bases-hilbertiennes'], []),
    (r'legendre|tchebychev|hermite|laguerre|rodrigues', 'polynômes orthogonaux', ['f-bases-hilbertiennes'], []),
    (r'hermitien|unitaire|normal|autoadjoint', 'endomorphismes hermitiens', ['f-autoadjoints'], ['operateur-autoadjoint']),
    (r'spectral', 'théorème spectral', ['f-spectral-fini'], []),
    (r'\\int', 'produits scalaires intégraux', ['ri-integrable'], []),
]
FOND = ['me-produit-scalaire']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
