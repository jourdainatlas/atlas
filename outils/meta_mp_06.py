"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 6 (séries et fonctions à valeurs vectorielles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 8, 'séries numériques', ['as-series'], []),
    (9, 19, 'séries vectorielles', ['as-series', 'f-evn'], ['serie-absolument-convergente']),
    (20, 34, 'compléments sur les séries', ['as-series'], []),
    (35, 39, 'dérivation vectorielle', ['de-derivee'], ['derivable']),
    (40, 46, 'intégration et Taylor', ['ri-integrable', 'de-taylor'], ['polynome-taylor']),
    (47, 58, 'synthèse', [], []),
]
R = [
    (r'absolument convergente|convergence absolue', 'convergence absolue', ['as-series'], ['serie-absolument-convergente']),
    (r'\\exp|exponentielle', 'exponentielle', ['li-exponentielle'], ['exponentielle-matrice']),
    (r'matrice|\\mn', 'séries de matrices', ['li-exponentielle'], []),
    (r'riemann|\\frac\{1\}\{n\^', 'séries de Riemann', ['as-series'], ['serie-riemann']),
    (r'intégrale|\\int', 'comparaison série-intégrale', ['ri-integrable'], []),
    (r'alembert', 'règle de d\'Alembert', ['as-dalembert-cauchy'], ['regle-dalembert']),
    (r'\\sim|équivalent|asymptotique|o\(', 'relations de comparaison', ['as-series'], []),
    (r'dériv|vitesse|tangente', 'dérivation', ['de-derivee'], ['derivable']),
    (r'accroissements finis', 'accroissements finis', ['gd-accroissements'], []),
    (r'taylor', 'formules de Taylor', ['de-taylor'], ['polynome-taylor']),
    (r'leibniz|bilinéaire', 'formule de Leibniz', ['de-derivee'], []),
]
FOND = ['as-series']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
