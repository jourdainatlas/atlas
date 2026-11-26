"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie différentielle, chapitre 2 (Sous-variétés de R^n)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'immersions et submersions', ['gd-submersions', 'gd-sous-varietes'], ['submersion', 'sous-variete']),
           (4, 9, 'sous-variétés', ['gd-sous-varietes', 'gd-tangent-sm'], ['sous-variete', 'espace-tangent-sv']),
           (10, 14, 'sous-variétés', ['gd-sous-varietes', 'gd-tangent-sm'], ['sous-variete', 'plan-tangent']),
           (15, 16, 'groupes de matrices', ['gd-sous-varietes', 'gd-inversion-locale'], ['sous-variete', 'espace-tangent-sv']),
           (17, 20, 'extrema liés', ['cdiff-lagrange', 'gd-tangent-sm'], ['espace-tangent-sv'])]
R = [('plan tangent', 'plan tangent', ['gd-tangent-sm'], ['plan-tangent']),
     ('exponentielle', 'exponentielle de matrices', ['gd-inversion-locale'], [])]
FOND = ['gd-sous-varietes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
