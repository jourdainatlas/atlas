"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 06 (primitives et équations différentielles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 9, 'primitives', ['ar-tfa'], ['riemann-integrable']),
    (10, 26, 'calcul de primitives et d\'intégrales', ['ar-tfa'], []),
    (27, 36, 'équations du premier ordre', ['ed-lineaires'], ['equation-differentielle']),
    (37, 47, 'équations du second ordre', ['ed-lineaires'], ['equation-differentielle']),
]
R = [
    (r'primitive', 'primitives', ['ar-tfa'], []),
    (r'\\int', 'intégrales', ['ar-riemann', 'ri-proprietes'], ['riemann-integrable']),
    (r'par parties', 'intégration par parties', ['ar-tfa'], []),
    (r'changement de variable', 'changement de variable', ['ar-tfa'], []),
    (r'\\cos|\\sin|linéaris', 'primitives trigonométriques', ['cx-exponentielle'], []),
    (r'ax\^\{2\}|x\^\{2\} \+|fraction|arctan', 'fractions rationnelles', [], []),
    (r'y\'|équation différentielle', 'équations différentielles', ['ed-lineaires'], ['equation-differentielle']),
    (r'y\'\'', 'second ordre', ['ed-lineaires'], []),
    (r'caractéristique', 'équation caractéristique', ['ed-lineaires'], []),
    (r'variation de la constante', 'variation de la constante', ['ed-lineaires'], []),
    (r'raccord|recoll', 'raccordement', ['ed-lineaires'], []),
    (r'y\(0\)|condition initiale|cauchy', 'problème de Cauchy', ['ed-cauchy-lipschitz'], []),
    (r'\\lim|limite|suite', 'limites', ['ar-suites'], []),
    (r'équation fonctionnelle|toutes les fonctions', 'équations fonctionnelles', [], []),
]
FOND = ['ar-tfa']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
