"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 16 (équations différentielles linéaires)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 6, 'généralités', ['ed-lineaires'], ['equation-differentielle']),
    (7, 12, 'théorème de Cauchy linéaire', ['ed-lineaires', 'ed-cauchy-lipschitz'], ['solution-edo']),
    (13, 16, 'exponentielle de matrice', ['ed-lineaires'], ['exponentielle-matrice']),
    (17, 25, 'systèmes à coefficients constants', ['ed-lineaires'], ['systeme-lineaire-edo']),
    (26, 36, 'second ordre', ['ed-lineaires'], ['equation-differentielle']),
    (37, 42, 'séries entières', ['cx-series-entieres', 'ed-lineaires'], ['serie-entiere']),
    (43, 47, 'synthèse', [], []),
]
R = [
    (r'\\exp\(|exponentielle|\\e\^\{t?A', 'exponentielle de matrice', ['ed-lineaires'], ['exponentielle-matrice']),
    (r'wronskien', 'wronskien', ['ed-lineaires'], []),
    (r'variation des constantes', 'variation des constantes', ['ed-lineaires'], []),
    (r'série entière|développable', 'solutions développables en série entière', ['cx-series-entieres'], ['serie-entiere']),
    (r'diagonalis|valeurs? propres?|trigonalis', 'réduction', ['rd-diagonalisable'], []),
    (r'système', 'système différentiel', ['ed-lineaires'], ['systeme-lineaire-edo']),
    (r'raccord', 'raccordement', ['ed-lineaires'], []),
]
FOND = ['ed-lineaires']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
