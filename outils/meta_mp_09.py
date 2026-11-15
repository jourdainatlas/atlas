"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 9 (séries entières)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 7, 'rayon de convergence', ['cx-series-entieres'], ['serie-entiere']),
    (8, 11, 'calcul de sommes', ['cx-series-entieres', 'as-usuels'], ['serie-entiere']),
    (12, 16, 'exponentielle complexe', ['cx-exponentielle'], []),
    (17, 26, 'régularité de la somme', ['cx-derivation-series'], []),
    (27, 38, 'développements en série entière', ['as-usuels', 'de-taylor'], ['polynome-taylor']),
    (39, 44, 'séries génératrices', ['cx-series-entieres'], []),
    (45, 51, 'synthèse', [], []),
]
R = [
    (r'rayon', 'rayon de convergence', ['cx-series-entieres'], ['serie-entiere']),
    (r'alembert', 'règle de d\'Alembert', ['c-dalembert'], []),
    (r'\\exp|\\ee\^|exponentielle', 'exponentielle', ['cx-exponentielle'], []),
    (r'dériv|terme à terme|\\int', 'dérivation et intégration terme à terme', ['cx-derivation-series'], []),
    (r'développable|développement', 'développements usuels', ['as-usuels'], []),
    (r'taylor', 'série de Taylor', ['de-taylor'], ['polynome-taylor']),
    (r'équation différentielle|y\'\'|y\'', 'équation différentielle', ['cx-derivation-series'], []),
    (r'abel', 'théorème d\'Abel', ['cx-series-entieres'], []),
    (r'dénombr|nombre de|génératrice|catalan|partitions|bell|dérangement', 'séries génératrices', ['cx-series-entieres'], []),
    (r'produit de cauchy', 'produit de Cauchy', ['cx-series-entieres'], []),
]
FOND = ['cx-series-entieres']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
