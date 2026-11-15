"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 7 (endomorphismes des espaces euclidiens)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'adjoint', ['me-produit-scalaire', 'f-autoadjoints'], []),
    (11, 24, 'isométries', ['fq-orthogonalite'], ['matrice-orthogonale', 'groupe-orthogonal']),
    (25, 27, 'isométries du plan', ['fq-orthogonalite'], ['matrice-orthogonale']),
    (28, 37, 'réduction des isométries', ['fq-orthogonalite', 'rd-diagonalisable'], ['matrice-orthogonale']),
    (38, 49, 'théorème spectral', ['f-spectral-fini'], ['matrice-symetrique', 'operateur-autoadjoint']),
    (50, 57, 'autoadjoints positifs', ['f-spectral-fini', 'f-autoadjoints'], ['operateur-autoadjoint']),
    (58, 67, 'synthèse', [], []),
]
R = [
    (r'adjoint|u\^\{\*\}', 'adjoint', ['f-autoadjoints'], []),
    (r'orthogonale?s?\b|\\or\(|o_\{?n|isométrie', 'isométries', ['fq-orthogonalite'], ['matrice-orthogonale']),
    (r'rotation|angle|\\so\(|so_', 'rotations', ['fq-orthogonalite'], ['groupe-orthogonal']),
    (r'réflexion|symétrie orthogonale', 'réflexions', ['fq-orthogonalite'], []),
    (r'projecteur orthogonal|projection orthogonale|projeté', 'projection orthogonale', ['fq-orthogonalite'], ['projection-orthogonale']),
    (r'autoadjoint|symétrique', 'autoadjoints', ['f-autoadjoints'], ['operateur-autoadjoint']),
    (r'spectral|diagonalis', 'théorème spectral', ['f-spectral-fini'], ['matrice-symetrique']),
    (r'positi', 'positivité', ['f-spectral-fini'], []),
    (r'rayleigh', 'quotient de Rayleigh', ['f-spectral-fini'], []),
    (r'produit mixte|orient', 'orientation', ['fq-orthogonalite'], ['orientation']),
    (r'antisymétrique', 'antisymétrie', ['f-autoadjoints'], []),
    (r'trace|\\trace', 'trace', ['v-trace'], []),
]
FOND = ['me-produit-scalaire']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
