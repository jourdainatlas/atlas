"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 12 (intégrales généralisées)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 5, 'intégrales généralisées', ['ri-integrable'], ['integrale-convergente']),
    (6, 11, 'fonctions intégrables', ['ri-integrable'], ['integrale-convergente']),
    (12, 20, 'calcul des intégrales', ['ri-proprietes'], []),
    (21, 30, 'relations de comparaison', ['ar-asymptotique'], []),
    (31, 37, 'produits scalaires intégraux', ['me-produit-scalaire'], ['produit-scalaire']),
    (38, 43, 'synthèse', [], []),
]
R = [
    (r'converge|convergente|diverge', 'nature d\'une intégrale', ['ri-integrable'], ['integrale-convergente']),
    (r'intégrable', 'intégrabilité', ['ri-integrable'], ['integrale-convergente']),
    (r'par parties', 'intégration par parties', ['ri-proprietes'], []),
    (r'changement de variable', 'changement de variable', ['ri-proprietes'], []),
    (r'\\sim|équivalent|o\(|négligeable', 'relations de comparaison', ['ar-asymptotique'], []),
    (r'\\gamma|gamma|wallis|gauss', 'intégrales classiques', ['ri-proprietes'], []),
    (r'\\sum|série', 'séries et intégrales', ['as-series'], []),
    (r'produit scalaire|orthogon', 'produits scalaires intégraux', ['me-produit-scalaire'], ['produit-scalaire']),
]
FOND = ['ri-integrable']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
