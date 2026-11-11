"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 19 (espaces préhilbertiens réels)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 3, 'produit scalaire', ['me-produit-scalaire'], ['produit-scalaire']),
    (4, 11, 'inégalité de Cauchy-Schwarz', ['me-produit-scalaire'], ['norme']),
    (12, 18, 'orthogonalité', ['fq-orthogonalite'], ['vecteurs-orthogonaux']),
    (19, 27, 'bases orthonormées', ['fq-bases-orthogonales'], ['base-orthogonale']),
    (28, 48, 'projection orthogonale', ['fq-orthogonalite', 'f-hilbert'], ['projection-orthogonale']),
]
R = [
    (r'produit scalaire|\\ps|\\langle', 'produits scalaires', ['me-produit-scalaire'], ['produit-scalaire']),
    (r'cauchy-schwarz|cauchy--schwarz', 'inégalité de Cauchy-Schwarz', ['me-produit-scalaire'], []),
    (r'\\norme|norme|\\lvert', 'normes', ['me-produit-scalaire'], ['norme']),
    (r'orthogonal|\\perp', 'orthogonalité', ['fq-orthogonalite'], ['vecteurs-orthogonaux']),
    (r'orthonormée|gram-schmidt|orthonormalis', 'bases orthonormées', ['fq-bases-orthogonales'], ['base-orthogonale']),
    (r'projection|projeté|distance', 'projection orthogonale', ['fq-orthogonalite'], ['projection-orthogonale']),
    (r'moindres carrés|équations normales', 'moindres carrés', ['fq-orthogonalite'], []),
    (r'\\int|intégral', 'produits scalaires intégraux', ['ri-proprietes'], []),
    (r'polynôme|legendre|\\mathbb\{r\}_\{n\}\[x\]|\\knx', 'polynômes orthogonaux', ['pol-anneau'], []),
    (r'matrice|\\mn\b|\\tra\b', 'matrices et produit scalaire', ['v-matrices'], []),
    (r'gram\b|matrice de gram|\\det', 'matrices de Gram', ['v-det-matrice'], []),
    (r'bessel|parseval|fourier|\\cos\(kt|trigonom', 'familles trigonométriques', ['fq-bases-orthogonales'], []),
    (r'forme linéaire|hyperplan|riesz', 'formes linéaires', ['v-dual'], ['forme-lineaire']),
]
FOND = ['me-produit-scalaire']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
