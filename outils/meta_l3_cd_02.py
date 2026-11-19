"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 2 (Applications différentiables)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 12, 'différentiabilité', ['gd-differentielle'], ['differentiable']), (13, 16, 'variable réelle à valeurs vectorielles', ['gd-accroissements'], []), (17, 29, 'dérivées partielles et jacobienne', ['gd-differentielle'], ['derivee-partielle', 'matrice-jacobienne']), (30, 42, 'composition', ['gd-differentielle'], ['matrice-jacobienne']), (43, 52, 'accroissements finis', ['gd-accroissements'], []), (53, 56, 'classe C1', ['gd-classe-ck'], ['classe-ck']), (57, 58, 'synthèse', [], [])]
R = [('gradient|\\\\nabla|\\\\grad', 'gradient', ['gd-differentielle'], ['gradient']), ('jacobienne', 'matrice jacobienne', ['gd-differentielle'], ['matrice-jacobienne']), ('GL|inverse|\\^\\{-1\\}', 'inversion dans GL', ['gd-gl'], []), ('déterminant|\\\\det', 'déterminant', ['gd-differentielle'], []), ('lipschitz', 'applications lipschitziennes', ['gd-accroissements'], [])]
FOND = ['gd-differentielle']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
