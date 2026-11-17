"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 17 (calcul différentiel et optimisation)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'différentielle', ['gd-differentielle'], ['differentiable', 'derivee-partielle']),
    (11, 18, 'opérations et règle de la chaîne', ['gd-differentielle'], ['matrice-jacobienne']),
    (19, 23, 'classe C1', ['gd-differentielle', 'gd-accroissements'], ['classe-ck']),
    (24, 32, 'optimisation au premier ordre', ['fq-points-critiques', 'el-lagrange'], ['point-critique']),
    (33, 46, 'ordre 2', ['gd-schwarz', 'fq-taylor-young', 'fq-extremums'], ['matrice-hessienne']),
    (47, 51, 'synthèse', [], []),
]
R = [
    (r'gradient|\\nabla', 'gradient', ['gd-differentielle'], ['gradient']),
    (r'jacobienne', 'matrice jacobienne', ['gd-differentielle'], ['matrice-jacobienne']),
    (r'hessienne', 'matrice hessienne', ['fq-taylor-young'], ['matrice-hessienne']),
    (r'extremum|maximum|minimum', 'extremums', ['fq-points-critiques'], ['extremum-local-rn']),
    (r'contrainte|Lagrange|liés?\b', 'extremums sous contrainte', ['el-lagrange'], ['extremum-lie']),
    (r'tangent', 'vecteurs tangents', ['el-niveau'], ['vecteur-tangent-niveau']),
    (r'Schwarz|dérivées partielles secondes', 'théorème de Schwarz', ['gd-schwarz'], []),
    (r'équation aux dérivées partielles|EDP|laplacien', 'équations aux dérivées partielles', ['gd-schwarz'], []),
    (r'accroissements finis|lipschitz', 'accroissements finis', ['gd-accroissements'], []),
]
FOND = ['gd-differentielle']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
